# 03 — Arquitetura Alvo

## Objetivo

Preparar o frontend atual para futura entrada em monorepo, sem exigir migração completa do repositório agora.

## Direção obrigatória

A evolução deve aproximar o frontend da estrutura abaixo:

```txt
apps/
  web/
    src/
      pages/
      features/
        alunos/
        responsaveis/
        turmas/
        financeiro/
        produtos/
        aluguel/
        relatorios/
      services/
        contracts/
        adapters/
        mocks/
        queries/
      components/
        ui/
        layout/
        shared/
        forms/
      hooks/
      lib/
      stores/
      styles/
      types/
      test/
```

## Regra prática para agora

Sem quebrar a aplicação atual, o executor deve seguir a ordem:

### Fase 1 — estabilizar rotas e layout
- manter `src/pages` como entrypoint de rota;
- manter `AdminLayout`;
- manter footer obrigatório.

### Fase 2 — separar domínio da página
- criar `src/features/<dominio>`;
- mover schemas, forms, services e types para o domínio;
- deixar `pages/*` apenas como composição visual.

### Fase 3 — separar dados da UI
Criar:

```txt
src/services/contracts
src/services/adapters
src/services/mocks
src/services/queries
```

### Fase 4 — compatibilizar com monorepo
- preservar imports absolutos `@/`;
- reduzir dependência de arquivo mock direto dentro de tela;
- consolidar estrutura que possa ser movida depois para `apps/web`.

## Convenções obrigatórias

- `pages/*` = rota.
- `features/*` = domínio.
- `components/shared/*` = reutilização transversal.
- `components/ui/*` = primitives.
- `services/contracts/*` = DTOs e interfaces externas.
- `services/adapters/*` = transformação entre mock/API/form/view model.
- `services/mocks/*` = dados fake.
- `services/queries/*` = acesso assíncrono.

## O que não fazer

- Não inventar uma pasta monorepo falsa no estado atual.
- Não mover tudo de uma vez.
- Não colocar regra de negócio dentro de `pages`.
- Não acoplar contrato futuro da API ao componente visual.
