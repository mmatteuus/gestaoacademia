import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TrendingUp, TrendingDown, Minus, Trophy, Medal, Swords } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInsightsData } from '@/features/insights/InsightsDataProvider';
import type { RankingEntry } from '@/types';

const categorias = ['Todas', 'Adulto', 'Juvenil', 'Infantil', 'Regras'];

export default function RankingPage() {
  const { ranking } = useInsightsData();
  const [catSel, setCatSel] = useState('Todas');
  const [selectedEntry, setSelectedEntry] = useState<RankingEntry | null>(null);

  const filtered = useMemo(
    () => (catSel === 'Todas' || catSel === 'Regras' ? ranking : ranking.filter((item) => item.categoria === catSel)),
    [catSel, ranking]
  );

  const getBreakdown = (entry: RankingEntry) => {
    const medalPoints = entry.medalhas * 25;
    const victoryPoints = entry.vitorias * 15;
    const consistencyPoints = Math.max(0, entry.pontuacao - medalPoints - victoryPoints);

    return [
      { label: 'Vitórias acumuladas', value: `${entry.vitorias} (${victoryPoints} pts)` },
      { label: 'Medalhas conquistadas', value: `${entry.medalhas} (${medalPoints} pts)` },
      { label: 'Consistência / participação', value: `${consistencyPoints} pts` },
      { label: 'Pontuação total', value: `${entry.pontuacao} pts` },
    ];
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Ranking" subtitle="Classificação por temporada e categoria" />

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 sm:flex-wrap sm:overflow-visible">
        {categorias.map((categoria) => (
          <Button key={categoria} variant={catSel === categoria ? 'default' : 'secondary'} size="sm" className="text-xs shrink-0 min-h-[36px]" onClick={() => setCatSel(categoria)}>
            {categoria}
          </Button>
        ))}
      </div>

      {catSel === 'Regras' ? (
        <RankingRegras />
      ) : filtered.length === 0 ? (
        <EmptyState title="Nenhum atleta nesta categoria" description="Selecione outra categoria ou cadastre atletas." />
      ) : (
        <div className="space-y-2">
          {filtered.map((entry) => {
            const variacao = entry.posicaoAnterior - entry.posicao;
            return (
              <button
                key={entry.alunoId}
                type="button"
                onClick={() => setSelectedEntry(entry)}
                className={cn(
                  'w-full bg-card border border-border rounded-lg p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:bg-accent/30 transition-colors text-left',
                  entry.posicao === 1 && 'border-primary/30 glow-primary-sm'
                )}
              >
                <div className={cn(
                  'h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shrink-0',
                  entry.posicao === 1 ? 'bg-primary text-primary-foreground' :
                  entry.posicao === 2 ? 'bg-muted text-foreground' :
                  entry.posicao === 3 ? 'bg-muted text-foreground' :
                  'bg-muted/50 text-muted-foreground'
                )}>
                  {entry.posicao === 1 ? <Trophy className="h-4 w-4" /> : `#${entry.posicao}`}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground truncate">{entry.nomeAluno}</span>
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded hidden sm:inline">{entry.categoria}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span>{entry.vitorias}V</span>
                    <span>{entry.medalhas}M</span>
                    <span className="sm:hidden text-[10px]">{entry.categoria}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-base sm:text-lg font-bold text-foreground">{entry.pontuacao}</div>
                  <div className={cn(
                    'flex items-center justify-end gap-0.5 text-xs',
                    variacao > 0 ? 'text-success' : variacao < 0 ? 'text-destructive' : 'text-muted-foreground'
                  )}>
                    {variacao > 0 ? <TrendingUp className="h-3 w-3" /> : variacao < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                    <span>{variacao > 0 ? `+${variacao}` : variacao === 0 ? '—' : variacao}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          {selectedEntry && (
            <>
              <DialogHeader>
                <DialogTitle className="text-foreground">Como {selectedEntry.nomeAluno} chegou à posição {selectedEntry.posicao}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-muted/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Categoria</p>
                      <p className="text-sm font-semibold text-foreground">{selectedEntry.categoria}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Temporada</p>
                      <p className="text-sm font-semibold text-foreground">{selectedEntry.temporada}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {getBreakdown(selectedEntry).map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2 text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {item.label.includes('Vitórias') ? <Swords className="h-3.5 w-3.5" /> : item.label.includes('Medalhas') ? <Medal className="h-3.5 w-3.5" /> : <Trophy className="h-3.5 w-3.5" />}
                        <span>{item.label}</span>
                      </div>
                      <span className="font-semibold text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RankingRegras() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
        <h3 className="text-base font-semibold text-foreground mb-2">Como funciona o ranking</h3>
        <p className="text-sm text-muted-foreground">
          A pontuação é calculada a partir de três pilares: vitórias em campeonatos, medalhas conquistadas e consistência de
          participação. Quanto maior a participação ativa, maior a posição no ranking da temporada.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Swords className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground">Vitórias</h4>
          </div>
          <p className="text-xs text-muted-foreground">+15 pontos por vitória registrada em campeonato oficial.</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Medal className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground">Medalhas</h4>
          </div>
          <p className="text-xs text-muted-foreground">+25 pontos por medalha conquistada (ouro, prata ou bronze).</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground">Consistência</h4>
          </div>
          <p className="text-xs text-muted-foreground">Pontuação extra concedida pela participação contínua e presença em treinos.</p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
        <h3 className="text-base font-semibold text-foreground mb-3">Categorias</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
            <div>
              <span className="font-medium text-foreground">Adulto</span>
              <span className="text-muted-foreground"> — atletas com 18 anos ou mais.</span>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
            <div>
              <span className="font-medium text-foreground">Juvenil</span>
              <span className="text-muted-foreground"> — atletas entre 14 e 17 anos.</span>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
            <div>
              <span className="font-medium text-foreground">Infantil</span>
              <span className="text-muted-foreground"> — atletas com até 13 anos.</span>
            </div>
          </li>
        </ul>
      </div>

      <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
        <h3 className="text-base font-semibold text-foreground mb-3">Variação de posição</h3>
        <p className="text-sm text-muted-foreground mb-3">
          A seta ao lado da pontuação mostra a evolução do atleta em relação à temporada anterior:
        </p>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2 text-success"><TrendingUp className="h-4 w-4" /> subiu de posição</li>
          <li className="flex items-center gap-2 text-destructive"><TrendingDown className="h-4 w-4" /> caiu de posição</li>
          <li className="flex items-center gap-2 text-muted-foreground"><Minus className="h-4 w-4" /> manteve posição</li>
        </ul>
      </div>
    </div>
  );
}
