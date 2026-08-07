import { AlertTriangle, DollarSign, RefreshCcw } from 'lucide-react';
import { ComprovanteDialog } from '@/components/shared/ComprovanteDialog';
import { KpiCard } from '@/components/shared/KpiCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { CobrancasList } from '@/features/financeiro/components/CobrancasList';
import { FinanceiroFilters } from '@/features/financeiro/components/FinanceiroFilters';
import { PagamentoCobrancaDialog } from '@/features/financeiro/components/PagamentoCobrancaDialog';
import { useFinanceiroPage } from '@/features/financeiro/useFinanceiroPage';

export default function FinanceiroPage() {
  const state = useFinanceiroPage();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financeiro Escolar"
        subtitle="Cobranças vinculadas ao aluno"
        actions={(
          <Button size="sm" variant="secondary" onClick={state.gerarMensalidades}>
            <RefreshCcw className="mr-1 h-4 w-4" />Gerar mensalidades pendentes
          </Button>
        )}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Total em aberto" valor={`R$ ${state.totalAberto.toLocaleString('pt-BR')}`} icon={<DollarSign className="h-4 w-4" />} />
        <KpiCard label="Total vencido" valor={`R$ ${state.totalVencido.toLocaleString('pt-BR')}`} icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="Mensalidades pendentes" valor={state.mensalidadesPendentes} />
        <KpiCard label="Cobranças" valor={state.cobrancasList.length} />
      </div>

      <FinanceiroFilters
        busca={state.busca}
        filtro={state.filtro}
        alunoFiltroId={state.alunoFiltroId}
        alunos={state.alunosList}
        onBuscaChange={state.setBusca}
        onFiltroChange={state.setFiltro}
        onAlunoChange={state.setAlunoFiltro}
      />

      <CobrancasList cobrancas={state.filtered} onPayment={state.openPayment} onReceipt={state.openReceipt} />

      <PagamentoCobrancaDialog
        open={state.pagamentoOpen}
        onOpenChange={state.setPagamentoOpen}
        cobranca={state.cobrancaSel}
        valor={state.valorPagamento}
        formaPagamento={state.formaPagamento}
        observacoes={state.observacoes}
        onValorChange={state.setValorPagamento}
        onFormaPagamentoChange={state.setFormaPagamento}
        onObservacoesChange={state.setObservacoes}
        onConfirm={state.confirmPayment}
      />

      <ComprovanteDialog
        open={state.comprovanteOpen}
        onOpenChange={state.setComprovanteOpen}
        title="Comprovante de pagamento"
        subtitle={state.comprovanteSubtitle}
        fields={state.comprovanteFields}
        recipientPhone={state.comprovantePhone}
        recipientName={state.comprovanteRecipient}
      />
    </div>
  );
}
