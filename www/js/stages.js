// The twelve growth stages (长生十二宫) of a stem in a branch.
import { lang } from './i18n.js';
import { EXTRA } from './i18n/packs.js';

const mod = (a, n) => ((a % n) + n) % n;
// Branch of 长生 (Birth) per stem: Yang stems run forward from it, Yin stems backward.
const BIRTH = [11, 6, 2, 9, 2, 9, 5, 0, 8, 3];

const EN = [
  ['长生', 'Birth', 'A fresh start – optimism, potential and a natural ability to grow.'],
  ['沐浴', 'Bath', 'Charm and curiosity – attractive and romantic, but restless and open to temptation.'],
  ['冠带', 'Crown', 'Growing confidence – image, ambition and the wish to be seen.'],
  ['临官', 'Coming of Age', 'Capability and self-reliance – ready to take on responsibility and a career.'],
  ['帝旺', 'Peak', 'Full strength – a strong will and drive that can become overbearing.'],
  ['衰', 'Decline', 'Maturity – experienced, cautious and measured rather than pushing.'],
  ['病', 'Sickness', 'Sensitivity – empathetic and perceptive, inclined to worry.'],
  ['死', 'Death', 'Stillness – calm, introspective and focused, with quiet depth.'],
  ['墓', 'Tomb', 'Storage – reserved and thrifty, holding hidden reserves.'],
  ['绝', 'Extinction', 'Transition – independent, ready for new chapters, sometimes unsettled.'],
  ['胎', 'Conception', 'Ideas forming – imaginative and full of plans not yet born.'],
  ['养', 'Nurture', 'Being nourished – gentle, supported and growing step by step.'],
];
const DE = [
  ['长生', 'Geburt', 'Ein frischer Anfang – Optimismus, Potenzial und eine natürliche Fähigkeit zu wachsen.'],
  ['沐浴', 'Bad', 'Charme und Neugier – anziehend und romantisch, aber rastlos und anfällig für Versuchungen.'],
  ['冠带', 'Krone', 'Wachsendes Selbstvertrauen – Auftreten, Ehrgeiz und der Wunsch, gesehen zu werden.'],
  ['临官', 'Amtsantritt', 'Können und Selbstständigkeit – bereit für Verantwortung und Beruf.'],
  ['帝旺', 'Höhepunkt', 'Volle Kraft – starker Wille und Antrieb, der dominant werden kann.'],
  ['衰', 'Abnahme', 'Reife – erfahren, vorsichtig und maßvoll statt drängend.'],
  ['病', 'Krankheit', 'Feinfühligkeit – einfühlsam und wahrnehmend, neigt zum Grübeln.'],
  ['死', 'Tod', 'Stille – ruhig, nach innen gekehrt und konzentriert, mit stiller Tiefe.'],
  ['墓', 'Grab', 'Speicher – zurückhaltend und sparsam, mit verborgenen Reserven.'],
  ['绝', 'Auslöschung', 'Übergang – unabhängig, bereit für neue Kapitel, manchmal unruhig.'],
  ['胎', 'Empfängnis', 'Ideen entstehen – fantasievoll und voller Pläne, die noch reifen.'],
  ['养', 'Nähren', 'Genährt werden – sanft, unterstützt und Schritt für Schritt wachsend.'],
];
export const STAGES = (lang === 'de' ? DE : EXTRA?.STAGES || EN).map(([zh, name, desc], i) => ({ index: i, zh, name, desc }));

/** Growth stage of `stem` in `branch`. */
export function stageOf(stem, branch) {
  const i = stem % 2 === 0 ? mod(branch - BIRTH[stem], 12) : mod(BIRTH[stem] - branch, 12);
  return STAGES[i];
}
