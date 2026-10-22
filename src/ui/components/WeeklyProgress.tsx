// src/ui/components/WeeklyProgress.tsx
import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, Target, Flame } from 'lucide-react';
import { i18n, Lang } from '../../api';
import { AnimatedSection } from './AnimatedSection';

const DAILY_HOURS = [1.5, 2.0, 0.5, 1.8, 2.5, 1.2, 0];
const DAY_LABELS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_LABELS_HI = ['सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'रवि'];
const DAY_LABELS_MR = ['सोम', 'मंग', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'रवि'];

const MAX_HOUR = Math.max(...DAILY_HOURS, 1);

export const WeeklyProgress: React.FC = () => {
  const [lang, setLang] = useState<Lang>(i18n.getLang());

  useEffect(() => {
    const unsub = i18n.onLangChange((l) => setLang(l));
    return () => unsub();
  }, []);

  const dayLabels = lang === 'hi' ? DAY_LABELS_HI : lang === 'mr' ? DAY_LABELS_MR : DAY_LABELS_EN;
  const totalHours = DAILY_HOURS.reduce((a, b) => a + b, 0);
  const todayIndex = new Date().getDay(); // 0=Sun, shift to Mon-based
  const todayMon = todayIndex === 0 ? 6 : todayIndex - 1;

  const stats = [
    {
      icon: <BarChart3 className="w-4 h-4" />,
      label: lang === 'hi' ? 'कुल घंटे' : lang === 'mr' ? 'एकूण तास' : 'Total Hours',
      value: `${totalHours.toFixed(1)}h`,
      color: 'text-sage-600 bg-sage-50',
    },
    {
      icon: <Target className="w-4 h-4" />,
      label: lang === 'hi' ? 'पूरे सत्र' : lang === 'mr' ? 'पूर्ण सत्रे' : 'Sessions',
      value: '14',
      color: 'text-blue-600 bg-blue-50',
    },
    {
      icon: <Flame className="w-4 h-4" />,
      label: lang === 'hi' ? 'स्ट्रीक' : lang === 'mr' ? 'स्ट्रीक' : 'Streak',
      value: `3 ${lang === 'hi' ? 'दिन' : lang === 'mr' ? 'दिवस' : 'days'}`,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      icon: <TrendingUp className="w-4 h-4" />,
      label: lang === 'hi' ? 'पूर्णता' : lang === 'mr' ? 'पूर्णता' : 'Completion',
      value: '72%',
      color: 'text-purple-600 bg-purple-50',
    },
  ];

  return (
    <section aria-labelledby="weekly-heading">
      <h2 id="weekly-heading" className="text-base font-bold text-navy-500 mb-4">
        {lang === 'hi' ? 'साप्ताहिक प्रगति' : lang === 'mr' ? 'साप्ताहिक प्रगती' : 'Weekly Progress'}
      </h2>

      <div className="bg-white rounded-3xl border border-cream-200/80 shadow-sm p-5 sm:p-6 space-y-5">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((stat, idx) => (
            <AnimatedSection key={stat.label} delay={idx * 60}>
              <div className="bg-cream-50/60 rounded-2xl p-3.5 border border-cream-200/50 text-center">
                <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                  {stat.icon}
                </div>
                <div className="text-lg font-extrabold text-navy-500 tabular-nums">{stat.value}</div>
                <div className="text-[10px] font-semibold text-navy-200 uppercase tracking-wider mt-0.5">
                  {stat.label}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Bar chart */}
        <div>
          <div className="flex items-end justify-between gap-2 h-32 px-1">
            {DAILY_HOURS.map((hours, idx) => {
              const heightPct = (hours / MAX_HOUR) * 100;
              const isToday = idx === todayMon;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-bold text-navy-300 tabular-nums">
                    {hours > 0 ? `${hours}h` : ''}
                  </span>
                  <div className="w-full relative flex-1 flex items-end">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-700 animate-progress-fill ${
                        isToday
                          ? 'bg-sage-400'
                          : hours === 0
                          ? 'bg-cream-200'
                          : 'bg-sage-200'
                      }`}
                      style={{
                        height: `${Math.max(heightPct, 4)}%`,
                        animationDelay: `${idx * 80}ms`,
                      }}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-semibold ${
                      isToday ? 'text-sage-600' : 'text-navy-200'
                    }`}
                  >
                    {dayLabels[idx]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
