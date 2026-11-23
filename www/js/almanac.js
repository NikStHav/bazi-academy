// Tong Shu (通书) almanac basics: the 12 Day Officers (建除十二神), clash animal and activity suggestions.
import { BRANCHES } from './data.js';
import { computeChart } from './bazi.js';
import { lang, t } from './i18n.js';
import { MISC as DE } from './i18n/packs.js';

const mod = (a, n) => ((a % n) + n) % n;

// Rating follows the classical rhyme 建满平收黑，除危定执黄，成开皆可用，破闭不相当.
export const OFFICERS = [
  { zh: '建', name: 'Establish', rating: 'fair', good: 'Starting new plans, taking up a position, travel', avoid: 'Digging, breaking ground, opening storage',
    desc: 'The day of beginnings – energy is fresh and assertive.' },
  { zh: '除', name: 'Remove', rating: 'good', good: 'Cleaning, decluttering, ending bad habits, health routines', avoid: 'Weddings, big purchases',
    desc: 'A day for clearing out the old to make room for the new.' },
  { zh: '满', name: 'Full', rating: 'fair', good: 'Celebrations, opening a shop, trade, gatherings', avoid: 'Lawsuits, taking up a new position',
    desc: 'Abundance and fullness – good for gatherings and commerce.' },
  { zh: '平', name: 'Balance', rating: 'fair', good: 'Repairs, routine work, painting, levelling', avoid: 'Major new ventures, weddings',
    desc: 'An even, ordinary day – best for maintenance and routine.' },
  { zh: '定', name: 'Stable', rating: 'good', good: 'Weddings, signing contracts, buying, setting goals', avoid: 'Lawsuits, long journeys',
    desc: 'Settling and fixing – commitments made today tend to last.' },
  { zh: '执', name: 'Initiate', rating: 'good', good: 'Starting construction, hiring, planting, signing', avoid: 'Moving house, travel, opening a business',
    desc: 'Grasping and holding – good for taking firm action on a plan.' },
  { zh: '破', name: 'Destruction', rating: 'bad', good: 'Demolition, breaking bad habits, ending things on purpose', avoid: 'Weddings, contracts, openings, moving',
    desc: 'The day opposite the month – things break apart. Avoid important beginnings.' },
  { zh: '危', name: 'Danger', rating: 'good', good: 'Prayer, careful detailed work, meditation', avoid: 'Risky activities, climbing, sailing',
    desc: 'Precarious but auspicious when you act carefully.' },
  { zh: '成', name: 'Success', rating: 'best', good: 'Almost everything: weddings, openings, moving, contracts, travel', avoid: 'Lawsuits',
    desc: 'One of the best days of the cycle – efforts come to completion.' },
  { zh: '收', name: 'Receive', rating: 'fair', good: 'Collecting debts, harvesting, buying, storing', avoid: 'Travel, medical procedures, funerals',
    desc: 'A day for gathering in what is due.' },
  { zh: '开', name: 'Open', rating: 'best', good: 'Opening a business, weddings, starting studies, travel, moving', avoid: 'Burials, closing matters',
    desc: 'Doors open – excellent for launches and beginnings.' },
  { zh: '闭', name: 'Close', rating: 'bad', good: 'Saving money, closing accounts, building walls', avoid: 'Openings, travel, starting anything new',
    desc: 'Things are sealed – a day for rest and endings, not beginnings.' },
];

export const RATING_LABEL = { best: 'Very good', good: 'Good', fair: 'Neutral', bad: 'Unfavourable' };

export const ACTIVITIES = [
  { key: 'wedding', name: 'Wedding or engagement', icon: '💍', officers: [4, 8, 10] },
  { key: 'moving', name: 'Moving house', icon: '📦', officers: [4, 8, 10] },
  { key: 'contract', name: 'Signing a contract', icon: '✍️', officers: [4, 5, 8] },
  { key: 'business', name: 'Opening a business or launch', icon: '🏮', officers: [2, 8, 10] },
  { key: 'travel', name: 'Starting a journey', icon: '✈️', officers: [0, 8, 10] },
  { key: 'renovation', name: 'Renovation or building', icon: '🔨', officers: [3, 5, 8] },
];

if (DE) {
  OFFICERS.forEach((o, i) => Object.assign(o, DE.OFFICERS[i]));
  Object.assign(RATING_LABEL, DE.RATING_LABEL);
  ACTIVITIES.forEach((a, i) => { a.name = DE.ACTIVITIES?.[i] || a.name; });
}

/** Almanac info for a local calendar date. `mine` (optional) is the user's chart. */
export function dayInfo(year, month, day, mine = null) {
  const c = computeChart({ year, month, day, hour: 12, minute: 0, tzOffset: 0 }); // noon: month & day pillar of that date
  const { day: d, month: m } = c.pillars;
  const officerIdx = mod(d.branch - m.branch, 12);
  const clashBranch = mod(d.branch + 6, 12);
  const personal = [];
  if (mine) {
    const yb = mine.pillars.year.branch, db = mine.pillars.day.branch;
    if (clashBranch === yb) personal.push(t('clashes your year branch {b}', { b: `${BRANCHES[yb].zh} ${BRANCHES[yb].animal}` }));
    if (clashBranch === db) personal.push(t('clashes your day branch {b} (relationships, health)', { b: BRANCHES[db].zh }));
  }
  return { date: { year, month, day }, pillars: c.pillars, officerIdx, officer: OFFICERS[officerIdx],
    clashBranch, personalClash: personal };
}

/** Find suitable days for an activity in the next `days` days from `from` (Date). */
export function findDays(activityKey, from, days, mine = null) {
  const act = ACTIVITIES.find((a) => a.key === activityKey);
  const out = [];
  for (let i = 0; i < days; i++) {
    const dt = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    const info = dayInfo(dt.getFullYear(), dt.getMonth() + 1, dt.getDate(), mine);
    if (act.officers.includes(info.officerIdx) && !info.personalClash.length) out.push(info);
  }
  return out;
}
