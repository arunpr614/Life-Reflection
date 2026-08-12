# Life in Days: Private Media Storage Evaluation

- Status: proposed architecture; no provider account, bucket, volume, DNS record, or server configuration has been changed
- Research date: 2026-08-12
- Scope: live storage and private rendering of Telegram photos, locally generated thumbnails, and AI-generated artwork
Existing recovery decision: encrypted Restic repository in Backblaze B2

## Decision summary

**Recommendation:** launch with encrypted media on the existing Hetzner root disk, with authoritative/root-resident media capped at **10 GB**, for **$0 incremental monthly cost**. Build against a filesystem/object-storage abstraction from the first commit. Begin migration planning at 7 GB root-resident media use or 18 GB host free, begin verified copy and dual-write no later than 8 GB root-resident media use or 15 GB host free, and complete cutover before 10 GB root-resident media use or 12 GB host free. The recommended target, still subject to product-owner approval, is **Cloudflare R2 Standard in the EU jurisdiction**.

R2 Standard is not the absolute cheapest metered object store once the live collection grows beyond roughly 19 GB, even if the Restic repository has already consumed B2's account-wide free allowance. If that allowance is still available, B2 is cheaper by roughly $0.12/month at 25 GB, $0.32 at 50 GB, $0.72 at 100 GB, and $1.93 at 250 GB. If the allowance is already consumed, those differences are roughly $0.05, $0.25, $0.66, and $1.86. R2 is nevertheless the better recommended scale target because the selected encrypted backup is already in B2. Keeping live media in R2 and recovery copies in B2 avoids one provider/account/region being both the primary and the backup. The premium is small at this product's expected scale, and R2 is actually cheaper through roughly the first 19 GB when B2's free allowance is unavailable.

If minimizing the invoice is valued above that correlated-risk boundary, a **separate private B2 live-media bucket with separate application keys** becomes the cheapest credible scale path above roughly 19 GB. It must not be the Restic repository, must not share its credentials, and must not be treated as its own backup. A B2 provider, account, billing, or regional incident could still affect both buckets.

Do not use R2 Infrequent Access for live images. Its free tier does not apply, reads incur retrieval fees, and Cloudflare rounds billable request classes to million-request units. A continuously written and read one-user archive can therefore incur about $9.90 in request-class charges before storage and retrieval.

Do not use Hetzner Storage Box as the live filesystem. Its price is attractive at 1 TB, but it is a backup/file-transfer product on one host with ten concurrent connections and no S3-style browser delivery. It remains a credible bulk-copy or secondary-backup product, not an application media origin.

## Requirements and observed baseline

### Product constraints

- Strictly one user; no public links or sharing.
- Life in Days has no application-level image-count limit, but each image is at most 20 MB and ingestion remains subject to capacity, safety, and upstream API limits.
- Preserve the exact bytes received as the Original; never silently downsample or delete an Original.
- Generate web thumbnails locally. Strip metadata from thumbnails while preserving the untouched Original.
- Real photos and their metadata must never be sent to an AI provider.
- Media must be visible only after Life in Days authentication.
- Cloudflare Tunnel and Cloudflare Access protect `life.arunp.in`.
- Encrypted, restorable B2/Restic backups remain mandatory regardless of the live store.
- Optimize the recurring cost, but never mistake low-cost primary storage for a backup.

### Existing host observation

The following is an environment observation, not a provider guarantee:

- On 2026-08-12, `ubuntu-4gb-hel1-1` had one ext4 root partition (`/dev/sda1`), approximately 38 GB total, 9.2 GB used, and 27 GB available.
- No attached Hetzner Cloud Volume was visible.
- No guest-managed dm-crypt/LUKS block-encryption mapping was visible. This says nothing about undisclosed provider internals; it only means Life in Days cannot rely on guest-visible full-disk encryption.
- `cloudflared` was active.

With a hard reserve of 12 GB free, the mathematical headroom was about 15 GB. A 10 GB application quota deliberately leaves roughly 5 GB beyond that reserve for operating-system upgrades, logs, database growth, temporary image processing, and migration staging.

## Method and cost assumptions

The estimates below are planning models, not quotes. Prices are provider-published list prices before tax, captured on the research date.

- The size column is average live media stored for a full month, including Originals, thumbnails, and generated artwork.
- Request model: at most 1,000 writes and 50,000 reads per month. This is deliberately generous for one person and remains inside the B2 and R2 Standard free request allowances.
- Origin-read/egress model: 10% of stored bytes per month. Calendar browsing primarily reads small thumbnails; full Originals are opened infrequently.
- B2 egress is $0 in this model because it is below B2's allowance of three times average monthly storage. API transaction classes A, B, and C are currently free.
- R2 Standard egress is free. The first 10 GB-month, 1 million Class A requests, and 10 million Class B requests are free each month.
- R2 Infrequent Access has no free tier. The model includes at least one Class A operation, one Class B operation, 10% retrieval, and Cloudflare's published request-unit rounding: $9.00 + $0.90 request classes, $0.01/GB-month storage, and $0.01/GB retrieved.
- Bunny Storage uses a single Standard HDD region and direct authenticated API retrieval through the Life in Days server. It has a $1 monthly minimum. Public CDN distribution is not included or needed.
- Hetzner Cloud Volume uses the published €0.044/$0.05 per GB-month public calculator rate. Confirm the live Console quote immediately before ordering because Hetzner pricing is dynamically rendered.
- The B2 10 GB free allowance is **account-wide**, not per bucket. If the Restic repository already consumes it, the incremental B2 live-store charge is `live GB × $0.00695`, rather than `(live GB - 10) × $0.00695`.
- R2 free allowances are likewise account-level monthly allowances.

### Modeled monthly live-storage cost

`—` means the option violates the recommended 10 GB root-disk quota. Dollar and euro values should not be added together; both are shown only where Hetzner publishes both.

| Live media | Existing root disk | Hetzner Cloud Volume | Hetzner Storage Box BX11 | Hetzner Object Storage | Backblaze B2 if free allowance remains | Cloudflare R2 Standard | Cloudflare R2 IA | Bunny Storage |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 10 GB | $0 | $0.50 / €0.44 | $4.00 / €3.20 | $5.99 / €4.99 | $0.00 | $0.00 | $10.01 | $1.00 |
| 25 GB | — | $1.25 / €1.10 | $4.00 / €3.20 | $5.99 / €4.99 | $0.10 | $0.23 | $10.18 | $1.00 |
| 50 GB | — | $2.50 / €2.20 | $4.00 / €3.20 | $5.99 / €4.99 | $0.28 | $0.60 | $10.45 | $1.00 |
| 100 GB | — | $5.00 / €4.40 | $4.00 / €3.20 | $5.99 / €4.99 | $0.63 | $1.35 | $11.00 | $1.00 |
| 250 GB | — | $12.50 / €11.00 | $4.00 / €3.20 | $5.99 / €4.99 | $1.67 | $3.60 | $12.65 | $2.50 |
| 500 GB | — | $25.00 / €22.00 | $4.00 / €3.20 | $5.99 / €4.99 | $3.41 | $7.35 | $15.40 | $5.00 |

The table does not include the existing server bill or the separate backup bytes. Restic repository size will not equal live-store size exactly because it is encrypted, deduplicated, versioned, and retained across snapshots.

The displayed B2 column assumes its account-wide 10 GB allowance remains after Restic usage. If the backup repository has consumed that allowance, the incremental B2 live-media costs are approximately **$0.07 at 10 GB, $0.17 at 25 GB, $0.35 at 50 GB, $0.70 at 100 GB, $1.74 at 250 GB, and $3.48 at 500 GB**. The R2 column likewise assumes its own account-wide allowances are otherwise unused. Actual account-wide usage must be read before migration approval; free capacity may never be counted twice.

At 100% monthly reads instead of 10%, B2 and R2 Standard remain $0 for modeled egress/retrieval, while R2 IA adds another $0.009 per stored GB relative to the table. At more than three times average B2 storage downloaded directly outside a Bandwidth Alliance path, B2 charges $0.01/GB for the excess.

## Provider-by-provider analysis

### 1. Existing Hetzner root disk

**Published/observed facts**

- The current server already has about 27 GB free; no extra purchase is required.
- The disk contains the application, operating system, database, logs, temporary files, and media in the same failure domain.
- No guest-managed block encryption was observed.
- EU Hetzner Cloud servers include very large outbound traffic allowances relative to this one-user workload.

**Inferences**

- Local reads will have the least application latency and operational complexity.
- A full disk can damage both ingestion and the database, so the nominal 27 GB cannot be treated as media capacity.
- Server loss, filesystem corruption, operator error, or account compromise can affect the application and live media together; B2 recovery is essential.

**Fit**

- Best MVP choice through 10 GB.
- Encrypt every media blob at the application layer at no license cost.
- Serve only through an authenticated application route; never expose a filesystem path through the web server.

### 2. Hetzner Cloud Volume

**Published facts**

- Volumes are network block storage, can be sized from 10 GB to 10 TB, and are billed hourly with a monthly cap.
- Hetzner stores each block on three physical servers.
- A Volume attaches to only one server at a time.
- Hetzner server Backups and Snapshots do **not** include attached Volumes, and Hetzner does not provide Volume snapshots.
- The public calculator rate captured for this report is €0.044/$0.05 per GB-month.

**Inferences**

- It is the easiest migration from local disk because the application still sees a normal filesystem.
- It improves disk-capacity isolation and block redundancy, but does not create a provider-independent or account-independent failure domain.
- Its price is much higher than metered object storage at 25–500 GB.

**Fit**

- Sensible only if filesystem simplicity is worth the premium.
- Not the cost-optimal scale target.
- Must be included explicitly in Restic; server backups will omit it.

### 3. Hetzner Storage Box BX11

**Published facts**

- BX11 provides 1 TB for the current official live-price-feed value of €3.20/$4.00 per month.
- It includes unlimited traffic, ten concurrent connections, ten snapshots, and SFTP/SCP/FTPS/SMB/WebDAV/HTTPS access.
- Data is held across a RAID array on one host server; it is not mirrored to other servers.
- Hetzner describes Storage Box as an online-backup/file-storage product. Encryption at rest is the customer's responsibility.

**Inferences**

- Mounting WebDAV or SMB as an application's live media filesystem introduces network-filesystem failure semantics and latency into every view.
- Proxying authenticated WebDAV/SFTP downloads through the app is possible but materially more bespoke than S3 and provides no direct private browser-delivery mechanism.
- Ten connections are enough for one user but reinforce that this is not designed as a high-request media origin.

**Fit**

- Attractive bulk-storage price, especially above roughly 585 GB where B2's list storage charge exceeds $4.
- Not recommended for live serving.
- Could be reconsidered as a separate encrypted secondary copy, but it would share the Hetzner provider with the server and would not replace B2 recovery.

### 4. Hetzner Object Storage

**Published facts**

- S3-compatible private buckets, S3 operations at no charge, and incoming traffic at no charge.
- €4.99/$5.99 monthly base price includes up to 1 TB of storage and approximately 1 TB of outgoing traffic per full month; excess is metered.
- Objects have a 64 kB minimum billable size, immaterial for photos but potentially relevant to tiny manifests.
- Private objects can be delivered with time-limited presigned URLs. Hetzner does not natively attach a custom domain; a reverse proxy is needed.
- Hetzner states there is no default object encryption at rest. SSE-C is available, and the customer must retain the encryption key.

**Inferences**

- Technically suitable as a live media store, but its fixed monthly floor is poor at MVP scale.
- It becomes cheaper than R2 Standard at about 410 GB and remains flat through 1 TB, assuming traffic stays inside the included quota.
- It shares the provider/account family with the application server, although the B2 backup remains outside Hetzner.

**Fit**

- Re-evaluate around 400–500 GB.
- Use application-level encryption or SSE-C; never rely on default at-rest encryption.
- Do not issue long-lived signed URLs for private journal photos.

### 5. Backblaze B2

**Published facts**

- Current storage pricing starts at $6.95/TB-month; the first 10 GB account-wide is free.
- Egress up to three times average monthly storage is free; excess is $0.01/GB. Transfer through Cloudflare and other Bandwidth Alliance partners can be free.
- Transaction classes A, B, and C are free for pay-as-you-go accounts; event-notification Class D calls have a small charge after a daily allowance.
- Buckets are private by default. S3-compatible presigned URLs and bucket/prefix-scoped application keys are supported.
- Optional SSE-B2 and SSE-C use AES-256 and have no encryption surcharge. Metadata is not encrypted by these modes.
- EU Central account data is stored in Amsterdam. B2 publishes eleven-nines durability for its Vault architecture.

**Inferences**

- Above the account-specific break-even, this is the cheapest credible metered object store in the modeled range. When Restic has consumed B2's shared free allowance, R2 is cheaper below roughly 19 GB.
- Application-proxy delivery remains within free egress at the one-user read rate and keeps the storage credential away from the browser.
- Using B2 for both live and Restic storage creates a correlated provider/account/region risk even with separate buckets.

**Fit**

- Cost-minimum alternative above the account-specific break-even, not the primary recommendation.
- If selected, create two clearly separate buckets and credentials:
  - `life-in-days-live-media`: application key restricted to this bucket and only the operations the application needs.
  - `life-in-days-restic-backup`: a different key used only by Restic; the application process must not possess it.
- Enable default SSE-B2 and also keep application-layer ciphertext if the requirement is to hide photo contents from the storage provider.
- The 10 GB free allowance is shared across both buckets, so do not double-count it.

### 6. Cloudflare R2 Standard

**Published facts**

- $0.015/GB-month; first 10 GB-month is free each month.
- One million Class A and ten million Class B operations are free each month.
- Internet egress is free.
- R2 encrypts object data and metadata at rest automatically with Cloudflare-managed AES-256 keys; TLS protects transit.
- Standard has no retrieval charge or minimum storage duration and publishes eleven-nines durability.
- Buckets are not public by default. R2 supports presigned URLs, Workers, custom domains, and protecting a custom-domain bucket with Cloudflare Access.
- An EU jurisdiction can guarantee storage and processing within the EU; a mere location hint is best-effort rather than a residency guarantee. Jurisdiction is selected when the bucket is created and cannot be changed afterward.

**Inferences**

- It is operationally convenient with the existing Cloudflare account, DNS, and Access policies.
- It couples live delivery to Cloudflare, already used for the Tunnel and Access, but the B2 backup remains a separate recovery provider.
- Its premium over B2 is immaterial at expected early scale and buys a cleaner live-versus-backup failure boundary.

**Fit**

- Recommended object-store migration target, created explicitly in the EU jurisdiction rather than with only a best-effort location hint.
- Use Standard, not Infrequent Access.
- Keep the bucket private and let the Life in Days server fetch encrypted objects. This avoids putting the decryption key in a Worker or browser.
- If a future direct R2 custom-domain path is used, protect it with Access and disable every alternative public path, especially `r2.dev`.

### 7. Cloudflare R2 Infrequent Access

**Published facts**

- $0.01/GB-month, $0.01/GB retrieval, $9/million Class A, $0.90/million Class B, no egress charge, and a 30-day minimum duration.
- The Standard free tier does not apply to IA.
- Cloudflare rounds usage upward to the next billing unit.

**Inference and fit**

- A daily-write, calendar-read workload can pay about $9.90 in request-class units even at tiny scale. It is an archive tier, not a live gallery tier.
- Reject for MVP and for foreseeable Life in Days live media.

### 8. Bunny Storage Standard

**Published facts**

- One HDD region costs $0.01/GB-month with a $1 monthly minimum, no API request fees, and free API egress. Public distribution through Bunny CDN is separately priced.
- The Storage HTTP API requires a zone password in an `AccessKey` header.
- Bunny describes single-region durability as variable; eleven-nines durability requires at least one additional paid replication region.

**Inferences**

- It is cheaper than R2 Standard around 100–500 GB in the table, but more expensive than B2 in most of that range.
- Its broad zone credential and weaker single-region durability posture are less attractive for a private memory archive.
- App-proxy delivery and application encryption would be required; adding another vendor buys little.

**Fit**

- Credible but not recommended.

### Lower-cost claims excluded from the shortlist

- **Storj Standard:** $7/TB storage and $7/TB egress sound competitive, but the official plan has a $5 monthly minimum and 30-day minimum object retention. It is not cost-effective here.
- **IDrive e2:** $0.006/GB is advertised, but pay-as-you-go has a $6 minimum charge associated with 1 TB. It is not cost-effective below roughly 1 TB.
- Promotional first-year prices and consumer-drive products were excluded because a private server-side API, predictable renewal price, or suitable application-serving contract was not established.

## Recommended private rendering architecture

### Storage-neutral data model

The database should store a stable Media Item identity, not a provider URL:

- opaque media ID;
- storage backend and opaque object key;
- byte length, MIME type, dimensions, and cryptographic checksum;
- Original/Thumbnail/Generated Artwork role;
- encryption version and key identifier;
- original Telegram receipt timestamp and Journal Date in the existing source-item model.

Do not place dates, names, journal text, Telegram IDs, filenames, or plaintext checksums in bucket names, object keys, or provider metadata. Use random opaque object keys. This also prevents changing a Journal Date from requiring an object rename.

Implement a small backend contract from the outset: `put`, `getStream`, `head`, `listInventory`, `delete`, and `healthCheck`. `listInventory` must support complete paginated enumeration and fail closed on partial listing. MVP uses `FilesystemMediaStore`; R2 and B2 use an `S3MediaStore`. This makes the later move a verified data migration instead of an application rewrite and gives backup reconciliation an explicit complete-inventory contract.

### Capture and derivation flow

1. Telegram bytes land in a bounded, service-private memory-backed temporary area with a 20 MB hard input limit. Plaintext must not be written to the ordinary root filesystem.
2. Validate the actual file type, decode safely, calculate a plaintext duplicate checksum, and record dimensions.
3. Preserve the exact received bytes as the Original.
4. Generate thumbnails locally in a resource-limited process; orient them for display and strip EXIF/IPTC/XMP metadata.
5. Encrypt the Original and Thumbnail separately with authenticated application-level encryption. Open-source cryptography has no provider fee; a per-object nonce and versioned envelope are mandatory.
6. Store ciphertext under opaque keys, verify stored length/checksum, commit metadata, then acknowledge Telegram.
7. Remove temporary plaintext immediately after the encrypted Original, encrypted Thumbnail, and their database metadata have committed durably. The backup job consumes ciphertext rather than extending plaintext lifetime. Clean abandoned memory-backed temporary files at service startup and after every failed capture.

The memory-backed path is bounded rather than an invitation to consume the host. Production must refuse to start if unencrypted swap is active, recheck that invariant in System Health, enforce an aggregate staging/cgroup memory limit, allow only one media decode/derivation job at a time on the 4 GB host, and return explicit temporary backpressure when the bound is unavailable. A future encrypted swap configuration may be accepted only after its recovery-key and boot behavior are documented and tested.

The application encryption key remains readable only by the Life in Days service account on the Hetzner server; keep an offline recovery copy in the password manager. This is not zero-knowledge encryption because the running app can decrypt files. It does mean an object-storage operator or exposed bucket sees ciphertext rather than usable personal photos.

### Read path

Use same-origin authenticated routes such as `/media/{opaque-id}/thumbnail` and `/media/{opaque-id}/original`:

1. Cloudflare Access authenticates the only allowed human identity.
2. The application authorizes the Media Item and Journal Day.
3. The backend streams ciphertext from local disk or object storage.
4. The app decrypts while streaming and returns the correct content type.
5. Originals default to inline viewing on the day page with a separate explicit download action; no provider credential or storage URL reaches the browser.

This adds one Hetzner hop when the live store is R2/B2, but the latency and traffic are insignificant for one user and it preserves one consistent security boundary. Do not optimize with public buckets.

Presigned URLs are bearer URLs: anyone who obtains one can reuse it until expiry. They are useful for emergency export or tightly scoped uploads, but the app proxy is safer and simpler for normal journal rendering. Application-level encrypted objects also cannot be rendered directly by the browser without moving a decryption key to the client.

### Cache policy

- HTML, journal text, Originals, downloads, and API responses: `Cache-Control: private, no-store`.
- Cloudflare cache rule: bypass shared cache for `/media/*`, `/api/*`, and all authenticated pages, even if a later response header is misconfigured.
- Thumbnails, privacy-first default: `private, no-store`. This causes repeat origin reads but the expected scale makes the cost negligible.
- Optional later performance mode: content-addressed thumbnail URLs with a private browser-only cache and explicit Cloudflare shared-cache bypass. This stores decrypted thumbnails on the signed-in device and must be a deliberate privacy tradeoff.
- Never enable `Cache Everything` for personal media. Never log query strings or signed URLs.

Cloudflare necessarily terminates the web TLS connection in the chosen Access/Tunnel architecture. `no-store` prevents persistent shared caching; it does not make Cloudflare absent from the request path.

## Backup interaction

The live store and the backup answer different questions:

- Live store: low-latency current data used by the application.
- Restic/B2: encrypted point-in-time recovery after deletion, corruption, server loss, or live-provider loss.

For root disk or Cloud Volume, include the complete encrypted media tree in every scheduled Restic snapshot. Restic normally reads a filesystem-like source; merely naming an R2 or B2 destination does not make a remote object store a valid complete backup source. Before object-store cutover, implement and test a read-only, complete remote-source path—for example, a rigorously validated read-only mount or inventory-driven streaming adapter—that enumerates every opaque live object, follows pagination, exposes stable size/time metadata, and aborts the entire snapshot on any partial listing or read error. Backing up only newly captured staging files is forbidden because retention pruning can eventually remove the only recovery copy of an older object.

The exact remote-source mechanism remains an implementation ADR and a pre-cutover gate, not a claim that an untested mount is reliable. A full inventory reconciliation and restore proof must pass at the expected collection size before any local authoritative copy is evicted.

Before evicting local media during migration, prove through a restore test that:

- every live object is represented in a retained Restic snapshot;
- its database record and encryption metadata are present;
- the restored ciphertext checksum matches;
- the recovery key can decrypt it;
- the restored Original renders correctly.

If B2 is selected as the live store, use separate live and Restic buckets and different bucket-scoped keys. This limits accidental application deletion of the Restic repository, but it is **credential separation, not provider-independent disaster recovery**. Consider a second provider for recovery before calling that design resilient to B2 account or regional failure.

## Capacity controls and migration thresholds

### Root-resident MVP disk watermarks

- **10 GB:** hard quota for authoritative/root-resident media while the filesystem backend is active or migration remains incomplete. It is not a post-cutover cap on the total object-store archive.
- **7 GB root-resident media used or 18 GB host free, whichever comes first:** warning and start object-store migration work.
- **8 GB root-resident media used or 15 GB host free:** provision the target and begin verified copy/dual-write.
- **9 GB root-resident media used or 13 GB host free:** new writes must use the object store; finish backfill, full remote-to-Restic backup proof, and cutover.
- **12 GB host free, or 10 GB root-resident media while migration is incomplete:** emergency hard stop for new media. Continue journal text, reads, backup, export, and deletion recovery. Return a clear Telegram failure; never drop the update silently.

After verified object-store cutover and eviction of old root copies, total archive media may exceed 10 GB; the 12 GB host-free emergency stop remains globally active because database, logging, updates, and memory-backed processing still need local space. The free-space checks use actual filesystem bytes, not provider dashboard estimates. Alert on projected exhaustion as well as present usage; a burst of 20 MB images can cross a watermark quickly.

### Safe migration sequence

1. Create the private target bucket and least-privilege server credential.
2. For R2, create the bucket in the EU jurisdiction. Enable provider encryption and retain application-level encryption.
3. Start dual-write for new encrypted objects, with the root copy still authoritative.
4. Copy old ciphertext by opaque key; verify byte length and checksum at destination.
5. Run a full count/size/hash reconciliation and prove the complete object-store-to-Restic snapshot and restore path, including fail-closed behavior on a deliberately interrupted listing.
6. Atomically change database backend pointers; keep a reversible migration ledger.
7. Observe reads from the target for at least seven days.
8. Only then remove old root copies that have both a verified live object and a verified Restic recovery copy.

Never migrate by generating new thumbnails from provider-rendered Originals, and never modify Originals during transfer.

## Scale decision tree

```text
Is live media below 7 GB and host free space at least 18 GB?
├─ Yes → Existing encrypted root disk; $0 incremental cost.
└─ No
   ├─ Is separate live/backup provider risk the priority?
   │  └─ Yes → R2 Standard live + B2 Restic backup.
   └─ Is the absolute lowest metered bill the priority?
      └─ Yes, and live media is above the current account-specific break-even
             → Separate B2 live bucket/key + separate B2 Restic bucket/key;
               explicitly accept correlated B2 risk.

At approximately 250 GB → refresh real bills, latency, restore time, and growth.
At approximately 400–500 GB → re-price Hetzner Object Storage versus R2/B2.
At approximately 1 TB → re-run the evaluation; do not switch to Storage Box
                         for live serving on price alone.
```

### Recommended threshold table

| Stage | Live store | Expected added live-storage cost | Why |
|---|---|---:|---|
| Launch to 7 GB | Existing root disk | $0 | Simplest, fastest, preserves cash; B2 recovery covers server loss. |
| 7–10 GB | Migrate and dual-write | R2 still within/near free tier | Complete migration before capacity becomes an incident. |
| 10–250 GB | R2 Standard | $0 to about $3.60/month | Private S3, free egress, automatic at-rest encryption, B2-independent recovery. |
| Cost-minimum variant above account-specific break-even | B2 live bucket | About $0–$1.67 if its free allowance remains, or $0.07–$1.74 if Restic has consumed it, plus backup usage | Cheapest only above the measured break-even; same provider as backup. |
| 250 GB | Re-evaluation checkpoint | provider quote | Validate actual image growth, B2 backup size, latency from Hetzner Helsinki, and restore duration. |
| 400–500 GB | Compare R2/B2/Hetzner Object again | about $3.41–$7.35/month | Hetzner's 1 TB base bundle begins to beat R2 list storage cost. |

## Final recommendation and unresolved decision

Report recommendation, subject to the provider decision below:

1. Existing root disk, 10 GB root-resident quota, strict watermarks, and application-level authenticated encryption.
2. Memory-backed plaintext staging, local thumbnail generation, immediate encrypted commit, and immediate plaintext cleanup; Originals otherwise untouched and never sent to AI.
3. Same-origin authenticated application proxy with shared-cache bypass.
4. Storage-neutral backend metadata and API from day one.
5. Complete encrypted Restic snapshots in the separate B2 backup repository.
6. Begin provider-neutral migration planning at 7 GB root-resident media. Require a tested complete remote-to-Restic backup path before either object-store target may cut over.

One product-owner decision remains:

- **Recommended safety/price balance:** R2 Standard live + B2 backup.
- **Lowest bill above the account-specific break-even:** B2 live + B2 backup in separate buckets/keys, accepting correlated provider risk. R2 is cheaper at very small scale if B2's shared free allowance has already been consumed.

No Hetzner Volume should be pre-purchased. It is a fallback if the filesystem implementation is materially simpler than the object-storage adapter when the threshold is reached, not the default plan.

## Primary sources

All sources are provider-owned and were checked on 2026-08-12.

- Hetzner, [Cloud Volume overview](https://docs.hetzner.com/cloud/volumes/overview/) and [Cloud pricing page](https://www.hetzner.com/cloud/)
- Hetzner, [Cloud traffic and billing](https://docs.hetzner.com/cloud/billing/faq/)
- Hetzner, [Storage Box product](https://www.hetzner.com/storage/storage-box/), [Storage Box architecture/protocols](https://docs.hetzner.com/storage/storage-box/general/), and [official live price data](https://www.hetzner.com/_resources/app/data/app/live_data_prices.json)
- Hetzner, [Object Storage overview and pricing rules](https://docs.hetzner.com/storage/object-storage/overview/), [private buckets and presigned URLs](https://docs.hetzner.com/storage/object-storage/faq/buckets-objects/), [encryption statement](https://docs.hetzner.com/storage/object-storage/faq/general/), and [SSE-C](https://docs.hetzner.com/storage/object-storage/howto-protect-objects/encrypt-with-sse-c/)
- Hetzner, [Object Storage published base price](https://www.hetzner.com/pressroom/object-storage/) and [technical and organizational measures](https://docs.hetzner.com/general/security-and-identify/technical-and-organizational-measures/)
- Backblaze, [B2 storage and egress pricing](https://www.backblaze.com/cloud-storage/pricing), [transaction pricing](https://www.backblaze.com/cloud-storage/transaction-pricing), and [data regions](https://www.backblaze.com/docs/cloud-storage-data-regions)
- Backblaze, [private B2 delivery through Cloudflare](https://www.backblaze.com/docs/cloud-storage-deliver-private-backblaze-b2-content-through-cloudflare-cdn), [S3/presigned URL support](https://www.backblaze.com/docs/cloud-storage-s3-compatible-api), [application-key scoping](https://www.backblaze.com/docs/cloud-storage-create-and-manage-app-keys), [server-side encryption](https://www.backblaze.com/docs/cloud-storage-server-side-encryption), and [durability](https://help.backblaze.com/hc/en-us/articles/218485257-B2-Resiliency-Durability-and-Availability)
- Cloudflare, [R2 pricing and billing units](https://developers.cloudflare.com/r2/pricing/), [storage classes](https://developers.cloudflare.com/r2/buckets/storage-classes/), [data security](https://developers.cloudflare.com/r2/reference/data-security/), [data location](https://developers.cloudflare.com/r2/reference/data-location/), and [presigned URLs](https://developers.cloudflare.com/r2/api/s3/presigned-urls/)
- Cloudflare, [R2 public/custom-domain access controls](https://developers.cloudflare.com/r2/buckets/public-buckets/) and [cache-control behavior](https://developers.cloudflare.com/cache/concepts/cache-control/)
- Bunny, [Storage pricing](https://bunny.net/pricing/storage/), [authenticated HTTP API](https://docs.bunny.net/storage/http), and [durability](https://docs.bunny.net/storage/durability)
- Storj, [Object Storage pricing and minimum fee](https://www.storj.io/pricing)
- IDrive, [e2 pricing and minimum charge](https://www.idrive.com/s3-storage-e2/pricing)
