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

  const createAsync = (data: Partial<T>) => create.mutateAsync(data);
  const updateAsync = (input: { id: string; data: Partial<T> }) => update.mutateAsync(input);

  return { list, create, update, createAsync, updateAsync, invalidate };
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

// ===== Prefetch em batch (reduz consumo da quota do Sheets) =====

const ADAPTERS_BY_TYPE: Partial<Record<SheetType, Adapter<unknown>>> = {
  Alunos: alunoAdapter as unknown as Adapter<unknown>,
  Responsaveis: responsavelAdapter as unknown as Adapter<unknown>,
  Turmas: turmaAdapter as unknown as Adapter<unknown>,
  Aulas: sessaoAulaAdapter as unknown as Adapter<unknown>,
  Frequencia: frequenciaAdapter as unknown as Adapter<unknown>,
  Graduacao: historicoGraduacaoAdapter as unknown as Adapter<unknown>,
  GraduacoesAlunos: graduacaoAlunoAdapter as unknown as Adapter<unknown>,
  RegrasGraduacao: regraGraduacaoAdapter as unknown as Adapter<unknown>,
  Ranking: rankingAdapter as unknown as Adapter<unknown>,
  Campeonatos: campeonatoAdapter as unknown as Adapter<unknown>,
  Financeiro: cobrancaAdapter as unknown as Adapter<unknown>,
  Despesas: despesaAdapter as unknown as Adapter<unknown>,
  Receitas: receitaAdapter as unknown as Adapter<unknown>,
  Produtos: produtoAdapter as unknown as Adapter<unknown>,
  Vendas: vendaAdapter as unknown as Adapter<unknown>,
  Reservas: reservaAdapter as unknown as Adapter<unknown>,
  Aluguel: contratoAluguelAdapter as unknown as Adapter<unknown>,
  PagamentosContrato: pagamentoContratoAdapter as unknown as Adapter<unknown>,
};

/**
 * Hook que prefetcha múltiplas entidades em UMA chamada batch ao backend
 * e popula o cache do React Query. As chamadas individuais (`useAlunos`, etc.)
 * subsequentes pegam do cache (`isFresh`) sem disparar HTTP.
 *
 * Isso reduz drasticamente o consumo da cota Sheets quando o Dashboard
 * monta e precisa de ~12 entidades.
 */
import { useEffect, useRef } from 'react';

export function usePrefetchSheetsBatch(types: SheetType[]) {
  const qc = useQueryClient();
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    if (!types.length) return;

    // Filtra para tipos que ainda não estão no cache (evita request desnecessário)
    const missing = types.filter((t) => !qc.getQueryData(sheetKey(t)));
    if (missing.length === 0) {
      fetchedRef.current = true;
      return;
    }

    fetchedRef.current = true;
    sheets.batch(missing)
      .then((rowsByType) => {
        for (const [type, rows] of Object.entries(rowsByType)) {
          const adapter = ADAPTERS_BY_TYPE[type as SheetType];
          if (!adapter) continue;
          const mapped = rows.map((r) => adapter.fromRow(r));
          qc.setQueryData(sheetKey(type as SheetType), mapped);
        }
      })
      .catch(() => {
        // Fallback silencioso: as queries individuais ainda funcionam
        fetchedRef.current = false;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
