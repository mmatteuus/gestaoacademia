import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { haptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import {
  primaryBottomNavItems,
  secondaryBottomNavItems,
} from './bottom-nav.items';
import { MoreNavigationSheet } from './MoreNavigationSheet';
import { PrimaryBottomNavLink } from './PrimaryBottomNavLink';

export function BottomNav() {
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const moreActive = secondaryBottomNavItems.some(
    (item) => location.pathname === item.url,
  );

  const openMore = () => {
    haptic('light');
    setMoreOpen(true);
  };

  return (
    <>
      <nav
        aria-label="Navegação principal"
        className="border-tech fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/85"
      >
        <p className="border-b border-border/40 pb-0.5 pt-1 text-center text-[10px] leading-none text-muted-foreground/70">
          Desenvolvido por{' '}
          <a
            href="https://www.mtsferreira.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            MtsFerreira
          </a>
        </p>

        <ul className="mx-auto grid max-w-3xl grid-cols-5 items-stretch">
          {primaryBottomNavItems.map((item) => (
            <PrimaryBottomNavLink key={item.url} item={item} />
          ))}
          <li className="flex">
            <button
              type="button"
              onClick={openMore}
              aria-haspopup="dialog"
              aria-expanded={moreOpen}
              className={cn(
                'flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] transition-colors sm:text-xs',
                moreActive
                  ? 'font-semibold text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <MoreHorizontal className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="leading-none">Mais</span>
            </button>
          </li>
        </ul>
      </nav>

      <MoreNavigationSheet
        open={moreOpen}
        items={secondaryBottomNavItems}
        onClose={() => setMoreOpen(false)}
      />
    </>
  );
}
