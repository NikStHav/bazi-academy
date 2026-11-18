// Daily tip notifications, scheduled locally on the device for the next 30 days (no server).
import { STEMS, BRANCHES, TEN_GODS } from './data.js';
import { tenGod, pillarName } from './bazi.js';
import { dayInfo, RATING_LABEL } from './almanac.js';

import { plugin } from './cap.js';
import { collectEvents } from './ics.js';
import { t, LOCALE } from './i18n.js';

const LN = plugin('LocalNotifications');
const KEY = 'bazi.notify';
const BASE_ID = 7100;
const DAYS = 30;

export const supported = !!LN;
const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || { on: false, time: '08:00' }; } catch { return { on: false, time: '08:00' }; } };
const write = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* ignore */ } };
export const getSettings = read;

/** Text of the tip for a date. */
export function dailyMessage(date, mine) {
  const info = dayInfo(date.getFullYear(), date.getMonth() + 1, date.getDate(), mine);
  const p = info.pillars.day;
  const o = info.officer;
  const good = o.good.split(',')[0];
  let title = `${pillarName(p)} · ${t('{name} day', { name: `${o.zh} ${o.name}` })} (${RATING_LABEL[o.rating]})`;
  let body = `${t('Good for:')} ${good}.`;
  if (mine) {
    const g = TEN_GODS[tenGod(mine.dayMaster, p.stem)];
    title = `${pillarName(p)} – ${t('a {god} day for you', { god: g.name })}`;
    body = `${t('{name} day', { name: `${o.zh} ${o.name}` })} – ${t('Good for:')} ${good}.${info.personalClash.length ? t(' Clash with your chart – take it easy.') : ''}`;
  }
  return { title, body: `${body} (${STEMS[p.stem].py} ${BRANCHES[p.branch].animal})` };
}

async function cancelAll() {
  if (!LN) return;
  await LN.cancel({ notifications: Array.from({ length: DAYS + 1 }, (_, i) => ({ id: BASE_ID + i })) }).catch(() => {});
}

/** Re-plan the next 30 days (call on start-up and whenever settings or "my chart" change). */
export async function reschedule(mine) {
  if (!LN) return;
  const s = read();
  await cancelAll();
  if (!s.on) return;
  const [hh, mm] = s.time.split(':').map(Number);
  const now = new Date();
  const notifications = [];
  for (let i = 0; i <= DAYS; i++) {
    const at = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, hh, mm);
    if (at <= now) continue;
    const { title, body } = dailyMessage(at, mine);
    notifications.push({ id: BASE_ID + i, title, body, schedule: { at, allowWhileIdle: true, isExactNotification: false } });
  }
  await LN.schedule({ notifications }).catch(() => {});
}

/** Turn tips on (asks for permission). Resolves true if enabled. */
export async function enable(time, mine) {
  if (!LN) return false;
  let perm = await LN.checkPermissions().catch(() => ({ display: 'denied' }));
  if (perm.display !== 'granted') perm = await LN.requestPermissions().catch(() => ({ display: 'denied' }));
  if (perm.display !== 'granted') return false;
  write({ on: true, time });
  await reschedule(mine);
  return true;
}

export async function disable() { write({ ...read(), on: false }); await cancelAll(); }
export async function setTime(time, mine) { write({ ...read(), time }); await reschedule(mine); }

// ---------- lunar event reminders (full/new moon, solar terms, festivals) ----------
const REM_KEY = 'bazi.reminders';
const REM_BASE = 7400;
const REM_MAX = 30; // iOS allows 64 pending notifications in total (daily tips use up to 31)
const REM_DEFAULT = { on: false, when: 'evening', kinds: { full: true, new: false, major: true, terms: false, fest: true } };
export function getReminders() {
  try { const v = JSON.parse(localStorage.getItem(REM_KEY)); return v ? { ...REM_DEFAULT, ...v, kinds: { ...REM_DEFAULT.kinds, ...v.kinds } } : REM_DEFAULT; } catch { return REM_DEFAULT; }
}
const writeRem = (v) => { try { localStorage.setItem(REM_KEY, JSON.stringify(v)); } catch { /* ignore */ } };

/** When to notify for an event: 'evening' (19:00 the day before), 'morning' (08:00 on the day) or 'exact'. */
export function reminderTime(e, when) {
  const day = e.allDay ? new Date(+e.date.slice(0, 4), +e.date.slice(4, 6) - 1, +e.date.slice(6)) : new Date(e.ms);
  if (when === 'exact' && !e.allDay) return new Date(e.ms);
  if (when === 'evening') return new Date(day.getFullYear(), day.getMonth(), day.getDate() - 1, 19, 0);
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), 8, 0);
}

export function reminderText(e, when) {
  const tm = e.allDay ? '' : new Date(e.ms).toLocaleTimeString(LOCALE, { hour: '2-digit', minute: '2-digit' });
  const day = when === 'evening' ? t('Tomorrow') : t('Today');
  return { title: `${e.title}${when === 'exact' && !e.allDay ? t(' – now') : ''}`,
    body: `${when === 'exact' && !e.allDay ? '' : `${tm ? t('{day} at {time}', { day, time: tm }) : day}. `}${e.desc}` };
}

async function cancelReminders() {
  if (!LN) return;
  await LN.cancel({ notifications: Array.from({ length: REM_MAX }, (_, i) => ({ id: REM_BASE + i })) }).catch(() => {});
}

export async function rescheduleReminders() {
  if (!LN) return;
  const r = getReminders();
  await cancelReminders();
  if (!r.on) return;
  const now = Date.now();
  const events = collectEvents(now - 86400000, now + 150 * 86400000, r.kinds)
    .map((e) => ({ e, at: reminderTime(e, r.when) })).filter((x) => x.at.getTime() > now).slice(0, REM_MAX);
  const notifications = events.map(({ e, at }, i) => ({ id: REM_BASE + i, ...reminderText(e, r.when), schedule: { at, allowWhileIdle: true, isExactNotification: false } }));
  if (notifications.length) await LN.schedule({ notifications }).catch(() => {});
}

/** Save reminder settings; turning them on asks for notification permission. Resolves false if permission was refused. */
export async function setReminders(next) {
  if (next.on && LN) {
    let perm = await LN.checkPermissions().catch(() => ({ display: 'denied' }));
    if (perm.display !== 'granted') perm = await LN.requestPermissions().catch(() => ({ display: 'denied' }));
    if (perm.display !== 'granted') { writeRem({ ...next, on: false }); return false; }
  }
  writeRem(next);
  await rescheduleReminders();
  return true;
}
