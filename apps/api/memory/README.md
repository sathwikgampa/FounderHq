# Startup Memory Module (`apps/api/memory`)

## Overview

Startup Memory persistence layer for tracking active session context, long-term goals, decision logs, execution history, and startup health scores.

## Modules

- `long_term.py`: Long-term memory store
- `short_term.py`: Short-term active conversation context
- `history.py`: Operational execution history
- `decisions.py`: Founder decision log
- `health.py`: Startup health metrics pipeline
- `manager.py`: Memory manager coordinator
