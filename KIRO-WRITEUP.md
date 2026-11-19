# How Kiro Was Used — Deadlink (DRAFT, finalizes after Kiro CLI build sessions)

> Status: DRAFT 18 Nov 2026. The spec-first foundation below is done. The
> Kiro CLI build sessions (spec → tasks → implementation through `kiro-cli`)
> run after the entrant signs in to Kiro; this write-up will be updated with
> session transcripts and exact commands then. Nothing here claims Kiro did
> work it did not do.

## 1. Spec-driven development (Kiro spec workflow)

Before a line of app code was written, the project was specified Kiro-style:

- **Requirements** (`.kiro/specs/deadlink/requirements.md`) — EARS-style
  requirements with acceptance criteria: single-link check, snapshot timeline,
  bulk link-rot report, the Cemetery, honest presentation.
- **Design** (`.kiro/specs/deadlink/design.md`) — module architecture
  (`lib/urls.js`, `lib/probe.js`, `lib/archive.js`, `lib/cemetery.js`), data
  flows, error handling, testing strategy.
- **Tasks** (`.kiro/specs/deadlink/tasks.md`) — the implementation checklist
  the build works through, checkbox by checkbox. No feature lands without a
  requirement id and a task checkbox.

## 2. Steering docs

Three steering files kept every session on-brief (`.kiro/steering/`):

- `product.md` — vision, audience, five product principles (no keys/accounts/
  server; honest verdicts; resurrection is the point; judge-readable in 30s;
  spooky but legible) and v1 scope boundaries.
- `tech.md` — vanilla JS, no build step, keyless public APIs only, timeouts
  and error states, no untrusted `innerHTML`.
- `structure.md` — repo layout and conventions (ES modules, English copy,
  `.kiro/` never gitignored).

## 3. Agent hooks

`.kiro/hooks/test-on-change.json` — a hook that runs the Node test suite
(`node --test tests/*.test.js`) whenever library or app code changes, plus a
spec-guard reminder that every change must map to a requirement. The hook
caught a real failure during the build (a test expectation that misjudged URL
normalization) and the suite is green: 11/11 tests.

## 4. Custom agent

`.kiro/agents/deadlink-tester.md` — a QA agent that verifies the built app
against the spec's acceptance criteria (alive/dead/no-snapshot/bookmarks
cases, the honest-verdict rule) and reports PASS/FAIL with evidence.

## 5. Kiro CLI (the build engine)

- Kiro CLI 3.4.0 installed on the build machine (`kiro-cli --version`).
- Implementation sessions run as `kiro-cli chat --no-interactive
  --trust-all-tools --trust-workspace` inside the repo, working through
  `tasks.md` with the spec and steering docs as context.
- The `.kiro/` directory ships at the repo root (visible in the About
  section) so judges can see specs, hooks, steering, and agents directly.

## 6. What Kiro changed vs. vibe coding

The spec forced the honest-verdict rule (Requirement 1.4: an inconclusive
probe is `unknown`, never `dead`) and the no-proxy architecture (the
allorigins proxy proved unreliable, so the design uses only the no-cors probe
+ Wayback APIs). Both decisions came from writing requirements before code —
  the spec-first loop, not a single prompt.
