'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export interface ApprovalRequest {
  id: string;
  title: string;
  agent: string;
  category: 'Finance' | 'Talent' | 'Legal' | 'Growth' | 'Operations';
  description: string;
  impactScore: 'HIGH' | 'MEDIUM' | 'CRITICAL';
  estimatedCost?: string;
  riskAssessment: string;
}

interface ApprovalModalProps {
  isOpen: boolean;
  request: ApprovalRequest | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onClose: () => void;
}

export function ApprovalModal({
  isOpen,
  request,
  onApprove,
  onReject,
  onClose,
}: ApprovalModalProps) {
  if (!request) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/15 bg-[#09090d] p-6 shadow-2xl z-10"
          >
            {/* Header Glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500" />

            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldAlert size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-medium">
                    {request.agent}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      request.impactScore === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {request.impactScore} IMPACT
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">{request.title}</h3>
              </div>
            </div>

            <div className="space-y-4 mb-8 text-sm">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/8 text-slate-300 leading-relaxed">
                {request.description}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {request.estimatedCost && (
                  <div className="p-3 rounded-xl bg-white/3 border border-white/5">
                    <span className="text-[11px] text-slate-400 block mb-0.5">Estimated Cost</span>
                    <span className="font-semibold text-white">{request.estimatedCost}</span>
                  </div>
                )}
                <div className="p-3 rounded-xl bg-white/3 border border-white/5">
                  <span className="text-[11px] text-slate-400 block mb-0.5">Category</span>
                  <span className="font-semibold text-white">{request.category}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 flex items-start gap-2.5">
                <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200/90 leading-relaxed">
                  <span className="font-semibold block mb-0.5">Risk & Memory Log</span>
                  {request.riskAssessment}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onReject(request.id);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-white/5 border border-white/10 text-slate-300 font-semibold rounded-xl hover:bg-white/10 hover:text-white transition-colors"
              >
                <XCircle size={16} />
                Reject Action
              </button>

              <button
                onClick={() => {
                  onApprove(request.id);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
              >
                <CheckCircle2 size={16} />
                Authorize Action
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
