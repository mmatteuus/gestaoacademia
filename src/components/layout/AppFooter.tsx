export function AppFooter() {
  return (
    <footer className="sticky bottom-0 z-20 border-t border-border bg-background/95 px-4 py-3 text-center backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <p className="text-xs text-muted-foreground">
        Desenvolvido por{' '}
        <a
          href="https://mtsferreira.dev"
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
