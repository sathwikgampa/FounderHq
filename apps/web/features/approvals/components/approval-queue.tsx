'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { listApprovals, submitApprovalDecision, ApprovalItem } from '@/services/approvals';

interface ApprovalQueueProps {
  workspaceId?: string;
  onDecisionMade?: () => void;
}

export function ApprovalQueue({ workspaceId, onDecisionMade }: ApprovalQueueProps) {
  const [items, setItems] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchQueue = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listApprovals(workspaceId, 'PENDING');
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load approval items');
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  const handleDecision = async (id: string, decision: 'APPROVE' | 'REJECT') => {
    setActioningId(id);
    try {
      await submitApprovalDecision(id, decision);
      setItems((prev) => prev.filter((item) => item.id !== id));
      onDecisionMade?.();
    } catch (err) {
      alert(`Decision error: ${err instanceof Error ? err.message : 'Failed to process decision'}`);
    } finally {
      setActioningId(null);
    }
  };

  const formatPayloadDetails = (payload: Record<string, any>) => {
    if (payload.role_title) {
      return `Headcount Request: ${payload.role_title} ($${(payload.annual_salary_usd || 0).toLocaleString()}/yr)`;
    }
    if (payload.channel) {
      return `Campaign Launch: ${payload.channel} channel ($${(payload.budget_usd || 0).toLocaleString()} budget)`;
    }
    if (payload.contract_type) {
      return `Contract Execution: ${payload.contract_type} agreement`;
    }
    return JSON.stringify(payload);
  };

  return (
    <Card className="rounded-2xl border-border bg-card/60 backdrop-blur-sm p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-bold">Human Approval Queue</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={fetchQueue}
            disabled={loading}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            title="Refresh queue"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <span className="rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-0.5 text-xs font-semibold">
            {items.length} Pending
          </span>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && items.length === 0 ? (
        <div className="p-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center space-y-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span>Loading pending executive approvals...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="p-6 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
          No pending approval actions required. All executive tasks cleared.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/60 bg-muted/30 hover:bg-accent/40 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-sm">
                    {formatPayloadDetails(item.payload)}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                    {item.agent}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tool: <code className="text-primary/90 font-mono">{item.tool}</code> &middot;
                  Session: {item.session_id}
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={actioningId === item.id}
                  className="h-8 text-xs text-destructive hover:bg-destructive/10 rounded-lg"
                  onClick={() => handleDecision(item.id, 'REJECT')}
                >
                  {actioningId === item.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <>
                      <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  disabled={actioningId === item.id}
                  className="h-8 text-xs rounded-lg shadow-sm"
                  onClick={() => handleDecision(item.id, 'APPROVE')}
                >
                  {actioningId === item.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Approve
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
