import { cn } from '@/lib/utils';
import type { AlunoStatus, CobrancaStatus, GraduacaoStatus } from '@/types';

const statusColors: Record<string, string> = {
  // Aluno
  'pre-cadastro': 'bg-info/15 text-info border-info/20',
  'ativo': 'bg-success/15 text-success border-success/20',
  'trancado': 'bg-warning/15 text-warning border-warning/20',
  'inadimplente': 'bg-destructive/15 text-destructive border-destructive/20',
  'inativo': 'bg-muted text-muted-foreground border-border',
  // Cobrança
  'aberta': 'bg-info/15 text-info border-info/20',
  'parcial': 'bg-warning/15 text-warning border-warning/20',
  'paga': 'bg-success/15 text-success border-success/20',
  'vencida': 'bg-destructive/15 text-destructive border-destructive/20',
  'cancelada': 'bg-muted text-muted-foreground border-border',
  'estornada': 'bg-muted text-muted-foreground border-border',
  // Graduação
  'nao-elegivel': 'bg-muted text-muted-foreground border-border',
  'elegivel': 'bg-warning/15 text-warning border-warning/20',
  'aprovado': 'bg-primary/15 text-primary border-primary/20',
  'graduado': 'bg-success/15 text-success border-success/20',
  // Campeonato
  'planejado': 'bg-muted text-muted-foreground border-border',
  'inscricoes-abertas': 'bg-info/15 text-info border-info/20',
  'em-andamento': 'bg-warning/15 text-warning border-warning/20',
  'finalizado': 'bg-success/15 text-success border-success/20',
  // Reserva
  'confirmada': 'bg-success/15 text-success border-success/20',
  'pendente': 'bg-warning/15 text-warning border-warning/20',
  // Estoque
  'estoque-baixo': 'bg-warning/15 text-warning border-warning/20',
  'sem-estoque': 'bg-destructive/15 text-destructive border-destructive/20',
  'estoque-ok': 'bg-success/15 text-success border-success/20',
};

const statusLabels: Record<string, string> = {
  'pre-cadastro': 'Pré-cadastro',
  'ativo': 'Ativo',
  'trancado': 'Trancado',
  'inadimplente': 'Inadimplente',
  'inativo': 'Inativo',
  'aberta': 'Aberta',
  'parcial': 'Parcial',
  'paga': 'Paga',
  'vencida': 'Vencida',
  'cancelada': 'Cancelada',
  'estornada': 'Estornada',
  'nao-elegivel': 'Não Elegível',
  'elegivel': 'Elegível',
  'aprovado': 'Aprovado',
  'graduado': 'Graduado',
  'planejado': 'Planejado',
  'inscricoes-abertas': 'Inscrições Abertas',
  'em-andamento': 'Em Andamento',
  'finalizado': 'Finalizado',
  'confirmada': 'Confirmada',
  'pendente': 'Pendente',
  'estoque-baixo': 'Estoque Baixo',
  'sem-estoque': 'Sem Estoque',
  'estoque-ok': 'Em Estoque',
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
      statusColors[status] || 'bg-muted text-muted-foreground border-border',
      className
    )}>
      {statusLabels[status] || status}
    </span>
  );
}
