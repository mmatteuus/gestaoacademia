# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Read first

`AGENTS.md` at the repo root is the source of truth for product intent, visual direction and the rules agents must follow (e.g. "ficha do aluno é o centro operacional", responsável não é página independente, obrigatoriedade do footer "Desenvolvido por MtsFerreira", paleta preto + vermelho intenso). Read it before any non-trivial change.

## Commands

Frontend (Vite + React, port 8080):
- `npm run dev` — start Vite dev server
- `npm run build` — production build into `dist/`
- `npm run preview` — preview the built bundle
- `npm run lint` — ESLint on the whole repo

Backend (Express + Google Sheets, port 3000):
- `npm run dev:server` / `npm start` — run `server.js`
- `npm run seed` — run `seed.js` (sample insert via `index.js`)
- `node scripts/healthcheck.js` — auth + list all 13 tabs on the live spreadsheet

Tests (two separated Vitest configs):
- `npm test` — frontend tests (jsdom, `src/**/*.{test,spec}.{ts,tsx}`) using `vitest.config.ts`
- `npm run test:backend` — real Google Sheets integration tests (node env, only `integration.test.js`) using `vitest.backend.config.js`
- `npm run test:all` — runs both
- Single frontend test: `npx vitest run src/path/to/file.test.tsx`
- Single backend test: `npx vitest run --config vitest.backend.config.js -t "insere nova linha"`

Backend tests hit the real spreadsheet — they write real rows with `id` prefix `it_`. Credentials come from `.env` (`SPREADSHEET_ID`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`). See `.env.example`.

## Architecture

Two apps share the repo: a React admin frontend and an Express API backed by Google Sheets. They are decoupled — the frontend today renders from mocks/adapters, not from the API. Reconnecting them is a known next step but not yet wired.

### Frontend (`src/`)
- Entry: `src/main.tsx` → `src/App.tsx`. Routes live in `App.tsx` using `react-router-dom`. The app wraps everything in `QueryClientProvider` + three domain providers (`AcademiaDataProvider`, `OperacionalDataProvider`, `InsightsDataProvider`) inside an `AdminLayout`.
- `src/pages/` — route-level pages (Dashboard, Alunos, Turmas, Frequencia, Graduacao, Ranking, Campeonatos, Financeiro, FinanceiroGerencial, Produtos, Aluguel, Relatorios, NotFound).
- `src/features/<domain>/` — domain-scoped state providers and feature components (academia, alunos, insights, operacional, produtos, responsaveis, turmas).
- `src/services/` — domain boundary:
  - `contracts/*.contract.ts` — Zod/TS contracts for each entity (aluno, turma, financeiro, frequencia, graduacao, campeonato, produto, venda, aluguel, responsavel).
  - `queries/`, `adapters/`, `mocks/` — seams for swapping mocks for real API calls later.
- `src/components/ui/` — shadcn/ui primitives. Domain-level components live in `src/components/{layout,forms,shared}/`.
- Path alias: `@/*` → `src/*` (configured in `vite.config.ts`, `tsconfig.app.json`, and `components.json`).
- Styling: Tailwind + tokens. Visual identity is prescribed in AGENTS.md (preto profundo + vermelho intenso + cinzas grafite). Respect `prefers-reduced-motion`.

### Backend (`index.js` + `server.js`)
- `index.js` is the Sheets data layer. `SHEET_CONFIG` maps 13 entity types → tab name + ordered header columns: **Alunos, Financeiro, Aulas, Frequencia, Ranking, Turmas, Graduacao, Campeonatos, Medalhas, Produtos, Vendas, Aluguel, Professores**. Public API: `listRows(type)`, `getRowById(id, type)`, `insertRow(data)`, `updateRow(id, data, type)`.
  - `insertRow` calls `detectSheetType(data)` to auto-route by field shape (e.g. `plano`→Alunos, `nome_aula`→Aulas, `faixa_atual`→Graduacao). You can override with `data.sheet_type`.
  - `ensureSheetExists` auto-creates the tab with headers on first use, so missing tabs self-heal.
  - OAuth is initialized at module load via `oauth2Client` (refresh token flow).
- `server.js` is a thin Express layer over `index.js`: `GET/POST /rows`, `GET/PUT /rows/:id` (both accept `?type=<tab>`), `GET /status`. When `process.env.VERCEL` is set, `app.listen` is skipped and the app is exported for the serverless runtime.

### Deploy (Vercel)
`vercel.json` uses a dual-build: `@vercel/static-build` produces `dist/` from `npm run vercel-build`; `@vercel/node` wraps `server.js`. Routes split by prefix — `/rows*` and `/status` go to the API, everything else falls through `filesystem` then SPA-fallbacks to `/index.html`. Any new API route must be added to `vercel.json` `routes` or it will be swallowed by the SPA fallback.

### Git state caveat
On `main` the frontend source was once removed (commit `fba87f4`) and later restored. If `src/` ever appears empty again, the last good snapshot is commit `181261d`. The `dist/` build in the repo is checked in and must be kept in sync with source when deploying, since the Vercel build runs `vite build` again anyway but the checked-in `dist/` is the historical record.
