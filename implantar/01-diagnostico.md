# 01 — Diagnóstico

## FATO

### Stack observada

- O frontend atual usa React + Vite + TypeScript + Tailwind + React Router.
- O projeto já utiliza React Hook Form, Zod, TanStack Query e componentes de layout reutilizáveis.
- Existe `AdminLayout` com `AppSidebar`, `AppTopbar` e `AppFooter`.
- O frontend possui várias páginas por módulo em `src/pages`.
- Há uso de mocks para alimentar a UI.

### Estado funcional observado

- O sistema já possui páginas para dashboard, alunos, turmas, frequência, graduação, ranking, campeonatos, financeiro, financeiro gerencial, produtos, aluguel e relatórios.
- Existe uma página de responsáveis implementada no repositório.
- O formulário de aluno já contempla `responsavelId` opcional.
- O aluno já possui contato próprio.
- O responsável já possui contato próprio.

### Problemas identificados

1. O módulo de responsáveis existia desacoplado do fluxo principal de navegação.
2. O vínculo aluno ↔ responsável ainda está dependente de mock e comportamento parcial.
3. O formulário de aluno ainda usa sentinela de valor em vez de normalização de contrato.
4. O TypeScript está permissivo demais para uma evolução segura.
5. A estrutura ainda não está pronta para encaixe limpo em monorepo.
6. As páginas ainda concentram lógica demais e ainda importam dados muito perto da camada visual.

## SUPOSIÇÃO

- O backend futuro será introduzido por API HTTP ou BFF.
- O frontend deve permanecer em React, sem reconstrução total imediata.
- O objetivo é preservar a base visual atual e consolidar a camada de domínio.

## [PENDENTE]

- Contrato oficial do backend.
- Regras finais de financeiro gerencial.
- Regras finais de relatórios exportáveis.
- Regras finais de ranking e graduação.

## Riscos

### RISCO P0 — vínculo aluno ↔ responsável inconsistente
**Impacto:** cadastro incompleto, dificuldade de integração, comportamento divergente.
**Ação:** padronizar entidade, formulário, DTO e adaptadores.

### RISCO P0 — formulários sem padrão único por domínio
**Impacto:** manutenção cara e retrabalho na integração.
**Ação:** RHF + Zod + payload normalizado.

### RISCO P0 — tipagem frouxa
**Impacto:** regressões silenciosas.
**Ação:** subir rigidez gradualmente até strict.

### RISCO P1 — UI acoplada a mock
**Impacto:** troca para backend vira refatoração espalhada.
**Ação:** criar camada `services/contracts/adapters/mocks`.

### RISCO P1 — estrutura não preparada para monorepo
**Impacto:** migração futura com conflito de responsabilidades.
**Ação:** introduzir `features` e serviços por domínio agora.
