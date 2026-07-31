# Contribution & Quality Guidelines

## 1. Commit Conventions (Conventional Commits)

All commit messages must strictly adhere to the Conventional Commits specification:

- `feat(scope)`: A new feature
- `fix(scope)`: A bug fix
- `docs(scope)`: Documentation only changes
- `style(scope)`: Formatting, missing semi-colons, no code change
- `refactor(scope)`: A code change that neither fixes a bug nor adds a feature
- `test(scope)`: Adding or updating tests
- `chore(scope)`: Maintenance tasks, dependencies, build configs

_Example:_ `feat(auth): implement firebase jwt verification middleware`

---

## 2. Pull Request Workflow

1. Create a feature branch: `git checkout -b feat/your-feature-name`
2. Ensure pre-commit hooks pass (`lint-staged`)
3. Run tests locally (`pnpm test` & `pytest`)
4. Submit PR targeting `main`
5. CI workflow must pass all checks (Lint, Typecheck, Build, Tests)
