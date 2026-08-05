import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CarrinhoItem } from '../types/produtos.types';
import { formatCurrency } from '../utils/produtos.utils';

interface CarrinhoItemsProps {
  items: CarrinhoItem[];
  onUpdateQuantity: (produtoId: string, delta: number) => void;
  onRemove: (produtoId: string) => void;
}

export function CarrinhoItems({ items, onUpdateQuantity, onRemove }: CarrinhoItemsProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.produtoId} className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{item.nomeProduto}</p>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(item.precoUnitario)} cada
            </p>
          </div>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateQuantity(item.produtoId, -1)}
              aria-label={`Diminuir quantidade de ${item.nomeProduto}`}
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <span className="w-6 text-center text-sm font-medium text-foreground">
              {item.quantidade}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateQuantity(item.produtoId, 1)}
              aria-label={`Aumentar quantidade de ${item.nomeProduto}`}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>

          <span className="w-24 text-right text-sm font-semibold text-foreground">
            {formatCurrency(item.quantidade * item.precoUnitario)}
          </span>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => onRemove(item.produtoId)}
            aria-label={`Remover ${item.nomeProduto} do carrinho`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
    </div>
  );
}
