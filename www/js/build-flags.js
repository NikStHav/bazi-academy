// Build-time flags. The CI workflow sets TEST_BUILD = true only for the debug test APK and resets it
// before building the store release. Keep it false in the repository (a unit test enforces this).
export const TEST_BUILD = false;
