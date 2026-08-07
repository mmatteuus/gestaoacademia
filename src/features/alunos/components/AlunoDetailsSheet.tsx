import { Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Aluno } from '@/types';
import { useAlunoDetails } from '../hooks/useAlunoDetails';
import { AlunoAttendanceTab } from './AlunoAttendanceTab';
import { AlunoFinancialTab } from './AlunoFinancialTab';
import { AlunoGraduationTab } from './AlunoGraduationTab';
import { AlunoProfileTab } from './AlunoProfileTab';

interface AlunoDetailsSheetProps {
  alunoId: string | null;
  onClose: () => void;
  onEdit: (aluno: Aluno) => void;
}

export function AlunoDetailsSheet({ alunoId, onClose, onEdit }: AlunoDetailsSheetProps) {
  const navigate = useNavigate();
  const details = useAlunoDetails(alunoId);
  const { aluno } = details;

  return (
    <Sheet open={Boolean(aluno)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto border-border bg-card p-0 sm:max-w-3xl">
        {aluno && (
          <div className="space-y-4 p-4">
            <SheetHeader className="flex-row items-center justify-between space-y-0">
              <SheetTitle>{aluno.nome}</SheetTitle>
              <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => onEdit(aluno)}>
                <Pencil className="mr-1 h-3.5 w-3.5" />
                Editar
              </Button>
            </SheetHeader>

            <Tabs defaultValue="perfil" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="perfil">Perfil</TabsTrigger>
                <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
                <TabsTrigger value="frequencia">Frequência</TabsTrigger>
                <TabsTrigger value="graduacao">Graduação</TabsTrigger>
              </TabsList>

              <TabsContent value="perfil">
                <AlunoProfileTab
                  aluno={aluno}
                  responsavel={details.responsavel}
                  showResponsavel={details.showResponsavel}
                  turmas={details.turmasDoAluno}
                  turmasDisponiveis={details.turmasDisponiveis}
                  onAddTurma={details.addToTurma}
                  onRemoveTurma={details.removeFromTurma}
                />
              </TabsContent>

              <TabsContent value="financeiro">
                <AlunoFinancialTab
                  cobrancas={details.cobrancas}
                  mensalidadesCount={details.mensalidades.length}
                  mensalidadePendente={details.mensalidadePendente}
                  onOpenFinancial={() => navigate(`/financeiro?aluno=${aluno.id}`)}
                />
              </TabsContent>

              <TabsContent value="frequencia">
                <AlunoAttendanceTab
                  records={details.historicoFrequencia}
                  totalAulas={details.totalAulas}
                  totalPresencas={details.totalPresencas}
                  taxaPresenca={details.taxaPresenca}
                />
              </TabsContent>

              <TabsContent value="graduacao">
                <AlunoGraduationTab
                  graduacao={details.graduacao}
                  percentual={details.percentualGraduacao}
                  onOpenGraduation={() => navigate(`/graduacao?aluno=${aluno.id}`)}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
