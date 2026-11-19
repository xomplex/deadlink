# Design — Deadlink

## Overview

A static single-page app. ES modules, no framework, no build step. All logic
runs in the browser; the only network calls are (a) the liveness probe to the
user's URL and (b) the Internet Archive's public APIs. State lives in
localStorage. Deploys to GitHub Pages.

## Architecture

```
index.html ──> app.js (UI wiring, state machine)
   ├── lib/urls.js      — normalizeUrl, parseUrlList, extractLinksFromBookmarksHtml
   ├── lib/probe.js     — probeLiveness(url): 'alive' | 'dead' | 'unknown'
   ├── lib/archive.js   — getClosestSnapshot(url), getSnapshotHistory(url)
   └── lib/cemetery.js  — load/save/clear tombstones, formatMarkdownReport
```

## Data flow — single check

1. `normalizeUrl(input)` → canonical URL or validation error.
2. `probeLiveness(url)`:
   - `fetch(url, { mode: 'no-cors', signal: timeout(20s) })`
   - resolves (opaque or not) → `alive`
   - rejects with TypeError/network error → `dead`
   - any other outcome → `unknown`
3. If `dead`: `getClosestSnapshot(url)` (availability API) → snapshot or
   `no-snapshot`. In parallel, `getSnapshotHistory(url)` (CDX, limit 1000,
   collapse by year for the timeline summary).
4. `cemetery.save({ url, verdict, lastSeen, snapshotUrl, checkedAt })`.
5. Render verdict card + timeline + resurrect link.

## Data flow — bulk check

1. Input: textarea list OR dropped bookmarks HTML file.
2. `parseUrlList(text)` / `extractLinksFromBookmarksHtml(html)` → deduped URLs.
3. Worker pool of 4: for each URL run the single-check flow (probe +
   availability only; CDX history on demand per row to keep it fast).
4. Progress bar + live table; summary counts; `formatMarkdownReport(rows)`
   for the copyable report.

## Error handling

- Every network call has a timeout (15s archive, 20s probe) and returns a
  typed error; the UI shows a non-blocking note and keeps working.
- Archive API down → verdict still shown, snapshot section says
  "Archive unreachable — try again".
- Invalid URL → inline validation error, no network call.

## UI

- Header: wordmark "DEADLINK" + tagline "The web forgets. We remember."
- Hero: single URL input + "Check the dead" button.
- Verdict card: big verdict word, tombstone graphic (CSS), last-seen date,
  snapshot count, "Resurrect" button.
- Bulk section: textarea + drop zone + results table + summary + copy report.
- Cemetery: grid of tombstones, filter by verdict, clear-all (confirm).
- Theme: near-black `#0d0f0e`, bone `#f2ede3`, ectoplasm `#8affc1`,
  fog purple `#6b5b95`; system serif for epitaphs, monospace for URLs.
- Responsive: single column under 720px; no horizontal scroll.

## Testing strategy

- `node --test tests/`: pure functions (URL normalization, list parsing,
  bookmarks extraction, verdict mapping, markdown report).
- Manual checklist: 1 known-alive URL, 1 known-dead URL, 1 URL with no
  snapshot, bookmarks file with 20+ links, archive API down (offline).
- Kiro custom agent `deadlink-tester` re-runs the checklist against the
  spec after each build (see `.kiro/agents/deadlink-tester.md`).
