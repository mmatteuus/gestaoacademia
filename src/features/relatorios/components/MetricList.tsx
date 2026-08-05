interface MetricItem {
  label: string;
  value: string | number;
  detail?: string;
}

interface MetricListProps {
  items: MetricItem[];
}

export function MetricList({ items }: MetricListProps) {
  return (
    <dl className="space-y-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-3 text-sm">
          <div>
            <dt className="text-muted-foreground">{item.label}</dt>
            {item.detail && <p className="text-xs text-muted-foreground">{item.detail}</p>}
          </div>
          <dd className="font-semibold text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
