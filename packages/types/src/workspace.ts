import { UserRole } from './user';

export enum WorkspaceTier {
  FREE = 'FREE',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

export interface WorkspaceMember {
  userId: string;
  role: UserRole;
  joinedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  tier: WorkspaceTier;
  members: WorkspaceMember[];
  createdAt: string;
  updatedAt: string;
}
