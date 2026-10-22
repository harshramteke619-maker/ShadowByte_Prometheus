// src/mocks/mockData.ts
import { DataAPI, Module, QuizQuestion, SyncStatus, UserProgress } from '../contract/types';

const STORAGE_KEY_PROGRESS = 'offline_tutor_progress';
const STORAGE_KEY_MODULES = 'offline_tutor_modules';

const INITIAL_MODULES: Module[] = [
  {
    id: 'mod-1',
    subject: 'Science - Grade 8',
    title: {
      en: 'Photosynthesis & Plant Life',
      hi: 'प्रकाश संश्लेषण और पादप जीवन',
      mr: 'प्रकाशसंश्लेषण आणि वनस्पती जीवन',
    },
    explanation: {
      en: 'Plants produce food using carbon dioxide from air, water from roots, and sunlight absorbed by chlorophyll. Oxygen is released as a vital byproduct.',
      hi: 'पौधे हवा से कार्बन डाइऑक्साइड, जड़ों से पानी और क्लोरोफिल द्वारा अवशोषित सूर्य के प्रकाश का उपयोग करके भोजन बनाते हैं। ऑक्सीजन एक उपोत्पाद के रूप में निकलती है।',
      mr: 'वनस्पती हवेतील कार्बन डायऑक्साइड, मुळांमधील पाणी आणि क्लोरोफिलने शोषलेला सूर्यप्रकाश वापरून अन्न तयार करतात. ऑक्सिजन बाहेर सोडला जातो.',
    },
    visual: '🌱 ☀️ ➡️ 🍃 ➡️ 💨 O₂',
    quiz: [
      {
        id: 'q-1-1',
        moduleId: 'mod-1',
        q: {
          en: 'What gas do plants absorb during photosynthesis?',
          hi: 'प्रकाश संश्लेषण के दौरान पौधे कौन सी गैस अवशोषित करते हैं?',
          mr: 'प्रकाशसंश्लेषणादरम्यान वनस्पती कोणता वायू शोषून घेतात?',
        },
        options: {
          en: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Helium'],
          hi: ['ऑक्सीजन', 'कार्बन डाइऑक्साइड', 'नाइट्रोजन', 'हीलियम'],
          mr: ['ऑक्सिजन', 'कार्बन डायऑक्साइड', 'नायट्रोजन', 'हेलियम'],
        },
        answerIndex: 1,
        hint: {
          en: 'It is the gas that animals and humans exhale.',
          hi: 'यह वह गैस है जो मनुष्य सांस छोड़ते समय निकालते हैं।',
          mr: 'हा तो वायू आहे जो मानव श्वास सोडताना बाहेर टाकतात.',
        },
      },
      {
        id: 'q-1-2',
        moduleId: 'mod-1',
        q: {
          en: 'Which green pigment captures sunlight?',
          hi: 'सूर्य का प्रकाश पकड़ने वाला हरा वर्णक कौन सा है?',
          mr: 'सूर्यप्रकाश पकडणारे हिरवे रंगद्रव्य कोणते?',
        },
        options: {
          en: ['Hemoglobin', 'Chlorophyll', 'Melanin', 'Carotene'],
          hi: ['हीमोग्लोबिन', 'क्लोरोफिल', 'मेलेनिन', 'कैरोटीन'],
          mr: ['हिमोग्लोबिन', 'क्लोरोफिल', 'मेलॅनिन', 'कॅरोटीन'],
        },
        answerIndex: 1,
        hint: {
          en: 'It makes leaves look green.',
          hi: 'यह पत्तियों को हरा रंग देता है।',
          mr: 'यामुळे पाने हिरवी दिसतात.',
        },
      },
    ],
  },
  {
    id: 'mod-2',
    subject: 'Geography - Grade 8',
    title: {
      en: 'The Water Cycle',
      hi: 'जल चक्र की कार्यप्रणाली',
      mr: 'जलचक्राची रचना',
    },
    explanation: {
      en: 'Water evaporates from oceans and lakes due to sun heat, condenses into clouds, and precipitates back as rain, recharging underground reservoirs and rivers.',
      hi: 'सूर्य की गर्मी से पानी महासागरों और झीलों से वाष्पीकृत होकर बादलों में संघनित होता है और बारिश के रूप में वापस बरसता है।',
      mr: 'सूर्याच्या उष्णतेमुळे पाणी बाष्पीभवन होऊन ढग बनतात आणि पावसाच्या रूपात पुन्हा पृथ्वीवर येते, ज्यामुळे नद्या आणि विहिरी भरतात.',
    },
    visual: '🌊 ⬆️ ☁️ ➡️ 🌧️ ➡️ 🏔️',
    quiz: [
      {
        id: 'q-2-1',
        moduleId: 'mod-2',
        q: {
          en: 'What is the process of water turning into vapor called?',
          hi: 'पानी के भाप में बदलने की प्रक्रिया को क्या कहते हैं?',
          mr: 'पाण्याचे बाष्पात रूपांतर होण्याच्या प्रक्रियेस काय म्हणतात?',
        },
        options: {
          en: ['Condensation', 'Evaporation', 'Precipitation', 'Freezing'],
          hi: ['संघनन', 'वाष्पीकरण', 'वर्षण', 'हिमीकरण'],
          mr: ['संघनन', 'बाष्पीभवन', 'पर्जन्य', 'गोठणे'],
        },
        answerIndex: 1,
        hint: {
          en: 'Think of water drying from clothes in sunlight.',
          hi: 'धूप में कपड़ों से पानी सूखने के बारे में सोचें।',
          mr: 'उन्हात कपडे वाळताना पाण्याचे काय होते ते आठवा.',
        },
      },
    ],
  },
];

const syncListeners: Set<(s: SyncStatus) => void> = new Set();
let currentSyncStatus: SyncStatus = navigator.onLine ? 'synced' : 'offline';

window.addEventListener('online', () => {
  currentSyncStatus = 'synced';
  syncListeners.forEach((cb) => cb(currentSyncStatus));
});

window.addEventListener('offline', () => {
  currentSyncStatus = 'offline';
  syncListeners.forEach((cb) => cb(currentSyncStatus));
});

export const mockData: DataAPI = {
  initData: async () => {
    if (!localStorage.getItem(STORAGE_KEY_MODULES)) {
      localStorage.setItem(STORAGE_KEY_MODULES, JSON.stringify(INITIAL_MODULES));
    }
  },

  getModules: async (): Promise<Module[]> => {
    const raw = localStorage.getItem(STORAGE_KEY_MODULES);
    if (!raw) return INITIAL_MODULES;
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_MODULES;
    }
  },

  getQuiz: async (moduleId: string): Promise<QuizQuestion[]> => {
    const modules = await mockData.getModules();
    const target = modules.find((m) => m.id === moduleId);
    return target ? target.quiz : [];
  },

  getProgress: async (): Promise<UserProgress> => {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // ignore
      }
    }
    const defaultProgress: UserProgress = {
      xp: 40,
      level: 1,
      streak: 3,
      lastActiveDate: new Date().toISOString(),
      mastery: { 'mod-1': 0.5 },
      completedModules: [],
    };
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(defaultProgress));
    return defaultProgress;
  },

  saveProgress: async (patch: Partial<UserProgress>) => {
    const current = await mockData.getProgress();
    const updated = { ...current, ...patch };
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(updated));
  },

  updateMastery: async (moduleId: string, correct: boolean): Promise<number> => {
    const current = await mockData.getProgress();
    const curMastery = current.mastery[moduleId] || 0;
    const delta = correct ? 0.25 : -0.1;
    const newMastery = Math.min(1, Math.max(0, parseFloat((curMastery + delta).toFixed(2))));
    current.mastery[moduleId] = newMastery;
    await mockData.saveProgress(current);
    return newMastery;
  },

  addXP: async (n: number): Promise<number> => {
    const current = await mockData.getProgress();
    current.xp += n;
    current.level = Math.floor(current.xp / 100) + 1;
    await mockData.saveProgress(current);
    return current.xp;
  },

  completeModule: async (moduleId: string) => {
    const current = await mockData.getProgress();
    if (!current.completedModules.includes(moduleId)) {
      current.completedModules.push(moduleId);
      current.xp += 25; // Bonus for module completion
      current.level = Math.floor(current.xp / 100) + 1;
      await mockData.saveProgress(current);
    }
  },

  exportPack: async (ids?: string[]): Promise<string> => {
    const modules = await mockData.getModules();
    const subset = ids ? modules.filter((m) => ids.includes(m.id)) : modules;
    const payload = JSON.stringify({ version: '1.0', modules: subset });
    return btoa(encodeURIComponent(payload));
  },

  importPack: async (str: string): Promise<number> => {
    try {
      const decoded = decodeURIComponent(atob(str));
      const parsed = JSON.parse(decoded);
      if (Array.isArray(parsed.modules)) {
        const current = await mockData.getModules();
        const existingIds = new Set(current.map((m) => m.id));
        let addedCount = 0;
        parsed.modules.forEach((mod: Module) => {
          if (!existingIds.has(mod.id)) {
            current.push(mod);
            addedCount++;
          }
        });
        localStorage.setItem(STORAGE_KEY_MODULES, JSON.stringify(current));
        return addedCount;
      }
    } catch {
      // ignore
    }
    return 0;
  },

  getSyncStatus: (): SyncStatus => currentSyncStatus,

  onSyncStatus: (cb: (status: SyncStatus) => void): (() => void) => {
    syncListeners.add(cb);
    return () => syncListeners.delete(cb);
  },
};
