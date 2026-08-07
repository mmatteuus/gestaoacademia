import { useEffect, useState } from 'react';
import { CloudOff } from 'lucide-react';
import { getPendingWriteCount } from '@/lib/offline-queue';

export function OfflineQueueBadge() {
  const [pending, setPending] = useState(0);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    let active = true;

    const refreshPending = async () => {
      const count = await getPendingWriteCount();
      if (active) setPending(count);
    };

    const settleTimeout = window.setTimeout(() => {
      if (active) setOnline(navigator.onLine);
    }, 2000);
    const interval = window.setInterval(refreshPending, 5000);
    const handleOnline = () => {
      setOnline(true);
      void refreshPending();
    };
    const handleOffline = () => setOnline(false);

    void refreshPending();
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      active = false;
      window.clearTimeout(settleTimeout);
      window.clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (online && pending === 0) return null;

  const title = !online
    ? `Offline${pending > 0 ? ` — ${pending} alteração(ões) em fila` : ''}`
    : `${pending} alteração(ões) aguardando sincronização`;

  return (
    <div
      className="flex items-center gap-1 rounded-full border border-border/70 bg-secondary/60 px-2.5 py-1 text-[11px] text-muted-foreground"
      title={title}
      aria-live="polite"
    >
      <CloudOff className="h-3 w-3" />
      <span className="hidden sm:inline">{online ? 'Sincronizando' : 'Offline'}</span>
      {pending > 0 && <span className="font-semibold text-foreground">{pending}</span>}
    </div>
  );
}
