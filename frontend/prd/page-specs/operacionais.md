# Page Specs - Responsáveis

## 1. Visão Geral

| Item | Detalhe |
|------|---------|
| Rota | `/responsaveis` |
| Página | ResponsaveisPage |
| Objetivo | CRUD de responsáveis com visualização de alunos vinculados |
| Usuário | Administrador |

## 2. Componentes

### 2.1 Header
- Título: "Responsáveis"
- Subtítulo: "{n} responsáveis cadastrados"
- Ação: Botão "Novo"

### 2.2 Lista
- Cards com dados do responsável
- Lista de alunos vinculados (badges)

### 2.3 Form Dialog
- Criação de responsáveis
- Campos: nome, telefone, email

## 3. Estados de UI

| Estado | Conteúdo |
|--------|----------|
| Empty | EmptyState |
| Data | Cards com responsáveis |

## 4. Requisitos

- [ ] Exibir alunos vinculados
- [ ] Toast ao criar

## 5. Rodapé

- [x] Deve conter "Desenvolvido por MtsFerreira"

---

# Page Specs - Turmas

## 1. Visão Geral

| Item | Detalhe |
|------|---------|
| Rota | `/turmas` |
| Página | TurmasPage |
| Objetivo | CRUD de turmas com gestão de alunos |
| Usuário | Administrador |

## 2. Componentes

### 2.1 Header
- Título: "Turmas"
- Subtítulo: "{n} turmas ativas"
- Ação: Botão "Nova Turma"

### 2.2 Lista
- Cards com: nome, modalidade, professor, horário, dias, capacidade, alunos
- Barra de progresso de ocupação
- Botão editar (hover)

### 2.3 Form Dialog
- Criação e edição de turmas
- Campos: nome, modalidade, professor, horário, diasSemana, capacidade

## 3. Estados de UI

| Estado | Conteúdo |
|--------|----------|
| Empty | EmptyState |
| Data | Cards com turmas |

## 4. Requisitos

- [ ] Barra de occupancy
- [ ] Listagem de alunos (3 primeiros + contador)
- [ ] Toast ao criar/editar

## 5. Rodapé

- [x] Deve conter "Desenvolvido por MtsFerreira"

---

# Page Specs - Financeiro

## 1. Visão Geral

| Item | Detalhe |
|------|---------|
| Rota | `/financeiro` |
| Página | FinanceiroPage |
| Objetivo | Gestão de cobranças e pagamentos |
| Usuário | Administrador |

## 2. Componentes

### 2.1 KPIs
- Total em Aberto (R$)
- Total Vencido (R$)
- Cobranças (número)

### 2.2 Busca e Filtros
- Busca por nome do aluno
- Filtros por status: Todas, Abertas, Vencidas, Pagas, Parciais

### 2.3 Lista
- Tabela (desktop) / Cards (mobile)
- Colunas: Aluno, Descrição, Valor, Vencimento, Status, Ação
- Ação: Botão "Pagar"

### 2.4 Dialog Pagamento
- Dados da cobrança
- Campo: valor do pagamento
- Validação: não exceder valor restante

## 3. Estados de UI

| Estado | Conteúdo |
|--------|----------|
| Empty | EmptyState |
| Data | Lista de cobranças |

## 4. Requisitos

- [ ] Registro de pagamento parcial
- [ ] Atualização automática de status
- [ ] Toast ao confirmar pagamento

## 5. Rodapé

- [x] Deve conter "Desenvolvido por MtsFerreira"

---

# Page Specs - Produtos

## 1. Visão Geral

| Item | Detalhe |
|------|---------|
| Rota | `/produtos` |
| Página | ProdutosPage |
| Objetivo | Gestão de catálogo, estoque e vendas |
| Usuário | Administrador |

## 2. Componentes

### 2.1 KPIs
- Produtos (número)
- Estoque Baixo (número)
- Sem Estoque (número)
- Receita Vendas (R$)

### 2.2 Tabs
- Catálogo
- Histórico de Vendas

### 2.3 Catálogo
- Cards com: nome, descrição, preço, estoque, status
- Botão adicionar ao carrinho
- Badge de status (estoque ok/baixo/zerado)

### 2.4 Carrinho (Dialog)
- Lista de itens com quantidade
- Controle de quantidade (+/-)
- Total
- Campo: nome do comprador
- Botão: Finalizar Venda

### 2.5 Form Produto (Dialog)
- CRUD de produtos
- Campos: nome, descricao, preco, estoque, estoqueMinimo, categoria

### 2.6 Histórico de Vendas
- Tabela: Data, Comprador, Itens, Total, Pagamento

## 3. Estados de UI

| Estado | Conteúdo |
|--------|----------|
| Empty (catálogo) | EmptyState |
| Empty (vendas) | EmptyState |
| Data | Cards + Tabela |

## 4. Requisitos

- [ ] Controle de estoque em tempo real
- [ ] Carrinho persistente em memória
- [ ] Toast ao adicionar, vender
- [ ] Validação de estoque insuficiente

## 5. Rodapé

- [x] Deve conter "Desenvolvido por MtsFerreira"
