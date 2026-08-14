# Life in Days

Life in Days is a proposed private, single-user visual memory archive that brings together textual VoiceNotes journals, Telegram photos, and manually uploaded `.txt` or `.md` journals as trustworthy, calendar-based Journal Days.

> [!IMPORTANT]
> This repository contains a planning baseline and throwaway static UI prototypes built with fictional data. It is not a working or deployed application. No integration, persistence, authentication, backup, recovery, accessibility-conformance, or production-readiness claim is made.

![Life in Days fictional calendar prototype](docs/prototypes/v7/calendar-landing-light-1280-v7.png)

## Product principles

- Authentic journals and photos remain distinct from AI-derived titles, summaries, tags, briefs, and artwork.
- Real photos and photo-derived data must never be sent to AI providers.
- Journal Dates use fixed `Asia/Kolkata` time while immutable original timestamps are preserved.
- The MVP is private and single-user, with no sharing, public links, reminders, coaching, or historical import.
- Backdating is deliberate and visible; receipt time is never silently treated as the Journal Date.

## Current status

| Area | Status |
| --- | --- |
| G0 planning baseline | Complete as a planning artifact |
| G1 shared-understanding confirmation | Blocked pending Arun's explicit confirmation |
| Latest frozen UI prototype | v10 Resilient Application Shell |
| Next prototype package | v11 Needs Date Review, queued |
| Product implementation and deployment | Not authorized or started |

The prototypes use browser-memory-only behavior and simulated states. They do not connect to VoiceNotes, Telegram, AI providers, storage, authentication, backup, or recovery systems.

## Start here

| Area | Document |
| --- | --- |
| Complete navigation | [Document index](docs/INDEX.md) |
| Product intent | [Proposed shared understanding](docs/discovery/SHARED-UNDERSTANDING.md) |
| Requirements | [Product Requirements Document](docs/product/PRODUCT-REQUIREMENTS.md) |
| Experience | [UX Specification](docs/design/UX-SPECIFICATION.md) |
| Architecture | [Implementation Plan](docs/architecture/IMPLEMENTATION-PLAN.md) |
| Delivery status | [Project Tracker](docs/project/PROJECT-TRACKER.md) |
| Prototype roadmap | [Prototype Completeness Tracker](docs/project/PROTOTYPE-COMPLETENESS-TRACKER.md) |
| Requirement coverage | [Requirements Traceability](docs/project/REQUIREMENTS-TRACEABILITY.md) |

The [project Wiki](https://github.com/arunpr614/Life-Reflection/wiki) mirrors every Markdown project artifact into reader-friendly pages. The version-controlled source documents and their stated precedence remain authoritative.

GitHub history begins with a sanitized snapshot of the current project files. Machine-local paths and pre-publication author metadata are intentionally excluded, while the local repository retains the earlier development history. Some documents preserve earlier commit identifiers as evidence labels; those identifiers may not resolve in the public repository. See [Publication provenance](PUBLICATION.md).

## Run the latest static prototype

Node.js is the only runtime requirement. No package installation, live service, or credential is used.

```sh
cd prototypes/calendar-ui
npm run check:v10
npm run prototype
```

Then open:

```text
http://127.0.0.1:4173/index-v10.html?view=calendar&month=2026-08
```

The root `/` route is the historical v1 prototype, so use the explicit v10 URL. See the [v10 run guide](prototypes/calendar-ui/README-v10.md) for its exact scope and evidence boundary.

## Repository map

- `docs/discovery/` — decisions, source research, and provider evaluation plans
- `docs/product/` — detailed product requirements
- `docs/design/` — experience and accessibility specification
- `docs/architecture/` — proposed implementation and operations plan
- `docs/project/` — gates, tasks, traceability, and prototype roadmap
- `docs/council/` — governance, role charters, and review records
- `docs/prototypes/` — versioned handoffs, council decisions, and screenshots
- `prototypes/calendar-ui/` — dependency-free static prototype versions
- `design-qa*.md` — bounded, version-specific prototype QA records
- `PUBLICATION.md` — public-snapshot scope and provenance

## Privacy boundary

The checked-in prototype media and journal content are fictional fixtures. Never commit real journals, photos, identifiers, credentials, provider responses, private URLs, or descriptions derived from private photos. See [Security](SECURITY.md) for private reporting instructions if sensitive material is exposed.

## Contributing

This is an owner-led personal project. Read [Contributing](CONTRIBUTING.md) before proposing a change, especially the synthetic-data and frozen-prototype rules.

## License

No open-source license has been selected. Copyright remains with the repository owner; the public repository does not by itself grant reuse rights.
