# Auditoria atual do frontend

## Track

AUDITAR E MELHORAR

## FATO

### Já corrigido no código
- rota `/responsaveis` ativa no app
- acesso `Responsáveis` presente na sidebar
- módulo `ResponsaveisPage` restaurado
- rodapé ajustado para ficar persistente na tela
- layout ajustado para preservar scroll do conteúdo
- dashboard com ações rápidas
- drawer do aluno com aba de histórico de frequência
- botão de edição do aluno mais visível
- filtros de status do aluno reorganizados para mobile
- ranking com popup explicando a posição do aluno

### Ainda pendente no código
- editar regras da graduação
- adicionar alunos da academia em campeonatos já criados
- comprovante de pagamento na mensalidade
- comprovante de compra/pagamento em produtos com observações e parcelamento
- comprovante de pagamento e histórico por contrato no aluguel
- consolidar organização final para futuro monorepo

## SUPOSIÇÃO
- o backend futuro chegará por contratos e adaptadores
- parte dos comprovantes poderá começar em modo mock/frontend-first

## [PENDENTE]
- contrato oficial do backend
- modelo oficial dos comprovantes
- regras finais por arte/modalidade na graduação

## Riscos
- manter páginas com muita lógica local ainda aumenta retrabalho futuro
- comprovantes sem contrato claro podem virar retrabalho quando o backend chegar
- campeonatos e aluguel ainda dependem de evolução de fluxo para fechar o domínio
