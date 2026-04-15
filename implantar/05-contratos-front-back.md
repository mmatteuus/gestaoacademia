# 05 — Contratos Front ↔ Back

## Objetivo

Preparar o frontend para backend futuro sem depender dele agora.

## Regra obrigatória

Toda integração futura deve passar por:

1. contrato;
2. adaptador;
3. serviço.

## Estrutura obrigatória

```txt
src/services/contracts/
src/services/adapters/
src/services/mocks/
src/services/queries/
```

## Contratos mínimos por domínio

### Alunos

```ts
export interface AlunoDTO {
  id: string
  nome: string
  email: string
  telefone: string
  cpf: string
  dataNascimento: string
  categoria: string
  faixaAtual: string
  status: string
  observacoes?: string | null
  responsavelId?: string | null
  turmaIds: string[]
  dataMatricula: string
}
```

### Responsáveis

```ts
export interface ResponsavelDTO {
  id: string
  nome: string
  email?: string | null
  telefone: string
  observacoes?: string | null
  alunoIds: string[]
}
```

## Endpoints previstos

### Alunos
- `GET /alunos`
- `GET /alunos/:id`
- `POST /alunos`
- `PUT /alunos/:id`
- `PATCH /alunos/:id/status`

### Responsáveis
- `GET /responsaveis`
- `GET /responsaveis/:id`
- `POST /responsaveis`
- `PUT /responsaveis/:id`
- `POST /responsaveis/:id/alunos/:alunoId`
- `DELETE /responsaveis/:id/alunos/:alunoId`

### Turmas
- `GET /turmas`
- `POST /turmas`
- `PUT /turmas/:id`

### Produtos
- `GET /produtos`
- `POST /produtos`
- `PUT /produtos/:id`

### Financeiro
- `GET /mensalidades`
- `POST /mensalidades`
- `PATCH /mensalidades/:id/status`

### Aluguel
- `GET /alugueis`
- `POST /alugueis`
- `PATCH /alugueis/:id/devolucao`

### Relatórios
- `GET /relatorios/financeiro`
- `GET /relatorios/frequencia`
- `GET /relatorios/alunos`

## Adaptadores obrigatórios

Cada domínio deve possuir pelo menos:

- `fromMockToViewModel`
- `fromDtoToViewModel`
- `fromFormToCreatePayload`
- `fromFormToUpdatePayload`

## Estratégia de dados

### Agora
- a UI não deve importar mock bruto diretamente dentro da página;
- a página deve consumir serviço.

### Depois
- o serviço poderá trocar mock por API mantendo a interface pública.

## Regra de integração externa

Integrações como CEP, CNPJ e pagamentos devem ficar fora dos componentes e entrar via serviço, preservando o frontend desacoplado.
