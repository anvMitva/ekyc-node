# Migration Status

This document tracks the JavaScript → TypeScript migration across the `src/` tree.

| Module / Path | Description | Owner | Status | Last Updated | Notes |
| --- | --- | --- | --- | --- | --- |
| config | Shared configuration constants, env loading | | In Progress | 2025-10-29 | Renamed to .ts; `@ts-nocheck` added pending proper typings |
| constant | Static values and enums | | In Progress | 2025-10-29 | Renamed to .ts; `@ts-nocheck` added |
| controllers | HTTP controllers | | In Progress | 2025-10-29 | Converted to .ts with temporary `@ts-nocheck` |
| loader | Bootstrapping (DB + express) | | In Progress | 2025-10-29 | Converted to .ts; needs typing |
| logger | Logging utilities & middleware | | In Progress | 2025-10-29 | Converted to .ts; `@ts-nocheck` in place |
| middlewares | Express middleware (auth, error, etc.) | | In Progress | 2025-10-29 | Converted to .ts; `@ts-nocheck` placeholder |
| models | Sequelize & Mongoose models | | In Progress | 2025-10-29 | Converted to .ts; requires model typings |
| routes | Express routing | | In Progress | 2025-10-29 | Converted to .ts; `@ts-nocheck` placeholder |
| services | Business logic & integrations | | In Progress | 2025-10-29 | `cache.service` and `client.service` now typed; DB/provider layers still require typing |
| socket | Socket.IO integration | | In Progress | 2025-10-29 | Converted to .ts; `@ts-nocheck` placeholder |
| utils | Shared helpers (API response, crypto, etc.) | | In Progress | 2025-10-29 | `ApiError`, `ApiResponse`, `asyncHandler` migrated; remaining helpers still use `@ts-nocheck` |
| validators | Joi validation schemas | | In Progress | 2025-10-29 | Converted to .ts; `@ts-nocheck` placeholder |

## How to Update
- Update the relevant row once a folder has been migrated.
- Include any follow-up work or technical debt in the notes.
- If a folder is partially migrated, mark it as `In Progress` and describe the remaining work.
