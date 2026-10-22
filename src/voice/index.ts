// OWNER: P2 Sayal. Must export exactly VoiceAPI. Files: listen.ts, speak.ts, whisper.worker.ts
import type { Lang, InitProgress, VoiceStatus } from '../contract/types';
export async function initVoice(_onProgress?: (p: InitProgress) => void): Promise<void> { /* TODO P2 */ }
export async function listen(_lang: Lang): Promise<string> { throw new Error('TODO P2'); }
export function stopListening(): void {}
export async function speak(_text: string, _lang: Lang): Promise<void> { throw new Error('TODO P2'); }
export function stopSpeaking(): void {}
export function getVoiceStatus(): VoiceStatus { return { sttReady: false, ttsVoices: { en: false, hi: false, mr: false } }; }
