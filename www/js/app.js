import { STEMS, BRANCHES, ELEMENTS, TEN_GODS, JIE_TERMS } from './data.js';
import { t, lang, LOCALE, LANGS, langSetting, setLang } from './i18n.js';
import { LESSONS } from './lessons.js';
import { computeChart, tenGod, pillarName, pillarPinyin, pillarFromIndex, pillarsForNow, jieTermsOfYear,
  SEASON_PHASES, PILLAR_KEYS, PILLAR_LABEL } from './bazi.js';
import { CATEGORIES, makeRound } from './quiz.js';
import { buildReading } from './reading.js';
import * as premium from './premium.js';
import { plugin } from './cap.js';
import { BUILD } from './build-flags.js';
import { PUBLISHER } from './publisher.js';
import { searchPlaces, utcOffsetFor, countryName } from './places.js';
import { dayInfo, findDays, ACTIVITIES, OFFICERS, RATING_LABEL } from './almanac.js';
import { compare, idealMatch } from './compat.js';
import * as notify from './notify.js';
import { shareChart, shareTextFile } from './share.js';
import { dayEvents, lunarDate, moonAge, MONTH_NAMES } from './lunar.js';
import { KINDS, collectEvents, buildIcs } from './ics.js';
import { findStars, STARS, pillarListText } from './shensha.js';
import { yearForecast, baziYearOf } from './forecast.js';
import { makeBackup, validateBackup, mergeBackup } from './backup.js';
import { hoursOfDay, hourBranchOf, DEITIES } from './hours.js';
import { influencesFor } from './influences.js';
import { lifeTimeline } from './timeline.js';
import { MONTH_TEXT } from './forecast.js';
import { dayPillarProfile } from './daypillars.js';
import { stageOf } from './stages.js';
import { GUIDE } from './guide.js';
import { STORE_LINKS } from './store-links.js';
import { WEB_BUILD } from './build-flags.js';
import { GOD_TEXT, favourableElements } from './reading.js';
import { dailyReading, sectorElement } from './daily.js';

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
const polEl = (s) => t(STEMS[s].yang ? 'Yang {el}' : 'Yin {el}', { el: ELEMENTS[STEMS[s].el].name });

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
    ${god ? `<p class="tip">${t('Relative to the Day Master {dm}:', { dm: STEMS[dm].zh })} <b>${god.name} ${god.zh}</b> – ${god.desc}</p>` : ''}
    <p><b>${t("Combines with:")}</b> ${STEMS[combo].zh} ${STEMS[combo].py}</p>
    <p><b>${t("Found as hidden stem in:")}</b> ${BRANCHES.map((b, i) => (b.hidden.includes(s) ? `${b.zh} ${b.animal}` : null)).filter(Boolean).join(', ')}</p>`;
}
function branchSheet(b) {
  const br = BRANCHES[b];
  return `<div class="head">${branchTile(b)}<div><h2 style="margin:0">${br.zh} ${br.py} – ${br.animal}</h2>
    <div class="muted">${t(br.yang ? 'Yang {el}' : 'Yin {el}', { el: ELEMENTS[br.el].name })}</div></div></div>
    <table><tr><th>${t("Hours")}</th><td>${br.hours}</td></tr><tr><th>${t("Solar month")}</th><td>${br.month}</td></tr>
    <tr><th>${t("Hidden stems")}</th><td>${br.hidden.map((s, i) => `<span class="tx-${STEMS[s].el}" style="font-family:var(--serif);font-size:18px">${STEMS[s].zh}</span> ${[t('main'), t('middle'), t('residual')][i]}`).join(' · ')}</td></tr>
    <tr><th>${t("Clashes with")}</th><td>${BRANCHES[(b + 6) % 12].zh} ${BRANCHES[(b + 6) % 12].animal}</td></tr>
    <tr><th>${t("Six Harmony")}</th><td>${BRANCHES[(13 - b) % 12].zh} ${BRANCHES[(13 - b) % 12].animal}</td></tr>
    <tr><th>${t("Three Harmony")}</th><td>${[b, (b + 4) % 12, (b + 8) % 12].sort((x, y) => x - y).map((x) => BRANCHES[x].zh).join('')}</td></tr></table>`;
}
function godSheet(key) {
  const g = TEN_GODS[key];
  return `<h2>${g.name} <span style="font-family:var(--serif)">${g.zh}</span></h2><p class="muted">${g.py} · ${g.rel}</p><p>${g.desc}</p>`;
}

document.addEventListener('click', (e) => {
  const tg = e.target.closest('[data-stem],[data-branch],[data-god],[data-el]');
  if (!tg || tg.closest('.no-sheet')) return;
  const dm = tg.closest('[data-dm]')?.dataset.dm;
  if (tg.dataset.stem) openSheet(stemSheet(Number(tg.dataset.stem), dm !== undefined ? Number(dm) : null));
  else if (tg.dataset.branch) openSheet(branchSheet(Number(tg.dataset.branch)));
  else if (tg.dataset.god) openSheet(godSheet(tg.dataset.god));
  else if (tg.dataset.el) { const el = ELEMENTS[Number(tg.dataset.el)];
    openSheet(`<h2 class="tx-${tg.dataset.el}">${el.zh} ${el.name}</h2><p>${el.traits}</p><p><b>${t("Season:")}</b> ${el.season} · <b>${t("Direction:")}</b> ${el.direction}</p>
      <p><b>${t("Produces:")}</b> ${ELEMENTS[(Number(tg.dataset.el) + 1) % 5].name} · <b>${t("Controls:")}</b> ${ELEMENTS[(Number(tg.dataset.el) + 2) % 5].name}</p>`); }
});

// ---------- widgets ----------
function cycleSvg() {
  const pts = ELEMENTS.map((_, i) => { const a = (-90 + i * 72) * Math.PI / 180; return [150 + 105 * Math.cos(a), 150 + 105 * Math.sin(a)]; });
  const line = (a, b, cls, shrink = 30) => {
    const [x1, y1] = pts[a], [x2, y2] = pts[b]; const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    return `<line x1="${x1 + dx / L * shrink}" y1="${y1 + dy / L * shrink}" x2="${x2 - dx / L * shrink}" y2="${y2 - dy / L * shrink}" class="${cls}" marker-end="url(#ar-${cls})"/>`;
  };
  return `<div class="cycle"><svg viewBox="0 0 300 300" role="img" aria-label="${t('Producing and controlling cycles')}">
    <defs>${['gen', 'ctl'].map((c) => `<marker id="ar-${c}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="${c === 'gen' ? 'var(--ok)' : 'var(--bad)'}"/></marker>`).join('')}</defs>
    <style>.gen{stroke:var(--ok);stroke-width:2.5}.ctl{stroke:var(--bad);stroke-width:1.5;stroke-dasharray:5 4}</style>
    ${ELEMENTS.map((_, i) => line(i, (i + 1) % 5, 'gen')).join('')}
    ${ELEMENTS.map((_, i) => line(i, (i + 2) % 5, 'ctl')).join('')}
    ${ELEMENTS.map((e, i) => `<g data-el="${i}" style="cursor:pointer"><circle cx="${pts[i][0]}" cy="${pts[i][1]}" r="26" fill="var(--${e.key})"/>
      <text x="${pts[i][0]}" y="${pts[i][1] + 8}" text-anchor="middle" fill="#fff" font-size="24" font-family="var(--serif)">${e.zh}</text></g>`).join('')}
  </svg><p class="small muted" style="text-align:center"><span style="color:var(--ok)">${t("━ produces 生")}</span> · <span style="color:var(--bad)">${t("┅ controls 克")}</span></p></div>`;
}

function wheelSvg() {
  const pt = (i, r) => { const a = (-90 + i * 30) * Math.PI / 180; return [150 + r * Math.cos(a), 150 + r * Math.sin(a)]; };
  let lines = '';
  for (let i = 0; i < 6; i++) { const [x1, y1] = pt(i, 95), [x2, y2] = pt(i + 6, 95); lines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--bad)" stroke-dasharray="4 4" stroke-width="1.2"/>`; }
  return `<div class="wheel"><svg viewBox="0 0 300 300" role="img" aria-label="${t('Branch wheel with clashes')}">${lines}
    ${BRANCHES.map((b, i) => { const [x, y] = pt(i, 120); return `<g data-branch="${i}" style="cursor:pointer"><circle cx="${x}" cy="${y}" r="20" fill="var(--${ELEMENTS[b.el].key})"/>
      <text x="${x}" y="${y + 7}" text-anchor="middle" fill="#fff" font-size="19" font-family="var(--serif)">${b.zh}</text></g>`; }).join('')}
    <text x="150" y="155" text-anchor="middle" font-size="12" fill="var(--muted)">${t("dashed = clash 冲")}</text></svg></div>`;
}

let trainerDm = 0;
function trainer() {
  return `<div class="card" data-dm="${trainerDm}"><h3 style="margin-top:0">${t("Ten Gods trainer")}</h3>
    <label for="tg-dm">${t("Choose a Day Master")}</label>
    <select id="tg-dm">${STEMS.map((s, i) => `<option value="${i}" ${i === trainerDm ? 'selected' : ''}>${s.zh} ${s.py} – ${polEl(i)}</option>`).join('')}</select>
    <div class="grid g5" style="margin-top:12px">${STEMS.map((_, i) => `<div style="text-align:center">${stemTile(i, 'sm')}
      <div class="small" style="font-weight:600">${i === trainerDm ? t('Self') : TEN_GODS[tenGod(trainerDm, i)].name}</div></div>`).join('')}</div></div>`;
}

const WIDGETS = {
  'sample-chart': () => { const c = computeChart({ year: 2000, month: 1, day: 1, hour: 12, minute: 0, tzOffset: 8 });
    return `<div class="card"><div class="small muted" style="margin-bottom:6px">${t('Example: 1 Jan 2000, 12:00 (Beijing)')}</div>${pillarsHtml(c, false)}</div>`; },
  elements: () => `<div class="grid g5">${ELEMENTS.map((e, i) => `<button class="ch el-${i}" data-el="${i}"><span class="zh">${e.zh}</span><span class="py">${e.name}</span></button>`).join('')}</div>
    <p class="small muted">${t("Tap an element for details.")}</p>`,
  cycle: cycleSvg,
  wheel: wheelSvg,
  stems: () => `<div class="grid g5">${STEMS.map((_, i) => stemTile(i)).join('')}</div>
    <p class="small muted">${t("Pairs of the same colour share an element: first Yang, then Yin. Tap to explore.")}</p>`,
  branches: () => `<div class="grid g4">${BRANCHES.map((_, i) => branchTile(i)).join('')}</div>`,
  jiazi: () => { const cur = pillarsForNow().year.index;
    return `<div class="jiazi">${Array.from({ length: 60 }, (_, i) => { const p = pillarFromIndex(i);
      return `<div class="${i === cur ? 'cur' : ''}">${pillarName(p)}<small>${i + 1}</small></div>`; }).join('')}</div>
      <p class="small muted">${t("Highlighted: the current year pillar.")}</p>`; },
  jie: () => { const y = new Date().getFullYear();
    return `<h3>${t('Month starts (Jie terms) in {y}', { y })}</h3><table><tr><th>${t("Term")}</th><th>${t("Month")}</th><th>${t('Date (your time)')}</th></tr>
      ${jieTermsOfYear(y).map((jt) => { const idx = JIE_TERMS.findIndex((j) => j.lon === jt.lon); const b = BRANCHES[(idx + 2) % 12];
        return `<tr><td><span style="font-family:var(--serif)">${jt.zh}</span> ${jt.name.split(' – ')[0]}</td><td>${b.zh} ${b.animal}</td><td>${fmtDate(jt.ms)}</td></tr>`; }).join('')}</table>`; },
  hidden: () => `<table><tr><th>${t("Branch")}</th><th>${t("Main")}</th><th>${t("Middle")}</th><th>${t("Residual")}</th></tr>
    ${BRANCHES.map((b, i) => `<tr><td><span data-branch="${i}" style="cursor:pointer;font-family:var(--serif);font-size:18px" class="tx-${b.el}">${b.zh}</span> ${b.animal}</td>
      ${[0, 1, 2].map((k) => { const s = b.hidden[k]; return `<td>${s !== undefined ? `<span class="tx-${STEMS[s].el}" style="font-family:var(--serif);font-size:18px">${STEMS[s].zh}</span> <span class="small muted">${ELEMENTS[STEMS[s].el].name}</span>` : ''}</td>`; }).join('')}</tr>`).join('')}</table>`,
  tengods: () => `<table><tr><th>${t("Relation")}</th><th>${t("Same polarity")}</th><th>${t("Opposite")}</th></tr>
    ${[['Same element', 'F', 'RW'], ['I produce', 'EG', 'HO'], ['I control', 'IW', 'DW'], ['Controls me', '7K', 'DO'], ['Produces me', 'IR', 'DR']]
      .map(([r, a, b]) => `<tr><td>${t(r)}</td>${[a, b].map((k) => `<td><a href="javascript:void 0" data-god="${k}">${TEN_GODS[k].name}</a><br><span class="small muted" style="font-family:var(--serif)">${TEN_GODS[k].zh}</span></td>`).join('')}</tr>`).join('')}</table>`,
  'tengod-trainer': trainer,
  stars: () => `<table>${Object.values(STARS).map((st) => `<tr><td style="font-size:20px">${st.icon}</td><td><b>${st.name}</b> <span style="font-family:var(--serif)">${st.zh}</span><br><span class="small">${st.desc}</span></td></tr>`).join('')}</table>`,
  daypillars: () => `<div class="jiazi">${Array.from({ length: 60 }, (_, i) => { const p = pillarFromIndex(i);
      return `<div class="dp-cell" data-dp="${i}" style="cursor:pointer">${pillarName(p)}<small>${i + 1}</small></div>`; }).join('')}</div>
    <p class="small muted">${t('Tap a day pillar to read its profile.')}</p>`,
  phases: () => `<table>${SEASON_PHASES.map((p) => `<tr><td style="font-family:var(--serif);font-size:22px;color:var(--accent)">${p.zh}</td><td><b>${p.name}</b><br><span class="small">${p.desc}</span></td></tr>`).join('')}</table>`,
};

function renderWidgets(root) {
  root.querySelectorAll('[data-widget]').forEach((el) => { const w = WIDGETS[el.dataset.widget]; if (w) el.innerHTML = w(); });
  root.querySelectorAll('[data-dp]').forEach((el) => el.addEventListener('click', () => { const p = pillarFromIndex(+el.dataset.dp);
    openSheet(`<h2 style="margin-top:0">${t('Day pillar {p}', { p: pillarName(p) })}</h2>${dayPillarHtml(p.stem, p.branch)}`); }));
  const sel = $('#tg-dm', root);
  if (sel) sel.addEventListener('change', () => { trainerDm = Number(sel.value); const host = sel.closest('[data-widget]'); host.innerHTML = trainer(); renderWidgets(host.parentElement); });
}

// ---------- chart rendering ----------
function pillarsHtml(c, withHidden = true) {
  const dm = c.dayMaster;
  return `<div class="pillars" data-dm="${dm}">${PILLAR_KEYS.map((k) => {
    const p = c.pillars[k];
    if (!p) return `<div><div class="lbl">${PILLAR_LABEL[k]}</div><div class="god"></div><div class="muted" style="padding-top:30px">?</div><div class="small muted">${t("time unknown")}</div></div>`;
    const god = k === 'day' ? t('Day Master') : TEN_GODS[tenGod(dm, p.stem)].name;
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
    <h2 style="margin-bottom:2px">${esc(entry.name || t('Chart'))} ${entry.mine ? `<span class="star" title="${t('My chart')}">★</span>` : ''}</h2>
    <div class="small muted">${i.place ? `${esc(i.place.name)}, ${esc(countryName(i.place.cc))} · ` : ''}${i.year}-${pad(i.month)}-${pad(i.day)} ${i.timeUnknown ? t('(time unknown)') : `${pad(i.hour)}:${pad(i.minute)}`} · UTC${i.tzOffset >= 0 ? '+' : ''}${i.tzOffset} · ${i.gender === 'f' ? t('female') : t('male')}
      ${c.solarCorrectionMin ? ` · ${t('true solar time {m} min', { m: (c.solarCorrectionMin > 0 ? '+' : '') + c.solarCorrectionMin })}` : ''}</div>
    <div style="margin-top:12px">${pillarsHtml(c)}</div>
    <p class="small muted" style="margin-bottom:0">${t("Tap any character for its meaning. Small letters under the branches are the Ten Gods of the hidden stems.")}</p>
  </div>
  <div class="card" data-dm="${c.dayMaster}">
    <h3 style="margin-top:0">${t("Day Master:")} <span class="tx-${dm.el}" style="font-family:var(--serif)">${dm.zh}</span> ${dm.py} – ${polEl(c.dayMaster)}</h3>
    <p>${dm.desc}</p>
    <p><span class="chip">${t('Season:')} ${c.strength.phase.zh} ${c.strength.phase.name}</span><span class="chip">${t('Support ≈ {n}%', { n: c.strength.ratio })}</span><span class="chip">${t(c.strength.label)}</span></p>
    <p class="small muted">${c.strength.phase.desc} ${t('The support score counts Companion and Resource elements (month branch weighted double). It is a learning aid, not a full judgement.')}</p>
    <p class="small">${c.strength.ratio >= 45
      ? t('A stronger Day Master is classically balanced by <b>Output, Wealth and Power</b>: {els}.', { els: [1, 2, 3].map((d) => ELEMENTS[(dm.el + d) % 5].name).join(', ') })
      : t('A weaker Day Master is classically supported by <b>Resource and Companions</b>: {els}.', { els: [4, 0].map((d) => ELEMENTS[(dm.el + d) % 5].name).join(', ') })}</p>
  </div>
  ${dayPillarCard(c)}
  <div class="card"><h3 style="margin-top:0">${t("Five Elements balance")}</h3><div class="bars">
    ${c.elements.map((e) => `<div class="bar" data-el="${e.el}" style="cursor:pointer"><span class="tx-${e.el}" style="font-weight:600">${ELEMENTS[e.el].zh} ${ELEMENTS[e.el].name}</span>
      <span class="track"><i style="width:${e.pct}%;background:var(--${ELEMENTS[e.el].key})"></i></span><span class="small">${e.pct}%</span></div>`).join('')}</div>
    <p class="small muted">${t('Stems count 1; hidden stems 1 / 0.5 / 0.3; month branch ×1.5.')}</p></div>
  <div class="card"><h3 style="margin-top:0">${t("Interactions")}</h3>
    ${c.interactions.length ? c.interactions.map((x) => `<div class="inter"><b>${x.chars}</b> ${x.label} <span class="muted small">${x.zh} · ${x.whereLabel}</span><div class="small">${x.note}</div></div>`).join('')
      : `<p class="muted">${t("No major combinations or clashes between the natal pillars.")}</p>`}</div>
  <div class="card" data-dm="${c.dayMaster}"><h3 style="margin-top:0">${t("Luck Pillars 大运")}</h3>
    <p class="small muted">${c.luck.forward ? t('Forward') : t('Backward')} · ${t('first luck pillar starts at about {y} years {m} months', { y: c.luck.startYears, m: c.luck.startMonths })}${i.timeUnknown ? t(' (approximate – birth time unknown)') : ''}.</p>
    <div class="luck">${c.luck.pillars.map((p) => `<div class="${curLuck && p.year === curLuck.year ? 'now' : ''}"><div>${p.year}</div><div class="muted">${t('age {n}', { n: Math.floor(p.age) })}</div>
      ${stemTile(p.stem, 'sm')}${branchTile(p.branch, 'sm')}<div>${TEN_GODS[tenGod(c.dayMaster, p.stem)].short}</div></div>`).join('')}</div></div>
  ${starsCard(c)}
  ${readingHtml(c)}
  <a class="card premium-banner" href="#/forecast/${entry.id}"><span class="pb-icon">📅</span><span><b>${t('Year ahead {y}', { y: baziYearOf() })}</b> · ${t('your year and its 12 months')}</span><span class="pb-go">›</span></a>
  <a class="card premium-banner" href="#/influences/${entry.id}"><span class="pb-icon">🧭</span><span><b>${t('Influences')}</b> · ${t('any date measured against this chart')}</span><span class="pb-go">›</span></a>
  <a class="card premium-banner" href="#/timeline/${entry.id}"><span class="pb-icon">🧵</span><span><b>${t('Life timeline')}</b> · ${t('all luck pillars and years at a glance')}</span><span class="pb-go">›</span></a>
  <div class="card"><h3 style="margin-top:0">${t('Group & notes')}</h3>
    <label for="c-group">${t('Group')}</label><select id="c-group">${groupOptions(entry.group || '')}</select>
    <label for="c-notes">${t('Notes')}</label><textarea id="c-notes" rows="4" maxlength="2000" placeholder="${t('e.g. what you know about this person, events to compare with the chart …')}">${esc(entry.notes || '')}</textarea>
    <p class="help" id="c-saved">${t('Saved automatically on this device.')}</p></div>
  <div class="row" style="margin-bottom:10px"><button class="btn" id="share-chart">${t("⇪ Share as image")}</button><a class="btn secondary" href="#/match/${entry.id}">${t("♥ Compare")}</a></div>
  <div class="row"><button class="btn secondary" id="del-chart">${t("Delete")}</button><button class="btn secondary" id="mine-chart">${entry.mine ? t('★ My chart') : t('☆ Set as my chart')}</button></div>`;
}

// ---------- views ----------
// ---------- birth data form (shared by the chart page and the welcome screen) ----------
const TZ_OPTS = (() => { const o = []; for (let h = -12; h <= 14; h += 0.5) o.push(h); o.push(5.75, 8.75, 12.75); return o.sort((a, b) => a - b); })();
const tzLabel = (h) => `UTC${h >= 0 ? '+' : '−'}${Math.floor(Math.abs(h))}:${pad(Math.round((Math.abs(h) % 1) * 60))}`;
const tzOpts = TZ_OPTS;

function birthFieldsHtml() {
  return `        <label for="f-name">${t("Name")}</label><input id="f-name" maxlength="40" placeholder="${t('e.g. Me, Anna, …')}">
        <div class="row"><div><label for="f-date">${t("Birth date")}</label><input id="f-date" type="date" required min="1900-01-01" max="2100-12-31" value="1990-06-15"></div>
          <div><label for="f-time">${t("Birth time")}</label><input id="f-time" type="time" value="12:00"></div></div>
        <label class="check"><input type="checkbox" id="f-unknown"> ${t('Birth time unknown (three pillars)')}</label>
        <label>${t("Gender")} <span class="help">${t('(determines the direction of the luck pillars)')}</span></label>
        <div class="seg" id="f-gender"><button type="button" data-v="f">${t("Female")}</button><button type="button" data-v="m" class="on">${t("Male")}</button></div>
        <label for="f-place">${t("Birthplace")}</label>
        <div class="place-wrap"><input id="f-place" autocomplete="off" placeholder="${t('Start typing a city, e.g. Bad Homburg')}" role="combobox" aria-expanded="false" aria-controls="f-place-list">
          <div class="place-list" id="f-place-list" role="listbox" hidden></div></div>
        <div class="help" id="f-place-help">${t('Sets the time zone (incl. historical daylight saving) and true solar time automatically.')}</div>
        <label class="check" id="f-solar-row" hidden><input type="checkbox" id="f-solar" checked> ${t("Use true solar time for the birthplace")}</label>
        <label for="f-tz">${t("Time zone at birth")}</label>
        <select id="f-tz">${tzOpts.map((h) => `<option value="${h}">${tzLabel(h)}</option>`).join('')}</select>
        <div class="help" id="f-tz-help">${t("Prefilled from this device. Choosing the birthplace sets it correctly for the birth date.")}</div>
        <details><summary>${t("Advanced")}</summary>
          <label for="f-lon">${t('Birthplace longitude (if your place isn’t in the list)')}</label>
          <input id="f-lon" type="number" step="0.01" min="-180" max="180" placeholder="${t('e.g. 13.40 for Berlin, −74.00 for New York')}">
          <div class="help">${t("East positive, west negative. Corrects the hour to the sun’s actual position.")}</div>
          <label class="check" style="margin-top:12px"><input type="checkbox" id="f-zi" ${state.settings.ziHourNextDay ? 'checked' : ''}> ${t('New day starts at 23:00 (Zi hour)')}</label>
        </details>
`;
}

/** Wires up the birth form fields; returns { read } which gives { name, input } or null. */
function bindBirthForm() {
    let tzTouched = false;
    let place = null;
    const setTzValue = (off) => {
      const sel = $('#f-tz');
      if (![...sel.options].some((o) => Number(o.value) === off)) sel.add(new Option(tzLabel(off), String(off)));
      sel.value = [...sel.options].find((o) => Number(o.value) === off).value;
    };
    const setTz = () => {
      const [y, m, d] = ($('#f-date').value || '1990-06-15').split('-').map(Number);
      const [hh, mm] = ($('#f-time').value || '12:00').split(':').map(Number);
      if (place) {
        const off = utcOffsetFor(place.tz, y, m, d, hh, mm);
        if (off !== null) { setTzValue(off); $('#f-tz-help').textContent = t('Set from {place} ({tz}) for this date', { place: place.name, tz: place.tz }) + (off !== utcOffsetFor(place.tz, y, 1, 15) ? t(' – daylight saving time') : '') + '.'; return; }
      }
      if (tzTouched) return;
      setTzValue(-new Date(y, m - 1, d, hh, mm).getTimezoneOffset() / 60);
    };
    const list = $('#f-place-list'), placeIn = $('#f-place');
    let results = [], active = -1, searchSeq = 0;
    const closeList = () => { list.hidden = true; placeIn.setAttribute('aria-expanded', 'false'); active = -1; };
    const choose = (c) => {
      place = c; placeIn.value = `${c.name}, ${countryName(c.cc)}`; closeList();
      $('#f-lon').value = c.lon.toFixed(2); $('#f-solar-row').hidden = false; $('#f-solar').checked = true;
      $('#f-place-help').textContent = `${c.lat.toFixed(2)}°, ${c.lon.toFixed(2)}° · ${t('time zone')} ${c.tz}`;
      setTz();
    };
    placeIn.addEventListener('input', async () => {
      place = null; $('#f-solar-row').hidden = true; $('#f-lon').value = ''; $('#f-tz-help').textContent = t('Prefilled from this device. Choosing the birthplace sets it correctly for the birth date.');
      const seq = ++searchSeq;
      const found = await searchPlaces(placeIn.value);
      if (seq !== searchSeq) return; // a newer keystroke is already being handled
      results = found; active = -1;
      if (!found.length) { list.innerHTML = placeIn.value.trim().length >= 2 ? `<div class="place-none">${t("No match – try another spelling or enter the longitude under Advanced.")}</div>` : ''; list.hidden = !list.innerHTML; return; }
      list.innerHTML = found.map((c, i) => `<div class="place-opt" role="option" data-i="${i}"><b>${esc(c.name)}</b> <span class="muted">${esc(countryName(c.cc))}</span></div>`).join('');
      list.hidden = false; placeIn.setAttribute('aria-expanded', 'true');
    });
    list.addEventListener('mousedown', (e) => e.preventDefault()); // keep focus so the click registers
    list.addEventListener('click', (e) => { const o = e.target.closest('.place-opt'); if (o) choose(results[+o.dataset.i]); });
    placeIn.addEventListener('keydown', (e) => {
      if (list.hidden || !results.length) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); active = (active + (e.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length;
        list.querySelectorAll('.place-opt').forEach((o, i) => o.classList.toggle('on', i === active)); }
      else if (e.key === 'Enter') { e.preventDefault(); choose(results[Math.max(0, active)]); }
      else if (e.key === 'Escape') closeList();
    });
    placeIn.addEventListener('blur', () => setTimeout(closeList, 150));
    setTz();
    $('#f-tz').addEventListener('change', () => { tzTouched = true; });
    $('#f-date').addEventListener('change', setTz);
    $('#f-time').addEventListener('change', setTz);
    $('#f-unknown').addEventListener('change', (e) => { $('#f-time').disabled = e.target.checked; });
    $('#f-gender').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return;
      [...$('#f-gender').children].forEach((x) => x.classList.toggle('on', x === b)); });
  return {
    read() {
      const [year, month, day] = ($('#f-date').value || '').split('-').map(Number);
      if (!year) { $('#f-date').focus(); return null; }
      const [hour, minute] = ($('#f-time').value || '12:00').split(':').map(Number);
      const lon = place && !$('#f-solar').checked ? '' : $('#f-lon').value.trim();
      state.settings.ziHourNextDay = $('#f-zi').checked; save('settings');
      return { name: $('#f-name').value.trim(), input: { year, month, day, hour, minute, tzOffset: Number($('#f-tz').value), timeUnknown: $('#f-unknown').checked,
        gender: $('#f-gender .on').dataset.v, longitude: lon === '' ? null : Number(lon),
        place: place ? { name: place.name, cc: place.cc, lat: place.lat, lon: place.lon, tz: place.tz } : null } };
    },
  };
}

function saveChart(name, input, mine, group = '') {
  const id = Date.now().toString(36);
  if (mine) state.charts.forEach((c) => { c.mine = false; });
  state.charts.unshift({ id, name, input, mine, group, notes: '', created: Date.now() });
  save('charts');
  if (mine) rescheduleTips();
  return id;
}

const routes = {
  learn() {
    const done = LESSONS.filter((l) => state.done[l.id]).length;
    const next = LESSONS.find((l) => !state.done[l.id]);
    setTitle('BaZi Academy');
    view.innerHTML = `
      <div class="card hero"><div class="big">八字</div><h2 style="margin:8px 0 4px">${t("Learn the Four Pillars")}</h2>
        <p>${done === LESSONS.length ? t('Course complete! Keep practising with the quiz and charts.') : t('{done} of {n} lessons completed.', { done, n: LESSONS.length })}</p>
        <div class="progress"><i style="width:${(done / LESSONS.length) * 100}%"></i></div>
        ${next ? `<a class="btn" style="margin-top:14px;background:var(--gold);color:#1b1410" href="#/lesson/${next.id}">${done ? t('Continue') : t('Start')}: ${next.title}</a>` : ''}</div>
      <a class="card premium-banner" href="#/guide"><span class="pb-icon">🧭</span><span><b>${t('How to use the app')}</b> · ${t('get the most out of BaZi Academy')}</span><span class="pb-go">›</span></a>
      ${premium.isPremium() ? '' : premium.WEB ? `<a class="card premium-banner" href="#/premium"><span class="pb-icon">📱</span><span><b>${t('Get the app')}</b> · ${t('lessons {a}–{b}, unlimited charts and detailed readings', { a: premium.FREE_LESSONS + 1, b: LESSONS.length })}</span><span class="pb-go">›</span></a>` : `<a class="card premium-banner" href="#/premium"><span class="pb-icon">✦</span><span><b>${t("Premium")}</b> · ${t('unlock lessons {a}–{b}, unlimited charts and detailed readings', { a: premium.FREE_LESSONS + 1, b: LESSONS.length })}</span><span class="pb-go">›</span></a>`}
      <div class="list">${LESSONS.map((l, i) => `<a class="card lesson-item ${state.done[l.id] ? 'done' : ''} ${premium.lessonIsLocked(i) ? 'locked' : ''}" href="#/lesson/${l.id}">
        <span class="badge">${premium.lessonIsLocked(i) ? '🔒' : state.done[l.id] ? '✓' : l.zh.slice(0, 2)}</span>
        <span><span class="lvl">${i + 1} · ${t(l.level)}${i >= premium.FREE_LESSONS && !premium.FREE_APP ? t(' · Premium') : ''}</span><div class="t">${l.title} <span class="muted" style="font-family:var(--serif);font-weight:400">${l.zh}</span></div><div class="s">${l.summary}</div></span></a>`).join('')}</div>
      <a class="card about-link" href="#/about"><span>ⓘ</span><span><b>${t('Settings, support & backup')}</b><br><span class="small muted">${t('Language, text size, contact, backup and new phone')}</span></span><span class="pb-go">›</span></a>`;
  },

  lesson(id) {
    const idx = LESSONS.findIndex((l) => l.id === id);
    const l = LESSONS[idx];
    if (!l) return go('#/learn');
    setTitle(l.title, true);
    const next = LESSONS[idx + 1];
    if (premium.lessonIsLocked(idx)) {
      view.innerHTML = `<div class="lvl small" style="color:var(--gold)">${t('LESSON {n}', { n: idx + 1 })} · ${t(l.level).toUpperCase()} · ${premium.WEB ? t('In the app').toUpperCase() : 'PREMIUM'}</div>
        <h2>${l.title} <span style="font-family:var(--serif);color:var(--accent)">${l.zh}</span></h2>
        <p>${l.summary}</p>${paywallCard(premium.WEB ? t('This lesson is in the app.') : t('This lesson is part of Premium.'))}`;
      bindPaywall();
      return;
    }
    view.innerHTML = `<article class="lesson-body"><div class="lvl small" style="color:var(--gold)">${t('LESSON {n}', { n: idx + 1 })} · ${t(l.level).toUpperCase()}</div>
      <h2>${l.title} <span style="font-family:var(--serif);color:var(--accent)">${l.zh}</span></h2>${l.body}</article>
      <div class="card" id="lq"><h3 style="margin-top:0">${t("Check yourself")}</h3><div id="lq-body"></div></div>
      <div class="row">${idx > 0 ? `<a class="btn secondary" href="#/lesson/${LESSONS[idx - 1].id}">${t("‹ Previous")}</a>` : ''}
        ${next ? `<a class="btn" href="#/lesson/${next.id}">${t("Next ›")}</a>` : `<a class="btn" href="#/quiz">${t("Go to the quiz ›")}</a>`}</div>`;
    renderWidgets(view);
    runQuiz($('#lq-body'), l.quiz, (score) => {
      if (score >= Math.ceil(l.quiz.length / 2)) { state.done[l.id] = true; save('done'); }
      return score >= Math.ceil(l.quiz.length / 2) ? t('Lesson completed ✓') : t('Read the lesson again and retry to complete it.');
    });
  },

  chart(id) {
    if (id) {
      const entry = state.charts.find((c) => c.id === id);
      if (!entry) return go('#/chart');
      setTitle(entry.name || t('Chart'), true);
      view.innerHTML = chartHtml(entry);
      bindPaywall();
      $('#del-chart').onclick = () => { if (confirm(t('Delete this chart?'))) { state.charts = state.charts.filter((c) => c.id !== id); save('charts'); go('#/chart', true); } };
      $('#mine-chart').onclick = () => { state.charts.forEach((c) => { c.mine = c.id === id ? !entry.mine : false; }); save('charts'); rescheduleTips(); routes.chart(id); };
      $('#c-group').onchange = (e) => { entry.group = e.target.value; save('charts'); };
      let noteTimer = 0;
      $('#c-notes').oninput = (e) => { clearTimeout(noteTimer); noteTimer = setTimeout(() => { entry.notes = e.target.value; save('charts'); }, 400); };
      $('#share-chart').onclick = async (e) => { e.target.disabled = true;
        try { await shareChart(computeChart({ ...entry.input, ziHourNextDay: state.settings.ziHourNextDay }), entry.name); } catch { alert(t('Sharing is not available on this device.')); }
        e.target.disabled = false; };
      return;
    }
    setTitle(t('Your BaZi chart'));
    view.innerHTML = `
      <form class="card" id="chart-form" autocomplete="off">
        <h2 style="margin-top:0">${t("Calculate a chart")}</h2>
        ${premium.isPremium() ? '' : `<p class="small ${premium.calculationsLeft() ? 'muted' : ''}" id="calc-left">${premium.calculationsLeft()
          ? `${t('{left} of {n} free calculations left', { left: premium.calculationsLeft(), n: premium.FREE_CALCULATIONS })} · <a href="#/premium">${premium.WEB ? t('Unlimited in the app') : t("Unlimited with Premium")}</a>`
          : `${t('You have used your {n} free calculations. Your saved charts stay available.', { n: premium.FREE_CALCULATIONS })} <a href="#/premium">${t("Get unlimited charts")}</a>`}</p>`}
        ${birthFieldsHtml()}
        <label class="check" style="margin-top:12px"><input type="checkbox" id="f-mine" ${state.charts.some((c) => c.mine) ? '' : 'checked'}> ${t("This is my own chart")}</label>
        <label for="f-group">${t('Group')}</label><select id="f-group">${groupOptions('')}</select>
        <button class="btn block" style="margin-top:16px" type="submit">${t("Calculate")}</button>
      </form>
      ${state.charts.length ? `<div class="card"><h3 style="margin-top:0">${t("Saved charts")} <span class="muted small">(${state.charts.length})</span></h3>
        <input id="s-q" type="search" placeholder="${t('Search by name, year or notes')}" autocomplete="off">
        <div class="row" style="margin-top:8px"><select id="s-group"><option value="*">${t('All groups')}</option>${groupOptions('', true)}</select>
          <select id="s-sort"><option value="new">${t('Newest first')}</option><option value="name">${t('Name A–Z')}</option><option value="birth">${t('Birth date')}</option></select></div>
        <div id="saved-list"></div></div>` : ''}
      <a class="card premium-banner" href="#/match"><span class="pb-icon">♥</span><span><b>${t("Compatibility")}</b> · ${t('compare two charts – partners, family, friends')}</span><span class="pb-go">›</span></a>
      <p class="small muted">${t("Charts are stored only on this device.")} ${t('<a href="#/about">Back them up</a> before you change phones.')}</p>`;

    const f = $('#chart-form');
    const birth = bindBirthForm();
    if ($('#saved-list')) {
      const renderSaved = () => renderSavedList($('#s-q').value, $('#s-group').value, $('#s-sort').value);
      $('#s-q').oninput = renderSaved; $('#s-group').onchange = renderSaved; $('#s-sort').onchange = renderSaved;
      renderSaved();
    }
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const r = birth.read();
      if (!r) return;
      if (!premium.canCalculate()) { go('#/premium'); return; }
      premium.countCalculation();
      const id = saveChart(r.name, r.input, $('#f-mine').checked, $('#f-group').value);
      go('#/chart/' + id);
    });
  },

  quiz(cat) {
    if (cat && (CATEGORIES[cat] || cat === 'mixed')) {
      const name = cat === 'mixed' ? t('Mixed') : CATEGORIES[cat].name;
      setTitle(t('Quiz: {name}', { name }), true);
      view.innerHTML = '<div class="card" id="qz"></div>';
      runQuiz($('#qz'), makeRound(cat, 10), (score) => {
        const prev = state.best[cat] || 0;
        if (score > prev) { state.best[cat] = score; save('best'); }
        return score > prev && prev ? t('New personal best! 🎉') : score === 10 ? t('Perfect score! 🎉') : t('Best: {n}/10', { n: Math.max(score, prev) });
      }, () => routes.quiz(cat));
      return;
    }
    setTitle(t('Quiz'));
    const cats = [...Object.entries(CATEGORIES), ['mixed', { name: t('Mixed'), zh: '综合' }]];
    view.innerHTML = `<p class="muted">${t("Endless practice: every round has 10 freshly generated questions.")}</p>
      <div class="cat-grid">${cats.map(([k, c]) => `<button class="cat" data-cat="${k}"><div class="zh">${c.zh}</div><div><b>${c.name}</b></div>
        <div class="best">${state.best[k] !== undefined ? t('Best {n}/10', { n: state.best[k] }) : t('Not played yet')}</div></button>`).join('')}</div>`;
    view.querySelectorAll('[data-cat]').forEach((b) => b.addEventListener('click', () => go('#/quiz/' + b.dataset.cat)));
  },

  today() {
    setTitle(t('Today'));
    const now = new Date();
    const p = pillarsForNow(now);
    const mine = state.charts.find((c) => c.mine);
    const terms = [...jieTermsOfYear(now.getFullYear()), ...jieTermsOfYear(now.getFullYear() + 1)];
    const nextTerm = terms.find((x) => x.ms > now.getTime());
    const nextIdx = JIE_TERMS.findIndex((j) => j.lon === nextTerm.lon);
    const pseudo = { pillars: p, dayMaster: p.day.stem };
    const myC = mine ? computeChart({ ...mine.input, ziHourNextDay: state.settings.ziHourNextDay }) : null;
    const lToday = lunarDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const mToday = moonAge(now.getTime());
    const daily = dailyReading(myC, now);
    view.innerHTML = `${dayCardHtml(daily, mine)}
      <div class="card"><h2 style="margin-top:0">${now.toLocaleDateString(LOCALE, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h2>
      <p style="margin-top:-4px"><a href="#/calendar" style="text-decoration:none"><span style="font-family:var(--serif)">${lToday ? lToday.label : ''}</span> · ${mToday.icon} ${mToday.illumination}% · ${t('Lunar calendar')} ›</a></p>
      ${pillarsHtml(pseudo, false).replace(t('Day Master'), t('Day'))}
      <p class="small muted">${t("Ten Gods above are shown relative to today’s day stem.")}</p></div>
      ${clockCard(now, myC)}
      ${mine ? `<a class="card premium-banner" href="#/influences/${mine.id}"><span class="pb-icon">🧭</span><span><b>${t('Influences')}</b> · ${t('any date measured against your chart')}</span><span class="pb-go">›</span></a>` : ''}
      ${mine ? `<a class="card premium-banner" href="#/forecast/${mine.id}"><span class="pb-icon">📅</span><span><b>${t('Your year ahead {y}', { y: baziYearOf(now) })}</b> · ${t('{p} year and its 12 months', { p: pillarName(pillarFromIndex(baziYearOf(now) - 4)) })}</span><span class="pb-go">›</span></a>` : ''}
      ${almanacCard(now, myC)}
      ${notifyCard()}
      <div class="card"><h3 style="margin-top:0">${t("Next solar term")}</h3>
        <p><span style="font-family:var(--serif);font-size:22px">${nextTerm.zh}</span> ${nextTerm.name}<br>
        <span class="muted">${fmtDate(nextTerm.ms)} – ${t('the {animal} {zh} month begins.', { animal: BRANCHES[(nextIdx + 2) % 12].animal, zh: BRANCHES[(nextIdx + 2) % 12].zh })}</span></p></div>
      <div class="card"><h3 style="margin-top:0">${t("Character of the day")}</h3>${stemSheet(p.day.stem)}</div>`;
    bindNotifyCard();
    bindClock(now, myC);
    bindDayCard(daily, now);
  },

  match(aId) {
    setTitle(t('Compatibility'), true);
    const charts = state.charts;
    const calc = (c) => computeChart({ ...c.input, ziHourNextDay: state.settings.ziHourNextDay });
    const mineC = charts.find((c) => c.mine) || charts[0];
    const isP = premium.isPremium();
    const partHtml = (pt) => `<div class="mpart"><div class="mhead"><b>${pt.title}</b><span>${pt.score}/${pt.max}</span></div>
      <div class="track"><i style="width:${(pt.score / pt.max) * 100}%"></i></div><p class="small">${pt.note}</p></div>`;
    const resultHtml = (ca, cb, nA, nB) => {
      const r = compare(ca, cb);
      const roles = `<h3>${t("How you see each other")}</h3>
        <p>${t('<b>For {a}</b>, {b} is {text}', { a: nA, b: nB, text: r.roles[0].text })}</p><p>${t('<b>For {a}</b>, {b} is {text}', { a: nB, b: nA, text: r.roles[1].text })}</p>`;
      return `<div class="card" style="text-align:center"><div class="ring" style="--p:${r.total}"><div><b>${r.total}</b><span>${t(r.label)}</span></div></div>
          <div class="mnames"><span class="tx-${STEMS[ca.dayMaster].el}">${STEMS[ca.dayMaster].zh}</span> ${nA} &nbsp;♥&nbsp; ${nB} <span class="tx-${STEMS[cb.dayMaster].el}">${STEMS[cb.dayMaster].zh}</span></div></div>
        <div class="card">${partHtml(r.parts[0])}${isP ? r.parts.slice(1).map(partHtml).join('') + roles
          : `<div class="teaser">${r.parts.slice(1).map((pt) => `<h4>🔒 ${pt.title}</h4>`).join('')}<h4>${t("🔒 How you see each other")}</h4></div>`}
          <p class="small muted">${t("A traditional BaZi comparison for reflection – real relationships are shaped by the people in them.")}</p></div>
        ${isP ? '' : paywallCard(t('See your full compatibility'))}`;
    };

    // --- ideal match
    let ideal;
    if (!mineC) {
      ideal = `<div class="card"><h2 style="margin-top:0">${t("Your ideal match")}</h2><p>${t("Calculate your own chart first – then you’ll see which partners suit you best.")}</p>
        <a class="btn block" href="#/chart">${t("Calculate my chart")}</a></div>`;
    } else {
      const me = calc(mineC);
      const im = idealMatch(me);
      const animal = (x) => `<li><b>${BRANCHES[x.branch].zh} ${BRANCHES[x.branch].animal}</b> – ${x.relation.label}<br><span class="small muted">${t('born approx. {years} (from early February)', { years: x.years.join(', ') })}</span></li>`;
      const stem = (i) => `<span class="ch sm el-${STEMS[i].el}" data-stem="${i}"><span class="zh">${STEMS[i].zh}</span><span class="py">${STEMS[i].py}</span></span>`;
      const first = `<p><b>${t("Strongest attraction:")}</b> ${t('a {s} Day Master ({pe}) – it forms a Heavenly Stem combination with your {dm}.', { s: `${STEMS[im.stems[0]].zh} ${STEMS[im.stems[0]].py}`, pe: polEl(im.stems[0]), dm: STEMS[me.dayMaster].zh })}</p>`;
      ideal = `<div class="card" data-dm="${me.dayMaster}"><h2 style="margin-top:0">${t("Your ideal match")}</h2>
        <p class="small muted">${t('Based on {name} ({dm} Day Master).', { name: esc(mineC.name || t('your chart')), dm: STEMS[me.dayMaster].zh })}</p>${first}
        ${isP ? `<h4>${t("Day Masters that suit you")}</h4><div class="stem-row">${im.stems.map(stem).join('')}</div>
          <h4>${t('Zodiac animals that harmonise with your year ({animal})', { animal: BRANCHES[me.pillars.year.branch].animal })}</h4><ul>${im.bestAnimals.map(animal).join('')}</ul>
          <h4>${t("Be careful with")}</h4><ul>${im.avoidAnimals.map(animal).join('')}</ul>
          <h4>${t("Ideal spouse-palace branches")}</h4><p class="small">${t('Partners whose <b>day</b> branch is {list} harmonise with your spouse palace {b}.', { list: im.bestDayBranches.map((x) => `${BRANCHES[x.branch].zh} ${BRANCHES[x.branch].animal}`).join(', '), b: BRANCHES[me.pillars.day.branch].zh })}</p>
          <h4>${t("Elements a partner should bring")}</h4><p class="small">${im.favourable.map((e) => `<b class="tx-${e}">${ELEMENTS[e].zh} ${ELEMENTS[e].name}</b>`).join(', ')} – ${t('your favourable elements. Someone strong in them naturally balances you.')}</p>
          <p class="small muted">${t("Use this as inspiration, not a filter – chemistry, values and kindness matter most.")}</p>`
        : `<div class="teaser"><h4>${t("🔒 Day Masters that suit you")}</h4><h4>${t('🔒 Best and difficult zodiac animals (with birth years)')}</h4><h4>${t("🔒 Ideal spouse-palace branches")}</h4><h4>${t("🔒 Elements a partner should bring")}</h4></div>`}</div>`;
    }

    // --- quick check & saved charts
    const opts = (sel) => charts.map((c) => `<option value="${c.id}" ${c.id === sel ? 'selected' : ''}>${esc(c.name || t('Chart'))} · ${c.input.year}</option>`).join('');
    const a0 = charts.find((c) => c.id === aId) || mineC;
    const b0 = a0 && (charts.find((c) => c.id !== a0.id && c.id !== mineC.id) || charts.find((c) => c.id !== a0.id));
    view.innerHTML = `${ideal}
      ${mineC ? `<div class="card"><h2 style="margin-top:0">${t("Quick check")}</h2>
        <p class="small">${t("Just met someone? Enter their date of birth to see how you match – nothing is saved.")}</p>
        <div class="row"><div><label for="q-date">${t("Their date of birth")}</label><input id="q-date" type="date" min="1900-01-01" max="2100-12-31"></div>
          <div><label for="q-time">${t('Time (optional)')}</label><input id="q-time" type="time"></div></div>
        <button class="btn block" id="q-go" style="margin-top:12px">${t("Check compatibility")}</button></div><div id="q-res"></div>` : ''}
      <div class="card"><h2 style="margin-top:0">${t("Compare saved charts")}</h2>
        ${charts.length >= 2 ? `<div class="row"><div><label for="m-a">${t("Person 1")}</label><select id="m-a">${opts(a0.id)}</select></div>
          <div><label for="m-b">${t("Person 2")}</label><select id="m-b">${opts(b0.id)}</select></div></div>`
        : `<p class="small">${t('Save at least two charts (e.g. yours and your partner’s) to compare them in detail.')}</p><a class="btn secondary block" href="#/chart">${t("Calculate a chart")}</a>`}</div>
      <div id="m-res"></div>`;
    bindPaywall();

    const qGo = $('#q-go');
    if (qGo) qGo.onclick = () => {
      const v = $('#q-date').value; if (!v) { $('#q-date').focus(); return; }
      const [year, month, day] = v.split('-').map(Number);
      const qt = $('#q-time').value;
      const [hour, minute] = (qt || '12:00').split(':').map(Number);
      const other = computeChart({ year, month, day, hour, minute, tzOffset: -new Date(year, month - 1, day, hour, minute).getTimezoneOffset() / 60, timeUnknown: !qt, gender: 'm' });
      $('#q-res').innerHTML = resultHtml(calc(mineC), other, esc(mineC.name || t('You')), t('Them'));
      bindPaywall();
      $('#q-res').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    if (charts.length >= 2) {
      const render = () => {
        const A = charts.find((c) => c.id === $('#m-a').value), B = charts.find((c) => c.id === $('#m-b').value);
        if (A.id === B.id) { $('#m-res').innerHTML = `<p class="muted">${t('Choose two different charts.')}</p>`; return; }
        $('#m-res').innerHTML = resultHtml(calc(A), calc(B), esc(A.name || t('Person 1')), esc(B.name || t('Person 2')));
        bindPaywall();
      };
      $('#m-a').onchange = render; $('#m-b').onchange = render;
      render();
    }
  },

  almanac() {
    setTitle(t('Almanac planner'), true);
    const mineE = state.charts.find((c) => c.mine);
    const mine = mineE ? computeChart({ ...mineE.input, ziHourNextDay: state.settings.ziHourNextDay }) : null;
    const now = new Date();
    const dayRow = (d) => { const dt = new Date(d.date.year, d.date.month - 1, d.date.day);
      return `<div class="alm-row r-${d.officer.rating}" data-y="${d.date.year}" data-m="${d.date.month}" data-d="${d.date.day}">
        <span class="alm-date">${dt.toLocaleDateString(LOCALE, { weekday: 'short', day: 'numeric', month: 'short' })}</span>
        <span class="alm-off">${d.officer.zh} ${d.officer.name}</span><span class="alm-rate">${RATING_LABEL[d.officer.rating]}${d.personalClash.length ? ' · ⚠︎' : ''}</span></div>`; };
    const week = Array.from({ length: 7 }, (_, i) => { const dd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i); return dayInfo(dd.getFullYear(), dd.getMonth() + 1, dd.getDate(), mine); });
    view.innerHTML = `<div class="card"><h2 style="margin-top:0">${t("Almanac 通书")}</h2>
        <p class="small">${t('Each day carries one of the 12 Day Officers, which traditionally show what the day suits.')} ${mine ? t('Days that clash with your chart are marked ⚠︎.') : t('Mark your own chart with ★ to see personal clashes.')}</p>
        <h3>${t("Next 7 days")}</h3><div class="alm-list">${week.map(dayRow).join('')}</div></div>
      ${premium.isPremium() ? `<div class="card"><h3 style="margin-top:0">${t("Find a good day")}</h3>
        <div class="chips">${ACTIVITIES.map((a, i) => `<button class="chip-btn ${i === 0 ? 'on' : ''}" data-act="${a.key}">${a.icon} ${a.name}</button>`).join('')}</div>
        <div id="alm-found"></div></div>` : paywallCard(t('Plan important days ahead'))}
      <p class="small muted">${t("Traditional almanac guidance for reflection and planning – not a guarantee of outcomes.")}</p>`;
    const showFound = (key) => {
      const days = findDays(key, now, 90, mine);
      const act = ACTIVITIES.find((a) => a.key === key);
      $('#alm-found').innerHTML = `<p class="small muted">${t('{n} suitable days for “{act}” in the next 90 days', { n: days.length, act: act.name })}${mine ? t(', excluding days that clash with your chart') : ''}:</p>
        <div class="alm-list">${days.slice(0, 20).map(dayRow).join('') || `<p class="muted">${t("No suitable day found.")}</p>`}</div>`;
    };
    if (premium.isPremium()) {
      view.querySelectorAll('[data-act]').forEach((b) => b.addEventListener('click', () => {
        view.querySelectorAll('[data-act]').forEach((x) => x.classList.toggle('on', x === b)); showFound(b.dataset.act); }));
      showFound(ACTIVITIES[0].key);
    }
    view.addEventListener('click', (e) => { const r = e.target.closest('.alm-row'); if (!r) return;
      openSheet(almanacDetail(dayInfo(+r.dataset.y, +r.dataset.m, +r.dataset.d, mine))); });
    bindPaywall();
  },

  welcome(step) {
    setTitle(t('Welcome'));
    const finish = () => store.set('onboarded', true);
    if (step === 'form') {
      view.innerHTML = `<form class="card" id="w-form" autocomplete="off"><h2 style="margin-top:0">${t("Your birth data")}</h2>
        <p class="small muted">${t("Everything stays on your phone.")}</p>${birthFieldsHtml()}
        <button class="btn block" style="margin-top:16px" type="submit">${t("Show my chart")}</button></form>
        <p style="text-align:center"><a href="javascript:void 0" id="w-skip" class="small">${t("Skip for now")}</a></p>`;
      $('#f-name').placeholder = t('Your name');
      const birth = bindBirthForm();
      $('#w-skip').onclick = () => { finish(); go('#/today', true); };
      $('#w-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const r = birth.read(); if (!r) return;
        const id = saveChart(r.name || t('Me'), r.input, true);
        finish();
        go('#/welcome/' + id, true);
      });
      return;
    }
    const entry = step && state.charts.find((c) => c.id === step);
    if (entry) {
      const c = computeChart({ ...entry.input, ziHourNextDay: state.settings.ziHourNextDay });
      const dm = STEMS[c.dayMaster];
      const top = [...c.elements].sort((a, b) => b.pct - a.pct)[0];
      const fav = favourableElements(c).favourable;
      const star = findStars(c)[0];
      view.innerHTML = `<div class="card hero"><div class="big" style="font-family:var(--serif)">${dm.zh}</div>
          <h2 style="margin:8px 0 4px">${t('{name}, you are {pe}', { name: esc(entry.name), pe: polEl(c.dayMaster) })}</h2>
          <p style="margin:0 0 6px"><b>${t('Your day pillar {p}: {img}', { p: pillarName(c.pillars.day), img: esc(dayPillarProfile(c.pillars.day.stem, c.pillars.day.branch).image) })}</b></p>
          <p>“${dm.image}” – ${dm.desc.slice(dm.desc.indexOf('. ') + 2) || dm.desc}</p></div>
        <div class="card">${pillarsHtml(c, false)}</div>
        <div class="card"><h3 style="margin-top:0">${t("Three things about you")}</h3><ul class="weak-list">
          <li><b>${t('Season')} ${c.strength.phase.zh} ${c.strength.phase.name}.</b> ${c.strength.phase.desc}</li>
          <li><b>${t('Strongest element: {el} ({pct}%).', { el: ELEMENTS[top.el].name, pct: top.pct })}</b> ${ELEMENTS[top.el].traits}</li>
          <li><b>${star ? `${star.icon} ${star.name} ${star.zh}.` : t('Favourable: {els}.', { els: fav.map((x) => ELEMENTS[x].name).join(', ') })}</b> ${star ? star.desc : t('These elements balance your chart.')}</li></ul></div>
        <a class="btn block" href="#/today">🎡 ${t("Turn my first day card")}</a>
        <a class="btn secondary block" style="margin-top:10px" href="#/chart/${entry.id}">${t("See my full chart")}</a>
        <a class="btn secondary block" style="margin-top:10px" href="#/lesson/intro">${t("Start learning BaZi")}</a>`;
      return;
    }
    const phoneLang = String(navigator.languages?.[0] || navigator.language || 'en').toLowerCase();
    if (step === 'lang' || (!step && langSetting() === 'auto' && !phoneLang.startsWith('en'))) {
      view.innerHTML = `<div class="card hero"><div class="big">八字</div><h2 style="margin:8px 0 4px">Sprache wählen</h2>
          <p class="muted" style="margin:0">Choose your language</p></div>
        <div class="card lang-pick">${Object.entries(LANGS).sort(([a], [b]) => (b === lang) - (a === lang))
          .map(([k, v]) => `<button class="btn ${k === lang ? '' : 'secondary'} block" data-lang="${k}">${v}</button>`).join('')}
          <p class="small muted" style="text-align:center;margin-bottom:0">Du kannst das jederzeit unter „Über die App“ ändern. · You can change this anytime in About.</p></div>`;
      view.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => {
        const v = b.dataset.lang; setLang(v);
        if (v === lang) go('#/welcome/start', true); else { location.replace('#/welcome/start'); location.reload(); }
      }));
      return;
    }
    view.innerHTML = `<div class="card hero"><div class="big">八字</div><h2 style="margin:8px 0 4px">${t("Welcome to BaZi Academy")}</h2>
        <p>${t("Discover the Four Pillars of Destiny – the classical Chinese map of the energies at your birth.")}</p></div>
      <div class="card"><ul class="benefits">
        <li><b>${t("Your personal chart")}</b><span>${t("Calculated from the real solar calendar, with your birthplace and true solar time")}</span></li>
        <li><b>${t("Learn step by step")}</b><span>${t('{n} lessons from Yin and Yang to symbolic stars and luck pillars', { n: LESSONS.length })}</span></li>
        <li><b>${t("Every day")}</b><span>${t("Almanac, daily energy and compatibility")}</span></li></ul>
        <a class="btn block" href="#/welcome/form">${t("Get my chart")}</a>
        <p style="text-align:center;margin-bottom:0"><a href="javascript:void 0" id="w-skip" class="small">${t("Skip, just explore")}</a></p></div>
      <p style="text-align:center"><a href="#/welcome/lang" class="small muted">🌐 ${LANGS[lang]} · ${t('Change language')}</a></p>`;
    $('#w-skip').onclick = () => { finish(); go('#/today', true); };
  },

  forecast(id) {
    setTitle(t('Year ahead'), true);
    const entry = state.charts.find((c) => c.id === id) || state.charts.find((c) => c.mine) || state.charts[0];
    if (!entry) { view.innerHTML = `<div class="card"><p>${t("Calculate a chart first.")}</p><a class="btn block" href="#/chart">${t("Calculate a chart")}</a></div>`; return; }
    const c = computeChart({ ...entry.input, ziHourNextDay: state.settings.ziHourNextDay });
    const y0 = baziYearOf();
    const render = (year) => {
      const f = yearForecast(c, year);
      const g = TEN_GODS[f.god];
      const fmtD = (ms) => new Date(ms).toLocaleDateString(LOCALE, { day: 'numeric', month: 'short' });
      const rateChip = (r) => `<span class="rate rate-${r.label}">${t(r.label)}</span>`;
      const overview = `<div class="card" data-dm="${c.dayMaster}"><div class="seg" id="fc-years">${[y0, y0 + 1].map((y) => `<button type="button" data-y="${y}" class="${y === year ? 'on' : ''}">${y}</button>`).join('')}</div>
        <h2 style="margin:14px 0 2px">${t('{y}: {p} year', { y: year, p: `<span style="font-family:var(--serif)">${pillarName(f.pillar)}</span>` })} ${rateChip(f.rating)}</h2>
        <p class="small muted">${fmtD(f.from)} ${year} – ${fmtD(f.to)} ${year + 1} · ${t('for {name}', { name: esc(entry.name || t('this chart')) })} (${STEMS[c.dayMaster].zh})</p>
        <p>${t('A <b>{god}</b> year:', { god: `${g.name} ${g.zh}` })} ${GOD_TEXT[f.god].luck}</p></div>`;
      if (!premium.isPremium()) { view.innerHTML = overview + paywallCard(t('See your whole year, month by month')); bindYears(); bindPaywall(); return; }
      const taiSui = f.taiSui === 'same' ? `<p class="tip">${t('This is your <b>zodiac year (本命年)</b> – traditionally a year of change and self-renewal. Avoid unnecessary risks.')}</p>`
        : f.taiSui === 'clash' ? `<p class="tip">${t('The year branch <b>clashes your year branch (冲太岁)</b> – expect movement and change; plan big decisions carefully.')}</p>` : '';
      view.innerHTML = overview + `<div class="card">${taiSui}
          <p>${t('The year brings <b>{els}</b>; its branch {b} has a <b>{rel}</b> relation to your day branch.', { els: t('{a} over {b}', { a: ELEMENTS[STEMS[f.pillar.stem].el].name, b: ELEMENTS[BRANCHES[f.pillar.branch].el].name }), b: `${BRANCHES[f.pillar.branch].zh} ${BRANCHES[f.pillar.branch].animal}`, rel: f.rating.relation.label })}</p>
          ${f.luck ? `<p>${t('It runs inside your luck pillar {p} ({god}, since {y}).', { p: `<b style="font-family:var(--serif)">${STEMS[f.luck.stem].zh}${BRANCHES[f.luck.branch].zh}</b>`, god: TEN_GODS[f.luck.god].name, y: f.luck.year })}</p>` : ''}
          ${f.stars.length ? `<p><b>${t("Activated stars:")}</b> ${f.stars.map((st) => `${st.icon} ${st.name} ${st.zh}`).join(', ')} – ${f.stars.map((st) => st.desc.split(' – ')[0]).join('; ')}.</p>` : ''}
          <p><b>${t("Best months:")}</b> ${f.bestMonths.map((i) => `${fmtD(f.months[i].start)} – ${fmtD(f.months[i].end - 86400000)}`).join(' · ')}</p></div>
        <div class="card"><h3 style="margin-top:0">${t("Month by month")}</h3>${f.months.map((m) => `<div class="fc-month">
          <div class="fc-head"><span class="fc-pillar el-${STEMS[m.stem].el}">${STEMS[m.stem].zh}${BRANCHES[m.branch].zh}</span>
            <span><b>${fmtD(m.start)} – ${fmtD(m.end - 86400000)}</b><br><span class="small muted">${t('{god} month', { god: TEN_GODS[m.god].name })}</span></span>${rateChip(m)}</div>
          <p class="small">${m.text}${m.relation.key === 'clash' ? t(' The month clashes your day branch – go easy on relationships and health.') : m.relation.key === 'harmony' ? t(' The month combines with your day branch – good for relationships.') : ''}
            ${m.stars.length ? `<br>${m.stars.map((st) => `${st.icon} ${st.name}`).join(' · ')}` : ''}</p></div>`).join('')}
          <p class="small muted">${t('Months follow the solar terms (节气). A traditional forecast for reflection – your choices shape the year.')}</p></div>`;
      bindYears();
    };
    const bindYears = () => view.querySelectorAll('#fc-years [data-y]').forEach((b) => { b.onclick = () => render(+b.dataset.y); });
    render(y0);
  },

  calendar(ym) {
    const now = new Date();
    let [y, m] = (ym || '').split('-').map(Number);
    if (!y || !m || m < 1 || m > 12) { y = now.getFullYear(); m = now.getMonth() + 1; }
    const monthName = new Date(y, m - 1, 1).toLocaleDateString(LOCALE, { month: 'long', year: 'numeric' });
    setTitle(t('Lunar calendar'));
    const mineE = state.charts.find((c) => c.mine);
    const mine = mineE ? computeChart({ ...mineE.input, ziHourNextDay: state.settings.ziHourNextDay }) : null;
    const days = new Date(y, m, 0).getDate();
    const lead = (new Date(y, m - 1, 1).getDay() + 6) % 7; // Monday first
    const ymKey = (yy, mm) => `${yy}-${String(mm).padStart(2, '0')}`;
    const prev = m === 1 ? ymKey(y - 1, 12) : ymKey(y, m - 1), next = m === 12 ? ymKey(y + 1, 1) : ymKey(y, m + 1);
    const isToday = (d) => y === now.getFullYear() && m === now.getMonth() + 1 && d === now.getDate();
    const cells = [];
    for (let i = 0; i < lead; i++) cells.push('<div class="cal-cell empty"></div>');
    const list = [];
    for (let d = 1; d <= days; d++) {
      const e = dayEvents(y, m, d);
      const l = e.lunar;
      const lunarText = l ? (l.day === 1 ? `${l.leap ? '闰' : ''}${MONTH_NAMES[l.month - 1]}` : l.label.slice(-2)) : '';
      const term = e.terms[0];
      const moon = e.moon[0];
      const fest = e.festivals[0];
      cells.push(`<button class="cal-cell ${isToday(d) ? 'today' : ''} ${fest ? 'fest' : ''} ${term ? 'term' : ''}" data-d="${d}">
        <span class="cal-d">${d}</span><span class="cal-l ${l && l.day === 1 ? 'first' : ''}">${fest ? fest.zh.slice(0, 3) : term ? term.zh : lunarText}</span>
        ${moon ? `<span class="cal-m">${moon.type === 'full' ? '🌕' : '🌑'}</span>` : ''}</button>`);
      for (const st of e.terms) list.push({ ms: st.ms, html: `<b>${st.zh} ${st.name}</b>${st.major ? ' ☀︎' : ''}`, d });
      for (const mo of e.moon) list.push({ ms: mo.ms, html: `<b>${mo.type === 'full' ? t('🌕 Full moon') : t('🌑 New moon')}</b>`, d });
      for (const f of e.festivals) list.push({ ms: new Date(y, m - 1, d, 0, 0).getTime(), html: `<b>🏮 ${f.zh} ${f.name}</b>`, d, allDay: true });
    }
    const first = lunarDate(y, m, 1), last = lunarDate(y, m, days);
    const ly = (l) => `${pillarName(pillarFromIndex(l.year - 4))} ${BRANCHES[((l.year - 4) % 12 + 12) % 12].animal}`;
    const fmtT = (ms) => new Date(ms).toLocaleString(LOCALE, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    view.innerHTML = `<div class="card">
        <div class="cal-nav"><a class="icon-btn" href="#/calendar/${prev}" aria-label="${t('Previous month')}">‹</a>
          <div><h2 style="margin:0">${monthName}</h2><div class="small muted">${first.label.slice(0, -2)} – ${last.label.slice(0, -2)} · ${t('{y} year', { y: ly(first) + (ly(first) !== ly(last) ? ' / ' + ly(last) : '') })}</div></div>
          <a class="icon-btn" href="#/calendar/${next}" aria-label="${t('Next month')}">›</a></div>
        <div class="cal-grid">${[t('Mo'), t('Tu'), t('We'), t('Th'), t('Fr'), t('Sa'), t('Su')].map((w) => `<div class="cal-w">${w}</div>`).join('')}${cells.join('')}</div>
        <p class="small muted" style="margin-bottom:0">${t('Lunar dates as in China (UTC+8). Tap a day for details.')} ${y === now.getFullYear() && m === now.getMonth() + 1 ? '' : `<a href="#/calendar">${t("Back to today")}</a>`}</p></div>
      <div class="card"><h3 style="margin-top:0">${t("This month")}</h3>${list.sort((a, b) => a.ms - b.ms).map((x) => `<div class="cal-ev" data-d="${x.d}">${x.html}<br><span class="small muted">${x.allDay ? new Date(x.ms).toLocaleDateString(LOCALE, { weekday: 'short', day: 'numeric', month: 'short' }) : fmtT(x.ms)}</span></div>`).join('') || `<p class="muted">${t("No events.")}</p>`}
        <p class="small muted" style="margin-bottom:0">${t("Times in your time zone.")}</p></div>
      ${remindersCard()}
      ${calendarExportCard()}`;
    view.querySelectorAll('[data-d]').forEach((el) => el.addEventListener('click', () => openSheet(calendarDay(y, m, +el.dataset.d, mine))));
    bindCalendarCards();
  },

  guide() {
    setTitle(t('How to use the app'), true);
    view.innerHTML = `<div class="card hero"><div class="big">🧭</div><h2 style="margin:8px 0 4px">${t('How to use the app')}</h2>
        <p>${t('A short tour of everything BaZi Academy can do – and how to make it part of your day.')}</p></div>
      ${GUIDE.map(([icon, title, html], i) => `<details class="card guide" ${i === 0 ? 'open' : ''}><summary><span class="g-icon">${icon}</span><b>${title}</b></summary><div class="lesson-body">${html}</div></details>`).join('')}`;
  },

  influences(id) {
    setTitle(t('Influences'), true);
    const entry = state.charts.find((c) => c.id === id) || state.charts.find((c) => c.mine) || state.charts[0];
    if (!entry) { view.innerHTML = `<div class="card"><p>${t("Calculate a chart first.")}</p><a class="btn block" href="#/chart">${t("Calculate a chart")}</a></div>`; return; }
    const c = computeChart({ ...entry.input, ziHourNextDay: state.settings.ziHourNextDay });
    const now = new Date();
    view.innerHTML = `<div class="card"><h2 style="margin-top:0">${t('Influences')}</h2>
        <p class="small muted">${t('The year, month, day and hour of any moment, measured against {name} ({dm}).', { name: esc(entry.name || t('this chart')), dm: STEMS[c.dayMaster].zh })}</p>
        <div class="row"><div><label for="i-date">${t('Date')}</label><input id="i-date" type="date" min="1900-01-01" max="2100-12-31" value="${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}"></div>
          <div><label for="i-time">${t('Time')}</label><input id="i-time" type="time" value="${pad(now.getHours())}:${pad(now.getMinutes())}"></div></div>
        <button class="btn secondary block" id="i-now" style="margin-top:10px">${t('Now')}</button></div><div id="i-res"></div>`;
    const LAYER = { year: t('Year pillar'), month: t('Month pillar'), day: t('Day pillar'), hour: t('Hour pillar') };
    const WITH = { year: 'with your year branch {b}', month: 'with your month branch {b}', day: 'with your day branch {b}', hour: 'with your hour branch {b}' };
    const render = () => {
      const [y, m, d] = ($('#i-date').value || '').split('-').map(Number); if (!y) return;
      const [hh, mm] = ($('#i-time').value || '12:00').split(':').map(Number);
      const inf = influencesFor(c, new Date(y, m - 1, d, hh, mm));
      const chip = (r) => `<span class="rate rate-${r}">${t(r)}</span>`;
      $('#i-res').innerHTML = `<div class="card" data-dm="${c.dayMaster}"><h3 style="margin-top:0">${t('Overall')} ${chip(inf.overall)}</h3>
          ${inf.luck ? `<p class="small">${t('Running luck pillar: {p} ({god}, since {y}).', { p: `<b style="font-family:var(--serif)">${STEMS[inf.luck.stem].zh}${BRANCHES[inf.luck.branch].zh}</b>`, god: TEN_GODS[inf.luck.god].name, y: inf.luck.year })}</p>` : ''}
          <p class="small muted">${t('The day weighs most, then month, year and hour.')}</p></div>
        ${inf.layers.map((l) => `<div class="card inf" data-dm="${c.dayMaster}">
          <div class="fc-head"><span class="fc-pillar el-${STEMS[l.pillar.stem].el}">${pillarName(l.pillar)}</span>
            <span><b>${LAYER[l.key]}</b><br><span class="small muted"><a href="javascript:void 0" data-god="${l.god}">${TEN_GODS[l.god].name}</a> · ${t('branch: {god}', { god: TEN_GODS[l.branchGod].name })}</span></span>${chip(l.rating.label)}</div>
          <p class="small">${MONTH_TEXT[l.god]}</p>
          ${l.combinesDM ? `<p class="small">💞 ${t('Its stem combines with your Day Master – attraction, opportunities and agreements.')}</p>` : ''}
          ${l.relations.map((r) => `<p class="small">${r.rel.key === 'clash' ? '⚡' : r.rel.key === 'harm' || r.rel.key === 'punish' ? '⚠︎' : '🤝'} <b>${r.rel.label}</b> ${t(WITH[r.natal], { b: BRANCHES[c.pillars[r.natal].branch].zh })} – ${r.rel.note}.</p>`).join('')}
          ${l.stars.length ? `<p class="small">${l.stars.map((st) => `${st.icon} ${st.name}`).join(' · ')} – ${t('activated')}</p>` : ''}</div>`).join('')}
        <p class="small muted">${t('A traditional reading of timing for reflection – not a prediction.')}</p>`;
    };
    $('#i-date').onchange = render; $('#i-time').onchange = render;
    $('#i-now').onclick = () => { const n = new Date(); $('#i-date').value = `${n.getFullYear()}-${pad(n.getMonth() + 1)}-${pad(n.getDate())}`; $('#i-time').value = `${pad(n.getHours())}:${pad(n.getMinutes())}`; render(); };
    render();
  },

  timeline(id) {
    setTitle(t('Life timeline'), true);
    const entry = state.charts.find((c) => c.id === id) || state.charts.find((c) => c.mine) || state.charts[0];
    if (!entry) { view.innerHTML = `<div class="card"><p>${t("Calculate a chart first.")}</p><a class="btn block" href="#/chart">${t("Calculate a chart")}</a></div>`; return; }
    const c = computeChart({ ...entry.input, ziHourNextDay: state.settings.ziHourNextDay });
    const yNow = new Date().getFullYear();
    const chip = (r) => `<span class="rate rate-${r.label}">${t(r.label)}</span>`;
    const phases = lifeTimeline(c);
    view.innerHTML = `<div class="card"><h2 style="margin-top:0">${t('Life timeline')}</h2>
        <p class="small muted">${t('{name}: luck pillars (大运) change every ten years; each year adds its own pillar (流年). Tap a phase to see its years.', { name: esc(entry.name || t('this chart')) })}</p></div>
      <div class="tl" data-dm="${c.dayMaster}">${phases.map((ph) => {
        const now = yNow >= ph.from && yNow <= ph.to;
        return `<details class="card tl-phase ${now ? 'tl-now' : ''}" ${now ? 'open' : ''}><summary>
          <span class="fc-pillar el-${STEMS[ph.pillar.stem].el}">${STEMS[ph.pillar.stem].zh}${BRANCHES[ph.pillar.branch].zh}</span>
          <span><b>${ph.kind === 'childhood' ? t('Childhood') : TEN_GODS[ph.god].name}</b> ${ph.rating ? chip(ph.rating) : ''}${now ? ` <span class="pill">${t('now')}</span>` : ''}<br>
          <span class="small muted">${t('age {a}–{b}', { a: ph.ageFrom, b: ph.ageTo })} · ${ph.from}–${ph.to}</span></span></summary>
          <p class="small">${ph.kind === 'childhood' ? t('Before the first luck pillar, the month pillar sets the tone of childhood.') : GOD_TEXT[ph.god].luck}</p>
          <div class="tl-years">${ph.years.map((y) => `<div class="tl-year ${y.year === yNow ? 'tl-cur' : ''}"><span>${y.year}</span><span class="muted">${t('age {n}', { n: y.age })}</span>
            <span style="font-family:var(--serif)">${pillarName(y.pillar)}</span><span>${TEN_GODS[y.god].name}</span>
            <span>${chip(y.rating)}${y.benming ? ` <span title="${t('zodiac year (本命年)')}">本</span>` : ''}${y.taiSuiClash ? ` <span title="${t('clash with your year branch (冲太岁)')}">冲</span>` : ''}</span></div>`).join('')}</div></details>`; }).join('')}</div>
      <p class="small muted">${t('本 = your zodiac year (本命年) · 冲 = the year clashes your year branch (冲太岁).')}</p>`;
    const cur = view.querySelector('.tl-cur'); if (cur) setTimeout(() => cur.scrollIntoView({ block: 'center' }), 50);
  },

  premium() {
    if (premium.WEB) { appPage(); return; }
    if (premium.FREE_APP) { go('#/learn', true); return; }
    setTitle(t('Premium'), true);
    const has = premium.isPremium();
    view.innerHTML = `<div class="card hero"><div class="big">✦</div><h2 style="margin:8px 0 4px">${t("BaZi Academy Premium")}</h2>
        <p>${has ? t('Premium is active. Thank you for supporting the app!') : t('One purchase. Everything unlocked. Yours forever.')}</p></div>
      <div class="card"><ul class="benefits">
        <li><b>${t('All {n} lessons', { n: LESSONS.length })}</b><span>${t("Hidden Stems, Day Master, Ten Gods, strength, interactions, luck pillars and the useful god")}</span></li>
        <li><b>${t("Unlimited chart calculations")}</b><span>${t("Charts for family, friends and partners – save as many as you like")}</span></li>
        <li><b>${t("Detailed chart reading")}</b><span>${t("Core nature, favourable elements, weak spots and how to balance them, career, relationships and your current luck phase")}</span></li>
        <li><b>${t("Year-ahead forecast")}</b><span>${t("Your annual pillar and all 12 months: themes, best months, activated stars")}</span></li>
        <li><b>${t("Love & compatibility")}</b><span>${t("Your ideal match, a quick check for someone new, and the full analysis of two charts")}</span></li>
        <li><b>${t("Almanac planner")}</b><span>${t("Find good days for weddings, moving, contracts, launches, travel and renovation – personalised to your chart")}</span></li>
        <li><b>${t("No ads, no subscription")}</b><span>${t('A one-time purchase; your data stays on your device')}</span></li></ul>
        ${has ? `<a class="btn block" href="#/learn">${t("Continue learning")}</a>` : `<button class="btn block" id="buy">${t('Unlock for {price}', { price: premium.getPrice() })}</button>`}
        <button class="btn secondary block" id="restore" style="margin-top:10px">${t("Restore purchase")}</button>
        <p class="small muted" style="margin-bottom:0">${t('One-time payment through your {store} account. No subscription, nothing renews.', { store: t(premium.storeName) })}</p></div>`;
    bindPaywall();
  },

  about() {
    setTitle(t('About'), true);
    view.innerHTML = `<div class="card"><h2 style="margin-top:0">${t('Support')}</h2>
      <p class="small">${t('Questions, ideas or a problem? Write to us – we read every message.')}</p>
      <a class="btn block mail-btn" href="${supportMailto()}">✉️ ${esc(PUBLISHER.email)}</a>
      <p class="small muted" style="margin-bottom:0">${t('Your app version and language are added to the email so we can help faster. No other data is sent.')}</p></div>
      <div class="card"><h2 style="margin-top:0">BaZi Academy</h2>
      <p>${t('An introduction to BaZi (八字), the Four Pillars of Destiny: Yin and Yang, the Five Elements, the Heavenly Stems and Earthly Branches, the Ten Gods and luck pillars, with a chart calculator and quizzes.')}</p>
      <h3>${t("How charts are calculated")}</h3>
      <p class="small">${t('The year and month pillars follow the 24 solar terms (the year starts at Li Chun), calculated from the sun’s apparent longitude. Day pillars follow the continuous 60-day cycle. Hour pillars follow the five-rats rule. True solar time is optional.')}</p>
      <h3>${t("Birthplaces")}</h3>
      <p class="small">${t('City data © <a href="https://www.geonames.org" rel="noopener">GeoNames</a>, licensed under CC BY 4.0. Historical time zones come from your device.')}</p>
      <h3>${t("Privacy")}</h3>
      <p class="small">${t("The app works offline. Birth data, charts and progress are stored only on your device. Nothing is sent to a server, and there is no tracking or advertising.")}</p>
      <h3>${t("Disclaimer")}</h3>
      <p class="small">${t("BaZi is a traditional cultural system. The content is for education and entertainment and is no substitute for professional medical, legal, financial or psychological advice.")}</p>
      <h3>${t("Backup & new phone")}</h3>
      <p class="small">${t('Your charts and progress live only on this phone. Save a backup file (e.g. to Google Drive, iCloud or email) and import it on your new phone.')}</p>
      <div class="row" style="margin-bottom:10px"><button class="btn secondary" id="bk-export">${t("⇪ Export")}</button><button class="btn secondary" id="bk-import">${t("⇩ Import")}</button></div>
      <input type="file" id="bk-file" accept=".json,application/json" hidden>
      <p><a class="btn secondary block" href="#/guide">🧭 ${t('How to use the app')}</a></p>
      <h3>${t('Text size')}</h3>
      <div class="seg" id="ts-sel">${[['1', t('Normal')], ['1.15', t('Large')], ['1.3', t('Extra large')]].map(([v, n]) => `<button type="button" data-ts="${v}" class="${String(state.settings.textSize || 1) === v ? 'on' : ''}">${n}</button>`).join('')}</div>
      <h3>${t('Language')}</h3>
      <select id="lang-sel"><option value="auto" ${langSetting() === 'auto' ? 'selected' : ''}>${t('Automatic (phone language)')}</option>${Object.entries(LANGS).map(([k, v]) => `<option value="${k}" ${langSetting() === k ? 'selected' : ''}>${v}</option>`).join('')}</select>
      ${premium.WEB ? `<h3>${t('Get the app')}</h3><p class="small">${t('The app adds all lessons, unlimited charts, detailed readings, reminders and works offline.')}</p>${storeButtons()}` : ''}
      ${premium.FREE_APP || premium.WEB ? '' : `<h3>${t("Premium")}</h3>
      ${premium.isTestBuild ? `<p class="tip">${t('Test build {b}: Premium is unlocked for testing. Store versions use the real purchase.', { b: BUILD })}</p>` : ''}
      <p class="small">${premium.isPremium() ? t('✦ Premium is active – thank you for supporting the app!') : `${t('Not purchased.')} <a href="#/premium">${t("See Premium")}</a>`}</p>
      <button class="btn secondary block" id="restore" style="margin-bottom:10px">${t("Restore purchase")}</button>`}
      <h3 style="margin-top:20px">${t('Progress')}</h3>
      <button class="btn secondary block" id="reset">${t("Reset learning progress")}</button>
      <h3>${t('Legal notice (Impressum)')}</h3>
      <p class="small">${[PUBLISHER.company, PUBLISHER.street, PUBLISHER.city, PUBLISHER.country].map(esc).join('<br>')}</p>
      <p class="small">${t('Represented by the managing director: {name}', { name: esc(PUBLISHER.director) })}<br>${t('Register: {reg}', { reg: esc(PUBLISHER.register) })}${PUBLISHER.vatId ? `<br>${t('VAT ID: {id}', { id: esc(PUBLISHER.vatId) })}` : ''}</p>
      ${PUBLISHER.email || PUBLISHER.phone ? `<p class="small">${PUBLISHER.email ? `${t('Email:')} <a href="mailto:${esc(PUBLISHER.email)}">${esc(PUBLISHER.email)}</a>` : ''}${PUBLISHER.phone ? `<br>${t('Phone:')} ${esc(PUBLISHER.phone)}` : ''}</p>` : ''}
      <p class="small muted" style="text-align:center">${t('Version {v} · build {b}', { v: '1.0.0', b: BUILD })}</p></div>`;
    $('#bk-export').onclick = async () => {
      const json = JSON.stringify(makeBackup(state, { notify: notify.getSettings() }), null, 1);
      try { await shareTextFile(`bazi-academy-backup-${new Date().toISOString().slice(0, 10)}.json`, json); } catch { alert(t('The backup could not be saved on this device.')); }
    };
    $('#lang-sel').onchange = (e) => { setLang(e.target.value); location.reload(); };
    $('#ts-sel').onclick = (e) => { const b = e.target.closest('[data-ts]'); if (!b) return;
      state.settings.textSize = Number(b.dataset.ts); save('settings'); applyTextSize(); routes.about(); };
    $('#bk-import').onclick = () => $('#bk-file').click();
    $('#bk-file').onchange = async (e) => {
      const file = e.target.files?.[0]; if (!file) return;
      try {
        const backup = validateBackup(JSON.parse(await file.text()));
        if (!confirm(t('Import {n} chart(s) and learning progress from {date}? Existing charts are kept.', { n: backup.charts.length, date: backup.exported?.slice(0, 10) || t('the backup') }))) return;
        const { state: merged, added } = mergeBackup(state, backup);
        state.charts = merged.charts; state.best = merged.best; state.done = merged.done;
        save('charts'); save('best'); save('done'); rescheduleTips();
        alert(t('Imported {n} new chart(s).', { n: added }));
        go('#/chart');
      } catch (err) { alert(err instanceof SyntaxError ? t('This file is not a BaZi Academy backup.') : err.message); }
      e.target.value = '';
    };
    if ($('#restore')) $('#restore').onclick = async () => { const ok = await premium.restore(); alert(ok ? t('Premium restored.') : t('No previous purchase found for this store account.')); routes.about(); };
    $('#reset').onclick = () => { if (confirm(t('Reset lesson progress and quiz scores?'))) { state.done = {}; state.best = {}; save('done'); save('best'); go('#/learn'); } };
  },
};

// ---------- day pillar profiles ----------
// ---- Daily card: a wheel of the 60 day pillars that always stops on today, then a reading in three layers ----
const STAR_LABEL = ['', 'A day to take it slow', 'Mixed – go carefully', 'A balanced day', 'A good day', 'An excellent day'];
const plainPillar = (s, b) => `${polEl(s)} · ${BRANCHES[b].animal}`;
function dayWheelSvg() {
  const R = 118, r = 80, sectors = [];
  for (let i = 0; i < 60; i++) {
    const a0 = (i * 6 - 3 - 90) * Math.PI / 180, a1 = (i * 6 + 3 - 90) * Math.PI / 180;
    const pt = (rad, a) => `${(rad * Math.cos(a)).toFixed(2)} ${(rad * Math.sin(a)).toFixed(2)}`;
    sectors.push(`<path class="el-${sectorElement(i)}" d="M${pt(R, a0)} A${R} ${R} 0 0 1 ${pt(R, a1)} L${pt(r, a1)} A${r} ${r} 0 0 0 ${pt(r, a0)}Z"/>`);
  }
  return `<svg viewBox="-130 -136 260 266" class="dw-svg" role="img" aria-label="${t('Wheel of the 60 day pillars')}">
    <g id="dw-rot">${sectors.join('')}</g>
    <circle r="76" class="dw-hub"/><text id="dw-zh" y="10" class="dw-zh">?</text><text id="dw-sub" y="36" class="dw-sub">${t('Tap to turn')}</text>
    <path d="M-9 -134 L9 -134 L0 -114Z" class="dw-pointer"/></svg>`;
}
function dayCardHtml(d, mine) {
  return `<div class="card daycard" id="daycard"><h3 style="margin-top:0">${t('Your day card')}</h3>
    <p class="small muted" style="margin-top:-6px">${t('Turn the wheel of the 60 days – it stops on today’s pillar and shows what today means for you.')}</p>
    <button class="dw-btn" id="dw-btn" aria-label="${t('Turn the wheel')}">${dayWheelSvg()}</button>
    <div id="dw-result" hidden>${dayResultHtml(d, mine)}</div></div>
    ${(() => { const next = LESSONS.find((l) => !state.done[l.id]); return next ? `<a class="card premium-banner" href="#/lesson/${next.id}"><span class="pb-icon">学</span><span><b>${t('Continue learning')}</b> · ${t('Lesson {n}: {title}', { n: LESSONS.indexOf(next) + 1, title: next.title })}</span><span class="pb-go">›</span></a>` : ''; })()}`;
}
function dayResultHtml(d, mine) {
  const p = d.pillar, th = d.theme;
  const hours = d.hours.map((h) => `<span class="nw">${h.range}</span>`).join(', ');
  const stars = '★'.repeat(d.stars) + '☆'.repeat(5 - d.stars);
  const lucky = d.personal ? `<div class="dc-lucky">
      ${hours ? `<span>🕐 ${t('Lucky hours:')} <b>${hours}</b></span>` : ''}
      <span>🎨 ${t('Colour:')} <b>${esc(d.lucky.colour)}</b></span><span>🧭 ${t('Direction:')} <b>${d.lucky.direction}</b></span>
      <span>🔢 ${t('Numbers:')} <b>${d.lucky.numbers.join(', ')}</b></span></div>`
    : `${hours ? `<div class="dc-lucky"><span>🕐 ${t('Lucky hours:')} <b>${hours}</b></span></div>` : ''}`;
  const why = [];
  why.push(t('<b>Today’s energy:</b> the {p} day – {a} on {b}.', { p: `<span class="zh-inline">${pillarName(p)}</span>`, a: polEl(p.stem), b: `${ELEMENTS[BRANCHES[p.branch].el].name} (${BRANCHES[p.branch].animal})` }));
  if (d.personal) {
    const c = myChart(), dm = c.dayMaster, rel = d.rating.relation, db = c.pillars.day.branch;
    why.push(t('<b>You and today:</b> your Day Master is {dm}. Today’s stem is your {god}: {meaning}', {
      dm: `<span class="zh-inline tx-${STEMS[dm].el}">${STEMS[dm].zh}</span> ${polEl(dm)}`,
      god: `<a href="javascript:void 0" data-god="${d.god}"><b>${TEN_GODS[d.god].name}</b></a>`, meaning: MONTH_TEXT[d.god] }));
    why.push(['clash', 'harmony', 'trine', 'harm', 'punish'].includes(rel.key)
      ? t('<b>Your day branch:</b> today’s {b} and your {n} form a {rel} – {note}.', { b: BRANCHES[p.branch].animal, n: BRANCHES[db].animal, rel: rel.label, note: rel.note })
      : t('<b>Your day branch:</b> no strong interaction with today’s branch.'));
    why.push(t('<b>Helpful elements:</b> yours are {fav}. Today brings {n} of 2.', { fav: d.favourable.map((e) => ELEMENTS[e].name).join(', '), n: d.elementsHelp }));
  }
  why.push(t('<b>Almanac:</b> a {name} day ({zh}) – {rating}.', { name: d.officer.name, zh: d.officer.zh, rating: RATING_LABEL[d.officer.rating] }));
  return `<div class="dc-head"><span class="dc-stars" aria-label="${d.stars}/5">${stars}</span><span class="dc-label">${t(STAR_LABEL[d.stars])}</span></div>
    <h3 class="dc-title">${th.icon} ${d.personal ? esc(th.title) : t('{name} day', { name: th.title })}</h3>
    <p>${th.text}</p>
    ${d.info.personalClash.length ? `<p class="tip">${t('Today {what}.', { what: d.info.personalClash.join(t(' and ')) })} ${t('Take it slow with big decisions.')}</p>` : ''}
    <div class="dc-lists"><div><b>✅ ${t('Good for')}</b><ul>${th.do.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
      <div><b>⚠️ ${t('Better avoid')}</b><ul>${th.avoid.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div></div>
    ${lucky}
    ${d.personal ? '' : `<p class="small">${t('Save your own chart (★) in the <a href="#/chart">Chart</a> tab to see how today relates to your Day Master.')}</p>`}
    <details class="why"><summary>${t('Why? The BaZi behind it')}</summary>
      <ol class="why-steps">${why.map((w) => `<li>${w}</li>`).join('')}</ol>
      ${d.personal ? `<p class="small muted">${t('How the stars are counted: helpful elements and harmonies add, clashes subtract, plus the almanac rating of the day.')}</p>` : ''}
      <p class="small">${t('Learn more:')} <a href="#/lesson/tengods">${t('The Ten Gods')}</a> · <a href="#/lesson/interactions">${t('Branch Interactions')}</a> · <a href="#/lesson/useful">${t('Useful God & Balance')}</a></p>
    </details>
    <p class="small muted dc-note">${t('Same day, same result: BaZi calculates your day – it is not chance.')} <a href="javascript:void 0" id="dw-again">${t('Turn again')}</a></p>`;
}
function bindDayCard(d, now) {
  const key = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  const rot = $('#dw-rot'), zh = $('#dw-zh'), sub = $('#dw-sub'), btn = $('#dw-btn'), res = $('#dw-result');
  if (!rot) return;
  const target = d.index;
  const show = (i) => { zh.textContent = STEMS[i % 10].zh + BRANCHES[i % 12].zh; zh.setAttribute('class', `dw-zh tx-${sectorElement(i)}`); };
  const finish = () => {
    rot.setAttribute('transform', `rotate(${-target * 6})`); show(target);
    sub.textContent = plainPillar(d.pillar.stem, d.pillar.branch);
    res.hidden = false; btn.classList.add('done');
  };
  let spinning = false;
  const spin = () => {
    if (spinning) return; spinning = true; res.hidden = true; btn.classList.remove('done');
    const reduce = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const end = -(3 * 360 + target * 6), dur = reduce ? 0 : 3200, t0 = performance.now();
    let last = -1;
    const frame = (tm) => {
      const k = dur ? Math.min(1, (tm - t0) / dur) : 1;
      const a = end * (1 - Math.pow(1 - k, 4));
      rot.setAttribute('transform', `rotate(${a.toFixed(2)})`);
      const i = ((Math.round(-a / 6) % 60) + 60) % 60;
      if (i !== last) { show(i); if (k > 0.6) try { navigator.vibrate?.(6); } catch { /* ignore */ } last = i; }
      if (k < 1) requestAnimationFrame(frame);
      else { spinning = false; try { navigator.vibrate?.(30); } catch { /* ignore */ } finish(); state.settings.dayCard = key; save('settings'); $('#daycard')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }
    };
    requestAnimationFrame(frame);
  };
  btn.addEventListener('click', spin);
  res.addEventListener('click', (e) => { if (e.target.id === 'dw-again') spin(); });
  if (state.settings.dayCard === key) finish();
}

function dayPillarHtml(s, b) {
  const pr = dayPillarProfile(s, b);
  return `<p class="dp-image"><span class="dp-zh">${pr.name}</span> ${esc(pr.image)}</p>
    <p>${pr.character}</p>
    <p class="small">${t('{name}: {stem} on {branch}.', { name: pr.name, stem: `${STEMS[s].zh} ${pr.stemEl.name}`, branch: `${BRANCHES[b].zh} ${BRANCHES[b].animal}` })} ${pr.seat}
      ${t('Its spouse palace holds <b>{god}</b>.', { god: pr.seatGodName })}</p>
    <p class="small"><b>${t('Growth stage:')}</b> ${pr.stage.zh} ${pr.stage.name} – ${pr.stage.desc}</p>
    ${pr.special.map((x) => `<p class="tip"><b>${x.zh} ${x.name}</b> – ${x.desc}</p>`).join('')}`;
}

function dayPillarCard(c) {
  const d = c.pillars.day;
  const stages = PILLAR_KEYS.filter((k) => c.pillars[k]).map((k) => { const st = stageOf(c.dayMaster, c.pillars[k].branch);
    return `<div><div class="lbl">${PILLAR_LABEL[k]}</div><div class="dp-stage">${st.zh}</div><div class="small">${st.name}</div></div>`; }).join('');
  return `<div class="card" data-dm="${c.dayMaster}"><h3 style="margin-top:0">${t('Your day pillar 日柱')}</h3>${dayPillarHtml(d.stem, d.branch)}
    <h4>${t('The Day Master’s growth stages in your pillars')}</h4><div class="pillars dp-stages">${stages}</div>
    <p class="small muted">${t('Stages like Peak (帝旺) or Coming of Age (临官) show where the Day Master is strong; Tomb (墓) or Extinction (绝) show where it rests.')} <a href="#/lesson/daymaster">${t('All 60 day pillars')}</a></p></div>`;
}

// ---------- chart management ----------
const CHART_GROUPS = [['family', 'Family'], ['partner', 'Partner'], ['friends', 'Friends'], ['clients', 'Clients'], ['work', 'Work'], ['other', 'Other']];
function groupOptions(sel, onlyGroups = false) {
  return (onlyGroups ? '' : `<option value="">${t('No group')}</option>`) + CHART_GROUPS.map(([k, n]) => `<option value="${k}" ${sel === k ? 'selected' : ''}>${t(n)}</option>`).join('');
}
const groupName = (k) => { const g = CHART_GROUPS.find(([x]) => x === k); return g ? t(g[1]) : ''; };

function renderSavedList(q, group, sort) {
  const nq = String(q || '').trim().toLowerCase();
  let list = state.charts.filter((c) => (group === '*' || (c.group || '') === group)
    && (!nq || `${c.name || ''} ${c.input.year} ${c.notes || ''} ${c.input.place?.name || ''}`.toLowerCase().includes(nq)));
  const bd = (c) => c.input.year * 10000 + c.input.month * 100 + c.input.day;
  if (sort === 'name') list = [...list].sort((a, b) => (a.name || '').localeCompare(b.name || '', LOCALE));
  else if (sort === 'birth') list = [...list].sort((a, b) => bd(a) - bd(b));
  $('#saved-list').innerHTML = list.length ? list.map((c) => {
    const ch = computeChart({ ...c.input, ziHourNextDay: state.settings.ziHourNextDay });
    return `<div class="saved"><span class="n" data-open="${c.id}"><b>${c.mine ? '<span class="star">★</span> ' : ''}${esc(c.name || t('Chart'))}</b>${c.group ? ` <span class="chip">${groupName(c.group)}</span>` : ''}<br>
      <span class="small muted">${c.input.year}-${pad(c.input.month)}-${pad(c.input.day)} · <span style="font-family:var(--serif)">${PILLAR_KEYS.map((k) => (ch.pillars[k] ? pillarName(ch.pillars[k]) : '??')).join(' ')}</span></span>
      ${c.notes ? `<br><span class="small muted">📝 ${esc(c.notes.slice(0, 80))}${c.notes.length > 80 ? '…' : ''}</span>` : ''}</span>
      <a class="icon-btn" href="#/chart/${c.id}" aria-label="${t('Open')}">›</a></div>`; }).join('') : `<p class="muted small">${t('No chart matches.')}</p>`;
  $('#saved-list').querySelectorAll('[data-open]').forEach((el) => el.addEventListener('click', () => go('#/chart/' + el.dataset.open)));
}

// ---------- Chinese clock (时辰) ----------
function clockSvg(hours, cur) {
  const C = 120, R1 = 112, R0 = 66;
  const pt = (deg, r) => [C + r * Math.cos(deg * Math.PI / 180), C + r * Math.sin(deg * Math.PI / 180)];
  return `<svg viewBox="0 0 240 240" class="clock" role="img" aria-label="${t('Chinese double hours')}">${hours.map((h) => {
    const a0 = -105 + h.branch * 30, a1 = a0 + 30;
    const [x0, y0] = pt(a0, R1), [x1, y1] = pt(a1, R1), [x2, y2] = pt(a1, R0), [x3, y3] = pt(a0, R0);
    const [tx, ty] = pt(a0 + 15, (R1 + R0) / 2);
    const cls = h.lucky ? 'h-good' : h.deity.good && !h.dayClash ? 'h-mid' : 'h-bad';
    return `<g class="${cls}${h.branch === cur ? ' h-now' : ''}"><path d="M${x0},${y0} A${R1},${R1} 0 0 1 ${x1},${y1} L${x2},${y2} A${R0},${R0} 0 0 0 ${x3},${y3} Z"/>
      <text x="${tx}" y="${ty + 7}" text-anchor="middle">${BRANCHES[h.branch].zh}</text></g>`; }).join('')}
    <text x="120" y="112" text-anchor="middle" class="c-big">${hours[cur].label}</text>
    <text x="120" y="136" text-anchor="middle" class="c-small">${hours[cur].range}</text></svg>`;
}

function clockCard(now, mine) {
  const day = pillarsForNow(now).day;
  const hours = hoursOfDay(day, mine);
  const cur = hourBranchOf(now.getHours());
  const h = hours[cur];
  const lucky = hours.filter((x) => x.lucky);
  return `<div class="card" data-dm="${mine ? mine.dayMaster : ''}"><h3 style="margin-top:0">${t('Chinese clock 时辰')}</h3>
    <div class="clock-wrap">${clockSvg(hours, cur)}</div>
    <p><b>${t('Now: {b} hour {p}', { b: `${BRANCHES[cur].zh} ${BRANCHES[cur].animal}`, p: h.label })}</b> · ${h.deity.zh} ${h.deity.name} – ${h.deity.good ? t('Yellow Path (auspicious)') : t('Black Path (inauspicious)')}
      ${mine ? `<br><span class="small">${t('For you: {god}', { god: TEN_GODS[h.god].name })}${h.personal.length ? ' · ⚠︎ ' + t('clashes your chart') : ''}</span>` : ''}</p>
    <p class="small"><b>${t('Lucky hours today:')}</b> ${lucky.map((x) => `${x.range} ${BRANCHES[x.branch].zh}`).join(' · ') || '–'}</p>
    <p class="small muted"><span class="dot h-good"></span>${t('lucky')} <span class="dot h-mid"></span>${t('neutral')} <span class="dot h-bad"></span>${t('avoid for important things')} ·
      <a href="javascript:void 0" id="clock-more">${t('All 12 hours')}</a></p></div>`;
}

function bindClock(now, mine) {
  const more = $('#clock-more');
  if (!more) return;
  more.onclick = () => {
    const hours = hoursOfDay(pillarsForNow(now).day, mine);
    openSheet(`<h2 style="margin-top:0">${t('The 12 hours of today')}</h2><p class="small muted">${t('Yellow Path hours (黄道) are traditionally auspicious; hours that clash the day or your chart are best avoided for important beginnings.')}</p>
      <div class="alm-list">${hours.map((x) => `<div class="alm-row ${x.lucky ? 'r-best' : x.deity.good && !x.dayClash ? 'r-fair' : 'r-bad'}" style="cursor:default">
        <span class="alm-date">${x.range} · <span style="font-family:var(--serif)">${x.label}</span></span>
        <span class="alm-off" style="font-family:inherit"><span style="font-family:var(--serif)">${x.deity.zh}</span> ${x.deity.name}</span>
        <span class="alm-rate">${x.lucky ? t('lucky') : x.dayClash ? t('clashes the day') : x.personal.length ? t('clashes your chart') : x.deity.good ? t('neutral') : t('avoid')}${x.god ? `<br><span class="small muted" style="font-weight:400">${TEN_GODS[x.god].name}</span>` : ''}</span></div>`).join('')}</div>`);
  };
}

// ---------- lunar calendar ----------
function calendarDay(y, m, d, mine) {
  const e = dayEvents(y, m, d);
  const a = dayInfo(y, m, d, mine);
  const l = e.lunar;
  const yp = pillarFromIndex(l.year - 4);
  const moon = moonAge(new Date(y, m - 1, d, 12).getTime());
  const fmtTime = (ms) => new Date(ms).toLocaleTimeString(LOCALE, { hour: '2-digit', minute: '2-digit' });
  return `<h2 style="margin-top:0">${new Date(y, m - 1, d).toLocaleDateString(LOCALE, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h2>
    <p style="font-size:20px;font-family:var(--serif);margin:4px 0">${pillarName(yp)}年 ${l.label}</p>
    <p class="small muted">${t('Lunar year of the {animal} · month {m}, day {d} of {len}. BaZi years change at Li Chun instead.', { animal: BRANCHES[yp.branch].animal, m: (l.leap ? t('leap ') : '') + l.month, d: l.day, len: l.monthLength })}</p>
    ${e.festivals.map((f) => `<p class="tip"><b>${f.zh} ${f.name}</b> – ${f.desc}</p>`).join('')}
    ${e.terms.map((st) => `<p><b>☀︎ ${st.zh} ${st.name}</b> ${t('at {time} – the sun reaches {lon}°.', { time: fmtTime(st.ms), lon: st.lon })}${st.lon === 0 || st.lon === 180 ? t(' Day and night are equal.') : st.lon === 90 ? t(' The longest day of the year (northern hemisphere).') : st.lon === 270 ? t(' The shortest day – Yin peaks and Yang is reborn.') : ''}${st.lon % 30 === 15 ? t(' A new BaZi month begins.') : ''}</p>`).join('')}
    ${e.moon.map((mo) => `<p><b>${mo.type === 'full' ? t('🌕 Full moon') : t('🌑 New moon')}</b> ${t('at {time}', { time: fmtTime(mo.ms) })}</p>`).join('')}
    <p>${e.moon.some((x) => x.type === 'new') ? t('🌑 New moon day – a new lunar month begins in China') : e.moon.some((x) => x.type === 'full') ? t('🌕 Full moon day · {p}% lit', { p: Math.max(moon.illumination, 99) }) : t('{icon} Moon {p}% lit · day {d} of the lunar cycle', { icon: moon.icon, p: moon.illumination, d: Math.floor(moon.age) + 1 })}</p>
    <p><b>${t("Day pillar:")}</b> <span style="font-family:var(--serif)">${pillarName(a.pillars.day)}</span>${mine ? ` – ${t('a {god} day for you', { god: TEN_GODS[tenGod(mine.dayMaster, a.pillars.day.stem)].name })}` : ''}</p>
    <p><span class="officer r-${a.officer.rating}">${a.officer.zh}</span> <b>${t('{name} day', { name: a.officer.name })}</b> – ${RATING_LABEL[a.officer.rating]}. ${t('Good for:')} ${a.officer.good}.</p>
    ${a.personalClash.length ? `<p class="tip">${t('This day {what}.', { what: a.personalClash.join(t(' and ')) })}</p>` : ''}`;
}

// ---------- reminders & calendar export ----------
const FEED_BASE = 'https://baziacademy.app/calendar/';
const FEEDS = [['lunar.ics', t('Moons, equinoxes, solstices & festivals')], ['full-moons.ics', t('Full moons')], ['seasons.ics', t('Equinoxes & solstices')],
  ['solar-terms.ics', t('All 24 solar terms')], ['festivals.ics', t('Chinese festivals')]];

function remindersCard() {
  const r = notify.getReminders();
  if (!notify.supported) return `<div class="card"><h3 style="margin-top:0">${t("Reminders")}</h3><p class="small muted">${t("In the app, you can get notifications before full moons, solar terms and festivals.")}</p></div>`;
  return `<div class="card"><h3 style="margin-top:0">${t("Reminders")}</h3>
    <label class="check"><input type="checkbox" id="r-on" ${r.on ? 'checked' : ''}> ${t("Remind me about lunar events")}</label>
    <div id="r-opts" ${r.on ? '' : 'hidden'}>
      ${Object.entries(KINDS).map(([k, v]) => `<label class="check"><input type="checkbox" data-rk="${k}" ${r.kinds[k] ? 'checked' : ''}> ${v.icon} ${v.name}</label>`).join('')}
      <label for="r-when">${t("When")}</label>
      <select id="r-when"><option value="evening" ${r.when === 'evening' ? 'selected' : ''}>${t('The evening before (19:00)')}</option>
        <option value="morning" ${r.when === 'morning' ? 'selected' : ''}>${t('On the day (08:00)')}</option>
        <option value="exact" ${r.when === 'exact' ? 'selected' : ''}>${t("At the exact moment")}</option></select>
      <p class="help">${t("Planned on this phone – no server. You can turn this off at any time.")}</p></div></div>`;
}

function calendarExportCard() {
  const y = new Date().getFullYear();
  const google = (f) => `https://calendar.google.com/calendar/render?cid=${encodeURIComponent('webcal://' + FEED_BASE.replace(/^https:\/\//, '') + f)}`;
  return `<div class="card"><h3 style="margin-top:0">${t("Add to your calendar")}</h3>
    <h4 style="margin:6px 0 2px">${t('Subscribe (updates automatically)')}</h4>
    <p class="small">${t("Adds the events to Google Calendar – and to Samsung Calendar if it syncs your Google account.")}</p>
    ${FEEDS.map(([f, name]) => `<div class="feed-row"><span>${name}</span><a class="btn secondary feed-btn" href="${google(f)}" target="_blank" rel="noopener">Google</a>
      <button type="button" class="btn secondary feed-btn" data-copy="${FEED_BASE + f}">${t("Copy link")}</button></div>`).join('')}
    <p class="help">${t("iPhone: Settings → Calendar → Accounts → Add Subscribed Calendar, and paste the link.")}</p>
    <h4 style="margin:14px 0 2px">${t("Or import a file")}</h4>
    <p class="small">${t("Creates a calendar file to open with Samsung Calendar or Apple Calendar.")}</p>
    ${Object.entries(KINDS).map(([k, v]) => `<label class="check"><input type="checkbox" data-ek="${k}" ${k !== 'terms' && k !== 'new' ? 'checked' : ''}> ${v.icon} ${v.name}</label>`).join('')}
    <label for="e-years">${t("Period")}</label>
    <select id="e-years"><option value="1">${y}</option><option value="2" selected>${y}–${y + 1}</option><option value="3">${y}–${y + 2}</option><option value="5">${y}–${y + 4}</option></select>
    <button class="btn block" id="e-go" style="margin-top:12px">${t("Create calendar file")}</button></div>`;
}

function bindCalendarCards() {
  const on = $('#r-on');
  if (on) {
    const read = () => ({ on: on.checked, when: $('#r-when').value, kinds: Object.fromEntries([...view.querySelectorAll('[data-rk]')].map((c) => [c.dataset.rk, c.checked])) });
    const apply = async () => {
      $('#r-opts').hidden = !on.checked;
      const ok = await notify.setReminders(read());
      if (!ok) { on.checked = false; $('#r-opts').hidden = true; alert(t('Please allow notifications for BaZi Academy in your phone settings.')); }
    };
    on.onchange = apply; $('#r-when').onchange = apply;
    view.querySelectorAll('[data-rk]').forEach((c) => { c.onchange = apply; });
  }
  view.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); b.textContent = t('Copied ✓'); }
    catch { prompt(t('Copy this link:'), b.dataset.copy); }
  }));
  const go = $('#e-go');
  if (go) go.onclick = async () => {
    const kinds = Object.fromEntries([...view.querySelectorAll('[data-ek]')].map((c) => [c.dataset.ek, c.checked]));
    if (!Object.values(kinds).some(Boolean)) { alert(t('Choose at least one type of event.')); return; }
    const y = new Date().getFullYear(), n = +$('#e-years').value;
    const events = collectEvents(Date.UTC(y, 0, 1), Date.UTC(y + n, 0, 1), kinds);
    const ics = buildIcs(events, t('BaZi Academy – Lunar calendar'));
    go.disabled = true;
    try { await shareTextFile(`bazi-lunar-calendar-${y}${n > 1 ? '-' + (y + n - 1) : ''}.ics`, ics, 'text/calendar'); }
    catch { alert(t('The calendar file could not be created on this device.')); }
    go.disabled = false;
  };
}

// ---------- symbolic stars ----------
function starsCard(c) {
  const stars = findStars(c);
  return `<div class="card"><h3 style="margin-top:0">${t("Symbolic stars 神煞")}</h3>${stars.length
    ? stars.map((st) => `<div class="inter"><b>${st.icon} ${st.name} ${st.zh}</b> <span class="muted small">${pillarListText(st.pillars)}</span><div class="small">${st.desc}</div></div>`).join('')
    : `<p class="muted small">${t("None of the main symbolic stars appear in this chart.")}</p>`}
    <p class="small muted" style="margin-bottom:0"><a href="#/lesson/stars">${t("What are symbolic stars?")}</a></p></div>`;
}

// ---------- almanac & notifications ----------
function almanacDetail(d) {
  const dt = new Date(d.date.year, d.date.month - 1, d.date.day);
  return `<h2 style="margin-top:0">${dt.toLocaleDateString(LOCALE, { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
    <p class="muted">${t('{d} day · {m} month', { d: `<span style="font-family:var(--serif)">${pillarName(d.pillars.day)}</span>`, m: pillarName(d.pillars.month) })}</p>
    <p><span class="officer r-${d.officer.rating}">${d.officer.zh}</span> <b>${t('{name} day', { name: d.officer.name })}</b> – ${RATING_LABEL[d.officer.rating]}</p>
    <p>${d.officer.desc}</p>
    <p><b>${t("Good for:")}</b> ${d.officer.good}</p><p><b>${t("Avoid:")}</b> ${d.officer.avoid}</p>
    <p><b>${t("Clash animal:")}</b> ${BRANCHES[d.clashBranch].zh} ${BRANCHES[d.clashBranch].animal} – ${t('people born in {animal} years take extra care.', { animal: BRANCHES[d.clashBranch].animal })}</p>
    ${d.personalClash.length ? `<p class="tip">${t('This day {what}.', { what: d.personalClash.join(t(' and ')) })} ${t('Postpone important beginnings if you can.')}</p>` : ''}`;
}

function almanacCard(now, mine) {
  const d = dayInfo(now.getFullYear(), now.getMonth() + 1, now.getDate(), mine);
  return `<div class="card"><h3 style="margin-top:0">${t("Almanac 通书")}</h3>
    <p><span class="officer r-${d.officer.rating}">${d.officer.zh}</span> <b>${t('{name} day', { name: d.officer.name })}</b> – ${RATING_LABEL[d.officer.rating]}</p>
    <p class="small"><b>${t("Good for:")}</b> ${d.officer.good}<br><b>${t("Avoid:")}</b> ${d.officer.avoid}</p>
    <p class="small"><b>${t("Clash animal:")}</b> ${BRANCHES[d.clashBranch].animal} ${BRANCHES[d.clashBranch].zh}</p>
    ${d.personalClash.length ? `<p class="tip">${t('Today {what}.', { what: d.personalClash.join(t(' and ')) })}</p>` : ''}
    <a class="btn secondary block" href="#/almanac">${t('Plan the coming days')}${premium.isPremium() ? '' : ' ✦'}</a></div>`;
}

function notifyCard() {
  const s = notify.getSettings();
  if (!notify.supported) return `<div class="card"><h3 style="margin-top:0">${t("Daily tip")}</h3><p class="small muted">${t("In the app, you can get a short daily tip about the day’s energy as a notification.")}</p></div>`;
  return `<div class="card"><h3 style="margin-top:0">${t("Daily tip")}</h3>
    <label class="check"><input type="checkbox" id="n-on" ${s.on ? 'checked' : ''}> ${t("Notify me about each day’s energy")}</label>
    <label for="n-time">${t("Time")}</label><input type="time" id="n-time" value="${s.time}" ${s.on ? '' : 'disabled'}>
    <p class="help">${state.charts.some((c) => c.mine) ? t('Personalised to your ★ chart.') : t('Mark your own chart with ★ for personal tips.')} ${t('Planned on this device – no server, no data sent.')}</p></div>`;
}

function myChart() { const m = state.charts.find((c) => c.mine); return m ? computeChart({ ...m.input, ziHourNextDay: state.settings.ziHourNextDay }) : null; }
function rescheduleTips() { notify.reschedule(myChart()).then(() => notify.rescheduleReminders()).catch(() => {}); }

function bindNotifyCard() {
  const on = $('#n-on'), time = $('#n-time');
  if (!on) return;
  on.onchange = async () => {
    if (on.checked) {
      const ok = await notify.enable(time.value || '08:00', myChart());
      if (!ok) { on.checked = false; alert(t('Please allow notifications for BaZi Academy in your phone settings.')); }
    } else await notify.disable();
    time.disabled = !on.checked;
  };
  time.onchange = () => notify.setTime(time.value || '08:00', myChart());
}

// ---------- premium helpers ----------
function storeButtons() {
  const b = [['ios', ' App Store'], ['android', '▶ Google Play']].filter(([k]) => STORE_LINKS[k]);
  if (!b.length) return `<p class="tip" style="text-align:center">${t('Coming soon to the App Store and Google Play.')}</p>`;
  return `<div class="store-btns">${b.map(([k, n]) => `<a class="btn block" href="${STORE_LINKS[k]}" target="_blank" rel="noopener">${n}</a>`).join('')}</div>`;
}
function appCard(reason) {
  return `<div class="card paywall"><div class="pw-icon">📱</div><h3>${reason}</h3>
    <p class="small">${t('Available in the BaZi Academy app for iPhone and Android: all lessons, unlimited charts, detailed readings, compatibility and the almanac planner.')}</p>
    ${storeButtons()}<a class="small" href="#/premium" style="display:block;text-align:center;margin-top:10px">${t("What’s included?")}</a></div>`;
}
function appPage() {
  setTitle(t('Get the app'), true);
  view.innerHTML = `<div class="card hero"><div class="big">📱</div><h2 style="margin:8px 0 4px">${t('BaZi Academy for iPhone and Android')}</h2>
      <p>${t('The website shows the basics. The app has everything – and works offline.')}</p></div>
    <div class="card"><ul class="benefits">
      <li><b>${t('All {n} lessons', { n: LESSONS.length })}</b><span>${t("Hidden Stems, Day Master, Ten Gods, strength, interactions, luck pillars and the useful god")}</span></li>
      <li><b>${t("Unlimited chart calculations")}</b><span>${t("Charts for family, friends and partners – save as many as you like")}</span></li>
      <li><b>${t("Detailed chart reading")}</b><span>${t("Core nature, favourable elements, weak spots and how to balance them, career, relationships and your current luck phase")}</span></li>
      <li><b>${t("Year-ahead forecast")}</b><span>${t("Your annual pillar and all 12 months: themes, best months, activated stars")}</span></li>
      <li><b>${t("Love & compatibility")}</b><span>${t("Your ideal match, a quick check for someone new, and the full analysis of two charts")}</span></li>
      <li><b>${t("Almanac planner")}</b><span>${t("Find good days for weddings, moving, contracts, launches, travel and renovation – personalised to your chart")}</span></li>
      <li><b>${t('Reminders')}</b><span>${t('Daily tip, full moons, solar terms and festivals as notifications')}</span></li></ul>
      ${storeButtons()}</div>`;
}
function paywallCard(reason) {
  if (premium.WEB) return appCard(reason);
  return `<div class="card paywall"><div class="pw-icon">✦</div><h3>${reason}</h3>
    <p class="small">${t("Unlock all lessons, unlimited charts, detailed readings, compatibility and the almanac planner with a one-time purchase.")}</p>
    <button class="btn block buy-btn">${t('Unlock Premium – {price}', { price: premium.getPrice() })}</button>
    <a class="small" href="#/premium" style="display:block;text-align:center;margin-top:10px">${t("What’s included?")}</a></div>`;
}

function bindPaywall() {
  view.querySelectorAll('.buy-btn, #buy').forEach((b) => { if (b.dataset.bound) return; b.dataset.bound = '1'; b.addEventListener('click', async () => {
    b.disabled = true;
    const r = await premium.buy();
    b.disabled = false;
    if (r === 'purchased') { alert(t('Thank you! Premium is now unlocked.')); router(); }
    else if (r === 'pending') alert(t('Your purchase is pending. Premium unlocks as soon as the payment is confirmed.'));
    else if (r.startsWith('error:')) alert(t('The purchase could not be completed. Please try again later.'));
  }); });
  const rs = $('#restore', view);
  if (rs && !rs.onclick) rs.onclick = async () => { const ok = await premium.restore(); alert(ok ? t('Premium restored.') : t('No previous purchase found for this store account.')); router(); };
}

function readingHtml(c) {
  const { sections } = buildReading(c);
  if (premium.isPremium()) {
    return `<div class="card reading"><h3 style="margin-top:0">${t("Detailed reading")}${premium.FREE_APP ? '' : ` <span class="pill">${t("Premium")}</span>`}</h3>
      ${sections.map((s, i) => `<details ${i < 2 ? 'open' : ''}><summary>${s.title}</summary>${s.html}</details>`).join('')}</div>`;
  }
  return `<div class="card reading"><h3 style="margin-top:0">${t("Detailed reading")}</h3>
    <h4>${sections[0].title}</h4>${sections[0].html}
    <div class="teaser">${sections.slice(1, -1).map((s) => `<h4>🔒 ${s.title}</h4>`).join('')}</div></div>
    ${paywallCard(t('Read your full chart'))}`;
}

// ---------- quiz runner ----------
function runQuiz(host, questions, onFinish, onRetry) {
  let i = 0, score = 0;
  const show = () => {
    if (i >= questions.length) {
      const msg = onFinish(score);
      host.innerHTML = `<div class="score-big">${score}/${questions.length}</div><p style="text-align:center">${msg}</p>
        <button class="btn block" id="q-retry">${t("Try again")}</button>`;
      $('#q-retry', host).onclick = () => { if (onRetry) onRetry(); else { i = 0; score = 0; show(); } };
      return;
    }
    const q = questions[i];
    host.innerHTML = `<div class="q-head"><span>${t('Question {i}/{n}', { i: i + 1, n: questions.length })}</span><span>${t('Score {s}', { s: score })}</span></div>
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
      ex.innerHTML = `<p>${k === q.answer ? t('✅ Correct!') : t('❌ Not quite.')} ${esc(q.explain || '')}</p><button class="btn block" id="q-next">${i + 1 < questions.length ? t('Next') : t('See result')}</button>`;
      $('#q-next', host).onclick = () => { i++; show(); };
      $('#q-next', host).scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }));
  };
  show();
}

// ---------- router ----------
function setTitle(title, back = false) { $('#title').textContent = title; $('#back').hidden = !back; }
function go(hash, replace = false) { if (replace) location.replace(hash); else location.hash = hash; }
$('#back').addEventListener('click', () => { if (history.length > 1) history.back(); else go('#/learn'); });
function supportMailto() {
  const subject = `BaZi Academy – ${t('Support')}`;
  const body = `\n\n\n---\n${t('App version')}: ${BUILD}${WEB_BUILD ? ' (web)' : ''} · ${lang.toUpperCase()}`;
  return `mailto:${PUBLISHER.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
$('#lang-btn').textContent = lang.toUpperCase();
$('#lang-btn').setAttribute('aria-label', t('Language'));
$('#info-btn').setAttribute('aria-label', t('Settings, support & backup'));
$('#info-btn').addEventListener('click', () => go('#/about'));
$('#lang-btn').addEventListener('click', () => {
  openSheet(`<h2 style="margin-top:0">🌐 ${t('Language')}</h2><div class="lang-pick">
    ${[['auto', t('Automatic (phone language)')], ...Object.entries(LANGS)].map(([k, v]) => `<button class="btn ${langSetting() === k ? '' : 'secondary'} block" data-setlang="${k}">${v}</button>`).join('')}</div>`);
  $('#sheet-body').querySelectorAll('[data-setlang]').forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.setlang === langSetting()) { closeSheet(); return; }
    setLang(b.dataset.setlang); location.reload();
  }));
});

function router() {
  closeSheet();
  const [, name = 'today', arg] = (location.hash || '#/today').split('/');
  const tab = { lesson: 'learn', guide: 'learn', about: 'learn', premium: 'learn', match: 'chart', almanac: 'today', forecast: 'chart', influences: 'chart', timeline: 'chart', welcome: '' }[name] ?? name;
  document.body.classList.toggle('no-tabs', name === 'welcome');
  document.body.classList.toggle('on-about', name === 'about');
  document.querySelectorAll('.tabs a').forEach((a) => a.classList.toggle('active', a.dataset.tab === tab));
  (routes[name] || routes.today)(arg ? decodeURIComponent(arg) : undefined);
  if (WEB_BUILD && name !== 'welcome') view.insertAdjacentHTML('beforeend', webFooter());
  view.scrollTop = 0;
}
window.addEventListener('hashchange', router);
function webFooter() {
  return `<p class="web-foot small muted"><a href="../impressum.html">${t('Legal notice (Impressum)')}</a> · <a href="../${lang === 'de' ? 'datenschutz' : 'privacy'}.html">${t('Privacy')}</a> · <a href="#/premium">${t('Get the app')}</a></p>`;
}
if (WEB_BUILD && 'serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
function applyTextSize() { document.documentElement.style.setProperty('--text-zoom', String(state.settings.textSize || 1)); }
applyTextSize();
document.documentElement.lang = lang;
document.querySelectorAll('.tabs a span:last-child').forEach((s) => { s.textContent = t(s.textContent); });
$('#back').setAttribute('aria-label', t('Back'));
if (!state.charts.length && !store.get('onboarded', false) && ['', '#', '#/', '#/today'].includes(location.hash)) location.replace('#/welcome');
router();
window.__baziStarted = true;
premium.onChange(() => router());
premium.init();
rescheduleTips(); // keep the rolling 30-day window of daily tips filled

// ---------- Android hardware back button (Capacitor) ----------
const CapApp = plugin('App');
if (CapApp) {
  Promise.resolve().then(() => CapApp.addListener('backButton', ({ canGoBack }) => {
    if (!sheet.hidden) closeSheet();
    else if (canGoBack && !['', '#', '#/', '#/today'].includes(location.hash)) history.back();
    else CapApp.exitApp();
  })).catch(() => {});
}
