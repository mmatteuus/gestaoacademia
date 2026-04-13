import {
  LayoutDashboard, Users, UserCheck, BookOpen, CalendarCheck,
  Award, Trophy, Medal, DollarSign, Package, Building2,
  BarChart3, TrendingUp,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

const menuItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Alunos', url: '/alunos', icon: Users },
  { title: 'Responsáveis', url: '/responsaveis', icon: UserCheck },
  { title: 'Turmas', url: '/turmas', icon: BookOpen },
  { title: 'Frequência', url: '/frequencia', icon: CalendarCheck },
  { title: 'Graduação', url: '/graduacao', icon: Award },
  { title: 'Ranking', url: '/ranking', icon: TrendingUp },
  { title: 'Campeonatos', url: '/campeonatos', icon: Trophy },
];

const menuFinanceiro = [
  { title: 'Mensalidades', url: '/financeiro', icon: DollarSign },
  { title: 'Gerencial', url: '/financeiro-gerencial', icon: BarChart3 },
];

const menuOperacional = [
  { title: 'Produtos & Vendas', url: '/produtos', icon: Package },
  { title: 'Aluguel', url: '/aluguel', icon: Building2 },
  { title: 'Relatórios', url: '/relatorios', icon: Medal },
];

export function AppSidebar() {
  const { state, setOpenMobile } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const isMobile = useIsMobile();
  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const renderGroup = (label: string, items: typeof menuItems) => (
    <SidebarGroup key={label}>
      <SidebarGroupLabel className="text-muted-foreground/60 text-[10px] uppercase tracking-widest font-semibold">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  end={item.url === '/'}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  activeClassName="bg-primary/10 text-primary font-medium border-l-2 border-primary"
                  onClick={handleNavClick}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {(!collapsed || isMobile) && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Award className="h-4 w-4 text-primary-foreground" />
        </div>
        {(!collapsed || isMobile) && (
          <div>
            <h1 className="text-sm font-bold text-foreground tracking-tight">Gêmeos Academia</h1>
            <p className="text-[10px] text-muted-foreground">Sistema Administrativo</p>
          </div>
        )}
      </div>
      <SidebarContent className="py-2">
        {renderGroup('Principal', menuItems)}
        {renderGroup('Financeiro', menuFinanceiro)}
        {renderGroup('Operacional', menuOperacional)}
      </SidebarContent>
    </Sidebar>
  );
}
