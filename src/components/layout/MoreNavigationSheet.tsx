import { X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { BottomNavItem } from './bottom-nav.items';

interface MoreNavigationSheetProps {
  open: boolean;
  items: BottomNavItem[];
  onClose: () => void;
}

export function MoreNavigationSheet({ open, items, onClose }: MoreNavigationSheetProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="more-navigation-title"
    >
      <div
        className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto overscroll-contain rounded-t-2xl border-t border-border bg-card p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-muted" aria-hidden="true" />
        <div className="mb-3 flex items-center justify-between">
          <h2 id="more-navigation-title" className="text-base font-semibold text-foreground">
            Mais opções
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.url}>
                <NavLink
                  to={item.url}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex min-h-[80px] flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-2 py-3 text-xs transition-colors',
                      isActive
                        ? 'border-primary font-semibold text-primary'
                        : 'text-foreground hover:bg-accent',
                    )
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-center leading-tight">{item.title}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
