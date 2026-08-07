import { NavLink } from 'react-router-dom';
import { haptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import type { BottomNavItem } from './bottom-nav.items';

interface PrimaryBottomNavLinkProps {
  item: BottomNavItem;
}

export function PrimaryBottomNavLink({ item }: PrimaryBottomNavLinkProps) {
  const Icon = item.icon;

  return (
    <li className="flex">
      <NavLink
        to={item.url}
        end={item.url === '/'}
        onClick={() => haptic('light')}
        className={({ isActive }) =>
          cn(
            'flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] transition-colors sm:text-xs',
            isActive
              ? 'font-semibold text-primary'
              : 'text-muted-foreground hover:text-foreground',
          )
        }
      >
        {({ isActive }) => (
          <>
            <span
              className={cn(
                'relative flex h-7 w-7 items-center justify-center rounded-lg transition-all sm:h-8 sm:w-8',
                isActive && 'bg-primary/15 ring-1 ring-primary/40 glow-primary-sm',
              )}
            >
              <Icon className={cn('h-5 w-5', isActive && 'text-primary')} />
            </span>
            <span className="leading-none">{item.title}</span>
          </>
        )}
      </NavLink>
    </li>
  );
}
