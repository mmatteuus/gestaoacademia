import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react';
import {
  useAlunos,
  useTurmas,
  useSessoesAula,
  useCobrancas,
  useGraduacoesAlunos,
  useResponsaveis,
} from '@/services/queries';
import type { Aluno, SessaoAula, Turma, Cobranca, GraduacaoAluno, Responsavel } from '@/types';

interface ActionResult<T = undefined> {
  ok: boolean;
  message?: string;
  data?: T;
}

interface AcademiaDataContextValue {
  alunosList: Aluno[];
  turmasList: Turma[];
  sessoesList: SessaoAula[];
  cobrancasList: Cobranca[];
  graduacoesAlunosList: GraduacaoAluno[];
  responsaveisList: Responsavel[];
  isLoading: boolean;
  addAluno: (aluno: Aluno) => Promise<ActionResult>;
  updateAluno: (aluno: Aluno) => Promise<ActionResult>;
  addTurma: (turma: Turma) => Promise<ActionResult>;
  updateTurma: (turma: Turma) => Promise<ActionResult>;
  addAlunoToTurma: (alunoId: string, turmaId: string) => ActionResult;
  removeAlunoFromTurma: (alunoId: string, turmaId: string) => ActionResult;
  addSessao: (sessao: SessaoAula) => Promise<ActionResult>;
  syncMensalidadesParaTodos: () => ActionResult<{ created: number }>;
  syncGraduacoesParaTodos: () => ActionResult<{ created: number }>;
}

const AcademiaDataContext = createContext<AcademiaDataContextValue | undefined>(undefined);

const DEFAULT_MENSALIDADE = 180;
const DEFAULT_AULAS_GRADUACAO = 20;
const FAIXAS_ORDEM = ['Branca', 'Amarela', 'Laranja', 'Verde', 'Azul', 'Roxa', 'Marrom', 'Preta'];

function toMonthKey(dateIso: string) {
  if (!dateIso || dateIso.length < 7) return '';
  return dateIso.slice(0, 7);
}

function parseIsoDate(value: string | undefined): Date {
  if (!value) return new Date();
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return new Date();
  return parsed;
}

function monthLabel(month: Date) {
  const mm = String(month.getMonth() + 1).padStart(2, '0');
  const yyyy = month.getFullYear();
  return `${mm}/${yyyy}`;
}

function addMonths(base: Date, months: number) {
  const clone = new Date(base);
  clone.setMonth(clone.getMonth() + months);
  return clone;
}

function dueDateForMonth(month: Date, preferredDay: number) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  const day = Math.min(Math.max(preferredDay, 1), lastDay);
  const mm = String(monthIndex + 1).padStart(2, '0');
  return `${year}-${mm}-${String(day).padStart(2, '0')}`;
}

function nextFaixaFrom(currentFaixa: string) {
  const idx = FAIXAS_ORDEM.findIndex((faixa) => faixa.toLowerCase() === currentFaixa.toLowerCase());
  if (idx === -1 || idx >= FAIXAS_ORDEM.length - 1) return FAIXAS_ORDEM[0];
  return FAIXAS_ORDEM[idx + 1];
}

export function AcademiaDataProvider({ children }: { children: ReactNode }) {
  const alunos = useAlunos();
  const turmas = useTurmas();
  const sessoes = useSessoesAula();
  const cobrancas = useCobrancas();
  const graduacoesAlunos = useGraduacoesAlunos();
  const responsaveis = useResponsaveis();

  const alunosList = alunos.list.data ?? [];
  const turmasList = turmas.list.data ?? [];
  const sessoesList = sessoes.list.data ?? [];
  const cobrancasList = cobrancas.list.data ?? [];
  const graduacoesAlunosList = graduacoesAlunos.list.data ?? [];
  const responsaveisList = responsaveis.list.data ?? [];

  const isLoading =
    alunos.list.isLoading || turmas.list.isLoading || sessoes.list.isLoading;
  const pendingMensalidadeIds = useRef<Set<string>>(new Set());
  const pendingGraduacaoIds = useRef<Set<string>>(new Set());
  const didBootstrapSync = useRef(false);

  /** Propaga em turmas os alunoIds para refletir o turmaIds do aluno. */
  const syncTurmasForAluno = async (alunoId: string, turmaIds: string[]): Promise<void> => {
    const tasks: Promise<unknown>[] = [];
    for (const turma of turmasList) {
      const shouldContain = turmaIds.includes(turma.id);
      const alreadyContains = turma.alunoIds.includes(alunoId);
      if (shouldContain && !alreadyContains) {
        tasks.push(turmas.update.mutateAsync({
          id: turma.id,
          data: { alunoIds: [...turma.alunoIds, alunoId] },
        }));
      } else if (!shouldContain && alreadyContains) {
        tasks.push(turmas.update.mutateAsync({
          id: turma.id,
          data: { alunoIds: turma.alunoIds.filter((id) => id !== alunoId) },
        }));
      }
    }
    await Promise.allSettled(tasks);
  };

  const addAluno = async (aluno: Aluno): Promise<ActionResult> => {
    try {
      await alunos.create.mutateAsync(aluno);
      await syncTurmasForAluno(aluno.id, aluno.turmaIds);
      ensureMensalidadesForAluno(aluno);
      ensureGraduacaoForAluno(aluno);
      return { ok: true };
    } catch {
      return { ok: false, message: 'Nao foi possivel cadastrar o aluno.' };
    }
  };

  const updateAluno = async (aluno: Aluno): Promise<ActionResult> => {
    try {
      await alunos.update.mutateAsync({ id: aluno.id, data: aluno });
      await syncTurmasForAluno(aluno.id, aluno.turmaIds);
      ensureMensalidadesForAluno(aluno);
      ensureGraduacaoForAluno(aluno);
      return { ok: true };
    } catch {
      return { ok: false, message: 'Nao foi possivel atualizar o aluno.' };
    }
  };

  const addTurma = async (turma: Turma): Promise<ActionResult> => {
    try {
      await turmas.create.mutateAsync(turma);
      return { ok: true };
    } catch {
      return { ok: false, message: 'Nao foi possivel criar a turma.' };
    }
  };

  const updateTurma = async (turmaAtualizada: Turma): Promise<ActionResult> => {
    const turmaAnterior = turmasList.find((turma) => turma.id === turmaAtualizada.id);
    if (!turmaAnterior) return { ok: false, message: 'Turma não encontrada.' };

    if (turmaAtualizada.capacidade < turmaAtualizada.alunoIds.length) {
      return { ok: false, message: 'A capacidade não pode ser menor do que a quantidade atual de alunos.' };
    }

    try {
      await turmas.update.mutateAsync({ id: turmaAtualizada.id, data: turmaAtualizada });
    } catch {
      return { ok: false, message: 'Nao foi possivel atualizar a turma.' };
    }

    // Sincroniza turma_ids nos alunos impactados
    for (const aluno of alunosList) {
      const shouldContain = turmaAtualizada.alunoIds.includes(aluno.id);
      const alreadyContains = aluno.turmaIds.includes(turmaAtualizada.id);
      if (shouldContain && !alreadyContains) {
        alunos.update.mutate({
          id: aluno.id,
          data: { turmaIds: [...aluno.turmaIds, turmaAtualizada.id] },
        });
      } else if (!shouldContain && alreadyContains) {
        alunos.update.mutate({
          id: aluno.id,
          data: { turmaIds: aluno.turmaIds.filter((id) => id !== turmaAtualizada.id) },
        });
      }
    }

    return { ok: true };
  };

  const addAlunoToTurma = (alunoId: string, turmaId: string): ActionResult => {
    const turma = turmasList.find((item) => item.id === turmaId);
    const aluno = alunosList.find((item) => item.id === alunoId);
    if (!turma || !aluno) return { ok: false, message: 'Aluno ou turma não encontrado.' };
    if (turma.alunoIds.includes(alunoId)) return { ok: false, message: 'Este aluno já está vinculado à turma.' };
    if (turma.alunoIds.length >= turma.capacidade) return { ok: false, message: 'A turma já atingiu a capacidade máxima.' };

    turmas.update.mutate({ id: turmaId, data: { alunoIds: [...turma.alunoIds, alunoId] } });
    alunos.update.mutate({ id: alunoId, data: { turmaIds: [...aluno.turmaIds, turmaId] } });
    return { ok: true };
  };

  const removeAlunoFromTurma = (alunoId: string, turmaId: string): ActionResult => {
    const turma = turmasList.find((item) => item.id === turmaId);
    const aluno = alunosList.find((item) => item.id === alunoId);
    if (!turma || !aluno) return { ok: false, message: 'Aluno ou turma não encontrado.' };
    if (!turma.alunoIds.includes(alunoId)) return { ok: false, message: 'Este aluno não está vinculado à turma.' };

    turmas.update.mutate({
      id: turmaId,
      data: { alunoIds: turma.alunoIds.filter((id) => id !== alunoId) },
    });
    alunos.update.mutate({
      id: alunoId,
      data: { turmaIds: aluno.turmaIds.filter((id) => id !== turmaId) },
    });
    return { ok: true };
  };

  const addSessao = async (sessao: SessaoAula): Promise<ActionResult> => {
    const existeSessaoMesmoDia = sessoesList.some(
      (item) => item.turmaId === sessao.turmaId && item.data === sessao.data
    );
    if (existeSessaoMesmoDia) {
      return { ok: false, message: 'Já existe uma sessão lançada para esta turma nesta data.' };
    }
    try {
      await sessoes.create.mutateAsync(sessao);
      return { ok: true };
    } catch {
      return { ok: false, message: 'Nao foi possivel salvar a frequencia.' };
    }
  };

  const ensureMensalidadesForAluno = (aluno: Aluno): number => {
    if (aluno.status === 'inativo' || aluno.status === 'pre-cadastro') {
      return 0;
    }

    const startDate = parseIsoDate(aluno.dataMatricula);
    const currentDate = new Date();
    const startMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const endMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const dueDay = startDate.getDate() || 5;
    const existingMensalidades = cobrancasList.filter(
      (cobranca) => cobranca.alunoId === aluno.id && cobranca.tipo === 'mensalidade'
    );
    const monthlyValue =
      existingMensalidades[0]?.valor && existingMensalidades[0].valor > 0
        ? existingMensalidades[0].valor
        : DEFAULT_MENSALIDADE;
    const existingMonthKeys = new Set(existingMensalidades.map((cobranca) => toMonthKey(cobranca.dataVencimento)));
    const todayIso = new Date().toISOString().slice(0, 10);

    let created = 0;
    let offset = 0;
    while (true) {
      const monthCursor = addMonths(startMonth, offset);
      if (monthCursor > endMonth) break;

      const dueDate = dueDateForMonth(monthCursor, dueDay);
      const monthKey = toMonthKey(dueDate);
      const cobrancaId = `fin-${aluno.id}-${monthKey.replace('-', '')}`;
      const alreadyQueued = pendingMensalidadeIds.current.has(cobrancaId);
      if (!existingMonthKeys.has(monthKey) && !alreadyQueued) {
        pendingMensalidadeIds.current.add(cobrancaId);
        cobrancas.create.mutate(
          {
            id: cobrancaId,
            alunoId: aluno.id,
            nomeAluno: aluno.nome,
            tipo: 'mensalidade',
            descricao: `Mensalidade ${monthLabel(monthCursor)}`,
            valor: monthlyValue,
            valorPago: 0,
            dataVencimento: dueDate,
            status: dueDate < todayIso ? 'vencida' : 'aberta',
            observacoes: 'Gerada automaticamente pela data de matricula.',
          },
          {
            onSettled: () => {
              pendingMensalidadeIds.current.delete(cobrancaId);
            },
          }
        );
        created += 1;
      }

      offset += 1;
    }

    return created;
  };

  const syncMensalidadesParaTodos = (): ActionResult<{ created: number }> => {
    let created = 0;
    for (const aluno of alunosList) {
      created += ensureMensalidadesForAluno(aluno);
    }
    return { ok: true, data: { created } };
  };

  const ensureGraduacaoForAluno = (aluno: Aluno): number => {
    const existing = graduacoesAlunosList.some((graduacao) => graduacao.alunoId === aluno.id);
    const graduacaoId = `grad-${aluno.id}`;
    if (existing || pendingGraduacaoIds.current.has(graduacaoId)) {
      return 0;
    }

    const faixaAtual = aluno.faixaAtual || FAIXAS_ORDEM[0];
    const proximaFaixa = nextFaixaFrom(faixaAtual);
    pendingGraduacaoIds.current.add(graduacaoId);
    graduacoesAlunos.create.mutate(
      {
        id: graduacaoId,
        alunoId: aluno.id,
        faixaAtual,
        proximaFaixa,
        aulasRealizadas: 0,
        aulasNecessarias: DEFAULT_AULAS_GRADUACAO,
        status: 'nao-elegivel',
      },
      {
        onSettled: () => {
          pendingGraduacaoIds.current.delete(graduacaoId);
        },
      }
    );

    return 1;
  };

  const syncGraduacoesParaTodos = (): ActionResult<{ created: number }> => {
    let created = 0;
    for (const aluno of alunosList) {
      created += ensureGraduacaoForAluno(aluno);
    }
    return { ok: true, data: { created } };
  };

  useEffect(() => {
    if (isLoading || didBootstrapSync.current) return;
    didBootstrapSync.current = true;
    syncMensalidadesParaTodos();
    syncGraduacoesParaTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const value = useMemo<AcademiaDataContextValue>(
    () => ({
      alunosList,
      turmasList,
      sessoesList,
      cobrancasList,
      graduacoesAlunosList,
      responsaveisList,
      isLoading,
      addAluno,
      updateAluno,
      addTurma,
      updateTurma,
      addAlunoToTurma,
      removeAlunoFromTurma,
      addSessao,
      syncMensalidadesParaTodos,
      syncGraduacoesParaTodos,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [alunosList, turmasList, sessoesList, cobrancasList, graduacoesAlunosList, responsaveisList, isLoading]
  );

  return <AcademiaDataContext.Provider value={value}>{children}</AcademiaDataContext.Provider>;
}

export function useAcademiaData() {
  const context = useContext(AcademiaDataContext);
  if (!context) {
    throw new Error('useAcademiaData deve ser usado dentro de AcademiaDataProvider');
  }
  return context;
}
