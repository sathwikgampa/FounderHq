'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const DEFAULT_SUGGESTIONS = [
  'How does the CEO Planner orchestrate startup agents?',
  'What is the burn rate and runway summary?',
  'Explain the multi-tenant workspace security model.',
  'How do human approval queues work for high-risk actions?',
];

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Hello! I am the **FounderHQ CEO Planner AI Assistant**. How can I help optimize your startup strategy or platform navigation today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Simulated UI AI response placeholder
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `**[CEO Planner Response Placeholder]**\n\nI have received your request regarding: "${query}".\n\nThe FounderHQ multi-agent execution pipeline is online and ready for full backend integration in Phase 2.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col w-[380px] sm:w-[420px] h-[580px] rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden mb-4"
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-border bg-muted/40 p-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm">CEO Planner AI</span>
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <span className="text-xs text-muted-foreground">FounderHQ OS Assistant</span>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() =>
                    setMessages([
                      {
                        id: Date.now().toString(),
                        role: 'assistant',
                        content: 'Chat context cleared. How can I help you?',
                        timestamp: new Date().toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        }),
                      },
                    ])
                  }
                  title="Clear Chat"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
<<<<<<< HEAD
                    className={`flex max-w-[85%] space-x-2 ${msg.role === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"
                      }`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${msg.role === "user"
                        ? "bg-accent text-foreground"
                        : "bg-primary/10 text-primary border border-primary/20"
                        }`}
=======
                    className={`flex max-w-[85%] space-x-2 ${
                      msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        msg.role === 'user'
                          ? 'bg-accent text-foreground'
                          : 'bg-primary/10 text-primary border border-primary/20'
                      }`}
>>>>>>> 5eaafcb (fix(ci): resolve frontend lint and typecheck errors for CI pipeline)
                    >
                      {msg.role === 'user' ? (
                        <User className="h-3.5 w-3.5" />
                      ) : (
                        <Bot className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <div
<<<<<<< HEAD
                      className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none shadow-sm"
                        : "bg-muted/60 text-foreground border border-border/50 rounded-tl-none"
                        }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      <div
                        className={`mt-1 text-[10px] ${msg.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}
=======
                      className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-none shadow-sm'
                          : 'bg-muted/60 text-foreground border border-border/50 rounded-tl-none'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      <div
                        className={`mt-1 text-[10px] ${
                          msg.role === 'user'
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground'
                        }`}
>>>>>>> 5eaafcb (fix(ci): resolve frontend lint and typecheck errors for CI pipeline)
                      >
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                    <Bot className="h-3.5 w-3.5 animate-spin" />
                  </div>
                  <div className="rounded-2xl bg-muted/60 px-3.5 py-2.5 border border-border/50">
                    <span className="animate-pulse">CEO Planner is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts */}
            {messages.length < 3 && (
              <div className="px-4 pb-2">
                <div className="text-[11px] font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-500" /> Suggested Prompts
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {DEFAULT_SUGGESTIONS.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(s)}
                      className="text-left text-[11px] bg-muted/40 hover:bg-accent border border-border/50 rounded-lg px-2.5 py-1 transition-colors text-muted-foreground hover:text-foreground line-clamp-1"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Box */}
            <div className="border-t border-border p-3 bg-muted/20">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask CEO Planner..."
                  className="flex-1 bg-background border border-input rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-xl"
                  disabled={!input.trim()}
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-13 w-13 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl border border-primary/20 focus:outline-none hover:bg-primary/90 transition-colors"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </motion.button>
    </div>
  );
}
