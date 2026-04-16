# 07 — Snippets e Padrões Obrigatórios

## 1. Footer obrigatório
```tsx
export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex min-h-12 max-w-7xl items-center justify-center px-4 py-3 text-xs text-muted-foreground">
        <span>
          Desenvolvido por{' '}
          <a
            href="https://MtsFerreira.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline underline-offset-4"
          >
            MtsFerreira
          </a>
        </span>
      </div>
    </footer>
  )
}
```

## 2. Comprovante com envio ao cliente
O componente compartilhado de comprovante deve suportar:
- visualizar
- copiar
- compartilhar nativo
- WhatsApp quando houver `recipientPhone`

```ts
interface ComprovanteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  subtitle: string
  fields: { label: string; value: string }[]
  recipientPhone?: string
  recipientName?: string
}
```

## 3. Desconto no carrinho
Obrigatório no fluxo de venda:
```ts
const subtotal = itens.reduce((acc, item) => acc + item.quantidade * item.precoUnitario, 0)
const descontoCalculado = descontoTipo === 'percentual'
  ? Math.min(subtotal, subtotal * (Number(descontoInput || 0) / 100))
  : Math.min(subtotal, Number(descontoInput || 0))
const total = Math.max(0, subtotal - descontoCalculado)
```

## 4. Não usar `any`
Tudo tipado em modo estrito.

## 5. Página não lê mock direto
Errado:
```ts
import { alunos } from '@/services/mocks/data'
```

Certo:
```ts
const { alunosList } = useAcademiaData()
```

## 6. Responsividade
- tabelas com fallback para cards em mobile
- botões com altura confortável
- grids que não quebrem em 320px+
- tabs empilháveis quando necessário

## 7. APIs futuras via adapter
Toda integração futura deve passar por `service` + `adapter`, nunca por componente de página.
