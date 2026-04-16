# 00 — Escopo do Projeto

## FATO

O projeto é um frontend administrativo para uma academia de artes marciais/múltiplas modalidades, com foco em operação diária, gestão de alunos e apoio futuro a integrações reais de backend.

## Objetivo de produto

O sistema deve permitir que uma academia gerencie, em um único frontend:
- dashboard operacional
- alunos
- responsáveis opcionais vinculados aos alunos
- turmas
- frequência
- graduação por modalidade
- ranking
- campeonatos
- financeiro escolar
- financeiro gerencial
- produtos e vendas
- aluguel de espaços
- relatórios

## Objetivo técnico

Ao final da execução, o frontend deve:
- estar pronto para entrar em um monorepo
- ter arquitetura previsível por domínio
- minimizar risco de integração com backend
- evitar retrabalho posterior
- evitar mocks espalhados diretamente na UI
- centralizar estado por domínio com adapters/contratos claros

## Como o sistema deve ficar

### 1. Operação fluida
O usuário deve conseguir operar o sistema em telas grandes e pequenas, especialmente iOS e Android pequenos, sem desalinhamento, quebra visual ou botões espremidos.

### 2. Fluxos completos
Toda ação principal deve possuir fluxo de criação, visualização, edição, vínculo, histórico e comprovante quando aplicável.

### 3. Dados ligados às telas corretas
Exemplos obrigatórios:
- aluno deve concentrar perfil, financeiro, graduação, frequência e responsável opcional
- frequência do aluno deve permitir vínculo com turma
- turmas devem refletir alunos reais
- ranking deve explicar pontuação ao clicar
- campeonato deve permitir selecionar alunos reais da academia
- mensalidade, venda e aluguel devem gerar comprovante e permitir envio ao cliente

### 4. Preparado para backend
Nenhuma tela deve depender estruturalmente de mock hardcoded na UI final.

## Público principal
- dono da academia
- recepção/secretaria
- coordenador técnico
- professor

## Regra de acabamento
O executor não deve “deixar quase pronto”. O alvo é **10/10 funcional e estrutural**, sem retrabalho planejado.
