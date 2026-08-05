import type { PWAPlatform } from './pwa.types';

export function isPWAStandalone() {
  const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean };

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    navigatorWithStandalone.standalone === true ||
    document.referrer.includes('android-app://')
  );
}

export function detectPWAPlatform(userAgent = window.navigator.userAgent): PWAPlatform {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return 'ios';
  if (/Android/i.test(userAgent)) return 'android';
  return 'other';
}
