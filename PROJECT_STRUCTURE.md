# Project Structure Guide

This project currently uses a minimal Cloudflare Worker setup.  
No existing files were changed.

## Current Core Files

```text
src/
  index.ts
test/
  index.spec.ts
```

## Suggested Scalable Structure

Use this structure as the project grows:

```text
src/
  index.ts              # Worker entrypoint
  handlers/             # Request handlers
  routes/               # Route definitions
  services/             # Business logic
  lib/                  # Shared utilities/helpers
  types/                # Shared TypeScript types
test/
  unit/                 # Unit tests
  integration/          # Integration tests
public/                 # Static assets (if needed)
```

## File Placement Rules

1. Keep `src/index.ts` as the top-level entrypoint only.
2. Move request-specific logic into `src/handlers`.
3. Keep reusable logic in `src/services` and `src/lib`.
4. Mirror test layout with feature-focused test files under `test/unit` and `test/integration`.
