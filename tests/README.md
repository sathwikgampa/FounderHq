# `/tests` Directory

## Overview

Root testing orchestrator and cross-cutting integration/E2E test suites for FounderHQ.

## Test Suites Included

- **`e2e/`**: Playwright browser-level user journey and UI automation tests.
- **`integration/`**: Cross-service API and Firebase emulator integration tests.

## Running Tests

- Frontend Unit/Component: `pnpm --filter web test`
- Backend Unit/Integration: `pytest apps/api`
- End-to-End: `pnpm test:e2e`
