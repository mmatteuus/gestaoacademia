# Analytics Events

## Eventos de Página

| Evento | Categoria | Parâmetros |
|--------|-----------|------------|
| page_view | navigation | { page_name, page_path } |

## Eventos de Usuário

| Evento | Categoria | Parâmetros |
|--------|-----------|------------|
| aluno_cadastrado | alunos | { aluno_id, nome } |
| aluno_editado | alunos | { aluno_id, nome } |
| cobranca_paga | financeiro | { cobranca_id, valor } |
| venda_finalizada | produtos | { venda_id, total, itens_count } |
| turma_criada | turmas | { turma_id, nome } |
| reserva_criada | aluguel | { reserva_id, espaco } |

## Eventos de Erro

| Evento | Categoria | Parâmetros |
|--------|-----------|------------|
| error_boundary_triggered | error | { error_message, stack } |
| form_validation_failed | validation | { form, errors } |

---

## Implementação

[SUPOSIÇÃO]: Nenhum SDK de analytics instalado atualmente. Recomenda-se configurar Google Analytics ou similar.

```typescript
// Exemplo de tracking
const trackEvent = (event: string, params: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event, params);
  }
};
```
