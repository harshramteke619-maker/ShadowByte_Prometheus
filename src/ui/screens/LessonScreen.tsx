// src/ui/screens/LessonScreen.tsx
import React, { useState, useEffect } from 'react';
import { data, voice, i18n, Module, Lang } from '../../api';

interface LessonScreenProps {
  moduleId: string;
  onBack: () => void;
  onStartQuiz: (moduleId: string) => void;
}

export const LessonScreen: React.FC<LessonScreenProps> = ({ moduleId, onBack, onStartQuiz }) => {
  const [mod, setMod] = useState<Module | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLang, setCurrentLang] = useState<Lang>(i18n.getLang());

  useEffect(() => {
    data.getModules().then((list) => {
      const found = list.find((m) => m.id === moduleId);
      if (found) setMod(found);
    });

    const unsub = i18n.onLangChange((l) => setCurrentLang(l));
    return () => {
      unsub();
      voice.stopSpeaking();
    };
  }, [moduleId]);

  if (!mod) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading module...
      </div>
    );
  }

  const title = mod.title[currentLang] || mod.title.en;
  const explanation = mod.explanation[currentLang] || mod.explanation.en;

  const handleToggleVoice = () => {
    if (isPlaying) {
      voice.stopSpeaking();
      setIsPlaying(false);
      return;
    }
    voice.speak(`${title}. ${explanation}`, currentLang);
    setIsPlaying(true);
    const duration = Math.max(3000, (explanation.length / 8) * 1000);
    setTimeout(() => setIsPlaying(false), duration);
  };

  return (
    <div className="p-4 space-y-5 pb-24 max-w-lg mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            voice.stopSpeaking();
            onBack();
          }}
          className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-bold text-xs bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs"
        >
          ← {i18n.t('home')}
        </button>

        <button
          onClick={handleToggleVoice}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
            isPlaying
              ? 'bg-rose-500 text-white animate-pulse'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          <span>{isPlaying ? '⏹️' : '🔊'}</span>
          <span>{isPlaying ? i18n.t('stopAudio') : i18n.t('listenLesson')}</span>
        </button>
      </div>

      {/* Lesson Header */}
      <div className="space-y-1">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{mod.subject}</span>
        <h1 className="text-xl font-extrabold text-slate-900 leading-tight">{title}</h1>
      </div>

      {/* Visual / Diagram Box */}
      {mod.visual && (
        <div className="bg-gradient-to-br from-indigo-50 to-slate-100 rounded-2xl p-6 border border-indigo-100 flex items-center justify-center text-3xl shadow-inner">
          <span className="tracking-widest">{mod.visual}</span>
        </div>
      )}

      {/* Explanation Text */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {currentLang === 'hi' ? 'पाठ्य सामग्री' : currentLang === 'mr' ? 'अभ्यास घटक' : 'Lesson Content'}
        </h3>
        <p className="text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-line">
          {explanation}
        </p>
      </div>

      {/* Start Quiz Action */}
      <div className="pt-2">
        <button
          onClick={() => {
            voice.stopSpeaking();
            onStartQuiz(mod.id);
          }}
          className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
        >
          <span>✍️ {i18n.t('startQuiz')}</span>
          <span className="text-xs bg-emerald-800/40 px-2 py-0.5 rounded-full">+10 XP</span>
        </button>
      </div>
    </div>
  );
};
