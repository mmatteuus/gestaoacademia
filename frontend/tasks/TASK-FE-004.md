# TASK-FE-004: Migrar Imports de Mocks para Services

## Contexto

Todas as páginas precisam ser refatoradas para consumir dados via services em vez de imports diretos de mocks.

## Inspiração

N/A - tarefa de refatoração

## Entregáveis

1. **Páginas a migrar** (lista completa):
   - AlunosPage.tsx
   - ResponsaveisPage.tsx
   - TurmasPage.tsx
   - FrequenciaPage.tsx
   - GraduacaoPage.tsx
   - RankingPage.tsx
   - CampeotosPage.tsx
   - FinanceiroPage.tsx
   - FinanceiroGerencialPage.tsx
   - ProdutosPage.tsx
   - AluguelPage.tsx
   - RelatoriosPage.tsx
   - DashboardPage.tsx

2. **Cada página**:
   - Remover import direto de `@/mocks/data`
   - Importar do service correspondente
   - Adicionar estado de loading
   - Tratar erros

## Critérios de Aceite

- [ ] Todas as 13+ páginas migradas
- [ ] Sem import direto de `@/mocks/data` nas páginas
- [ ] `npm run build` passa
- [ ] Navegação funciona em todas as páginas

## Dependências

- TASK-FE-003 (services criados)

## Comandos de Validação

```bash
npm run build
# Verificar: grep -r "from '@/mocks/data'" src/pages/
```

## Rodapé

- Validar footer em todas as páginas
