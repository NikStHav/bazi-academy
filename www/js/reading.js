// Detailed chart reading (Premium). Builds an interpretation from a computed chart.
import { STEMS, BRANCHES, ELEMENTS, TEN_GODS } from './data.js';
import { tenGod, pillarFromIndex } from './bazi.js';

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
const GOD_TEXT = {
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

/** Returns { sections: [{ title, html }] } */
export function buildReading(chart) {
  const dm = chart.dayMaster;
  const dmS = STEMS[dm];
  const dmEl = dmS.el;
  const el = (i) => ELEMENTS[mod(i, 5)];
  const sections = [];

  // 1. Core nature & season
  const phase = chart.strength.phase;
  const monthEl = BRANCHES[chart.pillars.month.branch].el;
  sections.push({ title: 'Your core nature', html: `
    <p>Your Day Master is <b>${dmS.zh} ${dmS.py}</b>. ${dmS.desc}</p>
    <p>You were born in a ${el(monthEl).name} month (${BRANCHES[chart.pillars.month.branch].zh} ${BRANCHES[chart.pillars.month.branch].animal}), so your element is <b>${phase.name.toLowerCase()} (${phase.zh})</b>. ${phase.desc}
    ${{ prosperous: ' Your natural qualities show strongly and early in life.', strong: ' You are well nourished by your environment and gain confidence with support.',
      resting: ' You tend to give a lot of energy to others and need to recharge consciously.', trapped: ' Life asks you to work hard for results; your efforts pay off over time.',
      dead: ' You are shaped strongly by outside forces and grow stronger through the right support and timing.' }[phase.key]}</p>` });

  // 2. Strength & useful elements
  const strong = chart.strength.ratio >= 45;
  const favourable = strong ? [dmEl + 1, dmEl + 2, dmEl + 3] : [dmEl - 1, dmEl];
  const unfavourable = strong ? [dmEl - 1, dmEl] : [dmEl + 2, dmEl + 3];
  const fav = favourable.map((x) => el(x));
  const mainFav = mod(favourable[0], 5);
  sections.push({ title: 'Balance & favourable elements', html: `
    <p>Your Day Master is <b>${chart.strength.label.toLowerCase()}</b> (support ≈ ${chart.strength.ratio}%). ${strong
      ? 'A strong Day Master has energy to spare and benefits from elements that <b>use</b> that energy: what it produces, controls, or is controlled by.'
      : 'A weaker Day Master benefits from elements that <b>support</b> it: the element that produces it and its own element.'}</p>
    <p><b>Favourable:</b> ${fav.map((e) => `<span class="tx-${ELEMENTS.indexOf(e)}">${e.zh} ${e.name}</span>`).join(', ')} ·
       <b>Less favourable:</b> ${unfavourable.map((x) => el(x).name).join(', ')}</p>
    <p>In traditional practice, people strengthen their main favourable element <b>${el(mainFav).name}</b> through:</p>
    <ul><li><b>Colours:</b> ${ELEMENT_ADVICE[mainFav].colors}</li><li><b>Direction:</b> ${el(mainFav).direction}</li>
      <li><b>Activities:</b> ${ELEMENT_ADVICE[mainFav].activities}</li><li><b>Fields of work:</b> ${ELEMENT_ADVICE[mainFav].careers}</li></ul>
    <p class="small muted">A full useful-god (用神) analysis also weighs climate, combinations and special structures; treat this as a first orientation.</p>` });

  // 3. Element balance highlights
  const sorted = [...chart.elements].sort((a, b) => b.pct - a.pct);
  const missing = chart.elements.filter((e) => e.pct === 0);
  const weakEls = chart.elements.filter((e) => e.pct > 0 && e.pct < 8);
  sections.push({ title: 'Your Five Elements', html: `
    <p>Strongest element: <b class="tx-${sorted[0].el}">${el(sorted[0].el).name} (${sorted[0].pct}%)</b> – ${el(sorted[0].el).traits.toLowerCase()}
      ${sorted[0].pct >= 35 ? ' It is very dominant, so its qualities – and their excesses – colour your whole chart.' : ''}</p>
    ${missing.length ? `<p>Missing: <b>${missing.map((e) => el(e.el).name).join(', ')}</b>. Missing elements often show up as themes you meet through other people, places or later in life – and luck pillars can supply them.</p>` : '<p>All five elements are present in your chart – a sign of versatility.</p>'}
    ${weakEls.length ? `<p>Weak: ${weakEls.map((e) => el(e.el).name).join(', ')}.</p>` : ''}` });

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
  sections.push({ title: 'Your Ten Gods profile', html: `
    <p>Counting the stems and main hidden stems, your most prominent star is <b>${TEN_GODS[topGod].name} ${TEN_GODS[topGod].zh}</b>. ${GOD_TEXT[topGod].trait}</p>
    <table>${groupCount.map((g) => `<tr><td>${g.name} <span class="muted">${g.zh}</span></td><td>${'●'.repeat(g.n) || '–'}</td></tr>`).join('')}</table>
    ${many.map((g) => `<p>${g.many}</p>`).join('')}${none.map((g) => `<p>${g.none}</p>`).join('')}` });

  // 5. Career (month stem) & relationships (day branch = spouse palace)
  const mGod = tenGod(dm, chart.pillars.month.stem);
  const sGod = tenGod(dm, BRANCHES[chart.pillars.day.branch].hidden[0]);
  const db = chart.pillars.day.branch;
  const spouseClash = chart.interactions.find((x) => x.type === 'Clash' && x.where.includes('Day'));
  sections.push({ title: 'Career & relationships', html: `
    <h4>Career – month stem: ${TEN_GODS[mGod].name}</h4><p>${GOD_TEXT[mGod].career}</p>
    <h4>Relationships – spouse palace ${BRANCHES[db].zh} ${BRANCHES[db].animal}: ${TEN_GODS[sGod].name}</h4><p>${GOD_TEXT[sGod].spouse}</p>
    ${spouseClash ? `<p>Your day branch is involved in a clash (${spouseClash.chars}). Classically this points to an active, changeable love life or a partner who travels or moves a lot – commitment grows through flexibility.</p>` : ''}` });

  // 6. Current luck pillar & year
  const now = new Date().getFullYear();
  const cur = [...chart.luck.pillars].reverse().find((p) => p.year <= now);
  const yearP = pillarFromIndex(now - 4);
  const yGod = tenGod(dm, yearP.stem);
  if (cur) {
    const lGod = tenGod(dm, cur.stem);
    const brEl = BRANCHES[cur.branch].el;
    const good = favourable.map((x) => mod(x, 5)).includes(brEl);
    sections.push({ title: 'Your current phase', html: `
      <p>Since ${cur.year} you are in the luck pillar <b>${STEMS[cur.stem].zh}${BRANCHES[cur.branch].zh}</b> (${TEN_GODS[lGod].name}). ${GOD_TEXT[lGod].luck}</p>
      <p>Its branch brings ${el(brEl).name}, which is ${good ? '<b>favourable</b> for your chart – a supportive background for this decade.' : 'not among your favourable elements – plan carefully and use your strengths.'}</p>
      <p><b>${now}</b> (${STEMS[yearP.stem].zh}${BRANCHES[yearP.branch].zh}) is a <b>${TEN_GODS[yGod].name}</b> year for you: ${GOD_TEXT[yGod].luck.charAt(0).toLowerCase() + GOD_TEXT[yGod].luck.slice(1)}</p>` });
  } else {
    sections.push({ title: 'Your current phase', html: `<p>Your first luck pillar has not started yet. <b>${now}</b> is a <b>${TEN_GODS[yGod].name}</b> year for you.</p>` });
  }

  sections.push({ title: 'A note', html: '<p class="small muted">This reading describes traditional BaZi tendencies to inspire reflection. It is not a prediction and no substitute for professional advice. Your choices shape your life.</p>' });
  return { sections };
}
