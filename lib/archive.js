// Internet Archive clients — free public APIs, no key, no account.

const AVAIL = 'https://archive.org/wayback/available';
const CDX = 'https://web.archive.org/cdx/search/cdx';

export class ArchiveUnavailable extends Error {
  constructor(message) { super(message); this.name = 'ArchiveUnavailable'; }
}

async function fetchJson(url, timeoutMs, fetchImpl) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetchImpl(url, { signal: ctrl.signal });
    if (!res.ok) throw new ArchiveUnavailable(`Archive returned HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    if (err instanceof ArchiveUnavailable) throw err;
    throw new ArchiveUnavailable(err && err.name === 'AbortError' ? 'Archive request timed out' : `Archive unreachable: ${err && err.message ? err.message : err}`);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Closest Wayback snapshot for a URL.
 * @returns {{available:boolean, url:string|null, timestamp:string|null, status:string|null}}
 */
export async function getClosestSnapshot(url, timeoutMs = 15000, fetchImpl = fetch) {
  const data = await fetchJson(`${AVAIL}?url=${encodeURIComponent(url)}`, timeoutMs, fetchImpl);
  const snap = data && data.archived_snapshots && data.archived_snapshots.closest;
  if (!snap) return { available: false, url: null, timestamp: null, status: null };
  return { available: true, url: snap.url || null, timestamp: snap.timestamp || null, status: snap.status || null };
}

/**
 * Snapshot history summary from the CDX index.
 * @returns {{count:number, first:string|null, last:string|null}}
 */
export async function getSnapshotHistory(url, timeoutMs = 30000, fetchImpl = fetch) {
  const q = `${CDX}?url=${encodeURIComponent(url)}&output=json&limit=1000&collapse=timestamp:4&fl=timestamp,statuscode`;
  const data = await fetchJson(q, timeoutMs, fetchImpl);
  if (!Array.isArray(data) || data.length < 2) return { count: 0, first: null, last: null };
  const rows = data.slice(1).map((r) => r[0]).filter(Boolean).sort();
  return { count: rows.length, first: rows[0] || null, last: rows[rows.length - 1] || null };
}
