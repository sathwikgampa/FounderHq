/**
 * CEO Planner SSE Client — Authenticated
 * ----------------------------------------
 * WHY: The previous version opened SSE connections with no Authorization header,
 * meaning the planner stream endpoint was effectively public. This version uses
 * fetchAuthenticatedStream() from api-client.ts which injects the Firebase Bearer
 * token and CSRF headers before opening the stream connection.
 */

import { fetchAuthenticatedStream } from './api-client';

export interface PlannerStreamEvent {
  event:
    | 'session_start'
    | 'routing_decision'
    | 'agent_start'
    | 'agent_started'
    | 'tool_executed'
    | 'approval_flag'
    | 'approval_required'
    | 'final_brief'
    | 'error'
    | string;
  data: Record<string, unknown>;
}

export async function streamPlannerExecution(
  prompt: string,
  workspaceId: string = 'ws-default',
  onEvent: (evt: PlannerStreamEvent) => void,
  onComplete?: () => void,
  onError?: (err: Error) => void,
): Promise<void> {
  try {
    const reader = await fetchAuthenticatedStream('/api/v1/planner/stream', {
      prompt,
      workspace_id: workspaceId,
    });

    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      let currentEvent = '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        if (trimmed.startsWith('event:')) {
          currentEvent = trimmed.slice('event:'.length).trim();
        } else if (trimmed.startsWith('data:') && currentEvent) {
          const rawData = trimmed.slice('data:'.length).trim();
          try {
            onEvent({ event: currentEvent, data: JSON.parse(rawData) });
          } catch {
            onEvent({ event: currentEvent, data: { raw: rawData } });
          }
          currentEvent = '';
        }
      }
    }

    onComplete?.();
  } catch (err) {
    onError?.(err instanceof Error ? err : new Error(String(err)));
  }
}
