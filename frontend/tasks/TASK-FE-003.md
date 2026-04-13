# TASK-FE-003: Criar Camada Fake Services

## Contexto

Atualmente todas as páginas importam dados diretamente de `@/mocks/data`. Isso cria acoplamento forte e dificulta futura migração para API real.

## Inspiração

N/A - tarefa de refatoração

## Entregáveis

1. **Estrutura de pastas**:
   ```
   src/
   └── services/
       ├── index.ts          (export default)
       ├── alunoService.ts
       ├── responsavelService.ts
       ├── turmaService.ts
       ├── cobrancaService.ts
       ├── produtoService.ts
       ├── vendaService.ts
       ├── reservaService.ts
       └── dashboardService.ts
   ```

2. **Cada service**:
   - Métodos: getAll, getById, create, update, delete
   - Retorna Promise (simulando API)
   - Delay artificial (ex: 300ms) para simular rede
   - Dados vindos dos mocks existentes

3. **Exemplo de interface**:
   ```typescript
   interface IAlunoService {
     getAll(): Promise<Aluno[]>;
     getById(id: string): Promise<Aluno | null>;
     create(data: Omit<Aluno, 'id'>): Promise<Aluno>;
     update(id: string, data: Partial<Aluno>): Promise<Aluno>;
     delete(id: string): Promise<void>;
   }
   ```

## Critérios de Aceite

- [ ] Pasta services criada
- [ ] Mínimo 5 services implementados
- [ ] Todas as páginas conseguem consumir via services
- [ ] Sem breaking changes na UI
- [ ] Delay simulado funcionando

## Dependências

- TASK-FE-002 (TypeScript strict)

## Comandos de Validação

```bash
npm run build
# Navegar em todas as páginas
```

## Rodapé

- Validar footer em todas as páginas após migração

---

## [PENDENTE]

- Definir quais services são prioritários
- Decidir se mantém mocks como fallback
