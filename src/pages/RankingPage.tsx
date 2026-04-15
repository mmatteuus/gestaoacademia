import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { ranking } from '@/services/mocks/data';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TrendingUp, TrendingDown, Minus, Trophy, Medal, Swords } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RankingEntry } from '@/types';

const categorias = ['Todas', 'Adulto', 'Juvenil', 'Infantil'];

export default function RankingPage() {
  const [catSel, setCatSel] = useState('Todas');
  const [selectedEntry, setSelectedEntry] = useState<RankingEntry | null>(null);
  const filtered = catSel === 'Todas' ? ranking : ranking.filter((entry) => entry.categoria === catSel);

  const explicacaoRanking = useMemo(() => {
    if (!selectedEntry) return [];

    const basePontuacao = Math.max(0, selectedEntry.vitorias * 60);
    const bonusMedalhas = Math.max(0, selectedEntry.medalhas * 45);
    const bonusPosicao = Math.max(0, selectedEntry.pontuacao - basePontuacao - bonusMedalhas);

    return [
      { label: 'Vitórias', valor: selectedEntry.vitorias, detalhe: `${basePontuacao} pts acumulados nas lutas vencidas` },
      { label: 'Medalhas', valor: selectedEntry.medalhas, detalhe: `${bonusMedalhas} pts em pódios e resultados oficiais` },
      { label: 'Bônus de constância', valor: bonusPosicao, detalhe: 'Pontos complementares por participação, regularidade e evolução recente' },
    ];
  }, [selectedEntry]);

  return (
    <div className="space-y-6">
      <PageHeader title="Ranking" subtitle="Classificação por temporada e categoria" />

      <div className="flex gap-2 flex-wrap">
        {categorias.map((categoria) => (
          <Button key={categoria} variant={catSel === categoria ? 'default' : 'secondary'} size="sm" className="text-xs" onClick={() => setCatSel(categoria)}>
            {categoria}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
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
                  'w-full rounded-lg border border-border bg-card p-3 text-left transition-colors hover:bg-accent/30 sm:p-4',
                  entry.posicao === 1 && 'border-primary/30 glow-primary-sm'
                )}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold sm:h-10 sm:w-10 sm:text-sm',
                      entry.posicao === 1
                        ? 'bg-primary text-primary-foreground'
                        : entry.posicao === 2
                          ? 'bg-muted text-foreground'
                          : entry.posicao === 3
                            ? 'bg-muted text-foreground'
                            : 'bg-muted/50 text-muted-foreground'
                    )}
                  >
                    {entry.posicao === 1 ? <Trophy className="h-4 w-4" /> : `#${entry.posicao}`}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-foreground">{entry.nomeAluno}</span>
                      <span className="hidden rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">{entry.categoria}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{entry.vitorias}V</span>
                      <span>{entry.medalhas}M</span>
                      <span className="text-[10px] sm:hidden">{entry.categoria}</span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="text-base font-bold text-foreground sm:text-lg">{entry.pontuacao}</div>
                    <div
                      className={cn(
                        'flex items-center justify-end gap-0.5 text-xs',
                        variacao > 0 ? 'text-success' : variacao < 0 ? 'text-destructive' : 'text-muted-foreground'
                      )}
                    >
                      {variacao > 0 ? <TrendingUp className="h-3 w-3" /> : variacao < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                      <span>{variacao > 0 ? `+${variacao}` : variacao === 0 ? '—' : variacao}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="border-border bg-card sm:max-w-lg">
          {selectedEntry && (
            <>
              <DialogHeader>
                <DialogTitle className="text-foreground">Como {selectedEntry.nomeAluno} chegou nesta posição</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-muted/30 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Posição atual</p>
                      <p className="text-lg font-semibold text-foreground">#{selectedEntry.posicao}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Pontuação total</p>
                      <p className="text-lg font-semibold text-primary">{selectedEntry.pontuacao} pts</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {explicacaoRanking.map((item) => (
                    <div key={item.label} className="rounded-lg border border-border bg-card p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                          {item.label === 'Vitórias' ? <Swords className="h-4 w-4 text-primary" /> : <Medal className="h-4 w-4 text-primary" />}
                          {item.label}
                        </div>
                        <span className="text-sm font-semibold text-foreground">{item.valor}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{item.detalhe}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
                  O cálculo atual considera desempenho competitivo, quantidade de medalhas e constância de participação na temporada {selectedEntry.temporada}.
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
