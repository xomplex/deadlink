# Structure Steering — Deadlink

## Repo layout

```
.
├── index.html          # single-page app shell
├── styles.css          # graveyard theme, responsive, no framework
├── app.js              # UI wiring + state (thin)
├── lib/
│   ├── urls.js         # normalization, parsing lists/bookmarks HTML
│   ├── probe.js        # liveness probe (no-cors fetch)
│   ├── archive.js      # Wayback availability + CDX clients
│   └── cemetery.js     # localStorage graveyard + report formatting
├── tests/
│   └── urls.test.js    # node --test coverage for pure functions
├── .kiro/
│   ├── steering/       # product / tech / structure (this file)
│   ├── specs/deadlink/ # requirements.md, design.md, tasks.md
│   ├── hooks/          # agent hooks (test-on-save)
│   └── agents/         # custom agents (deadlink-tester)
├── README.md
├── KIRO-WRITEUP.md     # how Kiro was used (for judges)
├── BUILD-LOG.md        # dated build decisions
└── LICENSE             # MIT
```

## Conventions

- ES modules (`type="module"`), one module per concern, no bundler.
- All user-visible copy in English (submission language requirement);
  code comments in English.
- Spec-first: no feature lands without a requirement id in
  `.kiro/specs/deadlink/requirements.md` and a task checkbox in `tasks.md`.
- The `.kiro/` directory is never gitignored (Kiroween disqualification risk).
