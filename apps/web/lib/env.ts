import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  NEXT_PUBLIC_API_BASE_URL: z.string().url().default('http://localhost:8000'),
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1, 'Firebase API Key is required.'),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1, 'Firebase Auth Domain is required.'),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1, 'Firebase Project ID is required.'),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1, 'Firebase Storage Bucket is required.'),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1, 'Firebase Sender ID is required.'),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1, 'Firebase App ID is required.'),
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string().optional(),
});

const _env = envSchema.safeParse({
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  NEXT_PUBLIC_FIREBASE_API_KEY:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyALhpx-08YOVB3nAmqsibpGviK4DYBT_FU',
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'founderhq-f5441.firebaseapp.com',
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'founderhq-f5441',
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'founderhq-f5441.firebasestorage.app',
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1008624752109',
  NEXT_PUBLIC_FIREBASE_APP_ID:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:1008624752109:web:f30f60d808d6ac73ce03e4',
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-1X3JVBP2WQ',
});

if (!_env.success) {
  console.error('Invalid environment variables:', _env.error.format());
}

export const env = _env.success
  ? _env.data
  : {
      NEXT_PUBLIC_APP_ENV: 'development',
      NEXT_PUBLIC_API_BASE_URL: 'http://localhost:8000',
      NEXT_PUBLIC_FIREBASE_API_KEY: 'AIzaSyALhpx-08YOVB3nAmqsibpGviK4DYBT_FU',
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'founderhq-f5441.firebaseapp.com',
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'founderhq-f5441',
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'founderhq-f5441.firebasestorage.app',
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '1008624752109',
      NEXT_PUBLIC_FIREBASE_APP_ID: '1:1008624752109:web:f30f60d808d6ac73ce03e4',
      NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: 'G-1X3JVBP2WQ',
    };
