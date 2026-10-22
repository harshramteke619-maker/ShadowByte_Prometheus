// src/mocks/mockBrain.ts
import { BrainAPI, BrainStatus, Lang, TutorAnswer } from '../contract/types';

let brainStatus: BrainStatus = 'slm-ready';

const CURATED_QA: Record<string, { en: string; hi: string; mr: string }> = {
  photosynthesis: {
    en: 'Photosynthesis is the process where green plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar.',
    hi: 'प्रकाश संश्लेषण वह प्रक्रिया है जिसके द्वारा हरे पौधे सूर्य के प्रकाश, पानी और कार्बन डाइऑक्साइड का उपयोग करके ऑक्सीजन और ग्लूकोज बनाते हैं।',
    mr: 'प्रकाशसंश्लेषण ही अशी प्रक्रिया आहे ज्याद्वारे हिरव्या वनस्पती सूर्यप्रकाश, पाणी आणि कार्बन डायऑक्साइडचा वापर करून ऑक्सिजन आणि अन्न तयार करतात.',
  },
  water: {
    en: 'The water cycle consists of evaporation, condensation, precipitation, and collection, circulating Earth’s water endlessly.',
    hi: 'जल चक्र में वाष्पीकरण, संघनन, वर्षण और जल संचयन शामिल हैं, जो पृथ्वी पर पानी को लगातार चक्रित करते हैं।',
    mr: 'जलचक्रात बाष्पीभवन, संघनन, पर्जन्य आणि साठवण यांचा समावेश होतो, ज्यामुळे पृथ्वीवरील पाण्याचे सतत चक्र चालू राहते.',
  },
  gravity: {
    en: 'Gravity is the invisible force that pulls objects toward each other. Earth’s gravity is what keeps us on the ground.',
    hi: 'गुरुत्वाकर्षण वह अदृश्य बल है जो वस्तुओं को अपनी ओर खींचता है। पृथ्वी का गुरुत्वाकर्षण हमें जमीन पर बनाए रखता है।',
    mr: 'गुरुत्वाकर्षण हे अदृश्य बल आहे जे वस्तूंना एकमेकांकडे आकर्षित करते. पृथ्वीचे गुरुत्वाकर्षण आपल्याला जमिनीवर धरून ठेवते.',
  },
};

export const mockBrain: BrainAPI = {
  initBrain: async (onProgress) => {
    brainStatus = 'slm-loading';
    for (let i = 1; i <= 5; i++) {
      await new Promise((res) => setTimeout(res, 80));
      if (onProgress) onProgress(i * 20);
    }
    brainStatus = 'slm-ready';
  },

  askTutor: async (question: string, lang: Lang, onToken?: (token: string) => void): Promise<TutorAnswer> => {
    const qLower = question.toLowerCase();
    const startTime = performance.now();

    let matchedKey: string | null = null;
    if (qLower.includes('photo') || qLower.includes('पौध') || qLower.includes('वनस्पती')) matchedKey = 'photosynthesis';
    else if (qLower.includes('water') || qLower.includes('जल') || qLower.includes('पाणी')) matchedKey = 'water';
    else if (qLower.includes('grav') || qLower.includes('गुरुत्व')) matchedKey = 'gravity';

    let answerText = '';
    let source: TutorAnswer['source'] = 'fallback';

    if (matchedKey && CURATED_QA[matchedKey]) {
      answerText = CURATED_QA[matchedKey][lang] || CURATED_QA[matchedKey].en;
      source = 'curated';
    } else {
      source = 'slm';
      if (lang === 'hi') {
        answerText = `आपके प्रश्न "${question}" के आधार पर: पाठ्यपुस्तक के अनुसार यह एक महत्वपूर्ण संकल्पना है। कृपया इसके मुख्य चरणों को समझने का प्रयास करें।`;
      } else if (lang === 'mr') {
        answerText = `तुमच्या "${question}" या प्रश्नावर: अभ्यासक्रमानुसार ही एक महत्त्वाची संकल्पना आहे. कृपया याची मुख्य तत्त्वे समजून घेण्याचा प्रयत्न करा.`;
      } else {
        answerText = `Regarding your question "${question}": According to the syllabus, this is a core concept. Let's break it down step by step.`;
      }
    }

    // Simulate streaming tokens for realistic UI feel
    if (onToken) {
      const words = answerText.split(' ');
      let currentAcc = '';
      for (const word of words) {
        currentAcc = currentAcc ? `${currentAcc} ${word}` : word;
        onToken(currentAcc);
        await new Promise((res) => setTimeout(res, 35));
      }
    }

    const duration = Math.round(performance.now() - startTime);

    return {
      text: answerText,
      source,
      matchedId: matchedKey || undefined,
      ms: duration,
    };
  },

  getBrainStatus: (): BrainStatus => brainStatus,
};
