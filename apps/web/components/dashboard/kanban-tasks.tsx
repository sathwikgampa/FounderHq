'use client';

import React from 'react';
import { CheckSquare, Clock, Sparkles, User } from 'lucide-react';
import { GlowCard } from '@/components/ui/glow-card';

interface Task {
  id: string;
  title: string;
  owner: string;
  priority: 'HIGH' | 'MEDIUM' | 'URGENT';
  dueDate: string;
  aiSuggestion?: string;
}

const COLUMNS: { id: string; title: string; tasks: Task[] }[] = [
  {
    id: 'today',
    title: 'Today',
    tasks: [
      { id: 't1', title: 'Review Series A SAFE Cap Table', owner: 'Siddharth', priority: 'URGENT', dueDate: 'Today 5 PM', aiSuggestion: 'CFO Agent flagged +2% dilution' },
      { id: 't2', title: 'Interview Senior AI Engineer', owner: 'Elena (HR)', priority: 'HIGH', dueDate: 'Today 3 PM', aiSuggestion: 'Resume match: 96%' },
    ],
  },
  {
    id: 'this-week',
    title: 'This Week',
    tasks: [
      { id: 't3', title: 'Submit Delaware Franchise Tax', owner: 'Legal Agent', priority: 'MEDIUM', dueDate: 'Friday', aiSuggestion: '83b status confirmed' },
      { id: 't4', title: 'Deploy WebGL Shader Background', owner: 'Design Agent', priority: 'HIGH', dueDate: 'Tomorrow', aiSuggestion: 'Passed 60FPS test' },
    ],
  },
  {
    id: 'blocked',
    title: 'Blocked',
    tasks: [
      { id: 't5', title: 'Stripe Corporate Account Audit', owner: 'Finance Agent', priority: 'URGENT', dueDate: 'Pending Approval', aiSuggestion: 'Requires Founder KYC verification' },
    ],
  },
  {
    id: 'completed',
    title: 'Completed',
    tasks: [
      { id: 't6', title: 'Seed Round Pitch Deck Generated', owner: 'CEO Planner', priority: 'MEDIUM', dueDate: 'Completed', aiSuggestion: 'Data room shared' },
    ],
  },
];

export function KanbanTasks() {
  return (
    <div className="space-y-4 my-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="text-emerald-400" size={20} />
            Execution Tasks (Kanban)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Auto-assigned sprint tasks coordinated by COO Operations Agent.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {COLUMNS.map((col) => (
          <div key={col.id} className="space-y-3">
            <div className="flex items-center justify-between px-2 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-2">
                {col.title}
                <span className="w-5 h-5 rounded-full bg-white/10 text-white flex items-center justify-center text-[10px]">
                  {col.tasks.length}
                </span>
              </span>
            </div>

            <div className="space-y-2.5">
              {col.tasks.map((task) => (
                <GlowCard key={task.id} className="p-3.5 space-y-2.5 hover:border-white/20 transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-white leading-snug">{task.title}</h4>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold shrink-0 ${
                        task.priority === 'URGENT'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  {task.aiSuggestion && (
                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-[10px] text-indigo-300 flex items-center gap-1.5">
                      <Sparkles size={10} className="shrink-0" />
                      <span className="truncate">{task.aiSuggestion}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/5">
                    <span className="flex items-center gap-1">
                      <User size={10} /> {task.owner}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} /> {task.dueDate}
                    </span>
                  </div>
                </GlowCard>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
