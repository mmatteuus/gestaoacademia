# 03 — Arquitetura, Monorepo e Organização de Pastas

## FATO

A base atual é um app frontend único. A meta é deixá-lo preparado para entrar em monorepo sem reescrita estrutural posterior.

## Estrutura alvo dentro do app atual

```text
src/
  app-or-root/
  components/
    forms/
    layout/
    shared/
    ui/
  features/
    academia/
    alunos/
    responsaveis/
    turmas/
    frequencia/
    graduacao/
    ranking/
    campeonatos/
    financeiro/
    produtos/
    aluguel/
    insights/
  services/
    adapters/
    api/
    mocks/
  types/
  lib/
  hooks/
```

## Regras estruturais

### 1. UI não lê mock diretamente
A UI deve depender de:
- provider
- hook
- service
- adapter

Nunca de arquivo de mock diretamente, exceto quando o mock estiver encapsulado na camada de serviço do domínio.

### 2. Estado por domínio
Criar/manter providers centralizados por domínio:
- `AcademiaDataProvider`
- `OperacionalDataProvider`
- `InsightsDataProvider`
- opcionalmente criar provider específico de responsáveis se necessário para consistência

### 3. Contratos separados da UI
Criar/usar adapters e tipos por domínio para que a troca de mock por API real seja de baixo risco.

### 4. Preparação para monorepo
O código deve ser escrito já imaginando futura extração para:
- `apps/web`
- `packages/ui`
- `packages/types`
- `packages/config`

### 5. Limpeza obrigatória
Remover:
- arquivos mortos
- imports mortos
- componentes não usados
- estados duplicados que simulam dados já existentes em provider
- documentação obsoleta que contradiga o estado final

## Estrutura da pasta implantar durante execução

Durante a execução, `implantar/` é apenas trilha operacional.

Ao final, o executor deve:
- apagar todos os arquivos instrutivos de `implantar/`
- criar somente `implantar/99-resumo-execucao.md`

## Rodapé obrigatório
Toda página/layout deve conter rodapé com:
- texto exato: `Desenvolvido por MtsFerreira`
- link: `https://MtsFerreira.dev`
