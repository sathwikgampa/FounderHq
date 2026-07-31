# 🎓 FounderHQ – Individual Interview & Evaluation Guide

> **Hackathon Requirement (Section 6.2):**  
> _"The individual evaluation track is the primary mechanism through which internship offers will be determined... Each participant will undergo a brief individual interview during the demo round, conducted by an Axiss Group representative."_

---

## 🎯 Key Assessment Dimensions

Judges from Axiss Group will evaluate individual candidates on three core pillars:

1. **Technical Ownership & Architectural Understanding** (How deeply do you understand the codebase and system decisions?)
2. **AI System Design & Engineering Quality** (Can you articulate LLM integration, prompt engineering, multi-agent coordination, and fallbacks?)
3. **Problem Solving & Team Role** (What was your exact personal contribution, and how did you resolve engineering trade-offs?)

---

## 💬 Top Interview Questions & Recommended Answers

### 1. "Walk me through the architecture of FounderHQ and why you chose this stack."

- **Key Points to Cover:**
  - _"We built FounderHQ as a decoupled full-stack monorepo using **Turborepo** and `pnpm`."_
  - _"On the frontend, we used **Next.js 15 (App Router)** and React 19 with Tailwind CSS and Framer Motion for a dark-themed, glassmorphic UI."_
  - _"For the backend, we engineered a high-performance **FastAPI (Python 3.12)** microservice to handle asynchronous LLM orchestration with Google Gemini and specialized agent logic."_
  - _"This architecture allows independent scaling, clean type sharing across packages, and low-latency API interactions."_

### 2. "How did you implement AI integration depth (25% rubric weight)?"

- **Key Points to Cover:**
  - _"Rather than building a simple chat wrapper, FounderHQ implements an autonomous multi-agent hierarchy."_
  - _"We have a central **CEO Planner Agent** that ingests high-level founder intent and decomposes it into structured tasks."_
  - _"We created domain-specialized **Executive Agents** (Finance, Legal, HR, Marketing, Sales) with specialized prompt engineering, context memory, and structured Pydantic schema responses."_
  - _"We also integrated speech synthesis/voice interaction for intuitive natural language input."_

### 3. "What was your personal contribution to the project?"

- **Tailored Answers:**
  - **Frontend Lead:** Managed Next.js App Router, dynamic sidebar navigation, Framer Motion animations, interactive dashboard widgets, and responsive layout state.
  - **Backend / AI Lead:** Designed FastAPI routers, Pydantic data contracts, Google Gemini LLM pipelines, prompt templates, and multi-agent execution services.
  - **DevOps & Full Stack Lead:** Scaffolded Turborepo monorepo, standard ESLint/Prettier configs, Docker containers (`Dockerfile.web`, `Dockerfile.api`), Render blueprint configs, and public Vercel deployment.

### 4. "How did you handle error handling, rate limits, and fallback logic?"

- **Key Points to Cover:**
  - _"We implemented structured fallback mechanisms. If external LLM or voice APIs experience rate limits, the backend gracefully serves cached structured responses or local mock implementations without breaking the client UI."_
  - _"On the client side, React Error Boundaries and robust type-safe API service wrappers guarantee smooth user experience without full-page crashes."_

---

## 🏆 Internship Evaluation Checklist

- [ ] Be ready to present code snippets you wrote directly in your editor.
- [ ] Explain **why** architectural decisions were made, not just **what** was built.
- [ ] Emphasize production standards (type safety, monorepo setup, responsive UX, clean API boundaries).
