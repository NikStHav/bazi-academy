// Daily tip notifications, scheduled locally on the device for the next 30 days (no server).
import { STEMS, BRANCHES, TEN_GODS } from './data.js';
import { tenGod, pillarName } from './bazi.js';
import { dayInfo, RATING_LABEL } from './almanac.js';

const Cap = window.Capacitor;
const LN = Cap?.isNativePlatform?.() ? Cap.registerPlugin('LocalNotifications') : null;
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
  let title = `${pillarName(p)} · ${o.zh} ${o.name} day (${RATING_LABEL[o.rating].toLowerCase()})`;
  let body = `Good for: ${o.good.split(',')[0].toLowerCase()}.`;
  if (mine) {
    const g = TEN_GODS[tenGod(mine.dayMaster, p.stem)];
    title = `${pillarName(p)} – a ${g.name} day for you`;
    body = `${o.zh} ${o.name} day: good for ${o.good.split(',')[0].toLowerCase()}.${info.personalClash.length ? ' Clash with your chart – take it easy.' : ''}`;
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
