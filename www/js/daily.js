// Daily reading ("Tageskarte"): today's day pillar read against the user's chart, in three layers –
// a simple headline (stars, theme, do / avoid, lucky hours), the BaZi reasons behind it, and links for depth.
import { STEMS, BRANCHES, ELEMENTS } from './data.js';
import { tenGod, pillarsForNow, cycleIndex } from './bazi.js';
import { favourableElements, ELEMENT_ADVICE } from './reading.js';
import { rate } from './forecast.js';
import { dayInfo } from './almanac.js';
import { hoursOfDay } from './hours.js';
import { lang } from './i18n.js';
import { EXTRA } from './i18n/packs.js';

const mod = (a, n) => ((a % n) + n) % n;

// Plain-language theme of the day for each Ten God (the day stem seen from the Day Master).
const THEMES = {
  en: {
    F: { icon: '🤝', title: 'Stand on your own feet', text: 'A day to rely on yourself and to connect with people on your level.',
      do: ['Work on your own projects', 'Meet friends or colleagues', 'Exercise'], avoid: ['Stubborn arguments', 'Lending money'] },
    RW: { icon: '🔥', title: 'Bold and competitive', text: 'Energy runs high – act boldly, but keep a close eye on your money.',
      do: ['Sport and competition', 'Take a brave first step', 'Team up for a goal'], avoid: ['Impulse buys', 'Risky bets or loans'] },
    EG: { icon: '🎨', title: 'Enjoy and create', text: 'A relaxed day for creativity, good food and doing what you love.',
      do: ['Creative hobbies', 'Cook or eat well', 'Rest and recharge'], avoid: ['Overindulging', 'Pushing too hard'] },
    HO: { icon: '💡', title: 'Express yourself', text: 'Ideas flow and you want to be heard – great for presenting, but choose your words.',
      do: ['Present or pitch ideas', 'Write, perform, post', 'Brainstorm'], avoid: ['Criticising your boss', 'Sharp words'] },
    IW: { icon: '🎯', title: 'Opportunities', text: 'Chances can appear out of nowhere – network, sell and stay open.',
      do: ['Network and meet people', 'Sales and side deals', 'Say yes to invitations'], avoid: ['Gambling', 'Spreading yourself too thin'] },
    DW: { icon: '💰', title: 'Steady progress', text: 'A practical day for work, money and getting things done step by step.',
      do: ['Finish open tasks', 'Plan your budget', 'Sort out paperwork'], avoid: ['Shortcuts', 'Splurging'] },
    '7K': { icon: '⚡', title: 'Pressure and courage', text: 'Challenges ask you to step up – stay calm and don’t pick fights.',
      do: ['Tackle a difficult task', 'Set clear boundaries', 'Physical training'], avoid: ['Conflicts', 'Overwork and risks'] },
    DO: { icon: '🏛️', title: 'Responsibility', text: 'A good day for formal matters, commitments and showing that you are reliable.',
      do: ['Applications and official matters', 'Keep your promises', 'Talk to superiors'], avoid: ['Breaking rules', 'Being late'] },
    IR: { icon: '🔮', title: 'Reflect and study', text: 'Turn inward – research, intuition and quiet time work best today.',
      do: ['Study or research', 'Meditate or journal', 'Time on your own'], avoid: ['Overthinking', 'Big social events'] },
    DR: { icon: '📚', title: 'Support and learning', text: 'Help comes from others today – learn, ask for advice and look after yourself.',
      do: ['Learn something new', 'Ask a mentor for advice', 'Family time and rest'], avoid: ['Waiting for others to act', 'Neglecting your own needs'] },
  },
  de: {
    F: { icon: '🤝', title: 'Auf eigenen Füßen', text: 'Ein Tag, um dich auf dich selbst zu verlassen und Menschen auf Augenhöhe zu treffen.',
      do: ['An eigenen Projekten arbeiten', 'Freunde oder Kollegen treffen', 'Sport treiben'], avoid: ['Sture Diskussionen', 'Geld verleihen'] },
    RW: { icon: '🔥', title: 'Mutig und kämpferisch', text: 'Viel Energie – handle mutig, aber behalte dein Geld im Blick.',
      do: ['Sport und Wettkampf', 'Einen mutigen ersten Schritt wagen', 'Sich für ein Ziel zusammentun'], avoid: ['Spontankäufe', 'Riskante Wetten oder Kredite'] },
    EG: { icon: '🎨', title: 'Genießen und gestalten', text: 'Ein entspannter Tag für Kreativität, gutes Essen und das, was du liebst.',
      do: ['Kreative Hobbys', 'Gut kochen oder essen', 'Ausruhen und auftanken'], avoid: ['Maßlosigkeit', 'Dich zu sehr antreiben'] },
    HO: { icon: '💡', title: 'Zeig dich', text: 'Ideen sprudeln und du willst gehört werden – gut zum Präsentieren, aber wähle deine Worte.',
      do: ['Ideen vorstellen', 'Schreiben, auftreten, posten', 'Brainstorming'], avoid: ['Kritik am Chef', 'Scharfe Worte'] },
    IW: { icon: '🎯', title: 'Gelegenheiten', text: 'Chancen tauchen unerwartet auf – knüpfe Kontakte, verkaufe und bleib offen.',
      do: ['Kontakte knüpfen', 'Verkaufen und Nebengeschäfte', 'Einladungen annehmen'], avoid: ['Glücksspiel', 'Dich zu verzetteln'] },
    DW: { icon: '💰', title: 'Stetiger Fortschritt', text: 'Ein praktischer Tag für Arbeit, Geld und Erledigungen Schritt für Schritt.',
      do: ['Offene Aufgaben abschließen', 'Das Budget planen', 'Papierkram erledigen'], avoid: ['Abkürzungen', 'Verschwendung'] },
    '7K': { icon: '⚡', title: 'Druck und Mut', text: 'Herausforderungen verlangen Einsatz – bleib ruhig und such keinen Streit.',
      do: ['Eine schwierige Aufgabe anpacken', 'Klare Grenzen setzen', 'Körperliches Training'], avoid: ['Konflikte', 'Überarbeitung und Risiken'] },
    DO: { icon: '🏛️', title: 'Verantwortung', text: 'Ein guter Tag für Formelles, Verpflichtungen und um Verlässlichkeit zu zeigen.',
      do: ['Bewerbungen und Behördliches', 'Versprechen halten', 'Gespräche mit Vorgesetzten'], avoid: ['Regeln brechen', 'Unpünktlichkeit'] },
    IR: { icon: '🔮', title: 'Nachdenken und lernen', text: 'Wende dich nach innen – Recherche, Intuition und Ruhe gelingen heute am besten.',
      do: ['Lernen oder recherchieren', 'Meditieren oder Tagebuch schreiben', 'Zeit für dich allein'], avoid: ['Grübeln', 'Große Feiern'] },
    DR: { icon: '📚', title: 'Unterstützung und Lernen', text: 'Heute kommt Hilfe von anderen – lerne, frag um Rat und sorge für dich.',
      do: ['Etwas Neues lernen', 'Einen Mentor um Rat fragen', 'Familienzeit und Ruhe'], avoid: ['Abwarten, bis andere handeln', 'Eigene Bedürfnisse vernachlässigen'] },
  },
};

// He Tu (河图) numbers of the elements.
const NUMBERS = [[3, 8], [2, 7], [5, 0], [4, 9], [1, 6]];
const OFFICER_SCORE = { best: 1, good: 0.5, fair: 0, bad: -1 };
const firstItems = (s, n) => String(s).split(/,\s*/).slice(0, n).map((x) => x.charAt(0).toUpperCase() + x.slice(1));

/** Stars 1–5 from a raw score. */
export const starsOf = (score) => (score >= 2 ? 5 : score >= 1 ? 4 : score >= 0 ? 3 : score >= -1 ? 2 : 1);

/**
 * The daily reading for `date`. `chart` is the user's computed chart or null.
 * Returns layer 1 (stars, theme, do, avoid, lucky) and the raw facts for the "why" layer.
 */
export function dailyReading(chart, date = new Date()) {
  const p = pillarsForNow(date).day;
  const info = dayInfo(date.getFullYear(), date.getMonth() + 1, date.getDate(), chart);
  const officer = info.officer;
  const index = cycleIndex(p.stem, p.branch);
  const hours = hoursOfDay(p, chart).filter((h) => h.lucky && h.branch >= 3 && h.branch <= 10).slice(0, 3);
  if (!chart) {
    const score = OFFICER_SCORE[officer.rating] + 0.5;
    return { personal: false, pillar: p, index, info, officer, stars: starsOf(score), hours,
      theme: { icon: '📜', title: officer.name, text: officer.desc, do: firstItems(officer.good, 3), avoid: firstItems(officer.avoid, 2) } };
  }
  const god = tenGod(chart.dayMaster, p.stem);
  const r = rate(chart, p.stem, p.branch);
  const { favourable } = favourableElements(chart);
  const score = r.score + OFFICER_SCORE[officer.rating] - (info.personalClash.length ? 0.5 : 0);
  const base = (THEMES[lang] || EXTRA?.DAILY_THEMES || THEMES.en)[god];
  const theme = { ...base, do: [...base.do.slice(0, 2), firstItems(officer.good, 1)[0]], avoid: [base.avoid[0], firstItems(officer.avoid, 1)[0]] };
  // Lucky element: today's own element if it helps you, else your main favourable element.
  const luckyEl = [STEMS[p.stem].el, BRANCHES[p.branch].el].find((e) => favourable.includes(e)) ?? favourable[0];
  return {
    personal: true, pillar: p, index, info, officer, god, rating: r, favourable, score, stars: starsOf(score), theme, hours,
    elementsHelp: [STEMS[p.stem].el, BRANCHES[p.branch].el].filter((e) => favourable.includes(e)).length,
    lucky: { el: luckyEl, colour: firstItems(ELEMENT_ADVICE[luckyEl].colors, 1)[0], direction: ELEMENTS[luckyEl].direction, numbers: NUMBERS[luckyEl] },
  };
}

/** Wheel sector of a cycle index: element colour of its stem. */
export const sectorElement = (i) => STEMS[mod(i, 10)].el;
export { mod };
