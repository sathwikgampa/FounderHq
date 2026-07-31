'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { speakText, stopSpeaking as stopSpeech, createSpeechRecognizer, transcribeAudioWithGroq } from '@/lib/speech';
import { toast } from 'sonner';

export function useVoice(onTranscriptFinal?: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const recognizerRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startListening = useCallback(() => {
    setTranscript('');
    setIsListening(true);

    // 1. Try Browser Web Speech Recognition for instant visual feedback
    const recognizer = createSpeechRecognizer(
      (text) => {
        setTranscript(text);
      },
      () => {
        setIsListening(false);
      },
      (err) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      }
    );

    if (recognizer) {
      recognizerRef.current = recognizer;
      try {
        recognizer.start();
        toast.info('Voice Assistant listening... Speak now!', { icon: '🎙️' });
      } catch (e) {
        console.warn('Speech recognition start failed:', e);
      }
    } else {
      toast.info('Voice input active. Recording audio...', { icon: '🎙️' });
    }

    // 2. Also record audio via MediaRecorder for Groq Whisper STT backup
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          audioChunksRef.current = [];

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };

          mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            if (audioBlob.size > 1000) {
              const groqText = await transcribeAudioWithGroq(audioBlob);
              if (groqText && groqText.trim()) {
                setTranscript(groqText);
                if (onTranscriptFinal) onTranscriptFinal(groqText);
              }
            }
            // Stop media stream tracks
            stream.getTracks().forEach((track) => track.stop());
          };

          mediaRecorder.start();
        })
        .catch((err) => {
          console.warn('Mic access denied:', err);
        });
    }
  }, [onTranscriptFinal]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    if (recognizerRef.current) {
      try {
        recognizerRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const speak = useCallback(async (text: string) => {
    setIsSpeaking(true);
    await speakText(text);
    setIsSpeaking(false);
  }, []);

  const stop = useCallback(() => {
    stopSpeech();
    setIsSpeaking(false);
  }, []);

  useEffect(() => {
    return () => {
      stopListening();
      stopSpeech();
    };
  }, [stopListening]);

  return {
    isListening,
    isSpeaking,
    transcript,
    startListening,
    stopListening,
    toggleListening,
    speak,
    stopSpeaking: stop,
  };
}
