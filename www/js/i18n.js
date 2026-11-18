// Minimal i18n: English source strings are the keys; other languages map them to translations.
import { DE_UI } from './i18n/de-ui.js';

const KEY = 'bazi.lang';
export const LANGS = { en: 'English', de: 'Deutsch' };
const DICTS = { de: DE_UI };

function stored() { try { const v = globalThis.localStorage?.getItem(KEY); return v && LANGS[v] ? v : null; } catch { return null; } }
function detect() {
  const forced = globalThis.process?.env?.BAZI_LANG || globalThis.__BAZI_LANG;
  if (forced && LANGS[forced]) return forced;
  const s = stored(); if (s) return s;
  const nav = String(globalThis.navigator?.languages?.[0] || globalThis.navigator?.language || 'en').toLowerCase();
  return nav.startsWith('de') ? 'de' : 'en';
}

export const lang = detect();
const navLang = String(globalThis.navigator?.language || '');
/** Locale for dates and numbers: the device locale if it matches the app language, else a default for the language. */
export const LOCALE = navLang.toLowerCase().startsWith(lang) ? navLang : { de: 'de-DE', en: 'en-GB' }[lang];
export const langSetting = () => stored() || 'auto';
export function setLang(v) {
  try { if (v === 'auto') globalThis.localStorage?.removeItem(KEY); else globalThis.localStorage?.setItem(KEY, v); } catch { /* ignore */ }
}

export const missing = new Set();
globalThis.__i18nMissing = missing; // read by the smoke test
/** Translate an English source string; {name} placeholders are filled from `vars`. */
export function t(s, vars) {
  let out = s;
  const dict = DICTS[lang];
  if (dict) { if (s in dict) out = dict[s]; else missing.add(s); }
  if (vars) out = out.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
  return out;
}
/** Pick the variant for the current language from { en, de }. */
export const pick = (o) => (lang in o ? o[lang] : o.en);
