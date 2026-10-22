// src/ui/screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import { data, i18n, Module, UserProgress, Lang } from '../../api';

interface HomeScreenProps {
  onSelectModule: (moduleId: string) => void;
  onOpenChat: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectModule, onOpenChat }) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [currentLang, setCurrentLang] = useState<Lang>(i18n.getLang());

  useEffect(() => {
    data.initData().then(() => {
      data.getModules().then(setModules);
      data.getProgress().then(setProgress);
    });

    const unsub = i18n.onLangChange((l) => setCurrentLang(l));
    return () => unsub();
  }, []);

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Quick Doubt Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-4 text-white shadow-md flex items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-base font-bold">
            {currentLang === 'hi'
              ? 'कोई शंका है? बोलकर पूछें'
              : currentLang === 'mr'
              ? 'काही शंका आहे? बोलून विचारा'
              : 'Have a doubt? Ask by Voice'}
          </h2>
          <p className="text-xs text-indigo-100">
            {currentLang === 'hi'
              ? 'इंटरनेट के बिना अपनी भाषा में उत्तर पाएं'
              : currentLang === 'mr'
              ? 'इंटरनेटशिवाय आपल्या भाषेत उत्तरे मिळवा'
              : 'Works 100% offline in your local language'}
          </p>
        </div>
        <button
          onClick={onOpenChat}
          className="bg-white text-indigo-700 font-bold px-3 py-2 rounded-xl text-xs shadow-xs hover:bg-indigo-50 active:scale-95 transition-all whitespace-nowrap"
        >
          🎙️ {i18n.t('chat')}
        </button>
      </div>

      {/* Modules List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            {currentLang === 'hi' ? 'अध्ययन अध्याय' : currentLang === 'mr' ? 'अभ्यास घटक' : 'Study Modules'}
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            {modules.length} {currentLang === 'hi' ? 'पाठ' : currentLang === 'mr' ? 'धडे' : 'Chapters'}
          </span>
        </div>

        <div className="grid gap-3">
          {modules.map((mod) => {
            const masteryVal = progress?.mastery[mod.id] || 0;
            const isCompleted = progress?.completedModules.includes(mod.id);
            const title = mod.title[currentLang] || mod.title.en;
            const explanation = mod.explanation[currentLang] || mod.explanation.en;

            return (
              <div
                key={mod.id}
                onClick={() => onSelectModule(mod.id)}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all active:scale-[0.99] cursor-pointer space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                      {mod.subject}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 leading-snug">{title}</h4>
                  </div>
                  {isCompleted && (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      ✓ {i18n.t('completed')}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{explanation}</p>

                {/* Mastery Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                    <span>{i18n.t('mastery')}</span>
                    <span className="text-indigo-600">{Math.round(masteryVal * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        masteryVal >= 0.8
                          ? 'bg-emerald-500'
                          : masteryVal >= 0.4
                          ? 'bg-indigo-500'
                          : 'bg-amber-400'
                      }`}
                      style={{ width: `${Math.round(masteryVal * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
