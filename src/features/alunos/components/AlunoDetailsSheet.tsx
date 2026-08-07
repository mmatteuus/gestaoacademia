import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Aluno } from '@/types';
import { useAlunoDetails } from '../hooks/useAlunoDetails';
import { AlunoFinanceiroTab } from './AlunoFinanceiroTab';
import { AlunoFrequenciaTab } from './AlunoFrequenciaTab';
import { AlunoGraduacaoTab } from './AlunoGraduacaoTab';
import { AlunoPerfilTab } from './AlunoPerfilTab';

interface AlunoDetailsSheetProps {
  alunoId: string | null;
  onClose: () => void;
  onEdit: (aluno: Aluno) => void;
}

export function AlunoDetailsSheet({ alunoId, onClose, onEdit }: AlunoDetailsSheetProps) {
  const details = useAlunoDetails(alunoId);
  const aluno = details.aluno;

  return (
    <Sheet open={Boolean(aluno)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto border-border bg-card p-0 sm:max-w-3xl">
        {aluno && (
          <div className="space-y-4 p-4">
            <SheetHeader className="flex-row items-center justify-between space-y-0">
              <SheetTitle>{aluno.nome}</SheetTitle>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-8 text-xs"
                onClick={() => onEdit(aluno)}
              >
                <Pencil className="mr-1 h-3.5 w-3.5" />
                Editar
              </Button>
            </SheetHeader>

            <Tabs defaultValue="perfil" className="w-full">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="perfil">Perfil</TabsTrigger>
                <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
                <TabsTrigger value="frequencia">Frequência</TabsTrigger>
                <TabsTrigger value="graduacao">Graduação</TabsTrigger>
              </TabsList>
              <TabsContent value="perfil"><AlunoPerfilTab details={details} /></TabsContent>
              <TabsContent value="financeiro"><AlunoFinanceiroTab details={details} /></TabsContent>
              <TabsContent value="frequencia"><AlunoFrequenciaTab details={details} /></TabsContent>
              <TabsContent value="graduacao"><AlunoGraduacaoTab details={details} /></TabsContent>
            </Tabs>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
