import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { KpiCard } from '@/components/shared/KpiCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { produtos as produtosMock, vendas as vendasMock } from '@/mocks/data';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Package, AlertTriangle, ShoppingCart, Pencil, Trash2, Minus as MinusIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProdutoForm } from '@/components/forms/ProdutoForm';
import { toast } from 'sonner';
import type { Produto, Venda } from '@/types';

interface CarrinhoItem {
  produtoId: string;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
}

export default function ProdutosPage() {
  const [produtosList, setProdutosList] = useState<Produto[]>(produtosMock);
  const [vendasList, setVendasList] = useState<Venda[]>(vendasMock);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState<Produto | undefined>(undefined);
  const [carrinhoOpen, setCarrinhoOpen] = useState(false);
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);
  const [compradorNome, setCompradorNome] = useState('');

  const estoqueBaixo = produtosList.filter(p => p.estoque <= p.estoqueMinimo && p.estoque > 0).length;
  const semEstoque = produtosList.filter(p => p.estoque === 0).length;
  const receitaVendas = vendasList.reduce((s, v) => s + v.total, 0);

  const handleCreate = () => { setEditingProduto(undefined); setFormOpen(true); };
  const handleEdit = (produto: Produto) => { setEditingProduto(produto); setFormOpen(true); };

  const handleFormSubmit = (data: any) => {
    if (editingProduto) {
      setProdutosList(prev => prev.map(p => p.id === editingProduto.id ? { ...p, ...data } : p));
      toast.success('Produto atualizado');
    } else {
      setProdutosList(prev => [...prev, { ...data, id: `p${Date.now()}` }]);
      toast.success('Produto cadastrado');
    }
    setFormOpen(false);
  };

  const addToCarrinho = (p: Produto) => {
    if (p.estoque === 0) { toast.error('Produto sem estoque'); return; }
    setCarrinho(prev => {
      const existing = prev.find(i => i.produtoId === p.id);
      if (existing) {
        if (existing.quantidade >= p.estoque) { toast.error('Estoque insuficiente'); return prev; }
        return prev.map(i => i.produtoId === p.id ? { ...i, quantidade: i.quantidade + 1 } : i);
      }
      return [...prev, { produtoId: p.id, nomeProduto: p.nome, quantidade: 1, precoUnitario: p.preco }];
    });
    toast.success(`${p.nome} adicionado ao carrinho`);
  };

  const removeFromCarrinho = (produtoId: string) => {
    setCarrinho(prev => prev.filter(i => i.produtoId !== produtoId));
  };

  const updateQty = (produtoId: string, delta: number) => {
    setCarrinho(prev => prev.map(i => {
      if (i.produtoId !== produtoId) return i;
      const produto = produtosList.find(p => p.id === produtoId);
      const newQty = i.quantidade + delta;
      if (newQty <= 0) return i;
      if (produto && newQty > produto.estoque) { toast.error('Estoque insuficiente'); return i; }
      return { ...i, quantidade: newQty };
    }));
  };

  const totalCarrinho = carrinho.reduce((s, i) => s + i.quantidade * i.precoUnitario, 0);

  const finalizarVenda = () => {
    if (carrinho.length === 0) { toast.error('Carrinho vazio'); return; }
    if (!compradorNome.trim()) { toast.error('Informe o nome do comprador'); return; }
    const novaVenda: Venda = {
      id: `v${Date.now()}`,
      data: new Date().toISOString().split('T')[0],
      itens: carrinho,
      total: totalCarrinho,
      compradorNome: compradorNome.trim(),
      formaPagamento: 'PIX',
    };
    setVendasList(prev => [novaVenda, ...prev]);
    setProdutosList(prev => prev.map(p => {
      const item = carrinho.find(i => i.produtoId === p.id);
      return item ? { ...p, estoque: p.estoque - item.quantidade } : p;
    }));
    setCarrinho([]);
    setCompradorNome('');
    setCarrinhoOpen(false);
    toast.success('Venda realizada com sucesso!');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Produtos & Vendas"
        subtitle="Catálogo, estoque e histórico de vendas"
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => setCarrinhoOpen(true)} className="relative">
              <ShoppingCart className="h-4 w-4 mr-1" />Carrinho
              {carrinho.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                  {carrinho.reduce((s, i) => s + i.quantidade, 0)}
                </span>
              )}
            </Button>
            <Button size="sm" onClick={handleCreate}><Plus className="h-4 w-4 mr-1" />Novo Produto</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Produtos" valor={produtosList.length} icon={<Package className="h-4 w-4" />} />
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
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {produtosList.map(p => {
              const estoqueStatus = p.estoque === 0 ? 'sem-estoque' : p.estoque <= p.estoqueMinimo ? 'estoque-baixo' : 'estoque-ok';
              return (
                <div key={p.id} className="bg-card border border-border rounded-lg p-4 hover:bg-accent/30 transition-colors group relative">
                  <Button variant="ghost" size="icon" className="absolute top-3 right-3 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleEdit(p)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <div className="flex items-start justify-between mb-2 pr-8">
                    <h3 className="text-sm font-semibold text-foreground">{p.nome}</h3>
                    <StatusBadge status={estoqueStatus} />
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{p.descricao}</p>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-foreground font-semibold">R$ {p.preco.toFixed(2)}</span>
                    <span className="text-muted-foreground">{p.estoque} em estoque</span>
                  </div>
                  <Button size="sm" variant="secondary" className="w-full text-xs h-8" onClick={() => addToCarrinho(p)} disabled={p.estoque === 0}>
                    <ShoppingCart className="h-3 w-3 mr-1" />{p.estoque === 0 ? 'Indisponível' : 'Adicionar ao Carrinho'}
                  </Button>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="vendas" className="mt-4">
          {vendasList.length === 0 ? (
            <EmptyState title="Nenhuma venda registrada" />
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden sm:block bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs min-w-[500px]">
                    <thead><tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Data</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Comprador</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Itens</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Total</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Pagamento</th>
                    </tr></thead>
                    <tbody>
                      {vendasList.map(v => (
                        <tr key={v.id} className="border-b border-border/50">
                          <td className="py-3 px-4 text-foreground whitespace-nowrap">{v.data}</td>
                          <td className="py-3 px-4 text-foreground whitespace-nowrap">{v.compradorNome}</td>
                          <td className="py-3 px-4 text-muted-foreground">{v.itens.map(i => i.nomeProduto).join(', ')}</td>
                          <td className="py-3 px-4 text-foreground font-medium whitespace-nowrap">R$ {v.total.toFixed(2)}</td>
                          <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{v.formaPagamento}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Mobile */}
              <div className="sm:hidden space-y-3">
                {vendasList.map(v => (
                  <div key={v.id} className="bg-card border border-border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-foreground">{v.compradorNome}</span>
                      <span className="text-muted-foreground">{v.data}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{v.itens.map(i => `${i.nomeProduto} x${i.quantidade}`).join(', ')}</p>
                    <div className="flex justify-between text-xs">
                      <span className="text-foreground font-medium">R$ {v.total.toFixed(2)}</span>
                      <span className="text-muted-foreground">{v.formaPagamento}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog Produto */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-xl bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">{editingProduto ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
          </DialogHeader>
          <ProdutoForm produto={editingProduto} onSubmit={handleFormSubmit} onCancel={() => setFormOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Dialog Carrinho */}
      <Dialog open={carrinhoOpen} onOpenChange={setCarrinhoOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Carrinho de Compras</DialogTitle>
          </DialogHeader>
          {carrinho.length === 0 ? (
            <EmptyState title="Carrinho vazio" description="Adicione produtos do catálogo." className="py-8" />
          ) : (
            <div className="space-y-3">
              {carrinho.map(item => (
                <div key={item.produtoId} className="flex items-center gap-3 bg-muted/30 rounded-lg p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.nomeProduto}</p>
                    <p className="text-xs text-muted-foreground">R$ {item.precoUnitario.toFixed(2)} cada</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQty(item.produtoId, -1)}>
                      <MinusIcon className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-medium text-foreground w-6 text-center">{item.quantidade}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQty(item.produtoId, 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="text-sm font-semibold text-foreground w-20 text-right">R$ {(item.quantidade * item.precoUnitario).toFixed(2)}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeFromCarrinho(item.produtoId)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
              <div className="border-t border-border pt-3 flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-lg font-bold text-foreground">R$ {totalCarrinho.toFixed(2)}</span>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Nome do comprador</label>
                <input
                  value={compradorNome}
                  onChange={e => setCompradorNome(e.target.value)}
                  placeholder="Ex: Lucas Mendes"
                  className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="ghost" onClick={() => setCarrinhoOpen(false)} className="text-xs">Fechar</Button>
            {carrinho.length > 0 && (
              <Button onClick={finalizarVenda} className="text-xs">Finalizar Venda</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
