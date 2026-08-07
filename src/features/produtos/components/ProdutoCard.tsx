import { Pencil, ShoppingCart } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import type { Produto } from '@/types';
import { formatCurrency, getEstoqueStatus } from '../utils/produtos.utils';

interface ProdutoCardProps {
  produto: Produto;
  onEdit: (produto: Produto) => void;
  onAddToCart: (produto: Produto) => void;
}

export function ProdutoCard({ produto, onEdit, onAddToCart }: ProdutoCardProps) {
  const unavailable = produto.estoque === 0;

  return (
    <article className="group relative rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/30">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-3 top-3 h-8 w-8 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
        onClick={() => onEdit(produto)}
        aria-label={`Editar produto ${produto.nome}`}
      >
        <Pencil className="h-3.5 w-3.5" />
      </Button>

      <div className="mb-2 flex items-start justify-between gap-3 pr-9">
        <h3 className="text-sm font-semibold text-foreground">{produto.nome}</h3>
        <StatusBadge status={getEstoqueStatus(produto)} />
      </div>

      <p className="mb-3 min-h-10 text-xs text-muted-foreground">
        {produto.descricao || 'Produto sem descrição.'}
      </p>

      <div className="mb-3 flex items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-foreground">{formatCurrency(produto.preco)}</span>
        <span className="text-muted-foreground">{produto.estoque} em estoque</span>
      </div>

      <Button
        type="button"
        size="sm"
        variant="secondary"
        className="h-8 w-full text-xs"
        onClick={() => onAddToCart(produto)}
        disabled={unavailable}
      >
        <ShoppingCart className="mr-1 h-3.5 w-3.5" />
        {unavailable ? 'Indisponível' : 'Adicionar ao carrinho'}
      </Button>
    </article>
  );
}
