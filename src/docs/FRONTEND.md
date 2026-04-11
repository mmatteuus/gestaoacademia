# Dojo Manager — Frontend Admin System

## Visão Geral
Sistema administrativo premium para academia de artes marciais. Frontend-only com dados mockados, preparado para integração futura com backend.

## Estrutura
```
src/
├── components/
│   ├── layout/          # AdminLayout, AppSidebar, AppTopbar, AppFooter
│   ├── shared/          # KpiCard, StatusBadge, PageHeader, EmptyState
│   └── ui/              # shadcn components
├── mocks/
│   └── data.ts          # Dados mockados realistas
├── pages/               # Páginas por módulo
├── types/
│   └── index.ts         # TypeScript types para todo o domínio
└── docs/
    └── FRONTEND.md      # Este arquivo
```

## Módulos
1. **Dashboard** — KPIs, gráficos, alertas, atividades recentes
2. **Alunos** — CRUD, filtros, paginação, drawer de detalhes
3. **Responsáveis** — Lista com alunos vinculados
4. **Turmas** — Cards com ocupação visual
5. **Frequência** — Lançamento por sessão, filtro por turma
6. **Graduação** — Progresso, regras, histórico, status visual
7. **Ranking** — Leaderboard por categoria com variação
8. **Campeonatos** — Lista com participantes e medalhas
9. **Financeiro Escolar** — Cobranças com filtros por status
10. **Financeiro Gerencial** — Fluxo de caixa, receitas vs despesas
11. **Produtos & Vendas** — Catálogo, estoque, histórico
12. **Aluguel** — Reservas com conflitos, contratos
13. **Relatórios** — Gráficos analíticos por módulo

## Como trocar mocks por API real
1. Crie serviços em `src/services/` que façam fetch para a API
2. Substitua os imports de `@/mocks/data` pelos serviços
3. Use React Query para gerenciar cache e loading states
4. Os tipos em `src/types/` já representam o schema esperado

## Design System
- Paleta: preto profundo, vermelho intenso, cinza grafite
- Tokens em `index.css` com variáveis CSS HSL
- Componentes shadcn customizados
- Animações: fade-in, shimmer, pulse-glow

## Acessibilidade
- Estrutura semântica com headings hierárquicos
- Focus visible em todos os elementos interativos
- Contraste adequado (WCAG AA)
- Suporte a reduced-motion
- Labels descritivos

## Próximos Passos
- [ ] Integração com backend (Supabase ou API REST)
- [ ] Autenticação real
- [ ] CRUD completo com persistência
- [ ] Notificações em tempo real
- [ ] Exportação de relatórios (PDF/CSV)
- [ ] Modo offline
