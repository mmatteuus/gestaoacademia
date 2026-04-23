import { useEffect, useRef, useState } from 'react';
import { haptic } from '@/lib/haptics';

/**
 * Pull-to-refresh simples, sem libs.
 *
 * Anexa listeners no elemento passado (ou no window se omitido) e dispara
 * `onRefresh` quando o usuário puxa além do threshold. Devolve:
 *  - `pullDistance`: distância atual em px (0..threshold*1.5) para animar um
 *    indicador.
 *  - `refreshing`: true enquanto onRefresh está pendente.
 *
 * Só ativa quando o scroll está em 0 (não atrapalha scroll normal).
 */
export function usePullToRefresh(
  onRefresh: () => Promise<unknown> | void,
  options?: { threshold?: number; enabled?: boolean; scrollContainer?: HTMLElement | null }
) {
  const threshold = options?.threshold ?? 80;
  const enabled = options?.enabled ?? true;
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const maxPull = threshold * 1.5;

  useEffect(() => {
    if (!enabled) return;
    const container = options?.scrollContainer ?? document.documentElement;

    const onStart = (e: TouchEvent) => {
      if (refreshing) return;
      if (container.scrollTop > 0) return;
      startY.current = e.touches[0].clientY;
    };
    const onMove = (e: TouchEvent) => {
      if (startY.current == null) return;
      if (refreshing) return;
      const dy = e.touches[0].clientY - startY.current;
      if (dy <= 0) {
        setPullDistance(0);
        return;
      }
      // Resistência: reduz a intensidade do pull.
      const resistance = Math.min(dy * 0.5, maxPull);
      setPullDistance(resistance);
    };
    const onEnd = async () => {
      const d = pullDistance;
      startY.current = null;
      if (d >= threshold && !refreshing) {
        haptic('medium');
        setRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setRefreshing(false);
          setPullDistance(0);
        }
      } else {
        setPullDistance(0);
      }
    };

    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd, { passive: true });
    window.addEventListener('touchcancel', onEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('touchcancel', onEnd);
    };
  }, [enabled, onRefresh, pullDistance, refreshing, threshold, maxPull, options?.scrollContainer]);

  return { pullDistance, refreshing, threshold };
}
