import { RefreshCcw } from 'lucide-react';
import { ComprovanteDialog } from '@/components/shared/ComprovanteDialog';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { CobrancasList } from '@/features/financeiro/components/CobrancasList';
import { FinanceiroFilters } from '@/features/financeiro/components/FinanceiroFilters';
import { FinanceiroKpis } from '@/features/financeiro/components/FinanceiroKpis';
import { PagamentoCobrancaDialog } from '@/features/financeiro/components/PagamentoCobrancaDialog';
import { useFinanceiroPage } from '@/features/financeiro/hooks/useFinanceiroPage';

export default function FinanceiroPage() {
  const financeiro = useFinanceiroPage();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financeiro escolar"
        subtitle="Cobranças vinculadas aos alunos"
        actions={
          <Button type="button" size="sm" variant="secondary" onClick={financeiro.gerarMensalidades}>
            <RefreshCcw className="mr-1 h-4 w-4" />
            Gerar mensalidades pendentes
          </Button>
        }
      />

      <FinanceiroKpis metrics={financeiro.metrics} />

      <FinanceiroFilters
        busca={financeiro.busca}
        filtro={financeiro.filtro}
        alunoId={financeiro.alunoFiltroId}
        alunos={financeiro.alunos}
        onBuscaChange={financeiro.setBusca}
        onFiltroChange={financeiro.setFiltro}
        onAlunoChange={financeiro.setAlunoFiltro}
      />

      <CobrancasList
        cobrancas={financeiro.cobrancas}
        onPay={financeiro.abrirPagamento}
        onOpenReceipt={financeiro.abrirComprovante}
      />

      <PagamentoCobrancaDialog
        open={financeiro.pagamentoOpen}
        cobranca={financeiro.cobrancaSelecionada}
        onOpenChange={financeiro.setPagamentoOpen}
        onSubmit={financeiro.confirmarPagamento}
      />

      <ComprovanteDialog
        open={financeiro.comprovante.open}
        onOpenChange={financeiro.setComprovanteOpen}
        title="Comprovante de pagamento"
        subtitle={financeiro.comprovante.subtitle}
        fields={financeiro.comprovante.fields}
        recipientPhone={financeiro.comprovante.phone}
        recipientName={financeiro.comprovante.recipient}
      />
    </div>
  );
}
