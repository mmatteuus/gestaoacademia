# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard-data.spec.ts >> dashboard reflete dados reais inseridos via API
- Location: e2e\dashboard-data.spec.ts:69:1

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.waitForLoadState: Test timeout of 60000ms exceeded.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - region "Notifications alt+T"
    - generic [ref=e3]:
      - banner [ref=e4]:
        - generic [ref=e5]:
          - img [ref=e7]
          - generic [ref=e10]:
            - paragraph [ref=e11]: Gêmeos Academia
            - heading "Dashboard" [level=2] [ref=e12]
        - generic [ref=e13]:
          - generic [ref=e14]:
            - img [ref=e15]
            - textbox "Buscar alunos, turmas, produtos..." [ref=e18]
          - button "Tema escuro ativo. Alternar para claro" [ref=e19] [cursor=pointer]:
            - img
          - button "Sair" [ref=e20] [cursor=pointer]:
            - img
      - main [ref=e21]:
        - generic [ref=e23]:
          - generic [ref=e25]:
            - heading "Dashboard" [level=1] [ref=e26]
            - paragraph [ref=e27]: Visão geral da academia
          - generic [ref=e28]:
            - generic [ref=e30]:
              - heading "Ações rápidas" [level=3] [ref=e31]
              - paragraph [ref=e32]: Atalhos para o uso diário da academia
            - generic [ref=e33]:
              - link "Novo aluno" [ref=e34] [cursor=pointer]:
                - /url: /alunos
                - generic [ref=e35]:
                  - img
                  - text: Novo aluno
                - img
              - link "Lançar frequência" [ref=e36] [cursor=pointer]:
                - /url: /frequencia
                - generic [ref=e37]:
                  - img
                  - text: Lançar frequência
                - img
              - link "Novo campeonato" [ref=e38] [cursor=pointer]:
                - /url: /campeonatos
                - generic [ref=e39]:
                  - img
                  - text: Novo campeonato
                - img
              - link "Registrar venda" [ref=e40] [cursor=pointer]:
                - /url: /produtos
                - generic [ref=e41]:
                  - img
                  - text: Registrar venda
                - img
          - generic [ref=e42]:
            - generic [ref=e43]:
              - generic [ref=e44]:
                - generic [ref=e45]: Alunos Ativos
                - img [ref=e47]
              - generic [ref=e52]: "681"
              - generic [ref=e53]:
                - img [ref=e54]
                - generic [ref=e57]: +5%
                - generic [ref=e58]: vs mês anterior
            - generic [ref=e59]:
              - generic [ref=e60]:
                - generic [ref=e61]: Inadimplentes
                - img [ref=e63]
              - generic [ref=e65]: "0"
              - generic [ref=e66]:
                - img [ref=e67]
                - generic [ref=e70]: "-10%"
                - generic [ref=e71]: vs mês anterior
            - generic [ref=e72]:
              - generic [ref=e73]:
                - generic [ref=e74]: Aptos p/ Graduação
                - img [ref=e76]
              - generic [ref=e79]: "0"
            - generic [ref=e80]:
              - generic [ref=e81]:
                - generic [ref=e82]: Ocupação
                - img [ref=e84]
              - generic [ref=e88]: 1135%
              - generic [ref=e89]:
                - img [ref=e90]
                - generic [ref=e93]: +3%
                - generic [ref=e94]: vs mês anterior
          - generic [ref=e95]:
            - generic [ref=e96]:
              - generic [ref=e97]:
                - generic [ref=e98]: Receita do Mês
                - img [ref=e100]
              - generic [ref=e102]: R$ 20.300
              - generic [ref=e103]:
                - img [ref=e104]
                - generic [ref=e107]: +8%
                - generic [ref=e108]: vs mês anterior
            - generic [ref=e109]:
              - generic [ref=e110]:
                - generic [ref=e111]: Despesas do Mês
                - img [ref=e113]
              - generic [ref=e116]: R$ 11.900
              - generic [ref=e117]:
                - img [ref=e118]
                - generic [ref=e121]: +2%
                - generic [ref=e122]: vs mês anterior
            - generic [ref=e123]:
              - generic [ref=e124]:
                - generic [ref=e125]: Lucro Estimado
                - img [ref=e127]
              - generic [ref=e129]: R$ 8.400
              - generic [ref=e130]:
                - img [ref=e131]
                - generic [ref=e134]: +12%
                - generic [ref=e135]: vs mês anterior
            - generic [ref=e136]:
              - generic [ref=e137]:
                - generic [ref=e138]: Vendas do Mês
                - img [ref=e140]
              - generic [ref=e144]: R$ 2.850
              - generic [ref=e145]:
                - img [ref=e146]
                - generic [ref=e149]: +6%
                - generic [ref=e150]: vs mês anterior
          - generic [ref=e151]:
            - generic [ref=e152]:
              - heading "Presença Mensal" [level=3] [ref=e153]
              - img [ref=e157]:
                - generic [ref=e161]:
                  - generic [ref=e163]: Nov
                  - generic [ref=e165]: Dez
                  - generic [ref=e167]: Jan
                  - generic [ref=e169]: Fev
                  - generic [ref=e171]: Mar
                  - generic [ref=e173]: Abr
                - generic [ref=e175]:
                  - generic [ref=e177]: "0"
                  - generic [ref=e179]: "25"
                  - generic [ref=e181]: "50"
                  - generic [ref=e183]: "75"
                  - generic [ref=e185]: "100"
            - generic [ref=e191]:
              - heading "Receitas x Despesas" [level=3] [ref=e192]
              - img [ref=e196]:
                - generic [ref=e200]:
                  - generic [ref=e202]: Nov
                  - generic [ref=e204]: Dez
                  - generic [ref=e206]: Jan
                  - generic [ref=e208]: Fev
                  - generic [ref=e210]: Mar
                  - generic [ref=e212]: Abr
                - generic [ref=e214]:
                  - generic [ref=e216]: "0"
                  - generic [ref=e218]: "6000"
                  - generic [ref=e220]: "12000"
                  - generic [ref=e222]: "18000"
                  - generic [ref=e224]: "24000"
          - generic [ref=e229]:
            - generic [ref=e230]:
              - generic [ref=e231]:
                - heading "Alertas" [level=3] [ref=e232]
                - generic [ref=e233]: 808 pendência(s)
              - generic [ref=e234]:
                - generic [ref=e237]:
                  - paragraph [ref=e238]: Aluno E2E Dashboard com mensalidade vencida (24 cobranças)
                  - paragraph [ref=e239]: 2026-01-22
                - generic [ref=e242]:
                  - paragraph [ref=e243]: Aluno E2E Dashboard com mensalidade vencida (22 cobranças)
                  - paragraph [ref=e244]: 2026-01-22
                - generic [ref=e247]:
                  - paragraph [ref=e248]: Aluno E2E Dashboard com mensalidade vencida (33 cobranças)
                  - paragraph [ref=e249]: 2026-01-22
                - generic [ref=e252]:
                  - paragraph [ref=e253]: Aluno E2E Dashboard com mensalidade vencida (38 cobranças)
                  - paragraph [ref=e254]: 2026-01-22
                - generic [ref=e257]:
                  - paragraph [ref=e258]: "Estoque baixo: Faixa E2E (2 unid.)"
                  - paragraph [ref=e259]: 2026-04-23
                - generic [ref=e262]:
                  - paragraph [ref=e263]: "Estoque zerado: Luva E2E"
                  - paragraph [ref=e264]: 2026-04-23
                - generic [ref=e267]:
                  - paragraph [ref=e268]: "Estoque baixo: Faixa E2E (2 unid.)"
                  - paragraph [ref=e269]: 2026-04-23
                - generic [ref=e272]:
                  - paragraph [ref=e273]: "Estoque zerado: Luva E2E"
                  - paragraph [ref=e274]: 2026-04-23
            - generic [ref=e275]:
              - heading "Atividades Recentes" [level=3] [ref=e276]
              - generic [ref=e277]:
                - generic [ref=e280]:
                  - paragraph [ref=e281]: Venda de Kimono Exemplo para Aluno Exemplo
                  - paragraph [ref=e282]: 2026-04-23
                - generic [ref=e285]:
                  - paragraph [ref=e286]: Pagamento recebido de Aluno Exemplo
                  - paragraph [ref=e287]: 2026-04-23
                - generic [ref=e290]:
                  - paragraph [ref=e291]: Aluno UI 1776909049872 realizou pré-cadastro
                  - paragraph [ref=e292]: 2026-04-23
                - generic [ref=e295]:
                  - paragraph [ref=e296]: Frequência lançada (1 alunos)
                  - paragraph [ref=e297]: 2026-04-23
                - generic [ref=e300]:
                  - paragraph [ref=e301]: Venda de Kimono E2E para Aluno E2E Dashboard
                  - paragraph [ref=e302]: 2026-04-23
                - generic [ref=e305]:
                  - paragraph [ref=e306]: Pagamento recebido de Aluno E2E Dashboard
                  - paragraph [ref=e307]: 2026-04-23
                - generic [ref=e310]:
                  - paragraph [ref=e311]: Aluno UI 1776909633298 realizou pré-cadastro
                  - paragraph [ref=e312]: 2026-04-23
                - generic [ref=e315]:
                  - paragraph [ref=e316]: Frequência lançada (1 alunos)
                  - paragraph [ref=e317]: 2026-04-23
      - navigation "Navegação principal" [ref=e318]:
        - list [ref=e319]:
          - listitem [ref=e320]:
            - link "Início" [ref=e321] [cursor=pointer]:
              - /url: /
              - img [ref=e323]
              - generic [ref=e328]: Início
          - listitem [ref=e329]:
            - link "Alunos" [ref=e330] [cursor=pointer]:
              - /url: /alunos
              - img [ref=e332]
              - generic [ref=e337]: Alunos
          - listitem [ref=e338]:
            - link "Frequência" [ref=e339] [cursor=pointer]:
              - /url: /frequencia
              - img [ref=e341]
              - generic [ref=e344]: Frequência
          - listitem [ref=e345]:
            - link "Financeiro" [ref=e346] [cursor=pointer]:
              - /url: /financeiro
              - img [ref=e348]
              - generic [ref=e350]: Financeiro
          - listitem [ref=e351]:
            - button "Abrir mais opções" [ref=e352] [cursor=pointer]:
              - img [ref=e353]
              - generic [ref=e357]: Mais
        - paragraph [ref=e358]:
          - text: Desenvolvido por
          - link "MtsFerreira" [ref=e359] [cursor=pointer]:
            - /url: https://www.mtsferreira.dev/
  - generic [ref=e360]: "6000"
```

# Test source

```ts
  77  |   const cobVencida = id('cob-vencida');
  78  |   const cobPaga = id('cob-paga');
  79  |   const desp = id('desp');
  80  |   const rec = id('rec');
  81  |   const aulaId = id('aula');
  82  |   const venda = id('venda');
  83  | 
  84  |   // Aluno
  85  |   await createRow(request, {
  86  |     sheet_type: 'Alunos',
  87  |     id: alunoId,
  88  |     nome: 'Aluno E2E Dashboard',
  89  |     email: 'e2e@test.com',
  90  |     telefone: '11999999999',
  91  |     cpf: '00000000000',
  92  |     data_nascimento: '2000-01-01',
  93  |     categoria: 'Adulto',
  94  |     faixa_atual: 'Branca',
  95  |     status: 'ativo',
  96  |     plano: 'mensal',
  97  |     data_matricula: past90,
  98  |     turma_ids: turmaId,
  99  |   });
  100 | 
  101 |   // Turma
  102 |   await createRow(request, {
  103 |     sheet_type: 'Turmas',
  104 |     id: turmaId,
  105 |     nome: 'Turma E2E',
  106 |     modalidade: 'Jiu-Jitsu',
  107 |     professor: 'Prof E2E',
  108 |     horario: '10:00-11:00',
  109 |     dias_semana: 'Seg,Qua',
  110 |     capacidade: 20,
  111 |     aluno_ids: alunoId,
  112 |     status: 'ativa',
  113 |   });
  114 | 
  115 |   // Produtos: estoque normal, baixo, zero
  116 |   await createRow(request, {
  117 |     sheet_type: 'Produtos', id: prodOk, nome: 'Kimono E2E', descricao: 'e2e',
  118 |     preco: 200, preco_custo: 100, estoque: 50, estoque_minimo: 5, categoria: 'Vestuario',
  119 |   });
  120 |   await createRow(request, {
  121 |     sheet_type: 'Produtos', id: prodLow, nome: 'Faixa E2E', descricao: 'e2e',
  122 |     preco: 50, preco_custo: 20, estoque: 2, estoque_minimo: 5, categoria: 'Faixas',
  123 |   });
  124 |   await createRow(request, {
  125 |     sheet_type: 'Produtos', id: prodZero, nome: 'Luva E2E', descricao: 'e2e',
  126 |     preco: 80, preco_custo: 40, estoque: 0, estoque_minimo: 3, categoria: 'Protecao',
  127 |   });
  128 | 
  129 |   // Cobranças: aberta, vencida, paga
  130 |   await createRow(request, {
  131 |     sheet_type: 'Financeiro', id: cobAberta, aluno_id: alunoId, nome_aluno: 'Aluno E2E Dashboard',
  132 |     tipo: 'mensalidade', descricao: 'Mensalidade futura', valor: 250, valor_pago: 0,
  133 |     data_vencimento: future, status: 'aberta',
  134 |   });
  135 |   await createRow(request, {
  136 |     sheet_type: 'Financeiro', id: cobVencida, aluno_id: alunoId, nome_aluno: 'Aluno E2E Dashboard',
  137 |     tipo: 'mensalidade', descricao: 'Mensalidade vencida', valor: 250, valor_pago: 0,
  138 |     data_vencimento: lastMonth, status: 'vencida',
  139 |   });
  140 |   await createRow(request, {
  141 |     sheet_type: 'Financeiro', id: cobPaga, aluno_id: alunoId, nome_aluno: 'Aluno E2E Dashboard',
  142 |     tipo: 'mensalidade', descricao: 'Mensalidade paga', valor: 250, valor_pago: 250,
  143 |     data_vencimento: yesterday, data_pagamento: TODAY, status: 'paga', forma_pagamento: 'PIX',
  144 |   });
  145 | 
  146 |   // Receita / Despesa do mês
  147 |   await createRow(request, {
  148 |     sheet_type: 'Receitas', id: rec, descricao: 'Receita extra E2E', categoria: 'extra',
  149 |     valor: 1500, data: TODAY, origem: 'evento',
  150 |   });
  151 |   await createRow(request, {
  152 |     sheet_type: 'Despesas', id: desp, descricao: 'Despesa E2E', categoria: 'aluguel',
  153 |     valor: 800, data: TODAY, status: 'paga',
  154 |   });
  155 | 
  156 |   // Aula com presenças
  157 |   await createRow(request, {
  158 |     sheet_type: 'Aulas', id: aulaId, turma_id: turmaId, data: TODAY, professor: 'Prof E2E',
  159 |     presencas: JSON.stringify([{ alunoId, presente: true }]),
  160 |   });
  161 | 
  162 |   // Venda
  163 |   await createRow(request, {
  164 |     sheet_type: 'Vendas', id: venda, data: TODAY, comprador_nome: 'Aluno E2E Dashboard',
  165 |     aluno_id: alunoId,
  166 |     itens: JSON.stringify([{ produtoId: prodOk, nomeProduto: 'Kimono E2E', quantidade: 1, precoUnitario: 200 }]),
  167 |     total: 200, forma_pagamento: 'PIX',
  168 |   });
  169 | 
  170 |   // ===== AÇÃO: abre o app e valida =====
  171 |   await login(page);
  172 | 
  173 |   // Dashboard renderiza
  174 |   await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  175 | 
  176 |   // Aguarda fim do skeleton + dados chegarem
> 177 |   await page.waitForLoadState('networkidle');
      |              ^ Error: page.waitForLoadState: Test timeout of 60000ms exceeded.
  178 |   await page.waitForTimeout(2500);
  179 | 
  180 |   // === KPI: conta de "Inadimplentes"? Aluno E2E não está como inadimplente, mas há cobrança vencida ===
  181 |   // KPI "Alunos Ativos" deve ser >= 1 (o nosso)
  182 |   const ativosCard = page.getByText('Alunos Ativos').locator('..').locator('..');
  183 |   await expect(ativosCard).toBeVisible();
  184 | 
  185 |   // === Receita do Mês ===
  186 |   // Receita esperada: receita_extra (1500) + cobrança paga (250) = 1750 mínimo
  187 |   const receitaCard = page.getByText('Receita do Mês').locator('..').locator('..');
  188 |   await expect(receitaCard).toBeVisible();
  189 |   const receitaTxt = await receitaCard.textContent();
  190 |   expect(receitaTxt).toContain('R$');
  191 |   // Confirma que NÃO é o mock antigo (15.400)
  192 |   // Pega o número do texto
  193 |   const receitaMatch = receitaTxt?.match(/R\$\s*([\d.,]+)/);
  194 |   expect(receitaMatch).toBeTruthy();
  195 | 
  196 |   // === Gráfico Presença Mensal: deve ter barras (rect com class de recharts) ===
  197 |   const presencaCard = page.getByRole('heading', { name: /Presença Mensal/i }).locator('..');
  198 |   await expect(presencaCard).toBeVisible();
  199 |   const barCount = await presencaCard.locator('svg .recharts-bar-rectangle, svg path.recharts-rectangle').count();
  200 |   expect(barCount).toBeGreaterThan(0);
  201 | 
  202 |   // === Gráfico Receitas x Despesas: linhas svg presentes ===
  203 |   const recDespCard = page.getByRole('heading', { name: /Receitas x Despesas/i }).locator('..');
  204 |   await expect(recDespCard).toBeVisible();
  205 |   const lineCount = await recDespCard.locator('svg .recharts-line').count();
  206 |   expect(lineCount).toBeGreaterThan(0);
  207 | 
  208 |   // === ALERTAS: deve mencionar produto com estoque baixo OU zerado ===
  209 |   await expect(page.getByText(/Estoque baixo: Faixa E2E/i).first()).toBeVisible();
  210 |   await expect(page.getByText(/Estoque zerado: Luva E2E/i).first()).toBeVisible();
  211 |   await expect(page.getByText(/Aluno E2E Dashboard com mensalidade vencida/i).first()).toBeVisible();
  212 | 
  213 |   // === ATIVIDADES RECENTES ===
  214 |   await expect(page.getByText(/Venda de Kimono E2E/i).first()).toBeVisible();
  215 |   await expect(page.getByText(/Pagamento recebido de Aluno E2E Dashboard/i).first()).toBeVisible();
  216 |   await expect(page.getByText(/Frequência lançada/i).first()).toBeVisible();
  217 | 
  218 |   // ===== TEARDOWN: marca itens com status cancelado para fácil identificação =====
  219 |   // (deletar não é suportado pela API; só tem update. Marcamos os IDs para limpeza manual.)
  220 |   console.log(`\n[E2E] Dados criados nesta run (prefixo ${PFX}):`);
  221 |   console.log({ alunoId, turmaId, prodOk, prodLow, prodZero, cobAberta, cobVencida, cobPaga, desp, rec, aulaId, venda });
  222 | });
  223 | 
  224 | test('verifica que API ainda está limpa de mocks (sem Lucas Mendes/Marina Silva fixos)', async ({ request }) => {
  225 |   // Se a planilha estiver vazia exceto pelos dados E2E e dados que VOCÊ inseriu,
  226 |   // garante que os dados reais NÃO contêm os mocks que estavam no codebase.
  227 |   const alunos = await listRows(request, 'Alunos');
  228 |   // Permite que outros dados existam, mas se o usuário disse que apagou tudo,
  229 |   // um Lucas Mendes/Marina Silva 'a1'/'a2' não deve voltar magicamente:
  230 |   const mockReturning = alunos.some((a) => a.id === 'a1' || a.id === 'a2' || a.id === 'a3');
  231 |   expect(mockReturning).toBe(false);
  232 | });
  233 | 
```