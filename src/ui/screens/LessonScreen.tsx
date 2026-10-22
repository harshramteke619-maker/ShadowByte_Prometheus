// src/ui/screens/LessonScreen.tsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, VolumeX, BookOpen, Pencil } from 'lucide-react';
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
    return () => { unsub(); voice.stopSpeaking(); };
  }, [moduleId]);

  if (!mod) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: '12px', padding: '48px 24px',
        color: 'var(--text-muted)', minHeight: '40vh',
      }}>
        {/* Skeleton shimmer */}
        {[1,2,3].map(i => (
          <div key={i} className="skeleton" style={{
            height: i === 1 ? '20px' : i === 2 ? '80px' : '40px',
            width: i === 1 ? '40%' : '100%', borderRadius: '12px',
          }} />
        ))}
      </div>
    );
  }

  const title = mod.title[currentLang] || mod.title.en;
  const explanation = mod.explanation[currentLang] || mod.explanation.en;

  const handleToggleVoice = () => {
    if (isPlaying) { voice.stopSpeaking(); setIsPlaying(false); return; }
    voice.speak(`${title}. ${explanation}`, currentLang);
    setIsPlaying(true);
    const duration = Math.max(3000, (explanation.length / 8) * 1000);
    setTimeout(() => setIsPlaying(false), duration);
  };

  return (
    <div style={{
      padding: '16px 16px 96px',
      maxWidth: '640px', margin: '0 auto',
      display: 'flex', flexDirection: 'column', gap: '20px',
    }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => { voice.stopSpeaking(); onBack(); }}
          className="btn-press"
          aria-label="Go back"
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', borderRadius: '12px',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            color: 'var(--text-secondary)', fontWeight: 600, fontSize: '13px',
            cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
          }}
        >
          <ArrowLeft size={14} /> {i18n.t('home')}
        </button>

        <button
          onClick={handleToggleVoice}
          className="btn-press"
          aria-label={isPlaying ? i18n.t('stopAudio') : i18n.t('listenLesson')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', borderRadius: '12px',
            background: isPlaying ? 'var(--accent-amber)' : 'var(--accent-blue)',
            color: '#fff', fontWeight: 700, fontSize: '12px',
            border: 'none', cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
            animation: isPlaying ? 'pulse 1.5s ease-in-out infinite' : 'none',
          }}
        >
          {isPlaying ? <VolumeX size={14} /> : <Volume2 size={14} />}
          {isPlaying ? i18n.t('stopAudio') : i18n.t('listenLesson')}
        </button>
      </div>

      {/* Lesson header */}
      <div className="anim-slide-up" style={{ animationDelay: '0.05s' }}>
        <span style={{
          fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.08em', color: 'var(--accent-teal)',
        }}>
          {mod.subject}
        </span>
        <h1 style={{
          fontSize: '22px', fontWeight: 800, lineHeight: 1.25,
          color: 'var(--text-primary)', marginTop: '4px',
        }}>{title}</h1>
      </div>

      {/* Visual / diagram box */}
      {mod.visual && (
        <div className="anim-slide-up card-lift" style={{
          animationDelay: '0.1s',
          background: 'linear-gradient(135deg, var(--accent-blue-l), var(--accent-lav-l))',
          borderRadius: '18px', padding: '28px',
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '32px', letterSpacing: '0.12em',
          boxShadow: 'var(--shadow-md)',
        }}>
          {mod.visual}
        </div>
      )}

      {/* Lesson content card */}
      <div className="anim-slide-up card-lift" style={{
        animationDelay: '0.15s',
        background: 'var(--bg-card)', borderRadius: '18px',
        padding: '20px', border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <BookOpen size={14} style={{ color: 'var(--accent-blue)' }} />
          <span style={{
            fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: 'var(--text-muted)',
          }}>
            {currentLang === 'hi' ? 'पाठ्य सामग्री' : currentLang === 'mr' ? 'अभ्यास घटक' : 'Lesson Content'}
          </span>
        </div>
        <p style={{
          fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.75,
          whiteSpace: 'pre-line', margin: 0,
        }}>
          {explanation}
        </p>
      </div>

      {/* Start Quiz CTA */}
      <div className="anim-slide-up" style={{ animationDelay: '0.2s' }}>
        <button
          onClick={() => { voice.stopSpeaking(); onStartQuiz(mod.id); }}
          className="btn-press"
          style={{
            width: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px',
            padding: '16px', borderRadius: '16px',
            background: 'var(--accent-teal)', color: '#fff',
            fontWeight: 800, fontSize: '14px', border: 'none',
            cursor: 'pointer', boxShadow: 'var(--shadow-md)',
          }}
        >
          <Pencil size={15} />
          {i18n.t('startQuiz')}
          <span style={{
            fontSize: '11px', background: 'rgba(0,0,0,0.18)',
            padding: '2px 10px', borderRadius: '20px', marginLeft: '4px',
          }}>+10 XP</span>
        </button>
      </div>
    </div>
  );
};
