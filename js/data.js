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
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  } else if (url.includes('/shorts/')) {
    videoId = url.split('/shorts/')[1].split('?')[0];
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
    focus: 'Upper Push + Power', duration: '~78 min',
    notes: 'Warm-up before explosive work. Added 18 min Zone 2 conditioning after the rope finisher to build aerobic base without adding training stress. '
         + 'Tempo (Bench): 3s eccentric, 1s pause, explode up.',
    exercises: [
      { name: 'Warm-Up Block (~7 min)', isHeader: true },
      {
        name: 'Easy Rope Skipping (Warm-Up)', rx: '5 min, Zone 1, conversational pace', n: 1,
        track: false,
        why: 'Cold-starting plyo push-ups at 91 kg and 51 years old is asking for trouble. Gets blood into shoulders, wrists, and pecs before loading.',
        cues: 'Nice, easy rhythm to loosen up.',
        prog: 'Keep it conversational.',
        yt: YT('https://www.youtube.com/watch?v=kDOGb9C5kp0', 'Jump Rope Basics For Beginners', 'Jump Rope Dudes'),
      },
      {
        name: 'Kettlebell Halo', rx: '2 × 12 each direction', n: 0,
        track: false,
        why: 'Warms up shoulders and thoracic spine.',
        cues: 'Keep elbows tight. Circle close to head. Engage core.',
        prog: 'Move to 24 kg when 12 reps feel easy.',
        yt: YT('https://youtube.com/watch?v=13SFATc-mJ4', 'How to perform the Kettlebell Halo', 'Coach Gabe West'),
      },
      { name: 'Strength + Power Block (~25 min)', isHeader: true },
      {
        name: 'Bench Press', rx: '4 × 6 @ RPE 7–8', n: 0,
        unit: 'kg', recommended: 72.5, step: 2.5,
        why: 'Primary horizontal push. Tempo-controlled for tendon health.',
        cues: '3s eccentric, 1s pause on chest, explode up. Retract shoulder blades. Feet flat.',
        prog: 'W1: 72.5 kg → W2: 75 kg → W3: 77.5 kg. Add 2.5 kg when all 4 sets hit 6 reps @ RPE 7.',
        yt: YT('https://www.youtube.com/watch?v=vcBig73ojpE', 'Bench Press Proper Form', 'Jeff Nippard'),
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
        name: 'Seated DB Overhead Press', rx: '3 × 10', n: 1,
        unit: 'kg', recommended: 18, step: 2.5,
        why: 'Monday had zero vertical push. Overhead pressing fills that plane, builds lateral and anterior deltoids in ways bench never touches, and supports long-term shoulder health. Seated keeps lumbar stress low.',
        cues: 'Back upright against bench. Press directly overhead — not forward. Elbows at ~75° (not flared 90°). Full lockout at top, lower to ear height.',
        prog: '+2.5 kg per DB when 3×10 feels controlled. Start conservative — overhead is humbling after heavy bench.',
        yt: YT('https://www.youtube.com/watch?v=e4GP9M687zY', 'Seated Dumbbell Press: Gym Shorts (How To)', 'Barbell Logic'),
      },
      { name: 'Finisher + Conditioning (~26 min)', isHeader: true },
      {
        name: 'Heavy Rope Finisher', rx: '6 × 60s max sprint / 15s off (~7.5 min total)', n: 0,
        track: false,
        timer: { rounds: 6, work: 60, rest: 15, workLabel: 'SPRINT', restLabel: 'REST' },
        why: '40s/20s is too easy for 6k+ rope endurance. Lengthened sprint and shortened rest creates real lactic challenge.',
        cues: 'Max consistent rhythm each interval. Double-unders if available.',
        prog: '6×60s/15s → 6×75s/15s → 8×60s/15s.',
        yt: YT('https://www.youtube.com/watch?v=y9WO4G9sxtI', 'Heavy Jump Rope Form', 'Crossrope'),
      },
      {
        name: 'Zone 2 Cooldown', rx: '18 min easy rope skipping or assault bike', n: 1,
        track: false,
        why: 'Post-lactic Zone 2 work is one of the most efficient ways to build aerobic base. Capitalizes on elevated HR.',
        cues: 'Easy enough to hold a conversation. HR 130–140 bpm. Single bounce if rope, steady cadence if bike.',
        prog: 'Extend to 20 min, then 25 min if time allows.',
        yt: YT('https://www.youtube.com/watch?v=kDOGb9C5kp0', 'Jump Rope Basics For Beginners', 'Jump Rope Dudes'),
      },
    ],
  },

  {
    id: 'tue', tab: 'Tue', name: 'Tuesday',
    focus: 'HIIT Complexes + Core', duration: '~81 min',
    notes: 'Expanded session. Now includes proper on-ramp, core circuit, steady-state rowing, and cooldown. '
         + 'Format: 3 complexes, 3-4 rounds each, 2 min rest between complexes.',
    exercises: [
      { name: 'Warm-Up Block (~8 min)', isHeader: true },
      {
        name: 'KB Halo (Warm-Up)', rx: '2 × 8 each direction', n: 0,
        unit: 'kg', recommended: 20, step: 4,
        track: true,
        why: 'Prepare shoulders before heavy pulling/swinging. Calibration: 20kg used to ensure 8 reps each side.',
        cues: 'Keep elbows tight. Circle close to head. Engage core.',
        prog: 'Controlled movement.',
        yt: YT('https://youtube.com/watch?v=13SFATc-mJ4', 'How to perform the Kettlebell Halo', 'Coach Gabe West'),
      },
      {
        name: 'Easy Rope Skipping (Warm-Up)', rx: '5 min, Zone 1, conversational pace', n: 1,
        track: false,
        why: 'Warming up shoulders, wrists, and ankles before explosive jumps and power rope is non-negotiable.',
        cues: 'Nice, easy rhythm to loosen up.',
        prog: 'Keep it conversational.',
        yt: YT('https://www.youtube.com/watch?v=kDOGb9C5kp0', 'Jump Rope Basics For Beginners', 'Jump Rope Dudes'),
      },
      { name: 'Complexes Block (~32 min)', isHeader: true },
      {
        name: 'Complex A: Rope (2 lb) & Burpee (~7 min)', rx: '4 rds: 40s rope → 20s ready → 10 burpees → 20s rest', n: 1,
        track: false,
        timer: { 
          rounds: 4, work: 40, trans: 20, rest: 20, rest2: 20,
          workLabel: 'ROPE', transLabel: 'READY', restLabel: 'BURPEES', rest2Label: 'REST' 
        },
        why: 'Shifts stimulus from endurance to massive upper-body/lat pre-exhaustion before burpees.',
        cues: 'Keep wrists strong. Drive rotation from lats. Don\'t let 2lb rope pull you out of posture.',
        prog: '+5s rope per round. Then +2 burpees.',
        yt: YT('https://www.youtube.com/watch?v=y9WO4G9sxtI', 'Heavy Rope Form', 'Crossrope') + YT('https://www.youtube.com/watch?v=auBLPXO8Fww', 'The Burpee', 'CrossFit'),
      },
      {
        name: 'Complex B: KB Circuit (~6 min)', rx: '3 rds: 5 C&P ea. → 12 swings → 5 goblet sq. (2s pause)', n: 1,
        unit: 'kg', recommended: 20, step: 4,
        why: 'Clean & press = full-body power. The goblet squats serve double duty as a second weekly lower-body touchpoint.',
        cues: 'Clean: rack bell smoothly. Press: full lockout. Swings: snap hips. Squats: Emphasize depth and pause.',
        prog: '20 kg → 24 kg for all movements when C&P feels solid. Then +2 reps each.',
        yt: YT('https://www.youtube.com/watch?v=eaQPi0LDoE0', 'KB Clean & Press', 'Mark Wildman') + YT('https://www.youtube.com/watch?v=K83RM7H9WrY', 'KB Swing Form', 'Squat University') + YT('https://www.youtube.com/watch?v=lRYBbchqxtI', 'Goblet Squat Form', 'Squat University'),
      },
      {
        name: 'Complex C: Power Circuit (~5 min)', rx: '3 rds: 5 exp. pull-ups → 10 Hindu PU → 10 jump squats (2x10kg)', n: 1,
        unit: 'kg', recommended: 10, step: 2.5,
        track: true,
        why: 'Explosive upper body and lower body power conditioning. Added load to jump squats for progression.',
        cues: 'Jump Squats: 10kg DB in each hand. Pull-ups: pull fast, clear the bar. Hindu PU: swooping motion.',
        prog: 'Pull-ups → chest-to-bar. Jump Squats: 10kg → 12kg.',
        yt: YT('https://www.youtube.com/watch?v=72t8p_xq7lo', '3 BEST Exercises for EXPLOSIVE PULL-UPS', 'FitnessFAQs') + YT('https://www.youtube.com/watch?v=lTzaiPM82Ps', 'Hindu Pushups', 'Aleks Salkin') + YT('https://www.youtube.com/watch?v=mnbG9lKTYMo', 'Jumping Squats', 'CrossFit'),
      },
      { name: 'Core Circuit (~8 min)', isHeader: true },
      {
        name: 'Hanging Knee Raises', rx: '3 × 10, controlled', n: 1,
        unit: 'reps', recommended: 10, step: 1,
        why: 'Dynamic core flexion complements Wednesday\'s anti-movement core work. Decompresses spine.',
        cues: 'Knees to chest, 1s hold at top, 2s lower. No swinging.',
        prog: 'Knee raises → straight leg raises → toes to bar.',
        yt: YT('https://www.youtube.com/watch?v=X-ACS9vpRyU', 'Hanging Knee Raises Tutorial', 'Tutorial'),
      },
      {
        name: 'Hollow Body Hold', rx: '3 × 20s hold', n: 1,
        unit: 'sec', recommended: 20, step: 5,
        timer: { rounds: 3, work: 20, rest: 40, workLabel: 'HOLD', restLabel: 'REST' },
        why: 'Full-body anterior chain tension. Transfers to handstand holds, L-sits, and ring work.',
        cues: 'Lower back pressed into floor. Arms overhead, legs extended, toes pointed. Bend knees if too hard.',
        prog: '20s → 30s → 40s → add light ankle weights.',
        yt: YT('https://www.youtube.com/watch?v=uZqTUwq96iU', 'Hollow Body Hold', 'FitnessFAQs'),
      },
      { name: 'Steady-State Conditioning (~20 min)', isHeader: true },
      {
        name: 'Steady-State Rowing', rx: '20 min, Zone 2, ~2:05–2:10/500m pace', n: 1,
        unit: 'min', recommended: 20, step: 1,
        why: 'Post-HIIT aerobic work is excellent for recovery and aerobic development. HR is already elevated.',
        cues: 'Long strokes, controlled breathing. This is NOT another interval — keep it conversational.',
        prog: 'Track total distance. Aim to hold a consistent pace throughout.',
        yt: YT('https://www.youtube.com/watch?v=zQ82RYIFLN8', 'Steady-State Rowing Form', 'Dark Horse Rowing'),
      },
      { name: 'Cooldown (~5 min)', isHeader: true },
      {
        name: 'Easy Rope Skipping (Cooldown)', rx: '5 min, Zone 1', n: 1,
        track: false,
        why: 'Gradual HR reduction. Active recovery for wrists and shoulders after heavy rope complex.',
        cues: 'Active recovery pace.',
        prog: '-',
        yt: YT('https://www.youtube.com/watch?v=kDOGb9C5kp0', 'Jump Rope Basics', 'Jump Rope Dudes'),
      },
    ],
  },

  {
    id: 'wed', tab: 'Wed', name: 'Wednesday',
    focus: 'Rowing Engine + Core & Mobility', duration: '~81 min',
    notes: 'Extended day. Heavy loaded carries and targeted mobility. Remains recovery-biased — nothing explosive, nothing heavy overhead. '
         + 'Fartlek rowing: 1 min max sprint every 5 min (8 sprints total). Damper 5–6.',
    exercises: [
      { name: 'Main Engine Block (~40 min)', isHeader: true },
      {
        name: '40 Min Rowing Fartlek', rx: '40 min continuous: 1 min max sprint every 5 min', n: 0,
        unit: 'km', recommended: 9, step: 0.1,
        why: 'VO2max level sustainable aerobic base-building volume. New target is ~9,000m.',
        cues: 'Hit true max power for 1 minute. Slow down but stay in motion for 4-minute active recovery.',
        prog: 'Increase your total distance logged over the full 40 minutes.',
        yt: YT('https://www.youtube.com/watch?v=zQ82RYIFLN8', '500m Row Intervals', 'Dark Horse Rowing'),
      },
      { name: 'Core & Grip Block (~22 min)', isHeader: true },
      {
        name: 'Kettlebell Halo', rx: '2 × 10 each direction', n: 0,
        track: false,
        why: 'Active recovery. Mobilizes shoulders.',
        cues: 'Slow and controlled.',
        prog: 'Use 24 kg when easy.',
        yt: YT('https://youtube.com/watch?v=13SFATc-mJ4', 'How to perform the Kettlebell Halo', 'Coach Gabe West'),
      },
      {
        name: 'Farmer\'s Walk', rx: '3 × 40m, 60s rest', n: 1,
        unit: 'kg', recommended: 24, step: 4,
        why: 'Low-CNS loaded carry that trains grip, core stability, and posture. Perfect for buffer day.',
        cues: 'Shoulders packed down and back. Walk straight. Don\'t let KBs touch thighs. Breathe.',
        prog: '2×24 kg → 2×28 kg → 2×32 kg. Then extend distance to 60m.',
        yt: YT('https://www.youtube.com/shorts/1uOs1hP3u4A', 'The Best Core Exercise', 'Squat University'),
      },
      {
        name: 'Dead Hang', rx: '3 × 45 sec (~4 min with rest)', n: 1,
        unit: 'sec', recommended: 45, step: 5,
        timer: { rounds: 3, work: 45, rest: 60, workLabel: 'HANG', restLabel: 'REST' },
        why: 'Decompression, not training stimulus. Builds grip. Shoulder health.',
        cues: 'Fully relax — let gravity stretch you. Shoulders by ears is fine (passive). Breathe deeply. No squirming.',
        prog: '45s → 60s → 75s → single-arm assisted (20s each).',
        yt: YT('https://www.youtube.com/watch?v=M25ibDAVhMQ', 'How Dead Hangs Improve Your Life', 'Minus The Gym'),
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
        name: 'Copenhagen Plank', rx: '2 × 20s each side, 45s rest', n: 1,
        unit: 'sec', recommended: 20, step: 5,
        timer: { rounds: 2, work: 20, rest: 45, workLabel: 'HOLD', restLabel: 'REST' },
        why: 'Adductors stabilize the knee during single-leg movements. Isometric prehab.',
        cues: 'Side plank, top leg on bench, bottom leg pulls up to meet bench. If too hard: bend knee on bench.',
        prog: '20s → 30s → 40s. Then straight-leg version if starting bent-knee.',
        yt: YT('https://www.youtube.com/watch?v=YRRnnZsRs9U', 'Copenhagen Plank Tutorial', 'E3 Rehab'),
      },
      { name: 'Mobility & Recovery (~17 min)', isHeader: true },
      {
        name: 'Shoulder Dislocates', rx: '2 × 15, band or dowel', n: 1,
        unit: 'reps', recommended: 15, step: 1,
        why: 'Prepares shoulders for Thursday\'s heavy pulling. Increases overhead mobility gradually.',
        cues: 'Wide grip. Slow controlled arc front to back. If too hard, use a resistance band and grip wider.',
        prog: 'Narrow grip width over weeks. Switch to a band to reduce torque.',
        yt: YT('https://www.youtube.com/watch?v=tunjaSZE7YA', 'Fix Rounded Shoulders', 'FitnessFAQs'),
      },
      {
        name: '90/90 Hip Stretch', rx: '2 min each side', n: 1,
        track: false,
        why: 'Hip mobility degrades silently after 40. Best stretch for rotation.',
        cues: 'Front shin parallel to shoulders. Both knees 90°. Sit tall, lean forward gently.',
        prog: 'Add rotation. Forward fold over front shin.',
        yt: YT('https://www.youtube.com/watch?v=y_6i7nGHAio', '5 Levels of 90/90 Hip Mobility', 'Squat University'),
      },
      {
        name: 'Extended Mobility', rx: '10 min foam rolling or lacrosse ball', n: 1,
        track: false,
        why: 'Focus areas: Lats, T-spine, quads/hip flexors. Use the one session where you have time/low fatigue.',
        cues: 'Breathe into tight spots.',
        prog: 'Explore new areas as needed.',
        yt: YT('https://www.youtube.com/watch?v=426rzPkx4D8', '10 Min. Thoracic Spine Mobility', 'mobility by julia reppel'),
      },
    ],
  },

  {
    id: 'thu', tab: 'Thu', name: 'Thursday',
    focus: 'Upper Pull + Skill', duration: '~74 min',
    notes: 'Proper warm-up added. Dense high-quality pulling volume. Decompression and targeted stretched added to close the session.',
    exercises: [
      { name: 'Warm-Up Block (~7 min)', isHeader: true },
      {
        name: 'Easy Rope Skipping (Warm-Up)', rx: '5 min, Zone 1', n: 1,
        track: false,
        why: 'General blood flow before heavy pulling.',
        cues: '-',
        prog: '-',
        yt: YT('https://www.youtube.com/watch?v=kDOGb9C5kp0', 'Jump Rope Basics', 'Jump Rope Dudes'),
      },
      {
        name: 'Reverse Butterfly', rx: '2 × 15, controlled', n: 1,
        unit: 'kg', recommended: 20, step: 2.5,
        why: 'Activates rear delts and external rotators before heavy pulling. Machine-guided arc ensures clean isolation — no grip fatigue eating into the warm-up. Replaces band pull-aparts with a more load-precise gym alternative.',
        cues: 'Sit facing the pad (reversed). Grip handles at shoulder height. Open arms horizontally with straight elbows. Squeeze 1–2s at peak (arms fully open). Return under control — do NOT let the stack crash. Keep shoulder blades retracted throughout.',
        prog: 'Start at 20 kg. +2.5 kg when 15 reps with a 2s squeeze feel easy. Cap at ~35 kg — this is activation work, not a strength lift.',
        yt: YT('https://www.youtube.com/watch?v=-TKqxK7-ehc', 'How to PROPERLY do Reverse Pec Deck', 'Renaissance Periodization'),
      },
      { name: 'Main Pulling Block (~43 min)', isHeader: true },
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
        name: 'Skin the Cat', rx: '3 × 3, as slow as possible', n: 1,
        unit: 'reps', recommended: 3, step: 1,
        why: 'Bulletproof shoulders through full ROM. Performed when fresh.',
        cues: 'Tuck knees, rotate backward. Start with first half only (to German hang). Only go as far as comfortable. SLOW.',
        prog: 'Tuck → straight legs → pause in German hang 5s → full rotation.',
        yt: YT('https://youtube.com/watch?v=QHnpUcVwZOk', 'How to Skin the Cat', 'The Movement Collective'),
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
        name: 'Cable Row', rx: '3 × 10', n: 1,
        unit: 'kg', recommended: 45, step: 5,
        why: 'The original plan has zero horizontal pulling. Cable row loads the mid-back, rhomboids, and rear delts in a way face pulls alone can\'t.',
        cues: 'Chest stays tall. Pull to lower sternum. Squeeze shoulder blades 1s. No momentum.',
        prog: '+5 kg when 3×10 with 1s squeeze feels controlled.',
        yt: YT('https://www.youtube.com/watch?v=jLvqKgW-_G8', 'Cable Row Proper Form', 'Jeff Nippard'),
      },
      {
        name: 'Barbell Curls', rx: '3 × 10, 2s up / 2s down', n: 0,
        unit: 'kg', recommended: 30, step: 2,
        why: 'Bicep strength supports all pulling and protects elbow joints.',
        cues: 'Straight or EZ bar, 30 kg. Full range. No swinging — if momentum needed, weight is too heavy.',
        prog: 'Alternate barbell / dumbbell (14 kg each) / hammer curls across weeks.',
        yt: YT('https://www.youtube.com/watch?v=i1YgFZB6alI', 'How To Bicep Curl', 'Jeff Nippard'),
      },
      {
        name: 'Face Pulls', rx: '3 × 15', n: 1,
        unit: 'kg', recommended: 12.5, step: 2.5,
        why: 'Rear delts + external rotators. #1 exercise for shoulder longevity that most people skip.',
        cues: 'Rope at face height (~170 cm). Pull rope to ears, externally rotate — thumbs point backward. Squeeze 2s hold at peak contraction.',
        prog: '+2.5 kg when 15 reps with 2s hold feel easy. Start lighter than ego says.',
        yt: YT('https://www.youtube.com/watch?v=qfc70k40318', 'Face Pulls Done Right', 'Jeff Nippard'),
      },
      { name: 'Finisher + Skill Block (~24 min)', isHeader: true },
      {
        name: 'Dead Hang (Decompression)', rx: '2 × 30s, passive', n: 1,
        unit: 'sec', recommended: 30, step: 5,
        timer: { rounds: 2, work: 30, rest: 30, workLabel: 'HANG', restLabel: 'REST' },
        why: 'Spine decompression after heavy weighted pull-ups and cable rows. Not a training stimulus.',
        cues: 'Relax completely into the stretch.',
        prog: '-',
        yt: YT('https://www.youtube.com/watch?v=M25ibDAVhMQ', 'How Dead Hangs Improve Your Life', 'Minus The Gym'),
      },
      {
        name: 'High-Knee Rope Fartlek + Cooldown', rx: '8 × 60s sprint / 30s step + 5 min easy (~17 min total)', n: 1,
        track: false,
        timer: { rounds: 8, work: 60, rest: 30, workLabel: 'HIGH KNEES', restLabel: 'EASY STEP' },
        why: 'More conditioning volume without complexity.',
        cues: 'Drive knees to hip height. Max cadence on the sprint phase. 5 min easy skipping to finish.',
        prog: 'Add double-unders on sprint phase.',
        yt: YT('https://www.youtube.com/watch?v=xcIfssjP-u8', 'Jump Rope High Knees — Benefits & Form', 'Jump Rope Dudes'),
      },
      {
        name: 'Shoulder Stretching', rx: 'Cross-body, Pec, Overhead', n: 1,
        track: false,
        why: 'After heavy pulling, shoulders and lats are shortened. 5 min of targeted stretching returns tissue to resting length.',
        cues: '30s each position, each side.',
        prog: '-',
        yt: YT('https://www.youtube.com/watch?v=7OzIZqGOxL4', '9 Min Daily Shoulder Mobility Routine', 'FitnessFAQs'),
      },
    ],
  },

  {
    id: 'fri', tab: 'Fri', name: 'Friday',
    focus: 'Lower Body + Conditioning', duration: '~90 min',
    notes: 'Single-leg RDL added after Bulgarians addresses the hamstring gap. Nordics are eccentric-only at your stage.',
    exercises: [
      { name: 'Main Strength Block (~40 min)', isHeader: true },
      {
        name: 'KB Goblet Squat', rx: '4 × 10, 3s pause at bottom', n: 0,
        unit: 'kg', recommended: 24, step: 4,
        why: 'Builds squat depth and strength. Pause eliminates stretch reflex and forces honest reps.',
        cues: 'KB at chest. Elbows inside knees at bottom. 3s pause in the hole. Drive up through heels.',
        prog: '24 kg × 10 pause → 24 kg × 12 pause → double KB front squat.',
        yt: YT('https://www.youtube.com/watch?v=lRYBbchqxtI', 'Goblet Squat Form', 'Squat University'),
      },
      {
        name: 'Bulgarian Split Squat', rx: '3 × 8 each leg', n: 1,
        unit: 'kg', recommended: 12, step: 4,
        why: 'Single-leg strength builder. Exposes and fixes imbalances. More knee-friendly than heavy barbell squats for 45+.',
        cues: 'Rear foot on bench, shoelaces down. Front shin roughly vertical. 2 × 12 kg dumbbells.',
        prog: 'BW → 2×12 kg DB → 2×16 kg DB → 2×20 kg DB → add deficit (front foot elevated).',
        yt: YT('https://www.youtube.com/watch?v=HBYGeyb4sSM', 'The Ultimate Guide To Bulgarian Split Squats', 'Jeff Nippard'),
      },
      {
        name: 'Single-Leg Romanian Deadlift', rx: '3 × 8 each leg', n: 1,
        unit: 'kg', recommended: 20, step: 4,
        why: 'Fills the hamstring gap beyond Nordics: lengthened-position hamstring work + single-leg balance + hip stability.',
        cues: 'Hinge at hip, free leg goes straight back. KB in opposite hand to working leg. Slight knee bend. Touch mid-shin. Square to floor.',
        prog: '20 kg → 24 kg → 28 kg. Then deficit (stand on 5 cm plate).',
        yt: YT('https://www.youtube.com/watch?v=Vv6L5-F_1YU', 'Improve Your Deadlift with a Single Leg Romanian Deadlift', 'Mind Pump TV'),
      },
      {
        name: 'Kettlebell Swing', rx: '4 × 15, Russian style (eye level)', n: 0,
        unit: 'kg', recommended: 24, step: 4,
        why: 'Posterior chain power. Hip hinge builds glutes and hamstrings explosively.',
        cues: 'Swing to eye level. Snap hips — arms just along for the ride. Squeeze glutes at top.',
        prog: '24 kg × 15 → 24 kg × 20 → single-arm 20 kg.',
        yt: YT('https://www.youtube.com/watch?v=K83RM7H9WrY', 'KB Swing Mistakes', 'Mark Wildman'),
      },
      {
        name: 'Nordic Curl Negative', rx: '3 × 5, target 5s descent per rep', n: 1,
        unit: 'sec', recommended: 5, step: 1,
        why: "Best hamstring exercise that exists. Dramatically reduces injury risk. Eccentric-only initially.",
        cues: 'Kneel on pad, anchor feet under barbell. Lower as slowly as possible. Catch with hands at bottom.',
        prog: '3s negative → 5s → 8s → half-range concentric → full Nordic curl.',
        yt: YT('https://youtube.com/watch?v=_e9vFU9-tkc', 'How to Set Up, Perform, & Program Nordic Hamstring Curls', 'E3 Rehab'),
      },
      {
        name: 'Calf Raises', rx: '3 × 15, slow tempo (2-2-2-2)', n: 0,
        unit: 'reps', recommended: 15, step: 1,
        why: 'Calf + Achilles tendon health. Slow tempo loads tendon properly.',
        cues: 'Full stretch at bottom (2s). Full contraction at top (2s hold). Off a step for extra range.',
        prog: 'Double leg → single leg → add weight → off a step.',
        yt: YT('https://www.youtube.com/watch?v=-qsRtp_PbVM', 'How To Build Calves', 'Jeff Nippard'),
      },
      { name: 'Conditioning Block (~45 min)', isHeader: true },
      {
        name: '45 Min Elliptical Fartlek', rx: 'Level 22 base, ladder intervals', n: 0,
        unit: 'level', recommended: 22, step: 1,
        why: 'Low-impact Fartlek-style training. Builds aerobic engine while sparing joints.',
        cues: 'Use Level 22 as your base. Climb or drop resistance strategically to spike heart rate.',
        prog: 'Increase baseline resistance level or extend duration of high-intensity rungs.',
        yt: YT('https://www.youtube.com/watch?v=sHMemwz_HPU', 'How To Use An Elliptical', 'Planet Fitness'),
      },
    ],
  },

  {
    id: 'sat', tab: 'Sat', name: 'Saturday',
    focus: 'Long Conditioning + Mobility', duration: '~80 min',
    notes: 'Block A: Conditioning (~60 min). Block B: Skill & Mobility (15-20 min). If Block A wipes you out, do Block B first or move it to Sunday.',
    exercises: [
      { name: 'Block A: Conditioning (~60 min)', isHeader: true },
      {
        name: '1-Hour Rope & Burpee Fartlek', rx: '60 min continuous: 8x20 burpees mixed in', n: 0,
        unit: 'reps', recommended: 20, step: 1,
        why: 'Advanced Fartlek. Builds stamina + VO2 max by spiking heart rate with burpees during aerobic baseline.',
        cues: 'Alternate heavy/normal rope. Push hard during burpee sets to spike HR, then use skipping as active recovery.',
        prog: 'Increase burpees per set or speed of skipping recovery.',
        yt: YT('https://www.youtube.com/watch?v=kDOGb9C5kp0', 'Heavy Rope Skipping', 'Crossrope') + YT('https://www.youtube.com/watch?v=auBLPXO8Fww', 'The Burpee', 'CrossFit'),
      },
      { name: 'Block B: Skill & Mobility (~20 min)', isHeader: true },
      {
        name: 'Turkish Get-Up', rx: '3 × 2 each side', n: 1,
        unit: 'kg', recommended: 12, step: 4,
        why: 'Skill work, rest as needed. Tests and builds everything: shoulder, hip, core, balance.',
        cues: 'Eye on KB always. Every position = pause. No rushing. Learn all 7 positions before loading up.',
        prog: 'Empty hand → shoe on fist → 12 kg → 16 → 20 → 24 kg (¼ bodyweight).',
        yt: YT('https://www.youtube.com/watch?v=0bWRPC49-KI', 'Turkish Get-Up Step by Step', 'StrongFirst'),
      },
      {
        name: 'Handstand Wall Hold', rx: '3 × 20–30 sec', n: 1,
        unit: 'sec', recommended: 20, step: 5,
        timer: { rounds: 3, work: 20, rest: 60, workLabel: 'HOLD', restLabel: 'REST' },
        why: 'Overhead stability, wrist strength, body awareness. Real fall-prevention benefit at 50+.',
        cues: 'Chest facing wall. Squeeze glutes + core. Breathe. Too hard = pike fallback.',
        prog: 'Wall hold 30s → toe pulls (one foot off wall) → freestanding → handstand push-up negatives.',
        yt: YT('https://youtube.com/watch?v=r0rLCKvcqnQ', '10 Steps To Handstand!', 'C-RAY'),
      },
      {
        name: 'Thoracic Spine Rotation', rx: '2 min each side', n: 1,
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
    notes: 'Walk, stretch, do nothing structured. Recovery is where adaptation happens.',
    isRest: true,
  },
];
