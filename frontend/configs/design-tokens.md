# Design Tokens

## Cores

### Cores do Tema (CSS Variables)

```css
:root {
  /* Background & Foreground */
  --background: hsl(0, 0%, 7%);
  --foreground: hsl(0, 0%, 95%);

  /* Card */
  --card: hsl(0, 0%, 10%);
  --card-foreground: hsl(0, 0%, 95%);

  /* Popover */
  --popover: hsl(0, 0%, 10%);
  --popover-foreground: hsl(0, 0%, 95%);

  /* Primary (Vermelho) */
  --primary: hsl(0, 72%, 51%);
  --primary-foreground: hsl(0, 0%, 100%);

  /* Secondary */
  --secondary: hsl(0, 0%, 15%);
  --secondary-foreground: hsl(0, 0%, 90%);

  /* Muted */
  --muted: hsl(0, 0%, 14%);
  --muted-foreground: hsl(0, 0%, 55%);

  /* Accent */
  --accent: hsl(0, 0%, 18%);
  --accent-foreground: hsl(0, 0%, 95%);

  /* Destructive */
  --destructive: hsl(0, 62%, 50%);
  --destructive-foreground: hsl(0, 0%, 100%);

  /* Border */
  --border: hsl(0, 0%, 16%);
  --input: hsl(0, 0%, 16%);
  --ring: hsl(0, 72%, 51%);

  /* Sidebar */
  --sidebar-background: hsl(0, 0%, 6%);
  --sidebar-foreground: hsl(0, 0%, 70%);
  --sidebar-primary: hsl(0, 72%, 51%);
  --sidebar-primary-foreground: hsl(0, 0%, 100%);
  --sidebar-accent: hsl(0, 0%, 12%);
  --sidebar-accent-foreground: hsl(0, 0%, 95%);
  --sidebar-border: hsl(0, 0%, 13%);
  --sidebar-ring: hsl(0, 72%, 51%);

  /* Custom */
  --surface: hsl(0, 0%, 11%);
  --surface-elevated: hsl(0, 0%, 13%);
  --surface-hover: hsl(0, 0%, 16%);
  --glow-primary: hsl(0, 72%, 51%);

  /* Semantic */
  --success: hsl(142, 71%, 45%);
  --success-foreground: hsl(0, 0%, 100%);
  --warning: hsl(38, 92%, 50%);
  --warning-foreground: hsl(0, 0%, 10%);
  --info: hsl(217, 91%, 60%);
  --info-foreground: hsl(0, 0%, 100%);
}
```

---

## Tipografia

| Elemento | Tamanho | Weight | Line Height |
|----------|---------|--------|-------------|
| h1 | 24px (1.5rem) | 700 | 1.2 |
| h2 | 20px (1.25rem) | 600 | 1.3 |
| h3 | 16px (1rem) | 600 | 1.4 |
| body | 14px (0.875rem) | 400 | 1.5 |
| caption | 12px (0.75rem) | 400 | 1.4 |
| small | 11px (0.6875rem) | 400 | 1.3 |

---

## Espaçamento

| Token | Valor |
|-------|-------|
| space-1 | 4px |
| space-2 | 8px |
| space-3 | 12px |
| space-4 | 16px |
| space-5 | 20px |
| space-6 | 24px |
| space-8 | 32px |
| space-10 | 40px |

---

## Border Radius

| Token | Valor |
|-------|-------|
| radius-sm | 4px |
| radius | 8px |
| radius-md | 6px |
| radius-lg | 12px |

---

## Sombras

| Token | Valor |
|-------|-------|
| shadow-sm | 0 1px 2px 0 rgb(0 0 0 / 0.05) |
| shadow | 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1) |
| shadow-md | 0 4px 6px -1px rgb(0 0 0 / 0.1) |

---

## Efeitos

```css
.glow-primary {
  box-shadow: 0 0 20px -5px hsl(var(--primary) / 0.4),
              0 0 40px -10px hsl(var(--primary) / 0.2);
}

.glow-primary-sm {
  box-shadow: 0 0 10px -3px hsl(var(--primary) / 0.3);
}

.text-gradient-primary {
  background: linear-gradient(to right, #ef4444, #f87171);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```
