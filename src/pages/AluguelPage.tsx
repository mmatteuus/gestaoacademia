import { Plus } from 'lucide-react';
import { ComprovanteDialog } from '@/components/shared/ComprovanteDialog';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContratosList } from '@/features/aluguel/components/ContratosList';
import { PagamentoContratoDialog } from '@/features/aluguel/components/PagamentoContratoDialog';
import { ReservaDialog } from '@/features/aluguel/components/ReservaDialog';
import { ReservasList } from '@/features/aluguel/components/ReservasList';
import { useAluguelPage } from '@/features/aluguel/useAluguelPage';

export default function AluguelPage() {
  const state = useAluguelPage();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Aluguel da Academia"
        subtitle="Reservas, contratos e agenda de espaços"
        actions={(
          <Button size="sm" onClick={() => state.setReservaOpen(true)}>
            <Plus className="mr-1 h-4 w-4" />Nova reserva
          </Button>
        )}
      />

      <Tabs defaultValue="reservas">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="reservas" className="text-xs">Reservas</TabsTrigger>
          <TabsTrigger value="contratos" className="text-xs">Contratos</TabsTrigger>
        </TabsList>
        <TabsContent value="reservas" className="mt-4">
          <ReservasList reservas={state.reservasList} />
        </TabsContent>
        <TabsContent value="contratos" className="mt-4">
          <ContratosList
            contratos={state.contratosList}
            pagamentosPorContrato={state.pagamentosPorContrato}
            onPayment={state.abrirPagamento}
            onReceipt={state.abrirComprovante}
          />
        </TabsContent>
      </Tabs>

      <ReservaDialog
        open={state.reservaOpen}
        onOpenChange={state.setReservaOpen}
        locatario={state.locatario}
        locatarioTelefone={state.locatarioTelefone}
        espaco={state.espaco}
        dataInicio={state.dataInicio}
        horaInicio={state.horaInicio}
        horaFim={state.horaFim}
        valor={state.valor}
        onLocatarioChange={state.setLocatario}
        onTelefoneChange={state.setLocatarioTelefone}
        onEspacoChange={state.setEspaco}
        onDataChange={state.setDataInicio}
        onHoraInicioChange={state.setHoraInicio}
        onHoraFimChange={state.setHoraFim}
        onValorChange={state.setValor}
        onSave={state.salvarReserva}
      />

      <PagamentoContratoDialog
        open={state.pagamentoOpen}
        onOpenChange={state.setPagamentoOpen}
        contrato={state.contratoSel}
        telefone={state.pagamentoTelefone}
        valor={state.valorPagamento}
        formaPagamento={state.formaPagamento}
        referencia={state.referencia}
        observacoes={state.observacoes}
        onTelefoneChange={state.setPagamentoTelefone}
        onValorChange={state.setValorPagamento}
        onFormaPagamentoChange={state.setFormaPagamento}
        onReferenciaChange={state.setReferencia}
        onObservacoesChange={state.setObservacoes}
        onSave={state.salvarPagamento}
      />

      <ComprovanteDialog
        open={state.comprovanteOpen}
        onOpenChange={state.setComprovanteOpen}
        title="Comprovante de pagamento do aluguel"
        subtitle={state.comprovanteSubtitle}
        fields={state.comprovanteFields}
        recipientPhone={state.comprovantePhone}
        recipientName={state.comprovanteRecipient}
      />
    </div>
  );
}
