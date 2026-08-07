import type { Produto } from '@/types';
import { ProdutoCard } from './ProdutoCard';

interface ProdutoCatalogoProps {
  produtos: Produto[];
  onEdit: (produto: Produto) => void;
  onAddToCart: (produto: Produto) => void;
}

export function ProdutoCatalogo({ produtos, onEdit, onAddToCart }: ProdutoCatalogoProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {produtos.map((produto) => (
        <ProdutoCard
          key={produto.id}
          produto={produto}
          onEdit={onEdit}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
