/**
 * data.js — Training plan content.
 *
 * Exports (as globals):
 *   YT(url, title, channel) → HTML string for a YouTube link card.
 *   DAYS[]                  → Array of day objects consumed by app.js.
 *
 * Each day object:
 *   { id, tab, name, focus, duration, notes?, isRest?, exercises[] }
 *
 * Each exercise object:
 *   { name, rx, n (1=new), why, cues, prog, vi? (visual key), yt? (html),
 *     unit?, recommended?, step?, track?,
 *     timer?: { rounds, work, rest, workLabel?, restLabel? } }
 *
 *   recommended  → pre-filled default value shown in the stepper
 *   step         → stepper increment (2.5 for kg, 1 for reps, 5 for sec)
 *   track:false  → hides the tracker entirely (mobility/warmup work)
 *   timer        → if present, a start/pause interval timer appears in the card.
 *                   work/rest are in seconds; workLabel/restLabel are display text.
 */

// ── YouTube link builder ───────────────────────────────────────────────────

function YT(url, title, channel) {
  let videoId = '';
  if (url.includes('v=')) {
    videoId = url.split('v=')[1].split('&')[0];
  }
  if (!videoId) return '';

  return `<div class="video-wrapper">
    <div class="video-container">
      <iframe class="inline-video" loading="lazy" src="https://www.youtube-nocookie.com/embed/${videoId}" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
    <div class="video-caption">
      <div class="video-title">${title}</div>
      <div class="video-channel">via ${channel}</div>
    </div>
  </div>`;
}

// ── Training plan data ─────────────────────────────────────────────────────

const DAYS = [
  {
    id: 'mon', tab: 'Mon', name: 'Monday',
    focus: 'Upper Push + Power', duration: '~55 min',
    notes: 'Tempo: 3s eccentric on bench, 1s pause on chest, explode up. '
         + 'W1: 77.5 kg · W2: 80 kg · W3: 82.5 kg. '
         + 'Plyo push-ups: stay low-rep — power, not fatigue.',
    exercises: [
      {
        name: 'Kettlebell Halo', rx: '2 × 12 each direction', n: 0,
        track: false,
        why: 'Warms up shoulders and thoracic spine.',
        cues: 'Keep elbows tight. Circle close to head. Engage core.',
        prog: 'Move to 24 kg when 12 reps feel easy.',
        yt: YT('https://youtube.com/watch?v=13SFATc-mJ4', 'How to perform the Kettlebell Halo', 'Coach Gabe West'),
      },
      {
        name: 'Bench Press', rx: '4 × 6 @ RPE 7–8', n: 0,
        unit: 'kg', recommended: 72.5, step: 2.5,
        why: 'Primary horizontal push. Tempo-controlled for tendon health.',
        cues: '3s eccentric, 1s pause on chest, explode up. Retract shoulder blades. Feet flat.',
        prog: 'W1: 72.5 kg → W2: 75 kg → W3: 77.5 kg. Add 2.5 kg when all 4 sets hit 6 reps @ RPE 7.',
        yt: YT('https://www.youtube.com/watch?v=rT7DgCr-3pg', 'Bench Press Proper Form', 'Jeff Nippard'),
      },
      {
        name: 'Plyometric Push-Ups', rx: '3 × 5', n: 1,
        unit: 'reps', recommended: 5, step: 1,
        why: 'Power declines ~2× faster than strength after 40. Low-rep explosive work counters this directly.',
        cues: 'Hands leave ground. Land soft with slight elbow bend. Full reset between reps. No bouncing.',
        prog: 'Standard → clap → double clap. Stay at 3×5, never grind reps.',
        yt: YT('https://youtube.com/watch?v=FFlAcBTd_K0', 'Home Workout | Pushups Only', 'THENX'),
      },
      {
        name: 'Ring Dips', rx: '3 × 8', n: 1,
        unit: 'reps', recommended: 8, step: 1,
        why: 'Rings let wrists rotate — more shoulder-friendly. Adds stabilizer demand.',
        cues: 'Turn rings out slightly at top (RTO). 2s descent minimum. Full lockout.',
        prog: 'BW 3×8 → BW 3×10 → +5 kg vest → work back to 3×10.',
        yt: YT('https://youtube.com/watch?v=AdUfoCj3COQ', 'Rings For Beginners Made Easy (BEST EXERCISES!)', 'FitnessFAQs'),
      },
      {
        name: 'Floor Press', rx: '3 × 10', n: 1,
        unit: 'kg', recommended: 28, step: 2.5,
        why: 'Limits ROM to protect shoulders, overloads triceps. Great for 50+.',
        cues: 'Elbows touch ground gently each rep. No bouncing. 2 × 28 kg dumbbells.',
        prog: '+2.5 kg per DB when all sets hit 10.',
        yt: YT('https://youtube.com/watch?v=ptpmRrzRtWQ', 'The Fastest Way To Blow Up Your Bench Press', 'Jeff Nippard'),
      },
      {
        name: 'Heavy Rope Finisher', rx: '6 × 60s max sprint / 15s off (~7.5 min total)', n: 0,
        track: false,
        timer: { rounds: 6, work: 60, rest: 15, workLabel: 'SPRINT', restLabel: 'REST' },
        why: '40s/20s is too easy for 6k+ rope endurance. Lengthened sprint and shortened rest creates real lactic challenge.',
        cues: 'Max consistent rhythm each interval. Double-unders if available.',
        prog: '6×60s/15s → 6×75s/15s → 8×60s/15s.',
        yt: YT('https://www.youtube.com/watch?v=OwxPc_ziQzo', 'Heavy Jump Rope Form', 'Crossrope'),
      },
    ],
  },

  {
    id: 'tue', tab: 'Tue', name: 'Tuesday',
    focus: 'Rowing Engine + Core & Mobility', duration: '~50 min',
    notes: 'Fartlek rowing: 1 min max sprint every 5 min. Damper 5–6. Stroke rate 26–28 spm. '
         + 'Target 7,000 m over 30 min. Mobility is non-negotiable.',
    exercises: [
      {
        name: '30 Min Rowing', rx: '30 min continuous: 1 min max sprint every 5 min', n: 0,
        unit: 'km', recommended: 7, step: 0.1,
        why: 'Fartlek-style interval training. Builds VO2 max during sprints, aerobic base during recovery.',
        cues: 'Hit true max power for 1 minute. Slow down but stay in motion for 4-minute active recovery.',
        prog: 'Increase your total distance logged over the full 30 minutes. 7 km is an elite benchmark at 91 kg / 1.93 m.',
        yt: YT('https://www.youtube.com/watch?v=zQ82RYIFLN8', '500m Row Intervals', 'Dark Horse Rowing'),
      },
      {
        name: 'Kettlebell Halo', rx: '2 × 10 each direction', n: 0,
        track: false,
        why: 'Active recovery. Mobilizes shoulders.',
        cues: 'Slow and controlled.',
        prog: 'Use 24 kg when easy.',
        yt: YT('https://youtube.com/watch?v=13SFATc-mJ4', 'How to perform the Kettlebell Halo', 'Coach Gabe West'),
      },
      {
        name: 'Dead Hang', rx: '3 × 45 sec (~4 min with rest)', n: 1,
        unit: 'sec', recommended: 45, step: 5,
        timer: { rounds: 3, work: 45, rest: 60, workLabel: 'HANG', restLabel: 'REST' },
        why: 'Decompresses spine after rowing. Builds grip. Shoulder health.',
        cues: 'Fully relax — let gravity stretch you. Shoulders by ears is fine (passive). Breathe deeply. No squirming.',
        prog: '45s → 60s → 75s → single-arm assisted (20s each).',
        yt: YT('https://youtube.com/watch?v=M25ibDAVhMQ', 'How Dead Hangs Improve Your Life', 'Minus The Gym'),
      },
      {
        name: 'L-Sit Progression', rx: '3 × 15–20 sec hold (~3 min with rest)', n: 1,
        unit: 'sec', recommended: 15, step: 5,
        timer: { rounds: 3, work: 15, rest: 60, workLabel: 'HOLD', restLabel: 'REST' },
        why: 'Deep core that sit-ups never reach. Hip flexor strength.',
        cues: 'Parallettes or dip bars. Push shoulders down hard. Tuck knees first if needed.',
        prog: 'Tuck 20s → one leg extended 15s → full L-sit. At 1.93 m, tuck is fine — longer levers.',
        yt: YT('https://www.youtube.com/watch?v=IUZJoSP66HI', 'L-Sit Progressions', 'FitnessFAQs'),
      },
      {
        name: 'Pallof Press', rx: '3 × 10 each side', n: 1,
        unit: 'kg', recommended: 15, step: 2.5,
        why: "Anti-rotation core. Trains resisting movement — core's actual job.",
        cues: "Cable at chest height (~130 cm). Press out, hold 2s, return. Don't rotate.",
        prog: 'Increase 2.5 kg when 10 reps × 2s hold feels easy.',
        yt: YT('https://www.youtube.com/watch?v=AH_QZLm_0-s', 'Pallof Press — Best Core Exercise', 'ATHLEAN-X'),
      },
      {
        name: '90/90 Hip Stretch', rx: '2 min each side', n: 1,
        track: false,
        why: 'Hip mobility degrades silently after 40. Best stretch for rotation.',
        cues: 'Front shin parallel to shoulders. Both knees 90°. Sit tall, lean forward gently.',
        prog: 'Add rotation. Forward fold over front shin.',
        yt: YT('https://youtube.com/watch?v=BNWLBuohUGQ', 'Top 3 Hip Mobility Openers', 'Squat University'),
      },
    ],
  },

  {
    id: 'wed', tab: 'Wed', name: 'Wednesday',
    focus: 'HIIT Complexes', duration: '~40 min',
    notes: 'Quality over volume. Form breaks = stop. 3 complexes × 3 rounds. 2 min rest between complexes.',
    exercises: [
      {
        name: 'Complex A: Rope (2 lb) & Burpee', rx: '4 rds: 40s 2lb rope → 10 burpees → 20s rest (~6-7 min)', n: 1,
        track: false,
        timer: { rounds: 4, work: 40, rest: 20, workLabel: 'ROPE', restLabel: 'BURPEES' },
        why: 'Shifts stimulus from endurance to massive upper-body/lat pre-exhaustion before burpees.',
        cues: 'Keep wrists strong. Drive rotation from lats. Don\'t let 2lb rope pull you out of posture.',
        prog: '+5s rope per round. Then +2 burpees.',
        yt: YT('https://www.youtube.com/watch?v=TUdZq_2bXyU', 'How To Do A Burpee', 'CrossFit'),
      },
      {
        name: 'Complex B: KB Circuit', rx: '3 rds: 5 C&P ea. → 12 swings → 5 goblet sq. (2s pause) (~5–6 min)', n: 1,
        unit: 'kg', recommended: 20, step: 4,
        why: 'Clean & press = full-body power, easier on wrists than barbell cleans.',
        cues: "Clean: rack bell smoothly, don't bang forearm. Press: full lockout. Swings: snap hips.",
        prog: '20 kg → 24 kg for all movements when C&P feels solid. Then +2 reps each.',
        yt: YT('https://youtube.com/watch?v=eaQPi0LDoE0', 'Learn in 1 minute - KB Clean & Press', 'Mark Wildman'),
      },
      {
        name: 'Complex C: Bodyweight', rx: '3 rds: 5 exp. pull-ups → 10 Hindu PU → 10 jump squats (~6 min)', n: 1,
        track: false,
        why: 'Hindu push-ups combine shoulder mobility with pressing — wrestling conditioning staple.',
        cues: 'Pull-ups: pull fast, clear the bar. Hindu PU: down dog → swoop chest through → cobra → reverse.',
        prog: 'Pull-ups → chest-to-bar → muscle-up negatives. Hindu PU: slow swoop to 3s.',
        yt: YT('https://youtube.com/watch?v=lTzaiPM82Ps', 'Hindu Pushups: A Brief How-To Guide', 'Aleks Salkin'),
      },
    ],
  },

  {
    id: 'thu', tab: 'Thu', name: 'Thursday',
    focus: 'Upper Pull + Skill Work', duration: '~65 min',
    notes: 'Scapular pull-ups first — always. Face pulls are the most important exercise here for shoulder longevity. '
         + 'High-knee rope Fartlek fills the mid-week cardio gap — keep it fast and aggressive.',
    exercises: [
      {
        name: 'Scapular Pull-Ups', rx: '2 × 10', n: 1,
        unit: 'reps', recommended: 10, step: 1,
        why: 'Activates lower traps + serratus. Shoulder insurance before heavy pulling.',
        cues: 'Hang with straight arms. Retract + depress shoulder blades — rise a few inches without bending elbows. Hold 1s at top.',
        prog: 'Add 3s hold at top. Then single-arm assisted.',
        yt: YT('https://youtube.com/watch?v=9M8ylnbriB0', 'Simple Scap Pull-up Tutorial', 'livfitkarl'),
      },
      {
        name: 'Weighted Pull-Ups', rx: '4 × 5 @ RPE 7–8', n: 0,
        unit: 'kg', recommended: 7.5, step: 2.5,
        why: 'At 12 BW reps, adding weight is the next stimulus. Will push BW max back toward 18.',
        cues: 'Full dead hang at bottom. Chin clearly over bar. 2s descent minimum.',
        prog: 'W1: +7.5 kg → W2: +10 kg → W3: +12.5 kg. 8-week target: +15 kg × 5.',
        yt: YT('https://www.youtube.com/watch?v=eGo4IYlbE5g', 'Weighted Pull-Up Progression', 'Jeremy Ethier'),
      },
      {
        name: 'Archer Pull-Ups', rx: '3 × 3 each side', n: 1,
        unit: 'reps', recommended: 3, step: 1,
        why: 'Bridge between regular and one-arm pull-ups. Unilateral pulling at 91 kg is demanding.',
        cues: 'Wide grip. Pull toward one hand while other arm straightens fully. Alternate sides. Control negative.',
        prog: '3×3 → 3×4 → 3×5 → typewriter pull-ups.',
        yt: YT('https://youtube.com/watch?v=6qtY8j92gA8', 'How-To: Archer Pull-Up [5 Progression Tutorial]', 'Pullup & Dip'),
      },
      {
        name: 'Curls', rx: '3 × 10', n: 0,
        unit: 'kg', recommended: 30, step: 2,
        why: 'Bicep strength supports all pulling and protects elbow joints.',
        cues: 'Straight or EZ bar, 30 kg. Full range. No swinging — if momentum needed, weight is too heavy.',
        prog: 'Alternate barbell / dumbbell (14 kg each) / hammer curls across weeks.',
        yt: YT('https://www.youtube.com/watch?v=ykJmrZ5v0Oo', 'How To Bicep Curl', 'Jeff Nippard'),
      },
      {
        name: 'Face Pulls', rx: '3 × 15', n: 1,
        unit: 'kg', recommended: 12.5, step: 2.5,
        why: 'Rear delts + external rotators. #1 exercise for shoulder longevity that most people skip.',
        cues: 'Rope at face height (~170 cm). Pull rope to ears, externally rotate — thumbs point backward. Squeeze 2s.',
        prog: '+2.5 kg when 15 reps with 2s hold feel easy. Start lighter than ego says.',
        yt: YT('https://www.youtube.com/watch?v=rep-qVOkqgk', 'Face Pulls Done Right', 'Jeff Nippard'),
      },
      {
        name: 'Skin the Cat', rx: '3 × 3, as slow as possible', n: 1,
        unit: 'reps', recommended: 3, step: 1,
        why: 'Bulletproof shoulders through full ROM. Outstanding for mobility and strength.',
        cues: 'Tuck knees, rotate backward. Start with first half only (to German hang). Only go as far as comfortable. SLOW.',
        prog: 'Tuck → straight legs → pause in German hang 5s → full rotation.',
        yt: YT('https://youtube.com/watch?v=QHnpUcVwZOk', 'How to Skin the Cat', 'The Movement Collective'),
      },
      {
        name: 'High-Knee Rope Fartlek', rx: '6 × 60s max-effort high knees / 30s easy step (~9 min total)', n: 1,
        track: false,
        timer: { rounds: 6, work: 60, rest: 30, workLabel: 'HIGH KNEES', restLabel: 'EASY STEP' },
        why: 'Fills the mid-week Fartlek gap. High-knee sprint maximises hip flexor recruitment and VO2 stimulus '
           + 'without the joint load of running. Short blocks keep quality high after heavy pulling.',
        cues: 'Drive knees to hip height — not shuffling, genuinely high. Max cadence on the sprint phase. '
            + 'Easy single-bounce step on recovery. Reset posture before each sprint.',
        prog: '6 × 60s/30s → 8 × 60s/30s → add double-unders on sprint phase.',
        yt: YT('https://www.youtube.com/watch?v=FS6TsXFPGSM', 'Jump Rope High Knees — Benefits & Form', 'Jump Rope Dudes'),
      },
      {
        name: 'Rope Skipping Cooldown', rx: '5 min, easy pace', n: 0,
        track: false,
        why: 'Active recovery. Brings heart rate down gradually.',
        cues: 'Zone 1 — conversational pace. Rhythm focus. Not a workout.',
        prog: 'Stays easy.',
        yt: YT('https://www.youtube.com/watch?v=FJmRQ5iZXxg', 'Jump Rope Basics For Beginners', 'Jump Rope Dudes'),
      },
    ],
  },

  {
    id: 'fri', tab: 'Fri', name: 'Friday',
    focus: 'Lower Body + Conditioning', duration: '~50 min',
    notes: "Nordic curls will humble you at 91 kg — that's the point. Aim 3s negative, build to 5s. "
         + 'Bulgarians: long femurs (1.93 m) make this harder — start lighter than ego says.',
    exercises: [
      {
        name: 'KB Goblet Squat', rx: '4 × 10, 3s pause at bottom', n: 0,
        unit: 'kg', recommended: 24, step: 4,
        why: 'Builds squat depth and strength. Pause eliminates stretch reflex and forces honest reps.',
        cues: 'KB at chest. Elbows inside knees at bottom. 3s pause in the hole. Drive up through heels.',
        prog: '24 kg × 10 pause → 24 kg × 12 pause → double KB front squat.',
        yt: YT('https://www.youtube.com/watch?v=MeIiIdhvXT4', 'Goblet Squat Form', 'Squat University'),
      },
      {
        name: 'Bulgarian Split Squat', rx: '3 × 8 each leg', n: 1,
        unit: 'kg', recommended: 14, step: 2,
        why: 'Single-leg strength builder. Exposes and fixes imbalances. More knee-friendly than heavy barbell squats for 45+.',
        cues: 'Rear foot on bench, shoelaces down. Front shin roughly vertical. 2 × 14 kg dumbbells.',
        prog: 'BW → 2×14 kg DB → 2×18 kg DB → 2×22 kg DB → add deficit (front foot elevated).',
        yt: YT('https://www.youtube.com/watch?v=2C-uNgKwPLE', 'Bulgarian Split Squat', 'Jeff Nippard'),
      },
      {
        name: 'Kettlebell Swing', rx: '4 × 15, Russian style (eye level)', n: 0,
        unit: 'kg', recommended: 24, step: 4,
        why: 'Posterior chain power. Hip hinge builds glutes and hamstrings explosively.',
        cues: 'Swing to eye level. Snap hips — arms just along for the ride. Squeeze glutes at top.',
        prog: '24 kg × 15 → 24 kg × 20 → single-arm 20 kg.',
        yt: YT('https://www.youtube.com/watch?v=YSxHifyI6s8', 'KB Swing Mistakes', 'Mark Wildman'),
      },
      {
        name: 'Nordic Curl Negative', rx: '3 × 5, 5s descent per rep (~4 min total)', n: 1,
        unit: 'sec', recommended: 3, step: 1,
        why: "Best hamstring exercise that exists. Dramatically reduces injury risk. Eccentric-only initially.",
        cues: 'Kneel on pad, anchor feet under barbell. Lower as slowly as possible. Catch with hands at bottom.',
        prog: '3s negative → 5s → 8s → half-range concentric → full Nordic curl.',
        yt: YT('https://youtube.com/watch?v=_e9vFU9-tkc', 'How to Set Up, Perform, & Program Nordic Hamstring Curls', 'E3 Rehab'),
      },
      {
        name: 'Calf Raises', rx: '3 × 15, slow tempo', n: 0,
        unit: 'reps', recommended: 15, step: 1,
        why: 'Calf + Achilles tendon health. Slow tempo loads tendon properly.',
        cues: 'Full stretch at bottom (2s). Full contraction at top (2s hold). Off a step for extra range.',
        prog: 'Double leg → single leg → add weight → off a step.',
        yt: YT('https://www.youtube.com/watch?v=-M4-G8p8fmc', 'How To Build Calves', 'Jeff Nippard'),
      },
      {
        name: '45 Min Elliptical', rx: '45 min continuous: Level 22 base OR ladder up/down', n: 0,
        unit: 'level', recommended: 22, step: 1,
        why: 'Low-impact Fartlek-style training. Builds aerobic engine while sparing joints.',
        cues: 'Use Level 22 as your base. Climb or drop resistance strategically to spike heart rate.',
        prog: 'Increase baseline resistance level or extend duration of high-intensity rungs.',
        yt: YT('https://www.youtube.com/watch?v=A_0uY-eF52g', 'How To Use An Elliptical', 'Planet Fitness'),
      },
    ],
  },

  {
    id: 'sat', tab: 'Sat', name: 'Saturday',
    focus: 'Long Aerobic + Movement Quality', duration: '~50–60 min',
    notes: 'Zone 2 HR: 130–140 bpm. Resist the urge to push intensity. This is aerobic maintenance + skill day.',
    exercises: [
      {
        name: '1-Hour Rope & Burpee Fartlek', rx: '60 min skipping: 8 sets of 20 burpees (alternate heavy/normal rope blks)', n: 0,
        unit: 'reps', recommended: 15, step: 1,
        why: 'Advanced Fartlek. Builds stamina + VO2 max by spiking heart rate with burpees during aerobic baseline.',
        cues: 'Maintain steady skipping rhythm. Push hard during burpee sets to spike HR, then use skipping as active recovery.',
        prog: 'Increase burpees per set or speed of skipping recovery.',
        yt: YT('https://www.youtube.com/watch?v=TUdZq_2bXyU', 'How To Do A Burpee', 'CrossFit'),
      },
      {
        name: 'Turkish Get-Up', rx: '3 × 2 each side', n: 1,
        unit: 'kg', recommended: 12, step: 4,
        why: 'Floor→standing with weight overhead. Tests and builds everything: shoulder, hip, core, balance.',
        cues: 'Eye on KB always. Every position = pause. No rushing. Learn all 7 positions before loading up.',
        prog: 'Empty hand → shoe on fist → 12 kg → 16 → 20 → 24 kg (¼ bodyweight).',
        yt: YT('https://www.youtube.com/watch?v=0bWRPC49-KI', 'Turkish Get-Up Step by Step', 'StrongFirst'),
      },
      {
        name: 'Handstand Wall Hold', rx: '3 × 20–30 sec (~3 min with rest)', n: 1,
        unit: 'sec', recommended: 20, step: 5,
        timer: { rounds: 3, work: 20, rest: 60, workLabel: 'HOLD', restLabel: 'REST' },
        why: 'Overhead stability, wrist strength, body awareness. Real fall-prevention benefit at 50+.',
        cues: 'Chest facing wall, hands ~15 cm from wall. Squeeze glutes + core. Breathe. Too hard = pike on box.',
        prog: 'Wall hold 30s → toe pulls (one foot off wall) → freestanding → handstand push-up negatives.',
        yt: YT('https://youtube.com/watch?v=r0rLCKvcqnQ', '10 Steps To Handstand!', 'C-RAY'),
      },
      {
        name: 'T-Spine Rotation', rx: '2 min each side', n: 1,
        track: false,
        why: 'Counters desk/age stiffness in mid-back. Opens breathing + overhead.',
        cues: 'Side-lying, knees stacked 90°. Open top arm across body, rotate, follow with eyes.',
        prog: 'Light reach at end. Then quadruped T-spine rotations.',
        yt: YT('https://youtube.com/watch?v=426rzPkx4D8', '10 Min. Thoracic Spine Mobility Routine', 'mobility by julia reppel'),
      },
      {
        name: 'Deep Squat Sit', rx: 'Accumulate 3 min total', n: 1,
        track: false,
        why: 'Best thing for hip/ankle/back mobility. Most adults lose it by 40.',
        cues: 'Heels down (5 kg plates under heels if needed). Hold something for balance. Shift weight. Relax.',
        prog: 'Assisted → free → hold KB at chest → Cossack squat transitions.',
        yt: YT('https://youtube.com/watch?v=BTfEFDXp-cw', 'Improve Your Squat Mobility Forever (FULL WORKOUT)', 'FitnessFAQs'),
      },
    ],
  },

  {
    id: 'sun', tab: 'Sun', name: 'Sunday',
    focus: 'Rest & Recovery', duration: 'All day',
    isRest: true,
  },
];
