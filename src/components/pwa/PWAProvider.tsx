import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Download, Wifi, WifiOff } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/**
 * Registra o Service Worker (gerado pelo vite-plugin-pwa), monitora
 * atualizações e status online/offline, e captura o evento de instalação
 * para oferecer um botão "Instalar app" no momento certo.
 */
export function PWAProvider() {
  // --- Registro do SW + detecção de update -------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (import.meta.env.DEV) return;

    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });

    import("virtual:pwa-register")
      .then(({ registerSW }) => {
        const updateSW = registerSW({
          immediate: true,
          onNeedRefresh() {
            toast("Nova versão disponível", {
              description: "Atualize para ter as últimas melhorias.",
              duration: Infinity,
              action: {
                label: "Atualizar",
                onClick: () => updateSW(true),
              },
            });
          },
          onOfflineReady() {
            toast.success("App pronto para uso offline");
          },
        });
      })
      .catch(() => {
        /* SW registration opcional — silencia em dev/preview */
      });
  }, []);

  // --- Online/Offline badge ---------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;
    let offlineToastId: string | number | undefined;

    const onOffline = () => {
      offlineToastId = toast("Você está offline", {
        description: "Alguns dados podem estar desatualizados.",
        duration: Infinity,
        icon: <WifiOff className="h-4 w-4" />,
      });
    };
    const onOnline = () => {
      if (offlineToastId !== undefined) toast.dismiss(offlineToastId);
      toast.success("Conexão restaurada", {
        icon: <Wifi className="h-4 w-4" />,
        duration: 2000,
      });
    };

    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  // Botão fixo "Instalar app" no AppTopbar via <InstallAppButton /> cuida de
  // capturar o evento `beforeinstallprompt` e apresentar o CTA.
  return null;
}

/**
 * Botão explícito de instalação (ex: dentro do menu "Mais").
 * Só aparece se o browser suportar PWA install e o app ainda não estiver instalado.
 */
export function InstallAppButton() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setInstalled(standalone);

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    const installedHandler = () => {
      setInstalled(true);
      setInstallEvent(null);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  if (installed || !installEvent) return null;

  return (
    <Button
      size="sm"
      variant="secondary"
      onClick={async () => {
        try {
          await installEvent.prompt();
          await installEvent.userChoice;
        } finally {
          setInstallEvent(null);
        }
      }}
    >
      <Download className="mr-2 h-4 w-4" />
      Instalar app
    </Button>
  );
}
