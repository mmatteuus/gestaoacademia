import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { useAcademiaData } from '@/features/academia/AcademiaDataProvider';
import { useInsightsData } from '@/features/insights/InsightsDataProvider';
import type { RegraGraduacao } from '@/types';

const modalidades = ['Jiu-Jitsu', 'Karate', 'Judo', 'Muay Thai'];
const categorias = ['Infantil', 'Juvenil', 'Adulto'];

export default function GraduacaoPage() {
  const { alunosList, syncGraduacoesParaTodos } = useAcademiaData();
  const { graduacoesAlunos, regrasGraduacao, historicoGraduacoes, upsertRegraGraduacao } = useInsightsData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRegra, setEditingRegra] = useState<RegraGraduacao | null>(null);
  const [form, setForm] = useState<RegraGraduacao>({
    id: '',
    modalidade: 'Jiu-Jitsu',
    faixaOrigem: '',
    faixaDestino: '',
    categoria: 'Adulto',
    aulasMinimas: 0,
    mesesMinimos: 0,
  });

  const alunoFiltroId = searchParams.get('aluno') || 'todos';

  const graduacoesFiltradas = useMemo(
    () => graduacoesAlunos.filter((item) => alunoFiltroId === 'todos' || item.alunoId === alunoFiltroId),
    [graduacoesAlunos, alunoFiltroId]
  );

  const historicoFiltrado = useMemo(
    () => historicoGraduacoes.filter((item) => alunoFiltroId === 'todos' || item.alunoId === alunoFiltroId),
    [historicoGraduacoes, alunoFiltroId]
  );

  const abrirNovaRegra = () => {
    setEditingRegra(null);
    setForm({ id: '', modalidade: 'Jiu-Jitsu', faixaOrigem: '', faixaDestino: '', categoria: 'Adulto', aulasMinimas: 0, mesesMinimos: 0 });
    setDialogOpen(true);
  };

  const abrirEdicao = (regra: RegraGraduacao) => {
    setEditingRegra(regra);
    setForm(regra);
    setDialogOpen(true);
  };

  const salvarRegra = () => {
    const result = upsertRegraGraduacao({
      ...form,
      id: editingRegra?.id || form.id,
    });

    if (!result.ok) {
      toast.error(result.message || 'Nao foi possivel salvar a regra.');
      return;
    }

    toast.success(editingRegra ? 'Regra de graduacao atualizada.' : 'Nova regra de graduacao criada.');
    setDialogOpen(false);
  };

  const handleFiltroAlunoChange = (alunoId: string) => {
    const next = new URLSearchParams(searchParams);
    if (alunoId === 'todos') {
      next.delete('aluno');
    } else {
      next.set('aluno', alunoId);
    }
    setSearchParams(next, { replace: true });
  };

  const handleSincronizarGraduacoes = () => {
    const result = syncGraduacoesParaTodos();
    if (!result.ok) {
      toast.error(result.message || 'Falha ao sincronizar graduacoes.');
      return;
    }

    const created = result.data?.created ?? 0;
    if (created === 0) {
      toast.info('Nenhum novo vinculo de graduacao para criar.');
      return;
    }

    toast.success(`${created} vinculo(s) de graduacao criados.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Graduacao"
        subtitle="Progresso e regras de graduacao"
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={handleSincronizarGraduacoes}>
              Sincronizar alunos
            </Button>
            <Button size="sm" onClick={abrirNovaRegra}>
              <Plus className="mr-1 h-4 w-4" />Nova Regra
            </Button>
          </div>
        }
      />

      <div className="max-w-sm">
        <label htmlFor="graduacao-aluno-filtro" className="mb-1 block text-xs text-muted-foreground">Filtrar por aluno</label>
        <select
          id="graduacao-aluno-filtro"
          value={alunoFiltroId}
          onChange={(e) => handleFiltroAlunoChange(e.target.value)}
          className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-xs text-foreground"
        >
          <option value="todos">Todos os alunos</option>
          {alunosList
            .slice()
            .sort((a, b) => a.nome.localeCompare(b.nome))
            .map((aluno) => (
              <option key={aluno.id} value={aluno.id}>
                {aluno.nome}
              </option>
            ))}
        </select>
      </div>

      <Tabs defaultValue="progresso">
        <TabsList className="h-auto flex-wrap bg-muted/50">
          <TabsTrigger value="progresso" className="text-xs">Progresso</TabsTrigger>
          <TabsTrigger value="regras" className="text-xs">Regras</TabsTrigger>
          <TabsTrigger value="historico" className="text-xs">Historico</TabsTrigger>
        </TabsList>

        <TabsContent value="progresso" className="mt-4 space-y-3">
          {graduacoesFiltradas.length === 0 ? (
            <EmptyState title="Nenhum aluno em processo de graduacao" />
          ) : (
            graduacoesFiltradas.map((graduacao) => {
              const aluno = alunosList.find((item) => item.id === graduacao.alunoId);
              const progresso = graduacao.aulasNecessarias > 0 ? Math.min(100, Math.round((graduacao.aulasRealizadas / graduacao.aulasNecessarias) * 100)) : 100;
              return (
                <div key={graduacao.alunoId} className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/30">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-foreground">{aluno?.nome}</span>
                      <p className="mt-0.5 text-xs text-muted-foreground">{graduacao.faixaAtual} -&gt; {graduacao.proximaFaixa}</p>
                    </div>
                    <StatusBadge status={graduacao.status} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{graduacao.aulasRealizadas}/{graduacao.aulasNecessarias} aulas</span>
                      <span>{progresso}%</span>
                    </div>
                    <Progress value={progresso} className="h-2 bg-muted" />
                  </div>
                </div>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="regras" className="mt-4 space-y-4">
          <div className="hidden overflow-hidden rounded-lg border border-border bg-card sm:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Modalidade</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">De</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Para</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Categoria</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Aulas Min.</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Meses Min.</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Acao</th>
                  </tr>
                </thead>
                <tbody>
                  {regrasGraduacao.map((regra) => (
                    <tr key={regra.id} className="border-b border-border/50">
                      <td className="px-4 py-3 text-foreground">{regra.modalidade || 'Geral'}</td>
                      <td className="px-4 py-3 text-foreground">{regra.faixaOrigem}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{regra.faixaDestino}</td>
                      <td className="px-4 py-3 text-muted-foreground">{regra.categoria}</td>
                      <td className="px-4 py-3 text-foreground">{regra.aulasMinimas}</td>
                      <td className="px-4 py-3 text-foreground">{regra.mesesMinimos}</td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="secondary" className="h-7 text-[10px]" onClick={() => abrirEdicao(regra)}>
                          <Pencil className="mr-1 h-3 w-3" />Editar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3 sm:hidden">
            {regrasGraduacao.map((regra) => (
              <div key={regra.id} className="space-y-3 rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">{regra.modalidade || 'Geral'} - {regra.categoria}</p>
                    <div className="mt-1 flex items-center gap-2 text-sm">
                      <span className="text-foreground">{regra.faixaOrigem}</span>
                      <span className="text-muted-foreground">-&gt;</span>
                      <span className="font-semibold text-foreground">{regra.faixaDestino}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="secondary" className="h-7 text-[10px]" onClick={() => abrirEdicao(regra)}>
                    <Pencil className="mr-1 h-3 w-3" />Editar
                  </Button>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{regra.aulasMinimas} aulas</span>
                  <span>-</span>
                  <span>{regra.mesesMinimos} meses</span>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Nota:</strong> as regras podem variar por <strong>modalidade</strong>, permitindo criterios diferentes por arte.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="historico" className="mt-4 space-y-3">
          {historicoFiltrado.length === 0 ? (
            <EmptyState title="Nenhuma graduacao registrada" />
          ) : (
            historicoFiltrado.map((historico) => {
              const aluno = alunosList.find((item) => item.id === historico.alunoId);
              return (
                <div key={historico.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15">
                    <span className="text-xs font-bold text-primary">G</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{aluno?.nome}</p>
                    <p className="text-xs text-muted-foreground">{historico.faixaDe} -&gt; {historico.faixaPara} - {historico.data}</p>
                  </div>
                  <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">{historico.aprovadoPor}</span>
                </div>
              );
            })
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border-border bg-card sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground">{editingRegra ? 'Editar Regra de Graduacao' : 'Nova Regra de Graduacao'}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
            <div>
              <label htmlFor="regra-modalidade" className="mb-1 block text-xs text-muted-foreground">Modalidade</label>
              <select id="regra-modalidade" value={form.modalidade || 'Jiu-Jitsu'} onChange={(e) => setForm((prev) => ({ ...prev, modalidade: e.target.value }))} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground">
                {modalidades.map((modalidade) => <option key={modalidade} value={modalidade}>{modalidade}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="regra-categoria" className="mb-1 block text-xs text-muted-foreground">Categoria</label>
              <select id="regra-categoria" value={form.categoria} onChange={(e) => setForm((prev) => ({ ...prev, categoria: e.target.value }))} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground">
                {categorias.map((categoria) => <option key={categoria} value={categoria}>{categoria}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="regra-faixa-origem" className="mb-1 block text-xs text-muted-foreground">Faixa origem</label>
              <input id="regra-faixa-origem" value={form.faixaOrigem} onChange={(e) => setForm((prev) => ({ ...prev, faixaOrigem: e.target.value }))} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground" placeholder="Branca" />
            </div>
            <div>
              <label htmlFor="regra-faixa-destino" className="mb-1 block text-xs text-muted-foreground">Faixa destino</label>
              <input id="regra-faixa-destino" value={form.faixaDestino} onChange={(e) => setForm((prev) => ({ ...prev, faixaDestino: e.target.value }))} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground" placeholder="Azul" />
            </div>
            <div>
              <label htmlFor="regra-aulas-minimas" className="mb-1 block text-xs text-muted-foreground">Aulas minimas</label>
              <input id="regra-aulas-minimas" type="number" min="0" value={form.aulasMinimas} onChange={(e) => setForm((prev) => ({ ...prev, aulasMinimas: Number(e.target.value) }))} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground" />
            </div>
            <div>
              <label htmlFor="regra-meses-minimos" className="mb-1 block text-xs text-muted-foreground">Meses minimos</label>
              <input id="regra-meses-minimos" type="number" min="0" value={form.mesesMinimos} onChange={(e) => setForm((prev) => ({ ...prev, mesesMinimos: Number(e.target.value) }))} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground" />
            </div>
          </div>

          <DialogFooter className="mt-4 flex-col gap-2 sm:flex-row">
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={salvarRegra}>{editingRegra ? 'Salvar Alteracoes' : 'Criar Regra'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
