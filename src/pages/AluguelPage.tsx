import { Plus } from 'lucide-react';
import { ComprovanteDialog } from '@/components/shared/ComprovanteDialog';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContratosList } from '@/features/aluguel/components/ContratosList';
import { PagamentoContratoDialog } from '@/features/aluguel/components/PagamentoContratoDialog';
import { ReservaDialog } from '@/features/aluguel/components/ReservaDialog';
import { ReservasList } from '@/features/aluguel/components/ReservasList';
import { useAluguelPage } from '@/features/aluguel/hooks/useAluguelPage';

export default function AluguelPage() {
  const aluguel = useAluguelPage();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Aluguel da academia"
        subtitle="Reservas, contratos e pagamentos de espaços"
        actions={
          <Button type="button" size="sm" onClick={() => aluguel.setReservaOpen(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Nova reserva
          </Button>
        }
      />

      <Tabs defaultValue="reservas">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="reservas" className="text-xs">Reservas</TabsTrigger>
          <TabsTrigger value="contratos" className="text-xs">Contratos</TabsTrigger>
        </TabsList>

        <TabsContent value="reservas" className="mt-4">
          <ReservasList reservas={aluguel.reservas} />
        </TabsContent>

        <TabsContent value="contratos" className="mt-4">
          <ContratosList
            contratos={aluguel.contratos}
            pagamentosPorContrato={aluguel.pagamentosPorContrato}
            onRegisterPayment={aluguel.abrirPagamento}
            onOpenReceipt={aluguel.abrirComprovante}
          />
        </TabsContent>
      </Tabs>

      <ReservaDialog
        open={aluguel.reservaOpen}
        onOpenChange={aluguel.setReservaOpen}
        onSubmit={aluguel.criarReserva}
      />

      <PagamentoContratoDialog
        open={aluguel.pagamentoOpen}
        contrato={aluguel.contratoSelecionado}
        onOpenChange={aluguel.setPagamentoOpen}
        onSubmit={aluguel.registrarPagamento}
      />

      <ComprovanteDialog
        open={aluguel.comprovante.open}
        onOpenChange={aluguel.setComprovanteOpen}
        title="Comprovante de pagamento do aluguel"
        subtitle={aluguel.comprovante.subtitle}
        fields={aluguel.comprovante.fields}
        recipientPhone={aluguel.comprovante.phone}
        recipientName={aluguel.comprovante.recipient}
      />
    </div>
  );
}
