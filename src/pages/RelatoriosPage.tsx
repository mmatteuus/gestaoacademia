import { PageHeader } from '@/components/shared/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlunosReport } from '@/features/relatorios/components/AlunosReport';
import { FinanceiroReport } from '@/features/relatorios/components/FinanceiroReport';
import { FrequenciaReport } from '@/features/relatorios/components/FrequenciaReport';
import { GraduacaoReport } from '@/features/relatorios/components/GraduacaoReport';
import { RankingReport } from '@/features/relatorios/components/RankingReport';
import { VendasReport } from '@/features/relatorios/components/VendasReport';
import { useRelatoriosData } from '@/features/relatorios/hooks/useRelatoriosData';

export default function RelatoriosPage() {
  const data = useRelatoriosData();

  return (
    <div className="space-y-6">
      <PageHeader title="Relatórios" subtitle="Indicadores operacionais e financeiros" />

      <Tabs defaultValue="alunos">
        <TabsList className="h-auto flex-wrap bg-muted/50">
          <TabsTrigger value="alunos" className="text-xs">Alunos</TabsTrigger>
          <TabsTrigger value="frequencia" className="text-xs">Frequência</TabsTrigger>
          <TabsTrigger value="financeiro" className="text-xs">Financeiro</TabsTrigger>
          <TabsTrigger value="graduacao" className="text-xs">Graduação</TabsTrigger>
          <TabsTrigger value="ranking" className="text-xs">Ranking</TabsTrigger>
          <TabsTrigger value="vendas" className="text-xs">Vendas</TabsTrigger>
        </TabsList>

        <TabsContent value="alunos" className="mt-4">
          <AlunosReport data={data.statusAlunos} />
        </TabsContent>
        <TabsContent value="frequencia" className="mt-4">
          <FrequenciaReport mensal={data.frequenciaMensal} heatmap={data.frequenciaHeatmap} />
        </TabsContent>
        <TabsContent value="financeiro" className="mt-4">
          <FinanceiroReport mensal={data.receitaDespesaMensal} cobrancas={data.situacaoCobrancas} />
        </TabsContent>
        <TabsContent value="graduacao" className="mt-4">
          <GraduacaoReport data={data.funilGraduacao} />
        </TabsContent>
        <TabsContent value="ranking" className="mt-4">
          <RankingReport ranking={data.ranking} series={data.rankingSeries} timeline={data.rankingTimeline} />
        </TabsContent>
        <TabsContent value="vendas" className="mt-4">
          <VendasReport resumo={data.resumoVendas} distribuicao={data.vendasDistribuicao} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
