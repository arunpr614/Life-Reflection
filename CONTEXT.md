# Life in Days

Life in Days is a private, single-user visual memory archive that brings together Arun's journals and daily photos for calendar-based reflection.

## Language

**Journal Day**:
The collection of authentic source items and derived artifacts associated with one calendar date in the journal timezone.
_Avoid_: Daily entry, diary entry

**Journal Date**:
The editable calendar date that assigns a source item to a Journal Day. It is distinct from the immutable time at which the source created or delivered the item.
_Avoid_: Upload date, webhook date

**Journal Timezone**:
The fixed timezone used to derive the initial Journal Date when no explicit date is supplied. The initial product uses `Asia/Kolkata`.
_Avoid_: Local timezone, device timezone

**Needs Date Review**:
The holding state for a Source Item whose Journal Date cannot be determined from a reliable source timestamp or an explicit user choice.
_Avoid_: Today's journal, undated day

**Integration Activation**:
The recorded instant from which newly created VoiceNotes content becomes eligible for automatic import. It is not moved backward by later tagging or editing.
_Avoid_: Launch date, historical-import date

**Source Item**:
An authentic journal or photo supplied by Arun through an approved capture source. It retains its origin and original timestamp even when its Journal Date or displayed text is corrected.
_Avoid_: AI entry, generated memory

**Voice Journal**:
A long-form textual Source Item obtained automatically from an eligible VoiceNotes note.
_Avoid_: Voice recording, AI transcript

**Uploaded Journal**:
A textual Source Item supplied manually as a text file for a chosen Journal Day.
_Avoid_: Manual note, attachment

**Daily Photo**:
An original image Source Item sent through the private Telegram bot and associated with a Journal Day.
_Avoid_: AI image, generated photo

**Photo Caption**:
Text received with a Daily Photo after any leading Journal Date instruction has been removed.
_Avoid_: Journal, AI prompt

**Media Asset**:
One preserved image byte sequence that may be referenced by multiple Daily Photos when an identical file is intentionally retained more than once, on the same or different Journal Days.
_Avoid_: Daily Photo, gallery item

**Original Timestamp**:
The immutable time metadata retained from a Source Item's capture or delivery source. Changing a Journal Date never changes this evidence.
_Avoid_: Journal Date

**Source Revision**:
A preserved version of a Source Item created when its upstream source changes. Revisions form an auditable history rather than replacing earlier source content.
_Avoid_: Correction, latest copy

**Correction**:
A user-authored replacement for the displayed text or Journal Date of a Source Item that leaves the source and its revisions intact.
_Avoid_: Source edit, overwritten transcript

**Derived Artifact**:
A replaceable, traceable title, summary, tag, or artwork produced from Source Items. A Derived Artifact never replaces or masquerades as authentic source material.
_Avoid_: Source entry, original

**Protected Field**:
A title, summary, or tag field that Arun has manually edited or explicitly accepted and that automatic generation cannot overwrite until protection is removed.
_Avoid_: Untouched output, permanently locked field

**Source Quiet Period**:
The 15-minute interval after the most recent journal-source change during which automatic textual derivation waits for related content to settle.
_Avoid_: Finalization Time, lock period

**Visual Brief**:
A minimal, source-grounded text description created from journal text and used as the sole personal-content input to the Artwork Provider.
_Avoid_: Full journal, photo description, artwork prompt

**Generated Artwork**:
A visibly identified visual Derived Artifact created from a Journal Day's journal text. It may be requested manually even when Daily Photos exist, but it can become the Calendar Cover only while that Journal Day has no Daily Photo.
_Avoid_: Daily Photo, real photo

**Active Artwork**:
The selected Generated Artwork version shown in the normal Journal Day gallery. Earlier versions remain in history, and Active Artwork is cover-eligible only when no Daily Photo exists.
_Avoid_: Latest attempt, Daily Photo

**Calendar Cover**:
The single representative visual shown for a Journal Day in the calendar. Its default is the first Daily Photo when one exists, otherwise eligible Generated Artwork.
_Avoid_: Hero image, thumbnail

**Text Provider**:
The external AI service selected to create new textual Derived Artifacts and the visual brief for artwork. Changing it affects only future generations.
_Avoid_: Artwork Provider, permanent provider

**Artwork Provider**:
The external AI service selected to turn a text-only visual brief into Generated Artwork. Changing it affects only future generations.
_Avoid_: Text Provider, image source

**Artwork Request**:
An explicit user instruction to create or regenerate Generated Artwork for a Journal Day. It is distinct from the scheduled fallback sweep.
_Avoid_: Photo upload, automatic cover

**Artwork Sweep**:
The scheduled 01:00 Journal Timezone check that fills eligible journaled days lacking both a Daily Photo and Generated Artwork.
_Avoid_: Reminder, empty-day generation

**Artwork Suppression**:
The explicit instruction that prevents the Artwork Sweep from recreating artwork after all artwork is deliberately removed from a Journal Day.
_Avoid_: Source Suppression, failed generation

**Finalization Time**:
The Journal Timezone boundary after which a Journal Day is treated as complete for scheduled derivation. Finalization does not prevent later Source Items or Corrections.
_Avoid_: Midnight, lock time

**Trash**:
The recoverable 30-day state for journal content removed from its normal Journal Day presentation before permanent live deletion.
_Avoid_: Permanent deletion, archive

**Recovery Ceremony**:
The pre-launch proof that two independent off-server copies of the recovery key exist and that the key can restore and decrypt a representative archive sample.
_Avoid_: Backup schedule, production recovery claim

**Source Suppression**:
The minimal retained instruction that prevents a deliberately deleted upstream Source Item from being re-imported during reconciliation.
_Avoid_: Source deletion, Trash
