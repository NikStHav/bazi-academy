// Safe access to Capacitor native plugins. Returns null in a normal browser or if anything is missing,
// so a plugin problem can never stop the rest of the app from loading.
const Cap = globalThis.window?.Capacitor;
export const isNative = (() => { try { return !!Cap?.isNativePlatform?.(); } catch { return false; } })();
export const platform = (() => { try { return Cap?.getPlatform?.() || 'web'; } catch { return 'web'; } })();
const cache = {};
export function plugin(name) {
  if (!isNative) return null;
  if (name in cache) return cache[name];
  let p = null;
  try { p = Cap.registerPlugin ? Cap.registerPlugin(name) : (Cap.Plugins?.[name] ?? null); } catch { p = null; }
  cache[name] = p;
  return p;
}
