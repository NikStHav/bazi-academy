// Life timeline: luck pillars (大运) and annual pillars (流年) of a natal chart.
import { tenGod, pillarFromIndex } from './bazi.js';
import { rate } from './forecast.js';

const mod = (a, n) => ((a % n) + n) % n;

/** [{ kind: 'childhood'|'luck', from, to, ageFrom, ageTo, pillar?, god?, rating?, years: [...] }] */
export function lifeTimeline(chart, untilAge = 90) {
  const birthYear = new Date(chart.utcMs).getUTCFullYear();
  const yb = chart.pillars.year.branch;
  const year = (y) => {
    const p = pillarFromIndex(y - 4);
    return { year: y, age: y - birthYear, pillar: p, god: tenGod(chart.dayMaster, p.stem), rating: rate(chart, p.stem, p.branch),
      benming: p.branch === yb, taiSuiClash: mod(p.branch - yb, 12) === 6 };
  };
  const range = (a, b) => Array.from({ length: Math.max(0, b - a + 1) }, (_, i) => year(a + i));
  const phases = [];
  const lp = chart.luck.pillars;
  const end = birthYear + untilAge;
  if (lp.length && lp[0].year > birthYear) {
    phases.push({ kind: 'childhood', from: birthYear, to: lp[0].year - 1, ageFrom: 0, ageTo: lp[0].year - 1 - birthYear,
      pillar: chart.pillars.month, years: range(birthYear, lp[0].year - 1) });
  }
  lp.forEach((p, i) => {
    const to = Math.min((lp[i + 1] ? lp[i + 1].year : p.year + 10) - 1, end);
    if (p.year > end) return;
    phases.push({ kind: 'luck', from: p.year, to, ageFrom: p.year - birthYear, ageTo: to - birthYear, pillar: p,
      god: tenGod(chart.dayMaster, p.stem), rating: rate(chart, p.stem, p.branch), years: range(p.year, to) });
  });
  return phases;
}
