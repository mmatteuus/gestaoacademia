# Relatório QA Mobile — Gêmeos Academia

**Resumo executivo** — 13 verificações, 13 falhas, 5 warnings.

## Falhas reais
- **[ALTO] Toast de cadastro de aluno ausente**
  - Rota: `/alunos`
  - Evidência: ![Toast de cadastro de aluno ausente](qa-screenshots/falha-01-toast-de-cadastro-de-aluno-ausente.png)
  - Descrição: Após cadastro válido, não apareceu feedback de sucesso esperado.
  - Passos para reproduzir:
  - Preencher formulário válido
  - Submeter
- **[ALTO] Aluno cadastrado não apareceu na lista**
  - Rota: `/alunos`
  - Evidência: ![Aluno cadastrado não apareceu na lista](qa-screenshots/falha-03-aluno-cadastrado-nao-apareceu-na-lista.png)
  - Descrição: O nome recém-cadastrado não ficou visível após submissão.
  - Passos para reproduzir:
  - Cadastrar aluno com sucesso
  - Verificar card na listagem
- **[ALTO] Erro de console durante cadastro de aluno**
  - Rota: `/alunos`
  - Evidência: ![Erro de console durante cadastro de aluno](qa-screenshots/falha-05-erro-de-console-durante-cadastro-de-aluno.png)
  - Descrição: Failed to load resource: the server responded with a status of 403 (Forbidden)
  - Passos para reproduzir:
  - Fluxo de cadastro completo
- **[ALTO] Turma criada não apareceu na lista**
  - Rota: `/turmas`
  - Evidência: ![Turma criada não apareceu na lista](qa-screenshots/falha-06-turma-criada-nao-apareceu-na-lista.png)
  - Descrição: Após criar turma, o card não apareceu na listagem.
  - Passos para reproduzir:
  - Abrir Nova Turma
  - Preencher e criar
  - Verificar listagem
- **[ALTO] Falha de execução no cenário: Campeonatos**
  - Rota: `/global`
  - Evidência: ![Falha de execução no cenário: Campeonatos](qa-screenshots/falha-08-falha-de-execucao-no-cenario-campeonatos.png)
  - Descrição: locator.waitFor: Timeout 5000ms exceeded.
Call log:
[2m  - waiting for getByRole('dialog').first().getByLabel(/Nome do Evento/i) to be visible[22m

locator.waitFor: Timeout 5000ms exceeded.
Call log:
[2m  - waiting for getByRole('dialog').first().getByLabel(/Nome do Evento/i) to be visible[22m

    at expectVisible (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:138:17)
    at typeWhenVisible (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:147:9)
    at D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:849:11
    at stateAction (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:159:9)
    at async campeonatosScenario (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:848:3)
    at async runScenario (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:166:5)
    at async main (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:1701:5)
    at async file:///D:/MATEUS/Documentos/GitHub/gestaoacademia/scripts/qa-mobile-runner.mjs:1743:1
  - Passos para reproduzir:
  - Executar cenário: Campeonatos
- **[ALTO] Pagamento financeiro sem confirmação de sucesso**
  - Rota: `/financeiro`
  - Evidência: ![Pagamento financeiro sem confirmação de sucesso](qa-screenshots/falha-09-pagamento-financeiro-sem-confirmacao-de-sucesso.png)
  - Descrição: Não apareceu toast de sucesso após confirmar pagamento.
  - Passos para reproduzir:
  - Abrir cobrança
  - Registrar pagamento
- **[ALTO] Falha de execução no cenário: Produtos e vendas**
  - Rota: `/global`
  - Evidência: ![Falha de execução no cenário: Produtos e vendas](qa-screenshots/falha-10-falha-de-execucao-no-cenario-produtos-e-vendas.png)
  - Descrição: locator.waitFor: Timeout 5000ms exceeded.
Call log:
[2m  - waiting for getByRole('dialog').first().getByLabel(/^Estoque$/i) to be visible[22m

locator.waitFor: Timeout 5000ms exceeded.
Call log:
[2m  - waiting for getByRole('dialog').first().getByLabel(/^Estoque$/i) to be visible[22m

    at expectVisible (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:138:17)
    at fillWhenVisible (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:153:9)
    at D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:955:11
    at async stateAction (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:159:3)
    at async produtosScenario (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:951:3)
    at async runScenario (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:166:5)
    at async main (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:1703:5)
    at async file:///D:/MATEUS/Documentos/GitHub/gestaoacademia/scripts/qa-mobile-runner.mjs:1743:1
  - Passos para reproduzir:
  - Executar cenário: Produtos e vendas
- **[ALTO] Falha de execução no cenário: Aluguel**
  - Rota: `/global`
  - Evidência: ![Falha de execução no cenário: Aluguel](qa-screenshots/falha-11-falha-de-execucao-no-cenario-aluguel.png)
  - Descrição: locator.waitFor: Timeout 5000ms exceeded.
Call log:
[2m  - waiting for getByRole('dialog').first().getByLabel(/Locatário \/ Cliente/i) to be visible[22m

locator.waitFor: Timeout 5000ms exceeded.
Call log:
[2m  - waiting for getByRole('dialog').first().getByLabel(/Locatário \/ Cliente/i) to be visible[22m

    at expectVisible (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:138:17)
    at typeWhenVisible (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:147:9)
    at D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:1060:11
    at stateAction (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:159:9)
    at async aluguelScenario (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:1059:3)
    at async runScenario (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:166:5)
    at async main (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:1704:5)
    at async file:///D:/MATEUS/Documentos/GitHub/gestaoacademia/scripts/qa-mobile-runner.mjs:1743:1
  - Passos para reproduzir:
  - Executar cenário: Aluguel
- **[MEDIO] Toast fora do top-center**
  - Rota: `/alunos`
  - Evidência: ![Toast fora do top-center](qa-screenshots/falha-02-toast-fora-do-top-center.png)
  - Descrição: posição atual: null
  - Passos para reproduzir:
  - Gerar toast de sucesso
  - Inspecionar data-position
- **[MEDIO] Contador de alunos não incrementou**
  - Rota: `/alunos`
  - Evidência: ![Contador de alunos não incrementou](qa-screenshots/falha-04-contador-de-alunos-nao-incrementou.png)
  - Descrição: contador antes=6, depois=6
  - Passos para reproduzir:
  - Ler subtítulo antes
  - Cadastrar aluno
  - Ler subtítulo depois
- **[MEDIO] Regra de graduação não apareceu após criação**
  - Rota: `/graduacao`
  - Evidência: ![Regra de graduação não apareceu após criação](qa-screenshots/falha-07-regra-de-graduacao-nao-apareceu-apos-criacao.png)
  - Descrição: A nova faixa destino não foi encontrada na listagem de regras.
  - Passos para reproduzir:
  - Abrir Nova Regra
  - Preencher e criar
  - Verificar listagem
- **[MEDIO] Warnings React/validateDOMNesting no console**
  - Rota: `/global`
  - Evidência: ![Warnings React/validateDOMNesting no console](qa-screenshots/falha-12-warnings-react-validatedomnesting-no-console.png)
  - Descrição: Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}. | Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}. | Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}. | Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}. | Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}. | Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}. | Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.
  - Passos para reproduzir:
  - Executar fluxo completo
  - Inspecionar console warnings
- **[MEDIO] Alvos de toque abaixo de 44x44**
  - Rota: `/global`
  - Evidência: ![Alvos de toque abaixo de 44x44](qa-screenshots/falha-13-alvos-de-toque-abaixo-de-44x44.png)
  - Descrição: /: Instalar app (123x36), Abrir busca (40x40), Tema escuro ativo. Alternar para claro (40x40), Sair (40x40), MtsFerreira (57x15) | /alunos: Instalar app (123x36), Abrir busca (40x40), Tema escuro ativo. Alternar para claro (40x40), Sair (40x40), Novo Aluno (134x36), Todos (175x32), Ativo (175x32), Inadimplente (175x32), Trancado (175x32), Inativo (175x32), Pre-cadastro (175x32), Editar (86x32) | /turmas: Instalar app (123x36), Abrir busca (40x40), Tema escuro ativo. Alternar para claro (40x40), Sair (40x40), Nova Turma (134x36), Gerenciar alunos de Infantil Manhã (36x36), Editar Infantil Manhã (36x36), Gerenciar alunos (324x32), Gerenciar alunos de [TESTE] Adulto Noite (36x36), Editar [TESTE] Adulto Noite (36x36), Gerenciar alunos (324x32), Gerenciar alunos de Turma E2E (36x36) | /frequencia: Instalar app (123x36), Abrir busca (40x40), Tema escuro ativo. Alternar para claro (40x40), Sair (40x40), Lançar Presença (161x36), Infantil Manhã (110x36), [TESTE] Adulto Noite (147x36), Turma E2E (85x36), Turma E2E (85x36), Turma E2E (85x36), MtsFerreira (57x15) | /graduacao: Instalar app (123x36), Abrir busca (40x40), Tema escuro ativo. Alternar para claro (40x40), Sair (40x40), Sincronizar alunos (148x36), Nova Regra (131x36), Progresso (82x30), Regras (64x30), Historico (77x30), MtsFerreira (57x15) | /ranking: Instalar app (123x36), Abrir busca (40x40), Tema escuro ativo. Alternar para claro (40x40), Sair (40x40), Todas (58x36), Adulto (64x36), Juvenil (65x36), Infantil (66x36), Regras (64x36), MtsFerreira (57x15) | /campeonatos: Instalar app (123x36), Abrir busca (40x40), Tema escuro ativo. Alternar para claro (40x40), Sair (40x40), Novo Campeonato (180x36), Adicionar Alunos (153x36), [sem label] (324x16), Adicionar Alunos (153x36), MtsFerreira (57x15) | /financeiro: Instalar app (123x36), Abrir busca (40x40), Tema escuro ativo. Alternar para claro (40x40), Sair (40x40), Gerar mensalidades pendentes (261x36), Todas (58x32), Abertas (70x32), Vencidas (76x32), Pagas (58x32), Parciais (68x32), Ver Comprovante (324x32), Registrar Pagamento (324x32) | /financeiro-gerencial: Instalar app (123x36), Abrir busca (40x40), Tema escuro ativo. Alternar para claro (40x40), Sair (40x40), Receitas (72x30), Despesas (79x30), MtsFerreira (57x15) | /produtos: Instalar app (123x36), Abrir busca (40x40), Tema escuro ativo. Alternar para claro (40x40), Sair (40x40), Carrinho (111x36), Novo Produto (148x36), Catálogo (77x30), Histórico de Vendas (141x30), Editar produto Kimono Branco (28x28), Adicionar ao Carrinho (324x32), Editar produto [TESTE] Camiseta Treino (28x28), Adicionar ao Carrinho (324x32) | /aluguel: Instalar app (123x36), Abrir busca (40x40), Tema escuro ativo. Alternar para claro (40x40), Sair (40x40), Nova Reserva (144x36), Reservas (75x30), Contratos (82x30), MtsFerreira (57x15) | /relatorios: Instalar app (123x36), Abrir busca (40x40), Tema escuro ativo. Alternar para claro (40x40), Sair (40x40), Alunos (65x30), Frequência (88x30), Financeiro (85x30), Graduação (88x30), Ranking (72x30), Vendas (66x30), MtsFerreira (57x15)
  - Passos para reproduzir:
  - Mapear botões/links por rota
  - Comparar dimensões com mínimo 44x44

## Warnings
- Toast sem offset de safe-area explícito (rota: `/alunos`): data-offset atual: null
- Cenário interrompido: Campeonatos (rota: `/global`): Runner continuou para os próximos cenários.
- Cenário interrompido: Produtos e vendas (rota: `/global`): Runner continuou para os próximos cenários.
- Cenário interrompido: Aluguel (rota: `/global`): Runner continuou para os próximos cenários.
- Sem aluno visível para validar history.back na ficha (rota: `/alunos`): Card do aluno de teste não encontrado no momento do teste PWA.

## Cobertura explícita
- [✓ passou] Smoke de 12 rotas com screenshot e 0 erro JS relevante: Todas as rotas abriram com screenshot e sem erro JS rastreado.
- [✗ falhou] Cadastro completo de aluno + validação + ficha + edição/persistência: Cadastro não refletiu na lista; cenários de ficha/edição do aluno foram interrompidos.
- [✓ passou] BottomNav + Menu Mais (itens, backdrop e X): Navegação primária e menu Mais funcionando.
- [✗ falhou] Turmas → Nova Turma (criar e listar): Falha ao criar/listar turma.
- [✓ passou] Frequência → Lançar Presença e salvar sessão: Sessão de presença registrada.
- [✗ falhou] Graduação → Nova Regra: Falha ao criar regra de graduação.
- [✗ falhou] Financeiro → Registrar Pagamento: Falha ao registrar pagamento.
- [⊘ pulado — motivo] Instalar app some em display-mode standalone: Ambiente de execução não estava em display-mode standalone para validar ocultação do botão.
- [✓ passou] Interações PWA (pull-to-refresh, page-transition, back, install/toast): Interações PWA principais validadas.
- [⊘ pulado — motivo] Scrollbar não aparece em display-mode standalone: Teste requer execução em display-mode standalone real no dispositivo/browser instalado.
- [✗ falhou] Acessibilidade e visual (warnings React, toque 44x44, clipping, contraste): Foram detectados problemas em pelo menos um check de a11y/visual.
- [⊘ pulado — motivo] Offline (cache de rotas + fila + restauração): Service Worker não disponível/ativo no ambiente atual (hasSW=true, registered=false).
- [✓ passou] Exploratório livre (30s): Executado com taps rápidos, scroll, abrir/fechar dialogs e entradas inválidas.

## Screenshots
- Pasta: `qa-screenshots/`
- Convenção usada: `NN-rota-acao.png` e `falha-NN-descricao.png`

## Console log agregado
- Arquivo: `qa-console.log`
- Entradas rastreadas de erro/pageerror (ignorando ruído /rows /status): 4

## Negative confirmation
- Procurei explicitamente por: tela branca, JS exception, validateDOMNesting/React warning, botão morto, clipping horizontal, regressão de navegação e ausência do rodapé obrigatório. Não deixei essas áreas sem checagem.

## Veredito
- **bloqueia release: falha 1**
