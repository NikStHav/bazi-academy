# Publishing BaZi Academy on Google Play

## 1. One-time setup

1. **Create a Google Play developer account** at <https://play.google.com/console> (one-time fee of US$25).
   New *personal* accounts must run a **closed test with at least 12 testers for 14 days** before they can publish to production.
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

- App name: **BaZi Academy – Four Pillars**
- Default language: English (United States)
- App or game: App · Free
- Category: **Education** (alternative: Lifestyle)
- Package name: `com.baziacademy.app`. You can change it until the first upload; after that it is permanent. If you own a domain, the convention is its reverse, e.g. `com.example.bazi`.

### Store listing

**Short description** (max. 80 characters):
> Learn Chinese astrology: Four Pillars, Five Elements, Ten Gods & chart calculator

**Full description:**
> Discover BaZi (八字), the Four Pillars of Destiny, one of the great classical systems of Chinese astrology, step by step.
>
> LEARN
> 14 clear lessons take you from the foundations to real chart analysis:
> • Yin & Yang and the Five Elements (Wood, Fire, Earth, Metal, Water)
> • The 10 Heavenly Stems and 12 Earthly Branches
> • The 60 Jiazi cycle and the solar calendar (solar terms)
> • Hidden stems, the Day Master and the Ten Gods
> • Seasonal strength, clashes and combinations, luck pillars, the useful god
> Every lesson includes interactive diagrams and a short quiz.
>
> CALCULATE
> An accurate Four Pillars calculator based on the real solar terms:
> • Year, month, day and hour pillars, with optional true solar time
> • Ten Gods for every stem and hidden stem
> • Five Elements balance and Day Master strength
> • Clashes, harmonies, punishments and harms
> • 10-year luck pillars with starting age
> Tap any character to learn what it means.
>
> PRACTISE
> Endless quiz rounds on elements, stems, branches, hidden stems and Ten Gods.
>
> TODAY
> See today’s pillars, the next solar term and how the day relates to your own Day Master.
>
> PRIVATE BY DESIGN
> Works completely offline. No account, no ads, no tracking. Your birth data never leaves your phone.
>
> BaZi is a traditional cultural system. This app is for education and entertainment and does not replace professional advice.

**Graphics** (in `resources/`):
- App icon 512×512: `play-icon-512.png`
- Feature graphic 1024×500: `feature-graphic.png`
- Phone screenshots: ready in `store-screenshots/android-phone/` (1080×1920). Upload 4–8 of them.

### App content (Policy section)

| Item | Answer |
|---|---|
| Privacy policy URL | `https://<your-github-name>.github.io/<repo-name>/privacy.html`. Enable GitHub Pages (Settings → Pages → *Deploy from a branch* → `main` / `/docs`). Put your contact email into `docs/privacy.html` first. The repository must be **public** for free GitHub Pages; otherwise host the file anywhere else. |
| Ads | No ads |
| App access | All functionality available without login |
| Content rating (IARC questionnaire) | Category "Reference, News, or Educational"; answer *No* to violence, sexuality, gambling and similar questions. Expected rating: Everyone / PEGI 3 / USK 0 |
| Target audience | 13+ (or 18+); not designed for children |
| Data safety | **No data collected, no data shared.** All data stays on the device and the app has no internet permission |
| Government / financial / health app | No |

## 4. Release

1. *Testing → Closed testing*: create a track, upload the `.aab`, add testers (an email list or Google Group), and roll it out.
2. After the test period: *Production → Create new release*, upload the bundle or promote the tested release, then send it for review.
3. Review usually takes from a few days up to about a week for new apps.

## Updates

Change the code, run the workflow again, and upload the new `.aab` to a track. The `versionCode` increases automatically.
