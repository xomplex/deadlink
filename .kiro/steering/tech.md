# Tech Steering — Deadlink

## Stack

- **Vanilla HTML + CSS + JavaScript, no build step, no framework.** The app
  must run by opening `index.html` or any static server, and deploy to
  GitHub Pages with zero config. Judges must be able to run it in seconds.
- **Node.js (built-in test runner only)** for tests: `node --test tests/*.test.js`.
  No npm dependencies at runtime; keep `node_modules` out of the repo.

## Data sources (all free, keyless, CORS-friendly)

- **Liveness probe:** `fetch(url, { mode: 'no-cors' })` — resolves opaque when
  the server answers, rejects on DNS/network failure. Never claim a
  CORS-blocked responder is dead.
- **Wayback availability:** `https://archive.org/wayback/available?url=<url>`
  → closest snapshot `{ status, available, url, timestamp }`.
- **Wayback CDX index:** `https://web.archive.org/cdx/search/cdx?url=<url>&output=json&limit=N`
  → snapshot history (timestamp, statuscode, mimetype).
- All archive calls go through one `archive.js` module with a single
  `fetchJson` helper, a 15s timeout, and typed errors (`ArchiveUnavailable`).

## Rules

- No `eval`, no `innerHTML` with untrusted strings — render with `textContent`
  or escaped templates. URLs pasted by the user are untrusted input.
- All network calls must have timeouts and user-visible error states.
- Bulk checks run with a concurrency cap of 4 and a per-URL timeout; the UI
  must stay responsive and show progress.
- localStorage keys are namespaced `deadlink:*`. Cemetery entries are
  `{ url, verdict, lastSeen, snapshotUrl, checkedAt }`.
- Keep functions pure and testable where possible: URL normalization,
  verdict logic, and report formatting live in modules covered by `tests/`.
