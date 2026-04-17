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

export const sheetKey = (type: SheetType) => ['sheets', type] as const;

function useEntity<T>(type: SheetType, adapter: Adapter<T>) {
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: sheetKey(type),
    queryFn: async () => {
      const rows = await sheets.list(type);
      return rows.map(adapter.fromRow);
    },
    staleTime: 30_000,
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

export const useAlunos = () => useEntity<Aluno>('Alunos', alunoAdapter);
export const useResponsaveis = () => useEntity<Responsavel>('Responsaveis', responsavelAdapter);
export const useTurmas = () => useEntity<Turma>('Turmas', turmaAdapter);
export const useSessoesAula = () => useEntity<SessaoAula>('Aulas', sessaoAulaAdapter);
export const useFrequencia = () => useEntity<RegistroFrequencia>('Frequencia', frequenciaAdapter);
export const useHistoricoGraduacao = () => useEntity<HistoricoGraduacao>('Graduacao', historicoGraduacaoAdapter);
export const useGraduacoesAlunos = () => useEntity<GraduacaoAluno>('GraduacoesAlunos', graduacaoAlunoAdapter);
export const useRegrasGraduacao = () => useEntity<RegraGraduacao>('RegrasGraduacao', regraGraduacaoAdapter);
export const useRanking = () => useEntity<RankingEntry>('Ranking', rankingAdapter);
export const useCampeonatos = () => useEntity<Campeonato>('Campeonatos', campeonatoAdapter);
export const useCobrancas = () => useEntity<Cobranca>('Financeiro', cobrancaAdapter);
export const useDespesas = () => useEntity<Despesa>('Despesas', despesaAdapter);
export const useReceitas = () => useEntity<Receita>('Receitas', receitaAdapter);
export const useProdutos = () => useEntity<Produto>('Produtos', produtoAdapter);
export const useVendas = () => useEntity<Venda>('Vendas', vendaAdapter);
export const useReservas = () => useEntity<Reserva>('Reservas', reservaAdapter);
export const useContratosAluguel = () => useEntity<ContratoAluguel>('Aluguel', contratoAluguelAdapter);
export const usePagamentosContrato = () =>
  useEntity<PagamentoContratoAluguel>('PagamentosContrato', pagamentoContratoAdapter);
