'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const INIT_STEPS = [
  { id: 'ceo', text: 'Booting CEO Planner...' },
  { id: 'finance', text: 'Initializing Finance Agent...' },
  { id: 'talent', text: 'Spinning up Talent & HR...' },
  { id: 'growth', text: 'Configuring Growth Engine...' },
  { id: 'context', text: 'Injecting Startup Context...' },
];

export function AgentInitialization() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const runSteps = () => {
      if (currentStepIndex < INIT_STEPS.length) {
        timeout = setTimeout(
          () => {
            setCurrentStepIndex((prev) => prev + 1);
          },
          800 + Math.random() * 1200,
        ); // Random delay between 800ms and 2000ms
      } else {
        // All steps complete
        timeout = setTimeout(() => {
          toast.success('Workspace Initialized! Welcome to FounderHQ.');
          router.push('/dashboard');
        }, 1500);
      }
    };

    runSteps();

    return () => clearTimeout(timeout);
  }, [currentStepIndex, router]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="glass-panel p-8 rounded-2xl border border-white/10 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/20 blur-[50px] rounded-full pointer-events-none" />

        <div className="text-center space-y-4 mb-8 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
            <Bot size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Initializing Workspace</h2>
            <p className="text-sm text-slate-400 mt-1">Your AI executive team is waking up</p>
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          {INIT_STEPS.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isPending = index > currentStepIndex;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: isPending ? 0.4 : 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3"
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  ) : isCurrent ? (
                    <Loader2 size={18} className="text-indigo-400 animate-spin" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-700" />
                  )}
                </div>
                <span
                  className={`text-sm font-medium ${
                    isCompleted ? 'text-slate-300' : isCurrent ? 'text-white' : 'text-slate-600'
                  }`}
                >
                  {step.text}
                </span>
              </motion.div>
            );
          })}
        </div>

        {currentStepIndex >= INIT_STEPS.length && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-emerald-400 font-medium text-sm"
          >
            <Sparkles size={16} />
            Ready for Launch
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
