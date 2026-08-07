import { AlertTriangle, Package, ShoppingCart } from 'lucide-react';
import { KpiCard } from '@/components/shared/KpiCard';

interface ProdutosKpisProps {
  totalProdutos: number;
  estoqueBaixo: number;
  semEstoque: number;
  receitaVendas: number;
}

export function ProdutosKpis({
  totalProdutos,
  estoqueBaixo,
  semEstoque,
  receitaVendas,
}: ProdutosKpisProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <KpiCard label="Produtos" valor={totalProdutos} icon={<Package className="h-4 w-4" />} />
      <KpiCard label="Estoque baixo" valor={estoqueBaixo} icon={<AlertTriangle className="h-4 w-4" />} />
      <KpiCard label="Sem estoque" valor={semEstoque} icon={<AlertTriangle className="h-4 w-4" />} />
      <KpiCard
        label="Receita de vendas"
        valor={`R$ ${receitaVendas.toLocaleString('pt-BR')}`}
        icon={<ShoppingCart className="h-4 w-4" />}
      />
    </div>
  );
}
