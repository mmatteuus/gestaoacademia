import { useState } from 'react';
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

const modalidades = ['Jiu-Jitsu', 'Karatê', 'Judô', 'Muay Thai'];
const categorias = ['Infantil', 'Juvenil', 'Adulto'];

export default function GraduacaoPage() {
  const { alunosList } = useAcademiaData();
  const { graduacoesAlunos, regrasGraduacao, historicoGraduacoes, upsertRegraGraduacao } = useInsightsData();
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
      toast.error(result.message || 'Não foi possível salvar a regra.');
      return;
    }

    toast.success(editingRegra ? 'Regra de graduação atualizada.' : 'Nova regra de graduação criada.');
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Graduação"
        subtitle="Progresso e regras de graduação"
        actions={
          <Button size="sm" onClick={abrirNovaRegra}>
            <Plus className="h-4 w-4 mr-1" />Nova Regra
          </Button>
        }
      />

      <Tabs defaultValue="progresso">
        <TabsList className="bg-muted/50 flex-wrap h-auto">
          <TabsTrigger value="progresso" className="text-xs">Progresso</TabsTrigger>
          <TabsTrigger value="regras" className="text-xs">Regras</TabsTrigger>
          <TabsTrigger value="historico" className="text-xs">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="progresso" className="mt-4 space-y-3">
          {graduacoesAlunos.length === 0 ? (
            <EmptyState title="Nenhum aluno em processo de graduação" />
          ) : (
            graduacoesAlunos.map((graduacao) => {
              const aluno = alunosList.find((item) => item.id === graduacao.alunoId);
              const progresso = graduacao.aulasNecessarias > 0 ? Math.min(100, Math.round((graduacao.aulasRealizadas / graduacao.aulasNecessarias) * 100)) : 100;
              return (
                <div key={graduacao.alunoId} className="bg-card border border-border rounded-lg p-4 hover:bg-accent/30 transition-colors">
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <div className="min-w-0">
                      <span className="text-sm font-semibold text-foreground truncate block">{aluno?.nome}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">{graduacao.faixaAtual} → {graduacao.proximaFaixa}</p>
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
          <div className="hidden sm:block bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[640px]">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Modalidade</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">De</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Para</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Categoria</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Aulas Min.</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Meses Min.</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {regrasGraduacao.map((regra) => (
                    <tr key={regra.id} className="border-b border-border/50">
                      <td className="py-3 px-4 text-foreground">{regra.modalidade || 'Geral'}</td>
                      <td className="py-3 px-4 text-foreground">{regra.faixaOrigem}</td>
                      <td className="py-3 px-4 text-foreground font-medium">{regra.faixaDestino}</td>
                      <td className="py-3 px-4 text-muted-foreground">{regra.categoria}</td>
                      <td className="py-3 px-4 text-foreground">{regra.aulasMinimas}</td>
                      <td className="py-3 px-4 text-foreground">{regra.mesesMinimos}</td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="secondary" className="text-[10px] h-7" onClick={() => abrirEdicao(regra)}>
                          <Pencil className="h-3 w-3 mr-1" />Editar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="sm:hidden space-y-3">
            {regrasGraduacao.map((regra) => (
              <div key={regra.id} className="bg-card border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">{regra.modalidade || 'Geral'} • {regra.categoria}</p>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <span className="text-foreground">{regra.faixaOrigem}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-foreground font-semibold">{regra.faixaDestino}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="secondary" className="text-[10px] h-7" onClick={() => abrirEdicao(regra)}>
                    <Pencil className="h-3 w-3 mr-1" />Editar
                  </Button>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{regra.aulasMinimas} aulas</span>
                  <span>•</span>
                  <span>{regra.mesesMinimos} meses</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Nota:</strong> Agora as regras podem variar por <strong>modalidade</strong>, o que permite que a mesma academia tenha artes diferentes com critérios próprios.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="historico" className="mt-4 space-y-3">
          {historicoGraduacoes.length === 0 ? (
            <EmptyState title="Nenhuma graduação registrada" />
          ) : (
            historicoGraduacoes.map((historico) => {
              const aluno = alunosList.find((item) => item.id === historico.alunoId);
              return (
                <div key={historico.id} className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
                  <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">🥋</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{aluno?.nome}</p>
                    <p className="text-xs text-muted-foreground">{historico.faixaDe} → {historico.faixaPara} • {historico.data}</p>
                  </div>
                  <span className="text-xs text-muted-foreground hidden sm:block shrink-0">{historico.aprovadoPor}</span>
                </div>
              );
            })
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">{editingRegra ? 'Editar Regra de Graduação' : 'Nova Regra de Graduação'}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Modalidade</label>
              <select value={form.modalidade || 'Jiu-Jitsu'} onChange={(e) => setForm((prev) => ({ ...prev, modalidade: e.target.value }))} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground">
                {modalidades.map((modalidade) => <option key={modalidade} value={modalidade}>{modalidade}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Categoria</label>
              <select value={form.categoria} onChange={(e) => setForm((prev) => ({ ...prev, categoria: e.target.value }))} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground">
                {categorias.map((categoria) => <option key={categoria} value={categoria}>{categoria}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Faixa origem</label>
              <input value={form.faixaOrigem} onChange={(e) => setForm((prev) => ({ ...prev, faixaOrigem: e.target.value }))} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground" placeholder="Branca" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Faixa destino</label>
              <input value={form.faixaDestino} onChange={(e) => setForm((prev) => ({ ...prev, faixaDestino: e.target.value }))} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground" placeholder="Azul" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Aulas mínimas</label>
              <input type="number" min="0" value={form.aulasMinimas} onChange={(e) => setForm((prev) => ({ ...prev, aulasMinimas: Number(e.target.value) }))} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Meses mínimos</label>
              <input type="number" min="0" value={form.mesesMinimos} onChange={(e) => setForm((prev) => ({ ...prev, mesesMinimos: Number(e.target.value) }))} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground" />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={salvarRegra}>{editingRegra ? 'Salvar Alterações' : 'Criar Regra'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
