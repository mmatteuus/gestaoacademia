import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

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
      // Dá um tempo para o Workbox drenar a fila de escritas e então força
      // refetch das listas para refletir o que foi sincronizado.
      setTimeout(() => {
        queryClient.invalidateQueries();
      }, 1500);
    };

    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, [queryClient]);

  // --- Back button intercepta modais/drawers abertos ----------------------
  // Em PWA Android o back físico navega pra trás na history. Se há um dialog
  // aberto, queremos que ele feche em vez de sair do app. Fazemos isso
  // empurrando um state "sentinela" quando qualquer Radix Dialog abre, e
  // consumindo esse state no popstate para enviar Escape à UI.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SENTINEL = "__gemeos_modal__";
    let pushed = false;

    const observer = new MutationObserver(() => {
      const hasOpenDialog = document.querySelector('[role="dialog"][data-state="open"]');
      if (hasOpenDialog && !pushed) {
        history.pushState({ [SENTINEL]: true }, "");
        pushed = true;
      } else if (!hasOpenDialog && pushed) {
        pushed = false;
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-state"] });

    const onPop = (e: PopStateEvent) => {
      const openDialog = document.querySelector('[role="dialog"][data-state="open"]');
      if (openDialog) {
        // Simula Escape no dialog atual (Radix escuta).
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        pushed = false;
      }
      void e;
    };
    window.addEventListener("popstate", onPop);

    return () => {
      observer.disconnect();
      window.removeEventListener("popstate", onPop);
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
  const [manualInstallHint, setManualInstallHint] = useState<'ios' | 'android' | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setInstalled(standalone);

    const ua = window.navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);
    if (!standalone) {
      if (isIOS) setManualInstallHint('ios');
      else if (isAndroid) setManualInstallHint('android');
      else setManualInstallHint(null);
    }

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

  if (installed) return null;

  if (installEvent) {
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

  if (!manualInstallHint) return null;

  return (
    <Button
      size="sm"
      variant="secondary"
      onClick={() => {
        if (manualInstallHint === 'ios') {
          toast('Instalar no iPhone', {
            description: 'No Safari: Compartilhar → Adicionar à Tela de Início.',
            duration: 5000,
          });
          return;
        }
        toast('Instalar no Android', {
          description: 'Abra o menu do navegador e toque em "Instalar app" ou "Adicionar à tela inicial".',
          duration: 5000,
        });
      }}
      title="Instruções para instalar o app"
    >
      <Download className="mr-2 h-4 w-4" />
      Instalar app
    </Button>
  );
}
