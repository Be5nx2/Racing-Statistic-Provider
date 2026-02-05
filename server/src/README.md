# Server – Domain Driven Layout

The server is organized in three domains:

| Domain | Role | Depends on |
|--------|------|------------|
| **library/tools** | Shared utilities (logger, env, helpers). No business logic. | — |
| **services** | Business logic. Pure functions and types. | library/tools |
| **endpoints** | HTTP layer: Express routes, call services, format responses. | services, library/tools |

- **Bootstrap** (`index.ts`): creates Express app, applies middleware, registers endpoints, starts server.
- **Dependencies flow**: `endpoints` → `services` → `library/tools`. No reverse dependency (e.g. services do not import from endpoints).
