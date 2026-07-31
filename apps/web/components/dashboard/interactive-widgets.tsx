'use client';

import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus, FilePlus, UserPlus, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function PrioritiesList({
  initialItems,
}: {
  initialItems: { id: string; title: string; due: string; checked: boolean }[];
}) {
  const [priorities, setPriorities] = useState(initialItems);

  const togglePriority = (id: string) => {
    setPriorities((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)),
    );
  };

  return (
    <div className="space-y-2">
      {priorities.map((item) => (
        <div
          key={item.id}
          onClick={() => togglePriority(item.id)}
          className="p-3 rounded-xl bg-[#FAFAFB] border border-[#ECECEC] flex items-center justify-between cursor-pointer hover:border-[#6C63FF]/30 transition-all"
        >
          <div className="flex items-center gap-3">
            {item.checked ? (
              <CheckCircle2 size={16} className="text-[#6C63FF] shrink-0" />
            ) : (
              <Circle size={16} className="text-[#6B7280] shrink-0" />
            )}
            <span
              className={`text-xs font-medium ${item.checked ? 'text-[#111827] font-semibold' : 'text-[#6B7280]'}`}
            >
              {item.title}
            </span>
          </div>
          <span className="text-[10px] font-semibold text-[#6C63FF] px-2.5 py-0.5 rounded-full bg-[#6C63FF]/10 shrink-0">
            {item.due}
          </span>
        </div>
      ))}
    </div>
  );
}

export function AiInsightAction({ actionName }: { actionName: string }) {
  return (
    <button
      onClick={() => toast.success(`Executed: ${actionName}`)}
      className="px-3 py-1.5 rounded-xl bg-[#6C63FF] text-white text-[11px] font-semibold hover:bg-[#5b52e0] transition-colors shrink-0 shadow-sm"
    >
      {actionName}
    </button>
  );
}

export function QuickActionButtons() {
  const router = useRouter();

  return (
    <div className="pt-4 border-t border-[#ECECEC]">
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <button
          onClick={() => router.push('/tasks')}
          className="px-4 py-2.5 rounded-xl bg-white border border-[#ECECEC] hover:border-[#6C63FF]/40 text-[#111827] text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
        >
          <Plus size={14} className="text-[#6C63FF]" /> Create Task
        </button>

        <button
          onClick={() => router.push('/documents')}
          className="px-4 py-2.5 rounded-xl bg-white border border-[#ECECEC] hover:border-[#6C63FF]/40 text-[#111827] text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
        >
          <FilePlus size={14} className="text-[#6C63FF]" /> New Document
        </button>

        <button
          onClick={() => toast.info('Invite team member popup open')}
          className="px-4 py-2.5 rounded-xl bg-white border border-[#ECECEC] hover:border-[#6C63FF]/40 text-[#111827] text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
        >
          <UserPlus size={14} className="text-[#6C63FF]" /> Invite Member
        </button>

        <button
          onClick={() => {
            const copilotInput = document.getElementById('copilot');
            copilotInput?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-4 py-2.5 rounded-xl bg-[#6C63FF] text-white text-xs font-semibold shadow-md shadow-[#6C63FF]/20 hover:bg-[#5b52e0] transition-all flex items-center gap-2"
        >
          <MessageSquare size={14} /> Ask AI
        </button>
      </div>
    </div>
  );
}
