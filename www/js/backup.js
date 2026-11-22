// Export / import of charts and learning progress as a JSON file (no server).
export const FORMAT = 'bazi-academy-backup';

/** Build the backup object. The purchase is not included – it is restored from the store. */
export function makeBackup(state, extra = {}) {
  return { format: FORMAT, version: 1, exported: new Date().toISOString(),
    charts: state.charts, done: state.done, best: state.best, settings: state.settings, ...extra };
}

const isChart = (c) => c && typeof c.id === 'string' && c.input && Number.isInteger(c.input.year)
  && Number.isInteger(c.input.month) && Number.isInteger(c.input.day);

/** Validate a parsed backup. Throws a readable error if it isn't one of ours. */
export function validateBackup(obj) {
  if (!obj || obj.format !== FORMAT) throw new Error('This file is not a BaZi Academy backup.');
  if (!Array.isArray(obj.charts) || !obj.charts.every(isChart)) throw new Error('The backup file is damaged (charts).');
  return obj;
}

/** Merge a backup into the current state; returns { state, added } without mutating the input. */
export function mergeBackup(state, backup) {
  const ids = new Set(state.charts.map((c) => c.id));
  const incoming = backup.charts.filter((c) => !ids.has(c.id))
    .map((c) => ({ id: c.id, name: String(c.name || '').slice(0, 40), input: c.input, mine: !!c.mine,
      group: typeof c.group === 'string' ? c.group.slice(0, 20) : '', notes: typeof c.notes === 'string' ? c.notes.slice(0, 2000) : '' }));
  const hasMine = state.charts.some((c) => c.mine);
  if (hasMine) incoming.forEach((c) => { c.mine = false; });
  else { let seen = false; incoming.forEach((c) => { if (c.mine && !seen) seen = true; else c.mine = false; }); }
  const best = { ...state.best };
  for (const [k, v] of Object.entries(backup.best || {})) if (typeof v === 'number') best[k] = Math.max(best[k] || 0, v);
  const done = { ...state.done };
  for (const [k, v] of Object.entries(backup.done || {})) if (v === true) done[k] = true;
  return { state: { ...state, charts: [...state.charts, ...incoming], best, done }, added: incoming.length };
}
