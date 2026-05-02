# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Critical framework note
- This project uses Next.js 16.x with potentially breaking differences from older conventions.
- Before changing framework-level behavior, review the relevant docs under `node_modules/next/dist/docs/` and heed deprecation notices.

## Development commands
- Install dependencies: `bun install`
- Start dev server: `bun run dev`
- Build production bundle: `bun run build`
- Start production server: `bun run start`
- Lint: `bun run lint`
- Type-check (no emit): `bunx tsc --noEmit`

## Tests
- There is currently no test script in `package.json` and no test files in the repository.
- If adding tests with Bun’s runner, use:
  - Run all tests: `bun test`
  - Run a single test file: `bun test path/to/file.test.ts`

## High-level architecture
- App type: Next.js App Router dashboard that visualizes local OpenCode CLI usage and model cost comparisons.
- Entry layout: `app/layout.tsx` wires global styles/fonts and shared top navigation.
- Primary pages:
  - `app/page.tsx` (Dashboard overview + token and tool visualizations)
  - `app/compare/page.tsx` (cross-model cost comparison)
  - `app/tools/page.tsx` (tool usage analysis and ranking)
- Data API:
  - `app/api/stats/route.ts` is the single backend data source.
  - It executes `opencode stats` via `child_process.exec`, parses terminal output, and returns normalized JSON.
  - It implements an in-memory 30-minute cache with optional bypass via `?refresh=true`.
- Parsing and domain logic:
  - `lib/parsers.ts` converts raw CLI text into typed stats sections (overview, costs/tokens, tools).
  - `lib/pricing.ts` contains model pricing constants and cost computation/comparison helpers.
- Shared types:
  - `types/index.ts` defines `OpenCodeStats`, tool usage, and pricing model interfaces.
- UI composition:
  - Page-level client components fetch `/api/stats` directly and pass data into presentational components in `components/stats/*`.
  - `components/ui/*` is shadcn-based UI primitives (`components.json` uses `base-nova` style, `rsc: true`).

## Practical implementation notes
- Most analytics pages duplicate the same client-side fetching/loading/error/cache-state logic; shared hooks/utilities are a good refactor target.
- The API parser relies on regex against CLI output format; if `opencode stats` output changes, update `lib/parsers.ts` first.
- Cache is process-memory only; restart clears cache and there is no persistence across deployments.
