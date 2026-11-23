// Build-time flags. The CI workflow sets TEST_BUILD = true only for the debug test APK and resets it
// before building the store release. Keep it false in the repository (a unit test enforces this).
export const TEST_BUILD = false;
export const BUILD = 'local'; // CI replaces this with the run number
// tools/build-web.cjs sets WEB_BUILD = true for the website version (Premium features point to the apps).
export const WEB_BUILD = false;
