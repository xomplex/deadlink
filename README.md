# Deadlink — Resurrect the Dead Web

**The web forgets. Deadlink remembers.**

Deadlink is a free, client-side web app that finds dead links and brings them back to life through the Internet Archive's Wayback Machine. Paste a URL — or drop an entire exported bookmarks file — and Deadlink tells you what's dead, when it was last seen alive, and hands you the archived copy.

Built for **Kiroween 2026** (category: **Resurrection**) — a brand-new app, built with Kiro using spec-driven development.

## The problem

Link rot is real: studies of the web consistently find a large share of links die within a few years — old blog posts, citations, bookmarks, and references quietly 404. When a link dies, the knowledge behind it dies with it. The Wayback Machine has archived most of it — but nobody checks.

## What it does

- **Single link check** — paste any URL: Deadlink probes whether it still answers, finds its closest Wayback snapshot, and shows its full snapshot history (first seen, last seen, how many captures).
- **Resurrect** — one click opens the archived copy of a dead page.
- **Bulk link-rot report** — paste a list of URLs, or drop a browser bookmarks export (HTML). Deadlink checks each one and produces a report: alive / dead / resurrected.
- **The Cemetery** — every link you check gets a tombstone in your local graveyard (stored in your browser only), with epitaph, last-seen date, and resurrection link. No account, no tracking, no server.

## How it works (no keys, no server, no cost)

- Liveness probe: a CORS-safe `no-cors` fetch distinguishes "server answers" from "DNS/network dead".
- Archive data: the Internet Archive's free public APIs — availability (`archive.org/wayback/available`) and CDX snapshot index (`web.archive.org/cdx`). No API key, no account.
- Everything runs in the browser. The app is a static site — deployable on GitHub Pages for free.

## Run it locally

```bash
# any static server works, e.g.:
python3 -m http.server 8000
# then open http://localhost:8000
```

Or just open `index.html` in a browser (some features prefer http(s)).

## Tests

```bash
node --test tests/*.test.js
```

## How Kiro was used

This project was built spec-first with Kiro. See `.kiro/`:

- `.kiro/specs/deadlink/` — requirements (EARS-style), design, and the implementation task list Kiro worked through.
- `.kiro/steering/` — product, tech, and structure steering docs that kept every Kiro session on-brief.
- `.kiro/hooks/` — agent hooks (run the test suite whenever app code changes).
- `.kiro/agents/` — a custom Kiro agent (`deadlink-tester`) that validates the app against its own spec.

The full Kiro write-up for the judges lives in `KIRO-WRITEUP.md`.

## License

MIT — see `LICENSE`.
