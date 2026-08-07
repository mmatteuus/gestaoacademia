import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CarrinhoItem } from '../produtos.types';

interface CarrinhoItemRowProps {
  item: CarrinhoItem;
  onUpdateQuantity: (produtoId: string, delta: number) => void;
  onRemove: (produtoId: string) => void;
}

export function CarrinhoItemRow({ item, onUpdateQuantity, onRemove }: CarrinhoItemRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{item.nomeProduto}</p>
        <p className="text-xs text-muted-foreground">R$ {item.precoUnitario.toFixed(2)} cada</p>
      </div>
      <div className="flex items-center gap-1">
        <QuantityButton
          label={`Diminuir quantidade de ${item.nomeProduto}`}
          onClick={() => onUpdateQuantity(item.produtoId, -1)}
        >
          <Minus className="h-3 w-3" />
        </QuantityButton>
        <span className="w-6 text-center text-sm font-medium text-foreground">{item.quantidade}</span>
        <QuantityButton
          label={`Aumentar quantidade de ${item.nomeProduto}`}
          onClick={() => onUpdateQuantity(item.produtoId, 1)}
        >
          <Plus className="h-3 w-3" />
        </QuantityButton>
      </div>
      <span className="w-20 text-right text-sm font-semibold text-foreground">
        R$ {(item.quantidade * item.precoUnitario).toFixed(2)}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-destructive"
        onClick={() => onRemove(item.produtoId)}
        aria-label={`Remover ${item.nomeProduto} do carrinho`}
        title={`Remover ${item.nomeProduto} do carrinho`}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

function QuantityButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-7 w-7"
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {children}
    </Button>
  );
}
