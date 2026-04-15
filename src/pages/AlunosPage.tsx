import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { alunos as alunosMock, cobrancas, graduacoesAlunos, responsaveis } from '@/services/mocks/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AlunoForm } from '@/components/forms/AlunoForm';
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
      <span className="text-xs text-muted-foreground w-24 shrink-0">{label}</span>
      <span className="text-xs text-foreground">{value}</span>
    </div>
  );
}

export default function AlunosPage() {
  const [alunosList, setAlunosList] = useState<Aluno[]>(alunosMock);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<AlunoStatus | 'todos'>('todos');
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingAluno, setEditingAluno] = useState<Aluno | undefined>(undefined);
  const [page, setPage] = useState(1);
  const perPage = 6;

  const filtered = alunosList.filter(a => {
    const matchBusca = a.nome.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === 'todos' || a.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleCreate = () => { setEditingAluno(undefined); setFormOpen(true); };
  const handleEdit = (aluno: Aluno) => { setEditingAluno(aluno); setFormOpen(true); setSelectedAluno(null); };

  const handleFormSubmit = (values: AlunoFormValues) => {
    const patch = fromFormToAlunoPatch(values);
    if (editingAluno) {
      setAlunosList((prev) => prev.map((a) => (a.id === editingAluno.id ? { ...a, ...patch } : a)));
      toast.success('Aluno atualizado com sucesso');
    } else {
      const newAluno: Aluno = {
        ...patch,
        id: `a${Date.now()}`,
        turmaIds: patch.turmaIds || [],
        dataMatricula: new Date().toISOString().split('T')[0],
      };
      setAlunosList((prev) => [...prev, newAluno]);
      toast.success('Aluno cadastrado com sucesso');
    }
    setFormOpen(false);
  };

  const alunoCobrancas = selectedAluno ? cobrancas.filter(c => c.alunoId === selectedAluno.id) : [];
  const alunoGraduacao = selectedAluno ? graduacoesAlunos.find(g => g.alunoId === selectedAluno.id) : null;
  const alunoResponsavel = selectedAluno?.responsavelId ? responsaveis.find(r => r.id === selectedAluno.responsavelId) : null;
  const showResponsavel = selectedAluno ? isMinor(selectedAluno.dataNascimento) : false;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alunos"
        subtitle={`${alunosList.length} alunos cadastrados`}
        actions={<Button size="sm" onClick={handleCreate}><Plus className="h-4 w-4 mr-1" />Novo Aluno</Button>}
      />

      <div className="flex flex-col gap-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Buscar aluno..." value={busca} onChange={e => { setBusca(e.target.value); setPage(1); }} className="pl-9 h-9 text-xs bg-secondary/50" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {statusFilter.map(sf => (
            <Button key={sf.value} variant={filtroStatus === sf.value ? 'default' : 'secondary'} size="sm" className="text-xs h-8" onClick={() => { setFiltroStatus(sf.value); setPage(1); }}>
              {sf.label}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Nenhum aluno encontrado" description="Tente ajustar os filtros ou cadastre um novo aluno." />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[600px]">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase tracking-wider">Nome</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase tracking-wider">Categoria</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase tracking-wider">Faixa</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase tracking-wider">Matrícula</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(aluno => (
                    <tr key={aluno.id} className="border-b border-border/50 hover:bg-accent/30 cursor-pointer transition-colors" onClick={() => setSelectedAluno(aluno)}>
                      <td className="py-3 px-4">
                        <span className="font-medium text-foreground">{aluno.nome}</span>
                        <p className="text-muted-foreground mt-0.5">{aluno.email}</p>
                      </td>
                      <td className="py-3 px-4 text-foreground">{aluno.categoria}</td>
                      <td className="py-3 px-4 text-foreground">{aluno.faixaAtual}</td>
                      <td className="py-3 px-4"><StatusBadge status={aluno.status} /></td>
                      <td className="py-3 px-4 text-muted-foreground">{aluno.dataMatricula}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <span className="text-xs text-muted-foreground">{filtered.length} resultado(s)</span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-3.5 w-3.5" /></Button>
                <span className="text-xs text-muted-foreground px-2">{page}/{totalPages || 1}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {paginated.map(aluno => (
              <div key={aluno.id} className="bg-card border border-border rounded-lg p-4 active:bg-accent/30 transition-colors cursor-pointer" onClick={() => setSelectedAluno(aluno)}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{aluno.nome}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{aluno.email}</p>
                  </div>
                  <StatusBadge status={aluno.status} />
                </div>
                <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
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
                <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-3.5 w-3.5" /></Button>
                <span className="text-xs text-muted-foreground px-2">{page}/{totalPages || 1}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Detail Drawer */}
      <Sheet open={!!selectedAluno} onOpenChange={() => setSelectedAluno(null)}>
        <SheetContent className="w-full sm:max-w-lg bg-card border-l border-border overflow-y-auto">
          {selectedAluno && (
            <>
              <SheetHeader>
                <div className="flex items-center justify-between pr-4">
                  <SheetTitle className="text-foreground">{selectedAluno.nome}</SheetTitle>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(selectedAluno)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </SheetHeader>
              <Tabs defaultValue="perfil" className="mt-6">
                <TabsList className="bg-muted/50 w-full grid grid-cols-3">
                  <TabsTrigger value="perfil" className="text-xs">Perfil</TabsTrigger>
                  <TabsTrigger value="financeiro" className="text-xs">Financeiro</TabsTrigger>
                  <TabsTrigger value="graduacao" className="text-xs">Graduação</TabsTrigger>
                </TabsList>

                <TabsContent value="perfil" className="mt-4 space-y-3">
                  <InfoRow label="Email" value={selectedAluno.email} />
                  <InfoRow label="Telefone" value={selectedAluno.telefone} />
                  <InfoRow label="CPF" value={selectedAluno.cpf} />
                  <InfoRow label="Nascimento" value={selectedAluno.dataNascimento} />
                  <InfoRow label="Categoria" value={selectedAluno.categoria} />
                  <InfoRow label="Faixa" value={selectedAluno.faixaAtual} />
                  <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground w-24">Status</span><StatusBadge status={selectedAluno.status} /></div>
                  {showResponsavel && (
                    <div className="mt-2 p-3 rounded-lg bg-muted/30 border border-border space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Responsável</span>
                      </div>
                      {alunoResponsavel ? (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground">{alunoResponsavel.nome}</span>
                            <a
                              href={`https://wa.me/55${alunoResponsavel.telefone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs bg-green-600 hover:bg-green-700 text-white px-2.5 py-1.5 rounded-md transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.198-.672-.24-.943.039-.273.297-.792.967-.971 1.166-.173.198-.347.223-.644.075-.297-.15-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.472.13-.622.149-.149.347-.397.522-.6.173.015.347.025.522.025.174 0 .347-.01.52-.01.198 0 .397.025.596.1.198.075.397.198.57.347.174.149.297.347.372.595.075.149.025.372-.024.57-.049.173-.173.595-.248.795-.075.198-.174.347-.347.521-.149.174-.32.521-.398.694-.075.173-.323.397-.595.595Zm-2.717-2.879c-.148.075-.322.124-.495.124-.174 0-.347-.05-.495-.124-.149-.075-.297-.223-.372-.372-.074-.149-.124-.322-.124-.495 0-.173.05-.347.124-.495.075-.149.223-.297.372-.372.149-.074.322-.124.495-.124.173 0 .347.05.495.124.149.075.297.223.372.372.074.149.124.322.124.495 0 .173-.05.347-.124.495-.075.149-.223.297-.372.372Z"/>
                                <path d="M20.074 3.511c-3.828-3.828-8.922-3.71-12.627.994L3.511 8.44l2.299-.574c2.832 1.755 6.256 1.755 9.088 0l5.833-2.299-2.299 2.299c1.755 2.832 1.755 6.256 0 9.088l-.574 2.299 4.934-4.934c3.71-3.71 3.904-8.799-.994-12.627ZM17.972 14.93c-.372.372-.992.372-1.364 0-.372-.372-.372-.992 0-1.364.372-.372.992-.372 1.364 0 .372.372.372.992 0 1.364Zm2.299-3.462c-.372.372-.992.372-1.364 0-.372-.372-.372-.992 0-1.364.372-.372.992-.372 1.364 0 .372.372.372.992 0 1.364Z"/>
                              </svg>
                              WhatsApp
                            </a>
                          </div>
                          <div className="space-y-1 text-xs">
                            <InfoRow label="Telefone" value={alunoResponsavel.telefone} />
                          </div>
                        </>
                      ) : (
                        <p className="text-xs text-muted-foreground">Nenhum responsável vinculado</p>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="financeiro" className="mt-4 space-y-3">
                  {alunoCobrancas.length === 0 ? (
                    <EmptyState title="Sem cobranças" description="Este aluno não possui cobranças registradas." className="py-8" />
                  ) : (
                    alunoCobrancas.map(c => (
                      <div key={c.id} className="bg-muted/30 rounded-lg p-3 space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <p className="text-xs font-medium text-foreground">{c.descricao}</p>
                          <StatusBadge status={c.status} />
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-muted-foreground">Vencimento: {c.dataVencimento}</span>
                          <span className="text-foreground font-medium">R$ {c.valor.toFixed(2)}</span>
                        </div>
                        {c.valorPago > 0 && c.valorPago < c.valor && (
                          <p className="text-[10px] text-muted-foreground">Pago: R$ {c.valorPago.toFixed(2)} • Restante: R$ {(c.valor - c.valorPago).toFixed(2)}</p>
                        )}
                      </div>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="graduacao" className="mt-4 space-y-4">
                  {alunoGraduacao ? (
                    <>
                      <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
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
                            <span>{alunoGraduacao.aulasNecessarias > 0 ? Math.min(100, Math.round((alunoGraduacao.aulasRealizadas / alunoGraduacao.aulasNecessarias) * 100)) : 100}%</span>
                          </div>
                          <Progress value={alunoGraduacao.aulasNecessarias > 0 ? Math.min(100, (alunoGraduacao.aulasRealizadas / alunoGraduacao.aulasNecessarias) * 100) : 100} className="h-2 bg-muted" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Status:</span>
                          <StatusBadge status={alunoGraduacao.status} />
                        </div>
                      </div>
                      {alunoGraduacao.status === 'elegivel' && (
                        <div className="text-xs bg-warning/10 border border-warning/20 rounded-lg p-3 text-warning">
                          ✨ Este aluno atingiu o mínimo de aulas e está elegível para graduação.
                        </div>
                      )}
                      {alunoGraduacao.status === 'aprovado' && (
                        <div className="text-xs bg-info/10 border border-info/20 rounded-lg p-3 text-info">
                          ✅ Aprovado pelo professor! Aguardando cerimônia de graduação.
                        </div>
                      )}
                    </>
                  ) : (
                    <EmptyState title="Sem dados de graduação" description="Graduação não configurada para este aluno." className="py-8" />
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-xl bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">{editingAluno ? 'Editar Aluno' : 'Novo Aluno'}</DialogTitle>
          </DialogHeader>
          <AlunoForm aluno={editingAluno} onSubmit={handleFormSubmit} onCancel={() => setFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
