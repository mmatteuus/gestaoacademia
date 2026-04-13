# Page Map - Gêmeos Academia

## Estrutura de Rotas

| Rota | Página | Componente | Layout | Footer |
|------|--------|------------|--------|--------|
| `/` | Dashboard | DashboardPage | AdminLayout | ✓ Presente |
| `/alunos` | Alunos | AlunosPage | AdminLayout | ✓ Presente |
| `/responsaveis` | Responsáveis | ResponsaveisPage | AdminLayout | ✓ Presente |
| `/turmas` | Turmas | TurmasPage | AdminLayout | ✓ Presente |
| `/frequencia` | Frequência | FrequenciaPage | AdminLayout | ✓ Presente |
| `/graduacao` | Graduação | GraduacaoPage | AdminLayout | ✓ Presente |
| `/ranking` | Ranking | RankingPage | AdminLayout | ✓ Presente |
| `/campeonatos` | Campeonatos | CampeonatosPage | AdminLayout | ✓ Presente |
| `/financeiro` | Financeiro | FinanceiroPage | AdminLayout | ✓ Presente |
| `/financeiro-gerencial` | Financeiro Gerencial | FinanceiroGerencialPage | AdminLayout | ✓ Presente |
| `/produtos` | Produtos | ProdutosPage | AdminLayout | ✓ Presente |
| `/aluguel` | Aluguel | AluguelPage | AdminLayout | ✓ Presente |
| `/relatorios` | Relatórios | RelatoriosPage | AdminLayout | ✓ Presente |
| `*` | 404 | NotFound | AdminLayout | ✓ Presente |

---

## Hierarquia de Navegação

```
Sidebar
├── Dashboard (/)
├── Gestão de Alunos
│   ├── Alunos (/alunos)
│   ├── Responsáveis (/responsaveis)
│   └── Turmas (/turmas)
├── Controle
│   ├── Frequência (/frequencia)
│   └── Graduação (/graduacao)
├── Competições
│   ├── Ranking (/ranking)
│   └── Campeonatos (/campeonato)
├── Financeiro
│   ├── Financeiro (/financeiro)
│   └── Financeiro Gerencial (/financeiro-gerencial)
├── Operações
│   ├── Produtos (/produtos)
│   ├── Aluguel (/aluguel)
│   └── Relatórios (/relatorios)
```

---

## Componentes de Layout

| Componente | Arquivo | Função |
|------------|---------|--------|
| AdminLayout | `src/components/layout/AdminLayout.tsx` | Layout principal com sidebar, topbar, footer |
| AppSidebar | `src/components/layout/AppSidebar.tsx` | Navegação lateral |
| AppTopbar | `src/components/layout/AppTopbar.tsx` | Cabeçalho com busca global |
| AppFooter | `src/components/layout/AppFooter.tsx` | Rodapé com MtsFerreira |

---

## Fluxos de Usuário

### Fluxo 1: Cadastro de Aluno
```
Dashboard → Alunos → Novo Aluno (Dialog) → Preencher formulário → Salvar → Toast sucesso
```

### Fluxo 2: Registro de Pagamento
```
Financeiro → Filtrar cobranças → Selecionar cobrança → Registrar Pagamento (Dialog) → Confirmar → Toast sucesso
```

### Fluxo 3: Venda de Produto
```
Produtos → Adicionar ao carrinho → Abrir carrinho → Finalizar venda → Toast sucesso
```

---

## Estados de UI por Página

| Página | Loading | Empty | Data | Error |
|--------|---------|-------|------|-------|
| Dashboard | Skeleton | N/A | Dados | N/A |
| Alunos | N/A | EmptyState | Tabela + Cards | N/A |
| Turmas | N/A | EmptyState | Cards | N/A |
| Financeiro | N/A | EmptyState | Tabela + Cards | N/A |
| Produtos | N/A | EmptyState | Cards | N/A |

---

## [PENDENTE]

- Verificar se FrequenciaPage tem estados loading/empty implementados
- Verificar se GraduacaoPage tem estados loading/empty implementados
- Verificar se FinanceiroGerencialPage tem estados loading/empty implementados
- Verificar se RelatoriosPage tem estados loading/empty implementados
