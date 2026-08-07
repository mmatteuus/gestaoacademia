import { Phone } from 'lucide-react';
import { FORMAS_PAGAMENTO } from '../produtos.constants';
import type { CarrinhoVendaState } from '../hooks/useCarrinhoVenda';
import type { FormaPagamentoVenda } from '../produtos.types';

export function VendaCheckoutFields({ cart }: { cart: CarrinhoVendaState }) {
  return (
    <div className="space-y-3">
      <Field label="Nome do comprador">
        <input
          value={cart.compradorNome}
          onChange={(event) => cart.setCompradorNome(event.target.value)}
          placeholder="Ex.: Lucas Mendes"
          className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground placeholder:text-muted-foreground"
        />
      </Field>

      <Field label="Telefone do comprador">
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={cart.compradorTelefone}
            onChange={(event) => cart.setCompradorTelefone(event.target.value)}
            placeholder="(63) 99999-9999"
            className="h-9 w-full rounded-md border border-border bg-secondary/50 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </Field>

      <Field label="Forma de pagamento">
        <select
          value={cart.formaPagamento}
          onChange={(event) => cart.setFormaPagamento(event.target.value as FormaPagamentoVenda)}
          className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground"
        >
          {FORMAS_PAGAMENTO.map((forma) => (
            <option key={forma} value={forma}>{forma}</option>
          ))}
        </select>
      </Field>

      <div className="flex items-center gap-2 text-xs text-foreground">
        <input
          id="parcelado"
          type="checkbox"
          checked={cart.parcelado}
          onChange={(event) => cart.setParcelado(event.target.checked)}
          className="h-4 w-4 rounded border-border"
        />
        <label htmlFor="parcelado">Compra parcelada</label>
      </div>

      {cart.parcelado && (
        <Field label="Quantidade de parcelas">
          <input
            type="number"
            min="2"
            value={cart.parcelas}
            onChange={(event) => cart.setParcelas(event.target.value)}
            className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground"
          />
        </Field>
      )}

      <Field label="Observações">
        <textarea
          value={cart.observacoes}
          onChange={(event) => cart.setObservacoes(event.target.value)}
          rows={3}
          className="w-full resize-none rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground"
          placeholder="Ex.: primeira parcela paga no ato"
        />
      </Field>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
