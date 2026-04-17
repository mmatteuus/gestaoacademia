import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AcademiaDataProvider } from '@/features/academia/AcademiaDataProvider';
import { OperacionalDataProvider } from '@/features/operacional/OperacionalDataProvider';
import { InsightsDataProvider } from '@/features/insights/InsightsDataProvider';
import { ApiError } from '@/services/api/client';
import DashboardPage from './pages/DashboardPage';
import AlunosPage from './pages/AlunosPage';
import TurmasPage from './pages/TurmasPage';
import FrequenciaPage from './pages/FrequenciaPage';
import GraduacaoPage from './pages/GraduacaoPage';
import RankingPage from './pages/RankingPage';
import CampeonatosPage from './pages/CampeonatosPage';
import FinanceiroPage from './pages/FinanceiroPage';
import FinanceiroGerencialPage from './pages/FinanceiroGerencialPage';
import ProdutosPage from './pages/ProdutosPage';
import AluguelPage from './pages/AluguelPage';
import RelatoriosPage from './pages/RelatoriosPage';
import NotFound from './pages/NotFound';

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
      staleTime: 30_000,
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AdminLayout>
          <Routes>
            <Route
              path="/"
              element={
                <WithAllData>
                  <DashboardPage />
                </WithAllData>
              }
            />
            <Route
              path="/alunos"
              element={
                <WithAcademia>
                  <AlunosPage />
                </WithAcademia>
              }
            />
            <Route
              path="/turmas"
              element={
                <WithAcademia>
                  <TurmasPage />
                </WithAcademia>
              }
            />
            <Route
              path="/frequencia"
              element={
                <WithAcademia>
                  <FrequenciaPage />
                </WithAcademia>
              }
            />
            <Route
              path="/graduacao"
              element={
                <WithAcademiaAndInsights>
                  <GraduacaoPage />
                </WithAcademiaAndInsights>
              }
            />
            <Route
              path="/ranking"
              element={
                <WithInsights>
                  <RankingPage />
                </WithInsights>
              }
            />
            <Route
              path="/campeonatos"
              element={
                <WithAcademiaAndInsights>
                  <CampeonatosPage />
                </WithAcademiaAndInsights>
              }
            />
            <Route
              path="/financeiro"
              element={
                <WithAcademiaAndOperacional>
                  <FinanceiroPage />
                </WithAcademiaAndOperacional>
              }
            />
            <Route
              path="/financeiro-gerencial"
              element={
                <WithInsights>
                  <FinanceiroGerencialPage />
                </WithInsights>
              }
            />
            <Route
              path="/produtos"
              element={
                <WithOperacional>
                  <ProdutosPage />
                </WithOperacional>
              }
            />
            <Route
              path="/aluguel"
              element={
                <WithOperacional>
                  <AluguelPage />
                </WithOperacional>
              }
            />
            <Route
              path="/relatorios"
              element={
                <WithAllData>
                  <RelatoriosPage />
                </WithAllData>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AdminLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;