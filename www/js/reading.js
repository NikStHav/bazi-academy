// Detailed chart reading (Premium). Builds an interpretation from a computed chart.
import { STEMS, BRANCHES, ELEMENTS, TEN_GODS } from './data.js';
import { tenGod, pillarFromIndex } from './bazi.js';
import { findStars, pillarListText } from './shensha.js';
import { t, lang } from './i18n.js';
import * as DE from './i18n/de-reading.js';

const mod = (a, n) => ((a % n) + n) % n;

export const ELEMENT_ADVICE = [
  { colors: 'green, teal', careers: 'education, publishing, design, health care, botany, consulting',
    activities: 'time in nature, planning, learning something new, gentle stretching' },
  { colors: 'red, orange, pink, purple', careers: 'media, marketing, performance, hospitality, technology, energy',
    activities: 'socialising, presenting, sunlight, creative expression, cardio' },
  { colors: 'yellow, ochre, beige, brown', careers: 'real estate, construction, agriculture, administration, HR, mediation',
    activities: 'routines, cooking, gardening, saving, caring for a home' },
  { colors: 'white, silver, grey, gold', careers: 'finance, law, engineering, IT, precision crafts, management',
    activities: 'decluttering, structure and lists, martial arts, breathing exercises' },
  { colors: 'blue, black, dark navy', careers: 'research, travel, logistics, communication, psychology, trade',
    activities: 'swimming, reading, reflection, networking, rest and good sleep' },
];

// What each Ten God means when prominent (personality), in the spouse palace and in the month stem (career).
export const GOD_TEXT = {
  F: {
    trait: 'You are self-reliant and steady, with a strong sense of who you are. You work well with peers, but you dislike being told what to do.',
    spouse: 'You look for an equal partner and a friendship-like relationship. Shared goals matter; watch out for stubborn standoffs.',
    career: 'You do well in teams of equals, partnerships or self-employment, where your independence is an asset.',
    luck: 'A period of more independence and self-reliance, with support from peers – but also more competition.',
  },
  RW: {
    trait: 'You are bold, sociable and competitive, quick to act and to take risks. Generous with friends – sometimes to your own cost.',
    spouse: 'Relationships are passionate and dynamic; rivalry or a partner with a strong will can play a role. Agree clearly on money.',
    career: 'Sales, sports, entrepreneurship and fast-moving fields suit your drive. Be careful with shared finances.',
    luck: 'An energetic, competitive period: good for bold moves, but keep a close eye on spending and partnerships.',
  },
  EG: {
    trait: 'You are easy-going, creative and enjoy life’s pleasures. Your talents flow naturally, and people find you pleasant company.',
    spouse: 'You want a relaxed, warm relationship with good food, humour and shared enjoyment.',
    career: 'Creative work, food and hospitality, teaching or anything that lets you express a talent at your own pace.',
    luck: 'A creative, comfortable period that favours hobbies, health, enjoyment and developing a talent.',
  },
  HO: {
    trait: 'You are brilliant, expressive and original. You question rules and authority and want to show what you can do.',
    spouse: 'You need a partner who admires your ideas and gives you freedom; criticism can hurt the relationship quickly.',
    career: 'Innovation, performance, arts, law, consulting – fields where originality beats hierarchy.',
    luck: 'A period of strong expression and new ideas. Great for creativity; be diplomatic with superiors and contracts.',
  },
  IW: {
    trait: 'You are generous, opportunistic and good with people. You see chances others miss and enjoy spending on experiences.',
    spouse: 'You are charming and socially active in relationships; variety and shared adventures keep things alive.',
    career: 'Business, trading, investing, sales and networking – income from ventures rather than a fixed salary.',
    luck: 'Opportunities for income from ventures, side businesses or investments – and more temptation to spend.',
  },
  DW: {
    trait: 'You are practical, diligent and reliable with money. You value security and build wealth step by step.',
    spouse: 'You seek a stable, loyal partnership. Classically, in a man’s chart, a good sign for a caring wife.',
    career: 'Stable employment, accounting, administration and any role with steady, earned income.',
    luck: 'A period of steady earnings and practical results – good for saving, buying and consolidating.',
  },
  '7K': {
    trait: 'You are ambitious, brave and decisive, and you perform well under pressure. You can be demanding of yourself and others.',
    spouse: 'Relationships can be intense; a strong-willed partner. Classically, in a woman’s chart, a powerful, dynamic partner.',
    career: 'Leadership, the military or police, surgery, crisis management or competitive industries.',
    luck: 'A demanding period with pressure and challenges – that can bring a breakthrough in status if you rise to it.',
  },
  DO: {
    trait: 'You are responsible, principled and status-conscious. You respect rules and want a good reputation.',
    spouse: 'You want a respectable, committed partnership. Classically, in a woman’s chart, a good sign for a reliable husband.',
    career: 'Public service, management, law, large organisations – structured careers with clear promotion paths.',
    luck: 'A period of recognition, responsibility and possible promotion; good for formal commitments.',
  },
  IR: {
    trait: 'You are intuitive, thoughtful and drawn to unusual knowledge – metaphysics, research, niche skills. You need time alone.',
    spouse: 'You need a partner who respects your inner world and need for space; communication of feelings takes effort.',
    career: 'Research, IT, alternative medicine, spirituality, writing or specialist niches.',
    luck: 'A period of study, introspection and unconventional insight; less suited to big social ventures.',
  },
  DR: {
    trait: 'You are kind, patient and a lifelong learner. You attract support and mentors, and you like to look after others.',
    spouse: 'You look for a supportive, nurturing partner – someone who feels like home.',
    career: 'Education, academia, health care, social work, culture – roles where knowledge and care matter.',
    luck: 'A supportive period: help from mentors, good for studies, qualifications, property and rest.',
  },
};

const LACK = [
  { look: 'Plans may stay vague and it can be hard to start or grow new things; flexibility and long-term vision need effort.',
    fix: 'Set clear goals, keep learning, spend time in nature and around plants, and stretch both body and plans.' },
  { look: 'You may come across as reserved, hold back enthusiasm or find it hard to be visible and promote yourself.',
    fix: 'Seek warmth and company, present your work, get daylight and movement, and allow yourself to show joy.' },
  { look: 'Routines, savings and a sense of stability may feel elusive; it can be hard to stay grounded and consistent.',
    fix: 'Build routines, keep a budget, cook and eat regularly, create a stable home base and keep promises small and steady.' },
  { look: 'Decisions, boundaries and structure may be weak spots – saying no and finishing things can be difficult.',
    fix: 'Work with lists and deadlines, declutter, practise saying no, and use breathing or martial-arts style discipline.' },
  { look: 'Rest, reflection and going with the flow may be neglected; stress can build up and adaptability suffers.',
    fix: 'Protect your sleep, read and reflect, journal, spend time near water and talk through feelings with people you trust.' },
];
const EXCESS = [
  'too much Wood can mean stubbornness, impatience and taking on too many projects at once',
  'too much Fire can mean impulsiveness, restlessness and burning out after intense phases',
  'too much Earth can mean worrying, overthinking and getting stuck in comfort or inertia',
  'too much Metal can mean rigidity, perfectionism and being overly critical of yourself and others',
  'too much Water can mean indecision, drifting, anxiety or scattering your energy',
];
const PILLAR_AREA = { year: 'family background and society', month: 'career and parents', day: 'yourself and your relationship', hour: 'children, plans and later life' };

const GROUPS = [
  { name: 'Companions', zh: '比劫', gods: ['F', 'RW'], rel: 0,
    many: 'Many Companions: a strong sense of self and many peers around you. Independence comes naturally; sharing and compromise are the lessons.',
    none: 'No Companions: you rarely rely on others for backing. Building a circle of trusted peers strengthens you.' },
  { name: 'Output', zh: '食伤', gods: ['EG', 'HO'], rel: 1,
    many: 'Many Output stars: expression is central – ideas, talent and words pour out. Channel them into a craft or creative work.',
    none: 'No Output stars: you may keep ideas and feelings to yourself. Practising expression (writing, art, speaking) opens doors.' },
  { name: 'Wealth', zh: '财', gods: ['IW', 'DW'], rel: 2,
    many: 'Many Wealth stars: you are oriented towards results, money and the material world. Make sure your energy keeps up with your goals.',
    none: 'No Wealth stars: money is not your main driver. Conscious budgeting helps turn your other strengths into income.' },
  { name: 'Power', zh: '官杀', gods: ['7K', 'DO'], rel: 3,
    many: 'Many Power stars: duty, pressure and authority are strong themes. Discipline is a gift – avoid carrying too many obligations.',
    none: 'No Power stars: you prefer freedom over hierarchy. Self-chosen structure and goals help you get things done.' },
  { name: 'Resource', zh: '印', gods: ['IR', 'DR'], rel: 4,
    many: 'Many Resource stars: you are thoughtful, well-supported and love to learn. Turn knowledge into action rather than endless preparation.',
    none: 'No Resource stars: you learn by doing and are used to fending for yourself. Mentors and rest are worth seeking out.' },
];

if (lang === 'de') {
  ELEMENT_ADVICE.splice(0, 5, ...DE.ELEMENT_ADVICE);
  Object.assign(GOD_TEXT, DE.GOD_TEXT);
  GROUPS.forEach((g, i) => Object.assign(g, DE.GROUPS[i]));
  LACK.splice(0, 5, ...DE.LACK);
  EXCESS.splice(0, 5, ...DE.EXCESS);
  Object.assign(PILLAR_AREA, DE.PILLAR_AREA);
}

/** Favourable / less favourable element indices (support-or-restrain method). */
export function favourableElements(chart) {
  const e = STEMS[chart.dayMaster].el;
  const strong = chart.strength.ratio >= 45;
  return {
    strong,
    favourable: (strong ? [e + 1, e + 2, e + 3] : [e - 1, e]).map((x) => mod(x, 5)),
    unfavourable: (strong ? [e - 1, e] : [e + 2, e + 3]).map((x) => mod(x, 5)),
  };
}

/** Returns { sections: [{ title, html }] } */
export function buildReading(chart) {
  const dm = chart.dayMaster;
  const dmS = STEMS[dm];
  const el = (i) => ELEMENTS[mod(i, 5)];
  const sections = [];

  // 1. Core nature & season
  const phase = chart.strength.phase;
  const mb = BRANCHES[chart.pillars.month.branch];
  const PHASE_NOTE = { prosperous: t('Your natural qualities show strongly and early in life.'), strong: t('You are well nourished by your environment and gain confidence with support.'),
    resting: t('You tend to give a lot of energy to others and need to recharge consciously.'), trapped: t('Life asks you to work hard for results; your efforts pay off over time.'),
    dead: t('You are shaped strongly by outside forces and grow stronger through the right support and timing.') };
  sections.push({ title: t('Your core nature'), html: `
    <p>${t('Your Day Master is <b>{dm}</b>.', { dm: `${dmS.zh} ${dmS.py}` })} ${dmS.desc}</p>
    <p>${t('You were born in a {el} month ({b}), so your element is <b>{phase}</b>.', { el: el(mb.el).name, b: `${mb.zh} ${mb.animal}`, phase: `${phase.name.toLowerCase()} (${phase.zh})` })} ${phase.desc} ${PHASE_NOTE[phase.key]}</p>` });

  // 2. Strength & useful elements
  const { strong, favourable, unfavourable } = favourableElements(chart);
  const fav = favourable.map((x) => el(x));
  const mainFav = mod(favourable[0], 5);
  sections.push({ title: t('Balance & favourable elements'), html: `
    <p>${t('Your Day Master is <b>{label}</b> (support ≈ {n}%).', { label: t(chart.strength.label).toLowerCase(), n: chart.strength.ratio })} ${strong
      ? t('A strong Day Master has energy to spare and benefits from elements that <b>use</b> that energy: what it produces, controls, or is controlled by.')
      : t('A weaker Day Master benefits from elements that <b>support</b> it: the element that produces it and its own element.')}</p>
    <p><b>${t('Favourable:')}</b> ${fav.map((e) => `<span class="tx-${ELEMENTS.indexOf(e)}">${e.zh} ${e.name}</span>`).join(', ')} ·
       <b>${t('Less favourable:')}</b> ${unfavourable.map((x) => el(x).name).join(', ')}</p>
    <p>${t('In traditional practice, people strengthen their main favourable element <b>{el}</b> through:', { el: el(mainFav).name })}</p>
    <ul><li><b>${t('Colours:')}</b> ${ELEMENT_ADVICE[mainFav].colors}</li><li><b>${t('Direction:')}</b> ${el(mainFav).direction}</li>
      <li><b>${t('Activities:')}</b> ${ELEMENT_ADVICE[mainFav].activities}</li><li><b>${t('Fields of work:')}</b> ${ELEMENT_ADVICE[mainFav].careers}</li></ul>
    <p class="small muted">${t('A full useful-god (用神) analysis also weighs climate, combinations and special structures; treat this as a first orientation.')}</p>` });

  // 3. Element balance highlights
  const sorted = [...chart.elements].sort((a, b) => b.pct - a.pct);
  const missing = chart.elements.filter((e) => e.pct === 0);
  const weakEls = chart.elements.filter((e) => e.pct > 0 && e.pct < 8);
  sections.push({ title: t('Your Five Elements'), html: `
    <p>${t('Strongest element:')} <b class="tx-${sorted[0].el}">${el(sorted[0].el).name} (${sorted[0].pct}%)</b> – ${el(sorted[0].el).traits}
      ${sorted[0].pct >= 35 ? t('It is very dominant, so its qualities – and their excesses – colour your whole chart.') : ''}</p>
    ${missing.length ? `<p>${t('Missing: <b>{els}</b>. Missing elements often show up as themes you meet through other people, places or later in life – and luck pillars can supply them.', { els: missing.map((e) => el(e.el).name).join(', ') })}</p>` : `<p>${t('All five elements are present in your chart – a sign of versatility.')}</p>`}
    ${weakEls.length ? `<p>${t('Weak: {els}.', { els: weakEls.map((e) => el(e.el).name).join(', ') })}</p>` : ''}` });

  // 4. Ten Gods profile
  const counts = {};
  for (const [k, p] of Object.entries(chart.pillars)) {
    if (!p) continue;
    if (k !== 'day') counts[tenGod(dm, p.stem)] = (counts[tenGod(dm, p.stem)] || 0) + 1;
    const main = BRANCHES[p.branch].hidden[0];
    counts[tenGod(dm, main)] = (counts[tenGod(dm, main)] || 0) + 1;
  }
  const groupCount = GROUPS.map((g) => ({ ...g, n: g.gods.reduce((s, x) => s + (counts[x] || 0), 0) }));
  const topGod = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  const many = groupCount.filter((g) => g.n >= 3);
  const none = groupCount.filter((g) => g.n === 0);
  sections.push({ title: t('Your Ten Gods profile'), html: `
    <p>${t('Counting the stems and main hidden stems, your most prominent star is <b>{god}</b>.', { god: `${TEN_GODS[topGod].name} ${TEN_GODS[topGod].zh}` })} ${GOD_TEXT[topGod].trait}</p>
    <table>${groupCount.map((g) => `<tr><td>${g.name} <span class="muted">${g.zh}</span></td><td>${'●'.repeat(g.n) || '–'}</td></tr>`).join('')}</table>
    ${many.map((g) => `<p>${g.many}</p>`).join('')}${none.map((g) => `<p>${g.none}</p>`).join('')}` });

  // 5. Career (month stem) & relationships (day branch = spouse palace)
  const mGod = tenGod(dm, chart.pillars.month.stem);
  const sGod = tenGod(dm, BRANCHES[chart.pillars.day.branch].hidden[0]);
  const db = chart.pillars.day.branch;
  const spouseClash = chart.interactions.find((x) => x.type === 'Clash' && x.where.includes('Day'));
  sections.push({ title: t('Career & relationships'), html: `
    <h4>${t('Career – month stem: {god}', { god: TEN_GODS[mGod].name })}</h4><p>${GOD_TEXT[mGod].career}</p>
    <h4>${t('Relationships – spouse palace {b}: {god}', { b: `${BRANCHES[db].zh} ${BRANCHES[db].animal}`, god: TEN_GODS[sGod].name })}</h4><p>${GOD_TEXT[sGod].spouse}</p>
    ${spouseClash ? `<p>${t('Your day branch is involved in a clash ({chars}). Classically this points to an active, changeable love life or a partner who travels or moves a lot – commitment grows through flexibility.', { chars: spouseClash.chars })}</p>` : ''}` });

  // 6. Current luck pillar & year
  const now = new Date().getFullYear();
  const cur = [...chart.luck.pillars].reverse().find((p) => p.year <= now);
  const yearP = pillarFromIndex(now - 4);
  const yGod = tenGod(dm, yearP.stem);
  const yearLine = t('<b>{y}</b> ({p}) is a <b>{god}</b> year for you:', { y: now, p: `${STEMS[yearP.stem].zh}${BRANCHES[yearP.branch].zh}`, god: TEN_GODS[yGod].name });
  if (cur) {
    const lGod = tenGod(dm, cur.stem);
    const brEl = BRANCHES[cur.branch].el;
    const good = favourable.map((x) => mod(x, 5)).includes(brEl);
    sections.push({ title: t('Your current phase'), html: `
      <p>${t('Since {y} you are in the luck pillar <b>{p}</b> ({god}).', { y: cur.year, p: `${STEMS[cur.stem].zh}${BRANCHES[cur.branch].zh}`, god: TEN_GODS[lGod].name })} ${GOD_TEXT[lGod].luck}</p>
      <p>${good ? t('Its branch brings {el}, which is <b>favourable</b> for your chart – a supportive background for this decade.', { el: el(brEl).name })
        : t('Its branch brings {el}, which is not among your favourable elements – plan carefully and use your strengths.', { el: el(brEl).name })}</p>
      <p>${yearLine} ${GOD_TEXT[yGod].luck}</p>` });
  } else {
    sections.push({ title: t('Your current phase'), html: `<p>${t('Your first luck pillar has not started yet.')} ${yearLine} ${GOD_TEXT[yGod].luck}</p>` });
  }

  // 6b. Symbolic stars
  const stars = findStars(chart);
  sections.splice(sections.length - 1, 0, { title: t('Symbolic stars'), html: stars.length ? `
    <ul class="weak-list">${stars.map((st) => `<li><b>${st.icon} ${st.name} ${st.zh}</b> ${t('in the {where}.', { where: pillarListText(st.pillars) })} ${st.desc}
      <br><span class="small">${t('Here it points to {what}.', { what: st.pillars.map((p) => st.pillar[p]).join('; ') })}</span></li>`).join('')}</ul>`
    : `<p>${t('None of the main symbolic stars appear in your natal chart – your reading rests fully on the elements and Ten Gods. Stars can still be activated by years and luck pillars.')}</p>` });

  // 7. Weak spots & balancing
  const items = [];
  const weakest = [...chart.elements].sort((a, b) => a.pct - b.pct)[0];
  const lackEls = chart.elements.filter((e) => e.pct === 0).length ? chart.elements.filter((e) => e.pct === 0) : (weakest.pct < 10 ? [weakest] : []);
  for (const e of lackEls) {
    const isFav = favourable.includes(e.el);
    items.push(`<li><b>${t(e.pct === 0 ? 'Missing {el} ({pct}%).' : 'Weak {el} ({pct}%).', { el: el(e.el).name, pct: e.pct })}</b> ${LACK[e.el].look}
      ${isFav ? `<br><i>${t('How to balance:')}</i> ${LACK[e.el].fix}` : `<br><i>${t('Note:')}</i> ${t('{el} is not among your favourable elements, so you don’t need to add a lot of it – just be aware of this blind spot.', { el: el(e.el).name })}`}</li>`);
  }
  if (sorted[0].pct >= 35) {
    const x = sorted[0].el, drain = mod(x + 1, 5), ctrl = mod(x + 3, 5);
    items.push(`<li><b>${t('Excess {el} ({pct}%).', { el: el(x).name, pct: sorted[0].pct })}</b> ${t('In daily life, {what}.', { what: EXCESS[x] })}
      <br><i>${t('How to balance:')}</i> ${t('let it flow out through <b>{a}</b> ({aa}) or bring structure with <b>{b}</b> ({bb}).', { a: el(drain).name, aa: ELEMENT_ADVICE[drain].activities, b: el(ctrl).name, bb: ELEMENT_ADVICE[ctrl].activities })}</li>`);
  }
  if (strong) items.push(`<li>${t('<b>Strong Day Master.</b> Look out for stubbornness and wanting to do everything yourself. <i>Balance:</i> channel energy into output – projects, work, teaching – and accept being challenged.')}</li>`);
  else items.push(`<li>${t('<b>Weaker Day Master.</b> Look out for over-extending yourself and taking on others’ burdens. <i>Balance:</i> rest, learning and supportive people come first; say no more often and build up step by step.')}</li>`);
  for (const g of none) items.push(`<li>${g.none.replace(/^([^:]+):/, '<b>$1.</b>')}</li>`);
  for (const x of chart.interactions.filter((i) => i.type === 'Clash')) {
    const [p1, p2] = x.where.split(' & ').map((w) => w.toLowerCase());
    items.push(`<li>${t('<b>Clash {chars}</b> between {a} and {b}: these areas can pull in different directions. <i>Balance:</i> plan consciously for both and expect change rather than fighting it.', { chars: x.chars, a: PILLAR_AREA[p1], b: PILLAR_AREA[p2] })}</li>`);
  }
  sections.splice(sections.length - 1, 0, { title: t('Weak spots & how to balance them'), html: `
    <p>${t('Every chart has imbalances – they are where growth happens. Based on your chart, watch out for:')}</p>
    <ul class="weak-list">${items.join('')}</ul>
    <p>${t('<b>In relationships</b>, people whose charts are rich in {els} tend to balance you – see <i>Your ideal match</i> on the compatibility page.', { els: favourable.map((x) => el(x).name).join(t(' and ')) })}</p>` });

  sections.push({ title: t('A note'), html: `<p class="small muted">${t('This reading describes traditional BaZi tendencies to inspire reflection. It is not a prediction and no substitute for professional advice. Your choices shape your life.')}</p>` });
  return { sections };
}
