# Relatório QA Mobile — Gêmeos Academia

**Resumo executivo** — 6 verificações, 15 falhas, 11 warnings.

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
- **[ALTO] Falha de execução no cenário: Turmas + vínculo de aluno**
  - Rota: `/global`
  - Evidência: ![Falha de execução no cenário: Turmas + vínculo de aluno](qa-screenshots/falha-04-falha-de-execucao-no-cenario-turmas-vinculo-de-aluno.png)
  - Descrição: locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: /Nova Turma/i }).first()[22m
[2m    - locator resolved to <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">…</button>[22m
[2m  - attempting click action[22m
[2m    - waiting for element to be visible, enabled and stable[22m
[2m    - element is visible, enabled and stable[22m
[2m    - scrolling into view if needed[22m
[2m    - done scrolling[22m
[2m    - performing click action[22m

locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: /Nova Turma/i }).first()[22m
[2m    - locator resolved to <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">…</button>[22m
[2m  - attempting click action[22m
[2m    - waiting for element to be visible, enabled and stable[22m
[2m    - element is visible, enabled and stable[22m
[2m    - scrolling into view if needed[22m
[2m    - done scrolling[22m
[2m    - performing click action[22m

    at clickWhenVisible (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:145:17)
    at async file:///D:/MATEUS/Documentos/GitHub/gestaoacademia/scripts/qa-mobile-runner.mjs:653:5
    at async stateAction (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:161:3)
    at async createTurmaAndAssignAluno (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:652:3)
    at async runScenario (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:168:5)
    at async main (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:1715:5)
    at async file:///D:/MATEUS/Documentos/GitHub/gestaoacademia/scripts/qa-mobile-runner.mjs:1760:1
  - Passos para reproduzir:
  - Executar cenário: Turmas + vínculo de aluno
- **[ALTO] Falha de execução no cenário: Frequência**
  - Rota: `/global`
  - Evidência: ![Falha de execução no cenário: Frequência](qa-screenshots/falha-05-falha-de-execucao-no-cenario-frequencia.png)
  - Descrição: locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: /Lançar Presença/i }).first()[22m
[2m    - locator resolved to <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">…</button>[22m
[2m  - attempting click action[22m
[2m    - waiting for element to be visible, enabled and stable[22m
[2m    - element is visible, enabled and stable[22m
[2m    - scrolling into view if needed[22m
[2m    - done scrolling[22m
[2m    - performing click action[22m

locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: /Lançar Presença/i }).first()[22m
[2m    - locator resolved to <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">…</button>[22m
[2m  - attempting click action[22m
[2m    - waiting for element to be visible, enabled and stable[22m
[2m    - element is visible, enabled and stable[22m
[2m    - scrolling into view if needed[22m
[2m    - done scrolling[22m
[2m    - performing click action[22m

    at clickWhenVisible (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:145:17)
    at async file:///D:/MATEUS/Documentos/GitHub/gestaoacademia/scripts/qa-mobile-runner.mjs:738:5
    at async stateAction (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:161:3)
    at async frequenciaScenario (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:737:3)
    at async runScenario (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:168:5)
    at async main (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:1716:5)
    at async file:///D:/MATEUS/Documentos/GitHub/gestaoacademia/scripts/qa-mobile-runner.mjs:1760:1
  - Passos para reproduzir:
  - Executar cenário: Frequência
- **[ALTO] Falha de execução no cenário: Graduação**
  - Rota: `/global`
  - Evidência: ![Falha de execução no cenário: Graduação](qa-screenshots/falha-06-falha-de-execucao-no-cenario-graduacao.png)
  - Descrição: locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: /Nova Regra/i }).first()[22m
[2m    - locator resolved to <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">…</button>[22m
[2m  - attempting click action[22m
[2m    - waiting for element to be visible, enabled and stable[22m
[2m    - element is visible, enabled and stable[22m
[2m    - scrolling into view if needed[22m
[2m    - done scrolling[22m
[2m    - performing click action[22m

locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: /Nova Regra/i }).first()[22m
[2m    - locator resolved to <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">…</button>[22m
[2m  - attempting click action[22m
[2m    - waiting for element to be visible, enabled and stable[22m
[2m    - element is visible, enabled and stable[22m
[2m    - scrolling into view if needed[22m
[2m    - done scrolling[22m
[2m    - performing click action[22m

    at clickWhenVisible (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:145:17)
    at async file:///D:/MATEUS/Documentos/GitHub/gestaoacademia/scripts/qa-mobile-runner.mjs:803:5
    at async stateAction (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:161:3)
    at async graduacaoScenario (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:802:3)
    at async runScenario (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:168:5)
    at async main (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:1717:5)
    at async file:///D:/MATEUS/Documentos/GitHub/gestaoacademia/scripts/qa-mobile-runner.mjs:1760:1
  - Passos para reproduzir:
  - Executar cenário: Graduação
- **[ALTO] Falha de execução no cenário: Campeonatos**
  - Rota: `/global`
  - Evidência: ![Falha de execução no cenário: Campeonatos](qa-screenshots/falha-07-falha-de-execucao-no-cenario-campeonatos.png)
  - Descrição: locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: /Novo Campeonato/i }).first()[22m
[2m    - locator resolved to <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">…</button>[22m
[2m  - attempting click action[22m
[2m    - waiting for element to be visible, enabled and stable[22m
[2m    - element is visible, enabled and stable[22m
[2m    - scrolling into view if needed[22m
[2m    - done scrolling[22m
[2m    - performing click action[22m

locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: /Novo Campeonato/i }).first()[22m
[2m    - locator resolved to <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">…</button>[22m
[2m  - attempting click action[22m
[2m    - waiting for element to be visible, enabled and stable[22m
[2m    - element is visible, enabled and stable[22m
[2m    - scrolling into view if needed[22m
[2m    - done scrolling[22m
[2m    - performing click action[22m

    at clickWhenVisible (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:145:17)
    at async file:///D:/MATEUS/Documentos/GitHub/gestaoacademia/scripts/qa-mobile-runner.mjs:844:5
    at async stateAction (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:161:3)
    at async campeonatosScenario (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:843:3)
    at async runScenario (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:168:5)
    at async main (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:1718:5)
    at async file:///D:/MATEUS/Documentos/GitHub/gestaoacademia/scripts/qa-mobile-runner.mjs:1760:1
  - Passos para reproduzir:
  - Executar cenário: Campeonatos
- **[ALTO] Falha de execução no cenário: Financeiro**
  - Rota: `/global`
  - Evidência: ![Falha de execução no cenário: Financeiro](qa-screenshots/falha-08-falha-de-execucao-no-cenario-financeiro.png)
  - Descrição: locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: /Registrar Pagamento|Pagar/i }).first()[22m
[2m    - locator resolved to <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 h-8 w-full text-xs">…</button>[22m
[2m  - attempting click action[22m
[2m    - waiting for element to be visible, enabled and stable[22m
[2m    - element is visible, enabled and stable[22m
[2m    - scrolling into view if needed[22m
[2m    - done scrolling[22m
[2m    - performing click action[22m

locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: /Registrar Pagamento|Pagar/i }).first()[22m
[2m    - locator resolved to <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 h-8 w-full text-xs">…</button>[22m
[2m  - attempting click action[22m
[2m    - waiting for element to be visible, enabled and stable[22m
[2m    - element is visible, enabled and stable[22m
[2m    - scrolling into view if needed[22m
[2m    - done scrolling[22m
[2m    - performing click action[22m

    at D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:897:21
    at stateAction (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:161:9)
    at async financeiroScenario (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:896:3)
    at async runScenario (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:168:5)
    at async main (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:1719:5)
    at async file:///D:/MATEUS/Documentos/GitHub/gestaoacademia/scripts/qa-mobile-runner.mjs:1760:1
  - Passos para reproduzir:
  - Executar cenário: Financeiro
- **[ALTO] Falha de execução no cenário: Produtos e vendas**
  - Rota: `/global`
  - Evidência: ![Falha de execução no cenário: Produtos e vendas](qa-screenshots/falha-09-falha-de-execucao-no-cenario-produtos-e-vendas.png)
  - Descrição: locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: /Novo Produto/i }).first()[22m
[2m    - locator resolved to <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">…</button>[22m
[2m  - attempting click action[22m
[2m    - waiting for element to be visible, enabled and stable[22m
[2m    - element is visible, enabled and stable[22m
[2m    - scrolling into view if needed[22m
[2m    - done scrolling[22m
[2m    - performing click action[22m

locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: /Novo Produto/i }).first()[22m
[2m    - locator resolved to <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">…</button>[22m
[2m  - attempting click action[22m
[2m    - waiting for element to be visible, enabled and stable[22m
[2m    - element is visible, enabled and stable[22m
[2m    - scrolling into view if needed[22m
[2m    - done scrolling[22m
[2m    - performing click action[22m

    at clickWhenVisible (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:145:17)
    at async file:///D:/MATEUS/Documentos/GitHub/gestaoacademia/scripts/qa-mobile-runner.mjs:948:5
    at async stateAction (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:161:3)
    at async produtosScenario (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:947:3)
    at async runScenario (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:168:5)
    at async main (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:1720:5)
    at async file:///D:/MATEUS/Documentos/GitHub/gestaoacademia/scripts/qa-mobile-runner.mjs:1760:1
  - Passos para reproduzir:
  - Executar cenário: Produtos e vendas
- **[ALTO] Falha de execução no cenário: Aluguel**
  - Rota: `/global`
  - Evidência: ![Falha de execução no cenário: Aluguel](qa-screenshots/falha-10-falha-de-execucao-no-cenario-aluguel.png)
  - Descrição: locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: /Nova Reserva/i }).first()[22m
[2m    - locator resolved to <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">…</button>[22m
[2m  - attempting click action[22m
[2m    - waiting for element to be visible, enabled and stable[22m
[2m    - element is visible, enabled and stable[22m
[2m    - scrolling into view if needed[22m
[2m    - done scrolling[22m
[2m    - performing click action[22m

locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: /Nova Reserva/i }).first()[22m
[2m    - locator resolved to <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">…</button>[22m
[2m  - attempting click action[22m
[2m    - waiting for element to be visible, enabled and stable[22m
[2m    - element is visible, enabled and stable[22m
[2m    - scrolling into view if needed[22m
[2m    - done scrolling[22m
[2m    - performing click action[22m

    at clickWhenVisible (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:145:17)
    at async file:///D:/MATEUS/Documentos/GitHub/gestaoacademia/scripts/qa-mobile-runner.mjs:1056:5
    at async stateAction (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:161:3)
    at async aluguelScenario (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:1055:3)
    at async runScenario (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:168:5)
    at async main (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:1721:5)
    at async file:///D:/MATEUS/Documentos/GitHub/gestaoacademia/scripts/qa-mobile-runner.mjs:1760:1
  - Passos para reproduzir:
  - Executar cenário: Aluguel
- **[ALTO] Falha de execução no cenário: Interações PWA**
  - Rota: `/global`
  - Evidência: ![Falha de execução no cenário: Interações PWA](qa-screenshots/falha-12-falha-de-execucao-no-cenario-interacoes-pwa.png)
  - Descrição: locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: /Instalar app/i }).first()[22m
[2m    - locator resolved to <button title="Instalar app" aria-label="Instalar app" class="inline-flex items-center justify-center gap-2 font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md px-3 h-9 text-xs sm:text-sm whitespace-nowrap">…</button>[22m
[2m  - attempting click action[22m
[2m    - waiting for element to be visible, enabled and stable[22m
[2m    - element is visible, enabled and stable[22m
[2m    - scrolling into view if needed[22m
[2m    - done scrolling[22m
[2m    - performing click action[22m

locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: /Instalar app/i }).first()[22m
[2m    - locator resolved to <button title="Instalar app" aria-label="Instalar app" class="inline-flex items-center justify-center gap-2 font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md px-3 h-9 text-xs sm:text-sm whitespace-nowrap">…</button>[22m
[2m  - attempting click action[22m
[2m    - waiting for element to be visible, enabled and stable[22m
[2m    - element is visible, enabled and stable[22m
[2m    - scrolling into view if needed[22m
[2m    - done scrolling[22m
[2m    - performing click action[22m

    at D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:1209:24
    at stateAction (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:161:9)
    at async pwaInteractions (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:1208:5)
    at async runScenario (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:168:5)
    at async main (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:1722:5)
    at async file:///D:/MATEUS/Documentos/GitHub/gestaoacademia/scripts/qa-mobile-runner.mjs:1760:1
  - Passos para reproduzir:
  - Executar cenário: Interações PWA
- **[ALTO] Falha de execução no cenário: Exploratório 30s**
  - Rota: `/global`
  - Evidência: ![Falha de execução no cenário: Exploratório 30s](qa-screenshots/falha-15-falha-de-execucao-no-cenario-exploratorio-30s.png)
  - Descrição: page.screenshot: Target page, context or browser has been closed
page.screenshot: Target page, context or browser has been closed
    at shot (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:121:14)
    at exploratory (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:1562:9)
    at async runScenario (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:168:5)
    at async main (D:\MATEUS\Documentos\GitHub\gestaoacademia\scripts\qa-mobile-runner.mjs:1725:5)
    at async file:///D:/MATEUS/Documentos/GitHub/gestaoacademia/scripts/qa-mobile-runner.mjs:1760:1
  - Passos para reproduzir:
  - Executar cenário: Exploratório 30s
- **[MEDIO] Toast fora do top-center**
  - Rota: `/alunos`
  - Evidência: ![Toast fora do top-center](qa-screenshots/falha-02-toast-fora-do-top-center.png)
  - Descrição: posição atual: null
  - Passos para reproduzir:
  - Gerar toast de sucesso
  - Inspecionar data-position
- **[MEDIO] Classe .page-transition sem animação esperada**
  - Rota: `/alunos`
  - Evidência: ![Classe .page-transition sem animação esperada](qa-screenshots/falha-11-classe-page-transition-sem-animacao-esperada.png)
  - Descrição: Dados atuais: {"name":"none","duration":"1e-05s","timing":"ease"}
  - Passos para reproduzir:
  - Trocar rota
  - Inspecionar classe .page-transition
- **[MEDIO] Warnings React/validateDOMNesting no console**
  - Rota: `/global`
  - Evidência: ![Warnings React/validateDOMNesting no console](qa-screenshots/falha-13-warnings-react-validatedomnesting-no-console.png)
  - Descrição: Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}. | Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}. | Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}. | Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}. | Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}. | Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}. | Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.
  - Passos para reproduzir:
  - Executar fluxo completo
  - Inspecionar console warnings
- **[MEDIO] Alvos de toque abaixo de 44x44**
  - Rota: `/global`
  - Evidência: ![Alvos de toque abaixo de 44x44](qa-screenshots/falha-14-alvos-de-toque-abaixo-de-44x44.png)
  - Descrição: /: Instalar app (123x36), Abrir busca (40x40), Tema escuro ativo. Alternar para claro (40x40), Sair (40x40), MtsFerreira (57x15) | /alunos: Instalar app (123x36), Abrir busca (40x40), Tema escuro ativo. Alternar para claro (40x40), Sair (40x40), Novo Aluno (134x36), Todos (175x32), Ativo (175x32), Inadimplente (175x32), Trancado (175x32), Inativo (175x32), Pre-cadastro (175x32), Editar (86x32) | /turmas: Instalar app (123x36), Abrir busca (40x40), Tema escuro ativo. Alternar para claro (40x40), Sair (40x40), Nova Turma (134x36), Gerenciar alunos de Infantil Manhã (36x36), Editar Infantil Manhã (36x36), Gerenciar alunos (324x32), Gerenciar alunos de [TESTE] Adulto Noite (36x36), Editar [TESTE] Adulto Noite (36x36), Gerenciar alunos (324x32), Gerenciar alunos de Turma E2E (36x36) | /frequencia: Instalar app (123x36), Abrir busca (40x40), Tema escuro ativo. Alternar para claro (40x40), Sair (40x40), Lançar Presença (161x36), Infantil Manhã (110x36), [TESTE] Adulto Noite (147x36), Turma E2E (85x36), Turma E2E (85x36), Turma E2E (85x36), [TESTE QA] 1776972209908 Turma Mobile (270x36), MtsFerreira (57x15) | /graduacao: Instalar app (123x36), Abrir busca (40x40), Tema escuro ativo. Alternar para claro (40x40), Sair (40x40), Sincronizar alunos (148x36), Nova Regra (131x36), Progresso (82x30), Regras (64x30), Historico (77x30), MtsFerreira (57x15) | /ranking: Instalar app (123x36), Abrir busca (40x40), Tema escuro ativo. Alternar para claro (40x40), Sair (40x40), Todas (58x36), Adulto (64x36), Juvenil (65x36), Infantil (66x36), Regras (64x36), MtsFerreira (57x15) | /campeonatos: Instalar app (123x36), Abrir busca (40x40), Tema escuro ativo. Alternar para claro (40x40), Sair (40x40), Novo Campeonato (180x36), Adicionar Alunos (153x36), [sem label] (324x16), Adicionar Alunos (153x36), Adicionar Alunos (153x36), MtsFerreira (57x15) | /financeiro: Instalar app (123x36), Abrir busca (40x40), Tema escuro ativo. Alternar para claro (40x40), Sair (40x40), Gerar mensalidades pendentes (261x36), Todas (58x32), Abertas (70x32), Vencidas (76x32), Pagas (58x32), Parciais (68x32), Ver Comprovante (324x32), Ver Comprovante (324x32) | /financeiro-gerencial: Instalar app (123x36), Abrir busca (40x40), Tema escuro ativo. Alternar para claro (40x40), Sair (40x40), Receitas (72x30), Despesas (79x30), MtsFerreira (57x15) | /produtos: Instalar app (123x36), Abrir busca (40x40), Tema escuro ativo. Alternar para claro (40x40), Sair (40x40), Carrinho (111x36), Novo Produto (148x36), Catálogo (77x30), Histórico de Vendas (141x30), Editar produto Kimono Branco (28x28), Adicionar ao Carrinho (324x32), Editar produto [TESTE] Camiseta Treino (28x28), Adicionar ao Carrinho (324x32) | /aluguel: Instalar app (123x36), Abrir busca (40x40), Tema escuro ativo. Alternar para claro (40x40), Sair (40x40), Nova Reserva (144x36), Reservas (75x30), Contratos (82x30), MtsFerreira (57x15) | /relatorios: Instalar app (123x36), Abrir busca (40x40), Tema escuro ativo. Alternar para claro (40x40), Sair (40x40), Alunos (65x30), Frequência (88x30), Financeiro (85x30), Graduação (88x30), Ranking (72x30), Vendas (66x30), MtsFerreira (57x15)
  - Passos para reproduzir:
  - Mapear botões/links por rota
  - Comparar dimensões com mínimo 44x44

## Warnings
- Toast sem offset de safe-area explícito (rota: `/alunos`): data-offset atual: null
- Cenário interrompido: Turmas + vínculo de aluno (rota: `/global`): Runner continuou para os próximos cenários.
- Cenário interrompido: Frequência (rota: `/global`): Runner continuou para os próximos cenários.
- Cenário interrompido: Graduação (rota: `/global`): Runner continuou para os próximos cenários.
- Cenário interrompido: Campeonatos (rota: `/global`): Runner continuou para os próximos cenários.
- Cenário interrompido: Financeiro (rota: `/global`): Runner continuou para os próximos cenários.
- Cenário interrompido: Produtos e vendas (rota: `/global`): Runner continuou para os próximos cenários.
- Cenário interrompido: Aluguel (rota: `/global`): Runner continuou para os próximos cenários.
- Sem aluno visível para validar history.back na ficha (rota: `/alunos`): Card do aluno de teste não encontrado no momento do teste PWA.
- Cenário interrompido: Interações PWA (rota: `/global`): Runner continuou para os próximos cenários.
- Cenário interrompido: Exploratório 30s (rota: `/global`): Runner continuou para os próximos cenários.

## Cobertura explícita
- [✓ passou] Smoke de 12 rotas com screenshot e 0 erro JS relevante: Todas as rotas abriram com screenshot e sem erro JS rastreado.
- [✗ falhou] Cadastro completo de aluno + validação + ficha + edição/persistência: Cadastro não refletiu na lista; cenários de ficha/edição do aluno foram interrompidos.
- [✓ passou] BottomNav + Menu Mais (itens, backdrop e X): Navegação primária e menu Mais funcionando.
- [⊘ pulado — motivo] Scrollbar não aparece em display-mode standalone: Teste requer execução em display-mode standalone real no dispositivo/browser instalado.
- [✗ falhou] Acessibilidade e visual (warnings React, toque 44x44, clipping, contraste): Foram detectados problemas em pelo menos um check de a11y/visual.
- [⊘ pulado — motivo] Offline (cache de rotas + fila + restauração): Service Worker não disponível/ativo no ambiente atual (hasSW=true, registered=false).

## Screenshots
- Pasta: `qa-screenshots/`
- Convenção usada: `NN-rota-acao.png` e `falha-NN-descricao.png`

## Console log agregado
- Arquivo: `qa-console.log`
- Entradas rastreadas de erro/pageerror (ignorando ruído /rows /status): 3

## Negative confirmation
- Procurei explicitamente por: tela branca, JS exception, validateDOMNesting/React warning, botão morto, clipping horizontal, regressão de navegação e ausência do rodapé obrigatório. Não deixei essas áreas sem checagem.

## Veredito
- **bloqueia release: falha 1**
