# UX Strategy - Gêmeos Academia

## 1. Princípios de Design

### 1.1 Identidade Visual
- **Tema**: Dark mode premium com vermelho/preto
- **Primária**: hsl(0, 72%, 51%) - vermelho escuro
- **Background**: hsl(0, 0%, 7%) - preto suave
- **Card**: hsl(0, 0%, 10%) - cinza escuro
- **Border**: hsl(0, 0%, 16%) - borda sutil

### 1.2 Tipografia
- **Fonte**: Inter (padrão shadcn)
- **Tamanhos**: 
  - h1: text-2xl font-bold
  - h2: text-xl font-semibold
  - h3: text-lg font-semibold
  - body: text-sm
  - caption: text-xs

### 1.3 Espaçamento
- Container: padding 2rem, max-width 1400px
- Cards: padding 4-5 (16-20px)
- Listas: gap-3 ou gap-4
- Tables: compactas com padding 3-4

### 1.4 Animações
- Fade-in: 0.3s ease-out (entrada de páginas)
- Slide-in: 0.3s (drawers)
- Hover: transition-colors 0.15s
- Reduced motion: respeitado via media query

---

## 2. Padrões de Interface

### 2.1 PageHeader
- Título principal (h1)
- Subtítulo informativo
- Actions (botões de ação primária)

### 2.2 Estados de UI
- **Loading**: Skeletons
- **Empty**: EmptyState com ícone, título, descrição
- **Error**: Toast de erro
- **Success**: Toast de sucesso

### 2.3 Padrão de Lista
- Desktop: Tabela com overflow-x
- Mobile: Cards com mesmos dados
- Breakpoint: 640px (sm)

### 2.4 Padrão de Form
- Dialog (modal)
- Campos com labels small
- Validação inline
- Actions: Cancelar + Confirmar

### 2.5 Padrão de Detalhe
- Sheet (drawer) do lado direito
- Abas para seções
- Actions no header

---

## 3. Navegação

### 3.1 Sidebar
- Logo + nome
- Links agrupados por categoria
- Ícones Lucide
- Collapse em mobile
- Highlight de rota ativa

### 3.2 Topbar
- Busca global
- Toggle de sidebar (mobile)

### 3.3 Footer
- Texto fixo "Desenvolvido por MtsFerreira"
- Link para https://MtsFerreira.dev
- Nova aba com segurança

---

## 4. Acessibilidade

### 4.1 Requisitos
- [ ] Todos inputs com labels
- [ ] Botões com aria-label ou texto
- [ ] Focus visible (ring-2)
- [ ] Keyboard navigation completa
- [ ] Reduced motion support
- [ ] Contraste mínimo 4.5:1
- [ ] Semantização (header, main, footer, nav)

### 4.2 Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 5. Responsividade

### 5.1 Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px
- Large: > 1400px

### 5.2 Padrões Mobile
- Tabelas → Cards
- Sidebar → Drawer
- Botões → Full width
- Padding: p-4 (16px)

### 5.3 Touch Targets
- Mínimo: 44x44px (iOS)
- Buttons: h-9 ou maior
- Inputs: h-9 ou maior

---

## 6. Microinterações

### 6.1 Botões
- Hover: bg lighten/darken
- Active: scale(0.98)
- Focus: ring

### 6.2 Cards
- Hover: bg-accent/30
- Cursor: pointer (se clicável)

### 6.3 Loading
- Skeleton shimmer
- Fade-in ao carregar

### 6.4 Toasts
- Sonner com auto-dismiss
- Posição: bottom-right

---

## 7. Tratamento de Erros

### 7.1 Error Boundaries
- Global: para toda a app
- Por área: para componentes críticos

### 7.2 Retry Logic
- N/A (dados locais)
- [PENDENTE] para将来 API

### 7.3 User Feedback
- Toast error para operações falhas
- Mensagem clara de erro

---

## [PENDENTE]

- Validar se todos os padrões são seguidos
- Testar com screen reader
- Verificar performance em device real
