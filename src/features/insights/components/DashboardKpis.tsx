import {
  AlertTriangle,
  Award,
  Building2,
  DollarSign,
  Package,
  TrendingDown,
  Users,
} from 'lucide-react';
import { KpiCard } from '@/components/shared/KpiCard';

interface DashboardKpisProps {
  alunosAtivos: number;
  inadimplentes: number;
  aptosGraduacao: number;
  ocupacao: number;
  receitaMes: number;
  despesaMes: number;
  lucro: number;
  vendasMes: number;
}

function formatCurrency(value: number) {
  return `R$ ${value.toLocaleString('pt-BR')}`;
}

export function DashboardKpis({
  alunosAtivos,
  inadimplentes,
  aptosGraduacao,
  ocupacao,
  receitaMes,
  despesaMes,
  lucro,
  vendasMes,
}: DashboardKpisProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <KpiCard
          label="Alunos Ativos"
          valor={alunosAtivos}
          variacao={5}
          icon={<Users className="h-4 w-4" />}
        />
        <KpiCard
          label="Inadimplentes"
          valor={inadimplentes}
          variacao={-10}
          icon={<AlertTriangle className="h-4 w-4" />}
        />
        <KpiCard
          label="Aptos p/ Graduação"
          valor={aptosGraduacao}
          icon={<Award className="h-4 w-4" />}
        />
        <KpiCard
          label="Ocupação"
          valor={`${ocupacao}%`}
          variacao={3}
          icon={<Building2 className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <KpiCard
          label="Receita do Mês"
          valor={formatCurrency(receitaMes)}
          variacao={8}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <KpiCard
          label="Despesas do Mês"
          valor={formatCurrency(despesaMes)}
          variacao={2}
          icon={<TrendingDown className="h-4 w-4" />}
        />
        <KpiCard
          label="Lucro Estimado"
          valor={formatCurrency(lucro)}
          variacao={lucro > 0 ? 12 : -5}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <KpiCard
          label="Vendas do Mês"
          valor={formatCurrency(vendasMes)}
          variacao={6}
          icon={<Package className="h-4 w-4" />}
        />
      </div>
    </>
  );
}
