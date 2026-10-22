// OWNER: P2 Sayal. Text-to-speech via the browser's speechSynthesis.
// Rules: never throws, never rejects, silent no-op when no voice exists.
import type { Lang } from '../contract/types';

const LANG_TAG: Record<Lang, string> = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN' };

const hasTTS = (): boolean =>
  typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));
const norm = (tag: string) => tag.toLowerCase().replace('_', '-'); // some Android voices use hi_IN
const prefixOf = (v: SpeechSynthesisVoice) => norm(v.lang).split('-')[0];

let voices: SpeechSynthesisVoice[] = [];
let loading: Promise<SpeechSynthesisVoice[]> | null = null;
let currentRun = 0; // bumps on every speak()/stopSpeaking() so stale calls bail out

/** Android loads voices asynchronously. Resolves with whatever exists after `timeoutMs`. */
export function loadVoices(timeoutMs = 2500): Promise<SpeechSynthesisVoice[]> {
  if (!hasTTS()) return Promise.resolve([]);
  if (voices.length) return Promise.resolve(voices);
  if (loading) return loading;
  const synth = window.speechSynthesis;
  loading = new Promise<SpeechSynthesisVoice[]>(resolve => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      synth.removeEventListener('voiceschanged', onChange);
      voices = synth.getVoices();
      loading = null;
      resolve(voices);
    };
    const onChange = () => { if (synth.getVoices().length) finish(); };
    const timer = setTimeout(finish, timeoutMs);
    synth.addEventListener('voiceschanged', onChange);
    onChange(); // voices may already be available (desktop Chrome, Firefox)
  });
  return loading;
}

// Keep the cache fresh if voices get installed later; warm it up at import (cheap, no model involved).
if (hasTTS()) {
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    voices = window.speechSynthesis.getVoices();
  });
  void loadVoices();
}

// Offline-first scoring: a LOCAL voice works in airplane mode, a network voice does not.
const score = (v: SpeechSynthesisVoice, tag: string) =>
  (v.localService ? 2 : 0) + (norm(v.lang) === norm(tag) ? 1 : 0);

function pick(prefix: string, tag: string): SpeechSynthesisVoice | null {
  const matches = voices.filter(v => prefixOf(v) === prefix);
  if (!matches.length) return null;
  return matches.reduce((best, v) => (score(v, tag) > score(best, tag) ? v : best));
}

function pickVoice(lang: Lang): SpeechSynthesisVoice | null {
  const own = pick(lang, LANG_TAG[lang]);
  if (own || lang !== 'mr') return own;
  return pick('hi', LANG_TAG.hi); // Marathi has no voice -> Hindi voice (same Devanagari script)
}

/** Split into sentence-sized pieces. Long utterances get cut off on some Android/Chrome builds. */
function chunk(text: string, max = 180): string[] {
  const sentences = text.replace(/\s+/g, ' ').match(/[^.!?।]+[.!?।]*/g) ?? [text];
  const out: string[] = [];
  let cur = '';
  for (const s of sentences) {
    if (cur.trim() && (cur + s).length > max) { out.push(cur.trim()); cur = ''; }
    cur += s;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

export async function speak(text: string, lang: Lang): Promise<void> {
  try {
    if (!hasTTS()) return;
    const clean = text.replace(/[*_#`>]/g, '').trim(); // don't read markdown symbols aloud
    if (!clean) return;

    const run = ++currentRun;
    await loadVoices();
    if (run !== currentRun) return;

    const synth = window.speechSynthesis;
    if (synth.speaking || synth.pending) { synth.cancel(); await sleep(60); } // Chrome drops speak() right after cancel()
    if (run !== currentRun) return;

    const voice = pickVoice(lang);
    const parts = chunk(clean);

    await new Promise<void>(resolve => {
      let finished = false;
      const done = () => { if (finished) return; finished = true; clearTimeout(watchdog); resolve(); };
      const watchdog = setTimeout(done, Math.max(8000, clean.length * 130)); // some builds never fire onend
      parts.forEach((part, i) => {
        const u = new SpeechSynthesisUtterance(part);
        if (voice) { u.voice = voice; u.lang = voice.lang; } else { u.lang = LANG_TAG[lang]; }
        u.rate = 0.9; // slightly slow = clearer for students
        u.onerror = done; // also fires on cancel(), which is what we want
        if (i === parts.length - 1) u.onend = done;
        synth.speak(u);
      });
    });
  } catch {
    /* never throw into the UI */
  }
}

export function stopSpeaking(): void {
  currentRun++;
  try { if (hasTTS()) window.speechSynthesis.cancel(); } catch { /* ignore */ }
}

/** Sync. Call after initVoice()/loadVoices() so the cache is warm. mr is true if a Hindi fallback voice exists. */
export function getTtsVoices(): Record<Lang, boolean> {
  return { en: !!pickVoice('en'), hi: !!pickVoice('hi'), mr: !!pickVoice('mr') };
}
