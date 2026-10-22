// src/ui/screens/SetupScreen.tsx
import React, { useState } from 'react';
import { brain, voice, i18n } from '../../api';

interface SetupScreenProps {
  onComplete: () => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onComplete }) => {
  const [brainProgress, setBrainProgress] = useState(0);
  const [voiceProgress, setVoiceProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleStartDownload = async () => {
    setIsDownloading(true);

    try {
      // Parallel model initialization simulation
      await Promise.all([
        brain.initBrain((p) => setBrainProgress(p)),
        voice.initVoice((p) => setVoiceProgress(p)),
      ]);
      setIsDone(true);
      setTimeout(onComplete, 1000);
    } catch {
      // Never block the user
      setIsDone(true);
      setTimeout(onComplete, 1000);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6 pt-10 text-center">
      <div className="text-5xl">🧠 📡</div>

      <div className="space-y-2">
        <h2 className="text-xl font-black text-slate-900">{i18n.t('offlineBrainSetup')}</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Pre-load offline AI models so voice and personalized tutoring work without internet.
        </p>
      </div>

      <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-left">
        {/* Brain Model Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>Tutor SLM (Qwen / wllama)</span>
            <span className="text-indigo-600">{brainProgress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${brainProgress}%` }}
            />
          </div>
        </div>

        {/* Voice Model Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>Vernacular Voice (Whisper / Piper)</span>
            <span className="text-emerald-600">{voiceProgress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${voiceProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleStartDownload}
          disabled={isDownloading || isDone}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl text-sm shadow-md transition-all active:scale-[0.98]"
        >
          {isDownloading ? 'Downloading Models...' : isDone ? 'Ready! Starting...' : i18n.t('downloadModels')}
        </button>

        <button
          onClick={onComplete}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-3 rounded-2xl text-xs transition-colors"
        >
          {i18n.t('skipSetup')}
        </button>
      </div>
    </div>
  );
};
