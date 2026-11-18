// Year-ahead forecast (流年): the annual pillar and its 12 solar months, read against a natal chart.
import { STEMS, BRANCHES, ELEMENTS, TEN_GODS } from './data.js';
import { tenGod, pillarFromIndex, jieTermsOfYear, cycleIndex } from './bazi.js';
import { favourableElements } from './reading.js';
import { branchRelation } from './compat.js';
import { starsActivatedBy } from './shensha.js';

const mod = (a, n) => ((a % n) + n) % n;

const MONTH_TEXT = {
  F: 'Independence and peers – good for teamwork among equals and personal projects.',
  RW: 'Competitive and energetic – act boldly, but watch money and partnerships.',
  EG: 'Relaxed and creative – enjoy, rest, cook, make things.',
  HO: 'Expressive and restless – great for ideas and presentations; be diplomatic.',
  IW: 'Opportunities and networking – side deals, sales, generosity.',
  DW: 'Steady work and earnings – budget, save, finish tasks.',
  '7K': 'Pressure and challenges – step up, but avoid conflicts and overwork.',
  DO: 'Recognition and responsibility – formal matters, applications, commitments.',
  IR: 'Reflection and study – research, intuition, time alone.',
  DR: 'Support and learning – mentors, courses, rest and family.',
};

function rate(chart, stem, branch) {
  const { favourable } = favourableElements(chart);
  let s = 0;
  if (favourable.includes(STEMS[stem].el)) s += 1;
  if (favourable.includes(BRANCHES[branch].el)) s += 1;
  const r = branchRelation(branch, chart.pillars.day.branch);
  if (r.key === 'clash') s -= 1.5; else if (r.key === 'harm' || r.key === 'punish') s -= 0.5; else if (r.key === 'harmony' || r.key === 'trine') s += 0.5;
  return { score: s, label: s >= 1.5 ? 'favourable' : s >= 0.5 ? 'mixed' : 'challenging', relation: r };
}

/** The BaZi year that is running on a date (it changes at Li Chun). */
export function baziYearOf(date = new Date()) {
  const y = date.getFullYear();
  const liChun = jieTermsOfYear(y).find((t) => t.lon === 315).ms;
  return date.getTime() < liChun ? y - 1 : y;
}

export function yearForecast(chart, year) {
  const dm = chart.dayMaster;
  const yp = pillarFromIndex(year - 4);
  const yb = chart.pillars.year.branch;
  const taiSui = yp.branch === yb ? 'same' : mod(yp.branch - yb, 12) === 6 ? 'clash' : null;
  const yearRate = rate(chart, yp.stem, yp.branch);
  const terms = [...jieTermsOfYear(year), ...jieTermsOfYear(year + 1)];
  const liChun = terms.find((t) => t.lon === 315 && new Date(t.ms).getUTCFullYear() === year);
  const starts = terms.filter((t) => t.ms >= liChun.ms).slice(0, 13);
  const luck = [...chart.luck.pillars].reverse().find((p) => p.year <= year) || null;
  const months = starts.slice(0, 12).map((t, i) => {
    const stem = mod(yp.stem * 2 + 2 + i, 10), branch = mod(i + 2, 12);
    const god = tenGod(dm, stem);
    return { index: i, start: t.ms, end: starts[i + 1].ms, stem, branch, pillarIndex: cycleIndex(stem, branch), god,
      text: MONTH_TEXT[god], ...rate(chart, stem, branch), stars: starsActivatedBy(chart, branch).filter((s) => s.key !== 'void') };
  });
  return {
    year, pillar: yp, god: tenGod(dm, yp.stem), branchGod: tenGod(dm, BRANCHES[yp.branch].hidden[0]),
    from: liChun.ms, to: starts[12].ms, taiSui, rating: yearRate, luck: luck && { ...luck, god: tenGod(dm, luck.stem) },
    stars: starsActivatedBy(chart, yp.branch).filter((s) => s.key !== 'void'),
    bestMonths: [...months].sort((a, b) => b.score - a.score).slice(0, 3).map((m) => m.index),
    months, elementNote: ELEMENTS[STEMS[yp.stem].el].name + ' over ' + ELEMENTS[BRANCHES[yp.branch].el].name,
  };
}

export { MONTH_TEXT, TEN_GODS };
