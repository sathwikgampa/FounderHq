# Development Guide & Guidelines

## 1. Local Environment Requirements

- **Node.js**: `v20.x` or higher
- **pnpm**: `v9.x` or higher (`npm i -g pnpm`)
- **Python**: `3.12.x`
- **Docker**: Desktop / Engine with Compose support

---

## 2. Developer Workflow

### Monorepo Commands

| Command          | Description                                            |
| ---------------- | ------------------------------------------------------ |
| `pnpm dev`       | Starts web app and API server concurrently in dev mode |
| `pnpm build`     | Compiles all monorepo apps and packages                |
| `pnpm lint`      | Runs ESLint on frontend and Ruff on backend            |
| `pnpm format`    | Formats all code with Prettier & Black                 |
| `pnpm typecheck` | Validates TypeScript across all packages               |
| `pnpm test`      | Runs frontend Vitest and backend pytest                |

---

## 3. Frontend Development Guidelines (`apps/web`)

- **Strict TypeScript**: Never use `any`. Define interfaces in `@founderhq/types` or local `*.types.ts`.
- **Feature-First**: Group routes and components under feature modules (e.g., `features/auth/`, `features/dashboard/`).
- **Form Handling**: Use `React Hook Form` paired with `Zod` schemas.
- **Components**: Prefer shadcn components located in `components/ui/`.

---

## 4. Backend Development Guidelines (`apps/api`)

- **Type Annotations**: Every function signature must have explicit return and argument types.
- **Pydantic v2**: All API input and output payloads must use Pydantic models.
- **Repository Pattern**: Database operations must go through repository classes (`app/repositories`).
- **Dependencies**: Use `FastAPI.Depends` for passing DB session, current user, or workspace context.
