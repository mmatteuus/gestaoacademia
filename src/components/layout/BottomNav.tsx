import { useState } from 'react';
import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, BookOpen, CalendarCheck,
  Award, Trophy, DollarSign, Package, Building2,
  BarChart3, TrendingUp, MoreHorizontal, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Item = { title: string; url: string; icon: React.ComponentType<{ className?: string }> };

const primary: Item[] = [
  { title: 'Início', url: '/', icon: LayoutDashboard },
  { title: 'Alunos', url: '/alunos', icon: Users },
  { title: 'Frequência', url: '/frequencia', icon: CalendarCheck },
  { title: 'Financeiro', url: '/financeiro', icon: DollarSign },
];

const secondary: Item[] = [
  { title: 'Turmas', url: '/turmas', icon: BookOpen },
  { title: 'Graduação', url: '/graduacao', icon: Award },
  { title: 'Ranking', url: '/ranking', icon: TrendingUp },
  { title: 'Campeonatos', url: '/campeonatos', icon: Trophy },
  { title: 'Gerencial', url: '/financeiro-gerencial', icon: BarChart3 },
  { title: 'Produtos & Vendas', url: '/produtos', icon: Package },
  { title: 'Aluguel', url: '/aluguel', icon: Building2 },
  { title: 'Relatórios', url: '/relatorios', icon: BarChart3 },
];

export function BottomNav() {
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const moreActive = secondary.some((it) => location.pathname === it.url);

  return (
    <>
      <nav
        aria-label="Navegação principal"
        style={{ position: 'fixed' }}
        className="bottom-0 inset-x-0 z-50 border-t border-border/80 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/85 pb-[env(safe-area-inset-bottom)] border-tech"
      >
        <p className="text-center text-[10px] text-muted-foreground/70 pt-1 pb-0.5 leading-none border-b border-border/40">
          Desenvolvido por{' '}
          <a
            href="https://www.mtsferreira.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            MtsFerreira
          </a>
        </p>
        <ul className="mx-auto grid max-w-3xl grid-cols-5 items-stretch">
          {primary.map((item) => (
            <li key={item.url} className="flex">
              <RouterNavLink
                to={item.url}
                end={item.url === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] sm:text-xs min-h-[56px] transition-colors',
                    isActive
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        'relative flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg transition-all',
                        isActive && 'bg-primary/15 ring-1 ring-primary/40 glow-primary-sm'
                      )}
                    >
                      <item.icon className={cn('h-5 w-5 sm:h-5 sm:w-5', isActive ? 'text-primary' : '')} />
                    </span>
                    <span className="leading-none">{item.title}</span>
                  </>
                )}
              </RouterNavLink>
            </li>
          ))}
          <li className="flex">
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              aria-label="Abrir mais opções"
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] sm:text-xs min-h-[56px] transition-colors',
                moreActive ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <MoreHorizontal className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="leading-none">Mais</span>
            </button>
          </li>
        </ul>
      </nav>

      {moreOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMoreOpen(false)}
          role="dialog"
          aria-label="Mais opções de navegação"
        >
          <div
            className="absolute bottom-0 inset-x-0 rounded-t-2xl border-t border-border bg-card p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto h-1 w-12 rounded-full bg-muted mb-3" aria-hidden />
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-foreground">Mais opções</h2>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                aria-label="Fechar"
                className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-accent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {secondary.map((item) => (
                <li key={item.url}>
                  <RouterNavLink
                    to={item.url}
                    onClick={() => setMoreOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-2 py-3 text-xs transition-colors min-h-[80px]',
                        isActive ? 'border-primary text-primary font-semibold' : 'text-foreground hover:bg-accent'
                      )
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-center leading-tight">{item.title}</span>
                  </RouterNavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
