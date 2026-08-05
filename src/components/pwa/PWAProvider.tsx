import { PWAUpdateDialog } from './PWAUpdateDialog';
import { useConnectivityMonitor } from './useConnectivityMonitor';
import { useInstallPromptCapture } from './useInstallPromptCapture';
import { useServiceWorkerUpdate } from './useServiceWorkerUpdate';

export function PWAProvider() {
  const update = useServiceWorkerUpdate();
  useInstallPromptCapture();
  useConnectivityMonitor();

  return (
    <PWAUpdateDialog
      open={update.updateAvailable}
      updating={update.isUpdating}
      onDismiss={update.dismissUpdate}
      onUpdate={update.updateNow}
    />
  );
}

export { InstallAppButton } from './InstallAppButton';
