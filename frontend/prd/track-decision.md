# Track Decision - Trilha Escolhida

## Decisão: AUDITAR E MELHORAR

### Por que NÃO CRIAR DO ZERO:

1. O frontend atual é navegável e funcional
2. Todas as rotas principais existem
3. Design system shadcn/ui já está configurado
4. Tipos TypeScript já estão definidos
5. Componentes compartilhados existem
6. Tema visual (vermelho/preto) já está aplicado
7. O usuário não solicitou redesign

### Por que NÃO EVOLUIR EXISTENTE (apenas):

1. Há problemas críticos de identidade (nome de scaffold)
2. TypeScript strict está desativado
3. Arquitetura de dados é provisória (imports diretos de mocks)
4. Falta validação runtime
5. Sem error boundaries
6. Sem lazy loading
7. Observabilidade mínima
8. README placeholder

### Por que AUDITAR E MELHORAR:

1. **Preserva o trabalho existente**: Dashboard, formulários, tabelas, estados de UI
2. **Corrige only what's broken**: Identidade, TypeScript, arquitetura
3. **Adiciona o mínimo viável**: Error boundaries, lazy loading, SEO
4. **não reinventa a roda**: shadcn/ui continua sendo usado
5. **Executável em fases**: Crítico → Alta → Média → Baixa

---

## Escopo Excluso

- Não criar backend
- Não criar sistema de autenticação
- Não criar app mobile nativo
- Não redesenhar UI do zero
- Não migrar para outro framework

---

## Critérios de Sucesso

- [x] Trilha AUDITAR E MELHORAR escolhida explicitamente
- [x] Estrutura /frontend criada
- [x] Pelo menos 3 inspirações documentadas
- [x] Tarefas executáveis sem decisões ocultas
- [x] Performance, acessibilidade, testes, observabilidade, segurança, SEO cobertos
- [x] Rodapé MtsFerreira validado
- [x] Lacunas marcadas como [PENDENTE]
- [x] Ordem de implementação pronta
