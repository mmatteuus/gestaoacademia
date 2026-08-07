import type { AlunoDetails } from '../hooks/useAlunoDetails';
import { formatDate } from '../alunos.utils';

export function AlunoFrequenciaTab({ details }: { details: AlunoDetails }) {
  return (
    <div className="space-y-3 pt-2">
      <div className="grid grid-cols-3 gap-2">
        <Metric label="Aulas" value={details.totalAulas} />
        <Metric label="Presenças" value={details.totalPresencas} />
        <Metric label="Taxa" value={`${details.taxaPresenca}%`} />
      </div>

      {details.historicoFrequencia.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          Sem histórico de frequência para este aluno.
        </p>
      ) : (
        <div className="space-y-2">
          {details.historicoFrequencia.slice(0, 20).map((registro) => (
            <div
              key={`${registro.sessaoId}-${registro.data}`}
              className="rounded-md border border-border p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-foreground">{registro.turmaNome}</p>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    registro.presente
                      ? 'border-success/20 bg-success/15 text-success'
                      : 'border-destructive/20 bg-destructive/15 text-destructive'
                  }`}
                >
                  {registro.presente ? 'Presente' : 'Falta'}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Data: {formatDate(registro.data)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-border bg-secondary/20 p-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}
