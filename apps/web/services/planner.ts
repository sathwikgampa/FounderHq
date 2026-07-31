import { getApiBaseUrl } from './api-client';

export interface PlannerStreamEvent {
  event:
    | 'session_start'
    | 'agent_started'
    | 'tool_executed'
    | 'approval_required'
    | 'final_brief'
    | 'error'
    | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

export async function streamPlannerExecution(
  prompt: string,
  workspaceId: string = 'ws-default',
  onEvent: (evt: PlannerStreamEvent) => void,
  onComplete?: () => void,
  onError?: (err: Error) => void,
): Promise<void> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/api/v1/planner/stream`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify({
        prompt,
        workspace_id: workspaceId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SSE Stream connection failed [${response.status}]: ${errorText}`);
    }

    if (!response.body) {
      throw new Error('ReadableStream not supported by browser or empty body');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // keep incomplete trailing line in buffer

      let currentEvent = '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        if (trimmed.startsWith('event:')) {
          currentEvent = trimmed.substring('event:'.length).trim();
        } else if (trimmed.startsWith('data:') && currentEvent) {
          const rawData = trimmed.substring('data:'.length).trim();
          try {
            const parsedData = JSON.parse(rawData);
            onEvent({
              event: currentEvent,
              data: parsedData,
            });
          } catch {
            onEvent({
              event: currentEvent,
              data: { raw: rawData },
            });
          }
          currentEvent = '';
        }
      }
    }

    onComplete?.();
  } catch (err) {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    onError?.(errorObj);
  }
}
