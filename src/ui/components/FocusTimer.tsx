// src/ui/components/FocusTimer.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { i18n, Lang } from '../../api';

const INITIAL_MINUTES = 25;
const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const FocusTimer: React.FC = () => {
  const [totalSeconds] = useState(INITIAL_MINUTES * 60);
  const [remaining, setRemaining] = useState(INITIAL_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [lang, setLang] = useState<Lang>(i18n.getLang());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const unsub = i18n.onLangChange((l) => setLang(l));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (isRunning && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            setSessions((s) => s + 1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, remaining]);

  const handleStart = useCallback(() => setIsRunning(true), []);
  const handlePause = useCallback(() => setIsRunning(false), []);
  const handleReset = useCallback(() => {
    setIsRunning(false);
    setRemaining(totalSeconds);
  }, [totalSeconds]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const fraction = 1 - remaining / totalSeconds;
  const dashOffset = CIRCUMFERENCE * (1 - fraction);

  const statusLabel = remaining === 0
    ? (lang === 'hi' ? 'सत्र पूरा!' : lang === 'mr' ? 'सत्र पूर्ण!' : 'Session complete!')
    : isRunning
    ? (lang === 'hi' ? 'ध्यान केंद्रित...' : lang === 'mr' ? 'लक्ष केंद्रित...' : 'Focusing...')
    : (lang === 'hi' ? 'शुरू करने के लिए तैयार' : lang === 'mr' ? 'सुरू करण्यास तयार' : 'Ready to focus');

  return (
    <div className="bg-white rounded-3xl border border-cream-200/80 shadow-sm p-6 sm:p-8 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <Clock className="w-4.5 h-4.5 text-amber-500" />
          </div>
          <div>
            <h2 className="text-base font-bold text-navy-500">
              {lang === 'hi' ? 'फोकस टाइमर' : lang === 'mr' ? 'फोकस टायमर' : 'Focus Timer'}
            </h2>
            <p className="text-xs text-navy-300">{statusLabel}</p>
          </div>
        </div>
        <div className="text-xs font-semibold text-navy-200 bg-cream-100 px-2.5 py-1 rounded-lg">
          {sessions} {lang === 'hi' ? 'सत्र' : lang === 'mr' ? 'सत्रे' : 'sessions'}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
        {/* Timer ring */}
        <div className="relative w-36 h-36 shrink-0" role="timer" aria-label={`${minutes} minutes ${seconds} seconds remaining`}>
          <svg className="w-full h-full" viewBox="0 0 120 120">
            <circle className="timer-ring-track" cx="60" cy="60" r={RADIUS} />
            <circle
              className="timer-ring-progress"
              cx="60" cy="60" r={RADIUS}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              style={{ '--ring-circumference': CIRCUMFERENCE } as React.CSSProperties}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-navy-500 tabular-nums tracking-tight">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-[11px] font-medium text-navy-200 mt-0.5">
              {lang === 'hi' ? 'मिनट' : lang === 'mr' ? 'मिनिटे' : 'min'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {!isRunning ? (
            <button
              onClick={handleStart}
              disabled={remaining === 0}
              className="flex items-center gap-2 bg-sage-500 hover:bg-sage-600 disabled:opacity-40 text-white font-semibold px-6 py-3 rounded-2xl text-sm shadow-sm transition-all btn-press"
              aria-label="Start timer"
            >
              <Play className="w-4 h-4" />
              <span>{lang === 'hi' ? 'शुरू' : lang === 'mr' ? 'सुरू' : 'Start'}</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-navy-600 font-semibold px-6 py-3 rounded-2xl text-sm shadow-sm transition-all btn-press"
              aria-label="Pause timer"
            >
              <Pause className="w-4 h-4" />
              <span>{lang === 'hi' ? 'रोकें' : lang === 'mr' ? 'थांबा' : 'Pause'}</span>
            </button>
          )}
          <button
            onClick={handleReset}
            className="p-3 rounded-2xl text-navy-300 hover:text-navy-500 bg-cream-100 hover:bg-cream-200 border border-cream-200 transition-all btn-press"
            aria-label="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
