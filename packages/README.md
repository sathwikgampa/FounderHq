# `/packages` Directory

## Overview

The `/packages` directory contains shared modules, libraries, design components, types, and configurations consumed across apps (`apps/web`, `apps/api`) and external tooling.

## Sub-Packages

- **`ui/`**: Shared shadcn/ui React components, Tailwind styling primitives, and design tokens.
- **`types/`**: Shared TypeScript contracts, entity types, API request/response DTOs, and event models.
- **`shared/`**: Common utility functions, validators, date helpers, and constants.
- **`config/`**: Monorepo configuration presets for ESLint, TypeScript, and Tailwind.

## Directives

1. Packages must be stateless and pure wherever possible.
2. Code inside `/packages` must be strictly typed and unit-tested.
