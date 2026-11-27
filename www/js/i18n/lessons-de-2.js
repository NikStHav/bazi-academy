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
<h3>Wie funktioniert eine Drei-Harmonie?</h3>
<p>Jede Gruppe erzählt die Lebensgeschichte <b>eines Elements</b>: das Tier, in dem es <b>geboren</b> wird, das Tier, in dem es auf dem <b>Höhepunkt</b> ist, und das Tier, in dem es <b>gespeichert</b> wird. Denk an eine Pflanze: Sie keimt, steht in voller Blüte und wird geerntet und eingelagert.</p>
<div data-widget="three-life"></div>
<p><b>Beispiel Wasser:</b> 申 Affe ist Metall, und Metall bringt Wasser hervor – in ihm steckt etwas Wasser (壬), also wird Wasser hier geboren. 子 Ratte ist Mittwinter, reines Wasser – der Höhepunkt. 辰 Drache ist Erde, verbirgt aber etwas Wasser (癸), wie ein Stausee – hier wird Wasser gespeichert.</p>
<p><b>Die einfache Regel:</b> Das mittlere Tier ist immer eines der vier „reinen“ Tiere – 子 Ratte, 卯 Hase, 午 Pferd oder 酉 Hahn. Sein Element ist das Element der ganzen Gruppe. Die anderen beiden stehen vier Plätze davor und dahinter auf dem Rad, die drei bilden also ein Dreieck. Erde hat keine eigene Gruppe: Sie verteilt sich auf die vier Speicher-Tiere 辰 Drache, 未 Ziege, 戌 Hund und 丑 Büffel.</p>
<p class="tip">Diese drei Momente begegnen dir wieder: in der Lektion Symbolsterne (Baldachin = Speicher, Reisepferd) und in der Lektion für Fortgeschrittene über die Zwölf Wachstumsphasen.</p>
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
<p><b>Warum gerade diese Zweige?</b> Sie folgen der Lebensgeschichte des Gruppen-Elements (siehe Wechselwirkungen der Zweige): Der Baldachin ist das <b>Speicher</b>-Tier, das Reisepferd stößt mit dem <b>Geburts</b>-Tier zusammen und bringt Bewegung, und die Pfirsichblüte ist die Phase „Bad“ direkt nach der Geburt – jung, charmant und rastlos.</p>
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
  {
    id: 'lifestages', title: 'Die Zwölf Wachstumsphasen', zh: '十二长生', level: 'Advanced',
    summary: 'Wie jeder Stamm in den zwölf Zweigen geboren wird, seinen Höhepunkt erreicht und ruht.',
    body: `
<p>Dies ist eine Lektion für <b>Fortgeschrittene</b>. Sie baut auf den Drei-Harmonien auf: Dort hast du gesehen, dass ein Element geboren wird, seinen Höhepunkt erreicht und gespeichert wird. Tatsächlich durchläuft jeder Himmelsstamm einen ganzen Lebenszyklus aus <b>zwölf Phasen</b> (十二长生) – eine Phase für jeden der zwölf Zweige.</p>
<h3>Die zwölf Phasen – ein Leben in vier Abschnitten</h3>
<ul>
<li><b>Wachsen:</b> 长生 Geburt → 沐浴 Bad (ein Baby wird gebadet – charmant, aber verletzlich) → 冠带 Krone (sich als Jugendlicher herausputzen)</li>
<li><b>Stark:</b> 临官 Amtsantritt (Berufsleben, Verantwortung) → 帝旺 Höhepunkt (der Gipfel der Kraft)</li>
<li><b>Nachlassen:</b> 衰 Abnahme → 病 Krankheit → 死 Tod</li>
<li><b>Ruhen und Erneuern:</b> 墓 Grab (eingelagert) → 绝 Auslöschung (das Alte ist vorbei) → 胎 Empfängnis → 养 Nähren (Wachsen im Mutterleib) – dann beginnt der Kreis wieder mit der Geburt.</li>
</ul>
<p class="tip">Lass dich von Namen wie „Krankheit“ oder „Tod“ nicht abschrecken – es sind klassische Bilder für die Stärke eines Elements, keine Vorhersagen über deine Gesundheit oder dein Leben.</p>
<div data-widget="life-stages"></div>
<h3>So wird gezählt</h3>
<ol>
<li>Finde den <b>Geburts</b>-Zweig des Stamms: 甲 Holz → 亥 Schwein, 丙 Feuer und 戊 Erde → 寅 Tiger, 庚 Metall → 巳 Schlange, 壬 Wasser → 申 Affe. Für die Yin-Stämme: 乙 → 午 Pferd, 丁 und 己 → 酉 Hahn, 辛 → 子 Ratte, 癸 → 卯 Hase.</li>
<li><b>Yang-Stämme</b> gehen von dort <b>vorwärts</b> (im Uhrzeigersinn), eine Phase pro Zweig. <b>Yin-Stämme</b> gehen <b>rückwärts</b>.</li>
</ol>
<p>Beispiel 甲 Holz: Geburt in 亥 Schwein, Bad in 子 Ratte, Krone in 丑 Büffel, Amtsantritt in 寅 Tiger, Höhepunkt in 卯 Hase, Abnahme in 辰 Drache … Grab in 未 Ziege.</p>
<p>Erde 戊 und 己 folgt hier dem Feuer (die verbreitetste klassische Sicht). Manche Schulen lassen die Yin-Stämme einfach den Zyklus ihres Yang-Partners teilen – die App nutzt die klassische Zählung „Yin geht rückwärts“.</p>
<h3>Verbindungen, die du schon kennst</h3>
<ul>
<li><b>Drei-Harmonie:</b> Geburt, Höhepunkt und Grab eines Yang-Stamms sind genau die drei Tiere seiner Gruppe – 壬 Wasser: 申 Affe, 子 Ratte, 辰 Drache.</li>
<li><b>Wohlstandsstern 禄</b> = die Phase Amtsantritt des Tagesmeisters; <b>Ziegenklinge 羊刃</b> = der Höhepunkt eines Yang-Tagesmeisters.</li>
<li><b>Pfirsichblüte 桃花</b> = die Phase Bad des Gruppen-Elements; <b>Baldachin 华盖</b> = sein Grab.</li>
<li><b>Stärke:</b> Ein Tagesmeister, der in einem Monat mit Amtsantritt oder Höhepunkt geboren ist, ist stark; bei Tod, Grab oder Auslöschung ist er schwach und braucht Unterstützung.</li>
</ul>
<h3>Im Horoskop lesen</h3>
<p>Schau dir die Phase des <b>Tagesmeisters</b> in jedem Zweig des Horoskops an. Der <b>Monats</b>zweig zeigt seine Kraft aus der Jahreszeit; der <b>Tages</b>zweig (sein eigener Sitz) zeigt, wie viel inneren Halt er hat – ein Tagesmeister auf Geburt, Amtsantritt oder Höhepunkt steht auf festem Boden. Starke Phasen geben eine Wurzel, schwache bedeuten, dass der Tagesmeister dort ruht. Wie immer sind die Phasen ein Faktor unter vielen und wiegen nie das Gesamtgleichgewicht auf.</p>
<p class="tip">Dein Horoskop zeigt die Wachstumsphase des Tagesmeisters in jeder Säule (Karte „Deine Tagessäule“).</p>`,
    quiz: [
      { q: 'Wo wird 甲 Holz geboren?', options: ['亥 Schwein', '寅 Tiger', '午 Pferd', '申 Affe'], answer: 0, explain: '甲 Holz wird in 亥 Schwein geboren und geht von dort vorwärts.' },
      { q: 'Yin-Stämme zählen die Phasen …', options: ['Vorwärts', 'Rückwärts', 'Gar nicht', 'Nur im Sommer'], answer: 1, explain: 'Yang-Stämme gehen vorwärts, Yin-Stämme rückwärts.' },
      { q: 'Geburt, Höhepunkt und Grab eines Yang-Stamms bilden eine …', options: ['Sechs-Harmonie', 'Drei-Harmonie', 'Zusammenstoß', 'Strafe'], answer: 1, explain: 'Für 壬 Wasser: 申 Affe, 子 Ratte, 辰 Drache – die Wasser-Drei-Harmonie.' },
    ],
  },
];
