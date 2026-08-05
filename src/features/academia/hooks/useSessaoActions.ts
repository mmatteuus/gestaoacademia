import { useCallback } from 'react';
import { useSessoesAula } from '@/services/queries';
import type { SessaoAula } from '@/types';
import type { ActionResult } from '../academia.types';

type SessoesQuery = ReturnType<typeof useSessoesAula>;

interface UseSessaoActionsOptions {
  sessoesList: SessaoAula[];
  sessoes: SessoesQuery;
}

export function useSessaoActions({ sessoesList, sessoes }: UseSessaoActionsOptions) {
  const addSessao = useCallback(async (sessao: SessaoAula): Promise<ActionResult> => {
    const duplicate = sessoesList.some(
      (item) => item.turmaId === sessao.turmaId && item.data === sessao.data,
    );
    if (duplicate) {
      return { ok: false, message: 'Já existe uma sessão lançada para esta turma nesta data.' };
    }

    try {
      await sessoes.create.mutateAsync(sessao);
      return { ok: true };
    } catch {
      return { ok: false, message: 'Não foi possível salvar a frequência.' };
    }
  }, [sessoes.create, sessoesList]);

  return { addSessao };
}
