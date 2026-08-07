import {
  Award,
  BarChart3,
  BookOpen,
  Building2,
  CalendarCheck,
  DollarSign,
  LayoutDashboard,
  Package,
  TrendingUp,
  Trophy,
  Users,
  type LucideIcon,
} from 'lucide-react';

export interface BottomNavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export const primaryBottomNavItems: BottomNavItem[] = [
  { title: 'Início', url: '/', icon: LayoutDashboard },
  { title: 'Alunos', url: '/alunos', icon: Users },
  { title: 'Frequência', url: '/frequencia', icon: CalendarCheck },
  { title: 'Financeiro', url: '/financeiro', icon: DollarSign },
];

export const secondaryBottomNavItems: BottomNavItem[] = [
  { title: 'Turmas', url: '/turmas', icon: BookOpen },
  { title: 'Graduação', url: '/graduacao', icon: Award },
  { title: 'Ranking', url: '/ranking', icon: TrendingUp },
  { title: 'Campeonatos', url: '/campeonatos', icon: Trophy },
  { title: 'Gerencial', url: '/financeiro-gerencial', icon: BarChart3 },
  { title: 'Produtos e vendas', url: '/produtos', icon: Package },
  { title: 'Aluguel', url: '/aluguel', icon: Building2 },
  { title: 'Relatórios', url: '/relatorios', icon: BarChart3 },
];
