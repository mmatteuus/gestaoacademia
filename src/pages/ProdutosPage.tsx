import { AlertTriangle, Package, Plus, ShoppingCart } from 'lucide-react';
import { ComprovanteDialog } from '@/components/shared/ComprovanteDialog';
import { KpiCard } from '@/components/shared/KpiCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CarrinhoDialog } from '@/features/produtos/components/CarrinhoDialog';
import { CatalogoProdutos } from '@/features/produtos/components/CatalogoProdutos';
import { HistoricoVendas } from '@/features/produtos/components/HistoricoVendas';
import { ProdutoFormDialog } from '@/features/produtos/components/ProdutoFormDialog';
import { useProdutosPage } from '@/features/produtos/useProdutosPage';

export default function ProdutosPage() {
  const state = useProdutosPage();
  const totalItens = state.carrinho.reduce((soma, item) => soma + item.quantidade, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Produtos & Vendas"
        subtitle="Catálogo, estoque e histórico de vendas"
        actions={(
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => state.setCarrinhoOpen(true)} className="relative">
              <ShoppingCart className="mr-1 h-4 w-4" />Carrinho
              {totalItens > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {totalItens}
                </span>
              )}
            </Button>
            <Button size="sm" onClick={state.openCreate}>
              <Plus className="mr-1 h-4 w-4" />Novo produto
            </Button>
          </div>
        )}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Produtos" valor={state.produtosList.length} icon={<Package className="h-4 w-4" />} />
        <KpiCard label="Estoque baixo" valor={state.estoqueBaixo} icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="Sem estoque" valor={state.semEstoque} icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="Receita vendas" valor={`R$ ${state.receitaVendas.toLocaleString('pt-BR')}`} icon={<ShoppingCart className="h-4 w-4" />} />
      </div>

      <Tabs defaultValue="catalogo">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="catalogo" className="text-xs">Catálogo</TabsTrigger>
          <TabsTrigger value="vendas" className="text-xs">Histórico de vendas</TabsTrigger>
        </TabsList>
        <TabsContent value="catalogo" className="mt-4">
          <CatalogoProdutos produtos={state.produtosList} onEdit={state.openEdit} onAdd={state.addToCarrinho} />
        </TabsContent>
        <TabsContent value="vendas" className="mt-4">
          <HistoricoVendas vendas={state.vendasList} onReceipt={state.openReceipt} />
        </TabsContent>
      </Tabs>

      <ProdutoFormDialog
        open={state.formOpen}
        produto={state.editingProduto}
        onOpenChange={state.setFormOpen}
        onSubmit={state.saveProduto}
      />

      <CarrinhoDialog
        open={state.carrinhoOpen}
        onOpenChange={state.setCarrinhoOpen}
        carrinho={state.carrinho}
        compradorNome={state.compradorNome}
        compradorTelefone={state.compradorTelefone}
        formaPagamento={state.formaPagamento}
        observacoes={state.observacoes}
        parcelado={state.parcelado}
        parcelas={state.parcelas}
        descontoTipo={state.descontoTipo}
        descontoInput={state.descontoInput}
        subtotal={state.subtotalCarrinho}
        desconto={state.descontoCalculado}
        total={state.totalCarrinho}
        onNomeChange={state.setCompradorNome}
        onTelefoneChange={state.setCompradorTelefone}
        onFormaPagamentoChange={state.setFormaPagamento}
        onObservacoesChange={state.setObservacoes}
        onParceladoChange={state.setParcelado}
        onParcelasChange={state.setParcelas}
        onDescontoTipoChange={state.setDescontoTipo}
        onDescontoInputChange={state.setDescontoInput}
        onUpdateQty={state.updateQty}
        onRemove={state.removeFromCarrinho}
        onFinish={state.finalizarVenda}
      />

      <ComprovanteDialog
        open={state.comprovanteOpen}
        onOpenChange={state.setComprovanteOpen}
        title="Comprovante de compra e pagamento"
        subtitle={state.comprovanteSubtitle}
        fields={state.comprovanteFields}
        recipientPhone={state.comprovantePhone}
        recipientName={state.comprovanteRecipient}
      />
    </div>
  );
}
