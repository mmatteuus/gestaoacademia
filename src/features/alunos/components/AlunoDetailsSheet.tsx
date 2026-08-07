import { Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Aluno, Cobranca, GraduacaoAluno, Responsavel, SessaoAula, Turma } from '@/types';
import { useAlunoDetails } from '../useAlunoDetails';
import { AlunoFinanceiroTab } from './AlunoFinanceiroTab';
import { AlunoFrequenciaTab } from './AlunoFrequenciaTab';
import { AlunoGraduacaoTab } from './AlunoGraduacaoTab';
import { AlunoPerfilTab } from './AlunoPerfilTab';

interface Props {
  aluno: Aluno | null;
  cobrancas: Cobranca[];
  graduacoes: GraduacaoAluno[];
  responsaveis: Responsavel[];
  sessoes: SessaoAula[];
  turmas: Turma[];
  onClose: () => void;
  onEdit: (aluno: Aluno) => void;
  onAddTurma: (alunoId: string, turmaId: string) => { ok: boolean; message?: string };
  onRemoveTurma: (alunoId: string, turmaId: string) => { ok: boolean; message?: string };
}

export function AlunoDetailsSheet({
  aluno,
  cobrancas,
  graduacoes,
  responsaveis,
  sessoes,
  turmas,
  onClose,
  onEdit,
  onAddTurma,
  onRemoveTurma,
}: Props) {
  const details = useAlunoDetails({ aluno, cobrancas, graduacoes, responsaveis, sessoes, turmas });

  const handleAddTurma = (turmaId: string) => {
    if (!aluno) return;
    const result = onAddTurma(aluno.id, turmaId);
    if (result.ok) toast.success('Aluno adicionado à turma.');
    else toast.error(result.message || 'Falha ao vincular turma.');
  };

  const handleRemoveTurma = (turmaId: string) => {
    if (!aluno) return;
    const result = onRemoveTurma(aluno.id, turmaId);
    if (!result.ok) toast.error(result.message || 'Falha ao remover aluno da turma.');
  };

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
                <AlunoPerfilTab
                  aluno={aluno}
                  responsavel={details.responsavel}
                  showResponsavel={details.showResponsavel}
                  turmasDoAluno={details.turmasDoAluno}
                  turmasDisponiveis={details.turmasDisponiveis}
                  onAddTurma={handleAddTurma}
                  onRemoveTurma={handleRemoveTurma}
                />
              </TabsContent>
              <TabsContent value="financeiro">
                <AlunoFinanceiroTab
                  aluno={aluno}
                  cobrancas={details.alunoCobrancasOrdenadas}
                  mensalidades={details.alunoMensalidades}
                  mensalidadePendente={details.mensalidadePendente}
                />
              </TabsContent>
              <TabsContent value="frequencia">
                <AlunoFrequenciaTab
                  historico={details.historicoFrequencia}
                  totalAulas={details.totalAulas}
                  totalPresencas={details.totalPresencas}
                  taxaPresenca={details.taxaPresenca}
                />
              </TabsContent>
              <TabsContent value="graduacao">
                <AlunoGraduacaoTab
                  aluno={aluno}
                  graduacao={details.graduacao}
                  percentual={details.percentualGraduacao}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
