import { useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useConnectivityMonitor() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let offlineToastId: string | number | undefined;
    let hasShownOfflineToast = false;
    let isSettling = true;

    const handleOffline = () => {
      if (isSettling || hasShownOfflineToast) return;

      hasShownOfflineToast = true;
      offlineToastId = toast.error('Sem conexão com a internet', {
        description: 'Você ainda pode consultar dados salvos, mas alterações podem aguardar sincronização.',
        duration: Infinity,
        icon: <WifiOff className="h-4 w-4" />,
      });
    };

    const handleOnline = () => {
      if (offlineToastId !== undefined) {
        toast.dismiss(offlineToastId);
        offlineToastId = undefined;
      }

      if (!hasShownOfflineToast) return;

      toast.success('Conexão restaurada', {
        description: 'Sincronizando dados com o servidor...',
        icon: <Wifi className="h-4 w-4" />,
        duration: 3000,
      });
      hasShownOfflineToast = false;
      window.setTimeout(() => void queryClient.invalidateQueries(), 1500);
    };

    const settleTimeout = window.setTimeout(() => {
      isSettling = false;
      if (!navigator.onLine) handleOffline();
    }, 2000);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.clearTimeout(settleTimeout);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      if (offlineToastId !== undefined) toast.dismiss(offlineToastId);
    };
  }, [queryClient]);
}
