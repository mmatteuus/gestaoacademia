# 02 — Estado Alvo 10/10

## O que significa 10/10 neste projeto

### Produto
- todas as rotas relevantes existem e fazem sentido
- todos os formulários estão completos
- todos os vínculos entre módulos funcionam
- todo comprovante necessário existe e pode ser enviado ao cliente
- nenhuma informação importante fica “solta” fora do contexto correto

### UX/UI
- visual atual é preservado e refinado, não substituído por algo genérico
- telas pequenas de iOS e Android ficam harmônicas
- ações frequentes ficam acessíveis com baixa fricção
- dashboard tem ações rápidas úteis
- filtros, tabs e botões não quebram em telas pequenas

### Engenharia
- estado por domínio
- camada de serviços/adapters
- contratos front-back documentados
- tipagem sem `any`
- limpeza de código morto
- pastas organizadas pensando em monorepo
- mock somente onde ainda for estritamente necessário e encapsulado na camada certa

### Qualidade
- typecheck sem erro
- lint sem warning relevante
- build passando
- sem regressão visual grave
- sem rota quebrada
- sem formulário sem submissão coerente

## Resultado esperado por módulo

### Dashboard
- KPIs úteis
- ações rápidas
- informações vindas das camadas de dados compartilhadas

### Alunos
- perfil completo
- financeiro
- graduação
- histórico de frequência
- vínculo opcional com responsável
- contato do aluno e do responsável com ação de WhatsApp

### Turmas e Frequência
- vínculo aluno ↔ turma ↔ frequência consistente
- adição e remoção funcionais
- frequência de aluno explicável por turma/sessão

### Graduação
- regras por modalidade
- criação e edição de regra
- histórico e progresso coerentes

### Ranking
- posição explicável em popup/modal

### Campeonatos
- criação do campeonato
- seleção real dos alunos da academia
- prevenção de duplicidade

### Financeiro escolar
- cobranças
- pagamentos
- comprovante
- envio ao cliente

### Produtos e vendas
- carrinho
- desconto após adicionar itens
- telefone do comprador
- comprovante de compra e pagamento
- envio ao cliente

### Aluguel
- reserva
- contrato
- histórico por contrato
- pagamento
- comprovante
- envio ao cliente

### Relatórios
- leitura das camadas centrais, não de mocks espalhados
