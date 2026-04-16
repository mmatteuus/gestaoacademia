# 01 — Diagnóstico Real do Repositório

## FATO

A base atual do repositório é **React + Vite + TypeScript + Tailwind + shadcn/ui**, com vários sinais de evolução parcial, porém ainda com forte acoplamento a mocks e inconsistência entre o que já existe e o que o sistema precisa sustentar.

## Problemas atuais a resolver

### Arquitetura e estado
- providers de domínio existem parcialmente, mas a aplicação ainda não está integralmente organizada por domínio
- parte das páginas ainda consome dados mock diretamente
- há risco de estados locais divergentes entre telas

### Páginas e fluxos
- há páginas com fluxo visual, mas sem cadeia de dados realmente consistente
- há formulários incompletos ou incompletamente ligados aos módulos que dependem deles
- comprovantes ainda não estão garantidos de forma uniforme em todos os fluxos
- envio ao cliente precisa ser padronizado

### Produto e operação
- desconto no carrinho precisa existir como parte nativa do fluxo de venda
- telefone do comprador/locatário precisa existir para suportar envio por WhatsApp
- regra de graduação precisa ser editável por modalidade
- campeonato precisa aceitar seleção real dos alunos da academia
- frequência, aluno e turma precisam operar como sistema único

### Organização de código
- código morto, estados redundantes, adapters incompletos e imports desnecessários precisam ser removidos
- a pasta `implantar/` atual está fragmentada e deve ser tratada como substituível por este novo dossiê

## SUPOSIÇÃO

A execução anterior foi parcial e deixou o repositório em estado híbrido: parte do caminho certo foi iniciada, mas sem convergir para uma arquitetura final única.

## [PENDENTE]

O executor deve validar em tempo de execução:
- build
- lint
- typecheck
- responsividade real
- integridade de rotas
- presença do rodapé obrigatório em todas as páginas/layouts

## Nota-base inicial

O executor deve considerar o frontend atual como **abaixo do nível necessário para produção** e trabalhar com a meta de elevar tudo a 10/10 em uma única passada.
