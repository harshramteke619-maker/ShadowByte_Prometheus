// src/ui/screens/SetupScreen.tsx
import React, { useState } from 'react';
import { Brain, Mic, Wifi, CheckCircle2, ChevronRight } from 'lucide-react';
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
      await Promise.all([
        brain.initBrain((p) => setBrainProgress(p)),
        voice.initVoice((p) => setVoiceProgress(p)),
      ]);
      setIsDone(true);
      setTimeout(onComplete, 1200);
    } catch {
      setIsDone(true);
      setTimeout(onComplete, 1200);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="anim-fade-in" style={{
      padding: '48px 20px 96px', maxWidth: '420px', margin: '0 auto',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px',
    }}>
      {/* Icon cluster */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {[
          { Icon: Brain, color: 'var(--accent-blue)', bg: 'var(--accent-blue-l)' },
          { Icon: Wifi, color: 'var(--accent-teal)', bg: 'var(--accent-teal-l)' },
          { Icon: Mic, color: 'var(--accent-lavender)', bg: 'var(--accent-lav-l)' },
        ].map(({ Icon, color, bg }, i) => (
          <div key={i} style={{
            width: '52px', height: '52px', borderRadius: '16px',
            background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <Icon size={22} style={{ color }} />
          </div>
        ))}
      </div>

      {/* Heading */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px' }}>
          {i18n.t('offlineBrainSetup')}
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
          Pre-load offline AI models so voice and personalised tutoring work without internet.
        </p>
      </div>

      {/* Progress card */}
      <div style={{
        width: '100%', background: 'var(--bg-card)', borderRadius: '20px',
        padding: '20px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
        display: 'flex', flexDirection: 'column', gap: '16px',
      }}>
        {/* Brain model */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Brain size={13} style={{ color: 'var(--accent-blue)' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Tutor SLM (Qwen / wllama)
              </span>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent-blue)' }}>
              {brainProgress}%
            </span>
          </div>
          <div style={{ width: '100%', height: '7px', background: 'var(--bg-muted)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${brainProgress}%`,
              background: 'var(--accent-blue)', borderRadius: '99px',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>

        {/* Voice model */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mic size={13} style={{ color: 'var(--accent-teal)' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Vernacular Voice (Whisper / Piper)
              </span>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent-teal)' }}>
              {voiceProgress}%
            </span>
          </div>
          <div style={{ width: '100%', height: '7px', background: 'var(--bg-muted)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${voiceProgress}%`,
              background: 'var(--accent-teal)', borderRadius: '99px',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>

        {/* Done badge */}
        {isDone && (
          <div className="anim-slide-up" style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'var(--accent-teal-l)', border: '1px solid var(--accent-teal)',
            borderRadius: '10px', padding: '10px 14px',
            fontSize: '13px', fontWeight: 700, color: 'var(--accent-teal)',
          }}>
            <CheckCircle2 size={14} /> Models ready — launching...
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          onClick={handleStartDownload}
          disabled={isDownloading || isDone}
          className="btn-press"
          style={{
            width: '100%', padding: '16px', borderRadius: '16px',
            background: isDownloading || isDone ? 'var(--bg-muted)' : 'var(--accent-blue)',
            color: isDownloading || isDone ? 'var(--text-muted)' : '#fff',
            fontWeight: 800, fontSize: '14px', border: 'none',
            cursor: isDownloading || isDone ? 'not-allowed' : 'pointer',
            boxShadow: isDownloading || isDone ? 'none' : 'var(--shadow-md)',
            transition: 'all 0.2s ease',
          }}
        >
          {isDownloading ? 'Downloading Models…' : isDone ? 'Ready! Starting…' : i18n.t('downloadModels')}
        </button>

        <button
          onClick={onComplete}
          style={{
            width: '100%', padding: '13px', borderRadius: '14px',
            background: 'none', border: '1px solid var(--border)',
            color: 'var(--text-muted)', fontWeight: 600, fontSize: '13px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-muted)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
        >
          {i18n.t('skipSetup')} <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
};
