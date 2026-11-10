import { STEMS, BRANCHES, ELEMENTS, TEN_GODS } from './data.js';
import { tenGod } from './bazi.js';

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
const polEl = (s) => `${STEMS[s].yang ? 'Yang' : 'Yin'} ${ELEMENTS[STEMS[s].el].name}`;
const elNames = ELEMENTS.map((e) => e.name);

export const CATEGORIES = {
  elements: { name: 'Five Elements', zh: '五行', gens: [
    () => { const e = rnd(5); return mc(`Which element does ${ELEMENTS[e].name} produce?`, elNames[(e + 1) % 5], elNames,
      `${ELEMENTS[e].name} → ${ELEMENTS[(e + 1) % 5].name} in the producing cycle.`); },
    () => { const e = rnd(5); return mc(`Which element controls ${ELEMENTS[e].name}?`, elNames[mod(e - 2, 5)], elNames,
      `${ELEMENTS[mod(e - 2, 5)].name} controls ${ELEMENTS[e].name}.`); },
    () => { const e = rnd(5); return mc(`Which element produces ${ELEMENTS[e].name}?`, elNames[mod(e - 1, 5)], elNames,
      `${ELEMENTS[mod(e - 1, 5)].name} is the “mother” of ${ELEMENTS[e].name}.`); },
    () => { const e = rnd(5); return mc(`${ELEMENTS[e].name} controls …`, elNames[(e + 2) % 5], elNames,
      `${ELEMENTS[e].name} controls ${ELEMENTS[(e + 2) % 5].name}.`); },
    () => { const e = rnd(5); return mc(`Which season belongs to ${ELEMENTS[e].name}?`, ELEMENTS[e].season, ELEMENTS.map((x) => x.season),
      `${ELEMENTS[e].name}: ${ELEMENTS[e].season}, ${ELEMENTS[e].direction}.`); },
    () => { const e = rnd(5); return mc(`What does the character ${ELEMENTS[e].zh} mean?`, elNames[e], elNames, `${ELEMENTS[e].zh} ${ELEMENTS[e].py} = ${ELEMENTS[e].name}.`); },
  ] },
  stems: { name: 'Heavenly Stems', zh: '天干', gens: [
    () => { const s = rnd(10); return mc(`What is ${stemLabel(s)}?`, polEl(s), STEMS.map((_, i) => polEl(i)), `${STEMS[s].zh}: ${polEl(s)} – ${STEMS[s].image}.`); },
    () => { const s = rnd(10); return mc(`Which stem is ${polEl(s)}?`, stemLabel(s), STEMS.map((_, i) => stemLabel(i)), `${polEl(s)} = ${stemLabel(s)}.`); },
    () => { const s = rnd(10); return mc(`Which stem is pictured as “${STEMS[s].image}”?`, stemLabel(s), STEMS.map((_, i) => stemLabel(i)), `${STEMS[s].zh} – ${STEMS[s].image}.`); },
    () => { const s = rnd(10); const p = (s + 5) % 10; return mc(`Which stem combines with ${stemLabel(s)}?`, stemLabel(p), STEMS.map((_, i) => stemLabel(i)),
      `Stems five apart combine: ${STEMS[s].zh}${STEMS[p].zh}.`); },
    () => { const s = rnd(10); return mc(`Which stem comes after ${stemLabel(s)}?`, stemLabel((s + 1) % 10), STEMS.map((_, i) => stemLabel(i)),
      `Order: 甲 乙 丙 丁 戊 己 庚 辛 壬 癸.`); },
  ] },
  branches: { name: 'Earthly Branches', zh: '地支', gens: [
    () => { const b = rnd(12); return mc(`Which animal is ${branchLabel(b)}?`, BRANCHES[b].animal, BRANCHES.map((x) => x.animal), `${BRANCHES[b].zh} = ${BRANCHES[b].animal}.`); },
    () => { const b = rnd(12); return mc(`Which branch is the ${BRANCHES[b].animal}?`, branchLabel(b), BRANCHES.map((_, i) => branchLabel(i)), `${BRANCHES[b].animal} = ${BRANCHES[b].zh}.`); },
    () => { const b = rnd(12); return mc(`Which hours belong to ${branchLabel(b)}?`, BRANCHES[b].hours, BRANCHES.map((x) => x.hours), `${BRANCHES[b].animal}: ${BRANCHES[b].hours}.`); },
    () => { const b = rnd(12); return mc(`What is the element of ${branchLabel(b)} (${BRANCHES[b].animal})?`, elNames[BRANCHES[b].el], elNames,
      `${BRANCHES[b].zh} belongs to ${ELEMENTS[BRANCHES[b].el].name}.`); },
    () => { const b = rnd(12); return mc(`Which branch clashes with ${branchLabel(b)}?`, branchLabel((b + 6) % 12), BRANCHES.map((_, i) => branchLabel(i)),
      `Opposite branches clash: ${BRANCHES[b].zh}${BRANCHES[(b + 6) % 12].zh}.`); },
    () => { const b = rnd(12); const p = mod(1 - b, 12); return mc(`Which branch forms a Six Harmony with ${branchLabel(b)}?`, branchLabel(p), BRANCHES.map((_, i) => branchLabel(i)),
      `Six Harmony: ${BRANCHES[b].zh}${BRANCHES[p].zh}.`); },
  ] },
  hidden: { name: 'Hidden Stems', zh: '藏干', gens: [
    () => { const b = rnd(12); const h = BRANCHES[b].hidden[0]; return mc(`What is the main hidden stem of ${branchLabel(b)}?`, stemLabel(h), STEMS.map((_, i) => stemLabel(i)),
      `${BRANCHES[b].zh} hides ${BRANCHES[b].hidden.map((s) => STEMS[s].zh).join(' ')}.`); },
    () => { const b = rnd(12); const fmt = (x) => BRANCHES[x].hidden.map((s) => STEMS[s].zh).join(' ');
      return mc(`Which hidden stems does ${branchLabel(b)} contain?`, fmt(b), BRANCHES.map((_, i) => fmt(i)), `${BRANCHES[b].zh}: ${fmt(b)}.`); },
  ] },
  tengods: { name: 'Ten Gods', zh: '十神', gens: [
    () => { const dm = rnd(10), s = rnd(10); const g = TEN_GODS[tenGod(dm, s)];
      return mc(`Day Master ${stemLabel(dm)}. What is ${stemLabel(s)}?`, g.name, Object.values(TEN_GODS).map((x) => x.name),
        `${polEl(dm)} vs ${polEl(s)}: ${g.rel.toLowerCase()} → ${g.name} ${g.zh}.`); },
    () => { const k = pick(Object.keys(TEN_GODS)); const g = TEN_GODS[k];
      return mc(`Which Ten God is defined as “${g.rel}”?`, g.name, Object.values(TEN_GODS).map((x) => x.name), `${g.name} ${g.zh}: ${g.rel}.`); },
    () => { const k = pick(Object.keys(TEN_GODS)); const g = TEN_GODS[k];
      return mc(`What is ${g.zh} ${g.py}?`, g.name, Object.values(TEN_GODS).map((x) => x.name), `${g.zh} = ${g.name}.`); },
    () => { const dm = rnd(10), k = pick(Object.keys(TEN_GODS)); const s = [...Array(10).keys()].find((i) => tenGod(dm, i) === k);
      return mc(`Day Master ${stemLabel(dm)}. Which stem is its ${TEN_GODS[k].name}?`, stemLabel(s), STEMS.map((_, i) => stemLabel(i)),
        `${STEMS[s].zh} is the ${TEN_GODS[k].name} of ${STEMS[dm].zh}.`); },
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
