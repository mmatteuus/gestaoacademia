# Observabilidade

## current state

- Toasts via Sonner apenas

## Meta

### Logging
```typescript
interface LogEntry {
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  context?: Record<string, any>;
}
```

### Error Tracking [PENDENTE]
- Sentry ou Rollbar

### Analytics [PENDENTE]
- Google Analytics 4

### Web Vitals [PENDENTE]
- Core Web Vitals tracking
