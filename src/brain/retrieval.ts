import Fuse from 'fuse.js';
import type { Lang } from '../contract/types';

export interface QAEntry {
  id: string;
  keywords: string[];
  q: Record<Lang, string>;
  a: Record<Lang, string>;
}

let fuseInstance: Fuse<QAEntry> | null = null;
let qaData: QAEntry[] = [];

export async function loadQAData(): Promise<void> {
  if (fuseInstance) return; // Already loaded

  try {
    const response = await fetch('/data/qa.json');
    if (!response.ok) throw new Error('Failed to load qa.json');
    const data = await response.json();
    qaData = data.entries || [];

    // Configure Fuse.js for fuzzy search
    const options = {
      keys: [
        { name: 'q.en', weight: 2 },
        { name: 'q.hi', weight: 2 },
        { name: 'q.mr', weight: 2 },
        { name: 'keywords', weight: 3 }
      ],
      threshold: 0.4, // Allow some fuzziness for typos
      includeScore: true
    };

    fuseInstance = new Fuse(qaData, options);
  } catch (error) {
    console.error('Failed to load QA data:', error);
    qaData = [];
    fuseInstance = new Fuse([], { keys: ['q.en'], threshold: 0.4 });
  }
}

export function normalizeQuestion(question: string): string {
  return question.toLowerCase().trim().replace(/[^\w\s\u0900-\u097F]/g, '');
}

export interface SearchResult {
  entry: QAEntry;
  score: number;
}

export function searchQA(question: string, lang?: Lang): SearchResult[] {
  if (!fuseInstance) {
    console.warn('QA data not loaded, returning empty results');
    return [];
  }

  const normalized = normalizeQuestion(question);

  // Search across all languages (voice transcripts may be mixed)
  const results = fuseInstance.search(normalized);

  return results.map(r => ({
    entry: r.item,
    score: r.score || 1
  }));
}

export function getBestMatch(question: string, lang?: Lang): QAEntry | null {
  const results = searchQA(question, lang);
  
  // Strong match: score < 0.3
  if (results.length > 0 && results[0].score < 0.3) {
    return results[0].entry;
  }
  
  return null;
}

export function getTopMatches(question: string, lang?: Lang, count = 3): QAEntry[] {
  const results = searchQA(question, lang);
  return results.slice(0, count).map(r => r.entry);
}

export function getAllQA(): QAEntry[] {
  return qaData;
}
