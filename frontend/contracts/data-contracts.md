# Data Contracts - TypeScript Interfaces

## 1. Entidades Principais

### Aluno
```typescript
interface Aluno {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  cpf: string;
  status: AlunoStatus;
  foto?: string;
  responsavelId?: string;
  turmaIds: string[];
  faixaAtual: string;
  categoria: string;
  dataMatricula: string;
  observacoes?: string;
}

type AlunoStatus = 'pre-cadastro' | 'ativo' | 'trancado' | 'inadimplente' | 'inativo';
```

### Responsável
```typescript
interface Responsavel {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  alunoIds: string[];
}
```

### Turma
```typescript
interface Turma {
  id: string;
  nome: string;
  modalidade: string;
  professor: string;
  horario: string;
  diasSemana: string[];
  capacidade: number;
  alunoIds: string[];
}
```

### Cobrança
```typescript
interface Cobranca {
  id: string;
  alunoId: string;
  nomeAluno: string;
  tipo: 'mensalidade' | 'inscricao' | 'graduacao' | 'produto' | 'aluguel';
  descricao: string;
  valor: number;
  valorPago: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: CobrancaStatus;
}

type CobrancaStatus = 'aberta' | 'parcial' | 'paga' | 'vencida' | 'cancelada' | 'estornada';
```

### Produto
```typescript
interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  estoqueMinimo: number;
  categoria: string;
  imagem?: string;
}
```

### Venda
```typescript
interface Venda {
  id: string;
  data: string;
  itens: { produtoId: string; nomeProduto: string; quantidade: number; precoUnitario: number }[];
  total: number;
  compradorNome: string;
  formaPagamento: string;
}
```

---

## 2. Contratos de Serviços

### AlunoService
```typescript
interface IAlunoService {
  getAll(): Promise<Aluno[]>;
  getById(id: string): Promise<Aluno | null>;
  create(data: CreateAlunoDTO): Promise<Aluno>;
  update(id: string, data: UpdateAlunoDTO): Promise<Aluno>;
  delete(id: string): Promise<void>;
  search(query: string): Promise<Aluno[]>;
  filterByStatus(status: AlunoStatus): Promise<Aluno[]>;
}
```

### CobrancaService
```typescript
interface ICobrancaService {
  getAll(): Promise<Cobranca[]>;
  getByAluno(alunoId: string): Promise<Cobranca[]>;
  create(data: CreateCobrancaDTO): Promise<Cobranca>;
  registrarPagamento(id: string, valor: number): Promise<Cobranca>;
}
```

---

## 3. Tipos de Retorno de API

### ListResponse<T>
```typescript
interface ListResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
}
```

### ApiResponse<T>
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
```

---

## 4. DTOs

### CreateAlunoDTO
```typescript
interface CreateAlunoDTO {
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  cpf: string;
  faixaAtual: string;
  categoria: string;
  responsavelId?: string;
  turmaIds?: string[];
}
```

### CreateCobrancaDTO
```typescript
interface CreateCobrancaDTO {
  alunoId: string;
  tipo: Cobranca['tipo'];
  descricao: string;
  valor: number;
  dataVencimento: string;
}
```

---

## [PENDENTE]

- Definir DTOs completos para todas as operações
- Adicionar validação Zod
- Documentar erros de API
