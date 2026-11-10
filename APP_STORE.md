# Publishing BaZi Academy on the Apple App Store

You do **not** need your own Mac: the workflow `.github/workflows/ios.yml` builds and uploads the app on a GitHub-hosted Mac.
With a Mac, you can do steps 4–5 in Xcode instead (`npx cap open ios`, then *Product → Archive → Distribute App*).

## 1. Join the Apple Developer Program

- <https://developer.apple.com/programs/enroll/>: **US$99 per year**.
- *Individual*: your personal name is shown as the seller on the App Store. *Organization*: needs a D-U-N-S number and takes longer.
- Approval usually takes from 1 to 2 days. Note your **Team ID** (Membership details).

## 2. Register the app ID

[Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/identifiers/list) → **+** → App IDs → App:
- Description: `BaZi Academy`
- Bundle ID (explicit): `com.baziacademy.app`. It can't be changed after the first upload. If you own a domain, the convention is its reverse, e.g. `com.example.bazi`. Change it in `capacitor.config.json` and `ios/App/App.xcodeproj/project.pbxproj` (`PRODUCT_BUNDLE_IDENTIFIER`).
- No capabilities needed.

## 3. Create the app in App Store Connect

[App Store Connect](https://appstoreconnect.apple.com) → Apps → **+** → New App:
- Platform: iOS · Name: **BaZi Academy: Four Pillars** (names must be unique on the App Store; alternatives: *BaZi Academy – Learn BaZi*, *Four Pillars Academy*)
- Primary language: English (U.S.) · Bundle ID: `com.baziacademy.app` · SKU: `bazi-academy-ios` · Full access

## 4. Let GitHub upload the builds

1. App Store Connect → **Users and Access → Integrations → App Store Connect API** → generate a **Team key** with the **Admin** role.
   (Admin is needed so the build can create the distribution certificate automatically.) Download the `.p8` file; you can only download it once.
2. In the GitHub repository → Settings → Secrets and variables → Actions, add:
   | Secret | Value |
   |---|---|
   | `APPSTORE_API_PRIVATE_KEY` | full contents of the `.p8` file, including the BEGIN/END lines |
   | `APPSTORE_API_KEY_ID` | Key ID shown next to the key |
   | `APPSTORE_API_ISSUER_ID` | Issuer ID shown above the key list |
   | `APPLE_TEAM_ID` | your 10-character Team ID |
3. Actions → **BaZi Academy (iOS)** → *Run workflow*. After about 15–30 minutes of processing, the build appears under **TestFlight** in App Store Connect.
   Each run uses the run number as build number. Bump `MARKETING_VERSION` in `project.pbxproj` for a new user-visible version.

## 5. Test on your iPhone

Install **TestFlight** from the App Store. In App Store Connect → TestFlight → *Internal Testing*, add yourself and open the invite on your iPhone.
Internal testing needs no review.

## 6. Store listing

| Field | Text |
|---|---|
| Name (≤30) | BaZi Academy: Four Pillars |
| Subtitle (≤30) | Learn Chinese Astrology |
| Category | Primary **Education**, secondary **Reference** |
| Keywords (≤100) | `bazi,four pillars,chinese astrology,five elements,wu xing,ten gods,zodiac,destiny,feng shui,saju` |
| Support URL | `https://<your-github-name>.github.io/<repo>/` (`docs/index.html`) |
| Privacy Policy URL | `https://<your-github-name>.github.io/<repo>/privacy.html` (`docs/privacy.html`) |
| Copyright | `2026 <your name>` |
| Price | Free |

Put your contact email into `docs/index.html` and `docs/privacy.html`, then enable GitHub Pages: Settings → Pages → *Deploy from a branch* → `main` / `/docs`.
Free GitHub Pages needs a public repository; otherwise host these two pages elsewhere.

**Promotional text** (≤170, can be changed anytime):
> Understand the Four Pillars of Destiny step by step: 14 lessons, an accurate BaZi chart calculator and endless quizzes. Offline and private.

**Description:** use the full description from `PLAY_STORE.md`. It works unchanged.

**Screenshots**: ready in `store-screenshots/`:
- `ios-6.9in/` (1320×2868): upload for the **6.9" iPhone** display size (required). Apple scales them down for smaller iPhones.
- `ios-6.5in/` (1242×2688): only if App Store Connect asks for 6.5".
Upload 3–7 of them, starting with the chart (`2-chart.png`). The app is iPhone-only, so no iPad screenshots are needed.

## 7. App Privacy, age rating, compliance

- **App Privacy** → *Data Collection*: **“No, we do not collect data from this app.”** → privacy label “Data Not Collected”.
- **Age rating questionnaire**: answer *None/No* everywhere. The result is **4+**.
- **Export compliance**: already answered in `Info.plist` (`ITSAppUsesNonExemptEncryption = NO`), so Apple won't ask.
- **Content rights**: the app contains no third-party content.

## 8. Submit for review

In the version page, select the TestFlight build and add these **App Review notes**:

> BaZi Academy is an educational app that teaches the classical Chinese system of BaZi (Four Pillars of Destiny) through 14 structured lessons with interactive diagrams, a quiz engine that generates practice questions, and an astronomical chart calculator (solar terms computed from the sun's ecliptic longitude). It is a learning tool, not a fortune-telling service: there are no predictions, readings or paid "consultations". The app works fully offline, requires no account and collects no data.

Review usually takes 1–3 days.

### Avoiding common rejections

- **Guideline 4.3 (Spam / saturated categories).** Apple names astrology and fortune telling as saturated, so a rejection under 4.3 is the biggest risk. The answer is the app's educational depth: keep the listing, screenshots and keywords about *learning*. If it is rejected anyway, reply in Resolution Center with the review notes above. Adding unique features (e.g. a German localisation, more lessons, progress statistics) strengthens a resubmission.
- **Guideline 4.2 (Minimum functionality).** The app is fully offline and interactive, not a wrapped website, which addresses this.
- **Guideline 2.1 (Completeness).** Make sure the support and privacy URLs load before you submit.
