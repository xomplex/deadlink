# Devpost Draft — Deadlink (KIROWEEN 2026, category: Resurrection)

> STATUS 20 Nov ~11:57 WIB: (1) GitHub Pages LIVE — https://xomplex.github.io/deadlink/ HTTP 200 diverifikasi tot; (2) demo video SUDAH di-upload ke YouTube publik: https://youtube.com/shorts/RNn367yRAhA (judul "Deadlink — Resurrect the Dead Web | Built with Kiro (Kiroween 2026)", channel @KantorAgent, diverifikasi via oEmbed). Sisa: submit Devpost sebelum 5 Des 05:00 WIB + finalisasi KIRO-WRITEUP.md.

---

## Project title

Deadlink — Resurrect the Dead Web

## Tagline

The web forgets. We remember.

## Description

Link rot is real: a large share of links die within a few years — old blog
posts, citations, bookmarks, and references quietly 404. When a link dies,
the knowledge behind it dies with it. The Wayback Machine has archived most
of it — but nobody checks.

**Deadlink** is a free, client-side web app that finds dead links and brings
them back to life through the Internet Archive's Wayback Machine. Paste a URL
— or drop an entire exported bookmarks file — and Deadlink tells you what's
dead, when it was last seen alive, and hands you the archived copy.

**What it does**

- **Single link check** — paste any URL: Deadlink probes whether it still
  answers. If it's dead, it finds the closest Wayback snapshot and shows the
  snapshot history (first seen, last seen, how many captures). One click on
  "Resurrect" opens the archived copy.
- **Bulk link-rot report** — paste a list of URLs, or drop a browser
  bookmarks export (.html). Deadlink checks each one and builds a report:
  alive / dead / resurrected, with a Markdown copy.
- **The Cemetery** — every link you check gets a tombstone, stored only in
  your browser (localStorage), never sent anywhere. Filter by dead or alive.
- **Honest verdicts** — an inconclusive probe is reported as `unknown`,
  never as `dead`. Deadlink never calls a link dead unless the network
  genuinely fails.

**No accounts, no tracking, no server, no cost.** Vanilla JS, no build
step, keyless public APIs only (Wayback availability + CDX). Fully static —
it runs on GitHub Pages.

## How Kiro was used

Deadlink was built spec-first with Kiro (Kiroween 2026, Resurrection):

- **Spec-driven development** — before a line of app code was written, the
  project was specified Kiro-style: EARS requirements with acceptance
  criteria (`.kiro/specs/deadlink/requirements.md`), module architecture and
  data flows (`.kiro/specs/deadlink/design.md`), and an implementation
  checklist (`.kiro/specs/deadlink/tasks.md`). No feature lands without a
  requirement id and a task checkbox.
- **Steering docs** (`.kiro/steering/`) — product vision and principles,
  tech constraints (vanilla JS, no build step, keyless APIs only, no
  untrusted innerHTML), and repo conventions kept every session on-brief.
- **Agent hooks** — a test-on-change hook runs the Node test suite
  (`node --test tests/*.test.js`, 11/11 green) whenever library or app code
  changes, plus a spec-guard reminder that every change must map to a
  requirement.
- **Custom agent** — a QA agent (`.kiro/agents/deadlink-tester.md`) verifies
  the built app against the spec's acceptance criteria and reports PASS/FAIL
  with evidence.
- **Kiro CLI** — implementation sessions run through `kiro-cli`, working
  through `tasks.md` with the spec and steering docs as context. The `.kiro/`
  directory ships at the repo root so judges can inspect specs, hooks,
  steering, and agents directly.

The spec forced the two decisions that define the product: the honest-verdict
rule (inconclusive is `unknown`, never `dead`) and the no-proxy architecture
(the allorigins proxy proved unreliable, so the design uses only the no-cors
probe + Wayback APIs). Both came from writing requirements before code.

## Links

- **GitHub repo:** https://github.com/xomplex/deadlink
- **Live app:** https://xomplex.github.io/deadlink/
- **Demo video (<3 min):** https://youtube.com/shorts/RNn367yRAhA

## Category

Resurrection

## Built with

Kiro (spec-driven development, Kiro CLI, steering docs, hooks, custom agent),
Internet Archive Wayback Machine APIs (availability + CDX), vanilla JavaScript,
GitHub Pages.

---

## Submission checklist (before 5 Dec 2026, 05:00 WIB)

- [x] Public GitHub repo with `/.kiro` at root + OSI license (MIT)
- [x] Demo video recorded from the real app (<3 min)
- [x] GitHub Pages enabled + public app URL verified cold (HTTP 200, 20 Nov ~11:54 WIB)
- [x] Demo video uploaded to public YouTube, URL pasted above (20 Nov ~11:57 WIB)
- [ ] KIRO-WRITEUP.md finalized (how Kiro was used — finalize after build sessions)
- [ ] Devpost draft submitted
