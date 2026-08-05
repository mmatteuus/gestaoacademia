import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWAInstall } from './usePWAInstall';

export function InstallAppButton() {
  const { visible, installing, install } = usePWAInstall();

  if (!visible) return null;

  return (
    <Button
      type="button"
      size="sm"
      variant="secondary"
      onClick={() => void install()}
      disabled={installing}
      className="h-9 whitespace-nowrap text-xs sm:text-sm"
      aria-label="Instalar aplicativo"
      title="Instalar aplicativo"
    >
      {installing ? (
        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-1.5 h-4 w-4" />
      )}
      {installing ? 'Instalando…' : 'Instalar app'}
    </Button>
  );
}
