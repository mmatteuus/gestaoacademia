import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, ChevronLeft, ChevronRight, Pencil, CalendarCheck, MessageCircle, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AlunoForm } from '@/components/forms/AlunoForm';
import { useAcademiaData } from '@/features/academia/AcademiaDataProvider';
import { toast } from 'sonner';
import type { Aluno, AlunoStatus } from '@/types';
import type { AlunoFormValues } from '@/features/alunos/types/aluno.types';
import { fromFormToAlunoPatch } from '@/features/alunos/adapters/alunos.adapter';

const statusFilter: { label: string; value: AlunoStatus | 'todos' }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Ativo', value: 'ativo' },
  { label: 'Inadimplente', value: 'inadimplente' },
  { label: 'Trancado', value: 'trancado' },
  { label: 'Inativo', value: 'inativo' },
  { label: 'Pré-cadastro', value: 'pre-cadastro' },
];

function isMinor(dataNascimento: string): boolean {
  const birth = new Date(dataNascimento);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age < 18;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-24 shrink-0 text-xs text-muted-foreground">{label}</span>
      <span className="text-xs text-foreground">{value}</span>
    </div>
  );
}

export default function AlunosPage() {
  const {
    alunosList,
    turmasList,
    addAluno,
    updateAluno,
    addAlunoToTurma,
    removeAlunoFromTurma,
    cobrancasList,
    graduacoesAlunosList,
    responsaveisList,
  } = useAcademiaData();
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<AlunoStatus | 'todos'>('todos');
  const [selectedAlunoId, setSelectedAlunoId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingAlunoId, setEditingAlunoId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 6;

  const selectedAluno = selectedAlunoId ? alunosList.find((aluno) => aluno.id === selectedAlunoId) ?? null : null;
  const editingAluno = editingAlunoId ? alunosList.find((aluno) => aluno.id === editingAlunoId) : undefined;

  const filtered = alunosList.filter((aluno) => {
    const matchBusca = aluno.nome.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === 'todos' || aluno.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleCreate = () => {
    setEditingAlunoId(null);
    setFormOpen(true);
  };

  const handleEdit = (aluno: Aluno) => {
    setEditingAlunoId(aluno.id);
    setFormOpen(true);
    setSelectedAlunoId(null);
  };

  const handleFormSubmit = (values: AlunoFormValues) => {
    const patch = fromFormToAlunoPatch(values);

    if (editingAluno) {
      updateAluno({ ...editingAluno, ...patch, turmaIds: patch.turmaIds || [] });
      toast.success('Aluno atualizado com sucesso.');
    } else {
      const newAluno: Aluno = {
        ...patch,
        id: `a${Date.now()}`,
        turmaIds: patch.turmaIds || [],
        dataMatricula: new Date().toISOString().split('T')[0],
      };
      addAluno(newAluno);
      toast.success('Aluno cadastrado com sucesso.');
    }

    setFormOpen(false);
  };

  const handleAdicionarTurma = (turmaId: string) => {
    if (!selectedAluno) return;
    const result = addAlunoToTurma(selectedAluno.id, turmaId);
    if (!result.ok) {
      toast.error(result.message || 'Não foi possível adicionar o aluno à turma.');
      return;
    }
    const turma = turmasList.find((item) => item.id === turmaId);
    toast.success(`Aluno adicionado à turma ${turma?.nome || 'selecionada'}.`);
  };

  const handleRemoverTurma = (turmaId: string) => {
    if (!selectedAluno) return;
    const result = removeAlunoFromTurma(selectedAluno.id, turmaId);
    if (!result.ok) {
      toast.error(result.message || 'Não foi possível remover o aluno da turma.');
      return;
    }
    const turma = turmasList.find((item) => item.id === turmaId);
    toast.success(`Aluno removido da turma ${turma?.nome || 'selecionada'}.`);
  };

  const alunoCobrancas = selectedAluno ? cobrancasList.filter((cobranca) => cobranca.alunoId === selectedAluno.id) : [];
  const alunoGraduacao = selectedAluno ? graduacoesAlunosList.find((graduacao) => graduacao.alunoId === selectedAluno.id) : null;
  const alunoResponsavel = selectedAluno?.responsavelId ? responsaveisList.find((responsavel) => responsavel.id === selectedAluno.responsavelId) : null;
  const showResponsavel = !!alunoResponsavel || (selectedAluno ? isMinor(selectedAluno.dataNascimento) : false);

  const frequenciasAluno = useMemo(() => {
    if (!selectedAluno) return [];
    // Mantém lógica anterior, a lista de sessões de aula deve vir do contexto futuramente.
    // Por ora, depende apenas das turmas atreladas no context.
    return [];
  }, [selectedAluno, turmasList]);

  const turmasDoAluno = useMemo(() => {
    if (!selectedAluno) return [];
    return turmasList.filter((turma) => selectedAluno.turmaIds.includes(turma.id));
  }, [selectedAluno, turmasList]);

  const turmasDisponiveis = useMemo(() => {
    if (!selectedAluno) return [];
    return turmasList.filter((turma) => !selectedAluno.turmaIds.includes(turma.id));
  }, [selectedAluno, turmasList]);

  const totalPresencas = frequenciasAluno.filter((item) => item.presente).length;
  const percentualFrequencia = frequenciasAluno.length > 0 ? Math.round((totalPresencas / frequenciasAluno.length) * 100) : 0;

  const getWhatsAppLink = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    return `https://wa.me/55${cleanPhone}`;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alunos"
        subtitle={`${alunosList.length} alunos cadastrados`}
        actions={
          <Button size="sm" onClick={handleCreate}>
            <Plus className="mr-1 h-4 w-4" />
            Novo Aluno
          </Button>
        }
      />

      <div className="flex flex-col gap-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar aluno..."
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setPage(1);
            }}
            className="h-9 bg-secondary/50 pl-9 text-xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-1.5">
          {statusFilter.map((statusItem) => (
            <Button
              key={statusItem.value}
              variant={filtroStatus === statusItem.value ? 'default' : 'secondary'}
              size="sm"
              className="h-8 justify-center rounded-full px-3 text-[11px] sm:text-xs"
              onClick={() => {
                setFiltroStatus(statusItem.value);
                setPage(1);
              }}
            >
              {statusItem.label}
            </Button>
          ))}
        </div>
      </div>
      {/* ...restante da página permanece igual... */}
    </div>
  );
}
