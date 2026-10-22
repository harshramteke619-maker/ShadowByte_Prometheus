// OWNER: P1 Harsh. Must export exactly BrainAPI. Files: retrieval.ts, slmClient.ts, slm.worker.ts, prompts.ts
import type { Lang, TutorAnswer, InitProgress, BrainStatus } from '../contract/types';
export async function initBrain(_onProgress?: (p: InitProgress) => void): Promise<void> { /* TODO P1 */ }
export async function askTutor(_q: string, _lang: Lang, _onToken?: (s: string) => void): Promise<TutorAnswer> { throw new Error('TODO P1'); }
export function getBrainStatus(): BrainStatus { return { mode: 'curated-only', modelCached: false }; }
