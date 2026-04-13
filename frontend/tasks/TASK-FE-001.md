# TASK-FE-001: Corrigir Identidade do Projeto

## Contexto

O projeto atual possui nome de scaffold no package.json ("vite_react_shadcn_ts") e README placeholder. Isso precisa ser corrigido para refletir o produto real.

## Inspiração

N/A - tarefa de configuração

## Entregáveis

1. **package.json** atualizado:
   - name: "gestao-academia" (ou similar)
   - description: "Sistema de gestão para academia de artes marciais"
   - author: "MtsFerreira"
   - license: "MIT"

2. **README.md** completo:
   - Descrição do projeto
   - Stack tecnológico
   - Instruções de instalação
   - Funcionalidades principais
   - Screenshots (opcional)

3. **vite.config.ts**:
   - Remover comentários de scaffold
   - Manter apenas configurações necessárias

## Critérios de Aceite

- [ ] `npm run build` funciona sem erros
- [ ] `npm run dev` inicia sem erros
- [ ] package.json com name/description/author/license corretos
- [ ] README.md com documentação básica
- [ ] Sem vestígios de "vite_react_shadcn_ts" no código

## Dependências

- Nenhuma

## Comandos de Validação

```bash
npm run build
npm run dev
cat package.json | grep -E '"name"|"description"|"author"'
```

## Rodapé

- Esta task não envolve página específica
- Validar que footer MtsFerreira continua funcionando após deploy

---

## [PENDENTE]

- Definir nome oficial do projeto
- Decidir license (recomendo MIT)
