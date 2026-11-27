// Illustrated, interactive lesson diagrams (inline SVG – offline, sharp on every screen, light and dark mode):
// the Five Elements cycle, Yin and Yang, the ten Heavenly Stems as pictures and the wheel of the twelve branches.
import { STEMS, BRANCHES, ELEMENTS } from './data.js';
import { t } from './i18n.js';
import { STAGES, stageBranch } from './stages.js';

// ---------- small white pictures (drawn in a 40 × 40 box) ----------
const ICON = {
  tree: '<rect x="18" y="23" width="4" height="13" rx="1"/><circle cx="20" cy="15" r="9"/><circle cx="12.5" cy="20" r="6.5"/><circle cx="27.5" cy="20" r="6.5"/>',
  flame: '<path d="M20 3c6 8 11 13 11 21a11 11 0 0 1-22 0c0-6 4-9 6-14 1 5 3 7 5 8 0-5-1-10 0-15z"/>',
  mountain: '<path d="M2 35 15 13l6 9 5-7 12 20z"/>',
  coin: '<path fill-rule="evenodd" d="M20 6a14 14 0 1 1 0 28 14 14 0 0 1 0-28zm-5 9v10h10V15z"/>',
  drop: '<path d="M20 3c7 10 12 16 12 23a12 12 0 0 1-24 0c0-7 5-13 12-23z"/>',
  flower: '<circle cx="20" cy="11" r="5"/><circle cx="27" cy="16" r="5"/><circle cx="24" cy="24" r="5"/><circle cx="16" cy="24" r="5"/><circle cx="13" cy="16" r="5"/><rect x="19" y="27" width="2.4" height="11" rx="1"/>',
  sun: '<circle cx="20" cy="20" r="8"/><g stroke="#fff" stroke-width="2.6" stroke-linecap="round"><path d="M20 3v5M20 32v5M3 20h5M32 20h5M8 8l3.5 3.5M28.5 28.5 32 32M32 8l-3.5 3.5M11.5 28.5 8 32"/></g>',
  candle: '<rect x="14" y="17" width="12" height="20" rx="2"/><path d="M20 3c3 4 5 6 5 9a5 5 0 0 1-10 0c0-3 2-5 5-9z"/>',
  field: '<path d="M3 36 12 22h16l9 14z" opacity=".95"/><g stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M20 21V10M20 14c-4-1-6-4-6-7 4 1 6 3 6 7zM20 13c4-1 6-4 6-7-4 1-6 3-6 7z" fill="#fff"/></g>',
  axe: '<rect x="18" y="4" width="4" height="33" rx="1.5"/><path d="M22 7c7 0 13 4 14 11-5-2-9-2-14 0z"/>',
  jewel: '<path d="M8 15 14 7h12l6 8-12 18z"/><path d="M8 15h24M14 7l6 26 6-26" stroke="currentColor" stroke-opacity=".35" stroke-width="1.2" fill="none"/>',
  ocean: '<g fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round"><path d="M3 15c4-4 7-4 11 0s7 4 11 0 7-4 11 0"/><path d="M3 24c4-4 7-4 11 0s7 4 11 0 7-4 11 0"/><path d="M3 33c4-4 7-4 11 0s7 4 11 0 7-4 11 0"/></g>',
  rain: '<path d="M11 21a7 7 0 0 1 1-14 9 9 0 0 1 17 3 6 6 0 0 1-1 11z"/><g stroke="#fff" stroke-width="2.4" stroke-linecap="round"><path d="M13 26l-2 5M20 26l-2 5M27 26l-2 5M16 33l-1 3M23 33l-1 3"/></g>',
};
const ELEMENT_ICON = ['tree', 'flame', 'mountain', 'coin', 'drop'];
const STEM_ICON = ['tree', 'flower', 'sun', 'candle', 'mountain', 'field', 'axe', 'jewel', 'ocean', 'rain'];
const icon = (name, x, y, size) => `<g transform="translate(${x} ${y}) scale(${size / 40})" fill="#fff">${ICON[name]}</g>`;
const svgIcon = (name, size = 40) => `<svg viewBox="0 0 40 40" width="${size}" height="${size}" aria-hidden="true" fill="#fff">${ICON[name]}</svg>`;

// ---------- 1. Five Elements cycle ----------
const PRODUCE = () => [t('Wood feeds Fire – wood burns.'), t('Fire creates Earth – it leaves ash behind.'), t('Earth bears Metal – ores grow inside the earth.'),
  t('Metal carries Water – water condenses on cold metal.'), t('Water nourishes Wood – plants need water to grow.')];
const CONTROL = () => [t('Wood controls Earth – roots break up the soil.'), t('Fire controls Metal – fire melts metal.'), t('Earth controls Water – a dam holds the water back.'),
  t('Metal controls Wood – the axe cuts the tree.'), t('Water controls Fire – water puts out the fire.')];
const m5 = (n) => ((n % 5) + 5) % 5;

function cycleSvg(sel) {
  const C = 160, R = 108;
  // Fire (south, summer, midday) at the top as in classical Chinese diagrams, then clockwise Earth, Metal, Water, Wood.
  const pts = ELEMENTS.map((_, i) => { const a = (-90 + (i - 1) * 72) * Math.PI / 180; return [C + R * Math.cos(a), C + R * Math.sin(a)]; });
  const on = (a, b, kind) => sel === null || (kind === 'gen' ? a === sel || b === sel : a === sel || b === sel);
  const line = (a, b, kind, shrink) => {
    const [x1, y1] = pts[a], [x2, y2] = pts[b]; const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    return `<line x1="${(x1 + dx / L * shrink).toFixed(1)}" y1="${(y1 + dy / L * shrink).toFixed(1)}" x2="${(x2 - dx / L * shrink).toFixed(1)}" y2="${(y2 - dy / L * shrink).toFixed(1)}"
      class="dg-${kind}${on(a, b, kind) ? '' : ' dg-dim'}" marker-end="url(#dg-ar-${kind})"/>`;
  };
  return `<svg viewBox="0 0 320 332" class="dg-svg" role="img" aria-label="${t('Producing and controlling cycles')}">
    <defs>${['gen', 'ctl'].map((k) => `<marker id="dg-ar-${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" class="dg-${k}-head"/></marker>`).join('')}</defs>
    ${ELEMENTS.map((_, i) => line(i, m5(i + 1), 'gen', 38)).join('')}
    ${ELEMENTS.map((_, i) => line(i, m5(i + 2), 'ctl', 38)).join('')}
    ${ELEMENTS.map((e, i) => { const [x, y] = pts[i]; return `<g class="dg-node${sel === i ? ' dg-sel' : ''}${sel !== null && sel !== i ? ' dg-faint' : ''}" data-cyc="${i}" role="button" tabindex="0" aria-label="${e.name}">
      <circle cx="${x}" cy="${y}" r="31" fill="var(--${e.key})"/>${icon(ELEMENT_ICON[i], x - 15, y - 21, 30)}
      <text x="${x}" y="${y + 21}" text-anchor="middle" class="dg-zh">${e.zh}</text>
      <text x="${x}" y="${y + 47}" text-anchor="middle" class="dg-lbl">${e.name}</text></g>`; }).join('')}
  </svg>`;
}
function cycleCaption(sel) {
  if (sel === null) return `<p class="small muted dg-hint">👆 ${t('Tap an element to see how it influences the others.')}</p>`;
  const e = (i) => `<b class="tx-${i}">${ELEMENTS[i].zh} ${ELEMENTS[i].name}</b>`;
  const P = PRODUCE(), K = CONTROL();
  return `<ul class="dg-rel">
    <li><span class="dg-tag dg-tag-gen">${t('Produces')}</span> ${e(m5(sel + 1))}<br><span class="small">${P[sel]}</span></li>
    <li><span class="dg-tag dg-tag-gen">${t('Is produced by')}</span> ${e(m5(sel - 1))}<br><span class="small">${P[m5(sel - 1)]}</span></li>
    <li><span class="dg-tag dg-tag-ctl">${t('Controls')}</span> ${e(m5(sel + 2))}<br><span class="small">${K[sel]}</span></li>
    <li><span class="dg-tag dg-tag-ctl">${t('Is controlled by')}</span> ${e(m5(sel - 2))}<br><span class="small">${K[m5(sel - 2)]}</span></li></ul>`;
}
export function elementsCycleHtml() {
  return `<div class="dg dg-cycle" data-dg="cycle"><div class="dg-pic">${cycleSvg(null)}</div>
    <p class="small dg-legend"><span class="dg-key-gen">━ ${t('produces 生')}</span> · <span class="dg-key-ctl">┅ ${t('controls 克')}</span></p>
    <div class="dg-cap">${cycleCaption(null)}</div></div>`;
}

// ---------- 2. Yin and Yang ----------
export function yinYangHtml() {
  const rows = [['Active', 'Receptive'], ['Bright', 'Dark'], ['Warm', 'Cool'], ['Day', 'Night'], ['Summer', 'Winter'], ['Outward, expanding', 'Inward, contracting'], ['Sun', 'Moon']];
  const yangStems = [0, 2, 4, 6, 8], yinStems = [1, 3, 5, 7, 9];
  const ch = (list, arr) => list.map((i) => `<span class="tx-${arr[i].el}">${arr[i].zh}</span>`).join(' ');
  return `<div class="dg dg-yy">
    <div class="dg-yy-top">
      <svg viewBox="-56 -56 112 112" class="dg-taiji" role="img" aria-label="${t('Yin and Yang')}">
        <circle r="52" class="dg-yang-fill"/><path d="M0-52a52 52 0 0 1 0 104 26 26 0 0 1 0-52 26 26 0 0 0 0-52z" class="dg-yin-fill"/>
        <circle cy="-26" r="8" class="dg-yin-fill"/><circle cy="26" r="8" class="dg-yang-fill"/><circle r="52" fill="none" class="dg-yy-ring"/></svg>
      <table class="dg-yy-table"><tr><th>☀️ ${t('Yang')} 阳</th><th>🌙 ${t('Yin')} 阴</th></tr>
        ${rows.map(([a, b]) => `<tr><td>${t(a)}</td><td>${t(b)}</td></tr>`).join('')}
        <tr><td class="dg-zhrow">${ch(yangStems, STEMS)}</td><td class="dg-zhrow">${ch(yinStems, STEMS)}</td></tr></table>
    </div>
    <div class="dg-day"><div class="dg-day-bar"></div>
      <div class="dg-day-lbl"><span>00:00<br><b>${t('peak Yin')}</b></span><span>06:00<br>${t('Yang grows')}</span><span>12:00<br><b>${t('peak Yang')}</b></span><span>18:00<br>${t('Yin grows')}</span><span>24:00</span></div></div>
    <p class="small muted">${t('Each turns into the other: at the darkest point of the night the day begins. The stems alternate: Yang, Yin, Yang, Yin …')}</p></div>`;
}

// ---------- 3. The ten stems as pictures ----------
export function stemPicturesHtml() {
  const card = (i) => { const s = STEMS[i];
    return `<button type="button" class="dg-stem el-${s.el}" data-stem="${i}" aria-label="${s.py} – ${s.image}">${svgIcon(STEM_ICON[i], 34)}
      <span class="zh">${s.zh}</span><span class="py">${s.py}</span><span class="mn">${String(s.image).split(/[,،、]/)[0]}</span></button>`; };
  return `<div class="dg dg-stems">
    <div class="dg-stems-grid"><div class="dg-stems-head">${ELEMENTS.map((e, i) => `<span class="tx-${i}">${e.zh} ${e.name}</span>`).join('')}</div>
    <div class="dg-row-lbl">☀️ ${t('Yang')}</div><div class="dg-stems-row">${[0, 2, 4, 6, 8].map(card).join('')}</div>
    <div class="dg-row-lbl">🌙 ${t('Yin')}</div><div class="dg-stems-row">${[1, 3, 5, 7, 9].map(card).join('')}</div></div>
    <p class="small muted">${t('Each element appears twice: a strong Yang picture on top and a softer Yin picture below. Tap a picture to read its personality.')}</p></div>`;
}

// ---------- 4. The wheel of the twelve branches ----------
const ANIMAL = ['🐀', '🐂', '🐅', '🐇', '🐉', '🐍', '🐎', '🐐', '🐒', '🐓', '🐕', '🐖'];
export function branchWheelHtml() {
  const C = 170, R1 = 158, R2 = 96, R3 = 66;
  const pt = (deg, r) => { const a = (deg - 90) * Math.PI / 180; return [C + r * Math.cos(a), C + r * Math.sin(a)]; };
  const sector = (i, r1, r2) => { const a0 = i * 30 - 15, a1 = i * 30 + 15; const [x1, y1] = pt(a0, r1), [x2, y2] = pt(a1, r1), [x3, y3] = pt(a1, r2), [x4, y4] = pt(a0, r2);
    return `M${x1.toFixed(1)} ${y1.toFixed(1)}A${r1} ${r1} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}L${x3.toFixed(1)} ${y3.toFixed(1)}A${r2} ${r2} 0 0 0 ${x4.toFixed(1)} ${y4.toFixed(1)}Z`; };
  // Seasons on the inner ring: winter 亥子丑, spring 寅卯辰, summer 巳午未, autumn 申酉戌.
  const seasons = [[11, 4], [2, 0], [5, 1], [8, 3]];
  const arc = (start, el) => { const a0 = start * 30 - 15, a1 = a0 + 90; const [x1, y1] = pt(a0, R3), [x2, y2] = pt(a1, R3), [x3, y3] = pt(a1, R3 - 16), [x4, y4] = pt(a0, R3 - 16);
    const [lx, ly] = pt(a0 + 45, R3 - 8);
    return `<path d="M${x1} ${y1}A${R3} ${R3} 0 0 1 ${x2} ${y2}L${x3} ${y3}A${R3 - 16} ${R3 - 16} 0 0 0 ${x4} ${y4}Z" fill="var(--${ELEMENTS[el].key})" opacity=".85"/>
      <text x="${lx.toFixed(1)}" y="${(ly + 3).toFixed(1)}" text-anchor="middle" class="dg-season"
        transform="rotate(${({ 90: 90, 270: -90 })[(a0 + 45 + 360) % 360] || 0} ${lx.toFixed(1)} ${ly.toFixed(1)})">${ELEMENTS[el].season}</text>`; };
  return `<div class="dg dg-wheel"><svg viewBox="-26 -26 392 392" class="dg-svg" role="img" aria-label="${t('Wheel of the twelve Earthly Branches')}">
    ${BRANCHES.map((b, i) => { const [ex, ey] = pt(i * 30, 138), [cx, cy] = pt(i * 30, 112), [hx, hy] = pt(i * 30, R1 + 12);
      const month = String(b.month).split(/[\s(]/)[0];
      return `<g data-branch="${i}" class="dg-sector" role="button" tabindex="0" aria-label="${b.py} – ${b.animal}">
        <path d="${sector(i, R1 - 6, R2)}" fill="var(--${ELEMENTS[b.el].key})"/>
        <text x="${ex.toFixed(1)}" y="${(ey + 7).toFixed(1)}" text-anchor="middle" font-size="20">${ANIMAL[i]}</text>
        <text x="${cx.toFixed(1)}" y="${(cy + 7).toFixed(1)}" text-anchor="middle" class="dg-wzh">${b.zh}</text>
        <text x="${hx.toFixed(1)}" y="${(hy - 2).toFixed(1)}" text-anchor="middle" class="dg-hours">${b.hours}</text>
        <text x="${hx.toFixed(1)}" y="${(hy + 9).toFixed(1)}" text-anchor="middle" class="dg-month">${month}</text></g>`; }).join('')}
    ${seasons.map(([s, el]) => arc(s, el)).join('')}
    <text x="${C}" y="${C + 5}" text-anchor="middle" class="dg-center">☯</text></svg>
    <p class="small muted">${t('Each branch is an animal, a two-hour period and a month of the year. Tap an animal for details.')} ${t('At the top: the Rat – midnight and midwinter.')}</p></div>`;
}

/** Wires up the interactive Five Elements cycle inside `root`. */
export function bindDiagrams(root) {
  root.querySelectorAll('[data-dg="cycle"]').forEach((box) => {
    let sel = null;
    const pick = (i) => { sel = sel === i ? null : i; box.querySelector('.dg-pic').innerHTML = cycleSvg(sel); box.querySelector('.dg-cap').innerHTML = cycleCaption(sel); };
    box.addEventListener('click', (e) => { const n = e.target.closest('[data-cyc]'); if (n) pick(Number(n.dataset.cyc)); });
    box.addEventListener('keydown', (e) => { const n = e.target.closest('[data-cyc]'); if (n && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); pick(Number(n.dataset.cyc)); } });
  });
}

// ---------- 5. Clashes and harmonies on the zodiac wheel ----------
const SIX_HARMONY = [[0, 1, 2], [2, 11, 0], [3, 10, 1], [4, 9, 3], [5, 8, 4], [6, 7, 1]]; // [a, b, element]
const THREE_HARMONY = [[8, 0, 4, 4], [11, 3, 7, 0], [2, 6, 10, 1], [5, 9, 1, 3]];      // [a, b, c, element]
const HARMS = [[0, 7], [1, 6], [2, 5], [3, 4], [8, 11], [9, 10]];
const PUNISH = [[2, 5, 8], [1, 10, 7], [0, 3]];
const SELF_PUNISH = [4, 6, 9, 11];
const REL_MODES = () => [['clash', `${t('Clash')} 冲`], ['six', `${t('Six Harmony')} 六合`], ['three', `${t('Three Harmony')} 三合`], ['harm', `${t('Harm')} · ${t('Punishment')}`]];
const REL_TEXT = () => ({
  clash: t('Opposite animals clash – movement, change and friction, but also fresh starts.'),
  six: t('Pairs that attract each other and bond. Each pair leans towards an element.'),
  three: t('Three animals four steps apart form a strong team of one element.'),
  harm: t('Harms bring hidden irritation; punishments bring tension and obligations.'),
});
function relSvg(mode, sel) {
  const C = 170, R = 128;
  const pt = (i, r = R) => { const a = (i * 30 - 90) * Math.PI / 180; return [C + r * Math.cos(a), C + r * Math.sin(a)]; };
  const touches = (list) => sel === null || list.includes(sel);
  const seg = (a, b, cls, color, list) => { const [x1, y1] = pt(a, R - 24), [x2, y2] = pt(b, R - 24);
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" class="${cls}${touches(list) ? '' : ' dg-dim'}"${color ? ` style="stroke:var(--${ELEMENTS[color].key})"` : ''}/>`; };
  let lines = '';
  if (mode === 'clash') for (let i = 0; i < 6; i++) lines += seg(i, i + 6, 'dg-rl dg-rl-clash', null, [i, i + 6]);
  if (mode === 'six') for (const [a, b, el] of SIX_HARMONY) lines += seg(a, b, 'dg-rl dg-rl-six', el, [a, b]);
  if (mode === 'three') for (const [a, b, c, el] of THREE_HARMONY) {
    const list = [a, b, c]; const p = [a, b, c].map((i) => pt(i, R - 24));
    lines += `<polygon points="${p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')}" class="dg-tri${touches(list) ? '' : ' dg-dim'}" style="stroke:var(--${ELEMENTS[el].key});fill:var(--${ELEMENTS[el].key})"/>`;
  }
  if (mode === 'harm') {
    for (const [a, b] of HARMS) lines += seg(a, b, 'dg-rl dg-rl-harm', null, [a, b]);
    for (const g of PUNISH) for (let k = 0; k < g.length; k++) if (g.length > 2 || k === 0) lines += seg(g[k], g[(k + 1) % g.length], 'dg-rl dg-rl-pun', null, g);
  }
  const nodes = BRANCHES.map((b, i) => { const [x, y] = pt(i); const self = mode === 'harm' && SELF_PUNISH.includes(i);
    return `<g data-rel="${i}" class="dg-node${sel === i ? ' dg-sel' : ''}${sel !== null && sel !== i ? ' dg-faint' : ''}" role="button" tabindex="0" aria-label="${b.py} – ${b.animal}">
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="24" fill="var(--${ELEMENTS[b.el].key})"${self ? ' class="dg-selfp"' : ''}/>
      <text x="${x.toFixed(1)}" y="${(y - 3).toFixed(1)}" text-anchor="middle" font-size="15">${ANIMAL[i]}</text>
      <text x="${x.toFixed(1)}" y="${(y + 15).toFixed(1)}" text-anchor="middle" class="dg-zh">${b.zh}</text></g>`; }).join('');
  return `<svg viewBox="0 0 340 340" class="dg-svg" role="img" aria-label="${t('Clashes and harmonies of the twelve branches')}">${lines}${nodes}</svg>`;
}
function relCaption(mode, sel) {
  const head = `<p class="small dg-rel-txt">${REL_TEXT()[mode]}${mode === 'harm' ? ` <span class="muted">${t('Solid: harm · dashed: punishment · ringed animals punish themselves.')}</span>` : ''}</p>`;
  if (sel === null) return `${head}${relListHtml(mode === 'clash' ? 'clash' : mode === 'six' ? 'six' : mode === 'three' ? 'three' : 'harm')}<p class="small muted dg-hint">👆 ${t('Tap an animal to see all its relations.')}</p>`;
  const nm = (i) => `<b class="tx-${BRANCHES[i].el}">${BRANCHES[i].zh} ${BRANCHES[i].animal}</b>`;
  const el = (e) => `<b class="tx-${e}">${ELEMENTS[e].zh} ${ELEMENTS[e].name}</b>`;
  const six = SIX_HARMONY.find(([a, b]) => a === sel || b === sel), three = THREE_HARMONY.find((g) => g.slice(0, 3).includes(sel));
  const harm = HARMS.find(([a, b]) => a === sel || b === sel), pun = PUNISH.find((g) => g.includes(sel));
  const other = (pair) => (pair[0] === sel ? pair[1] : pair[0]);
  const items = [
    ['clash', t('Clash'), nm((sel + 6) % 12)],
    ['six', t('Six Harmony'), `${nm(other(six))} → ${el(six[2])}`],
    ['three', t('Three Harmony'), `${three.slice(0, 3).map(nm).join(' · ')} → ${el(three[3])}`],
    ['harm', t('Harm'), nm(other(harm))],
    ['harm', t('Punishment'), pun ? pun.filter((x) => x !== sel).map(nm).join(' · ') : SELF_PUNISH.includes(sel) ? t('Self-punishment') : '–'],
  ];
  return `${head}<ul class="dg-rel">${items.map(([m, lbl, v]) => `<li class="${m === mode ? 'dg-rel-on' : ''}"><span class="dg-tag dg-tag-${m === 'clash' || m === 'harm' ? 'ctl' : 'gen'}">${lbl}</span><br>${v}</li>`).join('')}</ul>`;
}
export function relationsHtml() {
  return `<div class="dg dg-relations" data-dg="relations" data-mode="clash">
    <div class="seg seg-wrap dg-tabs">${REL_MODES().map(([k, n]) => `<button type="button" data-relmode="${k}" class="${k === 'clash' ? 'on' : ''}">${n}</button>`).join('')}</div>
    <div class="dg-pic">${relSvg('clash', null)}</div><div class="dg-cap">${relCaption('clash', null)}</div></div>`;
}
export function bindRelations(root) {
  root.querySelectorAll('[data-dg="relations"]').forEach((box) => {
    let mode = 'clash', sel = null;
    const draw = () => { box.querySelector('.dg-pic').innerHTML = relSvg(mode, sel); box.querySelector('.dg-cap').innerHTML = relCaption(mode, sel);
      box.querySelectorAll('[data-relmode]').forEach((b) => b.classList.toggle('on', b.dataset.relmode === mode)); };
    box.addEventListener('click', (e) => {
      const m = e.target.closest('[data-relmode]'); if (m) { mode = m.dataset.relmode; draw(); return; }
      const n = e.target.closest('[data-rel]'); if (n) { const i = Number(n.dataset.rel); sel = sel === i ? null : i; draw(); }
    });
    box.addEventListener('keydown', (e) => { const n = e.target.closest('[data-rel]'); if (n && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); const i = Number(n.dataset.rel); sel = sel === i ? null : i; draw(); } });
  });
}

// ---------- 6. The relations written out: animals and elements instead of bare characters ----------
const DIRECTIONAL = [[2, 3, 4, 0], [5, 6, 7, 1], [8, 9, 10, 3], [11, 0, 1, 4]];
const bName = (i) => `<span class="nw"><b class="tx-${BRANCHES[i].el}">${BRANCHES[i].zh}</b> ${BRANCHES[i].animal}</span>`;
const eName = (e) => `<span class="nw"><b class="tx-${e}">${ELEMENTS[e].zh}</b> ${ELEMENTS[e].name}</span>`;
/** A plain list of one kind of branch relation, e.g. "申 Monkey · 子 Rat · 辰 Dragon → 水 Water". */
export function relListHtml(kind) {
  let rows = [];
  if (kind === 'clash') rows = range6().map((i) => `${bName(i)} ⟷ ${bName(i + 6)}`);
  if (kind === 'six') rows = SIX_HARMONY.map(([a, b, el]) => `${bName(a)} + ${bName(b)} → ${eName(el)}`);
  if (kind === 'three') rows = THREE_HARMONY.map(([a, b, c, el]) => `${bName(a)} · ${bName(b)} · ${bName(c)} → ${eName(el)}`);
  if (kind === 'season') rows = DIRECTIONAL.map(([a, b, c, el]) => `${bName(a)} · ${bName(b)} · ${bName(c)} → ${eName(el)} <span class="muted">(${ELEMENTS[el].season})</span>`);
  if (kind === 'harm') rows = [
    ...PUNISH.map((g) => `<span class="dg-tag dg-tag-ctl">${t('Punishment')}</span> ${g.map(bName).join(' · ')}`),
    `<span class="dg-tag dg-tag-ctl">${t('Self-punishment')}</span> ${SELF_PUNISH.map(bName).join(' · ')}`,
    ...HARMS.map(([a, b]) => `<span class="dg-tag dg-tag-harm">${t('Harm')}</span> ${bName(a)} ⟷ ${bName(b)}`)];
  return `<ul class="rel-list">${rows.map((r) => `<li>${r}</li>`).join('')}</ul>`;
}
const range6 = () => [0, 1, 2, 3, 4, 5];

// ---------- 7. Why a Three Harmony works: birth, peak and storage of one element ----------
const LIFE_GROUPS = [[8, 0, 4, 4], [11, 3, 7, 0], [2, 6, 10, 1], [5, 9, 1, 3]]; // [birth, peak, storage, element]
const LIFE_ROLES = () => [['🌱', t('Birth')], ['🌸', t('Peak')], ['🏺', t('Storage')]];
function lifeSvg(g) {
  const C = 170, R = 120;
  const pt = (i, r = R) => { const a = (i * 30 - 90) * Math.PI / 180; return [C + r * Math.cos(a), C + r * Math.sin(a)]; };
  const [b, p, s, el] = LIFE_GROUPS[g];
  const tri = [b, p, s].map((i) => pt(i, R - 22));
  const roles = LIFE_ROLES();
  const labels = [b, p, s].map((i, k) => { const [x, y] = pt(i, R + 42); const anchor = x < C - 20 ? 'end' : x > C + 20 ? 'start' : 'middle';
    const dx = anchor === 'end' ? 14 : anchor === 'start' ? -14 : 0;
    return `<text x="${(x + dx).toFixed(1)}" y="${(y + 5).toFixed(1)}" text-anchor="${anchor}" class="dg-life-lbl">${roles[k][0]} ${roles[k][1]}</text>`; }).join('');
  const nodes = BRANCHES.map((br, i) => { const [x, y] = pt(i); const on = [b, p, s].includes(i);
    return `<g class="${on ? 'dg-sel' : 'dg-faint'}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${on ? 25 : 19}" fill="var(--${ELEMENTS[br.el].key})"/>
      <text x="${x.toFixed(1)}" y="${(y - 2).toFixed(1)}" text-anchor="middle" font-size="${on ? 15 : 12}">${ANIMAL[i]}</text>
      <text x="${x.toFixed(1)}" y="${(y + 14).toFixed(1)}" text-anchor="middle" class="dg-zh">${br.zh}</text></g>`; }).join('');
  return `<svg viewBox="-40 -30 420 400" class="dg-svg" role="img" aria-label="${t('Three Harmony: birth, peak and storage of one element')}">
    <polygon points="${tri.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')}" class="dg-tri" style="stroke:var(--${ELEMENTS[el].key});fill:var(--${ELEMENTS[el].key})"/>
    ${nodes}${labels}<text x="${C}" y="${C + 8}" text-anchor="middle" class="dg-life-el tx-${el}">${ELEMENTS[el].zh}</text></svg>`;
}
function lifeCaption(g) {
  const [b, p, s, el] = LIFE_GROUPS[g];
  return `<p>${t('{el} is born in {a}, strongest in {b} and stored in {c}.', { el: eName(el), a: bName(b), b: bName(p), c: bName(s) })}</p>
    <p class="small muted">${t('Like a plant: it sprouts, comes into full bloom, and is harvested and stored. When all three animals meet in a chart, they work as one strong team of {el}.', { el: ELEMENTS[el].name })}</p>`;
}
export function threeLifeHtml() {
  const roles = LIFE_ROLES();
  return `<div class="dg dg-life" data-dg="life">
    <div class="seg seg-wrap dg-tabs">${LIFE_GROUPS.map(([, , , el], g) => `<button type="button" data-lifeg="${g}" class="${g === 0 ? 'on' : ''}">${ELEMENTS[el].zh} ${ELEMENTS[el].name}</button>`).join('')}</div>
    <div class="dg-pic">${lifeSvg(0)}</div><div class="dg-cap">${lifeCaption(0)}</div></div>
    <table class="dg-life-tbl"><tr>${roles.map(([i, n]) => `<th>${i}<br>${n}</th>`).join('')}<th></th></tr>
      ${LIFE_GROUPS.map(([b, p, s, el]) => `<tr><td>${bName(b)}</td><td><b>${bName(p)}</b></td><td>${bName(s)}</td><td>→ ${eName(el)}</td></tr>`).join('')}</table>`;
}

// ---------- 8. The twelve life stages of a stem on the wheel ----------
const STAGE_TONE = ['up', 'mid', 'up', 'top', 'top', 'mid', 'low', 'low', 'low', 'low', 'mid', 'mid'];
function stagesSvg(stem) {
  const C = 170, R = 112;
  const pt = (i, r = R) => { const a = (i * 30 - 90) * Math.PI / 180; return [C + r * Math.cos(a), C + r * Math.sin(a)]; };
  const at = {}; for (let k = 0; k < 12; k++) at[stageBranch(stem, k)] = k;
  const nodes = BRANCHES.map((br, i) => { const [x, y] = pt(i); const k = at[i]; const st = STAGES[k]; const side = Math.sin(i * Math.PI / 6); const mid = Math.abs(side) < 0.3;
    const [lx, ly] = pt(i, mid ? R + 42 : R + 31); const anchor = mid ? 'middle' : side > 0 ? 'start' : 'end';
    return `<g class="dg-stage-${STAGE_TONE[k]}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="21" fill="var(--${ELEMENTS[br.el].key})"/>
      <text x="${x.toFixed(1)}" y="${(y - 2).toFixed(1)}" text-anchor="middle" font-size="13">${ANIMAL[i]}</text>
      <text x="${x.toFixed(1)}" y="${(y + 13).toFixed(1)}" text-anchor="middle" class="dg-zh">${br.zh}</text>
      <text x="${lx.toFixed(1)}" y="${(ly - 1).toFixed(1)}" text-anchor="${anchor}" class="dg-stage-zh">${k + 1}. ${st.zh}</text>
      <text x="${lx.toFixed(1)}" y="${(ly + 11).toFixed(1)}" text-anchor="${anchor}" class="dg-stage-nm">${st.name}</text></g>`; }).join('');
  const s = STEMS[stem];
  return `<svg viewBox="-80 -36 500 412" class="dg-svg" role="img" aria-label="${t('The twelve life stages of {s}', { s: `${s.zh} ${s.py}` })}">${nodes}
    <text x="${C}" y="${C - 4}" text-anchor="middle" class="dg-life-el tx-${s.el}">${s.zh}</text>
    <text x="${C}" y="${C + 22}" text-anchor="middle" class="dg-stage-dir">${s.yang ? '↻ ' + t('forward') : '↺ ' + t('backward')}</text></svg>`;
}
function stagesCaption(stem) {
  const s = STEMS[stem], pol = t(s.yang ? 'Yang {el}' : 'Yin {el}', { el: ELEMENTS[s.el].name });
  const row = (k) => { const st = STAGES[k]; const b = stageBranch(stem, k);
    return `<li class="dg-stage-${STAGE_TONE[k]}"><span class="dg-stage-n">${k + 1}</span> <b>${st.zh} ${st.name}</b> · ${bName(b)}<br><span class="small muted">${st.desc}</span></li>`; };
  return `<p>${t('{s} ({pol}) is born in {b} and walks {dir} through the wheel.', { s: `<b>${s.zh} ${s.py}</b>`, pol, b: bName(stageBranch(stem, 0)), dir: s.yang ? t('forward (clockwise)') : t('backward (anticlockwise)') })}</p>
    <ol class="dg-stage-list">${range12().map(row).join('')}</ol>`;
}
const range12 = () => [...Array(12).keys()];
export function lifeStagesHtml() {
  return `<div class="dg dg-stages" data-dg="stages">
    <p class="small muted" style="margin:0 0 6px">${t('Choose a Heavenly Stem:')}</p>
    <div class="seg seg-wrap dg-tabs dg-stem-tabs">${STEMS.map((s, i) => `<button type="button" data-stagestem="${i}" class="${i === 0 ? 'on' : ''}"><span class="tx-${s.el}" style="font-family:var(--serif)">${s.zh}</span> ${s.py}</button>`).join('')}</div>
    <div class="dg-pic">${stagesSvg(0)}</div><div class="dg-cap">${stagesCaption(0)}</div></div>`;
}
export function bindLife(root) {
  root.querySelectorAll('[data-dg="life"]').forEach((box) => box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-lifeg]'); if (!b) return; const g = Number(b.dataset.lifeg);
    box.querySelector('.dg-pic').innerHTML = lifeSvg(g); box.querySelector('.dg-cap').innerHTML = lifeCaption(g);
    box.querySelectorAll('[data-lifeg]').forEach((x) => x.classList.toggle('on', x === b)); }));
  root.querySelectorAll('[data-dg="stages"]').forEach((box) => box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-stagestem]'); if (!b) return; const s = Number(b.dataset.stagestem);
    box.querySelector('.dg-pic').innerHTML = stagesSvg(s); box.querySelector('.dg-cap').innerHTML = stagesCaption(s);
    box.querySelectorAll('[data-stagestem]').forEach((x) => x.classList.toggle('on', x === b)); }));
}
