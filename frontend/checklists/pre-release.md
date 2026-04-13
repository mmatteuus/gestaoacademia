# Pre-Release Checklist

## 1. build e typecheck

- [ ] `npm run build` passa sem erros
- [ ] `npx tsc --noEmit` passa sem erros
- [ ] `npm run lint` passa sem erros

## 2. Funcionalidade Core

- [ ] Todas as rotas navegáveis
- [ ] Dashboard exibe KPIs
- [ ] CRUD de alunos funcionando
- [ ] CRUD de turmas funcionando
- [ ] Financeiro com registro de pagamento
- [ ] Produtos com carrinho e venda

## 3. UI/UX

- [ ] Footer "Desenvolvido por MtsFerreira" presente em todas as páginas
- [ ] Link https://MtsFerreira.dev funcionando
- [ ] Dark mode aplicado corretamente
- [ ] Tema vermelho/preto presente
- [ ] Responsive em mobile/tablet/desktop

## 4. Acessibilidade

- [ ] Keyboard navigation funciona
- [ ] Focus visible presente
- [ ] Reduced motion respeitado
- [ ] Contraste mínimo 4.5:1

## 5. Performance

- [ ] First load < 3s
- [ ] No console errors
- [ ] Lazy loading implementado - [PENDENTE]

## 6. Segurança

- [ ] CSP configurado - [PENDENTE]
- [ ] No sensitive data exposta

## 7. SEO

- [ ] Title por página - [PENDENTE]
- [ ] Meta descriptions - [PENDENTE]

## 8. Testes

- [ ] Smoke tests passam
- [ ] Error boundary testado

## 9. Observabilidade

- [ ] Toasts funcionando
- [ ] Error tracking - [PENDENTE]

---

## Checklist Específico por Página

| Página | Footer OK | Funcional | Acessível |
|--------|-----------|-----------|-----------|
| Dashboard | [x] | [x] | [x] |
| Alunos | [x] | [x] | [x] |
| Responsáveis | [x] | [x] | [x] |
| Turmas | [x] | [x] | [x] |
| Frequência | [x] | [PENDENTE] | [PENDENTE] |
| Graduação | [x] | [PENDENTE] | [PENDENTE] |
| Ranking | [x] | [x] | [x] |
| Campeotos | [x] | [x] | [x] |
| Financeiro | [x] | [x] | [x] |
| Financeiro Gerencial | [x] | [PENDENTE] | [PENDENTE] |
| Produtos | [x] | [x] | [x] |
| Aluguel | [x] | [x] | [x] |
| Relatórios | [x] | [PENDENTE] | [PENDENTE] |
| 404 | [x] | [x] | [x] |
