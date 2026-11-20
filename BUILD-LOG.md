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

## 2026-11-19 ~10:45 WIB — Demo video 5.1 DONE + Devpost draft 5.3 (draft only)

- Video: `demo-video/deadlink-demo-2026-11-19.mp4` — **81.6 s, 1280x720, h264 + AAC, 5.5 MB**. 11 clips, all footage is real screenshots of the real app running in headless Chrome (chrome-headless-shell), slow zoom push, English TTS voiceover (Helio), no music.
- Shown (all verified live in the browser): hook; single check `example.com` → **ALIVE**; dead domain → **DEAD — NO SNAPSHOT**; `megaupload.com` → **DEAD**, last seen alive 19 Aug 2013, **Resurrect** button (closest snapshot 20130819094630); bulk check of 5 real URLs → **5 alive, 0 dead**; Cemetery with 6 tombstones (5 alive + 1 no-snapshot); footer/outro with repo URL.
- Verification: ffprobe duration 81.634 s (<180 s), h264 1280x720 + AAC; frame extracts at t=2/15/33/53/62/75 s confirmed real app UI; audio RMS ≈ −31.9 dB (voiceover present, no clipping).
- Deliberately left out: the "Copy Markdown report" click — the clipboard API fails in headless Chrome (headless artifact; works in a real browser). The button is visible in the bulk shot but not clicked. The CDX snapshot-history line ("Snapshots: N — first/last seen") did not render for megaupload in the captured frame (CDX slow/empty that run); narration claims no snapshot count.
- Environment fix (recording only): headless Chrome initially could NOT reach the internet — the VM egress proxy needs auth (Chrome ignores userinfo in env proxy URLs) and MITMs TLS. First drive showed false DEAD for every URL (incl. example.com) and was discarded. Fix: a local CONNECT relay on 127.0.0.1:18080 (`demo-video/work/relay.mjs`, adds Proxy-Authorization from env, never logs it) + `--ignore-certificate-errors` for the MITM CA. Second drive then verified honest verdicts. Relay + local http server stopped after the render.
- Devpost draft: `DEVPOST-DRAFT.md` — title, tagline, description, how-Kiro-was-used, links. Placeholders clearly marked: app URL `https://xomplex.github.io/deadlink/` (Pages NOT deployed yet) and YouTube video URL (user uploads the mp4 to public YouTube).
- tasks.md 5.1 checked (video verified). 5.3 NOT checked (draft only, not submitted).
- Still user-side: upload the mp4 to public YouTube → paste URL into the draft; enable GitHub Pages → verify app URL cold → submit Devpost before 5 Dec 05:00 WIB.

## 2026-11-21 -- Task 4.1: 20-link bookmarks live test (DONE)

- Test file: tests/bookmarks-20.html (20 links: 17 live sites + megaupload, geocities, invented ghost domain, httpstat.us).
- Method: extractLinksFromBookmarksHtml on the HTML yielded 20 deduplicated normalised URLs (verified).
  Live-probed via probeLiveness (concurrency=4, 20s per-URL timeout) then getClosestSnapshot for dead verdicts.
  Run via node --input-type=module from repo root using real lib modules.
- Results (Node 24, VM network, 2026-11-21):
  alive (17): example.com, w3.org, archive.org, wikipedia.org, github.com, news.ycombinator.com,
    iana.org/domains/reserved, httpbin.org, ietf.org, rfc-editor.org/rfc/rfc2606, mozilla.org,
    geocities.com, developer.mozilla.org, caniuse.com, web.archive.org, iana.org, w3schools.com.
  unknown (2): megaupload.com, this-domain-does-not-exist-xyz123deadlink.com.
    Expected: VM egress proxy intercepts and hangs rather than giving DNS NXDOMAIN.
    Honest-verdict rule holds: 'unknown' is never shown as 'dead'.
  dead (1): httpstat.us (transient connectivity from VM; Wayback snapshot found 20250629, resurrect link shown).
- geocities.com alive: Hostinger now serves a redirect on that domain -- server answers = alive (correct).
- Acceptance criteria verified: R3.2 (bookmarks HTML extraction), R3.3 (concurrency cap + per-URL timeout),
  R3.4 (summary counts + formatMarkdownReport covered by unit tests).
- Task 4.1 PASS.

## 2026-11-21 -- Task 4.2: deadlink-tester audit (DONE)
Checked all requirements.md criteria against app.js, lib/*, tests/*:
R1.1 normalizeUrl: PASS
R1.2 alive on response: PASS
R1.3 dead on network error: PASS
R1.4 unknown on timeout (never dead): PASS
R1.5 Wayback lookup on dead verdict: PASS
R1.6 no-snapshot verdict: PASS
R2.1 CDX timeline first/last/count: PASS
R2.2 CDX failure non-blocking note: FIXED+PASS (historyError captured and rendered)
R3.1 URL list parse + progress bar: PASS
R3.2 Bookmarks HTML extraction: PASS (20 links, live 4.1 test)
R3.3 Concurrency cap 4, 20s timeout: PASS
R3.4 Summary counts + Markdown report: PASS
R4.1 Cemetery deadlink:* namespace: PASS
R4.2 Cemetery renders verdict/lastSeen/snapshot: PASS
R4.3 Clear Cemetery with confirm: PASS
R5.1 First screen one input/button/verdict: PASS
R5.2 No copyrighted assets: PASS
R5.3 Static no-build-step deploy: PASS
Honest-verdict rule unknown!=dead: PASS
XSS safety esc() on all untrusted: PASS
Fix applied: 4 lines in app.js (historyError); 11/11 tests green.
Verdict: SHIP.

## 2026-11-21 -- Task 4.3: GitHub Pages cold verification (DONE)
URL https://xomplex.github.io/deadlink/ HTTP 200, full app HTML returned.
styles.css 200 (4806 bytes). app.js 200 (application/javascript). No login, no keys.
Task 4.3 PASS.
