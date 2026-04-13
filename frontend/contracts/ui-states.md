# UI States Contract

## 1. Estados de Componente

### 1.1 Loading State
```typescript
type LoadingState = {
  isLoading: boolean;
  loadingMessage?: string;
};
```

**Implementação**: Skeletons
- PageSkeleton (4 KPIs + 2 gráficos)
- KpiSkeleton (contagem configurável)
- ChartSkeleton (gráfico vazio)

### 1.2 Empty State
```typescript
type EmptyState = {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
};
```

**Implementação**: EmptyState component
- Ícone (lucide)
- Título
- Descrição opcional
- Ação opcional

### 1.3 Error State
```typescript
type ErrorState = {
  error: Error;
  retry?: () => void;
};
```

**Implementação**: 
- Toast error via sonner
- [PENDENTE] Error boundary component

### 1.4 Success State
```typescript
type SuccessState = {
  message: string;
  autoClose?: number; // ms
};
```

**Implementação**: Toast success via sonner

---

## 2. Estados de Página

### Dashboard
| Estado | Componente |
|--------|------------|
| Loading | KpiSkeleton x4, ChartSkeleton x2 |
| Data | KPIs + Gráficos + Listas |

### Alunos
| Estado | Componente |
|--------|------------|
| Loading | N/A (dados locais) |
| Empty | EmptyState |
| Data | Tabela + Cards + Pagination |
| Editing | Dialog |

### Turmas
| Estado | Componente |
|--------|------------|
| Empty | EmptyState |
| Data | Cards |

### Financeiro
| Estado | Componente |
|--------|------------|
| Empty | EmptyState |
| Data | KPIs + Tabela |
| Paying | Dialog |

### Produtos
| Estado | Componente |
|--------|------------|
| Empty (catálogo) | EmptyState |
| Data | Cards + Tabs |
| Carrinho | Dialog |
| Selling | Dialog |

---

## 3. Estados de Formulário

```typescript
type FormState<T> = {
  isSubmitting: boolean;
  isDirty: boolean;
  errors: Record<keyof T, string>;
  values: T;
};
```

**Validação**: [PENDENTE] - implementar Zod validation

---

## 4. Estados de Busca

```typescript
type SearchState<T> = {
  query: string;
  results: T[];
  isSearching: boolean;
  debounceMs: number;
};
```

---

## 5. Estados de Paginação

```typescript
type PaginationState = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};
```

---

## 6. Estados de Filtro

```typescript
type FilterState<T extends string> = {
  activeFilter: T;
  availableFilters: { label: string; value: T }[];
};
```

---

## 7. Tratamento de Erros

### Error Boundaries
- Global: ErrorBoundary que envolve App
- [PENDENTE] Por área de negócio

### Fallback UI
```typescript
interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}
```

---

## [PENDENTE]

- Implementar ErrorBoundary global
- Implementar ErrorBoundary por área
- Adicionar retry logic
- Validar estados com testes
