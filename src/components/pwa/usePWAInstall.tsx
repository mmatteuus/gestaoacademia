import { useCallback, useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { haptic } from '@/lib/haptics';
import type { PWAPlatform } from './pwa.types';
import { detectPWAPlatform, isPWAStandalone } from './pwa.utils';

export function usePWAInstall() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [promptAvailable, setPromptAvailable] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [platform, setPlatform] = useState<PWAPlatform | null>(null);

  useEffect(() => {
    const refreshStatus = () => {
      setIsInstalled(isPWAStandalone());
      setPromptAvailable(Boolean(window.deferredPWAInstallPrompt));
      setPlatform(detectPWAPlatform());
    };
    const handlePromptAvailable = () => {
      setPromptAvailable(Boolean(window.deferredPWAInstallPrompt));
    };
    const handleInstalled = () => {
      setIsInstalled(true);
      setPromptAvailable(false);
      setInstalling(false);
    };
    const displayMode = window.matchMedia('(display-mode: standalone)');

    refreshStatus();
    window.addEventListener('pwa-prompt-available', handlePromptAvailable);
    window.addEventListener('appinstalled', handleInstalled);
    window.addEventListener('focus', refreshStatus);
    displayMode.addEventListener('change', refreshStatus);

    return () => {
      window.removeEventListener('pwa-prompt-available', handlePromptAvailable);
      window.removeEventListener('appinstalled', handleInstalled);
      window.removeEventListener('focus', refreshStatus);
      displayMode.removeEventListener('change', refreshStatus);
    };
  }, []);

  const install = useCallback(async () => {
    haptic('medium');
    const prompt = window.deferredPWAInstallPrompt;

    if (!prompt) {
      if (platform === 'ios') {
        toast('Para instalar no iPhone', {
          description: 'Toque em Compartilhar e depois em “Adicionar à Tela de Início”.',
          duration: 8000,
          icon: <Download className="h-4 w-4" />,
        });
      }
      return;
    }

    setInstalling(true);
    try {
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;
      window.deferredPWAInstallPrompt = undefined;
      setPromptAvailable(false);

      if (outcome === 'accepted') {
        setIsInstalled(true);
        haptic('success');
      }
    } catch (error) {
      console.warn('Falha ao abrir a instalação do aplicativo:', error);
      toast.error('Não foi possível abrir o instalador.');
    } finally {
      setInstalling(false);
    }
  }, [platform]);

  const visible = !isInstalled && (promptAvailable || platform === 'ios');
  return { visible, installing, install };
}
