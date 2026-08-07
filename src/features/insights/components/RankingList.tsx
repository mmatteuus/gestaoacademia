import { Minus, TrendingDown, TrendingUp, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RankingEntry } from '@/types';

interface RankingListProps {
  entries: RankingEntry[];
  onSelect: (entry: RankingEntry) => void;
}

function PositionBadge({ position }: { position: number }) {
  return (
    <div
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold sm:h-10 sm:w-10 sm:text-sm',
        position === 1
          ? 'bg-primary text-primary-foreground'
          : position <= 3
            ? 'bg-muted text-foreground'
            : 'bg-muted/50 text-muted-foreground',
      )}
    >
      {position === 1 ? <Trophy className="h-4 w-4" /> : `#${position}`}
    </div>
  );
}

function PositionVariation({ entry }: { entry: RankingEntry }) {
  const variation = entry.posicaoAnterior - entry.posicao;
  const VariationIcon = variation > 0
    ? TrendingUp
    : variation < 0
      ? TrendingDown
      : Minus;

  return (
    <div
      className={cn(
        'flex items-center justify-end gap-0.5 text-xs',
        variation > 0
          ? 'text-success'
          : variation < 0
            ? 'text-destructive'
            : 'text-muted-foreground',
      )}
    >
      <VariationIcon className="h-3 w-3" />
      <span>{variation > 0 ? `+${variation}` : variation === 0 ? '—' : variation}</span>
    </div>
  );
}

function RankingRow({
  entry,
  onSelect,
}: {
  entry: RankingEntry;
  onSelect: (entry: RankingEntry) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(entry)}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:bg-accent/30 sm:gap-4 sm:p-4',
        entry.posicao === 1 && 'border-primary/30 glow-primary-sm',
      )}
    >
      <PositionBadge position={entry.posicao} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-foreground">
            {entry.nomeAluno}
          </span>
          <span className="hidden rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">
            {entry.categoria}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          <span>{entry.vitorias}V</span>
          <span>{entry.medalhas}M</span>
          <span className="text-[10px] sm:hidden">{entry.categoria}</span>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div className="text-base font-bold text-foreground sm:text-lg">
          {entry.pontuacao}
        </div>
        <PositionVariation entry={entry} />
      </div>
    </button>
  );
}

export function RankingList({ entries, onSelect }: RankingListProps) {
  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <RankingRow key={entry.alunoId} entry={entry} onSelect={onSelect} />
      ))}
    </div>
  );
}
