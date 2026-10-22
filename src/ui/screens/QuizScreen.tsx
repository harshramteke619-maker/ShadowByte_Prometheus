// src/ui/screens/QuizScreen.tsx
import React, { useState, useEffect } from 'react';
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
    data.getQuiz(moduleId).then((qList) => {
      setQuestions(qList);
    });

    const unsub = i18n.onLangChange((l) => setCurrentLang(l));
    return () => unsub();
  }, [moduleId]);

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500">
        No quiz questions found for this module.
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
    if (isCorrect) {
      setScore((s) => s + 1);
      await data.addXP(10);
      voice.speak(i18n.t('correct'), currentLang);
    } else {
      voice.speak(i18n.t('incorrect'), currentLang);
    }

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
      // Completed all questions
      await data.completeModule(moduleId);
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="p-6 text-center space-y-6 max-w-sm mx-auto my-auto">
        <div className="text-6xl animate-bounce">🏆</div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">
            {currentLang === 'hi' ? 'बहुत खूब!' : currentLang === 'mr' ? 'अभिनंदन!' : 'Quiz Completed!'}
          </h2>
          <p className="text-sm text-slate-600">
            {currentLang === 'hi'
              ? `आपने ${questions.length} में से ${score} प्रश्नों के सही उत्तर दिए!`
              : currentLang === 'mr'
              ? `तुम्ही ${questions.length} पैकी ${score} प्रश्नांची बरोबर उत्तरे दिली!`
              : `You scored ${score} out of ${questions.length}!`}
          </p>
        </div>

        {/* Final Mastery Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>{i18n.t('mastery')}</span>
            <span className="text-indigo-600 font-extrabold">{Math.round(finalMastery * 100)}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.round(finalMastery * 100)}%` }}
            />
          </div>
        </div>

        <button
          onClick={onFinish}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl text-sm shadow-md transition-all active:scale-[0.98]"
        >
          {i18n.t('home')}
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-24 max-w-lg mx-auto">
      {/* Progress & Indicator */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
        <span>
          Question {currentIndex + 1} of {questions.length}
        </span>
        <button
          onClick={() => voice.speak(questionText, currentLang)}
          className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-lg"
        >
          🔊 {i18n.t('listenLesson')}
        </button>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 leading-snug">{questionText}</h2>
      </div>

      {/* Options List */}
      <div className="space-y-2.5">
        {options.map((option, idx) => {
          let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50';

          if (isAnswered) {
            if (idx === currentQ.answerIndex) {
              btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-200';
            } else if (idx === selectedOption) {
              btnStyle = 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-200';
            } else {
              btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              className={`w-full text-left p-4 rounded-2xl border text-sm font-medium transition-all shadow-xs flex items-center justify-between ${btnStyle}`}
            >
              <span>{option}</span>
              {isAnswered && idx === currentQ.answerIndex && (
                <span className="text-emerald-600 font-bold text-base">✓</span>
              )}
              {isAnswered && idx === selectedOption && idx !== currentQ.answerIndex && (
                <span className="text-rose-500 font-bold text-base">✕</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Socratic Hint Ladder */}
      {hintText && !isAnswered && (
        <div className="pt-1">
          {showHint ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 space-y-1">
              <span className="font-bold">💡 {i18n.t('hint')}:</span>
              <p>{hintText}</p>
            </div>
          ) : (
            <button
              onClick={() => setShowHint(true)}
              className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1"
            >
              💡 {i18n.t('hint')}?
            </button>
          )}
        </div>
      )}

      {/* Next Button */}
      {isAnswered && (
        <div className="pt-2">
          <button
            onClick={handleNext}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl text-sm shadow-md transition-all active:scale-[0.98]"
          >
            {currentIndex + 1 < questions.length ? i18n.t('nextQuestion') : i18n.t('finishQuiz')} →
          </button>
        </div>
      )}
    </div>
  );
};
