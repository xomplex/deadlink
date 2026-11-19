// URL helpers — pure functions, no DOM, no network. Tested by tests/urls.test.js

/** Normalize user input into a canonical absolute URL string, or null. */
export function normalizeUrl(input) {
  if (typeof input !== 'string') return null;
  let s = input.trim();
  if (!s) return null;
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(s)) s = 'https://' + s;
  try {
    const u = new URL(s);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    return u.toString();
  } catch {
    return null;
  }
}

/** Parse a newline/comma-separated list into deduped, normalized URLs. */
export function parseUrlList(text) {
  if (typeof text !== 'string') return [];
  const out = [];
  const seen = new Set();
  for (const raw of text.split(/[\n,]+/)) {
    const u = normalizeUrl(raw);
    if (u && !seen.has(u)) { seen.add(u); out.push(u); }
  }
  return out;
}

/**
 * Extract links from a browser bookmarks export (Netscape HTML).
 * Regex-based so it works in the browser and in Node tests.
 * Returns [{ url, title }] deduped by URL.
 */
export function extractLinksFromBookmarksHtml(html) {
  if (typeof html !== 'string') return [];
  const out = [];
  const seen = new Set();
  const re = /<a\s[^>]*href="([^"]+)"[^>]*>([^<]*)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const url = normalizeUrl(m[1]);
    if (!url || seen.has(url)) continue;
    seen.add(url);
    out.push({ url, title: (m[2] || '').trim() || url });
  }
  return out;
}

/** Human date from a Wayback timestamp like 20261118035140. */
export function waybackTimestampToDate(ts) {
  if (typeof ts !== 'string' || ts.length < 8) return null;
  const y = +ts.slice(0, 4), mo = +ts.slice(4, 6) - 1, d = +ts.slice(6, 8);
  const date = new Date(Date.UTC(y, mo, d));
  return isNaN(date.getTime()) ? null : date;
}

/** Short date label, e.g. "18 Nov 2026". */
export function formatDate(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) return 'unknown';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}
