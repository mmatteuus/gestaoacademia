import { Plus } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { CampeonatoCard } from '@/features/campeonatos/components/CampeonatoCard';
import { NovoCampeonatoDialog } from '@/features/campeonatos/components/NovoCampeonatoDialog';
import { SelecionarAlunosDialog } from '@/features/campeonatos/components/SelecionarAlunosDialog';
import { useCampeonatosPage } from '@/features/campeonatos/hooks/useCampeonatosPage';

export default function CampeonatosPage() {
  const {
    campeonatos,
    novoCampeonatoOpen,
    setNovoCampeonatoOpen,
    form,
    updateForm,
    saveCampeonato,
    selecaoAlunosOpen,
    setStudentSelectionOpen,
    campeonatoSelecionado,
    alunosDisponiveis,
    alunosSelecionados,
    toggleStudent,
    confirmStudents,
    openStudentSelection,
  } = useCampeonatosPage();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campeonatos"
        subtitle={`${campeonatos.length} campeonatos registrados`}
        actions={
          <Button size="sm" onClick={() => setNovoCampeonatoOpen(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Novo campeonato
          </Button>
        }
      />

      {campeonatos.length === 0 ? (
        <EmptyState title="Nenhum campeonato registrado" />
      ) : (
        <div className="space-y-4">
          {campeonatos.map((campeonato) => (
            <CampeonatoCard
              key={campeonato.id}
              campeonato={campeonato}
              onAddStudents={openStudentSelection}
            />
          ))}
        </div>
      )}

      <NovoCampeonatoDialog
        open={novoCampeonatoOpen}
        values={form}
        onOpenChange={setNovoCampeonatoOpen}
        onChange={updateForm}
        onSubmit={saveCampeonato}
      />

      <SelecionarAlunosDialog
        open={selecaoAlunosOpen}
        title={campeonatoSelecionado?.nome}
        alunos={alunosDisponiveis}
        selectedIds={alunosSelecionados}
        onOpenChange={setStudentSelectionOpen}
        onToggle={toggleStudent}
        onConfirm={confirmStudents}
      />
    </div>
  );
}
