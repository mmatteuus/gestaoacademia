import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sheets, type SheetRow, type SheetType } from '@/services/api/sheets';
import {
  alunoAdapter, responsavelAdapter, turmaAdapter, sessaoAulaAdapter, frequenciaAdapter,
  historicoGraduacaoAdapter, graduacaoAlunoAdapter, regraGraduacaoAdapter,
  rankingAdapter, campeonatoAdapter,
  cobrancaAdapter, despesaAdapter, receitaAdapter,
  produtoAdapter, vendaAdapter,
  reservaAdapter, contratoAluguelAdapter, pagamentoContratoAdapter,
} from '@/services/adapters';
import type {
  Aluno, Responsavel, Turma, SessaoAula, RegistroFrequencia,
  HistoricoGraduacao, GraduacaoAluno, RegraGraduacao,
  RankingEntry, Campeonato,
  Cobranca, Despesa, Receita, Produto, Venda,
  Reserva, ContratoAluguel, PagamentoContratoAluguel,
} from '@/types';

type Adapter<T> = {
  fromRow: (r: SheetRow) => T;
  toRow: (v: Partial<T>) => Record<string, unknown>;
};
type EntityQueryOptions = { enabled?: boolean };

export const sheetKey = (type: SheetType) => ['sheets', type] as const;

function useEntity<T>(type: SheetType, adapter: Adapter<T>, options?: EntityQueryOptions) {
  const qc = useQueryClient();
  const enabled = options?.enabled ?? true;

  const list = useQuery({
    queryKey: sheetKey(type),
    queryFn: async () => {
      const rows = await sheets.list(type);
      return rows.map(adapter.fromRow);
    },
    staleTime: 30_000,
    enabled,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: sheetKey(type) });

  const create = useMutation({
    mutationFn: (data: Partial<T>) => sheets.create(type, adapter.toRow(data)),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<T> }) =>
      sheets.update(type, id, adapter.toRow(data)),
    onSuccess: invalidate,
  });

  return { list, create, update, invalidate };
}

// ============= hooks por entidade =============

export const useAlunos = (options?: EntityQueryOptions) => useEntity<Aluno>('Alunos', alunoAdapter, options);
export const useResponsaveis = (options?: EntityQueryOptions) =>
  useEntity<Responsavel>('Responsaveis', responsavelAdapter, options);
export const useTurmas = (options?: EntityQueryOptions) => useEntity<Turma>('Turmas', turmaAdapter, options);
export const useSessoesAula = (options?: EntityQueryOptions) =>
  useEntity<SessaoAula>('Aulas', sessaoAulaAdapter, options);
export const useFrequencia = (options?: EntityQueryOptions) =>
  useEntity<RegistroFrequencia>('Frequencia', frequenciaAdapter, options);
export const useHistoricoGraduacao = (options?: EntityQueryOptions) =>
  useEntity<HistoricoGraduacao>('Graduacao', historicoGraduacaoAdapter, options);
export const useGraduacoesAlunos = (options?: EntityQueryOptions) =>
  useEntity<GraduacaoAluno>('GraduacoesAlunos', graduacaoAlunoAdapter, options);
export const useRegrasGraduacao = (options?: EntityQueryOptions) =>
  useEntity<RegraGraduacao>('RegrasGraduacao', regraGraduacaoAdapter, options);
export const useRanking = (options?: EntityQueryOptions) => useEntity<RankingEntry>('Ranking', rankingAdapter, options);
export const useCampeonatos = (options?: EntityQueryOptions) =>
  useEntity<Campeonato>('Campeonatos', campeonatoAdapter, options);
export const useCobrancas = (options?: EntityQueryOptions) =>
  useEntity<Cobranca>('Financeiro', cobrancaAdapter, options);
export const useDespesas = (options?: EntityQueryOptions) => useEntity<Despesa>('Despesas', despesaAdapter, options);
export const useReceitas = (options?: EntityQueryOptions) => useEntity<Receita>('Receitas', receitaAdapter, options);
export const useProdutos = (options?: EntityQueryOptions) => useEntity<Produto>('Produtos', produtoAdapter, options);
export const useVendas = (options?: EntityQueryOptions) => useEntity<Venda>('Vendas', vendaAdapter, options);
export const useReservas = (options?: EntityQueryOptions) => useEntity<Reserva>('Reservas', reservaAdapter, options);
export const useContratosAluguel = (options?: EntityQueryOptions) =>
  useEntity<ContratoAluguel>('Aluguel', contratoAluguelAdapter, options);
export const usePagamentosContrato = () =>
  useEntity<PagamentoContratoAluguel>('PagamentosContrato', pagamentoContratoAdapter);
