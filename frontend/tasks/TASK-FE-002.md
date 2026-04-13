# TASK-FE-002: Ativar TypeScript Strict

## Contexto

O TypeScript está configurado com `strict: false` e `noImplicitAny: false`. Isso permite código com tipos fracos que causa bugs difíceis de detectar.

## Inspiração

N/A - tarefa de configuração

## Entregáveis

1. **tsconfig.app.json** atualizado:
   ```json
   {
     "compilerOptions": {
       "strict": true,
       "noImplicitAny": true,
       "strictNullChecks": true,
       "noUnusedLocals": true,
       "noUnusedParameters": true
     }
   }
   ```

2. **Correção de erros TypeScript**:
   - Corrigir tipos `any` residuais
   - Adicionar tipos em objetos sem tipagem
   - Corrigir null checks

3. **tsconfig.json** atualizado:
   ```json
   {
     "compilerOptions": {
       "strict": true,
       "strictNullChecks": true
     }
   }
   ```

## Critérios de Aceite

- [ ] `npx tsc --noEmit` passa sem erros
- [ ] `npm run build` passa sem erros TypeScript
- [ ] `strict: true` ativo
- [ ] `noImplicitAny: true` ativo
- [ ] `strictNullChecks: true` ativo

## Dependências

- TASK-FE-001 (identidade) - pode ser paralelo

## Comandos de Validação

```bash
npx tsc --noEmit
npm run build
```

## Rodapé

- Esta task não envolve página específica
- Footer MtsFerreira continua funcionando

---

## [PENDENTE]

- Identificar todos os `any` no código
- Decidir se permite `// @ts-ignore` em casos específicos
