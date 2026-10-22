// src/ui/components/SubjectCards.tsx
import React, { useState, useEffect } from 'react';
import {
  FlaskConical, Calculator, BookText, Code, Globe, ChevronRight,
} from 'lucide-react';
import { i18n, data, Lang, Module } from '../../api';
import { AnimatedSection } from './AnimatedSection';

interface SubjectDef {
  key: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  label: Record<Lang, string>;
  moduleId?: string;
}

const SUBJECTS: SubjectDef[] = [
  {
    key: 'science',
    icon: <FlaskConical className="w-5 h-5" />,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200/60',
    label: { en: 'Science', hi: 'विज्ञान', mr: 'विज्ञान' },
    moduleId: 'mod-1',
  },
  {
    key: 'math',
    icon: <Calculator className="w-5 h-5" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200/60',
    label: { en: 'Math', hi: 'गणित', mr: 'गणित' },
  },
  {
    key: 'reading',
    icon: <BookText className="w-5 h-5" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200/60',
    label: { en: 'Reading', hi: 'पठन', mr: 'वाचन' },
  },
  {
    key: 'coding',
    icon: <Code className="w-5 h-5" />,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200/60',
    label: { en: 'Coding', hi: 'कोडिंग', mr: 'कोडिंग' },
  },
  {
    key: 'languages',
    icon: <Globe className="w-5 h-5" />,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200/60',
    label: { en: 'Languages', hi: 'भाषाएँ', mr: 'भाषा' },
    moduleId: 'mod-2',
  },
];

// Simulated progress per subject
const PROGRESS: Record<string, number> = {
  science: 0.65,
  math: 0.40,
  reading: 0.80,
  coding: 0.20,
  languages: 0.30,
};

const LESSONS_COUNT: Record<string, number> = {
  science: 12,
  math: 18,
  reading: 8,
  coding: 15,
  languages: 10,
};

interface SubjectCardsProps {
  onSelectModule?: (moduleId: string) => void;
}

export const SubjectCards: React.FC<SubjectCardsProps> = ({ onSelectModule }) => {
  const [lang, setLang] = useState<Lang>(i18n.getLang());

  useEffect(() => {
    const unsub = i18n.onLangChange((l) => setLang(l));
    return () => unsub();
  }, []);

  return (
    <section aria-labelledby="subjects-heading">
      <div className="flex items-center justify-between mb-4">
        <h2 id="subjects-heading" className="text-base font-bold text-navy-500">
          {lang === 'hi' ? 'विषय' : lang === 'mr' ? 'विषय' : 'Subjects'}
        </h2>
        <button className="text-xs font-semibold text-sage-500 hover:text-sage-700 flex items-center gap-0.5 transition-colors">
          {lang === 'hi' ? 'सभी देखें' : lang === 'mr' ? 'सर्व पहा' : 'View all'}
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {SUBJECTS.map((sub, idx) => {
          const prog = PROGRESS[sub.key] || 0;
          const lessons = LESSONS_COUNT[sub.key] || 0;

          return (
            <AnimatedSection key={sub.key} delay={idx * 60}>
              <button
                onClick={() => sub.moduleId && onSelectModule?.(sub.moduleId)}
                className={`w-full bg-white rounded-2xl border ${sub.borderColor} p-4 text-left card-hover group focus-visible:ring-2 focus-visible:ring-sage-400`}
                aria-label={`${sub.label[lang]}: ${Math.round(prog * 100)}% complete, ${lessons} lessons`}
              >
                <div className={`w-10 h-10 rounded-xl ${sub.bgColor} flex items-center justify-center ${sub.color} mb-3`}>
                  {sub.icon}
                </div>

                <h3 className="text-sm font-bold text-navy-500 mb-0.5">{sub.label[lang]}</h3>
                <p className="text-[11px] text-navy-200 mb-3">
                  {lessons} {lang === 'hi' ? 'पाठ' : lang === 'mr' ? 'धडे' : 'lessons'}
                </p>

                {/* Progress ring mini */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-cream-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full animate-progress-fill ${sub.bgColor.replace('50', '300')}`}
                      style={{
                        width: `${prog * 100}%`,
                        backgroundColor: sub.key === 'science' ? '#6ee7b7' : sub.key === 'math' ? '#93c5fd' : sub.key === 'reading' ? '#c4b5fd' : sub.key === 'coding' ? '#fda4af' : '#fcd34d',
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-navy-300 tabular-nums">{Math.round(prog * 100)}%</span>
                </div>
              </button>
            </AnimatedSection>
          );
        })}
      </div>
    </section>
  );
};
