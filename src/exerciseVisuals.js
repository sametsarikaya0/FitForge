/**
 * FitPlan - Kapsamlı Egzersiz Biyomekanik İllüstrasyon Motoru
 * Her egzersize özel anatomik duruş, ekipman ve aktif kas aydınlatması
 */

const GENERATED_IMAGES = {
  'bench-press': './src/assets/images/bench_press_visual_1791118210278.jpg',
  'incline-dumbbell-press': './src/assets/images/bench_press_visual_1791118210278.jpg',
  'squat': './src/assets/images/squat_lift_visual_1791118229078.jpg',
  'front-squat': './src/assets/images/squat_lift_visual_1791118229078.jpg',
  'pull-up': './src/assets/images/pullup_back_visual_1791118243296.jpg',
  'chin-up': './src/assets/images/pullup_back_visual_1791118243296.jpg',
  'deadlift': './src/assets/images/deadlift_lift_visual_1791118726487.jpg',
  'romanian-deadlift': './src/assets/images/deadlift_lift_visual_1791118726487.jpg',
  'overhead-press': './src/assets/images/overhead_press_visual_1791118738956.jpg',
  'dumbbell-shoulder-press': './src/assets/images/overhead_press_visual_1791118738956.jpg',
  'arnold-press': './src/assets/images/overhead_press_visual_1791118738956.jpg',
  'barbell-curl': './src/assets/images/biceps_curl_visual_1791118752305.jpg',
  'hammer-curl': './src/assets/images/biceps_curl_visual_1791118752305.jpg',
  'incline-curl': './src/assets/images/biceps_curl_visual_1791118752305.jpg',
  'ez-bar-preacher-curl': './src/assets/images/biceps_curl_visual_1791118752305.jpg',
  'plank': './src/assets/images/core_plank_visual_1791118762962.jpg',
  'ab-wheel-rollout': './src/assets/images/core_plank_visual_1791118762962.jpg'
};

/**
 * 60+ egzersizin her biri için özelleştirilmiş SVG biyomekanik çizimi
 */
export function getExerciseIllustration(exercise) {
  const slug = exercise.slug || '';
  const primaryMuscle = exercise.muscle[0] || 'Genel';
  
  // Eğer özel görsel varsa kartta ve modalda kullan
  const generatedImg = GENERATED_IMAGES[slug];
  if (generatedImg) {
    return `
      <div class="exercise-art-wrapper">
        <img 
          src="${generatedImg}" 
          alt="${exercise.name}" 
          class="exercise-art-image"
          loading="lazy"
        />
        <div class="exercise-art-overlay">
          <span class="active-muscle-indicator">⚡ Aktif: ${exercise.muscle.slice(0, 2).join(' + ')}</span>
        </div>
      </div>
    `;
  }

  let content = '';

  // 1. CHEST / GÖĞÜS
  if (slug === 'bench-press' || slug === 'dumbbell-floor-press') {
    content = `
      <rect x="25" y="68" width="110" height="8" rx="3" fill="#1e293b" stroke="#475569" stroke-width="1.5" />
      <line x1="38" y1="76" x2="38" y2="92" stroke="#475569" stroke-width="3" />
      <line x1="122" y1="76" x2="122" y2="92" stroke="#475569" stroke-width="3" />
      <rect x="35" y="60" width="75" height="9" rx="4.5" fill="#334155" />
      <circle cx="32" cy="62" r="7" fill="#94a3b8" />
      <ellipse cx="65" cy="58" rx="14" ry="7" fill="rgba(16, 185, 129, 0.5)" stroke="#10b981" stroke-width="2" />
      <path d="M 65 60 L 65 38" stroke="#10b981" stroke-width="4" stroke-linecap="round" />
      <line x1="15" y1="36" x2="145" y2="36" stroke="#f8fafc" stroke-width="3" />
      <rect x="22" y="24" width="6" height="24" rx="2" fill="#10b981" />
      <rect x="132" y="24" width="6" height="24" rx="2" fill="#10b981" />
    `;
  } else if (slug === 'incline-dumbbell-press') {
    content = `
      <line x1="30" y1="80" x2="105" y2="45" stroke="#475569" stroke-width="4" stroke-linecap="round" />
      <circle cx="95" cy="40" r="7" fill="#94a3b8" />
      <path d="M 90 44 L 50 68" stroke="#334155" stroke-width="6" />
      <ellipse cx="75" cy="50" rx="12" ry="6" fill="#10b981" stroke="#34d399" stroke-width="1.5" />
      <path d="M 72 48 L 78 28" stroke="#10b981" stroke-width="3.5" />
      <rect x="68" y="24" width="18" height="6" rx="2" fill="#38bdf8" />
    `;
  } else if (slug === 'dumbbell-fly') {
    content = `
      <rect x="25" y="68" width="110" height="7" rx="3" fill="#1e293b" />
      <circle cx="34" cy="62" r="7" fill="#94a3b8" />
      <path d="M 40 64 L 105 64" stroke="#334155" stroke-width="6" />
      <ellipse cx="68" cy="60" rx="14" ry="7" fill="#10b981" stroke="#34d399" stroke-width="2" />
      <path d="M 68 62 Q 52 46 44 48" stroke="#f8fafc" stroke-width="3" fill="none" />
      <path d="M 68 62 Q 84 46 92 48" stroke="#f8fafc" stroke-width="3" fill="none" />
      <circle cx="44" cy="48" r="5" fill="#38bdf8" />
      <circle cx="92" cy="48" r="5" fill="#38bdf8" />
    `;
  } else if (slug === 'push-up' || slug === 'weighted-push-up') {
    content = `
      <line x1="20" y1="88" x2="140" y2="88" stroke="#334155" stroke-width="2" />
      <circle cx="38" cy="56" r="6" fill="#f8fafc" />
      <path d="M 44 60 L 115 76" stroke="#cbd5e1" stroke-width="5" />
      <rect x="58" y="58" width="22" height="10" rx="4" fill="#10b981" stroke="#34d399" stroke-width="1.5" />
      <path d="M 52 64 L 52 86 L 62 86" stroke="#f8fafc" stroke-width="3.5" fill="none" />
      <line x1="115" y1="76" x2="120" y2="88" stroke="#f8fafc" stroke-width="3" />
    `;
  } else if (slug === 'diamond-push-up') {
    content = `
      <line x1="20" y1="88" x2="140" y2="88" stroke="#334155" stroke-width="2" />
      <circle cx="40" cy="58" r="6" fill="#f8fafc" />
      <path d="M 46 62 L 115 76" stroke="#cbd5e1" stroke-width="5" />
      <path d="M 56 64 L 52 86" stroke="#10b981" stroke-width="4" />
      <polygon points="52,86 46,90 58,90" fill="#38bdf8" />
      <ellipse cx="62" cy="62" rx="10" ry="6" fill="#10b981" />
    `;
  } else if (slug === 'chest-dips' || slug === 'dips') {
    content = `
      <line x1="45" y1="35" x2="45" y2="90" stroke="#475569" stroke-width="4" />
      <line x1="115" y1="35" x2="115" y2="90" stroke="#475569" stroke-width="4" />
      <circle cx="80" cy="24" r="7" fill="#f8fafc" />
      <path d="M 80 32 L 80 58" stroke="#cbd5e1" stroke-width="5" />
      <ellipse cx="80" cy="40" rx="12" ry="7" fill="#10b981" stroke="#34d399" stroke-width="1.5" />
      <path d="M 72 36 L 45 42" stroke="#f8fafc" stroke-width="3.5" />
      <path d="M 88 36 L 115 42" stroke="#f8fafc" stroke-width="3.5" />
      <path d="M 80 58 L 72 78 L 82 82" stroke="#64748b" stroke-width="3.5" fill="none" />
    `;
  }

  // 2. BACK / SIRT
  else if (slug === 'pull-up' || slug === 'chin-up') {
    content = `
      <line x1="20" y1="18" x2="140" y2="18" stroke="#94a3b8" stroke-width="4" />
      <line x1="50" y1="20" x2="68" y2="40" stroke="#f8fafc" stroke-width="3.5" />
      <line x1="110" y1="20" x2="92" y2="40" stroke="#f8fafc" stroke-width="3.5" />
      <circle cx="80" cy="30" r="7" fill="#cbd5e1" />
      <path d="M 68 40 Q 80 44 92 40 L 86 64 L 74 64 Z" fill="rgba(16, 185, 129, 0.6)" stroke="#10b981" stroke-width="2" />
      <path d="M 76 64 L 74 84" stroke="#64748b" stroke-width="3.5" />
      <path d="M 84 64 L 86 84" stroke="#64748b" stroke-width="3.5" />
    `;
  } else if (slug === 'barbell-row') {
    content = `
      <circle cx="56" cy="32" r="7" fill="#cbd5e1" />
      <path d="M 62 36 L 84 56" stroke="#94a3b8" stroke-width="6" />
      <ellipse cx="76" cy="46" rx="10" ry="7" fill="rgba(16, 185, 129, 0.5)" stroke="#10b981" stroke-width="2" />
      <path d="M 70 42 L 78 48 L 74 62" stroke="#10b981" stroke-width="3.5" fill="none" />
      <line x1="58" y1="62" x2="90" y2="62" stroke="#f8fafc" stroke-width="4" />
      <rect x="54" y="55" width="5" height="14" fill="#38bdf8" rx="1" />
      <rect x="89" y="55" width="5" height="14" fill="#38bdf8" rx="1" />
      <path d="M 84 56 L 82 74 L 88 90" stroke="#64748b" stroke-width="4" fill="none" />
      <path d="M 84 56 L 96 74 L 100 90" stroke="#64748b" stroke-width="4" fill="none" />
    `;
  } else if (slug === 'dumbbell-row') {
    content = `
      <rect x="25" y="65" width="70" height="7" rx="2" fill="#1e293b" />
      <circle cx="85" cy="40" r="6" fill="#cbd5e1" />
      <path d="M 80 44 L 50 56" stroke="#94a3b8" stroke-width="5" />
      <ellipse cx="65" cy="50" rx="9" ry="6" fill="#10b981" stroke="#34d399" stroke-width="1.5" />
      <path d="M 66 50 L 68 70" stroke="#10b981" stroke-width="3.5" />
      <rect x="62" y="68" width="12" height="6" rx="2" fill="#38bdf8" />
      <path d="M 45 65 L 45 88" stroke="#475569" stroke-width="3" />
    `;
  } else if (slug === 'lat-pulldown') {
    content = `
      <line x1="30" y1="18" x2="130" y2="18" stroke="#f8fafc" stroke-width="4" />
      <line x1="80" y1="18" x2="80" y2="38" stroke="#38bdf8" stroke-width="2" stroke-dasharray="2,2" />
      <rect x="65" y="70" width="30" height="8" rx="3" fill="#1e293b" />
      <circle cx="80" cy="46" r="6" fill="#cbd5e1" />
      <path d="M 80 52 L 80 72" stroke="#94a3b8" stroke-width="5" />
      <path d="M 74 48 Q 80 54 86 48 L 84 66 L 76 66 Z" fill="#10b981" />
      <line x1="55" y1="36" x2="105" y2="36" stroke="#f8fafc" stroke-width="3" />
    `;
  } else if (slug === 'seated-cable-row') {
    content = `
      <rect x="40" y="65" width="35" height="8" rx="2" fill="#1e293b" />
      <circle cx="58" cy="44" r="6" fill="#cbd5e1" />
      <path d="M 58 50 L 58 70" stroke="#94a3b8" stroke-width="5" />
      <line x1="60" y1="56" x2="115" y2="56" stroke="#38bdf8" stroke-width="2" stroke-dasharray="2,2" />
      <polygon points="62,54 58,58 64,60" fill="#10b981" />
      <line x1="58" y1="70" x2="100" y2="70" stroke="#64748b" stroke-width="4" />
    `;
  } else if (slug === 'inverted-row' || slug === 'trx-row') {
    content = `
      <line x1="30" y1="20" x2="130" y2="20" stroke="#475569" stroke-width="3" />
      <line x1="80" y1="20" x2="68" y2="50" stroke="#38bdf8" stroke-width="2" />
      <circle cx="62" cy="46" r="6" fill="#cbd5e1" />
      <path d="M 64 50 L 110 74" stroke="#94a3b8" stroke-width="5" />
      <rect x="72" y="52" width="16" height="8" rx="3" fill="#10b981" stroke="#34d399" stroke-width="1.5" />
      <line x1="110" y1="74" x2="116" y2="88" stroke="#f8fafc" stroke-width="3" />
    `;
  } else if (slug === 'deadlift') {
    content = `
      <line x1="20" y1="90" x2="140" y2="90" stroke="#334155" stroke-width="2" />
      <circle cx="58" cy="38" r="7" fill="#94a3b8" />
      <path d="M 64 42 L 86 54" stroke="#94a3b8" stroke-width="6" />
      <path d="M 86 54 L 84 72 L 80 88" stroke="#10b981" stroke-width="4" fill="none" />
      <line x1="68" y1="46" x2="70" y2="76" stroke="#cbd5e1" stroke-width="3" />
      <line x1="30" y1="76" x2="115" y2="76" stroke="#f8fafc" stroke-width="4" />
      <circle cx="38" cy="76" r="13" fill="#10b981" stroke="#34d399" stroke-width="2" />
      <circle cx="108" cy="76" r="13" fill="#10b981" stroke="#34d399" stroke-width="2" />
    `;
  }

  // 3. SHOULDERS / OMUZ
  else if (slug === 'overhead-press' || slug === 'dumbbell-shoulder-press' || slug === 'arnold-press') {
    content = `
      <line x1="40" y1="92" x2="120" y2="92" stroke="#334155" stroke-width="2" />
      <circle cx="80" cy="36" r="7" fill="#f8fafc" />
      <path d="M 80 44 L 80 68" stroke="#cbd5e1" stroke-width="6" />
      <ellipse cx="68" cy="46" rx="7" ry="5" fill="#10b981" />
      <ellipse cx="92" cy="46" rx="7" ry="5" fill="#10b981" />
      <line x1="25" y1="15" x2="135" y2="15" stroke="#f8fafc" stroke-width="3.5" />
      <circle cx="32" cy="15" r="11" fill="#0284c7" />
      <circle cx="128" cy="15" r="11" fill="#0284c7" />
    `;
  } else if (slug === 'lateral-raise') {
    content = `
      <circle cx="80" cy="30" r="7" fill="#f8fafc" />
      <path d="M 80 37 L 80 66" stroke="#cbd5e1" stroke-width="5" />
      <ellipse cx="70" cy="40" rx="6" ry="5" fill="#10b981" />
      <ellipse cx="90" cy="40" rx="6" ry="5" fill="#10b981" />
      <line x1="80" y1="40" x2="35" y2="40" stroke="#10b981" stroke-width="3.5" />
      <line x1="80" y1="40" x2="125" y2="40" stroke="#10b981" stroke-width="3.5" />
      <rect x="28" y="36" width="8" height="8" rx="2" fill="#38bdf8" />
      <rect x="124" y="36" width="8" height="8" rx="2" fill="#38bdf8" />
    `;
  } else if (slug === 'face-pull') {
    content = `
      <line x1="120" y1="36" x2="88" y2="36" stroke="#38bdf8" stroke-width="2" stroke-dasharray="2,2" />
      <circle cx="68" cy="36" r="6" fill="#f8fafc" />
      <path d="M 68 42 L 68 68" stroke="#cbd5e1" stroke-width="5" />
      <ellipse cx="64" cy="42" rx="6" ry="5" fill="#10b981" />
      <path d="M 68 42 L 80 34 L 88 36" stroke="#10b981" stroke-width="3" fill="none" />
    `;
  } else if (slug === 'pike-push-up') {
    content = `
      <line x1="20" y1="88" x2="140" y2="88" stroke="#334155" stroke-width="2" />
      <path d="M 45 88 L 75 45 L 110 88" stroke="#cbd5e1" stroke-width="5" fill="none" />
      <circle cx="52" cy="72" r="6" fill="#f8fafc" />
      <ellipse cx="60" cy="62" rx="7" ry="5" fill="#10b981" stroke="#34d399" stroke-width="1.5" />
    `;
  }

  // 4. BICEPS & TRICEPS (ARMS)
  else if (slug === 'barbell-curl' || slug === 'ez-bar-preacher-curl' || slug === 'hammer-curl' || slug === 'incline-curl' || slug === 'band-curl') {
    content = `
      <circle cx="80" cy="28" r="7" fill="#f8fafc" />
      <path d="M 80 35 L 80 66" stroke="#cbd5e1" stroke-width="6" />
      <path d="M 72 40 L 70 56 L 82 46" stroke="#f8fafc" stroke-width="3.5" fill="none" />
      <ellipse cx="74" cy="49" rx="7" ry="7" fill="#10b981" stroke="#34d399" stroke-width="2" />
      <rect x="76" y="40" width="14" height="6" fill="#38bdf8" rx="2" />
      <circle cx="76" cy="43" r="5" fill="#f8fafc" />
      <circle cx="90" cy="43" r="5" fill="#f8fafc" />
      <path d="M 80 66 L 76 90 M 80 66 L 84 90" stroke="#64748b" stroke-width="4" />
    `;
  } else if (slug === 'triceps-pushdown' || slug === 'skull-crusher' || slug === 'ez-bar-skull-crusher' || slug === 'overhead-triceps-extension' || slug === 'bench-dips') {
    content = `
      <circle cx="70" cy="30" r="7" fill="#f8fafc" />
      <path d="M 70 38 L 72 65" stroke="#cbd5e1" stroke-width="5" />
      <path d="M 68 40 L 68 55 L 74 76" stroke="#f8fafc" stroke-width="3" fill="none" />
      <ellipse cx="66" cy="48" rx="6" ry="8" fill="#10b981" stroke="#34d399" stroke-width="2" />
      <line x1="74" y1="14" x2="74" y2="76" stroke="#38bdf8" stroke-width="2" stroke-dasharray="2,2" />
      <rect x="68" y="74" width="12" height="4" fill="#f8fafc" rx="1" />
    `;
  }

  // 5. LEGS / BACAK
  else if (slug === 'squat' || slug === 'front-squat' || slug === 'bodyweight-squat' || slug === 'goblet-squat') {
    content = `
      <line x1="20" y1="92" x2="140" y2="92" stroke="#334155" stroke-width="2" />
      <ellipse cx="80" cy="62" rx="16" ry="10" fill="rgba(16, 185, 129, 0.5)" stroke="#10b981" stroke-width="2" />
      <path d="M 80 58 L 60 68 L 56 90" stroke="#f1f5f9" stroke-width="4" fill="none" />
      <path d="M 80 58 L 100 68 L 104 90" stroke="#f1f5f9" stroke-width="4" fill="none" />
      <path d="M 80 58 L 80 34" stroke="#94a3b8" stroke-width="5" />
      <circle cx="80" cy="22" r="7" fill="#f8fafc" />
      <line x1="25" y1="28" x2="135" y2="28" stroke="#f8fafc" stroke-width="4" />
      <circle cx="32" cy="28" r="14" fill="#0284c7" stroke="#38bdf8" stroke-width="2" />
      <circle cx="128" cy="28" r="14" fill="#0284c7" stroke="#38bdf8" stroke-width="2" />
    `;
  } else if (slug === 'bulgarian-split-squat' || slug === 'walking-lunges' || slug === 'lunges') {
    content = `
      <rect x="110" y="65" width="25" height="15" rx="3" fill="#1e293b" />
      <circle cx="70" cy="30" r="7" fill="#f8fafc" />
      <path d="M 70 37 L 70 60" stroke="#cbd5e1" stroke-width="5" />
      <path d="M 70 60 L 52 70 L 52 90" stroke="#10b981" stroke-width="4" fill="none" />
      <path d="M 70 60 L 95 72 L 115 65" stroke="#64748b" stroke-width="4" fill="none" />
      <ellipse cx="56" cy="74" rx="8" ry="6" fill="#10b981" />
    `;
  } else if (slug === 'romanian-deadlift') {
    content = `
      <circle cx="58" cy="38" r="7" fill="#94a3b8" />
      <path d="M 64 42 L 86 54" stroke="#94a3b8" stroke-width="6" />
      <path d="M 86 54 L 84 72 L 80 88" stroke="#10b981" stroke-width="4" fill="none" />
      <line x1="68" y1="46" x2="70" y2="76" stroke="#cbd5e1" stroke-width="3" />
      <rect x="64" y="74" width="16" height="6" rx="2" fill="#38bdf8" />
      <text x="88" y="70" fill="#10b981" font-size="8" font-weight="700">HAMSTRING</text>
    `;
  } else if (slug === 'leg-press') {
    content = `
      <line x1="30" y1="80" x2="70" y2="40" stroke="#475569" stroke-width="6" />
      <rect x="75" y="30" width="30" height="20" rx="3" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
      <circle cx="45" cy="50" r="7" fill="#f8fafc" />
      <path d="M 45 56 L 60 70 L 80 45" stroke="#10b981" stroke-width="4" fill="none" />
    `;
  } else if (slug === 'leg-extension' || slug === 'leg-curl') {
    content = `
      <rect x="40" y="50" width="35" height="15" rx="3" fill="#1e293b" />
      <circle cx="48" cy="34" r="6" fill="#f8fafc" />
      <path d="M 48 40 L 52 55 L 74 55 L 90 75" stroke="#10b981" stroke-width="4" fill="none" />
      <ellipse cx="62" cy="52" rx="10" ry="5" fill="#10b981" />
    `;
  } else if (slug === 'glute-bridge' || slug === 'mini-band-clamshell') {
    content = `
      <line x1="20" y1="85" x2="140" y2="85" stroke="#334155" stroke-width="2" />
      <circle cx="34" cy="78" r="6" fill="#f8fafc" />
      <path d="M 40 80 L 75 58 L 95 85" stroke="#cbd5e1" stroke-width="5" fill="none" />
      <ellipse cx="75" cy="58" rx="10" ry="7" fill="#10b981" stroke="#34d399" stroke-width="2" />
    `;
  } else if (slug.includes('calf')) {
    content = `
      <rect x="30" y="85" width="40" height="8" rx="2" fill="#1e293b" />
      <path d="M 80 25 L 80 55 L 60 70 L 60 85" stroke="#cbd5e1" stroke-width="4" fill="none" />
      <ellipse cx="60" cy="72" rx="7" ry="9" fill="#10b981" stroke="#34d399" stroke-width="2" />
    `;
  }

  // 6. ABS & CORE / KARIN
  else if (slug === 'plank') {
    content = `
      <rect x="15" y="80" width="130" height="4" rx="2" fill="#1e293b" />
      <circle cx="34" cy="56" r="6" fill="#f8fafc" />
      <path d="M 38 60 L 110 68" stroke="#cbd5e1" stroke-width="5" />
      <rect x="62" y="58" width="24" height="8" rx="4" fill="rgba(16, 185, 129, 0.6)" stroke="#10b981" stroke-width="2" />
      <path d="M 46 62 L 46 80 L 58 80" stroke="#f8fafc" stroke-width="3" fill="none" />
      <line x1="110" y1="68" x2="114" y2="80" stroke="#f8fafc" stroke-width="3" />
    `;
  } else if (slug === 'hanging-leg-raise') {
    content = `
      <line x1="40" y1="15" x2="120" y2="15" stroke="#94a3b8" stroke-width="3" />
      <line x1="80" y1="16" x2="80" y2="35" stroke="#f8fafc" stroke-width="3" />
      <circle cx="80" cy="38" r="6" fill="#cbd5e1" />
      <path d="M 80 44 L 80 62 L 110 62" stroke="#10b981" stroke-width="4" fill="none" />
      <rect x="74" y="48" width="8" height="12" rx="2" fill="#10b981" />
    `;
  } else if (slug === 'lying-leg-raise' || slug === 'crunch' || slug === 'russian-twist' || slug === 'swiss-ball-crunch') {
    content = `
      <line x1="20" y1="85" x2="140" y2="85" stroke="#334155" stroke-width="2" />
      <circle cx="40" cy="72" r="6" fill="#f8fafc" />
      <path d="M 45 76 L 75 76 L 90 45" stroke="#10b981" stroke-width="4" fill="none" />
      <ellipse cx="65" cy="73" rx="10" ry="6" fill="#10b981" stroke="#34d399" stroke-width="1.5" />
    `;
  } else if (slug === 'ab-wheel-rollout') {
    content = `
      <line x1="20" y1="85" x2="140" y2="85" stroke="#334155" stroke-width="2" />
      <circle cx="45" cy="65" r="5" fill="#f8fafc" />
      <path d="M 50 68 L 105 78" stroke="#cbd5e1" stroke-width="4" />
      <ellipse cx="78" cy="70" rx="14" ry="6" fill="#10b981" stroke="#34d399" stroke-width="2" />
      <circle cx="108" cy="80" r="10" fill="#38bdf8" stroke="#f8fafc" stroke-width="2" />
    `;
  }

  // 7. CARDIO & FUNCTIONAL / KARDİYO
  else if (slug === 'kettlebell-swing') {
    content = `
      <circle cx="70" cy="35" r="6" fill="#f8fafc" />
      <path d="M 70 41 L 70 65 L 55 88" stroke="#cbd5e1" stroke-width="4" />
      <ellipse cx="66" cy="62" rx="10" ry="7" fill="#10b981" />
      <line x1="70" y1="45" x2="105" y2="45" stroke="#10b981" stroke-width="3" />
      <circle cx="112" cy="45" r="9" fill="#0284c7" stroke="#38bdf8" stroke-width="2" />
    `;
  } else if (slug === 'jump-rope') {
    content = `
      <circle cx="80" cy="30" r="6" fill="#f8fafc" />
      <path d="M 80 36 L 80 62 L 75 80 M 80 62 L 85 80" stroke="#cbd5e1" stroke-width="3.5" />
      <path d="M 50 48 Q 80 92 110 48" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3,3" fill="none" />
    `;
  } else if (slug === 'running' || slug === 'high-knees' || slug === 'mountain-climber' || slug === 'burpees') {
    content = `
      <circle cx="80" cy="28" r="7" fill="#f8fafc" />
      <path d="M 80 35 L 75 58" stroke="#cbd5e1" stroke-width="4" />
      <path d="M 75 58 L 60 70 L 52 88" stroke="#10b981" stroke-width="3.5" fill="none" />
      <path d="M 75 58 L 92 64 L 98 84" stroke="#10b981" stroke-width="3.5" fill="none" />
      <path d="M 78 40 L 62 48 L 56 42" stroke="#38bdf8" stroke-width="3" fill="none" />
    `;
  } else {
    // GENEL FORM
    content = `
      <circle cx="80" cy="30" r="7" fill="#f8fafc" />
      <path d="M 80 37 L 80 64" stroke="#cbd5e1" stroke-width="5" />
      <ellipse cx="80" cy="46" rx="10" ry="7" fill="#10b981" />
      <path d="M 80 45 L 60 55 M 80 45 L 100 55" stroke="#f8fafc" stroke-width="3" />
      <path d="M 80 64 L 70 88 M 80 64 L 90 88" stroke="#64748b" stroke-width="3.5" />
    `;
  }

  return `
    <div class="exercise-art-wrapper svg-mode">
      <svg viewBox="0 0 160 100" class="exercise-art-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg-glow-${slug}" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stop-color="#1e293b" />
            <stop offset="100%" stop-color="#090d16" />
          </radialGradient>
        </defs>
        <rect width="160" height="100" fill="url(#bg-glow-${slug})" rx="8" />
        ${content}
        <rect x="0" y="88" width="160" height="12" fill="rgba(0,0,0,0.65)" />
        <text x="80" y="96.5" fill="#10b981" font-size="6.5" font-weight="700" letter-spacing="0.8" text-anchor="middle">
          BİYOMEKANİK FORM · ${primaryMuscle.toUpperCase()}
        </text>
      </svg>
    </div>
  `;
}
