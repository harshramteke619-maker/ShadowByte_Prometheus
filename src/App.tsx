// src/App.tsx
import React, { useState, useEffect } from 'react';
import { Header } from './ui/components/Header';
import { Navbar, TabType } from './ui/components/Navbar';
import { HomeScreen } from './ui/screens/HomeScreen';
import { LessonScreen } from './ui/screens/LessonScreen';
import { QuizScreen } from './ui/screens/QuizScreen';
import { ChatScreen } from './ui/screens/ChatScreen';
import { ShareScreen } from './ui/screens/ShareScreen';
import { SetupScreen } from './ui/screens/SetupScreen';
import { i18n } from './api';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [quizModuleId, setQuizModuleId] = useState<string | null>(null);
  const [, setLangTick] = useState(0);

  // Force re-render whenever language changes so all i18n.t() calls update instantly
  useEffect(() => {
    const unsub = i18n.onLangChange(() => {
      setLangTick((t) => t + 1);
    });
    return () => unsub();
  }, []);

  const handleSelectModule = (id: string) => {
    setSelectedModuleId(id);
    setQuizModuleId(null);
  };

  const handleStartQuiz = (id: string) => {
    setQuizModuleId(id);
  };

  const handleBackToHome = () => {
    setSelectedModuleId(null);
    setQuizModuleId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 pb-12">
      {/* Top Bar with Offline & Sync status + Language switcher */}
      <Header />

      {/* Main Screen Body */}
      <main className="flex-1 max-w-lg w-full mx-auto">
        {quizModuleId ? (
          <QuizScreen
            moduleId={quizModuleId}
            onFinish={() => {
              setQuizModuleId(null);
              setSelectedModuleId(null);
            }}
          />
        ) : selectedModuleId ? (
          <LessonScreen
            moduleId={selectedModuleId}
            onBack={handleBackToHome}
            onStartQuiz={handleStartQuiz}
          />
        ) : (
          <>
            {currentTab === 'home' && (
              <HomeScreen
                onSelectModule={handleSelectModule}
                onOpenChat={() => setCurrentTab('chat')}
              />
            )}
            {currentTab === 'chat' && <ChatScreen />}
            {currentTab === 'share' && <ShareScreen />}
            {currentTab === 'setup' && (
              <SetupScreen onComplete={() => setCurrentTab('home')} />
            )}
          </>
        )}
      </main>

      {/* Persistent Bottom Tab Bar */}
      {!quizModuleId && !selectedModuleId && (
        <Navbar currentTab={currentTab} onChangeTab={setCurrentTab} />
      )}
    </div>
  );
};

export default App;
