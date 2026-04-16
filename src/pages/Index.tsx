import { Link } from "react-router-dom";
import { Users, User, ArrowRight } from "lucide-react";
import { AppFooter } from "@/components/layout/AppFooter";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="mb-6 flex justify-center">
            <div className="bg-primary/10 p-4 rounded-full">
              <span className="text-4xl text-primary" role="img" aria-label="Kimono">🥋</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gêmeos Academia</h1>
          <p className="text-gray-500 mb-8">Sistema de gestão administrativa.</p>
          <div className="space-y-4">
            <Link 
              to="/alunos" 
              className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg border border-gray-200 group"
            >
              <div className="flex items-center gap-3">
                <Users className="text-primary" />
                <span className="font-medium text-gray-700">Gestão de Alunos</span>
              </div>
              <ArrowRight className="text-gray-400 group-hover:text-primary transition-colors" size={18} />
            </Link>
            <Link 
              to="/turmas" 
              className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg border border-gray-200 group"
            >
              <div className="flex items-center gap-3">
                <User className="text-primary" />
                <span className="font-medium text-gray-700">Gestão de Turmas</span>
              </div>
              <ArrowRight className="text-gray-400 group-hover:text-primary transition-colors" size={18} />
            </Link>
          </div>
        </div>
      </div>
      <AppFooter />
    </div>
  );
};

export default Index;
