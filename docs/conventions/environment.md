# Environment & build

This document details how environment variables are configured and consumed in Vite, and how the app is built and deployed.

---

## Reference implementations
- [config/env.ts](../../src/config/env.ts) — The typed `ENV` object and environment resolution.
- [vite.config.ts](../../vite.config.ts) — `envPrefix`, path alias, plugins (Tailwind v4, React + React Compiler preset).
- [scripts/prepare-pages.mjs](../../scripts/prepare-pages.mjs) — GitHub Pages artifacts (SPA fallback, CNAME).

---

## The `ENV` object

We never read `import.meta.env` directly in application code (except in `src/config/env.ts`). Instead, we import the strongly-typed `ENV` object, which exposes exactly two keys:

```ts
import { ENV } from "@/src/config/env";

ENV.API_URL; // resolved backend base URL (used by features/api.ts)
ENV.ENVIRONMENT; // TEnvironment: "dev" | "prod" | "local"
```

Resolution logic in `env.ts`:
- `ENVIRONMENT` comes from `VITE_ENV`, falling back to Vite's `MODE`, normalized via a map (`development` → `dev`, `production` → `prod`, anything unknown → `local`).
- `API_URL` prefers `VITE_API_URL`; otherwise `prod` uses `VITE_API_PRODUCTION_URL` and every other environment uses `VITE_API_DEVELOPMENT_URL` (with cross-fallbacks).

Real consumers: [features/api.ts](../../src/features/api.ts) (`baseURL`) and [components/env-flag/env-flag.tsx](../../src/components/env-flag/env-flag.tsx) (corner ribbon shown outside `prod`).

## Variables and env files

`vite.config.ts` sets `envPrefix: ["VITE_", "EXPO_PUBLIC_"]`. Only `VITE_` variables are used today; `EXPO_PUBLIC_` is accepted for compatibility with shared cross-platform code but no such variable currently exists.

Variables in use:
- `VITE_API_URL`
- `VITE_API_DEVELOPMENT_URL`
- `VITE_API_PRODUCTION_URL`
- `VITE_ENV`
- `VITE_GEOAPIFY_API_KEY` — read directly via `import.meta.env` in `components/location-autocomplete/location-autocomplete.tsx` (known exception to the `ENV` rule) and currently missing from [.env.example](../../.env.example).

Env files: `.env.development` and `.env.production` are selected by Vite's `--mode` flag. `.gitignore` excludes `.env*` except `.env.example`, which is the only committed template.

## Scripts

- `npm run dev`: `vite --mode development` — local dev server with `.env.development`.
- `npm run dev:prod`: `vite --mode production` — local dev server with `.env.production`.
- `npm run build`: `tsc -b && vite build --mode production` — type-check plus production bundle.
- `npm run build:dev`: same, with `--mode development`.
- `npm run build:pages`: `build` + `node scripts/prepare-pages.mjs`, which copies `dist/index.html` to `dist/404.html` (SPA fallback for GitHub Pages), writes `CNAME` (`painel.tableforge.com.br`) and `.nojekyll`.
- `npm run deploy`: `gh-pages -d dist` (runs `build:pages` first via `predeploy`).
- `npm run lint`: ESLint only (no type-check).
- `npm run preview`: serves the built bundle.

## Rules

1. **Commit the example**: Always add new variables to `.env.example` so other developers know they exist.
2. **Never commit secrets**: `.env.development` and `.env.production` must remain ignored (`.gitignore` has `.env*` with `!.env.example`).

## What NOT to do
- **Don't scatter `import.meta.env` checks**: Consolidate environment logic inside `config/env.ts`. The Geoapify key read in `location-autocomplete.tsx` is legacy — do not replicate the pattern.
- **Don't hardcode backend URLs**: Always go through `ENV.API_URL`.
