import { usePrefetchSheetsBatch } from '@/services/queries';
import type { SheetType } from '@/services/api/sheets';

// Carrega todas as entidades comuns em UMA chamada batch ao Sheets
// no mount do AdminLayout (logo após login). Reduz drasticamente o
// consumo de quota — o Dashboard antes disparava ~12 requests, agora 1.
const PREFETCH_TYPES: SheetType[] = [
  'Alunos',
  'Responsaveis',
  'Turmas',
  'Aulas',
  'Financeiro',
  'Despesas',
  'Receitas',
  'Produtos',
  'Vendas',
  'Reservas',
  'Aluguel',
  'PagamentosContrato',
  'GraduacoesAlunos',
  'RegrasGraduacao',
  'Ranking',
  'Campeonatos',
];

export function SheetsPrefetcher() {
  usePrefetchSheetsBatch(PREFETCH_TYPES);
  return null;
}
