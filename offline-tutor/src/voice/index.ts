// OWNER: P2 Sayal. Must export exactly VoiceAPI. Files: listen.ts, speak.ts, whisper.worker.ts
import type { Lang, InitProgress, VoiceStatus } from '../contract/types';
import { loadVoices, getTtsVoices } from './speak';

export { speak, stopSpeaking } from './speak';

export async function initVoice(onProgress?: (p: InitProgress) => void): Promise<void> {
  try { await loadVoices(); } catch { /* ignore */ }
  onProgress?.({ stage: 'voices', pct: 100 });
  // TODO P2 (1:30-2:30): load Whisper here via whisper.worker.ts and report real progress
}

// TODO P2 (0:45-1:30): replace with listen.ts (Web Speech first, Whisper later).
// Until then return '' so the UI never sees a rejection (golden rule 6).
export async function listen(_lang: Lang): Promise<string> { return ''; }
export function stopListening(): void { /* TODO P2 */ }

export function getVoiceStatus(): VoiceStatus {
  return { sttReady: false, ttsVoices: getTtsVoices() }; // sttReady -> true once listen.ts works
}
