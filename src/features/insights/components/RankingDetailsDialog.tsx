import { Medal, Swords, Trophy, type LucideIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { RankingEntry } from '@/types';

interface RankingDetailsDialogProps {
  entry: RankingEntry | null;
  onClose: () => void;
}

interface BreakdownItem {
  label: string;
  value: string;
  icon: LucideIcon;
}

function getBreakdown(entry: RankingEntry): BreakdownItem[] {
  const medalPoints = entry.medalhas * 25;
  const victoryPoints = entry.vitorias * 15;
  const consistencyPoints = Math.max(
    0,
    entry.pontuacao - medalPoints - victoryPoints,
  );

  return [
    {
      label: 'Vitórias acumuladas',
      value: `${entry.vitorias} (${victoryPoints} pts)`,
      icon: Swords,
    },
    {
      label: 'Medalhas conquistadas',
      value: `${entry.medalhas} (${medalPoints} pts)`,
      icon: Medal,
    },
    {
      label: 'Consistência / participação',
      value: `${consistencyPoints} pts`,
      icon: Trophy,
    },
    {
      label: 'Pontuação total',
      value: `${entry.pontuacao} pts`,
      icon: Trophy,
    },
  ];
}

export function RankingDetailsDialog({
  entry,
  onClose,
}: RankingDetailsDialogProps) {
  return (
    <Dialog open={Boolean(entry)} onOpenChange={onClose}>
      <DialogContent className="border-border bg-card sm:max-w-md">
        {entry && (
          <>
            <DialogHeader>
              <DialogTitle className="text-foreground">
                Como {entry.nomeAluno} chegou à posição {entry.posicao}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Categoria</p>
                    <p className="text-sm font-semibold text-foreground">
                      {entry.categoria}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Temporada</p>
                    <p className="text-sm font-semibold text-foreground">
                      {entry.temporada}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {getBreakdown(entry).map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2 text-xs"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <item.icon className="h-3.5 w-3.5" />
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
  );
}
