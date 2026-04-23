import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Wifi, WifiOff, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { haptic } from "@/lib/haptics";

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
                        (window.navigator as Navigator & { standalone?: boolean }).standalone === true ||
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

    let unmounted = false;
    let disposeRegistrationSync = () => {};

    import("virtual:pwa-register")
      .then(({ registerSW }) => {
        const updateSW = registerSW({
          immediate: true,
          onNeedRefresh() {
            // Verifica se o app está em primeiro plano para mostrar o toast
            if (document.visibilityState === "visible") {
              toast("Nova versão disponível", {
                description: "Atualize para ter as últimas melhorias e correções.",
                duration: Infinity,
                action: {
                  label: "Atualizar agora",
                  onClick: () => {
                    updateSW(true);
                    haptic('light');
                  },
                },
              });
            } else {
              // Se não estiver visível, ainda assim atualizar em segundo plano
              updateSW(false);
            }
          },
          onRegistered(registration) {
            if (!registration) return;

            let updateWaiting = false;

            const checkForUpdates = () => {
              if (updateWaiting) return; // Evitar múltiplas notificações
              
              registration.update().then((newWorker) => {
                if (newWorker) {
                  updateWaiting = true;
                  // Se o usuário estiver visível, mostrar notificação
                  if (document.visibilityState === "visible") {
                    setTimeout(() => {
                      toast("Nova versão baixada", {
                        description: "Reiniciando para aplicar as atualizações...",
                        duration: 3000,
                      });
                      // Forçar recarregagem após um curto delay
                      setTimeout(() => window.location.reload(), 2000);
                    }, 1000);
                  }
                }
              }).catch(() => {
                // Erro silencioso: reconexões instáveis são comuns em PWA móvel.
              });
            };

            const onVisible = () => {
              if (document.visibilityState === "visible") {
                checkForUpdates();
              }
            };

            const onOnline = () => {
              checkForUpdates();
            };

            // Atualização proativa para evitar PWA "presa" em versão antiga.
            const intervalId = window.setInterval(checkForUpdates, 2 * 60 * 1000); // Reduzido para 2 minutos
            window.addEventListener("visibilitychange", onVisible);
            window.addEventListener("online", onOnline);
            window.addEventListener("focus", checkForUpdates); // Verificar quando o app ganhar foco

            disposeRegistrationSync = () => {
              window.clearInterval(intervalId);
              window.removeEventListener("visibilitychange", onVisible);
              window.removeEventListener("online", onOnline);
            };

            // Executa uma checagem inicial após registrar.
            checkForUpdates();

            if (unmounted) {
              disposeRegistrationSync();
            }
          },
          onOfflineReady() {
            toast.info("Pronto para uso offline", {
              description: "O sistema funcionará mesmo sem internet.",
              duration: 5000,
            });
          },
          onRegisterError(error) {
            console.warn("PWA: Falha ao registrar Service Worker:", error);
          },
        });
      })
      .catch((err) => {
        console.warn('PWA: Erro ao registrar SW:', err);
      });

    return () => {
      unmounted = true;
      disposeRegistrationSync();
    };
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
  const [installing, setInstalling] = useState(false);
  const [os, setOs] = useState<'ios' | 'android' | 'other' | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkStatus = () => {
      const nav = window.navigator as Navigator & { standalone?: boolean };
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        nav.standalone === true;

      setIsInstalled(isStandalone);

      const ua = window.navigator.userAgent;
      if (/iPhone|iPad|iPod/i.test(ua)) setOs('ios');
      else if (/Android/i.test(ua)) setOs('android');
      else setOs('other');
    };

    checkStatus();

    const onPromptAvailable = () => {
      // Evento serve como trigger de re-render caso o consumidor queira;
      // hoje o handleInstall lê window.deferredPWAInstallPrompt direto.
    };
    const onInstalled = () => {
      setIsInstalled(true);
      setInstalling(false);
    };
    window.addEventListener("pwa-prompt-available", onPromptAvailable);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("pwa-prompt-available", onPromptAvailable);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (isInstalled) return null;

  const handleInstall = async () => {
    // Feedback tátil imediato — o usuário sente que clicou antes do browser
    // abrir o diálogo do sistema (que pode levar 100–400ms).
    haptic('medium');

    const promptEvent = window.deferredPWAInstallPrompt;

    if (promptEvent) {
      setInstalling(true);
      try {
        // Dispara o diálogo nativo do browser na hora. Não dá pra pular essa
        // confirmação — é regra de segurança dos browsers.
        await promptEvent.prompt();

        // Não ficamos awaiting userChoice: o botão libera rapidamente e
        // o state atualiza via evento "appinstalled" se o usuário aceitar.
        promptEvent.userChoice.then(({ outcome }) => {
          setInstalling(false);
          if (outcome === 'accepted') {
            window.deferredPWAInstallPrompt = undefined;
            haptic('success');
            // "appinstalled" cobre o resto: esconde o botão e mostra toast.
          } else {
            // Usuário cancelou — silêncio é melhor que toast.
          }
        }).catch(() => setInstalling(false));
      } catch (err) {
        setInstalling(false);
        console.error("PWA install falhou:", err);
        toast.error("Não foi possível abrir o instalador.");
      }
    } else {
      // Fallback: browser ainda não emitiu beforeinstallprompt (critério
      // de engajamento não batido) ou plataforma não suporta (iOS Safari).
      if (os === 'ios') {
        toast('Para instalar no iPhone', {
          description: 'Toque em Compartilhar (⎋) e depois em "Adicionar à Tela de Início".',
          duration: 8000,
          icon: <Download className="h-4 w-4" />,
        });
      } else {
        toast('Instalação não disponível ainda', {
          description: 'Use o menu do navegador (⋮) e selecione "Instalar app". Ou volte mais tarde.',
          duration: 6000,
          icon: <Download className="h-4 w-4" />,
        });
      }
    }
  };

  return (
    <Button
      size="sm"
      variant="secondary"
      onClick={handleInstall}
      disabled={installing}
      className="h-9 text-xs sm:text-sm whitespace-nowrap"
      aria-label="Instalar app"
      title="Instalar app"
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
