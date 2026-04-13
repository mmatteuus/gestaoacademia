# TASK-FE-006: Adicionar Validação Zod nos Formulários

## Contexto

Os formulários não possuem validação runtime, permitindo dados inválidos.

## Inspiração

- Zod + React Hook Form

## Entregáveis

1. **Schemas Zod** para cada formulário:
   - AlunoForm
   - ProdutoForm
   - TurmaForm
   - ReservaForm
   - CobrancaForm

2. **Exemplo**:
   ```typescript
   const alunoSchema = z.object({
     nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
     email: z.string().email('Email inválido'),
     telefone: z.string().min(10, 'Telefone inválido'),
     cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
     dataNascimento: z.string(),
     categoria: z.string().min(1, 'Categoria obrigatória'),
     faixaAtual: z.string().min(1, 'Faixa obrigatória'),
   });
   ```

3. **Integração com React Hook Form**

## Critérios de Aceite

- [ ] Mínimo 3 formulários com validação Zod
- [ ] Mensagens de erro amigáveis
- [ ] `npm run build` passa

## Dependências

- TASK-FE-002 (TypeScript strict)

## Comandos de Validação

```bash
npm run build
```

## Rodapé

- Validar footer após alterações
