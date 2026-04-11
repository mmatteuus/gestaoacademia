import { SidebarTrigger } from '@/components/ui/sidebar';
import { Search, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/alunos': 'Alunos',
  '/responsaveis': 'Responsáveis',
  '/turmas': 'Turmas',
  '/frequencia': 'Frequência',
  '/graduacao': 'Graduação',
  '/ranking': 'Ranking',
  '/campeonatos': 'Campeonatos',
  '/financeiro': 'Financeiro Escolar',
  '/financeiro-gerencial': 'Financeiro Gerencial',
  '/produtos': 'Produtos & Vendas',
  '/aluguel': 'Aluguel',
  '/relatorios': 'Relatórios',
};

export function AppTopbar() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Dojo Manager';

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card/50 backdrop-blur-sm shrink-0">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <h2 className="text-sm font-semibold text-foreground hidden sm:block">{title}</h2>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="pl-9 w-56 h-8 text-xs bg-secondary/50 border-border/50 focus:bg-secondary"
          />
        </div>
        <Button variant="ghost" size="icon" className="relative h-8 w-8 text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 bg-primary rounded-full text-[9px] text-primary-foreground flex items-center justify-center font-bold">3</span>
        </Button>
      </div>
    </header>
  );
}
