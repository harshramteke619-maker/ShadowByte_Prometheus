// src/ui/components/OfflineBadge.tsx
import React from 'react';
import { usePWAStatus } from '../../pwa/usePWAStatus';
import { i18n } from '../../api';

export const OfflineBadge: React.FC = () => {
  const { isOnline, isOfflineReady } = usePWAStatus();

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-xs transition-colors ${
        !isOnline || isOfflineReady
          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
          : 'bg-blue-100 text-blue-800 border border-blue-300'
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          !isOnline ? 'bg-amber-500 animate-pulse' : isOfflineReady ? 'bg-emerald-500' : 'bg-blue-500'
        }`}
      />
      <span>
        {!isOnline ? i18n.t('offlineMode') : isOfflineReady ? i18n.t('offlineReady') : i18n.t('online')}
      </span>
    </div>
  );
};
