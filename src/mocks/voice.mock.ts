import type { Lang, VoiceStatus, InitProgress } from '../contract/types';
export async function initVoice(onProgress?: (p: InitProgress) => void) { onProgress?.({ stage: 'mock', pct: 100 }); }
export async function listen(_l: Lang) { await new Promise(r => setTimeout(r, 1000)); return 'प्रकाशसंश्लेषण म्हणजे काय?'; }
export function stopListening() {}
export async function speak(text: string, l: Lang) {
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text); u.lang = l === 'en' ? 'en-IN' : l === 'hi' ? 'hi-IN' : 'mr-IN';
  speechSynthesis.speak(u);
}
export function stopSpeaking() { if ('speechSynthesis' in window) speechSynthesis.cancel(); }
export function getVoiceStatus(): VoiceStatus { return { sttReady: true, ttsVoices: { en: true, hi: true, mr: false } }; }
