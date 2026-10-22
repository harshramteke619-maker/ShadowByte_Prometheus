// OWNER: P4 Zaid. Must export exactly DataAPI.
import type { LessonModule, QuizQuestion, Progress, SyncStatus } from '../contract/types';
import { db } from './db';
import { getProgress as _getProgress, saveProgress as _saveProgress } from './progress';
import { getModules as _getModules, getQuiz as _getQuiz } from './quiz';

let _initialized = false;

export async function initData(): Promise<void> {
  try {
    if (_initialized) return;
    const count = await db.modules.count();
    if (count === 0) {
      const res = await fetch('/data/content.json');
      const json = await res.json() as { version: number; modules: LessonModule[] };
      await db.modules.bulkPut(json.modules);
    }
    await navigator.storage?.persist?.();
    _initialized = true;
  } catch {
    // swallow – offline-first, data may already exist
  }
}

export async function getModules(): Promise<LessonModule[]> {
  return _getModules();
}

export async function getQuiz(moduleId: string): Promise<QuizQuestion[]> {
  return _getQuiz(moduleId);
}

export async function getProgress(): Promise<Progress> {
  return _getProgress();
}

export async function saveProgress(patch: Partial<Progress>): Promise<Progress> {
  return _saveProgress(patch);
}

export async function updateMastery(_moduleId: string, _correct: boolean): Promise<number> {
  return 0;
}

export async function addXP(_n: number): Promise<Progress> {
  return _getProgress();
}

export async function completeModule(_moduleId: string): Promise<Progress> {
  return _getProgress();
}

export async function exportPack(_moduleIds?: string[]): Promise<string> {
  return '';
}

export async function importPack(_pack: string): Promise<{ added: number }> {
  return { added: 0 };
}

export function getSyncStatus(): SyncStatus {
  return 'offline';
}

export function onSyncStatus(_cb: (s: SyncStatus) => void): () => void {
  return () => {};
}
