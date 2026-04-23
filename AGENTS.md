# AGENTS.md

> Leia este arquivo primeiro antes de alterar qualquer parte do projeto.
> Este arquivo consolida o contexto desta conversa e define como a aplicação deve ser evoluída.

## Objetivo do produto

Este repositório representa o **frontend administrativo** de um sistema de gestão para **academia de artes marciais**.

O sistema deve parecer um **produto real, premium e intuitivo**, e não um protótipo genérico.

## Estado atual do projeto

- Existe um frontend navegável já implementado.
- A trilha correta para este repositório é: **AUDITAR E MELHORAR**.
- O foco atual continua sendo **FRONT-END**.
- Backend, banco, autenticação real, integrações reais e persistência real **não são prioridade agora**, a menos que haja decisão explícita posterior.

## Diretriz ativa de plataforma (PWA-first)

- A trilha de APK/IPA e empacotamento nativo (Capacitor, Android, iOS) está **congelada por decisão de produto**.
- O foco atual é tornar o **PWA mais próximo de app real**, mantendo estabilidade e sem regressão.
- Não criar `android/`, `ios/`, `capacitor.config.*`, scripts de build nativo, ou fluxos de loja sem decisão explícita posterior.

## Regra principal para futuros agentes

Antes de propor qualquer mudança, trate este projeto como um **frontend existente que precisa ser refinado, limpo, reorganizado e amadurecido**.

Não parta do zero.
Não invente backend.
Não abra decisões importantes sem necessidade.

## Perfil de uso do produto

- No **v1** existe apenas **1 usuário administrador**.
- Não há multiusuário agora.
- Não há sistema complexo de permissões agora.
- O objetivo do painel é permitir operação administrativa com clareza, rapidez e baixa fricção.

## Módulos que a aplicação deve cobrir

A aplicação deve dar suporte visual e operacional a:

1. Dashboard
2. Alunos
3. Turmas
4. Frequência
5. Graduação
6. Ranking
7. Campeonatos e medalhas
8. Financeiro escolar (inscrição e mensalidades)
9. Financeiro gerencial
10. Produtos, estoque e vendas
11. Aluguel da academia
12. Relatórios

## Decisões de produto já tomadas

### 1. A ficha do aluno é o centro operacional
A experiência deve ser organizada com a **ficha do aluno** como núcleo principal.

Ao abrir um aluno, o administrador deve conseguir localizar rapidamente:
- perfil
- responsável
- matrícula
- frequência
- financeiro
- graduação
- ranking
- histórico
- ações rápidas

### 2. Responsável NÃO deve ser uma página independente
Esta decisão já foi tomada.

- O responsável do aluno deve ser encontrado **dentro da ficha do aluno**.
- O fluxo de vínculo, visualização e edição do responsável deve acontecer no contexto do aluno.
- Uma página própria de “Responsáveis” não é a IA desejada para este produto e deve ser tratada como candidata forte à remoção/migração.

### 3. A aplicação deve ser intuitiva
Toda evolução deve reduzir atrito.

Perguntas que o agente sempre deve fazer antes de propor algo:
- o administrador entende sozinho onde clicar?
- a ação importante está visível?
- existe informação duplicada?
- existe informação importante escondida?
- a tela obriga o usuário a pensar demais?
- há uma forma mais simples de resolver a mesma tarefa?

## Direção visual obrigatória

A identidade visual do produto deve permanecer baseada em:
- **preto profundo / near-black**
- **vermelho intenso**
- cinzas grafite e aço
- contraste alto com aparência premium

O produto deve transmitir:
- disciplina
- performance
- autoridade
- energia controlada
- sofisticação esportiva

## Referências visuais-base

Sem copiar literalmente, a direção visual pode se inspirar em:
- Linear
- Raycast
- Stripe
- referências de design premiado e não genérico

## Regras visuais e de UX

- Evitar aparência genérica de dashboard SaaS comum.
- Usar design tokens customizados.
- Manter microinterações com propósito.
- Respeitar `prefers-reduced-motion`.
- Garantir boa experiência em mobile, tablet, desktop e telas grandes.

## Rodapé obrigatório

Toda página deve conter o rodapé com o texto exatamente:

`Desenvolvido por MtsFerreira`

Com link para:

`https://MtsFerreira.dev`

Requisitos:
- abrir em nova aba
- usar atributos seguros
- continuar visível no mobile

## Regras de integridade do projeto

### Não fazer
- Não deixar menções desnecessárias a plataformas de geração/desenvolvimento no produto final.
- Não manter README placeholder.
- Não manter identidade genérica de scaffold.
- Não acoplar a UI diretamente a mocks quando houver oportunidade de introduzir camada fake de services/repositories.
- Não presumir backend se o código ainda é frontend-only.

### Fazer
- Priorizar clareza de fluxo.
- Priorizar usabilidade real.
- Priorizar estrutura escalável.
- Priorizar legibilidade de código.
- Priorizar consistência visual.
- Priorizar evolução segura do frontend.

## Diretrizes técnicas desejadas para evolução

Estas diretrizes já foram discutidas e devem orientar futuras mudanças:

- TypeScript strict deve ser ativado.
- Uso de `any` deve ser eliminado.
- Estrutura deve caminhar para separação clara entre:
  - features
  - shared
  - mocks
  - services
  - types
- Idealmente, páginas não devem importar mocks diretamente.
- Deve existir base para futura troca de mocks por API real.
- Testes precisam sair do nível de exemplo e cobrir fluxos críticos.
- Acessibilidade, performance, observabilidade e qualidade de release devem ser tratadas como obrigatórias.

## Qualidade mínima esperada

Todo agente deve considerar que o projeto só está maduro quando houver evidência razoável de:
- fluxo intuitivo
- páginas consistentes
- formulários claros
- estados de loading, empty, success, partial e error
- acessibilidade básica confiável
- responsividade consistente
- documentação útil
- remoção de vestígios de scaffold no produto final

## Checklist de aceitação PWA-first

Para considerar uma entrega concluída na fase atual, validar:
- UX mobile com feel de app (navegação fluida, safe areas, sem atrito desnecessário)
- instalação PWA quando suportado (`beforeinstallprompt` / modo standalone)
- comportamento offline previsível (fallback + fila/sincronização sem travar UI)
- estados de erro e timeout claros (sem loading infinito)
- acessibilidade básica preservada (zoom, foco, labels e feedbacks)

## Como trabalhar neste repositório

Ao abrir o projeto, siga esta ordem:

1. Ler este `AGENTS.md`
2. Ler o `README.md`
3. Ler a pasta `/frontend` se ela existir e estiver preenchida com documentação válida
4. Inspecionar o código real em `src/`
5. Confirmar no código o que é FATO antes de propor alterações

## Modelo de verdade para análises futuras

Em análises, handoffs e auditorias, separar sempre:

### FATO
O que está explicitamente presente no código, docs ou materiais oficiais.

### SUPOSIÇÃO
O que foi inferido apenas para destravar uma decisão reversível.

### [PENDENTE]
O que ainda não foi comprovado e precisa de validação.

## Missão de futuros agentes

A missão não é apenas “deixar bonito”.
A missão é transformar o frontend em uma aplicação administrativa:
- clara
- robusta
- elegante
- intuitiva
- pronta para crescer

Se houver conflito entre quantidade de telas e clareza operacional, priorize **clareza operacional**.
Se houver conflito entre “mais módulo” e “mais usabilidade”, priorize **usabilidade**.
Se houver conflito entre conveniência técnica e experiência do administrador, priorize a **experiência do administrador**, desde que a solução permaneça escalável.
