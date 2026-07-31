/**
 * Frontend Environment Configuration
 * -------------------------------------
 * WHY THIS CHANGE:
 * The previous version had real Firebase project IDs, API keys, app IDs, and
 * measurement IDs hardcoded as fallback values in source code. This is a security
 * and compliance problem for two reasons:
 *
 *  1. Firebase API keys are public-facing identifiers, but anyone with the key
 *     AND project ID can attempt to abuse Firebase auth endpoints (credential
 *     stuffing, password reset spam, etc.). Embedding them in source prevents
 *     rotation — you can't revoke a key that is burned into every git commit.
 *
 *  2. Firebase project IDs and app IDs identify your Cloud infrastructure.
 *     Exposing them unnecessarily broadens the attack surface.
 *
 * THIS VERSION:
 *  - Reads ONLY from environment variables — no hardcoded fallbacks for secrets.
 *  - In development: missing variables produce a clear console.error() with the
 *    variable name, not a silent fallback to a real credential.
 *  - In production (NEXT_PUBLIC_APP_ENV=production): throws at module load time
 *    so a misconfigured deployment fails fast rather than running with wrong keys.
 *  - NEXT_PUBLIC_API_BASE_URL defaults to localhost:8000 (safe dev default, no
 *    secret value).
 *  - NEXT_PUBLIC_APP_ENV defaults to 'development' (safe default).
 *
 * HOW TO SET UP:
 *  Copy apps/web/.env.example to apps/web/.env.local and fill in your values.
 *  Vercel: add each variable in Project Settings → Environment Variables.
 */

import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  // Safe non-secret default — points to local backend in development
  NEXT_PUBLIC_API_BASE_URL: z.string().url().default('http://localhost:8000'),
  // Firebase keys — no defaults, must come from environment variables
  NEXT_PUBLIC_FIREBASE_API_KEY: z
    .string()
    .min(1, 'NEXT_PUBLIC_FIREBASE_API_KEY is required. Add it to .env.local'),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z
    .string()
    .min(1, 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is required. Add it to .env.local'),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z
    .string()
    .min(1, 'NEXT_PUBLIC_FIREBASE_PROJECT_ID is required. Add it to .env.local'),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z
    .string()
    .min(1, 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is required. Add it to .env.local'),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z
    .string()
    .min(1, 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID is required. Add it to .env.local'),
  NEXT_PUBLIC_FIREBASE_APP_ID: z
    .string()
    .min(1, 'NEXT_PUBLIC_FIREBASE_APP_ID is required. Add it to .env.local'),
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string().optional(),
});

const _env = envSchema.safeParse({
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
});

if (!_env.success) {
  const formatted = _env.error.format();
  console.error(
    '[FounderHQ] Invalid or missing environment variables. ' +
      'Copy apps/web/.env.example to apps/web/.env.local and fill in the required values.\n',
    formatted,
  );

  // In production: hard-fail immediately rather than serving a broken app
  if (process.env.NEXT_PUBLIC_APP_ENV === 'production') {
    throw new Error(
      '[FounderHQ] Production build aborted: required environment variables are missing. ' +
        'Check the Vercel / deployment environment variable configuration.',
    );
  }
}

/**
 * Typed, validated environment variables.
 *
 * In development with missing vars: `env` will have the validated fields
 * that ARE present, and the Firebase fields will be empty strings (causing
 * Firebase to fail to initialise, showing an error in the browser console).
 * This is intentional — a visible error beats a silent wrong credential.
 */
export const env = _env.success
  ? _env.data
  : ({
      NEXT_PUBLIC_APP_ENV: 'development' as const,
      NEXT_PUBLIC_API_BASE_URL: 'http://localhost:8000',
      // Empty strings cause Firebase to throw a clear initialisation error
      // rather than authenticating against the wrong project.
      NEXT_PUBLIC_FIREBASE_API_KEY: '',
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: '',
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: '',
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: '',
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '',
      NEXT_PUBLIC_FIREBASE_APP_ID: '',
      NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: undefined,
    } satisfies z.infer<typeof envSchema>);
