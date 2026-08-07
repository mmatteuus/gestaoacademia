import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { AlunoDetails } from '../hooks/useAlunoDetails';
import { formatDate } from '../alunos.utils';
import { AlunoInfoRow } from './AlunoInfoRow';

export function AlunoFinanceiroTab({ details }: { details: AlunoDetails }) {
  const navigate = useNavigate();
  const aluno = details.aluno;
  if (!aluno) return null;

  return (
    <div className="space-y-2 pt-2">
      <div className="rounded-md border border-border p-3">
        <p className="text-xs font-semibold text-foreground">Resumo financeiro</p>
        <div className="mt-2 space-y-1">
          <AlunoInfoRow label="Mensalidades" value={String(details.mensalidades.length)} />
          <AlunoInfoRow
            label="Próxima pendente"
            value={
              details.mensalidadePendente
                ? `${formatDate(details.mensalidadePendente.dataVencimento)} (R$ ${details.mensalidadePendente.valor.toFixed(2)})`
                : 'Sem pendências'
            }
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-3 h-8 text-xs"
          onClick={() => navigate(`/financeiro?aluno=${aluno.id}`)}
        >
          Abrir financeiro deste aluno
        </Button>
      </div>

      {details.cobrancas.length === 0 ? (
        <p className="text-xs text-muted-foreground">Sem cobranças para este aluno.</p>
      ) : (
        details.cobrancas.map((cobranca) => (
          <div key={cobranca.id} className="rounded-md border border-border p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">{cobranca.descricao}</p>
                <p className="text-[11px] text-muted-foreground">Tipo: {cobranca.tipo}</p>
              </div>
              <StatusBadge status={cobranca.status} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Vencimento: {formatDate(cobranca.dataVencimento)} • Valor: R${' '}
              {cobranca.valor.toFixed(2)} • Pago: R$ {cobranca.valorPago.toFixed(2)}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
