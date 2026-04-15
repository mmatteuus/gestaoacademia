# 06 — Plano de Execução

## Regra

Executar em ordem. Não pular etapas. Não abrir refatorações paralelas fora deste plano.

---

## ETAPA 0 — Correções imediatas seguras

### TASK-000
**Objetivo:** garantir acesso ao módulo de responsáveis.

Executar:
1. manter rota `/responsaveis` no router principal;
2. manter item `Responsáveis` no menu lateral;
3. validar navegação desktop e mobile.

### TASK-001
**Objetivo:** padronizar footer obrigatório.

Executar:
1. manter rodapé no layout principal;
2. usar URL exata `https://mtsferreira.dev`;
3. manter `target="_blank"` e `rel="noopener noreferrer"`.

---

## ETAPA 1 — Preparar base para monorepo

### TASK-010
Criar as pastas:

```txt
src/features
src/services/contracts
src/services/adapters
src/services/mocks
src/services/queries
```

### TASK-011
Introduzir domínio por feature sem quebrar páginas atuais.

### TASK-012
Parar de importar mock bruto diretamente de dentro das páginas principais.

---

## ETAPA 2 — Fechar domínio de alunos e responsáveis

### TASK-020
Criar `features/alunos` com:
- `schemas/aluno.schema.ts`
- `forms/AlunoForm.tsx`
- `types/aluno.types.ts`
- `services/alunos.service.ts`
- `adapters/alunos.adapter.ts`

### TASK-021
Criar `features/responsaveis` com:
- `schemas/responsavel.schema.ts`
- `forms/ResponsavelForm.tsx`
- `types/responsavel.types.ts`
- `services/responsaveis.service.ts`
- `adapters/responsaveis.adapter.ts`

### TASK-022
Refatorar o fluxo de aluno para:
- escolher responsável existente;
- permitir nenhum responsável;
- permitir criação rápida de responsável;
- exibir contato do responsável;
- normalizar `responsavelId` final.

### TASK-023
Refatorar a tela de responsável para:
- listar alunos vinculados;
- vincular aluno;
- desvincular aluno;
- refletir a relação corretamente.

---

## ETAPA 3 — Padronizar formulários restantes

### TASK-030
Padronizar `TurmaForm` no mesmo modelo.

### TASK-031
Padronizar `ProdutoForm` no mesmo modelo.

### TASK-032
Criar e padronizar forms faltantes de módulos operacionais.

---

## ETAPA 4 — Responsividade e acessibilidade

### TASK-040
Revisar todas as páginas em:
- mobile;
- tablet;
- desktop.

### TASK-041
Garantir:
- fallback de tabela para cards no mobile;
- drawers e dialogs usáveis por toque;
- foco visível;
- labels e headings corretos;
- funcionamento sem hover obrigatório.

---

## ETAPA 5 — Tipagem e qualidade

### TASK-050
Subir a rigidez do TypeScript gradualmente.

### TASK-051
Eliminar `any` das partes novas e críticas.

### TASK-052
Padronizar componentes assíncronos com `loading`, `error`, `empty`, `success`.

---

## ETAPA 6 — Contratos e integração futura

### TASK-060
Criar DTOs por domínio.

### TASK-061
Criar adaptadores mock → view model e form → payload.

### TASK-062
Criar serviços estáveis para futura troca por API.

---

## ETAPA 7 — Fechamento

### TASK-070
Executar checklist final.

### TASK-071
Registrar o que ficou concluído e o que segue [PENDENTE] por depender de backend real.
