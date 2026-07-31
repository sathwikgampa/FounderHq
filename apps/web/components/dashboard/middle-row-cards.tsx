'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Check } from 'lucide-react';

type Item = {
  text: string;
  checked: boolean;
};

const ChecklistCard = ({ title, items }: { title: string; items: Item[] }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="glass-card flex flex-col overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between p-4 border-b border-border hover:bg-muted/50 transition-colors"
      >
        <h3 className="font-semibold text-lg text-foreground">{title}</h3>
        {expanded ? (
          <ChevronDown size={18} className="text-muted-foreground" />
        ) : (
          <ChevronRight size={18} className="text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="p-4 flex flex-col gap-3 focus:outline-none">
          {items.map((item, i) => (
            <div
              key={i}
              onClick={() => {
                console.info(`Checklist item clicked: ${item.text}`);
                alert('Status transition received.');
              }}
              className="flex items-start gap-3 group cursor-pointer"
            >
              <div
                className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                  item.checked
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'border-muted-foreground group-hover:border-primary'
                }`}
              >
                {item.checked && <Check size={12} className="text-white" />}
              </div>
              <span
                className={`text-sm ${item.checked ? 'text-muted-foreground line-through' : 'text-foreground'}`}
              >
                {item.text}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export function MiddleRowCards() {
  const setupItems = [
    { text: 'Connect bank account', checked: true },
    { text: 'Invite team members', checked: false },
    { text: 'Upload incorporation documents', checked: false },
  ];

  const activityItems = [
    { text: 'Sarah joined the workspace', checked: true },
    { text: 'Payroll approved for July', checked: true },
    { text: 'Q3 Marketing budget allocated', checked: true },
  ];

  const gettingStartedItems = [
    { text: 'Watch platform tutorial', checked: true },
    { text: 'Setup AI Agents', checked: false },
    { text: 'Review first monthly report', checked: false },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <ChecklistCard title="Startup Setup" items={setupItems} />
      <ChecklistCard title="Recent Activity" items={activityItems} />
      <ChecklistCard title="Getting Started" items={gettingStartedItems} />
    </div>
  );
}
