# Page Specs - Alunos

## 1. Visão Geral

| Item | Detalhe |
|------|---------|
| Rota | `/alunos` |
| Página | AlunosPage |
| Objetivo | CRUD completo de alunos com busca, filtros e paginação |
| Usuário | Administrador |

## 2. Componentes

### 2.1 Header
- Título: "Alunos"
- Subtítulo: "{n} alunos cadastrados"
- Ação: Botão "Novo Aluno"

### 2.2 Busca e Filtros
- Input de busca por nome (local)
- Filtros por status: Todos, Ativo, Inadimplente, Trancado, Inativo, Pré-cadastro

### 2.3 Lista (Desktop)
- Tabela com colunas: Nome, Categoria, Faixa, Status, Matrícula
- ordenação por clique no header - [PENDENTE]
- Paginação

### 2.4 Lista (Mobile)
- Cards com dados resumidos
- Status badge
- Paginação

### 2.5 Detail Drawer (Sheet)
- Abas: Perfil, Financeiro, Graduação
- Perfil: Email, Telefone, CPF, Nascimento, Categoria, Faixa, Status
- Financeiro: Lista de cobranças
- Graduação: Progressão com barra de progresso

### 2.6 Form Dialog
- Criação e edição de alunos
- Campos: nome, email, telefone, dataNascimento, cpf, faixaAtual, categoria, responsavelId, turmaIds

## 3. Estados de UI

| Estado | Conteúdo |
|--------|----------|
| Loading | N/A (dados locais) |
| Empty | EmptyState "Nenhum aluno encontrado" |
| Data | Tabela/Cards com dados |
| Editing | Dialog com formulário |

## 4. Requisitos

- [ ] Busca em tempo real
- [ ] Filtro combina busca + status
- [ ] Paginação com 6 itens por página
- [ ] Toast ao criar/editar
- [ ] Detail drawer ao clicar na linha
- [ ] Edição via drawer (botão editar)

## 5. Rodapé

- [x] Deve conter "Desenvolvido por MtsFerreira" - já implementado em AdminLayout

---

## [PENDENTE]

- Verificar se ordenação por coluna funciona
- Considerar adicionar filtro por turma
- Validar se CPF é formatado
