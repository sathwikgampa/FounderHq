# Google ADK Agent Framework (`apps/api/agents`)

## Overview

This directory houses the Google ADK multi-agent executive sub-system as specified in `docs/06_FOLDER_STRUCTURE.md`.

## Structure

Each executive agent directory contains:

- `agent.py`: Agent definition & ADK setup
- `prompt.py`: System prompt & persona
- `tools.py`: Tool definitions
- `schemas.py`: Tool input/output schemas
- `memory.py`: Agent-specific context memory
