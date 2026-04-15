import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { campeonatos as campeonatosMock, alunos } from '@/services/mocks/data';
import { Button } from '@/components/ui/button';
import { Plus, Trophy, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { Campeonato } from '@/types';

const medalIcons: Record<string, string> = { ouro: '🥇', prata: '🥈', bronze: '🥉' };

export default function CampeonatosPage() {
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>(campeonatosMock);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selecionarAlunosOpen, setSelecionarAlunosOpen] = useState(false);
  const [campeonatoSelecionado, setCampeonatoSelecionado] = useState<Campeonato | null>(null);
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [nome, setNome] = useState('');
  const [data, setData] = useState('');
  const [local, setLocal] = useState('');

  const alunosDisponiveis = useMemo(() => {
    if (!campeonatoSelecionado) return alunos;
    const idsJaInseridos = new Set(campeonatoSelecionado.participantes.map((participante) => participante.alunoId));
    return alunos.filter((aluno) => !idsJaInseridos.has(aluno.id));
  }, [campeonatoSelecionado]);

  const handleSalvar = () => {
    if (!nome.trim() || !data.trim()) {
      toast.error('Preencha os campos obrigatórios (Nome e Data)');
      return;
    }

    setCampeonatos((prev) => [
      {
        id: `c${Date.now()}`,
        nome,
        data,
        local: local || 'A definir',
        status: 'planejado',
        modalidade: 'Geral',
        participantes: [],
      },
      ...prev,
    ]);
    toast.success('Campeonato agendado com sucesso!');
    setDialogOpen(false);
    setNome('');
    setData('');
    setLocal('');
  };

  const abrirSelecaoAlunos = (campeonato: Campeonato) => {
    setCampeonatoSelecionado(campeonato);
    setSelecionados([]);
    setSelecionarAlunosOpen(true);
  };

  const alternarAluno = (alunoId: string) => {
    setSelecionados((prev) => (prev.includes(alunoId) ? prev.filter((item) => item !== alunoId) : [...prev, alunoId]));
  };

  const confirmarAlunos = () => {
    if (!campeonatoSelecionado) return;
    if (selecionados.length === 0) {
      toast.error('Selecione pelo menos um aluno.');
      return;
    }

    setCampeonatos((prev) =>
      prev.map((campeonato) => {
        if (campeonato.id !== campeonatoSelecionado.id) return campeonato;

        const novosParticipantes = alunos
          .filter((aluno) => selecionados.includes(aluno.id))
          .map((aluno) => ({ alunoId: aluno.id, nomeAluno: aluno.nome, categoria: aluno.categoria }));

        return { ...campeonato, participantes: [...campeonato.participantes, ...novosParticipantes] };
      })
    );

    setCampeonatoSelecionado((prev) =>
      prev
        ? {
            ...prev,
            participantes: [
              ...prev.participantes,
              ...alunos.filter((aluno) => selecionados.includes(aluno.id)).map((aluno) => ({ alunoId: aluno.id, nomeAluno: aluno.nome, categoria: aluno.categoria })),
            ],
          }
        : prev
    );

    toast.success('Alunos adicionados ao campeonato.');
    setSelecionarAlunosOpen(false);
    setSelecionados([]);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campeonatos"
        subtitle={`${campeonatos.length} campeonatos registrados`}
        actions={<Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4 mr-1" />Novo Campeonato</Button>}
      />

      {campeonatos.length === 0 ? (
        <EmptyState title="Nenhum campeonato registrado" />
      ) : (
        <div className="space-y-4">
          {campeonatos.map((campeonato) => (
            <div key={campeonato.id} className="bg-card border border-border rounded-lg p-4 sm:p-5 hover:bg-accent/30 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary shrink-0" />
                    <span className="truncate">{campeonato.nome}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">{campeonato.data} • {campeonato.local} • {campeonato.modalidade}</p>
                </div>
                <StatusBadge status={campeonato.status} />
              </div>

              <div className="mb-3 flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" className="text-xs" onClick={() => abrirSelecaoAlunos(campeonato)}>
                  <Users className="h-3.5 w-3.5 mr-1" />Adicionar Alunos
                </Button>
              </div>

              <div className="mt-3 border-t border-border pt-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Participantes ({campeonato.participantes.length})</p>
                {campeonato.participantes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {campeonato.participantes.map((participante) => (
                      <button key={participante.alunoId} type="button" className="flex items-center justify-between bg-muted/30 rounded px-3 py-2 text-xs text-left transition-colors hover:bg-muted/60">
                        <span className="text-foreground truncate">{participante.nomeAluno}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          {participante.medalha && <span>{medalIcons[participante.medalha]}</span>}
                          {participante.pontuacao !== undefined && <span className="text-primary font-semibold">{participante.pontuacao}pts</span>}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Nenhum participante confirmado ainda.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Novo Campeonato</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Nome do Evento *</label>
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-base md:text-sm text-foreground" placeholder="Ex. Copa de Jiu-Jitsu" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Data *</label>
              <input type="date" value={data} onChange={(e) => setData(e.target.value)} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-base md:text-sm text-foreground" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Local</label>
              <input type="text" value={local} onChange={(e) => setLocal(e.target.value)} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-base md:text-sm text-foreground" placeholder="Ex. Ginásio Municipal" />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSalvar}>Agendar Evento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={selecionarAlunosOpen} onOpenChange={setSelecionarAlunosOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Adicionar alunos ao campeonato</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {alunosDisponiveis.length === 0 ? (
              <EmptyState title="Todos os alunos já estão neste campeonato" className="py-6" />
            ) : (
              alunosDisponiveis.map((aluno) => {
                const ativo = selecionados.includes(aluno.id);
                return (
                  <button key={aluno.id} type="button" onClick={() => alternarAluno(aluno.id)} className={`w-full rounded-lg border px-3 py-3 text-left transition-colors ${ativo ? 'border-primary bg-primary/10' : 'border-border bg-card hover:bg-accent/30'}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{aluno.nome}</p>
                        <p className="text-xs text-muted-foreground">{aluno.categoria} • {aluno.faixaAtual}</p>
                      </div>
                      <span className={`rounded-full px-2 py-1 text-[10px] ${ativo ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {ativo ? 'Selecionado' : 'Selecionar'}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="ghost" onClick={() => setSelecionarAlunosOpen(false)}>Cancelar</Button>
            <Button onClick={confirmarAlunos}>Adicionar selecionados</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
