import { Minus, Percent, Phone, Plus, Trash2 } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { FormaPagamento } from '@/types';
import type { CarrinhoItem } from '../useProdutosPage';
import { FORMAS_PAGAMENTO } from '../useProdutosPage';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  carrinho: CarrinhoItem[];
  compradorNome: string;
  compradorTelefone: string;
  formaPagamento: Exclude<FormaPagamento, 'Boleto'>;
  observacoes: string;
  parcelado: boolean;
  parcelas: string;
  descontoTipo: 'valor' | 'percentual';
  descontoInput: string;
  subtotal: number;
  desconto: number;
  total: number;
  onNomeChange: (value: string) => void;
  onTelefoneChange: (value: string) => void;
  onFormaPagamentoChange: (value: Exclude<FormaPagamento, 'Boleto'>) => void;
  onObservacoesChange: (value: string) => void;
  onParceladoChange: (value: boolean) => void;
  onParcelasChange: (value: string) => void;
  onDescontoTipoChange: (value: 'valor' | 'percentual') => void;
  onDescontoInputChange: (value: string) => void;
  onUpdateQty: (produtoId: string, delta: number) => void;
  onRemove: (produtoId: string) => void;
  onFinish: () => void;
}

export function CarrinhoDialog(props: Props) {
  const { open, onOpenChange, carrinho } = props;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-lg">
        <DialogHeader><DialogTitle>Carrinho de compras</DialogTitle></DialogHeader>
        {carrinho.length === 0 ? (
          <EmptyState title="Carrinho vazio" description="Adicione produtos do catálogo." className="py-8" />
        ) : (
          <div className="space-y-3">
            {carrinho.map((item) => (
              <div key={item.produtoId} className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{item.nomeProduto}</p>
                  <p className="text-xs text-muted-foreground">R$ {item.precoUnitario.toFixed(2)} cada</p>
                </div>
                <div className="flex items-center gap-1">
                  <IconButton label={`Diminuir quantidade de ${item.nomeProduto}`} onClick={() => props.onUpdateQty(item.produtoId, -1)}>
                    <Minus className="h-3 w-3" />
                  </IconButton>
                  <span className="w-6 text-center text-sm font-medium text-foreground">{item.quantidade}</span>
                  <IconButton label={`Aumentar quantidade de ${item.nomeProduto}`} onClick={() => props.onUpdateQty(item.produtoId, 1)}>
                    <Plus className="h-3 w-3" />
                  </IconButton>
                </div>
                <span className="w-20 text-right text-sm font-semibold text-foreground">R$ {(item.quantidade * item.precoUnitario).toFixed(2)}</span>
                <IconButton label={`Remover ${item.nomeProduto} do carrinho`} destructive onClick={() => props.onRemove(item.produtoId)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </IconButton>
              </div>
            ))}

            <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Percent className="h-3.5 w-3.5" />Aplicar desconto depois de montar o carrinho
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[120px_1fr]">
                <select value={props.descontoTipo} onChange={(e) => props.onDescontoTipoChange(e.target.value as 'valor' | 'percentual')} className="h-9 rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground">
                  <option value="valor">Desconto (R$)</option>
                  <option value="percentual">Desconto (%)</option>
                </select>
                <input type="number" min="0" step="0.01" value={props.descontoInput} onChange={(e) => props.onDescontoInputChange(e.target.value)} className="h-9 rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground" />
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <Resumo label="Subtotal" valor={props.subtotal} />
                <Resumo label="Desconto" valor={props.desconto} />
                <Resumo label="Total" valor={props.total} />
              </div>
            </div>

            <Field label="Nome do comprador"><input value={props.compradorNome} onChange={(e) => props.onNomeChange(e.target.value)} className="input-field" /></Field>
            <Field label="Telefone do comprador">
              <div className="relative"><Phone className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" /><input value={props.compradorTelefone} onChange={(e) => props.onTelefoneChange(e.target.value)} className="h-9 w-full rounded-md border border-border bg-secondary/50 pl-9 pr-3 text-sm text-foreground" /></div>
            </Field>
            <Field label="Forma de pagamento"><select value={props.formaPagamento} onChange={(e) => props.onFormaPagamentoChange(e.target.value as Exclude<FormaPagamento, 'Boleto'>)} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground">{FORMAS_PAGAMENTO.map((forma) => <option key={forma} value={forma}>{forma}</option>)}</select></Field>
            <label className="flex items-center gap-2 text-xs text-foreground"><input type="checkbox" checked={props.parcelado} onChange={(e) => props.onParceladoChange(e.target.checked)} />Compra parcelada</label>
            {props.parcelado && <Field label="Quantidade de parcelas"><input type="number" min="2" value={props.parcelas} onChange={(e) => props.onParcelasChange(e.target.value)} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground" /></Field>}
            <Field label="Observações"><textarea value={props.observacoes} onChange={(e) => props.onObservacoesChange(e.target.value)} rows={3} className="w-full resize-none rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground" /></Field>
          </div>
        )}
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-xs">Fechar</Button>
          {carrinho.length > 0 && <Button onClick={props.onFinish} className="text-xs">Finalizar venda</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function IconButton({ label, onClick, destructive, children }: { label: string; onClick: () => void; destructive?: boolean; children: React.ReactNode }) {
  return <Button variant="ghost" size="icon" className={`h-7 w-7 ${destructive ? 'text-destructive' : ''}`} onClick={onClick} aria-label={label} title={label}>{children}</Button>;
}
function Resumo({ label, valor }: { label: string; valor: number }) {
  return <div className="rounded-lg border border-border bg-card px-3 py-2"><p className="text-muted-foreground">{label}</p><p className="mt-1 font-semibold text-foreground">R$ {valor.toFixed(2)}</p></div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="mb-1 block text-xs text-muted-foreground">{label}</label>{children}</div>;
}
