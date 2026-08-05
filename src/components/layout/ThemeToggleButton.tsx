import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ThemeToggleButton() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const lightActive = resolvedTheme === 'light';
  const label = lightActive
    ? 'Tema claro ativo. Alternar para escuro'
    : 'Tema escuro ativo. Alternar para claro';

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-10 w-10 text-muted-foreground hover:text-foreground"
      onClick={() => setTheme(lightActive ? 'dark' : 'light')}
      aria-label={label}
      title={label}
    >
      {mounted && lightActive ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
