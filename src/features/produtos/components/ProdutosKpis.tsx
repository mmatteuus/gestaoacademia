import { AlertTriangle, Package, ShoppingCart } from 'lucide-react';
import { KpiCard } from '@/components/shared/KpiCard';
import { formatCurrency } from '../utils/produtos.utils';

interface ProdutosKpisProps {
  metrics: {
    total: number;
    estoqueBaixo: number;
    semEstoque: number;
    receita: number;
  };
}

export function ProdutosKpis({ metrics }: ProdutosKpisProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <KpiCard label="Produtos" valor={metrics.total} icon={<Package className="h-4 w-4" />} />
      <KpiCard
        label="Estoque baixo"
        valor={metrics.estoqueBaixo}
        icon={<AlertTriangle className="h-4 w-4" />}
      />
      <KpiCard
        label="Sem estoque"
        valor={metrics.semEstoque}
        icon={<AlertTriangle className="h-4 w-4" />}
      />
      <KpiCard
        label="Receita de vendas"
        valor={formatCurrency(metrics.receita)}
        icon={<ShoppingCart className="h-4 w-4" />}
      />
    </div>
  );
}
