import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { alunos } from '@/mocks/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { Aluno, AlunoStatus } from '@/types';

const statusFilter: { label: string; value: AlunoStatus | 'todos' }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Ativo', value: 'ativo' },
  { label: 'Inadimplente', value: 'inadimplente' },
  { label: 'Trancado', value: 'trancado' },
  { label: 'Inativo', value: 'inativo' },
  { label: 'Pré-cadastro', value: 'pre-cadastro' },
];

export default function AlunosPage() {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<AlunoStatus | 'todos'>('todos');
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 6;

  const filtered = alunos.filter(a => {
    const matchBusca = a.nome.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === 'todos' || a.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alunos"
        subtitle={`${alunos.length} alunos cadastrados`}
        actions={<Button size="sm"><Plus className="h-4 w-4 mr-1" />Novo Aluno</Button>}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Buscar aluno..." value={busca} onChange={e => { setBusca(e.target.value); setPage(1); }} className="pl-9 h-9 text-xs bg-secondary/50" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {statusFilter.map(sf => (
            <Button
              key={sf.value}
              variant={filtroStatus === sf.value ? 'default' : 'secondary'}
              size="sm"
              className="text-xs h-8"
              onClick={() => { setFiltroStatus(sf.value); setPage(1); }}
            >
              {sf.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase tracking-wider">Nome</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Categoria</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Faixa</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Matrícula</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(aluno => (
                <tr
                  key={aluno.id}
                  className="border-b border-border/50 hover:bg-accent/30 cursor-pointer transition-colors"
                  onClick={() => setSelectedAluno(aluno)}
                >
                  <td className="py-3 px-4">
                    <div>
                      <span className="font-medium text-foreground">{aluno.nome}</span>
                      <p className="text-muted-foreground mt-0.5">{aluno.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-foreground hidden md:table-cell">{aluno.categoria}</td>
                  <td className="py-3 px-4 text-foreground hidden sm:table-cell">{aluno.faixaAtual}</td>
                  <td className="py-3 px-4"><StatusBadge status={aluno.status} /></td>
                  <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">{aluno.dataMatricula}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <span className="text-xs text-muted-foreground">{filtered.length} resultado(s)</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs text-muted-foreground px-2">{page}/{totalPages || 1}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Drawer */}
      <Sheet open={!!selectedAluno} onOpenChange={() => setSelectedAluno(null)}>
        <SheetContent className="w-full sm:max-w-lg bg-card border-l border-border overflow-y-auto">
          {selectedAluno && (
            <>
              <SheetHeader>
                <SheetTitle className="text-foreground">{selectedAluno.nome}</SheetTitle>
              </SheetHeader>
              <Tabs defaultValue="perfil" className="mt-6">
                <TabsList className="bg-muted/50 w-full grid grid-cols-3">
                  <TabsTrigger value="perfil" className="text-xs">Perfil</TabsTrigger>
                  <TabsTrigger value="financeiro" className="text-xs">Financeiro</TabsTrigger>
                  <TabsTrigger value="graduacao" className="text-xs">Graduação</TabsTrigger>
                </TabsList>
                <TabsContent value="perfil" className="mt-4 space-y-3">
                  <InfoRow label="Email" value={selectedAluno.email} />
                  <InfoRow label="Telefone" value={selectedAluno.telefone} />
                  <InfoRow label="CPF" value={selectedAluno.cpf} />
                  <InfoRow label="Nascimento" value={selectedAluno.dataNascimento} />
                  <InfoRow label="Categoria" value={selectedAluno.categoria} />
                  <InfoRow label="Faixa" value={selectedAluno.faixaAtual} />
                  <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground w-24">Status</span><StatusBadge status={selectedAluno.status} /></div>
                </TabsContent>
                <TabsContent value="financeiro" className="mt-4">
                  <p className="text-xs text-muted-foreground">Cobranças do aluno serão exibidas aqui.</p>
                </TabsContent>
                <TabsContent value="graduacao" className="mt-4">
                  <p className="text-xs text-muted-foreground">Progresso de graduação será exibido aqui.</p>
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground w-24 shrink-0">{label}</span>
      <span className="text-xs text-foreground">{value}</span>
    </div>
  );
}
