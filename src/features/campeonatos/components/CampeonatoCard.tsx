import { Trophy, Users } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import type { Campeonato } from '@/types';

const medalIcons = {
  ouro: '🥇',
  prata: '🥈',
  bronze: '🥉',
} as const;

interface CampeonatoCardProps {
  campeonato: Campeonato;
  onAddStudents: (campeonato: Campeonato) => void;
}

export function CampeonatoCard({ campeonato, onAddStudents }: CampeonatoCardProps) {
  return (
    <article className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/30 sm:p-5">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Trophy className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate">{campeonato.nome}</span>
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {campeonato.data} • {campeonato.local} • {campeonato.modalidade}
          </p>
        </div>
        <StatusBadge status={campeonato.status} />
      </div>

      <Button
        size="sm"
        variant="secondary"
        className="mb-3 text-xs"
        onClick={() => onAddStudents(campeonato)}
      >
        <Users className="mr-1 h-3.5 w-3.5" />
        Adicionar alunos
      </Button>

      <div className="border-t border-border pt-3">
        <p className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
          Participantes ({campeonato.participantes.length})
        </p>

        {campeonato.participantes.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {campeonato.participantes.map((participante) => (
              <div
                key={participante.alunoId}
                className="flex items-center justify-between rounded bg-muted/30 px-3 py-2 text-xs"
              >
                <span className="truncate text-foreground">{participante.nomeAluno}</span>
                <div className="flex shrink-0 items-center gap-1">
                  {participante.medalha && <span>{medalIcons[participante.medalha]}</span>}
                  {participante.pontuacao !== undefined && (
                    <span className="font-semibold text-primary">{participante.pontuacao}pts</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Nenhum participante confirmado ainda.</p>
        )}
      </div>
    </article>
  );
}
