import type { Aluno, Responsavel, Turma, Cobranca, Produto, Venda, Campeonato, RankingEntry, RegraGraduacao, GraduacaoAluno, HistoricoGraduacao, Reserva, ContratoAluguel, Despesa, Receita, Alerta, AtividadeRecente, SessaoAula } from '@/types';

// === Alunos ===
export const alunos: Aluno[] = [
  { id: 'a1', nome: 'Lucas Mendes', email: 'lucas@email.com', telefone: '(11) 98765-4321', dataNascimento: '2005-03-15', cpf: '123.456.789-00', status: 'ativo', turmaIds: ['t1'], faixaAtual: 'Azul', categoria: 'Juvenil', dataMatricula: '2023-02-10', responsavelId: 'r1' },
  { id: 'a2', nome: 'Marina Silva', email: 'marina@email.com', telefone: '(11) 91234-5678', dataNascimento: '1998-07-22', cpf: '987.654.321-00', status: 'ativo', turmaIds: ['t1', 't2'], faixaAtual: 'Roxa', categoria: 'Adulto', dataMatricula: '2022-05-01' },
  { id: 'a3', nome: 'Pedro Alves', email: 'pedro@email.com', telefone: '(11) 99876-5432', dataNascimento: '2008-11-03', cpf: '456.789.123-00', status: 'inadimplente', turmaIds: ['t1'], faixaAtual: 'Branca', categoria: 'Infantil', dataMatricula: '2024-01-15', responsavelId: 'r2' },
  { id: 'a4', nome: 'Ana Costa', email: 'ana@email.com', telefone: '(11) 98888-7777', dataNascimento: '1995-01-30', cpf: '321.654.987-00', status: 'ativo', turmaIds: ['t2'], faixaAtual: 'Marrom', categoria: 'Adulto', dataMatricula: '2020-08-20' },
  { id: 'a5', nome: 'Rafael Souza', email: 'rafael@email.com', telefone: '(11) 97777-6666', dataNascimento: '2001-06-18', cpf: '654.321.987-00', status: 'trancado', turmaIds: ['t1'], faixaAtual: 'Verde', categoria: 'Adulto', dataMatricula: '2021-03-05' },
  { id: 'a6', nome: 'Julia Ferreira', email: 'julia@email.com', telefone: '(11) 96666-5555', dataNascimento: '2010-09-12', cpf: '789.123.456-00', status: 'ativo', turmaIds: ['t3'], faixaAtual: 'Amarela', categoria: 'Infantil', dataMatricula: '2023-07-01', responsavelId: 'r1' },
  { id: 'a7', nome: 'Thiago Ribeiro', email: 'thiago@email.com', telefone: '(11) 95555-4444', dataNascimento: '1993-12-25', cpf: '147.258.369-00', status: 'ativo', turmaIds: ['t2'], faixaAtual: 'Preta', categoria: 'Adulto', dataMatricula: '2018-01-10' },
  { id: 'a8', nome: 'Camila Oliveira', email: 'camila@email.com', telefone: '(11) 94444-3333', dataNascimento: '2003-04-08', cpf: '258.369.147-00', status: 'pre-cadastro', turmaIds: [], faixaAtual: 'Branca', categoria: 'Juvenil', dataMatricula: '2025-04-01' },
  { id: 'a9', nome: 'Bruno Santos', email: 'bruno@email.com', telefone: '(11) 93333-2222', dataNascimento: '1990-08-14', cpf: '369.147.258-00', status: 'inativo', turmaIds: ['t1'], faixaAtual: 'Azul', categoria: 'Adulto', dataMatricula: '2019-11-20' },
  { id: 'a10', nome: 'Isabela Lima', email: 'isabela@email.com', telefone: '(11) 92222-1111', dataNascimento: '2006-02-28', cpf: '741.852.963-00', status: 'ativo', turmaIds: ['t3'], faixaAtual: 'Laranja', categoria: 'Juvenil', dataMatricula: '2024-03-10', responsavelId: 'r2' },
];

// === Responsáveis ===
export const responsaveis: Responsavel[] = [
  { id: 'r1', nome: 'Carlos Mendes', email: 'carlos@email.com', telefone: '(11) 98765-0000', cpf: '111.222.333-00', alunoIds: ['a1', 'a6'] },
  { id: 'r2', nome: 'Fernanda Alves', email: 'fernanda@email.com', telefone: '(11) 97654-0000', cpf: '444.555.666-00', alunoIds: ['a3', 'a10'] },
];

// === Turmas ===
export const turmas: Turma[] = [
  { id: 't1', nome: 'Jiu-Jitsu Iniciante', modalidade: 'Jiu-Jitsu', professor: 'Sensei Takahashi', horario: '08:00 - 09:30', diasSemana: ['Seg', 'Qua', 'Sex'], capacidade: 20, alunoIds: ['a1', 'a2', 'a3', 'a5', 'a9'] },
  { id: 't2', nome: 'Jiu-Jitsu Avançado', modalidade: 'Jiu-Jitsu', professor: 'Sensei Takahashi', horario: '10:00 - 11:30', diasSemana: ['Seg', 'Qua', 'Sex'], capacidade: 15, alunoIds: ['a2', 'a4', 'a7'] },
  { id: 't3', nome: 'Karatê Kids', modalidade: 'Karatê', professor: 'Prof. Ricardo', horario: '14:00 - 15:00', diasSemana: ['Ter', 'Qui'], capacidade: 25, alunoIds: ['a6', 'a10'] },
];

// === Cobranças ===
export const cobrancas: Cobranca[] = [
  { id: 'c1', alunoId: 'a1', nomeAluno: 'Lucas Mendes', tipo: 'mensalidade', descricao: 'Mensalidade Abril/2025', valor: 250, valorPago: 250, dataVencimento: '2025-04-10', dataPagamento: '2025-04-08', status: 'paga' },
  { id: 'c2', alunoId: 'a2', nomeAluno: 'Marina Silva', tipo: 'mensalidade', descricao: 'Mensalidade Abril/2025', valor: 300, valorPago: 300, dataVencimento: '2025-04-10', dataPagamento: '2025-04-10', status: 'paga' },
  { id: 'c3', alunoId: 'a3', nomeAluno: 'Pedro Alves', tipo: 'mensalidade', descricao: 'Mensalidade Março/2025', valor: 200, valorPago: 0, dataVencimento: '2025-03-10', status: 'vencida' },
  { id: 'c4', alunoId: 'a3', nomeAluno: 'Pedro Alves', tipo: 'mensalidade', descricao: 'Mensalidade Abril/2025', valor: 200, valorPago: 100, dataVencimento: '2025-04-10', status: 'parcial' },
  { id: 'c5', alunoId: 'a4', nomeAluno: 'Ana Costa', tipo: 'mensalidade', descricao: 'Mensalidade Abril/2025', valor: 300, valorPago: 0, dataVencimento: '2025-04-15', status: 'aberta' },
  { id: 'c6', alunoId: 'a5', nomeAluno: 'Rafael Souza', tipo: 'mensalidade', descricao: 'Mensalidade Abril/2025', valor: 250, valorPago: 0, dataVencimento: '2025-04-10', status: 'cancelada' },
  { id: 'c7', alunoId: 'a6', nomeAluno: 'Julia Ferreira', tipo: 'inscricao', descricao: 'Taxa de Inscrição', valor: 150, valorPago: 150, dataVencimento: '2023-07-01', dataPagamento: '2023-07-01', status: 'paga' },
  { id: 'c8', alunoId: 'a7', nomeAluno: 'Thiago Ribeiro', tipo: 'graduacao', descricao: 'Taxa Exame de Faixa Preta', valor: 500, valorPago: 500, dataVencimento: '2024-12-01', dataPagamento: '2024-11-28', status: 'paga' },
];

// === Produtos ===
export const produtos: Produto[] = [
  { id: 'p1', nome: 'Kimono Branco', descricao: 'Kimono de treino padrão', preco: 189.90, estoque: 15, estoqueMinimo: 5, categoria: 'Vestimenta' },
  { id: 'p2', nome: 'Faixa Azul', descricao: 'Faixa oficial azul', preco: 45.00, estoque: 8, estoqueMinimo: 3, categoria: 'Faixas' },
  { id: 'p3', nome: 'Protetor Bucal', descricao: 'Protetor bucal profissional', preco: 35.00, estoque: 25, estoqueMinimo: 10, categoria: 'Proteção' },
  { id: 'p4', nome: 'Luva de Treino', descricao: 'Luva MMA 14oz', preco: 129.90, estoque: 3, estoqueMinimo: 5, categoria: 'Proteção' },
  { id: 'p5', nome: 'Camiseta Academia', descricao: 'Camiseta oficial da academia', preco: 59.90, estoque: 30, estoqueMinimo: 10, categoria: 'Vestimenta' },
  { id: 'p6', nome: 'Caneleira', descricao: 'Caneleira de proteção', preco: 89.90, estoque: 0, estoqueMinimo: 5, categoria: 'Proteção' },
];

// === Vendas ===
export const vendas: Venda[] = [
  { id: 'v1', data: '2025-04-09', itens: [{ produtoId: 'p1', nomeProduto: 'Kimono Branco', quantidade: 1, precoUnitario: 189.90 }], total: 189.90, compradorNome: 'Lucas Mendes', formaPagamento: 'PIX' },
  { id: 'v2', data: '2025-04-08', itens: [{ produtoId: 'p3', nomeProduto: 'Protetor Bucal', quantidade: 2, precoUnitario: 35.00 }, { produtoId: 'p5', nomeProduto: 'Camiseta Academia', quantidade: 1, precoUnitario: 59.90 }], total: 129.90, compradorNome: 'Ana Costa', formaPagamento: 'Cartão' },
  { id: 'v3', data: '2025-04-05', itens: [{ produtoId: 'p4', nomeProduto: 'Luva de Treino', quantidade: 1, precoUnitario: 129.90 }], total: 129.90, compradorNome: 'Thiago Ribeiro', formaPagamento: 'Dinheiro' },
];

// === Campeonatos ===
export const campeonatos: Campeonato[] = [
  { id: 'camp1', nome: 'Copa Regional de Jiu-Jitsu 2025', data: '2025-05-20', local: 'Ginásio Municipal', modalidade: 'Jiu-Jitsu', status: 'inscricoes-abertas', participantes: [
    { alunoId: 'a2', nomeAluno: 'Marina Silva', categoria: 'Adulto', colocacao: undefined, medalha: undefined },
    { alunoId: 'a4', nomeAluno: 'Ana Costa', categoria: 'Adulto', colocacao: undefined, medalha: undefined },
    { alunoId: 'a7', nomeAluno: 'Thiago Ribeiro', categoria: 'Adulto', colocacao: undefined, medalha: undefined },
  ]},
  { id: 'camp2', nome: 'Torneio Estadual Juvenil 2024', data: '2024-11-10', local: 'Centro Esportivo SP', modalidade: 'Jiu-Jitsu', status: 'finalizado', participantes: [
    { alunoId: 'a1', nomeAluno: 'Lucas Mendes', categoria: 'Juvenil', colocacao: 1, medalha: 'ouro', pontuacao: 100 },
    { alunoId: 'a10', nomeAluno: 'Isabela Lima', categoria: 'Juvenil', colocacao: 3, medalha: 'bronze', pontuacao: 60 },
  ]},
  { id: 'camp3', nome: 'Open de Karatê SP 2024', data: '2024-09-15', local: 'Arena Karatê', modalidade: 'Karatê', status: 'finalizado', participantes: [
    { alunoId: 'a6', nomeAluno: 'Julia Ferreira', categoria: 'Infantil', colocacao: 2, medalha: 'prata', pontuacao: 80 },
  ]},
];

// === Ranking ===
export const ranking: RankingEntry[] = [
  { alunoId: 'a7', nomeAluno: 'Thiago Ribeiro', categoria: 'Adulto', posicao: 1, posicaoAnterior: 1, pontuacao: 950, vitorias: 12, medalhas: 5, temporada: '2025' },
  { alunoId: 'a4', nomeAluno: 'Ana Costa', categoria: 'Adulto', posicao: 2, posicaoAnterior: 3, pontuacao: 820, vitorias: 10, medalhas: 3, temporada: '2025' },
  { alunoId: 'a2', nomeAluno: 'Marina Silva', categoria: 'Adulto', posicao: 3, posicaoAnterior: 2, pontuacao: 780, vitorias: 8, medalhas: 4, temporada: '2025' },
  { alunoId: 'a1', nomeAluno: 'Lucas Mendes', categoria: 'Juvenil', posicao: 1, posicaoAnterior: 2, pontuacao: 620, vitorias: 6, medalhas: 2, temporada: '2025' },
  { alunoId: 'a10', nomeAluno: 'Isabela Lima', categoria: 'Juvenil', posicao: 2, posicaoAnterior: 1, pontuacao: 580, vitorias: 5, medalhas: 2, temporada: '2025' },
  { alunoId: 'a6', nomeAluno: 'Julia Ferreira', categoria: 'Infantil', posicao: 1, posicaoAnterior: 1, pontuacao: 400, vitorias: 4, medalhas: 1, temporada: '2025' },
];

// === Graduação ===
export const regrasGraduacao: RegraGraduacao[] = [
  { id: 'rg1', faixaOrigem: 'Branca', faixaDestino: 'Amarela', categoria: 'Infantil', aulasMinimas: 30, mesesMinimos: 3 },
  { id: 'rg2', faixaOrigem: 'Amarela', faixaDestino: 'Laranja', categoria: 'Infantil', aulasMinimas: 40, mesesMinimos: 4 },
  { id: 'rg3', faixaOrigem: 'Branca', faixaDestino: 'Azul', categoria: 'Adulto', aulasMinimas: 60, mesesMinimos: 6 },
  { id: 'rg4', faixaOrigem: 'Azul', faixaDestino: 'Roxa', categoria: 'Adulto', aulasMinimas: 100, mesesMinimos: 12 },
  { id: 'rg5', faixaOrigem: 'Roxa', faixaDestino: 'Marrom', categoria: 'Adulto', aulasMinimas: 150, mesesMinimos: 18 },
  { id: 'rg6', faixaOrigem: 'Marrom', faixaDestino: 'Preta', categoria: 'Adulto', aulasMinimas: 200, mesesMinimos: 24 },
];

export const graduacoesAlunos: GraduacaoAluno[] = [
  { alunoId: 'a1', faixaAtual: 'Azul', proximaFaixa: 'Roxa', aulasRealizadas: 72, aulasNecessarias: 100, status: 'nao-elegivel' },
  { alunoId: 'a2', faixaAtual: 'Roxa', proximaFaixa: 'Marrom', aulasRealizadas: 155, aulasNecessarias: 150, status: 'elegivel' },
  { alunoId: 'a3', faixaAtual: 'Branca', proximaFaixa: 'Azul', aulasRealizadas: 15, aulasNecessarias: 60, status: 'nao-elegivel' },
  { alunoId: 'a4', faixaAtual: 'Marrom', proximaFaixa: 'Preta', aulasRealizadas: 210, aulasNecessarias: 200, status: 'aprovado' },
  { alunoId: 'a6', faixaAtual: 'Amarela', proximaFaixa: 'Laranja', aulasRealizadas: 42, aulasNecessarias: 40, status: 'elegivel' },
  { alunoId: 'a7', faixaAtual: 'Preta', proximaFaixa: '-', aulasRealizadas: 500, aulasNecessarias: 0, status: 'graduado' },
  { alunoId: 'a10', faixaAtual: 'Laranja', proximaFaixa: 'Verde', aulasRealizadas: 30, aulasNecessarias: 50, status: 'nao-elegivel' },
];

export const historicoGraduacoes: HistoricoGraduacao[] = [
  { id: 'hg1', alunoId: 'a7', faixaDe: 'Marrom', faixaPara: 'Preta', data: '2024-12-15', aprovadoPor: 'Sensei Takahashi' },
  { id: 'hg2', alunoId: 'a2', faixaDe: 'Azul', faixaPara: 'Roxa', data: '2024-06-20', aprovadoPor: 'Sensei Takahashi' },
  { id: 'hg3', alunoId: 'a4', faixaDe: 'Roxa', faixaPara: 'Marrom', data: '2023-09-10', aprovadoPor: 'Sensei Takahashi' },
  { id: 'hg4', alunoId: 'a1', faixaDe: 'Branca', faixaPara: 'Azul', data: '2024-02-15', aprovadoPor: 'Sensei Takahashi' },
];

// === Reservas ===
export const reservas: Reserva[] = [
  { id: 'res1', espaco: 'Tatame Principal', locatario: 'Equipe Alpha BJJ', dataInicio: '2025-04-14', dataFim: '2025-04-14', horaInicio: '18:00', horaFim: '20:00', valor: 200, status: 'confirmada' },
  { id: 'res2', espaco: 'Tatame Principal', locatario: 'Seminário Aikido', dataInicio: '2025-04-14', dataFim: '2025-04-14', horaInicio: '19:00', horaFim: '21:00', valor: 300, status: 'pendente', conflito: true },
  { id: 'res3', espaco: 'Sala Multiuso', locatario: 'Yoga Zen', dataInicio: '2025-04-15', dataFim: '2025-04-15', horaInicio: '07:00', horaFim: '08:30', valor: 100, status: 'confirmada' },
  { id: 'res4', espaco: 'Tatame Principal', locatario: 'Evento Corporativo', dataInicio: '2025-04-20', dataFim: '2025-04-20', horaInicio: '09:00', horaFim: '17:00', valor: 800, status: 'pendente' },
];

export const contratosAluguel: ContratoAluguel[] = [
  { id: 'ct1', locatario: 'Equipe Alpha BJJ', espaco: 'Tatame Principal', valor: 800, periodicidade: 'mensal', dataInicio: '2025-01-01', dataFim: '2025-12-31', status: 'ativo' },
  { id: 'ct2', locatario: 'Yoga Zen', espaco: 'Sala Multiuso', valor: 400, periodicidade: 'mensal', dataInicio: '2025-03-01', dataFim: '2025-08-31', status: 'ativo' },
];

// === Financeiro Gerencial ===
export const despesas: Despesa[] = [
  { id: 'd1', descricao: 'Aluguel do imóvel', categoria: 'Infraestrutura', valor: 5000, data: '2025-04-05', status: 'paga' },
  { id: 'd2', descricao: 'Energia elétrica', categoria: 'Infraestrutura', valor: 850, data: '2025-04-10', status: 'paga' },
  { id: 'd3', descricao: 'Salário - Sensei Takahashi', categoria: 'Pessoal', valor: 6000, data: '2025-04-05', status: 'paga' },
  { id: 'd4', descricao: 'Salário - Prof. Ricardo', categoria: 'Pessoal', valor: 4000, data: '2025-04-05', status: 'paga' },
  { id: 'd5', descricao: 'Material de limpeza', categoria: 'Manutenção', valor: 320, data: '2025-04-08', status: 'paga' },
  { id: 'd6', descricao: 'Manutenção tatame', categoria: 'Manutenção', valor: 1200, data: '2025-04-20', status: 'pendente' },
  { id: 'd7', descricao: 'Marketing digital', categoria: 'Marketing', valor: 800, data: '2025-04-01', status: 'paga' },
];

export const receitas: Receita[] = [
  { id: 'rec1', descricao: 'Mensalidades Abril', categoria: 'Mensalidades', valor: 12500, data: '2025-04-10', origem: 'Alunos' },
  { id: 'rec2', descricao: 'Vendas de produtos Abril', categoria: 'Vendas', valor: 449.70, data: '2025-04-09', origem: 'Loja' },
  { id: 'rec3', descricao: 'Aluguéis Abril', categoria: 'Aluguéis', valor: 1200, data: '2025-04-01', origem: 'Locatários' },
  { id: 'rec4', descricao: 'Taxas de graduação', categoria: 'Graduação', valor: 500, data: '2025-04-15', origem: 'Alunos' },
  { id: 'rec5', descricao: 'Inscrições campeonato', categoria: 'Campeonatos', valor: 750, data: '2025-04-12', origem: 'Alunos' },
];

// === Alertas ===
export const alertas: Alerta[] = [
  { id: 'al1', tipo: 'urgente', mensagem: 'Pedro Alves com mensalidade vencida há 30 dias', data: '2025-04-10' },
  { id: 'al2', tipo: 'aviso', mensagem: 'Estoque baixo: Luva de Treino (3 unid.)', data: '2025-04-09' },
  { id: 'al3', tipo: 'aviso', mensagem: 'Estoque zerado: Caneleira', data: '2025-04-09' },
  { id: 'al4', tipo: 'info', mensagem: 'Ana Costa aprovada para graduação Faixa Preta', data: '2025-04-08' },
  { id: 'al5', tipo: 'urgente', mensagem: 'Conflito de reserva: Tatame Principal em 14/04', data: '2025-04-07' },
  { id: 'al6', tipo: 'info', mensagem: 'Copa Regional de Jiu-Jitsu com inscrições abertas', data: '2025-04-05' },
];

// === Atividades Recentes ===
export const atividadesRecentes: AtividadeRecente[] = [
  { id: 'at1', descricao: 'Venda de Kimono Branco para Lucas Mendes', data: '2025-04-09', tipo: 'venda' },
  { id: 'at2', descricao: 'Pagamento recebido de Marina Silva', data: '2025-04-10', tipo: 'pagamento' },
  { id: 'at3', descricao: 'Camila Oliveira realizou pré-cadastro', data: '2025-04-01', tipo: 'cadastro' },
  { id: 'at4', descricao: 'Frequência lançada - Jiu-Jitsu Iniciante', data: '2025-04-09', tipo: 'frequencia' },
  { id: 'at5', descricao: 'Ana Costa aprovada para exame de faixa', data: '2025-04-08', tipo: 'graduacao' },
];

// === Sessões de Aula (Frequência) ===
export const sessoesAula: SessaoAula[] = [
  { id: 's1', turmaId: 't1', data: '2025-04-07', professor: 'Sensei Takahashi', presencas: [
    { alunoId: 'a1', presente: true }, { alunoId: 'a2', presente: true }, { alunoId: 'a3', presente: false }, { alunoId: 'a5', presente: false },
  ]},
  { id: 's2', turmaId: 't1', data: '2025-04-09', professor: 'Sensei Takahashi', presencas: [
    { alunoId: 'a1', presente: true }, { alunoId: 'a2', presente: false }, { alunoId: 'a3', presente: true }, { alunoId: 'a5', presente: false },
  ]},
  { id: 's3', turmaId: 't2', data: '2025-04-07', professor: 'Sensei Takahashi', presencas: [
    { alunoId: 'a2', presente: true }, { alunoId: 'a4', presente: true }, { alunoId: 'a7', presente: true },
  ]},
  { id: 's4', turmaId: 't3', data: '2025-04-08', professor: 'Prof. Ricardo', presencas: [
    { alunoId: 'a6', presente: true }, { alunoId: 'a10', presente: true },
  ]},
];

// Chart data helpers
export const frequenciaMensal = [
  { mes: 'Jan', presenca: 82 },
  { mes: 'Fev', presenca: 78 },
  { mes: 'Mar', presenca: 85 },
  { mes: 'Abr', presenca: 88 },
];

export const receitaDespesaMensal = [
  { mes: 'Jan', receita: 14200, despesa: 16500 },
  { mes: 'Fev', receita: 13800, despesa: 15800 },
  { mes: 'Mar', receita: 15500, despesa: 16200 },
  { mes: 'Abr', receita: 15400, despesa: 18170 },
];

// === Heatmap de Frequência (semanas x dias) ===
export const frequenciaHeatmap = [
  { dia: 'Seg', horario: '08:00', presenca: 90 },
  { dia: 'Ter', horario: '08:00', presenca: 75 },
  { dia: 'Qua', horario: '08:00', presenca: 88 },
  { dia: 'Qui', horario: '08:00', presenca: 70 },
  { dia: 'Sex', horario: '08:00', presenca: 85 },
  { dia: 'Seg', horario: '18:00', presenca: 62 },
  { dia: 'Ter', horario: '18:00', presenca: 80 },
  { dia: 'Qua', horario: '18:00', presenca: 83 },
  { dia: 'Qui', horario: '18:00', presenca: 79 },
  { dia: 'Sex', horario: '18:00', presenca: 77 },
];

// === Evolução do Ranking por mês ===
export const rankingEvolucao = [
  { mes: 'Jan', 'Thiago Ribeiro': 1, 'Ana Costa': 3, 'Marina Silva': 2, 'Lucas Mendes': 2, 'Isabela Lima': 1 },
  { mes: 'Fev', 'Thiago Ribeiro': 1, 'Ana Costa': 2, 'Marina Silva': 3, 'Lucas Mendes': 1, 'Isabela Lima': 2 },
  { mes: 'Mar', 'Thiago Ribeiro': 1, 'Ana Costa': 2, 'Marina Silva': 3, 'Lucas Mendes': 1, 'Isabela Lima': 2 },
  { mes: 'Abr', 'Thiago Ribeiro': 1, 'Ana Costa': 2, 'Marina Silva': 3, 'Lucas Mendes': 1, 'Isabela Lima': 2 },
];

// === Vendas por Categoria ===
export const vendasPorCategoria = [
  { categoria: 'Vestimenta', valor: 2450 },
  { categoria: 'Faixas', valor: 890 },
  { categoria: 'Proteção', valor: 1670 },
  { categoria: 'Acessórios', valor: 520 },
  { categoria: 'Suplementos', valor: 340 },
];
