import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { responsaveis as responsaveisMock, alunos } from '@/services/mocks/data';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Phone, Mail, Users } from 'lucide-react';
import { toast } from 'sonner';
import type { Responsavel } from '@/types';

export default function ResponsaveisPage() {
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>(responsaveisMock);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  const totalAlunosVinculados = useMemo(
    () => responsaveis.reduce((acc, item) => acc + item.alunoIds.length, 0),
    [responsaveis]
  );

  const handleSalvar = () => {
    if (!nome.trim() || !telefone.trim()) {
      toast.error('Preencha os campos obrigatórios: nome e telefone.');
      return;
    }

    setResponsaveis((prev) => [
      {
        id: `r${Date.now()}`,
        nome: nome.trim(),
        telefone: telefone.trim(),
        email: email.trim(),
        cpf: '000.000.000-00',
        alunoIds: [],
      },
      ...prev,
    ]);

    toast.success('Responsável cadastrado com sucesso.');
    setDialogOpen(false);
    setNome('');
    setEmail('');
    setTelefone('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Responsáveis"
        subtitle={`${responsaveis.length} responsáveis e ${totalAlunosVinculados} vínculos atuais`}
        actions={
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Novo responsável
          </Button>
        }
      />

      {responsaveis.length === 0 ? (
        <EmptyState title="Nenhum responsável cadastrado" description="Cadastre o primeiro responsável da academia." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {responsaveis.map((responsavel) => {
            const alunosVinculados = alunos.filter((aluno) => responsavel.alunoIds.includes(aluno.id));

            return (
              <article key={responsavel.id} className="rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent/30">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <h3 className="truncate text-sm font-semibold text-foreground">{responsavel.nome}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      <span className="truncate">{responsavel.telefone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="truncate">{responsavel.email || 'Email não informado'}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="shrink-0 text-[10px]">
                    {alunosVinculados.length} aluno(s)
                  </Badge>
                </div>

                <div className="mt-4 rounded-lg border border-border bg-muted/30 p-3">
                  <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    Alunos vinculados
                  </p>

                  {alunosVinculados.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {alunosVinculados.map((aluno) => (
                        <span key={aluno.id} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                          {aluno.nome}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Nenhum aluno vinculado no momento.</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border-border bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Novo responsável</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Nome completo *</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-base text-foreground md:text-sm"
                placeholder="Ex.: Fernanda Alves"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Telefone *</label>
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-base text-foreground md:text-sm"
                placeholder="(00) 00000-0000"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-base text-foreground md:text-sm"
                placeholder="responsavel@email.com"
              />
            </div>
          </div>

          <DialogFooter className="mt-4 flex-col gap-2 sm:flex-row">
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvar}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
