'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionGroupProps {
  children: React.ReactNode;
  defaultOpen?: string;
}

export function WidgetAccordionGroup({ children, defaultOpen }: AccordionGroupProps) {
  const [openSection, setOpenSection] = useState<string | null>(defaultOpen || null);

  return (
    <div className="space-y-4 mb-12">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          const typedChild = child as React.ReactElement<{
            id: string;
            isOpen: boolean;
            onToggle: () => void;
          }>;
          return React.cloneElement(typedChild, {
            isOpen: typedChild.props.id === openSection,
            onToggle: () =>
              setOpenSection((prev) => (prev === typedChild.props.id ? null : typedChild.props.id)),
          });
        }
        return child;
      })}
    </div>
  );
}

interface AccordionItemProps {
  id: string;
  icon: React.ElementType;
  title: string;
  count: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function WidgetAccordionItem({
  id: _id,
  icon: Icon,
  title,
  count,
  children,
  isOpen,
  onToggle,
}: AccordionItemProps) {
  return (
    <div className="bg-white border border-[#ECECEC] rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden transition-all">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-[#FAFAFB] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-[#6C63FF]" />
          <h2 className="text-sm font-bold text-[#111827]">{title}</h2>
          <span className="text-xs text-[#6B7280] font-normal">{count}</span>
        </div>
        <ChevronDown
          size={16}
          className={`text-[#6B7280] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && <div className="px-4 pb-4 border-t border-[#ECECEC] pt-3">{children}</div>}
    </div>
  );
}
