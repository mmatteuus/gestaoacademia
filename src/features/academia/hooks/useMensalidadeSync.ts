import { useCallback, useRef } from 'react';
import { useCobrancas } from '@/services/queries';
import type { Aluno, Cobranca } from '@/types';
import type { ActionResult } from '../academia.types';
import {
  addMonths,
  DEFAULT_MENSALIDADE,
  dueDateForMonth,
  monthLabel,
  parseIsoDate,
  toMonthKey,
} from '../academia.utils';

type CobrancasQuery = ReturnType<typeof useCobrancas>;

interface UseMensalidadeSyncOptions {
  alunosList: Aluno[];
  cobrancasList: Cobranca[];
  cobrancas: CobrancasQuery;
}

export function useMensalidadeSync({
  alunosList,
  cobrancasList,
  cobrancas,
}: UseMensalidadeSyncOptions) {
  const pendingIds = useRef<Set<string>>(new Set());

  const ensureMensalidadesForAluno = useCallback((aluno: Aluno) => {
    if (aluno.status === 'inativo' || aluno.status === 'pre-cadastro') return 0;

    const startDate = parseIsoDate(aluno.dataMatricula);
    const currentDate = new Date();
    const startMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const endMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const dueDay = startDate.getDate() || 5;
    const mensalidades = cobrancasList.filter(
      (cobranca) => cobranca.alunoId === aluno.id && cobranca.tipo === 'mensalidade',
    );
    const configuredValue = mensalidades[0]?.valor;
    const monthlyValue = configuredValue && configuredValue > 0
      ? configuredValue
      : DEFAULT_MENSALIDADE;
    const existingMonths = new Set(
      mensalidades.map((cobranca) => toMonthKey(cobranca.dataVencimento)),
    );
    const todayIso = new Date().toISOString().slice(0, 10);
    let created = 0;

    for (let offset = 0; ; offset += 1) {
      const month = addMonths(startMonth, offset);
      if (month > endMonth) break;

      const dueDate = dueDateForMonth(month, dueDay);
      const monthKey = toMonthKey(dueDate);
      const cobrancaId = `fin-${aluno.id}-${monthKey.replace('-', '')}`;
      const alreadyPending = pendingIds.current.has(cobrancaId);
      if (existingMonths.has(monthKey) || alreadyPending) continue;

      pendingIds.current.add(cobrancaId);
      cobrancas.create.mutate(
        {
          id: cobrancaId,
          alunoId: aluno.id,
          nomeAluno: aluno.nome,
          tipo: 'mensalidade',
          descricao: `Mensalidade ${monthLabel(month)}`,
          valor: monthlyValue,
          valorPago: 0,
          dataVencimento: dueDate,
          status: dueDate < todayIso ? 'vencida' : 'aberta',
          observacoes: 'Gerada automaticamente pela data de matrícula.',
        },
        { onSettled: () => pendingIds.current.delete(cobrancaId) },
      );
      created += 1;
    }

    return created;
  }, [cobrancas.create, cobrancasList]);

  const syncMensalidadesParaTodos = useCallback((): ActionResult<{ created: number }> => {
    const created = alunosList.reduce(
      (total, aluno) => total + ensureMensalidadesForAluno(aluno),
      0,
    );
    return { ok: true, data: { created } };
  }, [alunosList, ensureMensalidadesForAluno]);

  return { ensureMensalidadesForAluno, syncMensalidadesParaTodos };
}
