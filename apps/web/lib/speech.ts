/**
 * Speech-to-Text (STT) and Text-to-Speech (TTS) Engine for FounderHQ
 * Powered by ElevenLabs TTS API + Groq Whisper STT API + Web Speech API fallback.
 */

const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || '';
const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';

// Default ElevenLabs Rachel Voice ID (Luxury SaaS executive voice)
const ELEVENLABS_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

let activeAudio: HTMLAudioElement | null = null;

/**
 * Text-To-Speech (TTS) via ElevenLabs with Web Speech API fallback
 */
export async function speakText(text: string): Promise<void> {
  if (!text) return;

  // Stop any currently playing audio
  if (activeAudio) {
    activeAudio.pause();
    activeAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  try {
    // Attempt ElevenLabs TTS API call
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          Accept: 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: text.slice(0, 500), // Cap length for fast latency
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      },
    );

    if (response.ok) {
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      activeAudio = audio;
      await audio.play();
      return;
    }
  } catch (err) {
    console.warn('ElevenLabs TTS failed, falling back to Web Speech Synthesis:', err);
  }

  // Fallback to browser Web Speech API Synthesis
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}

/**
 * Stop any active TTS audio playback
 */
export function stopSpeaking(): void {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Speech-To-Text (STT) via Groq Whisper API
 */
export async function transcribeAudioWithGroq(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.wav');
  formData.append('model', 'whisper-large-v3');

  try {
    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return data.text || '';
    }
  } catch (err) {
    console.error('Groq Whisper STT failed:', err);
  }
  return '';
}

/**
 * Browser Live SpeechRecognition interface helper
 */
export function createSpeechRecognizer(
  onResult: (text: string) => void,
  onEnd?: () => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: (err: any) => void,
) {
  if (typeof window === 'undefined') return null;

  const win = window as unknown as Record<string, any>;
  const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
  if (!SpeechRecognition) return null;

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onresult = (event: any) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    onResult(transcript);
  };

  if (onEnd) recognition.onend = onEnd;
  if (onError) recognition.onerror = onError;

  return recognition;
}
