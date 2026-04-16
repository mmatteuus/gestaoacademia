# 06 — Plano Sequencial de Execução

> O executor deve seguir **exatamente** esta ordem.

## F0 — Preparação e baseline
1. Criar branch somente se o usuário pedir. Caso contrário, trabalhar na `main`.
2. Rodar build, lint e typecheck para registrar baseline.
3. Mapear imports diretos de mocks na UI.
4. Mapear arquivos mortos e imports mortos.

## F1 — Root e providers
1. Conectar `App.tsx` aos providers centrais.
2. Garantir que todos os providers necessários existam e sejam usados no root.
3. Eliminar leitura direta de mock nas páginas prioritárias.

## F2 — Consistência acadêmica
1. Fechar `AlunosPage` + `TurmasPage` + `FrequenciaPage` como sistema único.
2. Garantir vínculo aluno-turma-frequência consistente.
3. Garantir responsável opcional e ação de WhatsApp no contexto do aluno.

## F3 — Graduação, ranking e campeonatos
1. Regras de graduação por modalidade.
2. Botão de editar regra.
3. Ranking com explicação da posição.
4. Campeonatos com seleção real dos alunos da academia.

## F4 — Financeiro escolar
1. Pagamento completo.
2. Comprovante.
3. Envio ao cliente.
4. Reflexo no contexto do aluno.

## F5 — Produtos e vendas
1. Migrar para provider/service.
2. Carrinho funcional.
3. Desconto por valor e percentual após adicionar itens.
4. Telefone do comprador.
5. Comprovante completo.
6. Envio ao cliente.
7. Atualização coerente de estoque.

## F6 — Aluguel
1. Reserva com telefone do locatário.
2. Pagamento do contrato.
3. Histórico por contrato.
4. Comprovante.
5. Envio ao cliente.

## F7 — Dashboard, topbar e relatórios
1. Dashboard lendo dados centrais.
2. Ações rápidas úteis.
3. Topbar sem mock direto.
4. Relatórios sem dependência de mock na UI.

## F8 — Limpeza e monorepo readiness
1. Remover código morto.
2. Remover imports mortos.
3. Remover estados duplicados que não agregam.
4. Deixar estrutura de domínio pronta para extração futura em monorepo.
5. Atualizar documentação interna final do projeto.

## F9 — Validação total e encerramento
1. Typecheck sem erro.
2. Lint sem warning relevante.
3. Build sem erro.
4. Revisão de responsividade.
5. Revisão de rodapé obrigatório.
6. Remover os arquivos deste dossiê.
7. Criar `implantar/99-resumo-execucao.md`.
8. Commit final.
9. Push final.

## Regra de retrabalho zero

Se uma mudança exigir alteração futura previsível, o executor deve fazer a versão estrutural já correta agora, não um paliativo.
