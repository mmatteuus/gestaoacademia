/**
 * Testes end-to-end dos serviços de domínio (executeSale, createRentalReservation).
 * Roda contra a planilha real, igual aos testes de integração.
 * Limpa o que cria via prefixo it_e2e_*.
 */
import { executeSale, createRentalReservation } from '../backend/src/services/domain.service.js';
import { insertRow, listRows, updateRow } from '../backend/src/repositories/sheets.repository.js';

const PFX = 'it_e2e_';
const id = (kind) => `${PFX}${kind}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
let pass = 0, fail = 0;

function assert(cond, label) {
  if (cond) { console.log(`  ✓ ${label}`); pass++; }
  else { console.log(`  ✗ ${label}`); fail++; }
}

async function testVendaSimples() {
  console.log('\n[Venda] simples — debita estoque, registra venda');
  const prodId = id('prod');
  await insertRow({
    sheet_type: 'Produtos', id: prodId, nome: 'E2E Prod', descricao: 'e2e',
    preco: 50, estoque: 5, estoque_minimo: 1, categoria: 'teste',
  });

  const result = await executeSale({
    id: id('venda'),
    compradorNome: 'Cliente E2E',
    itens: [{ produtoId: prodId, quantidade: 2 }],
    formaPagamento: 'PIX',
    descontoTipo: 'valor',
    descontoValor: 0,
  });

  assert(result.ok === true, 'venda retorna ok');
  assert(result.data?.total === 100, `total=100 (recebido ${result.data?.total})`);

  // Confirma estoque debitado
  const prods = await listRows('Produtos');
  const after = prods.find((p) => p.id === prodId);
  assert(Number(after?.estoque) === 3, `estoque=3 após venda (recebido ${after?.estoque})`);
}

async function testVendaEstoqueInsuficiente() {
  console.log('\n[Venda] estoque insuficiente — rejeita');
  const prodId = id('prod');
  await insertRow({
    sheet_type: 'Produtos', id: prodId, nome: 'E2E Low', descricao: 'e2e',
    preco: 10, estoque: 1, estoque_minimo: 0, categoria: 'teste',
  });

  const result = await executeSale({
    id: id('venda'),
    compradorNome: 'X', itens: [{ produtoId: prodId, quantidade: 5 }],
    formaPagamento: 'PIX', descontoTipo: 'valor', descontoValor: 0,
  });

  assert(result.ok === false, 'venda rejeitada');
  assert(result.status === 409, `status=409 (recebido ${result.status})`);
  assert(result.details?.[0]?.status === 'insufficient_stock', 'motivo: insufficient_stock');

  // Estoque NÃO debitado
  const prods = await listRows('Produtos');
  const after = prods.find((p) => p.id === prodId);
  assert(Number(after?.estoque) === 1, `estoque preservado=1 (recebido ${after?.estoque})`);
}

async function testVendaIdempotente() {
  console.log('\n[Venda] idempotência — mesmo ID não debita 2x');
  const prodId = id('prod');
  await insertRow({
    sheet_type: 'Produtos', id: prodId, nome: 'E2E Idem', descricao: 'e2e',
    preco: 20, estoque: 10, estoque_minimo: 0, categoria: 'teste',
  });
  const vendaId = id('venda');

  await executeSale({
    id: vendaId, compradorNome: 'A',
    itens: [{ produtoId: prodId, quantidade: 1 }],
    formaPagamento: 'PIX', descontoTipo: 'valor', descontoValor: 0,
  });
  const second = await executeSale({
    id: vendaId, compradorNome: 'A',
    itens: [{ produtoId: prodId, quantidade: 1 }],
    formaPagamento: 'PIX', descontoTipo: 'valor', descontoValor: 0,
  });

  assert(second.warnings?.includes('Sale already processed with the same id'), 'segunda venda detectada como duplicada');

  const prods = await listRows('Produtos');
  const after = prods.find((p) => p.id === prodId);
  assert(Number(after?.estoque) === 9, `estoque=9 (não debitou 2x; recebido ${after?.estoque})`);
}

async function testReservaSemConflito() {
  console.log('\n[Reserva] sem conflito');
  const espaco = `E2E-${Date.now()}`;
  const result = await createRentalReservation({
    id: id('res'),
    espaco,
    locatario: 'E2E',
    dataInicio: '2030-01-01',
    dataFim: '2030-01-01',
    horaInicio: '10:00',
    horaFim: '12:00',
    valor: 100,
  });
  assert(result.ok === true, 'reserva criada');
  assert(result.data?.conflito === false, 'sem conflito');
}

async function testReservaConflitoInterseccao() {
  console.log('\n[Reserva] conflito por interseção real (multi-dia)');
  const espaco = `E2E-${Date.now()}`;
  // 1ª: 2030-02-01 → 2030-02-05, 10:00-12:00
  await createRentalReservation({
    id: id('res'),
    espaco, locatario: 'A',
    dataInicio: '2030-02-01', dataFim: '2030-02-05',
    horaInicio: '10:00', horaFim: '12:00', valor: 100,
  });
  // 2ª: 2030-02-03 → 2030-02-04, 11:00-13:00 (sobrepõe datas E horas)
  const second = await createRentalReservation({
    id: id('res'),
    espaco, locatario: 'B',
    dataInicio: '2030-02-03', dataFim: '2030-02-04',
    horaInicio: '11:00', horaFim: '13:00', valor: 100,
  });
  assert(second.ok === true, 'reserva criada (com flag de conflito)');
  assert(second.data?.conflito === true, 'CONFLITO detectado pela interseção real (regressão da auditoria)');
}

async function testReservaSemConflitoHora() {
  console.log('\n[Reserva] datas sobrepõem mas horas não → SEM conflito');
  const espaco = `E2E-${Date.now()}`;
  await createRentalReservation({
    id: id('res'),
    espaco, locatario: 'A',
    dataInicio: '2030-03-01', dataFim: '2030-03-05',
    horaInicio: '08:00', horaFim: '10:00', valor: 100,
  });
  const second = await createRentalReservation({
    id: id('res'),
    espaco, locatario: 'B',
    dataInicio: '2030-03-03', dataFim: '2030-03-03',
    horaInicio: '14:00', horaFim: '16:00', valor: 100,
  });
  assert(second.data?.conflito === false, 'sem conflito (horas distintas)');
}

(async () => {
  console.log('=== E2E domínio (planilha real) ===');
  try {
    await testVendaSimples();
    await testVendaEstoqueInsuficiente();
    await testVendaIdempotente();
    await testReservaSemConflito();
    await testReservaConflitoInterseccao();
    await testReservaSemConflitoHora();
  } catch (err) {
    console.error('\nFATAL:', err);
    fail++;
  }
  console.log(`\n=== Total: ${pass} passou, ${fail} falhou ===`);
  process.exit(fail === 0 ? 0 : 1);
})();
