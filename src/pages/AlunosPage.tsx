import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { cobrancas, graduacoesAlunos, responsaveis, sessoesAula } from '@/services/mocks/data';
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
  const { alunosList, turmasList, addAluno, updateAluno, addAlunoToTurma, removeAlunoFromTurma } = useAcademiaData();
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

  const alunoCobrancas = selectedAluno ? cobrancas.filter((cobranca) => cobranca.alunoId === selectedAluno.id) : [];
  const alunoGraduacao = selectedAluno ? graduacoesAlunos.find((graduacao) => graduacao.alunoId === selectedAluno.id) : null;
  const alunoResponsavel = selectedAluno?.responsavelId ? responsaveis.find((responsavel) => responsavel.id === selectedAluno.responsavelId) : null;
  const showResponsavel = !!alunoResponsavel || (selectedAluno ? isMinor(selectedAluno.dataNascimento) : false);

  const frequenciasAluno = useMemo(() => {
    if (!selectedAluno) return [];

    return sessoesAula
      .filter((sessao) => sessao.presencas.some((presenca) => presenca.alunoId === selectedAluno.id))
      .map((sessao) => {
        const presenca = sessao.presencas.find((item) => item.alunoId === selectedAluno.id);
        const turma = turmasList.find((item) => item.id === sessao.turmaId);
        return {
          id: sessao.id,
          data: sessao.data,
          professor: sessao.professor,
          turmaNome: turma?.nome || 'Turma não encontrada',
          presente: !!presenca?.presente,
        };
      })
      .sort((a, b) => b.data.localeCompare(a.data));
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

      {filtered.length === 0 ? (
        <EmptyState title="Nenhum aluno encontrado" description="Tente ajustar os filtros ou cadastre um novo aluno." />
      ) : (
        <>
          <div className="hidden rounded-lg border border-border bg-card overflow-hidden sm:block">
            <div className="overflow-x-auto">
              <table className="min-w-[600px] w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-muted-foreground">Nome</th>
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-muted-foreground">Categoria</th>
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-muted-foreground">Faixa</th>
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-muted-foreground">Matrícula</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((aluno) => (
                    <tr
                      key={aluno.id}
                      className="cursor-pointer border-b border-border/50 transition-colors hover:bg-accent/30"
                      onClick={() => setSelectedAlunoId(aluno.id)}
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium text-foreground">{aluno.nome}</span>
                        <p className="mt-0.5 text-muted-foreground">{aluno.email}</p>
                      </td>
                      <td className="px-4 py-3 text-foreground">{aluno.categoria}</td>
                      <td className="px-4 py-3 text-foreground">{aluno.faixaAtual}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={aluno.status} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{aluno.dataMatricula}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <span className="text-xs text-muted-foreground">{filtered.length} resultado(s)</span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <span className="px-2 text-xs text-muted-foreground">{page}/{totalPages}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page >= totalPages} onClick={() => setPage((prev) => prev + 1)}>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-3 sm:hidden">
            {paginated.map((aluno) => (
              <div key={aluno.id} className="cursor-pointer rounded-lg border border-border bg-card p-4 transition-colors active:bg-accent/30" onClick={() => setSelectedAlunoId(aluno.id)}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{aluno.nome}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{aluno.email}</p>
                  </div>
                  <StatusBadge status={aluno.status} />
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{aluno.categoria}</span>
                  <span>•</span>
                  <span>{aluno.faixaAtual}</span>
                  <span>•</span>
                  <span>{aluno.dataMatricula}</span>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">{filtered.length} resultado(s)</span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <span className="px-2 text-xs text-muted-foreground">{page}/{totalPages}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page >= totalPages} onClick={() => setPage((prev) => prev + 1)}>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      <Sheet open={!!selectedAluno} onOpenChange={() => setSelectedAlunoId(null)}>
        <SheetContent className="w-full overflow-y-auto border-l border-border bg-card sm:max-w-lg">
          {selectedAluno && (
            <>
              <SheetHeader>
                <div className="flex items-center justify-between gap-3 pr-4">
                  <SheetTitle className="text-foreground">{selectedAluno.nome}</SheetTitle>
                  <Button variant="secondary" size="sm" className="h-8 rounded-full px-3 text-xs" onClick={() => handleEdit(selectedAluno)}>
                    <Pencil className="mr-1 h-3.5 w-3.5" />
                    Editar
                  </Button>
                </div>
              </SheetHeader>

              <Tabs defaultValue="perfil" className="mt-6">
                <TabsList className="grid h-auto w-full grid-cols-2 gap-2 bg-muted/50 p-1 sm:grid-cols-4 lg:grid-cols-5">
                  <TabsTrigger value="perfil" className="text-xs">Perfil</TabsTrigger>
                  <TabsTrigger value="financeiro" className="text-xs">Financeiro</TabsTrigger>
                  <TabsTrigger value="graduacao" className="text-xs">Graduação</TabsTrigger>
                  <TabsTrigger value="frequencia" className="text-xs">Frequência</TabsTrigger>
                  {showResponsavel && <TabsTrigger value="responsavel" className="text-xs">Responsável</TabsTrigger>}
                </TabsList>

                <TabsContent value="perfil" className="mt-4 space-y-3">
                  <InfoRow label="Email" value={selectedAluno.email} />
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/20 p-3">
                    <InfoRow label="Telefone" value={selectedAluno.telefone} />
                    <Button variant="secondary" size="sm" className="h-8 rounded-full px-3 text-xs" asChild>
                      <a href={getWhatsAppLink(selectedAluno.telefone)} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="mr-1 h-3.5 w-3.5" />
                        WhatsApp
                      </a>
                    </Button>
                  </div>
                  <InfoRow label="CPF" value={selectedAluno.cpf} />
                  <InfoRow label="Nascimento" value={selectedAluno.dataNascimento} />
                  <InfoRow label="Categoria" value={selectedAluno.categoria} />
                  <InfoRow label="Faixa" value={selectedAluno.faixaAtual} />
                  <div className="flex items-center gap-2">
                    <span className="w-24 text-xs text-muted-foreground">Status</span>
                    <StatusBadge status={selectedAluno.status} />
                  </div>
                </TabsContent>

                <TabsContent value="financeiro" className="mt-4 space-y-3">
                  {alunoCobrancas.length === 0 ? (
                    <EmptyState title="Sem cobranças" description="Este aluno não possui cobranças registradas." className="py-8" />
                  ) : (
                    alunoCobrancas.map((cobranca) => (
                      <div key={cobranca.id} className="space-y-1 rounded-lg bg-muted/30 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-medium text-foreground">{cobranca.descricao}</p>
                          <StatusBadge status={cobranca.status} />
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-muted-foreground">Vencimento: {cobranca.dataVencimento}</span>
                          <span className="font-medium text-foreground">R$ {cobranca.valor.toFixed(2)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="graduacao" className="mt-4 space-y-4">
                  {alunoGraduacao ? (
                    <div className="space-y-3 rounded-lg bg-muted/30 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Faixa atual</p>
                          <p className="text-sm font-semibold text-foreground">{alunoGraduacao.faixaAtual}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Próxima faixa</p>
                          <p className="text-sm font-semibold text-primary">{alunoGraduacao.proximaFaixa}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{alunoGraduacao.aulasRealizadas}/{alunoGraduacao.aulasNecessarias} aulas</span>
                          <span>
                            {alunoGraduacao.aulasNecessarias > 0
                              ? Math.min(100, Math.round((alunoGraduacao.aulasRealizadas / alunoGraduacao.aulasNecessarias) * 100))
                              : 100}
                            %
                          </span>
                        </div>
                        <Progress
                          value={
                            alunoGraduacao.aulasNecessarias > 0
                              ? Math.min(100, (alunoGraduacao.aulasRealizadas / alunoGraduacao.aulasNecessarias) * 100)
                              : 100
                          }
                          className="h-2 bg-muted"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Status:</span>
                        <StatusBadge status={alunoGraduacao.status} />
                      </div>
                    </div>
                  ) : (
                    <EmptyState title="Sem dados de graduação" description="Graduação não configurada para este aluno." className="py-8" />
                  )}
                </TabsContent>

                <TabsContent value="frequencia" className="mt-4 space-y-4">
                  <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Turmas vinculadas</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {turmasDoAluno.length > 0 ? (
                          turmasDoAluno.map((turma) => (
                            <div key={turma.id} className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                              <span className="px-1">{turma.nome}</span>
                              <button type="button" onClick={() => handleRemoverTurma(turma.id)} className="rounded-full p-0.5 hover:bg-black/10" aria-label={`Remover ${turma.nome}`}>
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">Nenhuma turma vinculada ainda.</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">Adicionar a uma turma existente</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {turmasDisponiveis.length > 0 ? (
                          turmasDisponiveis.map((turma) => (
                            <Button
                              key={turma.id}
                              size="sm"
                              variant="secondary"
                              className="h-8 rounded-full px-3 text-xs"
                              onClick={() => handleAdicionarTurma(turma.id)}
                            >
                              <Plus className="mr-1 h-3.5 w-3.5" />
                              {turma.nome}
                            </Button>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">Este aluno já está vinculado em todas as turmas disponíveis.</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {frequenciasAluno.length === 0 ? (
                    <EmptyState title="Sem histórico de frequência" description="Ainda não há aulas lançadas para este aluno." className="py-8" />
                  ) : (
                    <>
                      <div className="rounded-lg border border-border bg-muted/30 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs text-muted-foreground">Presenças registradas</p>
                            <p className="text-sm font-semibold text-foreground">{totalPresencas} de {frequenciasAluno.length}</p>
                          </div>
                          <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            {percentualFrequencia}% de frequência
                          </div>
                        </div>
                        <Progress value={percentualFrequencia} className="mt-3 h-2 bg-muted" />
                      </div>

                      <div className="space-y-3">
                        {frequenciasAluno.map((item) => (
                          <div key={item.id} className="rounded-lg border border-border bg-card p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="flex items-center gap-2 text-xs font-semibold text-foreground">
                                  <CalendarCheck className="h-3.5 w-3.5 text-primary" />
                                  {item.turmaNome}
                                </p>
                                <p className="mt-1 text-[11px] text-muted-foreground">{item.data} • {item.professor}</p>
                              </div>
                              <StatusBadge status={item.presente ? 'ativo' : 'inativo'} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </TabsContent>

                {showResponsavel && (
                  <TabsContent value="responsavel" className="mt-4 space-y-3">
                    {alunoResponsavel ? (
                      <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                        <p className="text-sm font-semibold text-foreground">{alunoResponsavel.nome}</p>
                        <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/70 p-3">
                          <InfoRow label="Telefone" value={alunoResponsavel.telefone} />
                          <Button variant="secondary" size="sm" className="h-8 rounded-full px-3 text-xs" asChild>
                            <a href={getWhatsAppLink(alunoResponsavel.telefone)} target="_blank" rel="noopener noreferrer">
                              <MessageCircle className="mr-1 h-3.5 w-3.5" />
                              WhatsApp
                            </a>
                          </Button>
                        </div>
                        <InfoRow label="Email" value={alunoResponsavel.email || 'Não informado'} />
                        <InfoRow label="CPF" value={alunoResponsavel.cpf} />
                      </div>
                    ) : (
                      <EmptyState title="Sem responsável vinculado" description="Este aluno ainda não possui responsável relacionado." className="py-8" />
                    )}
                  </TabsContent>
                )}
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">{editingAluno ? 'Editar Aluno' : 'Novo Aluno'}</DialogTitle>
          </DialogHeader>
          <AlunoForm aluno={editingAluno} onSubmit={handleFormSubmit} onCancel={() => setFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
