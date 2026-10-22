// src/App.tsx
import React, { useState, useEffect } from 'react';
import { TopNav } from './ui/components/TopNav';
import { MobileNav, NavTab } from './ui/components/MobileNav';
import { DashboardScreen } from './ui/screens/DashboardScreen';
import { LessonScreen } from './ui/screens/LessonScreen';
import { QuizScreen } from './ui/screens/QuizScreen';
import { ChatScreen } from './ui/screens/ChatScreen';
import { ShareScreen } from './ui/screens/ShareScreen';
import { SetupScreen } from './ui/screens/SetupScreen';
import { i18n, data } from './api';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [quizModuleId, setQuizModuleId] = useState<string | null>(null);
  const [, setLangTick] = useState(0);

  // Force re-render when language changes
  useEffect(() => {
    const unsub = i18n.onLangChange(() => setLangTick((t) => t + 1));
    return () => unsub();
  }, []);

  // Init data on mount
  useEffect(() => {
    data.initData();
  }, []);

  const handleSelectModule = (id: string) => {
    if (!id) return;
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

  const handleOpenChat = () => {
    setCurrentTab('chat');
    setSelectedModuleId(null);
    setQuizModuleId(null);
  };

  // Determine if we're in a sub-screen (lesson or quiz)
  const inSubScreen = Boolean(selectedModuleId || quizModuleId);

  return (
    <div className="min-h-screen relative">
      {/* Ambient background shapes */}
      <div className="ambient-shape ambient-shape-1" aria-hidden="true" />
      <div className="ambient-shape ambient-shape-2" aria-hidden="true" />
      <div className="ambient-shape ambient-shape-3" aria-hidden="true" />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Sticky top nav */}
        <TopNav currentTab={currentTab} onChangeTab={(tab) => {
          setCurrentTab(tab);
          setSelectedModuleId(null);
          setQuizModuleId(null);
        }} />

        {/* Main content */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
              {currentTab === 'dashboard' && (
                <DashboardScreen
                  onSelectModule={handleSelectModule}
                  onOpenChat={handleOpenChat}
                />
              )}
              {currentTab === 'chat' && <ChatScreen />}
              {currentTab === 'share' && <ShareScreen />}
              {currentTab === 'setup' && (
                <SetupScreen onComplete={() => setCurrentTab('dashboard')} />
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile bottom nav — hidden on desktop, hidden during sub-screens */}
      {!inSubScreen && (
        <MobileNav currentTab={currentTab} onChangeTab={(tab) => {
          setCurrentTab(tab);
          setSelectedModuleId(null);
          setQuizModuleId(null);
        }} />
      )}
    </div>
  );
};

export default App;
