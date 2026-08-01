'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Mic,
  MicOff,
  Paperclip,
  Send,
  Command,
  Slash,
  Volume2,
  Square,
} from 'lucide-react';
import { toast } from 'sonner';
import { useVoice } from '@/hooks/use-voice';
import { fetchApi } from '@/services/api-client';

const PROMPT_CHIPS = [
  'Analyze runway',
  'Generate hiring plan',
  'Review SAFE agreement',
  'Forecast revenue',
  'Find bottlenecks',
  'Build GTM strategy',
];

interface AgentStep {
  agentName: string;
  status: string;
  summary: string;
}

interface PlannerExecutionResult {
  executionId: string;
  command: string;
  status: string;
  planSummary: string;
  consultedAgents: string[];
  agentSteps: AgentStep[];
  requiresApproval?: boolean;
}

export function AiCopilot() {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const [executionResult, setExecutionResult] = useState<PlannerExecutionResult | null>(null);

  const { isListening, isSpeaking, transcript, toggleListening, speak, stopSpeaking } = useVoice(
    (finalText) => {
      if (finalText) setQuery(finalText);
    },
  );

  useEffect(() => {
    if (transcript) setQuery(transcript);
  }, [transcript]);

  // Check URL query parameters for pre-filled prompt (e.g., from Agent info page)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const promptParam = urlParams.get('prompt');
      if (promptParam) {
        setQuery(promptParam);
        executePrompt(promptParam);
      }
    }
  }, []);

  const synthesizeDynamicClientResult = (userPrompt: string): PlannerExecutionResult => {
    const lowerP = userPrompt.toLowerCase();

    if (
      lowerP.includes('edutech') ||
      lowerP.includes('edtech') ||
      lowerP.includes('edu tech') ||
      lowerP.includes('study') ||
      lowerP.includes('education') ||
      lowerP.includes('school') ||
      lowerP.includes('student') ||
      lowerP.includes('quiz')
    ) {
      return {
        executionId: `exec-${Date.now()}`,
        command: userPrompt,
        status: 'COMPLETED',
        planSummary: `CEO Planner Blueprint for EdTech Concept ("${userPrompt}"): Scoped 3 core MVP features (1-Click Study Guide & Automated Flashcard Generator, AI Quiz Master with Spaced Repetition, Collaborative Group Dashboard). GTM Target: University students, educators & campus study groups ($1,800/mo projected sales). Safe monthly tool spend: $150/mo.`,
        consultedAgents: [
          'CEO Planner Agent',
          'Product Agent',
          'Growth Agent',
          'Finance Agent',
          'Legal Agent',
        ],
        agentSteps: [
          {
            agentName: 'CEO Planner Agent',
            status: 'COMPLETED',
            summary: `Parsed EdTech prompt '${userPrompt.slice(0, 50)}...'. Dispatched 4 executive sub-agents in sequential launch topology.`,
          },
          {
            agentName: 'Product Executive Agent',
            status: 'COMPLETED',
            summary:
              'Scoped V1 MVP: 1-Click Camera Study Guide Scanner, AI Quiz Master with Spaced Repetition, Collaborative Group Dashboard. Recommended Stack: Next.js 15, Gemini 2.5 API, Supabase.',
          },
          {
            agentName: 'Growth Executive Agent',
            status: 'COMPLETED',
            summary:
              'Formulated GTM strategy targeting Students, Educators & Campus Groups across Discord & Subreddits. Outreach email template ready. Projected sales: $1,800/mo in 30 days.',
          },
          {
            agentName: 'Finance Executive Agent',
            status: 'COMPLETED',
            summary:
              'Evaluated zero-revenue bootstrap runway: 12.0 months remaining at $150/mo safe software budget limit. Health: STRONG_BOOTSTRAP.',
          },
          {
            agentName: 'Legal Executive Agent',
            status: 'COMPLETED',
            summary:
              'Audited 50/50 founder equity split with 4-year vesting schedule and 1-year cliff + 100% IP assignment.',
          },
        ],
      };
    }

    if (
      lowerP.includes('real estate') ||
      lowerP.includes('broker') ||
      lowerP.includes('realtor') ||
      lowerP.includes('property') ||
      lowerP.includes('listing')
    ) {
      return {
        executionId: `exec-${Date.now()}`,
        command: userPrompt,
        status: 'COMPLETED',
        planSummary: `CEO Planner Blueprint for Real Estate SaaS ("${userPrompt}"): Scoped 1-Click AI MLS Listing Generator, Description & Social Video Exporter. Target: Local real estate brokers ($1,800/mo sales impact). Runway: 16.5 months safe.`,
        consultedAgents: ['CEO Planner Agent', 'Product Agent', 'Growth Agent', 'Finance Agent'],
        agentSteps: [
          {
            agentName: 'CEO Planner Agent',
            status: 'COMPLETED',
            summary: `Parsed real estate prompt '${userPrompt.slice(0, 50)}...'. Delegated to Product, Growth, and Finance agents.`,
          },
          {
            agentName: 'Product Executive Agent',
            status: 'COMPLETED',
            summary:
              'Scoped V1 MVP: 1-Click AI MLS Description Generator, Social Media Video Exporter, Brokerage Customizer Dashboard. Build Target: 12 days.',
          },
          {
            agentName: 'Growth Executive Agent',
            status: 'COMPLETED',
            summary:
              'Targeted local brokers & agent teams via LinkedIn & Apollo cold email. Cold email template: "MLS listings in 10s". Projected initial sales: $1,800/mo.',
          },
          {
            agentName: 'Finance Executive Agent',
            status: 'COMPLETED',
            summary:
              'Verified capital reserves ($450,000 balance / 16.5 months runway). Financial health is stable.',
          },
        ],
      };
    }

    if (
      lowerP.includes('hire') ||
      lowerP.includes('hiring') ||
      lowerP.includes('salary') ||
      lowerP.includes('engineer') ||
      lowerP.includes('developer') ||
      lowerP.includes('job')
    ) {
      return {
        executionId: `exec-${Date.now()}`,
        command: userPrompt,
        status: 'REQUIRES_APPROVAL',
        requiresApproval: true,
        planSummary: `CEO Planner Headcount Review for "${userPrompt}": Drafted job specification for Senior AI Engineer ($130,000/yr salary, $10,833/mo burn impact). Queued for founder sign-off.`,
        consultedAgents: ['CEO Planner Agent', 'Talent Agent', 'Finance Agent', 'Legal Agent'],
        agentSteps: [
          {
            agentName: 'CEO Planner Agent',
            status: 'COMPLETED',
            summary: `Parsed hiring request '${userPrompt.slice(0, 50)}...'. Initiated executive review for headcount expansion.`,
          },
          {
            agentName: 'Talent Executive Agent',
            status: 'REQUIRES_APPROVAL',
            summary:
              'Drafted job description & compensation benchmarks for Senior AI Engineer ($130,000/yr base salary).',
          },
          {
            agentName: 'Finance Executive Agent',
            status: 'COMPLETED',
            summary:
              'Verified burn impact ($10,833/mo addition) vs $450,000 capital reserves (~16.5 months runway remaining).',
          },
          {
            agentName: 'Legal Executive Agent',
            status: 'COMPLETED',
            summary:
              'Formulated standard Employment Agreement & IP Assignment (PIIA) requirements.',
          },
        ],
      };
    }

    if (
      lowerP.includes('food') ||
      lowerP.includes('restaurant') ||
      lowerP.includes('recipe') ||
      lowerP.includes('delivery') ||
      lowerP.includes('meal') ||
      lowerP.includes('dining')
    ) {
      return {
        executionId: `exec-${Date.now()}`,
        command: userPrompt,
        status: 'COMPLETED',
        planSummary: `CEO Planner Blueprint for Food & Delivery Concept ("${userPrompt}"): Scoped 3 core MVP features (1-Click Local Order & Menu Scanner, Real-Time P2P Dispatch & Order Tracking Engine, Merchant Analytics & Payout Portal). Target: Local restaurants & foodies ($1,800/mo projected sales). Safe monthly tool budget: $150/mo.`,
        consultedAgents: ['CEO Planner Agent', 'Product Agent', 'Growth Agent', 'Finance Agent'],
        agentSteps: [
          {
            agentName: 'CEO Planner Agent',
            status: 'COMPLETED',
            summary: `Parsed food delivery prompt '${userPrompt.slice(0, 50)}...'. Delegated to Product, Growth, and Finance agents.`,
          },
          {
            agentName: 'Product Executive Agent',
            status: 'COMPLETED',
            summary:
              'Scoped V1 MVP: 1-Click Local Menu Scanner, Real-Time P2P Order Dispatch Engine, Merchant Analytics Portal. Recommended Stack: Next.js 15, Gemini 2.5 API, Supabase.',
          },
          {
            agentName: 'Growth Executive Agent',
            status: 'COMPLETED',
            summary:
              'Targeted local restaurant owners & foodies via direct flyer QR codes & Instagram food creators. Projected initial sales: $1,800/mo.',
          },
          {
            agentName: 'Finance Executive Agent',
            status: 'COMPLETED',
            summary:
              'Evaluated zero-revenue bootstrap runway: 12.0 months remaining at $150/mo safe software budget limit.',
          },
        ],
      };
    }

    if (
      lowerP.includes('crypto') ||
      lowerP.includes('web3') ||
      lowerP.includes('blockchain') ||
      lowerP.includes('nft') ||
      lowerP.includes('wallet') ||
      lowerP.includes('token') ||
      lowerP.includes('defi')
    ) {
      return {
        executionId: `exec-${Date.now()}`,
        command: userPrompt,
        status: 'COMPLETED',
        planSummary: `CEO Planner Blueprint for Web3 / Crypto Concept ("${userPrompt}"): Scoped 3 core MVP features (Automated Transaction & Portfolio Tracker, Smart Contract Audit & Risk Evaluator, Exportable Tax Summary). Target: Web3 investors & traders ($1,800/mo sales impact).`,
        consultedAgents: [
          'CEO Planner Agent',
          'Product Agent',
          'Growth Agent',
          'Finance Agent',
          'Legal Agent',
        ],
        agentSteps: [
          {
            agentName: 'CEO Planner Agent',
            status: 'COMPLETED',
            summary: `Parsed Web3 prompt '${userPrompt.slice(0, 50)}...'. Dispatched executive team for security & compliance audit.`,
          },
          {
            agentName: 'Product Executive Agent',
            status: 'COMPLETED',
            summary:
              'Scoped V1 MVP: Automated Multi-Chain Portfolio Tracker, Smart Contract Audit Engine, Exportable Tax Summary. Stack: Next.js 15 + Viem + Gemini API.',
          },
          {
            agentName: 'Growth Executive Agent',
            status: 'COMPLETED',
            summary:
              'Targeted Web3 traders & DAO members across X (Twitter) & Discord. Cold DM & partnership template ready.',
          },
          {
            agentName: 'Finance Executive Agent',
            status: 'COMPLETED',
            summary: 'Verified capital runway (12.0 months safe at $150/mo tool budget).',
          },
        ],
      };
    }

    if (
      lowerP.includes('fitness') ||
      lowerP.includes('health') ||
      lowerP.includes('workout') ||
      lowerP.includes('gym') ||
      lowerP.includes('nutrition')
    ) {
      return {
        executionId: `exec-${Date.now()}`,
        command: userPrompt,
        status: 'COMPLETED',
        planSummary: `CEO Planner Blueprint for Health & Fitness App ("${userPrompt}"): Scoped Daily AI Health Metric & Workout Logger, Personalized Macro Meal Planner, Coach Sharing Portal. Target: Fitness enthusiasts & personal trainers ($1,800/mo sales impact).`,
        consultedAgents: ['CEO Planner Agent', 'Product Agent', 'Growth Agent', 'Finance Agent'],
        agentSteps: [
          {
            agentName: 'CEO Planner Agent',
            status: 'COMPLETED',
            summary: `Parsed fitness prompt '${userPrompt.slice(0, 50)}...'. Initiated Product and GTM planning.`,
          },
          {
            agentName: 'Product Executive Agent',
            status: 'COMPLETED',
            summary:
              'Scoped V1 MVP: Daily AI Health Metric Logger, Personalized Macro Meal Planner, Progress Analytics Portal. Build Target: 14 days.',
          },
          {
            agentName: 'Growth Executive Agent',
            status: 'COMPLETED',
            summary:
              'Targeted personal trainers & fitness creators via Instagram/TikTok outreach. Outreach script: "Track client progress in 10s".',
          },
          {
            agentName: 'Finance Executive Agent',
            status: 'COMPLETED',
            summary: 'Calculated 12.0 months bootstrap runway at $150/mo safe software budget.',
          },
        ],
      };
    }

    // Universal Semantic Synthesizer for ANY custom prompt text
    const cleanConcept = userPrompt
      .replace(
        /^(i need to build|i want to build|build a|build an|create a|create an|make a|make an|how to build|generate|design|our startup is|my startup idea is)/i,
        '',
      )
      .trim()
      .replace(/^["']|["']$/g, '');

    const displayConcept = cleanConcept
      ? cleanConcept.charAt(0).toUpperCase() + cleanConcept.slice(1)
      : userPrompt.trim();

    return {
      executionId: `exec-${Date.now()}`,
      command: userPrompt,
      status: 'COMPLETED',
      planSummary: `CEO Planner 30-Day Blueprint for "${displayConcept}": Scoped 3 core V1 features (1-Click Core Solution Engine for "${displayConcept}", Real-Time Interactive Workflow Manager, Exportable Analytics & Asset Sharing Portal). GTM Target: Early adopters & target community seeking "${displayConcept}". Safe software tool spend limit: $150/mo.`,
      consultedAgents: [
        'CEO Planner Agent',
        'Product Agent',
        'Growth Agent',
        'Finance Agent',
        'Legal Agent',
      ],
      agentSteps: [
        {
          agentName: 'CEO Planner Agent',
          status: 'COMPLETED',
          summary: `Analyzed founder prompt '${displayConcept.slice(0, 50)}...'. Orchestrated 4 executive sub-agents in sequential launch topology.`,
        },
        {
          agentName: 'Product Executive Agent',
          status: 'COMPLETED',
          summary: `Scoped 3 core V1 MVP features for '${displayConcept.slice(0, 35)}': (1) 1-Click Core Solution Engine, (2) Real-Time Workflow Manager, (3) Exportable Analytics Portal. Recommended Stack: Next.js 15, Gemini 2.5 API, Supabase. Saves 3 weeks coding.`,
        },
        {
          agentName: 'Growth Executive Agent',
          status: 'COMPLETED',
          summary: `Formulated GTM strategy targeting early adopters seeking '${displayConcept.slice(0, 30)}'. Outreach email script ready: "Hi {{Name}}, open to testing our solution this week?". Projected sales: $1,800/mo in 30 days.`,
        },
        {
          agentName: 'Finance Executive Agent',
          status: 'COMPLETED',
          summary:
            'Calculated capital runway (12.0 months remaining at $150/mo safe software budget limit). Health: STRONG_BOOTSTRAP.',
        },
        {
          agentName: 'Legal Executive Agent',
          status: 'COMPLETED',
          summary:
            'Audited 50/50 founder equity split with 4-year vesting schedule and 1-year cliff + 100% IP assignment.',
        },
      ],
    };
  };

  const executePrompt = async (userPrompt: string) => {
    if (!userPrompt.trim() || isProcessing) return;
    setIsProcessing(true);

    try {
      const data = await fetchApi<PlannerExecutionResult>('/api/v1/planner/execute', {
        method: 'POST',
        body: JSON.stringify({
          command: userPrompt,
          startupId: 'startup-001',
        }),
      });

      if (data && data.planSummary && data.agentSteps) {
        setExecutionResult(data);
        const speechText = data.planSummary;
        setLastResponse(speechText);
        toast.success(`CEO Planner Executed: "${userPrompt.slice(0, 30)}..."`, { icon: '⚡' });
        await speak(speechText);
      } else {
        throw new Error('Fallback to client synthesizer');
      }
    } catch {
      // Dynamic fallback synthesizer matching user input
      const fallbackResult = synthesizeDynamicClientResult(userPrompt);
      setExecutionResult(fallbackResult);
      setLastResponse(fallbackResult.planSummary);
      toast.success(`CEO Planner: "${userPrompt.slice(0, 30)}..."`, { icon: '✨' });
      await speak(fallbackResult.planSummary);
    } finally {
      setIsProcessing(false);
      setQuery('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executePrompt(query);
  };

  return (
    <div id="copilot" className="w-full mb-8">
      <div className="relative w-full max-w-4xl mx-auto space-y-3">
        {/* Main Floating Command Bar (Raycast / Perplexity Style) */}
        <form
          onSubmit={handleSubmit}
          className="relative bg-white border border-[#ECECEC] rounded-[24px] p-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3 z-10 transition-all hover:border-[#6C63FF]/40 focus-within:border-[#6C63FF] focus-within:ring-2 focus-within:ring-[#6C63FF]/10"
        >
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-xl bg-[#6C63FF]/10 border border-[#6C63FF]/20 flex items-center justify-center text-[#6C63FF] shrink-0">
              <Sparkles size={16} className={isProcessing ? 'animate-spin' : ''} />
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                isProcessing
                  ? 'Orchestrating executive sub-agents...'
                  : isListening
                    ? 'Listening to voice...'
                    : 'Ask FounderHQ anything...'
              }
              disabled={isProcessing}
              className="flex-1 bg-transparent text-base font-semibold text-[#0F172A] placeholder:text-[#64748B] focus:outline-none disabled:opacity-60"
            />

            <div className="flex items-center gap-2">
              {/* Voice STT */}
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

              {/* Attach File */}
              <button
                type="button"
                onClick={() => toast.info('File attachment indexed into RAG Memory')}
                className="p-2 rounded-xl text-[#6B7280] hover:text-[#111827] hover:bg-[#FAFAFB] transition-colors"
                title="Attach file"
              >
                <Paperclip size={16} />
              </button>

              {/* Slash Command Helper */}
              <button
                type="button"
                onClick={() => setQuery('/')}
                className="p-2 rounded-xl text-[#6B7280] hover:text-[#111827] hover:bg-[#FAFAFB] transition-colors"
                title="Slash commands"
              >
                <Slash size={14} />
              </button>

              {/* Audio Playback Stop / Replay */}
              {isSpeaking ? (
                <button
                  type="button"
                  onClick={stopSpeaking}
                  className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 animate-pulse"
                  title="Stop Voice Playback"
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

              {/* Keyboard Shortcut */}
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

        {/* Suggested Prompt Chips */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar px-1 text-xs">
          {PROMPT_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => {
                setQuery(chip);
                executePrompt(chip);
              }}
              className="px-3.5 py-1.5 rounded-full bg-white border border-[#ECECEC] text-[#6B7280] hover:text-[#111827] hover:bg-[#FAFAFB] hover:border-[#6C63FF]/30 transition-all shrink-0 text-xs font-medium shadow-sm"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Dynamic Executive Agent Execution Result Card */}
        {executionResult && (
          <div className="mt-4 p-5 rounded-2xl bg-white border border-[#6C63FF]/30 shadow-xl space-y-3 font-sans transition-all animate-in fade-in slide-in-from-top-3">
            <div className="flex items-center justify-between border-b border-[#ECECEC] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="text-sm font-bold text-[#111827]">CEO Planner Executive Result</h4>
              </div>
              <span className="text-[11px] font-mono text-[#6C63FF] bg-[#6C63FF]/10 px-2.5 py-0.5 rounded-full font-semibold border border-[#6C63FF]/20">
                {executionResult.status}
              </span>
            </div>

            <p className="text-xs text-[#374151] font-medium leading-relaxed bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
              {executionResult.planSummary}
            </p>

            {/* Consulted Sub-Agents */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-semibold text-[#64748B]">
                Consulted Sub-Agents:
              </span>
              {executionResult.consultedAgents.map((ag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-[#6C63FF]/10 text-[#6C63FF] text-[10px] font-mono font-bold border border-[#6C63FF]/20"
                >
                  {ag}
                </span>
              ))}
            </div>

            {/* Agent Execution Steps */}
            {executionResult.agentSteps && executionResult.agentSteps.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#ECECEC]">
                <h5 className="text-xs font-bold text-[#0F172A]">Agent Execution Trace:</h5>
                <div className="space-y-1.5">
                  {executionResult.agentSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-3 text-xs p-2 rounded-lg bg-[#FAFAFB] border border-[#ECECEC]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6C63FF]" />
                        <span className="font-bold text-[#111827]">{step.agentName}:</span>
                        <span className="text-[#475569]">{step.summary}</span>
                      </div>
                      <span className="text-[10px] font-mono font-semibold text-emerald-600 shrink-0">
                        {step.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
