/* Life in Days — the fictional archive
 * PROTOTYPE ARTIFACT. Every name, place, and journal line below is invented.
 * Shared by every milestone prototype. See docs/HANDOVER-M1-M6-UI-DESIGN.md §10.3
 * for why the shape is deliberately uneven rather than a clean grid of samples.
 */

function synthCover(hue, tone, aspect) {
  return { hue, tone, aspect };
}

const AUG = {
  '2026-08-01': { title: 'Two buckets, one leak', journal: 'The tap in the utility room started dripping again around six, right on the concrete where it always pools. I put the old paint bucket under it and forgot the second one until the first had already overflowed onto a stack of newspapers I have been meaning to recycle since March.', photos: [synthCover(24, 'mid', 'landscape'), synthCover(24, 'dark', 'landscape')] },
  '2026-08-02': { title: 'Bougainvillea finally', journal: 'The corner plant put out its first flowers this year, three weeks later than last year and I do not know why. Sat with tea on the step and watched a lizard decide the pot was its now.', photos: [synthCover(340, 'mid', 'portrait')] },
  '2026-08-03': { title: null, journal: null, photos: [synthCover(48, 'light', 'square')] },
  '2026-08-04': { title: 'Long call with Ma', journal: 'She wants to repaint the veranda before Diwali, which is three months off but she has decided this is already late. I said I would come look at colours next weekend. I will not remember to bring the colour cards.', photos: [synthCover(200, 'mid', 'landscape')] },
  '2026-08-05': { title: 'Missed the 7:40', journal: 'Ran for it anyway, out of some reflex, then walked the rest of the way in the heat feeling foolish.', photos: [] },
  '2026-08-06': { title: 'Three kites over the water tank', journal: 'The building committee finally fixed the tank access ladder and within a day the terrace had three kites flying off it, none of them ours. Watched for twenty minutes doing nothing else, which felt like the correct use of a Thursday evening.', photos: [synthCover(196, 'light', 'landscape'), synthCover(210, 'mid', 'portrait'), synthCover(188, 'dark', 'square')] },
  '2026-08-07': null,
  '2026-08-08': { title: 'A useful kind of quiet', journal: 'Nobody rang all morning. I made coffee twice because I forgot the first one on the shelf by the door, and drank it cold at eleven standing up, reading the back of a seed packet I have no intention of planting.', photos: [] },
  '2026-08-09': [
    { title: 'Morning: the market run', journal: 'Out early before the heat, bought too many tomatoes again because the vendor near the signal always undersells the one by the gate and I feel loyal to nobody.', photos: [synthCover(16, 'mid', 'square')] },
    { title: 'Evening: terrace dinner', journal: 'Neighbours brought down chairs and we ate on the terrace until the mosquitoes won. Someone’s radio played the same four songs on loop and nobody minded.', photos: [synthCover(280, 'dark', 'landscape')] }
  ],
  '2026-08-10': { title: 'Fixed the wobbling shelf', journal: 'Four years of sliding a folded matchbook under the left leg and today I finally found the actual screw that had worked loose. Ten minutes with a screwdriver undid four years of matchbooks.', photos: [synthCover(60, 'mid', 'landscape')] },
  '2026-08-11': { title: null, journal: null, photos: [synthCover(32, 'light', 'portrait')] },
  '2026-08-12': null,
  '2026-08-13': { title: 'Late train, empty platform', journal: 'The 9:52 was cancelled without an announcement and I only found out by watching everyone else give up and leave. Stood on an empty platform for a while, which the city almost never lets you do.', photos: Array.from({ length: 12 }, (_, i) => synthCover((258 + i * 11) % 360, i % 3 === 0 ? 'dark' : 'mid', i % 4 === 0 ? 'portrait' : 'landscape')) },
  '2026-08-14': { title: 'Repotted the money plant', journal: 'It had outgrown the jam jar months ago and I kept not dealing with it. New pot is too big, probably, but it can grow into it.', photos: [synthCover(140, 'mid', 'square')] },
  '2026-08-15': { title: 'Independence Day, mostly indoors', journal: 'Watched the flag hoisting from the balcony instead of going down, which felt like a small betrayal of nothing in particular. Read most of a novel I started in June.', photos: [synthCover(4, 'light', 'landscape')] },
  '2026-08-16': { title: 'The ceiling fan finally', journal: 'Called the electrician about the noise three times before he came. Turned out to be one loose blade screw the whole time.', photos: [synthCover(96, 'mid', 'landscape')], corrections: 2 },
  '2026-08-17': { title: 'Sunday market, nothing bought', journal: 'Walked the whole flower market with no intention of buying anything, which is somehow the best way to see it.', photos: [synthCover(320, 'dark', 'square')] },
  '2026-08-18': { title: 'Rewired the desk lamp', journal: 'The old lamp from my grandfather’s study finally stopped flickering once I stopped assuming the bulb was the problem.', photos: [synthCover(50, 'light', 'landscape')] },
  '2026-08-19': { title: 'The long one', journal: 'A day that started ordinary and did not stay that way. I woke up at the usual time, made the usual coffee, and sat by the window for longer than I meant to, watching the crows argue over the neem tree the way they do every monsoon when the fruit starts to drop and rot on the pavement below. There is a particular smell to that, sweet and a little wrong, that I have never gotten used to in eleven years of this flat, and every year I tell myself I will finally ask the society to trim the branch back and every year I do not. The morning went in small errands: the gas cylinder booking that never goes through on the first try, a letter from the bank that turned out to be nothing, a WhatsApp forward from an uncle that I read only because the thumbnail looked alarming and turned out to be a decade-old hoax about salt. I am always a little disappointed when the hoaxes are old ones. It suggests nobody is even trying.\n\nIn the afternoon I finally sat down with the box of my mother’s photographs that has been on top of the cupboard since the move, the one I keep saying I will sort and never do, and today, for no reason I can point to, I actually did. Most of them are unlabelled, which she would find funny given how meticulous she is about everything else, dates written on the back of nothing and years of blank grins from people I half recognise as cousins or family friends whose names have quietly slipped out of the household vocabulary. There is one photograph, though, that stopped me for a long time: my parents on what must be their first flat’s balcony, before I existed, my mother laughing at something outside the frame, my father mid-sentence with his hand still raised from whatever gesture he was making. I do not know who took it. I do not know what was funny. I sat on the floor with that one photograph for what felt like ten minutes and was probably closer to forty, and I did not photograph it or scan it, just looked, which felt like the correct thing to do with it, at least once, before it goes into whatever the sorted version of the box becomes.\n\nBy evening the ordinary day had mostly reasserted itself. I cooked something plain, texted my mother to ask about the balcony photograph and got back only “which one” and a laughing emoji, which is a complete answer in its own way. The crows had gone quiet by the time I went to close the windows against the evening rain that never quite arrived, just hung there over the building making everything smell like it was about to. I wrote most of this standing at the kitchen counter because sitting down felt like it would end the day faster than I wanted it to end.', photos: [] },
  '2026-08-20': { title: 'Bought the wrong rice again', journal: 'Third time this year getting the parboiled instead of the raw. I am clearly not reading the sack, only the brand.', photos: [synthCover(80, 'light', 'square')] },
  '2026-08-21': { title: 'Ordinary Friday', journal: 'Worked from the kitchen table because the desk had become a filing surface again. Nothing remarkable, which some weeks is the whole point.', photos: [synthCover(170, 'mid', 'landscape')] }
};

const JUL = {
  '2026-07-04': { title: 'First rain of the season', journal: 'The smell hit before the first drop did, that particular hot-pavement smell that means the monsoon has actually arrived and is not just threatening again.', photos: [synthCover(210, 'dark', 'landscape')] },
  '2026-07-11': { title: 'Cleaned the fridge, finally', journal: 'Found a jar of pickle from a New Year that was not this one.', photos: [] },
  '2026-07-19': { title: null, journal: null, photos: [synthCover(150, 'mid', 'square')] },
  '2026-07-26': { title: 'Cousin’s wedding, day two', journal: 'Danced badly, ate well, left the phone in a coat pocket the whole night, which I recommend.', photos: [synthCover(310, 'light', 'portrait'), synthCover(300, 'mid', 'landscape')] }
};

const JUN_SINGLE = {
  '2026-06-14': { title: 'One quiet Sunday', journal: 'Nothing happened and I wrote it down anyway.', photos: [synthCover(180, 'mid', 'landscape')] }
};

function expand(monthDays) {
  const out = {};
  for (const [date, value] of Object.entries(monthDays)) {
    if (value == null) continue;
    out[date] = Array.isArray(value) ? value : [value];
  }
  return out;
}

window.LID_FIXTURES = {
  today: '2026-08-21',
  months: {
    '2026-06': { label: 'June 2026', days: expand(JUN_SINGLE) },
    '2026-07': { label: 'July 2026', days: expand(JUL) },
    '2026-08': { label: 'August 2026', days: expand(AUG) },
    '2026-09': { label: 'September 2026', days: {} }
  },
  needsDateReview: [
    { id: 'ndr-1', filename: 'IMG_2091.HEIC', uploadedAt: '2026-08-19T14:02:00+05:30', note: 'No timestamp in file metadata' },
    { id: 'ndr-2', filename: 'IMG_2092.HEIC', uploadedAt: '2026-08-19T14:02:00+05:30', note: 'No timestamp in file metadata' }
  ],
  trash: [
    { id: 'trash-1', title: 'Duplicate upload, 3 Aug', daysRemaining: 28 },
    { id: 'trash-2', title: 'Wrong Journal Date, corrected', daysRemaining: 12 },
    { id: 'trash-3', title: 'Test upload', daysRemaining: 1 }
  ]
};

window.LID_FIXTURES.singleDayMonth = { label: 'August 2026', days: { '2026-08-08': expand(AUG)['2026-08-08'] } };
