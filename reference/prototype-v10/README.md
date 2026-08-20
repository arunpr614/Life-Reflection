# Life in Days prototype v10 — Resilient Application Shell

> **Throwaway UI prototype · fictional data · browser-memory mutations · no integrations connected**

> [!NOTE]
> **Salvaged copy.** This is the v10 prototype carried into the post-reset repo as a *visual* reference only.
> Files were renamed (`index-v10.html` → `index.html`, `app-v10.js` → `app.js`, `styles-v10*.css` → `styles*.css`)
> and the asset links in `index.html` were updated to match. The "Run", "Review artifacts", and `../../`
> links below point at governance files that were **not** carried forward — they resolve only in the
> `archive/generation-0` branch / `gen0-final` tag. To run this copy, serve this directory statically:
>
> ```sh
> cd reference/prototype-v10 && python3 -m http.server 4173 --bind 127.0.0.1
> # then open http://127.0.0.1:4173/index.html?view=calendar&month=2026-08
> ```

V10 preserves the frozen v6 private Search, v7 Calendar, v8 Cross-month Almanac, and v9 First-use Readiness. It adds one stable package: `PVA-005 Resilient Application Shell`—a coordinated frontend state model for loading, scoped failures, interruption, unsaved work, session expiry, and explicit Retry.

Independent QA passed the exact six-file UI fingerprint recorded in [`../../design-qa-v10.md`](../../design-qa-v10.md), with 0 Critical, 0 High, 0 Medium, and 0 Low findings. Any byte change to those UI artifacts invalidates that disposition. No current file should be treated as production, integration, persistence, authentication, or formal accessibility-conformance evidence.

## Run

```sh
npm run check:v10
npm run prototype
```

Open [the v10 prototype](http://127.0.0.1:4173/index-v10.html?view=calendar&month=2026-08).

## V10 contract

- Reload defaults to the frozen v9 fictional first-use Calendar in the ready shell.
- `Prototype states` exposes deterministic, live-memory-only shell scenarios and never resembles production Settings.
- Initial loading and total server failure omit archive content rather than presenting stale or authoritative emptiness.
- Month failure keeps the last verified month, never displays old imagery beneath a pending month heading, and commits URL/history only after simulated success.
- Partial-media failure keeps the Journal Day and journals readable. Retry targets the same photo and never creates or substitutes media.
- Connection interruption is persistent and non-dismissible; settled content remains readable but explicitly may be stale, and reconnection never auto-saves.
- The bounded Correction exercise keeps its draft only in the open tab, confirms navigation away, and represents at most one simulated save after explicit Retry.
- Session expiry removes private archive DOM and returns only to a generic Calendar through an explicitly synthetic Cloudflare Access boundary.
- All delayed shell request and Retry operations use in-memory identities and ignore repeat activation or stale completion after navigation, fixture reset, or session expiry.

## Deliberate limits

V14 owns durable manual upload; v15–v16 own the actual Correction/conflict lifecycle; v23/v27 own provider failure; v24/v31/v32 own System Health, storage, backup, and recovery evidence; v34 owns full authentication/security disclosure. V10 adds no offline mode, queued write, automatic retry, fallback provider, credential field, deployment, durability, or production-readiness claim.

The permitted closure is: **The resilient application shell is prototype-represented with synthetic fixtures; connectivity, server behavior, authentication, persistence, and idempotency enforcement remain unverified.**

## Review artifacts

- Council: [`../../docs/prototypes/v10/COUNCIL-v10.md`](../../docs/prototypes/v10/COUNCIL-v10.md)
- Handoff: [`../../docs/prototypes/CALENDAR-UI-PROTOTYPE-v10.md`](../../docs/prototypes/CALENDAR-UI-PROTOTYPE-v10.md)
- QA: [`../../design-qa-v10.md`](../../design-qa-v10.md)
- Evidence: [`../../docs/prototypes/v10/`](../../docs/prototypes/v10/)
