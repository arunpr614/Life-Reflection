# Initial product brief

Status: discovery; implementation has not started.

## Product intent supplied by Arun

Create a personal web experience for reflecting on life through daily voice journals and images.

### Inputs

- Voice journals are recorded in VoiceNotes.
- Only VoiceNotes content associated with a chosen tag should enter this product.
- VoiceNotes should notify the product through its webhook integration.
- One or more photos for a day should be easy to submit through a Telegram bot.

### Daily experience

- A day can contain multiple source journals and multiple real photos.
- The product creates an attractive daily presentation with a concise summary and the detailed voice-journal text.
- If journal content exists but no real photo was supplied, the product creates a journal-inspired AI image for that day.
- Selecting a day reveals its images, summary, and detailed source journals.

### Browsing experience

- The primary overview is a beautiful, image-led calendar.
- Each populated date should visually recall that day.
- The experience should make it pleasant to look back over the user's life.

### Delivery context

- Host on Arun's Hetzner server.
- Publish under a new subdomain of `arunp.in` through Cloudflare.
- Draw feature and interaction inspiration from Rosebud, Five Minute Journal, Daypix (the app currently published under the supplied `simple.diary` package), and Day One.

## Discovery status

This brief preserves the original intent. Settled decisions, current open questions, and canonical language now live in `docs/discovery/REQUIREMENTS.md` and `CONTEXT.md`; implementation remains gated on completion of the grilling rounds and Arun's explicit shared-understanding confirmation.
