import { STEMS, BRANCHES, ELEMENTS, TEN_GODS } from './data.js';
import { tenGod } from './bazi.js';
import { t } from './i18n.js';

const rnd = (n) => Math.floor(Math.random() * n);
const pick = (arr) => arr[rnd(arr.length)];
const shuffle = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const mod = (a, n) => ((a % n) + n) % n;

/** Build a multiple choice question from a correct answer and a pool of distractors. */
function mc(q, correct, pool, explain, n = 4) {
  const distractors = shuffle([...new Set(pool.filter((p) => p !== correct))]).slice(0, n - 1);
  const options = shuffle([correct, ...distractors]);
  return { q, options, answer: options.indexOf(correct), explain };
}

const stemLabel = (s) => `${STEMS[s].zh} ${STEMS[s].py}`;
const branchLabel = (b) => `${BRANCHES[b].zh} ${BRANCHES[b].py}`;
const polEl = (s) => t(STEMS[s].yang ? 'Yang {el}' : 'Yin {el}', { el: ELEMENTS[STEMS[s].el].name });
const elNames = ELEMENTS.map((e) => e.name);

export const CATEGORIES = {
  elements: { name: t('Five Elements'), zh: '五行', gens: [
    () => { const e = rnd(5); return mc(t('Which element does {el} produce?', { el: ELEMENTS[e].name }), elNames[(e + 1) % 5], elNames,
      t('{a} → {b} in the producing cycle.', { a: ELEMENTS[e].name, b: ELEMENTS[(e + 1) % 5].name })); },
    () => { const e = rnd(5); return mc(t('Which element controls {el}?', { el: ELEMENTS[e].name }), elNames[mod(e - 2, 5)], elNames,
      t('{a} controls {b}.', { a: ELEMENTS[mod(e - 2, 5)].name, b: ELEMENTS[e].name })); },
    () => { const e = rnd(5); return mc(t('Which element produces {el}?', { el: ELEMENTS[e].name }), elNames[mod(e - 1, 5)], elNames,
      t('{a} is the “mother” of {b}.', { a: ELEMENTS[mod(e - 1, 5)].name, b: ELEMENTS[e].name })); },
    () => { const e = rnd(5); return mc(t('{el} controls …', { el: ELEMENTS[e].name }), elNames[(e + 2) % 5], elNames,
      t('{a} controls {b}.', { a: ELEMENTS[e].name, b: ELEMENTS[(e + 2) % 5].name })); },
    () => { const e = rnd(5); return mc(t('Which season belongs to {el}?', { el: ELEMENTS[e].name }), ELEMENTS[e].season, ELEMENTS.map((x) => x.season),
      `${ELEMENTS[e].name}: ${ELEMENTS[e].season}, ${ELEMENTS[e].direction}.`); },
    () => { const e = rnd(5); return mc(t('What does the character {zh} mean?', { zh: ELEMENTS[e].zh }), elNames[e], elNames, `${ELEMENTS[e].zh} ${ELEMENTS[e].py} = ${ELEMENTS[e].name}.`); },
  ] },
  stems: { name: t('Heavenly Stems'), zh: '天干', gens: [
    () => { const s = rnd(10); return mc(t('What is {x}?', { x: stemLabel(s) }), polEl(s), STEMS.map((_, i) => polEl(i)), `${STEMS[s].zh}: ${polEl(s)} – ${STEMS[s].image}.`); },
    () => { const s = rnd(10); return mc(t('Which stem is {x}?', { x: polEl(s) }), stemLabel(s), STEMS.map((_, i) => stemLabel(i)), `${polEl(s)} = ${stemLabel(s)}.`); },
    () => { const s = rnd(10); return mc(t('Which stem is pictured as “{img}”?', { img: STEMS[s].image }), stemLabel(s), STEMS.map((_, i) => stemLabel(i)), `${STEMS[s].zh} – ${STEMS[s].image}.`); },
    () => { const s = rnd(10); const p = (s + 5) % 10; return mc(t('Which stem combines with {x}?', { x: stemLabel(s) }), stemLabel(p), STEMS.map((_, i) => stemLabel(i)),
      t('Stems five apart combine: {pair}.', { pair: STEMS[s].zh + STEMS[p].zh })); },
    () => { const s = rnd(10); return mc(t('Which stem comes after {x}?', { x: stemLabel(s) }), stemLabel((s + 1) % 10), STEMS.map((_, i) => stemLabel(i)),
      t('Order: {list}.', { list: '甲 乙 丙 丁 戊 己 庚 辛 壬 癸' })); },
  ] },
  branches: { name: t('Earthly Branches'), zh: '地支', gens: [
    () => { const b = rnd(12); return mc(t('Which animal is {x}?', { x: branchLabel(b) }), BRANCHES[b].animal, BRANCHES.map((x) => x.animal), `${BRANCHES[b].zh} = ${BRANCHES[b].animal}.`); },
    () => { const b = rnd(12); return mc(t('Which branch is the {animal}?', { animal: BRANCHES[b].animal }), branchLabel(b), BRANCHES.map((_, i) => branchLabel(i)), `${BRANCHES[b].animal} = ${BRANCHES[b].zh}.`); },
    () => { const b = rnd(12); return mc(t('Which hours belong to {x}?', { x: branchLabel(b) }), BRANCHES[b].hours, BRANCHES.map((x) => x.hours), `${BRANCHES[b].animal}: ${BRANCHES[b].hours}.`); },
    () => { const b = rnd(12); return mc(t('What is the element of {x} ({animal})?', { x: branchLabel(b), animal: BRANCHES[b].animal }), elNames[BRANCHES[b].el], elNames,
      t('{b} belongs to {el}.', { b: BRANCHES[b].zh, el: ELEMENTS[BRANCHES[b].el].name })); },
    () => { const b = rnd(12); return mc(t('Which branch clashes with {x}?', { x: branchLabel(b) }), branchLabel((b + 6) % 12), BRANCHES.map((_, i) => branchLabel(i)),
      t('Opposite branches clash: {pair}.', { pair: BRANCHES[b].zh + BRANCHES[(b + 6) % 12].zh })); },
    () => { const b = rnd(12); const p = mod(1 - b, 12); return mc(t('Which branch forms a Six Harmony with {x}?', { x: branchLabel(b) }), branchLabel(p), BRANCHES.map((_, i) => branchLabel(i)),
      t('Six Harmony: {pair}.', { pair: BRANCHES[b].zh + BRANCHES[p].zh })); },
  ] },
  hidden: { name: t('Hidden Stems'), zh: '藏干', gens: [
    () => { const b = rnd(12); const h = BRANCHES[b].hidden[0]; return mc(t('What is the main hidden stem of {x}?', { x: branchLabel(b) }), stemLabel(h), STEMS.map((_, i) => stemLabel(i)),
      t('{b} hides {list}.', { b: BRANCHES[b].zh, list: BRANCHES[b].hidden.map((s) => STEMS[s].zh).join(' ') })); },
    () => { const b = rnd(12); const fmt = (x) => BRANCHES[x].hidden.map((s) => STEMS[s].zh).join(' ');
      return mc(t('Which hidden stems does {x} contain?', { x: branchLabel(b) }), fmt(b), BRANCHES.map((_, i) => fmt(i)), `${BRANCHES[b].zh}: ${fmt(b)}.`); },
  ] },
  tengods: { name: t('Ten Gods'), zh: '十神', gens: [
    () => { const dm = rnd(10), s = rnd(10); const g = TEN_GODS[tenGod(dm, s)];
      return mc(t('Day Master {dm}. What is {s}?', { dm: stemLabel(dm), s: stemLabel(s) }), g.name, Object.values(TEN_GODS).map((x) => x.name),
        `${polEl(dm)} – ${polEl(s)}: ${g.rel} → ${g.name} ${g.zh}.`); },
    () => { const k = pick(Object.keys(TEN_GODS)); const g = TEN_GODS[k];
      return mc(t('Which Ten God is defined as “{rel}”?', { rel: g.rel }), g.name, Object.values(TEN_GODS).map((x) => x.name), `${g.name} ${g.zh}: ${g.rel}.`); },
    () => { const k = pick(Object.keys(TEN_GODS)); const g = TEN_GODS[k];
      return mc(t('What is {x}?', { x: `${g.zh} ${g.py}` }), g.name, Object.values(TEN_GODS).map((x) => x.name), `${g.zh} = ${g.name}.`); },
    () => { const dm = rnd(10), k = pick(Object.keys(TEN_GODS)); const s = [...Array(10).keys()].find((i) => tenGod(dm, i) === k);
      return mc(t('Day Master {dm}. Which stem is its {god}?', { dm: stemLabel(dm), god: TEN_GODS[k].name }), stemLabel(s), STEMS.map((_, i) => stemLabel(i)),
        t('{s} is the {god} of {dm}.', { s: STEMS[s].zh, god: TEN_GODS[k].name, dm: STEMS[dm].zh })); },
  ] },
};

export function makeRound(category, count = 10) {
  const cats = category === 'mixed' ? Object.keys(CATEGORIES) : [category];
  const qs = [];
  const seen = new Set();
  let guard = 0;
  while (qs.length < count && guard++ < 200) {
    const q = pick(CATEGORIES[pick(cats)].gens)();
    if (seen.has(q.q)) continue;
    seen.add(q.q); qs.push(q);
  }
  return qs;
}
