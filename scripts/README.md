# `/scripts` Directory

## Overview

Utility and automation scripts for development setup, database migrations, seed scripts, and environment health diagnostics.

## Available Utility Scripts

- `setup-dev.sh`: Automated developer environment bootstrap.
- `validate-env.sh`: Validates local `.env` variables against production schemas.
- `firebase-emulator.sh`: Starts local Firebase Emulators (Auth, Firestore, Storage).

## Directives

1. Utility scripts should be executable (`chmod +x`).
2. Never hardcode secrets or credentials in scripts; consume from environment.
