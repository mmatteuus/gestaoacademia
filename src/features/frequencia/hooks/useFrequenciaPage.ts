import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { haptic } from '@/lib/haptics';
import { useAcademiaData } from '@/features/academia/AcademiaDataProvider';
import type { SessaoAula } from '@/types';
import type { FrequenciaValues } from '../schemas/frequencia.schema';

export function useFrequenciaPage() {
  const { turmasList, alunosList, sessoesList, addSessao } = useAcademiaData();
  const [turmaId, setTurmaId] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [presencas, setPresencas] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!turmaId && turmasList.length > 0) setTurmaId(turmasList[0].id);
  }, [turmaId, turmasList]);

  const turma = useMemo(
    () => turmasList.find((item) => item.id === turmaId),
    [turmaId, turmasList],
  );
  const sessoes = useMemo(
    () => sessoesList.filter((sessao) => sessao.turmaId === turmaId),
    [sessoesList, turmaId],
  );

  const abrirLancamento = () => {
    if (!turma) return;
    if (turma.alunoIds.length === 0) {
      toast.error('Esta turma ainda não possui alunos vinculados.');
      return;
    }

    setPresencas(Object.fromEntries(turma.alunoIds.map((id) => [id, true])));
    setDialogOpen(true);
  };

  const togglePresenca = (alunoId: string) => {
    setPresencas((current) => ({ ...current, [alunoId]: !current[alunoId] }));
  };

  const salvarFrequencia = async (values: FrequenciaValues) => {
    if (!turma) return false;

    const sessao: SessaoAula = {
      id: `s${Date.now()}`,
      turmaId,
      data: values.data,
      professor: turma.professor,
      presencas: turma.alunoIds.map((alunoId) => ({
        alunoId,
        presente: presencas[alunoId] ?? false,
      })),
    };

    const result = await addSessao(sessao);
    if (!result.ok) {
      toast.error(result.message || 'Não foi possível salvar a frequência.');
      return false;
    }

    toast.success('Frequência registrada com sucesso.');
    haptic('success');
    setDialogOpen(false);
    return true;
  };

  return {
    turmas: turmasList,
    alunos: alunosList,
    sessoes,
    turma,
    turmaId,
    dialogOpen,
    presencas,
    setTurmaId,
    setDialogOpen,
    abrirLancamento,
    togglePresenca,
    salvarFrequencia,
  };
}
