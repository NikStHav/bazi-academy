// "Influences" (BaZi counterpart of transits): the pillars of any moment measured against a natal chart.
import { BRANCHES, STEMS } from './data.js';
import { tenGod, pillarsForNow, PILLAR_KEYS } from './bazi.js';
import { branchRelation } from './compat.js';
import { starsActivatedBy } from './shensha.js';
import { rate } from './forecast.js';

/** Influences of the moment `date` on `chart`. */
export function influencesFor(chart, date) {
  const now = pillarsForNow(date);
  const layers = ['year', 'month', 'day', 'hour'].map((key) => {
    const p = now[key];
    const relations = PILLAR_KEYS.filter((k) => chart.pillars[k]).map((k) => ({ natal: k, rel: branchRelation(p.branch, chart.pillars[k].branch) }))
      .filter((x) => ['clash', 'harmony', 'trine', 'harm', 'punish'].includes(x.rel.key));
    return { key, pillar: p, god: tenGod(chart.dayMaster, p.stem), branchGod: tenGod(chart.dayMaster, BRANCHES[p.branch].hidden[0]),
      rating: rate(chart, p.stem, p.branch), relations, stars: starsActivatedBy(chart, p.branch).filter((s) => s.key !== 'void'),
      combinesDM: (p.stem + 5) % 10 === chart.dayMaster };
  });
  const y = date.getFullYear();
  const luck = [...chart.luck.pillars].reverse().find((l) => l.year <= y) || null;
  const score = layers.reduce((s, l, i) => s + l.rating.score * [0.5, 1, 1.5, 0.5][i], 0);
  return { date, layers, luck: luck && { ...luck, god: tenGod(chart.dayMaster, luck.stem) },
    overall: score >= 2.5 ? 'favourable' : score >= 0.5 ? 'mixed' : 'challenging' };
}
export { STEMS };
