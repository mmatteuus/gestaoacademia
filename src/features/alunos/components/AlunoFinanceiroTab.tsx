import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import type { Aluno, Cobranca } from '@/types';
import { formatDate } from '../alunos-page.utils';
import { InfoRow } from './InfoRow';

interface Props {
  aluno: Aluno;
  cobrancas: Cobranca[];
  mensalidades: Cobranca[];
  mensalidadePendente?: Cobranca;
}

export function AlunoFinanceiroTab({ aluno, cobrancas, mensalidades, mensalidadePendente }: Props) {
  const navigate = useNavigate();

  return (
    <div className="space-y-2 pt-2">
      <div className="rounded-md border border-border p-3">
        <p className="text-xs font-semibold text-foreground">Resumo financeiro</p>
        <div className="mt-2 space-y-1">
          <InfoRow label="Mensalidades" value={String(mensalidades.length)} />
          <InfoRow
            label="Próxima pendente"
            value={mensalidadePendente
              ? `${formatDate(mensalidadePendente.dataVencimento)} (R$ ${mensalidadePendente.valor.toFixed(2)})`
              : 'Sem pendências'}
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

      {cobrancas.length === 0 ? (
        <p className="text-xs text-muted-foreground">Sem cobranças para este aluno.</p>
      ) : (
        cobrancas.map((cobranca) => (
          <div key={cobranca.id} className="rounded-md border border-border p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{cobranca.descricao}</p>
                <p className="text-[11px] text-muted-foreground">Tipo: {cobranca.tipo}</p>
              </div>
              <StatusBadge status={cobranca.status} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Vencimento: {formatDate(cobranca.dataVencimento)} • Valor: R$ {cobranca.valor.toFixed(2)} • Pago: R$ {cobranca.valorPago.toFixed(2)}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
