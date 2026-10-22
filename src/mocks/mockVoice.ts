// src/mocks/mockVoice.ts
import { Lang, VoiceAPI, VoiceStatus } from '../contract/types';

let recognitionInstance: any = null;
let isSpeaking = false;

export const mockVoice: VoiceAPI = {
  initVoice: async (onProgress) => {
    if (onProgress) {
      for (let i = 1; i <= 5; i++) {
        await new Promise((res) => setTimeout(res, 60));
        onProgress(i * 20);
      }
    }
  },

  listen: async (lang: Lang): Promise<string> => {
    return new Promise((resolve) => {
      // 1. Try Browser SpeechRecognition if supported
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          recognitionInstance = rec;
          rec.continuous = false;
          rec.interimResults = false;
          rec.lang = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-IN';

          rec.onresult = (event: any) => {
            const transcript = event.results[0]?.[0]?.transcript || '';
            resolve(transcript);
          };

          rec.onerror = () => {
            // Never throw into UI! Fall back to simulated voice recognition
            resolve(
              lang === 'hi'
                ? 'प्रकाश संश्लेषण क्या है?'
                : lang === 'mr'
                ? 'जलचक्र कसे कार्य करते?'
                : 'What is photosynthesis?'
            );
          };

          rec.onend = () => {
            recognitionInstance = null;
          };

          rec.start();
          return;
        } catch {
          // Ignore and fallback
        }
      }

      // 2. Simulated speech if Web Speech not permitted/supported
      setTimeout(() => {
        resolve(
          lang === 'hi'
            ? 'पौधे अपना भोजन कैसे बनाते हैं?'
            : lang === 'mr'
            ? 'गुरुत्वाकर्षण म्हणजे काय?'
            : 'Explain photosynthesis simply.'
        );
      }, 1200);
    });
  },

  stopListening: () => {
    if (recognitionInstance) {
      try {
        recognitionInstance.stop();
      } catch {
        // ignore
      }
      recognitionInstance = null;
    }
  },

  speak: (text: string, lang: Lang) => {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-IN';
      utterance.rate = 0.95; // Slightly slower for clear rural/educational comprehension
      isSpeaking = true;
      utterance.onend = () => {
        isSpeaking = false;
      };
      utterance.onerror = () => {
        isSpeaking = false;
      };
      window.speechSynthesis.speak(utterance);
    } catch {
      isSpeaking = false;
    }
  },

  stopSpeaking: () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isSpeaking = false;
  },

  getVoiceStatus: (): VoiceStatus => 'ready',
};
