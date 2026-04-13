# Testing Strategy

## Stack

- **Unit**: Vitest
- **Component**: React Testing Library
- **E2E**: [PENDENTE] Playwright
- **A11y**: [PENDENTE] axe-core

## Estrutura de Testes

```
src/
├── __tests__/
│   ├── components/
│   │   ├── StatusBadge.test.tsx
│   │   ├── EmptyState.test.tsx
│   │   └── KpiCard.test.tsx
│   ├── pages/
│   │   ├── DashboardPage.test.tsx
│   │   └── AlunosPage.test.tsx
│   └── hooks/
│       └── useToast.test.ts
└── test/
    ├── setup.ts
    └── example.test.ts
```

## Cobertura Atual

- [PENDENTE] < 5%

## Meta

- Curto prazo: > 30%
- Médio prazo: > 60%

## Testes Prioritários

1. StatusBadge rendering
2. EmptyState rendering
3. KpiCard calculations
4. AlunosPage CRUD smoke
5. Navigation smoke
