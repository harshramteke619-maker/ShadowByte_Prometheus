// src/ui/components/TopNav.tsx
import React, { useState, useEffect } from 'react';
import {
  BookOpen, Bell, User, Moon, Sun, Menu, X, Wifi, WifiOff,
} from 'lucide-react';
import { i18n, data, Lang, SyncStatus } from '../../api';
import { usePWAStatus } from '../../pwa/usePWAStatus';

type NavTab = 'dashboard' | 'chat' | 'share' | 'setup';

interface TopNavProps {
  currentTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export const TopNav: React.FC<TopNavProps> = ({ currentTab, onChangeTab }) => {
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<Lang>(i18n.getLang());
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(data.getSyncStatus());
  const { isOnline } = usePWAStatus();

  useEffect(() => {
    const unsub1 = i18n.onLangChange((l) => setCurrentLang(l));
    const unsub2 = data.onSyncStatus((s) => setSyncStatus(s));
    return () => { unsub1(); unsub2(); };
  }, []);

  const navItems: { key: NavTab; label: string }[] = [
    { key: 'dashboard', label: i18n.t('home') },
    { key: 'chat', label: i18n.t('chat') },
    { key: 'share', label: i18n.t('share') },
    { key: 'setup', label: i18n.t('setup') },
  ];

  const handleLangCycle = () => {
    const langs: Lang[] = ['en', 'hi', 'mr'];
    const idx = langs.indexOf(currentLang);
    i18n.setLang(langs[(idx + 1) % langs.length]);
  };

  const langLabel = currentLang === 'hi' ? 'हिंदी' : currentLang === 'mr' ? 'मराठी' : 'EN';

  return (
    <nav
      className="sticky top-0 z-50 animate-slide-down"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="bg-cream-50/80 backdrop-blur-xl border-b border-cream-300/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-sage-500 flex items-center justify-center shadow-sm">
                <BookOpen className="w-5 h-5 text-white" strokeWidth={2.2} />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold text-navy-500 tracking-tight">StudySpace</span>
                <span className="text-[10px] font-semibold text-sage-400 ml-1.5 tracking-widest uppercase">Offline</span>
              </div>
            </div>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => onChangeTab(item.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all btn-press ${
                    currentTab === item.key
                      ? 'bg-sage-500/10 text-sage-600'
                      : 'text-navy-300 hover:text-navy-500 hover:bg-cream-200/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              {/* Connectivity badge */}
              <div
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                  isOnline
                    ? 'bg-sage-50 text-sage-600 border-sage-200'
                    : 'bg-amber-50 text-amber-600 border-amber-200'
                }`}
                aria-live="polite"
              >
                {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                <span>{isOnline ? i18n.t('online') : i18n.t('offlineReady')}</span>
              </div>

              {/* Language toggle */}
              <button
                onClick={handleLangCycle}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-navy-400 bg-cream-200/60 hover:bg-cream-300/80 transition-colors btn-press border border-cream-300/50"
                aria-label={`Current language: ${langLabel}. Click to switch.`}
              >
                {langLabel}
              </button>

              {/* Theme toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-xl text-navy-300 hover:text-navy-500 hover:bg-cream-200/50 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </button>

              {/* Notifications */}
              <button
                className="relative p-2 rounded-xl text-navy-300 hover:text-navy-500 hover:bg-cream-200/50 transition-colors hidden sm:flex"
                aria-label="Notifications"
              >
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full ring-2 ring-cream-50" />
              </button>

              {/* Profile */}
              <button
                className="w-8 h-8 rounded-full bg-sage-100 border-2 border-sage-200 flex items-center justify-center text-sage-600 hover:border-sage-300 transition-colors hidden sm:flex"
                aria-label="User profile"
              >
                <User className="w-4 h-4" />
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-navy-400 hover:bg-cream-200/50 transition-colors"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cream-50/95 backdrop-blur-xl border-b border-cream-300/60 animate-slide-down">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => { onChangeTab(item.key); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  currentTab === item.key
                    ? 'bg-sage-500/10 text-sage-600'
                    : 'text-navy-400 hover:bg-cream-200/50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="flex items-center gap-2 px-4 pt-2">
              {isOnline ? (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-sage-500">
                  <Wifi className="w-3.5 h-3.5" /> {i18n.t('online')}
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-500">
                  <WifiOff className="w-3.5 h-3.5" /> {i18n.t('offlineReady')}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
