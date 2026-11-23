# BaZi Academy – Android & iPhone app

An offline app for Android and iPhone for learning Chinese astrology according to **BaZi (八字, Four Pillars of Destiny)**.

## Features

- **Learn**: 15 lessons from the basics to analysis: Yin/Yang, the Five Elements, the 10 Heavenly Stems, the 12 Earthly Branches, the 60 Jiazi cycle, building the pillars, hidden stems, the Day Master, the Ten Gods, seasonal strength, branch interactions, luck pillars, and symbolic stars and the useful god. Lessons include interactive diagrams and a short quiz each.
- **Chart**: a full Four Pillars calculator:
  - birthplace search (offline list of 25,000+ cities, GeoNames CC BY 4.0) that sets the historical time zone, daylight saving time and true solar time automatically
  - year and month pillars from the real solar terms (sun longitude, Li Chun as the start of the year)
  - day and hour pillars, with an optional late Zi hour rule and optional true solar time (birthplace longitude)
  - Ten Gods for every stem and hidden stem, element balance, Day Master strength and season phase
  - clashes, combinations, punishments and harms
  - 10-year luck pillars with starting age
  - charts are saved on the device; you can mark one as "my chart"
- **Quiz**: endless, generated questions in 5 categories plus a mixed mode, with best scores.
- **Free:** the app is currently published completely free (`FREE_APP = true` in `www/js/premium.js`, billing plugin not installed). To sell Premium again: set `FREE_APP = false`, run `npm install --save-exact @capgo/native-purchases@8.9.6 && npx cap sync`, and follow the in-app-purchase sections of the store guides.
- **Premium** (dormant; one-time in-app purchase, €2.99): lessons 8–14, unlimited chart calculations (5 are free) and a detailed chart reading. It uses StoreKit 2 / Google Play Billing on the device (`@capgo/native-purchases`), with no server. Product ID `bazi_premium`, set in `www/js/premium.js`.
- **Compatibility**: compare two saved charts, quick check by date of birth, "your ideal match" (Day Masters, zodiac animals with birth years, elements). The full analysis is Premium.
- **Almanac (Tong Shu)**: the 12 Day Officers, clash animal and personal clash days; the planner ("find a good day for…") is Premium.
- **Daily tip**: optional local notifications, scheduled on the device for a rolling 30 days.
- **Share**: the chart as a PNG image through the share sheet.
- **Welcome flow** on first start: birth data → your chart and three key insights.
- **Year ahead** (Premium): annual pillar and 12 solar months with ratings, best months and activated symbolic stars.
- **Backup**: export/import charts and progress as a JSON file (About screen).
- **Lunar calendar** (Calendar tab): Chinese lunar dates incl. leap months, all 24 solar terms (equinoxes, solstices), new and full moons, traditional festivals; tap a day for its pillar, almanac officer and moon phase. Sun: truncated VSOP87 (~1″), moon phases: Meeus ch. 49.
- **Reminders & calendar export** (Calendar tab): optional local notifications for full/new moons, equinoxes & solstices, solar terms and festivals (evening before, morning of, or exact time); export as an .ics file, or subscribe to the feeds in `docs/calendar/` (served by GitHub Pages; regenerate with `node tools/build-calendar-feeds.mjs 2025 2035`).
- **Impressum:** publisher details in `www/js/publisher.js` (About screen) and `docs/impressum.html`.
- **Today**: today's pillars, the next solar term, and how today relates to your own Day Master.
- Fully offline, no tracking, light and dark mode.
- **Languages:** English and German, following the phone's language (switchable under About → Language). UI texts use English source strings as keys (`t('…')` in `www/js/i18n.js`, German in `www/js/i18n/`); `node tools/i18n-keys.cjs --missing de` lists untranslated texts, and the tests fail if one is missing.

## Tech

Plain HTML/CSS/JavaScript (ES modules, no build step) in `www/`, wrapped as native Android and iOS apps with
[Capacitor 8](https://capacitorjs.com) (target SDK 36).

```
www/js/bazi.js     calculation engine (pure functions, unit tested)
www/js/data.js     stems, branches, elements, ten gods, solar terms
www/js/lessons.js  course content
www/js/quiz.js     question generators
www/js/reading.js  detailed chart reading (Premium)
www/js/premium.js  in-app purchase, free limits
www/js/places.js   birthplace search, historical UTC offsets (Intl)
www/js/cities-data.js  generated city list: node tools/build-cities.cjs <dir with all-the-cities + tz-lookup>
www/js/compat.js   compatibility and ideal match
www/js/shensha.js  symbolic stars (神煞)
www/js/forecast.js year-ahead forecast (流年)
www/js/backup.js   export/import
www/js/lunar.js    lunar calendar, moon phases, 24 solar terms, festivals
www/js/vsop.js     precise solar longitude (VSOP87)
www/js/almanac.js  Tong Shu day officers, good-day finder
www/js/notify.js   daily tip notifications
www/js/share.js    chart image rendering and sharing
www/js/app.js      UI and router
test/              node:test unit tests
android/           Capacitor Android project
ios/               Capacitor iOS project (Xcode, Swift Package Manager)
resources/         icon, splash and Play Store graphics
docs/privacy.html  privacy policy (for GitHub Pages)
```

## Develop

```bash
npm install
npm test             # engine and quiz tests
npm run serve        # open http://localhost:8080 in a browser (use the phone emulation in devtools)
                     # in the browser, "Unlock Premium" simulates the purchase; reset with localStorage.clear()
```

## Build for Android

You need Android Studio (or the Android SDK) and JDK 21.

```bash
npm run sync                       # copy www/ into the Android and iOS projects
npx cap open android               # open in Android Studio, run it on a device or emulator
npm run build:apk                  # debug APK -> android/app/build/outputs/apk/debug/
npm run build:aab                  # signed release bundle (see PLAY_STORE.md)
```

After you change the icon (`www/img/icon.svg` → `resources/*.png`), run `npm run assets`.

## Build for iPhone

You need a Mac with Xcode, or you can use the GitHub workflow `.github/workflows/ios.yml`, which runs on a cloud Mac.

```bash
npx cap sync ios
npx cap open ios                   # opens Xcode: pick your team under Signing & Capabilities, then run
```

See **[APP_STORE.md](APP_STORE.md)** for publishing on the Apple App Store.

## CI

The GitHub Actions workflow `.github/workflows/android.yml` runs the tests, builds a debug APK on every push, and builds a signed `.aab` once the signing secrets are configured. `.github/workflows/ios.yml` builds the app for the iOS simulator on every push and uploads a signed build to TestFlight once the App Store Connect secrets are configured.

See **[PLAY_STORE.md](PLAY_STORE.md)** for publishing on Google Play.

## Website (web version)

The same app also runs in the browser as a free "shop window" for the store apps:

- `npm run build:web` builds `dist/site/`: the pages from `docs/` at the root and the web app under `app/`.
- In the web build `WEB_BUILD = true`: lessons 8–15, the detailed reading, the full compatibility analysis,
  the year forecast and the almanac planner show "available in the app" cards; there are no notifications.
- A generated service worker (`app/sw.js`) makes it work offline and installable ("Add to home screen").
- Store links: fill in `www/js/store-links.js` once the apps are live (until then the cards say "coming soon").
- Before publishing: `node tools/check-release.cjs` must pass (Impressum address and contact email set).
- Publish: Settings → Pages → Source **GitHub Actions**, then run the workflow *BaZi Academy (Website)*.
  The site is at `https://baziacademy.app/` (custom domain, set under Settings → Pages → Custom domain) and the web app at `https://baziacademy.app/app/`.
