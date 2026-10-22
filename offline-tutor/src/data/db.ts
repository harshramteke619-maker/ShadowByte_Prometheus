import Dexie from 'dexie';
import type { LessonModule } from '../contract/types';

export interface AttemptRow {
  id?: number;
  moduleId: string;
  correct: boolean;
  ts: number;
}

export interface SyncQueueRow {
  id?: number;
  ts: number;
}

export interface ProgressRow {
  id: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  badges: string[];
  mastery: Record<string, number>;
  completedModules: string[];
}

class OfflineTutorDB extends Dexie {
  modules!: Dexie.Table<LessonModule, string>;
  progress!: Dexie.Table<ProgressRow, string>;
  attempts!: Dexie.Table<AttemptRow, number>;
  syncQueue!: Dexie.Table<SyncQueueRow, number>;

  constructor() {
    super('OfflineTutorDB');
    this.version(1).stores({
      modules: 'id, subject',
      progress: 'id',
      attempts: '++id, moduleId, correct, ts',
      syncQueue: '++id, ts',
    });
  }
}

export const db = new OfflineTutorDB();
