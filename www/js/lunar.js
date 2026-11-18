// Chinese lunisolar calendar (农历), moon phases and the 24 solar terms – computed astronomically, offline.
// New/full moons: J. Meeus, Astronomical Algorithms, ch. 49 (accuracy about a minute).
import { sunLongitude, findSolarLongitude, jdFromMs, msFromJd } from './bazi.js';

const DEG = Math.PI / 180;
const DAY = 86400000;
const BJ = 8 * 3600000; // the Chinese calendar is defined for China Standard Time (UTC+8)

export const SOLAR_TERMS = [
  [315, '立春', 'Start of Spring'], [330, '雨水', 'Rain Water'], [345, '惊蛰', 'Awakening of Insects'], [0, '春分', 'Spring Equinox'],
  [15, '清明', 'Clear and Bright'], [30, '谷雨', 'Grain Rain'], [45, '立夏', 'Start of Summer'], [60, '小满', 'Grain Buds'],
  [75, '芒种', 'Grain in Ear'], [90, '夏至', 'Summer Solstice'], [105, '小暑', 'Minor Heat'], [120, '大暑', 'Major Heat'],
  [135, '立秋', 'Start of Autumn'], [150, '处暑', 'End of Heat'], [165, '白露', 'White Dew'], [180, '秋分', 'Autumn Equinox'],
  [195, '寒露', 'Cold Dew'], [210, '霜降', 'Frost’s Descent'], [225, '立冬', 'Start of Winter'], [240, '小雪', 'Minor Snow'],
  [255, '大雪', 'Major Snow'], [270, '冬至', 'Winter Solstice'], [285, '小寒', 'Minor Cold'], [300, '大寒', 'Major Cold'],
].map(([lon, zh, name]) => ({ lon, zh, name, major: lon % 90 === 0 }));

const NM = [[-0.40720, 0, 0, 1, 0], [0.17241, 1, 1, 0, 0], [0.01608, 0, 0, 2, 0], [0.01039, 0, 0, 0, 2], [0.00739, 1, -1, 1, 0],
  [-0.00514, 1, 1, 1, 0], [0.00208, 2, 2, 0, 0], [-0.00111, 0, 0, 1, -2], [-0.00057, 0, 0, 1, 2], [0.00056, 1, 1, 2, 0],
  [-0.00042, 0, 0, 3, 0], [0.00042, 1, 1, 0, 2], [0.00038, 1, 1, 0, -2], [-0.00024, 1, -1, 2, 0]];
const FM = [[-0.40614, 0, 0, 1, 0], [0.17302, 1, 1, 0, 0], [0.01614, 0, 0, 2, 0], [0.01043, 0, 0, 0, 2], [0.00734, 1, -1, 1, 0],
  [-0.00515, 1, 1, 1, 0], [0.00209, 2, 2, 0, 0], [-0.00111, 0, 0, 1, -2], [-0.00057, 0, 0, 1, 2], [0.00056, 1, 1, 2, 0],
  [-0.00042, 0, 0, 3, 0], [0.00042, 1, 1, 0, 2], [0.00038, 1, 1, 0, -2], [-0.00024, 1, -1, 2, 0]];
// [coefficient, M multiplier, M' multiplier, F multiplier] small terms shared by both phases (no E factor)
const SMALL = [[-0.00007, 2, 1, 0], [0.00004, 0, 2, -2], [0.00004, 3, 0, 0], [0.00003, 1, 1, -2], [0.00003, 0, 2, 2],
  [-0.00003, 1, 1, 2], [0.00003, -1, 1, 2], [-0.00002, -1, 1, -2], [-0.00002, 1, 3, 0], [0.00002, 0, 4, 0]];
const A_COEF = [0.000325, 0.000165, 0.000164, 0.000126, 0.000110, 0.000062, 0.000060, 0.000056, 0.000047, 0.000042, 0.000040, 0.000037, 0.000035, 0.000023];

/** Instant (ms UTC) of new moon (phase 0) or full moon (phase 0.5) for lunation number k (k = 0 ≈ 6 Jan 2000). */
export function moonPhaseMs(k, phase = 0) {
  k += phase;
  const T = k / 1236.85;
  const JDE = 2451550.09766 + 29.530588861 * k + 0.00015437 * T * T - 0.000000150 * T ** 3 + 0.00000000073 * T ** 4;
  const E = 1 - 0.002516 * T - 0.0000074 * T * T;
  const M = (2.5534 + 29.10535670 * k - 0.0000014 * T * T - 0.00000011 * T ** 3) * DEG;
  const Mp = (201.5643 + 385.81693528 * k + 0.0107582 * T * T + 0.00001238 * T ** 3 - 0.000000058 * T ** 4) * DEG;
  const F = (160.7108 + 390.67050284 * k - 0.0016118 * T * T - 0.00000227 * T ** 3 + 0.000000011 * T ** 4) * DEG;
  const O = (124.7746 - 1.56375588 * k + 0.0020672 * T * T + 0.00000215 * T ** 3) * DEG;
  let c = 0;
  for (const [a, e, m, mp, f] of (phase ? FM : NM)) c += a * (e === 2 ? E * E : e ? E : 1) * Math.sin(m * M + mp * Mp + f * F);
  c += -0.00017 * Math.sin(O);
  for (const [a, m, mp, f] of SMALL) c += a * Math.sin(m * M + mp * Mp + f * F);
  const A = [299.77 + 0.107408 * k - 0.009173 * T * T, 251.88 + 0.016321 * k, 251.83 + 26.651886 * k, 349.42 + 36.412478 * k,
    84.66 + 18.206239 * k, 141.74 + 53.303771 * k, 207.14 + 2.453732 * k, 154.84 + 7.306860 * k, 34.52 + 27.261239 * k,
    207.19 + 0.121824 * k, 291.34 + 1.844379 * k, 161.72 + 24.198154 * k, 239.56 + 25.513099 * k, 331.55 + 3.592518 * k];
  A.forEach((x, i) => { c += A_COEF[i] * Math.sin(x * DEG); });
  return msFromJd(JDE + c) - 69000; // TT → UT (ΔT ≈ 69 s)
}

const kNear = (ms) => Math.floor((jdFromMs(ms) - 2451550.09766) / 29.530588861);

/** New and full moons between two instants: [{ type: 'new'|'full', ms }] */
export function moonEvents(fromMs, toMs) {
  const out = [];
  for (let k = kNear(fromMs) - 1; k <= kNear(toMs) + 1; k++) {
    for (const [type, ph] of [['new', 0], ['full', 0.5]]) {
      const ms = moonPhaseMs(k, ph);
      if (ms >= fromMs && ms < toMs) out.push({ type, ms });
    }
  }
  return out.sort((a, b) => a.ms - b.ms);
}

/** All 24 solar terms between two instants: [{ ...term, ms }] */
export function solarTermsBetween(fromMs, toMs) {
  const out = [];
  for (let t = fromMs - 20 * DAY; t < toMs + 20 * DAY; t += 5 * DAY) { // the sun moves ~5° in 5 days, so no term is skipped
    const lon = Math.round(sunLongitude(jdFromMs(t)) / 15) * 15 % 360;
    const term = SOLAR_TERMS.find((x) => x.lon === lon);
    const ms = findSolarLongitude(lon, t);
    if (ms >= fromMs && ms < toMs && !out.some((o) => Math.abs(o.ms - ms) < DAY)) out.push({ ...term, ms });
  }
  return out.sort((a, b) => a.ms - b.ms);
}

// Day number of an instant in China (days since 1970-01-01, UTC+8)
const bjDay = (ms) => Math.floor((ms + BJ) / DAY);

/** Lunar months of the "sui" that ends at the winter solstice of `year`: [{ startDay, num, leap }] (startDay in China day numbers). */
function suiMonths(year) {
  const ws1 = findSolarLongitude(270, Date.UTC(year - 1, 11, 21)), ws2 = findSolarLongitude(270, Date.UTC(year, 11, 21));
  const news = moonEvents(ws1 - 40 * DAY, ws2 + 40 * DAY).filter((e) => e.type === 'new').map((e) => bjDay(e.ms));
  const i11 = news.filter((d) => d <= bjDay(ws1)).length - 1;
  const j11 = news.filter((d) => d <= bjDay(ws2)).length - 1;
  const starts = news.slice(i11, j11 + 2); // month 11 … next month 11, plus the month after
  const months = [];
  const leapYear = j11 - i11 === 13;
  const zq = solarTermsBetween(ws1 - DAY, ws2 + 40 * DAY).filter((t) => t.lon % 30 === 0).map((t) => bjDay(t.ms));
  let num = 11, leapUsed = false;
  for (let i = 0; i < starts.length - 1; i++) {
    let leap = false;
    if (i > 0) {
      const hasZq = zq.some((d) => d >= starts[i] && d < starts[i + 1]);
      if (leapYear && !leapUsed && !hasZq && i < j11 - i11) { leap = true; leapUsed = true; }
      else num = num % 12 + 1;
    }
    months.push({ startDay: starts[i], endDay: starts[i + 1], num, leap });
  }
  return months;
}

const cache = new Map();
function monthsAround(year) {
  if (!cache.has(year)) {
    const a = suiMonths(year), b = suiMonths(year + 1);
    const all = [...a];
    for (const m of b) if (!all.some((x) => x.startDay === m.startDay)) all.push(m);
    cache.set(year, all);
  }
  return cache.get(year);
}

export const MONTH_NAMES = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
const DIGITS = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
export const dayName = (d) => (d <= 10 ? '初' + DIGITS[d] : d < 20 ? '十' + DIGITS[d - 10] : d === 20 ? '二十' : d < 30 ? '廿' + DIGITS[d - 20] : '三十');

/** Lunar date of a calendar date (as observed in China). */
export function lunarDate(year, month, day) {
  const dn = Date.UTC(year, month - 1, day) / DAY;
  for (const y of [year, year - 1]) {
    const m = monthsAround(y).find((x) => dn >= x.startDay && dn < x.endDay);
    if (m) {
      // lunar year: months 11/12 before New Year belong to the previous lunar year
      const ny = monthsAround(year).filter((x) => x.num === 1 && !x.leap && x.startDay <= dn).pop() || monthsAround(year - 1).filter((x) => x.num === 1 && !x.leap && x.startDay <= dn).pop();
      const lunarYear = ny ? new Date(ny.startDay * DAY).getUTCFullYear() : year - 1;
      const d = dn - m.startDay + 1;
      return { year: lunarYear, month: m.num, leap: m.leap, day: d, monthLength: m.endDay - m.startDay,
        label: `${m.leap ? '闰' : ''}${MONTH_NAMES[m.num - 1]}${dayName(d)}` };
    }
  }
  return null;
}

const LUNAR_FESTIVALS = {
  '1-1': ['春节', 'Chinese New Year', 'The Spring Festival – the start of the lunar year, celebrated with family, red decorations and fireworks.'],
  '1-15': ['元宵节', 'Lantern Festival', 'The first full moon of the year – lanterns, riddles and sweet rice balls (tangyuan).'],
  '2-2': ['龙抬头', 'Dragon Raises its Head', 'The dragon wakes – a traditional day for a haircut and for welcoming spring rains.'],
  '5-5': ['端午节', 'Dragon Boat Festival', 'Dragon boat races and zongzi rice dumplings, in memory of the poet Qu Yuan.'],
  '7-7': ['七夕', 'Qixi Festival', 'The meeting of the Cowherd and the Weaver Girl – the Chinese festival of love.'],
  '7-15': ['中元节', 'Ghost Festival', 'A day to honour ancestors and appease wandering spirits.'],
  '8-15': ['中秋节', 'Mid-Autumn Festival', 'The harvest full moon – family reunions and mooncakes.'],
  '9-9': ['重阳节', 'Double Ninth Festival', 'A day for climbing heights, chrysanthemums and honouring the elderly.'],
  '12-8': ['腊八节', 'Laba Festival', 'Laba congee is eaten – the start of the New Year preparations.'],
};
const TERM_FESTIVALS = { 15: ['清明节', 'Qingming Festival', 'Tomb-Sweeping Day – families visit and tend their ancestors’ graves.'],
  270: ['冬至', 'Winter Solstice Festival', 'Dongzhi – the turning point of Yin and Yang, celebrated with dumplings or tangyuan.'] };

/** Everything for one calendar date (local), incl. events in the user's time zone. */
export function dayEvents(year, month, day) {
  const lunar = lunarDate(year, month, day);
  const start = new Date(year, month - 1, day).getTime(), end = new Date(year, month - 1, day + 1).getTime();
  const festivals = [];
  if (lunar && !lunar.leap) {
    const f = LUNAR_FESTIVALS[`${lunar.month}-${lunar.day}`];
    if (f) festivals.push(f);
    if (lunar.month === 12 && lunar.day === lunar.monthLength) festivals.push(['除夕', 'Lunar New Year’s Eve', 'The reunion dinner on the last evening of the lunar year.']);
  }
  const terms = solarTermsBetween(start, end);
  for (const t of terms) if (TERM_FESTIVALS[t.lon]) festivals.push(TERM_FESTIVALS[t.lon]);
  return { lunar, festivals: festivals.map(([zh, name, desc]) => ({ zh, name, desc })), terms, moon: moonEvents(start, end) };
}

/** Moon age in days (0 = new moon) and a phase emoji for an instant. */
export function moonAge(ms) {
  const k = kNear(ms);
  let nm = moonPhaseMs(k + 1, 0); if (nm > ms) nm = moonPhaseMs(k, 0); if (nm > ms) nm = moonPhaseMs(k - 1, 0);
  const age = (ms - nm) / DAY;
  const icons = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
  return { age, icon: icons[Math.round((age / 29.530588861) * 8) % 8], illumination: Math.round((1 - Math.cos((age / 29.530588861) * 2 * Math.PI)) * 50) };
}
