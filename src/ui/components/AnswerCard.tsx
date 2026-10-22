// src/ui/components/AnswerCard.tsx
import React, { useState } from 'react';
import { TutorAnswer, voice, i18n } from '../../api';

interface AnswerCardProps {
  answer: TutorAnswer;
}

export const AnswerCard: React.FC<AnswerCardProps> = ({ answer }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = () => {
    if (isPlaying) {
      voice.stopSpeaking();
      setIsPlaying(false);
      return;
    }
    voice.speak(answer.text, i18n.getLang());
    setIsPlaying(true);
    // Auto reset state after speaking approximation
    const duration = Math.max(2000, (answer.text.length / 10) * 1000);
    setTimeout(() => setIsPlaying(false), duration);
  };

  const getSourceBadge = () => {
    switch (answer.source) {
      case 'curated':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-semibold px-2 py-0.5 rounded-md">
            📚 {i18n.t('sourceCurated')}
          </span>
        );
      case 'slm':
        return (
          <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 border border-indigo-300 text-[11px] font-semibold px-2 py-0.5 rounded-md">
            ⚡ {i18n.t('sourceSLM')}
          </span>
        );
      case 'fallback':
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 border border-slate-300 text-[11px] font-semibold px-2 py-0.5 rounded-md">
            💡 {i18n.t('sourceFallback')}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {getSourceBadge()}
          <span className="text-[10px] text-slate-500 font-mono">{answer.ms}ms</span>
        </div>

        <button
          type="button"
          onClick={handleSpeak}
          title={isPlaying ? i18n.t('stopAudio') : i18n.t('listenLesson')}
          className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            isPlaying
              ? 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse'
              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
          }`}
        >
          <span>{isPlaying ? '⏹️' : '🔊'}</span>
          <span>{isPlaying ? i18n.t('stopAudio') : i18n.t('listenLesson')}</span>
        </button>
      </div>

      <div className="text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-wrap">
        {answer.text}
      </div>
    </div>
  );
};
