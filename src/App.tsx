import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { lazy, Suspense, type ReactNode } from 'react';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AcademiaDataProvider } from '@/features/academia/AcademiaDataProvider';
import { OperacionalDataProvider } from '@/features/operacional/OperacionalDataProvider';
import { InsightsDataProvider } from '@/features/insights/InsightsDataProvider';
import { ApiError } from '@/services/api/client';
import { AuthProvider, useAuth } from '@/features/auth/AuthContext';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const PublicCadastroPage = lazy(() => import('./pages/PublicCadastroPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AlunosPage = lazy(() => import('./pages/AlunosPage'));
const TurmasPage = lazy(() => import('./pages/TurmasPage'));
const FrequenciaPage = lazy(() => import('./pages/FrequenciaPage'));
const GraduacaoPage = lazy(() => import('./pages/GraduacaoPage'));
const RankingPage = lazy(() => import('./pages/RankingPage'));
const CampeonatosPage = lazy(() => import('./pages/CampeonatosPage'));
const FinanceiroPage = lazy(() => import('./pages/FinanceiroPage'));
const FinanceiroGerencialPage = lazy(() => import('./pages/FinanceiroGerencialPage'));
const ProdutosPage = lazy(() => import('./pages/ProdutosPage'));
const AluguelPage = lazy(() => import('./pages/AluguelPage'));
const RelatoriosPage = lazy(() => import('./pages/RelatoriosPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

function shouldRetryQuery(failureCount: number, error: unknown) {
  if (failureCount >= 2) return false;
  if (error instanceof ApiError) {
    if (error.status === 429) return true;
    if (error.status >= 500) return true;
    return false;
  }
  return true;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetryQuery,
      retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 4_000),
      // Sheets API tem cota baixa (60 reads/min/user). staleTime longo evita
      // refetches em troca de aba/foco que estouravam a quota e quebravam o app.
      staleTime: 5 * 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

function WithAcademia({ children }: { children: ReactNode }) {
  return <AcademiaDataProvider>{children}</AcademiaDataProvider>;
}

function WithOperacional({ children }: { children: ReactNode }) {
  return <OperacionalDataProvider>{children}</OperacionalDataProvider>;
}

function WithInsights({ children }: { children: ReactNode }) {
  return <InsightsDataProvider>{children}</InsightsDataProvider>;
}

function WithAcademiaAndInsights({ children }: { children: ReactNode }) {
  return (
    <WithAcademia>
      <WithInsights>{children}</WithInsights>
    </WithAcademia>
  );
}

function WithAcademiaAndOperacional({ children }: { children: ReactNode }) {
  return (
    <WithAcademia>
      <WithOperacional>{children}</WithOperacional>
    </WithAcademia>
  );
}

function WithAllData({ children }: { children: ReactNode }) {
  return (
    <WithAcademia>
      <WithOperacional>
        <WithInsights>{children}</WithInsights>
      </WithOperacional>
    </WithAcademia>
  );
}

function AuthGate({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return (
      <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Carregando...</div>}>
        <LoginPage />
      </Suspense>
    );
  }
  return <>{children}</>;
}

function AdminApp() {
  return (
    <AuthGate>
      <AdminLayout>
        <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Carregando...</div>}>
          <Routes>
            <Route path="/" element={<WithAllData><DashboardPage /></WithAllData>} />
            <Route path="/alunos" element={<WithAcademia><AlunosPage /></WithAcademia>} />
            <Route path="/turmas" element={<WithAcademia><TurmasPage /></WithAcademia>} />
            <Route path="/frequencia" element={<WithAcademia><FrequenciaPage /></WithAcademia>} />
            <Route path="/graduacao" element={<WithAcademiaAndInsights><GraduacaoPage /></WithAcademiaAndInsights>} />
            <Route path="/ranking" element={<WithInsights><RankingPage /></WithInsights>} />
            <Route path="/campeonatos" element={<WithAcademiaAndInsights><CampeonatosPage /></WithAcademiaAndInsights>} />
            <Route path="/financeiro" element={<WithAcademiaAndOperacional><FinanceiroPage /></WithAcademiaAndOperacional>} />
            <Route path="/financeiro-gerencial" element={<WithInsights><FinanceiroGerencialPage /></WithInsights>} />
            <Route path="/produtos" element={<WithOperacional><ProdutosPage /></WithOperacional>} />
            <Route path="/aluguel" element={<WithOperacional><AluguelPage /></WithOperacional>} />
            <Route path="/relatorios" element={<WithAllData><RelatoriosPage /></WithAllData>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AdminLayout>
    </AuthGate>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Carregando...</div>}>
            <Routes>
              <Route path="/cadastro/aluno" element={<PublicCadastroPage />} />
              <Route path="*" element={<AdminApp />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
