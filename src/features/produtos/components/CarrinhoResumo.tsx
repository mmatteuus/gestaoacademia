import { Percent } from 'lucide-react';
import type { DescontoTipo } from '../produtos.types';

interface CarrinhoResumoProps {
  descontoTipo: DescontoTipo;
  descontoInput: string;
  subtotal: number;
  desconto: number;
  total: number;
  onTipoChange: (value: DescontoTipo) => void;
  onInputChange: (value: string) => void;
}

export function CarrinhoResumo({
  descontoTipo,
  descontoInput,
  subtotal,
  desconto,
  total,
  onTipoChange,
  onInputChange,
}: CarrinhoResumoProps) {
  return (
    <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Percent className="h-3.5 w-3.5" />
        <span>Aplicar desconto depois de montar o carrinho</span>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[120px_1fr]">
        <select
          value={descontoTipo}
          onChange={(event) => onTipoChange(event.target.value as DescontoTipo)}
          className="h-9 rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground"
        >
          <option value="valor">Desconto (R$)</option>
          <option value="percentual">Desconto (%)</option>
        </select>
        <input
          type="number"
          min="0"
          step="0.01"
          value={descontoInput}
          onChange={(event) => onInputChange(event.target.value)}
          className="h-9 rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground"
          placeholder={descontoTipo === 'percentual' ? 'Ex.: 10' : 'Ex.: 15,00'}
        />
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <ResumoItem label="Subtotal" value={subtotal} />
        <ResumoItem label="Desconto" value={desconto} />
        <ResumoItem label="Total" value={total} />
      </div>
    </div>
  );
}

function ResumoItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2">
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold text-foreground">R$ {value.toFixed(2)}</p>
    </div>
  );
}
