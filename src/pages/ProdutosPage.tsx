import { Plus, ShoppingCart } from 'lucide-react';
import { ComprovanteDialog } from '@/components/shared/ComprovanteDialog';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CarrinhoDialog } from '@/features/produtos/components/CarrinhoDialog';
import { ProdutoFormDialog } from '@/features/produtos/components/ProdutoFormDialog';
import { ProdutosCatalogo } from '@/features/produtos/components/ProdutosCatalogo';
import { ProdutosKpis } from '@/features/produtos/components/ProdutosKpis';
import { VendasHistorico } from '@/features/produtos/components/VendasHistorico';
import { useCarrinhoVenda } from '@/features/produtos/hooks/useCarrinhoVenda';
import { useProdutosPage } from '@/features/produtos/hooks/useProdutosPage';

export default function ProdutosPage() {
  const produtos = useProdutosPage();
  const venda = useCarrinhoVenda({
    produtos: produtos.produtosList,
    createVenda: produtos.createVenda,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Produtos e vendas"
        subtitle="Catálogo, estoque e histórico de vendas"
        actions={
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="relative"
              onClick={() => venda.setOpen(true)}
            >
              <ShoppingCart className="mr-1 h-4 w-4" />
              Carrinho
              {venda.itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">
                  {venda.itemCount}
                </span>
              )}
            </Button>
            <Button type="button" size="sm" onClick={produtos.openCreateForm}>
              <Plus className="mr-1 h-4 w-4" />
              Novo produto
            </Button>
          </div>
        }
      />

      <ProdutosKpis metrics={produtos.metrics} />

      <Tabs defaultValue="catalogo">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="catalogo" className="text-xs">
            Catálogo
          </TabsTrigger>
          <TabsTrigger value="vendas" className="text-xs">
            Histórico de vendas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="catalogo" className="mt-4">
          <ProdutosCatalogo
            produtos={produtos.produtosList}
            onCreate={produtos.openCreateForm}
            onEdit={produtos.openEditForm}
            onAddToCart={venda.addProduto}
          />
        </TabsContent>

        <TabsContent value="vendas" className="mt-4">
          <VendasHistorico
            vendas={produtos.vendasList}
            onOpenReceipt={venda.abrirComprovante}
          />
        </TabsContent>
      </Tabs>

      <ProdutoFormDialog
        open={produtos.formOpen}
        produto={produtos.editingProduto}
        onOpenChange={produtos.setFormOpen}
        onSubmit={produtos.submitProduto}
      />

      <CarrinhoDialog
        open={venda.open}
        items={venda.carrinho}
        subtotal={venda.subtotal}
        onOpenChange={venda.setOpen}
        onUpdateQuantity={venda.updateQuantidade}
        onRemove={venda.removeProduto}
        onSubmit={venda.finalizarVenda}
      />

      <ComprovanteDialog
        open={venda.comprovante.open}
        onOpenChange={venda.setComprovanteOpen}
        title="Comprovante de compra e pagamento"
        subtitle={venda.comprovante.subtitle}
        fields={venda.comprovante.fields}
        recipientPhone={venda.comprovante.phone}
        recipientName={venda.comprovante.recipient}
      />
    </div>
  );
}
