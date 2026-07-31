import { z } from 'zod';

export const emailSchema = z.string().email('Invalid email address format.');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long.')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
  .regex(/[0-9]/, 'Password must contain at least one number.');

export const workspaceNameSchema = z
  .string()
  .min(2, 'Workspace name must be at least 2 characters.')
  .max(50, 'Workspace name cannot exceed 50 characters.');
