# FounderHQ -- Deployment Architecture

> **Document ID:** 18_DEPLOYMENT_ARCHITECTURE **Version:** 1.0 **Depends
> On:** Documents 01--17

---

# 1. Purpose

This document defines the production deployment architecture for
FounderHQ, covering environments, CI/CD, infrastructure, domains,
monitoring, rollback strategy, and operational readiness.

---

# 2. Production Architecture

```text
Users
  │
Cloudflare DNS/CDN (optional)
  │
Vercel (Next.js Frontend)
  │
FastAPI (Google Cloud Run)
  │
Google ADK
  │
Firestore
Firebase Storage
Firebase Auth
Gemini Models
```

---

# 3. Deployment Environments

Environment Purpose

---

Local Development
Dev Team integration
Staging Pre-production validation
Production Live customers

Each environment has isolated configuration, Firebase projects, and
secrets.

---

# 4. Frontend Deployment

Platform: - Vercel

Build: - Next.js 15 - TypeScript - Tailwind CSS

Features: - Edge CDN - Automatic HTTPS - Preview deployments - Image
optimization - Incremental Static Regeneration where appropriate

---

# 5. Backend Deployment

Platform: - Google Cloud Run

Configuration: - Stateless containers - Autoscaling - HTTPS - Health
checks - Rolling deployments

---

# 6. AI Services

- Google ADK orchestrator
- Gemini 2.5 models
- Background execution
- Streaming responses
- Tool execution layer

---

# 7. Firebase Services

- Authentication
- Firestore
- Storage
- App Check
- Cloud Messaging

Each environment uses a separate Firebase project.

---

# 8. Environment Variables

Examples:

- GEMINI_API_KEY
- FIREBASE_PROJECT_ID
- FIREBASE_STORAGE_BUCKET
- JWT_SECRET
- LOG_LEVEL

Secrets must never be committed to source control.

---

# 9. CI/CD Pipeline

```text
Git Push
   │
GitHub Actions
   │
Lint
   │
Tests
   │
Build
   │
Security Scan
   │
Deploy Staging
   │
Manual Approval
   │
Production
```

---

# 10. Release Strategy

- Feature branches
- Pull requests
- Code review required
- Automated tests
- Semantic versioning
- Release notes

---

# 11. Rollback Strategy

Rollback triggers:

- Failed deployment
- Increased error rate
- Critical security issue
- Performance regression

Rollback should restore the previous stable version with minimal
downtime.

---

# 12. Monitoring

Track:

- API latency
- Frontend performance
- AI execution latency
- Firestore usage
- Error rates
- CPU & memory
- Deployment health

---

# 13. Logging

Centralize:

- Application logs
- Audit logs
- Security events
- Deployment logs
- AI execution logs

Sensitive data must be redacted.

---

# 14. Scaling

Frontend: - Global CDN - Automatic scaling

Backend: - Horizontal autoscaling - Async processing

Database: - Indexed queries - Batched writes

AI: - Parallel agent execution - Cached retrieval

---

# 15. Backup & Recovery

- Scheduled Firestore exports
- Storage backups
- Infrastructure versioning
- Tested recovery procedures

Recovery objectives should be documented and periodically validated.

---

# 16. Production Readiness Checklist

Before launch:

- Security review complete
- Performance benchmarks met
- Monitoring enabled
- Alerts configured
- Backups verified
- Secrets rotated
- Documentation updated
- Rollback tested

---

# 17. Future Enhancements

- Blue/Green deployments
- Canary releases
- Multi-region deployment
- Kubernetes migration
- Global edge inference

---

# 18. Canonical Rules

1.  Production deployments are fully automated through CI/CD.
2.  Secrets are managed externally.
3.  Every deployment is observable.
4.  Rollbacks must be fast and repeatable.
5.  All environments remain isolated.
6.  Infrastructure changes are version-controlled.
7.  High availability and security take precedence over release speed.

This document is the official deployment architecture specification for
FounderHQ.
