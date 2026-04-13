# Motion

## Animações Definidas

### tailwind.config.ts

```typescript
keyframes: {
  "accordion-down": {
    from: { height: "0" },
    to: { height: "var(--radix-accordion-content-height)" },
  },
  "accordion-up": {
    from: { height: "var(--radix-accordion-content-height)" },
    to: { height: "0" },
  },
  "fade-in": {
    from: { opacity: "0", transform: "translateY(8px)" },
    to: { opacity: "1", transform: "translateY(0)" },
  },
  "slide-in-right": {
    from: { transform: "translateX(100%)" },
    to: { transform: "translateX(0)" },
  },
  "pulse-glow": {
    "0%, 100%": { boxShadow: "0 0 10px -3px hsl(var(--primary) / 0.3)" },
    "50%": { boxShadow: "0 0 20px -3px hsl(var(--primary) / 0.5)" },
  },
  shimmer: {
    "0%": { backgroundPosition: "-200% 0" },
    "100%": { backgroundPosition: "200% 0" },
  },
},
animation: {
  "accordion-down": "accordion-down 0.2s ease-out",
  "accordion-up": "accordion-up 0.2s ease-out",
  "fade-in": "fade-in 0.3s ease-out",
  "slide-in-right": "slide-in-right 0.3s ease-out",
  "pulse-glow": "pulse-glow 2s ease-in-out infinite",
  shimmer: "shimmer 2s linear infinite",
},
```

## Reduced Motion

### index.css

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Uso

| Animação | Uso |
|----------|-----|
| fade-in | Entrada de páginas, cards |
| slide-in-right | Drawers, sheets |
| shimmer | Skeletons loading |
| pulse-glow | Elementos em destaque |
| accordion | Accordions shadcn |

## Duração

- Curtas: 0.15s - 0.2s (interações)
- Médias: 0.3s (transições)
- Longas: 2s (efeitos contínuos)
