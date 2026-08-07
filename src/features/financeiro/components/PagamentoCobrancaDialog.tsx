import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { Cobranca, FormaPagamento } from '@/types';
import { FORMAS_PAGAMENTO } from '../useFinanceiroPage';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cobranca: Cobranca | null;
  valor: string;
  formaPagamento: FormaPagamento;
  observacoes: string;
  onValorChange: (value: string) => void;
  onFormaPagamentoChange: (value: FormaPagamento) => void;
  onObservacoesChange: (value: string) => void;
  onConfirm: () => void;
}

export function PagamentoCobrancaDialog(props: Props) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="border-border bg-card sm:max-w-md">
        <DialogHeader><DialogTitle>Registrar pagamento</DialogTitle></DialogHeader>
        {props.cobranca && (
          <div className="space-y-4">
            <div className="space-y-1 text-xs">
              <p className="text-muted-foreground">Aluno: <span className="font-medium text-foreground">{props.cobranca.nomeAluno}</span></p>
              <p className="text-muted-foreground">Cobrança: <span className="text-foreground">{props.cobranca.descricao}</span></p>
              <p className="text-muted-foreground">Valor total: <span className="text-foreground">R$ {props.cobranca.valor.toFixed(2)}</span></p>
              <p className="text-muted-foreground">Já pago: <span className="text-foreground">R$ {props.cobranca.valorPago.toFixed(2)}</span></p>
            </div>
            <div><label htmlFor="valor-pagamento" className="mb-1 block text-xs text-muted-foreground">Valor do pagamento (R$)</label><Input id="valor-pagamento" type="number" step="0.01" value={props.valor} onChange={(e) => props.onValorChange(e.target.value)} className="h-9 bg-secondary/50 text-sm" /></div>
            <div><label htmlFor="forma-pagamento" className="mb-1 block text-xs text-muted-foreground">Forma de pagamento</label><select id="forma-pagamento" value={props.formaPagamento} onChange={(e) => props.onFormaPagamentoChange(e.target.value as FormaPagamento)} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground">{FORMAS_PAGAMENTO.map((forma) => <option key={forma} value={forma}>{forma}</option>)}</select></div>
            <div><label htmlFor="observacoes-pagamento" className="mb-1 block text-xs text-muted-foreground">Observações</label><textarea id="observacoes-pagamento" value={props.observacoes} onChange={(e) => props.onObservacoesChange(e.target.value)} rows={3} className="w-full resize-none rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground" /></div>
          </div>
        )}
        <DialogFooter className="flex-col gap-2 sm:flex-row"><Button variant="ghost" onClick={() => props.onOpenChange(false)} className="text-xs">Cancelar</Button><Button onClick={props.onConfirm} className="text-xs">Confirmar pagamento</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
