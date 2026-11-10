// Course content. Widgets: <div data-widget="..."></div> are rendered by app.js.
export const LESSONS = [
  {
    id: 'intro', title: 'What is BaZi?', zh: '八字', level: 'Basics',
    summary: 'The “Eight Characters” – a map of the energies at the moment of birth.',
    body: `
<p><b>BaZi</b> (八字, “eight characters”) – also called the <b>Four Pillars of Destiny</b> (四柱命理) – is a classical Chinese system that describes a person through the time of their birth.</p>
<p>The year, month, day and hour of birth are each written as a pair of characters: one <b>Heavenly Stem</b> (天干) on top and one <b>Earthly Branch</b> (地支) below. Four pillars × two characters = <b>eight characters</b>.</p>
<div data-widget="sample-chart"></div>
<p>Each character carries one of the <b>Five Elements</b> and a <b>Yin</b> or <b>Yang</b> polarity. Reading a chart means looking at how these energies support, control and balance each other.</p>
<h3>What each pillar represents</h3>
<ul>
<li><b>Year</b> – ancestry, society, early childhood (approx. age 1–16)</li>
<li><b>Month</b> – parents, career environment, youth (17–32)</li>
<li><b>Day</b> – yourself (the stem) and your partner (the branch) (33–48)</li>
<li><b>Hour</b> – children, ideas, later life (49+)</li>
</ul>
<p class="note">BaZi is a traditional cultural system. This app teaches it for learning and self-reflection – not as a basis for medical, financial or legal decisions.</p>`,
    quiz: [
      { q: 'How many characters does a full BaZi chart contain?', options: ['Four', 'Eight', 'Twelve', 'Ten'], answer: 1,
        explain: 'Four pillars, each with a stem and a branch = 8 characters.' },
      { q: 'Which pillar represents you most directly?', options: ['Year', 'Month', 'Day', 'Hour'], answer: 2,
        explain: 'The Day Stem is the “Day Master” – the self.' },
    ],
  },
  {
    id: 'yinyang', title: 'Yin and Yang', zh: '阴阳', level: 'Basics',
    summary: 'The two complementary forces behind every character.',
    body: `
<p>Every phenomenon contains two complementary aspects: <b>Yang</b> (阳) – active, bright, expanding, outward – and <b>Yin</b> (阴) – receptive, dark, contracting, inward.</p>
<p>Neither is “good” or “bad”. They depend on each other and constantly transform into each other: midday (peak Yang) turns into night; midwinter (peak Yin) turns into spring.</p>
<h3>In BaZi</h3>
<p>Each of the five elements appears twice among the ten Heavenly Stems: once Yang and once Yin. Yang Wood 甲 is a tall tree; Yin Wood 乙 is a flowering vine. Same element, very different expression.</p>
<p>Polarity matters when deriving the <b>Ten Gods</b>: whether two stems share the same polarity decides, for example, if an element is “Direct Wealth” or “Indirect Wealth”.</p>
<p class="tip">Rule of thumb: in the sequence of stems and branches, odd positions (1st, 3rd, …) are Yang, even positions are Yin.</p>`,
    quiz: [
      { q: 'Which quality belongs to Yang?', options: ['Receptive', 'Contracting', 'Active', 'Dark'], answer: 2, explain: 'Yang is active, bright and expanding.' },
      { q: '乙 Yi is the …', options: ['Yang Wood', 'Yin Wood', 'Yin Fire', 'Yang Metal'], answer: 1, explain: '甲 is Yang Wood, 乙 is Yin Wood.' },
    ],
  },
  {
    id: 'elements', title: 'The Five Elements', zh: '五行', level: 'Basics',
    summary: 'Wood, Fire, Earth, Metal, Water – and how they produce and control each other.',
    body: `
<p>The <b>Five Elements</b> (Wu Xing, 五行, literally “five movements”) are phases of energy rather than physical substances.</p>
<div data-widget="elements"></div>
<h3>The producing cycle (生)</h3>
<p>Wood feeds <b>Fire</b> → Fire creates ash, <b>Earth</b> → Earth bears <b>Metal</b> → Metal carries <b>Water</b> (condensation) → Water nourishes <b>Wood</b>.</p>
<h3>The controlling cycle (克)</h3>
<p>Wood breaks <b>Earth</b> (roots) → Earth dams <b>Water</b> → Water extinguishes <b>Fire</b> → Fire melts <b>Metal</b> → Metal cuts <b>Wood</b>.</p>
<div data-widget="cycle"></div>
<h3>Weakening</h3>
<p>Producing costs energy: the “mother” element is drained by the “child”. Controlling also costs energy – a too-weak controller is exhausted by a strong target (“weak water cannot put out a forest fire”).</p>
<p class="tip">Almost everything in BaZi analysis comes back to these two cycles. Learn them by heart!</p>`,
    quiz: [
      { q: 'Which element does Water produce?', options: ['Fire', 'Wood', 'Metal', 'Earth'], answer: 1, explain: 'Water nourishes Wood.' },
      { q: 'Which element controls Metal?', options: ['Fire', 'Water', 'Wood', 'Earth'], answer: 0, explain: 'Fire melts Metal.' },
      { q: 'Earth controls …', options: ['Wood', 'Metal', 'Water', 'Fire'], answer: 2, explain: 'Earth dams Water.' },
    ],
  },
  {
    id: 'stems', title: 'The Ten Heavenly Stems', zh: '天干', level: 'Basics',
    summary: 'Ten characters: each element in its Yang and Yin form.',
    body: `
<p>The <b>Heavenly Stems</b> are the “heavenly”, visible energies of a chart – they sit on top of each pillar. Each stem is pictured with an image from nature.</p>
<div data-widget="stems"></div>
<p>Tap a stem to read its personality. When you meet someone, their <b>Day Stem</b> gives a first impression of their core nature.</p>
<h3>Stem combinations (天干五合)</h3>
<p>Stems five positions apart “combine” – they are attracted to each other and may transform under the right conditions:</p>
<ul><li>甲 + 己 → Earth</li><li>乙 + 庚 → Metal</li><li>丙 + 辛 → Water</li><li>丁 + 壬 → Wood</li><li>戊 + 癸 → Fire</li></ul>`,
    quiz: [
      { q: 'Which stem is pictured as the sun?', options: ['丁 Ding', '丙 Bing', '戊 Wu', '庚 Geng'], answer: 1, explain: '丙 is Yang Fire – the sun. 丁 is the candle.' },
      { q: 'What is the element of 壬 Ren?', options: ['Metal', 'Earth', 'Water', 'Wood'], answer: 2, explain: '壬 is Yang Water – the ocean.' },
      { q: '甲 combines with …', options: ['乙', '庚', '己', '戊'], answer: 2, explain: '甲 + 己 combine (→ Earth).' },
    ],
  },
  {
    id: 'branches', title: 'The Twelve Earthly Branches', zh: '地支', level: 'Basics',
    summary: 'The twelve animals – months, hours and the roots of a chart.',
    body: `
<p>The <b>Earthly Branches</b> sit at the bottom of each pillar. They are linked to the twelve zodiac animals, to the twelve two-hour periods of the day and to the twelve solar months.</p>
<div data-widget="branches"></div>
<p>Branches are more complex than stems: each one contains one to three <b>hidden stems</b> (see the Hidden Stems lesson). They are the “roots” that support or weaken the stems above.</p>
<h3>Seasons</h3>
<ul>
<li>Spring (Wood): 寅 Tiger, 卯 Rabbit, (辰 Dragon)</li>
<li>Summer (Fire): 巳 Snake, 午 Horse, (未 Goat)</li>
<li>Autumn (Metal): 申 Monkey, 酉 Rooster, (戌 Dog)</li>
<li>Winter (Water): 亥 Pig, 子 Rat, (丑 Ox)</li>
</ul>
<p>The four Earth branches 辰 戌 丑 未 close each season – they are “storage” branches.</p>`,
    quiz: [
      { q: 'Which animal is 午 Wu?', options: ['Rat', 'Horse', 'Goat', 'Dog'], answer: 1, explain: '午 is the Horse – Yang Fire, 11:00–13:00.' },
      { q: 'Which branch rules the hour 23:00–01:00?', options: ['亥 Pig', '丑 Ox', '子 Rat', '寅 Tiger'], answer: 2, explain: 'The Rat hour 子 starts at 23:00.' },
      { q: 'Which of these is an Earth branch?', options: ['酉', '辰', '卯', '亥'], answer: 1, explain: '辰 Dragon is Earth (as are 戌, 丑 and 未).' },
    ],
  },
  {
    id: 'jiazi', title: 'The 60 Jiazi Cycle', zh: '六十甲子', level: 'Calendar',
    summary: 'Pairing ten stems with twelve branches gives 60 combinations.',
    body: `
<p>Stems and branches advance together: 甲子, 乙丑, 丙寅 … Because 10 and 12 have a common factor, only Yang stems pair with Yang branches and Yin with Yin – giving <b>60</b> (not 120) combinations. This is the <b>sexagenary cycle</b>, named after its first pair 甲子 Jia Zi.</p>
<div data-widget="jiazi"></div>
<p>The same cycle counts years, months, days and hours. 1984 was 甲子; 2044 will be again. Days have run through this cycle uninterrupted for over 2,700 years.</p>
<p class="tip">The cycle is why your “Chinese zodiac animal” repeats every 12 years, but your complete year pillar only every 60 years.</p>`,
    quiz: [
      { q: 'How many pillars does the full cycle have?', options: ['12', '60', '120', '10'], answer: 1, explain: '60 – Yang stems only pair with Yang branches.' },
      { q: 'Which pair follows 甲子?', options: ['乙子', '甲丑', '乙丑', '丙寅'], answer: 2, explain: 'Both advance one step: 乙丑.' },
    ],
  },
  {
    id: 'pillars', title: 'Building the Four Pillars', zh: '排四柱', level: 'Calendar',
    summary: 'Why BaZi uses the solar calendar and how each pillar is found.',
    body: `
<p>BaZi uses the <b>solar</b> calendar (节气, solar terms), <i>not</i> the lunar new year.</p>
<h3>Year pillar</h3>
<p>The year begins at <b>Li Chun</b> 立春 (Start of Spring, around 4 February), when the sun reaches 315° ecliptic longitude. Someone born on 20 January 2024 belongs to the 癸卯 year (2023), not 甲辰.</p>
<h3>Month pillar</h3>
<p>Months begin at the twelve <b>Jie</b> terms (节), roughly on the 4th–8th of each Gregorian month. The first month is always the Tiger 寅 month. Its stem follows from the year stem (“Five Tigers” rule):</p>
<ul><li>甲/己 year → 丙寅</li><li>乙/庚 year → 戊寅</li><li>丙/辛 year → 庚寅</li><li>丁/壬 year → 壬寅</li><li>戊/癸 year → 甲寅</li></ul>
<div data-widget="jie"></div>
<h3>Day pillar</h3>
<p>Taken directly from the continuous 60-day cycle. Many schools start the new day at 23:00 (the start of the Rat hour) – this app does so by default.</p>
<h3>Hour pillar</h3>
<p>The branch comes from the two-hour period; the stem follows from the day stem (“Five Rats” rule): 甲/己 day → 甲子 hour, 乙/庚 → 丙子, 丙/辛 → 戊子, 丁/壬 → 庚子, 戊/癸 → 壬子.</p>
<h3>True solar time</h3>
<p>Traditionally the hour is based on the sun’s position at the birthplace. Enter the birthplace longitude in the calculator to apply this correction – it can shift the hour pillar if you were born near a boundary.</p>`,
    quiz: [
      { q: 'When does the BaZi year begin?', options: ['1 January', 'Chinese New Year', 'Li Chun (~4 Feb)', 'Winter solstice'], answer: 2, explain: 'The solar year begins at Li Chun.' },
      { q: 'The first month of the BaZi year is always the …', options: ['Rat 子 month', 'Tiger 寅 month', 'Rabbit 卯 month', 'Ox 丑 month'], answer: 1, explain: 'Li Chun starts the Tiger month.' },
      { q: 'In a 甲 year, the Tiger month is …', options: ['甲寅', '丙寅', '戊寅', '壬寅'], answer: 1, explain: '甲/己 years start with 丙寅.' },
    ],
  },
  {
    id: 'hidden', title: 'Hidden Stems', zh: '藏干', level: 'Core',
    summary: 'The stems concealed inside each branch.',
    body: `
<p>Each Earthly Branch contains one to three <b>hidden stems</b> (藏干). The first is the <b>main qi</b> (本气), followed by middle and residual qi.</p>
<div data-widget="hidden"></div>
<p>Hidden stems explain why a branch can support a stem of a different element. For example, 寅 Tiger holds 甲 Wood, 丙 Fire and 戊 Earth – so a 丙 Fire Day Master has a root in 寅.</p>
<h3>Roots</h3>
<p>A stem that finds its own element in a branch below (or elsewhere in the chart) is <b>rooted</b> (通根) and much stronger than a “floating” stem without roots.</p>
<p class="tip">The pure branches 子 卯 午 酉 (the cardinal points) contain mainly one element; the Earth branches 辰 戌 丑 未 hold three – they are the “storages” of the seasons.</p>`,
    quiz: [
      { q: 'What is the main hidden stem of 亥 Pig?', options: ['甲', '壬', '癸', '戊'], answer: 1, explain: '亥 holds 壬 (main) and 甲.' },
      { q: 'Which branch holds 戊 乙 癸?', options: ['辰', '戌', '丑', '未'], answer: 0, explain: '辰 Dragon is the Water storage: 戊 乙 癸.' },
    ],
  },
  {
    id: 'daymaster', title: 'The Day Master', zh: '日主', level: 'Core',
    summary: 'The stem of your day pillar – the centre of every analysis.',
    body: `
<p>The Heavenly Stem of the day pillar is the <b>Day Master</b> (日主 or 日元). It stands for <b>you</b>. All other characters are interpreted in relation to it.</p>
<p>Ask three questions:</p>
<ol>
<li><b>Who am I?</b> – Read the nature of your Day Master stem (Heavenly Stems lesson).</li>
<li><b>When was I born?</b> – Is my element in season? (Strength lesson)</li>
<li><b>What surrounds me?</b> – Which elements support me, and which do I produce, control, or get controlled by? (Ten Gods lesson)</li>
</ol>
<p>A 甲 Wood Day Master born in spring is a tree in full growth; born in autumn, it faces sharp Metal axes – the same stem, a very different story.</p>
<p class="tip">Calculate your own chart in the <b>Chart</b> tab and tap your Day Master to read about it.</p>`,
    quiz: [
      { q: 'The Day Master is …', options: ['The year branch', 'The day stem', 'The month stem', 'The hour branch'], answer: 1, explain: 'The stem of the day pillar.' },
    ],
  },
  {
    id: 'tengods', title: 'The Ten Gods', zh: '十神', level: 'Core',
    summary: 'Relationships between the Day Master and every other character.',
    body: `
<p>The <b>Ten Gods</b> (十神) translate the five elements into life themes. Each one is defined by its element relation to the Day Master and by polarity (same or opposite):</p>
<div data-widget="tengods"></div>
<h3>Five groups</h3>
<ul>
<li><b>Companions</b> (same element) – Friend, Rob Wealth: self, peers</li>
<li><b>Output</b> (I produce) – Eating God, Hurting Officer: expression, talent</li>
<li><b>Wealth</b> (I control) – Direct & Indirect Wealth: money, resources</li>
<li><b>Power</b> (controls me) – Direct Officer, Seven Killings: career, discipline</li>
<li><b>Resource</b> (produces me) – Direct & Indirect Resource: knowledge, support</li>
</ul>
<div data-widget="tengod-trainer"></div>`,
    quiz: [
      { q: 'For a 甲 Day Master, what is 丙?', options: ['Hurting Officer', 'Eating God', 'Direct Wealth', 'Friend'], answer: 1, explain: 'Wood produces Fire, both Yang → Eating God.' },
      { q: 'For a 庚 Day Master, what is 丁?', options: ['Seven Killings', 'Direct Officer', 'Direct Resource', 'Rob Wealth'], answer: 1, explain: 'Fire controls Metal, opposite polarity → Direct Officer.' },
      { q: 'The Resource star is the element that …', options: ['I control', 'controls me', 'produces me', 'I produce'], answer: 2, explain: 'Resource (印) produces the Day Master.' },
    ],
  },
  {
    id: 'strength', title: 'Strength and Seasons', zh: '旺相休囚死', level: 'Analysis',
    summary: 'Is the Day Master strong or weak?',
    body: `
<p>The single most important factor for strength is the <b>month branch</b> – the season of birth (月令). An element can be in one of five states:</p>
<div data-widget="phases"></div>
<h3>Assessing strength</h3>
<ol>
<li><b>Season:</b> is the month branch supporting the Day Master?</li>
<li><b>Roots:</b> does the Day Master’s element appear in hidden stems?</li>
<li><b>Support:</b> how many Companion and Resource stems are there?</li>
</ol>
<p>Supporting elements = same element + Resource. Weakening = Output, Wealth and Power.</p>
<p>The chart calculator shows a <i>rough</i> score. Experienced readers also weigh combinations, clashes and special structures (从格) – no number replaces judgement.</p>`,
    quiz: [
      { q: 'A Fire Day Master born in summer is …', options: ['Prosperous 旺', 'Dead 死', 'Trapped 囚', 'Resting 休'], answer: 0, explain: 'Fire in the Fire season is at its peak.' },
      { q: 'A Wood Day Master born in winter (Water) is …', options: ['Resting', 'Strong 相', 'Dead', 'Trapped'], answer: 1, explain: 'Water produces Wood → 相 Strong.' },
      { q: 'Which factor matters most for strength?', options: ['Hour branch', 'Year stem', 'Month branch', 'Gender'], answer: 2, explain: 'The month branch – the season.' },
    ],
  },
  {
    id: 'interactions', title: 'Branch Interactions', zh: '刑冲合害', level: 'Analysis',
    summary: 'Clashes, combinations, punishments and harms.',
    body: `
<p>Branches interact with each other. The most important interactions:</p>
<h3>Six Clashes 六冲 – opposites on the zodiac wheel</h3>
<p>子午 · 丑未 · 寅申 · 卯酉 · 辰戌 · 巳亥 – movement, change, conflict. A clash with the day branch can affect the relationship palace.</p>
<h3>Six Harmonies 六合</h3>
<p>子丑 · 寅亥 · 卯戌 · 辰酉 · 巳申 · 午未 – bonds, attraction, cooperation.</p>
<h3>Three Harmonies 三合</h3>
<p>申子辰 Water · 亥卯未 Wood · 寅午戌 Fire · 巳酉丑 Metal – a powerful frame that strengthens one element. Two of three including the centre (子 卯 午 酉) form a half combination.</p>
<h3>Directional combinations 三会</h3>
<p>The three branches of one season: 寅卯辰 Wood, 巳午未 Fire, 申酉戌 Metal, 亥子丑 Water.</p>
<h3>Punishments 刑 and Harms 害</h3>
<p>寅巳申 and 丑戌未 are the classic three punishments; 子卯 is the “uncivil” punishment. Harms (子未, 丑午, 寅巳, 卯辰, 申亥, 酉戌) indicate hidden friction.</p>
<div data-widget="wheel"></div>`,
    quiz: [
      { q: 'Which branch clashes with 子 Rat?', options: ['丑 Ox', '午 Horse', '卯 Rabbit', '酉 Rooster'], answer: 1, explain: 'Opposites: 子午 clash.' },
      { q: '申子辰 forms a … frame', options: ['Fire', 'Metal', 'Water', 'Wood'], answer: 2, explain: 'Monkey–Rat–Dragon = Water.' },
      { q: 'Which pair is a Six Harmony?', options: ['寅亥', '寅申', '卯酉', '巳亥'], answer: 0, explain: '寅亥 combine; the others are clashes.' },
    ],
  },
  {
    id: 'luck', title: 'Luck Pillars', zh: '大运', level: 'Analysis',
    summary: 'Ten-year phases that colour your life.',
    body: `
<p>Beyond the natal chart, BaZi uses <b>Luck Pillars</b> (大运 Da Yun): each lasts ten years and adds a new stem and branch to the chart.</p>
<h3>Direction</h3>
<ul><li>Yang year + male, or Yin year + female → luck pillars go <b>forward</b> from the month pillar.</li>
<li>Yin year + male, or Yang year + female → they go <b>backward</b>.</li></ul>
<h3>Starting age</h3>
<p>Count the days from birth to the next (forward) or previous (backward) Jie term. <b>Three days = one year</b> of life. 15 days → the first luck pillar begins at age 5.</p>
<p>In addition, each year has its own <b>annual pillar</b> (流年). The interplay of natal chart, luck pillar and year pillar is used to discuss timing.</p>
<p class="tip">Your luck pillars appear at the bottom of your calculated chart.</p>`,
    quiz: [
      { q: 'How long is one Luck Pillar?', options: ['1 year', '5 years', '10 years', '12 years'], answer: 2, explain: 'Each luck pillar covers ten years.' },
      { q: 'A man born in a Yang year: luck pillars go …', options: ['Forward', 'Backward', 'Depends on the hour', 'Both'], answer: 0, explain: 'Yang year + male → forward.' },
      { q: 'How many days correspond to one year of starting age?', options: ['1', '3', '10', '30'], answer: 1, explain: 'Three days = one year.' },
    ],
  },
  {
    id: 'useful', title: 'Useful God & Balance', zh: '用神', level: 'Analysis',
    summary: 'Which element brings a chart into balance?',
    body: `
<p>The <b>Useful God</b> (用神) is the element that best balances a chart. The classic approach is 扶抑 (support or restrain):</p>
<ul>
<li><b>Strong Day Master</b> → favours Output, Wealth and Power (to drain and use the excess).</li>
<li><b>Weak Day Master</b> → favours Resource and Companions (to support).</li>
</ul>
<p>A second approach is 调候 (climate adjustment): a chart born in deep winter needs Fire for warmth; a summer chart needs Water to cool it.</p>
<p>Special charts in which one element dominates completely may instead “follow” that element (从格).</p>
<h3>Practising responsibly</h3>
<p>BaZi describes tendencies, not fixed fate. Good practitioners use it to encourage reflection – never to frighten people or make decisions for them.</p>
<p class="tip">Next step: calculate charts of people you know well and compare what you see with what you know. Then test yourself in the Quiz tab!</p>`,
    quiz: [
      { q: 'A very weak Day Master usually benefits from …', options: ['Wealth', 'Power', 'Resource', 'Output'], answer: 2, explain: 'Resource supports and strengthens the Day Master.' },
      { q: '调候 refers to …', options: ['Climate adjustment', 'Stem combination', 'Luck pillars', 'Hidden stems'], answer: 0, explain: 'Balancing heat/cold and dry/wet.' },
    ],
  },
];
