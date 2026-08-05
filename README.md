# Gêmeos Academia

Sistema full stack demonstrativo para gestão de uma academia de artes marciais. O projeto reúne módulos administrativos, API REST, integração com Google Sheets, testes automatizados e experiência responsiva com suporte a PWA.

## Principais módulos

- alunos, responsáveis e turmas;
- frequência, graduação, ranking e campeonatos;
- financeiro escolar e gerencial;
- produtos, vendas e aluguel;
- indicadores, relatórios e cadastro público;
- autenticação demonstrativa e suporte a operação offline.

## Tecnologias

### Frontend

- React 18 e TypeScript;
- Vite, React Router e TanStack Query;
- Tailwind CSS, Radix UI e Recharts;
- Vitest, Testing Library e Playwright;
- PWA com cache e fila de operações offline.

### Backend

- Node.js e Express;
- API REST organizada em rotas, controladores, serviços e repositórios;
- integração com Google Sheets;
- CORS configurável, rate limit, cabeçalhos de segurança e chave de API opcional;
- testes de integração e segurança com Vitest e Supertest.

## Estrutura do repositório

```text
backend/src/            API, regras de negócio e acesso aos dados
src/components/         Componentes de layout, compartilhados e UI
src/features/           Regras e componentes organizados por domínio
src/pages/              Composição das páginas e fluxos de navegação
src/services/           Contratos, adaptadores, consultas e cliente HTTP
docs/                   Documentação técnica do projeto
scripts/                Rotinas de manutenção, dados e qualidade
e2e/                    Testes de ponta a ponta
```

## Executar localmente

```bash
npm ci
cp .env.example .env
```

Em terminais separados:

```bash
npm run dev:server
npm run dev
```

A integração real com Google Sheets depende das variáveis descritas em `.env.example`. Credenciais reais não devem ser versionadas.

## Qualidade

```bash
npm run lint
npm run test
npm run test:backend
npm run build
npm run check:structure
```

A auditoria estrutural identifica arquivos acima dos limites adotados pelo projeto. O modo estrito pode ser executado com `npm run check:structure:strict` conforme as exceções legadas forem eliminadas.

## Acesso demonstrativo

A senha de demonstração é preenchida automaticamente na tela de entrada.

## Documentação

Consulte [`docs/FRONTEND.md`](docs/FRONTEND.md) para conhecer as responsabilidades das pastas e os critérios de organização.

---

Desenvolvido por [MtsFerreira](https://www.mtsferreira.dev/).
