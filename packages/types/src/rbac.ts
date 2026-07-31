import { UserRole } from './user';

export enum Permission {
  MANAGE_WORKSPACE = 'workspace:manage',
  INVITE_MEMBERS = 'members:invite',
  VIEW_FINANCES = 'finances:view',
  EXECUTE_COMMANDS = 'commands:execute',
  READ_DOCUMENTS = 'documents:read',
  WRITE_DOCUMENTS = 'documents:write',
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.OWNER]: [
    Permission.MANAGE_WORKSPACE,
    Permission.INVITE_MEMBERS,
    Permission.VIEW_FINANCES,
    Permission.EXECUTE_COMMANDS,
    Permission.READ_DOCUMENTS,
    Permission.WRITE_DOCUMENTS,
  ],
  [UserRole.ADMIN]: [
    Permission.INVITE_MEMBERS,
    Permission.VIEW_FINANCES,
    Permission.EXECUTE_COMMANDS,
    Permission.READ_DOCUMENTS,
    Permission.WRITE_DOCUMENTS,
  ],
  [UserRole.MEMBER]: [
    Permission.EXECUTE_COMMANDS,
    Permission.READ_DOCUMENTS,
    Permission.WRITE_DOCUMENTS,
  ],
  [UserRole.GUEST]: [Permission.READ_DOCUMENTS],
};
