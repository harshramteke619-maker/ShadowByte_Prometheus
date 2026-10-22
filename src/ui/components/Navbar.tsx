// src/ui/components/Navbar.tsx
import React from 'react';
import { i18n } from '../../api';

export type TabType = 'home' | 'chat' | 'share' | 'setup';

interface NavbarProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onChangeTab }) => {
  const tabs: { key: TabType; labelKey: string; icon: string }[] = [
    { key: 'home', labelKey: 'home', icon: '🏠' },
    { key: 'chat', labelKey: 'chat', icon: '💬' },
    { key: 'share', labelKey: 'share', icon: '📲' },
    { key: 'setup', labelKey: 'setup', icon: '⚙️' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onChangeTab(tab.key)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all active:scale-95 touch-manipulation ${
                isActive
                  ? 'text-indigo-600 font-extrabold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <span className="text-xl mb-0.5">{tab.icon}</span>
              <span className="text-[10px] leading-tight">{i18n.t(tab.labelKey)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
