# Breakpoints

## Tailwind Padrão + Custom

| Breakpoint | Largura | Tailwind | Uso |
|------------|---------|----------|-----|
| xs | 320px | - | Mobile mínimo |
| sm | 640px | sm | Mobile grande / Tablet |
| md | 768px | md | Tablet |
| lg | 1024px | lg | Desktop |
| xl | 1280px | xl | Desktop grande |
| 2xl | 1400px | 2xl | Large screen |

## Custom no tailwind.config.ts

```typescript
theme: {
  container: {
    center: true,
    padding: "2rem",
    screens: {
      "2xl": "1400px",
    },
  },
}
```

## Breakpoints de Componentes

### Tabela vs Cards
- Desktop (≥640px): Tabela
- Mobile (<640px): Cards

### Sidebar
- Desktop (≥1024px): Sidebar visível
- Tablet (768px-1023px): Sidebar colapsável
- Mobile (<768px): Drawer

### Grid de Cards
- 1 coluna: < 640px
- 2 colunas: 640px - 1023px
- 3 colunas: ≥ 1024px
