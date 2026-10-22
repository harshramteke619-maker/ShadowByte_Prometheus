// src/ui/components/HeroGreeting.tsx
import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { data, i18n, UserProgress, Lang } from '../../api';

interface HeroGreetingProps {
  onOpenChat: () => void;
}

export const HeroGreeting: React.FC<HeroGreetingProps> = ({ onOpenChat }) => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [lang, setLang] = useState<Lang>(i18n.getLang());

  useEffect(() => {
    data.getProgress().then(setProgress);
    const unsub = i18n.onLangChange((l) => setLang(l));
    return () => unsub();
  }, []);

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (lang === 'hi') {
      if (hour < 12) return 'सुप्रभात';
      if (hour < 17) return 'नमस्कार';
      return 'शुभ संध्या';
    }
    if (lang === 'mr') {
      if (hour < 12) return 'सुप्रभात';
      if (hour < 17) return 'नमस्कार';
      return 'शुभ संध्याकाळ';
    }
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const subtitle: Record<Lang, string> = {
    en: 'Your focused study session starts here. Pick up where you left off.',
    hi: 'आपका केंद्रित अध्ययन यहाँ शुरू होता है। जहाँ छोड़ा था वहाँ से आगे बढ़ें।',
    mr: 'तुमचे केंद्रित अभ्यास सत्र येथे सुरू होते. जिथे सोडले तिथून पुढे चला.',
  };

  return (
    <section className="animate-slide-down stagger-1" aria-labelledby="hero-heading">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sage-500 via-sage-600 to-sage-700 p-6 sm:p-8 lg:p-10 shadow-lg">
        {/* Decorative blurred shapes */}
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-40 h-40 rounded-full bg-amber-400/8 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="space-y-3 max-w-lg">
            <div className="flex items-center gap-2 text-sage-200/80 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>
                {progress
                  ? `${i18n.t('level')} ${progress.level} · ${progress.xp} ${i18n.t('xp')}`
                  : ''}
              </span>
            </div>

            <h1
              id="hero-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight"
            >
              {getGreeting()},
              <br />
              <span className="font-serif font-normal italic text-cream-200/90">
                {lang === 'hi'
                  ? 'आज कुछ नया सीखें?'
                  : lang === 'mr'
                  ? 'आज काहीतरी नवीन शिकूया?'
                  : 'ready to learn something new?'}
              </span>
            </h1>

            <p className="text-sage-100/70 text-sm leading-relaxed max-w-md">
              {subtitle[lang]}
            </p>
          </div>

          <button
            onClick={onOpenChat}
            className="self-start sm:self-center shrink-0 flex items-center gap-2.5 bg-white/15 hover:bg-white/25 text-white font-semibold px-5 py-3 rounded-2xl text-sm backdrop-blur-sm border border-white/10 transition-all btn-press"
            aria-label={i18n.t('chat')}
          >
            <span>{i18n.t('chat')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Streak / stats quick strip */}
        {progress && (
          <div className="relative z-10 mt-6 flex items-center gap-4 sm:gap-6 text-sm">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/5">
              <span className="text-amber-300 font-bold text-base">🔥</span>
              <span className="text-white/90 font-semibold">
                {progress.streak} {i18n.t('streak')}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/5">
              <span className="text-amber-300 font-bold text-base">⭐</span>
              <span className="text-white/90 font-semibold">
                {progress.xp} {i18n.t('xp')}
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/5">
              <span className="text-white/90 font-semibold">
                {progress.completedModules.length} {i18n.t('completed')}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
