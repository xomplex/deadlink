// Deadlink UI wiring — thin layer over lib/*.
import { normalizeUrl, parseUrlList, extractLinksFromBookmarksHtml, waybackTimestampToDate, formatDate } from './lib/urls.js';
import { probeLiveness } from './lib/probe.js';
import { getClosestSnapshot, getSnapshotHistory, ArchiveUnavailable } from './lib/archive.js';
import { saveTombstone, loadTombstones, clearCemetery, formatMarkdownReport } from './lib/cemetery.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let bulkRows = [];

/** Full single-link check: probe + archive. Returns a row for the cemetery/report. */
async function checkOne(url) {
  const verdict = await probeLiveness(url);
  let snapshot = { available: false, url: null, timestamp: null, status: null };
  let history = { count: 0, first: null, last: null };
  let archiveError = null;
  if (verdict === 'dead') {
    try { snapshot = await getClosestSnapshot(url); } catch (e) { archiveError = e; }
    try { history = await getSnapshotHistory(url); } catch { /* non-blocking */ }
  }
  const row = {
    url,
    verdict: verdict === 'dead' && !snapshot.available && !archiveError ? 'no-snapshot' : verdict,
    snapshotUrl: snapshot.url,
    lastSeen: snapshot.timestamp ? formatDate(waybackTimestampToDate(snapshot.timestamp)) : null,
    snapshotCount: history.count,
    firstSeen: history.first ? formatDate(waybackTimestampToDate(history.first)) : null,
    archiveError: archiveError ? String(archiveError.message || archiveError) : null,
  };
  saveTombstone({ url, verdict: row.verdict, lastSeen: row.lastSeen, snapshotUrl: row.snapshotUrl });
  return row;
}

function verdictWord(v) {
  return { alive: 'ALIVE', dead: 'DEAD', unknown: 'UNKNOWN', 'no-snapshot': 'DEAD — NO SNAPSHOT' }[v] || v.toUpperCase();
}

function renderVerdict(row) {
  const el = $('verdict');
  const epitaph = row.verdict === 'alive'
    ? 'Still breathing. Nothing to bury here.'
    : row.verdict === 'dead'
      ? `Last seen alive ${row.lastSeen || 'on an unknown date'}. The Archive kept a copy.`
      : row.verdict === 'no-snapshot'
        ? 'Dead — and the Archive never captured it. Truly gone.'
        : 'The server answers, but this browser cannot read the reply. Not declared dead.';
  el.innerHTML = `
    <p class="v-word ${row.verdict === 'no-snapshot' ? 'dead' : row.verdict}">${esc(verdictWord(row.verdict))}</p>
    <p class="v-url">${esc(row.url)}</p>
    <p class="v-meta">${esc(epitaph)}</p>
    ${row.snapshotCount ? `<p class="v-meta">Snapshots: ${row.snapshotCount} — first seen ${esc(row.firstSeen || 'unknown')}, last seen ${esc(row.lastSeen || 'unknown')}.</p>` : ''}
    ${row.snapshotUrl ? `<a class="resurrect" href="${esc(row.snapshotUrl)}" target="_blank" rel="noopener">↺ Resurrect — open archived copy</a>` : ''}
    ${row.archiveError ? `<p class="note">Archive note: ${esc(row.archiveError)}</p>` : ''}`;
  el.hidden = false;
}

// ---- single check ----
$('single-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const err = $('single-error');
  err.hidden = true;
  const url = normalizeUrl($('single-url').value);
  if (!url) { err.textContent = 'That does not look like a URL. Try https://example.com'; err.hidden = false; return; }
  const box = $('verdict');
  box.hidden = false;
  box.innerHTML = '<p class="v-meta">Digging…</p>';
  const row = await checkOne(url);
  renderVerdict(row);
  renderCemetery();
});

// ---- bulk check ----
async function runBulk(urls) {
  bulkRows = [];
  const total = urls.length;
  const prog = $('bulk-progress'), bar = $('bulk-bar'), label = $('bulk-label');
  const results = $('bulk-results'), summary = $('bulk-summary');
  prog.hidden = false; results.innerHTML = ''; summary.hidden = true;
  $('bulk-copy').disabled = true;
  let done = 0;
  const table = document.createElement('table');
  table.innerHTML = '<tr><th>Link</th><th>Verdict</th><th>Resurrection</th></tr>';
  results.appendChild(table);
  const pool = 4;
  let i = 0;
  async function worker() {
    while (i < total) {
      const url = urls[i++];
      const row = await checkOne(url);
      bulkRows.push(row);
      const tr = document.createElement('tr');
      tr.innerHTML = `<td class="url">${esc(url)}</td>
        <td><span class="pill ${row.verdict === 'no-snapshot' ? 'dead' : row.verdict}">${esc(row.verdict)}</span></td>
        <td>${row.snapshotUrl ? `<a href="${esc(row.snapshotUrl)}" target="_blank" rel="noopener">archived copy</a>` : '—'}</td>`;
      table.appendChild(tr);
      done++;
      bar.style.width = `${Math.round((done / total) * 100)}%`;
      label.textContent = ` ${done} / ${total}`;
    }
  }
  await Promise.all(Array.from({ length: Math.min(pool, total) }, worker));
  const counts = { alive: 0, dead: 0, unknown: 0, 'no-snapshot': 0 };
  for (const r of bulkRows) counts[r.verdict] = (counts[r.verdict] || 0) + 1;
  summary.textContent = `Checked ${total} links — ${counts.alive} alive, ${counts.dead} dead, ${counts.unknown} unknown.`;
  summary.hidden = false;
  $('bulk-copy').disabled = false;
  renderCemetery();
}

$('bulk-run').addEventListener('click', () => {
  const urls = parseUrlList($('bulk-input').value);
  if (!urls.length) { alert('Paste at least one URL first.'); return; }
  runBulk(urls);
});

const drop = document.querySelector('.drop');
drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('drag'); });
drop.addEventListener('dragleave', () => drop.classList.remove('drag'));
drop.addEventListener('drop', async (e) => {
  e.preventDefault(); drop.classList.remove('drag');
  const file = e.dataTransfer.files && e.dataTransfer.files[0];
  if (file) loadBookmarksFile(file);
});
$('bulk-file').addEventListener('change', (e) => {
  const file = e.target.files && e.target.files[0];
  if (file) loadBookmarksFile(file);
});
async function loadBookmarksFile(file) {
  const text = await file.text();
  const links = extractLinksFromBookmarksHtml(text);
  if (!links.length) { alert('No links found in that file.'); return; }
  $('bulk-input').value = links.map((l) => l.url).join('\n');
  runBulk(links.map((l) => l.url));
}

$('bulk-copy').addEventListener('click', async () => {
  const md = formatMarkdownReport(bulkRows);
  try { await navigator.clipboard.writeText(md); $('bulk-copy').textContent = 'Copied ✓'; }
  catch { $('bulk-copy').textContent = 'Copy failed — select the table instead'; }
  setTimeout(() => { $('bulk-copy').textContent = 'Copy Markdown report'; }, 2500);
});

// ---- cemetery ----
function renderCemetery() {
  const filter = $('cemetery-filter').value;
  const tombs = loadTombstones().filter((t) => filter === 'all' || t.verdict === filter || (filter === 'dead' && t.verdict === 'no-snapshot'));
  const grid = $('cemetery-grid');
  $('cemetery-empty').hidden = tombs.length > 0;
  grid.innerHTML = tombs.map((t) => `
    <div class="tomb ${t.verdict === 'alive' ? 'alive' : 'dead'}">
      <div class="t-url">${esc(t.url)}</div>
      <p class="t-epitaph">${t.verdict === 'alive' ? 'Still among the living.' : `Here lies a link. Last seen ${esc(t.lastSeen || 'unknown')}.`}</p>
      <span class="pill ${t.verdict === 'alive' ? 'alive' : 'dead'}">${esc(t.verdict)}</span>
      ${t.snapshotUrl ? ` <a href="${esc(t.snapshotUrl)}" target="_blank" rel="noopener">resurrect ↺</a>` : ''}
    </div>`).join('');
}
$('cemetery-filter').addEventListener('change', renderCemetery);
$('cemetery-clear').addEventListener('click', () => {
  if (confirm('Clear all tombstones from the Cemetery?')) { clearCemetery(); renderCemetery(); }
});

renderCemetery();
