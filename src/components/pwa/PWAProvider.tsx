import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Wifi, WifiOff, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

// Tipagem para o evento de instalação do PWA
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Estendendo o objeto window para suportar o evento de instalação globalmente
declare global {
  interface Window {
    deferredPWAInstallPrompt?: BeforeInstallPromptEvent;
  }
}

/**
 * Registra o Service Worker (gerado pelo vite-plugin-pwa), monitora
 * atualizações e status online/offline, e captura o evento de instalação
 * para oferecer um botão "Instalar app" no momento certo.
 */
export function PWAProvider() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detecta se o app foi aberto como PWA (standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone || 
                        document.referrer.includes('android-app://');

    if (isStandalone) {
      sessionStorage.setItem('pwa-mode', 'true');
      console.log('App rodando em modo PWA Standalone');
      
      // Se estamos no PWA e não estamos na tela de login ou cadastro, 
      // e não estamos autenticados (isso será checado pelo AuthGate), 
      // o start_url: /login já cuida disso.
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Previne o mini-infobar do Chrome no Android para usarmos nossa UI premium
      e.preventDefault();
      window.deferredPWAInstallPrompt = e as BeforeInstallPromptEvent;
      console.log('PWA: Prompt de instalação capturado');
      window.dispatchEvent(new CustomEvent("pwa-prompt-available"));
    };

    const handleAppInstalled = () => {
      window.deferredPWAInstallPrompt = undefined;
      toast.success("Aplicativo instalado!", {
        description: "Gêmeos Academia agora está na sua tela inicial.",
        duration: 5000,
      });
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // --- Registro do SW + detecção de update -------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    
    // Em produção ou preview, registramos o SW
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocal && !import.meta.env.VITE_ENABLE_PWA_DEV) return;

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
            toast.info("Pronto para uso offline", {
              description: "O sistema funcionará mesmo sem internet.",
              duration: 5000,
            });
          },
        });
      })
      .catch((err) => {
        console.warn('PWA: Erro ao registrar SW:', err);
      });
  }, []);

  // --- Online/Offline badge ---------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    let offlineToastId: string | number | undefined;
    let hasShownOfflineToast = false;
    let isSettling = true;

    const onOffline = () => {
      if (isSettling) return;
      if (hasShownOfflineToast) return;

      hasShownOfflineToast = true;
      offlineToastId = toast.error("Sem conexão com a internet", {
        description: "Você ainda pode visualizar dados salvos, mas alterações podem não ser sincronizadas agora.",
        duration: Infinity,
        icon: <WifiOff className="h-4 w-4" />,
      });
    };

    const onOnline = () => {
      if (offlineToastId !== undefined) {
        toast.dismiss(offlineToastId);
        offlineToastId = undefined;
      }

      if (hasShownOfflineToast) {
        toast.success("Conexão restaurada", {
          description: "Sincronizando dados com o servidor...",
          icon: <Wifi className="h-4 w-4" />,
          duration: 3000,
        });
        hasShownOfflineToast = false;
        
        setTimeout(() => {
          queryClient.invalidateQueries();
        }, 1500);
      }
    };

    const settleTimeout = setTimeout(() => {
      isSettling = false;
      if (!navigator.onLine) {
        onOffline();
      }
    }, 2000);

    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);

    return () => {
      clearTimeout(settleTimeout);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
      if (offlineToastId !== undefined) toast.dismiss(offlineToastId);
    };
  }, [queryClient]);

  return null;
}

/**
 * Botão de instalação aprimorado.
 * Se o prompt nativo estiver pronto, ele dispara imediatamente.
 * Se não, ele tenta ser o mais útil possível.
 */
export function InstallAppButton() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [promptReady, setPromptReady] = useState(false);
  const [os, setOs] = useState<'ios' | 'android' | 'other' | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkStatus = () => {
      const nav = window.navigator as any;
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        nav.standalone === true;
      
      setIsInstalled(isStandalone);
      setPromptReady(!!window.deferredPWAInstallPrompt);

      const ua = window.navigator.userAgent;
      if (/iPhone|iPad|iPod/i.test(ua)) setOs('ios');
      else if (/Android/i.test(ua)) setOs('android');
      else setOs('other');
    };

    checkStatus();
    
    const onPromptAvailable = () => setPromptReady(true);
    window.addEventListener("pwa-prompt-available", onPromptAvailable);
    window.addEventListener("appinstalled", () => setIsInstalled(true));

    return () => {
      window.removeEventListener("pwa-prompt-available", onPromptAvailable);
    };
  }, []);

  if (isInstalled) return null;

  const handleInstall = async () => {
    const promptEvent = window.deferredPWAInstallPrompt;
    
    if (promptEvent) {
      try {
        await promptEvent.prompt();
        const { outcome } = await promptEvent.userChoice;
        if (outcome === 'accepted') {
          window.deferredPWAInstallPrompt = undefined;
          setPromptReady(false);
        }
      } catch (err) {
        console.error("Erro PWA:", err);
        toast.error("Não foi possível abrir o instalador.");
      }
    } else {
      // Fallback aprimorado com diálogos mais bonitos
      if (os === 'ios') {
        toast('Instalar no iPhone', {
          description: '1. Toque no ícone de Compartilhar\n2. Role para baixo e toque em "Adicionar à Tela de Início"',
          duration: 8000,
          icon: <Download className="h-4 w-4" />
        });
      } else {
        toast('Instalar Aplicativo', {
          description: 'Use o menu do navegador (três pontos) e selecione "Instalar" ou "Adicionar à tela inicial".',
          duration: 6000,
          icon: <Download className="h-4 w-4" />
        });
      }
    }
  };

  return (
    <Button
      size="sm"
      variant="default"
      onClick={handleInstall}
      className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-900/20 px-6 transition-all active:scale-95"
    >
      <Download className="mr-2 h-4 w-4" />
      {promptReady ? 'Instalar App Agora' : 'Como Instalar'}
    </Button>
  );
}

