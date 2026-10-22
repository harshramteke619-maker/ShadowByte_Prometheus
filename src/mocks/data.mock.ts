import type { LessonModule, QuizQuestion, Progress, SyncStatus } from '../contract/types';
let modules: LessonModule[] = [];
let progress: Progress = { xp: 0, level: 1, streak: 1, lastActiveDate: '', badges: [], mastery: {}, completedModules: [] };
const subs = new Set<(s: SyncStatus) => void>();
const sync: SyncStatus = navigator.onLine ? 'synced' : 'offline';
export async function initData() { if (!modules.length) modules = (await (await fetch('/data/content.json')).json()).modules; }
export async function getModules() { await initData(); return modules; }
export async function getQuiz(id: string): Promise<QuizQuestion[]> { await initData(); return modules.find(m => m.id === id)?.quiz ?? []; }
export async function getProgress() { return { ...progress }; }
export async function saveProgress(p: Partial<Progress>) { progress = { ...progress, ...p }; return { ...progress }; }
export async function updateMastery(id: string, c: boolean) { const m = 0.7 * (progress.mastery[id] ?? 0.3) + 0.3 * (c ? 1 : 0); progress.mastery[id] = m; return m; }
export async function addXP(n: number) { progress.xp += n; progress.level = Math.floor(progress.xp / 100) + 1; return { ...progress }; }
export async function completeModule(id: string) { if (!progress.completedModules.includes(id)) progress.completedModules.push(id); return { ...progress }; }
export async function exportPack(_ids?: string[]) { return JSON.stringify(modules); }
export async function importPack(_s: string) { return { added: 0 }; }
export function getSyncStatus(): SyncStatus { return sync; }
export function onSyncStatus(cb: (s: SyncStatus) => void) { subs.add(cb); cb(sync); return () => { subs.delete(cb); }; }
