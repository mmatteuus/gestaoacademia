export const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--info))',
  'hsl(var(--muted-foreground))',
];

export const WEEK_DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const TOOLTIP_STYLE = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 8,
  fontSize: 12,
  color: 'hsl(var(--foreground))',
};

export const AXIS_TICK = {
  fontSize: 11,
  fill: 'hsl(var(--muted-foreground))',
};

export function getHeatColor(value: number) {
  if (value >= 90) return 'bg-primary/90 text-primary-foreground';
  if (value >= 80) return 'bg-primary/60 text-primary-foreground';
  if (value >= 70) return 'bg-primary/35 text-foreground';
  if (value >= 50) return 'bg-primary/20 text-foreground';
  return 'bg-muted/40 text-muted-foreground';
}
