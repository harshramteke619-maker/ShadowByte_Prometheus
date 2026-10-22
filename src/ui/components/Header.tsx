// src/ui/components/Header.tsx
import React, { useState, useEffect } from 'react';
import { OfflineBadge } from './OfflineBadge';
import { SyncBadge } from './SyncBadge';
import { LangToggle } from './LangToggle';
import { data, i18n, UserProgress } from '../../api';

export const Header: React.FC = () => {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  const refreshProgress = async () => {
    const p = await data.getProgress();
    setProgress(p);
  };

  useEffect(() => {
    refreshProgress();
    const interval = setInterval(refreshProgress, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5 shadow-xs">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <OfflineBadge />
          <SyncBadge />
        </div>
        <LangToggle />
      </div>

      {progress && (
        <div className="flex items-center justify-between bg-indigo-50/80 rounded-xl px-3 py-1.5 border border-indigo-100 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <span className="text-base">🔥</span>
            <span>
              <strong className="text-orange-600 font-bold">{progress.streak}</strong> {i18n.t('streak')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 font-medium text-slate-700">
              <span className="text-base">⭐</span>
              <span>
                <strong className="text-indigo-600 font-bold">{progress.xp}</strong> {i18n.t('xp')}
              </span>
            </div>
            <div className="bg-indigo-600 text-white font-bold px-2 py-0.5 rounded-full text-[10px]">
              {i18n.t('level')} {progress.level}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
