# Product Requirements - Gêmeos Academia Frontend

## 1. Visão do Produto

**Nome**: Sistema de Gestão Gêmeos Academia  
**Tipo**: Painel administrativo interno (SPA)  
**Usuário-alvo**: Administrador único da academia de artes marciais  
**Stack**: React + TypeScript + Vite + Tailwind + shadcn/ui

## 2. Objetivos do Frontend

### Objetivo Principal
Gerenciar operações da academia de artes marciais sem necessidade de backend imediato.

### Objetivos Específicos
- Cadastro e gestão de alunos
- Controle de turmas e frequência
- Gestão de mensalidades e cobranças
- Controle de graduação (faixas)
- Registro de vendas de produtos
- Agendamento de espaços para aluguel
- Relatórios e métricas

## 3. Requisitos Funcionais

### 3.1 Módulo de Alunos
- [ ] CRUD completo de alunos
- [ ] Filtro por status (ativo, inadimplente, trancado, inativo)
- [ ] Busca por nome
- [ ] Paginação
- [ ] Visualização de detalhes em drawer
- [ ] Edição inline

### 3.2 Módulo de Responsáveis
- [ ] CRUD de responsáveis
- [ ] Vinculação com alunos menores
- [ ] Busca por nome

### 3.3 Módulo de Turmas
- [ ] CRUD de turmas
- [ ] Lista de alunos por turma
- [ ] Indicador de ocupação

### 3.4 Módulo de Frequência
- [ ] Registro de presença por aula
- [ ] Histórico de presenças
- [ ] Heatmap de frequência

### 3.5 Módulo de Graduação
- [ ] Regras de graduação por faixa
- [ ] Progressão de alunos
- [ ] Status de elegibilidade

### 3.6 Módulo de Campeonatos
- [ ] CRUD de eventos
- [ ] Inscrição de alunos
- [ ] Registro de resultados

### 3.7 Módulo de Ranking
- [ ] Ranking por categoria
- [ ] Evolução por temporada

### 3.8 Módulo Financeiro
- [ ] Lista de cobranças
- [ ] Registro de pagamentos
- [ ] Filtros por status
- [ ] Métricas (total aberto, total vencido)

### 3.9 Módulo Financeiro Gerencial
- [ ] Receitas vs Despesas
- [ ] Métricas de lucro
- [ ] Gráficos temporais

### 3.10 Módulo de Produtos
- [ ] CRUD de produtos
- [ ] Controle de estoque
- [ ] Carrinho de compras
- [ ] Registro de vendas
- [ ] Alertas de estoque baixo

### 3.11 Módulo de Aluguel
- [ ] Reserva de espaços
- [ ] Contratos de aluguel
- [ ] Calendário de reservas

### 3.12 Módulo de Relatórios
- [ ] Relatórios diversos
- [ ] Exportação (PDF/Excel) - [PENDENTE]

## 4. Requisitos Não-Funcionais

### 4.1 Performance
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Bundle size < 500KB gzipped

### 4.2 Acessibilidade
- WCAG 2.1 AA
- Keyboard navigation completa
- Reduced motion support
- Contraste mínimo 4.5:1

### 4.3 Responsividade
- Mobile: 320px - 639px
- Tablet: 640px - 1023px
- Desktop: 1024px - 1399px
- Large: 1400px+

### 4.4 Segurança
- CSP configured
- No sensitive data in mocks
- Sanitized inputs

### 4.5 SEO
- Title tags por página
- Meta descriptions
- Semantic HTML

## 5. Stack Tecnológico

| Componente | Tecnologia |
|------------|------------|
| Framework | React 18 |
| Language | TypeScript 5 |
| Build | Vite 5 |
| Styling | Tailwind CSS |
| UI | shadcn/ui |
| State | React Query + useState |
| Routing | React Router 6 |
| Charts | Recharts |
| Icons | Lucide React |
| Toast | Sonner |

## 6. Estrutura de Pastas

```
src/
├── components/
│   ├── forms/
│   ├── layout/
│   ├── shared/
│   └── ui/
├── hooks/
├── lib/
├── mocks/
├── pages/
├── types/
└── App.tsx
```

## 7. Funcionalidades Obrigatórias do Footer

Todas as páginas devem exibir:
```jsx
<footer className="border-t border-border px-4 py-3 text-center shrink-0">
  <p className="text-xs text-muted-foreground">
    Desenvolvido por{' '}
    <a
      href="https://MtsFerreira.dev"
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline font-medium"
    >
      MtsFerreira
    </a>
  </p>
</footer>
```

## 8. Out of Scope

- Sistema de autenticação
- Backend API
- Multi-tenant
- App mobile nativo
- App público (somente admin)
- Notificações push
- Emails transacionais

---

## [PENDENTE]

- Validar se RelatóriosPage tem funcionalidades reais
- Confirmar se FrequenciaPage tem CRUD completo
- Verificar se FinanceiroGerencialPage tem gráficos
- Decidir se implementação de busca global é necessária
- Definir se lazy loading deve ser por página ou por componente
