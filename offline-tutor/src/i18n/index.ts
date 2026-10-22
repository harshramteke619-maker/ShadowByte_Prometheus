import type { Lang, I18NAPI } from '../contract/types';
import { strings } from './strings';
let lang: Lang = ((): Lang => { try { const v = localStorage.getItem('lang'); if (v === 'hi' || v === 'mr' || v === 'en') return v; } catch {} return 'en'; })();
const subs = new Set<(l: Lang) => void>();
export const i18n: I18NAPI = {
  t: (key, l) => strings[key]?.[l ?? lang] ?? strings[key]?.en ?? key,
  getLang: () => lang,
  setLang: (l) => { lang = l; try { localStorage.setItem('lang', l); } catch {} subs.forEach(cb => cb(l)); },
  onLangChange: (cb) => { subs.add(cb); return () => { subs.delete(cb); }; },
};
