// src/ui/components/SyncBadge.tsx
import React, { useState, useEffect } from 'react';
import { data, i18n, SyncStatus } from '../../api';

export const SyncBadge: React.FC = () => {
  const [status, setStatus] = useState<SyncStatus>(data.getSyncStatus());

  useEffect(() => {
    const unsub = data.onSyncStatus((newStatus) => {
      setStatus(newStatus);
    });
    return () => unsub();
  }, []);

  const getBadgeStyle = () => {
    switch (status) {
      case 'synced':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'syncing':
        return 'bg-purple-100 text-purple-800 border-purple-300 animate-pulse';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'offline':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'synced':
        return `☁️ ${i18n.t('synced')}`;
      case 'syncing':
        return `🔄 ${i18n.t('syncing')}`;
      case 'pending':
        return `⏳ ${i18n.t('pendingSync')}`;
      case 'offline':
      default:
        return `📵 ${i18n.t('offlineMode')}`;
    }
  };

  return (
    <div
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${getBadgeStyle()}`}
    >
      {getLabel()}
    </div>
  );
};
