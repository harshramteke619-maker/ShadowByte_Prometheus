// src/ui/components/ContinueLearning.tsx
import React, { useState, useEffect } from 'react';
import { ArrowRight, BookOpen, PlayCircle } from 'lucide-react';
import { i18n, data, Lang, Module } from '../../api';
import { AnimatedSection } from './AnimatedSection';

interface ContinueLearningProps {
  onSelectModule: (moduleId: string) => void;
}

export const ContinueLearning: React.FC<ContinueLearningProps> = ({ onSelectModule }) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [lang, setLang] = useState<Lang>(i18n.getLang());
  const [mastery, setMastery] = useState<Record<string, number>>({});

  useEffect(() => {
    data.getModules().then(setModules);
    data.getProgress().then((p) => setMastery(p.mastery));
    const unsub = i18n.onLangChange((l) => setLang(l));
    return () => unsub();
  }, []);

  // Thumbnail gradient patterns per module
  const gradients = [
    'from-emerald-400/20 via-sage-300/15 to-cream-200/10',
    'from-blue-400/20 via-indigo-300/15 to-cream-200/10',
    'from-amber-400/20 via-orange-300/15 to-cream-200/10',
  ];

  return (
    <section aria-labelledby="continue-heading">
      <div className="flex items-center justify-between mb-4">
        <h2 id="continue-heading" className="text-base font-bold text-navy-500">
          {lang === 'hi' ? 'अपना अभ्यास जारी रखें' : lang === 'mr' ? 'अभ्यास सुरू ठेवा' : 'Continue Learning'}
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {modules.map((mod, idx) => {
          const title = mod.title[lang] || mod.title.en;
          const explanation = mod.explanation[lang] || mod.explanation.en;
          const prog = mastery[mod.id] || 0;
          const gradient = gradients[idx % gradients.length];

          return (
            <AnimatedSection key={mod.id} delay={idx * 80}>
              <div
                onClick={() => onSelectModule(mod.id)}
                className="bg-white rounded-2xl border border-cream-200/80 overflow-hidden card-hover cursor-pointer group"
                role="button"
                tabIndex={0}
                aria-label={`${title}: ${Math.round(prog * 100)}% complete`}
              >
                {/* Thumbnail / Visual area */}
                <div className={`h-28 bg-gradient-to-br ${gradient} relative flex items-center justify-center overflow-hidden`}>
                  <div className="text-4xl tracking-widest opacity-60">{mod.visual || '📘'}</div>
                  {/* Overlay play icon on hover */}
                  <div className="absolute inset-0 bg-navy-500/0 group-hover:bg-navy-500/10 transition-colors flex items-center justify-center">
                    <PlayCircle className="w-10 h-10 text-white/0 group-hover:text-white/80 transition-all drop-shadow-md" />
                  </div>
                  {/* Subject badge */}
                  <span className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-[10px] font-bold text-navy-400 px-2 py-0.5 rounded-md border border-white/50 uppercase tracking-wider">
                    {mod.subject}
                  </span>
                </div>

                {/* Card body */}
                <div className="p-4 space-y-3">
                  <h3 className="text-sm font-bold text-navy-500 leading-snug group-hover:text-sage-600 transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs text-navy-300 line-clamp-2 leading-relaxed">{explanation}</p>

                  <div className="flex items-center justify-between pt-1">
                    {/* Progress */}
                    <div className="flex items-center gap-2 flex-1 mr-3">
                      <div className="flex-1 h-1.5 bg-cream-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-sage-400 rounded-full animate-progress-fill"
                          style={{ width: `${prog * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-navy-300 tabular-nums">
                        {Math.round(prog * 100)}%
                      </span>
                    </div>

                    {/* CTA */}
                    <span className="flex items-center gap-1 text-xs font-semibold text-sage-500 group-hover:text-sage-700 transition-colors shrink-0">
                      <BookOpen className="w-3.5 h-3.5" />
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -ml-1 transition-opacity" />
                    </span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          );
        })}
      </div>
    </section>
  );
};
