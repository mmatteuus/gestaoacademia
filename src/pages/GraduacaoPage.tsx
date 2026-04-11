import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { graduacoesAlunos, regrasGraduacao, historicoGraduacoes, alunos } from '@/mocks/data';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

export default function GraduacaoPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Graduação" subtitle="Progresso e regras de graduação" />

      <Tabs defaultValue="progresso">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="progresso" className="text-xs">Progresso dos Alunos</TabsTrigger>
          <TabsTrigger value="regras" className="text-xs">Regras</TabsTrigger>
          <TabsTrigger value="historico" className="text-xs">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="progresso" className="mt-4 space-y-3">
          {graduacoesAlunos.map(g => {
            const aluno = alunos.find(a => a.id === g.alunoId);
            const progresso = g.aulasNecessarias > 0 ? Math.min(100, Math.round((g.aulasRealizadas / g.aulasNecessarias) * 100)) : 100;
            return (
              <div key={g.alunoId} className="bg-card border border-border rounded-lg p-4 hover:bg-accent/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-sm font-semibold text-foreground">{aluno?.nome}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{g.faixaAtual} → {g.proximaFaixa}</p>
                  </div>
                  <StatusBadge status={g.status} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{g.aulasRealizadas}/{g.aulasNecessarias} aulas</span>
                    <span>{progresso}%</span>
                  </div>
                  <Progress value={progresso} className="h-2 bg-muted" />
                </div>
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="regras" className="mt-4">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">De</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Para</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Categoria</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Aulas Min.</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Meses Min.</th>
                </tr>
              </thead>
              <tbody>
                {regrasGraduacao.map(r => (
                  <tr key={r.id} className="border-b border-border/50">
                    <td className="py-3 px-4 text-foreground">{r.faixaOrigem}</td>
                    <td className="py-3 px-4 text-foreground font-medium">{r.faixaDestino}</td>
                    <td className="py-3 px-4 text-muted-foreground">{r.categoria}</td>
                    <td className="py-3 px-4 text-foreground">{r.aulasMinimas}</td>
                    <td className="py-3 px-4 text-foreground">{r.mesesMinimos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Nota:</strong> Atingir o mínimo de aulas torna o aluno <strong>elegível</strong>, mas a graduação só ocorre após <strong>aprovação do professor</strong>.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="historico" className="mt-4 space-y-3">
          {historicoGraduacoes.map(h => {
            const aluno = alunos.find(a => a.id === h.alunoId);
            return (
              <div key={h.id} className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
                <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">🥋</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{aluno?.nome}</p>
                  <p className="text-xs text-muted-foreground">{h.faixaDe} → {h.faixaPara} • {h.data}</p>
                </div>
                <span className="text-xs text-muted-foreground hidden sm:block">{h.aprovadoPor}</span>
              </div>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
