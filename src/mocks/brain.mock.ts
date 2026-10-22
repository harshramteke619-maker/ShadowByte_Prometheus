import type { Lang, TutorAnswer, BrainStatus, InitProgress } from '../contract/types';
export async function initBrain(onProgress?: (p: InitProgress) => void) { onProgress?.({ stage: 'mock', pct: 100 }); }
export async function askTutor(q: string, _l: Lang, onToken?: (s: string) => void): Promise<TutorAnswer> {
  await new Promise(r => setTimeout(r, 600));
  const text = `Mock answer for: "${q}". Plants make food using sunlight.`;
  onToken?.(text);
  return { text, source: 'curated', matchedId: 'mock', ms: 600 };
}
export function getBrainStatus(): BrainStatus { return { mode: 'curated-only', modelCached: false }; }
