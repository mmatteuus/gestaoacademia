import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAcademiaData } from '@/features/academia/AcademiaDataProvider';
import { useInsightsData } from '@/features/insights/InsightsDataProvider';
import type { RegraGraduacao } from '@/types';
import type { RegraGraduacaoValues } from '../schemas/regra-graduacao.schema';

export function useGraduacaoPage() {
  const { alunosList, syncGraduacoesParaTodos } = useAcademiaData();
  const {
    graduacoesAlunos,
    regrasGraduacao,
    historicoGraduacoes,
    upsertRegraGraduacao,
  } = useInsightsData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRegra, setEditingRegra] = useState<RegraGraduacao | null>(null);

  const alunoFiltroId = searchParams.get('aluno') || 'todos';
  const alunos = useMemo(
    () => [...alunosList].sort((left, right) => left.nome.localeCompare(right.nome, 'pt-BR')),
    [alunosList],
  );
  const graduacoes = useMemo(
    () => graduacoesAlunos.filter((item) => alunoFiltroId === 'todos' || item.alunoId === alunoFiltroId),
    [alunoFiltroId, graduacoesAlunos],
  );
  const historico = useMemo(
    () => historicoGraduacoes.filter((item) => alunoFiltroId === 'todos' || item.alunoId === alunoFiltroId),
    [alunoFiltroId, historicoGraduacoes],
  );

  const setAlunoFiltro = (alunoId: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (alunoId === 'todos') nextParams.delete('aluno');
    else nextParams.set('aluno', alunoId);
    setSearchParams(nextParams, { replace: true });
  };

  const abrirNovaRegra = () => {
    setEditingRegra(null);
    setDialogOpen(true);
  };

  const abrirEdicao = (regra: RegraGraduacao) => {
    setEditingRegra(regra);
    setDialogOpen(true);
  };

  const salvarRegra = (values: RegraGraduacaoValues) => {
    const result = upsertRegraGraduacao({
      ...values,
      id: editingRegra?.id || values.id || `regra-${Date.now()}`,
    });

    if (!result.ok) {
      toast.error(result.message || 'Não foi possível salvar a regra.');
      return false;
    }

    toast.success(editingRegra ? 'Regra de graduação atualizada.' : 'Nova regra de graduação criada.');
    setDialogOpen(false);
    return true;
  };

  const sincronizarGraduacoes = () => {
    const result = syncGraduacoesParaTodos();
    if (!result.ok) {
      toast.error(result.message || 'Não foi possível sincronizar as graduações.');
      return;
    }

    const created = result.data?.created ?? 0;
    if (created === 0) {
      toast.info('Nenhum novo vínculo de graduação para criar.');
      return;
    }

    toast.success(`${created} vínculo(s) de graduação criados.`);
  };

  return {
    alunos,
    graduacoes,
    regras: regrasGraduacao,
    historico,
    alunoFiltroId,
    dialogOpen,
    editingRegra,
    setAlunoFiltro,
    setDialogOpen,
    abrirNovaRegra,
    abrirEdicao,
    salvarRegra,
    sincronizarGraduacoes,
  };
}
