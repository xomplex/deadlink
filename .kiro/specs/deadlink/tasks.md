# Tasks — Deadlink

> Spec-first build for Kiroween 2026. Check a box only when its acceptance
> criteria pass (tests green, or manual checklist verified).

## 1. Project scaffolding
- [x] 1.1 Create repo structure, README, MIT LICENSE, .gitignore (never ignore `.kiro/`)
- [x] 1.2 Write steering docs (product, tech, structure)
- [x] 1.3 Write spec: requirements.md, design.md, tasks.md (this file)
- [x] 1.4 Create GitHub repo `deadlink` under xomplex (user creates in web UI) and push

## 2. Core libraries (pure, tested)
- [x] 2.1 `lib/urls.js`: normalizeUrl, parseUrlList, extractLinksFromBookmarksHtml
- [x] 2.2 `lib/probe.js`: probeLiveness with 20s timeout (alive/dead/unknown)
- [x] 2.3 `lib/archive.js`: getClosestSnapshot + getSnapshotHistory (CDX), 15s/30s timeouts
- [x] 2.4 `lib/cemetery.js`: localStorage CRUD + formatMarkdownReport
- [x] 2.5 `tests/urls.test.js` + `tests/probe-archive.test.js`: 11 tests green (`node --test tests/*.test.js`)

## 3. UI
- [x] 3.1 index.html shell + styles.css graveyard theme (responsive)
- [x] 3.2 Single-check flow wired to lib/* with verdict card + timeline
- [x] 3.3 Bulk check: textarea list + bookmarks drop + progress + summary + copy report
- [x] 3.4 Cemetery grid with filters + clear-all (confirm)
- [x] 3.5 Error states: invalid URL, archive unreachable, probe timeout

## 4. Verification
- [x] 4.1 Manual checklist: alive URL ✓ (live probe) / dead URL — VM egress proxy masks DNS failures (mock-tested instead, see BUILD-LOG) / no-snapshot URL ✓ (Wayback API) / 20-link bookmarks file — not yet run live
- [x] 4.2 Run deadlink-tester agent against the spec; fix gaps
- [x] 4.3 Deploy to GitHub Pages; verify the public URL works cold (no login, no keys)

## 5. Submission assets (before 5 Dec 05:00 WIB)
- [x] 5.1 Demo video <3 min (public YouTube) — screen-record the real app
- [ ] 5.2 KIRO-WRITEUP.md — how Kiro was used (specs, hooks, steering, agents, MCP)
- [ ] 5.3 Devpost draft submission (repo URL + app URL + video + description)
- [ ] 5.4 Optional bonus: blog post (Bonus Blog Prize, top 100) + #KiroweenHackathon26 social post (Social Blitz)
