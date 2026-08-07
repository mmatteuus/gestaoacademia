import { LogOut } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { InstallAppButton } from '@/components/pwa/PWAProvider';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/AuthContext';
import { APP_PAGE_TITLES } from './app-topbar.pages';
import { OfflineQueueBadge } from './OfflineQueueBadge';
import { ThemeToggleButton } from './ThemeToggleButton';
import { TopbarSearch } from './search/TopbarSearch';

export function AppTopbar() {
  const location = useLocation();
  const { logout } = useAuth();
  const title = APP_PAGE_TITLES[location.pathname] ?? 'Gêmeos Academia';

  return (
    <header className="border-tech sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-border/80 bg-background/70 px-3 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sm:h-16 sm:px-4">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <Logo />
        <h2 className="truncate text-sm font-semibold text-foreground sm:text-base">{title}</h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <OfflineQueueBadge />
        <InstallAppButton />
        <TopbarSearch />
        <ThemeToggleButton />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-muted-foreground hover:text-foreground"
          onClick={logout}
          aria-label="Sair"
          title="Sair"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
