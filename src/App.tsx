import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminLayout } from "@/components/layout/AdminLayout";
import DashboardPage from "./pages/DashboardPage";
import AlunosPage from "./pages/AlunosPage";

import TurmasPage from "./pages/TurmasPage";
import FrequenciaPage from "./pages/FrequenciaPage";
import GraduacaoPage from "./pages/GraduacaoPage";
import RankingPage from "./pages/RankingPage";
import CampeonatosPage from "./pages/CampeonatosPage";
import FinanceiroPage from "./pages/FinanceiroPage";
import FinanceiroGerencialPage from "./pages/FinanceiroGerencialPage";
import ProdutosPage from "./pages/ProdutosPage";
import AluguelPage from "./pages/AluguelPage";
import RelatoriosPage from "./pages/RelatoriosPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AdminLayout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/alunos" element={<AlunosPage />} />
            
            <Route path="/turmas" element={<TurmasPage />} />
            <Route path="/frequencia" element={<FrequenciaPage />} />
            <Route path="/graduacao" element={<GraduacaoPage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/campeonatos" element={<CampeonatosPage />} />
            <Route path="/financeiro" element={<FinanceiroPage />} />
            <Route path="/financeiro-gerencial" element={<FinanceiroGerencialPage />} />
            <Route path="/produtos" element={<ProdutosPage />} />
            <Route path="/aluguel" element={<AluguelPage />} />
            <Route path="/relatorios" element={<RelatoriosPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AdminLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
