// src/ui/screens/QuizScreen.tsx
import React, { useState, useEffect } from 'react';
import { Volume2, Lightbulb, CheckCircle2, XCircle, Trophy, ArrowRight } from 'lucide-react';
import { data, voice, i18n, QuizQuestion, Lang } from '../../api';

interface QuizScreenProps {
  moduleId: string;
  onFinish: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ moduleId, onFinish }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [finalMastery, setFinalMastery] = useState(0);
  const [currentLang, setCurrentLang] = useState<Lang>(i18n.getLang());

  useEffect(() => {
    data.getQuiz(moduleId).then((qList) => setQuestions(qList));
    const unsub = i18n.onLangChange((l) => setCurrentLang(l));
    return () => unsub();
  }, [moduleId]);

  if (questions.length === 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '12px', padding: '48px 24px', color: 'var(--text-muted)',
      }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton" style={{
            height: i === 1 ? '16px' : i === 2 ? '100px' : '48px',
            width: i === 1 ? '50%' : '100%', borderRadius: '12px',
          }} />
        ))}
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const questionText = currentQ.q[currentLang] || currentQ.q.en;
  const options = currentQ.options[currentLang] || currentQ.options.en;
  const hintText = currentQ.hint ? currentQ.hint[currentLang] || currentQ.hint.en : null;

  const handleSelect = async (optIdx: number) => {
    if (isAnswered) return;
    setSelectedOption(optIdx);
    setIsAnswered(true);
    const isCorrect = optIdx === currentQ.answerIndex;
    if (isCorrect) { setScore((s) => s + 1); await data.addXP(10); voice.speak(i18n.t('correct'), currentLang); }
    else { voice.speak(i18n.t('incorrect'), currentLang); }
    const updatedM = await data.updateMastery(moduleId, isCorrect);
    setFinalMastery(updatedM);
  };

  const handleNext = async () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowHint(false);
    } else {
      await data.completeModule(moduleId);
      setIsFinished(true);
    }
  };

  /* ── Completion screen ── */
  if (isFinished) {
    const pct = Math.round(finalMastery * 100);
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (pct / 100) * circumference;
    return (
      <div className="anim-fade-in" style={{
        padding: '40px 24px 96px', maxWidth: '400px', margin: '0 auto',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px',
      }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'var(--accent-amber-l)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 0 8px var(--accent-amber-l)',
        }}>
          <Trophy size={36} style={{ color: 'var(--accent-amber)' }} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '6px' }}>
            {currentLang === 'hi' ? 'बहुत खूब!' : currentLang === 'mr' ? 'अभिनंदन!' : 'Quiz Completed!'}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            {currentLang === 'hi'
              ? `आपने ${questions.length} में से ${score} प्रश्नों के सही उत्तर दिए!`
              : currentLang === 'mr'
              ? `तुम्ही ${questions.length} पैकी ${score} प्रश्नांची बरोबर उत्तरे दिली!`
              : `You scored ${score} out of ${questions.length}!`}
          </p>
        </div>

        {/* Mastery ring */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: '18px', padding: '20px 28px',
          border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
          width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
        }}>
          <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--bg-muted)" strokeWidth="8" />
            <circle cx="50" cy="50" r="40" fill="none"
              stroke="var(--accent-teal)" strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div style={{ textAlign: 'center', marginTop: '-8px' }}>
            <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--accent-teal)' }}>{pct}%</div>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
              {i18n.t('mastery')}
            </div>
          </div>
        </div>

        <button
          onClick={onFinish}
          className="btn-press"
          style={{
            width: '100%', padding: '16px', borderRadius: '16px',
            background: 'var(--accent-blue)', color: '#fff',
            fontWeight: 800, fontSize: '14px', border: 'none',
            cursor: 'pointer', boxShadow: 'var(--shadow-md)',
          }}
        >
          {i18n.t('home')}
        </button>
      </div>
    );
  }

  /* ── Question screen ── */
  const progressPct = (currentIndex / questions.length) * 100;

  return (
    <div style={{
      padding: '16px 16px 96px', maxWidth: '640px', margin: '0 auto',
      display: 'flex', flexDirection: 'column', gap: '16px',
    }}>
      {/* Progress bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <button
            onClick={() => voice.speak(questionText, currentLang)}
            aria-label="Read question aloud"
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '11px', fontWeight: 700, color: 'var(--accent-blue)',
              background: 'var(--accent-blue-l)', border: 'none',
              padding: '4px 10px', borderRadius: '8px', cursor: 'pointer',
            }}
          >
            <Volume2 size={12} /> {i18n.t('listenLesson')}
          </button>
        </div>
        <div style={{ width: '100%', height: '5px', background: 'var(--bg-muted)', borderRadius: '99px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${progressPct}%`,
            background: 'var(--accent-blue)', borderRadius: '99px',
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* Question card */}
      <div className="anim-slide-up" style={{
        background: 'var(--bg-card)', borderRadius: '18px',
        padding: '20px', border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.5, margin: 0 }}>
          {questionText}
        </h2>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {options.map((option, idx) => {
          let bg = 'var(--bg-card)';
          let border = '1px solid var(--border)';
          let color = 'var(--text-primary)';
          let icon: React.ReactNode = null;

          if (isAnswered) {
            if (idx === currentQ.answerIndex) {
              bg = 'var(--accent-teal-l)'; border = '2px solid var(--accent-teal)';
              color = 'var(--accent-teal)'; icon = <CheckCircle2 size={16} />;
            } else if (idx === selectedOption) {
              bg = 'rgba(239,68,68,0.08)'; border = '2px solid #ef4444';
              color = '#dc2626'; icon = <XCircle size={16} />;
            } else {
              bg = 'var(--bg-muted)'; color = 'var(--text-muted)';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              className={isAnswered ? '' : 'btn-press'}
              aria-label={`Option ${idx + 1}: ${option}`}
              style={{
                width: '100%', textAlign: 'left', padding: '14px 16px',
                borderRadius: '14px', border, background: bg, color,
                fontSize: '13px', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: isAnswered ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: isAnswered && idx !== currentQ.answerIndex && idx !== selectedOption ? 0.5 : 1,
              }}
            >
              <span>{option}</span>
              {icon && <span style={{ color }}>{icon}</span>}
            </button>
          );
        })}
      </div>

      {/* Hint ladder */}
      {hintText && !isAnswered && (
        <div>
          {showHint ? (
            <div style={{
              background: 'var(--accent-amber-l)', borderRadius: '12px',
              padding: '12px 14px', border: '1px solid var(--accent-amber)',
              display: 'flex', gap: '8px', alignItems: 'flex-start',
            }}>
              <Lightbulb size={14} style={{ color: 'var(--accent-amber)', flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '12px', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
                <strong>{i18n.t('hint')}:</strong> {hintText}
              </p>
            </div>
          ) : (
            <button
              onClick={() => setShowHint(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                fontSize: '12px', fontWeight: 600, color: 'var(--accent-amber)',
                background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
              }}
            >
              <Lightbulb size={13} /> {i18n.t('hint')}?
            </button>
          )}
        </div>
      )}

      {/* Next button */}
      {isAnswered && (
        <button
          onClick={handleNext}
          className="btn-press anim-slide-up"
          style={{
            width: '100%', padding: '16px', borderRadius: '16px',
            background: 'var(--accent-blue)', color: '#fff',
            fontWeight: 800, fontSize: '14px', border: 'none',
            cursor: 'pointer', boxShadow: 'var(--shadow-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          }}
        >
          {currentIndex + 1 < questions.length ? i18n.t('nextQuestion') : i18n.t('finishQuiz')}
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
};
