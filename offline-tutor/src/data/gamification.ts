import type { Progress } from '../contract/types';
import { db } from './db';
import { getProgress, saveProgress } from './progress';

function todayLocal(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function yesterdayLocal(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function updateStreak(p: Progress): Progress {
  const today = todayLocal();
  if (p.lastActiveDate === today) return p;
  const streak = p.lastActiveDate === yesterdayLocal() ? p.streak + 1 : 1;
  return { ...p, streak, lastActiveDate: today };
}

function checkBadges(p: Progress): Progress {
  const badges = new Set(p.badges);
  // first_quiz: logged at least one attempt → caller already logged attempt
  badges.add('first_quiz');
  // streak_3
  if (p.streak >= 3) badges.add('streak_3');
  // module_master: any mastery >= 0.8
  for (const v of Object.values(p.mastery)) {
    if (v >= 0.8) { badges.add('module_master'); break; }
  }
  // explorer: >= 3 completed
  if (p.completedModules.length >= 3) badges.add('explorer');
  return { ...p, badges: [...badges] };
}

export async function updateMastery(moduleId: string, correct: boolean): Promise<number> {
  try {
    const p = await getProgress();
    const old = p.mastery[moduleId] ?? 0.3;
    const val = 0.7 * old + 0.3 * (correct ? 1 : 0);
    const mastery = { ...p.mastery, [moduleId]: val };
    let updated: Progress = { ...p, mastery };
    updated = updateStreak(updated);
    updated = checkBadges(updated);
    await saveProgress(updated);
    await db.attempts.add({ moduleId, correct, ts: Date.now() });
    return val;
  } catch {
    return 0;
  }
}

export async function addXP(n: number): Promise<Progress> {
  try {
    const p = await getProgress();
    const xp = p.xp + n;
    const level = Math.floor(xp / 100) + 1;
    let updated: Progress = { ...p, xp, level };
    updated = checkBadges(updated);
    return await saveProgress(updated);
  } catch {
    return await getProgress();
  }
}

export async function completeModule(moduleId: string): Promise<Progress> {
  try {
    const p = await getProgress();
    const completedModules = p.completedModules.includes(moduleId)
      ? p.completedModules
      : [...p.completedModules, moduleId];
    let updated: Progress = { ...p, completedModules };
    updated = checkBadges(updated);
    await saveProgress(updated);
    return await addXP(50);
  } catch {
    return await getProgress();
  }
}
