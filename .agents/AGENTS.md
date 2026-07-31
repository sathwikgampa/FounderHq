# Workspace Rules for FounderHQ

## Commit Message Standards

Whenever performing or suggesting a Git commit:

1. Always generate a clear, meaningful, and descriptive commit message using the Conventional Commits specification format: `<type>(<scope>): <short description>`.
2. Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`.
3. Examples:
   - `feat(api): add startup team ADK multi-agent orchestrator`
   - `fix(ci): add backend dependencies and scope pytest execution`
   - `chore(deps): update pre-commit hooks and Husky configuration`
4. Avoid generic commit messages like "error fixed", "update", or "add of agents".
