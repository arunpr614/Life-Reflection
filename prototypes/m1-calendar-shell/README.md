# M1 — Calendar shell + month view

The question this prototype answers: how does a month of one person's life read as pictures, and what does the rail hold when almost everything it could hold doesn't exist yet? Three structurally distinct answers — **A (Contact Sheet)**, image-first and dense, cover fills the tile edge-to-edge; **B (Editorial)**, calmer, date sits above an inset cover card with a title beneath it; **C (Ledger)**, a corner-badge cover with the current week visually oriented against the rest of the grid — each pairs a different day-tile composition with a different answer to what the rail contains today.

Run (from `prototypes/`, not from inside this folder — the page loads shared files from `_shared/` next door, and Python's http server won't follow `..` above wherever it starts):

```sh
cd prototypes && python3 -m http.server 4173 --bind 127.0.0.1
```

Open <http://127.0.0.1:4173/m1-calendar-shell/?variant=a> (or `b` / `c`). Use the state selector (top-right) to reach Loading, First use, Single-day-populated, and Failed-to-load without navigating; every other state is reachable by clicking or by arrow-key/Enter on a day tile.
