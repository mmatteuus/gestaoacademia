export function AppFooter() {
  // Fica posicionado logo acima do BottomNav, ambos fixos no fundo da viewport.
  return (
    <footer className="fixed bottom-[64px] inset-x-0 z-20 border-t border-border bg-background/95 px-4 py-1.5 text-center backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <p className="text-[11px] text-muted-foreground">
        Desenvolvido por{' '}
        <a
          href="https://MtsFerreira.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary hover:underline"
        >
          MtsFerreira
        </a>
      </p>
    </footer>
  );
}
