# Routes Contract

## Rotas Definidas

| Caminho | Componente | Título | Descrição SEO |
|---------|------------|--------|---------------|
| `/` | DashboardPage | Dashboard | Visão geral da academia Gêmeos |
| `/alunos` | AlunosPage | Alunos | Gestão de alunos da academia |
| `/responsaveis` | ResponsaveisPage | Responsáveis | Responsáveis cadastrados |
| `/turmas` | TurmasPage | Turmas | Turmas e aulas |
| `/frequencia` | FrequenciaPage | Frequência | Registro de frequência |
| `/graduacao` | GraduacaoPage | Graduação | Faixas e progressões |
| `/ranking` | RankingPage | Ranking | Ranking de alunos |
| `/campeonato` | CampeotosPage | Campeonatos | Eventos e competições |
| `/financeiro` | FinanceiroPage | Financeiro | Cobranças e pagamentos |
| `/financeiro-gerencial` | FinanceiroGerencialPage | Financeiro Gerencial | Relatórios financeiros |
| `/produtos` | ProdutosPage | Produtos | Catálogo e vendas |
| `/aluguel` | AluguelPage | Aluguel | Reservas e contratos |
| `/relatorios` | RelatoriosPage | Relatórios | Relatórios diversos |
| `*` | NotFound | 404 | Página não encontrada |

---

## Hierarquia

```
/ (Dashboard)
├── /alunos
├── /responsaveis
├── /turmas
├── /frequencia
├── /graduacao
├── /ranking
├── /campo
├── /financeiro
│   └── /financeiro-gerencial
├── /produtos
├── /aluguel
└── /relatorios
```

---

## Lazy Loading

[SUPOSIÇÃO]: Actualmente todas as rotas são importadas diretamente. Recomenda-se lazy loading via React.lazy().

```typescript
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
// ... demais páginas
```

---

## 404 Handler

Rota wildcard `*` captura todas URLs não definidas.
