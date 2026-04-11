import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { campeonatos } from '@/mocks/data';
import { Button } from '@/components/ui/button';
import { Plus, Trophy, Medal } from 'lucide-react';

const medalIcons: Record<string, string> = { ouro: '🥇', prata: '🥈', bronze: '🥉' };

export default function CampeonatosPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Campeonatos"
        subtitle={`${campeonatos.length} campeonatos registrados`}
        actions={<Button size="sm"><Plus className="h-4 w-4 mr-1" />Novo Campeonato</Button>}
      />

      <div className="space-y-4">
        {campeonatos.map(c => (
          <div key={c.id} className="bg-card border border-border rounded-lg p-5 hover:bg-accent/30 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  {c.nome}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">{c.data} • {c.local} • {c.modalidade}</p>
              </div>
              <StatusBadge status={c.status} />
            </div>
            <div className="mt-3 border-t border-border pt-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Participantes ({c.participantes.length})</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {c.participantes.map(p => (
                  <div key={p.alunoId} className="flex items-center justify-between bg-muted/30 rounded px-3 py-2 text-xs">
                    <span className="text-foreground">{p.nomeAluno}</span>
                    <div className="flex items-center gap-1">
                      {p.medalha && <span>{medalIcons[p.medalha]}</span>}
                      {p.pontuacao !== undefined && <span className="text-primary font-semibold">{p.pontuacao}pts</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
