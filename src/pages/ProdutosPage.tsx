import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { KpiCard } from '@/components/shared/KpiCard';
import { produtos, vendas } from '@/mocks/data';
import { Button } from '@/components/ui/button';
import { Plus, Package, AlertTriangle, ShoppingCart } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function ProdutosPage() {
  const estoqueBaixo = produtos.filter(p => p.estoque <= p.estoqueMinimo && p.estoque > 0).length;
  const semEstoque = produtos.filter(p => p.estoque === 0).length;
  const receitaVendas = vendas.reduce((s, v) => s + v.total, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Produtos & Vendas"
        subtitle="Catálogo, estoque e histórico de vendas"
        actions={<Button size="sm"><Plus className="h-4 w-4 mr-1" />Novo Produto</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Produtos" valor={produtos.length} icon={<Package className="h-4 w-4" />} />
        <KpiCard label="Estoque Baixo" valor={estoqueBaixo} icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="Sem Estoque" valor={semEstoque} icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="Receita Vendas" valor={`R$ ${receitaVendas.toLocaleString('pt-BR')}`} icon={<ShoppingCart className="h-4 w-4" />} />
      </div>

      <Tabs defaultValue="catalogo">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="catalogo" className="text-xs">Catálogo</TabsTrigger>
          <TabsTrigger value="vendas" className="text-xs">Histórico de Vendas</TabsTrigger>
        </TabsList>

        <TabsContent value="catalogo" className="mt-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {produtos.map(p => {
              const estoqueStatus = p.estoque === 0 ? 'sem-estoque' : p.estoque <= p.estoqueMinimo ? 'estoque-baixo' : 'estoque-ok';
              return (
                <div key={p.id} className="bg-card border border-border rounded-lg p-4 hover:bg-accent/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold text-foreground">{p.nome}</h3>
                    <StatusBadge status={estoqueStatus} />
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{p.descricao}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground font-semibold">R$ {p.preco.toFixed(2)}</span>
                    <span className="text-muted-foreground">{p.estoque} em estoque</span>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="vendas" className="mt-4">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Data</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Comprador</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground hidden sm:table-cell">Itens</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Total</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground hidden md:table-cell">Pagamento</th>
              </tr></thead>
              <tbody>
                {vendas.map(v => (
                  <tr key={v.id} className="border-b border-border/50">
                    <td className="py-3 px-4 text-foreground">{v.data}</td>
                    <td className="py-3 px-4 text-foreground">{v.compradorNome}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{v.itens.map(i => i.nomeProduto).join(', ')}</td>
                    <td className="py-3 px-4 text-foreground font-medium">R$ {v.total.toFixed(2)}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{v.formaPagamento}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
