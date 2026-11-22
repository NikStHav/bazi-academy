// "How to use the app" guide. Each section: [icon, title, html]. Links use the app's routes.
import { lang } from './i18n.js';

const EN = [
  ['🚀', 'Start with your own chart', `
<ol><li>Open the <a href="#/chart">Chart</a> tab and enter your <b>birth date, time and birthplace</b>. Pick the place from the list – the app then sets the correct time zone, historical daylight saving time and true solar time.</li>
<li>Tick <b>“This is my own chart”</b> (★). Many features – Today, the Chinese clock, reminders, your ideal match – are personalised to this chart.</li>
<li>Don’t know your birth time? Tick “Birth time unknown”: you get three pillars, which is still a lot.</li></ol>`],
  ['🔎', 'Read your chart', `
<ul><li><b>Tap any character</b> (stem, branch, Ten God) to see what it means – the chart is your best textbook.</li>
<li>The small letters under the branches are the <b>Ten Gods of the hidden stems</b> (e.g. DR = Direct Resource).</li>
<li>Read the cards from top to bottom: <b>Day Master</b> (who you are) → <b>day pillar</b> (your “seat” and growth stages) → <b>Five Elements</b> → <b>interactions</b> → <b>symbolic stars</b> → <b>luck pillars</b>.</li>
<li>The <b>detailed reading</b> ties it together: favourable elements, Ten Gods profile, career, relationships, weak spots and how to balance them.</li></ul>`],
  ['🎓', 'Learn BaZi step by step', `
<ul><li>Work through the <a href="#/learn">15 lessons</a> in order – each builds on the previous one. The diagrams are interactive: tap elements, stems and branches.</li>
<li>Finish each lesson with <b>“Check yourself”</b>. A lesson counts as completed when at least half the answers are right.</li>
<li>Practise a few minutes a day in the <a href="#/quiz">Quiz</a> tab – every round is newly generated. Start with Five Elements and Stems, then move to Hidden Stems and Ten Gods.</li>
<li>Tip: after each lesson, look for the topic in your own chart.</li></ul>`],
  ['☀️', 'Use it every day', `
<ul><li><a href="#/today">Today</a> shows the day’s pillars, what the day means for you, the <b>Chinese clock</b> with today’s lucky hours, and the <b>almanac</b> (what the day suits and what to avoid).</li>
<li>Turn on the <b>daily tip</b> on the Today screen to get a short note about each day’s energy.</li>
<li>The <a href="#/calendar">Calendar</a> tab shows lunar dates, solar terms, new and full moons and festivals. Tap any day for its details.</li></ul>`],
  ['🧭', 'Plan ahead', `
<ul><li><b>Influences</b> (on every chart): pick any date and time to see how its year, month, day and hour pillars affect the chart – ideal for appointments, travel or decisions.</li>
<li><b>Year ahead</b>: the theme of the year and all 12 months with ratings and best months.</li>
<li><b>Life timeline</b>: all luck pillars and years at a glance – understand the big phases of life.</li>
<li><a href="#/almanac">Almanac planner</a>: find good days for weddings, moving, contracts, launches, travel or renovation.</li></ul>`],
  ['💞', 'Relationships', `
<ul><li><a href="#/match">Compatibility</a>: compare two saved charts – Day Masters, spouse palaces, zodiac animals and element balance.</li>
<li><b>Your ideal match</b>: which Day Masters, zodiac animals and elements suit you.</li>
<li><b>Quick check</b>: just met someone? Enter their date of birth – nothing is saved.</li></ul>`],
  ['🗂️', 'Organise, share and keep safe', `
<ul><li>Give charts a <b>group</b> (family, friends, clients …) and <b>notes</b>, then search and sort them in the Chart tab.</li>
<li>Use notes like a journal: write down important events and compare them with the chart, the year and the luck pillar – the best way to test BaZi against real life.</li>
<li><b>Share as image</b> sends a chart card to friends.</li>
<li><b>Reminders</b> and <b>Add to your calendar</b> (Calendar tab) bring full moons, solstices and festivals into your phone’s calendar.</li>
<li>Back up regularly: <a href="#/about">About</a> → <b>Export</b>. On a new phone, use <b>Import</b>. You can also switch the language there.</li></ul>`],
  ['🗓️', 'Suggested routines', `
<ul><li><b>Daily (2 minutes):</b> Today screen → day energy, lucky hours, almanac; one quiz round.</li>
<li><b>Weekly:</b> one lesson; look at the next 7 days in the almanac; add notes about the week to your chart.</li>
<li><b>Monthly:</b> check the new solar month in the Year ahead and the Calendar.</li>
<li><b>Before big decisions:</b> Influences for the date + almanac planner.</li>
<li><b>Once a year (around Li Chun, early February):</b> read your Year ahead and your Life timeline.</li></ul>
<p class="note">BaZi describes tendencies for reflection – your choices shape your life.</p>`],
];

const DE = [
  ['🚀', 'Beginne mit deinem eigenen Horoskop', `
<ol><li>Öffne den Tab <a href="#/chart">Horoskop</a> und gib <b>Geburtsdatum, Uhrzeit und Geburtsort</b> ein. Wähle den Ort aus der Liste – dann setzt die App Zeitzone, historische Sommerzeit und wahre Sonnenzeit korrekt.</li>
<li>Setze den Haken bei <b>„Das ist mein eigenes Horoskop“</b> (★). Viele Funktionen – Heute, die Chinesische Uhr, Erinnerungen, dein idealer Partner – richten sich nach diesem Horoskop.</li>
<li>Geburtszeit unbekannt? Setze den Haken „Geburtszeit unbekannt“: Du erhältst drei Säulen, und das ist schon eine Menge.</li></ol>`],
  ['🔎', 'Dein Horoskop lesen', `
<ul><li><b>Tippe auf jedes Zeichen</b> (Stamm, Zweig, Zehn Götter), um seine Bedeutung zu sehen – dein Horoskop ist dein bestes Lehrbuch.</li>
<li>Die kleinen Buchstaben unter den Zweigen sind die <b>Zehn Götter der verborgenen Stämme</b> (z. B. dRs = Direkte Ressource).</li>
<li>Lies die Karten von oben nach unten: <b>Tagesmeister</b> (wer du bist) → <b>Tagessäule</b> (dein „Sitz“ und die Wachstumsphasen) → <b>Fünf Elemente</b> → <b>Wechselwirkungen</b> → <b>Symbolsterne</b> → <b>Glückssäulen</b>.</li>
<li>Die <b>ausführliche Deutung</b> fügt alles zusammen: günstige Elemente, Zehn-Götter-Profil, Beruf, Beziehungen, Schwachstellen und ihr Ausgleich.</li></ul>`],
  ['🎓', 'BaZi Schritt für Schritt lernen', `
<ul><li>Arbeite die <a href="#/learn">15 Lektionen</a> der Reihe nach durch – jede baut auf der vorherigen auf. Die Grafiken sind interaktiv: Tippe auf Elemente, Stämme und Zweige.</li>
<li>Schließe jede Lektion mit <b>„Teste dich“</b> ab. Eine Lektion gilt als abgeschlossen, wenn mindestens die Hälfte der Antworten stimmt.</li>
<li>Übe täglich ein paar Minuten im Tab <a href="#/quiz">Quiz</a> – jede Runde wird neu erzeugt. Beginne mit den Fünf Elementen und Stämmen, dann folgen verborgene Stämme und Zehn Götter.</li>
<li>Tipp: Suche nach jeder Lektion das Thema in deinem eigenen Horoskop.</li></ul>`],
  ['☀️', 'Jeden Tag nutzen', `
<ul><li><a href="#/today">Heute</a> zeigt die Säulen des Tages, was der Tag für dich bedeutet, die <b>Chinesische Uhr</b> mit den heutigen Glücksstunden und den <b>Almanach</b> (wofür sich der Tag eignet und was du meiden solltest).</li>
<li>Schalte auf dem Heute-Bildschirm den <b>Tagestipp</b> ein, um jeden Tag eine kurze Notiz zur Tagesenergie zu bekommen.</li>
<li>Der Tab <a href="#/calendar">Kalender</a> zeigt Monddaten, Solarterme, Neu- und Vollmonde sowie Feste. Tippe auf einen Tag für Details.</li></ul>`],
  ['🧭', 'Vorausplanen', `
<ul><li><b>Einflüsse</b> (bei jedem Horoskop): Wähle ein beliebiges Datum mit Uhrzeit und sieh, wie Jahres-, Monats-, Tages- und Stundensäule auf das Horoskop wirken – ideal für Termine, Reisen oder Entscheidungen.</li>
<li><b>Jahresvorschau</b>: das Thema des Jahres und alle 12 Monate mit Bewertung und besten Monaten.</li>
<li><b>Lebenszeitleiste</b>: alle Glückssäulen und Jahre auf einen Blick – verstehe die großen Lebensphasen.</li>
<li><a href="#/almanac">Almanach-Planer</a>: finde gute Tage für Hochzeit, Umzug, Verträge, Eröffnungen, Reisen oder Renovierung.</li></ul>`],
  ['💞', 'Beziehungen', `
<ul><li><a href="#/match">Kompatibilität</a>: Vergleiche zwei gespeicherte Horoskope – Tagesmeister, Partnerpaläste, Tierkreiszeichen und Elemente-Ausgleich.</li>
<li><b>Dein idealer Partner</b>: welche Tagesmeister, Tierkreiszeichen und Elemente zu dir passen.</li>
<li><b>Schnellcheck</b>: Gerade jemanden kennengelernt? Gib das Geburtsdatum ein – nichts wird gespeichert.</li></ul>`],
  ['🗂️', 'Ordnen, teilen und sichern', `
<ul><li>Gib Horoskopen eine <b>Gruppe</b> (Familie, Freunde, Klienten …) und <b>Notizen</b> und suche und sortiere sie im Tab Horoskop.</li>
<li>Nutze die Notizen wie ein Tagebuch: Halte wichtige Ereignisse fest und vergleiche sie mit Horoskop, Jahr und Glückssäule – so prüfst du BaZi am besten am echten Leben.</li>
<li><b>Als Bild teilen</b> schickt eine Horoskop-Karte an Freunde.</li>
<li><b>Erinnerungen</b> und <b>In deinen Kalender übernehmen</b> (Tab Kalender) bringen Vollmonde, Sonnenwenden und Feste in den Kalender deines Handys.</li>
<li>Sichere regelmäßig: <a href="#/about">Über die App</a> → <b>Exportieren</b>. Auf einem neuen Handy nutzt du <b>Importieren</b>. Dort kannst du auch die Sprache wechseln.</li></ul>`],
  ['🗓️', 'Empfohlene Routinen', `
<ul><li><b>Täglich (2 Minuten):</b> Heute → Tagesenergie, Glücksstunden, Almanach; eine Quiz-Runde.</li>
<li><b>Wöchentlich:</b> eine Lektion; die nächsten 7 Tage im Almanach ansehen; Notizen zur Woche in deinem Horoskop festhalten.</li>
<li><b>Monatlich:</b> den neuen Sonnenmonat in der Jahresvorschau und im Kalender ansehen.</li>
<li><b>Vor großen Entscheidungen:</b> Einflüsse für das Datum + Almanach-Planer.</li>
<li><b>Einmal im Jahr (um Li Chun, Anfang Februar):</b> deine Jahresvorschau und deine Lebenszeitleiste lesen.</li></ul>
<p class="note">BaZi beschreibt Tendenzen zum Nachdenken – deine Entscheidungen gestalten dein Leben.</p>`],
];

export const GUIDE = lang === 'de' ? DE : EN;
