// src/pwa/usePWAStatus.ts
import { useState, useEffect } from 'react';

export interface PWAStatus {
  isOnline: boolean;
  isOfflineReady: boolean;
  isInstalled: boolean;
}

export function usePWAStatus(): PWAStatus {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isOfflineReady, setIsOfflineReady] = useState<boolean>(true);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check if app is installed as standalone PWA
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    // If service worker is active, mark offline ready
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      setIsOfflineReady(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, isOfflineReady, isInstalled };
}
