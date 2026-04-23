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

    // Captura o evento de instalação globalmente para que qualquer botão possa usar
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      window.deferredPWAInstallPrompt = e as BeforeInstallPromptEvent;
      // Notifica os componentes que o prompt está pronto
      window.dispatchEvent(new CustomEvent("pwa-prompt-available"));
    };

    const handleAppInstalled = () => {
      window.deferredPWAInstallPrompt = undefined;
      toast.success("Aplicativo instalado!", {
        description: "Abra o Gêmeos Academia na sua tela inicial para fazer login.",
        duration: 6000,
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
            toast.info("Sistema pronto para uso offline", {
              description: "Os dados foram cacheados e estão acessíveis sem internet.",
              duration: 5000,
            });
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
    // Rastreia se o app já mostrou o aviso de offline nesta sessão
    let hasShownOfflineToast = false;
    // Período inicial onde ignoramos flutuações de rede (comum ao abrir PWA)
    let isSettling = true;

    const onOffline = () => {
      if (isSettling) return;
      if (hasShownOfflineToast) return;

      hasShownOfflineToast = true;
      offlineToastId = toast("Você está offline", {
        description: "Alguns dados podem estar desatualizados.",
        duration: Infinity,
        icon: <WifiOff className="h-4 w-4" />,
      });
    };

    const onOnline = () => {
      if (offlineToastId !== undefined) {
        toast.dismiss(offlineToastId);
        offlineToastId = undefined;
      }

      // Só mostra o sucesso se realmente mostramos o aviso de offline antes
      if (hasShownOfflineToast) {
        toast.success("Conexão restaurada", {
          icon: <Wifi className="h-4 w-4" />,
          duration: 2000,
        });
        hasShownOfflineToast = false;
        
        // Refetch das listas após um pequeno delay para garantir que o SW/Rede estabilizou
        setTimeout(() => {
          queryClient.invalidateQueries();
        }, 1500);
      }
    };

    // Delay inicial para evitar detectar "offline" momentâneo durante o boot do PWA
    const settleTimeout = setTimeout(() => {
      isSettling = false;
      // Check inicial de fato
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

  // --- Back button intercepta modais/drawers abertos ----------------------
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

  return null;
}

/**
 * Botão explícito de instalação.
 * Prioriza a instalação automática (nativa) e oferece fallback de instruções se necessário.
 */
export function InstallAppButton() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [promptReady, setPromptReady] = useState(false);
  const [os, setOs] = useState<'ios' | 'android' | 'other' | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkStatus = () => {
      const nav = window.navigator as Navigator & { standalone?: boolean };
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        nav.standalone === true;
      setIsInstalled(standalone);
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
      // INSTALAÇÃO AUTOMÁTICA (Chrome, Edge, Android Chrome, etc)
      try {
        await promptEvent.prompt();
        const { outcome } = await promptEvent.userChoice;
        if (outcome === 'accepted') {
          window.deferredPWAInstallPrompt = undefined;
          setPromptReady(false);
        }
      } catch (err) {
        console.error("Erro ao iniciar instalação PWA:", err);
      }
    } else {
      // FALLBACK DE INSTRUÇÕES (iOS Safari, etc)
      if (os === 'ios') {
        toast('Instalação no iPhone/iPad', {
          description: 'Toque no ícone "Compartilhar" (quadrado com seta) e selecione "Adicionar à Tela de Início".',
          duration: 8000,
        });
      } else if (os === 'android') {
        toast('Instalação no Android', {
          description: 'Toque nos três pontos do navegador e selecione "Instalar aplicativo" ou "Adicionar à tela inicial".',
          duration: 8000,
        });
      } else {
        toast('Instalação PWA', {
          description: 'Clique no ícone de instalação na barra de endereços do seu navegador.',
          duration: 5000,
        });
      }
    }
  };

  return (
    <Button
      size="sm"
      variant="secondary"
      onClick={handleInstall}
      className="bg-primary/10 hover:bg-primary/20 text-primary border-none font-medium animate-pulse-subtle"
    >
      <Download className="mr-2 h-4 w-4" />
      {promptReady ? 'Instalar App' : 'Como Instalar'}
    </Button>
  );
}
