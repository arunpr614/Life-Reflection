# Palette comparison prototype

> **Throwaway. Not merged to main.** Fictional data only.

Two variants of the calendar month view, switchable via `?variant=A|B` and the floating
bottom bar (arrow keys also work):

- **A** — `UX-SPECIFICATION.md` §28.1: warm brown accent, blue focus ring, no persistent
  nav rail (top bar instead), per `WF-01`/`WF-02`.
- **B** — `reference/prototype-v10`: green accent, green focus ring, persistent 238px nav
  rail (`--rail-width: 238px`).

## Run

```sh
cd prototypes/palette-comparison && python3 -m http.server 4174 --bind 127.0.0.1
# then open http://127.0.0.1:4174/index.html
```

## Verdict

Not yet recorded. Once a variant (or a hybrid) is picked, note the answer here, fold the
winner into the real stylesheet, and drop this directory from `main` — it stays on this
branch (`prototype/palette-comparison`) as the primary source per the `prototype` skill.
