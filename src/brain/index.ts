// OWNER: P1 Harsh. Must export exactly BrainAPI. Files: retrieval.ts, slmClient.ts, slm.worker.ts, prompts.ts
import type { Lang, TutorAnswer, InitProgress, BrainStatus } from '../contract/types';
import { loadQAData, getBestMatch, getTopMatches } from './retrieval';
import { buildPrompt, formatPassageForContext } from './prompts';
import { initSLMClient, generateWithSLM, isSLMReady } from './slmClient';

let brainStatus: BrainStatus = { mode: 'curated-only', modelCached: false };
let isInitialized = false;

export async function initBrain(onProgress?: (p: InitProgress) => void): Promise<void> {
  if (isInitialized) return;

  try {
    // Load QA data first
    onProgress?.({ stage: 'Loading knowledge base', pct: 10 });
    await loadQAData();

    // Check if we should load SLM (skip on low-memory devices)
    const deviceMemory = (navigator as any).deviceMemory;
    const shouldLoadSLM = deviceMemory === undefined || deviceMemory > 2;

    if (shouldLoadSLM) {
      onProgress?.({ stage: 'Preparing AI model', pct: 20 });
      try {
        await initSLMClient((progress) => {
          onProgress?.({
            stage: progress.stage,
            pct: 20 + Math.round(progress.pct * 0.8) // Map 0-100 to 20-100
          });
        });
        brainStatus = { mode: 'slm-ready', modelCached: true };
      } catch (slmError) {
        console.warn('SLM initialization failed, using curated-only mode:', slmError);
        brainStatus = { mode: 'curated-only', modelCached: false };
      }
    } else {
      onProgress?.({ stage: 'Using curated answers only', pct: 100 });
      brainStatus = { mode: 'curated-only', modelCached: false };
    }

    isInitialized = true;
    onProgress?.({ stage: 'Ready', pct: 100 });
  } catch (error) {
    console.error('Brain initialization failed:', error);
    // Fallback to curated-only mode
    brainStatus = { mode: 'curated-only', modelCached: false };
    isInitialized = true;
  }
}

export async function askTutor(
  question: string,
  lang: Lang,
  onToken?: (s: string) => void
): Promise<TutorAnswer> {
  const startTime = performance.now();

  try {
    // Ensure brain is initialized
    if (!isInitialized) {
      await initBrain();
    }

    // Step 1: Try to find a strong curated match
    const bestMatch = getBestMatch(question, lang);

    if (bestMatch) {
      const answer = bestMatch.a[lang] || bestMatch.a.en;
      onToken?.(answer);
      return {
        text: answer,
        source: 'curated',
        matchedId: bestMatch.id,
        ms: Math.round(performance.now() - startTime)
      };
    }

    // Step 2: If no strong match and SLM is ready, use SLM
    if (brainStatus.mode === 'slm-ready' && isSLMReady()) {
      try {
        const topMatches = getTopMatches(question, lang, 3);
        const context = topMatches.map(m => formatPassageForContext(m));
        const prompt = buildPrompt(question, lang, context);

        const answer = await Promise.race([
          generateWithSLM(prompt, onToken),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 8000)
          )
        ]);

        return {
          text: answer,
          source: 'slm',
          ms: Math.round(performance.now() - startTime)
        };
      } catch (slmError) {
        console.warn('SLM generation failed, falling back to curated:', slmError);
        // Fall through to fallback
      }
    }

    // Step 3: Fallback - return best available curated answer or generic message
    const topMatches = getTopMatches(question, lang, 1);
    const fallbackText = topMatches.length > 0
      ? (topMatches[0].a[lang] || topMatches[0].a.en)
      : getFallbackMessage(lang);

    onToken?.(fallbackText);
    return {
      text: fallbackText,
      source: 'fallback',
      matchedId: topMatches.length > 0 ? topMatches[0].id : undefined,
      ms: Math.round(performance.now() - startTime)
    };
  } catch (error) {
    console.error('askTutor error:', error);
    // Never reject - always return a fallback
    const fallback = getFallbackMessage(lang);
    return {
      text: fallback,
      source: 'fallback',
      ms: Math.round(performance.now() - startTime)
    };
  }
}

function getFallbackMessage(lang: Lang): string {
  const messages: Record<Lang, string> = {
    en: "I don't have an answer offline. Please check the lessons for more information.",
    hi: "मेरे पास ऑफलाइन उत्तर नहीं है। कृपया अधिक जानकारी के लिए पाठ देखें।",
    mr: "माझ्याकडे ऑफलाइन उत्तर नाही. कृपया अधिक माहितीसाठी धडे पहा."
  };
  return messages[lang];
}

export function getBrainStatus(): BrainStatus {
  return brainStatus;
}
