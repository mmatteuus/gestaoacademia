# 05 — Rotas, Formulários e Fluxos Obrigatórios

## Rotas obrigatórias

- `/` Dashboard
- `/alunos`
- `/turmas`
- `/frequencia`
- `/graduacao`
- `/ranking`
- `/campeonatos`
- `/financeiro`
- `/financeiro-gerencial`
- `/produtos`
- `/aluguel`
- `/relatorios`

## Formulários obrigatórios por módulo

### Alunos
- criar aluno
- editar aluno
- vincular responsável opcional
- vincular/desvincular turma

### Responsável
Não criar página isolada no menu.

Obrigatório:
- responsável vinculado dentro do contexto do aluno
- botão de contato/WhatsApp no contexto correto

### Turmas
- criar turma
- editar turma
- gerenciar alunos da turma

### Frequência
- lançar sessão
- marcar presença
- impedir frequência em turma sem aluno
- impedir duplicidade de sessão no mesmo dia/turma

### Graduação
- criar regra
- editar regra
- regra por modalidade
- progresso por aluno

### Ranking
- clicar no nome do aluno e abrir explicação da posição

### Campeonatos
- criar campeonato
- adicionar alunos da academia ao campeonato por seleção
- evitar duplicidade

### Financeiro
- registrar pagamento
- gerar comprovante
- enviar comprovante ao cliente

### Produtos
- cadastrar/editar produto
- adicionar item ao carrinho
- aplicar desconto após o item estar no carrinho
- informar telefone do comprador
- finalizar venda
- gerar comprovante de compra e pagamento
- enviar comprovante ao cliente

### Aluguel
- criar reserva
- informar telefone do locatário
- registrar pagamento do contrato
- histórico por contrato
- gerar comprovante
- enviar comprovante ao cliente

## Fluxos obrigatórios cruzados

### Fluxo A — Aluno ↔ Turma ↔ Frequência
Alterou em um módulo, precisa refletir nos outros dois.

### Fluxo B — Aluno ↔ Financeiro
Pagamento do aluno precisa refletir no histórico do próprio aluno.

### Fluxo C — Produto ↔ Venda ↔ Comprovante
Venda altera estoque, gera histórico, gera comprovante e permite envio.

### Fluxo D — Aluguel ↔ Pagamento ↔ Histórico
Pagamento entra no histórico do contrato e gera comprovante acionável.

### Fluxo E — Campeonato ↔ Alunos
Campeonato seleciona apenas alunos reais da academia.

## Responsividade obrigatória

Corrigir obrigatoriamente:
- botões de status na página de alunos em tela pequena
- tabs e ações laterais em iOS/Android pequenos
- footer fixo sem bloquear leitura/scroll
- tabelas com fallback card/list quando necessário
