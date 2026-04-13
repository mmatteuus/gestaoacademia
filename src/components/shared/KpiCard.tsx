import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  label: string;
  valor: string | number;
  variacao?: number;
  icon?: ReactNode;
  className?: string;
}

export function KpiCard({ label, valor, variacao, icon, className }: KpiCardProps) {
  return (
    <div className={cn(
      "bg-card border border-border rounded-lg p-3 sm:p-4 md:p-5 transition-colors hover:bg-accent/30 group",
      className
    )}>
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <span className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wide leading-tight">{label}</span>
        {icon && <div className="text-muted-foreground group-hover:text-primary transition-colors shrink-0">{icon}</div>}
      </div>
      <div className="text-lg sm:text-2xl md:text-3xl font-bold text-foreground tracking-tight truncate">{valor}</div>
      {variacao !== undefined && (
        <div className={cn(
          "flex items-center gap-1 mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-medium",
          variacao > 0 ? "text-success" : variacao < 0 ? "text-destructive" : "text-muted-foreground"
        )}>
          {variacao > 0 ? <TrendingUp className="h-3 w-3" /> : variacao < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
          <span>{variacao > 0 ? '+' : ''}{variacao}%</span>
          <span className="hidden sm:inline"> vs mês anterior</span>
        </div>
      )}
    </div>
  );
}
