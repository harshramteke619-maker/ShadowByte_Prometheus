import type { LessonModule, QuizQuestion } from '../contract/types';
import { db } from './db';

export async function getModules(): Promise<LessonModule[]> {
  try {
    return await db.modules.orderBy('id').toArray();
  } catch {
    return [];
  }
}

export async function getQuiz(moduleId: string): Promise<QuizQuestion[]> {
  try {
    const mod = await db.modules.get(moduleId);
    return mod?.quiz ?? [];
  } catch {
    return [];
  }
}
