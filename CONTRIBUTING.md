# Contributing to Life in Days

Life in Days is an owner-led personal project. Contributions are welcome as focused proposals, documentation corrections, or synthetic prototype improvements, but the repository does not represent a production application.

## Before opening a change

1. Read the [document index](docs/INDEX.md) and the source-precedence rules it contains.
2. Keep the MVP private and single-user. Do not add sharing, public links, reminders, AI coaching, or historical import without an explicit product decision.
3. Use fictional content only. Never add real journals, photos, identifiers, credentials, private URLs, provider responses, or photo-derived descriptions.
4. Describe planning, prototype, implementation, validation, deployment, and production states separately. Claim only what the linked evidence demonstrates.

## Frozen prototype versions

Prototype versions v6 through v10 have version-specific review and QA records. Changing a frozen HTML, JavaScript, CSS, guide, or evidence file invalidates any exact-hash disposition that covers it. Prefer a new consecutively numbered prototype version. If a frozen artifact truly must change, update the relevant council, handoff, tracker, and QA evidence and make the invalidation explicit.

## Local validation

The current prototype has no third-party runtime dependencies. Run its syntax check from the prototype directory:

```sh
cd prototypes/calendar-ui
npm run check:v10
```

If a change intentionally affects another historical version, run that version's matching `check:vN` command as well. These commands are syntax checks, not application, integration, accessibility, security, or production-readiness tests.

## Documentation changes

- Update [docs/INDEX.md](docs/INDEX.md) when adding or relocating a canonical document.
- Update requirements traceability and the project tracker when a requirement, gate, or status changes.
- Preserve direct decisions and source citations; do not silently resolve conflicts between documents.
- Keep relative links valid so both the repository and generated Wiki remain navigable.

## Pull requests

Keep each pull request focused. Explain the intended outcome, identify the authoritative requirement or decision, list the exact validation performed, and call out anything that remains unverified. A passing syntax workflow means only that the checked JavaScript parses.
