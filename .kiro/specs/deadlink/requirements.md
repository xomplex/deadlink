# Requirements — Deadlink (Kiroween 2026, category: Resurrection)

## Introduction

Deadlink resurrects dead links via the Internet Archive. A user pastes a URL
(or a set of URLs) and learns whether each link is alive, when it was last
seen alive, and — if dead — gets the closest archived copy. All client-side,
no keys, no server.

## Glossary

- **Link**: a single URL supplied by the user.
- **Verdict**: `alive` | `dead` | `unknown` (server answers but the browser
  cannot read the response) | `no-snapshot` (dead and no archive copy found).
- **Snapshot**: one Wayback Machine capture of a URL (timestamp, status code).
- **Tombstone**: a Cemetery entry for a checked link.
- **Cemetery**: the local (localStorage) collection of checked links.

## Requirements

### Requirement 1: Single-link check

**User Story:** As a reader, I want to paste one URL and learn whether it is
alive and, if not, see its archived copy, so that a dead link does not stop me.

#### Acceptance Criteria

1. WHEN the user submits a URL, THE Deadlink System SHALL normalize it
   (add `https://` when no scheme is present, trim whitespace) and display a
   verdict within 30 seconds.
2. WHEN the liveness probe receives any HTTP response, THE Deadlink System
   SHALL report the verdict `alive`.
3. WHEN the liveness probe fails with a network/DNS error, THE Deadlink System
   SHALL report the verdict `dead`.
4. WHEN the liveness probe result is inconclusive, THE Deadlink System SHALL
   report the verdict `unknown` and SHALL NOT present the link as dead.
5. WHEN a verdict is `dead`, THE Deadlink System SHALL query the Wayback
   availability API and display the closest snapshot link and timestamp.
6. WHEN no snapshot exists for a dead link, THE Deadlink System SHALL state
   clearly that no archived copy was found.

### Requirement 2: Snapshot timeline

**User Story:** As a researcher, I want to see a link's capture history, so
that I know when it was last alive and how much of it was preserved.

#### Acceptance Criteria

1. WHEN a link has snapshots, THE Deadlink System SHALL display first-seen
   date, last-seen date, and total capture count from the CDX index.
2. WHEN the CDX request fails, THE Deadlink System SHALL still show the
   availability result and a non-blocking error note.

### Requirement 3: Bulk link-rot report

**User Story:** As a blogger, I want to check many links at once, so that I
can find all the dead links on my site in one pass.

#### Acceptance Criteria

1. WHEN the user pastes a newline-separated list of URLs, THE Deadlink System
   SHALL check each URL and show per-link verdicts with progress.
2. WHEN the user drops a browser bookmarks export (HTML file), THE Deadlink
   System SHALL extract all links from it client-side and check them.
3. THE Deadlink System SHALL cap concurrent checks at 4 and SHALL enforce a
   per-URL timeout of 20 seconds.
4. WHEN the bulk check finishes, THE Deadlink System SHALL show a summary
   (counts by verdict) and a copyable Markdown report.

### Requirement 4: The Cemetery

**User Story:** As a bookmark hoarder, I want my checked links kept in a
graveyard, so that I can revisit dead links and their resurrections later.

#### Acceptance Criteria

1. WHEN a link is checked, THE Deadlink System SHALL store a tombstone in
   localStorage under the `deadlink:*` namespace.
2. WHEN the user opens the app, THE Deadlink System SHALL render stored
   tombstones with verdict, last-seen date, and resurrection link.
3. WHEN the user clears the Cemetery, THE Deadlink System SHALL remove all
   stored tombstones after confirmation.

### Requirement 5: Honest, readable presentation

**User Story:** As a judge, I want to understand the app in 30 seconds, so
that I can evaluate it without instructions.

#### Acceptance Criteria

1. THE Deadlink System SHALL present one input, one action, and one verdict
   on first screen with no onboarding.
2. THE Deadlink System SHALL NOT use copyrighted music, images, or trademarks.
3. THE Deadlink System SHALL work from a static file host with no build step.
