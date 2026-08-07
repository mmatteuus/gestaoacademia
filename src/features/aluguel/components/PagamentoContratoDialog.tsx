import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { ContratoAluguel, FormaPagamento } from '@/types';
import { FORMAS_PAGAMENTO } from '../useAluguelPage';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contrato: ContratoAluguel | null;
  telefone: string;
  valor: string;
  formaPagamento: Exclude<FormaPagamento, 'Boleto'>;
  referencia: string;
  observacoes: string;
  onTelefoneChange: (value: string) => void;
  onValorChange: (value: string) => void;
  onFormaPagamentoChange: (value: Exclude<FormaPagamento, 'Boleto'>) => void;
  onReferenciaChange: (value: string) => void;
  onObservacoesChange: (value: string) => void;
  onSave: () => void;
}

export function PagamentoContratoDialog(props: Props) {
  const inputClass = 'h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground';
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="border-border bg-card sm:max-w-md">
        <DialogHeader><DialogTitle>Registrar pagamento do contrato</DialogTitle></DialogHeader>
        {props.contrato && (
          <div className="space-y-4 py-2">
            <div className="space-y-1 text-xs">
              <p className="text-muted-foreground">Locatário: <span className="font-medium text-foreground">{props.contrato.locatario}</span></p>
              <p className="text-muted-foreground">Espaço: <span className="text-foreground">{props.contrato.espaco}</span></p>
              <p className="text-muted-foreground">Valor do contrato: <span className="text-foreground">R$ {props.contrato.valor.toFixed(2)}</span></p>
            </div>
            <Field label="Telefone para envio do comprovante"><div className="relative"><Phone className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" /><input value={props.telefone} onChange={(e) => props.onTelefoneChange(e.target.value)} className={`${inputClass} pl-9`} /></div></Field>
            <Field label="Valor pago"><input type="number" min="0" step="0.01" value={props.valor} onChange={(e) => props.onValorChange(e.target.value)} className={inputClass} /></Field>
            <Field label="Forma de pagamento"><select value={props.formaPagamento} onChange={(e) => props.onFormaPagamentoChange(e.target.value as Exclude<FormaPagamento, 'Boleto'>)} className={inputClass}>{FORMAS_PAGAMENTO.map((forma) => <option key={forma} value={forma}>{forma}</option>)}</select></Field>
            <Field label="Referência"><input value={props.referencia} onChange={(e) => props.onReferenciaChange(e.target.value)} className={inputClass} /></Field>
            <Field label="Observações"><textarea value={props.observacoes} onChange={(e) => props.onObservacoesChange(e.target.value)} rows={3} className="w-full resize-none rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground" /></Field>
          </div>
        )}
        <DialogFooter className="mt-4 flex-col gap-2 sm:flex-row"><Button variant="ghost" onClick={() => props.onOpenChange(false)}>Cancelar</Button><Button onClick={props.onSave}>Salvar pagamento</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="mb-1 block text-xs text-muted-foreground">{label}</label>{children}</div>;
}
