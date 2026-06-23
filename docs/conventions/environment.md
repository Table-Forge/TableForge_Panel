# Environment & build

This document details how environment variables are configured and consumed in Vite.

---

## Reference implementations
- [config/env.ts](../../src/config/env.ts) — The typed environment object.
- [.env.example](../../.env.example) — The variable template.

---

## The `ENV` object

We never read `import.meta.env` directly in application code (except in `src/config/env.ts`). Instead, we import the strongly-typed `ENV` object.

```ts
import { ENV } from "@/src/config/env";

console.log(ENV.API_URL);
console.log(ENV.ENVIRONMENT); // "dev" | "prod" | "local"
```

## Variables

Vite requires environment variables exposed to the client to be prefixed with `VITE_`.
(Note: The project may also support `EXPO_PUBLIC_` variables for cross-platform shared code compatibility).

Key variables:
- `VITE_API_URL`
- `VITE_API_DEVELOPMENT_URL`
- `VITE_API_PRODUCTION_URL`
- `VITE_ENV`
- `VITE_GEOAPIFY_API_KEY`

## Scripts

- `npm run dev`: Starts the local dev server pointing to the development backend.
- `npm run dev:prod`: Starts the local dev server pointing to the production backend.
- `npm run build`: Builds the production bundle.
- `npm run deploy`: Deploys the built bundle to GitHub Pages.

## Rules

1. **Commit the example**: Always add new variables to `.env.example` so other developers know they exist.
2. **Never commit secrets**: `.env.development` and `.env.production` must remain in `.gitignore`.

## What NOT to do
- **Don't scatter `import.meta.env` checks**: Consolidate environment logic inside `config/env.ts`.
