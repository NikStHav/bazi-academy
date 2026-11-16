// Share a chart as a PNG image via the native share sheet (or Web Share / download in a browser).
import { STEMS, BRANCHES, ELEMENTS, TEN_GODS } from './data.js';
import { tenGod, PILLAR_KEYS, PILLAR_LABEL } from './bazi.js';
import { plugin } from './cap.js';

const COLORS = ['#3f9d5a', '#e0503c', '#c08a3e', '#8f9aa8', '#3b78c4'];
const SERIF = '"Noto Serif CJK SC","Noto Serif SC","Songti SC","Source Han Serif SC","WenQuanYi Zen Hei",serif';
const SANS = 'system-ui,-apple-system,Roboto,"Segoe UI",sans-serif';

function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill(); }

export function renderChartImage(chart, name) {
  const W = 1080, H = 1350;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');
  ctx.fillStyle = '#faf6ef'; ctx.fillRect(0, 0, W, H);
  // header
  const g = ctx.createLinearGradient(0, 0, W, 260); g.addColorStop(0, '#7a2e2e'); g.addColorStop(1, '#4a1c1c');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, 260);
  ctx.fillStyle = '#e9c46a'; ctx.font = `600 34px ${SANS}`; ctx.textAlign = 'left'; ctx.fillText('MY BAZI CHART · 八字', 70, 90);
  ctx.fillStyle = '#fff'; ctx.font = `700 72px ${SANS}`; ctx.fillText((name || 'My chart').slice(0, 22), 70, 180);
  const i = chart.input;
  ctx.fillStyle = '#f6e6dc'; ctx.font = `400 30px ${SANS}`;
  ctx.fillText(`${i.year}-${String(i.month).padStart(2, '0')}-${String(i.day).padStart(2, '0')}`, 70, 230);
  // pillars
  const colW = 220, gap = 26, x0 = (W - (4 * colW + 3 * gap)) / 2, dm = chart.dayMaster;
  PILLAR_KEYS.forEach((k, n) => {
    const p = chart.pillars[k]; const x = x0 + n * (colW + gap);
    ctx.textAlign = 'center'; ctx.fillStyle = '#6f655c'; ctx.font = `600 28px ${SANS}`; ctx.fillText(PILLAR_LABEL[k].toUpperCase(), x + colW / 2, 340);
    ctx.fillStyle = '#7a2e2e'; ctx.font = `600 26px ${SANS}`;
    ctx.fillText(!p ? '' : k === 'day' ? 'Day Master' : TEN_GODS[tenGod(dm, p.stem)].name, x + colW / 2, 382);
    if (!p) { ctx.fillStyle = '#e4d9c8'; rr(ctx, x, 410, colW, 500, 28); ctx.fillStyle = '#6f655c'; ctx.font = `400 30px ${SANS}`; ctx.fillText('unknown', x + colW / 2, 670); return; }
    [[p.stem, STEMS[p.stem], STEMS[p.stem].py, 410], [p.branch, BRANCHES[p.branch], BRANCHES[p.branch].animal, 670]].forEach(([, c, sub, y]) => {
      ctx.fillStyle = COLORS[c.el]; rr(ctx, x, y, colW, 240, 28);
      ctx.fillStyle = '#fff'; ctx.font = `700 140px ${SERIF}`; ctx.fillText(c.zh, x + colW / 2, y + 160);
      ctx.font = `500 30px ${SANS}`; ctx.fillText(sub, x + colW / 2, y + 212);
    });
    if (k === 'day') { ctx.strokeStyle = '#c9962b'; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(x - 8, 402, colW + 16, 256, 32); ctx.stroke(); }
  });
  // day master + elements
  const s = STEMS[dm];
  ctx.textAlign = 'left'; ctx.fillStyle = '#2b2420'; ctx.font = `700 40px ${SANS}`;
  ctx.fillText(`Day Master: ${s.zh} ${s.py} – ${s.yang ? 'Yang' : 'Yin'} ${ELEMENTS[s.el].name}`, 70, 1000);
  ctx.fillStyle = '#6f655c'; ctx.font = `400 30px ${SANS}`; ctx.fillText(s.image, 70, 1046);
  let bx = 70; const bw = W - 140;
  chart.elements.forEach((e) => { const w = (bw * e.pct) / 100; ctx.fillStyle = COLORS[e.el]; ctx.fillRect(bx, 1090, w, 34); bx += w; });
  ctx.font = `600 26px ${SANS}`;
  chart.elements.forEach((e, n) => { ctx.fillStyle = COLORS[e.el]; ctx.fillText(`${ELEMENTS[e.el].zh} ${ELEMENTS[e.el].name} ${e.pct}%`, 70 + n * 194, 1166); });
  // footer
  ctx.fillStyle = '#7a2e2e'; ctx.fillRect(0, H - 120, W, 120);
  ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.font = `600 34px ${SANS}`; ctx.fillText('Made with BaZi Academy – learn the Four Pillars', W / 2, H - 48);
  return cv;
}

export async function shareChart(chart, name) {
  const cv = renderChartImage(chart, name);
  const dataUrl = cv.toDataURL('image/png');
  const text = 'My BaZi chart – made with BaZi Academy';
  const FS = plugin('Filesystem'), Share = plugin('Share');
  if (FS && Share) {
    const { uri } = await FS.writeFile({ path: 'bazi-chart.png', data: dataUrl.split(',')[1], directory: 'CACHE' });
    await Share.share({ title: 'My BaZi chart', text, files: [uri], dialogTitle: 'Share your chart' }).catch(() => {});
    return 'shared';
  }
  const blob = await new Promise((res) => cv.toBlob(res, 'image/png'));
  const file = new File([blob], 'bazi-chart.png', { type: 'image/png' });
  if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], title: 'My BaZi chart', text }).catch(() => {}); return 'shared'; }
  const a = document.createElement('a'); a.href = dataUrl; a.download = 'bazi-chart.png'; a.click();
  return 'downloaded';
}
