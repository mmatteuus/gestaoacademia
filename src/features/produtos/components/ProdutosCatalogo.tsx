import { EmptyState } from '@/components/shared/EmptyState';
import type { Produto } from '@/types';
import { ProdutoCard } from './ProdutoCard';

interface ProdutosCatalogoProps {
  produtos: Produto[];
  onCreate: () => void;
  onEdit: (produto: Produto) => void;
  onAddToCart: (produto: Produto) => void;
}

export function ProdutosCatalogo({
  produtos,
  onCreate,
  onEdit,
  onAddToCart,
}: ProdutosCatalogoProps) {
  if (produtos.length === 0) {
    return (
      <EmptyState
        title="Nenhum produto cadastrado"
        description="Cadastre o primeiro produto para iniciar o controle de estoque."
        action={{ label: 'Cadastrar produto', onClick: onCreate }}
      />
    );
  }

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
