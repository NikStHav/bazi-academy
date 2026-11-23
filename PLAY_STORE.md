# Publishing BaZi Academy on Google Play

> **Current plan: free app, published by NSH Holding GmbH.** `FREE_APP = true` in `www/js/premium.js`, and the billing plugin is
> not installed. So you can **skip** everything about in-app products, the payments/merchant profile and Premium texts below.
> Price: free · In-app purchases: none · Ads: none.

## 1. One-time setup

1. **Create a Google Play developer account** at <https://play.google.com/console> (one-time fee of US$25) as an **Organization** for NSH Holding GmbH.
   You need the GmbH's **D-U-N-S number**, the company website and a contact email/phone; Google verifies the company.
   (Organization accounts don't need the 12-testers/14-days closed test that new personal accounts require.)
   *(Only if you sell Premium later: under Settings → Payments profile, set up the GmbH's merchant account.)*
   Declare **trader status** (EU Digital Services Act): the company's address, phone and email are then shown on the store page.
2. **Create an upload key** (keep the file and passwords safe; you need them for every update):
   ```bash
   keytool -genkeypair -v -keystore bazi-upload.jks -alias bazi-upload \
     -keyalg RSA -keysize 2048 -validity 10000
   ```
   Google Play App Signing manages the actual app signing key. This file is only the *upload* key.
3. **Add the GitHub secrets** (repository → Settings → Secrets and variables → Actions):
   | Secret | Value |
   |---|---|
   | `ANDROID_KEYSTORE_BASE64` | output of `base64 -w0 bazi-upload.jks` |
   | `ANDROID_KEYSTORE_PASSWORD` | keystore password |
   | `ANDROID_KEY_ALIAS` | `bazi-upload` |
   | `ANDROID_KEY_PASSWORD` | key password |

   To build locally instead, create `android/keystore.properties` (it is gitignored):
   ```properties
   storeFile=/absolute/path/bazi-upload.jks
   storePassword=...
   keyAlias=bazi-upload
   keyPassword=...
   ```

## 2. Build the bundle

Run the workflow **BaZi Academy (Android)** (Actions tab → *Run workflow*) or push a tag such as `v1.0.0`.
Download the artifact `bazi-academy-release-aab`. Each run uses the run number as `versionCode`, so every upload has a higher version.
Bump `versionName` in `android/app/build.gradle` (and in the About screen in `www/js/app.js`) for user-visible versions.

## 3. Create the app in Play Console

### Premium in-app product (not needed while the app is free)

Play only lets you create in-app products after you have uploaded a build that contains the billing library, so first upload the `.aab` to the *Internal testing* track. Then go to **Monetize with Play → Products → In-app products → Create product**:
- Product ID: **`bazi_premium`** (must match `www/js/premium.js`)
- Name `BaZi Academy Premium`, description `All lessons, unlimited charts and detailed chart readings.`
- Price **€2.99**, then **Activate**.

To test without being charged, add your Google account under *Settings → License testing*.

- App name: **BaZi Academy – Four Pillars**
- Default language: English (United States)
- App or game: App · Free (no in-app purchases)
- Category: **Education** (alternative: Lifestyle)
- Package name: `app.baziacademy` (the reverse of the domain baziacademy.app). It is permanent after the first upload.

### Store listing

**Short description** (max. 80 characters):
> Learn Chinese astrology: Four Pillars, Five Elements, Ten Gods & chart calculator

**Full description:**
> Discover BaZi (八字), the Four Pillars of Destiny, one of the great classical systems of Chinese astrology, step by step.
>
> LEARN
> 15 clear lessons take you from the foundations to real chart analysis:
> • Yin & Yang and the Five Elements (Wood, Fire, Earth, Metal, Water)
> • The 10 Heavenly Stems and 12 Earthly Branches
> • The 60 Jiazi cycle and the solar calendar (solar terms)
> • Hidden stems, the Day Master and the Ten Gods
> • Seasonal strength, clashes and combinations, symbolic stars (Nobleman, Peach Blossom, Travelling Horse …), luck pillars, the useful god
> Every lesson includes interactive diagrams and a short quiz.
>
> CALCULATE
> An accurate Four Pillars calculator based on the real solar terms:
> • Year, month, day and hour pillars
> • Birthplace search: time zone, historical daylight saving and true solar time set automatically
> • Ten Gods for every stem and hidden stem
> • Five Elements balance and Day Master strength
> • Clashes, harmonies, punishments and harms
> • 10-year luck pillars with starting age
> • Growth stages (長生 cycle) of the Day Master in every pillar
> Tap any character to learn what it means.
>
> YOUR DAY PILLAR
> A personal profile for each of the 60 day pillars: character, strengths, relationships and the spouse palace.
>
> PRACTISE
> Endless quiz rounds on elements, stems, branches, hidden stems and Ten Gods.
>
> LOVE & COMPATIBILITY
> Compare two charts – Day Masters, spouse palaces, zodiac animals and element balance – or quickly check someone new by date of birth. Discover your ideal match: which Day Masters, zodiac animals and elements suit you best.
>
> YOUR DAY CARD
> Turn the wheel of the 60 days: it stops on today’s pillar and shows your day at a glance – stars, the theme of the day, what to do and what to avoid, lucky hours, colour and direction. Tap “Why?” to see the BaZi behind it, step by step.
>
> TODAY & ALMANAC
> Today’s pillars, the Day Officer of the traditional Chinese almanac (Tong Shu) with what the day suits and what to avoid, your personal clash days, and an optional daily tip notification. Plan weddings, moves, contracts, launches and journeys on good days.
>
> CHINESE CLOCK
> The 12 double hours (時辰) live: the current hour pillar, lucky hours of the day (Yellow and Black Path) and what each hour means for you.
>
> INFLUENCES & LIFE TIMELINE
> See how any day, month or year interacts with your chart, and your whole life at a glance: every luck pillar and year rated, with your current phase highlighted.
>
> LUNAR CALENDAR
> The Chinese lunar calendar with all 24 solar terms – equinoxes and solstices included – new and full moons with exact times, and traditional festivals such as Chinese New Year, Lantern, Dragon Boat and Mid-Autumn.
>
> YEAR AHEAD
> Your annual pillar and all 12 months: themes, best months and activated stars.
>
> CHARTS, SHARE & BACKUP
> Save charts for family, partners and friends in groups with notes. Share a chart as a beautiful image, export lunar dates to your phone calendar, and move everything to a new phone with a backup file.
>
> EASY TO USE
> A built-in guide shows how to get the most out of every feature. Adjustable text size, dark mode, English, German and Spanish.
>
> COMPLETELY FREE
> All 15 lessons, unlimited charts, the 60 day-pillar profiles, the detailed chart reading (core nature, favourable elements, weak spots and how to balance them, career, relationships, current luck phase), compatibility with your ideal match, the year-ahead forecast, life timeline, Chinese clock, almanac planner and lunar calendar – free, without ads or subscription.
>
> PRIVATE BY DESIGN
> Works completely offline. No account, no ads, no tracking. Your birth data never leaves your phone.
>
> BaZi is a traditional cultural system. This app is for education and entertainment and does not replace professional advice.

**Graphics** (in `resources/`):
- App icon 512×512: `play-icon-512.png`
- Feature graphic 1024×500: `feature-graphic.png`
- Phone screenshots: ready in `store-screenshots/en/android-phone/` (1080×1920). Google Play allows 8 phone screenshots: upload `1-day-card` to `8-compatibility` in order (leave out `9-life-timeline`).

### App content (Policy section)

| Item | Answer |
|---|---|
| Privacy policy URL | `https://baziacademy.app/privacy.html` (German: `https://baziacademy.app/datenschutz.html`). Enable GitHub Pages (Settings → Pages → Source **GitHub Actions**, then run the workflow *BaZi Academy (Website)*). Put your contact email into `docs/privacy.html` first. The repository must be **public** for free GitHub Pages; otherwise host the file anywhere else. |
| Ads | No ads |
| In-app purchases | No |
| App access | All functionality available without login |
| Content rating (IARC questionnaire) | Category "Reference, News, or Educational"; answer *No* to violence, sexuality, gambling and similar questions. Expected rating: Everyone / PEGI 3 / USK 0 |
| Target audience | 13+ (or 18+); not designed for children |
| Data safety | **No data collected, no data shared.** All data stays on the device and the app has no internet permission. The app contains no purchases |
| Government / financial / health app | No |

## 4. Release

1. *Testing → Closed testing*: create a track, upload the `.aab`, add testers (an email list or Google Group), and roll it out.
2. After the test period: *Production → Create new release*, upload the bundle or promote the tested release, then send it for review.
3. Review usually takes from a few days up to about a week for new apps.

## Updates

Change the code, run the workflow again, and upload the new `.aab` to a track. The `versionCode` increases automatically.

## German store listing (Deutsch)

In Play Console → *Grow users → Store presence → Main store listing* → **Manage translations → Add your own translations → German (de-DE)**, then paste:

**App name:** BaZi Academy – Vier Säulen

**Short description** (max. 80 characters):
> Chinesische Astrologie lernen: Vier Säulen, Fünf Elemente, Zehn Götter, Rechner

**Full description:**
> Entdecke BaZi (八字), die Vier Säulen des Schicksals – eines der großen klassischen Systeme der chinesischen Astrologie – Schritt für Schritt.
>
> LERNEN
> 15 klare Lektionen führen dich von den Grundlagen bis zur echten Horoskop-Deutung:
> • Yin & Yang und die Fünf Elemente (Holz, Feuer, Erde, Metall, Wasser)
> • Die 10 Himmelsstämme und 12 Erdzweige
> • Der 60er-Zyklus und der Sonnenkalender (Solarterme)
> • Verborgene Stämme, der Tagesmeister und die Zehn Götter
> • Stärke und Jahreszeiten, Zusammenstöße und Kombinationen, Symbolsterne (Edler, Pfirsichblüte, Reisepferd …), Glückssäulen, der Nützliche Gott
> Jede Lektion enthält interaktive Grafiken und ein kurzes Quiz.
>
> BERECHNEN
> Ein genauer Vier-Säulen-Rechner auf Basis der echten Solarterme:
> • Jahres-, Monats-, Tages- und Stundensäule
> • Geburtsort-Suche: Zeitzone, historische Sommerzeit und wahre Sonnenzeit werden automatisch gesetzt
> • Zehn Götter für jeden Stamm und verborgenen Stamm
> • Verteilung der Fünf Elemente und Stärke des Tagesmeisters
> • Zusammenstöße, Harmonien, Strafen und Schäden
> • Zehnjährige Glückssäulen mit Startalter
> • Wachstumsphasen (長生-Zyklus) des Tagesmeisters in jeder Säule
>
> DEINE TAGESSÄULE
> Ein persönliches Profil für jede der 60 Tagessäulen: Charakter, Stärken, Beziehungen und der Partnerpalast.
>
> DEINE TAGESKARTE
> Dreh das Rad der 60 Tage: Es hält auf der heutigen Säule und zeigt deinen Tag auf einen Blick – Sterne, das Thema des Tages, was du tun und lassen solltest, Glücksstunden, Farbe und Richtung. Tippe auf „Warum?“, um das BaZi dahinter Schritt für Schritt zu sehen.
>
> LIEBE & KOMPATIBILITÄT
> Vergleiche zwei Horoskope oder prüfe eine neue Bekanntschaft per Geburtsdatum. Entdecke deinen idealen Partner: welche Tagesmeister, Tierkreiszeichen und Elemente am besten zu dir passen.
>
> HEUTE, ALMANACH & MONDKALENDER
> Die Säulen des Tages, der Tagesbeamte des traditionellen chinesischen Almanachs (Tong Shu), deine persönlichen Zusammenstoß-Tage und ein optionaler Tagestipp. Der Mondkalender zeigt alle 24 Solarterme – inklusive Tagundnachtgleichen und Sonnenwenden –, Neu- und Vollmonde mit genauer Uhrzeit und traditionelle Feste. Erinnerungen und Export in deinen Kalender inklusive.
>
> CHINESISCHE UHR
> Die 12 Doppelstunden (時辰) live: die aktuelle Stundensäule, die Glücksstunden des Tages (Gelber und Schwarzer Pfad) und was jede Stunde für dich bedeutet.
>
> EINFLÜSSE & LEBENSZEITLEISTE
> Sieh, wie jeder Tag, Monat oder jedes Jahr auf dein Horoskop wirkt – und dein ganzes Leben auf einen Blick: alle Glückssäulen und Jahre bewertet, deine aktuelle Phase hervorgehoben.
>
> JAHRESVORSCHAU
> Deine Jahressäule und alle 12 Monate: Themen, beste Monate und aktivierte Sterne.
>
> HOROSKOPE, TEILEN & BACKUP
> Speichere Horoskope von Familie, Partnern und Freunden in Gruppen mit Notizen. Teile ein Horoskop als schönes Bild und übertrage alles per Backup-Datei auf ein neues Handy.
>
> EINFACH ZU BEDIENEN
> Eine eingebaute Anleitung zeigt, wie du jede Funktion optimal nutzt. Einstellbare Textgröße, dunkler Modus, Deutsch, Englisch und Spanisch.
>
> KOMPLETT KOSTENLOS
> Alle 15 Lektionen, unbegrenzte Horoskope, die 60 Tagessäulen-Profile, die ausführliche Deutung (Wesenskern, günstige Elemente, Schwachstellen und ihr Ausgleich, Beruf, Beziehungen, aktuelle Glücksphase), Kompatibilität mit deinem idealen Partner, Jahresvorschau, Lebenszeitleiste, Chinesische Uhr, Almanach-Planer und Mondkalender – kostenlos, ohne Werbung und ohne Abo.
>
> PRIVAT VON ANFANG AN
> Funktioniert komplett offline. Kein Konto, keine Werbung, kein Tracking. Deine Geburtsdaten verlassen nie dein Handy.
>
> BaZi ist ein traditionelles Kultursystem. Diese App dient der Bildung und Unterhaltung und ersetzt keine professionelle Beratung.

**Screenshots:** ready in `store-screenshots/de/android-phone/` (1080×1920). Upload `1-day-card` to `8-compatibility` under the German translation.

## Spanish store listing (Español)

In Play Console → *Main store listing* → **Manage translations → Add your own translations**, add **Spanish (Latin America) es-419**, **Spanish (Spain) es-ES** and **Spanish (United States) es-US**, and paste the same texts into all three. The texts use neutral Spanish that works in all three markets.

**App name:** BaZi Academy: Cuatro Pilares

**Short description** (max. 80 characters):
> Aprende astrología china: Cuatro Pilares, Cinco Elementos y Diez Dioses

**Full description:**
> Descubre paso a paso el BaZi (八字), los Cuatro Pilares del Destino, uno de los grandes sistemas clásicos de la astrología china.
>
> APRENDE
> 15 lecciones claras te llevan de los fundamentos al análisis real de una carta:
> • El Yin y el Yang y los Cinco Elementos (Madera, Fuego, Tierra, Metal, Agua)
> • Los 10 Tallos Celestiales y las 12 Ramas Terrestres
> • El ciclo de los 60 Jiazi y el calendario solar (términos solares)
> • Los tallos ocultos, el Maestro del Día y los Diez Dioses
> • Fuerza estacional, choques y combinaciones, estrellas simbólicas (Noble Celestial, Flor de Melocotón, Caballo Viajero …), pilares de la suerte, el Dios Útil
> Cada lección incluye diagramas interactivos y un cuestionario, y puedes practicar con rondas de preguntas infinitas.
>
> CALCULA
> Una calculadora precisa de los Cuatro Pilares basada en los términos solares reales:
> • Pilares del año, del mes, del día y de la hora
> • Búsqueda del lugar de nacimiento: zona horaria, horario de verano histórico y hora solar verdadera, automáticamente
> • Los Diez Dioses de cada tallo y tallo oculto
> • Equilibrio de los Cinco Elementos y fuerza del Maestro del Día
> • Choques, armonías, castigos y daños
> • Pilares de la suerte de 10 años con edad de inicio
> • Fases de crecimiento (ciclo 長生) del Maestro del Día en cada pilar
> Toca cualquier carácter para saber lo que significa.
>
> TU PILAR DEL DÍA
> Un perfil personal para cada uno de los 60 pilares del día: carácter, fortalezas, relaciones y el palacio de la pareja.
>
> TU CARTA DEL DÍA
> Gira la rueda de los 60 días: se detiene en el pilar de hoy y te muestra tu día de un vistazo – estrellas, el tema del día, qué hacer y qué evitar, horas de suerte, color y dirección. Toca «¿Por qué?» para ver paso a paso el BaZi que hay detrás.
>
> AMOR Y COMPATIBILIDAD
> Compara dos cartas – Maestros del Día, palacios de la pareja, animales del zodiaco y equilibrio de elementos – o comprueba rápidamente a alguien nuevo con su fecha de nacimiento. Descubre tu pareja ideal: qué Maestros del Día, animales y elementos te convienen más.
>
> HOY Y ALMANAQUE
> Los pilares del día, el Oficial del Día del almanaque chino tradicional (Tong Shu) con lo que favorece y lo que conviene evitar, tus días de choque personales y un consejo diario opcional. Planifica bodas, mudanzas, contratos, lanzamientos y viajes en días buenos.
>
> RELOJ CHINO
> Las 12 horas dobles (時辰) en directo: el pilar de la hora actual, las horas de suerte del día (Camino Amarillo y Negro) y lo que significa cada hora para ti.
>
> INFLUENCIAS Y LÍNEA DE LA VIDA
> Mira cómo cualquier día, mes o año interactúa con tu carta, y toda tu vida de un vistazo: cada pilar de la suerte y cada año valorados, con tu fase actual resaltada.
>
> CALENDARIO LUNAR
> El calendario lunar chino con los 24 términos solares – equinoccios y solsticios incluidos –, lunas nuevas y llenas con hora exacta y fiestas tradicionales como el Año Nuevo Chino, la Fiesta de los Faroles, el Bote del Dragón y el Medio Otoño. Con recordatorios y exportación a tu calendario.
>
> EL AÑO POR DELANTE
> Tu pilar anual y los 12 meses: temas, mejores meses y estrellas activadas.
>
> CARTAS, COMPARTIR Y COPIA DE SEGURIDAD
> Guarda cartas de familia, parejas y amigos en grupos con notas. Comparte una carta como una bonita imagen y pásalo todo a un teléfono nuevo con un archivo de copia de seguridad.
>
> FÁCIL DE USAR
> Una guía integrada te muestra cómo sacar el máximo partido de cada función. Tamaño del texto ajustable, modo oscuro, español, inglés y alemán.
>
> COMPLETAMENTE GRATIS
> Todas las lecciones, cartas ilimitadas, la lectura detallada, la compatibilidad, la previsión del año, la línea de la vida, el almanaque y el calendario lunar – gratis, sin anuncios ni suscripción.
>
> PRIVADA POR DISEÑO
> Funciona completamente sin conexión. Sin cuenta, sin anuncios, sin seguimiento. Tus datos de nacimiento nunca salen de tu teléfono.
>
> El BaZi es un sistema cultural tradicional. Esta app tiene fines educativos y de entretenimiento y no sustituye el asesoramiento profesional.

**Screenshots:** ready in `store-screenshots/es/android-phone/` (1080×1920). Upload `1-day-card` to `8-compatibility`.
