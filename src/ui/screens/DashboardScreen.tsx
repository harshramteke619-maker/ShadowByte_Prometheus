// src/ui/screens/DashboardScreen.tsx
import React from 'react';
import { HeroGreeting } from '../components/HeroGreeting';
import { FocusTimer } from '../components/FocusTimer';
import { StudyPlan } from '../components/StudyPlan';
import { SubjectCards } from '../components/SubjectCards';
import { WeeklyProgress } from '../components/WeeklyProgress';
import { ContinueLearning } from '../components/ContinueLearning';
import { MotivationalQuote } from '../components/MotivationalQuote';
import { AnimatedSection } from '../components/AnimatedSection';

interface DashboardScreenProps {
  onSelectModule: (moduleId: string) => void;
  onOpenChat: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onSelectModule,
  onOpenChat,
}) => {
  return (
    <div className="space-y-8 pb-28 md:pb-10">
      {/* Hero Greeting */}
      <HeroGreeting onOpenChat={onOpenChat} />

      {/* Two-column layout on desktop */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatedSection delay={100}>
            <StudyPlan onSelectModule={onSelectModule} />
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <SubjectCards onSelectModule={onSelectModule} />
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <ContinueLearning onSelectModule={onSelectModule} />
          </AnimatedSection>
        </div>

        {/* Sidebar column */}
        <div className="space-y-6">
          <AnimatedSection delay={150}>
            <FocusTimer />
          </AnimatedSection>

          <AnimatedSection delay={250}>
            <WeeklyProgress />
          </AnimatedSection>

          <AnimatedSection delay={350}>
            <MotivationalQuote />
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};
