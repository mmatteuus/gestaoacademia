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
  { label: 'Pre-cadastro', value: 'pre-cadastro' },
];

function isMinor(dataNascimento: string): boolean {
  if (!dataNascimento) return false;
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
      <span className="w-28 shrink-0 text-xs text-muted-foreground">{label}</span>
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

  const alunoCobrancas = selectedAluno ? cobrancasList.filter((cobranca) => cobranca.alunoId === selectedAluno.id) : [];
  const alunoGraduacao = selectedAluno ? graduacoesAlunosList.find((graduacao) => graduacao.alunoId === selectedAluno.id) : null;
  const alunoResponsavel = selectedAluno?.responsavelId ? responsaveisList.find((responsavel) => responsavel.id === selectedAluno.responsavelId) : null;
  const showResponsavel = !!alunoResponsavel || (selectedAluno ? isMinor(selectedAluno.dataNascimento) : false);

  const turmasDoAluno = useMemo(() => {
    if (!selectedAluno) return [];
    return turmasList.filter((turma) => selectedAluno.turmaIds.includes(turma.id));
  }, [selectedAluno, turmasList]);

  const turmasDisponiveis = useMemo(() => {
    if (!selectedAluno) return [];
    return turmasList.filter((turma) => !selectedAluno.turmaIds.includes(turma.id));
  }, [selectedAluno, turmasList]);

  const percentualGraduacao = alunoGraduacao
    ? Math.round((alunoGraduacao.aulasRealizadas / Math.max(1, alunoGraduacao.aulasNecessarias)) * 100)
    : 0;

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

      {paginated.length === 0 ? (
        <EmptyState
          title="Nenhum aluno encontrado"
          description="Ajuste os filtros ou cadastre um novo aluno."
          action={{ label: 'Cadastrar Aluno', onClick: handleCreate }}
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {paginated.map((aluno) => (
            <button
              key={aluno.id}
              type="button"
              onClick={() => setSelectedAlunoId(aluno.id)}
              className="rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-accent/20"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">{aluno.nome}</p>
                  <p className="text-xs text-muted-foreground">{aluno.categoria || 'Sem categoria'} • {aluno.faixaAtual || 'Sem faixa'}</p>
                </div>
                <StatusBadge status={aluno.status} />
              </div>
              <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                <p>{aluno.telefone || 'Sem telefone'}</p>
                <p>{aluno.email || 'Sem e-mail'}</p>
                <p>{aluno.turmaIds.length} turma(s)</p>
              </div>
              <div className="mt-3 flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleEdit(aluno);
                  }}
                >
                  <Pencil className="mr-1 h-3.5 w-3.5" />
                  Editar
                </Button>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="h-8"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-xs text-muted-foreground">
          Pagina {page} de {totalPages}
        </span>
        <Button
          variant="secondary"
          size="sm"
          className="h-8"
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto bg-card border-border sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingAluno ? 'Editar aluno' : 'Novo aluno'}</DialogTitle>
          </DialogHeader>
          <AlunoForm
            aluno={editingAluno}
            onSubmit={handleFormSubmit}
            onCancel={() => setFormOpen(false)}
            responsaveis={responsaveisList.map((r) => ({ id: r.id, nome: r.nome }))}
          />
        </DialogContent>
      </Dialog>

      <Sheet open={!!selectedAluno} onOpenChange={(open) => !open && setSelectedAlunoId(null)}>
        <SheetContent className="w-full overflow-y-auto border-border bg-card p-0 sm:max-w-3xl">
          {selectedAluno && (
            <div className="space-y-4 p-4">
              <SheetHeader className="flex-row items-center justify-between space-y-0">
                <SheetTitle>{selectedAluno.nome}</SheetTitle>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => handleEdit(selectedAluno)}>
                    <Pencil className="mr-1 h-3.5 w-3.5" />
                    Editar
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setSelectedAlunoId(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </SheetHeader>

              <Tabs defaultValue="perfil" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="perfil">Perfil</TabsTrigger>
                  <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
                  <TabsTrigger value="graduacao">Graduacao</TabsTrigger>
                </TabsList>

                <TabsContent value="perfil" className="space-y-4 pt-2">
                  <div className="space-y-2 rounded-md border border-border p-3">
                    <InfoRow label="Telefone" value={selectedAluno.telefone || '-'} />
                    <InfoRow label="E-mail" value={selectedAluno.email || '-'} />
                    <InfoRow label="CPF" value={selectedAluno.cpf || '-'} />
                    <InfoRow label="Nascimento" value={selectedAluno.dataNascimento || '-'} />
                    <InfoRow label="Faixa" value={selectedAluno.faixaAtual || '-'} />
                    <InfoRow label="Status" value={selectedAluno.status} />
                  </div>

                  {showResponsavel && (
                    <div className="space-y-2 rounded-md border border-border p-3">
                      <p className="text-xs font-semibold text-foreground">Responsavel</p>
                      <InfoRow label="Nome" value={alunoResponsavel?.nome || 'Nao informado'} />
                      <InfoRow label="Telefone" value={alunoResponsavel?.telefone || '-'} />
                      {alunoResponsavel?.telefone && (
                        <a
                          href={getWhatsAppLink(alunoResponsavel.telefone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          Chamar no WhatsApp
                        </a>
                      )}
                    </div>
                  )}

                  <div className="space-y-2 rounded-md border border-border p-3">
                    <p className="text-xs font-semibold text-foreground">Turmas</p>
                    {turmasDoAluno.length === 0 ? (
                      <p className="text-xs text-muted-foreground">Aluno sem turma vinculada.</p>
                    ) : (
                      <div className="space-y-2">
                        {turmasDoAluno.map((turma) => (
                          <div key={turma.id} className="flex items-center justify-between rounded bg-secondary/40 px-2 py-1.5 text-xs">
                            <span>{turma.nome}</span>
                            <Button size="sm" variant="ghost" className="h-7 text-[11px]" onClick={() => removeAlunoFromTurma(selectedAluno.id, turma.id)}>
                              Remover
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    {turmasDisponiveis.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {turmasDisponiveis.slice(0, 5).map((turma) => (
                          <Button
                            key={turma.id}
                            size="sm"
                            variant="secondary"
                            className="h-7 text-[11px]"
                            onClick={() => {
                              const result = addAlunoToTurma(selectedAluno.id, turma.id);
                              if (result.ok) toast.success('Aluno adicionado a turma.');
                              else toast.error(result.message || 'Falha ao vincular turma.');
                            }}
                          >
                            + {turma.nome}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="financeiro" className="space-y-2 pt-2">
                  {alunoCobrancas.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Sem cobrancas para este aluno.</p>
                  ) : (
                    alunoCobrancas.map((cobranca) => (
                      <div key={cobranca.id} className="rounded-md border border-border p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground">{cobranca.descricao}</p>
                          <StatusBadge status={cobranca.status} />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Vencimento: {cobranca.dataVencimento || '-'} • Valor: R$ {cobranca.valor.toFixed(2)}
                        </p>
                      </div>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="graduacao" className="space-y-3 pt-2">
                  {alunoGraduacao ? (
                    <>
                      <div className="rounded-md border border-border p-3">
                        <InfoRow label="Faixa atual" value={alunoGraduacao.faixaAtual || '-'} />
                        <InfoRow label="Proxima faixa" value={alunoGraduacao.proximaFaixa || '-'} />
                        <InfoRow
                          label="Aulas"
                          value={`${alunoGraduacao.aulasRealizadas}/${alunoGraduacao.aulasNecessarias}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Progresso para graduacao</span>
                          <span>{percentualGraduacao}%</span>
                        </div>
                        <Progress value={Math.min(100, percentualGraduacao)} className="h-2" />
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground">Sem dados de graduacao para este aluno.</p>
                  )}
                  <div className="rounded-md border border-border p-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarCheck className="h-3.5 w-3.5" />
                      Historico detalhado sera exibido aqui conforme registros de graduacao.
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}