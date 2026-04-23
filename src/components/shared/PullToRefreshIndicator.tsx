import { Loader2, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Indicador visual no topo da página quando o usuário está puxando para
 * atualizar. A seta gira ao passar do threshold; durante o refresh vira
 * um loader.
 */
export function PullToRefreshIndicator({
  distance,
  threshold,
  refreshing,
}: {
  distance: number;
  threshold: number;
  refreshing: boolean;
}) {
  if (distance === 0 && !refreshing) return null;
  const reached = distance >= threshold;
  const progress = Math.min(distance / threshold, 1);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-center transition-transform"
      style={{
        transform: `translateY(${refreshing ? threshold : distance}px) translateY(-100%)`,
      }}
      aria-hidden
    >
      <div className="rounded-full bg-background/90 backdrop-blur border border-border shadow-lg p-2">
        {refreshing ? (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        ) : (
          <ArrowDown
            className={cn(
              'h-5 w-5 transition-transform',
              reached ? 'rotate-180 text-primary' : 'text-muted-foreground'
            )}
            style={{ opacity: 0.4 + progress * 0.6 }}
          />
        )}
      </div>
    </div>
  );
}
