import { Pencil, ShoppingCart } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import type { Produto } from '@/types';

interface Props {
  produtos: Produto[];
  onEdit: (produto: Produto) => void;
  onAdd: (produto: Produto) => void;
}

export function CatalogoProdutos({ produtos, onEdit, onAdd }: Props) {
  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {produtos.map((produto) => {
        const estoqueStatus = produto.estoque === 0
          ? 'sem-estoque'
          : produto.estoque <= produto.estoqueMinimo
            ? 'estoque-baixo'
            : 'estoque-ok';

        return (
          <div key={produto.id} className="group relative rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/30">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-3 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => onEdit(produto)}
              aria-label={`Editar produto ${produto.nome}`}
              title={`Editar produto ${produto.nome}`}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <div className="mb-2 flex items-start justify-between pr-8">
              <h3 className="text-sm font-semibold text-foreground">{produto.nome}</h3>
              <StatusBadge status={estoqueStatus} />
            </div>
            <p className="mb-3 text-xs text-muted-foreground">{produto.descricao}</p>
            <div className="mb-3 flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">R$ {produto.preco.toFixed(2)}</span>
              <span className="text-muted-foreground">{produto.estoque} em estoque</span>
            </div>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-full text-xs"
              onClick={() => onAdd(produto)}
              disabled={produto.estoque === 0}
            >
              <ShoppingCart className="mr-1 h-3 w-3" />
              {produto.estoque === 0 ? 'Indisponível' : 'Adicionar ao carrinho'}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
