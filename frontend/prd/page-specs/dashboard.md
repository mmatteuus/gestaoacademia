# Page Specs - Dashboard

## 1. Visão Geral

| Item | Detalhe |
|------|---------|
| Rota | `/` |
| Página | DashboardPage |
| Objetivo | Visão geral da academia com KPIs e gráficos |
| Usuário | Administrador |

## 2. Componentes

### 2.1 KPIs (8 cards)
- Alunos Ativos (número)
- Inadimplentes (número)
- Aptos p/ Graduação (número)
- Ocupação (%)
- Receita do Mês (R$)
- Despesas do Mês (R$)
- Lucro Estimado (R$)
- Vendas do Mês (R$)

### 2.2 Gráficos
- Frequência Mensal (BarChart)
- Receita vs Despesa (LineChart)

### 2.3 Lists
- Alertas Recentes
- Atividades Recentes

## 3. Estados de UI

| Estado | Conteúdo |
|--------|----------|
| Loading | KpiSkeleton + ChartSkeleton |
| Data | Todos os KPIs, gráficos, listas |
| Empty | N/A (sempre tem dados) |

## 4. Requisitos

- [ ] Skeleton loading com 800ms de delay
- [ ] Cálculos derivados dos dados em memória
- [ ] Formato de moeda BRL (R$ 1.234,56)
- [ ] Números formatados com separador de milhar
- [ ] Variação percentual nos cards (quando disponível)

## 5. Rodapé

- [x] Deve conter "Desenvolvido por MtsFerreira" - já implementado em AdminLayout

---

## [PENDENTE]

- Verificar se gráficos podem ser lazy loaded
- Considerar adicionar período selecionável (mês/ano)
