# FounderHQ Setup & Deployment Guide

## 1. Local Prerequisites

- Install **Node.js 20+**
- Install **pnpm 9+**: `npm install -g pnpm`
- Install **Python 3.12**
- Install **Docker Desktop**

---

## 2. Setting Up Environment Variables

### Frontend (`apps/web/.env.local`)

```env
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_FIREBASE_API_KEY=mock-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mock-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mock-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mock-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### Backend (`apps/api/.env`)

```env
ENV=development
PROJECT_NAME=FounderHQ-API
VERSION=1.0.0
DEBUG=true
PORT=8000
HOST=0.0.0.0

# CORS
CORS_ORIGINS=["http://localhost:3000"]

# Firebase Admin
FIREBASE_PROJECT_ID=mock-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@mock-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"

# Security
JWT_SECRET_KEY=super-secret-development-jwt-key-min-32-chars-long
```

---

## 3. Running via Docker Compose

```bash
docker-compose up --build
```

---

## 4. Production Deployment

### Frontend (Vercel)

- Set Framework Preset to **Next.js**.
- Root Directory: `apps/web`.
- Build Command: `pnpm build`.
- Install Command: `pnpm install`.

### Backend (Google Cloud Run)

- Build Docker container using `Dockerfile.api`.
- Push container image to Google Artifact Registry.
- Deploy image to Cloud Run service with env secrets injected from GCP Secret Manager.
