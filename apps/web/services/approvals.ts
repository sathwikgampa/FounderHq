import { fetchApi } from './api-client';

export interface ApprovalItem {
  id: string;
  session_id: string;
  workspace_id: string;
  agent: string;
  tool: string;
  payload: Record<string, any>;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
  decided_at?: string | null;
}

export interface ApiResponseEnvelope<T> {
  data: T;
  message: string;
  error?: string | null;
}

export async function listApprovals(
  workspaceId?: string,
  status: string = 'PENDING',
): Promise<ApprovalItem[]> {
  const params = new URLSearchParams();
  if (workspaceId) params.append('workspace_id', workspaceId);
  if (status) params.append('status', status);

  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetchApi<ApiResponseEnvelope<ApprovalItem[]>>(`/api/v1/approvals${query}`);
  return res.data || [];
}

export async function submitApprovalDecision(
  itemId: string,
  decision: 'APPROVE' | 'REJECT',
): Promise<ApprovalItem> {
  const res = await fetchApi<ApiResponseEnvelope<ApprovalItem>>(
    `/api/v1/approvals/${itemId}/decision`,
    {
      method: 'POST',
      body: JSON.stringify({ decision }),
    },
  );
  return res.data;
}
