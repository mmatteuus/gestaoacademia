# 08 — Checklist Final, Limpeza e Push

## Checklist final obrigatório

### Produto e UX
- [ ] todas as rotas úteis funcionando
- [ ] todos os formulários completos
- [ ] todos os vínculos entre módulos refletindo corretamente
- [ ] todos os comprovantes necessários gerados
- [ ] envio ao cliente funcionando onde houver telefone
- [ ] dashboard com ações rápidas
- [ ] telas pequenas harmonizadas

### Engenharia
- [ ] App ligado aos providers corretos
- [ ] páginas sem leitura direta de mock
- [ ] services/adapters por domínio
- [ ] types coerentes
- [ ] sem `any`
- [ ] sem código morto relevante
- [ ] sem imports mortos relevantes

### Qualidade
- [ ] `npm run lint` ou script equivalente passando
- [ ] `npm run build` passando
- [ ] `npm run test` ou equivalente passando quando existir
- [ ] typecheck passando

### Obrigatórios do projeto
- [ ] rodapé com MtsFerreira em todas as páginas/layouts
- [ ] nenhuma menção a plataformas de geração de código/IA no repo final

## Limpeza obrigatória antes do push final

O executor deve remover de `implantar/`:
- `README.md`
- `00-escopo-do-projeto.md`
- `01-diagnostico-real.md`
- `02-estado-alvo-10-10.md`
- `03-arquitetura-monorepo-e-pastas.md`
- `04-contratos-api-e-modelos.md`
- `05-rotas-formularios-e-fluxos.md`
- `06-plano-sequencial-de-execucao.md`
- `07-snippets-e-padroes-obrigatorios.md`
- `08-checklist-final-e-push.md`
- qualquer outro arquivo temporário de instrução

Depois disso, criar apenas:

## `implantar/99-resumo-execucao.md`

Estrutura obrigatória:
```md
# Resumo da Execução

## O que foi feito
- tópico
- tópico
- tópico

## Pontuações finais
- Arquitetura: X/10
- UX/UI: X/10
- Responsividade: X/10
- Formulários: X/10
- Fluxos integrados: X/10
- Preparação para backend: X/10
- Estado geral do frontend: X/10

## Validações executadas
- lint
- build
- testes
- typecheck

## Observações finais
- texto curto e objetivo
```

## Commit final obrigatório
Mensagem sugerida:
```bash
git add .
git commit -m "feat: concluir frontend 10-10 com arquitetura preparada para monorepo"
git push origin main
```

## Regra final
O executor só pode considerar a missão encerrada depois do push final realizado.
