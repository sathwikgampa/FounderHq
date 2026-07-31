# 📌 FounderHQ – Git Commit & Contribution Strategy Guide

> **Hackathon Requirement (Section 5.4):**  
> _"Regular Git commits distributed throughout the event. Single bulk commits will be penalized."_

---

## 🎯 Commit Best Practices & Strategy

To ensure high evaluation scores and avoid any penalty for bulk commits:

1. **Commit Early & Frequently:** Make micro-commits after each feature, bug fix, or UI polishing task instead of saving all changes for one massive push.
2. **Use Conventional Commits:** Prefix commits with structured types:
   - `feat:` New feature implementation
   - `fix:` Bug fix or type error fix
   - `docs:` Documentation or README updates
   - `style:` UI, CSS, or formatting updates
   - `refactor:` Code restructuring without changing functionality
   - `test:` Unit or E2E tests
   - `ci:` Build configuration, Docker, or workflow changes

---

## 💡 Recommended Distributed Commit Workflow

If you are finalizing or organizing your project history before submission, use discrete logical commits for each module:

```bash
# 1. Monorepo architecture & setup
git add package.json pnpm-workspace.yaml turbo.json
git commit -m "chore(repo): initialize Turborepo monorepo structure"

# 2. Next.js Web Application & UI Components
git add apps/web
git commit -m "feat(web): build Next.js 15 dashboard layout and dynamic agent components"

# 3. FastAPI Backend Services & Agents
git add apps/api
git commit -m "feat(api): implement FastAPI service routes, Gemini LLM planner, and agent engines"

# 4. Shared Packages & Types
git add packages
git commit -m "feat(packages): add shared TypeScript interfaces, UI components, and config"

# 5. Deployment Configurations
git add render.yaml Dockerfile.web Dockerfile.api
git commit -m "ci(deploy): add Render blueprint and multi-stage Docker build configs"

# 6. Comprehensive Documentation & Video Script
git add README.md DEMO_SCRIPT.md DEPLOYMENT.md INTERVIEW_PREP.md
git commit -m "docs: add comprehensive README, 60s demo script, deployment guide, and interview prep"
```

---

## 🔍 Pre-Push Verification Checklist

- [x] Run `pnpm run typecheck` to confirm zero TypeScript compilation errors.
- [x] Run `pnpm --filter web build` to confirm production build succeeds without errors.
- [x] Check git status: `git status` to ensure all necessary files are tracked.
