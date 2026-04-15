# 04 — Rotas e Formulários

## Rotas obrigatórias

O frontend deve manter e validar as rotas abaixo:

```txt
/
/alunos
/responsaveis
/turmas
/frequencia
/graduacao
/ranking
/campeonatos
/financeiro
/financeiro-gerencial
/produtos
/aluguel
/relatorios
```

## Regras por rota

Toda rota principal deve:

1. abrir dentro de `AdminLayout`;
2. ter `PageHeader`;
3. respeitar o footer obrigatório;
4. ter layout funcional no mobile;
5. prever `loading`, `error`, `empty` e `success` quando aplicável.

## Correções obrigatórias já mapeadas

- integrar `ResponsaveisPage` no router;
- integrar `Responsáveis` na sidebar;
- manter `NotFound` ativo.

## Formulários prioritários

### P0
- Aluno
- Responsável
- Turma
- Produto

### P1
- Aluguel
- Financeiro / mensalidade
- filtros e ações de relatórios

## Regras do formulário de aluno

O formulário de aluno deve conter:

- nome;
- email;
- telefone;
- cpf;
- data de nascimento;
- categoria;
- faixa atual;
- status;
- observações;
- seleção de responsável opcional;
- mecanismo de criação rápida de responsável;
- normalização final de `responsavelId`.

## Regras do formulário de responsável

O formulário de responsável deve conter:

- nome;
- telefone;
- email opcional;
- observações opcionais;
- lista de alunos vinculados.

## Regra obrigatória de vínculo

### No cadastro de aluno
Deve existir opção para:
- não vincular responsável;
- escolher responsável existente;
- cadastrar responsável novo dentro do fluxo.

### Na tela de responsável
Deve existir opção para:
- listar alunos vinculados;
- vincular aluno existente;
- desvincular aluno.

## Normalização obrigatória

- nunca manter `none` como valor semântico de domínio;
- converter para `null` ou `undefined` antes de salvar;
- toda transformação deve estar em submit handler tipado ou adaptador.

## Critério de aceite

Uma rota só está pronta quando:
- está acessível;
- está no menu quando for principal;
- abre sem erro;
- funciona em mobile;
- preserva o layout padrão.

Um formulário só está pronto quando:
- usa RHF + Zod;
- não usa `any`;
- exibe labels;
- exibe erros claros;
- retorna payload normalizado.
