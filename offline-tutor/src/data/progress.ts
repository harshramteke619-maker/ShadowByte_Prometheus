import type { Progress } from '../contract/types';
import { db } from './db';
import type { ProgressRow } from './db';

const DEFAULT_PROGRESS: Progress = {
  xp: 0,
  level: 1,
  streak: 0,
  lastActiveDate: '',
  badges: [],
  mastery: {},
  completedModules: [],
};

export async function getProgress(): Promise<Progress> {
  try {
    const row = await db.progress.get('me');
    if (!row) return { ...DEFAULT_PROGRESS };
    const { id: _id, ...rest } = row;
    return rest as Progress;
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export async function saveProgress(patch: Partial<Progress>): Promise<Progress> {
  try {
    const current = await getProgress();
    const merged: Progress = { ...current, ...patch };
    const row: ProgressRow = { id: 'me', ...merged };
    await db.progress.put(row);
    return merged;
  } catch {
    return await getProgress();
  }
}
