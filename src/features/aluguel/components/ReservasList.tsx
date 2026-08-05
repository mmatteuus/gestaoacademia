import { AlertTriangle } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { cn } from '@/lib/utils';
import type { Reserva } from '@/types';
import type { ReservaDetalhada } from '../types/aluguel.types';
import { formatCurrency } from '../utils/aluguel.utils';

interface ReservasListProps {
  reservas: Reserva[];
}

export function ReservasList({ reservas }: ReservasListProps) {
  if (reservas.length === 0) return <EmptyState title="Nenhuma reserva" />;

  return (
    <div className="space-y-3">
      {reservas.map((reserva) => {
        const detalhada = reserva as ReservaDetalhada;
        return (
          <article
            key={reserva.id}
            className={cn(
              'rounded-lg border bg-card p-4 transition-colors hover:bg-accent/30',
              reserva.conflito ? 'border-destructive/50' : 'border-border',
            )}
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <span className="truncate">{reserva.locatario}</span>
                  {reserva.conflito && <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-destructive" />}
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{reserva.espaco}</p>
              </div>
              <StatusBadge status={reserva.status} />
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span>{reserva.dataInicio}</span>
              <span>{reserva.horaInicio} - {reserva.horaFim}</span>
              <span>{detalhada.locatarioTelefone || 'Telefone não informado'}</span>
              <span className="font-medium text-foreground">{formatCurrency(reserva.valor)}</span>
            </div>

            {reserva.conflito && (
              <p className="mt-2 rounded bg-destructive/10 px-2 py-1 text-[10px] text-destructive">
                Conflito de horário detectado neste espaço.
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
}
