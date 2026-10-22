import { deflate, inflate } from 'pako';
import type { LessonModule, Localized } from '../contract/types';
import { db } from './db';

interface PackPayload {
  v: number;
  modules: LessonModule[];
}

function hasLocalized(obj: unknown): obj is Localized {
  if (!obj || typeof obj !== 'object') return false;
  const o = obj as Record<string, unknown>;
  return typeof o.en === 'string' && typeof o.hi === 'string' && typeof o.mr === 'string';
}

function isValidModule(m: unknown): m is LessonModule {
  if (!m || typeof m !== 'object') return false;
  const mod = m as Record<string, unknown>;
  return (
    typeof mod.id === 'string' &&
    hasLocalized(mod.title) &&
    hasLocalized(mod.explanation) &&
    Array.isArray(mod.quiz)
  );
}

export async function exportPack(moduleIds?: string[]): Promise<string> {
  try {
    let modules: LessonModule[];
    if (moduleIds && moduleIds.length > 0) {
      const results = await Promise.all(moduleIds.map((id) => db.modules.get(id)));
      modules = results.filter((m): m is LessonModule => m !== undefined);
    } else {
      modules = await db.modules.toArray();
    }
    const json = JSON.stringify({ v: 1, modules });
    const bytes = new TextEncoder().encode(json);
    const compressed = deflate(bytes);
    // Convert Uint8Array to base64 in chunks to avoid call stack overflow
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < compressed.length; i += chunkSize) {
      binary += String.fromCharCode(...compressed.subarray(i, i + chunkSize));
    }
    return btoa(binary);
  } catch {
    return '';
  }
}

export async function importPack(pack: string): Promise<{ added: number }> {
  try {
    const binary = atob(pack);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const decompressed = inflate(bytes);
    const json = new TextDecoder().decode(decompressed);
    const data = JSON.parse(json) as PackPayload;
    if (data.v !== 1 || !Array.isArray(data.modules)) return { added: 0 };

    let added = 0;
    for (const mod of data.modules) {
      if (!isValidModule(mod)) continue;
      const existing = await db.modules.get(mod.id);
      if (existing) continue;
      await db.modules.put(mod);
      added++;
    }
    return { added };
  } catch {
    return { added: 0 };
  }
}
