# M0.1 — Hosting alternatives: deep research

_Written 2026-08-21 on branch `spike/m0.1-hosting-research` (worktree `Life-in-Days-spike-m0.1`). Answers issue #322 (hosting-alternatives survey) and supplies the evidence #324 (stay-or-move decision) needs. Companion to `docs/M0.1-HOST-INVENTORY.md` (#316), which measured the current host._

**Oracle Cloud is excluded from this survey at the owner's instruction.** It is not compared, priced, or recommended anywhere below.

---

## 1. The answer, up front

**The single most cost-effective option is: stay on the existing Hetzner host and put the photo bytes in Cloudflare R2.** Incremental cost **$0.25–$0.55/month**, no architecture change, nothing else on the roadmap moves.

**But that is only the cheapest answer, not the best one**, and the reason is a number that no prior document in this project has stated: the current host has **22 GB of free disk**, and a 14-year daily-photo archive is **26–52 GB**. The archive does not fit. R2 is what makes "stay" viable at all — it is not an optimisation, it is the load-bearing part.

Three defensible choices, depending on what you are optimising:

| If you want… | Choose | Incremental $/mo | What it costs you |
|---|---|---|---|
| **Lowest cost, zero disruption** | Stay on the shared host + R2 for media | **$0.25–0.55** | The three-tenant coexistence risk stays unmeasured (#319 is cancelled) |
| **Best value, risk removed, biggest disk** | **Netcup VPS 500 G12** — 2 vCPU / 4 GB DDR5 ECC / **128 GB NVMe** | **$5.40–6.40** | 12-month commitment; a second box to operate |
| **Genuinely $0/month recurring** | Home box (Pi/old laptop) + Cloudflare Tunnel | **~$0.30–1.20** (electricity) | The only live copy moves into your house; uptime = your power + ISP |

**And one number that outranks all the pricing:** you are in **Bengaluru**; the current host is in **Helsinki**, measured at **176.8 ms RTT**. DigitalOcean Bangalore answers in **7.1 ms** and Singapore in **42.7 ms** from the same connection. That is a 25× difference in origin round-trip, and it is the only thing on this page you would actually *feel* every day.

Full reasoning follows. §11 is an explicit ledger of what I verified live versus what I could not.

---

## 2. The baseline, measured rather than assumed

Every prior document in this repo describes reuse of the Hetzner host as "zero incremental hosting cost" and, since this session, as "$10/month". Neither statement identifies the machine. It is:

| Property | Measured value | How |
|---|---|---|
| Region / datacenter | `eu-central` / **`hel1-dc2`** (Helsinki, Finland) | Hetzner metadata service |
| Instance ID | `130950725` | Hetzner metadata service |
| Architecture | x86_64, KVM guest | `lscpu` |
| CPU | **2 vCPU, AMD EPYC-Rome** (shared) | `lscpu` |
| RAM | **3819 MB** (nominal 4 GB) | `free -m` |
| Swap | **0** | `free -m` |
| Disk | **38.1 GB** total (`sda1` 37.9 GB on `/`) | `lsblk` |
| Disk free | **22 GB** (39% used) | `df -h /` |
| IPv6 | `2a01:4f9:c015:250b::/64` assigned | metadata `network-config` |
| RTT from Bengaluru | **174.3 / 176.8 / 180.7 ms** (min/avg/max), 0% loss, 8 packets | `ping` from the dev machine |
| Tenants | **3** — `brain.service`, `hackathon-review.service`, `cloudflared` | `docs/M0.1-HOST-INVENTORY.md` §3 |

**Plan identification.** 2 shared AMD vCPU + 4 GB + ~40 GB NVMe in HEL1 is the **CX22 shape** — the previous generation of Hetzner's Cost-Optimized x86 line, whose current equivalent is CX23. The hostname `ubuntu-4gb-hel1-1` agrees.

**A cost discrepancy worth resolving before deciding anything.** At 2026 list prices a CX23 (the direct successor, same shape) is **€5.49 / $6.49 per month**, plus **€0.50 / $0.60** for the IPv4 address = **€5.99 / $7.09**. Adding Hetzner's automatic Backups option (+20%) brings it to about **$8.51**. The owner-stated figure is **$10/month**. The gap is not large, but it is not explained by the plan either — the difference is roughly the cost of another small resource on the same account. **Before treating $10/month as the baseline, check the actual Hetzner invoice**: if there is a forgotten volume, snapshot set, second server, or Storage Box on the account, that is found money and it changes the comparison. If the invoice really is $10 for this machine alone, then §7 scenario D (upgrade in place to 8 GB / 80 GB for **$10.59**) is very nearly free.

---

## 3. What Life in Days actually needs — the filter the market has to pass

These come from `reference/PRODUCT-REQUIREMENTS.md`, `docs/IMPLEMENTATION-PLAN.md`, and `docs/IMPLEMENTATION-PLAN-POST-M6.md`. They are what disqualify most of the cheap and free options, so they belong before the price tables, not after.

1. **A persistent, writable local filesystem.** The design is `better-sqlite3` against a single SQLite file in WAL mode, with an FTS5 index (M7). This is a *native* module and a *stateful* file. Any platform with an ephemeral filesystem is out, not "worse" — out.
2. **A long-lived process, plus scheduled jobs.** `systemd` timers or an in-process scheduler (the M10 ADR decides which). Request-scoped serverless functions cannot host a 6-hourly reconciliation job against local state.
3. **CPU burst for image work.** `sharp`/libvips for derivative generation at ingest. Not heavy, but not 0.25 of a vCPU either.
4. **Room for the photo bytes.** See §4. This is the constraint everything else bends around.
5. **Private by default.** No public object URLs; media served through authenticated same-origin app routes (`LID-OPS-007` explicitly forbids public `r2.dev`). An auth layer in front of everything.
6. **Independent encrypted off-site backup.** Restic → Backblaze B2, application-layer encryption, rehearsed restore (M14/M15). The live store and the recovery store must not share a failure domain.
7. **Best-effort availability, honestly stated.** `LID-OPS-018` explicitly promises **no HA and no SLA**. This is unusually permissive and it legitimately opens doors — including a machine in your own house — that a commercial product could not consider.
8. **A hosting bill that does not eat the $5/month AI ceiling.** `LID-OPS-017` is explicit that server, backup and live-storage costs are tracked separately and "never consume or expand the AI ceiling". So hosting spend is not capped at $5 — but it is visible, and cheaper is better.

Requirements 1, 2 and 3 together mean: **this is a VPS-shaped product, not an edge-shaped one** — unless you change the product (§9.1).

---

## 4. Storage sizing — the number that decides the question

Nobody has sized this archive. Doing it changes the answer, so here is the arithmetic, with the assumptions exposed.

**14 years ≈ 5,114 days.** One Daily Photo per day at most, one journal entry per day, at most one AI artwork per day.

| Component | Per day | 5,114 days | Notes |
|---|---|---|---|
| Photo originals — conservative (2.5 MB avg) | 2.5 MB | **12.8 GB** | early-2010s phone JPEGs dominate |
| Photo originals — central (4.5 MB avg) | 4.5 MB | **23.0 GB** | realistic 2012–2026 mix |
| Photo originals — heavy (8 MB avg) | 8 MB | **40.9 GB** | if recent 12–48 MP shots dominate |
| Derivatives (320w ≈ 30 KB + 640w ≈ 90 KB + 1600w ≈ 350 KB) | ~0.5 MB | **2.6 GB** | regenerable, so not backup-critical |
| Journal text (≈500 words/day ≈ 3 KB) | 3 KB | **15 MB** | |
| SQLite + FTS5 index + metadata | — | **≤ 250 MB** | text is *nothing* at this scale |
| AI artwork (WebP ≈ 400 KB) | 400 KB | **2.0 GB** | accrues slowly — bounded by the $4.50/mo artwork allocation, not by day count |

**Totals: ~26 GB (central) to ~44 GB (heavy) live, growing 1.8–3.3 GB/year.** Add the artwork tail and plan for **30–52 GB** within a couple of years.

Three consequences:

- **The current host cannot hold it.** 22 GB free, against a 26–44 GB archive, on a disk that also carries an **uncapped journald (1.6 GB)** and AI Brain's backup directory (**791 MB, four snapshots/day, growing**) — see `M0.1-HOST-INVENTORY.md` §10. Even the conservative 12.8 GB case leaves under 10 GB of headroom for the only copy of something irreplaceable. **Disk, not RAM, is the binding constraint on the shared host.** The prior session's whole framing — "can 4 GB of RAM hold three tenants?" — was aimed at the wrong resource.
- **Text hosting is free, in effect.** The searchable corpus of 14 years of journals is a few hundred megabytes including the FTS5 index. Any option on this page can host the *journal*. What costs money is the *photographs*.
- **Therefore the real question is not "which server" but "where do the photo bytes live?"** Once you answer that, the compute can be tiny and cheap — which is exactly what makes "stay put" survive.

---

## 5. The market, priced

Prices captured **2026-08-21**. Hetzner figures come from its own public price API (`https://website-price-api.hetzner.com/api/v1/products/<KEY>`), which returns per-datacenter EUR and USD and an `active` flag — see §11 on why the rendered web page disagrees.

### 5.1 VPS — compute with a real filesystem

| Provider / plan | vCPU | RAM | Disk | Traffic | Price | Locations | Notes |
|---|---|---|---|---|---|---|---|
| **Hetzner CX23** | 2 (Intel/AMD, shared) | 4 GB | 40 GB NVMe | 20 TB | **€5.49 / $6.49** (+ €0.50/$0.60 IPv4 = **$7.09**) | NBG1, HEL1, FSN1 | Direct successor to the current machine |
| **Hetzner CAX11** | 2 (Ampere Arm) | 4 GB | 40 GB NVMe | 20 TB | **€5.99 / $6.99** (+IPv4 = **$7.59**) | NBG1, HEL1, FSN1 | arm64; `sharp` + `better-sqlite3` both ship arm64 prebuilds |
| **Hetzner CX33** | 4 | 8 GB | 80 GB NVMe | 20 TB | **€8.49 / $9.99** (+IPv4 = **$10.59**) | NBG1, HEL1, FSN1 | 2× RAM and 2× disk for ≈ the stated current bill |
| **Hetzner CX43** | 8 | 16 GB | 160 GB NVMe | 20 TB | **€15.99** (+IPv4 = €16.49) | NBG1, HEL1, FSN1 | |
| **Hetzner CPX12** | 1 (AMD, dedicated) | 2 GB | 40 GB | 20 TB EU / **1 TB SIN** | **€11.49 / $13.49** EU; **€15.49 / $17.99 SIN1** | EU + Singapore | Dedicated vCPU costs ~2× shared; Singapore adds ~33% |
| **Netcup VPS 500 G12** | 2 (x86) | 4 GB **DDR5 ECC** | **128 GB NVMe** | included | **€5.91 incl. 19% VAT / €4.97 ex-VAT** (≈ **$5.40–6.40**) | Vienna, Nuremberg, Amsterdam, **Singapore**, US | 12-month term (or hourly). **Best disk-per-euro from a reputable EU host.** |
| **Netcup VPS 1000 G12** | 4 | 8 GB DDR5 ECC | 256 GB NVMe | included | €10.37 incl. VAT / €8.71 ex-VAT | same | |
| **Contabo Cloud VPS 4** | 4 | 8 GB | 100 GB SSD | "unlimited" (fair use) | **€6.60 incl. VAT** (≈ $7.20) — *24-month term* | EU, UK, US, **India**, Singapore, Japan, AU | Most raw specs per euro anywhere. Long commitment; well-documented reputation for slow provisioning and variable IO |
| **DigitalOcean Basic** | 1 | 2 GB | 50 GB | 2 TB | **$12.00** | incl. **Bangalore**, Singapore | ~2× Hetzner for less machine. Its merit is location |
| **DigitalOcean Basic** | 1 | 1 GB | 25 GB | 1 TB | **$6.00** | incl. Bangalore | 25 GB disk fails §4 |
| **Fly.io** shared-cpu-1x 1 GB | 1 shared | 1 GB | volumes **$0.15/GB-mo** | egress metered | **$5.92** AMS / $7.45 SIN / **$9.20 BOM** + $7.50 for 50 GB volume | many, incl. Mumbai | **$13.42–16.70/mo** realistically. Egress **$0.12/GB to India** — punitive for a photo archive |
| **Hostinger KVM 1** | 1 | 4 GB | 50 GB NVMe | 4 TB | **$6.49 promo (2-year prepay) → $11.99 renewal** | NA/EU/Asia (India unconfirmed) | The renewal cliff is the whole story |
| **IONOS VPS M+** | 4 | 4 GB | 120 GB NVMe | unlimited | **$4 for 3 months → $11.00** | US, UK, DE, ES | Promo pricing only; no Asian region |
| **RackNerd** | — | — | — | — | *not priced* | — | Site blocked HTTP 500/403 this session. Annual-prepay micro-VPS. **Do not put the only copy of an irreplaceable archive on an unpriced, unverified, no-SLA budget host** — the saving is single-digit dollars per year |
| **Vultr** | — | — | — | — | *not priced* | incl. Bangalore, Mumbai, Delhi | Pricing page returned 403. Comparable to DigitalOcean; has more Indian regions |

### 5.2 Object storage — where the photo bytes should live

| Option | Free tier | Storage | Egress | Operations | Verdict at 30–50 GB |
|---|---|---|---|---|---|
| **Cloudflare R2 Standard** | **10 GB-mo**, 1 M Class A, 10 M Class B | **$0.015/GB-mo** | **$0 — free, always** | $4.50/M Class A, $0.36/M Class B | **$0.30–0.60/mo. Winner.** Free egress removes the entire class of "browsing my own archive costs money" risk |
| R2 Infrequent Access | — (free tier is Standard-only) | $0.010/GB-mo | $0 | $9.00/M A, $0.90/M B, + $0.01/GB retrieval | **30-day minimum retention.** Not worth it at this size |
| **Backblaze B2** | **10 GB** free | **$6.95/TB-mo = $0.00695/GB-mo** | free up to **3× average monthly stored**, then $0.01/GB | Class A/B/C free; Class D $0.004/10k (2,500/day free) | **$0.14–0.28/mo.** Cheapest storage, but the 3× egress cap makes it a *backup* target, not a live media origin. **This is what Restic should point at (M14).** No minimum retention |
| **Hetzner Storage Box BX11** | — | **1 TB for €3.20 / $4.00/mo** | unlimited | n/a | Flat-fee, unbeatable per-TB, but SFTP/SMB/WebDAV — not an HTTP origin. **Excellent alternative Restic target**; at 50 GB, B2 is 20× cheaper |
| Hetzner Storage Box BX21 / BX31 / BX41 | — | 5 TB €10.90/$13.00 · 10 TB €20.80/$24.00 · 20 TB €40.60/$46.00 | unlimited | n/a | Oversized for this |
| **Hetzner Object Storage** | — | **€6.49 / $7.99 per month base**, includes 1 TB storage + 1 TB egress | 1 TB included | S3-compatible | EU-only. The **flat €6.49 floor** loses badly to R2's $0.45 at 30 GB |
| Hetzner Cloud Volume | — | *price not verified this session* (10 GB–10 TB, 1 GB increments) | n/a | n/a | **Verified caveat: volumes are excluded from Hetzner Backups and Snapshots.** So a volume needs its own backup path anyway — at which point R2 is simpler |

**The decisive fact in this table is R2's free egress.** A journal you browse is a read-heavy workload over large binaries. On any metered-egress provider, *using* the archive costs money, which creates a quiet incentive not to use it. R2 removes that incentive permanently. Everything else here is a rounding error at 30–50 GB.

### 5.3 Free tiers, assessed honestly

| Option | Genuinely free? | Fatal problem for this product |
|---|---|---|
| **Cloudflare Pages + R2 + Workers + Access** | **Yes, ~$0** (+ $0.30–0.60 R2 above 10 GB) | **Not a fatal problem — a different architecture.** See §9.1 |
| **Home box + Cloudflare Tunnel** | **Yes** — electricity only | Availability tracks your house. See §9.2 |
| Google Cloud Always Free (e2-micro) | Technically yes, indefinitely | **Three independent disqualifiers**: (a) **30 GB-months** of standard persistent disk — cannot hold §4's archive; (b) **1 GB/month egress** from North America — a single afternoon of scrolling photos exceeds the monthly allowance for the whole account; (c) **us-west1 / us-central1 / us-east1 only** — US-only, so ~230–280 ms from Bengaluru, materially *worse* than the 177 ms you have. e2-micro is also 0.25 vCPU burst / 1 GB RAM, which `sharp` will thrash. **Reject** |
| Render free web service | Yes, with limits | **No persistent disks on the free plan** — the filesystem is ephemeral, so SQLite is impossible. Also spins down after **15 minutes idle** with a **~1 minute** cold start, **750 instance-hours** per workspace per month, and free Postgres **expires 30 days after creation** (1 GB, no backups). **Reject** |
| Koyeb | **No free tier** | Lowest plan is **Pro at $29/month** (+$10 included compute). Only a "Free 5h" Postgres trial. **Reject** |
| AWS Free Tier | **No longer** | Changed to credits: **$100 immediately + up to $100 more**, and the **account closes 6 months after opening or when credits run out**. That is a 6-month trial, not a home for a 14-year archive. **Reject as a permanent host** |
| Fly.io | **No** | No free compute allowance today; pay-as-you-go from the first hour |
| Railway / Heroku / similar PaaS | No | No usable free always-on tier with a persistent disk |

**A note on how to read "free".** Every free tier here that offers a real filesystem does so in a US region with a metered egress cap in the single-gigabyte range. That combination is fine for a demo and hostile to a photo archive. The two options that genuinely work (§9.1, §9.2) both work by *avoiding* the free-VPS category entirely: one moves the bytes to R2 and the compute to the edge, the other moves the whole machine into your house.

---

## 6. Latency — the difference you would actually feel

Measured from the dev machine (Bengaluru, Tata Play Broadband, AS134674) on 2026-08-21:

| Target | Avg RTT | vs today |
|---|---|---|
| **Current host, Helsinki (`hel1-dc2`)** | **176.8 ms** | baseline |
| DigitalOcean **Bangalore** (`blr1`) | **7.1 ms** | **−170 ms (25× better)** |
| DigitalOcean **Singapore** (`sgp1`) | **42.7 ms** | −134 ms (4× better) |

This was absent from the parallel survey on `spike/m0.1-host-limits`, and it matters more than any price on this page.

**Read it correctly, though.** Cloudflare Tunnel means the browser's TLS handshake terminates at a Cloudflare edge PoP in India (single-digit ms), and only the *origin fetch* crosses to Helsinki. So:

- **Static and cached assets** — photos, CSS, JS — are already fast, and would not improve much by moving.
- **Dynamic HTML** — every day-page render, every search — pays the full origin RTT. Today that is a floor of **~180–200 ms TTFB** before the server does any work. From Bangalore it would be **~20–30 ms**.

For a single-user archive you navigate by keyboard, day after day, that is the difference between "instant" and "there's a beat". It is not a correctness problem, and `LID-OPS-018` promises nothing about it. But if you ever move hosts for any reason, **moving to an Indian or Singaporean region is free upside** — Netcup has Singapore, Contabo has India and Singapore, DigitalOcean and Vultr have Bangalore, Fly has Mumbai. **Hetzner's only Asian region is Singapore, and it carries a ~33% price premium and drops included traffic from 20 TB to 1 TB (overage €7.40/TB versus €1.00/TB in the EU).** Hetzner's Cost-Optimized line (CX/CAX) is **EU-only** — so the cheap Hetzner plans and the low-latency Hetzner region are mutually exclusive.

---

## 7. Scenarios, costed end to end

Monthly USD. "Incremental" means on top of the existing $10/month, which is already being paid regardless.

| # | Scenario | Compute | Live media | Backup | **Incremental** | **All-in** |
|---|---|---|---|---|---|---|
| **A** | **Stay on shared host + R2 for media** | $0 | R2 30 GB: **$0.30** / 50 GB: $0.60 | B2 Restic ~$0.15 | **$0.25–0.55** | **~$10.30–10.55** |
| B | Stay + Hetzner Storage Box BX11 as media store | $0 | $4.00 (1 TB) | included in the same box (**same DC — weak isolation**) | $4.00 | $14.00 |
| C | Stay + Hetzner Cloud Volume (~50 GB) | $0 | volume price unverified | must be backed up separately (**volumes excluded from Hetzner backups**) | ~$2.50 (est.) | ~$12.50 |
| **D** | **Upgrade in place to CX33** (4 vCPU / 8 GB / 80 GB) + R2 | **$10.59 replaces $10.00** | R2 $0.30 | B2 $0.15 | **~$1.05** | **~$11.05** |
| E | New dedicated Hetzner CX23 for Life in Days + R2 | $7.09 | $0.30 | $0.15 | **$7.54** | $17.54 |
| E′ | Same on CAX11 (Arm) | $7.59 | $0.30 | $0.15 | $8.04 | $18.04 |
| **F** | **Move everything to Netcup VPS 500 G12** (128 GB) | **$5.40–6.40** | $0 — fits on local disk | B2 $0.15 | replaces the $10 host entirely | **$5.55–6.55** |
| G | Move everything to Contabo VPS 4 (India, 100 GB) | ~$7.20 (24-mo term) | $0 — fits locally | B2 $0.15 | replaces the $10 host | ~$7.35 |
| H | DigitalOcean Bangalore 2 GB / 50 GB + R2 | $12.00 | $0.30 | $0.15 | — | $12.45 |
| I | Fly.io 1 GB Amsterdam + 50 GB volume | $13.42 | included | B2 $0.15 | — | $13.57 |
| **J** | **Cloudflare Pages + R2 + Workers + Access** | **$0** | R2 $0.30 | B2 $0.15 | — | **~$0.45** |
| **K** | **Home box + Cloudflare Tunnel + R2/B2** | **$0.30–1.20** electricity | local disk, $0 | B2 $0.15 | replaces the $10 host | **~$0.45–1.35** |
| L | GCP Always Free e2-micro | $0 | — | — | — | **Not viable — see §5.3** |

Notes on the arithmetic:

- **F is the cheapest option that keeps the planned architecture intact.** €5.91/month including 19% German VAT is €4.97 ex-VAT; as a customer in India, EU VAT should not apply — **confirm at checkout**, because the difference is ~$1/month.
- **F also eliminates the coexistence problem for free**, because Life in Days would have its own machine. Every risk in `IMPLEMENTATION-PLAN-POST-M6.md` §7.8 — the shared 4 GB, the zero swap, AI Brain's tmpfs-staged backup that fails closed if `/run` is squeezed — becomes moot rather than mitigated.
- **F's 128 GB is the quiet win.** It is 3× the archive with room to grow for a decade, which means `LID-OPS-007`'s R2 migration stops being schedule pressure and becomes a considered choice you make later, on your terms.
- **D is worth a serious look if the $10 invoice is real.** 2× RAM and 2× disk for about a dollar more than you already pay, no migration, no new machine, the three tenants stop competing over 4 GB. Its ceiling is 80 GB, which is fine but not generous, and it keeps you in Helsinki at 177 ms.
- **B and C look cheap and are traps.** Storage Box lives in the same datacenter, so it is a poor *independent* recovery target (`LID-OPS-007`, M14). Cloud Volumes are **verifiably excluded from Hetzner Backups and Snapshots**, so they need a backup path of their own — and once you are building that anyway, R2 is less machinery for less money.

---

## 8. Recommendation

**Do this now (this week, no commitment, reversible):**

1. **Check the Hetzner invoice.** Reconcile the owner-stated $10/month against the CX22-class machine described in §2. This is a five-minute lookup that could find $3–5/month of forgotten resources and it changes which row of §7 wins.
2. **Cap journald.** `SystemMaxUse=200M` in `journald.conf` reclaims ~1.4 GB of the 22 GB free — the cheapest disk you will ever buy, and it protects the two products already running. (Config change on the shared host — needs the owner's go-ahead per the standing rule.)
3. **Create the R2 bucket and prove the round trip** before committing to any host. It is free below 10 GB, so this costs nothing and de-risks the storage-neutral media layer that `LID-OPS-007` requires from the outset.

**Then choose between two, and only two:**

**→ Scenario A (stay + R2), if you want to keep momentum.** $0.25–0.55/month incremental. Nothing on the M1–M6 roadmap changes. You accept that the three-tenant question stays unmeasured, because #319 is cancelled — and that acceptance is more defensible than it was before this survey, for a specific reason: `M0.1-HOST-INVENTORY.md` §6 already has **nine days of `sar` history** showing real peaks of 9.4% CPU (of 2 vCPU), 431 MB of 3.7 GB memory, load 0.34, and **memory PSI flat at 0.00 over 74 days**. The host is not close to a memory wall. Its exposure is *disk*, and R2 is precisely what takes the archive off that disk.

**→ Scenario F (Netcup VPS 500 G12), if you would rather delete the risk than measure it.** ~$5.40–6.40/month — **less than you pay today** — for 2 vCPU, 4 GB of DDR5 ECC, and **128 GB of NVMe**. It buys, in one move: the entire archive on local disk with 3× headroom, a machine that is yours alone so nothing Life in Days does can touch AI Brain, ECC memory on a host with no swap, and an optional Singapore region that cuts 134 ms off every dynamic page. It costs a 12-month commitment and a second box to operate — and the second box is temporary, because AI Brain's host can shrink or the two can consolidate later.

**My recommendation is F.** A eliminates spend that was never the problem; F eliminates the constraint that is. The disk ceiling in §4 is not a risk you can mitigate on 22 GB of shared root filesystem — it is arithmetic. And F costs *less* than the status quo.

**Do not** move to RackNerd, Hostinger, or IONOS. The first is unverifiable, and the other two are promotional prices with renewal cliffs of 1.8× and 2.75×. You would be optimising a $5/month line item and paying for it with the durability of an irreplaceable archive.

---

## 9. The free options, in full

### 9.1 Cloudflare Pages + R2 + Workers + Access — ~$0.45/month, and a different product

This is the cheapest thing that could possibly work, and it works by giving up the server.

**Shape.** The archive is *read-mostly*: 5,114 days that never change once written, plus a thin capture path. So pre-render every day page to static HTML at build time, put it on Pages, put the photos in R2, put a Worker in front for authenticated media access, and let the browser do search against a prebuilt SQLite FTS5 index fetched over HTTP range requests (`sql.js-httpvfs` / `wa-sqlite` — a well-trodden pattern; a 60 MB index is comfortably queryable this way).

**Verified limits and how they land:**

| Limit (verified) | Value | Consequence |
|---|---|---|
| Pages files per deployment | **20,000** | **A wall you would hit.** 5,114 days × (1 HTML + 3 derivatives) ≈ 20,500 files. So derivatives *must* go to R2, not Pages. HTML alone (~5,200 files) fits comfortably |
| Pages max file size | **25 MiB** | Fine for HTML; irrelevant once media is in R2 |
| Pages builds/month | **500** | ~16/day. Fine for a personal archive; a per-entry rebuild habit could strain it |
| Pages concurrent builds | 1 | Fine |
| Pages custom domains | 100 | Fine |
| Workers free requests | **100,000/day** | Ample for one user |
| Workers free CPU | **10 ms per invocation** | **Enough to proxy R2, not enough to run FTS5 server-side.** This is what forces search into the browser |
| Workers paid, if needed | $5/mo, 10 M requests, 30 M CPU-ms | The escape hatch |
| R2 | 10 GB free, then $0.015/GB, **egress free** | $0.30–0.60/mo at §4's sizing |
| Cloudflare Access | Free plan exists; supports self-hosted apps, SAML/OIDC, GitHub/Google/Entra, and **one-time PIN by email** | **Seat count on the free plan not verified this session** (commonly documented as 50). For one user, any of these works |

**What you give up — and it is not small.** No `systemd` timers (Cron Triggers instead — free, but a different execution model). No `better-sqlite3`, so no server-side writes to SQLite; capture becomes either "write to D1/R2 from a Worker" or "edit locally and redeploy". No `sharp` on the server — derivatives get generated on your laptop at ingest. The Telegram webhook and the VoiceNotes reconciliation job (M9) would both need rewriting against edge primitives. **M1–M6 as planned assume Fastify + local SQLite + timers; this replaces all three.** It is not a hosting change, it is a rewrite — which is exactly why the parallel survey's framing of Workers/D1 as a "hosting alternative" is misleading.

**Verdict:** the correct choice if you ever decide the archive should outlive your willingness to operate a server. Wrong choice today, because the plan is written and the saving over Scenario F is about $6/month.

### 9.2 Home box + Cloudflare Tunnel — the only genuinely free option that keeps the architecture

Run the exact planned stack — Node 22, Fastify, `better-sqlite3`, FTS5, `sharp`, `systemd` timers — on any always-on machine in your house. Expose it *only* through `cloudflared`, which makes outbound connections: **no port forwarding, no public IP, no inbound firewall rule, no change to your router.** Cloudflare Access in front for auth. Restic → B2 for the encrypted off-site copy.

| Item | Cost |
|---|---|
| Hardware | **$0** if you have a retired laptop or mini-PC; ~$80–120 for a Raspberry Pi 5 (8 GB) + NVMe hat, one-time |
| Electricity | Pi 5 idle ≈ 4 W → ~35 kWh/yr → **~$0.30/month** at ₹8/kWh. A laptop ≈ 15 W → **~$1.20/month** |
| Cloudflare Tunnel + Access | **$0** |
| B2 Restic (30 GB, first 10 GB free) | **~$0.15/month** |
| **Total recurring** | **~$0.45–1.35/month** |

**Why it is more defensible here than it would be for most products:** `LID-OPS-018` already promises **no HA and no SLA**, and the single user is the owner. A host that is down while the power is out is a contract you have already written down.

**What you give up:** availability tracks your home power and your ISP. More importantly, **the only live copy moves into your house**, which promotes the encrypted off-site Restic copy from belt-and-braces to load-bearing — so M14/M15 (backup and rehearsed restore) stop being late-milestone hygiene and become prerequisites. Also: a Pi 5 is arm64, so the `better-sqlite3`/`sharp` build story gains an architecture (both ship arm64 prebuilds; it is a real but small cost).

**Verdict:** a genuinely good option, and the only free one that does not require rewriting the product. Weigh it against Scenario F's ~$6/month, which buys ECC memory, a datacenter UPS, and someone else's uptime.

---

## 10. Risks, and what would change the answer

| Risk / open question | Effect on the recommendation |
|---|---|
| **The $10/month is not just this machine.** | If the invoice shows extra resources, Scenario D (upgrade in place, $10.59) becomes nearly free and beats F on effort. **Check the invoice first.** |
| **Photo sizing is an estimate, not a measurement.** | §4's 26–52 GB range comes from assumed average file sizes. If the real archive is 8 GB, the disk constraint softens and Scenario A wins outright. **Measure the actual photo corpus** — it is a `du -sh` away and it is the highest-value unknown on this page. |
| **Netcup's 12-month term.** | If you might consolidate hosts within a year, the commitment is a real cost. Netcup also offers hourly billing at €0.010/h (≈ €7.30/mo) — more expensive, but no lock-in for a trial month. |
| **VAT treatment for an Indian customer.** | Assumed non-applicable (non-EU customer). Unverified. Worth ~$1/month on Netcup, ~$1.05 on Contabo. |
| **Arm vs x86 (CAX11, Raspberry Pi).** | `better-sqlite3` and `sharp` both publish arm64 prebuilds, but `IMPLEMENTATION-PLAN.md` §8.4 already warns about native ABI pain on this host. Adding an architecture adds a failure mode. Prefer x86 unless there is a reason. |
| **#319 is cancelled, so the coexistence question stays open.** | This survey does not close it — it *routes around* it. Scenario F removes the question; Scenario A accepts it on the strength of the 74-day PSI and 9-day `sar` evidence in `M0.1-HOST-INVENTORY.md` §6. Either is defensible; pretending the question was answered is not. |
| **The shared host currently has a failing unit.** | `brain-processing-audit.service` has failed every 6 hours since 2026-08-19 — root-caused in `SHARED-HOST-AUDIT-FAILURE-2026-08-21.md` in this folder. It is AI Brain's problem, not Life in Days'. But it is evidence about the operational reality of the shared host, and it should be fixed before anything new is added to that machine. |

---

## 11. Verification ledger

Because a survey like this is only as good as its sourcing, here is exactly what I checked live and what I did not.

**Verified live this session (2026-08-21):**

- Current host facts in §2 — measured over SSH (`lscpu`, `free`, `lsblk`, `df`, Hetzner metadata service) and by `ping` from the dev machine. Read-only; nothing on the host was modified.
- Latency in §6 — `ping`, 4–8 packets each, from the Bengaluru dev machine.
- **Hetzner prices and specs** — from Hetzner's own public price API and the rendered DOM of `hetzner.com/cloud/cost-optimized/`. Every plan queried returned **`active: true`** for HEL1/FSN1/NBG1.
- **Hetzner Storage Box** (BX11–BX41), **Hetzner Object Storage** base price, the **€0.50/$0.60 IPv4 surcharge**, and extra-traffic rates (**€1.00/TB EU**, **€7.40/TB Singapore**) — same API.
- Cloudflare **R2** pricing and free tier, Cloudflare **Workers** free/paid limits, Cloudflare **Pages** limits — Cloudflare's own developer docs.
- **Backblaze B2** pricing, free 10 GB, 3× egress rule, no minimum retention — Backblaze's pricing page.
- **Google Cloud Always Free** allowances (e2-micro regions, 30 GB-months PD, **1 GB/month egress**) — Google's own free-tier documentation.
- **Render** free-tier limits (15-minute spin-down, 750 instance-hours, **no persistent disks**, Postgres expiring at 30 days) — Render docs.
- **AWS Free Tier** having changed to a **credit model with 6-month account closure** — AWS's own free-tier page.
- **Koyeb** having no free tier (Pro from $29/mo) — Koyeb pricing.
- **Fly.io** machine, volume and per-region egress pricing, and the absence of a free allowance — Fly docs.
- **Netcup**, **Contabo**, **DigitalOcean**, **Hostinger**, **IONOS** plan specs and prices — each provider's own pricing page.
- **Hetzner Cloud Volumes are excluded from Backups and Snapshots** — Hetzner docs, quoted directly.

**Not verified — treat as open:**

- **Hetzner Cloud Volume price per GB.** The block-storage page's price widget did not render and the figure is not in the public price API under any key I probed. §7 scenario C uses an estimate.
- **Vultr pricing** — `vultr.com/pricing` returned **HTTP 403**; the docs page carries no prices.
- **RackNerd** — `racknerd.com` returned **HTTP 500** and its client area **403**. Deliberately left unpriced.
- **Cloudflare Zero Trust free-plan seat count** — every Cloudflare page I fetched confirms a Free plan exists but none states the seat number. Immaterial for one user.
- **Hetzner Object Storage overage rates** beyond the €6.49 base.
- **VAT treatment** for an Indian customer at Netcup and Contabo.
- **Hostinger's India datacenter** — the page says "Asia" without enumerating.

**One trap worth recording, because it will catch the next person.** Both `hetzner.com/cloud/cost-optimized/` and `hetzner.com/cloud/shared-cpu/` rendered, in my browser session, a blank price (`from  /month`) and the text **"This product is currently unavailable. Please check back later."** next to every single plan. That is **not** a stock shortage — it is the fallback state of a widget whose price/availability fetch had not hydrated. The price API reports `active: true` for all of them. Do not conclude from the rendered page that Hetzner is out of stock; check the API, or the console.

---

## 12. Reconciliation with the parallel survey on `spike/m0.1-host-limits`

A second agent worked the same milestone in parallel on branch `spike/m0.1-host-limits`, producing four documents between 19:23 and 19:52 today: `M0.1-HOST-INVENTORY-AUDIT.md` (a second take on #316), `M0.1-HOSTING-ALTERNATIVES-DEEP-RESEARCH.md`, `M0.1-GCP-VS-HETZNER-VS-CLOUDFLARE-ANALYSIS.md`, and `M0.1-GCP-FREE-TIER-SETUP-GUIDE.md`. Its work is more careful than a quick read suggests — it independently rejects Cloudflare Workers+D1 for the right reason, it flags GCP's Standard-PD-versus-Balanced billing trap, and its "Recommendation B" (a standalone Hetzner CX23) is close to scenario E here.

Where we differ:

**The one substantive error.** Its GCP path claims that routing through Cloudflare Tunnel means "egress stays strictly within free boundaries." **It does not.** Tunnel traffic from the origin to Cloudflare's edge *is* billable outbound egress from the VM — `cloudflared` avoids the *static IP* charge, not the *data transfer* charge. Against GCP's verified **1 GB/month** free egress and ~$0.12/GB beyond it, serving 30 GB of photos in a month costs roughly **$3.60** — more than Hetzner CX23 saves, on a plan whose whole premise is $0.00. Combined with a 30 GB disk against §4's 26–52 GB archive, the "Absolute Zero Cost" path does not hold, and the 236-line `M0.1-GCP-FREE-TIER-SETUP-GUIDE.md` builds on it.

The remaining differences are smaller but each moves a decision:

| Its figure | This document | Explanation |
|---|---|---|
| Hetzner CX23 **€5.49** | €5.49 **base + €0.50 IPv4 = €5.99 / $7.09** | €5.49 is correct as the *base* price. It is only achievable IPv6-only, and an IPv6-only host cannot reach IPv4-only services (`registry.npmjs.org` has no AAAA record), so in practice you pay the €0.50 |
| Hetzner CAX11 **€5.99** | €5.99 base **+ €0.50 = €6.49** | same reason |
| Netcup **€4.96** | €4.97 ex-VAT / **€5.91 incl. 19% VAT** | Both are real prices; which applies depends on VAT treatment. Quoting only the ex-VAT figure understates it by 19% for an EU customer |
| GCP e2-micro as the zero-cost recommendation | **Rejected outright** | Its 1 GB/month egress, 30 GB disk, and US-only regions are each independently disqualifying for a photo archive (§5.3). It does note all three as "gotchas", but then concludes they don't bite |
| "Standard persistent disk ~30–50 MB/s is unnoticeable for a single-user archive" | Not tested either way | Plausible for serving, but `sharp` derivative generation over a 5,114-photo backfill and FTS5 index builds are exactly the bulk-IO cases it excepts. Untested by both of us |
| No disk-capacity analysis | **§4** | This is the finding that changes the answer. 22 GB free versus a 26–52 GB archive |
| No latency analysis | **§6** | 176.8 ms measured to Helsinki versus 7.1 ms to Bangalore |
| Strategy 1 depends on #319's cgroup work | **Does not** | The owner cancelled #319. Any recommendation that assumes those limits get applied and validated is now unexecutable |

---

## 13. References

- `docs/M0.1-HOST-INVENTORY.md` — this session's measured inventory of the shared host (#316)
- `docs/IMPLEMENTATION-PLAN-POST-M6.md` §7.8 — shared-host coexistence risk
- `reference/PRODUCT-REQUIREMENTS.md` — `LID-OPS-007` (R2 migration), `LID-OPS-017` (AI budget, and hosting cost tracked separately), `LID-OPS-018` (best-effort availability, no SLA)
- `reference/HETZNER-SHARED-HOST-DEPLOYMENT-SPIKE.md` — earlier, over-scoped reference research; treat as options, not decisions
- Hetzner public price API — `https://website-price-api.hetzner.com/api/v1/products/<PRODUCT_KEY>`; views at `/api/v1/views/cloud_matrix` and `/api/v1/views/nav_prices`
- <https://developers.cloudflare.com/r2/pricing/> · <https://developers.cloudflare.com/workers/platform/pricing/> · <https://developers.cloudflare.com/pages/platform/limits/>
- <https://www.backblaze.com/cloud-storage/pricing>
- <https://docs.cloud.google.com/free/docs/free-cloud-features>
- <https://render.com/docs/free> · <https://www.koyeb.com/pricing> · <https://fly.io/docs/about/pricing/> · <https://aws.amazon.com/free/>
- <https://www.netcup.com/en/server/vps> · <https://contabo.com/en/vps/> · <https://www.digitalocean.com/pricing/droplets> · <https://www.hostinger.com/vps-hosting> · <https://www.ionos.com/servers/vps>
- <https://docs.hetzner.com/cloud/volumes/overview> — volumes excluded from Backups/Snapshots
