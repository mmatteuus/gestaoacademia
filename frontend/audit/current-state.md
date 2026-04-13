# Current State - Frontend Audit

## FATO: Identidade e Configuração do Projeto

| Item | Estado | Evidência |
|------|--------|-----------|
| Nome no package.json | **INCORRETO** | `"vite_react_shadcn_ts"` - nome genérico de scaffold |
| Versão | OK | `"0.0.0"` |
| Scripts | OK | dev, build, lint, test configurados |
| README.md | **PLACEHOLDER** | Apenas "TODO: Document your project here" |
| TypeScript strict | **DESATIVADO** | `tsconfig.app.json`: `strict: false`, `noImplicitAny: false` |

## FATO: Arquitetura de Dados

| Item | Estado | Evidência |
|------|--------|-----------|
| Camada de mocks | **ACOPLADA** | Páginas importam `@/mocks/data` diretamente |
| Arquivo único de mocks | OK | `src/mocks/data.ts` - 217 linhas |
| Tipos TypeScript | OK | `src/types/index.ts` - 225 linhas, bem definidos |
| Validação runtime | **AUSENTE** | Nenhum uso de Zod nos formulários |
| Separação services/repositories | **AUSENTE** | Não existe |

## FATO: Páginas e Funcionalidades

| Página | Caminho | CRUD | Filtros | Busca | Paginação | Estados UI |
|--------|---------|------|----------|-------|------------|------------|
| Dashboard | `/` | N/A | N/A | N/A | N/A | loading, data |
| Alunos | `/alunos` | Create/Update | status | nome | sim | empty, loading, data |
| Responsáveis | `/responsaveis` | Create | N/A | N/A | N/A | empty, data |
| Turmas | `/turmas` | Create/Update | N/A | N/A | N/A | empty, data |
| Frequência | `/frequencia` | N/A | N/A | N/A | N/A | [PENDENTE] |
| Graduação | `/graduacao` | N/A | N/A | N/A | N/A | [PENDENTE] |
| Ranking | `/ranking` | N/A | categoria | N/A | N/A | data |
| Campeonatos | `/campeonatos` | Create | N/A | N/A | N/A | empty, data |
| Financeiro | `/financeiro` | Update (pagamento) | status | nome | N/A | empty, data |
| Financeiro Gerencial | `/financeiro-gerencial` | N/A | N/A | N/A | N/A | [PENDENTE] |
| Produtos | `/produtos` | Create/Update | N/A | N/A | N/A | empty, data |
| Aluguel | `/aluguel` | Create | N/A | N/A | N/A | empty, data |
| Relatórios | `/relatorios` | N/A | N/A | N/A | N/A | [PENDENTE] |

## FATO: Design System

| Item | Estado | Evidência |
|------|--------|-----------|
| Tokens CSS | OK | `index.css` com HSL tokens customizados |
| Tema | OK | Dark mode com vermelho/preto |
| Primary color | OK | `hsl(var(--primary))` = vermelho |
| reduced motion | OK | Implementado em `index.css` |
| Animações | OK | fade-in, slide-in, pulse-glow, shimmer |
| Componentes shadcn | OK | ~50 componentes em `src/components/ui/` |

## FATO: Componentes Compartilhados

| Componente | Localização | Estado |
|------------|-------------|--------|
| AppFooter | `src/components/layout/AppFooter.tsx` | **CORRETO** - texto MtsFerreira presente |
| AppSidebar | `src/components/layout/AppSidebar.tsx` | Correção recentada em mobile |
| PageHeader | `src/components/shared/PageHeader.tsx` | OK |
| StatusBadge | `src/components/shared/StatusBadge.tsx` | OK |
| EmptyState | `src/components/shared/EmptyState.tsx` | OK |
| KpiCard | `src/components/shared/KpiCard.tsx` | OK |
| PageSkeleton | `src/components/shared/PageSkeleton.tsx` | OK |

## FATO: Infraestrutura e Qualidade

| Item | Estado | Evidência |
|------|--------|-----------|
| Testes unitários | **MINIMAL** | Apenas `example.test.ts` |
| Error boundaries | **AUSENTE** | Nenhum implementado |
| Analytics | **AUSENTE** | Nenhum SDK integrado |
| Logging/observabilidade | **MINIMAL** | Apenas toasts via Sonner |
| CSP headers | **AUSENTE** | Não configurado no Vite |
| SEO meta tags | **AUSENTE** | Nenhum componente de head |
| Lazy loading | **AUSENTE** | Nenhum route lazy loading |

## FATO: Responsividade

| Breakpoint | Comportamento |
|------------|---------------|
| Mobile (< 640px) | Tabelas escondidas, cards exibidos |
| Tablet (640px - 1024px) | Layout adaptativo |
| Desktop (> 1024px) | Layout completo com tabelas |
| Large (> 1400px) | Container com max-width |

## FATO: Vestígios de Scaffold/Plataforma

- `package.json`: nome "vite_react_shadcn_ts"
- `README.md`: placeholder
- `vite.config.ts`: comentário "https://vitejs.dev/config/"
- Arquivos de UI gerados pelo shadcn (comentários de license)

---

## SUPOSIÇÃO:

- A aplicação não tem backend real conectado - apenas mocks em memória
- O sistema é para 1 usuário administrador (conforme contexto)
- Não há necessidade de autenticação no frontend atual

## [PENDENTE]:

- Validar cobertura real de testes (smoke tests, component tests)
- Verificar se FrequenciaPage, GraduacaoPage, FinanceiroGerencialPage, RelatoriosPage estão funcionais
- Confirmar se footer aparece em todas as páginas (AdminLayout é usado em todas)
- Testar acessibilidade com axe-core ou lighthouse
- Verificar performance com Web Vitals
