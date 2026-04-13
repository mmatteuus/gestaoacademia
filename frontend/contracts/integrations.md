# Integrations Contract

## 1. Integrações Existentes

### 1.1 React Query
- Provider: `QueryClientProvider` em App.tsx
- Configuração: QueryClient padrão
- [PENDENTE]: configurar queries invalidation

### 1.2 React Router
- Provider: `BrowserRouter` em App.tsx
- Rotas: definidas em Routes
- [PENDENTE]: lazy loading

### 1.3 Sonner (Toasts)
- Provider: `Sonner` em App.tsx
- Configuração: padrão

---

## 2. Integrações Futuras [PENDENTE]

### 2.1 Analytics
- SDK: Google Analytics 4 ou Plausible
- Script: inserir em index.html
- Tracking: eventos de página e ação

### 2.2 Error Tracking
- SDK: Sentry ou Rollbar
- Configuração: vite.config.ts com plugin

### 2.3 API Backend
- Endpoints: [PENDENTE]
- Auth: [PENDENTE]
- Retry: configurar axios/ky

---

## 3. Dependências Externas

| Pacote | Versão | Uso |
|--------|--------|-----|
| react | ^18.3.1 | Framework |
| react-dom | ^18.3.1 | DOM |
| react-router-dom | ^6.30.1 | Roteamento |
| @tanstack/react-query | ^5.83.0 | Estado servidor |
| recharts | ^2.15.4 | Gráficos |
| sonner | ^1.7.4 | Toasts |
| lucide-react | ^0.462.0 | Ícones |
| zod | ^3.25.76 | Validação |

---

## 4. CSP Configuration [PENDENTE]

```typescript
// vite.config.ts
export default defineConfig({
  headers: {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://analytics.google.com;",
  },
});
```
