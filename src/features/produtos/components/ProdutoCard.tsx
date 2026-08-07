import { Pencil, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { Produto } from '@/types';
import { getEstoqueStatus } from '../produtos.utils';

interface ProdutoCardProps {
  produto: Produto;
  onEdit: (produto: Produto) => void;
  onAddToCart: (produto: Produto) => void;
}

export function ProdutoCard({ produto, onEdit, onAddToCart }: ProdutoCardProps) {
  return (
    <div className="group relative rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/30">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-3 top-3 h-7 w-7 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
        onClick={() => onEdit(produto)}
        aria-label={`Editar produto ${produto.nome}`}
        title={`Editar produto ${produto.nome}`}
      >
        <Pencil className="h-3.5 w-3.5" />
      </Button>

      <div className="mb-2 flex items-start justify-between gap-2 pr-8">
        <h3 className="text-sm font-semibold text-foreground">{produto.nome}</h3>
        <StatusBadge status={getEstoqueStatus(produto)} />
      </div>
      <p className="mb-3 text-xs text-muted-foreground">{produto.descricao}</p>
      <div className="mb-3 flex items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-foreground">R$ {produto.preco.toFixed(2)}</span>
        <span className="text-muted-foreground">{produto.estoque} em estoque</span>
      </div>
      <Button
        type="button"
        size="sm"
        variant="secondary"
        className="h-8 w-full text-xs"
        onClick={() => onAddToCart(produto)}
        disabled={produto.estoque === 0}
      >
        <ShoppingCart className="mr-1 h-3 w-3" />
        {produto.estoque === 0 ? 'Indisponível' : 'Adicionar ao carrinho'}
      </Button>
    </div>
  );
}
