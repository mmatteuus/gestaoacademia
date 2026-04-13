# TASK-FE-005: Adicionar Error Boundaries

## Contexto

A aplicação não possui Error Boundaries, então qualquer erro não tratado quebra toda a UI.

## Inspiração

- React Error Boundary best practices

## Entregáveis

1. **GlobalErrorBoundary**:
   - Componente wrapper
   - Exibe UI de erro amigável
   - Botão de retry
   - Log de erro

2. **PageErrorBoundary**:
   - Para páginas críticas
   - Fallback específico por área

3. **Implementação em App.tsx**:
   ```tsx
   <ErrorBoundary fallback={<GlobalErrorFallback />}>
     <Routes>...</Routes>
   </ErrorBoundary>
   ```

## Critérios de Aceite

- [ ] Error boundary global implementado
- [ ] Erro em qualquer página mostra UI amigável
- [ ] Botão de retry funciona
- [ ] `npm run build` passa

## Dependências

- TASK-FE-002 (TypeScript strict)

## Comandos de Validação

```bash
# Testar com erro forçado
npm run build
```

## Rodapé

- Validar footer mesmo em estado de erro
