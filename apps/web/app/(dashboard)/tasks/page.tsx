'use client';

import React from 'react';
import { KanbanTasks } from '@/components/dashboard/kanban-tasks';
import { CheckSquare, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function TasksPage() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <CheckSquare size={14} />
            COO Operations Agent Active
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Execution Board</h1>
          <p className="text-slate-400 text-sm mt-1">Sprint tasks auto-generated and coordinated by COO Operations Agent.</p>
        </div>

        <button
          onClick={() => toast.success('New Sprint Task assigned to CTO Agent!')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus size={16} />
          Add Sprint Task
        </button>
      </div>

      <KanbanTasks />
    </div>
  );
}
