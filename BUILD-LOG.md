# Build Log — Deadlink (Kiroween 2026)

## 2026-11-18 ~22:00 WIB — Phase 0 verification (DONE)

- **Official rules read live** (`kiroween.devpost.com/rules`, crawled 18 Nov 14:51 UTC):
  - Submission Period ends **Fri 4 Dec 2026 2:00 PM PT = Sat 5 Dec 05:00 WIB**. No extensions.
  - **Indonesia is ELIGIBLE.** §3 exclusion list, quoted: "Quebec, Argentina, Brazil, Italy, Philippines, Russia, Cuba, Iran, North Korea, Syria, Belarus, Crimea, DNR, LNR, UAE + OFAC-sanctioned". Indonesia is NOT named. The secondary guide claiming otherwise is wrong against the official rules. (Caveat: §4 regional-restrictions clause — Kiro features/models may vary by region; Kiro is available worldwide with no residence ban, inference served from US/EU. Prize payout for non-US winners needs W-8BEN + bank account.)
  - Prizes confirmed: 1st $30k, 2nd $20k, 3rd $10k, category $5k ×4, Best Startup $10k, Ghost of Kiroween Past $2k, Best Kiro Crew App $1k, Student Pro Max ×4, Best Demo $1k, Blog 2,000 credits ×100, Social Blitz 3-mo Pro+ ×5.
  - Requirements: NEW app built with Kiro (IDE/CLI/Web/Crew) during 30 Oct–4 Dec; public GitHub repo + open-source license + `/.kiro` at root (NOT gitignored); working app URL; demo video <3 min on public YouTube; "how Kiro was used" write-up. Judging: Stage 1 pass/fail, Stage 2 five criteria ×20% (Impact, Tech Implementation incl. depth of Kiro use, Design, Innovation, Presentation).
- **Credits form found:** https://forms.gle/ykuadfNyNdWdbJfH9 — 4,000 credits, request by Tue 1 Dec 12:00 PM PT, first-come-first-served, 48 business-hour review, redeem by 4 Dec, expire 31 Dec. Requires: Devpost registration + Kiro account (Kiro user ID or AWS account ID) + named category. **USER-SIDE:** user must create a Kiro account + Devpost account and submit the form. Not done yet.
- **Kiro CLI on this VM: WORKS.** Installed via `curl -fsSL https://cli.kiro.dev/install | bash` → kiro-cli 3.4.0, glibc 2.39 (needs 2.34+). Headless mode exists (`kiro-cli chat --no-interactive --trust-all-tools --trust-workspace`). Auth: `kiro-cli login --use-device-flow` — **USER-SIDE:** needs the user's GitHub/Google/AWS Builder ID sign-in (code entered in their browser). Not logged in yet.
- **Path chosen:** real Kiro CLI usage after user login (spec workflow + CLI build sessions), NOT hand-author-only. The `.kiro/` spec/steering/hooks/agents in this repo were authored spec-first; implementation continues through kiro-cli once logged in, and the judges' write-up will describe exactly that split.

## 2026-11-18 ~22:00 WIB — Concept picked: Deadlink

- **Deadlink — "The web forgets. We remember."** Resurrect dead links via the Wayback Machine. Category: **Resurrection**.
- Why: real problem (link rot), judge-readable in 30 seconds, zero-cost (all APIs free/keyless), fully client-side static site (GitHub Pages), no paid APIs, no accounts, no server. Plays to our strengths: spec-driven builds, polished UI, video demo tooling.
- Core data sources verified live from the VM: Wayback availability API ✓, CDX index ✓ (example.com: 25 snapshot groups, 2002→2026), no-snapshot case ✓ (unarchived URL returns empty). allorigins proxy NOT reliable from this VM (Cloudflare 520/522) — design avoids it entirely (no-cors probe + Wayback APIs only).

## 2026-11-18 ~22:05 WIB — Scaffold built (local)

- Repo at `~/workspace/kiroween/deadlink/` (git init + committed locally; NOT pushed — GitHub repo creation needs the user, see below).
- `index.html` + `styles.css` (graveyard theme) + `app.js` + `lib/{urls,probe,archive,cemetery}.js` + `tests/*.test.js` — **11/11 tests green**.
- `.kiro/` complete: steering (product/tech/structure), spec (requirements/design/tasks), hooks (test-on-change), agents (deadlink-tester).
- Local serve verified: `python3 -m http.server` → index/app.js/styles.css all HTTP 200.
- Live flow verified in Node: probe example.com → `alive`; Wayback closest snapshot 20261118035140; CDX history works (30s timeout — CDX is slow; 15s was too tight, bumped).
- **VM caveat (recorded, not a product bug):** the VM's egress proxy masks DNS failures, so a dead-domain probe from this VM returns `unknown` (proxy hangs) instead of `dead`. The dead path is covered by mocked unit tests; on a normal browser/network it rejects as designed. Verify the dead verdict in a real browser before recording the demo video.

## Next milestones

1. **USER (blocking):** (a) create GitHub repo `deadlink` under xomplex (public) — then we push; (b) create Kiro account + `kiro-cli login --use-device-flow` on the VM (or give a device code); (c) register on Devpost (Join Hackathon) + submit credits form naming category **Resurrection** (by 1 Dec PT).
2. **Build (via kiro-cli after login):** bulk-check polish, 20-link bookmarks live test, deadlink-tester pass, GitHub Pages deploy + cold verification.
3. **Submission assets:** demo video <3 min (public YouTube, screen-record the real app), KIRO-WRITEUP.md finalization, Devpost draft. Optional bonus: blog post + #KiroweenHackathon26 post.
4. Hard deadline: **Sat 5 Dec 2026 05:00 WIB**.
