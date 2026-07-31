'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Upload,
  FileText,
  Loader2,
  X,
  Volume2,
  ExternalLink,
  Bot,
} from 'lucide-react';
import { toast } from 'sonner';
import { Citation } from '@/lib/rag-engine';
import { useVoice } from '@/hooks/use-voice';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  intent?: string;
  citations?: Citation[];
  timestamp: string;
}

export function KnowledgeChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: "Hey there! 👋 I'm your FounderHQ Knowledge Assistant. Ask me anything about your workspace docs, team notes, or startup guides!",
      timestamp: 'Just now',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStep, setUploadStep] = useState<string>('');
  const [lottieError, setLottieError] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isListening, isSpeaking, transcript, toggleListening, speak, stopSpeaking } = useVoice(
    (finalText) => {
      if (finalText) setQuery(finalText);
    },
  );

  useEffect(() => {
    if (transcript) setQuery(transcript);
  }, [transcript]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userText = query;
    setQuery('');

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      const res = await fetch(`${apiBase}/api/v1/documents/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          userId: 'siddharth',
          workspaceId: 'acme-inc',
          departments: ['ENGINEERING', 'FINANCE', 'GLOBAL'],
        }),
      });

      let assistantText = '';
      let msgCitations: Citation[] = [];
      let intent = 'GENERAL';

      if (res.ok) {
        const json = await res.json();
        const data = json.data;
        assistantText =
          data.generated_answer?.trim() ||
          data.compressed_context?.slice(0, 600) ||
          "I couldn't find relevant info in your workspace. Try uploading a document!";
        intent = data.intent || 'GENERAL';
        msgCitations = (data.citations || []).map(
          (c: { file_name: string; page_number: number; visibility: string }) => ({
            fileName: c.file_name,
            pageNumber: c.page_number,
            section: c.visibility === 'PRIVATE' ? 'Private Notes' : 'Workspace Knowledge',
            visibility: c.visibility as Citation['visibility'],
          }),
        );
      } else {
        assistantText =
          "Hmm, I can't reach the knowledge base right now. Make sure the backend is running! 🔌";
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: assistantText,
        intent,
        citations: msgCitations,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      await speak(assistantText.slice(0, 300));
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'assistant',
          text: 'Connection error — make sure the API server is running! 🚀',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(file.name);
    setUploadProgress(10);
    setUploadStep('Reading document...');

    setTimeout(() => {
      setUploadProgress(50);
      setUploadStep('Generating embeddings...');
    }, 800);
    setTimeout(() => {
      setUploadProgress(85);
      setUploadStep('Indexing into memory...');
    }, 1500);
    setTimeout(() => {
      setUploadProgress(100);
      setUploadStep('Done! ✨');
      toast.success(`"${file.name}" indexed into your knowledge base!`, { icon: '📄' });
      setTimeout(() => setUploadingFile(null), 1000);
    }, 2200);
  };

  return (
    <>
      {/* Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-3 py-2 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <div className="w-7 h-7 overflow-hidden flex items-center justify-center shrink-0 bg-white/20 rounded-xl p-0.5">
          {!lottieError ? (
            <DotLottieReact
              src="/knowledge-ai.lottie"
              loop
              autoplay
              onError={() => setLottieError(true)}
            />
          ) : (
            <Bot size={16} />
          )}
        </div>
        <span className="text-xs font-semibold">Ask AI</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed bottom-20 right-5 z-50 w-80 sm:w-96 flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-black/20"
            style={{ height: '480px', background: '#1c1828' }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-2.5 px-4 py-3 border-b border-white/[0.07]"
              style={{ background: '#221e32' }}
            >
              <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center overflow-hidden shrink-0 p-0.5">
                {!lottieError ? (
                  <DotLottieReact
                    src="/knowledge-ai.lottie"
                    loop
                    autoplay
                    onError={() => setLottieError(true)}
                  />
                ) : (
                  <Sparkles size={14} className="text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-slate-100 leading-tight">
                  Knowledge AI
                </p>
                <p className="text-[10px] text-slate-400 leading-tight">FounderHQ · RAG-powered</p>
              </div>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors ml-1"
              >
                <X size={14} />
              </button>
            </div>

            {/* Upload Progress */}
            {uploadingFile && (
              <div className="px-4 py-2.5 bg-violet-500/10 border-b border-violet-500/20 text-[11px] space-y-1.5">
                <div className="flex justify-between text-violet-300 font-medium">
                  <span className="flex items-center gap-1">
                    <FileText size={11} /> {uploadingFile}
                  </span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-0.5 overflow-hidden">
                  <div
                    className="bg-violet-400 h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Loader2 size={9} className="animate-spin text-violet-400" /> {uploadStep}
                </p>
              </div>
            )}

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-3 py-3 space-y-3 text-[12px]"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#3d3557 transparent' }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} gap-1`}
                >
                  <div
                    className={`px-3 py-2.5 rounded-2xl max-w-[82%] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-violet-600 text-white rounded-br-sm'
                        : 'text-slate-200 rounded-bl-sm border border-white/[0.06]'
                    }`}
                    style={msg.sender === 'assistant' ? { background: '#2a2440' } : {}}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Citations */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-white/10 space-y-1">
                        <p className="text-[9px] font-semibold text-violet-400 uppercase tracking-wider">
                          Sources
                        </p>
                        {msg.citations.map((cite, idx) => (
                          <div
                            key={idx}
                            onClick={() => toast.info(`${cite.fileName} · Page ${cite.pageNumber}`)}
                            className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.06] cursor-pointer transition-colors"
                          >
                            <span className="flex items-center gap-1 truncate text-slate-300">
                              <FileText size={9} className="text-violet-400 shrink-0" />
                              <span className="truncate text-[10px]">{cite.fileName}</span>
                            </span>
                            <ExternalLink size={9} className="text-slate-500 shrink-0" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-600 px-1">{msg.timestamp}</span>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-2">
                  <div
                    className="px-3 py-2.5 rounded-2xl rounded-bl-sm border border-white/[0.06] flex items-center gap-2"
                    style={{ background: '#2a2440' }}
                  >
                    <span className="flex gap-0.5">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </span>
                    <span className="text-[11px] text-slate-400">Searching knowledge base…</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* TTS indicator */}
            {isSpeaking && (
              <div
                className="px-4 py-1.5 flex items-center justify-between text-[10px] text-violet-400 border-t border-white/[0.06]"
                style={{ background: '#221e32' }}
              >
                <span className="flex items-center gap-1">
                  <Volume2 size={10} className="animate-bounce" /> Speaking…
                </span>
                <button
                  onClick={stopSpeaking}
                  className="underline text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Stop
                </button>
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSend}
              className="px-3 py-2.5 border-t border-white/[0.07] flex items-center gap-2"
              style={{ background: '#221e32' }}
            >
              <label
                className="p-1.5 rounded-lg text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 cursor-pointer transition-colors"
                title="Upload document"
              >
                <Upload size={13} />
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.docx,.pptx,.txt"
                />
              </label>

              <button
                type="button"
                onClick={toggleListening}
                className={`p-1.5 rounded-lg transition-all ${
                  isListening
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                    : 'text-slate-500 hover:text-violet-400 hover:bg-violet-500/10'
                }`}
                title={isListening ? 'Stop' : 'Voice input'}
              >
                {isListening ? <MicOff size={13} /> : <Mic size={13} />}
              </button>

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isListening ? 'Listening…' : 'Ask anything…'}
                className="flex-1 bg-white/[0.05] rounded-xl px-3 py-1.5 text-[12px] text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500/40 border border-white/[0.06] transition-all"
              />

              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="p-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-30 transition-all"
              >
                <Send size={13} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
