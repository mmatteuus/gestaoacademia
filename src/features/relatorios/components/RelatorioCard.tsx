import type { PropsWithChildren } from 'react';

interface RelatorioCardProps extends PropsWithChildren {
  title: string;
}

export function RelatorioCard({ title, children }: RelatorioCardProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </section>
  );
}
