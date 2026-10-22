// src/App.tsx
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { TopNav, AppTab } from './ui/layout/TopNav';
import { BottomNav } from './ui/layout/BottomNav';
import { HomePage } from './ui/screens/HomePage';
import { LessonScreen } from './ui/screens/LessonScreen';
import { QuizScreen } from './ui/screens/QuizScreen';
import { ChatScreen } from './ui/screens/ChatScreen';
import { ShareScreen } from './ui/screens/ShareScreen';
import { SetupScreen } from './ui/screens/SetupScreen';
import { i18n, data } from './api';

const AppInner: React.FC = () => {
  const [tab, setTab] = useState<AppTab>('home');
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    data.initData();
    const unsub = i18n.onLangChange(() => setTick(t => t + 1));
    return () => unsub();
  }, []);

  const navigate = (t: AppTab) => {
    setTab(t);
    setModuleId(null);
    setQuizId(null);
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const inSubScreen = Boolean(moduleId || quizId);

  const renderMain = () => {
    if (quizId) {
      return <QuizScreen moduleId={quizId} onFinish={() => { setQuizId(null); setModuleId(null); }} />;
    }
    if (moduleId) {
      return (
        <LessonScreen
          moduleId={moduleId}
          onBack={() => setModuleId(null)}
          onStartQuiz={(id) => setQuizId(id)}
        />
      );
    }
    switch (tab) {
      case 'home':
      case 'lessons':
      case 'groups':
      case 'progress':
        return <HomePage onNav={(t) => { navigate(t); }} />;
      case 'chat':     return <div style={{ maxWidth:720, margin:'0 auto', padding:'24px 16px 80px' }}><ChatScreen /></div>;
      case 'share':    return <div style={{ maxWidth:720, margin:'0 auto', padding:'24px 16px 80px' }}><ShareScreen /></div>;
      case 'setup':    return <div style={{ maxWidth:560, margin:'0 auto', padding:'24px 16px 80px' }}><SetupScreen onComplete={() => navigate('home')} /></div>;
      default:         return <HomePage onNav={navigate} />;
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-base)', transition:'background 0.25s ease' }}>
      <TopNav current={tab} onNav={navigate} />

      <main id="main-content" tabIndex={-1} aria-label="Page content">
        {renderMain()}
      </main>

      {!inSubScreen && <BottomNav current={tab} onNav={navigate} />}
    </div>
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <AppInner />
  </ThemeProvider>
);

export default App;
