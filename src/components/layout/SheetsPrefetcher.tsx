import { usePrefetchSheetsBatch } from '@/services/queries';
import type { SheetType } from '@/services/api/sheets';

// Carrega entidades essenciais ao Dashboard em UMA chamada batch.
// Entidades de páginas específicas (Reservas, Aluguel, etc.) ficam de fora —
// elas serão carregadas sob demanda quando o usuário navegar para a página.
// Isso reduz a chance de estourar a quota de leitura do Sheets logo no boot.
const PREFETCH_TYPES: SheetType[] = [
  'Alunos',
  'Turmas',
  'Aulas',
  'Financeiro',
  'Despesas',
  'Receitas',
  'Produtos',
  'Vendas',
  'GraduacoesAlunos',
];

export function SheetsPrefetcher() {
  usePrefetchSheetsBatch(PREFETCH_TYPES);
  return null;
}
