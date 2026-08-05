import { useEffect } from 'react';
import { toast } from 'sonner';
import type { BeforeInstallPromptEvent } from './pwa.types';
import { isPWAStandalone } from './pwa.utils';

export function useInstallPromptCapture() {
  useEffect(() => {
    if (isPWAStandalone()) sessionStorage.setItem('pwa-mode', 'true');

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      window.deferredPWAInstallPrompt = event as BeforeInstallPromptEvent;
      window.dispatchEvent(new CustomEvent('pwa-prompt-available'));
    };
    const handleInstalled = () => {
      window.deferredPWAInstallPrompt = undefined;
      toast.success('Aplicativo instalado!', {
        description: 'Gêmeos Academia agora está disponível na tela inicial.',
        duration: 5000,
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);
}
