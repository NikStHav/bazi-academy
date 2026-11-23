// Symbolic stars (神煞) – the most widely used ones, derived from the day stem, day branch and year branch.
import { STEMS, BRANCHES } from './data.js';
import { PILLAR_KEYS, PILLAR_LABEL } from './bazi.js';
import { lang, t } from './i18n.js';
import { MISC } from './i18n/packs.js';
const STARS_L = MISC?.STARS;

const mod = (a, n) => ((a % n) + n) % n;
// Trine groups: 申子辰 (Water), 寅午戌 (Fire), 巳酉丑 (Metal), 亥卯未 (Wood) – keyed by branch % 4.
const TRINE = (b) => b % 4; // 0: 申子辰, 2: 寅午戌, 1: 巳酉丑, 3: 亥卯未
const BY_TRINE = {
  peach:  { 0: 9, 2: 3, 1: 6, 3: 0 },   // 咸池: 申子辰→酉, 寅午戌→卯, 巳酉丑→午, 亥卯未→子
  horse:  { 0: 2, 2: 8, 1: 11, 3: 5 },  // 驿马: →寅, →申, →亥, →巳
  canopy: { 0: 4, 2: 10, 1: 1, 3: 7 },  // 华盖: →辰, →戌, →丑, →未
};
const NOBLE = [[1, 7], [0, 8], [11, 9], [11, 9], [1, 7], [0, 8], [2, 6], [2, 6], [3, 5], [3, 5]]; // 天乙贵人 by day stem
const ACADEMIC = [5, 6, 8, 9, 8, 9, 11, 0, 2, 3];   // 文昌 by day stem
const PROSPERITY = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0]; // 禄 by day stem
const BLADE = { 0: 3, 2: 6, 4: 6, 6: 9, 8: 0 };      // 羊刃 for Yang day stems

export const STARS = {
  noble: { zh: '天乙贵人', name: 'Nobleman', icon: '🌟',
    desc: 'Helpful people and protection – support appears when you need it most.',
    pillar: { year: 'help from family, elders and society', month: 'mentors and supportive bosses at work', day: 'a supportive partner; you are helped personally', hour: 'helpful children, students or later-life support' } },
  peach: { zh: '桃花', name: 'Peach Blossom', icon: '🌸',
    desc: 'Charm, attraction and popularity – romance, social life and artistic taste.',
    pillar: { year: 'early popularity and social ease', month: 'charisma in your work and social circle', day: 'strong romantic attraction in close relationships', hour: 'late-blooming romance; an inner romantic side' } },
  horse: { zh: '驿马', name: 'Travelling Horse', icon: '🐎',
    desc: 'Movement, travel, relocation and change – restless energy that thrives on new places.',
    pillar: { year: 'moving or travelling in childhood', month: 'jobs with travel or frequent change', day: 'a mobile lifestyle; a partner from afar', hour: 'travel and moves later in life' } },
  academic: { zh: '文昌', name: 'Academic Star', icon: '📜',
    desc: 'Intelligence, learning and writing – success in studies, exams and intellectual work.',
    pillar: { year: 'an educated family background', month: 'success through qualifications at work', day: 'a sharp, studious mind', hour: 'clever children; lifelong learning' } },
  canopy: { zh: '华盖', name: 'Canopy', icon: '☂️',
    desc: 'Art, spirituality and solitude – depth, originality and interest in metaphysics.',
    pillar: { year: 'spiritual or artistic roots', month: 'creative or specialist work', day: 'an independent, introspective nature', hour: 'spiritual interests that grow with age' } },
  prosperity: { zh: '禄神', name: 'Prosperity Star', icon: '🪙',
    desc: 'Stable resources and self-earned income – the Day Master’s own “salary”.',
    pillar: { year: 'a solid family foundation', month: 'steady earnings from work', day: 'self-reliance and good health', hour: 'security in later life' } },
  blade: { zh: '羊刃', name: 'Goat Blade', icon: '🗡️',
    desc: 'Fierce willpower and courage – a sharp edge that needs discipline to use well.',
    pillar: { year: 'strong-willed family influences', month: 'a competitive, intense career drive', day: 'a forceful personality; temper needs care', hour: 'determination in later life' } },
  void: { zh: '空亡', name: 'Void', icon: '○',
    desc: 'Emptiness – things in this pillar feel less tangible; strong for spiritual or creative work, weaker for material matters.',
    pillar: { year: 'distance from family roots', month: 'career changes or unconventional paths', day: 'independence; relationships need extra care', hour: 'unusual plans; fewer attachments later' } },
};

if (STARS_L) for (const k of Object.keys(STARS)) Object.assign(STARS[k], STARS_L[k]);

/** Void (旬空) branches of a pillar index (0–59). */
export const voidBranches = (index) => { const start = index - (index % 10); const b0 = start % 12; return [mod(b0 + 10, 12), mod(b0 + 11, 12)]; };

/** Branch(es) that carry each star for a chart. */
export function starBranches(chart) {
  const dm = chart.dayMaster;
  const refs = [chart.pillars.day.branch, chart.pillars.year.branch];
  const trineStar = (key) => [...new Set(refs.map((b) => BY_TRINE[key][TRINE(b)]))];
  return {
    noble: NOBLE[dm], peach: trineStar('peach'), horse: trineStar('horse'), academic: [ACADEMIC[dm]],
    canopy: trineStar('canopy'), prosperity: [PROSPERITY[dm]], blade: dm in BLADE ? [BLADE[dm]] : [],
    void: voidBranches(chart.pillars.day.index),
  };
}

/** Stars present in the natal chart: [{ key, ...STARS[key], pillars: ['year', ...] }] */
export function findStars(chart) {
  const sb = starBranches(chart);
  const out = [];
  for (const [key, branches] of Object.entries(sb)) {
    const pillars = PILLAR_KEYS.filter((k) => chart.pillars[k] && branches.includes(chart.pillars[k].branch)
      && !(key === 'void' && k === 'day')); // the day pillar defines the void, it can't be void itself
    if (pillars.length) out.push({ key, ...STARS[key], pillars });
  }
  return out;
}

/** Which stars a given branch (e.g. of a year or month) activates for this chart. */
export function starsActivatedBy(chart, branch) {
  const sb = starBranches(chart);
  return Object.entries(sb).filter(([, bs]) => bs.includes(branch)).map(([key]) => ({ key, ...STARS[key] }));
}

const DE_PILLAR = { year: 'Jahres', month: 'Monats', day: 'Tages', hour: 'Stunden' };
const ES_PILLAR = { year: 'del año', month: 'del mes', day: 'del día', hour: 'de la hora' };
export const pillarListText = (pillars) => {
  if (lang === 'de') { // "Jahressäule", "Jahres- und Tagessäule", "Jahres-, Monats- und Tagessäule"
    const p = pillars.map((k) => DE_PILLAR[k]);
    return p.length === 1 ? `${p[0]}säule` : `${p.slice(0, -1).map((x) => x + '-').join(', ')} und ${p[p.length - 1]}säule`;
  }
  if (lang === 'es') { // "pilar del año", "pilares del año y del día"
    const p = pillars.map((k) => ES_PILLAR[k]);
    return `${p.length > 1 ? 'pilares' : 'pilar'} ${p.length > 1 ? `${p.slice(0, -1).join(', ')} y ${p[p.length - 1]}` : p[0]}`;
  }
  return t(pillars.length > 1 ? '{list} pillars' : '{list} pillar', { list: pillars.map((k) => PILLAR_LABEL[k]).join(t(' and ')) });
};
export { STEMS, BRANCHES };
