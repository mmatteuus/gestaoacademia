import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { haptic } from '@/lib/haptics';

type ServiceWorkerUpdater = (reloadPage?: boolean) => void | Promise<void>;

export function useServiceWorkerUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const updaterRef = useRef<ServiceWorkerUpdater | null>(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const localHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    if (localHost && !import.meta.env.VITE_ENABLE_PWA_DEV) return;

    let active = true;

    void import('virtual:pwa-register')
      .then(({ registerSW }) => {
        const updateServiceWorker = registerSW({
          immediate: true,
          onNeedRefresh() {
            if (!active) return;
            updaterRef.current = updateServiceWorker;
            setUpdateAvailable(true);
          },
          onOfflineReady() {
            if (!active) return;
            toast.info('Pronto para uso offline', {
              description: 'O sistema funcionará mesmo sem internet.',
              duration: 5000,
            });
          },
          onRegisterError(error) {
            console.warn('Falha ao registrar o Service Worker:', error);
          },
        });
      })
      .catch((error) => {
        console.warn('Erro ao carregar o Service Worker:', error);
      });

    return () => {
      active = false;
    };
  }, []);

  const updateNow = useCallback(() => {
    const updater = updaterRef.current;
    if (!updater) return;

    setIsUpdating(true);
    haptic('medium');
    void Promise.resolve(updater(true)).catch(() => {
      setIsUpdating(false);
      toast.error('Não foi possível atualizar o aplicativo.');
    });
  }, []);

  const dismissUpdate = useCallback(() => {
    if (!isUpdating) setUpdateAvailable(false);
  }, [isUpdating]);

  return { updateAvailable, isUpdating, updateNow, dismissUpdate };
}
