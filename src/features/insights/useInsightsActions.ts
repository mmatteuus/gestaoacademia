import { useCallback } from 'react';
import { useCampeonatos, useRegrasGraduacao } from '@/services/queries';
import type { Campeonato, RegraGraduacao } from '@/types';
import type { ActionResult } from './insights.types';

type CampeonatosQuery = ReturnType<typeof useCampeonatos>;
type RegrasQuery = ReturnType<typeof useRegrasGraduacao>;

interface UseInsightsActionsOptions {
  campeonatos: Campeonato[];
  regras: RegraGraduacao[];
  campeonatosQuery: CampeonatosQuery;
  regrasQuery: RegrasQuery;
}

export function useInsightsActions({
  campeonatos,
  regras,
  campeonatosQuery,
  regrasQuery,
}: UseInsightsActionsOptions) {
  const upsertRegraGraduacao = useCallback((regra: RegraGraduacao): ActionResult<RegraGraduacao> => {
    if (!regra.faixaOrigem.trim() || !regra.faixaDestino.trim()) {
      return { ok: false, message: 'Preencha as faixas de origem e destino.' };
    }

    const exists = regras.some((item) => item.id === regra.id);
    if (exists) regrasQuery.update.mutate({ id: regra.id, data: regra });
    else regrasQuery.create.mutate(regra);

    return { ok: true, data: regra };
  }, [regras, regrasQuery.create, regrasQuery.update]);

  const createCampeonato = useCallback((campeonato: Campeonato): ActionResult<Campeonato> => {
    campeonatosQuery.create.mutate(campeonato);
    return { ok: true, data: campeonato };
  }, [campeonatosQuery.create]);

  const addParticipantesCampeonato = useCallback((
    campeonatoId: string,
    participantes: Campeonato['participantes'],
  ): ActionResult => {
    const campeonato = campeonatos.find((item) => item.id === campeonatoId);
    if (!campeonato) return { ok: false, message: 'Campeonato não encontrado.' };

    const existingIds = new Set(campeonato.participantes.map((item) => item.alunoId));
    const newParticipants = participantes.filter((item) => !existingIds.has(item.alunoId));
    campeonatosQuery.update.mutate({
      id: campeonatoId,
      data: { participantes: [...campeonato.participantes, ...newParticipants] },
    });
    return { ok: true };
  }, [campeonatos, campeonatosQuery.update]);

  return { upsertRegraGraduacao, createCampeonato, addParticipantesCampeonato };
}
