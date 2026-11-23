// Day pillar (日柱) profiles: hand-written image and character, plus derived seat, growth stage and special days.
import { STEMS, BRANCHES, ELEMENTS, TEN_GODS } from './data.js';
import { tenGod, cycleIndex } from './bazi.js';
import { stageOf } from './stages.js';
import { lang, t } from './i18n.js';
import { DAY_PILLARS_EN } from './daypillars-en.js';
import { DAY_PILLARS } from './i18n/packs.js';

const TEXTS = DAY_PILLARS_EN.map((x, i) => DAY_PILLARS?.[i] || x);
const mod = (a, n) => ((a % n) + n) % n;
const KUI_GANG = [16, 28, 34, 46];   // 庚辰 壬辰 戊戌 庚戌
const GOAT_BLADE = [42, 48, 54];     // 丙午 壬子 戊午
const OWN_ROOT = [50, 51, 56, 57];   // 甲寅 乙卯 庚申 辛酉 (日禄)

/** Profile of the day pillar with stem `s` and branch `b`. */
export function dayPillarProfile(s, b) {
  const i = cycleIndex(s, b);
  const [image, character] = TEXTS[i];
  const st = STEMS[s], br = BRANCHES[b];
  const seatGod = tenGod(s, br.hidden[0]);
  const rel = mod(br.el - st.el, 5); // branch element relative to the stem
  const seat = [
    t('It sits on its own element – self-reliant and firmly rooted.'),
    t('It sits on what it produces – expressive and generous, giving energy away.'),
    t('It sits on what it controls – practical and focused on results and resources.'),
    t('It sits on what controls it – disciplined, shaped by pressure and responsibility.'),
    t('It sits on what produces it – supported, thoughtful and resourceful.'),
  ][rel];
  const special = [];
  if (KUI_GANG.includes(i)) special.push({ zh: '魁罡', name: t('Kui Gang day'), desc: t('One of four “leadership” day pillars: strong-willed, decisive and fearless; best with clear goals.') });
  if (GOAT_BLADE.includes(i)) special.push({ zh: '羊刃', name: t('Goat Blade day'), desc: t('The Day Master sits on its peak – intense energy and willpower that need discipline.') });
  if (OWN_ROOT.includes(i)) special.push({ zh: '日禄', name: t('Own-root day'), desc: t('The Day Master sits on its own prosperity star – self-made, independent and resilient.') });
  return { index: i, name: `${st.zh}${br.zh}`, image, character, seat, seatGod, seatGodName: TEN_GODS[seatGod].name,
    stage: stageOf(s, b), special, stemEl: ELEMENTS[st.el], branchEl: ELEMENTS[br.el] };
}
