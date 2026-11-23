// Lektionen 1–7 (Deutsch)
export const LESSONS_1 = [
  {
    id: 'intro', title: 'Was ist BaZi?', zh: '八字', level: 'Basics',
    summary: 'Die „Acht Zeichen“ – eine Landkarte der Energien im Moment der Geburt.',
    body: `
<p><b>BaZi</b> (八字, „acht Zeichen“) – auch <b>Vier Säulen des Schicksals</b> (四柱命理) genannt – ist ein klassisches chinesisches System, das einen Menschen über den Zeitpunkt seiner Geburt beschreibt.</p>
<p>Jahr, Monat, Tag und Stunde der Geburt werden jeweils als Zeichenpaar geschrieben: oben ein <b>Himmelsstamm</b> (天干), unten ein <b>Erdzweig</b> (地支). Vier Säulen × zwei Zeichen = <b>acht Zeichen</b>.</p>
<div data-widget="sample-chart"></div>
<p>Jedes Zeichen trägt eines der <b>Fünf Elemente</b> und eine <b>Yin</b>- oder <b>Yang</b>-Polarität. Ein Horoskop zu lesen heißt, zu betrachten, wie sich diese Energien gegenseitig unterstützen, kontrollieren und ausgleichen.</p>
<h3>Wofür jede Säule steht</h3>
<ul>
<li><b>Jahr</b> – Herkunft, Gesellschaft, frühe Kindheit (ca. 1–16 Jahre)</li>
<li><b>Monat</b> – Eltern, berufliches Umfeld, Jugend (17–32)</li>
<li><b>Tag</b> – du selbst (der Stamm) und dein Partner (der Zweig) (33–48)</li>
<li><b>Stunde</b> – Kinder, Ideen, späteres Leben (49+)</li>
</ul>
<p class="note">BaZi ist ein traditionelles Kultursystem. Diese App vermittelt es zum Lernen und zur Selbstreflexion – nicht als Grundlage für medizinische, finanzielle oder rechtliche Entscheidungen.</p>`,
    quiz: [
      { q: 'Wie viele Zeichen enthält ein vollständiges BaZi-Horoskop?', options: ['Vier', 'Acht', 'Zwölf', 'Zehn'], answer: 1,
        explain: 'Vier Säulen mit je einem Stamm und einem Zweig = 8 Zeichen.' },
      { q: 'Welche Säule steht am direktesten für dich?', options: ['Jahr', 'Monat', 'Tag', 'Stunde'], answer: 2,
        explain: 'Der Tagesstamm ist der „Tagesmeister“ – das Selbst.' },
    ],
  },
  {
    id: 'yinyang', title: 'Yin und Yang', zh: '阴阳', level: 'Basics',
    summary: 'Die zwei sich ergänzenden Kräfte hinter jedem Zeichen.',
    body: `
<p>Jedes Phänomen enthält zwei sich ergänzende Aspekte: <b>Yang</b> (阳) – aktiv, hell, ausdehnend, nach außen – und <b>Yin</b> (阴) – empfangend, dunkel, zusammenziehend, nach innen.</p>
<p>Keines ist „gut“ oder „schlecht“. Sie bedingen einander und wandeln sich ständig ineinander: Der Mittag (höchstes Yang) wird zur Nacht; der Mittwinter (höchstes Yin) wird zum Frühling.</p>
<h3>Im BaZi</h3>
<p>Jedes der fünf Elemente erscheint unter den zehn Himmelsstämmen zweimal: einmal Yang und einmal Yin. Yang-Holz 甲 ist ein hoher Baum; Yin-Holz 乙 eine blühende Ranke. Gleiches Element, ganz unterschiedlicher Ausdruck.</p>
<p>Die Polarität ist bei den <b>Zehn Göttern</b> wichtig: Ob zwei Stämme dieselbe Polarität haben, entscheidet zum Beispiel, ob ein Element „Direkter Reichtum“ oder „Indirekter Reichtum“ ist.</p>
<p class="tip">Faustregel: In der Reihe der Stämme und Zweige sind ungerade Positionen (1., 3., …) Yang, gerade Positionen Yin.</p>`,
    quiz: [
      { q: 'Welche Eigenschaft gehört zu Yang?', options: ['Empfangend', 'Zusammenziehend', 'Aktiv', 'Dunkel'], answer: 2, explain: 'Yang ist aktiv, hell und ausdehnend.' },
      { q: '乙 Yi ist …', options: ['Yang-Holz', 'Yin-Holz', 'Yin-Feuer', 'Yang-Metall'], answer: 1, explain: '甲 ist Yang-Holz, 乙 ist Yin-Holz.' },
    ],
  },
  {
    id: 'elements', title: 'Die Fünf Elemente', zh: '五行', level: 'Basics',
    summary: 'Holz, Feuer, Erde, Metall, Wasser – und wie sie einander hervorbringen und kontrollieren.',
    body: `
<p>Die <b>Fünf Elemente</b> (Wu Xing, 五行, wörtlich „fünf Bewegungen“, auch Wandlungsphasen) sind Phasen von Energie, nicht physische Stoffe.</p>
<div data-widget="elements"></div>
<h3>Der Hervorbringungszyklus (生)</h3>
<p>Holz nährt <b>Feuer</b> → Feuer erzeugt Asche, <b>Erde</b> → Erde trägt <b>Metall</b> → Metall sammelt <b>Wasser</b> (Kondensation) → Wasser nährt <b>Holz</b>.</p>
<h3>Der Kontrollzyklus (克)</h3>
<p>Holz durchbricht <b>Erde</b> (Wurzeln) → Erde dämmt <b>Wasser</b> ein → Wasser löscht <b>Feuer</b> → Feuer schmilzt <b>Metall</b> → Metall schneidet <b>Holz</b>.</p>
<div data-widget="cycle"></div>
<h3>Schwächung</h3>
<p>Hervorbringen kostet Energie: Das „Mutter“-Element wird vom „Kind“ geschwächt. Auch Kontrollieren kostet Energie – ein zu schwacher Kontrolleur wird von einem starken Ziel erschöpft („schwaches Wasser löscht keinen Waldbrand“).</p>
<p class="tip">Fast alles in der BaZi-Analyse führt auf diese zwei Zyklen zurück. Lerne sie auswendig!</p>`,
    quiz: [
      { q: 'Welches Element bringt Wasser hervor?', options: ['Feuer', 'Holz', 'Metall', 'Erde'], answer: 1, explain: 'Wasser nährt Holz.' },
      { q: 'Welches Element kontrolliert Metall?', options: ['Feuer', 'Wasser', 'Holz', 'Erde'], answer: 0, explain: 'Feuer schmilzt Metall.' },
      { q: 'Erde kontrolliert …', options: ['Holz', 'Metall', 'Wasser', 'Feuer'], answer: 2, explain: 'Erde dämmt Wasser ein.' },
    ],
  },
  {
    id: 'stems', title: 'Die zehn Himmelsstämme', zh: '天干', level: 'Basics',
    summary: 'Zehn Zeichen: jedes Element in seiner Yang- und Yin-Form.',
    body: `
<p>Die <b>Himmelsstämme</b> sind die „himmlischen“, sichtbaren Energien eines Horoskops – sie stehen oben in jeder Säule. Jeder Stamm wird mit einem Bild aus der Natur beschrieben.</p>
<div data-widget="stems"></div>
<p>Tippe auf einen Stamm, um seine Persönlichkeit zu lesen. Wenn du jemanden kennenlernst, gibt sein <b>Tagesstamm</b> einen ersten Eindruck von seinem Wesenskern.</p>
<h3>Stammkombinationen (天干五合)</h3>
<p>Stämme, die fünf Positionen auseinanderliegen, „verbinden“ sich – sie ziehen einander an und können sich unter den richtigen Bedingungen umwandeln:</p>
<ul><li>甲 + 己 → Erde</li><li>乙 + 庚 → Metall</li><li>丙 + 辛 → Wasser</li><li>丁 + 壬 → Holz</li><li>戊 + 癸 → Feuer</li></ul>`,
    quiz: [
      { q: 'Welcher Stamm wird als Sonne dargestellt?', options: ['丁 Ding', '丙 Bing', '戊 Wu', '庚 Geng'], answer: 1, explain: '丙 ist Yang-Feuer – die Sonne. 丁 ist die Kerze.' },
      { q: 'Welches Element hat 壬 Ren?', options: ['Metall', 'Erde', 'Wasser', 'Holz'], answer: 2, explain: '壬 ist Yang-Wasser – der Ozean.' },
      { q: '甲 verbindet sich mit …', options: ['乙', '庚', '己', '戊'], answer: 2, explain: '甲 + 己 verbinden sich (→ Erde).' },
    ],
  },
  {
    id: 'branches', title: 'Die zwölf Erdzweige', zh: '地支', level: 'Basics',
    summary: 'Die zwölf Tiere – Monate, Stunden und die Wurzeln eines Horoskops.',
    body: `
<p>Die <b>Erdzweige</b> stehen unten in jeder Säule. Sie sind mit den zwölf Tierkreiszeichen, den zwölf Doppelstunden des Tages und den zwölf Sonnenmonaten verbunden.</p>
<div data-widget="branches"></div>
<p>Zweige sind komplexer als Stämme: Jeder enthält ein bis drei <b>verborgene Stämme</b> (siehe Lektion „Verborgene Stämme“). Sie sind die „Wurzeln“, die die Stämme darüber stützen oder schwächen.</p>
<h3>Jahreszeiten</h3>
<ul>
<li>Frühling (Holz): 寅 Tiger, 卯 Hase, (辰 Drache)</li>
<li>Sommer (Feuer): 巳 Schlange, 午 Pferd, (未 Ziege)</li>
<li>Herbst (Metall): 申 Affe, 酉 Hahn, (戌 Hund)</li>
<li>Winter (Wasser): 亥 Schwein, 子 Ratte, (丑 Büffel)</li>
</ul>
<p>Die vier Erde-Zweige 辰 戌 丑 未 schließen jede Jahreszeit ab – sie sind „Speicher“-Zweige.</p>`,
    quiz: [
      { q: 'Welches Tier ist 午 Wu?', options: ['Ratte', 'Pferd', 'Ziege', 'Hund'], answer: 1, explain: '午 ist das Pferd – Yang-Feuer, 11–13 Uhr.' },
      { q: 'Welcher Zweig regiert die Stunde 23–1 Uhr?', options: ['亥 Schwein', '丑 Büffel', '子 Ratte', '寅 Tiger'], answer: 2, explain: 'Die Rattenstunde 子 beginnt um 23 Uhr.' },
      { q: 'Welcher ist ein Erde-Zweig?', options: ['酉', '辰', '卯', '亥'], answer: 1, explain: '辰 Drache ist Erde (ebenso 戌, 丑 und 未).' },
    ],
  },
  {
    id: 'jiazi', title: 'Der 60er-Zyklus (Jiazi)', zh: '六十甲子', level: 'Calendar',
    summary: 'Zehn Stämme mit zwölf Zweigen ergeben 60 Kombinationen.',
    body: `
<p>Stämme und Zweige schreiten gemeinsam voran: 甲子, 乙丑, 丙寅 … Weil 10 und 12 einen gemeinsamen Teiler haben, verbinden sich nur Yang-Stämme mit Yang-Zweigen und Yin mit Yin – so entstehen <b>60</b> (nicht 120) Kombinationen. Das ist der <b>Sechziger-Zyklus</b>, benannt nach seinem ersten Paar 甲子 Jia Zi.</p>
<div data-widget="jiazi"></div>
<p>Derselbe Zyklus zählt Jahre, Monate, Tage und Stunden. 1984 war ein 甲子-Jahr; 2044 wird es wieder sein. Die Tage laufen seit über 2.700 Jahren ununterbrochen durch diesen Zyklus.</p>
<p class="tip">Darum wiederholt sich dein „chinesisches Tierzeichen“ alle 12 Jahre, deine vollständige Jahressäule aber erst alle 60 Jahre.</p>`,
    quiz: [
      { q: 'Wie viele Säulen hat der vollständige Zyklus?', options: ['12', '60', '120', '10'], answer: 1, explain: '60 – Yang-Stämme verbinden sich nur mit Yang-Zweigen.' },
      { q: 'Welches Paar folgt auf 甲子?', options: ['乙子', '甲丑', '乙丑', '丙寅'], answer: 2, explain: 'Beide rücken einen Schritt weiter: 乙丑.' },
    ],
  },
  {
    id: 'pillars', title: 'Die vier Säulen aufstellen', zh: '排四柱', level: 'Calendar',
    summary: 'Warum BaZi den Sonnenkalender nutzt und wie jede Säule bestimmt wird.',
    body: `
<p>BaZi verwendet den <b>Sonnen</b>kalender (节气, Solarterme), <i>nicht</i> das Mondneujahr.</p>
<h3>Jahressäule</h3>
<p>Das Jahr beginnt mit <b>Li Chun</b> 立春 (Frühlingsanfang, um den 4. Februar), wenn die Sonne 315° ekliptische Länge erreicht. Wer am 20. Januar 2024 geboren ist, gehört zum 癸卯-Jahr (2023), nicht zu 甲辰.</p>
<h3>Monatssäule</h3>
<p>Die Monate beginnen mit den zwölf <b>Jie</b>-Terminen (节), etwa am 4. bis 8. jedes Monats. Der erste Monat ist immer der Tiger-Monat 寅. Sein Stamm ergibt sich aus dem Jahresstamm (Regel der „Fünf Tiger“):</p>
<ul><li>甲/己-Jahr → 丙寅</li><li>乙/庚-Jahr → 戊寅</li><li>丙/辛-Jahr → 庚寅</li><li>丁/壬-Jahr → 壬寅</li><li>戊/癸-Jahr → 甲寅</li></ul>
<div data-widget="jie"></div>
<h3>Tagessäule</h3>
<p>Wird direkt aus dem fortlaufenden 60-Tage-Zyklus abgelesen. Viele Schulen lassen den neuen Tag um 23 Uhr beginnen (Beginn der Rattenstunde) – diese App tut das standardmäßig.</p>
<h3>Stundensäule</h3>
<p>Der Zweig ergibt sich aus der Doppelstunde; der Stamm folgt aus dem Tagesstamm (Regel der „Fünf Ratten“): 甲/己-Tag → 甲子-Stunde, 乙/庚 → 丙子, 丙/辛 → 戊子, 丁/壬 → 庚子, 戊/癸 → 壬子.</p>
<h3>Wahre Sonnenzeit</h3>
<p>Traditionell richtet sich die Stunde nach dem Sonnenstand am Geburtsort. Gib im Rechner deinen Geburtsort an, um diese Korrektur anzuwenden – sie kann die Stundensäule verschieben, wenn du nahe einer Grenze geboren bist.</p>`,
    quiz: [
      { q: 'Wann beginnt das BaZi-Jahr?', options: ['1. Januar', 'Chinesisches Neujahr', 'Li Chun (~4. Feb.)', 'Wintersonnenwende'], answer: 2, explain: 'Das Sonnenjahr beginnt mit Li Chun.' },
      { q: 'Der erste Monat des BaZi-Jahres ist immer der …', options: ['Ratten-Monat 子', 'Tiger-Monat 寅', 'Hasen-Monat 卯', 'Büffel-Monat 丑'], answer: 1, explain: 'Li Chun eröffnet den Tiger-Monat.' },
      { q: 'In einem 甲-Jahr ist der Tiger-Monat …', options: ['甲寅', '丙寅', '戊寅', '壬寅'], answer: 1, explain: '甲/己-Jahre beginnen mit 丙寅.' },
    ],
  },
];
