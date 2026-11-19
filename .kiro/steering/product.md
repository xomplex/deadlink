# Product Steering — Deadlink

## Vision

The web forgets. Deadlink remembers. A dead link should not mean dead knowledge:
every URL has a past, and the Wayback Machine kept most of it. Deadlink makes
resurrection a one-click act.

## Audience

- **Readers & researchers** hitting 404s in old articles, citations, and bibliographies.
- **Bloggers & maintainers** who want a link-rot report for their own site.
- **Bookmark hoarders** with years of saved links, many of them dead.

## Product principles

1. **No keys, no accounts, no server.** If a feature needs an API key or a
   backend, it is the wrong feature. Everything must work from a static page.
2. **Honest verdicts.** "Dead" means the server did not answer or DNS failed.
   "Unreachable from here" (CORS-blocked but responding) is reported as
   *unknown*, never as dead. A link is only declared dead on evidence.
3. **Resurrection is the point.** Every dead link must end with a working
   archived copy, or a clear statement that no snapshot exists.
4. **Judge-readable in 30 seconds.** First screen: one input, one button, one
   verdict. No onboarding, no tutorial.
5. **Spooky but legible.** Graveyard theme (tombstones, fog, epitaphs) must
   never hurt readability or usability. Dark background, bone-white text,
   ectoplasm-green accents.

## Scope boundaries (v1)

- IN: single-link check, bulk paste list, bookmarks-HTML drop, snapshot
  timeline, cemetery (localStorage), link-rot report export (copy/markdown).
- OUT: user accounts, server-side crawling, auto-fixing other people's pages,
  paid APIs, browser extension, mobile app.
