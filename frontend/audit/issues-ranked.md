# Issues Ranked by Priority

## CRÍTICO (Must Fix - Impacta Segurança/Qualidade)

| # | Issue | Categoria | Evidência | Prioridade |
|---|-------|-----------|-----------|------------|
| 1 | TypeScript strict desativado | Qualidade | `strict: false`, `noImplicitAny: false` em tsconfig.app.json | CRÍTICO |
| 2 | package.json com nome de scaffold | Identidade | `"vite_react_shadcn_ts"` | CRÍTICO |
| 3 | README.md placeholder | Documentação | Apenas "TODO: Document your project here" | CRÍTICO |
| 4 | Vestígios de plataforma no código | Identidade | Comentários de license shadcn, referências a tooling | CRÍTICO |

## ALTA (Must Fix - Impacta Manutenibilidade)

| # | Issue | Categoria | Evidência | Prioridade |
|---|-------|-----------|-----------|------------|
| 5 | Imports diretos de mocks nas páginas | Arquitetura | `import { alunos } from '@/mocks/data'` em 10+ páginas | ALTA |
| 6 | Sem camada services/repositories | Arquitetura | Não existe pasta services ou repositories | ALTA |
| 7 | Sem validação runtime (Zod) | Qualidade | Nenhum uso de Zod nos formulários | ALTA |
| 8 | Error boundaries ausentes | Resiliência | Nenhum ErrorBoundary implementado | ALTA |

## MÉDIA (Should Fix - Impacta Experiência)

| # | Issue | Categoria | Evidência | Prioridade |
|---|-------|-----------|-----------|------------|
| 9 | Sem lazy loading de rotas | Performance | Todas rotas carregam imediatamente | MÉDIA |
| 10 | Sem analytics tracking | Observabilidade | Nenhum evento de analytics | MÉDIA |
| 11 | Sem SEO meta tags | SEO | Nenhum title, description, canonical | MÉDIA |
| 12 | Sem CSP headers | Segurança | Não configurado em vite.config.ts | MÉDIA |
| 13 | Cobertura de testes mínima | Qualidade | Apenas example.test.ts | MÉDIA |

## BAIXA (Nice to Have)

| # | Issue | Categoria | Evidência | Prioridade |
|---|-------|-----------|-----------|------------|
| 14 | Sem logging estruturado | Observabilidade | Apenas toasts | BAIXA |
| 15 | Sem skeleton em todas páginas | UX | Apenas Dashboard tem loading skeleton | BAIXA |
| 16 | Sem busca global | Navegação | Apenas busca local por página | BAIXA |
| 17 | Sem breadcrumbs | Navegação | Ausente em todas páginas | BAIXA |

---

## Matriz de Esforço x Impacto

```
                    IMPACTO
                  Baixo  Alto
          ┌───────┬───────┐
    Alto  │  13   │  5,6  │
ESFORÇO   ├───────┼───────┤
    Médio │ 14,15 │  1,2  │
          │ 16,17 │  3,4  │
          ├───────┼───────┤
    Baixo │  9,10 │  7,8  │
          └───────┴───────┘
```

## Recomendação de Execução

**Fase 1 (Crítico):**
- TASK-FE-001: Corrigir identidade (package.json, README)
- TASK-FE-002: Ativar TypeScript strict

**Fase 2 (Alta):**
- TASK-FE-003: Criar camada fake services
- TASK-FE-004: Refatorar imports de mocks
- TASK-FE-005: Adicionar Error Boundaries

**Fase 3 (Média):**
- TASK-FE-006: Lazy loading de rotas
- TASK-FE-007: Adicionar SEO meta tags
- TASK-FE-008: Configurar CSP

**Fase 4 (Baixa):**
- TASK-FE-009: Expandir cobertura de testes
- TASK-FE-010: Adicionar busca global e breadcrumbs

---

## Critérios de Aceite das Correções

### Issue #1 - TypeScript Strict
- [ ] `strict: true` em tsconfig.app.json
- [ ] `noImplicitAny: true` em tsconfig.app.json  
- [ ] `strictNullChecks: true` em tsconfig.app.json
- [ ] Build passa sem erros TS

### Issue #2 - Nome do package.json
- [ ] `"name": "gestao-academia"` ou similar
- [ ] Description adequada
- [ ] Author e license

### Issue #3 - README.md
- [ ] Descrição do projeto
- [ ] Instruções de instalação
- [ ] Stack tecnológico
- [ ] Screenshots ou descrição das funcionalidades

### Issue #5-6 - Arquitetura de Dados
- [ ] Pasta `src/services/` criada
- [ ] Páginas consumindo via services
- [ ] Arquivos de mocks movidos para `src/mocks/` (ou separados)
- [ ] Sem imports diretos de `src/mocks/data.ts` nas páginas
