// BaZi (Four Pillars) calculation engine. Pure functions, no DOM.
import { STEMS, BRANCHES, ELEMENTS, JIE_TERMS } from './data.js';

const DEG = Math.PI / 180;
const DAY_MS = 86400000;
const mod = (a, n) => ((a % n) + n) % n;

export const jdFromMs = (ms) => ms / DAY_MS + 2440587.5;
export const msFromJd = (jd) => (jd - 2440587.5) * DAY_MS;

/** Apparent geocentric ecliptic longitude of the sun in degrees (Meeus, ch. 25, ~0.01°). */
export function sunLongitude(jd) {
  const T = (jd + 69 / 86400 - 2451545) / 36525; // ~TT
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) * DEG;
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * M) + 0.000289 * Math.sin(3 * M);
  const omega = (125.04 - 1934.136 * T) * DEG;
  return mod(L0 + C - 0.00569 - 0.00478 * Math.sin(omega), 360);
}

/** Find the instant (ms UTC) when the sun reaches `target` longitude, starting near `ms`. */
export function findSolarLongitude(target, ms) {
  let jd = jdFromMs(ms);
  for (let i = 0; i < 8; i++) {
    let diff = mod(target - sunLongitude(jd) + 180, 360) - 180;
    jd += diff / 0.98565;
    if (Math.abs(diff) < 1e-6) break;
  }
  return msFromJd(jd);
}

/** Index 0..59 of a stem/branch pair in the sexagenary cycle. */
export const cycleIndex = (stem, branch) => mod(6 * stem - 5 * branch, 60);
export const pillarFromIndex = (i) => ({ stem: mod(i, 10), branch: mod(i, 12), index: mod(i, 60) });
export const pillarName = (p) => STEMS[p.stem].zh + BRANCHES[p.branch].zh;
export const pillarPinyin = (p) => `${STEMS[p.stem].py} ${BRANCHES[p.branch].py}`;

/** Equation of time in minutes (approximation, ±1 min). */
export function equationOfTime(ms) {
  const d = new Date(ms);
  const start = Date.UTC(d.getUTCFullYear(), 0, 0);
  const N = (ms - start) / DAY_MS;
  const B = (360 / 365) * (N - 81) * DEG;
  return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
}

/**
 * Compute a BaZi chart.
 * input: { year, month, day, hour, minute, tzOffset (hours, e.g. 1 for CET), longitude?, timeUnknown?,
 *          gender: 'm'|'f', ziHourNextDay?: boolean (default true) }
 */
export function computeChart(input) {
  const { year, month, day, hour = 12, minute = 0, tzOffset = 0, longitude = null,
    timeUnknown = false, gender = 'm', ziHourNextDay = true } = input;

  const utcMs = Date.UTC(year, month - 1, day, hour, minute) - tzOffset * 3600000;

  // Local time used for day & hour pillars: true solar time if longitude is given, otherwise clock time.
  let localMs = utcMs + tzOffset * 3600000;
  let solarCorrectionMin = 0;
  if (longitude !== null && longitude !== '' && !Number.isNaN(Number(longitude)) && !timeUnknown) {
    const solarMs = utcMs + (Number(longitude) / 15) * 3600000 + equationOfTime(utcMs) * 60000;
    solarCorrectionMin = Math.round((solarMs - localMs) / 60000);
    localMs = solarMs;
  }
  const local = new Date(localMs); // read with getUTC* = local wall time

  // Month & year pillar from solar longitude (Jie terms), at the exact instant.
  const jd = jdFromMs(utcMs);
  const lon = sunLongitude(jd);
  const monthIdx = Math.floor(mod(lon - 315, 360) / 30); // 0 = Yin (Tiger) month
  let solarYear = local.getUTCFullYear();
  if (local.getUTCMonth() <= 1 && monthIdx >= 10) solarYear -= 1; // before Li Chun
  else if (local.getUTCMonth() === 11 && monthIdx <= 1) solarYear += 1; // safety for edge cases
  const yearIdx = mod(solarYear - 4, 60);
  const yearP = pillarFromIndex(yearIdx);
  const monthStem = mod(yearP.stem * 2 + 2 + monthIdx, 10);
  const monthBranch = mod(monthIdx + 2, 12);
  const monthP = { stem: monthStem, branch: monthBranch, index: cycleIndex(monthStem, monthBranch) };

  // Day pillar from Julian day number of local date.
  let dayDateMs = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate());
  const lh = local.getUTCHours();
  if (!timeUnknown && ziHourNextDay && lh === 23) dayDateMs += DAY_MS;
  const jdn = dayDateMs / DAY_MS + 2440588;
  const dayP = pillarFromIndex(jdn + 49);

  let hourP = null;
  if (!timeUnknown) {
    const hb = Math.floor(((lh + 1) % 24) / 2);
    const hs = mod(dayP.stem * 2 + hb, 10);
    hourP = { stem: hs, branch: hb, index: cycleIndex(hs, hb) };
  }

  const pillars = { year: yearP, month: monthP, day: dayP, hour: hourP };
  const chart = {
    input: { ...input }, utcMs, localMs, solarCorrectionMin, sunLon: lon, pillars,
    dayMaster: dayP.stem,
  };
  chart.elements = elementBalance(chart);
  chart.strength = dayMasterStrength(chart);
  chart.interactions = findInteractions(chart);
  chart.luck = luckPillars(chart, gender);
  return chart;
}

/** Ten God key of `stem` relative to day master `dm`. */
export function tenGod(dm, stem) {
  const a = STEMS[dm], b = STEMS[stem];
  const same = a.yang === b.yang;
  const rel = mod(b.el - a.el, 5); // 0 same, 1 I produce, 2 I control, 3 controls me, 4 produces me
  return [['F', 'RW'], ['EG', 'HO'], ['IW', 'DW'], ['7K', 'DO'], ['IR', 'DR']][rel][same ? 0 : 1];
}

export const HIDDEN_WEIGHTS = [1, 0.5, 0.3];

export function elementBalance(chart) {
  const scores = [0, 0, 0, 0, 0];
  for (const [key, p] of Object.entries(chart.pillars)) {
    if (!p) continue;
    scores[STEMS[p.stem].el] += 1;
    const factor = key === 'month' ? 1.5 : 1; // the month branch (season) weighs more
    BRANCHES[p.branch].hidden.forEach((s, i) => { scores[STEMS[s].el] += HIDDEN_WEIGHTS[i] * factor; });
  }
  const total = scores.reduce((a, b) => a + b, 0);
  return scores.map((v, i) => ({ el: i, score: Math.round(v * 10) / 10, pct: Math.round((v / total) * 100) }));
}

export const SEASON_PHASES = [
  { key: 'prosperous', zh: '旺', name: 'Prosperous', desc: 'The Day Master’s element is in season – at its peak.' },
  { key: 'strong', zh: '相', name: 'Strong', desc: 'The season produces the Day Master – well supported.' },
  { key: 'resting', zh: '休', name: 'Resting', desc: 'The Day Master produces the season’s element – it is spending energy.' },
  { key: 'trapped', zh: '囚', name: 'Trapped', desc: 'The Day Master must control the season’s element – tiring.' },
  { key: 'dead', zh: '死', name: 'Weak (Dead)', desc: 'The season controls the Day Master – least seasonal support.' },
];

export function seasonPhase(dmEl, seasonEl) {
  const rel = mod(dmEl - seasonEl, 5); // 0 same, 1 season produces DM, 2 season controls DM...
  return SEASON_PHASES[[0, 1, 4, 3, 2][rel]];
}

export function dayMasterStrength(chart) {
  const dmEl = STEMS[chart.dayMaster].el;
  const resEl = mod(dmEl - 1, 5);
  let support = 0, total = 0;
  for (const [key, p] of Object.entries(chart.pillars)) {
    if (!p) continue;
    if (key !== 'day') { // skip the day master itself
      const e = STEMS[p.stem].el; total += 1; if (e === dmEl || e === resEl) support += 1;
    }
    const factor = key === 'month' ? 2 : 1;
    BRANCHES[p.branch].hidden.forEach((s, i) => {
      const w = HIDDEN_WEIGHTS[i] * factor; total += w;
      const e = STEMS[s].el; if (e === dmEl || e === resEl) support += w;
    });
  }
  const ratio = support / total;
  const phase = seasonPhase(dmEl, BRANCHES[chart.pillars.month.branch].el);
  let label;
  if (ratio >= 0.6) label = 'Strong';
  else if (ratio >= 0.45) label = 'Balanced to strong';
  else if (ratio >= 0.32) label = 'Balanced to weak';
  else label = 'Weak';
  return { ratio: Math.round(ratio * 100), label, phase };
}

const PILLAR_KEYS = ['year', 'month', 'day', 'hour'];
const PILLAR_LABEL = { year: 'Year', month: 'Month', day: 'Day', hour: 'Hour' };

const SIX_HARMONY_EL = { '0-1': 2, '2-11': 0, '3-10': 1, '4-9': 3, '5-8': 4, '6-7': 1 };
const THREE_HARMONY = [ // [branches], element
  [[8, 0, 4], 4], [[11, 3, 7], 0], [[2, 6, 10], 1], [[5, 9, 1], 3],
];
const STEM_COMBO_EL = [2, 3, 4, 0, 1]; // 甲己→Earth, 乙庚→Metal, 丙辛→Water, 丁壬→Wood, 戊癸→Fire
const PUNISH = [[2, 5, 8], [1, 10, 7]]; // 寅巳申, 丑戌未
const HARMS = [[0, 7], [1, 6], [2, 5], [3, 4], [8, 11], [9, 10]];

export function findInteractions(chart) {
  const ps = PILLAR_KEYS.filter((k) => chart.pillars[k]).map((k) => ({ key: k, ...chart.pillars[k] }));
  const out = [];
  for (let i = 0; i < ps.length; i++) {
    for (let j = i + 1; j < ps.length; j++) {
      const a = ps[i], b = ps[j];
      const where = `${PILLAR_LABEL[a.key]} & ${PILLAR_LABEL[b.key]}`;
      if (mod(a.stem - b.stem, 10) === 5) {
        const lo = Math.min(a.stem, b.stem) % 5;
        out.push({ type: 'Stem combination', zh: '天干五合', where, chars: STEMS[a.stem].zh + STEMS[b.stem].zh,
          note: `Can transform into ${ELEMENTS[STEM_COMBO_EL[lo]].name} if supported by the season.` });
      }
      const [x, y] = [a.branch, b.branch].sort((m, n) => m - n);
      const chars = BRANCHES[a.branch].zh + BRANCHES[b.branch].zh;
      if (mod(a.branch - b.branch, 12) === 6)
        out.push({ type: 'Clash', zh: '六冲', where, chars, note: 'Opposing branches – movement, change, conflict or travel.' });
      if (mod(a.branch + b.branch, 12) === 1)
        out.push({ type: 'Six Harmony', zh: '六合', where, chars,
          note: `A bond of attraction; associated with ${ELEMENTS[SIX_HARMONY_EL[`${x}-${y}`]].name}.` });
      if (HARMS.some(([m, n]) => m === x && n === y))
        out.push({ type: 'Harm', zh: '六害', where, chars, note: 'Hidden friction – often between people or plans.' });
      if (x === y && [4, 6, 9, 11].includes(x))
        out.push({ type: 'Self-punishment', zh: '自刑', where, chars, note: 'Self-critical tendencies tied to this branch.' });
      if ((x === 0 && y === 3))
        out.push({ type: 'Punishment', zh: '子卯刑', where, chars, note: 'The “uncivil” punishment – friction in manners or relationships.' });
    }
  }
  const branchSet = new Set(ps.map((p) => p.branch));
  for (const [trio, el] of THREE_HARMONY) {
    const n = trio.filter((b) => branchSet.has(b)).length;
    const centerPresent = branchSet.has(trio[1]);
    if (n === 3) out.push({ type: 'Three Harmony (full)', zh: '三合局', where: 'Chart', chars: trio.map((b) => BRANCHES[b].zh).join(''),
      note: `A complete ${ELEMENTS[el].name} frame – this element is greatly strengthened.` });
    else if (n === 2 && centerPresent) out.push({ type: 'Half Three Harmony', zh: '半合', where: 'Chart',
      chars: trio.filter((b) => branchSet.has(b)).map((b) => BRANCHES[b].zh).join(''),
      note: `A partial ${ELEMENTS[el].name} frame.` });
  }
  for (const trio of PUNISH) {
    const present = trio.filter((b) => branchSet.has(b));
    if (present.length >= 2) out.push({ type: present.length === 3 ? 'Punishment (full)' : 'Punishment (partial)', zh: '三刑',
      where: 'Chart', chars: present.map((b) => BRANCHES[b].zh).join(''), note: 'Tension, obligations or legal/health matters in classical texts.' });
  }
  return out;
}

/** Ten-year luck pillars (大运). */
export function luckPillars(chart, gender) {
  const yangYear = STEMS[chart.pillars.year.stem].yang;
  const forward = (yangYear && gender === 'm') || (!yangYear && gender === 'f');
  const lon = chart.sunLon;
  const monthIdx = Math.floor(mod(lon - 315, 360) / 30);
  const target = mod(315 + 30 * (monthIdx + (forward ? 1 : 0)), 360);
  const guess = chart.utcMs + (forward ? 1 : -1) * (mod(forward ? target - lon : lon - target, 360) / 0.98565) * DAY_MS;
  const termMs = findSolarLongitude(target, guess);
  const days = Math.abs(termMs - chart.utcMs) / DAY_MS;
  const startAge = days / 3; // 3 days = 1 year
  const startYears = Math.floor(startAge);
  const startMonths = Math.round((startAge - startYears) * 12);
  const birthYear = new Date(chart.utcMs).getUTCFullYear();
  const list = [];
  for (let i = 1; i <= 8; i++) {
    const p = pillarFromIndex(chart.pillars.month.index + (forward ? i : -i));
    const age = startAge + (i - 1) * 10;
    list.push({ ...p, age: Math.round(age * 10) / 10, year: Math.floor(birthYear + age) });
  }
  return { forward, startAge: Math.round(startAge * 10) / 10, startYears, startMonths, pillars: list };
}

/** Pillars for an arbitrary instant (e.g. "today"). */
export function pillarsForNow(date = new Date()) {
  const c = computeChart({
    year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate(),
    hour: date.getHours(), minute: date.getMinutes(), tzOffset: -date.getTimezoneOffset() / 60, gender: 'm',
  });
  return c.pillars;
}

/** List of the 12 Jie terms of a Gregorian year with their UTC instants. */
export function jieTermsOfYear(year) {
  return JIE_TERMS.map((t, i) => {
    // approximate date: Li Chun ~ Feb 4, each term ~30.4 days later; Xiao Han ~ Jan 6
    const approx = i === 11 ? Date.UTC(year, 0, 6) : Date.UTC(year, 1, 4) + i * 30.44 * DAY_MS;
    return { ...t, ms: findSolarLongitude(t.lon, approx) };
  }).sort((a, b) => a.ms - b.ms);
}

export { PILLAR_KEYS, PILLAR_LABEL };
