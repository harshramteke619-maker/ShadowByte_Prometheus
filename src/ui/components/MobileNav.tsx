// src/ui/components/MobileNav.tsx
import React, { useState, useEffect } from 'react';
import { Home, MessageCircle, Share2, Settings } from 'lucide-react';
import { i18n, Lang } from '../../api';

export type NavTab = 'dashboard' | 'chat' | 'share' | 'setup';

interface MobileNavProps {
  currentTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onChangeTab }) => {
  const [lang, setLang] = useState<Lang>(i18n.getLang());

  useEffect(() => {
    const unsub = i18n.onLangChange((l) => setLang(l));
    return () => unsub();
  }, []);

  const tabs: { key: NavTab; icon: React.ReactNode; labelKey: string }[] = [
    { key: 'dashboard', icon: <Home className="w-5 h-5" />, labelKey: 'home' },
    { key: 'chat', icon: <MessageCircle className="w-5 h-5" />, labelKey: 'chat' },
    { key: 'share', icon: <Share2 className="w-5 h-5" />, labelKey: 'share' },
    { key: 'setup', icon: <Settings className="w-5 h-5" />, labelKey: 'setup' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 backdrop-blur-xl border-t border-cream-200/80 safe-bottom"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around px-2 py-1.5">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onChangeTab(tab.key)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all btn-press min-h-[44px] ${
                isActive
                  ? 'text-sage-600'
                  : 'text-navy-200 hover:text-navy-400'
              }`}
              aria-label={i18n.t(tab.labelKey)}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className={`transition-transform ${isActive ? 'scale-110' : ''}`}>
                {tab.icon}
              </span>
              <span className={`text-[10px] mt-0.5 font-semibold ${isActive ? 'text-sage-600' : 'text-navy-200'}`}>
                {i18n.t(tab.labelKey)}
              </span>
              {isActive && (
                <span className="w-5 h-0.5 bg-sage-400 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
