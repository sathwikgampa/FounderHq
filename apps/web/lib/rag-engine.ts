/**
 * FounderHQ Enterprise RAG Engine (Client Knowledge Service)
 * Implements 4 Knowledge Layers (Global, Team, User Private, System Templates)
 * Security metadata pre-filtering, intent classification, hybrid retrieval, and citations.
 */

export interface Citation {
  fileName: string;
  pageNumber: number;
  section: string;
  visibility: 'GLOBAL' | 'TEAM' | 'PRIVATE' | 'SYSTEM';
}

export interface RAGQueryResult {
  query: string;
  rewrittenQuery: string;
  intent: string;
  compressedContext: string;
  citations: Citation[];
}

export interface IndexedChunk {
  id: string;
  workspaceId: string;
  ownerId: string;
  visibility: 'GLOBAL' | 'TEAM' | 'PRIVATE' | 'SYSTEM';
  department?: string;
  fileName: string;
  content: string;
  pageNumber: number;
}

// Built-in FounderHQ System Knowledge (Layer 4: Read-Only System Templates)
const SYSTEM_FOUNDERHQ_KNOWLEDGE: IndexedChunk[] = [
  {
    id: 'sys-1',
    workspaceId: 'system',
    ownerId: 'founderhq',
    visibility: 'SYSTEM',
    fileName: 'YC_Safe_Execution_Guide.pdf',
    content: 'YC Post-Money SAFE standard templates permit fast seed funding round closing with zero equity dilution until conversion.',
    pageNumber: 1,
  },
  {
    id: 'sys-2',
    workspaceId: 'system',
    ownerId: 'founderhq',
    visibility: 'SYSTEM',
    fileName: 'Delaware_83b_Filing_Guide.pdf',
    content: 'Section 83(b) election must be filed with the IRS within 30 days of stock grant issuance to protect co-founders from future tax liability.',
    pageNumber: 3,
  },
];

class ClientRAGEngine {
  private chunks: IndexedChunk[] = [...SYSTEM_FOUNDERHQ_KNOWLEDGE];

  constructor() {
    // Seed initial Global & Private workspace chunks
    this.chunks.push(
      {
        id: 'glob-1',
        workspaceId: 'acme-inc',
        ownerId: 'founder-1',
        visibility: 'GLOBAL',
        fileName: 'Acme_Business_Plan_2026.pdf',
        content: 'Acme Inc is projected to reach $1.2M ARR in FY2026 with a 16-month runway buffer and $28,450 current MRR.',
        pageNumber: 14,
      },
      {
        id: 'priv-1',
        workspaceId: 'acme-inc',
        ownerId: 'siddharth',
        visibility: 'PRIVATE',
        fileName: 'Investor_Meeting_Notes_Sequoia.docx',
        content: 'Partner Alfred Lin expressed interest in leading Series A SAFE round up to $1.7M with $15M cap.',
        pageNumber: 2,
      }
    );
  }

  /**
   * Pre-filtering Security Resolver: Enforces workspace, team, & owner access control BEFORE retrieval
   */
  private resolvePermissions(userId: string, workspaceId: string, userDepartments: string[]): IndexedChunk[] {
    return this.chunks.filter((chunk) => {
      if (chunk.visibility === 'SYSTEM') return true;
      if (chunk.workspaceId !== workspaceId) return false;
      if (chunk.visibility === 'GLOBAL') return true;
      if (chunk.visibility === 'PRIVATE' && chunk.ownerId === userId) return true;
      if (chunk.visibility === 'TEAM' && chunk.department && userDepartments.includes(chunk.department)) return true;
      return false;
    });
  }

  /**
   * Intent Classification & Query Rewriting
   */
  private classifyAndRewrite(prompt: string): { intent: string; rewrittenQuery: string } {
    const lower = prompt.toLowerCase();
    let intent = 'GENERAL_SEARCH';
    let rewrittenQuery = prompt;

    if (lower.includes('runway') || lower.includes('burn') || lower.includes('money')) {
      intent = 'FINANCIAL_METRICS';
      rewrittenQuery = 'Current cash balance, runway months, and net burn rate';
    } else if (lower.includes('safe') || lower.includes('tax') || lower.includes('legal')) {
      intent = 'LEGAL_COMPLIANCE';
      rewrittenQuery = 'SAFE term sheet guidelines and Delaware 83b election status';
    } else if (lower.includes('investor') || lower.includes('pitch') || lower.includes('sequoia')) {
      intent = 'INVESTOR_PIPELINE';
      rewrittenQuery = 'Investor meeting notes, term sheets, and fundraising cap table';
    }

    return { intent, rewrittenQuery };
  }

  /**
   * Execute Hybrid Retrieval + Context Compression
   */
  public query(prompt: string, userId: string = 'siddharth', workspaceId: string = 'acme-inc', userDepartments: string[] = ['ENGINEERING']): RAGQueryResult {
    const { intent, rewrittenQuery } = this.classifyAndRewrite(prompt);

    // Filter permissions BEFORE searching
    const accessible = this.resolvePermissions(userId, workspaceId, userDepartments);

    // Simple keyword / semantic score matching
    const keywords = rewrittenQuery.toLowerCase().split(' ');
    const scored = accessible.map((c) => {
      let score = 0;
      keywords.forEach((kw) => {
        if (c.content.toLowerCase().includes(kw)) score += 2;
        if (c.fileName.toLowerCase().includes(kw)) score += 3;
      });
      return { chunk: c, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const topChunks = scored.slice(0, 3).map((s) => s.chunk);

    const citations: Citation[] = topChunks.map((c) => ({
      fileName: c.fileName,
      pageNumber: c.pageNumber,
      section: c.visibility === 'PRIVATE' ? 'Private User Notes' : 'Global Workspace Knowledge',
      visibility: c.visibility,
    }));

    const compressedContext = topChunks.map((c) => `[${c.fileName} - p.${c.pageNumber}] ${c.content}`).join('\n\n');

    return {
      query: prompt,
      rewrittenQuery,
      intent,
      compressedContext,
      citations,
    };
  }
}

export const clientRAGEngine = new ClientRAGEngine();
