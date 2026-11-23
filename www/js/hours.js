// Chinese double hours (时辰) with the Yellow/Black Path deities (黄道/黑道) and personal clashes.
import { STEMS, BRANCHES } from './data.js';
import { tenGod } from './bazi.js';
import { lang } from './i18n.js';
import { EXTRA } from './i18n/packs.js';

const mod = (a, n) => ((a % n) + n) % n;

// Order of the twelve path deities; six are auspicious (Yellow Path), six inauspicious (Black Path).
export const DEITIES = [
  { zh: '青龙', name: 'Green Dragon', good: true }, { zh: '明堂', name: 'Bright Hall', good: true },
  { zh: '天刑', name: 'Heavenly Punishment', good: false }, { zh: '朱雀', name: 'Vermilion Bird', good: false },
  { zh: '金匮', name: 'Golden Casket', good: true }, { zh: '天德', name: 'Heavenly Virtue', good: true },
  { zh: '白虎', name: 'White Tiger', good: false }, { zh: '玉堂', name: 'Jade Hall', good: true },
  { zh: '天牢', name: 'Heavenly Prison', good: false }, { zh: '玄武', name: 'Black Tortoise', good: false },
  { zh: '司命', name: 'Life Governor', good: true }, { zh: '勾陈', name: 'Coiling Snake', good: false },
];
const DE_NAMES = ['Grüner Drache', 'Lichte Halle', 'Himmlische Strafe', 'Zinnoberroter Vogel', 'Goldene Truhe', 'Himmlische Tugend',
  'Weißer Tiger', 'Jadehalle', 'Himmlisches Gefängnis', 'Schwarze Schildkröte', 'Hüter des Lebens', 'Geringelte Schlange'];
const NAMES_L = lang === 'de' ? DE_NAMES : EXTRA?.DEITY_NAMES;
if (NAMES_L) DEITIES.forEach((d, i) => { d.name = NAMES_L[i] || d.name; });

// Hour branch of the Green Dragon for each day branch (寅申需加子，卯酉却在寅，辰戌龙位上，巳亥午中寻，子午临申地，丑未戌上行).
const DRAGON = { 0: 8, 6: 8, 1: 10, 7: 10, 2: 0, 8: 0, 3: 2, 9: 2, 4: 4, 10: 4, 5: 6, 11: 6 };

/** Index (0–11) of the double hour for a clock hour: 子 = 23–01, 丑 = 01–03 … */
export const hourBranchOf = (h) => Math.floor(((h + 1) % 24) / 2);
/** Clock range of a double hour, e.g. 0 → '23–01'. */
export const hourRange = (b) => `${String(mod(b * 2 - 1, 24)).padStart(2, '0')}–${String(b * 2 + 1).padStart(2, '0')}`;

/** The twelve hours of a day (given its day pillar), rated for an optional natal chart. */
export function hoursOfDay(dayPillar, mine = null) {
  const start = DRAGON[dayPillar.branch];
  return Array.from({ length: 12 }, (_, b) => {
    const stem = mod(dayPillar.stem * 2 + b, 10);
    const deity = DEITIES[mod(b - start, 12)];
    const dayClash = mod(b - dayPillar.branch, 12) === 6;
    const personal = [];
    if (mine) {
      if (mod(b - mine.pillars.day.branch, 12) === 6) personal.push('day');
      if (mod(b - mine.pillars.year.branch, 12) === 6) personal.push('year');
    }
    const lucky = deity.good && !dayClash && !personal.length;
    return { branch: b, stem, range: hourRange(b), deity, dayClash, personal, lucky,
      god: mine ? tenGod(mine.dayMaster, stem) : null, label: `${STEMS[stem].zh}${BRANCHES[b].zh}` };
  });
}
