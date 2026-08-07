import { AlunoForm } from '@/components/forms/AlunoForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { AlunoFormValues } from '@/features/alunos/types/aluno.types';
import type { Aluno } from '@/types';

interface AlunoFormDialogProps {
  open: boolean;
  aluno?: Aluno;
  responsaveis: { id: string; nome: string }[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AlunoFormValues) => Promise<void>;
}

export function AlunoFormDialog({
  open,
  aluno,
  responsaveis,
  onOpenChange,
  onSubmit,
}: AlunoFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{aluno ? 'Editar aluno' : 'Novo aluno'}</DialogTitle>
          <DialogDescription>
            {aluno
              ? 'Atualize os dados do aluno.'
              : 'Preencha os dados para cadastrar um novo aluno.'}
          </DialogDescription>
        </DialogHeader>
        <AlunoForm
          aluno={aluno}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          responsaveis={responsaveis}
        />
      </DialogContent>
    </Dialog>
  );
}
