// Question pools for the "Check yourself" quiz at the end of each lesson.
// Every pool has at least 20 different questions: the lesson's own questions plus questions built from the app's data.
// A round has 5 questions; "Try again" keeps 3 of them and swaps 2 for questions not in the last round.
import { STEMS, BRANCHES, ELEMENTS, TEN_GODS } from './data.js';
import { tenGod, seasonPhase, SEASON_PHASES, pillarFromIndex, pillarName } from './bazi.js';
import { STARS } from './shensha.js';
import { STAGES, stageBranch, stageOf } from './stages.js';
import { LESSONS } from './lessons.js';
import { t } from './i18n.js';

const rnd = (n) => Math.floor(Math.random() * n);
const shuffle = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const mod = (a, n) => ((a % n) + n) % n;
const range = (n) => [...Array(n).keys()];
/** Multiple choice from a correct answer and a pool of wrong ones (duplicates removed). */
function mc(q, correct, pool, explain, n = 4) {
  const wrong = shuffle([...new Set(pool.filter((p) => p !== correct))]).slice(0, n - 1);
  const options = shuffle([correct, ...wrong]);
  return { q, options, answer: options.indexOf(correct), explain };
}
const sL = (s) => `${STEMS[s].zh} ${STEMS[s].py}`;
const bL = (b) => `${BRANCHES[b].zh} ${BRANCHES[b].animal}`;
const polEl = (s) => t(STEMS[s].yang ? 'Yang {el}' : 'Yin {el}', { el: ELEMENTS[STEMS[s].el].name });
const elN = (e) => ELEMENTS[e].name;
const ELS = range(5).map(elN);
const STEM_L = range(10).map(sL), BRANCH_L = range(12).map(bL), ANIMALS = BRANCHES.map((b) => b.animal);
const yy = (yang) => (yang ? t('Yang') : t('Yin'));
const PILLARS = () => [t('Year'), t('Month'), t('Day'), t('Hour')];
const GOD_NAMES = Object.values(TEN_GODS).map((g) => g.name);

const SIX = [[0, 1, 2], [2, 11, 0], [3, 10, 1], [4, 9, 3], [5, 8, 4], [6, 7, 1]];
const THREE = [[8, 0, 4, 4], [11, 3, 7, 0], [2, 6, 10, 1], [5, 9, 1, 3]];
const HARMS = [[0, 7], [1, 6], [2, 5], [3, 4], [8, 11], [9, 10]];
const NOBLE = [[1, 7], [0, 8], [11, 9], [11, 9], [1, 7], [0, 8], [2, 6], [2, 6], [3, 5], [3, 5]];
const ACADEMIC = [5, 6, 8, 9, 8, 9, 11, 0, 2, 3];
const PEACH = { 0: 9, 2: 3, 1: 6, 3: 0 }, HORSE = { 0: 2, 2: 8, 1: 11, 3: 5 };
const groupName = (g) => g.slice(0, 3).map((b) => `${BRANCHES[b].zh} ${BRANCHES[b].animal}`).join(' · ');

const GEN = {
  intro: () => {
    const areas = [t('family background and early childhood'), t('parents, career and youth'), t('yourself and your partner'), t('children, ideas and later life')];
    const ages = ['1–16', '17–32', '33–48', '49+'];
    return [
      ...range(4).map((i) => mc(t('Which pillar stands for {area}?', { area: areas[i] }), PILLARS()[i], PILLARS(), `${PILLARS()[i]}: ${areas[i]}.`)),
      ...range(4).map((i) => mc(t('Which age is linked to the {p} pillar?', { p: PILLARS()[i] }), ages[i], ages, `${PILLARS()[i]}: ${ages[i]}.`)),
      mc(t('What sits at the top of each pillar?'), t('Heavenly Stem'), [t('Heavenly Stem'), t('Earthly Branch'), t('Luck pillar'), t('Hidden stem')], t('Stem on top, branch below.')),
      mc(t('What sits at the bottom of each pillar?'), t('Earthly Branch'), [t('Heavenly Stem'), t('Earthly Branch'), t('Luck pillar'), t('Day Master')], t('Stem on top, branch below.')),
      mc(t('How many pillars does a BaZi chart have?'), '4', ['2', '4', '8', '12'], t('Year, month, day and hour.')),
      mc(t('How many characters does each pillar have?'), '2', ['1', '2', '3', '4'], t('A stem and a branch.')),
      mc(t('What does 八字 (BaZi) mean?'), t('Eight characters'), [t('Eight characters'), t('Four seasons'), t('Five elements'), t('Ten gods')], t('Four pillars × two characters = eight characters.')),
      mc(t('BaZi is calculated from …'), t('the date and time of birth'), [t('the date and time of birth'), t('your name'), t('your blood type'), t('a coin toss')], t('Year, month, day and hour of birth.')),
      mc(t('Every character in a chart belongs to one of the …'), t('Five Elements'), [t('Five Elements'), t('Twelve signs'), t('Seven planets'), t('Four winds')], t('Wood, Fire, Earth, Metal or Water – and Yin or Yang.')),
      mc(t('Which part of the chart is the Day Master?'), t('The stem of the day pillar'), [t('The stem of the day pillar'), t('The branch of the year pillar'), t('The stem of the hour pillar'), t('The month branch')], t('The day stem stands for you.')),
      mc(t('Where is your partner traditionally read?'), t('The branch of the day pillar'), [t('The branch of the day pillar'), t('The stem of the year pillar'), t('The hour stem'), t('The month stem')], t('The day branch is the spouse palace.')),
      mc(t('BaZi is best used for …'), t('reflection and learning'), [t('reflection and learning'), t('medical decisions'), t('legal advice'), t('predicting lottery numbers')], t('It describes tendencies, not fixed fate.')),
    ];
  },
  yinyang: () => [
    ...range(10).map((s) => mc(t('Is {x} Yin or Yang?', { x: sL(s) }), yy(STEMS[s].yang), [t('Yin'), t('Yang')], `${sL(s)} = ${polEl(s)}.`, 2)),
    ...range(12).map((b) => mc(t('Is the branch {x} Yin or Yang?', { x: bL(b) }), yy(BRANCHES[b].yang), [t('Yin'), t('Yang')], t('Branches alternate: 子 Yang, 丑 Yin, 寅 Yang …'), 2)),
    ...[['Active', 1], ['Receptive', 0], ['Bright', 1], ['Dark', 0], ['Day', 1], ['Night', 0], ['Summer', 1], ['Winter', 0]].map(([w, y]) => mc(t('Is “{w}” Yin or Yang?', { w: t(w) }), yy(y), [t('Yin'), t('Yang')], y ? t('Yang is active, bright and outward.') : t('Yin is receptive, dark and inward.'), 2)),
  ],
  elements: () => [
    ...range(5).map((e) => mc(t('Which element does {el} produce?', { el: elN(e) }), elN((e + 1) % 5), ELS, t('{a} → {b} in the producing cycle.', { a: elN(e), b: elN((e + 1) % 5) }))),
    ...range(5).map((e) => mc(t('Which element produces {el}?', { el: elN(e) }), elN(mod(e - 1, 5)), ELS, t('{a} is the “mother” of {b}.', { a: elN(mod(e - 1, 5)), b: elN(e) }))),
    ...range(5).map((e) => mc(t('Which element controls {el}?', { el: elN(e) }), elN(mod(e - 2, 5)), ELS, t('{a} controls {b}.', { a: elN(mod(e - 2, 5)), b: elN(e) }))),
    ...range(5).map((e) => mc(t('{el} controls …', { el: elN(e) }), elN((e + 2) % 5), ELS, t('{a} controls {b}.', { a: elN(e), b: elN((e + 2) % 5) }))),
    ...range(5).map((e) => mc(t('Which season belongs to {el}?', { el: elN(e) }), ELEMENTS[e].season, ELEMENTS.map((x) => x.season), `${elN(e)}: ${ELEMENTS[e].season}.`)),
    ...range(5).map((e) => mc(t('What does the character {zh} mean?', { zh: ELEMENTS[e].zh }), elN(e), ELS, `${ELEMENTS[e].zh} ${ELEMENTS[e].py} = ${elN(e)}.`)),
    ...range(5).map((e) => mc(t('Which direction belongs to {el}?', { el: elN(e) }), ELEMENTS[e].direction, ELEMENTS.map((x) => x.direction), `${elN(e)}: ${ELEMENTS[e].direction}.`)),
  ],
  stems: () => [
    ...range(10).map((s) => mc(t('What is {x}?', { x: sL(s) }), polEl(s), range(10).map(polEl), `${sL(s)}: ${polEl(s)} – ${STEMS[s].image}.`)),
    ...range(10).map((s) => mc(t('Which stem is {x}?', { x: polEl(s) }), STEM_L[s], STEM_L, `${polEl(s)} = ${sL(s)}.`)),
    ...range(10).map((s) => mc(t('Which stem is pictured as “{img}”?', { img: STEMS[s].image }), STEM_L[s], STEM_L, `${sL(s)} – ${STEMS[s].image}.`)),
    ...range(10).map((s) => mc(t('Which stem combines with {x}?', { x: sL(s) }), STEM_L[(s + 5) % 10], STEM_L, t('Stems five apart combine: {pair}.', { pair: STEMS[s].zh + STEMS[(s + 5) % 10].zh }))),
  ],
  branches: () => [
    ...range(12).map((b) => mc(t('Which animal is {x}?', { x: `${BRANCHES[b].zh} ${BRANCHES[b].py}` }), BRANCHES[b].animal, ANIMALS, `${BRANCHES[b].zh} = ${BRANCHES[b].animal}.`)),
    ...range(12).map((b) => mc(t('Which hours belong to {x}?', { x: bL(b) }), BRANCHES[b].hours, BRANCHES.map((x) => x.hours), `${BRANCHES[b].animal}: ${BRANCHES[b].hours}.`)),
    ...range(12).map((b) => mc(t('What is the element of {x} ({animal})?', { x: BRANCHES[b].zh, animal: BRANCHES[b].animal }), elN(BRANCHES[b].el), ELS, t('{b} belongs to {el}.', { b: BRANCHES[b].zh, el: elN(BRANCHES[b].el) }))),
    ...[[2, 0], [5, 1], [8, 3], [11, 4]].map(([b, e]) => mc(t('In which season is the {animal} month?', { animal: BRANCHES[b].animal }), ELEMENTS[e].season, [0, 1, 3, 4].map((x) => ELEMENTS[x].season), `${bL(b)}: ${ELEMENTS[e].season}.`)),
  ],
  jiazi: () => [
    ...range(24).map((k) => { const i = (k * 7 + 3) % 60; const next = pillarFromIndex(i + 1), p = pillarFromIndex(i);
      return mc(t('Which pillar follows {x}?', { x: pillarName(p) }), pillarName(next), [pillarName(next), pillarName(pillarFromIndex(i + 2)), STEMS[(p.stem + 1) % 10].zh + BRANCHES[p.branch].zh, STEMS[p.stem].zh + BRANCHES[(p.branch + 1) % 12].zh],
        t('Stem and branch both move one step on.')); }),
    ...range(10).map((k) => { const valid = pillarName(pillarFromIndex(k * 7 + 2));
      // Wrong options pair a Yang stem with a Yin branch (or the other way round) – such pillars never occur.
      const bad = range(3).map((j) => { const st = (k + j * 3) % 10; return STEMS[st].zh + BRANCHES[(st % 2 === 0 ? 1 : 0) + 2 * ((k + j * 2) % 6)].zh; });
      return mc(t('Which of these is a real pillar of the 60 cycle?'), valid, [valid, ...bad], t('Yang stems only pair with Yang branches, Yin with Yin.')); }),
    mc(t('After how many years does the same year pillar return?'), '60', ['10', '12', '60', '120'], t('10 stems and 12 branches give 60 combinations.')),
    mc(t('After how many years does the same zodiac animal return?'), '12', ['10', '12', '60', '24'], t('There are 12 branches.')),
  ],
  pillars: () => {
    const tiger = [2, 4, 6, 8, 0];
    return [
      ...range(10).map((y) => mc(t('A {s} year: which pillar is the Tiger month?', { s: STEMS[y].zh }), STEMS[tiger[y % 5]].zh + '寅', range(5).map((i) => STEMS[tiger[i]].zh + '寅'), t('“Five Tigers” rule: 甲/己 → 丙寅, 乙/庚 → 戊寅, 丙/辛 → 庚寅, 丁/壬 → 壬寅, 戊/癸 → 甲寅.'))),
      ...range(10).map((d) => mc(t('A {s} day: which pillar is the Rat hour (23–01)?', { s: STEMS[d].zh }), STEMS[(d % 5) * 2].zh + '子', range(5).map((i) => STEMS[i * 2].zh + '子'), t('“Five Rats” rule: 甲/己 → 甲子, 乙/庚 → 丙子, 丙/辛 → 戊子, 丁/壬 → 庚子, 戊/癸 → 壬子.'))),
      ...[[1, 30], [4, 15], [8, 0], [10, 45], [13, 20], [16, 10], [19, 50], [22, 5]].map(([h, m]) => { const b = Math.floor(((h + 1) % 24) / 2);
        return mc(t('Born at {time}: which branch is the hour?', { time: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}` }), bL(b), BRANCH_L, `${bL(b)}: ${BRANCHES[b].hours}.`); }),
      mc(t('Born on 20 January 2024 – which BaZi year?'), '癸卯 (2023)', ['癸卯 (2023)', '甲辰 (2024)', '壬寅 (2022)', '乙巳 (2025)'], t('The BaZi year starts at Li Chun, around 4 February.')),
      mc(t('Which calendar does BaZi use for the year and month?'), t('The solar calendar (solar terms)'), [t('The solar calendar (solar terms)'), t('The lunar calendar'), t('The Gregorian months'), t('The week days')], t('Months start at the Jie solar terms.')),
    ];
  },
  hidden: () => [
    ...range(12).map((b) => mc(t('What is the main hidden stem of {x}?', { x: bL(b) }), STEM_L[BRANCHES[b].hidden[0]], STEM_L, t('{b} hides {list}.', { b: BRANCHES[b].zh, list: BRANCHES[b].hidden.map((s) => STEMS[s].zh).join(' ') }))),
    ...range(12).map((b) => { const f = (x) => BRANCHES[x].hidden.map((s) => STEMS[s].zh).join(' ');
      return mc(t('Which hidden stems does {x} contain?', { x: bL(b) }), f(b), range(12).map(f), `${BRANCHES[b].zh}: ${f(b)}.`); }),
    ...[0, 3, 6, 9].map((b) => mc(t('How many hidden stems does {x} contain?', { x: bL(b) }), String(BRANCHES[b].hidden.length), ['1', '2', '3', '4'], t('The pure branches 子 卯 午 酉 hold mainly one element.'))),
  ],
  daymaster: () => [
    ...range(10).map((s) => { const p = pillarFromIndex(s * 6 + (s % 2));
      return mc(t('Day pillar {p}: what is the Day Master?', { p: pillarName(p) }), `${STEMS[p.stem].zh} ${polEl(p.stem)}`, range(10).map((i) => `${STEMS[i].zh} ${polEl(i)}`), t('The Day Master is the stem of the day pillar.')); }),
    ...range(10).map((s) => mc(t('A {x} Day Master is pictured as …', { x: sL(s) }), STEMS[s].image, STEMS.map((x) => x.image), `${sL(s)}: ${STEMS[s].image}.`)),
    mc(t('The Day Master stands for …'), t('yourself'), [t('yourself'), t('your father'), t('your career'), t('your children')], t('Everything is read in relation to the Day Master.')),
    mc(t('What is the branch under the Day Master called?'), t('Spouse palace'), [t('Spouse palace'), t('Luck pillar'), t('Hidden stem'), t('Year branch')], t('The day branch is the seat of the Day Master and the spouse palace.')),
  ],
  tengods: () => [
    ...range(20).map((k) => { const dm = (k * 3) % 10, s = (k * 7 + 1) % 10; const g = TEN_GODS[tenGod(dm, s)];
      return mc(t('Day Master {dm}. What is {s}?', { dm: sL(dm), s: sL(s) }), g.name, GOD_NAMES, `${polEl(dm)} – ${polEl(s)}: ${g.rel} → ${g.name}.`); }),
    ...Object.values(TEN_GODS).map((g) => mc(t('Which Ten God is defined as “{rel}”?', { rel: g.rel }), g.name, GOD_NAMES, `${g.name} ${g.zh}: ${g.rel}.`)),
  ],
  strength: () => [
    ...range(5).flatMap((dmEl) => [[0, 'Spring'], [1, 'Summer'], [3, 'Autumn'], [4, 'Winter']].map(([sEl]) => { const ph = seasonPhase(dmEl, sEl);
      return mc(t('A {el} Day Master born in {season}: which state?', { el: elN(dmEl), season: ELEMENTS[sEl].season }), `${ph.zh} ${ph.name}`, SEASON_PHASES.map((p) => `${p.zh} ${p.name}`), ph.desc); })),
    mc(t('Which factor matters most for strength?'), t('The month branch (season)'), [t('The month branch (season)'), t('The hour stem'), t('The year branch'), t('Your name')], t('The season of birth comes first.')),
  ],
  interactions: () => [
    ...range(12).map((b) => mc(t('Which animal clashes with {x}?', { x: bL(b) }), bL((b + 6) % 12), BRANCH_L, t('Opposite animals clash: {a} and {b}.', { a: bL(b), b: bL((b + 6) % 12) }))),
    ...SIX.flatMap(([a, b, el]) => [[a, b], [b, a]].map(([x, y]) => mc(t('Which animal forms a Six Harmony with {x}?', { x: bL(x) }), bL(y), BRANCH_L, t('{a} + {b} → {el}.', { a: bL(x), b: bL(y), el: elN(el) })))),
    ...THREE.map((g) => mc(t('Which element does the Three Harmony {g} strengthen?', { g: g.slice(0, 3).map(bL).join(' · ') }), elN(g[3]), ELS, t('{g} → {el}.', { g: groupName(g), el: elN(g[3]) }))),
    ...range(12).map((b) => { const g = THREE.find((x) => x.slice(0, 3).includes(b));
      return mc(t('In which element team (Three Harmony) is {x}?', { x: bL(b) }), elN(g[3]), [0, 1, 3, 4].map(elN), t('{g} → {el}.', { g: g.slice(0, 3).map(bL).join(' · '), el: elN(g[3]) })); }),
    ...THREE.flatMap(([a, b, c, el]) => { const why = t('{el} is born in {a}, strongest in {b} and stored in {c}.', { el: elN(el), a: bL(a), b: bL(b), c: bL(c) });
      return [[t('Where is {el} born?'), a], [t('Where is {el} strongest?'), b], [t('Where is {el} stored?'), c]].map(([q, x]) => mc(q.replace('{el}', elN(el)), bL(x), BRANCH_L, why)); }),
    ...HARMS.map(([a, b]) => mc(t('Which animal forms a Harm (hidden friction) with {x}?', { x: bL(a) }), bL(b), BRANCH_L, t('{a} and {b} form a Harm.', { a: bL(a), b: bL(b) }))),
  ],
  stars: () => [
    ...Object.values(STARS).map((s) => mc(t('Which symbolic star stands for: {d}', { d: s.desc }), `${s.icon} ${s.name}`, Object.values(STARS).map((x) => `${x.icon} ${x.name}`), `${s.name} ${s.zh}.`)),
    ...range(10).map((d) => mc(t('Day Master {x}: where is the Nobleman?', { x: sL(d) }), NOBLE[d].map((b) => BRANCHES[b].zh).join(' '), [...new Set(NOBLE.map((p) => p.map((b) => BRANCHES[b].zh).join(' ')))], t('The Nobleman 天乙贵人 is looked up from the Day Master.'))),
    ...range(10).map((d) => mc(t('Day Master {x}: which branch is the Academic Star?', { x: sL(d) }), bL(ACADEMIC[d]), BRANCH_L, t('The Academic Star 文昌 is looked up from the Day Master.'))),
    ...THREE.map((g) => mc(t('For the group {g}, the Peach Blossom is …', { g: groupName(g) }), bL(PEACH[g[0] % 4]), BRANCH_L, t('Peach Blossom 桃花 follows the Three Harmony group of the day or year branch.'))),
    ...THREE.map((g) => mc(t('For the group {g}, the Travelling Horse is …', { g: groupName(g) }), bL(HORSE[g[0] % 4]), BRANCH_L, t('The Travelling Horse is the animal that clashes the first animal of the group.'))),
  ],
  lifestages: () => {
    const stL = (k) => `${STAGES[k].zh} ${STAGES[k].name}`, ST_L = range(12).map(stL);
    const dir = (x) => (STEMS[x].yang ? t('Forward') : t('Backward'));
    return [
      ...range(10).map((x) => mc(t('Where is {s} born?', { s: sL(x) }), bL(stageBranch(x, 0)), BRANCH_L, t('{s} is born in {b}.', { s: sL(x), b: bL(stageBranch(x, 0)) }))),
      ...range(10).map((x) => mc(t('In which branch does {s} reach its Peak 帝旺?', { s: sL(x) }), bL(stageBranch(x, 4)), BRANCH_L,
        t('{s} is born in {b} and counts {dir}: the Peak is the 5th stage.', { s: sL(x), b: bL(stageBranch(x, 0)), dir: dir(x).toLowerCase() }))),
      ...range(10).map((x) => mc(t('In which direction does {s} count the growth stages?', { s: sL(x) }), dir(x), [t('Forward'), t('Backward')], t('Yang stems walk forward, Yin stems backward.'), 2)),
      ...range(12).map((k) => mc(t('Which growth stage comes after {x}?', { x: stL(k) }), stL((k + 1) % 12), ST_L, ST_L.slice(k, k + 3).concat(k > 9 ? ST_L.slice(0, k - 9) : []).join(' → '))),
      ...range(12).map((k) => mc(t('Which growth stage means: {d}', { d: STAGES[k].desc }), stL(k), ST_L, stL(k))),
      ...range(10).map((x) => { const b = (x * 5 + 3) % 12; const st = stageOf(x, b);
        return mc(t('Which growth stage is {s} in {b}?', { s: sL(x), b: bL(b) }), stL(st.index), ST_L, t('{s} is born in {b} and counts {dir}.', { s: sL(x), b: bL(stageBranch(x, 0)), dir: dir(x).toLowerCase() })); }),
    ];
  },
  luck: () => [
    ...[[true, 'm', 1], [false, 'f', 1], [false, 'm', 0], [true, 'f', 0]].map(([yang, g, fwd]) => mc(t('{y} year, {g}: which way do the luck pillars run?', { y: yy(yang), g: g === 'm' ? t('male') : t('female') }), fwd ? t('Forward') : t('Backward'), [t('Forward'), t('Backward')],
      t('Yang year + male or Yin year + female → forward; otherwise backward.'), 2)),
    ...[6, 9, 12, 15, 18, 21, 24, 27, 30].map((days) => mc(t('{n} days from birth to the next solar term: at which age does the first luck pillar start?', { n: days }), String(days / 3), [...new Set([days / 3, days / 3 + 1, days / 3 - 1, days].map(String))], t('Three days = one year.'))),
    ...[2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029].map((y) => { const p = pillarFromIndex(y - 4);
      return mc(t('Which annual pillar does {y} have?', { y }), pillarName(p), [0, 1, 2, -1].map((d) => pillarName(pillarFromIndex(y - 4 + d))), t('{y}: {p} year.', { y, p: pillarName(p) })); }),
  ],
  useful: () => [
    ...range(5).flatMap((e) => [
      mc(t('A strong {el} Day Master: which element helps balance it?', { el: elN(e) }), elN((e + 1) % 5), [elN((e + 1) % 5), elN(e), elN(mod(e - 1, 5))], t('A strong Day Master is balanced by what it produces, controls or is controlled by.'), 3),
      mc(t('A weak {el} Day Master: which element supports it?', { el: elN(e) }), elN(mod(e - 1, 5)), [elN(mod(e - 1, 5)), elN((e + 1) % 5), elN((e + 2) % 5)], t('A weak Day Master is supported by the element that produces it and by its own element.'), 3),
      mc(t('A weak {el} Day Master: which element tires it most?', { el: elN(e) }), elN(mod(e - 2, 5)), [elN(mod(e - 2, 5)), elN(mod(e - 1, 5)), elN(e)], t('The element that controls the Day Master puts it under pressure.'), 3),
    ]),
    mc(t('A chart born in deep winter usually needs …'), elN(1), ELS, t('Climate adjustment 调候: cold needs warmth.')),
    mc(t('A chart born in high summer usually needs …'), elN(4), ELS, t('Climate adjustment 调候: heat needs cooling.')),
    mc(t('What is the Useful God?'), t('The element that best balances a chart'), [t('The element that best balances a chart'), t('The strongest element'), t('The year animal'), t('A protective spirit')], t('用神 – the balancing element.')),
  ],
};

const lastRound = new Map(); // lesson id → keys of the questions shown last time
const keyOf = (q) => `${q.q}|${[...q.options].sort().join('|')}`;

/** All questions for a lesson (its own questions first). */
export function lessonPool(id) {
  const l = LESSONS.find((x) => x.id === id);
  const own = (l?.quiz || []).map((q) => ({ ...q }));
  const gen = GEN[id] ? GEN[id]() : [];
  const seen = new Set(), out = [];
  for (const q of [...own, ...gen]) { const k = q.q; if (q.answer >= 0 && !seen.has(k)) { seen.add(k); out.push(q); } }
  return out;
}

/** A round of `n` questions. On a retry, `keep` questions stay and the rest are new. */
export function lessonRound(id, n = 5, retry = false, keep = 3) {
  const pool = lessonPool(id);
  const prev = lastRound.get(id) || [];
  let round;
  if (retry && prev.length) {
    const prevQs = pool.filter((q) => prev.includes(q.q));
    const kept = shuffle(prevQs).slice(0, keep);
    const fresh = shuffle(pool.filter((q) => !prev.includes(q.q))).slice(0, n - kept.length);
    round = shuffle([...kept, ...fresh]);
  } else {
    round = shuffle(pool).slice(0, n);
  }
  lastRound.set(id, round.map((q) => q.q));
  return round;
}
export { keyOf };
