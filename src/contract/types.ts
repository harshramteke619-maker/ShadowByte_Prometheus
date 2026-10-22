// ============================================================
// SHARED CONTRACT - FROZEN AT 0:15
// Change only if ALL 4 agree in the group chat. Then tell everyone.
// ============================================================
export type Lang = 'en' | 'hi' | 'mr';
export type Localized<T = string> = Record<Lang, T>;
export interface InitProgress { stage: string; pct: number } // pct 0-100

// ---------- P1 Harsh: Brain ----------
export type AnswerSource = 'curated' | 'slm' | 'fallback';
export interface TutorAnswer { text: string; source: AnswerSource; matchedId?: string; ms: number }
export interface BrainStatus { mode: 'curated-only' | 'slm-loading' | 'slm-ready'; modelCached: boolean }
export interface BrainAPI {
  initBrain(onProgress?: (p: InitProgress) => void): Promise<void>; // lazy: call when chat opens
  askTutor(question: string, lang: Lang, onToken?: (partial: string) => void): Promise<TutorAnswer>; // NEVER rejects
  getBrainStatus(): BrainStatus;
}

// ---------- P2 Sayal: Voice + i18n ----------
export interface VoiceStatus { sttReady: boolean; ttsVoices: Record<Lang, boolean> }
export interface VoiceAPI {
  initVoice(onProgress?: (p: InitProgress) => void): Promise<void>; // lazy: call on first mic tap
  listen(lang: Lang): Promise<string>;   // transcript, '' on failure. NEVER rejects
  stopListening(): void;
  speak(text: string, lang: Lang): Promise<void>; // resolves silently if no voice
  stopSpeaking(): void;
  getVoiceStatus(): VoiceStatus;
}
export interface I18NAPI {
  t(key: string, lang?: Lang): string;   // lang defaults to current
  getLang(): Lang;
  setLang(l: Lang): void;
  onLangChange(cb: (l: Lang) => void): () => void; // returns unsubscribe
}

// ---------- P4 Zaid: Data ----------
export interface QuizQuestion {
  id: string; moduleId: string;
  q: Localized; options: Localized<string[]>; answerIndex: number; hint?: Localized;
}
export interface LessonModule {
  id: string; subject: string;
  title: Localized; explanation: Localized;
  visual?: string;          // emoji or inline SVG string
  quiz: QuizQuestion[];
}
export interface Progress {
  xp: number; level: number; streak: number; lastActiveDate: string; // YYYY-MM-DD
  badges: string[]; mastery: Record<string, number>; // moduleId -> 0..1
  completedModules: string[];
}
export type SyncStatus = 'offline' | 'pending' | 'syncing' | 'synced';
export interface DataAPI {
  initData(): Promise<void>;  // open DB, seed from /data/content.json, start online listener
  getModules(): Promise<LessonModule[]>;
  getQuiz(moduleId: string): Promise<QuizQuestion[]>;
  getProgress(): Promise<Progress>;
  saveProgress(patch: Partial<Progress>): Promise<Progress>;
  updateMastery(moduleId: string, correct: boolean): Promise<number>; // returns new mastery 0..1
  addXP(n: number): Promise<Progress>;
  completeModule(moduleId: string): Promise<Progress>;
  exportPack(moduleIds?: string[]): Promise<string>;  // compressed base64 string
  importPack(pack: string): Promise<{ added: number }>;
  getSyncStatus(): SyncStatus;
  onSyncStatus(cb: (s: SyncStatus) => void): () => void;
}
