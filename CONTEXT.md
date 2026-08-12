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

**Generated Artwork**:
A visibly identified Derived Artifact created from journal text for a Journal Day that has no Daily Photo at generation time.
_Avoid_: Daily Photo, real photo

**Calendar Cover**:
The single representative visual shown for a Journal Day in the calendar. Its default is the first Daily Photo when one exists, otherwise eligible Generated Artwork.
_Avoid_: Hero image, thumbnail

**Active AI Provider**:
The external AI service currently selected to create new Derived Artifacts. Changing it does not change the provenance of existing Derived Artifacts.
_Avoid_: AI model, permanent provider

**Finalization Time**:
The Journal Timezone boundary after which a Journal Day is treated as complete for scheduled derivation. Finalization does not prevent later Source Items or Corrections.
_Avoid_: Midnight, lock time

**Trash**:
The recoverable 30-day state for journal content removed from its normal Journal Day presentation before permanent live deletion.
_Avoid_: Permanent deletion, archive
