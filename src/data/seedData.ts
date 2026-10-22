// src/data/seedData.ts
// Local seed data — clean boundary; swap for API calls later

export interface Lesson {
  id: string;
  title: string;
  subject: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  author: { name: string; initials: string; color: string };
  progress: number;   // 0–1
  saved: boolean;
  description: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  topic: string;
  memberCount: number;
  members: Array<{ initials: string; color: string }>;
  activity: string;
  isActive: boolean;
  joinable: boolean;
}

export interface TutorMessage {
  id: string;
  sender: 'tutor' | 'student';
  text: string;
  time: string;
}

export const SEED_LESSONS: Lesson[] = [
  {
    id: 'l-1',
    title: 'Photosynthesis & Plant Life',
    subject: 'Science',
    difficulty: 'Beginner',
    duration: '25 min',
    author: { name: 'Anjali Mehta', initials: 'AM', color: '#0d9488' },
    progress: 0.65,
    saved: false,
    description: 'Understand how plants convert sunlight into energy using water and carbon dioxide.',
  },
  {
    id: 'l-2',
    title: 'Linear Equations & Graphs',
    subject: 'Mathematics',
    difficulty: 'Intermediate',
    duration: '30 min',
    author: { name: 'Rohan Verma', initials: 'RV', color: '#0f4c81' },
    progress: 0.30,
    saved: true,
    description: 'Solve linear equations, plot them, and understand their real-world applications.',
  },
  {
    id: 'l-3',
    title: 'The Water Cycle Explained',
    subject: 'Geography',
    difficulty: 'Beginner',
    duration: '20 min',
    author: { name: 'Priya Singh', initials: 'PS', color: '#7c3aed' },
    progress: 0,
    saved: false,
    description: 'Follow water as it evaporates, condenses, and precipitates across the Earth.',
  },
  {
    id: 'l-4',
    title: 'Introduction to Python',
    subject: 'Coding',
    difficulty: 'Beginner',
    duration: '40 min',
    author: { name: 'Karan Das', initials: 'KD', color: '#d97706' },
    progress: 0.80,
    saved: true,
    description: 'Write your first program, learn variables, loops, and functions in Python.',
  },
];

export const SEED_GROUPS: StudyGroup[] = [
  {
    id: 'g-1',
    name: 'Science Squad',
    topic: 'Class 8 Biology',
    memberCount: 12,
    members: [
      { initials: 'AM', color: '#0d9488' },
      { initials: 'PS', color: '#7c3aed' },
      { initials: 'KD', color: '#d97706' },
    ],
    activity: 'Discussing photosynthesis right now',
    isActive: true,
    joinable: true,
  },
  {
    id: 'g-2',
    name: 'Math Ninjas',
    topic: 'Algebra & Geometry',
    memberCount: 8,
    members: [
      { initials: 'RV', color: '#0f4c81' },
      { initials: 'AM', color: '#0d9488' },
    ],
    activity: 'Solved 3 problems in the last hour',
    isActive: false,
    joinable: true,
  },
  {
    id: 'g-3',
    name: 'Code Club',
    topic: 'Python Basics',
    memberCount: 15,
    members: [
      { initials: 'KD', color: '#d97706' },
      { initials: 'PS', color: '#7c3aed' },
      { initials: 'RV', color: '#0f4c81' },
    ],
    activity: 'Weekly challenge: build a calculator',
    isActive: true,
    joinable: false,
  },
];

export const SEED_MESSAGES: TutorMessage[] = [
  { id: 'm1', sender: 'tutor', text: 'Hello! I\'m ready to help. What topic are you working on today?', time: '10:02 AM' },
  { id: 'm2', sender: 'student', text: 'I\'m struggling with how plants make food without sunlight at night.', time: '10:04 AM' },
  { id: 'm3', sender: 'tutor', text: 'Great question! Plants don\'t actually make food at night — they store energy as glucose during the day and use it when needed. Does that help clarify it?', time: '10:05 AM' },
];

export const SUGGESTED_QUESTIONS = [
  'Explain photosynthesis simply',
  'How do I solve quadratic equations?',
  'What is the water cycle?',
  'Help me understand fractions',
];

export const PEER_ACTIVITY = [
  { name: 'Anjali', action: 'completed "Photosynthesis" · earned 50 XP', initials: 'AM', color: '#0d9488', time: '2m ago' },
  { name: 'Rohan', action: 'joined the Math Ninjas study group', initials: 'RV', color: '#0f4c81', time: '15m ago' },
  { name: 'Priya', action: 'asked a question in Science Squad', initials: 'PS', color: '#7c3aed', time: '32m ago' },
  { name: 'Karan', action: 'saved "Intro to Python" to their library', initials: 'KD', color: '#d97706', time: '1h ago' },
];
