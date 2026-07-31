# 🌐 FounderHQ – Deployment & Production Guide

This guide provides step-by-step instructions for deploying **FounderHQ** to public cloud platforms (Vercel, Render, or Docker) to fulfill Section 5.4 Submission Requirements (_"A live deployed product accessible via a public URL"_).

---

## 🏗️ Architecture & Hosting Strategy

FounderHQ is architected as a high-performance monorepo:

1. **Frontend (`apps/web`):** Next.js 15 (App Router) → Deployed on **Vercel** or **Render Web Service**
2. **Backend API (`apps/api`):** FastAPI Python 3.12 → Deployed on **Render** (via `Dockerfile.api`) or **Railway** / **Fly.io**

---

## ⚡ Option 1: Vercel (Frontend) + Render (Backend API) [RECOMMENDED]

### Step 1: Deploy Backend API on Render

1. Sign in to [Render.com](https://render.com).
2. Click **New +** → **Blueprints**.
3. Connect your public GitHub repository containing FounderHQ.
4. Render will automatically detect `render.yaml`.
5. Fill in the required environment variables:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
   - `JWT_SECRET_KEY`: Random 32+ character string.
6. Click **Apply**. Your API will deploy to `https://founderhq-api.onrender.com`.

### Step 2: Deploy Frontend on Vercel

1. Sign in to [Vercel.com](https://vercel.com).
2. Click **Add New** → **Project** → Import your GitHub repository.
3. Set **Framework Preset**: `Next.js`.
4. Set **Root Directory**: `apps/web`.
5. Add Environment Variables:
   ```env
   NEXT_PUBLIC_APP_ENV=production
   NEXT_PUBLIC_API_BASE_URL=https://founderhq-api.onrender.com
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   ```
6. Click **Deploy**. Your live app will be accessible at `https://founderhq.vercel.app`.

---

## 🐳 Option 2: Render Docker Deployment (Full Stack)

FounderHQ contains `render.yaml` pre-configured to build both Docker containers:

```bash
# Render Blueprint automatic detection:
# Service 1: founderhq-api (Dockerfile.api on port 8000)
# Service 2: founderhq-web (Dockerfile.web on port 3000)
```

Simply push your code to GitHub and connect the repository to Render Blueprint.

---

## 🛡️ Health Check Verification

Once deployed, verify public endpoint health:

- **Web App:** `https://<your-web-url>/`
- **Backend API Health:** `https://<your-api-url>/api/v1/healthz`
- **OpenAPI Docs:** `https://<your-api-url>/docs`
