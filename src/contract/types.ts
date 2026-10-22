// src/contract/types.ts
// FROZEN shared types (agreed by all 4 team members)

export type Lang = 'en' | 'hi' | 'mr';

export type TutorSource = 'curated' | 'slm' | 'fallback';

export interface TutorAnswer {
  text: string;
  source: TutorSource;
  matchedId?: string;
  ms: number;
}

export type BrainStatus = 'curated-only' | 'slm-loading' | 'slm-ready';

export interface BrainAPI {
  initBrain: (onProgress?: (p: number) => void) => Promise<void>;
  askTutor: (question: string, lang: Lang, onToken?: (token: string) => void) => Promise<TutorAnswer>;
  getBrainStatus: () => BrainStatus;
}

export type VoiceStatus = 'ready' | 'loading' | 'unavailable';

export interface VoiceAPI {
  initVoice: (onProgress?: (p: number) => void) => Promise<void>;
  listen: (lang: Lang) => Promise<string>;
  stopListening: () => void;
  speak: (text: string, lang: Lang) => void;
  stopSpeaking: () => void;
  getVoiceStatus: () => VoiceStatus;
}

export interface I18NAPI {
  t: (key: string, lang?: Lang) => string;
  getLang: () => Lang;
  setLang: (lang: Lang) => void;
  onLangChange: (cb: (lang: Lang) => void) => () => void;
}

export interface QuizQuestion {
  id: string;
  moduleId: string;
  q: Record<Lang, string>;
  options: Record<Lang, string[]>;
  answerIndex: number;
  hint?: Record<Lang, string>;
}

export interface Module {
  id: string;
  subject: string;
  title: Record<Lang, string>;
  explanation: Record<Lang, string>;
  visual?: string;
  quiz: QuizQuestion[];
}

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  mastery: Record<string, number>; // 0 to 1
  completedModules: string[];
}

export type SyncStatus = 'offline' | 'pending' | 'syncing' | 'synced';

export interface DataAPI {
  initData: () => Promise<void>;
  getModules: () => Promise<Module[]>;
  getQuiz: (moduleId: string) => Promise<QuizQuestion[]>;
  getProgress: () => Promise<UserProgress>;
  saveProgress: (patch: Partial<UserProgress>) => Promise<void>;
  updateMastery: (moduleId: string, correct: boolean) => Promise<number>;
  addXP: (n: number) => Promise<number>;
  completeModule: (moduleId: string) => Promise<void>;
  exportPack: (ids?: string[]) => Promise<string>;
  importPack: (str: string) => Promise<number>;
  getSyncStatus: () => SyncStatus;
  onSyncStatus: (cb: (status: SyncStatus) => void) => () => void;
}
