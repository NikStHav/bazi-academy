import { STEMS, BRANCHES, ELEMENTS, TEN_GODS, JIE_TERMS } from './data.js';
import { LESSONS } from './lessons.js';
import { computeChart, tenGod, pillarName, pillarPinyin, pillarFromIndex, pillarsForNow, jieTermsOfYear,
  SEASON_PHASES, PILLAR_KEYS, PILLAR_LABEL } from './bazi.js';
import { CATEGORIES, makeRound } from './quiz.js';
import { buildReading } from './reading.js';
import * as premium from './premium.js';

// ---------- storage ----------
const store = {
  get(key, fallback) { try { const v = localStorage.getItem('bazi.' + key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
  set(key, val) { try { localStorage.setItem('bazi.' + key, JSON.stringify(val)); } catch { /* ignore */ } },
};
const state = {
  done: store.get('done', {}),
  best: store.get('best', {}),
  charts: store.get('charts', []),
  settings: store.get('settings', { ziHourNextDay: true }),
};
const save = (k) => store.set(k, state[k]);

// ---------- helpers ----------
const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const view = $('#view');
const pad = (n) => String(n).padStart(2, '0');
const fmtDate = (ms) => { const d = new Date(ms); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const polEl = (s) => `${STEMS[s].yang ? 'Yang' : 'Yin'} ${ELEMENTS[STEMS[s].el].name}`;

function stemTile(s, cls = '') {
  return `<button class="ch el-${STEMS[s].el} ${cls}" data-stem="${s}" aria-label="${polEl(s)}"><span class="zh">${STEMS[s].zh}</span><span class="py">${STEMS[s].py}</span></button>`;
}
function branchTile(b, cls = '') {
  return `<button class="ch el-${BRANCHES[b].el} ${cls}" data-branch="${b}" aria-label="${BRANCHES[b].animal}"><span class="zh">${BRANCHES[b].zh}</span><span class="py">${BRANCHES[b].animal}</span></button>`;
}

// ---------- detail sheet ----------
const sheet = $('#sheet-backdrop');
function openSheet(html) { $('#sheet-body').innerHTML = html; sheet.hidden = false; }
function closeSheet() { sheet.hidden = true; }
$('#sheet-close').addEventListener('click', closeSheet);
sheet.addEventListener('click', (e) => { if (e.target === sheet) closeSheet(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });

function stemSheet(s, dm = null) {
  const st = STEMS[s];
  const combo = (s + 5) % 10;
  const god = dm !== null && dm !== s ? TEN_GODS[tenGod(dm, s)] : null;
  return `<div class="head">${stemTile(s)}<div><h2 style="margin:0">${st.zh} ${st.py}</h2><div class="muted">${polEl(s)} · ${st.image}</div></div></div>
    <p>${st.desc}</p>
    ${god ? `<p class="tip">Relative to the Day Master ${STEMS[dm].zh}: <b>${god.name} ${god.zh}</b> – ${god.desc}</p>` : ''}
    <p><b>Combines with:</b> ${STEMS[combo].zh} ${STEMS[combo].py}</p>
    <p><b>Found as hidden stem in:</b> ${BRANCHES.map((b, i) => (b.hidden.includes(s) ? `${b.zh} ${b.animal}` : null)).filter(Boolean).join(', ')}</p>`;
}
function branchSheet(b) {
  const br = BRANCHES[b];
  return `<div class="head">${branchTile(b)}<div><h2 style="margin:0">${br.zh} ${br.py} – ${br.animal}</h2>
    <div class="muted">${br.yang ? 'Yang' : 'Yin'} ${ELEMENTS[br.el].name}</div></div></div>
    <table><tr><th>Hours</th><td>${br.hours}</td></tr><tr><th>Solar month</th><td>${br.month}</td></tr>
    <tr><th>Hidden stems</th><td>${br.hidden.map((s, i) => `<span class="tx-${STEMS[s].el}" style="font-family:var(--serif);font-size:18px">${STEMS[s].zh}</span> ${['main', 'middle', 'residual'][i]}`).join(' · ')}</td></tr>
    <tr><th>Clashes with</th><td>${BRANCHES[(b + 6) % 12].zh} ${BRANCHES[(b + 6) % 12].animal}</td></tr>
    <tr><th>Six Harmony</th><td>${BRANCHES[(13 - b) % 12].zh} ${BRANCHES[(13 - b) % 12].animal}</td></tr>
    <tr><th>Three Harmony</th><td>${[b, (b + 4) % 12, (b + 8) % 12].sort((x, y) => x - y).map((x) => BRANCHES[x].zh).join('')}</td></tr></table>`;
}
function godSheet(key) {
  const g = TEN_GODS[key];
  return `<h2>${g.name} <span style="font-family:var(--serif)">${g.zh}</span></h2><p class="muted">${g.py} · ${g.rel}</p><p>${g.desc}</p>`;
}

document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-stem],[data-branch],[data-god],[data-el]');
  if (!t || t.closest('.no-sheet')) return;
  const dm = t.closest('[data-dm]')?.dataset.dm;
  if (t.dataset.stem) openSheet(stemSheet(Number(t.dataset.stem), dm !== undefined ? Number(dm) : null));
  else if (t.dataset.branch) openSheet(branchSheet(Number(t.dataset.branch)));
  else if (t.dataset.god) openSheet(godSheet(t.dataset.god));
  else if (t.dataset.el) { const el = ELEMENTS[Number(t.dataset.el)];
    openSheet(`<h2 class="tx-${t.dataset.el}">${el.zh} ${el.name}</h2><p>${el.traits}</p><p><b>Season:</b> ${el.season} · <b>Direction:</b> ${el.direction}</p>
      <p><b>Produces:</b> ${ELEMENTS[(Number(t.dataset.el) + 1) % 5].name} · <b>Controls:</b> ${ELEMENTS[(Number(t.dataset.el) + 2) % 5].name}</p>`); }
});

// ---------- widgets ----------
function cycleSvg() {
  const pts = ELEMENTS.map((_, i) => { const a = (-90 + i * 72) * Math.PI / 180; return [150 + 105 * Math.cos(a), 150 + 105 * Math.sin(a)]; });
  const line = (a, b, cls, shrink = 30) => {
    const [x1, y1] = pts[a], [x2, y2] = pts[b]; const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    return `<line x1="${x1 + dx / L * shrink}" y1="${y1 + dy / L * shrink}" x2="${x2 - dx / L * shrink}" y2="${y2 - dy / L * shrink}" class="${cls}" marker-end="url(#ar-${cls})"/>`;
  };
  return `<div class="cycle"><svg viewBox="0 0 300 300" role="img" aria-label="Producing and controlling cycles">
    <defs>${['gen', 'ctl'].map((c) => `<marker id="ar-${c}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="${c === 'gen' ? 'var(--ok)' : 'var(--bad)'}"/></marker>`).join('')}</defs>
    <style>.gen{stroke:var(--ok);stroke-width:2.5}.ctl{stroke:var(--bad);stroke-width:1.5;stroke-dasharray:5 4}</style>
    ${ELEMENTS.map((_, i) => line(i, (i + 1) % 5, 'gen')).join('')}
    ${ELEMENTS.map((_, i) => line(i, (i + 2) % 5, 'ctl')).join('')}
    ${ELEMENTS.map((e, i) => `<g data-el="${i}" style="cursor:pointer"><circle cx="${pts[i][0]}" cy="${pts[i][1]}" r="26" fill="var(--${e.key})"/>
      <text x="${pts[i][0]}" y="${pts[i][1] + 8}" text-anchor="middle" fill="#fff" font-size="24" font-family="var(--serif)">${e.zh}</text></g>`).join('')}
  </svg><p class="small muted" style="text-align:center"><span style="color:var(--ok)">━ produces 生</span> · <span style="color:var(--bad)">┅ controls 克</span></p></div>`;
}

function wheelSvg() {
  const pt = (i, r) => { const a = (-90 + i * 30) * Math.PI / 180; return [150 + r * Math.cos(a), 150 + r * Math.sin(a)]; };
  let lines = '';
  for (let i = 0; i < 6; i++) { const [x1, y1] = pt(i, 95), [x2, y2] = pt(i + 6, 95); lines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--bad)" stroke-dasharray="4 4" stroke-width="1.2"/>`; }
  return `<div class="wheel"><svg viewBox="0 0 300 300" role="img" aria-label="Branch wheel with clashes">${lines}
    ${BRANCHES.map((b, i) => { const [x, y] = pt(i, 120); return `<g data-branch="${i}" style="cursor:pointer"><circle cx="${x}" cy="${y}" r="20" fill="var(--${ELEMENTS[b.el].key})"/>
      <text x="${x}" y="${y + 7}" text-anchor="middle" fill="#fff" font-size="19" font-family="var(--serif)">${b.zh}</text></g>`; }).join('')}
    <text x="150" y="155" text-anchor="middle" font-size="12" fill="var(--muted)">dashed = clash 冲</text></svg></div>`;
}

let trainerDm = 0;
function trainer() {
  return `<div class="card" data-dm="${trainerDm}"><h3 style="margin-top:0">Ten Gods trainer</h3>
    <label for="tg-dm">Choose a Day Master</label>
    <select id="tg-dm">${STEMS.map((s, i) => `<option value="${i}" ${i === trainerDm ? 'selected' : ''}>${s.zh} ${s.py} – ${polEl(i)}</option>`).join('')}</select>
    <div class="grid g5" style="margin-top:12px">${STEMS.map((_, i) => `<div style="text-align:center">${stemTile(i, 'sm')}
      <div class="small" style="font-weight:600">${i === trainerDm ? 'Self' : TEN_GODS[tenGod(trainerDm, i)].name}</div></div>`).join('')}</div></div>`;
}

const WIDGETS = {
  'sample-chart': () => { const c = computeChart({ year: 2000, month: 1, day: 1, hour: 12, minute: 0, tzOffset: 8 });
    return `<div class="card"><div class="small muted" style="margin-bottom:6px">Example: 1 Jan 2000, 12:00 (Beijing)</div>${pillarsHtml(c, false)}</div>`; },
  elements: () => `<div class="grid g5">${ELEMENTS.map((e, i) => `<button class="ch el-${i}" data-el="${i}"><span class="zh">${e.zh}</span><span class="py">${e.name}</span></button>`).join('')}</div>
    <p class="small muted">Tap an element for details.</p>`,
  cycle: cycleSvg,
  wheel: wheelSvg,
  stems: () => `<div class="grid g5">${STEMS.map((_, i) => stemTile(i)).join('')}</div>
    <p class="small muted">Pairs of the same colour share an element: first Yang, then Yin. Tap to explore.</p>`,
  branches: () => `<div class="grid g4">${BRANCHES.map((_, i) => branchTile(i)).join('')}</div>`,
  jiazi: () => { const cur = pillarsForNow().year.index;
    return `<div class="jiazi">${Array.from({ length: 60 }, (_, i) => { const p = pillarFromIndex(i);
      return `<div class="${i === cur ? 'cur' : ''}">${pillarName(p)}<small>${i + 1}</small></div>`; }).join('')}</div>
      <p class="small muted">Highlighted: the current year pillar.</p>`; },
  jie: () => { const y = new Date().getFullYear();
    return `<h3>Month starts (Jie terms) in ${y}</h3><table><tr><th>Term</th><th>Month</th><th>Date (your time)</th></tr>
      ${jieTermsOfYear(y).map((t) => { const idx = JIE_TERMS.findIndex((j) => j.lon === t.lon); const b = BRANCHES[(idx + 2) % 12];
        return `<tr><td><span style="font-family:var(--serif)">${t.zh}</span> ${t.name.split(' – ')[0]}</td><td>${b.zh} ${b.animal}</td><td>${fmtDate(t.ms)}</td></tr>`; }).join('')}</table>`; },
  hidden: () => `<table><tr><th>Branch</th><th>Main</th><th>Middle</th><th>Residual</th></tr>
    ${BRANCHES.map((b, i) => `<tr><td><span data-branch="${i}" style="cursor:pointer;font-family:var(--serif);font-size:18px" class="tx-${b.el}">${b.zh}</span> ${b.animal}</td>
      ${[0, 1, 2].map((k) => { const s = b.hidden[k]; return `<td>${s !== undefined ? `<span class="tx-${STEMS[s].el}" style="font-family:var(--serif);font-size:18px">${STEMS[s].zh}</span> <span class="small muted">${ELEMENTS[STEMS[s].el].name}</span>` : ''}</td>`; }).join('')}</tr>`).join('')}</table>`,
  tengods: () => `<table><tr><th>Relation</th><th>Same polarity</th><th>Opposite</th></tr>
    ${[['Same element', 'F', 'RW'], ['I produce', 'EG', 'HO'], ['I control', 'IW', 'DW'], ['Controls me', '7K', 'DO'], ['Produces me', 'IR', 'DR']]
      .map(([r, a, b]) => `<tr><td>${r}</td>${[a, b].map((k) => `<td><a href="javascript:void 0" data-god="${k}">${TEN_GODS[k].name}</a><br><span class="small muted" style="font-family:var(--serif)">${TEN_GODS[k].zh}</span></td>`).join('')}</tr>`).join('')}</table>`,
  'tengod-trainer': trainer,
  phases: () => `<table>${SEASON_PHASES.map((p) => `<tr><td style="font-family:var(--serif);font-size:22px;color:var(--accent)">${p.zh}</td><td><b>${p.name}</b><br><span class="small">${p.desc}</span></td></tr>`).join('')}</table>`,
};

function renderWidgets(root) {
  root.querySelectorAll('[data-widget]').forEach((el) => { const w = WIDGETS[el.dataset.widget]; if (w) el.innerHTML = w(); });
  const sel = $('#tg-dm', root);
  if (sel) sel.addEventListener('change', () => { trainerDm = Number(sel.value); const host = sel.closest('[data-widget]'); host.innerHTML = trainer(); renderWidgets(host.parentElement); });
}

// ---------- chart rendering ----------
function pillarsHtml(c, withHidden = true) {
  const dm = c.dayMaster;
  return `<div class="pillars" data-dm="${dm}">${PILLAR_KEYS.map((k) => {
    const p = c.pillars[k];
    if (!p) return `<div><div class="lbl">${PILLAR_LABEL[k]}</div><div class="god"></div><div class="muted" style="padding-top:30px">?</div><div class="small muted">time unknown</div></div>`;
    const god = k === 'day' ? 'Day Master' : TEN_GODS[tenGod(dm, p.stem)].name;
    const godKey = k === 'day' ? '' : tenGod(dm, p.stem);
    return `<div class="${k === 'day' ? 'dm' : ''}"><div class="lbl">${PILLAR_LABEL[k]}</div>
      <div class="god" ${godKey ? `data-god="${godKey}"` : ''}>${god}</div>
      ${stemTile(p.stem, 'stem')}${branchTile(p.branch)}
      ${withHidden ? `<div class="hidden-row">${BRANCHES[p.branch].hidden.map((s) => `<span><b class="tx-${STEMS[s].el}">${STEMS[s].zh}</b> ${TEN_GODS[tenGod(dm, s)].short}</span>`).join('')}</div>` : ''}
    </div>`;
  }).join('')}</div>`;
}

function chartHtml(entry) {
  const c = computeChart({ ...entry.input, ziHourNextDay: state.settings.ziHourNextDay });
  const dm = STEMS[c.dayMaster];
  const i = entry.input;
  const nowYear = new Date().getFullYear();
  const curLuck = [...c.luck.pillars].reverse().find((p) => p.year <= nowYear);
  return `
  <div class="card">
    <h2 style="margin-bottom:2px">${esc(entry.name || 'Chart')} ${entry.mine ? '<span class="star" title="My chart">★</span>' : ''}</h2>
    <div class="small muted">${i.year}-${pad(i.month)}-${pad(i.day)} ${i.timeUnknown ? '(time unknown)' : `${pad(i.hour)}:${pad(i.minute)}`} · UTC${i.tzOffset >= 0 ? '+' : ''}${i.tzOffset} · ${i.gender === 'f' ? 'female' : 'male'}
      ${c.solarCorrectionMin ? ` · true solar time ${c.solarCorrectionMin > 0 ? '+' : ''}${c.solarCorrectionMin} min` : ''}</div>
    <div style="margin-top:12px">${pillarsHtml(c)}</div>
    <p class="small muted" style="margin-bottom:0">Tap any character for its meaning. Small letters under the branches are the Ten Gods of the hidden stems.</p>
  </div>
  <div class="card" data-dm="${c.dayMaster}">
    <h3 style="margin-top:0">Day Master: <span class="tx-${dm.el}" style="font-family:var(--serif)">${dm.zh}</span> ${dm.py} – ${polEl(c.dayMaster)}</h3>
    <p>${dm.desc}</p>
    <p><span class="chip">Season: ${c.strength.phase.zh} ${c.strength.phase.name}</span><span class="chip">Support ≈ ${c.strength.ratio}%</span><span class="chip">${c.strength.label}</span></p>
    <p class="small muted">${c.strength.phase.desc} The support score counts Companion and Resource elements (month branch weighted double). It is a learning aid, not a full judgement.</p>
    <p class="small">${c.strength.ratio >= 45
      ? 'A stronger Day Master is classically balanced by <b>Output, Wealth and Power</b>: ' + [1, 2, 3].map((d) => ELEMENTS[(dm.el + d) % 5].name).join(', ') + '.'
      : 'A weaker Day Master is classically supported by <b>Resource and Companions</b>: ' + [4, 0].map((d) => ELEMENTS[(dm.el + d) % 5].name).join(', ') + '.'}</p>
  </div>
  <div class="card"><h3 style="margin-top:0">Five Elements balance</h3><div class="bars">
    ${c.elements.map((e) => `<div class="bar" data-el="${e.el}" style="cursor:pointer"><span class="tx-${e.el}" style="font-weight:600">${ELEMENTS[e.el].zh} ${ELEMENTS[e.el].name}</span>
      <span class="track"><i style="width:${e.pct}%;background:var(--${ELEMENTS[e.el].key})"></i></span><span class="small">${e.pct}%</span></div>`).join('')}</div>
    <p class="small muted">Stems count 1; hidden stems 1 / 0.5 / 0.3; month branch ×1.5.</p></div>
  <div class="card"><h3 style="margin-top:0">Interactions</h3>
    ${c.interactions.length ? c.interactions.map((x) => `<div class="inter"><b>${x.chars}</b> ${x.type} <span class="muted small">${x.zh} · ${x.where}</span><div class="small">${x.note}</div></div>`).join('')
      : '<p class="muted">No major combinations or clashes between the natal pillars.</p>'}</div>
  <div class="card" data-dm="${c.dayMaster}"><h3 style="margin-top:0">Luck Pillars 大运</h3>
    <p class="small muted">${c.luck.forward ? 'Forward' : 'Backward'} · first luck pillar starts at about ${c.luck.startYears} years ${c.luck.startMonths} months${i.timeUnknown ? ' (approximate – birth time unknown)' : ''}.</p>
    <div class="luck">${c.luck.pillars.map((p) => `<div class="${curLuck && p.year === curLuck.year ? 'now' : ''}"><div>${p.year}</div><div class="muted">age ${Math.floor(p.age)}</div>
      ${stemTile(p.stem, 'sm')}${branchTile(p.branch, 'sm')}<div>${TEN_GODS[tenGod(c.dayMaster, p.stem)].short}</div></div>`).join('')}</div></div>
  ${readingHtml(c)}
  <div class="row"><button class="btn secondary" id="del-chart">Delete</button><button class="btn secondary" id="mine-chart">${entry.mine ? '★ My chart' : '☆ Set as my chart'}</button></div>`;
}

// ---------- views ----------
const routes = {
  learn() {
    const done = LESSONS.filter((l) => state.done[l.id]).length;
    const next = LESSONS.find((l) => !state.done[l.id]);
    setTitle('BaZi Academy');
    view.innerHTML = `
      <div class="card hero"><div class="big">八字</div><h2 style="margin:8px 0 4px">Learn the Four Pillars</h2>
        <p>${done === LESSONS.length ? 'Course complete! Keep practising with the quiz and charts.' : `${done} of ${LESSONS.length} lessons completed.`}</p>
        <div class="progress"><i style="width:${(done / LESSONS.length) * 100}%"></i></div>
        ${next ? `<a class="btn" style="margin-top:14px;background:var(--gold);color:#1b1410" href="#/lesson/${next.id}">${done ? 'Continue' : 'Start'}: ${next.title}</a>` : ''}</div>
      ${premium.isPremium() ? '' : `<a class="card premium-banner" href="#/premium"><span class="pb-icon">✦</span><span><b>Premium</b> · unlock lessons ${premium.FREE_LESSONS + 1}–${LESSONS.length}, unlimited charts and detailed readings</span><span class="pb-go">›</span></a>`}
      <div class="list">${LESSONS.map((l, i) => `<a class="card lesson-item ${state.done[l.id] ? 'done' : ''} ${premium.lessonIsLocked(i) ? 'locked' : ''}" href="#/lesson/${l.id}">
        <span class="badge">${premium.lessonIsLocked(i) ? '🔒' : state.done[l.id] ? '✓' : l.zh.slice(0, 2)}</span>
        <span><span class="lvl">${i + 1} · ${l.level}${i >= premium.FREE_LESSONS ? ' · Premium' : ''}</span><div class="t">${l.title} <span class="muted" style="font-family:var(--serif);font-weight:400">${l.zh}</span></div><div class="s">${l.summary}</div></span></a>`).join('')}</div>
      <p class="small muted" style="text-align:center;margin-top:20px"><a href="#/about">About & privacy</a></p>`;
  },

  lesson(id) {
    const idx = LESSONS.findIndex((l) => l.id === id);
    const l = LESSONS[idx];
    if (!l) return go('#/learn');
    setTitle(l.title, true);
    const next = LESSONS[idx + 1];
    if (premium.lessonIsLocked(idx)) {
      view.innerHTML = `<div class="lvl small" style="color:var(--gold)">LESSON ${idx + 1} · ${l.level.toUpperCase()} · PREMIUM</div>
        <h2>${l.title} <span style="font-family:var(--serif);color:var(--accent)">${l.zh}</span></h2>
        <p>${l.summary}</p>${paywallCard('This lesson is part of Premium.')}`;
      bindPaywall();
      return;
    }
    view.innerHTML = `<article class="lesson-body"><div class="lvl small" style="color:var(--gold)">LESSON ${idx + 1} · ${l.level.toUpperCase()}</div>
      <h2>${l.title} <span style="font-family:var(--serif);color:var(--accent)">${l.zh}</span></h2>${l.body}</article>
      <div class="card" id="lq"><h3 style="margin-top:0">Check yourself</h3><div id="lq-body"></div></div>
      <div class="row">${idx > 0 ? `<a class="btn secondary" href="#/lesson/${LESSONS[idx - 1].id}">‹ Previous</a>` : ''}
        ${next ? `<a class="btn" href="#/lesson/${next.id}">Next ›</a>` : '<a class="btn" href="#/quiz">Go to the quiz ›</a>'}</div>`;
    renderWidgets(view);
    runQuiz($('#lq-body'), l.quiz, (score) => {
      if (score >= Math.ceil(l.quiz.length / 2)) { state.done[l.id] = true; save('done'); }
      return score >= Math.ceil(l.quiz.length / 2) ? 'Lesson completed ✓' : 'Read the lesson again and retry to complete it.';
    });
  },

  chart(id) {
    if (id) {
      const entry = state.charts.find((c) => c.id === id);
      if (!entry) return go('#/chart');
      setTitle(entry.name || 'Chart', true);
      view.innerHTML = chartHtml(entry);
      bindPaywall();
      $('#del-chart').onclick = () => { if (confirm('Delete this chart?')) { state.charts = state.charts.filter((c) => c.id !== id); save('charts'); go('#/chart', true); } };
      $('#mine-chart').onclick = () => { state.charts.forEach((c) => { c.mine = c.id === id ? !entry.mine : false; }); save('charts'); routes.chart(id); };
      return;
    }
    setTitle('Your BaZi chart');
    const today = new Date();
    const tzOpts = []; for (let h = -12; h <= 14; h += 0.5) tzOpts.push(h); tzOpts.push(5.75, 8.75, 12.75); tzOpts.sort((a, b) => a - b);
    const tzLabel = (h) => `UTC${h >= 0 ? '+' : '−'}${Math.floor(Math.abs(h))}:${pad(Math.round((Math.abs(h) % 1) * 60))}`;
    view.innerHTML = `
      <form class="card" id="chart-form" autocomplete="off">
        <h2 style="margin-top:0">Calculate a chart</h2>
        ${premium.isPremium() ? '' : `<p class="small ${premium.calculationsLeft() ? 'muted' : ''}" id="calc-left">${premium.calculationsLeft()
          ? `${premium.calculationsLeft()} of ${premium.FREE_CALCULATIONS} free calculations left · <a href="#/premium">Unlimited with Premium</a>`
          : `You have used your ${premium.FREE_CALCULATIONS} free calculations. Your saved charts stay available. <a href="#/premium">Get unlimited charts</a>`}</p>`}
        <label for="f-name">Name</label><input id="f-name" maxlength="40" placeholder="e.g. Me, Anna, …">
        <div class="row"><div><label for="f-date">Birth date</label><input id="f-date" type="date" required min="1900-01-01" max="2100-12-31" value="1990-06-15"></div>
          <div><label for="f-time">Birth time</label><input id="f-time" type="time" value="12:00"></div></div>
        <label class="check"><input type="checkbox" id="f-unknown"> Birth time unknown (three pillars)</label>
        <label>Gender <span class="help">(determines the direction of the luck pillars)</span></label>
        <div class="seg" id="f-gender"><button type="button" data-v="f">Female</button><button type="button" data-v="m" class="on">Male</button></div>
        <label for="f-tz">Time zone at birth</label>
        <select id="f-tz">${tzOpts.map((h) => `<option value="${h}">${tzLabel(h)}</option>`).join('')}</select>
        <div class="help">Use the offset that applied at the birthplace on that date, including daylight saving time (e.g. Germany: winter UTC+1, summer UTC+2). Prefilled from this device.</div>
        <details><summary>Advanced</summary>
          <label for="f-lon">Birthplace longitude (optional, for true solar time)</label>
          <input id="f-lon" type="number" step="0.01" min="-180" max="180" placeholder="e.g. 13.40 for Berlin, −74.00 for New York">
          <div class="help">East positive, west negative. Corrects the hour to the sun’s actual position.</div>
          <label class="check" style="margin-top:12px"><input type="checkbox" id="f-zi" ${state.settings.ziHourNextDay ? 'checked' : ''}> New day starts at 23:00 (Zi hour)</label>
        </details>
        <label class="check" style="margin-top:12px"><input type="checkbox" id="f-mine" ${state.charts.some((c) => c.mine) ? '' : 'checked'}> This is my own chart</label>
        <button class="btn block" style="margin-top:16px" type="submit">Calculate</button>
      </form>
      ${state.charts.length ? `<div class="card"><h3 style="margin-top:0">Saved charts</h3>${state.charts.map((c) => {
        const ch = computeChart({ ...c.input, ziHourNextDay: state.settings.ziHourNextDay });
        return `<div class="saved"><span class="n" data-open="${c.id}"><b>${c.mine ? '<span class="star">★</span> ' : ''}${esc(c.name || 'Chart')}</b><br>
          <span class="small muted">${c.input.year}-${pad(c.input.month)}-${pad(c.input.day)} · <span style="font-family:var(--serif)">${PILLAR_KEYS.map((k) => (ch.pillars[k] ? pillarName(ch.pillars[k]) : '??')).join(' ')}</span></span></span>
          <a class="icon-btn" href="#/chart/${c.id}" aria-label="Open">›</a></div>`; }).join('')}</div>` : ''}
      <p class="small muted">Charts are stored only on this device.</p>`;

    const f = $('#chart-form');
    let tzTouched = false;
    const setTz = () => {
      if (tzTouched) return;
      const [y, m, d] = ($('#f-date').value || '1990-06-15').split('-').map(Number);
      const [hh, mm] = ($('#f-time').value || '12:00').split(':').map(Number);
      const off = -new Date(y, m - 1, d, hh, mm).getTimezoneOffset() / 60;
      $('#f-tz').value = String(off);
    };
    setTz();
    $('#f-tz').addEventListener('change', () => { tzTouched = true; });
    $('#f-date').addEventListener('change', setTz);
    $('#f-time').addEventListener('change', setTz);
    $('#f-unknown').addEventListener('change', (e) => { $('#f-time').disabled = e.target.checked; });
    $('#f-gender').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return;
      [...$('#f-gender').children].forEach((x) => x.classList.toggle('on', x === b)); });
    view.querySelectorAll('[data-open]').forEach((el) => el.addEventListener('click', () => go('#/chart/' + el.dataset.open)));
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const [year, month, day] = $('#f-date').value.split('-').map(Number);
      if (!year) return;
      if (!premium.canCalculate()) { go('#/premium'); return; }
      premium.countCalculation();
      const [hour, minute] = ($('#f-time').value || '12:00').split(':').map(Number);
      const lon = $('#f-lon').value.trim();
      state.settings.ziHourNextDay = $('#f-zi').checked; save('settings');
      const input = { year, month, day, hour, minute, tzOffset: Number($('#f-tz').value), timeUnknown: $('#f-unknown').checked,
        gender: $('#f-gender .on').dataset.v, longitude: lon === '' ? null : Number(lon) };
      const id = Date.now().toString(36);
      const mine = $('#f-mine').checked;
      if (mine) state.charts.forEach((c) => { c.mine = false; });
      state.charts.unshift({ id, name: $('#f-name').value.trim(), input, mine });
      save('charts');
      go('#/chart/' + id);
    });
  },

  quiz(cat) {
    if (cat && (CATEGORIES[cat] || cat === 'mixed')) {
      const name = cat === 'mixed' ? 'Mixed' : CATEGORIES[cat].name;
      setTitle(`Quiz: ${name}`, true);
      view.innerHTML = '<div class="card" id="qz"></div>';
      runQuiz($('#qz'), makeRound(cat, 10), (score) => {
        const prev = state.best[cat] || 0;
        if (score > prev) { state.best[cat] = score; save('best'); }
        return score > prev && prev ? 'New personal best! 🎉' : score === 10 ? 'Perfect score! 🎉' : `Best: ${Math.max(score, prev)}/10`;
      }, () => routes.quiz(cat));
      return;
    }
    setTitle('Quiz');
    const cats = [...Object.entries(CATEGORIES), ['mixed', { name: 'Mixed', zh: '综合' }]];
    view.innerHTML = `<p class="muted">Endless practice: every round has 10 freshly generated questions.</p>
      <div class="cat-grid">${cats.map(([k, c]) => `<button class="cat" data-cat="${k}"><div class="zh">${c.zh}</div><div><b>${c.name}</b></div>
        <div class="best">${state.best[k] !== undefined ? `Best ${state.best[k]}/10` : 'Not played yet'}</div></button>`).join('')}</div>`;
    view.querySelectorAll('[data-cat]').forEach((b) => b.addEventListener('click', () => go('#/quiz/' + b.dataset.cat)));
  },

  today() {
    setTitle('Today');
    const now = new Date();
    const p = pillarsForNow(now);
    const mine = state.charts.find((c) => c.mine);
    const terms = [...jieTermsOfYear(now.getFullYear()), ...jieTermsOfYear(now.getFullYear() + 1)];
    const nextTerm = terms.find((t) => t.ms > now.getTime());
    const nextIdx = JIE_TERMS.findIndex((j) => j.lon === nextTerm.lon);
    const pseudo = { pillars: p, dayMaster: p.day.stem };
    let personal = '';
    if (mine) {
      const c = computeChart({ ...mine.input, ziHourNextDay: state.settings.ziHourNextDay });
      const dm = c.dayMaster;
      const dGod = TEN_GODS[tenGod(dm, p.day.stem)], yGod = TEN_GODS[tenGod(dm, p.year.stem)];
      const db = c.pillars.day.branch;
      const rel = (b) => ((b - db + 12) % 12 === 6 ? `clashes 冲 with your day branch ${BRANCHES[db].zh} – a day for flexibility.`
        : (b + db) % 12 === 1 ? `combines 合 with your day branch ${BRANCHES[db].zh} – harmonious for relationships.`
        : (b - db + 12) % 4 === 0 && b !== db ? `forms a Three Harmony with your day branch ${BRANCHES[db].zh}.` : null);
      const dRel = rel(p.day.branch);
      personal = `<div class="card" data-dm="${dm}"><h3 style="margin-top:0">For you: ${esc(mine.name || 'My chart')} <span class="tx-${STEMS[dm].el}" style="font-family:var(--serif)">${STEMS[dm].zh}</span></h3>
        <p>Today’s stem ${STEMS[p.day.stem].zh} is your <a href="javascript:void 0" data-god="${tenGod(dm, p.day.stem)}"><b>${dGod.name}</b></a> ${dGod.zh}. ${dGod.desc}</p>
        ${dRel ? `<p>Today’s branch ${BRANCHES[p.day.branch].zh} ${dRel}</p>` : ''}
        <p class="small muted">This year’s stem ${STEMS[p.year.stem].zh} is your ${yGod.name} (${yGod.zh}).</p></div>`;
    } else {
      personal = `<div class="card"><p>Save your own chart (★) in the <a href="#/chart">Chart</a> tab to see how today relates to your Day Master.</p></div>`;
    }
    view.innerHTML = `<div class="card"><h2 style="margin-top:0">${now.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h2>
      ${pillarsHtml(pseudo, false).replace('Day Master', 'Day')}
      <p class="small muted">Ten Gods above are shown relative to today’s day stem.</p></div>
      ${personal}
      <div class="card"><h3 style="margin-top:0">Next solar term</h3>
        <p><span style="font-family:var(--serif);font-size:22px">${nextTerm.zh}</span> ${nextTerm.name}<br>
        <span class="muted">${fmtDate(nextTerm.ms)} – the ${BRANCHES[(nextIdx + 2) % 12].animal} ${BRANCHES[(nextIdx + 2) % 12].zh} month begins.</span></p></div>
      <div class="card"><h3 style="margin-top:0">Character of the day</h3>${stemSheet(p.day.stem)}</div>`;
  },

  premium() {
    setTitle('Premium', true);
    const has = premium.isPremium();
    view.innerHTML = `<div class="card hero"><div class="big">✦</div><h2 style="margin:8px 0 4px">BaZi Academy Premium</h2>
        <p>${has ? 'Premium is active. Thank you for supporting the app!' : 'One purchase. Everything unlocked. Yours forever.'}</p></div>
      <div class="card"><ul class="benefits">
        <li><b>All ${LESSONS.length} lessons</b><span>Hidden Stems, Day Master, Ten Gods, strength, interactions, luck pillars and the useful god</span></li>
        <li><b>Unlimited chart calculations</b><span>Charts for family, friends and partners – save as many as you like</span></li>
        <li><b>Detailed chart reading</b><span>Core nature, favourable elements, Ten Gods profile, career, relationships and your current luck phase</span></li>
        <li><b>No ads, no subscription</b><span>A one-time purchase; your data stays on your device</span></li></ul>
        ${has ? '<a class="btn block" href="#/learn">Continue learning</a>' : `<button class="btn block" id="buy">Unlock for ${premium.getPrice()}</button>`}
        <button class="btn secondary block" id="restore" style="margin-top:10px">Restore purchase</button>
        <p class="small muted" style="margin-bottom:0">One-time payment through your ${premium.storeName} account. No subscription, nothing renews.</p></div>`;
    bindPaywall();
  },

  about() {
    setTitle('About', true);
    view.innerHTML = `<div class="card"><h2 style="margin-top:0">BaZi Academy</h2>
      <p>An introduction to BaZi (八字), the Four Pillars of Destiny: Yin and Yang, the Five Elements, the Heavenly Stems and Earthly Branches, the Ten Gods and luck pillars, with a chart calculator and quizzes.</p>
      <h3>How charts are calculated</h3>
      <p class="small">The year and month pillars follow the 24 solar terms (the year starts at Li Chun), calculated from the sun’s apparent longitude. Day pillars follow the continuous 60-day cycle. Hour pillars follow the five-rats rule. True solar time is optional.</p>
      <h3>Privacy</h3>
      <p class="small">The app works offline. Birth data, charts and progress are stored only on your device. Nothing is sent to a server, and there is no tracking or advertising. Purchases are handled entirely by Apple or Google.</p>
      <h3>Disclaimer</h3>
      <p class="small">BaZi is a traditional cultural system. The content is for education and entertainment and is no substitute for professional medical, legal, financial or psychological advice.</p>
      <h3>Premium</h3>
      <p class="small">${premium.isPremium() ? '✦ Premium is active – thank you for supporting the app!' : `Not purchased. <a href="#/premium">See Premium</a>`}</p>
      <button class="btn secondary block" id="restore" style="margin-bottom:10px">Restore purchase</button>
      <button class="btn secondary block" id="reset">Reset learning progress</button>
      <p class="small muted" style="text-align:center">Version 1.0.0</p></div>`;
    $('#restore').onclick = async () => { const ok = await premium.restore(); alert(ok ? 'Premium restored.' : 'No previous purchase found for this store account.'); routes.about(); };
    $('#reset').onclick = () => { if (confirm('Reset lesson progress and quiz scores?')) { state.done = {}; state.best = {}; save('done'); save('best'); go('#/learn'); } };
  },
};

// ---------- premium helpers ----------
function paywallCard(reason) {
  return `<div class="card paywall"><div class="pw-icon">✦</div><h3>${reason}</h3>
    <p class="small">Unlock all lessons, unlimited charts and detailed chart readings with a one-time purchase.</p>
    <button class="btn block buy-btn">Unlock Premium – ${premium.getPrice()}</button>
    <a class="small" href="#/premium" style="display:block;text-align:center;margin-top:10px">What’s included?</a></div>`;
}

function bindPaywall() {
  view.querySelectorAll('.buy-btn, #buy').forEach((b) => b.addEventListener('click', async () => {
    b.disabled = true;
    const r = await premium.buy();
    b.disabled = false;
    if (r === 'purchased') { alert('Thank you! Premium is now unlocked.'); router(); }
    else if (r === 'pending') alert('Your purchase is pending. Premium unlocks as soon as the payment is confirmed.');
    else if (r.startsWith('error:')) alert('The purchase could not be completed. Please try again later.');
  }));
  const rs = $('#restore', view);
  if (rs && !rs.onclick) rs.onclick = async () => { const ok = await premium.restore(); alert(ok ? 'Premium restored.' : 'No previous purchase found for this store account.'); router(); };
}

function readingHtml(c) {
  const { sections } = buildReading(c);
  if (premium.isPremium()) {
    return `<div class="card reading"><h3 style="margin-top:0">Detailed reading <span class="pill">Premium</span></h3>
      ${sections.map((s, i) => `<details ${i < 2 ? 'open' : ''}><summary>${s.title}</summary>${s.html}</details>`).join('')}</div>`;
  }
  return `<div class="card reading"><h3 style="margin-top:0">Detailed reading</h3>
    <h4>${sections[0].title}</h4>${sections[0].html}
    <div class="teaser">${sections.slice(1, -1).map((s) => `<h4>🔒 ${s.title}</h4>`).join('')}</div></div>
    ${paywallCard('Read your full chart')}`;
}

// ---------- quiz runner ----------
function runQuiz(host, questions, onFinish, onRetry) {
  let i = 0, score = 0;
  const show = () => {
    if (i >= questions.length) {
      const msg = onFinish(score);
      host.innerHTML = `<div class="score-big">${score}/${questions.length}</div><p style="text-align:center">${msg}</p>
        <button class="btn block" id="q-retry">Try again</button>`;
      $('#q-retry', host).onclick = () => { if (onRetry) onRetry(); else { i = 0; score = 0; show(); } };
      return;
    }
    const q = questions[i];
    host.innerHTML = `<div class="q-head"><span>Question ${i + 1}/${questions.length}</span><span>Score ${score}</span></div>
      <p style="font-size:18px;font-weight:600;margin-top:10px">${esc(q.q)}</p>
      <div class="q-opts no-sheet">${q.options.map((o, k) => `<button class="q-opt" data-k="${k}">${esc(o)}</button>`).join('')}</div>
      <div class="q-explain" hidden></div>`;
    host.querySelectorAll('.q-opt').forEach((b) => b.addEventListener('click', () => {
      const k = Number(b.dataset.k);
      host.querySelectorAll('.q-opt').forEach((x) => { x.disabled = true; });
      host.querySelectorAll('.q-opt')[q.answer].classList.add('right');
      if (k === q.answer) score++; else b.classList.add('wrong');
      const ex = $('.q-explain', host);
      ex.hidden = false;
      ex.innerHTML = `<p>${k === q.answer ? '✅ Correct!' : '❌ Not quite.'} ${esc(q.explain || '')}</p><button class="btn block" id="q-next">${i + 1 < questions.length ? 'Next' : 'See result'}</button>`;
      $('#q-next', host).onclick = () => { i++; show(); };
      $('#q-next', host).scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }));
  };
  show();
}

// ---------- router ----------
function setTitle(t, back = false) { $('#title').textContent = t; $('#back').hidden = !back; }
function go(hash, replace = false) { if (replace) location.replace(hash); else location.hash = hash; }
$('#back').addEventListener('click', () => { if (history.length > 1) history.back(); else go('#/learn'); });

function router() {
  closeSheet();
  const [, name = 'learn', arg] = (location.hash || '#/learn').split('/');
  const tab = { lesson: 'learn', about: 'learn', premium: 'learn' }[name] || name;
  document.querySelectorAll('.tabs a').forEach((a) => a.classList.toggle('active', a.dataset.tab === tab));
  (routes[name] || routes.learn)(arg ? decodeURIComponent(arg) : undefined);
  view.scrollTop = 0;
}
window.addEventListener('hashchange', router);
router();
premium.onChange(() => router());
premium.init();

// ---------- Android hardware back button (Capacitor) ----------
const CapApp = window.Capacitor?.Plugins?.App;
if (CapApp) {
  CapApp.addListener('backButton', ({ canGoBack }) => {
    if (!sheet.hidden) closeSheet();
    else if (canGoBack && (location.hash || '#/learn') !== '#/learn') history.back();
    else CapApp.exitApp();
  });
}
