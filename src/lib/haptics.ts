/**
 * Feedback tátil leve para reforçar a sensação de app nativo.
 *
 * - Android/Chromium: usa navigator.vibrate (requer gesto do usuário).
 * - iOS Safari: ignora silenciosamente (sem erro).
 *
 * As durações seguem o padrão HIG: muito curtas (5–30ms). Vibrações longas
 * não são "haptics", são "notificação".
 */

type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

const patterns: Record<HapticStyle, number | number[]> = {
  light: 8,
  medium: 15,
  heavy: 25,
  success: [10, 40, 10],
  warning: [20, 60, 20],
  error: [30, 50, 30, 50, 30],
};

export function haptic(style: HapticStyle = 'light') {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
  // prefers-reduced-motion também silencia vibrações (usuários com sensibilidade)
  if (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }
  try {
    navigator.vibrate(patterns[style]);
  } catch {
    /* não quebra a ação do usuário se o vibrate falhar */
  }
}
