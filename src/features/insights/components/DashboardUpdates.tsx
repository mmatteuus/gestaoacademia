import type { Alerta, AtividadeRecente } from '@/types';

interface DashboardUpdatesProps {
  alertas: Alerta[];
  atividadesRecentes: AtividadeRecente[];
  cobrancasEmAberto: number;
}

function AlertIndicator({ tipo }: { tipo: Alerta['tipo'] }) {
  const colorClass =
    tipo === 'urgente'
      ? 'bg-destructive'
      : tipo === 'aviso'
        ? 'bg-warning'
        : 'bg-info';

  return <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${colorClass}`} />;
}

export function DashboardUpdates({
  alertas,
  atividadesRecentes,
  cobrancasEmAberto,
}: DashboardUpdatesProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="rounded-lg border border-border bg-card p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Alertas</h2>
          <span className="text-xs text-muted-foreground">
            {cobrancasEmAberto} pendência(s)
          </span>
        </div>

        <div className="space-y-3">
          {alertas.map((alerta) => (
            <div key={alerta.id} className="flex items-start gap-3 text-xs">
              <AlertIndicator tipo={alerta.tipo} />
              <div className="min-w-0 flex-1">
                <p className="text-foreground">{alerta.mensagem}</p>
                <p className="mt-0.5 text-muted-foreground">{alerta.data}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-4 md:p-5">
        <h2 className="mb-4 text-sm font-semibold text-foreground">
          Atividades Recentes
        </h2>

        <div className="space-y-3">
          {atividadesRecentes.map((atividade) => (
            <div key={atividade.id} className="flex items-start gap-3 text-xs">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <div className="min-w-0 flex-1">
                <p className="text-foreground">{atividade.descricao}</p>
                <p className="mt-0.5 text-muted-foreground">{atividade.data}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
