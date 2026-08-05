import { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { ChartSkeleton, KpiSkeleton } from '@/components/shared/PageSkeleton';
import { useAcademiaData } from '@/features/academia/AcademiaDataProvider';
import { DashboardCharts } from '@/features/insights/components/DashboardCharts';
import { DashboardKpis } from '@/features/insights/components/DashboardKpis';
import { DashboardQuickActions } from '@/features/insights/components/DashboardQuickActions';
import { DashboardUpdates } from '@/features/insights/components/DashboardUpdates';
import { useInsightsData } from '@/features/insights/InsightsDataProvider';
import { useOperacionalData } from '@/features/operacional/OperacionalDataProvider';

export default function DashboardPage() {
  const { alunosList } = useAcademiaData();
  const { cobrancasList, vendasList } = useOperacionalData();
  const {
    alertas,
    atividadesRecentes,
    graduacoesAlunos,
    frequenciaMensal,
    receitaDespesaMensal,
    receitas,
    despesas,
  } = useInsightsData();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const alunosAtivos = useMemo(
    () => alunosList.filter((aluno) => aluno.status === 'ativo').length,
    [alunosList],
  );
  const inadimplentes = useMemo(
    () => alunosList.filter((aluno) => aluno.status === 'inadimplente').length,
    [alunosList],
  );
  const aptosGraduacao = useMemo(
    () => graduacoesAlunos.filter(
      (item) => item.status === 'elegivel' || item.status === 'aprovado',
    ).length,
    [graduacoesAlunos],
  );
  const receitaMes = useMemo(
    () => receitas.reduce((soma, item) => soma + item.valor, 0),
    [receitas],
  );
  const despesaMes = useMemo(
    () => despesas.reduce((soma, item) => soma + item.valor, 0),
    [despesas],
  );
  const vendasMes = useMemo(
    () => vendasList.reduce((soma, item) => soma + item.total, 0),
    [vendasList],
  );
  const cobrancasEmAberto = useMemo(
    () => cobrancasList.filter(
      (item) => item.status === 'aberta'
        || item.status === 'parcial'
        || item.status === 'vencida',
    ).length,
    [cobrancasList],
  );

  const lucro = receitaMes - despesaMes;
  const ocupacao = Math.round((alunosAtivos / 60) * 100);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" subtitle="Visão geral da academia" />
        <KpiSkeleton count={4} />
        <KpiSkeleton count={4} />
        <div className="grid gap-4 md:grid-cols-2">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Visão geral da academia" />
      <DashboardQuickActions />
      <DashboardKpis
        alunosAtivos={alunosAtivos}
        inadimplentes={inadimplentes}
        aptosGraduacao={aptosGraduacao}
        ocupacao={ocupacao}
        receitaMes={receitaMes}
        despesaMes={despesaMes}
        lucro={lucro}
        vendasMes={vendasMes}
      />
      <DashboardCharts
        frequenciaMensal={frequenciaMensal}
        receitaDespesaMensal={receitaDespesaMensal}
      />
      <DashboardUpdates
        alertas={alertas}
        atividadesRecentes={atividadesRecentes}
        cobrancasEmAberto={cobrancasEmAberto}
      />
    </div>
  );
}
