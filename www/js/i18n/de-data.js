// German content for data.js (same order as the English arrays).
export const ELEMENTS_DE = [
  { name: 'Holz', season: 'Frühling', direction: 'Osten', traits: 'Wachstum, Güte, Planung, Flexibilität, Streben nach oben.' },
  { name: 'Feuer', season: 'Sommer', direction: 'Süden', traits: 'Wärme, Ausdruck, Leidenschaft, Sichtbarkeit, Begeisterung.' },
  { name: 'Erde', season: 'Übergänge zwischen den Jahreszeiten', direction: 'Mitte', traits: 'Stabilität, Vertrauen, Nährendes, Verlässlichkeit, Vermittlung.' },
  { name: 'Metall', season: 'Herbst', direction: 'Westen', traits: 'Struktur, Gerechtigkeit, Entschlossenheit, Verfeinerung, Disziplin.' },
  { name: 'Wasser', season: 'Winter', direction: 'Norden', traits: 'Weisheit, Anpassungsfähigkeit, Kommunikation, Tiefe, Fluss.' },
];
export const STEMS_DE = [
  { image: 'Hoher Baum', desc: 'Yang-Holz – der große Baum. Aufrecht, prinzipientreu, eine natürliche Führungspersönlichkeit, die stetig nach oben wächst; kann stur sein und lässt sich schwer biegen.' },
  { image: 'Blumen, Ranken, Gras', desc: 'Yin-Holz – Blumen und Ranken. Anmutig, anpassungsfähig und einfallsreich; findet einen Weg um Hindernisse herum und gedeiht durch Verbindungen.' },
  { image: 'Die Sonne', desc: 'Yang-Feuer – die Sonne. Großzügig, strahlend, offen und optimistisch; scheint für alle, kann aber überwältigend oder ungeduldig sein.' },
  { image: 'Kerze, Lampe, Sternenlicht', desc: 'Yin-Feuer – die Kerze. Warm, feinfühlig und fürsorglich; beleuchtet Details und Menschen aus der Nähe. Beständig, aber empfindlich gegenüber „Wind“.' },
  { image: 'Berg', desc: 'Yang-Erde – der Berg. Solide, verlässlich und schützend; ändert sich langsam, manchmal unbeweglich.' },
  { image: 'Fruchtbares Feld', desc: 'Yin-Erde – das Feld. Nährend, geduldig und vielseitig; unterstützt andere und nimmt viel auf, macht sich manchmal zu viele Sorgen.' },
  { image: 'Axt, Roherz, Waffe', desc: 'Yang-Metall – die Axt. Direkt, loyal, mutig und entschlossen; legt Wert auf Gerechtigkeit, kann schroff oder hart sein.' },
  { image: 'Schmuck, feine Klinge', desc: 'Yin-Metall – das Juwel. Kultiviert, präzise, ästhetisch und stolz; schätzt Qualität und Anerkennung.' },
  { image: 'Ozean, großer Fluss', desc: 'Yang-Wasser – der Ozean. Intelligent, dynamisch, abenteuerlustig und frei fließend; kann rastlos oder überwältigend sein.' },
  { image: 'Regen, Tau, Nebel', desc: 'Yin-Wasser – Regen und Nebel. Intuitiv, sanft, fantasievoll und still beharrlich; nährt auf subtile Weise.' },
];
export const BRANCHES_DE = [
  { animal: 'Ratte', month: 'Dez. (Da Xue → Xiao Han)' }, { animal: 'Büffel', month: 'Jan. (Xiao Han → Li Chun)' },
  { animal: 'Tiger', month: 'Feb. (Li Chun → Jing Zhe)' }, { animal: 'Hase', month: 'März (Jing Zhe → Qing Ming)' },
  { animal: 'Drache', month: 'Apr. (Qing Ming → Li Xia)' }, { animal: 'Schlange', month: 'Mai (Li Xia → Mang Zhong)' },
  { animal: 'Pferd', month: 'Juni (Mang Zhong → Xiao Shu)' }, { animal: 'Ziege', month: 'Juli (Xiao Shu → Li Qiu)' },
  { animal: 'Affe', month: 'Aug. (Li Qiu → Bai Lu)' }, { animal: 'Hahn', month: 'Sep. (Bai Lu → Han Lu)' },
  { animal: 'Hund', month: 'Okt. (Han Lu → Li Dong)' }, { animal: 'Schwein', month: 'Nov. (Li Dong → Da Xue)' },
];
export const TEN_GODS_DE = {
  F: { name: 'Freund', short: 'Fr', rel: 'Gleiches Element, gleiche Polarität',
    desc: 'Gleichgestellte, Geschwister, Selbstständigkeit und Unabhängigkeit. Stärkt den Tagesmeister; zu viel davon kann Sturheit oder Konkurrenz bedeuten.' },
  RW: { name: 'Rivale', short: 'Ri', rel: 'Gleiches Element, entgegengesetzte Polarität',
    desc: 'Konkurrenten, kühnes Handeln, sozialer Antrieb und Risikobereitschaft. Unterstützt das Selbst, kann aber durch impulsive Ausgaben Reichtum „rauben“.' },
  EG: { name: 'Genießer', short: 'Ge', rel: 'Element, das ich hervorbringe, gleiche Polarität',
    desc: 'Kreativität, Genuss, Talent, Essen und entspannter Selbstausdruck. Ein sanftes Ventil für die Energie des Tagesmeisters.' },
  HO: { name: 'Rebell', short: 'Re', rel: 'Element, das ich hervorbringe, entgegengesetzte Polarität',
    desc: 'Brillanz, Auflehnung, Auftritt und Innovation. Stellt Autoritäten infrage; scharfe Zunge, starke Originalität.' },
  IW: { name: 'Indirekter Reichtum', short: 'iRt', rel: 'Element, das ich kontrolliere, gleiche Polarität',
    desc: 'Glücksfälle, Geschäfte, Gelegenheiten und Großzügigkeit. Reichtum durch Unternehmungen und Netzwerke.' },
  DW: { name: 'Direkter Reichtum', short: 'dRt', rel: 'Element, das ich kontrolliere, entgegengesetzte Polarität',
    desc: 'Festes Einkommen, Ersparnisse, Fleiß und Bodenständigkeit. Klassisch auch der Stern der Ehefrau im Horoskop eines Mannes.' },
  '7K': { name: 'Sieben Tötungen', short: '7T', rel: 'Element, das mich kontrolliert, gleiche Polarität',
    desc: 'Druck, Ehrgeiz, Mut und Macht. Treibt unter Stress zu Leistungen an; unkontrolliert bringt er Konflikte.' },
  DO: { name: 'Direkte Autorität', short: 'dA', rel: 'Element, das mich kontrolliert, entgegengesetzte Polarität',
    desc: 'Ordnung, Status, Verantwortung, Ansehen und Regeln. Klassisch auch der Stern des Ehemanns im Horoskop einer Frau.' },
  IR: { name: 'Indirekte Ressource', short: 'iRs', rel: 'Element, das mich hervorbringt, gleiche Polarität',
    desc: 'Intuition, unkonventionelles Lernen, Spiritualität und Alleinsein. Einsichtsvoll, manchmal zurückgezogen.' },
  DR: { name: 'Direkte Ressource', short: 'dRs', rel: 'Element, das mich hervorbringt, entgegengesetzte Polarität',
    desc: 'Unterstützung, Bildung, Mutter, Schutz und Geduld. Nährt und stärkt den Tagesmeister.' },
};
export const JIE_NAMES_DE = ['Li Chun – Frühlingsanfang', 'Jing Zhe – Erwachen der Insekten', 'Qing Ming – Klarheit und Helligkeit', 'Li Xia – Sommeranfang',
  'Mang Zhong – Ähren im Korn', 'Xiao Shu – Kleine Hitze', 'Li Qiu – Herbstanfang', 'Bai Lu – Weißer Tau', 'Han Lu – Kalter Tau',
  'Li Dong – Winteranfang', 'Da Xue – Großer Schnee', 'Xiao Han – Kleine Kälte'];
