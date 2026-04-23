# CONTEXT.md

Fonte única de contexto do projeto para onboarding técnico e de produto.

## 1) Produto (escopo atual)
- Sistema administrativo da academia de artes marciais.
- Foco desta fase: **PWA app-first** (sem trilha nativa Android/iOS via Capacitor).
- Usuário-alvo atual: 1 administrador (v1).
- Prioridade: operação rápida, clara e confiável no mobile e desktop.

## 2) Stack e arquitetura
- Frontend: React 18 + TypeScript + Vite + Tailwind + Radix UI.
- Estado/dados: TanStack Query com persistência local e modo offline-first.
- Backend: Express (API para Google Sheets).
- Estrutura principal:
  - `src/pages`: telas de negócio.
  - `src/components`: layout, UI e componentes compartilhados.
  - `src/features`: providers e regras por domínio.
  - `backend/src`: middlewares, controllers, services e integração Sheets.

## 3) Módulos cobertos
- Dashboard
- Alunos
- Turmas
- Frequência
- Graduação
- Ranking
- Campeonatos
- Financeiro escolar
- Financeiro gerencial
- Produtos/estoque/vendas
- Aluguel
- Relatórios
- Cadastro público de aluno (`/cadastro/aluno`)

## 4) Regras de UX/Produto já fechadas
- Ficha do aluno é centro operacional.
- Responsável é tratado no contexto do aluno (não como módulo independente).
- Visual premium dark/red da marca.
- Rodapé obrigatório com:
  - texto: `Desenvolvido por MtsFerreira`
  - link: `https://MtsFerreira.dev` (nova aba + `rel` seguro)

## 5) PWA (iOS + Android)
- Manifest e Service Worker ativos via `vite-plugin-pwa`.
- Caching runtime para leitura e fila offline para escrita (Background Sync).
- Indicadores de online/offline e invalidação de cache ao reconectar.
- Botão de instalação:
  - prompt nativo quando `beforeinstallprompt` disponível;
  - fallback com instrução manual para iOS/Android quando não disponível.

## 6) Segurança (backend)
- Sanitização anti-formula injection para escrita em Sheets.
- CORS com allowlist e bloqueio de origem inválida.
- Rate limiting global + mutações.
- API key com comparação em tempo constante.
- Fail-closed em produção quando `API_KEY` não está configurada (exceto rotas públicas e `/status`).
- Headers de segurança: `nosniff`, `DENY`, `HSTS` (prod), `Permissions-Policy`, `CSP` restritiva para API, `COOP`, `CORP`.

## 7) Contratos e rotas
- Mantidos:
  - `/rows`
  - `/status`
  - `/api/*`
- Endpoint público:
  - `POST /api/public/aluno-cadastro`

## 8) Comandos de operação e qualidade
- Dev frontend: `npm run dev`
- Build: `npm run build`
- Testes frontend unit: `npm test`
- Testes backend: `npm run test:backend`
- E2E: `npx playwright test`

Gates mínimos antes de entrega:
- `npx vitest run --config vitest.backend.config.js backend.audit.test.js`
- `npm test`
- E2E mobile (`mobile` + `mobile-ui`)
- Build sem erro (`npm run build`)

## 9) Status atual de qualidade (baseline recente)
- Backend tests: passando.
- Front unit tests: passando.
- E2E desktop/mobile: passando (com 1 skip esperado em cenário sem botão “Novo”).
- Build: passando.
- `npm audit --omit=dev`: sem vulnerabilidades runtime.

## 10) Decisões de implementação (não quebrar)
- Não iniciar trilha nativa nesta etapa.
- Manter tema claro/escuro.
- Sem quebra de payload/contrato backend existente.
- Evolução incremental com foco em estabilidade e UX mobile.
