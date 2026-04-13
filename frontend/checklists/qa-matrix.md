# QA Matrix

## Testes por Funcionalidade

| Funcionalidade | Smoke | Integração | UI | A11y |
|----------------|-------|------------|-----|------|
| Navegação | ✓ | - | - | ✓ |
| Dashboard | ✓ | - | ✓ | ✓ |
| Alunos CRUD | ✓ | - | ✓ | ✓ |
| Responsáveis | ✓ | - | - | ✓ |
| Turmas CRUD | ✓ | - | - | ✓ |
| Frequência | [P] | - | - | - |
| Graduação | [P] | - | - | - |
| Ranking | ✓ | - | - | ✓ |
| Campeotos | ✓ | - | - | ✓ |
| Financeiro | ✓ | - | ✓ | ✓ |
| Financeiro Gerencial | [P] | - | - | - |
| Produtos | ✓ | - | ✓ | ✓ |
| Aluguel | ✓ | - | - | ✓ |
| Relatórios | [P] | - | - | - |

Legenda: ✓ = Feito, [P] = Pendente

---

## Cross-Browser

| Browser | Versão | Status |
|---------|--------|--------|
| Chrome | Latest | [PENDENTE] |
| Firefox | Latest | [PENDENTE] |
| Safari | Latest | [PENDENTE] |
| Edge | Latest | [PENDENTE] |

---

## Dispositivos

| Dispositivo | Resolução | Status |
|-------------|-----------|--------|
| Mobile | 375x667 | [PENDENTE] |
| Mobile | 414x896 | [PENDENTE] |
| Tablet | 768x1024 | [PENDENTE] |
| Desktop | 1920x1080 | ✓ |
| Large | 2560x1440 | [PENDENTE] |

---

## Funcionalidades Críticas (Priority 1)

1. ✓ Login/Navegação (não aplicável - admin only)
2. ✓ Dashboard KPIs
3. ✓ Alunos CRUD
4. ✓ Registro de pagamento
5. ✓ Venda de produtos
6. ✓ Footer MtsFerreira em todas páginas

---

## Bugs Conhecidos

| Bug | Severidade | Status |
|-----|------------|--------|
| Nome scaffold no package.json | CRÍTICO | Aberto |
| TypeScript não strict | CRÍTICO | Aberto |
| Imports diretos de mocks | ALTA | Aberto |
