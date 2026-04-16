import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { KpiCard } from '@/components/shared/KpiCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { ComprovanteDialog } from '@/components/shared/ComprovanteDialog';
import { useOperacionalData } from '@/features/operacional/OperacionalDataProvider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Package, AlertTriangle, ShoppingCart, Pencil, Trash2, Minus as MinusIcon, Receipt, Percent, Phone } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProdutoForm } from '@/components/forms/ProdutoForm';
import { toast } from 'sonner';
import type { FormaPagamento, Produto, Venda } from '@/types';

interface CarrinhoItem {
  produtoId: string;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
}

const formasPagamento: Exclude<FormaPagamento, 'Boleto'>[] = ['PIX', 'Cartão', 'Dinheiro', 'Transferência'];

export default function ProdutosPage() {
  const { produtosList, vendasList, upsertProduto, createVenda } = useOperacionalData();
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState<Produto | undefined>(undefined);
  const [carrinhoOpen, setCarrinhoOpen] = useState(false);
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);
  const [compradorNome, setCompradorNome] = useState('');
  const [compradorTelefone, setCompradorTelefone] = useState('');
  const [formaPagamento, setFormaPagamento] = useState<Exclude<FormaPagamento, 'Boleto'>>('PIX');
  const [observacoes, setObservacoes] = useState('');
  const [parcelado, setParcelado] = useState(false);
  const [parcelas, setParcelas] = useState('2');
  const [descontoTipo, setDescontoTipo] = useState<'valor' | 'percentual'>('valor');
  const [descontoInput, setDescontoInput] = useState('0');
  const [comprovanteOpen, setComprovanteOpen] = useState(false);
  const [comprovanteFields, setComprovanteFields] = useState<{ label: string; value: string }[]>([]);
  const [comprovanteSubtitle, setComprovanteSubtitle] = useState('');
  const [comprovantePhone, setComprovantePhone] = useState('');
  const [comprovanteRecipient, setComprovanteRecipient] = useState('');

  const estoqueBaixo = produtosList.filter((produto) => produto.estoque <= produto.estoqueMinimo && produto.estoque > 0).length;
  const semEstoque = produtosList.filter((produto) => produto.estoque === 0).length;
  const receitaVendas = vendasList.reduce((soma, venda) => soma + venda.total, 0);

  const subtotalCarrinho = useMemo(
    () => carrinho.reduce((soma, item) => soma + item.quantidade * item.precoUnitario, 0),
    [carrinho]
  );

  const descontoCalculado = useMemo(() => {
    const valorBruto = Number(descontoInput || 0);
    if (Number.isNaN(valorBruto) || valorBruto <= 0) return 0;
    if (descontoTipo === 'percentual') return Math.min(subtotalCarrinho, subtotalCarrinho * (valorBruto / 100));
    return Math.min(subtotalCarrinho, valorBruto);
  }, [descontoInput, descontoTipo, subtotalCarrinho]);

  const totalCarrinho = Math.max(0, subtotalCarrinho - descontoCalculado);

  const handleCreate = () => {
    setEditingProduto(undefined);
    setFormOpen(true);
  };

  const handleEdit = (produto: Produto) => {
    setEditingProduto(produto);
    setFormOpen(true);
  };

  const handleFormSubmit = (data: Partial<Produto>) => {
    const produtoFinal: Produto = editingProduto
      ? { ...editingProduto, ...data }
      : {
          id: `p${Date.now()}`,
          nome: data.nome || 'Novo Produto',
          descricao: data.descricao || '',
          preco: data.preco || 0,
          estoque: data.estoque || 0,
          estoqueMinimo: data.estoqueMinimo || 0,
          categoria: data.categoria || 'Geral',
        };

    upsertProduto(produtoFinal);
    toast.success(editingProduto ? 'Produto atualizado' : 'Produto cadastrado');
    setFormOpen(false);
  };

  const abrirComprovante = (venda: Venda, subtotal?: number, desconto?: number, telefone?: string) => {
    setComprovanteSubtitle(`${venda.compradorNome} • ${venda.data}`);
    setComprovanteFields([
      { label: 'Comprador', value: venda.compradorNome },
      { label: 'Itens', value: venda.itens.map((item) => `${item.nomeProduto} x${item.quantidade}`).join(', ') },
      { label: 'Subtotal', value: `R$ ${(subtotal ?? venda.total).toFixed(2)}` },
      { label: 'Desconto aplicado', value: `R$ ${(desconto ?? 0).toFixed(2)}` },
      { label: 'Total', value: `R$ ${venda.total.toFixed(2)}` },
      { label: 'Forma de pagamento', value: venda.formaPagamento },
      { label: 'Parcelado', value: venda.parcelado ? `Sim • ${venda.quantidadeParcelas || 1}x` : 'Não' },
      { label: 'Observações', value: venda.observacoes || 'Sem observações' },
      { label: 'Comprovante', value: venda.comprovanteId || 'Não gerado' },
    ]);
    setComprovantePhone(telefone || '');
    setComprovanteRecipient(venda.compradorNome);
    setComprovanteOpen(true);
  };

  const addToCarrinho = (produto: Produto) => {
    if (produto.estoque === 0) {
      toast.error('Produto sem estoque');
      return;
    }

    setCarrinho((prev) => {
      const existente = prev.find((item) => item.produtoId === produto.id);
      if (existente) {
        if (existente.quantidade >= produto.estoque) {
          toast.error('Estoque insuficiente');
          return prev;
        }
        return prev.map((item) => (item.produtoId === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item));
      }
      return [...prev, { produtoId: produto.id, nomeProduto: produto.nome, quantidade: 1, precoUnitario: produto.preco }];
    });

    toast.success(`${produto.nome} adicionado ao carrinho`);
  };

  const removeFromCarrinho = (produtoId: string) => {
    setCarrinho((prev) => prev.filter((item) => item.produtoId !== produtoId));
  };

  const updateQty = (produtoId: string, delta: number) => {
    setCarrinho((prev) =>
      prev.flatMap((item) => {
        if (item.produtoId !== produtoId) return [item];
        const produto = produtosList.find((product) => product.id === produtoId);
        const novaQuantidade = item.quantidade + delta;
        if (novaQuantidade <= 0) return [];
        if (produto && novaQuantidade > produto.estoque) {
          toast.error('Estoque insuficiente');
          return [item];
        }
        return [{ ...item, quantidade: novaQuantidade }];
      })
    );
  };

  const finalizarVenda = () => {
    if (carrinho.length === 0) {
      toast.error('Carrinho vazio');
      return;
    }
    if (!compradorNome.trim()) {
      toast.error('Informe o nome do comprador');
      return;
    }
    if (parcelado && Number(parcelas) < 2) {
      toast.error('Informe pelo menos 2 parcelas');
      return;
    }

    const descontoTexto = descontoCalculado > 0 ? ` | Desconto aplicado: R$ ${descontoCalculado.toFixed(2)} (${descontoTipo === 'percentual' ? `${descontoInput}%` : 'valor fixo'})` : '';

    const novaVenda: Venda = {
      id: `v${Date.now()}`,
      data: new Date().toISOString().split('T')[0],
      itens: carrinho,
      total: totalCarrinho,
      compradorNome: compradorNome.trim(),
      formaPagamento,
      observacoes: `${observacoes || ''}${descontoTexto}`.trim(),
      parcelado,
      quantidadeParcelas: parcelado ? Number(parcelas) : undefined,
      comprovanteId: `CV-${Date.now()}`,
    };

    const result = createVenda(novaVenda);
    if (!result.ok) {
      toast.error(result.message || 'Não foi possível concluir a venda.');
      return;
    }

    const subtotalFinal = subtotalCarrinho;
    const descontoFinal = descontoCalculado;
    const telefoneFinal = compradorTelefone;

    setCarrinho([]);
    setCompradorNome('');
    setCompradorTelefone('');
    setFormaPagamento('PIX');
    setObservacoes('');
    setParcelado(false);
    setParcelas('2');
    setDescontoTipo('valor');
    setDescontoInput('0');
    setCarrinhoOpen(false);
    toast.success('Venda realizada com sucesso!');
    abrirComprovante(novaVenda, subtotalFinal, descontoFinal, telefoneFinal);
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
                  {carrinho.reduce((soma, item) => soma + item.quantidade, 0)}
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
            {produtosList.map((produto) => {
              const estoqueStatus = produto.estoque === 0 ? 'sem-estoque' : produto.estoque <= produto.estoqueMinimo ? 'estoque-baixo' : 'estoque-ok';
              return (
                <div key={produto.id} className="bg-card border border-border rounded-lg p-4 hover:bg-accent/30 transition-colors group relative">
                  <Button variant="ghost" size="icon" className="absolute top-3 right-3 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleEdit(produto)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <div className="flex items-start justify-between mb-2 pr-8">
                    <h3 className="text-sm font-semibold text-foreground">{produto.nome}</h3>
                    <StatusBadge status={estoqueStatus} />
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{produto.descricao}</p>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-foreground font-semibold">R$ {produto.preco.toFixed(2)}</span>
                    <span className="text-muted-foreground">{produto.estoque} em estoque</span>
                  </div>
                  <Button size="sm" variant="secondary" className="w-full text-xs h-8" onClick={() => addToCarrinho(produto)} disabled={produto.estoque === 0}>
                    <ShoppingCart className="h-3 w-3 mr-1" />{produto.estoque === 0 ? 'Indisponível' : 'Adicionar ao Carrinho'}
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
              <div className="hidden sm:block bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs min-w-[720px]">
                    <thead><tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Data</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Comprador</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Itens</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Total</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Pagamento</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Ações</th>
                    </tr></thead>
                    <tbody>
                      {vendasList.map((venda) => (
                        <tr key={venda.id} className="border-b border-border/50">
                          <td className="py-3 px-4 text-foreground whitespace-nowrap">{venda.data}</td>
                          <td className="py-3 px-4 text-foreground whitespace-nowrap">{venda.compradorNome}</td>
                          <td className="py-3 px-4 text-muted-foreground">{venda.itens.map((item) => item.nomeProduto).join(', ')}</td>
                          <td className="py-3 px-4 text-foreground font-medium whitespace-nowrap">R$ {venda.total.toFixed(2)}</td>
                          <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{venda.formaPagamento}</td>
                          <td className="py-3 px-4">
                            <Button size="sm" variant="ghost" className="text-[10px] h-7" onClick={() => abrirComprovante(venda)}>
                              <Receipt className="h-3 w-3 mr-1" />Comprovante
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="sm:hidden space-y-3">
                {vendasList.map((venda) => (
                  <div key={venda.id} className="bg-card border border-border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-foreground">{venda.compradorNome}</span>
                      <span className="text-muted-foreground">{venda.data}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{venda.itens.map((item) => `${item.nomeProduto} x${item.quantidade}`).join(', ')}</p>
                    <div className="flex justify-between text-xs">
                      <span className="text-foreground font-medium">R$ {venda.total.toFixed(2)}</span>
                      <span className="text-muted-foreground">{venda.formaPagamento}</span>
                    </div>
                    <Button size="sm" variant="secondary" className="w-full text-xs h-8" onClick={() => abrirComprovante(venda)}>
                      <Receipt className="h-3 w-3 mr-1" />Ver Comprovante
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-xl bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">{editingProduto ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
          </DialogHeader>
          <ProdutoForm produto={editingProduto} onSubmit={handleFormSubmit} onCancel={() => setFormOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={carrinhoOpen} onOpenChange={setCarrinhoOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Carrinho de Compras</DialogTitle>
          </DialogHeader>
          {carrinho.length === 0 ? (
            <EmptyState title="Carrinho vazio" description="Adicione produtos do catálogo." className="py-8" />
          ) : (
            <div className="space-y-3">
              {carrinho.map((item) => (
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

              <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Percent className="h-3.5 w-3.5" />
                  <span>Aplicar desconto após montar o carrinho</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2">
                  <select value={descontoTipo} onChange={(e) => setDescontoTipo(e.target.value as 'valor' | 'percentual')} className="h-9 rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground">
                    <option value="valor">Valor (R$)</option>
                    <option value="percentual">Percentual (%)</option>
                  </select>
                  <input type="number" min="0" step="0.01" value={descontoInput} onChange={(e) => setDescontoInput(e.target.value)} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground" placeholder={descontoTipo === 'percentual' ? 'Ex.: 10' : 'Ex.: 25.00'} />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">R$ {subtotalCarrinho.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Desconto</span>
                    <span className="text-foreground">- R$ {descontoCalculado.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-2">
                    <span className="text-sm font-medium text-foreground">Total final</span>
                    <span className="text-lg font-bold text-foreground">R$ {totalCarrinho.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Nome do comprador</label>
                <input value={compradorNome} onChange={(e) => setCompradorNome(e.target.value)} placeholder="Ex: Lucas Mendes" className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground placeholder:text-muted-foreground" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Telefone do comprador</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input value={compradorTelefone} onChange={(e) => setCompradorTelefone(e.target.value)} placeholder="Ex: (63) 99999-9999" className="h-9 w-full rounded-md border border-border bg-secondary/50 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Forma de pagamento</label>
                <select value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value as Exclude<FormaPagamento, 'Boleto'>)} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground">
                  {formasPagamento.map((forma) => <option key={forma} value={forma}>{forma}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground">
                <input id="parcelado" type="checkbox" checked={parcelado} onChange={(e) => setParcelado(e.target.checked)} className="h-4 w-4 rounded border-border" />
                <label htmlFor="parcelado">Compra parcelada</label>
              </div>
              {parcelado && (
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Quantidade de parcelas</label>
                  <input type="number" min="2" value={parcelas} onChange={(e) => setParcelas(e.target.value)} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground" />
                </div>
              )}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Observações</label>
                <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} rows={3} className="w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground resize-none" placeholder="Ex.: primeira parcela paga no ato" />
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="ghost" onClick={() => setCarrinhoOpen(false)} className="text-xs">Fechar</Button>
            {carrinho.length > 0 && <Button onClick={finalizarVenda} className="text-xs">Finalizar Venda</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ComprovanteDialog
        open={comprovanteOpen}
        onOpenChange={setComprovanteOpen}
        title="Comprovante de Compra e Pagamento"
        subtitle={comprovanteSubtitle}
        fields={comprovanteFields}
        recipientPhone={comprovantePhone}
        recipientName={comprovanteRecipient}
      />
    </div>
  );
}
