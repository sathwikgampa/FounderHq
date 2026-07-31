'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Mic, MicOff, Paperclip, Send, Command, Volume2, Square } from 'lucide-react';
import { toast } from 'sonner';
import { useVoice } from '@/hooks/use-voice';

const PROMPT_CHIPS = [
  'Analyze my runway',
  'Create hiring plan',
  'Generate pitch deck',
  'Review contracts',
  'Find growth opportunities',
];

export function AiCopilot() {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);

  const { isListening, isSpeaking, transcript, toggleListening, speak, stopSpeaking } = useVoice(
    (finalText) => {
      if (finalText) setQuery(finalText);
    }
  );

  useEffect(() => {
    if (transcript) setQuery(transcript);
  }, [transcript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsProcessing(true);
    const userPrompt = query;

    setTimeout(async () => {
      setIsProcessing(false);
      const responseText = `CEO Planner evaluated: "${userPrompt}". All 10 executive agents dispatched parallel tasks. Runway buffer remains healthy at 16 months.`;
      setLastResponse(responseText);
      toast.success(`CEO Planner processed: "${userPrompt}"`, { icon: '✨' });
      setQuery('');
      await speak(responseText);
    }, 1000);
  };

  return (
    <div id="copilot" className="w-full mb-8">
      <div className="relative max-w-4xl mx-auto space-y-3">
        <form
          onSubmit={handleSubmit}
          className="relative bg-white border border-[#ECECEC] rounded-[24px] p-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-3 z-10 transition-all hover:border-[#6C63FF]/30"
        >
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-xl bg-[#6C63FF]/10 border border-[#6C63FF]/20 flex items-center justify-center text-[#6C63FF] shrink-0">
              <Sparkles size={16} />
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isListening ? 'Listening to voice input...' : 'Ask FounderHQ anything...'}
              className="flex-1 bg-transparent text-sm text-[#111827] placeholder:text-[#6B7280] focus:outline-none"
            />

            <div className="flex items-center gap-2">
              {/* Voice Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2 rounded-xl transition-all ${
                  isListening
                    ? 'bg-rose-50 text-rose-600 border border-rose-200 animate-pulse'
                    : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#FAFAFB]'
                }`}
                title={isListening ? 'Stop Voice Recording' : 'Voice Input'}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>

              {/* Attachment Button */}
              <button
                type="button"
                onClick={() => toast.info('Document attachment scanner ready')}
                className="p-2 rounded-xl text-[#6B7280] hover:text-[#111827] hover:bg-[#FAFAFB] transition-colors"
                title="Attach file"
              >
                <Paperclip size={16} />
              </button>

              {/* Audio Playback Stop / Replay */}
              {isSpeaking ? (
                <button
                  type="button"
                  onClick={stopSpeaking}
                  className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 animate-pulse"
                  title="Stop AI Voice Playback"
                >
                  <Square size={14} />
                </button>
              ) : lastResponse ? (
                <button
                  type="button"
                  onClick={() => speak(lastResponse)}
                  className="p-2 rounded-xl text-[#6B7280] hover:text-[#6C63FF] hover:bg-[#FAFAFB] transition-colors"
                  title="Replay Voice Response"
                >
                  <Volume2 size={16} />
                </button>
              ) : null}

              {/* Command Badge */}
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#FAFAFB] text-[10px] text-[#6B7280] font-mono border border-[#ECECEC]">
                <Command size={10} /> K
              </kbd>

              {/* Send Button */}
              <button
                type="submit"
                disabled={isProcessing || !query.trim()}
                className="p-2.5 rounded-xl bg-[#6C63FF] hover:bg-[#5b52e0] text-white disabled:opacity-40 transition-all shadow-md shadow-[#6C63FF]/20"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </form>

        {/* 5 Suggestion Chips Below Command Bar */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar px-1 text-xs">
          {PROMPT_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setQuery(chip)}
              className="px-3.5 py-1.5 rounded-full bg-white border border-[#ECECEC] text-[#6B7280] hover:text-[#111827] hover:bg-[#FAFAFB] hover:border-[#6C63FF]/30 transition-all shrink-0 text-xs font-medium shadow-sm"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
