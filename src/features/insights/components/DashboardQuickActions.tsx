import { Link } from 'react-router-dom';
import { ArrowRight, CalendarCheck, Package, Trophy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const quickActions = [
  { label: 'Novo aluno', to: '/alunos', icon: Users },
  { label: 'Lançar frequência', to: '/frequencia', icon: CalendarCheck },
  { label: 'Novo campeonato', to: '/campeonatos', icon: Trophy },
  { label: 'Registrar venda', to: '/produtos', icon: Package },
];

export function DashboardQuickActions() {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Ações rápidas</h2>
          <p className="text-xs text-muted-foreground">
            Atalhos para o uso diário da academia
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Button
            key={action.to}
            asChild
            variant="secondary"
            className="h-11 justify-between rounded-xl px-3 text-xs"
          >
            <Link to={action.to}>
              <span className="flex items-center gap-2">
                <action.icon className="h-4 w-4" />
                {action.label}
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        ))}
      </div>
    </section>
  );
}
