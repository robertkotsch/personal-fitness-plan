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
 *   { name, rx, n (1=new), why, cues, prog, vi? (visual key), yt? (html) }
 */

// ── YouTube link builder ───────────────────────────────────────────────────

function YT(url, title, channel) {
  return `<a href="${url}" target="_blank" rel="noopener" class="video-link">` +
    `<svg class="yt-icon" viewBox="0 0 28 20">` +
    `<rect width="28" height="20" rx="4" fill="#FF0000"/>` +
    `<polygon points="11,4 11,16 21,10" fill="#fff"/>` +
    `</svg>` +
    `<div class="yt-text">` +
    `<div class="yt-title">${title}</div>` +
    `<div class="yt-channel">${channel}</div>` +
    `</div>` +
    `<span class="yt-arrow">›</span>` +
    `</a>`;
}

// ── Training plan data ─────────────────────────────────────────────────────

const DAYS = [
  {
    id: 'mon', tab: 'Mon', name: 'Monday',
    focus: 'Upper Push + Power', duration: '~55 min',
    notes: 'Tempo: 3s down on bench, 1s pause, explode up. Plyo push-ups stay low-rep to protect joints.',
    exercises: [
      {
        name: 'Kettlebell Halo', rx: '2 × 12 each direction', n: 0,
        why: 'Warms up shoulders and thoracic spine.',
        cues: 'Keep elbows tight. Circle close to head. Engage core.',
        prog: 'Increase KB weight when easy.',
        yt: YT('https://www.youtube.com/watch?v=VVMsBOvaxqU', 'Kettlebell Halo Technique', 'Cavemantraining'),
      },
      {
        name: 'Bench Press', rx: '4 × 6 @ RPE 7–8', n: 0,
        why: 'Primary horizontal push. Tempo-controlled for tendon health.',
        cues: '3s eccentric, 1s pause on chest, explode up. Retract shoulder blades.',
        prog: 'Add 2.5kg when all sets hit 6 reps at RPE 7.',
        yt: YT('https://www.youtube.com/watch?v=rT7DgCr-3pg', 'Bench Press Proper Form', 'Jeff Nippard'),
      },
      {
        name: 'Plyometric Push-Ups', rx: '3 × 5', n: 1,
        why: 'Power declines ~2× faster than strength after 40. Low-rep explosive work counters this directly.',
        cues: 'Hands leave ground. Land soft. Full reset between reps.',
        prog: 'Knees → standard → clap push-ups.',
        vi: 'plyo_pushup',
        yt: YT('https://www.youtube.com/watch?v=EYwjhBMat-g', 'Plyo Push-Up Step by Step', 'THENX'),
      },
      {
        name: 'Ring Dips', rx: '3 × 8', n: 1,
        why: 'Rings let wrists rotate — more shoulder-friendly. Adds stabilizer demand.',
        cues: 'Turn rings out at top (RTO). Control descent. Parallel bars if no rings.',
        prog: 'Bodyweight → +2.5kg vest → RTO hold 2s.',
        vi: 'ring_dips',
        yt: YT('https://www.youtube.com/watch?v=2bnGICa1_XQ', 'Ring Dips for Beginners', 'FitnessFAQs'),
      },
      {
        name: 'Floor Press', rx: '3 × 10', n: 1,
        why: 'Limits ROM to protect shoulders, overloads triceps. Great for 50+.',
        cues: 'Elbows touch ground gently. No bouncing. DB or barbell.',
        prog: 'Small weight increments. Focus lockout.',
        vi: 'floor_press',
        yt: YT('https://www.youtube.com/watch?v=1jJCyT-oJDs', 'Floor Press Technique', 'Jeff Nippard'),
      },
      {
        name: 'Heavy Rope Finisher', rx: '5 × 30s on / 30s off', n: 0,
        why: 'Conditioning finisher without impact.',
        cues: 'Consistent rhythm. Form over speed.',
        prog: 'Extend to 40s, then 45s.',
      },
    ],
  },

  {
    id: 'tue', tab: 'Tue', name: 'Tuesday',
    focus: 'Rowing Engine + Core & Mobility', duration: '~50 min',
    notes: 'VO2max supports 500m intervals. Stroke rate 26–30. Mobility is non-negotiable.',
    exercises: [
      {
        name: 'Rowing Intervals', rx: '6 × 500m, 90s rest', n: 0,
        why: 'Aerobic power. Target: 2:00–2:10/500m.',
        cues: 'Legs → lean → pull. Reverse on recovery. Damper 4–6.',
        prog: 'Drop 2s every 2 weeks. Add 7th interval.',
        yt: YT('https://www.youtube.com/watch?v=zQ82RYIFLN8', '500m Row Intervals', 'Dark Horse Rowing'),
      },
      {
        name: 'Kettlebell Halo', rx: '2 × 10 each direction', n: 0,
        why: 'Active recovery. Mobilizes shoulders.',
        cues: 'Slow and controlled.',
        prog: 'Heavier KB if fresh.',
      },
      {
        name: 'Dead Hang', rx: '3 × 30–45 sec', n: 1,
        why: 'Decompresses spine. Builds grip. Improves shoulder health passively.',
        cues: 'Fully relax. Shoulders by ears is fine. Breathe deeply.',
        prog: '45s → 60s → single-arm (assisted).',
        vi: 'dead_hang',
        yt: YT('https://www.youtube.com/watch?v=qTNELEMCbk0', 'Dead Hang Benefits', 'Minus The Gym'),
      },
      {
        name: 'L-Sit Progression', rx: '3 × 15–20 sec hold', n: 1,
        why: 'Deep core that sit-ups never reach. Hip flexor strength.',
        cues: 'Parallettes or dip bars. Push shoulders down hard. Tuck knees if needed.',
        prog: 'Tuck → one leg → full L-sit → toes-to-bar.',
        vi: 'l_sit',
        yt: YT('https://www.youtube.com/watch?v=IUZJoSP66HI', 'L-Sit Progressions', 'FitnessFAQs'),
      },
      {
        name: 'Pallof Press', rx: '3 × 10 each side', n: 1,
        why: "Anti-rotation core. Trains resisting movement — core's actual job.",
        cues: "Cable/band chest height. Press out, hold 2s. Don't rotate.",
        prog: 'More tension. Pallof with overhead reach.',
        vi: 'pallof_press',
        yt: YT('https://www.youtube.com/watch?v=AH_QZLm_0-s', 'Pallof Press — Best Core Exercise', 'ATHLEAN-X'),
      },
      {
        name: '90/90 Hip Stretch', rx: '2 min each side', n: 1,
        why: 'Hip mobility degrades silently after 40. Best stretch for rotation.',
        cues: 'Front shin parallel to shoulders. Both knees 90°. Sit tall, lean forward.',
        prog: 'Add rotation. Forward fold over front shin.',
        vi: 'hip_90_90',
        yt: YT('https://www.youtube.com/watch?v=Fh-O1bB1M1E', '90/90 Hip Mobility', 'Squat University'),
      },
    ],
  },

  {
    id: 'wed', tab: 'Wed', name: 'Wednesday',
    focus: 'HIIT Complexes', duration: '~40 min',
    notes: 'Quality over volume. Form breaks = stop. 3 complexes × 3 rounds, 2 min rest between.',
    exercises: [
      {
        name: 'Complex A: Rope & Burpee', rx: '3 rds: 40s rope → 5 burpees → 20s rest', n: 0,
        why: 'Full-body conditioning with your favorites.',
        cues: 'Stay smooth on rope after burpee fatigue.',
        prog: '+10s rope. Then +2 burpees.',
      },
      {
        name: 'Complex B: KB Circuit', rx: '3 rds: 5 C&P ea. → 10 swings → 5 goblet sq.', n: 1,
        why: 'Clean & press = full-body power, easier on wrists than barbell cleans.',
        cues: "Clean: rack smoothly, don't bang forearm. Snap hips on swings.",
        prog: 'Heavier KB. Then +2 reps each.',
        vi: 'kb_clean_press',
        yt: YT('https://www.youtube.com/watch?v=0EaJMZFNaSU', 'KB Clean & Press Tutorial', 'Cavemantraining'),
      },
      {
        name: 'Complex C: Bodyweight', rx: '3 rds: 5 exp. PU → 10 Hindu PU → 10 jump sq.', n: 1,
        why: 'Hindu push-ups = shoulder mobility + pressing. Wrestling conditioning staple.',
        cues: 'Hindu PU: down dog → swoop chest through → cobra → reverse.',
        prog: 'Pull-ups → chest-to-bar. Hindu PU: 3s swoop.',
        vi: 'hindu_pushup',
        yt: YT('https://www.youtube.com/watch?v=WT2fk8mFiVE', 'Hindu Push-Up Form', 'Hybrid Calisthenics'),
      },
    ],
  },

  {
    id: 'thu', tab: 'Thu', name: 'Thursday',
    focus: 'Upper Pull + Skill Work', duration: '~55 min',
    notes: 'Scapular pull-ups first — always. Face pulls are the most important exercise here for longevity.',
    exercises: [
      {
        name: 'Scapular Pull-Ups', rx: '2 × 10', n: 1,
        why: 'Activates lower traps + serratus. Shoulder insurance.',
        cues: 'Hang straight. Retract + depress scapulae — rise without bending elbows. Hold 1s.',
        prog: '3s hold. Then single-arm (assisted).',
        vi: 'scapular_pullup',
        yt: YT('https://www.youtube.com/watch?v=M2-bXkPsjSI', 'Scapular Pull-Ups', 'FitnessFAQs'),
      },
      {
        name: 'Weighted Pull-Ups', rx: '4 × 5 @ RPE 7–8', n: 0,
        why: 'Primary vertical pull. Weighted for strength beyond bodyweight.',
        cues: 'Full dead hang. Chin over bar. 2s minimum descent.',
        prog: '+2.5kg when all sets hit 5.',
        yt: YT('https://www.youtube.com/watch?v=eGo4IYlbE5g', 'Weighted Pull-Up Progression', 'Jeremy Ethier'),
      },
      {
        name: 'Archer Pull-Ups', rx: '3 × 3 each side', n: 1,
        why: 'Bridge to one-arm. One arm works, other assists.',
        cues: 'Wide grip. Pull to one hand, other straightens. Alternate.',
        prog: '3×3 → 3×5 → less assist → typewriters.',
        vi: 'archer_pullup',
        yt: YT('https://www.youtube.com/watch?v=GlNJC-JfMIs', 'Archer Pull-Up Tutorial', 'THENX'),
      },
      {
        name: 'Curls', rx: '3 × 10', n: 0,
        why: 'Bicep strength supports pulling and protects elbows.',
        cues: 'Full range. No swinging.',
        prog: 'Alternate barbell / DB / hammer curls.',
      },
      {
        name: 'Face Pulls', rx: '3 × 15', n: 1,
        why: 'Rear delts + external rotators. #1 exercise for shoulder longevity.',
        cues: 'Pull to ears, externally rotate — thumbs back. Squeeze 2s.',
        prog: 'More tension. 3s hold. Single-arm.',
        vi: 'face_pulls',
        yt: YT('https://www.youtube.com/watch?v=rep-qVOkqgk', 'Face Pulls Done Right', 'Jeff Nippard'),
      },
      {
        name: 'Skin the Cat', rx: '3 × 3, slow', n: 1,
        why: 'Bulletproof shoulders through full ROM. Outstanding mobility + strength.',
        cues: 'Tuck knees, rotate backward. Start with first half only. Go as far as comfortable. SLOW.',
        prog: 'Tuck → straight legs → German hang pause → full rotation.',
        vi: 'skin_the_cat',
        yt: YT('https://www.youtube.com/watch?v=2J2RiLsaYNk', 'Skin the Cat — Beginner Tutorial', 'FitnessFAQs'),
      },
      {
        name: 'Rope Skipping Cooldown', rx: '5 min, easy', n: 0,
        why: 'Active recovery.',
        cues: 'Conversational pace. Rhythm focus.',
        prog: 'Stays easy.',
      },
    ],
  },

  {
    id: 'fri', tab: 'Fri', name: 'Friday',
    focus: 'Lower Body + Conditioning', duration: '~50 min',
    notes: "Nordic curls will humble you — that's the point. Band-assist if needed. Bulgarians expose hidden imbalances.",
    exercises: [
      {
        name: 'KB Goblet Squat', rx: '4 × 10, 3s pause', n: 0,
        why: 'Squat depth and strength. Pause kills stretch reflex.',
        cues: 'KB at chest. Elbows inside knees. 3s pause in hole.',
        prog: 'Heavier → 5s pause → double KB front squat.',
        yt: YT('https://www.youtube.com/watch?v=MeIiIdhvXT4', 'Goblet Squat Form', 'Squat University'),
      },
      {
        name: 'Bulgarian Split Squat', rx: '3 × 8 each leg', n: 1,
        why: 'Single-leg strength. Fixes imbalances. Knee-friendly for 45+.',
        cues: 'Rear foot on bench, laces down. Front shin vertical. Back knee to floor.',
        prog: 'Bodyweight → goblet → double DB → deficit.',
        vi: 'bulgarian_split',
        yt: YT('https://www.youtube.com/watch?v=2C-uNgKwPLE', 'Bulgarian Split Squat', 'Jeff Nippard'),
      },
      {
        name: 'Kettlebell Swing', rx: '4 × 15, Russian', n: 0,
        why: 'Posterior chain power. Hip hinge = glutes + hamstrings.',
        cues: 'Eye level. Snap hips. Squeeze glutes top.',
        prog: 'Heavier → single-arm → banded.',
        yt: YT('https://www.youtube.com/watch?v=YSxHifyI6s8', 'KB Swing Mistakes', 'Mark Wildman'),
      },
      {
        name: 'Nordic Curl Negative', rx: '3 × 5, 5s descent', n: 1,
        why: "Best hamstring exercise. Dramatically reduces injury risk. Being bad at it = it's working.",
        cues: 'Kneel, anchor feet. Lower as slowly as possible (5s). Catch with hands.',
        prog: 'Longer negatives → half concentric → full Nordic.',
        vi: 'nordic_curl',
        yt: YT('https://www.youtube.com/watch?v=ORAZE8-vkjM', 'Nordic Curl Progression', 'Knees Over Toes Guy'),
      },
      {
        name: 'Calf Raises', rx: '3 × 15, slow', n: 0,
        why: 'Calf + Achilles tendon health.',
        cues: 'Full stretch bottom (2s). Full contraction top (2s).',
        prog: 'Double → single → add weight → off a step.',
      },
      {
        name: 'Elliptical Intervals', rx: '8 × 1 min hard / 1 min easy', n: 0,
        why: 'Low-impact finisher. Spares joints.',
        cues: 'Hard = high resistance. Easy = recovery. 16 min total.',
        prog: 'Hard → 90s. Easy → 45s.',
      },
    ],
  },

  {
    id: 'sat', tab: 'Sat', name: 'Saturday',
    focus: 'Long Aerobic + Movement Quality', duration: '~50–60 min',
    notes: 'Zone 2 HR: ~130–140 bpm. Resist going hard. This is aerobic maintenance + skill day.',
    exercises: [
      {
        name: 'Rope Skipping — Zone 2', rx: '25–30 min continuous', n: 0,
        why: 'Aerobic base. Zone 2 = mitochondrial density = engine behind VO2max.',
        cues: 'Normal rope. Talk test. HR 130–140.',
        prog: 'Extend to 35 → 40 min. Alt normal/heavy 5 min.',
      },
      {
        name: 'Turkish Get-Up', rx: '3 × 2 each side', n: 1,
        why: 'Floor→standing with weight overhead. Tests everything: shoulder, hip, core, balance. The "am I aging well?" exercise.',
        cues: 'Start with empty hand or shoe on fist. Eye on KB always. Every position = pause. Learn 7 positions first.',
        prog: 'Positions → add weight → eventually ¼ bodyweight.',
        vi: 'turkish_getup',
        yt: YT('https://www.youtube.com/watch?v=0bWRPC49-KI', 'Turkish Get-Up Step by Step', 'StrongFirst'),
      },
      {
        name: 'Handstand Wall Hold', rx: '3 × 20–30 sec', n: 1,
        why: 'Overhead stability, wrist strength, body awareness. Fall-prevention at 50+.',
        cues: 'Chest to wall, hands 15cm away. Squeeze glutes + core. Too hard = pike, feet on box.',
        prog: 'Wall → toe pulls → freestanding → HS push-up negatives.',
        vi: 'handstand',
        yt: YT('https://www.youtube.com/watch?v=K8aMBOh83xI', 'Handstand Progressions', 'FitnessFAQs'),
      },
      {
        name: 'T-Spine Rotation', rx: '2 min each side', n: 1,
        why: 'Counters desk/age stiffness in mid-back. Opens breathing + overhead.',
        cues: 'Side-lying, knees stacked 90°. Open top arm, rotate, follow with eyes.',
        prog: 'Light reach at end. Then quadruped T-spine.',
        yt: YT('https://www.youtube.com/watch?v=xuCVYmGMSzg', 'T-Spine Mobility', 'Squat University'),
      },
      {
        name: 'Deep Squat Sit', rx: 'Accumulate 3 min', n: 1,
        why: 'Best thing for hip/ankle/back mobility. Most adults lose it by 40.',
        cues: 'Heels down (plates if needed). Hold something for balance. Shift weight. Relax.',
        prog: 'Assisted → free → hold KB → Cossack transitions.',
        yt: YT('https://www.youtube.com/watch?v=M9_LhEoSEWA', 'Reclaim Your Deep Squat', 'Squat University'),
      },
    ],
  },

  {
    id: 'sun', tab: 'Sun', name: 'Sunday',
    focus: 'Rest & Recovery', duration: 'All day',
    isRest: true,
  },
];
