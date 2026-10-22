// src/ui/screens/HomePage.tsx
import React from 'react';
import { HeroSection } from '../sections/HeroSection';
import { QuickActions } from '../sections/QuickActions';
import { FeaturedLessons } from '../sections/FeaturedLessons';
import { StudyGroupsSection } from '../sections/StudyGroupsSection';
import { TutorChatPreview } from '../sections/TutorChatPreview';
import { ProgressSection } from '../sections/ProgressSection';
import { PeerActivity } from '../sections/PeerActivity';
import { FooterCTA } from '../sections/FooterCTA';
import type { AppTab } from '../layout/TopNav';

interface HomePageProps {
  onNav: (t: AppTab) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNav }) => (
  <div style={{ paddingBottom: 'clamp(32px, 10vw, 80px)' }}>
    <HeroSection onNav={onNav} />
    <QuickActions onNav={onNav} />
    <FeaturedLessons />
    <StudyGroupsSection />
    <TutorChatPreview onNav={onNav} />
    <ProgressSection />
    <PeerActivity />
    <FooterCTA onNav={onNav} />
  </div>
);
