// Premium unlock: one-time, non-consumable in-app purchase via StoreKit 2 / Google Play Billing
// (@capgo/native-purchases). Everything happens on the device – no server, no account.

export const PRODUCT_ID = 'bazi_premium';
export const FREE_LESSONS = 7;          // lessons 1–7 are free
export const FREE_CALCULATIONS = 5;     // new charts that can be calculated without Premium
export const FALLBACK_PRICE = '€2.99';

const KEY = 'bazi.premium';
const CALC_KEY = 'bazi.calculations';
const read = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } };

const Cap = window.Capacitor;
const isNative = !!Cap?.isNativePlatform?.();
const platform = Cap?.getPlatform?.() || 'web';
const Store = isNative ? Cap.registerPlugin('NativePurchases') : null;

let premium = read(KEY, false); // cached so the app works offline
let price = FALLBACK_PRICE;
const listeners = new Set();
const setPremium = (v) => { if (premium !== v) { premium = v; write(KEY, v); listeners.forEach((f) => f(v)); } };

export const isPremium = () => premium;
export const onChange = (fn) => listeners.add(fn);
export const getPrice = () => price;
export const canBuyInBrowser = !isNative;
export const storeName = platform === 'ios' ? 'Apple' : platform === 'android' ? 'Google Play' : 'app store';

// ----- free usage counters -----
export const calculationsUsed = () => read(CALC_KEY, 0);
export const calculationsLeft = () => Math.max(0, FREE_CALCULATIONS - calculationsUsed());
export const canCalculate = () => premium || calculationsLeft() > 0;
export const countCalculation = () => { if (!premium) write(CALC_KEY, calculationsUsed() + 1); };
export const lessonIsLocked = (index) => !premium && index >= FREE_LESSONS;

function owns(purchases) {
  return (purchases || []).some((p) => p.productIdentifier === PRODUCT_ID
    && !p.revocationDate                                   // iOS: refunded purchases are revoked
    && (platform !== 'android' || String(p.purchaseState) === '1')); // Android: 1 = PURCHASED
}

/** Refresh entitlement and price from the store (call on start-up). */
export async function init() {
  if (!Store) return;
  try {
    const { products } = await Store.getProducts({ productIdentifiers: [PRODUCT_ID], productType: 'inapp' });
    if (products?.[0]?.priceString) price = products[0].priceString;
  } catch { /* store not reachable – keep fallback price */ }
  try {
    const { purchases } = await Store.getPurchases({ productType: 'inapp', onlyCurrentEntitlements: true });
    setPremium(owns(purchases));
  } catch { /* offline – keep cached state */ }
}

/** Start the purchase. Resolves to 'purchased' | 'pending' | 'cancelled' | 'error:<message>'. */
export async function buy() {
  if (!Store) {
    // Browser preview only (never shipped behaviour): simulate the purchase so the flow can be tested.
    if (confirm('Browser preview – simulate buying Premium?')) { setPremium(true); return 'purchased'; }
    return 'cancelled';
  }
  try {
    const t = await Store.purchaseProduct({ productIdentifier: PRODUCT_ID, productType: 'inapp', quantity: 1 });
    if (platform === 'android' && String(t?.purchaseState) === '2') return 'pending';
    setPremium(true);
    return 'purchased';
  } catch (e) {
    const msg = String(e?.message || e);
    if (/cancel/i.test(msg)) return 'cancelled';
    return 'error:' + msg;
  }
}

/** Restore a previous purchase (required by Apple). Resolves to true if Premium is active afterwards. */
export async function restore() {
  if (!Store) return premium;
  try { await Store.restorePurchases(); } catch { /* fall through to getPurchases */ }
  try {
    const { purchases } = await Store.getPurchases({ productType: 'inapp', onlyCurrentEntitlements: true });
    setPremium(owns(purchases));
  } catch { /* keep state */ }
  return premium;
}
