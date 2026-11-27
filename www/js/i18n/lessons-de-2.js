// Lektionen 8–15 (Deutsch)
export const LESSONS_2 = [
  {
    id: 'hidden', title: 'Verborgene Stämme', zh: '藏干', level: 'Core',
    summary: 'Die Stämme, die in jedem Zweig verborgen sind.',
    body: `
<p>Jeder Erdzweig enthält ein bis drei <b>verborgene Stämme</b> (藏干). Der erste ist das <b>Haupt-Qi</b> (本气), danach folgen mittleres und Rest-Qi.</p>
<div data-widget="hidden"></div>
<p>Verborgene Stämme erklären, warum ein Zweig einen Stamm eines anderen Elements stützen kann. So enthält 寅 Tiger 甲 Holz, 丙 Feuer und 戊 Erde – ein 丙-Feuer-Tagesmeister hat also eine Wurzel in 寅.</p>
<h3>Wurzeln</h3>
<p>Ein Stamm, der sein eigenes Element in einem Zweig darunter (oder an anderer Stelle im Horoskop) findet, ist <b>verwurzelt</b> (通根) und viel stärker als ein „schwebender“ Stamm ohne Wurzeln.</p>
<p class="tip">Die reinen Zweige 子 卯 午 酉 (die Himmelsrichtungen) enthalten vor allem ein Element; die Erde-Zweige 辰 戌 丑 未 enthalten drei – sie sind die „Speicher“ der Jahreszeiten.</p>`,
    quiz: [
      { q: 'Was ist der verborgene Hauptstamm von 亥 Schwein?', options: ['甲', '壬', '癸', '戊'], answer: 1, explain: '亥 enthält 壬 (Haupt-Qi) und 甲.' },
      { q: 'Welcher Zweig enthält 戊 乙 癸?', options: ['辰', '戌', '丑', '未'], answer: 0, explain: '辰 Drache ist der Wasser-Speicher: 戊 乙 癸.' },
    ],
  },
  {
    id: 'daymaster', title: 'Der Tagesmeister', zh: '日主', level: 'Core',
    summary: 'Der Stamm deiner Tagessäule – das Zentrum jeder Analyse.',
    body: `
<p>Der Himmelsstamm der Tagessäule ist der <b>Tagesmeister</b> (日主 oder 日元). Er steht für <b>dich</b>. Alle anderen Zeichen werden im Verhältnis zu ihm gedeutet.</p>
<p>Stelle drei Fragen:</p>
<ol>
<li><b>Wer bin ich?</b> – Lies das Wesen deines Tagesmeister-Stammes (Lektion Himmelsstämme).</li>
<li><b>Wann wurde ich geboren?</b> – Ist mein Element in seiner Jahreszeit? (Lektion Stärke)</li>
<li><b>Was umgibt mich?</b> – Welche Elemente stützen mich, welche bringe ich hervor, kontrolliere ich oder werde ich kontrolliert? (Lektion Zehn Götter)</li>
</ol>
<p>Ein 甲-Holz-Tagesmeister, im Frühling geboren, ist ein Baum in vollem Wachstum; im Herbst geboren, steht er scharfen Metall-Äxten gegenüber – derselbe Stamm, eine ganz andere Geschichte.</p>
<h3>Die 60 Tagessäulen</h3>
<p>Zusammen mit seinem Zweig bildet der Tagesmeister die <b>Tagessäule</b> (日柱). Der Zweig ist der „Sitz“ des Tagesmeisters und sein Partnerpalast – 甲子 und 甲午 sind beide Yang-Holz und doch sehr verschiedene Menschen.</p>
<div data-widget="daypillars"></div>
<p class="tip">Berechne dein eigenes Horoskop im Tab <b>Horoskop</b> und tippe auf deinen Tagesmeister, um mehr zu lesen.</p>`,
    quiz: [
      { q: 'Der Tagesmeister ist …', options: ['Der Jahreszweig', 'Der Tagesstamm', 'Der Monatsstamm', 'Der Stundenzweig'], answer: 1, explain: 'Der Stamm der Tagessäule.' },
    ],
  },
  {
    id: 'tengods', title: 'Die Zehn Götter', zh: '十神', level: 'Core',
    summary: 'Die Beziehungen zwischen dem Tagesmeister und jedem anderen Zeichen.',
    body: `
<p>Die <b>Zehn Götter</b> (十神) übersetzen die fünf Elemente in Lebensthemen. Jeder ist durch seine Element-Beziehung zum Tagesmeister und durch die Polarität (gleich oder entgegengesetzt) bestimmt:</p>
<div data-widget="tengods"></div>
<h3>Fünf Gruppen</h3>
<ul>
<li><b>Gefährten</b> (gleiches Element) – Freund, Rivale: das Selbst, Gleichgestellte</li>
<li><b>Ausdruck</b> (bringe ich hervor) – Genießer, Rebell: Ausdruck, Talent</li>
<li><b>Reichtum</b> (kontrolliere ich) – Direkter & Indirekter Reichtum: Geld, Ressourcen</li>
<li><b>Macht</b> (kontrolliert mich) – Direkte Autorität, Sieben Tötungen: Beruf, Disziplin</li>
<li><b>Ressource</b> (bringt mich hervor) – Direkte & Indirekte Ressource: Wissen, Unterstützung</li>
</ul>
<div data-widget="tengod-trainer"></div>`,
    quiz: [
      { q: 'Was ist 丙 für einen 甲-Tagesmeister?', options: ['Rebell', 'Genießer', 'Direkter Reichtum', 'Freund'], answer: 1, explain: 'Holz bringt Feuer hervor, beide Yang → Genießer.' },
      { q: 'Was ist 丁 für einen 庚-Tagesmeister?', options: ['Sieben Tötungen', 'Direkte Autorität', 'Direkte Ressource', 'Rivale'], answer: 1, explain: 'Feuer kontrolliert Metall, entgegengesetzte Polarität → Direkte Autorität.' },
      { q: 'Der Ressourcen-Stern ist das Element, das …', options: ['ich kontrolliere', 'mich kontrolliert', 'mich hervorbringt', 'ich hervorbringe'], answer: 2, explain: 'Die Ressource (印) bringt den Tagesmeister hervor.' },
    ],
  },
  {
    id: 'strength', title: 'Stärke und Jahreszeiten', zh: '旺相休囚死', level: 'Analysis',
    summary: 'Ist der Tagesmeister stark oder schwach?',
    body: `
<p>Der wichtigste Faktor für die Stärke ist der <b>Monatszweig</b> – die Jahreszeit der Geburt (月令). Ein Element kann sich in einem von fünf Zuständen befinden:</p>
<div data-widget="phases"></div>
<h3>Stärke einschätzen</h3>
<ol>
<li><b>Jahreszeit:</b> Stützt der Monatszweig den Tagesmeister?</li>
<li><b>Wurzeln:</b> Erscheint das Element des Tagesmeisters in verborgenen Stämmen?</li>
<li><b>Unterstützung:</b> Wie viele Gefährten- und Ressourcen-Stämme gibt es?</li>
</ol>
<p>Stützende Elemente = gleiches Element + Ressource. Schwächend = Ausdruck, Reichtum und Macht.</p>
<p>Der Horoskop-Rechner zeigt einen <i>groben</i> Wert. Erfahrene Deuter berücksichtigen zusätzlich Kombinationen, Zusammenstöße und Sonderstrukturen (从格) – keine Zahl ersetzt das Urteil.</p>`,
    quiz: [
      { q: 'Ein Feuer-Tagesmeister, im Sommer geboren, ist …', options: ['Blühend 旺', 'Schwach 死', 'Gefangen 囚', 'Ruhend 休'], answer: 0, explain: 'Feuer in der Feuer-Jahreszeit ist auf seinem Höhepunkt.' },
      { q: 'Ein Holz-Tagesmeister, im Winter (Wasser) geboren, ist …', options: ['Ruhend', 'Stark 相', 'Schwach', 'Gefangen'], answer: 1, explain: 'Wasser bringt Holz hervor → 相 Stark.' },
      { q: 'Welcher Faktor zählt für die Stärke am meisten?', options: ['Stundenzweig', 'Jahresstamm', 'Monatszweig', 'Geschlecht'], answer: 2, explain: 'Der Monatszweig – die Jahreszeit.' },
    ],
  },
  {
    id: 'interactions', title: 'Wechselwirkungen der Zweige', zh: '刑冲合害', level: 'Analysis',
    summary: 'Zusammenstöße, Kombinationen, Strafen und Schäden.',
    body: `
<p>Zweige wirken aufeinander ein. Die wichtigsten Wechselwirkungen:</p>
<h3>Sechs Zusammenstöße 六冲 – Gegenüber auf dem Tierkreis</h3>
<p>Tiere, die sich auf dem Rad gegenüberstehen – Bewegung, Wandel, Konflikt. Ein Zusammenstoß mit dem Tageszweig kann den Beziehungspalast berühren.</p>
<div data-widget="rel-clash"></div>
<h3>Sechs Harmonien 六合</h3>
<p>Bindungen, Anziehung, Zusammenarbeit – jedes Paar neigt zu einem Element.</p>
<div data-widget="rel-six"></div>
<h3>Drei Harmonien 三合</h3>
<p>Ein kraftvoller Rahmen, der ein Element stärkt. Zwei der drei bilden eine halbe Kombination, wenn eines davon das mittlere Tier ist (子 Ratte, 卯 Hase, 午 Pferd, 酉 Hahn).</p>
<div data-widget="rel-three"></div>
<h3>Richtungskombinationen 三会</h3>
<p>Die drei Tiere einer Jahreszeit zusammen:</p>
<div data-widget="rel-season"></div>
<h3>Strafen 刑 und Schäden 害</h3>
<p>Die klassischen Strafen bringen Spannung und Verpflichtungen; 子 Ratte und 卯 Hase bilden die „unhöfliche“ Strafe. Schäden deuten auf verborgene Reibung hin.</p>
<div data-widget="rel-harm"></div>
<div data-widget="wheel"></div>`,
    quiz: [
      { q: 'Welcher Zweig stößt mit 子 Ratte zusammen?', options: ['丑 Büffel', '午 Pferd', '卯 Hase', '酉 Hahn'], answer: 1, explain: 'Gegenüber: 子午 stoßen zusammen.' },
      { q: '申子辰 bildet einen …-Rahmen', options: ['Feuer', 'Metall', 'Wasser', 'Holz'], answer: 2, explain: 'Affe–Ratte–Drache = Wasser.' },
      { q: 'Welches Paar ist eine Sechs-Harmonie?', options: ['寅亥', '寅申', '卯酉', '巳亥'], answer: 0, explain: '寅亥 verbinden sich; die anderen sind Zusammenstöße.' },
    ],
  },
  {
    id: 'stars', title: 'Symbolsterne', zh: '神煞', level: 'Analysis',
    summary: 'Edler, Pfirsichblüte, Reisepferd und andere besondere Sterne.',
    body: `
<p>Neben Elementen und Zehn Göttern nutzt das klassische BaZi <b>Symbolsterne</b> (神煞, Shen Sha). Es sind besondere Zweige, die ein bestimmtes Thema tragen. Sie geben einer Deutung Farbe, wiegen aber nie schwerer als die Elemente und die Stärke des Tagesmeisters.</p>
<div data-widget="stars"></div>
<h3>Wie man sie findet</h3>
<ul>
<li><b>Aus dem Tagesstamm:</b> Edler 天乙贵人, Gelehrtenstern 文昌, Wohlstandsstern 禄 und Ziegenklinge 羊刃. Ein 癸-Tagesmeister hat seinen Edlen zum Beispiel in 卯 und 巳.</li>
<li><b>Aus dem Tages- oder Jahreszweig</b> (über seine Drei-Harmonie-Gruppe): Pfirsichblüte 桃花, Reisepferd 驿马 und Baldachin 华盖. Für 申子辰 ist die Pfirsichblüte 酉, das Reisepferd 寅 und der Baldachin 辰.</li>
<li><b>Aus der Tagessäule:</b> die zwei Leere-Zweige 空亡 ihrer Zehn-Tage-Gruppe (旬). In der 甲子-Gruppe sind 戌 und 亥 leer.</li>
</ul>
<h3>Wo sie erscheinen</h3>
<p>Die Säule eines Sterns zeigt, <i>wo</i> er wirkt: eine Pfirsichblüte im Tageszweig deutet auf Romantik in engen Beziehungen, im Monatszweig auf Ausstrahlung im Beruf. Bringt ein Jahr oder eine Glückssäule den Zweig eines Sterns, wird der Stern „aktiviert“ – ein Reisepferd-Jahr bringt oft Reisen oder einen Umzug.</p>
<p class="tip">Deine Horoskopseite listet deine Symbolsterne, und die Jahresvorschau zeigt, welche jedes Jahr und jeder Monat aktiviert.</p>`,
    quiz: [
      { q: 'Welcher Stern steht für Romantik und Charme?', options: ['Reisepferd', 'Pfirsichblüte', 'Baldachin', 'Leere'], answer: 1, explain: 'Pfirsichblüte 桃花 – Anziehung und Beliebtheit.' },
      { q: 'Für 申子辰 ist das Reisepferd …', options: ['寅', '酉', '辰', '亥'], answer: 0, explain: '申子辰 → 寅; es ist der Zweig, der mit dem ersten Zweig der Gruppe zusammenstößt.' },
      { q: 'Der Edle wird bestimmt aus dem …', options: ['Monatszweig', 'Stundenstamm', 'Tagesstamm', 'Glückssäule'], answer: 2, explain: '天乙贵人 wird aus dem Tagesstamm (oft auch dem Jahresstamm) abgelesen.' },
    ],
  },
  {
    id: 'luck', title: 'Glückssäulen', zh: '大运', level: 'Analysis',
    summary: 'Zehnjährige Phasen, die dein Leben prägen.',
    body: `
<p>Über das Geburtshoroskop hinaus nutzt BaZi <b>Glückssäulen</b> (大运 Da Yun): Jede dauert zehn Jahre und fügt dem Horoskop einen neuen Stamm und Zweig hinzu.</p>
<h3>Richtung</h3>
<ul><li>Yang-Jahr + Mann oder Yin-Jahr + Frau → die Glückssäulen laufen von der Monatssäule aus <b>vorwärts</b>.</li>
<li>Yin-Jahr + Mann oder Yang-Jahr + Frau → sie laufen <b>rückwärts</b>.</li></ul>
<h3>Startalter</h3>
<p>Zähle die Tage von der Geburt bis zum nächsten (vorwärts) bzw. vorherigen (rückwärts) Jie-Termin. <b>Drei Tage = ein Lebensjahr</b>. 15 Tage → die erste Glückssäule beginnt mit 5 Jahren.</p>
<p>Zusätzlich hat jedes Jahr seine eigene <b>Jahressäule</b> (流年). Das Zusammenspiel von Geburtshoroskop, Glückssäule und Jahressäule wird für die zeitliche Deutung genutzt.</p>
<p class="tip">Deine Glückssäulen findest du unten in deinem berechneten Horoskop.</p>`,
    quiz: [
      { q: 'Wie lange dauert eine Glückssäule?', options: ['1 Jahr', '5 Jahre', '10 Jahre', '12 Jahre'], answer: 2, explain: 'Jede Glückssäule umfasst zehn Jahre.' },
      { q: 'Ein Mann, in einem Yang-Jahr geboren: Die Glückssäulen laufen …', options: ['Vorwärts', 'Rückwärts', 'Je nach Stunde', 'Beides'], answer: 0, explain: 'Yang-Jahr + Mann → vorwärts.' },
      { q: 'Wie viele Tage entsprechen einem Jahr Startalter?', options: ['1', '3', '10', '30'], answer: 1, explain: 'Drei Tage = ein Jahr.' },
    ],
  },
  {
    id: 'useful', title: 'Nützlicher Gott & Ausgleich', zh: '用神', level: 'Analysis',
    summary: 'Welches Element bringt ein Horoskop ins Gleichgewicht?',
    body: `
<p>Der <b>Nützliche Gott</b> (用神) ist das Element, das ein Horoskop am besten ausgleicht. Der klassische Ansatz ist 扶抑 (stützen oder dämpfen):</p>
<ul>
<li><b>Starker Tagesmeister</b> → begünstigt Ausdruck, Reichtum und Macht (um den Überschuss abzuleiten und zu nutzen).</li>
<li><b>Schwacher Tagesmeister</b> → begünstigt Ressource und Gefährten (zur Unterstützung).</li>
</ul>
<p>Ein zweiter Ansatz ist 调候 (Klimaausgleich): Ein im tiefen Winter geborenes Horoskop braucht Feuer zum Wärmen; ein Sommerhoroskop braucht Wasser zum Kühlen.</p>
<p>Sonderhoroskope, in denen ein Element völlig dominiert, „folgen“ stattdessen unter Umständen diesem Element (从格).</p>
<h3>Verantwortungsvoll üben</h3>
<p>BaZi beschreibt Tendenzen, kein festgelegtes Schicksal. Gute Praktiker nutzen es, um zum Nachdenken anzuregen – nie, um Menschen zu ängstigen oder Entscheidungen für sie zu treffen.</p>
<p class="tip">Nächster Schritt: Berechne die Horoskope von Menschen, die du gut kennst, und vergleiche, was du siehst, mit dem, was du weißt. Dann teste dich im Quiz-Tab!</p>`,
    quiz: [
      { q: 'Ein sehr schwacher Tagesmeister profitiert meist von …', options: ['Reichtum', 'Macht', 'Ressource', 'Ausdruck'], answer: 2, explain: 'Die Ressource stützt und stärkt den Tagesmeister.' },
      { q: '调候 bezeichnet …', options: ['Klimaausgleich', 'Stammkombination', 'Glückssäulen', 'Verborgene Stämme'], answer: 0, explain: 'Den Ausgleich von Hitze/Kälte und Trockenheit/Feuchtigkeit.' },
    ],
  },
];
