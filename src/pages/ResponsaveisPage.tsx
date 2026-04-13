import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { responsaveis as responsaveisMock, alunos } from '@/mocks/data';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function ResponsaveisPage() {
  const [responsaveis, setResponsaveis] = useState(responsaveisMock);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  const handleSalvar = () => {
    if (!nome.trim() || !telefone.trim()) {
      toast.error('Preencha os campos obrigatórios (Nome e Telefone)');
      return;
    }
    
    setResponsaveis(prev => [
      {
        id: `r${Date.now()}`,
        nome,
        telefone,
        email,
        cpf: '000.000.000-00', // mocked
        alunoIds: [], // mocked
      },
      ...prev
    ]);
    toast.success('Responsável cadastrado com sucesso!');
    setDialogOpen(false);
    setNome('');
    setEmail('');
    setTelefone('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Responsáveis"
        subtitle={`${responsaveis.length} responsáveis cadastrados`}
        actions={<Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4 mr-1" />Novo</Button>}
      />

      {responsaveis.length === 0 ? (
        <EmptyState title="Nenhum responsável cadastrado" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {responsaveis.map(r => {
            const alunosVinculados = alunos.filter(a => r.alunoIds.includes(a.id));
            return (
              <div key={r.id} className="bg-card border border-border rounded-lg p-4 sm:p-5 hover:bg-accent/30 transition-colors">
                <h3 className="text-sm font-semibold text-foreground">{r.nome}</h3>
                <p className="text-xs text-muted-foreground mt-1">{r.email}</p>
                <p className="text-xs text-muted-foreground">{r.telefone}</p>
                <div className="mt-3 border-t border-border pt-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Alunos Vinculados</p>
                  <div className="flex flex-wrap gap-2">
                    {alunosVinculados.map(a => (
                      <span key={a.id} className="text-xs bg-secondary px-2 py-1 rounded text-secondary-foreground">{a.nome}</span>
                    ))}
                    {alunosVinculados.length === 0 && (
                      <span className="text-xs text-muted-foreground">Nenhum</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form novo responsável */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Novo Responsável</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Nome Completo *</label>
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-base md:text-sm text-foreground"
                placeholder="Ex Silva"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Telefone *</label>
              <input
                type="tel"
                value={telefone}
                onChange={e => setTelefone(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-base md:text-sm text-foreground"
                placeholder="(00) 00000-0000"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-base md:text-sm text-foreground"
                placeholder="exemplo@email.com"
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSalvar}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
