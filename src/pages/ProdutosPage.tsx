import { Plus, ShoppingCart } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CarrinhoDialog } from '@/features/produtos/components/CarrinhoDialog';
import { ProdutoCatalogo } from '@/features/produtos/components/ProdutoCatalogo';
import { ProdutoFormDialog } from '@/features/produtos/components/ProdutoFormDialog';
import { ProdutosKpis } from '@/features/produtos/components/ProdutosKpis';
import { VendaComprovanteDialog } from '@/features/produtos/components/VendaComprovanteDialog';
import { VendasHistorico } from '@/features/produtos/components/VendasHistorico';
import { useProdutosPage } from '@/features/produtos/hooks/useProdutosPage';

export default function ProdutosPage() {
  const page = useProdutosPage();

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
              onClick={() => page.cart.setOpen(true)}
              className="relative"
            >
              <ShoppingCart className="mr-1 h-4 w-4" />
              Carrinho
              {page.cart.totalItens > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {page.cart.totalItens}
                </span>
              )}
            </Button>
            <Button type="button" size="sm" onClick={page.openCreateForm}>
              <Plus className="mr-1 h-4 w-4" />
              Novo produto
            </Button>
          </div>
        }
      />

      <ProdutosKpis {...page.kpis} />

      <Tabs defaultValue="catalogo">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="catalogo" className="text-xs">Catálogo</TabsTrigger>
          <TabsTrigger value="vendas" className="text-xs">Histórico de vendas</TabsTrigger>
        </TabsList>
        <TabsContent value="catalogo" className="mt-4">
          {page.produtosList.length === 0 ? (
            <EmptyState
              title="Nenhum produto cadastrado"
              description="Cadastre o primeiro produto para iniciar o catálogo."
              action={{ label: 'Cadastrar produto', onClick: page.openCreateForm }}
            />
          ) : (
            <ProdutoCatalogo
              produtos={page.produtosList}
              onEdit={page.openEditForm}
              onAddToCart={page.cart.addProduto}
            />
          )}
        </TabsContent>
        <TabsContent value="vendas" className="mt-4">
          <VendasHistorico vendas={page.vendasList} onComprovante={page.setComprovanteVenda} />
        </TabsContent>
      </Tabs>

      <ProdutoFormDialog
        open={page.formOpen}
        produto={page.editingProduto}
        onOpenChange={page.setFormOpen}
        onSubmit={page.handleFormSubmit}
      />
      <CarrinhoDialog cart={page.cart} />
      <VendaComprovanteDialog
        venda={page.comprovanteVenda}
        onOpenChange={(open) => !open && page.setComprovanteVenda(null)}
      />
    </div>
  );
}
