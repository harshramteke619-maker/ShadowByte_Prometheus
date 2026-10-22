// src/mocks/mockI18n.ts
import { Lang, I18NAPI } from '../contract/types';

let currentLang: Lang = 'en';
const listeners: Set<(lang: Lang) => void> = new Set();

export const STRINGS: Record<string, Record<Lang, string>> = {
  // App Header & Nav
  appName: {
    en: 'Offline AI Tutor',
    hi: 'ऑफलाइन एआई ट्यूटर',
    mr: 'ऑफलाइन एआय ट्यूटर',
  },
  home: {
    en: 'Home',
    hi: 'होम',
    mr: 'मुख्य',
  },
  chat: {
    en: 'Tutor Chat',
    hi: 'ट्यूटर चैट',
    mr: 'ट्यूटर चॅट',
  },
  share: {
    en: 'Share Lessons',
    hi: 'शेयर करें',
    mr: 'धडे शेअर करा',
  },
  setup: {
    en: 'Offline Setup',
    hi: 'ऑफलाइन सेटअप',
    mr: 'ऑफलाइन सेटअप',
  },
  // Status Badges
  offlineReady: {
    en: 'Offline Ready',
    hi: 'ऑफलाइन तैयार',
    mr: 'ऑफलाइन तयार',
  },
  online: {
    en: 'Online',
    hi: 'ऑनलाइन',
    mr: 'ऑनलाइन',
  },
  synced: {
    en: 'Synced',
    hi: 'सिंक हो गया',
    mr: 'सिंक झाले',
  },
  syncing: {
    en: 'Syncing...',
    hi: 'सिंक हो रहा है...',
    mr: 'सिंक होत आहे...',
  },
  pendingSync: {
    en: 'Pending Sync',
    hi: 'सिंक बाकी है',
    mr: 'सिंक प्रलंबित',
  },
  offlineMode: {
    en: 'Offline',
    hi: 'ऑफलाइन',
    mr: 'ऑफलाइन',
  },
  // Stats
  streak: {
    en: 'Day Streak',
    hi: 'दिन की स्ट्रीक',
    mr: 'दिवसांची स्ट्रीक',
  },
  xp: {
    en: 'XP',
    hi: 'अंक (XP)',
    mr: 'गुण (XP)',
  },
  level: {
    en: 'Level',
    hi: 'स्तर',
    mr: 'पातळी',
  },
  // Lesson & Quiz
  startQuiz: {
    en: 'Start Quiz',
    hi: 'क्विज शुरू करें',
    mr: 'क्विझ सुरू करा',
  },
  listenLesson: {
    en: 'Listen',
    hi: 'सुनें',
    mr: 'ऐका',
  },
  stopAudio: {
    en: 'Stop',
    hi: 'रोकें',
    mr: 'थांबवा',
  },
  nextQuestion: {
    en: 'Next Question',
    hi: 'अगला प्रश्न',
    mr: 'पुढील प्रश्न',
  },
  finishQuiz: {
    en: 'Finish Quiz',
    hi: 'क्विज समाप्त करें',
    mr: 'क्विझ पूर्ण करा',
  },
  correct: {
    en: 'Correct! +10 XP',
    hi: 'सही उत्तर! +10 अंक',
    mr: 'बरोबर उत्तर! +10 गुण',
  },
  incorrect: {
    en: 'Needs Review',
    hi: 'गलत उत्तर',
    mr: 'चूक उत्तर',
  },
  hint: {
    en: 'Hint',
    hi: 'संकेत (हिंट)',
    mr: 'संकेत (हिंट)',
  },
  mastery: {
    en: 'Mastery',
    hi: 'महारत',
    mr: 'प्रवीणता',
  },
  completed: {
    en: 'Completed',
    hi: 'पूरा हुआ',
    mr: 'पूर्ण झाले',
  },
  // Chat
  askPlaceholder: {
    en: 'Ask any question from syllabus...',
    hi: 'सिलेबस से कोई भी प्रश्न पूछें...',
    mr: 'अभ्यासक्रमातून कोणताही प्रश्न विचारा...',
  },
  listening: {
    en: 'Listening... Speak now',
    hi: 'सुन रहे हैं... बोलिए',
    mr: 'ऐकत आहे... बोला',
  },
  send: {
    en: 'Send',
    hi: 'भेजें',
    mr: 'पाठवा',
  },
  sourceCurated: {
    en: 'Curated Syllabus',
    hi: 'पाठ्यपुस्तक स्रोत',
    mr: 'पाठ्यपुस्तक स्त्रोत',
  },
  sourceSLM: {
    en: 'On-Device AI',
    hi: 'डिवाइस एआई',
    mr: 'डिव्हाइस एआय',
  },
  sourceFallback: {
    en: 'General Knowledge',
    hi: 'सामान्य ज्ञान',
    mr: 'सामान्य ज्ञान',
  },
  // Share & Setup
  exportTitle: {
    en: 'Export Lessons to Peer',
    hi: 'साथी छात्र को पाठ शेयर करें',
    mr: 'मित्राला धडे शेअर करा',
  },
  scanTitle: {
    en: 'Scan or Upload Pack',
    hi: 'पैक स्कैन या अपलोड करें',
    mr: 'पॅक स्कॅन किंवा अपलोड करा',
  },
  downloadPack: {
    en: 'Download Pack File',
    hi: 'पैक फाइल डाउनलोड करें',
    mr: 'पॅक फाइल डाउनलोड करा',
  },
  uploadPack: {
    en: 'Upload .pack File',
    hi: 'फाइल अपलोड करें',
    mr: 'फाइल अपलोड करा',
  },
  offlineBrainSetup: {
    en: 'Offline Brain & Voice Setup',
    hi: 'ऑफलाइन ब्रेन और वॉइस सेटअप',
    mr: 'ऑफलाइन ब्रेन आणि व्हॉइस सेटअप',
  },
  downloadModels: {
    en: 'Download Offline Models',
    hi: 'ऑफलाइन मॉडल डाउनलोड करें',
    mr: 'ऑफलाइन मॉडेल्स डाउनलोड करा',
  },
  skipSetup: {
    en: 'Use Curated Mode (Skip)',
    hi: 'केवल पाठ्यपुस्तक मोड (छोड़ें)',
    mr: 'केवळ पाठ्यपुस्तक मोड (वगळा)',
  },
};

export const mockI18n: I18NAPI = {
  t: (key: string, lang?: Lang): string => {
    const l = lang || currentLang;
    const strObj = STRINGS[key];
    if (!strObj) return key;
    return strObj[l] || strObj['en'] || key;
  },
  getLang: (): Lang => currentLang,
  setLang: (lang: Lang): void => {
    currentLang = lang;
    listeners.forEach((cb) => cb(lang));
  },
  onLangChange: (cb: (lang: Lang) => void): (() => void) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
};
