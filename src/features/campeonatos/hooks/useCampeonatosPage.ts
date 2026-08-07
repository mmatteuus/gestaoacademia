import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useAcademiaData } from '@/features/academia/AcademiaDataProvider';
import { useInsightsData } from '@/features/insights/InsightsDataProvider';
import type { Campeonato } from '@/types';
import type { CampeonatoFormField, CampeonatoFormValues } from '../types/campeonatos.types';

const INITIAL_FORM: CampeonatoFormValues = {
  nome: '',
  data: '',
  local: '',
  modalidade: 'Jiu-Jitsu',
};

export function useCampeonatosPage() {
  const { alunosList } = useAcademiaData();
  const { campeonatos, createCampeonato, addParticipantesCampeonato } = useInsightsData();
  const [novoCampeonatoOpen, setNovoCampeonatoOpen] = useState(false);
  const [selecaoAlunosOpen, setSelecaoAlunosOpen] = useState(false);
  const [campeonatoSelecionado, setCampeonatoSelecionado] = useState<Campeonato | null>(null);
  const [alunosSelecionados, setAlunosSelecionados] = useState<string[]>([]);
  const [form, setForm] = useState<CampeonatoFormValues>(INITIAL_FORM);

  const alunosDisponiveis = useMemo(() => {
    if (!campeonatoSelecionado) return alunosList;

    const participantes = new Set(
      campeonatoSelecionado.participantes.map((participante) => participante.alunoId),
    );

    return alunosList.filter((aluno) => !participantes.has(aluno.id));
  }, [alunosList, campeonatoSelecionado]);

  const updateForm = (field: CampeonatoFormField, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const saveCampeonato = () => {
    if (!form.nome.trim() || !form.data.trim()) {
      toast.error('Preencha os campos obrigatórios (Nome e Data)');
      return;
    }

    const result = createCampeonato({
      id: `c${Date.now()}`,
      nome: form.nome,
      data: form.data,
      local: form.local || 'A definir',
      status: 'planejado',
      modalidade: form.modalidade,
      participantes: [],
    });

    if (!result.ok) {
      toast.error(result.message || 'Não foi possível agendar o campeonato.');
      return;
    }

    toast.success('Campeonato agendado com sucesso!');
    setNovoCampeonatoOpen(false);
    setForm(INITIAL_FORM);
  };

  const openStudentSelection = (campeonato: Campeonato) => {
    setCampeonatoSelecionado(campeonato);
    setAlunosSelecionados([]);
    setSelecaoAlunosOpen(true);
  };

  const setStudentSelectionOpen = (open: boolean) => {
    setSelecaoAlunosOpen(open);

    if (!open) {
      setAlunosSelecionados([]);
      setCampeonatoSelecionado(null);
    }
  };

  const toggleStudent = (alunoId: string) => {
    setAlunosSelecionados((current) =>
      current.includes(alunoId)
        ? current.filter((item) => item !== alunoId)
        : [...current, alunoId],
    );
  };

  const confirmStudents = () => {
    if (!campeonatoSelecionado) return;

    if (alunosSelecionados.length === 0) {
      toast.error('Selecione pelo menos um aluno.');
      return;
    }

    const participantes = alunosList
      .filter((aluno) => alunosSelecionados.includes(aluno.id))
      .map((aluno) => ({
        alunoId: aluno.id,
        nomeAluno: aluno.nome,
        categoria: aluno.categoria,
      }));

    const result = addParticipantesCampeonato(campeonatoSelecionado.id, participantes);

    if (!result.ok) {
      toast.error(result.message || 'Não foi possível adicionar os alunos.');
      return;
    }

    toast.success('Alunos adicionados ao campeonato.');
    setStudentSelectionOpen(false);
  };

  return {
    campeonatos,
    novoCampeonatoOpen,
    setNovoCampeonatoOpen,
    form,
    updateForm,
    saveCampeonato,
    selecaoAlunosOpen,
    setStudentSelectionOpen,
    campeonatoSelecionado,
    alunosDisponiveis,
    alunosSelecionados,
    toggleStudent,
    confirmStudents,
    openStudentSelection,
  };
}
