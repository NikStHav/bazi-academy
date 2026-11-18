// German content for almanac.js, shensha.js, forecast.js, compat.js, lunar.js
export const OFFICERS = [
  { name: 'Errichten', good: 'Neue Pläne beginnen, eine Stelle antreten, Reisen', avoid: 'Graben, Erdarbeiten, Lager öffnen', desc: 'Der Tag der Anfänge – die Energie ist frisch und durchsetzungsstark.' },
  { name: 'Entfernen', good: 'Putzen, Ausmisten, schlechte Gewohnheiten beenden, Gesundheitsroutinen', avoid: 'Hochzeiten, große Anschaffungen', desc: 'Ein Tag, um Altes auszuräumen und Platz für Neues zu schaffen.' },
  { name: 'Fülle', good: 'Feiern, ein Geschäft eröffnen, Handel, Zusammenkünfte', avoid: 'Rechtsstreitigkeiten, eine neue Stelle antreten', desc: 'Fülle und Überfluss – gut für Zusammenkünfte und Handel.' },
  { name: 'Ausgleich', good: 'Reparaturen, Routinearbeit, Streichen, Einebnen', avoid: 'Große neue Vorhaben, Hochzeiten', desc: 'Ein gleichmäßiger, gewöhnlicher Tag – am besten für Instandhaltung und Routine.' },
  { name: 'Festigen', good: 'Hochzeiten, Verträge unterschreiben, Kaufen, Ziele setzen', avoid: 'Rechtsstreitigkeiten, lange Reisen', desc: 'Festlegen und Festigen – was heute vereinbart wird, hat oft Bestand.' },
  { name: 'Ergreifen', good: 'Bau beginnen, Einstellen, Pflanzen, Unterschreiben', avoid: 'Umzug, Reisen, ein Geschäft eröffnen', desc: 'Ergreifen und Halten – gut, um einen Plan entschlossen anzugehen.' },
  { name: 'Zerstören', good: 'Abriss, schlechte Gewohnheiten brechen, Dinge bewusst beenden', avoid: 'Hochzeiten, Verträge, Eröffnungen, Umzug', desc: 'Der Tag gegenüber dem Monat – Dinge brechen auseinander. Vermeide wichtige Anfänge.' },
  { name: 'Gefahr', good: 'Gebet, sorgfältige Detailarbeit, Meditation', avoid: 'Riskante Unternehmungen, Klettern, Segeln', desc: 'Heikel, aber günstig, wenn du achtsam handelst.' },
  { name: 'Erfolg', good: 'Fast alles: Hochzeiten, Eröffnungen, Umzug, Verträge, Reisen', avoid: 'Rechtsstreitigkeiten', desc: 'Einer der besten Tage des Zyklus – Bemühungen kommen zum Abschluss.' },
  { name: 'Empfangen', good: 'Schulden eintreiben, Ernten, Kaufen, Einlagern', avoid: 'Reisen, medizinische Eingriffe, Beerdigungen', desc: 'Ein Tag, um einzusammeln, was einem zusteht.' },
  { name: 'Öffnen', good: 'Ein Geschäft eröffnen, Hochzeiten, ein Studium beginnen, Reisen, Umzug', avoid: 'Beerdigungen, Angelegenheiten abschließen', desc: 'Türen öffnen sich – hervorragend für Starts und Anfänge.' },
  { name: 'Schließen', good: 'Geld sparen, Konten schließen, Mauern bauen', avoid: 'Eröffnungen, Reisen, etwas Neues beginnen', desc: 'Dinge werden versiegelt – ein Tag für Ruhe und Abschlüsse, nicht für Anfänge.' },
];
export const RATING_LABEL = { best: 'Sehr gut', good: 'Gut', fair: 'Neutral', bad: 'Ungünstig' };
export const ACTIVITIES = ['Hochzeit oder Verlobung', 'Umzug', 'Vertrag unterschreiben', 'Geschäftseröffnung oder Start', 'Reiseantritt', 'Renovierung oder Bau'];

export const STARS = {
  noble: { name: 'Edler', desc: 'Hilfreiche Menschen und Schutz – Unterstützung erscheint, wenn du sie am meisten brauchst.',
    pillar: { year: 'Hilfe von Familie, Älteren und Gesellschaft', month: 'Mentoren und unterstützende Vorgesetzte', day: 'einen unterstützenden Partner; du wirst persönlich gefördert', hour: 'hilfsbereite Kinder, Schüler oder Unterstützung im Alter' } },
  peach: { name: 'Pfirsichblüte', desc: 'Charme, Anziehung und Beliebtheit – Romantik, Geselligkeit und künstlerischer Geschmack.',
    pillar: { year: 'frühe Beliebtheit und soziale Leichtigkeit', month: 'Ausstrahlung im Beruf und im Freundeskreis', day: 'starke romantische Anziehung in engen Beziehungen', hour: 'späte Liebe; eine innere romantische Seite' } },
  horse: { name: 'Reisepferd', desc: 'Bewegung, Reisen, Umzüge und Wandel – rastlose Energie, die an neuen Orten aufblüht.',
    pillar: { year: 'Umzüge oder Reisen in der Kindheit', month: 'Berufe mit Reisen oder häufigem Wechsel', day: 'einen mobilen Lebensstil; einen Partner aus der Ferne', hour: 'Reisen und Umzüge im späteren Leben' } },
  academic: { name: 'Gelehrtenstern', desc: 'Intelligenz, Lernen und Schreiben – Erfolg in Studium, Prüfungen und geistiger Arbeit.',
    pillar: { year: 'einen gebildeten familiären Hintergrund', month: 'beruflichen Erfolg durch Qualifikationen', day: 'einen scharfen, lernfreudigen Verstand', hour: 'kluge Kinder; lebenslanges Lernen' } },
  canopy: { name: 'Baldachin', desc: 'Kunst, Spiritualität und Alleinsein – Tiefe, Originalität und Interesse an Metaphysik.',
    pillar: { year: 'spirituelle oder künstlerische Wurzeln', month: 'kreative oder spezialisierte Arbeit', day: 'ein unabhängiges, nach innen gekehrtes Wesen', hour: 'spirituelle Interessen, die mit dem Alter wachsen' } },
  prosperity: { name: 'Wohlstandsstern', desc: 'Stabile Ressourcen und selbst verdientes Einkommen – das eigene „Gehalt“ des Tagesmeisters.',
    pillar: { year: 'ein solides familiäres Fundament', month: 'stetiges Einkommen aus Arbeit', day: 'Selbstständigkeit und gute Gesundheit', hour: 'Sicherheit im späteren Leben' } },
  blade: { name: 'Ziegenklinge', desc: 'Starke Willenskraft und Mut – eine scharfe Klinge, die Disziplin braucht, um gut genutzt zu werden.',
    pillar: { year: 'willensstarke familiäre Einflüsse', month: 'einen wettbewerbsorientierten, intensiven Berufsantrieb', day: 'eine kraftvolle Persönlichkeit; das Temperament braucht Pflege', hour: 'Entschlossenheit im späteren Leben' } },
  void: { name: 'Leere', desc: 'Leere – was in dieser Säule steht, fühlt sich weniger greifbar an; stark für spirituelle oder kreative Arbeit, schwächer für materielle Dinge.',
    pillar: { year: 'Distanz zu den familiären Wurzeln', month: 'Berufswechsel oder unkonventionelle Wege', day: 'Unabhängigkeit; Beziehungen brauchen besondere Pflege', hour: 'ungewöhnliche Pläne; weniger Bindungen im Alter' } },
};

export const MONTH_TEXT = {
  F: 'Unabhängigkeit und Gleichgesinnte – gut für Teamarbeit auf Augenhöhe und eigene Projekte.',
  RW: 'Wettbewerbsfreudig und energiegeladen – handle mutig, aber achte auf Geld und Partnerschaften.',
  EG: 'Entspannt und kreativ – genieße, ruh dich aus, koche, erschaffe etwas.',
  HO: 'Ausdrucksstark und rastlos – großartig für Ideen und Präsentationen; sei diplomatisch.',
  IW: 'Chancen und Netzwerke – Nebengeschäfte, Verkauf, Großzügigkeit.',
  DW: 'Stetige Arbeit und Einnahmen – plane dein Budget, spare, erledige Aufgaben.',
  '7K': 'Druck und Herausforderungen – stell dich ihnen, aber vermeide Konflikte und Überarbeitung.',
  DO: 'Anerkennung und Verantwortung – Formales, Bewerbungen, Verpflichtungen.',
  IR: 'Reflexion und Lernen – Recherche, Intuition, Zeit für dich.',
  DR: 'Unterstützung und Lernen – Mentoren, Kurse, Erholung und Familie.',
};

export const ROLE = {
  F: 'ein ebenbürtiger Freund – eine Bindung wie unter Freunden', RW: 'ein lebhafter Rivale-Partner, der dich herausfordert und belebt',
  EG: 'jemand, den du gern umsorgst und mit dem du entspannst', HO: 'jemand, der deine ausdrucksstarke, rebellische Seite hervorlockt',
  IW: 'eine aufregende Quelle von Chancen und Spaß', DW: 'ein beständiger, praktischer Partner – klassisch der Ehefrau-Stern für Männer',
  '7K': 'eine starke, fordernde Präsenz, die dich antreibt', DO: 'ein stabilisierender, verantwortungsvoller Einfluss – klassisch der Ehemann-Stern für Frauen',
  IR: 'ein unkonventioneller Lehrer und Denkpartner', DR: 'ein fürsorglicher Unterstützer, bei dem du dich sicher fühlst',
};

export const SOLAR_TERM_NAMES = { 315: 'Frühlingsanfang', 330: 'Regenwasser', 345: 'Erwachen der Insekten', 0: 'Frühlings-Tagundnachtgleiche',
  15: 'Klarheit und Helligkeit', 30: 'Saatregen', 45: 'Sommeranfang', 60: 'Kleine Fülle', 75: 'Ähren im Korn', 90: 'Sommersonnenwende',
  105: 'Kleine Hitze', 120: 'Große Hitze', 135: 'Herbstanfang', 150: 'Ende der Hitze', 165: 'Weißer Tau', 180: 'Herbst-Tagundnachtgleiche',
  195: 'Kalter Tau', 210: 'Reiffall', 225: 'Winteranfang', 240: 'Kleiner Schnee', 255: 'Großer Schnee', 270: 'Wintersonnenwende',
  285: 'Kleine Kälte', 300: 'Große Kälte' };

export const FESTIVALS = {
  '春节': ['Chinesisches Neujahr', 'Das Frühlingsfest – der Beginn des Mondjahres, gefeiert mit Familie, roter Dekoration und Feuerwerk.'],
  '元宵节': ['Laternenfest', 'Der erste Vollmond des Jahres – Laternen, Rätsel und süße Reisbällchen (Tangyuan).'],
  '龙抬头': ['Der Drache hebt den Kopf', 'Der Drache erwacht – traditionell ein Tag zum Haareschneiden und um den Frühlingsregen zu begrüßen.'],
  '端午节': ['Drachenbootfest', 'Drachenbootrennen und Zongzi-Reisklöße, zum Gedenken an den Dichter Qu Yuan.'],
  '七夕': ['Qixi-Fest', 'Das Treffen von Kuhhirte und Weberin – das chinesische Fest der Liebe.'],
  '中元节': ['Geisterfest', 'Ein Tag, um die Ahnen zu ehren und umherirrende Geister zu besänftigen.'],
  '中秋节': ['Mondfest', 'Der Erntevollmond – Familientreffen und Mondkuchen.'],
  '重阳节': ['Doppelneunfest', 'Ein Tag, um Anhöhen zu besteigen, für Chrysanthemen und um ältere Menschen zu ehren.'],
  '腊八节': ['Laba-Fest', 'Man isst Laba-Brei – der Beginn der Neujahrsvorbereitungen.'],
  '除夕': ['Silvester des Mondjahres', 'Das Familienessen am letzten Abend des Mondjahres.'],
  '清明节': ['Qingming-Fest', 'Totengedenktag – Familien besuchen und pflegen die Gräber ihrer Ahnen.'],
  '冬至': ['Wintersonnenwende-Fest', 'Dongzhi – der Wendepunkt von Yin und Yang, gefeiert mit Teigtaschen oder Tangyuan.'],
};
