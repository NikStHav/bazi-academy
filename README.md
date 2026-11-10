# BaZi Academy – Android app

An offline Android app for learning Chinese astrology according to **BaZi (八字, Four Pillars of Destiny)**.

## Features

- **Learn**: 14 lessons from the basics to analysis: Yin/Yang, the Five Elements, the 10 Heavenly Stems, the 12 Earthly Branches, the 60 Jiazi cycle, building the pillars, hidden stems, the Day Master, the Ten Gods, seasonal strength, branch interactions, luck pillars, and the useful god. Lessons include interactive diagrams and a short quiz each.
- **Chart**: a full Four Pillars calculator:
  - year and month pillars from the real solar terms (sun longitude, Li Chun as the start of the year)
  - day and hour pillars, with an optional late Zi hour rule and optional true solar time (birthplace longitude)
  - Ten Gods for every stem and hidden stem, element balance, Day Master strength and season phase
  - clashes, combinations, punishments and harms
  - 10-year luck pillars with starting age
  - charts are saved on the device; you can mark one as "my chart"
- **Quiz**: endless, generated questions in 5 categories plus a mixed mode, with best scores.
- **Today**: today's pillars, the next solar term, and how today relates to your own Day Master.
- No internet permission, no tracking, light and dark mode.

## Tech

Plain HTML/CSS/JavaScript (ES modules, no build step) in `www/`, wrapped as a native Android app with
[Capacitor 8](https://capacitorjs.com) (target SDK 36).

```
www/js/bazi.js     calculation engine (pure functions, unit tested)
www/js/data.js     stems, branches, elements, ten gods, solar terms
www/js/lessons.js  course content
www/js/quiz.js     question generators
www/js/app.js      UI and router
test/              node:test unit tests
android/           Capacitor Android project
resources/         icon, splash and Play Store graphics
docs/privacy.html  privacy policy (for GitHub Pages)
```

## Develop

```bash
npm install
npm test             # engine and quiz tests
npm run serve        # open http://localhost:8080 in a browser (use the phone emulation in devtools)
```

## Build for Android

You need Android Studio (or the Android SDK) and JDK 21.

```bash
npm run sync                       # copy www/ into the Android project
npx cap open android               # open in Android Studio, run it on a device or emulator
npm run build:apk                  # debug APK -> android/app/build/outputs/apk/debug/
npm run build:aab                  # signed release bundle (see PLAY_STORE.md)
```

After you change the icon (`www/img/icon.svg` → `resources/*.png`), run `npm run assets`.

The GitHub Actions workflow `.github/workflows/android.yml` runs the tests, builds a debug APK on every push, and builds a signed `.aab` once the signing secrets are configured.

See **[PLAY_STORE.md](PLAY_STORE.md)** for publishing on Google Play.
