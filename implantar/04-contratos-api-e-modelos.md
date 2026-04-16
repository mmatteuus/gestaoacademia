# 04 — Contratos API e Modelos do Frontend

## Objetivo

Deixar o frontend pronto para backend real sem retrabalho estrutural.

## Estratégia obrigatória

1. Manter tipos canônicos por domínio em `src/types`.
2. Manter adapters por domínio em `src/features/<dominio>/adapters`.
3. Manter services por domínio em `src/features/<dominio>/services`.
4. Toda página consome hook/provider; hook/provider consome service; service pode usar mock temporário ou API real.

## Contratos mínimos por domínio

### Alunos
```ts
interface Aluno {
  id: string
  nome: string
  email: string
  telefone: string
  dataNascimento: string
  cpf: string
  status: 'pre-cadastro' | 'ativo' | 'trancado' | 'inadimplente' | 'inativo'
  responsavelId?: string
  turmaIds: string[]
  faixaAtual: string
  categoria: string
  dataMatricula: string
  observacoes?: string
}
```

### Responsáveis
```ts
interface Responsavel {
  id: string
  nome: string
  email?: string
  telefone: string
  cpf?: string
  alunoIds: string[]
}
```

### Turmas
```ts
interface Turma {
  id: string
  nome: string
  modalidade: string
  professor: string
  horario: string
  diasSemana: string[]
  capacidade: number
  alunoIds: string[]
}
```

### Sessão/Frequência
```ts
interface SessaoAula {
  id: string
  turmaId: string
  data: string
  professor: string
  presencas: { alunoId: string; presente: boolean }[]
}
```

### Cobrança financeira
```ts
interface Cobranca {
  id: string
  alunoId: string
  nomeAluno: string
  descricao: string
  valor: number
  dataVencimento: string
  status: 'aberta' | 'paga' | 'vencida' | 'parcial' | 'cancelada'
  valorPago: number
  dataPagamento?: string
  formaPagamento?: 'PIX' | 'Cartão' | 'Dinheiro' | 'Transferência' | 'Boleto'
  observacoes?: string
  comprovanteId?: string
}
```

### Venda
```ts
interface Venda {
  id: string
  data: string
  itens: { produtoId: string; nomeProduto: string; quantidade: number; precoUnitario: number }[]
  subtotal?: number
  desconto?: number
  descontoTipo?: 'valor' | 'percentual'
  total: number
  compradorNome: string
  compradorTelefone?: string
  recipientPhone?: string
  formaPagamento: 'PIX' | 'Cartão' | 'Dinheiro' | 'Transferência'
  observacoes?: string
  parcelado?: boolean
  quantidadeParcelas?: number
  comprovanteId?: string
}
```

### Reserva e aluguel
```ts
interface Reserva {
  id: string
  espaco: string
  locatario: string
  locatarioTelefone?: string
  dataInicio: string
  dataFim: string
  horaInicio: string
  horaFim: string
  valor: number
  status: 'confirmada' | 'pendente' | 'cancelada'
  conflito?: boolean
}

interface PagamentoContratoAluguel {
  id: string
  contratoId: string
  dataPagamento: string
  valor: number
  formaPagamento: 'PIX' | 'Cartão' | 'Dinheiro' | 'Transferência'
  observacoes?: string
  referencia?: string
  recipientPhone?: string
  comprovanteId?: string
}
```

## APIs futuras recomendadas

### Endpoints internos esperados
- `GET /api/alunos`
- `POST /api/alunos`
- `PATCH /api/alunos/:id`
- `GET /api/turmas`
- `PATCH /api/turmas/:id`
- `POST /api/frequencias`
- `GET /api/cobrancas`
- `PATCH /api/cobrancas/:id/pagamento`
- `GET /api/produtos`
- `POST /api/vendas`
- `GET /api/aluguels/reservas`
- `POST /api/aluguels/reservas`
- `POST /api/aluguels/contratos/:id/pagamentos`

### Integrações externas opcionais
Usar somente por adapter/service, nunca direto na UI:
- CEP: ViaCEP/BrasilAPI
- Pagamentos futuros: Mercado Pago
- Geocoding se necessário: Nominatim respeitando política de uso

## Regra do executor

Se precisar criar client/API fake temporária, ela deve ficar em `services/` e nunca dentro da página.
