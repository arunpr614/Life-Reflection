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

**Derived Artifact**:
A replaceable, traceable title, summary, tag, or artwork produced from Source Items. A Derived Artifact never replaces or masquerades as authentic source material.
_Avoid_: Source entry, original

**Generated Artwork**:
A visibly identified Derived Artifact created from journal text for a Journal Day that has no Daily Photo at generation time.
_Avoid_: Daily Photo, real photo
