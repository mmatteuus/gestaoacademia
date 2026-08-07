interface PublicFooterProps {
  className?: string;
}

export function PublicFooter({ className }: PublicFooterProps) {
  return (
    <p className={`text-center text-xs text-muted-foreground ${className || ''}`.trim()}>
      Desenvolvido por{' '}
      <a
        href="https://www.mtsferreira.dev/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        MtsFerreira
      </a>
    </p>
  );
}
