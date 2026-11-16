// Compatibility of two BaZi charts (合婚 / relationship analysis, simplified).
import { STEMS, BRANCHES, ELEMENTS, TEN_GODS } from './data.js';
import { tenGod } from './bazi.js';
import { favourableElements } from './reading.js';

const mod = (a, n) => ((a % n) + n) % n;

const ROLE = {
  F: 'a peer and equal – a friendship-like bond', RW: 'a lively rival-partner who challenges and energises',
  EG: 'someone you enjoy nurturing and relaxing with', HO: 'someone who brings out your expressive, rebellious side',
  IW: 'an exciting source of opportunity and fun', DW: 'a steady, practical partner – classically the wife star for men',
  '7K': 'a strong, demanding presence who pushes you', DO: 'a stabilising, responsible influence – classically the husband star for women',
  IR: 'an unconventional teacher and thought partner', DR: 'a caring supporter who makes you feel safe',
};

/** Relation between two branches → { key, label, score (0–1), note } */
export function branchRelation(a, b) {
  const [x, y] = [a, b].sort((m, n) => m - n);
  if (mod(a + b, 12) === 1) return { key: 'harmony', label: 'Six Harmony 六合', score: 1, note: 'a natural bond and attraction' };
  if (a !== b && mod(a - b, 4) === 0) return { key: 'trine', label: 'Three Harmony 三合', score: 0.9, note: 'shared goals and easy teamwork' };
  if (mod(a - b, 12) === 6) return { key: 'clash', label: 'Clash 冲', score: 0.15, note: 'strong attraction of opposites, but frequent friction' };
  if ([[0, 7], [1, 6], [2, 5], [3, 4], [8, 11], [9, 10]].some(([m, n]) => m === x && n === y))
    return { key: 'harm', label: 'Harm 害', score: 0.3, note: 'hidden irritations that need open communication' };
  if ((x === 0 && y === 3) || [[2, 5], [5, 8], [2, 8], [1, 10], [10, 7], [1, 7]].some(([m, n]) => (m === x && n === y) || (m === y && n === x)))
    return { key: 'punish', label: 'Punishment 刑', score: 0.35, note: 'tension and obligations – patience is the key' };
  if (a === b) return { key: 'same', label: 'Same branch', score: 0.6, note: 'similar rhythms and needs' };
  return { key: 'neutral', label: 'Neutral', score: 0.6, note: 'no strong interaction – the relationship is shaped by other factors' };
}

export function compare(a, b) {
  const sa = STEMS[a.dayMaster], sb = STEMS[b.dayMaster];
  const parts = [];

  // 1. Day Masters (30)
  let dmScore, dmNote;
  const rel = mod(sb.el - sa.el, 5);
  if (mod(a.dayMaster - b.dayMaster, 10) === 5) { dmScore = 30; dmNote = `${sa.zh} and ${sb.zh} form a Heavenly Stem combination (天干合) – a classic sign of strong mutual attraction.`; }
  else if (rel === 0) { dmScore = 20; dmNote = `Both are ${ELEMENTS[sa.el].name} Day Masters – you understand each other easily but may compete.`; }
  else if (rel === 1 || rel === 4) { dmScore = 24; dmNote = `${rel === 1 ? sa.zh : sb.zh} produces ${rel === 1 ? sb.zh : sa.zh} (${ELEMENTS[rel === 1 ? sa.el : sb.el].name} → ${ELEMENTS[rel === 1 ? sb.el : sa.el].name}) – a nurturing flow; one gives, the other receives.`; }
  else { dmScore = 13; dmNote = `${rel === 2 ? sa.zh : sb.zh} controls ${rel === 2 ? sb.zh : sa.zh} (${ELEMENTS[rel === 2 ? sa.el : sb.el].name} controls ${ELEMENTS[rel === 2 ? sb.el : sa.el].name}) – dynamic and structuring, sometimes dominating.`; }
  parts.push({ title: 'Day Masters', max: 30, score: dmScore, note: dmNote });

  // 2. Spouse palaces – day branches (25)
  const sp = branchRelation(a.pillars.day.branch, b.pillars.day.branch);
  parts.push({ title: 'Spouse palaces (day branches)', max: 25, score: Math.round(25 * sp.score),
    note: `${BRANCHES[a.pillars.day.branch].zh} & ${BRANCHES[b.pillars.day.branch].zh}: ${sp.label} – ${sp.note}.` });

  // 3. Zodiac animals – year branches (15)
  const yr = branchRelation(a.pillars.year.branch, b.pillars.year.branch);
  parts.push({ title: 'Zodiac animals (year branches)', max: 15, score: Math.round(15 * yr.score),
    note: `${BRANCHES[a.pillars.year.branch].animal} & ${BRANCHES[b.pillars.year.branch].animal}: ${yr.label} – ${yr.note}.` });

  // 4. Element complement (30): does each bring the other's favourable elements?
  const supply = (x, y) => { const fav = favourableElements(x).favourable; return y.elements.filter((e) => fav.includes(e.el)).reduce((s, e) => s + e.pct, 0); };
  const ab = supply(a, b), ba = supply(b, a);
  const cScore = Math.round(15 * Math.min(1, ab / 65) + 15 * Math.min(1, ba / 65));
  parts.push({ title: 'Element balance', max: 30, score: cScore,
    note: `About ${ab}% of the second chart consists of the first person’s favourable elements, and ${ba}% the other way round. ${cScore >= 22 ? 'You supply what the other needs – a balancing match.' : cScore >= 14 ? 'You partly complement each other.' : 'You need similar things – support each other consciously.'}` });

  const total = parts.reduce((s, p) => s + p.score, 0);
  const label = total >= 80 ? 'Excellent' : total >= 65 ? 'Good' : total >= 50 ? 'Mixed' : 'Challenging';
  const godAB = tenGod(a.dayMaster, b.dayMaster), godBA = tenGod(b.dayMaster, a.dayMaster);
  return {
    total, label, parts,
    roles: [
      { from: 'a', god: godAB, text: `${TEN_GODS[godAB].name} ${TEN_GODS[godAB].zh}: ${ROLE[godAB]}.` },
      { from: 'b', god: godBA, text: `${TEN_GODS[godBA].name} ${TEN_GODS[godBA].zh}: ${ROLE[godBA]}.` },
    ],
  };
}

/** Ideal partner profile for one chart: best Day Masters, zodiac animals, day branches and elements. */
export function idealMatch(chart, aroundYear = null) {
  const dm = chart.dayMaster;
  const { favourable } = favourableElements(chart);
  const combo = (dm + 5) % 10;
  // Day Masters: the combining stem first, then stems of favourable elements
  const stems = [combo, ...STEMS.map((_, i) => i).filter((i) => i !== combo && favourable.includes(STEMS[i].el))];
  const rank = (b) => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    .map((x) => ({ b: x, r: branchRelation(b, x) }))
    .filter((x) => x.b !== b || false);
  const yb = chart.pillars.year.branch, db = chart.pillars.day.branch;
  const bestAnimals = rank(yb).filter((x) => x.r.key === 'harmony' || x.r.key === 'trine');
  const avoidAnimals = rank(yb).filter((x) => x.r.key === 'clash' || x.r.key === 'harm');
  const bestDayBranches = rank(db).filter((x) => x.r.key === 'harmony' || x.r.key === 'trine');
  const y0 = aroundYear || new Date(chart.utcMs).getUTCFullYear();
  const yearsOf = (branch) => { const out = []; for (let y = y0 - 12; y <= y0 + 12; y++) if (((y - 4) % 12 + 12) % 12 === branch) out.push(y); return out; };
  return {
    stems, favourable,
    bestAnimals: bestAnimals.map((x) => ({ branch: x.b, relation: x.r, years: yearsOf(x.b) })),
    avoidAnimals: avoidAnimals.map((x) => ({ branch: x.b, relation: x.r, years: yearsOf(x.b) })),
    bestDayBranches: bestDayBranches.map((x) => ({ branch: x.b, relation: x.r })),
  };
}
