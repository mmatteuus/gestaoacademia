# Arquitetura e organização do frontend

## Objetivo

O frontend concentra a experiência administrativa e pública da Gêmeos Academia. As páginas devem compor fluxos; regras específicas de domínio devem permanecer em `features`, e elementos reutilizáveis devem ficar em `components` ou `services`.

## Responsabilidades das pastas

```text
src/
├── components/
│   ├── layout/       Estrutura global da aplicação
│   ├── shared/       Componentes reutilizados por vários domínios
│   └── ui/           Primitivos de interface e componentes gerados
├── features/         Regras, formulários, schemas, tipos e serviços por domínio
├── hooks/            Comportamentos compartilhados entre telas
├── pages/            Composição das rotas e coordenação dos fluxos
├── services/         Cliente HTTP, contratos, adaptadores e consultas
├── test/             Configuração e testes unitários do frontend
└── types/            Tipos de domínio compartilhados
```

A documentação deve permanecer em `docs/`, fora de `src`, para não misturar conteúdo técnico com código executável.

## Direção das dependências

- `pages` pode consumir `features`, `components`, `hooks` e `services`;
- `features` pode consumir componentes compartilhados e serviços, mas não outras páginas;
- `components/shared` não deve depender de uma página específica;
- `components/ui` reúne primitivos de interface e não deve conter regras de negócio;
- chamadas HTTP e adaptação de dados devem ficar fora dos componentes visuais.

## Limites de manutenção

Os números abaixo são alertas de revisão, não metas artificiais:

- até 300 linhas para arquivos de código em geral;
- até 150 linhas para componentes e páginas React;
- até 50 linhas por função;
- componentes gerados em `src/components/ui` são auditados separadamente;
- arquivos acima do limite devem ser divididos apenas quando houver responsabilidades distintas.

A auditoria automática pode ser executada com:

```bash
npm run check:structure
```

O modo estrito encerra com erro quando encontra violações:

```bash
npm run check:structure:strict
```

O tamanho de funções continua sendo revisado manualmente, porque uma contagem textual simples não representa corretamente callbacks, funções aninhadas e componentes declarativos.

## Critérios para extração

Considere extrair código quando um arquivo acumular dois ou mais destes sinais:

- estado e efeitos de domínios diferentes;
- múltiplos formulários ou diálogos independentes;
- transformação de dados misturada com renderização;
- blocos visuais reutilizáveis;
- funções longas com muitos desvios condicionais;
- testes difíceis de escrever sem renderizar a página inteira.

Extrações recomendadas:

- componentes visuais para `components` ou para a própria `feature`;
- estado reutilizável para hooks;
- validações para schemas;
- conversões de dados para adapters;
- comunicação externa para services ou repositories.

## Módulos existentes

O projeto contém fluxos para dashboard, alunos, responsáveis, turmas, frequência, graduação, ranking, campeonatos, financeiro, produtos, vendas, aluguel, relatórios e cadastro público. A fonte de dados pode vir da API Express integrada ao Google Sheets ou de dados demonstrativos utilizados nos testes e na apresentação.

## Revisão humana

Cada refatoração deve preservar comportamento e ser pequena o suficiente para revisão. Antes de mesclar:

1. execute lint, testes e build;
2. revise imports e dependências entre camadas;
3. confirme que arquivos novos respeitam as responsabilidades descritas aqui;
4. valide os fluxos principais afetados pela alteração;
5. evite renomeações ou movimentações sem benefício claro.
