// OWNER: P4 Zaid. Must export exactly DataAPI.
import type { LessonModule, QuizQuestion, Progress, SyncStatus } from '../contract/types';
import { db } from './db';
import { getProgress as _getProgress, saveProgress as _saveProgress } from './progress';
import { getModules as _getModules, getQuiz as _getQuiz } from './quiz';
import {
  updateMastery as _updateMastery,
  addXP as _addXP,
  completeModule as _completeModule,
} from './gamification';
import { exportPack as _exportPack, importPack as _importPack } from './pack';

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

export async function updateMastery(moduleId: string, correct: boolean): Promise<number> {
  return _updateMastery(moduleId, correct);
}

export async function addXP(n: number): Promise<Progress> {
  return _addXP(n);
}

export async function completeModule(moduleId: string): Promise<Progress> {
  return _completeModule(moduleId);
}

export async function exportPack(moduleIds?: string[]): Promise<string> {
  return _exportPack(moduleIds);
}

export async function importPack(pack: string): Promise<{ added: number }> {
  return _importPack(pack);
}

export function getSyncStatus(): SyncStatus {
  return 'offline';
}

export function onSyncStatus(_cb: (s: SyncStatus) => void): () => void {
  return () => {};
}
