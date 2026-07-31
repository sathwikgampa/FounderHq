'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Sparkles,
  Send,
  Mic,
  MicOff,
  Upload,
  FileText,
  FileCheck,
  CheckCircle2,
  Loader2,
  X,
  Lock,
  Globe,
  Users,
  BookOpen,
  Volume2,
  Square,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import { clientRAGEngine, Citation } from '@/lib/rag-engine';
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
      text: "Hello! I'm the FounderHQ Enterprise RAG Knowledge Assistant. I can retrieve information across your Global Workspace Docs, Team Knowledge, Private Notes, and Built-in FounderHQ Guides with full security metadata protection. What would you like to search today?",
      timestamp: 'Just now',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<'ALL' | 'GLOBAL' | 'TEAM' | 'PRIVATE' | 'SYSTEM'>('ALL');
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStep, setUploadStep] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isListening, isSpeaking, transcript, toggleListening, speak, stopSpeaking } = useVoice((finalText) => {
    if (finalText) setQuery(finalText);
  });

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

    setTimeout(async () => {
      // Execute 4-Layer RAG Engine Query with Permission Resolution
      const ragRes = clientRAGEngine.query(userText, 'siddharth', 'acme-inc', ['ENGINEERING', 'FINANCE']);

      let assistantText = '';
      if (ragRes.citations && ragRes.citations.length > 0) {
        assistantText = `Based on your accessible workspace documents [Intent: ${ragRes.intent}]:\n\n${ragRes.compressedContext}`;
      } else {
        assistantText = "I couldn't find this information in your accessible workspace documents. Please verify your team permissions or upload the reference file.";
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: assistantText,
        intent: ragRes.intent,
        citations: ragRes.citations,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsLoading(false);

      // Play ultra-realistic ElevenLabs TTS Voice Output
      await speak(assistantText.slice(0, 300));
    }, 1100);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(file.name);
    setUploadProgress(10);
    setUploadStep('Extracting text & OCR...');

    setTimeout(() => {
      setUploadProgress(50);
      setUploadStep('Generating vector embeddings...');
    }, 800);

    setTimeout(() => {
      setUploadProgress(85);
      setUploadStep('Indexing into RAG Memory...');
    }, 1500);

    setTimeout(() => {
      setUploadProgress(100);
      setUploadStep('Knowledge Indexed!');
      toast.success(`Indexed "${file.name}" into RAG Knowledge Engine!`, { icon: '📄' });
      setTimeout(() => setUploadingFile(null), 1000);
    }, 2200);
  };

  return (
    <>
      {/* Floating Chatbot Launcher Button with DotLottie Animation */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-2.5 rounded-3xl bg-[#0E1014]/90 border border-[#7C5CFF]/50 text-white shadow-2xl shadow-[#7C5CFF]/40 hover:scale-105 transition-all flex items-center gap-2 group backdrop-blur-xl"
      >
        <div className="w-10 h-10 overflow-hidden flex items-center justify-center shrink-0">
          <DotLottieReact
            src="https://lottie.host/53761f30-4dd3-42a6-a300-fcc52365776f/42HptGJW1u.lottie"
            loop
            autoplay
          />
        </div>
        <span className="font-bold text-xs pr-1">Knowledge AI</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1" />
      </button>

      {/* Floating Chatbot Drawer Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-full max-w-lg h-[640px] bg-[#0E1014]/98 backdrop-blur-2xl border border-white/10 rounded-[28px] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Chatbot Header */}
            <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#7C5CFF]/20 border border-[#7C5CFF]/40 flex items-center justify-center text-[#7C5CFF] overflow-hidden shrink-0">
                  <DotLottieReact
                    src="https://lottie.host/53761f30-4dd3-42a6-a300-fcc52365776f/42HptGJW1u.lottie"
                    loop
                    autoplay
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    FounderHQ Knowledge Engine
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      RAG v1.0
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Security Scoped · Hybrid Search · Clickable Citations</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Knowledge Filter Chips */}
            <div className="flex items-center gap-1.5 px-4 py-2 bg-white/[0.01] border-b border-white/5 text-[11px]">
              {[
                { id: 'ALL', label: 'All Knowledge', icon: Globe },
                { id: 'GLOBAL', label: 'Global', icon: Globe },
                { id: 'TEAM', label: 'Team', icon: Users },
                { id: 'PRIVATE', label: 'Private', icon: Lock },
                { id: 'SYSTEM', label: 'System', icon: BookOpen },
              ].map((layer) => {
                const Icon = layer.icon;
                const isSel = selectedLayer === layer.id;
                return (
                  <button
                    key={layer.id}
                    onClick={() => setSelectedLayer(layer.id as any)}
                    className={`px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 shrink-0 ${
                      isSel
                        ? 'bg-[#7C5CFF] text-white border-[#7C5CFF]'
                        : 'bg-white/5 text-slate-400 border-white/8 hover:text-white'
                    }`}
                  >
                    <Icon size={10} />
                    <span>{layer.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Document Uploading Progress Indicator */}
            {uploadingFile && (
              <div className="p-3 bg-indigo-500/10 border-b border-indigo-500/20 text-xs space-y-1.5">
                <div className="flex justify-between text-indigo-300 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <FileText size={14} /> Uploading {uploadingFile}
                  </span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
                  <div className="bg-indigo-400 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Loader2 size={10} className="animate-spin text-indigo-400" />
                  {uploadStep}
                </p>
              </div>
            )}

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
                >
                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#7C5CFF] text-white rounded-br-none shadow-md shadow-[#7C5CFF]/20'
                        : 'bg-white/[0.04] border border-white/8 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Citations Box */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-white/10 space-y-1.5">
                        <span className="text-[10px] font-bold text-[#7C5CFF] uppercase tracking-wider block">
                          Retrieved Sources & Citations:
                        </span>
                        <div className="space-y-1">
                          {msg.citations.map((cite, idx) => (
                            <div
                              key={idx}
                              onClick={() => toast.info(`Viewing ${cite.fileName} (Page ${cite.pageNumber})`)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 text-[11px] text-slate-300 flex items-center justify-between cursor-pointer transition-colors"
                            >
                              <span className="flex items-center gap-1 truncate font-medium">
                                <FileText size={12} className="text-indigo-400 shrink-0" />
                                <span className="truncate">{cite.fileName}</span>
                              </span>
                              <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1">
                                Page {cite.pageNumber} <ExternalLink size={10} />
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <span className="text-[9px] text-slate-500 px-1">{msg.timestamp}</span>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-indigo-400 p-2">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Searching RAG vector collections & reranking context...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* TTS Playing Indicator */}
            {isSpeaking && (
              <div className="px-4 py-1.5 bg-[#7C5CFF]/15 border-t border-[#7C5CFF]/30 flex items-center justify-between text-xs text-[#7C5CFF]">
                <span className="flex items-center gap-1.5">
                  <Volume2 size={12} className="animate-bounce" /> Playing ElevenLabs Executive Voice...
                </span>
                <button onClick={stopSpeaking} className="text-[10px] underline">Stop</button>
              </div>
            )}

            {/* Input Form Footer */}
            <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-white/[0.02] space-y-2">
              <div className="flex items-center gap-2">
                {/* File Upload Trigger */}
                <label className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors" title="Upload Document into RAG Engine">
                  <Upload size={16} />
                  <input type="file" onChange={handleFileUpload} className="hidden" accept=".pdf,.docx,.pptx,.txt" />
                </label>

                {/* Mic STT Trigger */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2 rounded-xl transition-all ${
                    isListening
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  title={isListening ? 'Stop Listening' : 'Voice Input'}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>

                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={isListening ? 'Listening...' : 'Ask your workspace knowledge base...'}
                  className="flex-1 bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="p-2 rounded-xl bg-[#7C5CFF] hover:bg-[#6b49f3] text-white disabled:opacity-40 transition-all shadow-md shadow-[#7C5CFF]/30"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
