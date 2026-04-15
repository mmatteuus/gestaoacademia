import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { ComprovanteDialog } from '@/components/shared/ComprovanteDialog';
import { reservas as reservasMock, contratosAluguel } from '@/services/mocks/data';
import { Button } from '@/components/ui/button';
import { Plus, AlertTriangle, Receipt } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { ContratoAluguel, FormaPagamento, PagamentoContratoAluguel, Reserva } from '@/types';

const formasPagamento: Exclude<FormaPagamento, 'Boleto'>[] = ['PIX', 'Cartão', 'Dinheiro', 'Transferência'];

export default function AluguelPage() {
  const [reservas, setReservas] = useState<Reserva[]>(reservasMock);
  const [contratosList] = useState<ContratoAluguel[]>(contratosAluguel);
  const [pagamentos, setPagamentos] = useState<PagamentoContratoAluguel[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pagamentoOpen, setPagamentoOpen] = useState(false);
  const [comprovanteOpen, setComprovanteOpen] = useState(false);
  const [locatario, setLocatario] = useState('');
  const [espaco, setEspaco] = useState('Tatame Principal');
  const [dataInicio, setDataInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [valor, setValor] = useState('');
  const [contratoSel, setContratoSel] = useState<ContratoAluguel | null>(null);
  const [valorPagamento, setValorPagamento] = useState('');
  const [formaPagamento, setFormaPagamento] = useState<Exclude<FormaPagamento, 'Boleto'>>('PIX');
  const [observacoes, setObservacoes] = useState('');
  const [referencia, setReferencia] = useState('');
  const [comprovanteFields, setComprovanteFields] = useState<{ label: string; value: string }[]>([]);
  const [comprovanteSubtitle, setComprovanteSubtitle] = useState('');

  const pagamentosPorContrato = useMemo(() => {
    return pagamentos.reduce<Record<string, PagamentoContratoAluguel[]>>((acc, pagamento) => {
      acc[pagamento.contratoId] = [...(acc[pagamento.contratoId] || []), pagamento];
      return acc;
    }, {});
  }, [pagamentos]);

  const handleSalvar = () => {
    if (!locatario.trim() || !dataInicio || !horaInicio || !horaFim || !valor) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setReservas((prev) => [
      {
        id: `res${Date.now()}`,
        locatario,
        espaco,
        dataInicio: dataInicio.split('-').reverse().join('/'),
        dataFim: dataInicio.split('-').reverse().join('/'),
        horaInicio,
        horaFim,
        status: 'confirmada',
        valor: parseFloat(valor) || 0,
        conflito: false,
      },
      ...prev,
    ]);
    toast.success('Reserva confirmada com sucesso!');
    setDialogOpen(false);
    setLocatario('');
    setDataInicio('');
    setHoraInicio('');
    setHoraFim('');
    setValor('');
  };

  const abrirPagamento = (contrato: ContratoAluguel) => {
    setContratoSel(contrato);
    setValorPagamento(contrato.valor.toFixed(2));
    setFormaPagamento('PIX');
    setObservacoes('');
    setReferencia('Mensalidade atual');
    setPagamentoOpen(true);
  };

  const abrirComprovante = (contrato: ContratoAluguel, pagamento: PagamentoContratoAluguel) => {
    setComprovanteSubtitle(`${contrato.locatario} • ${contrato.espaco}`);
    setComprovanteFields([
      { label: 'Locatário', value: contrato.locatario },
      { label: 'Espaço', value: contrato.espaco },
      { label: 'Período do contrato', value: `${contrato.dataInicio} a ${contrato.dataFim}` },
      { label: 'Valor pago', value: `R$ ${pagamento.valor.toFixed(2)}` },
      { label: 'Data do pagamento', value: pagamento.dataPagamento },
      { label: 'Forma de pagamento', value: pagamento.formaPagamento },
      { label: 'Referência', value: pagamento.referencia || 'Sem referência' },
      { label: 'Observações', value: pagamento.observacoes || 'Sem observações' },
      { label: 'Comprovante', value: pagamento.comprovanteId || 'Não gerado' },
    ]);
    setComprovanteOpen(true);
  };

  const salvarPagamento = () => {
    if (!contratoSel) return;
    const valorNumerico = parseFloat(valorPagamento);
    if (Number.isNaN(valorNumerico) || valorNumerico <= 0) {
      toast.error('Informe um valor válido');
      return;
    }

    const pagamento: PagamentoContratoAluguel = {
      id: `pg${Date.now()}`,
      contratoId: contratoSel.id,
      dataPagamento: new Date().toISOString().split('T')[0],
      valor: valorNumerico,
      formaPagamento,
      observacoes,
      referencia,
      comprovanteId: `AL-${Date.now()}`,
    };

    setPagamentos((prev) => [pagamento, ...prev]);
    setPagamentoOpen(false);
    toast.success('Pagamento do contrato registrado.');
    abrirComprovante(contratoSel, pagamento);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Aluguel da Academia"
        subtitle="Reservas, contratos e agenda de espaços"
        actions={<Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4 mr-1" />Nova Reserva</Button>}
      />

      <Tabs defaultValue="reservas">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="reservas" className="text-xs">Reservas</TabsTrigger>
          <TabsTrigger value="contratos" className="text-xs">Contratos</TabsTrigger>
        </TabsList>

        <TabsContent value="reservas" className="mt-4 space-y-3">
          {reservas.length === 0 ? (
            <EmptyState title="Nenhuma reserva" />
          ) : (
            reservas.map((reserva) => (
              <div key={reserva.id} className={cn('bg-card border rounded-lg p-4 hover:bg-accent/30 transition-colors', reserva.conflito ? 'border-destructive/50' : 'border-border')}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <span className="truncate">{reserva.locatario}</span>
                      {reserva.conflito && <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{reserva.espaco}</p>
                  </div>
                  <StatusBadge status={reserva.status} />
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-2">
                  <span>{reserva.dataInicio}</span>
                  <span>{reserva.horaInicio} - {reserva.horaFim}</span>
                  <span className="text-foreground font-medium">R$ {reserva.valor.toFixed(2)}</span>
                </div>
                {reserva.conflito && <div className="mt-2 text-[10px] text-destructive bg-destructive/10 rounded px-2 py-1">Conflito de horário detectado neste espaço</div>}
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="contratos" className="mt-4 space-y-3">
          {contratosList.length === 0 ? (
            <EmptyState title="Nenhum contrato" />
          ) : (
            contratosList.map((contrato) => (
              <div key={contrato.id} className="bg-card border border-border rounded-lg p-4 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{contrato.locatario}</p>
                    <p className="text-xs text-muted-foreground">{contrato.espaco} • {contrato.dataInicio} a {contrato.dataFim}</p>
                  </div>
                  <StatusBadge status={contrato.status === 'ativo' ? 'ativo' : 'inativo'} />
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span>Periodicidade: {contrato.periodicidade}</span>
                  <span>•</span>
                  <span className="text-foreground font-medium">R$ {contrato.valor.toFixed(2)}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary" className="text-xs" onClick={() => abrirPagamento(contrato)}>
                    <Receipt className="h-3.5 w-3.5 mr-1" />Registrar pagamento
                  </Button>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">Histórico por contrato</p>
                  {(pagamentosPorContrato[contrato.id] || []).length > 0 ? (
                    <div className="space-y-2">
                      {pagamentosPorContrato[contrato.id].map((pagamento) => (
                        <div key={pagamento.id} className="flex items-center justify-between gap-3 rounded-lg bg-card border border-border px-3 py-2 text-xs">
                          <div>
                            <p className="font-medium text-foreground">{pagamento.referencia || 'Pagamento registrado'}</p>
                            <p className="text-muted-foreground">{pagamento.dataPagamento} • {pagamento.formaPagamento}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">R$ {pagamento.valor.toFixed(2)}</span>
                            <Button size="sm" variant="ghost" className="text-[10px] h-7" onClick={() => abrirComprovante(contrato, pagamento)}>
                              Ver comprovante
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Nenhum pagamento registrado para este contrato.</p>
                  )}
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Nova Reserva</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            <div className="sm:col-span-2">
              <label className="text-xs text-muted-foreground mb-1 block">Locatário / Cliente *</label>
              <input type="text" value={locatario} onChange={(e) => setLocatario(e.target.value)} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-base md:text-sm text-foreground" placeholder="Nome do cliente" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-muted-foreground mb-1 block">Espaço *</label>
              <select value={espaco} onChange={(e) => setEspaco(e.target.value)} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-base md:text-sm text-foreground">
                <option value="Tatame Principal">Tatame Principal</option>
                <option value="Área de Musculação">Área de Musculação</option>
                <option value="Sala Multiuso">Sala Multiuso</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-muted-foreground mb-1 block">Data *</label>
              <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-base md:text-sm text-foreground" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Hora Início *</label>
              <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-base md:text-sm text-foreground" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Hora Fim *</label>
              <input type="time" value={horaFim} onChange={(e) => setHoraFim(e.target.value)} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-base md:text-sm text-foreground" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-muted-foreground mb-1 block">Valor Aluguel (R$) *</label>
              <input type="number" min="0" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-base md:text-sm text-foreground" placeholder="Ex. 150.00" />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSalvar}>Confirmar Reserva</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={pagamentoOpen} onOpenChange={setPagamentoOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Registrar pagamento do contrato</DialogTitle>
          </DialogHeader>
          {contratoSel && (
            <div className="space-y-4 py-2">
              <div className="space-y-1 text-xs">
                <p className="text-muted-foreground">Locatário: <span className="text-foreground font-medium">{contratoSel.locatario}</span></p>
                <p className="text-muted-foreground">Espaço: <span className="text-foreground">{contratoSel.espaco}</span></p>
                <p className="text-muted-foreground">Valor do contrato: <span className="text-foreground">R$ {contratoSel.valor.toFixed(2)}</span></p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Valor pago</label>
                <input type="number" min="0" step="0.01" value={valorPagamento} onChange={(e) => setValorPagamento(e.target.value)} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Forma de pagamento</label>
                <select value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value as Exclude<FormaPagamento, 'Boleto'>)} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground">
                  {formasPagamento.map((forma) => <option key={forma} value={forma}>{forma}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Referência</label>
                <input value={referencia} onChange={(e) => setReferencia(e.target.value)} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground" placeholder="Ex.: Abril/2026" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Observações</label>
                <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} rows={3} className="w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground resize-none" placeholder="Ex.: pagamento do mês vigente" />
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
            <Button variant="ghost" onClick={() => setPagamentoOpen(false)}>Cancelar</Button>
            <Button onClick={salvarPagamento}>Salvar pagamento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ComprovanteDialog open={comprovanteOpen} onOpenChange={setComprovanteOpen} title="Comprovante de Pagamento do Aluguel" subtitle={comprovanteSubtitle} fields={comprovanteFields} />
    </div>
  );
}
