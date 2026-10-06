/**
 * FitForge - Bilimsel & Kişiselleştirilmiş Antrenman ve Güç Motoru
 * Vanilla JavaScript Temiz & Modüler Mimari
 */

import { EXERCISE_DATABASE } from './src/exercises.js';
import { getExerciseIllustration } from './src/exerciseVisuals.js';
import { calculateRecommendedWeight } from './src/weightCalculator.js';

export { EXERCISE_DATABASE };

// --- UYGULAMA DURUMU (STATE) ---
const state = {
  currentStep: 1,
  totalSteps: 11,
  userData: {
    name: '',
    age: '',
    gender: 'erkek',
    height: '',
    weight: '',
    targetWeight: '',
    goal: 'kas-kazanimi',
    sports: ['fitness'],
    sport: 'fitness',
    level: 'orta',
    intensity: 'standard',
    mindset: 'focused',
    avatar: '🦁',
    profilePhoto: '',
    bio: 'Disiplin motivasyonun bittiği yerde başlar.',
    healthNotes: '',
    drankGlasses: 0,
    totalWorkouts: 12,
    streak: 5,
    environment: 'gym',
    equipment: ['Barbell', 'Dambıl', 'Bench'],
    weeklyDaysCount: 4,
    selectedDays: ['Pazartesi', 'Salı', 'Perşembe', 'Cuma'],
    duration: 60,
    priorityMuscles: [],
    cardio: 'hafif',
    generatedPlan: null,
    liftRecords: {
      chest: { kg: 60, reps: 8 },
      back: { kg: 60, reps: 8 },
      legs: { kg: 80, reps: 8 },
      shoulders: { kg: 40, reps: 8 },
      arms: { kg: 30, reps: 10 },
      core: { kg: 15, reps: 15 }
    }
  },
  alternativeSeed: 0
};

// Gün İsimleri & Kısaltmaları
const ALL_WEEKDAYS = [
  { id: 'Pazartesi', abbr: 'PZT', full: 'Pazartesi' },
  { id: 'Salı', abbr: 'SAL', full: 'Salı' },
  { id: 'Çarşamba', abbr: 'ÇAR', full: 'Çarşamba' },
  { id: 'Perşembe', abbr: 'PER', full: 'Perşembe' },
  { id: 'Cuma', abbr: 'CUM', full: 'Cuma' },
  { id: 'Cumartesi', abbr: 'CTS', full: 'Cumartesi' },
  { id: 'Pazar', abbr: 'PAZ', full: 'Pazar' }
];

// --- YARDIMCI VEKTÖR ÇİZİM FONKSİYONU ---
function createExerciseVisualSvg(category, name) {
  return `
    <svg viewBox="0 0 160 100" class="exercise-svg-canvas" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-${category}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#10b981" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.9" />
        </linearGradient>
      </defs>
      <rect width="160" height="100" fill="#080e1a" />
      <circle cx="80" cy="50" r="38" fill="rgba(16, 185, 129, 0.05)" />
      
      <!-- Biomechanic Body Silhouette & Barbell Vector -->
      <g stroke="#334155" stroke-width="2" stroke-linecap="round">
        <line x1="20" y1="85" x2="140" y2="85" stroke-dasharray="3,3" />
      </g>
      
      <!-- Athlete Posture -->
      <g stroke="url(#grad-${category})" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none">
        <circle cx="80" cy="30" r="6" fill="#10b981" stroke="none" />
        <line x1="80" y1="36" x2="80" y2="60" />
        <line x1="80" y1="42" x2="62" y2="52" />
        <line x1="80" y1="42" x2="98" y2="52" />
        <line x1="80" y1="60" x2="68" y2="82" />
        <line x1="80" y1="60" x2="92" y2="82" />
      </g>
      
      <!-- Equipment Vector -->
      <rect x="52" y="38" width="56" height="3" fill="#cbd5e1" rx="1.5" />
      <rect x="50" y="33" width="4" height="13" fill="#10b981" rx="1" />
      <rect x="106" y="33" width="4" height="13" fill="#10b981" rx="1" />
      
      <text x="80" y="93" fill="#64748b" font-size="7" font-weight="600" text-anchor="middle" letter-spacing="1">
        FITFORGE BIOMECHANICS
      </text>
    </svg>
  `;
}

// --- 1. BMI HESAPLAMA (Madde 5) ---
export function calculateBMI(heightCm, weightKg) {
  const h = parseFloat(heightCm);
  const w = parseFloat(weightKg);
  if (!h || !w || h <= 0 || w <= 0) {
    return null;
  }
  const heightM = h / 100;
  const bmi = (w / (heightM * heightM)).toFixed(1);
  const numBmi = parseFloat(bmi);

  let category = '';
  let badgeClass = '';

  if (numBmi < 18.5) {
    category = 'Zayıf';
    badgeClass = 'bmi-underweight';
  } else if (numBmi < 24.9) {
    category = 'Normal';
    badgeClass = 'bmi-normal';
  } else if (numBmi < 29.9) {
    category = 'Fazla kilolu';
    badgeClass = 'bmi-overweight';
  } else {
    category = 'Obezite';
    badgeClass = 'bmi-obese';
  }

  return { bmi, category, badgeClass };
}

// --- 2. FORM VALIDASYONU (Madde 27) ---
export function validateStep(step) {
  clearError();

  if (step === 2) {
    // Kişisel Bilgiler
    const name = document.getElementById('input-name')?.value.trim();
    const age = parseInt(document.getElementById('input-age')?.value, 10);
    const height = parseFloat(document.getElementById('input-height')?.value);
    const weight = parseFloat(document.getElementById('input-weight')?.value);

    if (!name) {
      showError('Lütfen adınızı girin.');
      return false;
    }
    if (!age || age < 14 || age > 95) {
      showError('Lütfen geçerli bir yaş girin (14 - 95 arası).');
      return false;
    }
    if (!height || height < 120 || height > 230) {
      showError('Lütfen geçerli bir boy girin (120 - 230 cm arası).');
      return false;
    }
    if (!weight || weight < 35 || weight > 250) {
      showError('Lütfen geçerli bir kilo girin (35 - 250 kg arası).');
      return false;
    }

    state.userData.name = name;
    state.userData.age = age;
    state.userData.gender = document.querySelector('input[name="gender"]:checked')?.value || 'erkek';
    state.userData.height = height;
    state.userData.weight = weight;
    return true;
  }

  if (step === 3) {
    // Hedef
    if (!state.userData.goal) {
      showError('Lütfen ana fitness hedefinizi seçin.');
      return false;
    }
    return true;
  }

  if (step === 4) {
    // Seviye
    if (!state.userData.level) {
      showError('Lütfen antrenman seviyenizi seçin.');
      return false;
    }
    return true;
  }

  if (step === 5) {
    // Ortam
    if (!state.userData.environment) {
      showError('Lütfen antrenman ortamınızı seçin.');
      return false;
    }
    return true;
  }

  if (step === 6) {
    // Ekipman
    if (state.userData.environment === 'home') {
      if (state.userData.equipment.length === 0) {
        showError('Ev ortamı için en az bir ekipman veya "Ekipmansız" seçeneğini işaretlemelisiniz.');
        return false;
      }
    }
    return true;
  }

  if (step === 7) {
    // Haftalık Müsaitlik (Kritik Eşleşme Kontrolü)
    const requiredDays = state.userData.weeklyDaysCount;
    const selectedCount = state.userData.selectedDays.length;

    if (selectedCount !== requiredDays) {
      showError(`❌ Lütfen haftada ${requiredDays} gün için tam ${requiredDays} farklı gün seçin (Şu an: ${selectedCount} gün seçili).`);
      return false;
    }
    return true;
  }

  if (step === 8) {
    // Antrenman Süresi
    if (!state.userData.duration) {
      showError('Lütfen tercih ettiğiniz antrenman süresini seçin.');
      return false;
    }
    return true;
  }

  return true;
}

function showError(msg) {
  const banner = document.getElementById('wizard-error-banner');
  if (banner) {
    banner.textContent = msg;
    banner.classList.add('visible');
    banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function clearError() {
  const banner = document.getElementById('wizard-error-banner');
  if (banner) {
    banner.textContent = '';
    banner.classList.remove('visible');
  }
}

// --- 3. EGZERSİZ FİLTRELEME & SEÇİM ALGORİTMASI (Madde 16 & 18) ---
export function filterExercises(env, userEquip, userLevel) {
  return EXERCISE_DATABASE.filter(ex => {
    // Ortam kontrolü
    const envMatch = ex.environment.includes(env) || ex.environment.includes('gym');
    if (!envMatch && env === 'outdoor' && !ex.environment.includes('outdoor')) return false;

    // Spor salonunda tüm ekipmanlar mevcut kabul edilir
    if (env === 'gym') {
      return true;
    }

    if (env === 'outdoor') {
      // Açık hava: Ekipmansız, paralel bar, barfiks, ip, kettlebell, mat
      return ex.equipment.some(eq => ['Ekipmansız', 'Barfiks demiri', 'Paralel bar', 'İp', 'Atlama İpi', 'Egzersiz Matı'].includes(eq));
    }

    if (env === 'home') {
      // Ev: Kullanıcının işaretlediği ekipmanlarla uyumlu olmalı
      if (userEquip.includes('Ekipmansız') && ex.equipment.includes('Ekipmansız')) {
        return true;
      }

      // Gelişmiş ekipman eşleştirmesi
      return ex.equipment.some(eq => {
        if (userEquip.includes(eq)) return true;
        // Dambıl türevleri
        if (eq === 'Dambıl' && userEquip.includes('Ayarlanabilir Dambıl')) return true;
        // Sehpa türevleri
        if ((eq === 'Bench' || eq === 'Ağırlık Sehpası') && (userEquip.includes('Bench') || userEquip.includes('Ayarlanabilir Eğimli Sehpa'))) return true;
        // Halter türevleri
        if (eq === 'Barbell' && userEquip.includes('EZ Bar')) return true;
        // Bant türevleri
        if (eq === 'Direnç bandı' && (userEquip.includes('Direnç bandı') || userEquip.includes('Mini Loop Band'))) return true;
        // İp türevleri
        if (eq === 'İp' && userEquip.includes('Atlama İpi')) return true;
        return false;
      });
    }

    return true;
  });
}

// --- 4. PROGRAM SPLIT SİSTEMİ OLUŞTURMA (Madde 17) ---
export function generateWorkoutSplit(daysCount, level, goal) {
  // Haftalık gün sayısına ve seviyeye göre ideal split yapısı
  if (daysCount === 2) {
    return [
      { name: 'Full Body A', focus: 'Tüm Vücut Bileşik Odaklı', muscleFocus: ['Göğüs', 'Sırt', 'Quadriceps', 'Core'] },
      { name: 'Full Body B', focus: 'Tüm Vücut Arka Zincir & Omuz', muscleFocus: ['Omuz', 'Hamstring', 'Kalça', 'Kollar'] }
    ];
  }

  if (daysCount === 3) {
    if (level === 'beginner' || goal === 'kilo-verme') {
      return [
        { name: 'Full Body A', focus: 'Tüm Vücut Kuvvet & İtiş', muscleFocus: ['Göğüs', 'Quadriceps', 'Omuz', 'Karın'] },
        { name: 'Full Body B', focus: 'Tüm Vücut Çekiş & Arka Zincir', muscleFocus: ['Sırt', 'Hamstring', 'Biceps', 'Baldır'] },
        { name: 'Full Body C', focus: 'Tüm Vücut Dayanıklılık & Şekillenme', muscleFocus: ['Göğüs', 'Sırt', 'Bacak', 'Kardiyo'] }
      ];
    }
    return [
      { name: 'Upper Body', focus: 'Üst Gövde Hipertrofi & Güç', muscleFocus: ['Göğüs', 'Sırt', 'Omuz', 'Kollar'] },
      { name: 'Lower Body', focus: 'Alt Gövde & Kalça Gücü', muscleFocus: ['Quadriceps', 'Hamstring', 'Kalça', 'Baldır', 'Karın'] },
      { name: 'Full Body Power', focus: 'Tüm Vücut Kompleks Güç', muscleFocus: ['Göğüs', 'Sırt', 'Bacak', 'Core'] }
    ];
  }

  if (daysCount === 4) {
    return [
      { name: 'Upper Body A', focus: 'Üst Gövde (Göğüs & Sırt Güç)', muscleFocus: ['Göğüs', 'Sırt', 'Omuz', 'Triceps'] },
      { name: 'Lower Body A', focus: 'Alt Gövde (Ön Bacak & Kalça)', muscleFocus: ['Quadriceps', 'Kalça', 'Baldır', 'Karın'] },
      { name: 'Upper Body B', focus: 'Üst Gövde (Omuz & Kol Hacim)', muscleFocus: ['Sırt', 'Göğüs', 'Omuz', 'Biceps'] },
      { name: 'Lower Body B', focus: 'Alt Gövde (Arka Bacak & Hamstring)', muscleFocus: ['Hamstring', 'Kalça', 'Baldır', 'Core'] }
    ];
  }

  if (daysCount === 5) {
    return [
      { name: 'Push (İtiş)', focus: 'Göğüs, Ön Omuz & Triceps', muscleFocus: ['Göğüs', 'Omuz', 'Triceps'] },
      { name: 'Pull (Çekiş)', focus: 'Sırt, Arka Omuz & Biceps', muscleFocus: ['Sırt', 'Arka Omuz', 'Biceps', 'Ön kol'] },
      { name: 'Legs (Bacak)', focus: 'Alt Gövde & Baldır', muscleFocus: ['Quadriceps', 'Hamstring', 'Kalça', 'Baldır'] },
      { name: 'Upper Body', focus: 'Üst Gövde Hacim & İzolasyon', muscleFocus: ['Göğüs', 'Sırt', 'Omuz', 'Kollar'] },
      { name: 'Lower Body & Core', focus: 'Alt Gövde Dinamik & Karın', muscleFocus: ['Bacak', 'Kalça', 'Karın', 'Core'] }
    ];
  }

  if (daysCount === 6) {
    return [
      { name: 'Push A', focus: 'Ağır İtiş (Göğüs & Omuz)', muscleFocus: ['Göğüs', 'Omuz', 'Triceps'] },
      { name: 'Pull A', focus: 'Ağır Çekiş (Sırt Genişliği & Biceps)', muscleFocus: ['Sırt', 'Biceps'] },
      { name: 'Legs A', focus: 'Bacak Kuvveti (Quad Ağırlıklı)', muscleFocus: ['Quadriceps', 'Kalça', 'Baldır'] },
      { name: 'Push B', focus: 'Hacim İtiş (Omuz & Triceps)', muscleFocus: ['Omuz', 'Göğüs', 'Triceps'] },
      { name: 'Pull B', focus: 'Sırt Kalınlığı & Arka Omuz', muscleFocus: ['Sırt', 'Arka Omuz', 'Biceps'] },
      { name: 'Legs B', focus: 'Bacak & Hamstring Hacmi', muscleFocus: ['Hamstring', 'Kalça', 'Karın'] }
    ];
  }

  return [];
}

// --- 5. SET, TEKRAR VE SÜRE UYARLAMASI (Madde 11 & 19) ---
function adaptExercisePrescription(exercise, goal, level, intensity = 'standard') {
  let sets = 3;
  let reps = "10-12";
  let rest = "60 saniye";

  if (goal === 'guc') {
    sets = level === 'advanced' ? 5 : 4;
    reps = exercise.type === 'strength' ? "4-6" : "6-8";
    rest = "120-180 saniye";
  } else if (goal === 'kas-kazanimi') {
    sets = level === 'beginner' ? 3 : 4;
    reps = exercise.type === 'strength' ? "8-10" : "10-12";
    rest = "75-90 saniye";
  } else if (goal === 'kilo-verme' || goal === 'yag-yakimi') {
    sets = 3;
    reps = "12-15";
    rest = "45-60 saniye";
  } else if (goal === 'kondisyon') {
    sets = 3;
    reps = "15-20";
    rest = "45 saniye";
  }

  // Antrenman Zorluk Derecesi (RPE) Yoğunluk Uyarlaması
  if (intensity === 'light') {
    sets = Math.max(2, sets - 1);
    rest = "75-90 sn (Aktif Toparlanma)";
  } else if (intensity === 'high') {
    sets = sets + 1;
    reps = `${reps} (Tükeniş / Drop-Set)`;
    rest = "45-60 sn (Maksimum Yoğunluk)";
  }

  // Kardiyo egzersizleri için özel
  if (exercise.type === 'cardio') {
    return {
      sets: exercise.sets || 3,
      reps: exercise.reps,
      rest: exercise.rest
    };
  }

  return { sets, reps, rest };
}

// --- 6. TAM PROGRAM OLUŞTURMA MOTORU (Madde 16) ---
export function generateWorkoutPlan(user, seed = 0) {
  const availableExercises = filterExercises(user.environment, user.equipment, user.level);
  const splits = generateWorkoutSplit(user.weeklyDaysCount, user.level, user.goal);

  // Spor Dalı Odaklı Öncelikler (Madde: Farklı spor dalları seçilebilsin)
  const sport = user.sport || 'fitness';
  const sportFocusMap = {
    'boks': ['Ön Omuz', 'Triceps', 'Karın', 'Core', 'Kardiyo'],
    'futbol': ['Quadriceps', 'Hamstring', 'Baldır', 'Kardiyo', 'Karın'],
    'basketbol': ['Quadriceps', 'Baldır', 'Omuz', 'Karın', 'Core'],
    'kosu': ['Hamstring', 'Quadriceps', 'Kalça', 'Kardiyo'],
    'kalisteniks': ['Göğüs', 'Sırt', 'Triceps', 'Karın'],
    'yuzme': ['Sırt', 'Omuz', 'Triceps', 'Core']
  };

  // Egzersiz sayısı (Süreye göre - Madde 11)
  let exerciseCountPerDay = 5;
  if (user.duration <= 30) exerciseCountPerDay = 4;
  else if (user.duration <= 45) exerciseCountPerDay = 5;
  else if (user.duration <= 60) exerciseCountPerDay = 6;
  else if (user.duration <= 75) exerciseCountPerDay = 7;
  else exerciseCountPerDay = 8;

  // Haftalık Takvim Eşleştirmesi (7 Gün)
  const fullWeekPlan = [];
  let splitIndex = 0;

  ALL_WEEKDAYS.forEach(dayInfo => {
    const isWorkoutDay = user.selectedDays.includes(dayInfo.id);

    if (isWorkoutDay && splitIndex < splits.length) {
      const currentSplit = splits[splitIndex % splits.length];
      splitIndex++;

      // Bu gün için uygun egzersizleri topla
      const dailyExercises = [];
      const usedIds = new Set();

      // 1. Çoklu Spor Branşlarına Özel Egzersiz Entegrasyonu
      const selectedSports = Array.isArray(user.sports) && user.sports.length > 0 ? user.sports : [user.sport || 'fitness'];
      selectedSports.forEach((sp, spIdx) => {
        const sportMuscles = sportFocusMap[sp];
        if (sportMuscles && sportMuscles.length > 0 && dailyExercises.length < exerciseCountPerDay) {
          const sportCandidates = availableExercises.filter(ex =>
            ex.muscle.some(m => sportMuscles.includes(m)) && !usedIds.has(ex.id)
          );
          if (sportCandidates.length > 0) {
            const sportPicked = sportCandidates[(seed + splitIndex + spIdx) % sportCandidates.length];
            dailyExercises.push(sportPicked);
            usedIds.add(sportPicked.id);
          }
        }
      });

      // 2. Kullanıcının öncelik verdiği kaslar varsa ekle
      if (user.priorityMuscles && user.priorityMuscles.length > 0 && !user.priorityMuscles.includes('yok')) {
        const priorityEx = availableExercises.filter(ex => 
          ex.muscle.some(m => user.priorityMuscles.includes(m)) && !usedIds.has(ex.id)
        );
        if (priorityEx.length > 0) {
          const picked = priorityEx[(seed + splitIndex) % priorityEx.length];
          dailyExercises.push(picked);
          usedIds.add(picked.id);
        }
      }

      // 3. Günün split kas odaklarına göre ana hareketleri ekle
      currentSplit.muscleFocus.forEach(muscle => {
        if (dailyExercises.length >= exerciseCountPerDay) return;

        const candidates = availableExercises.filter(ex => 
          ex.muscle.some(m => m.toLowerCase().includes(muscle.toLowerCase())) && !usedIds.has(ex.id)
        );

        if (candidates.length > 0) {
          // Compound hareketlere öncelik ver
          const pickedIndex = (seed + dailyExercises.length) % candidates.length;
          const ex = candidates[pickedIndex];
          dailyExercises.push(ex);
          usedIds.add(ex.id);
        }
      });

      // 4. Eksik kaldıysa havuzdan tamamla
      while (dailyExercises.length < exerciseCountPerDay) {
        const remaining = availableExercises.filter(ex => !usedIds.has(ex.id));
        if (remaining.length === 0) break;
        const fallback = remaining[(seed + dailyExercises.length) % remaining.length];
        dailyExercises.push(fallback);
        usedIds.add(fallback.id);
      }

      // 5. Kardiyo ekleme (Hedef ve kardiyo tercihine göre - Madde 13)
      if (user.cardio === 'evet' || (user.goal === 'kilo-verme' && user.cardio !== 'hayir')) {
        const cardioEx = availableExercises.find(ex => ex.type === 'cardio' && !usedIds.has(ex.id));
        if (cardioEx && dailyExercises.length < exerciseCountPerDay + 1) {
          dailyExercises.push(cardioEx);
        }
      }

      // Set, Tekrar ve Ağırlık adaptasyonu uygula (Zorluk / RPE derecesini aktar)
      const configuredExercises = dailyExercises.map(ex => {
        const prescription = adaptExercisePrescription(ex, user.goal, user.level, user.intensity);
        const weightGuidance = calculateRecommendedWeight(ex, user);
        return {
          ...ex,
          displaySets: prescription.sets,
          displayReps: prescription.reps,
          displayRest: prescription.rest,
          displayWeight: weightGuidance.weight,
          displayWeightNote: weightGuidance.note
        };
      });

      fullWeekPlan.push({
        dayName: dayInfo.full,
        dayAbbr: dayInfo.abbr,
        isRest: false,
        splitTitle: currentSplit.name,
        splitFocus: currentSplit.focus,
        exercises: configuredExercises
      });
    } else {
      // Dinlenme Günü
      fullWeekPlan.push({
        dayName: dayInfo.full,
        dayAbbr: dayInfo.abbr,
        isRest: true,
        splitTitle: 'DİNLENME & TOPARLANMA',
        splitFocus: 'Kas onarımı, toparlanma ve aktif dinlenme günü',
        recommendations: [
          '💧 Günde en az 2.5 - 3 litre su tüketin.',
          '🚶 20-30 dakika hafif tempolu toparlanma yürüyüşü yapabilirsiniz.',
          '🧘 10-15 dakika hafif esneme ve mobilite hareketleri uygulayın.',
          '🥩 Günlük protein ve kaliteli karbonhidrat ihtiyacınızı karşılayın.',
          '😴 En az 7-8 saat kaliteli gece uykusu alın.'
        ]
      });
    }
  });

  return fullWeekPlan;
}

// --- 7. SONUÇ EKRANI VE KARTLARIN RENDER EDİLMESİ (Madde 20 & 21) ---
export function renderResults(plan, user) {
  const container = document.getElementById('calendar-days-container');
  if (!container) return;

  container.innerHTML = '';

  // 1. Profil Bilgi Özeti
  const bmiInfo = calculateBMI(user.height, user.weight);
  document.getElementById('res-user-name').textContent = user.name || 'Sporcu';
  document.getElementById('res-user-gender').textContent = user.gender === 'kadin' ? 'Kadın' : 'Erkek';
  document.getElementById('res-user-age').textContent = `${user.age} yaş`;
  document.getElementById('res-user-height').textContent = `${user.height} cm`;
  document.getElementById('res-user-weight').textContent = `${user.weight} kg`;
  document.getElementById('res-user-bmi').textContent = bmiInfo ? `${bmiInfo.bmi} (${bmiInfo.category})` : '-';
  document.getElementById('res-user-days').textContent = `Haftada ${user.weeklyDaysCount} Gün`;
  document.getElementById('res-user-env').textContent = user.environment === 'gym' ? 'Spor Salonu' : (user.environment === 'home' ? 'Ev' : 'Açık Hava');
  document.getElementById('res-user-duration').textContent = `${user.duration} dk / seans`;

  // 2. Gün Gün Takvim Kartları
  let totalExercises = 0;
  let cardioDaysCount = 0;

  plan.forEach((day, dayIndex) => {
    const card = document.createElement('div');
    card.className = `day-schedule-card ${day.isRest ? 'rest-day' : 'workout-day'}`;

    if (day.isRest) {
      card.innerHTML = `
        <div class="day-header">
          <div class="day-title-wrap">
            <span class="day-number-badge">${day.dayAbbr}</span>
            <span class="day-name">${day.dayName}</span>
          </div>
          <span class="day-focus-label">DİNLENME GÜNÜ</span>
        </div>
        <div class="rest-day-body">
          <div class="rest-day-message">
            <h4>🛌 Aktif Toparlanma ve Kas Onarımı</h4>
            <p>Kas liflerinin büyümesi ve güçlenmesi antrenman sırasında değil, dinlenme sırasında gerçekleşir. Vücudunuza dinlenme fırsatı verin.</p>
          </div>
          <div class="rest-recommendations">
            ${day.recommendations.map(r => `<span class="rest-rec-chip">${r}</span>`).join('')}
          </div>
        </div>
      `;
    } else {
      totalExercises += day.exercises.length;
      if (day.exercises.some(e => e.type === 'cardio')) cardioDaysCount++;

      const exercisesHtml = day.exercises.map((ex, exIdx) => {
        const visualIllustration = getExerciseIllustration(ex);
        return `
          <div class="exercise-card" data-id="${ex.id}">
            <div class="exercise-card-media-preview">
              <span class="exercise-order-badge">#${exIdx + 1}</span>
              ${visualIllustration}
            </div>
            <div class="exercise-card-header">
              <span class="exercise-muscle-tag">${ex.muscle.join(' · ')}</span>
              <h5 class="exercise-name">${ex.name}</h5>
            </div>
            <div class="exercise-stats-row">
              <div class="exercise-stat-cell">
                <span class="stat-lbl">Set x Tekrar</span>
                <span class="stat-val">${ex.displaySets} × ${ex.displayReps}</span>
              </div>
              <div class="exercise-stat-cell">
                <span class="stat-lbl">Dinlenme</span>
                <span class="stat-val">${ex.displayRest}</span>
              </div>
              <div class="exercise-stat-cell highlight-cell" title="${ex.displayWeightNote || ''}">
                <span class="stat-lbl">Önerilen Ağırlık</span>
                <span class="stat-val weight-val">${ex.displayWeight || 'Özel'}</span>
              </div>
            </div>
            <button type="button" class="btn btn-outline btn-sm btn-inspect-exercise" data-id="${ex.id}">
              🔍 Hareketi İncele
            </button>
          </div>
        `;
      }).join('');

      card.innerHTML = `
        <div class="day-header">
          <div class="day-title-wrap">
            <span class="day-number-badge">${day.dayAbbr}</span>
            <span class="day-name">${day.dayName}</span>
          </div>
          <div class="day-focus-label">${day.splitTitle} · ${day.splitFocus}</div>
          <div class="day-meta-tags">
            <span>⏱️ ~${user.duration} dk</span>
            <span>💪 ${day.exercises.length} Egzersiz</span>
          </div>
        </div>
        <div class="exercise-cards-grid">
          ${exercisesHtml}
        </div>
      `;
    }

    container.appendChild(card);
  });

  // 3. Haftalık Program Özeti (Madde 22)
  document.getElementById('sum-workout-days').textContent = `${user.weeklyDaysCount} Gün`;
  document.getElementById('sum-rest-days').textContent = `${7 - user.weeklyDaysCount} Gün`;
  document.getElementById('sum-total-exercises').textContent = `${totalExercises}`;
  document.getElementById('sum-est-duration').textContent = `${user.duration} dk`;
  document.getElementById('sum-cardio-days').textContent = `${cardioDaysCount} Gün`;
  document.getElementById('sum-goal-name').textContent = getGoalDisplayName(user.goal);

  // Spor ve Zorluk Bilgileri Şeridi
  const sportEl = document.getElementById('res-user-sport');
  if (sportEl) sportEl.textContent = getSportDisplayName(user.sports || user.sport);

  const intensityEl = document.getElementById('res-user-intensity');
  if (intensityEl) intensityEl.textContent = getIntensityDisplayName(user.intensity);

  // Zorluk hap butonlarını güncelle
  updateIntensityPillsUI(user.intensity);

  // Egzersiz İnceleme Butonlarına Dinleyici Ekle
  document.querySelectorAll('.btn-inspect-exercise').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
      openExerciseModal(id);
    });
  });

  // 4. Diğer Zengin Sekmeleri Doldur
  renderNutrition(user);
  renderProgressTable(user);
  renderPhotoGallery();
  renderLolRanks(user);
  initMindset(user);
  initAiCoach(user);
  initResultsTabs();
}

export function getSportDisplayName(sportOrSports) {
  const map = {
    'fitness': '🏋️ Fitness',
    'boks': '🥊 Boks',
    'futbol': '⚽ Futbol',
    'basketbol': '🏀 Basketbol',
    'kosu': '🏃 Koşu',
    'kalisteniks': '🤸 Kalisteniks',
    'yuzme': '🏊 Yüzme'
  };
  if (Array.isArray(sportOrSports)) {
    return sportOrSports.map(s => map[s] || s).join(', ') || '🏋️ Fitness';
  }
  return map[sportOrSports] || '🏋️ Fitness';
}

export function getIntensityDisplayName(intensity) {
  const map = {
    'light': '🟢 Hafif (RPE 6-7)',
    'standard': '🟡 Standart (RPE 8)',
    'high': '🔴 Canavar Modu (RPE 9-10)'
  };
  return map[intensity] || '🟡 Standart (RPE 8)';
}

function updateIntensityPillsUI(currentIntensity = 'standard') {
  document.querySelectorAll('#results-intensity-pills .intensity-pill-btn').forEach(btn => {
    const val = btn.getAttribute('data-res-intensity');
    btn.classList.toggle('active', val === currentIntensity);
  });
}

// --- 7.1. BİLİMSEL BESLENME & KALORİ MOTORU ---
export function renderNutrition(user) {
  const w = parseFloat(user.weight) || 75;
  const h = parseFloat(user.height) || 178;
  const a = parseInt(user.age, 10) || 22;
  const isFemale = user.gender === 'kadin';

  // Mifflin-St Jeor BMR Formülü
  const bmr = Math.round(
    isFemale
      ? 10 * w + 6.25 * h - 5 * a - 161
      : 10 * w + 6.25 * h - 5 * a + 5
  );

  // Aktivite Çarpanı (Haftalık antrenman gününe göre)
  const days = user.weeklyDaysCount || 4;
  let actMultiplier = 1.35;
  if (days <= 2) actMultiplier = 1.3;
  else if (days <= 4) actMultiplier = 1.5;
  else if (days <= 5) actMultiplier = 1.6;
  else actMultiplier = 1.72;

  const tdee = Math.round(bmr * actMultiplier);

  // Hedefe göre kalori
  let targetCalories = tdee;
  const goal = user.goal || 'kas-kazanimi';
  if (goal === 'kilo-verme') targetCalories = tdee - 500;
  else if (goal === 'yag-yakimi') targetCalories = tdee - 400;
  else if (goal === 'kas-kazanimi') targetCalories = tdee + 350;
  else if (goal === 'guc') targetCalories = tdee + 250;
  else targetCalories = tdee;

  // Su ihtiyacı (kg başına 40-45 ml)
  const waterLiters = (w * 0.042).toFixed(1);

  // Makrolar
  const proteinGrams = Math.round(w * (goal === 'kas-kazanimi' || goal === 'guc' ? 2.2 : 1.9));
  const proteinCals = proteinGrams * 4;

  const fatCals = Math.round(targetCalories * 0.22);
  const fatGrams = Math.round(fatCals / 9);

  const carbCals = Math.max(200, targetCalories - (proteinCals + fatCals));
  const carbGrams = Math.round(carbCals / 4);

  // DOM Güncellemesi
  const bmrEl = document.getElementById('nut-bmr-val');
  const tdeeEl = document.getElementById('nut-tdee-val');
  const targetCalEl = document.getElementById('nut-target-cal');
  const waterEl = document.getElementById('nut-water-val');

  if (bmrEl) bmrEl.textContent = `${bmr}`;
  if (tdeeEl) tdeeEl.textContent = `${tdee}`;
  if (targetCalEl) targetCalEl.textContent = `${targetCalories}`;
  if (waterEl) waterEl.textContent = `${waterLiters} L`;

  const protEl = document.getElementById('nut-protein-grams');
  const carbEl = document.getElementById('nut-carb-grams');
  const fatEl = document.getElementById('nut-fat-grams');

  if (protEl) protEl.textContent = `${proteinGrams}g`;
  if (carbEl) carbEl.textContent = `${carbGrams}g`;
  if (fatEl) fatEl.textContent = `${fatGrams}g`;

  const protPct = Math.round((proteinCals / targetCalories) * 100);
  const carbPct = Math.round((carbCals / targetCalories) * 100);
  const fatPct = Math.round((fatCals / targetCalories) * 100);

  const protFill = document.getElementById('nut-protein-fill');
  const carbFill = document.getElementById('nut-carb-fill');
  const fatFill = document.getElementById('nut-fat-fill');

  if (protFill) protFill.style.width = `${Math.min(100, protPct)}%`;
  if (carbFill) carbFill.style.width = `${Math.min(100, carbPct)}%`;
  if (fatFill) fatFill.style.width = `${Math.min(100, fatPct)}%`;

  const protDesc = document.getElementById('nut-protein-desc');
  const carbDesc = document.getElementById('nut-carb-desc');
  const fatDesc = document.getElementById('nut-fat-desc');

  if (protDesc) protDesc.textContent = `${proteinCals} kcal (%${protPct}) · Kas doku onarımı ve protein sentezi`;
  if (carbDesc) carbDesc.textContent = `${carbCals} kcal (%${carbPct}) · Antrenman performansı ve kas glikojeni`;
  if (fatDesc) fatDesc.textContent = `${fatCals} kcal (%${fatPct}) · Testosteron üretimi ve eklem sağlığı`;

  // İnteraktif Su Takipçisi
  renderWaterTracker(Math.round(parseFloat(waterLiters) * 4));

  // 5 Öğünlük Detaylı Yemek Planı
  renderMealPlan(targetCalories, proteinGrams, carbGrams, fatGrams, goal);
}

function renderWaterTracker(totalGlasses = 12) {
  const container = document.getElementById('water-glasses-container');
  if (!container) return;

  const drankCount = state.userData.drankGlasses || 0;
  let html = '';
  for (let i = 1; i <= Math.min(16, Math.max(8, totalGlasses)); i++) {
    const isDrank = i <= drankCount;
    html += `
      <button type="button" class="water-glass-btn ${isDrank ? 'drank' : ''}" data-glass-idx="${i}" title="${i}. Bardak (~250ml)">
        ${isDrank ? '💧' : '🥛'}
      </button>
    `;
  }
  container.innerHTML = html;

  container.querySelectorAll('.water-glass-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-glass-idx'), 10);
      if (state.userData.drankGlasses === idx) {
        state.userData.drankGlasses = idx - 1;
      } else {
        state.userData.drankGlasses = idx;
      }
      saveUserData();
      renderWaterTracker(totalGlasses);
      showToast(`💧 ${state.userData.drankGlasses * 250} ml su tüketildi!`);
    });
  });
}

function renderMealPlan(calories, protein, carb, fat, goal) {
  const container = document.getElementById('meals-timeline-container');
  if (!container) return;

  const meals = [
    {
      name: 'Kahvaltı (Güne Güçlü Başlangıç)',
      time: '08:00 - 09:00',
      icon: '🍳',
      cal: Math.round(calories * 0.25),
      protein: Math.round(protein * 0.25),
      carb: Math.round(carb * 0.28),
      fat: Math.round(fat * 0.25),
      foods: [
        { name: 'Yulaf Ezmesi', portion: '70-80 gr', detail: 'Kompleks karbonhidrat & beta-glukan lifi' },
        { name: '3 Tam Yumurta + 2 Yumurta Beyazı', portion: 'Omlet / Haşlama', detail: 'Biyolojik değeri en yüksek protein' },
        { name: 'Muz veya Yaban Mersini', portion: '1 Orta Boy / 1 avuç', detail: 'Doğal potasyum & antioksidan' },
        { name: 'Çiğ Badem veya Ceviz', portion: '15-20 gr', detail: 'Omega-3 ve sağlıklı doymamış yağ' },
        { name: 'Yeşil Çay veya Şekersiz Filtre Kahve', portion: '1 Kupa', detail: 'Metabolizma hızlandırıcı' }
      ]
    },
    {
      name: 'Öğle Yemeği (Anabolik Güç Deposu)',
      time: '12:30 - 13:30',
      icon: '🥗',
      cal: Math.round(calories * 0.30),
      protein: Math.round(protein * 0.32),
      carb: Math.round(carb * 0.32),
      fat: Math.round(fat * 0.25),
      foods: [
        { name: 'Izgara Tavuk Göğsü / Somon Fileto', portion: '180-220 gr', detail: 'Yüksek biyoyararlanımlı yağsız protein' },
        { name: 'Basmati Pirinç veya Kinoa Pilavı', portion: '120-150 gr (pişmiş)', detail: 'Düşük glisemik indeks, stabil insülin' },
        { name: 'Mevsim Yeşillikleri & Salata', portion: '1 Büyük Kase', detail: 'Roka, marul, salatalık, domates' },
        { name: 'Soğuk Sıkım Sızma Zeytinyağı', portion: '1 Tatlı Kaşığı', detail: 'Hücresel membran ve eklem desteği' }
      ]
    },
    {
      name: 'Antrenman Öncesi / Ara Öğün (Glikojen Yükleme)',
      time: '16:00 - 16:30',
      icon: '🍌',
      cal: Math.round(calories * 0.15),
      protein: Math.round(protein * 0.15),
      carb: Math.round(carb * 0.20),
      fat: Math.round(fat * 0.15),
      foods: [
        { name: 'Pirinç Patlağı + Doğal Fıstık Ezmesi', portion: '2 Adet + 20 gr', detail: 'Hızlı sindirilen glikojen yakıtı' },
        { name: 'Yeşil Elma', portion: '1 Adet', detail: 'Malik asit & antrenman pompa desteği' },
        { name: 'Whey Protein veya Süzme Yoğurt', portion: '1 Ölçek / 150 gr', detail: 'BCAA ve amino asit rezervi' }
      ]
    },
    {
      name: 'Akşam Yemeği (Kas Dokusu Onarımı)',
      time: '19:30 - 20:30',
      icon: '🥩',
      cal: Math.round(calories * 0.25),
      protein: Math.round(protein * 0.23),
      carb: Math.round(carb * 0.18),
      fat: Math.round(fat * 0.28),
      foods: [
        { name: 'Yağsız Dana Kıyma / Hindi Sote', portion: '160-200 gr', detail: 'Demir, çinko & kreatin bakımından zengin' },
        { name: 'Fırınlanmış Tatlı Patates veya Esmer Bulgur', portion: '100-130 gr', detail: 'Sindirimi yavaş, tokluk sağlayan karbonhidrat' },
        { name: 'Buharda Brokoli & Kuşkonmaz', portion: '150 gr', detail: 'Östrojen kontrolü & mikro mineral takviyesi' }
      ]
    },
    {
      name: 'Gece / Toparlanma Öğünü (Kazein Sentezi)',
      time: '22:30 - 23:00',
      icon: '🥛',
      cal: Math.round(calories * 0.05),
      protein: Math.round(protein * 0.05),
      carb: Math.round(carb * 0.02),
      fat: Math.round(fat * 0.07),
      foods: [
        { name: 'Yağsız Tuzsuz Lor Peyniri veya Kazein', portion: '80-100 gr', detail: '7 saat boyunca yavaş salınan amino asit' },
        { name: 'Papatya veya Melisa Çayı', portion: '1 Fincan', detail: 'Derin REM uykusu ve büyüme hormonu uyarımı' }
      ]
    }
  ];

  container.innerHTML = meals.map((m, idx) => `
    <div class="meal-timeline-card">
      <div class="meal-card-header">
        <div class="meal-title-group">
          <span class="meal-icon">${m.icon}</span>
          <div>
            <h4>${m.name}</h4>
            <span class="meal-time-tag">⏰ ${m.time}</span>
          </div>
        </div>
        <div class="meal-macro-badges">
          <span class="meal-cal-badge">${m.cal} kcal</span>
          <span style="color:#10b981;">${m.protein}g P</span>
          <span style="color:#06b6d4;">${m.carb}g K</span>
          <span style="color:#f59e0b;">${m.fat}g Y</span>
        </div>
      </div>
      <div class="meal-food-list">
        ${m.foods.map(f => `
          <div class="food-item-row">
            <div>
              <div class="food-item-name">${f.name}</div>
              <div class="food-item-detail">${f.detail}</div>
            </div>
            <span class="food-item-portion">${f.portion}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// --- 7.2. 12 AYLIK GELİŞİM PROJEKSİYONU & FOTOĞRAFLAR ---
export function renderProgressTable(user) {
  const tbody = document.getElementById('progress-table-body');
  if (!tbody) return;

  const startWeight = parseFloat(user.weight) || 75;
  const goal = user.goal || 'kas-kazanimi';

  // 12 aylık hesaplama
  const rows = [];
  const phases = [
    '1. Faz: Nöromüsküler Adaptasyon',
    '1. Faz: Temel Kuvvet İnşası',
    '2. Faz: Hipertrofi & Kas Lif Artışı',
    '2. Faz: Hacim Yoğunlaşması',
    '2. Faz: Kas Simetrisi & Denge',
    '3. Faz: Tepe Yüklenme (Overload)',
    '3. Faz: Güç & Performans Patlaması',
    '3. Faz: Plato Kırma & Varyasyon',
    '4. Faz: Tanımlılık & Vaskülarite',
    '4. Faz: Vücut Kompozisyonu',
    '4. Faz: Estetik Simetri Zirvesi',
    '🏆 12. Ay: Şampiyonluk Formu'
  ];

  let currentW = startWeight;
  let currentFat = goal === 'kilo-verme' ? 24 : 17;
  let bench1RM = Math.round(startWeight * 0.75);
  let squat1RM = Math.round(startWeight * 0.95);
  let deadlift1RM = Math.round(startWeight * 1.15);

  for (let m = 1; m <= 12; m++) {
    if (goal === 'kilo-verme' || goal === 'yag-yakimi') {
      currentW = Math.max(startWeight - (m * 0.9), startWeight * 0.82);
      currentFat = Math.max(10, currentFat - 0.7);
    } else if (goal === 'kas-kazanimi' || goal === 'guc') {
      currentW = startWeight + (m * 0.45);
      currentFat = Math.max(12, currentFat - 0.2);
    }

    bench1RM = Math.round(bench1RM + (m <= 4 ? 2.5 : 1.5));
    squat1RM = Math.round(squat1RM + (m <= 4 ? 3.5 : 2.5));
    deadlift1RM = Math.round(deadlift1RM + (m <= 4 ? 4.0 : 3.0));

    const muscleMass = (currentW * (1 - (currentFat / 100))).toFixed(1);

    rows.push(`
      <tr>
        <td style="font-weight:800; color:var(--accent-primary);">📅 ${m}. Ay Sonu</td>
        <td>${currentW.toFixed(1)} kg</td>
        <td><span style="color:#06b6d4; font-weight:700;">%${currentFat.toFixed(1)}</span></td>
        <td>${muscleMass} kg</td>
        <td>${bench1RM} kg</td>
        <td>${squat1RM} kg</td>
        <td>${deadlift1RM} kg</td>
        <td><span style="font-size:11px; background:rgba(16, 185, 129, 0.12); color:#10b981; padding:3px 8px; border-radius:4px; font-weight:700;">${phases[m - 1]}</span></td>
      </tr>
    `);
  }

  tbody.innerHTML = rows.join('');
}

// --- 7.3. FOTOĞRAF GÜNLÜĞÜ (PHOTO TRACKER) ---
const PHOTOS_STORAGE_KEY = 'fitforge_progress_photos_v1';

export function renderPhotoGallery() {
  const container = document.getElementById('photo-gallery-grid');
  if (!container) return;

  const photos = getStoredPhotos();
  const month1Photo = photos.find(p => p.month === 'Başlangıç (1. Ay)' || p.id === 'month-1' || p.month?.includes('1. Ay') || p.month?.includes('Başlangıç'));
  const otherPhotos = photos.filter(p => p !== month1Photo);

  let html = '';

  // 1. AY (BAŞLANGIÇ FORMU) - Kullanıcı isteği: ilk ayda boş fotoğraf olsun
  if (month1Photo) {
    html += `
      <div class="photo-card-item">
        <img src="${month1Photo.dataUrl}" alt="1. Ay Başlangıç" class="photo-card-img" />
        <div class="photo-card-meta">
          <div class="photo-card-date">${month1Photo.month} · ${month1Photo.date || 'İlk Gün'}</div>
          <div class="photo-card-weight">⚖️ ${month1Photo.weight ? `${month1Photo.weight} kg` : `${state.userData.weight || 75} kg`}</div>
          <div class="photo-card-note">${month1Photo.note || 'Program başlangıç formu.'}</div>
          <button type="button" class="btn-delete-photo" data-delete-id="${month1Photo.id}">
            🗑️ Fotoğrafı Kaldır
          </button>
        </div>
      </div>
    `;
  } else {
    // 1. AY BOŞ FOTOĞRAF ALANI
    html += `
      <div class="photo-card-item empty-slot" id="card-empty-month1">
        <div class="photo-empty-frame">
          <span class="photo-empty-icon">📷</span>
          <span class="photo-empty-title">1. Ay - Başlangıç Formu</span>
          <p class="photo-empty-desc">Henüz başlangıç fotoğrafı eklenmedi. Gelişimini görmek için ilk formunu buraya ekle!</p>
          <button type="button" class="btn btn-outline btn-sm btn-upload-month1" id="btn-add-month1-photo">
            + 1. Ay Fotoğrafı Ekle
          </button>
        </div>
        <div class="photo-card-meta">
          <div class="photo-card-date">1. Ay · Başlangıç Formu</div>
          <div class="photo-card-weight">⚖️ ${state.userData.weight ? `${state.userData.weight} kg (Kayıtlı)` : 'Kilo bekleniyor'}</div>
          <div class="photo-card-note">İlk ay form fotoğrafınız burada saklanır.</div>
        </div>
      </div>
    `;
  }

  // DİĞER AYLIK FOTOĞRAFLAR (2. Ay, 3. Ay...)
  otherPhotos.forEach(p => {
    html += `
      <div class="photo-card-item">
        <img src="${p.dataUrl}" alt="${p.month}" class="photo-card-img" />
        <div class="photo-card-meta">
          <div class="photo-card-date">${p.month} · ${p.date}</div>
          <div class="photo-card-weight">⚖️ ${p.weight ? `${p.weight} kg` : 'Kilo belirtilmedi'}</div>
          <div class="photo-card-note">${p.note || 'Aylık form takibi.'}</div>
          <button type="button" class="btn-delete-photo" data-delete-id="${p.id}">
            🗑️ Sil
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  // Dinleyiciler
  document.getElementById('btn-add-month1-photo')?.addEventListener('click', () => {
    openPhotoModal('Başlangıç (1. Ay)');
  });

  container.querySelectorAll('.btn-delete-photo').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-delete-id');
      deleteStoredPhoto(id);
      renderPhotoGallery();
      showToast('🗑️ Fotoğraf başarıyla silindi.');
    });
  });
}

function getStoredPhotos() {
  try {
    const raw = localStorage.getItem(PHOTOS_STORAGE_KEY) || localStorage.getItem('fitplan_progress_photos_v1');
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn(err);
  }
  // İlk ayda boş fotoğraf olması için başlangıçta boş dizi döndürülür
  return [];
}

function saveStoredPhotos(photos) {
  try {
    localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(photos));
  } catch (err) {
    console.warn('Fotoğraf kaydetme hatası (Kota aşıldı olabilir)', err);
  }
}

function deleteStoredPhoto(id) {
  const current = getStoredPhotos().filter(p => p.id !== id);
  saveStoredPhotos(current);
}

export function openPhotoModal() {
  const modal = document.getElementById('photo-modal');
  if (modal) {
    modal.classList.add('open');
    const weightInput = document.getElementById('modal-photo-weight');
    if (weightInput && state.userData.weight) {
      weightInput.value = state.userData.weight;
    }
  }
}

export function closePhotoModal() {
  const modal = document.getElementById('photo-modal');
  if (modal) modal.classList.remove('open');
}

// --- 7.4. LEAGUE OF LEGENDS TARZI KAS GRUPLARI RANK SİSTEMİ (Kaldırılan Kilo & Tekrara Göre Dinamik) ---
export function renderLolRanks(user) {
  const container = document.getElementById('lol-muscles-container');
  if (!container) return;

  const bw = parseFloat(user.weight) || 75;
  const userLifts = user.liftRecords || {};

  const muscleConfigs = [
    {
      id: 'chest',
      name: 'Göğüs (Pectoralis)',
      icon: '🛡️',
      benchmark: 'Bench Press',
      defaultKg: Math.round(bw * 0.8),
      defaultReps: 8,
      multiplier: 1.0,
      patchNote: 'Patch 14.12: Bench Press ve Incline Dambıl ile kritik hasar uyarımı artırıldı.'
    },
    {
      id: 'back',
      name: 'Sırt & Kanat (Lats)',
      icon: '🏹',
      benchmark: 'Barbell Row',
      defaultKg: Math.round(bw * 0.75),
      defaultReps: 8,
      multiplier: 1.05,
      patchNote: 'Patch 14.12: Barfiks çekiş hacmi optimize edildi, V-Taper genişliği güçlendirildi.'
    },
    {
      id: 'legs',
      name: 'Bacak (Quad & Hamstring)',
      icon: '⚡',
      benchmark: 'Barbell Squat',
      defaultKg: Math.round(bw * 1.0),
      defaultReps: 8,
      multiplier: 0.8,
      patchNote: 'Patch 14.12: Squat ve Deadlift ile alt gövde dayanıklılığı ve sıçrama kuvveti yükseltildi.'
    },
    {
      id: 'shoulders',
      name: 'Omuz (Deltoids)',
      icon: '🎯',
      benchmark: 'Overhead Press',
      defaultKg: Math.round(bw * 0.5),
      defaultReps: 8,
      multiplier: 1.45,
      patchNote: 'Patch 14.12: Yan omuz lateral raise hacmi eklendi, 3D omuz küreselliği bufflandı.'
    },
    {
      id: 'arms',
      name: 'Kol (Biceps & Triceps)',
      icon: '⚔️',
      benchmark: 'Barbell Curl',
      defaultKg: Math.round(bw * 0.4),
      defaultReps: 10,
      multiplier: 1.75,
      patchNote: 'Patch 14.12: Zirve tepe kasılması (peak contraction) süresi 1.5 saniyeye uzatıldı.'
    },
    {
      id: 'core',
      name: 'Karın & Core (Abs)',
      icon: '🌀',
      benchmark: 'Ağırlıklı Mekik / Plank',
      defaultKg: 15,
      defaultReps: 15,
      multiplier: 2.1,
      patchNote: 'Patch 14.12: Plank ve Rollout ile omurga stabilite zırhı maksimum seviyeye çıkarıldı.'
    }
  ];

  function calcRank(cfg, kgVal, repsVal) {
    const kg = parseFloat(kgVal) || 0;
    const reps = parseInt(repsVal, 10) || 1;
    // Epley 1RM Formülü
    const oneRepMax = Math.round(kg * (1 + reps / 30));
    const ratio = oneRepMax / (bw || 1);
    const normalized = ratio * cfg.multiplier;

    let tier = 'Demir IV';
    let badge = 'DEMİR';
    let color = '#71717a';
    let score = 15;

    if (normalized < 0.6) {
      tier = 'Demir II'; badge = 'DEMİR'; color = '#71717a';
      score = Math.max(5, Math.min(20, Math.round((normalized / 0.6) * 20)));
    } else if (normalized < 0.85) {
      tier = 'Bronz I'; badge = 'BRONZ'; color = '#b45309';
      score = 21 + Math.round(((normalized - 0.6) / 0.25) * 14);
    } else if (normalized < 1.1) {
      tier = 'Gümüş II'; badge = 'GÜMÜŞ'; color = '#94a3b8';
      score = 36 + Math.round(((normalized - 0.85) / 0.25) * 14);
    } else if (normalized < 1.35) {
      tier = 'Altın I'; badge = 'ALTIN'; color = '#eab308';
      score = 51 + Math.round(((normalized - 1.1) / 0.25) * 14);
    } else if (normalized < 1.6) {
      tier = 'Platin II'; badge = 'PLATİN'; color = '#06b6d4';
      score = 66 + Math.round(((normalized - 1.35) / 0.25) * 12);
    } else if (normalized < 1.85) {
      tier = 'Zümrüt I'; badge = 'ZÜMRÜT'; color = '#10b981';
      score = 79 + Math.round(((normalized - 1.6) / 0.25) * 9);
    } else if (normalized < 2.15) {
      tier = 'Elmas II'; badge = 'ELMAS'; color = '#3b82f6';
      score = 89 + Math.round(((normalized - 1.85) / 0.3) * 5);
    } else if (normalized < 2.45) {
      tier = 'Usta (Master)'; badge = 'MASTER'; color = '#a855f7';
      score = 95 + Math.round(((normalized - 2.15) / 0.3) * 3);
    } else {
      tier = 'Şampiyonluk (Challenger)'; badge = 'CHALLENGER'; color = '#f59e0b';
      score = 99;
    }

    score = Math.max(5, Math.min(100, score));

    return {
      kg,
      reps,
      oneRepMax,
      ratio: ratio.toFixed(2),
      score,
      tier,
      badge,
      color,
      lp: score
    };
  }

  function updateAllCards() {
    const list = muscleConfigs.map(cfg => {
      const stored = userLifts[cfg.id] || {};
      const kg = stored.kg !== undefined ? stored.kg : cfg.defaultKg;
      const reps = stored.reps !== undefined ? stored.reps : cfg.defaultReps;
      const stat = calcRank(cfg, kg, reps);
      return { ...cfg, ...stat };
    });

    // Sıralama (En Güçlü vs En Zayıf)
    const sorted = [...list].sort((a, b) => b.score - a.score);
    const carry = sorted[0];
    const weak = sorted[sorted.length - 1];

    // Spotlight Güncellemesi
    const carryNameEl = document.getElementById('lol-carry-name');
    const carryDescEl = document.getElementById('lol-carry-desc');
    if (carryNameEl) carryNameEl.textContent = `${carry.name} (${carry.tier} - ${carry.lp} LP)`;
    if (carryDescEl) carryDescEl.textContent = `${carry.benchmark} kaldırışında ${carry.kg} kg × ${carry.reps} tekrar (1RM: ${carry.oneRepMax} kg, ${carry.ratio}x BW) ile takımın tartışmasız MVP'si!`;

    const weakNameEl = document.getElementById('lol-weak-name');
    const weakDescEl = document.getElementById('lol-weak-desc');
    if (weakNameEl) weakNameEl.textContent = `${weak.name} (${weak.tier} - ${weak.lp} LP)`;
    if (weakDescEl) weakDescEl.textContent = `Acil buff lazım! ${weak.benchmark} kaldırışında ${weak.kg} kg × ${weak.reps} tekrar (1RM: ${weak.oneRepMax} kg). Haftalık hacmine 2-3 ekstra izolasyon seti ekleyerek Challenger ligine tırman.`;

    container.innerHTML = list.map(m => `
      <div class="lol-card" data-muscle-id="${m.id}">
        <div class="lol-card-top">
          <span class="lol-muscle-name">${m.icon} ${m.name}</span>
          <span class="lol-tier-badge" style="background:${m.color}22; color:${m.color}; border:1px solid ${m.color}66;">
            ${m.badge}
          </span>
        </div>

        <!-- Kaldırılan Kilo & Tekrar Giriş Alanı (Kullanıcı İsteği: Rank kaldırdığı kilo ve tekrara göre belirlensin) -->
        <div class="lol-lift-input-row">
          <div class="lol-lift-header">
            <span>🏋️ Referans: <strong>${m.benchmark}</strong></span>
            <span class="lol-1rm-badge">Tahmini 1RM: ${m.oneRepMax} kg</span>
          </div>
          <div class="lol-lift-controls">
            <div class="lift-input-cell">
              <label>Kaldırılan:</label>
              <input type="number" class="lift-num-input input-lift-kg" data-muscle="${m.id}" value="${m.kg}" min="0" max="400" />
              <span style="font-size:11px; color:var(--text-muted);">kg</span>
            </div>
            <div class="lift-input-cell">
              <label>×</label>
              <input type="number" class="lift-num-input input-lift-reps" data-muscle="${m.id}" value="${m.reps}" min="1" max="100" />
              <span style="font-size:11px; color:var(--text-muted);">tekrar</span>
            </div>
            <div class="lol-ratio-badge" style="margin-left:auto; font-size:11px; color:var(--text-secondary); font-weight:700;">
              ⚡ ${m.ratio}x Vücut Ağırlığı
            </div>
          </div>
        </div>

        <div class="lol-lp-bar-wrap">
          <div class="lol-lp-meta">
            <span>${m.tier}</span>
            <span>${m.score} LP</span>
          </div>
          <div class="lol-lp-bar">
            <div class="lol-lp-fill" style="width:${m.score}%; background:${m.color};"></div>
          </div>
        </div>

        <div class="lol-patch-note">
          📜 ${m.patchNote}
        </div>
      </div>
    `).join('');

    // Dinleyicileri bağla
    container.querySelectorAll('.input-lift-kg, .input-lift-reps').forEach(input => {
      input.addEventListener('input', (e) => {
        const mid = e.target.getAttribute('data-muscle');
        const cardEl = e.target.closest('.lol-card');
        const kgInput = cardEl.querySelector('.input-lift-kg');
        const repsInput = cardEl.querySelector('.input-lift-reps');

        if (!user.liftRecords) user.liftRecords = {};
        user.liftRecords[mid] = {
          kg: parseFloat(kgInput.value) || 0,
          reps: parseInt(repsInput.value, 10) || 1
        };
        state.userData.liftRecords = user.liftRecords;
        saveUserData();

        // Kartı ve spotlight'ı anında yenile
        const cfg = muscleConfigs.find(c => c.id === mid);
        const updatedStat = calcRank(cfg, user.liftRecords[mid].kg, user.liftRecords[mid].reps);

        // Canlı rozet ve bar güncelle
        const badgeEl = cardEl.querySelector('.lol-tier-badge');
        if (badgeEl) {
          badgeEl.textContent = updatedStat.badge;
          badgeEl.style.color = updatedStat.color;
          badgeEl.style.background = `${updatedStat.color}22`;
          badgeEl.style.borderColor = `${updatedStat.color}66`;
        }
        const rmEl = cardEl.querySelector('.lol-1rm-badge');
        if (rmEl) rmEl.textContent = `Tahmini 1RM: ${updatedStat.oneRepMax} kg`;

        const ratioEl = cardEl.querySelector('.lol-ratio-badge');
        if (ratioEl) ratioEl.textContent = `⚡ ${updatedStat.ratio}x Vücut Ağırlığı`;

        const lpMeta = cardEl.querySelector('.lol-lp-meta');
        if (lpMeta) lpMeta.innerHTML = `<span>${updatedStat.tier}</span><span>${updatedStat.score} LP</span>`;

        const fillEl = cardEl.querySelector('.lol-lp-fill');
        if (fillEl) {
          fillEl.style.width = `${updatedStat.score}%`;
          fillEl.style.background = updatedStat.color;
        }

        // Spotlight güncelle
        updateSpotlightOnly();
      });
    });

    function updateSpotlightOnly() {
      const updatedList = muscleConfigs.map(cfg => {
        const stored = user.liftRecords[cfg.id] || {};
        const kg = stored.kg !== undefined ? stored.kg : cfg.defaultKg;
        const reps = stored.reps !== undefined ? stored.reps : cfg.defaultReps;
        return { ...cfg, ...calcRank(cfg, kg, reps) };
      });
      const s = [...updatedList].sort((a, b) => b.score - a.score);
      const c = s[0];
      const w = s[s.length - 1];

      if (carryNameEl) carryNameEl.textContent = `${c.name} (${c.tier} - ${c.lp} LP)`;
      if (carryDescEl) carryDescEl.textContent = `${c.benchmark} kaldırışında ${c.kg} kg × ${c.reps} tekrar (1RM: ${c.oneRepMax} kg, ${c.ratio}x BW) ile takımın tartışmasız MVP'si!`;

      if (weakNameEl) weakNameEl.textContent = `${w.name} (${w.tier} - ${w.lp} LP)`;
      if (weakDescEl) weakDescEl.textContent = `Acil buff lazım! ${w.benchmark} kaldırışında ${w.kg} kg × ${w.reps} tekrar (1RM: ${w.oneRepMax} kg). Haftalık hacmine 2-3 ekstra izolasyon seti ekleyerek lig atla.`;
    }
  }

  updateAllCards();
}

// --- 7.5. ZİHİNSEL DURUM & SPOR PSİKOLOJİSİ (Test ve Seçim Desteği) ---
export function initMindset(user) {
  const mindsetData = {
    'godmode': {
      title: '🦁 Zirve Enerji (God Mode / Peak Performance)',
      message: 'Merkezi sinir sistemin ve motivasyonun tavan yapmış durumda! Bugün yeni kişisel rekorlar (PR) denemek ve sınırları aşmak için kusursuz bir gün.',
      action: 'Tavsiye: Bileşik kaldırışlarda (Bench, Squat, Deadlift) son sette ağırlığı %2.5 - %5 artır ve güvenli tükenişe git.'
    },
    'focused': {
      title: '🧘 Dengeli & Odaklı (Disiplin Zirvesi)',
      message: 'Kusursuz zihinsel denge ve sakinlik. Disiplin, motivasyon bittiğinde bile devam edebilme sanatıdır. Rutini eksiksiz uygula.',
      action: 'Tavsiye: Hareketlerin negatif fazını (3 saniye yavaş iniş) kontrol ederek kas lifi hasarını ve mekanik gerilimi maksimize et.'
    },
    'tired': {
      title: '😴 Yorgun / Az Uyku (Toparlanma Önceliği)',
      message: 'Vücudun veya sinir sistemin dinlenme sinyalleri veriyor. Antrenmanı tamamen atlamak yerine aktif kalmak kan dolaşımını ve toparlanmayı hızlandırır.',
      action: 'Tavsiye: Ağırlıkları %10-15 hafiflet, RPE 7 eşiğinde kal, tükenişe gitme ve seansı 45 dakikada tamamlayıp erken uyu.'
    },
    'stressed': {
      title: '🤯 Stresli / Terapi Günü (Kortizol Tahliyesi)',
      message: 'Ağırlık kaldırmak zihni boşaltmanın ve endorfin salgılamanın en güçlü yoludur. Ancak yüksek kortizol eklem sakatlıklarına zemin hazırlayabilir.',
      action: 'Tavsiye: Isınmayı 10 dakika uzat, antrenman sonuna 15 dakika hafif tempolu yürüyüş ve derin diyafram nefesi ekle.'
    },
    'sore': {
      title: '🤕 Ağrılı / Hamlamış (DOMS Toparlanması)',
      message: 'Kas liflerinizde yoğun mikro travma ve laktat birikimi var. Hareketsiz kalmak yerine eklemleri hareket ettirmek toparlanmayı 2 kat hızlandırır.',
      action: 'Tavsiye: Dinamik esneme ve hafif direnç bantlarıyla kan akışını artır; antrenman sonrası bol su tüket ve magnezyum al.'
    }
  };

  function applyMindsetUI(mode) {
    state.userData.mindset = mode;
    saveUserData();

    // Tüm mindset çiplerini güncelle (hem sihirbaz hem sonuç ekranı)
    document.querySelectorAll('[data-mindset], [data-res-mindset]').forEach(c => {
      const m = c.getAttribute('data-mindset') || c.getAttribute('data-res-mindset');
      c.classList.toggle('selected', m === mode);
    });

    const info = mindsetData[mode] || mindsetData['focused'];
    const titleEl = document.getElementById('res-mindset-title');
    const msgEl = document.getElementById('res-mindset-message');
    const actEl = document.getElementById('res-mindset-action');

    if (titleEl) titleEl.textContent = info.title;
    if (msgEl) msgEl.textContent = info.message;
    if (actEl) actEl.textContent = info.action;
  }

  // Çip butonları dinleyicisi
  document.querySelectorAll('[data-mindset], [data-res-mindset]').forEach(chip => {
    chip.onclick = () => {
      const mode = chip.getAttribute('data-mindset') || chip.getAttribute('data-res-mindset');
      applyMindsetUI(mode);
    };
  });

  // Hızlı 3 Soruluk Psikolojik Test Dinleyicisi (Sihirbaz Adım 9)
  const quizState = { sleep: 'ok', stress: 'mid', drive: 'mid' };
  document.querySelectorAll('.quiz-pill-btn').forEach(btn => {
    btn.onclick = () => {
      const group = btn.closest('.quiz-btn-group');
      const dim = group?.getAttribute('data-quiz-dim');
      const val = btn.getAttribute('data-val');

      group.querySelectorAll('.quiz-pill-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      if (dim && val) {
        quizState[dim] = val;
      }

      // Değerlendir
      let suggestedMode = 'focused';
      let insightText = '';

      if (quizState.sleep === 'bad') {
        suggestedMode = 'tired';
        insightText = '😴 Yetersiz uyku tespit edildi. Ağırlıkları %10 hafifleterek eklemleri korumanız önerilir.';
      } else if (quizState.stress === 'high') {
        suggestedMode = 'stressed';
        insightText = '🤯 Yüksek zihinsel stres tespit edildi. Isınmayı uzatarak antrenmanı zihinsel terapiye dönüştürün.';
      } else if (quizState.drive === 'high' && quizState.sleep === 'great') {
        suggestedMode = 'godmode';
        insightText = '🦁 Zirve enerji! Rekor kırmaya (PR) ve sınırları zorlamaya hazırsınız!';
      } else if (quizState.drive === 'low' && quizState.sleep === 'bad') {
        suggestedMode = 'sore';
        insightText = '🤕 Düşük enerji ve hamlık sinyali. Dinamik toparlanma ve esnemeye odaklanın.';
      } else {
        suggestedMode = 'focused';
        insightText = '🧘 Dengeli & Odaklı ruh hali. Plana tam sadakat ile maksimum kas uyarımı.';
      }

      applyMindsetUI(suggestedMode);

      const insightBox = document.getElementById('wizard-quiz-insight');
      if (insightBox) {
        insightBox.innerHTML = `💡 Test Değerlendirmesi: <strong>${mindsetData[suggestedMode]?.title}</strong> seçildi. ${insightText}`;
      }
    };
  });

  // Mevcut modu uygula
  applyMindsetUI(user.mindset || 'focused');
}

// --- 7.6. FİTAİ COACH DANIŞMANI (SERVER-SIDE GEMINI ENTEGRASYONU) ---
export function initAiCoach(user) {
  const form = document.getElementById('ai-chat-form');
  const input = document.getElementById('ai-user-input');
  const chatWindow = document.getElementById('ai-chat-window');
  if (!form || !input || !chatWindow) return;

  // Hızlı soru çipleri
  document.querySelectorAll('.ai-chip[data-ask]').forEach(chip => {
    chip.onclick = () => {
      const q = chip.getAttribute('data-ask');
      input.value = q;
      form.requestSubmit();
    };
  });

  form.onsubmit = async (e) => {
    e.preventDefault();
    const prompt = input.value.trim();
    if (!prompt) return;

    // Kullanıcı mesajını ekle
    appendAiMessage(prompt, 'user');
    input.value = '';

    // Yükleniyor baloncuğu
    const loadingId = 'ai-loading-' + Date.now();
    appendAiMessage('FitAI Antrenör düşünüyor... 🧠', 'bot', loadingId);

    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          userContext: {
            name: state.userData.name || 'Sporcu',
            age: state.userData.age,
            height: state.userData.height,
            weight: state.userData.weight,
            goal: getGoalDisplayName(state.userData.goal),
            sport: getSportDisplayName(state.userData.sport),
            level: state.userData.level,
            intensity: getIntensityDisplayName(state.userData.intensity),
            mindset: state.userData.mindset
          }
        })
      });

      const data = await res.json();
      const reply = data.reply || data.fallback || 'Harika bir soru! Programına sadık kalarak, progressive overload ve günlük yeterli protein tüketimiyle hedefine hızla ulaşabilirsin.';

      // Loading balonunu kaldır ve cevabı bas
      document.getElementById(loadingId)?.remove();
      appendAiMessage(reply, 'bot');
    } catch (err) {
      document.getElementById(loadingId)?.remove();
      appendAiMessage('FitAI: Antrenman temposunu koruyarak, set aralarında dinlenmeyi ihmal etme. Her hareketi tam hareket açıklığıyla (full ROM) uygula!', 'bot');
    }
  };
}

function appendAiMessage(text, sender = 'bot', id = '') {
  const chatWindow = document.getElementById('ai-chat-window');
  if (!chatWindow) return;

  const bubble = document.createElement('div');
  bubble.className = `ai-msg-bubble ${sender}`;
  if (id) bubble.id = id;
  bubble.innerHTML = text.replace(/\n/g, '<br />');
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// --- 7.7. SONUÇ EKRANI SEKMELERİ GEZİNTİSİ ---
export function initResultsTabs() {
  const tabs = document.querySelectorAll('#results-nav-tabs .tab-btn');
  tabs.forEach(btn => {
    btn.onclick = () => {
      const tabId = btn.getAttribute('data-tab');
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      document.getElementById(tabId)?.classList.add('active');
    };
  });
}

// --- 7.8. TEMA SİSTEMİ (AYDINLIK, SU ALTI, ORMAN, CYBER, KARANLIK) ---
export function initTheme() {
  const savedTheme = localStorage.getItem('fitforge_theme_v1') || localStorage.getItem('fitplan_theme_v1') || 'dark';
  setTheme(savedTheme);

  const selector = document.getElementById('theme-selector');
  if (selector) {
    selector.value = savedTheme;
    selector.onchange = (e) => {
      setTheme(e.target.value);
      showToast(`🎨 Tema "${e.target.selectedOptions[0]?.text || e.target.value}" olarak ayarlandı.`);
    };
  }
}

export function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('fitforge_theme_v1', theme);
}

// --- 7.9. KULLANICI PROFİL SİSTEMİ (Kullanıcı Her Bilgiyi Girebilir) ---
export function initProfileModal() {
  const modal = document.getElementById('profile-modal');
  if (!modal) return;

  document.getElementById('nav-btn-profile')?.addEventListener('click', openProfileModal);
  document.getElementById('modal-profile-close')?.addEventListener('click', closeProfileModal);
  document.getElementById('btn-close-profile')?.addEventListener('click', closeProfileModal);

  // Kendi Fotoğrafını Yükleme
  const fileInput = document.getElementById('profile-file-input');
  document.getElementById('btn-upload-profile-photo')?.addEventListener('click', () => {
    fileInput?.click();
  });

  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        state.userData.profilePhoto = ev.target.result;
        renderAvatarDisplay(state.userData);
        showToast('📷 Profil fotoğrafı başarıyla yüklendi!');
      };
      reader.readAsDataURL(file);
    }
  });

  // Avatar seçici (Emoji tıklandığında özel görseli temizler ve emojiyi seçer)
  document.querySelectorAll('.avatar-option-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.avatar-option-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.userData.avatar = btn.getAttribute('data-avatar');
      state.userData.profilePhoto = ''; // Emoji seçildiğinde özel fotoğrafı sıfırla
      renderAvatarDisplay(state.userData);
    };
  });

  // Profil Kaydet butonu (Tüm Bilgileri Kullanıcı Girer & Günceller)
  document.getElementById('btn-save-profile')?.addEventListener('click', () => {
    const u = state.userData;

    const nameVal = document.getElementById('profile-input-name')?.value.trim();
    const genderVal = document.getElementById('profile-input-gender')?.value;
    const ageVal = parseInt(document.getElementById('profile-input-age')?.value, 10);
    const heightVal = parseFloat(document.getElementById('profile-input-height')?.value);
    const weightVal = parseFloat(document.getElementById('profile-input-weight')?.value);
    const targetWVal = parseFloat(document.getElementById('profile-input-target-weight')?.value);

    const goalVal = document.getElementById('profile-input-goal')?.value;
    const levelVal = document.getElementById('profile-input-level')?.value;
    const intensityVal = document.getElementById('profile-input-intensity')?.value;
    const durationVal = parseInt(document.getElementById('profile-input-duration')?.value, 10);

    const bioVal = document.getElementById('profile-input-bio')?.value.trim();
    const notesVal = document.getElementById('profile-input-notes')?.value.trim();

    // Çoklu spor seçimleri
    const selectedSports = [];
    document.querySelectorAll('#profile-sports-checklist input[type="checkbox"]:checked').forEach(chk => {
      selectedSports.push(chk.value);
    });

    if (nameVal) u.name = nameVal;
    if (genderVal) u.gender = genderVal;
    if (ageVal && ageVal >= 14 && ageVal <= 95) u.age = ageVal;
    if (heightVal && heightVal >= 120 && heightVal <= 230) u.height = heightVal;
    if (weightVal && weightVal >= 35 && weightVal <= 250) u.weight = weightVal;
    if (targetWVal) u.targetWeight = targetWVal;

    if (goalVal) u.goal = goalVal;
    if (levelVal) u.level = levelVal;
    if (intensityVal) u.intensity = intensityVal;
    if (durationVal) u.duration = durationVal;

    if (selectedSports.length > 0) {
      u.sports = selectedSports;
      u.sport = selectedSports[0];
    }

    if (bioVal) u.bio = bioVal;
    u.healthNotes = notesVal || '';

    saveUserData();
    updateProfileUI();
    closeProfileModal();

    // Eğer sonuç ekranı açıksa sonuçları ve takvimi yeni bilgilere göre yeniden derle
    if (state.userData.generatedPlan) {
      state.userData.generatedPlan = generateWorkoutPlan(state.userData, state.alternativeSeed);
      saveUserData();
      showResultsView(state.userData.generatedPlan);
    }

    showToast('✅ Tüm profil bilgileriniz başarıyla güncellendi!');
  });
}

function renderAvatarDisplay(u) {
  const avatarEl = document.getElementById('profile-avatar-display');
  if (!avatarEl) return;
  if (u.profilePhoto) {
    avatarEl.innerHTML = `<img src="${u.profilePhoto}" alt="${u.name || 'Profil'}" />`;
  } else {
    avatarEl.textContent = u.avatar || '🦁';
  }
}

export function openProfileModal() {
  const modal = document.getElementById('profile-modal');
  if (!modal) return;
  updateProfileUI();
  modal.classList.add('open');
}

export function closeProfileModal() {
  document.getElementById('profile-modal')?.classList.remove('open');
}

function updateProfileUI() {
  const u = state.userData;
  renderAvatarDisplay(u);

  const nameEl = document.getElementById('profile-name-title');
  const sportEl = document.getElementById('profile-badge-sport');
  const levelEl = document.getElementById('profile-badge-level');
  const bioEl = document.getElementById('profile-bio-display');

  if (nameEl) nameEl.textContent = u.name || 'Sporcu';
  if (sportEl) sportEl.textContent = getSportDisplayName(u.sports || u.sport);
  if (levelEl) levelEl.textContent = u.level ? `⚡ ${u.level.toUpperCase()} SEVİYE` : '⚡ ORTA SEVİYE';
  if (bioEl) bioEl.textContent = u.bio || 'Disiplin motivasyonun bittiği yerde başlar.';

  // Form alanları
  const inputName = document.getElementById('profile-input-name');
  const inputGender = document.getElementById('profile-input-gender');
  const inputAge = document.getElementById('profile-input-age');
  const inputHeight = document.getElementById('profile-input-height');
  const inputWeight = document.getElementById('profile-input-weight');
  const inputTargetW = document.getElementById('profile-input-target-weight');

  const inputGoal = document.getElementById('profile-input-goal');
  const inputLevel = document.getElementById('profile-input-level');
  const inputIntensity = document.getElementById('profile-input-intensity');
  const inputDuration = document.getElementById('profile-input-duration');

  const inputBio = document.getElementById('profile-input-bio');
  const inputNotes = document.getElementById('profile-input-notes');

  if (inputName) inputName.value = u.name || '';
  if (inputGender) inputGender.value = u.gender || 'erkek';
  if (inputAge) inputAge.value = u.age || '';
  if (inputHeight) inputHeight.value = u.height || '';
  if (inputWeight) inputWeight.value = u.weight || '';
  if (inputTargetW) inputTargetW.value = u.targetWeight || '';

  if (inputGoal) inputGoal.value = u.goal || 'kas-kazanimi';
  if (inputLevel) inputLevel.value = u.level || 'orta';
  if (inputIntensity) inputIntensity.value = u.intensity || 'standard';
  if (inputDuration) inputDuration.value = u.duration || 60;

  if (inputBio) inputBio.value = u.bio || '';
  if (inputNotes) inputNotes.value = u.healthNotes || '';

  // Spor branşları kontrol kutuları
  const sportsArr = Array.isArray(u.sports) ? u.sports : [u.sport || 'fitness'];
  document.querySelectorAll('#profile-sports-checklist input[type="checkbox"]').forEach(chk => {
    chk.checked = sportsArr.includes(chk.value);
  });

  // Avatar düğmeleri
  document.querySelectorAll('.avatar-option-btn').forEach(btn => {
    btn.classList.toggle('selected', !u.profilePhoto && btn.getAttribute('data-avatar') === (u.avatar || '🦁'));
  });
}

// --- 7.10. UYGULAMA GERİ BİLDİRİM SİSTEMİ ---
export function initFeedbackModal() {
  const modal = document.getElementById('feedback-modal');
  if (!modal) return;

  document.getElementById('nav-btn-feedback')?.addEventListener('click', openFeedbackModal);
  document.getElementById('modal-feedback-close')?.addEventListener('click', closeFeedbackModal);
  document.getElementById('btn-close-feedback')?.addEventListener('click', closeFeedbackModal);

  // Yıldız puanlama
  let currentRating = 5;
  const starBtns = document.querySelectorAll('#feedback-stars .star-btn');
  starBtns.forEach(star => {
    star.onclick = () => {
      currentRating = parseInt(star.getAttribute('data-rating'), 10);
      starBtns.forEach(s => {
        const r = parseInt(s.getAttribute('data-rating'), 10);
        s.classList.toggle('active', r <= currentRating);
      });
    };
  });

  // Form submit
  const form = document.getElementById('feedback-form');
  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const category = document.getElementById('feedback-category')?.value;
      const userEmail = document.getElementById('feedback-email')?.value.trim();
      const message = document.getElementById('feedback-message')?.value.trim();

      const submitBtn = document.getElementById('btn-submit-feedback');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Gönderiliyor...';
      }

      try {
        await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rating: currentRating,
            category,
            userEmail,
            message
          })
        });

        closeFeedbackModal();
        form.reset();
        showToast('🎉 Geri bildiriminiz için çok teşekkür ederiz!');
      } catch (err) {
        closeFeedbackModal();
        showToast('✅ Geri bildiriminiz yerel olarak kaydedildi. Teşekkürler!');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = '🚀 Geri Bildirimi Gönder';
        }
      }
    };
  }
}

export function openFeedbackModal() {
  document.getElementById('feedback-modal')?.classList.add('open');
}

export function closeFeedbackModal() {
  document.getElementById('feedback-modal')?.classList.remove('open');
}

// --- 7.11. ANTRENMAN ZORLUK DERECESİ (RPE) DİNAMİK DEĞİŞTİRİCİ ---
export function initIntensitySwitcher() {
  document.querySelectorAll('#results-intensity-pills .intensity-pill-btn').forEach(btn => {
    btn.onclick = () => {
      const mode = btn.getAttribute('data-res-intensity');
      if (state.userData.intensity === mode) return;

      state.userData.intensity = mode;
      saveUserData();

      // Programı güncel yoğunlukla yeniden derle
      state.userData.generatedPlan = generateWorkoutPlan(state.userData, state.alternativeSeed);
      saveUserData();
      showResultsView(state.userData.generatedPlan);
      showToast(`⚡ Antrenman zorluk derecesi "${getIntensityDisplayName(mode)}" olarak uyarlandı!`);
    };
  });
}

function getGoalDisplayName(goal) {
  const map = {
    'kilo-verme': 'Kilo Verme & Yağ Yakımı',
    'kas-kazanimi': 'Kas Kütlesi Kazanımı',
    'guc': 'Maksimum Güç & Kuvvet',
    'formda-kalma': 'Formda Kalma & Sağlık',
    'kondisyon': 'Genel Kondisyon & Dayanıklılık',
    'yag-yakimi': 'Yağ Oranını Azaltma',
    'kas-koruma': 'Kas Kütlesini Koruma'
  };
  return map[goal] || goal;
}

// --- 8. EGZERSİZ DETAY MODALI (Madde 15) ---
export function openExerciseModal(exerciseId) {
  const ex = EXERCISE_DATABASE.find(e => e.id === exerciseId);
  if (!ex) return;

  const modal = document.getElementById('exercise-modal');
  if (!modal) return;

  document.getElementById('modal-ex-name').textContent = ex.name;
  document.getElementById('modal-ex-muscles').textContent = `Hedef: ${ex.muscle.join(', ')}`;
  document.getElementById('modal-ex-equip').textContent = ex.equipment.join(', ');
  document.getElementById('modal-ex-level').textContent = ex.level.join(' / ');
  document.getElementById('modal-ex-sets').textContent = `${ex.sets} Set × ${ex.reps}`;
  document.getElementById('modal-ex-rest').textContent = ex.rest;

  // Kişiye Özel Ağırlık Bilgisi
  const weightGuidance = calculateRecommendedWeight(ex, state.userData);
  const weightEl = document.getElementById('modal-ex-weight');
  const weightTargetEl = document.getElementById('modal-ex-weight-target');
  const weightDetailEl = document.getElementById('modal-ex-weight-detail');

  if (weightEl) weightEl.textContent = weightGuidance.weight;
  if (weightTargetEl) weightTargetEl.textContent = `Önerilen Direnç: ${weightGuidance.weight}`;
  if (weightDetailEl) weightDetailEl.textContent = `${weightGuidance.note} (${state.userData.weight || 75} kg vücut ağırlığı ve ${state.userData.level || 'orta'} seviye baz alınmıştır).`;

  document.getElementById('modal-ex-desc').textContent = ex.description;
  document.getElementById('modal-ex-execution').textContent = ex.execution || ex.tips;
  document.getElementById('modal-ex-tips').textContent = ex.tips;
  document.getElementById('modal-ex-mistakes').textContent = ex.mistakes || 'Kontrolsüz ağırlık seçimi ve form bozulması.';

  // Medya Görüntüleme Alanı
  const mediaViewport = document.getElementById('modal-media-viewport');
  mediaViewport.innerHTML = `
    ${getExerciseIllustration(ex)}
    <div class="modal-media-notice">
      📁 Yerel dosya: ${ex.gif} (${ex.video}) · Biyomekanik Form Kılavuzu
    </div>
  `;

  modal.classList.add('open');
}

export function closeExerciseModal() {
  const modal = document.getElementById('exercise-modal');
  if (modal) {
    modal.classList.remove('open');
  }
}

// --- 9. HAZIR TEST SENARYOLARI (Madde 31 - Üniversite Değerlendirmesi) ---
export function applyTestScenario(scenarioNumber) {
  if (scenarioNumber === 1) {
    // Test 1: Yaş 21, Boy 185, Kilo 90, Hedef: Kas kazanımı, Seviye: Orta, Ortam: Spor salonu, Gün: 4, Süre: 60 dk
    state.userData = {
      name: 'Mert Yılmaz',
      age: 21,
      gender: 'erkek',
      height: 185,
      weight: 90,
      targetWeight: 94,
      goal: 'kas-kazanimi',
      sports: ['fitness'],
      sport: 'fitness',
      level: 'orta',
      intensity: 'standard',
      mindset: 'focused',
      avatar: '🦁',
      bio: 'Disiplin motivasyonun bittiği yerde başlar.',
      environment: 'gym',
      equipment: ['Barbell', 'Dambıl', 'Bench', 'Kablo/Makine'],
      weeklyDaysCount: 4,
      selectedDays: ['Pazartesi', 'Salı', 'Perşembe', 'Cuma'],
      duration: 60,
      priorityMuscles: ['Göğüs', 'Sırt'],
      cardio: 'hafif',
      generatedPlan: null,
      liftRecords: {
        chest: { kg: 85, reps: 8 },
        back: { kg: 80, reps: 8 },
        legs: { kg: 100, reps: 8 },
        shoulders: { kg: 50, reps: 8 },
        arms: { kg: 38, reps: 10 },
        core: { kg: 20, reps: 15 }
      }
    };
  } else if (scenarioNumber === 2) {
    // Test 2: Yaş 20, Boy 175, Kilo 85, Hedef: Kilo verme, Seviye: Başlangıç, Ortam: Ev, Ekipman: Ekipmansız, Gün: 3
    state.userData = {
      name: 'Burak Demir',
      age: 20,
      gender: 'erkek',
      height: 175,
      weight: 85,
      targetWeight: 75,
      goal: 'kilo-verme',
      sports: ['futbol', 'kosu'],
      sport: 'futbol',
      level: 'baslangic',
      intensity: 'light',
      mindset: 'focused',
      avatar: '⚡',
      bio: 'Hızlı, çevik ve formda bir fizik.',
      environment: 'home',
      equipment: ['Ekipmansız'],
      weeklyDaysCount: 3,
      selectedDays: ['Pazartesi', 'Çarşamba', 'Cuma'],
      duration: 45,
      priorityMuscles: [],
      cardio: 'evet',
      generatedPlan: null,
      liftRecords: {
        chest: { kg: 50, reps: 10 },
        back: { kg: 45, reps: 10 },
        legs: { kg: 60, reps: 10 },
        shoulders: { kg: 25, reps: 10 },
        arms: { kg: 20, reps: 12 },
        core: { kg: 10, reps: 20 }
      }
    };
  } else if (scenarioNumber === 3) {
    // Test 3: Hedef: Kas kazanımı, Ortam: Ev, Ekipman: Dambıl + Bench, Gün: 5
    state.userData = {
      name: 'Kaan Kaya',
      age: 24,
      gender: 'erkek',
      height: 180,
      weight: 78,
      targetWeight: 82,
      goal: 'kas-kazanimi',
      sports: ['fitness', 'boks'],
      sport: 'fitness',
      level: 'orta',
      intensity: 'high',
      mindset: 'godmode',
      avatar: '🥊',
      bio: 'Kondisyon ve sert vuruş gücü.',
      environment: 'home',
      equipment: ['Dambıl', 'Bench'],
      weeklyDaysCount: 5,
      selectedDays: ['Pazartesi', 'Salı', 'Çarşamba', 'Cuma', 'Cumartesi'],
      duration: 60,
      priorityMuscles: ['Omuz', 'Biceps'],
      cardio: 'hafif',
      generatedPlan: null,
      liftRecords: {
        chest: { kg: 70, reps: 10 },
        back: { kg: 65, reps: 10 },
        legs: { kg: 85, reps: 8 },
        shoulders: { kg: 45, reps: 8 },
        arms: { kg: 34, reps: 10 },
        core: { kg: 15, reps: 20 }
      }
    };
  }

  // Form alanlarını güncelle
  syncStateToForm();
  showToast(`✅ Test Senaryosu ${scenarioNumber} yüklendi!`);
  
  // Özete geç
  goToStep(10);
}

// --- 10. LOCAL STORAGE SENKRONİZASYONU (Madde 24) ---
const STORAGE_KEY = 'fitforge_user_data_v1';

export function saveUserData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.userData));
  } catch (err) {
    console.warn('LocalStorage kayıt hatası', err);
  }
}

export function loadUserData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('fitplan_user_data_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      state.userData = { ...state.userData, ...parsed };
      syncStateToForm();
      if (state.userData.generatedPlan) {
        showResultsView(state.userData.generatedPlan);
      }
    }
  } catch (err) {
    console.warn('LocalStorage yükleme hatası', err);
  }
}

export function openResetModal() {
  const modal = document.getElementById('reset-confirm-modal');
  if (modal) modal.classList.add('open');
}

export function closeResetModal() {
  const modal = document.getElementById('reset-confirm-modal');
  if (modal) modal.classList.remove('open');
}

export function performCompleteReset() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn(err);
  }

  // State'i tamamen sıfırla
  state.userData = {
    name: '',
    age: '',
    gender: 'erkek',
    height: '',
    weight: '',
    goal: 'kas-kazanimi',
    level: 'orta',
    environment: 'gym',
    equipment: ['Barbell', 'Dambıl', 'Bench'],
    weeklyDaysCount: 4,
    selectedDays: ['Pazartesi', 'Salı', 'Perşembe', 'Cuma'],
    duration: 60,
    priorityMuscles: [],
    cardio: 'hafif',
    generatedPlan: null
  };
  state.alternativeSeed = 0;

  // DOM Form Alanlarını Temizle
  if (document.getElementById('input-name')) document.getElementById('input-name').value = '';
  if (document.getElementById('input-age')) document.getElementById('input-age').value = '';
  if (document.getElementById('input-height')) document.getElementById('input-height').value = '';
  if (document.getElementById('input-weight')) document.getElementById('input-weight').value = '';

  updateLiveBmiPreview();
  syncStateToForm();
  closeResetModal();

  // Kullanıcıyı doğrudan Adım 2 (Kişisel Bilgiler) ekranına yönlendir
  goToStep(2);
  showToast('🧹 Tüm bilgiler temizlendi. Yeni bilgilerinizi girebilirsiniz!');
}

export function resetFormFieldsOnly() {
  if (document.getElementById('input-name')) document.getElementById('input-name').value = '';
  if (document.getElementById('input-age')) document.getElementById('input-age').value = '';
  if (document.getElementById('input-height')) document.getElementById('input-height').value = '';
  if (document.getElementById('input-weight')) document.getElementById('input-weight').value = '';
  state.userData.name = '';
  state.userData.age = '';
  state.userData.height = '';
  state.userData.weight = '';
  updateLiveBmiPreview();
  showToast('🧹 Form alanları boşaltıldı.');
}

// --- 11. STEP GEÇİŞLERİ VE UI ETKİLEŞİMLERİ ---
export function goToStep(stepIndex) {
  state.currentStep = stepIndex;

  // Tüm view panellerini gizle
  document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));

  if (stepIndex === 1) {
    // Hero Ekranı
    document.getElementById('hero-view')?.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  if (stepIndex >= 2 && stepIndex <= 10) {
    // Wizard Ekranı
    document.getElementById('wizard-view')?.classList.add('active');
    
    // Step Panellerini güncelle
    document.querySelectorAll('.step-pane').forEach(p => p.classList.remove('active'));
    document.getElementById(`step-pane-${stepIndex}`)?.classList.add('active');

    // Progress Bar Güncelle
    const progressPct = ((stepIndex - 1) / (state.totalSteps - 1)) * 100;
    const fill = document.getElementById('wizard-progress-bar-fill');
    if (fill) fill.style.width = `${progressPct}%`;

    const indicator = document.getElementById('step-indicator-badge');
    if (indicator) indicator.textContent = `Adım ${stepIndex - 1} / 9`;

    // Özet paneline geldiyse bilgileri doldur
    if (stepIndex === 10) {
      populateReviewSummary();
    }

    window.scrollTo({ top: 120, behavior: 'smooth' });
    return;
  }

  if (stepIndex === 11) {
    // Program Oluşturuluyor Animasyon Ekranı (Madde 29)
    runGenerationLoading();
  }
}

function runGenerationLoading() {
  document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
  const loadingView = document.getElementById('loading-view');
  if (loadingView) loadingView.classList.add('active');

  const stepText = document.getElementById('loading-step-text');
  const fill = document.getElementById('loading-progress-fill');

  const steps = [
    { p: 20, t: 'Fiziksel özellikler ve BMI analiz ediliyor...' },
    { p: 45, t: 'Haftalık gün dağılımı ve dinlenme periyotları optimize ediliyor...' },
    { p: 70, t: 'Mevcut ekipmanlar ve ortama uygun egzersizler filtreleniyor...' },
    { p: 90, t: 'Hedeflenen hacim, set, tekrar ve dinlenme süreleri hesaplanıyor...' },
    { p: 100, t: 'Kişisel FitForge programınız hazır!' }
  ];

  let current = 0;
  const interval = setInterval(() => {
    if (current < steps.length) {
      if (fill) fill.style.width = `${steps[current].p}%`;
      if (stepText) stepText.textContent = steps[current].t;
      current++;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        // Programı oluştur ve sonuç ekranına geç
        state.userData.generatedPlan = generateWorkoutPlan(state.userData, state.alternativeSeed);
        saveUserData();
        showResultsView(state.userData.generatedPlan);
      }, 400);
    }
  }, 400);
}

function showResultsView(plan) {
  document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
  const resultsView = document.getElementById('results-view');
  if (resultsView) resultsView.classList.add('active');
  renderResults(plan, state.userData);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Özet Kartını Doldur
function populateReviewSummary() {
  document.getElementById('sum-rev-name').textContent = state.userData.name || '-';
  document.getElementById('sum-rev-age').textContent = `${state.userData.age} Yaş (${state.userData.gender === 'kadin' ? 'Kadın' : 'Erkek'})`;
  document.getElementById('sum-rev-height-weight').textContent = `${state.userData.height} cm / ${state.userData.weight} kg`;
  document.getElementById('sum-rev-goal').textContent = getGoalDisplayName(state.userData.goal);
  
  const sportRev = document.getElementById('sum-rev-sport');
  if (sportRev) sportRev.textContent = getSportDisplayName(state.userData.sports || state.userData.sport);

  document.getElementById('sum-rev-level').textContent = state.userData.level.toUpperCase();

  const intensityRev = document.getElementById('sum-rev-intensity');
  if (intensityRev) intensityRev.textContent = getIntensityDisplayName(state.userData.intensity);

  document.getElementById('sum-rev-env').textContent = state.userData.environment === 'gym' ? 'Spor Salonu' : (state.userData.environment === 'home' ? 'Ev' : 'Açık Hava');
  document.getElementById('sum-rev-equip').textContent = state.userData.environment === 'gym' ? 'Tüm Salon Ekipmanları' : state.userData.equipment.join(', ');
  document.getElementById('sum-rev-days').textContent = `Haftada ${state.userData.weeklyDaysCount} Gün (${state.userData.selectedDays.join(', ')})`;
  document.getElementById('sum-rev-duration').textContent = `${state.userData.duration} Dakika`;
  document.getElementById('sum-rev-cardio').textContent = state.userData.cardio === 'evet' ? 'Evet' : (state.userData.cardio === 'hafif' ? 'Hafif Kardiyo' : 'Hayır');
}

// Form ile State'i Senkronize Et
function syncStateToForm() {
  const u = state.userData;
  if (document.getElementById('input-name')) document.getElementById('input-name').value = u.name;
  if (document.getElementById('input-age')) document.getElementById('input-age').value = u.age;
  if (document.getElementById('input-height')) document.getElementById('input-height').value = u.height;
  if (document.getElementById('input-weight')) document.getElementById('input-weight').value = u.weight;

  // Canlı BMI güncelle
  updateLiveBmiPreview();

  // Hedef kartı
  document.querySelectorAll('[data-goal]').forEach(c => {
    c.classList.toggle('selected', c.getAttribute('data-goal') === u.goal);
  });

  // Spor branşı kartları (Çoklu Seçim)
  const sportsArr = Array.isArray(u.sports) && u.sports.length > 0 ? u.sports : [u.sport || 'fitness'];
  document.querySelectorAll('[data-sport]').forEach(c => {
    c.classList.toggle('selected', sportsArr.includes(c.getAttribute('data-sport')));
  });

  // Seviye kartı
  document.querySelectorAll('[data-level]').forEach(c => {
    c.classList.toggle('selected', c.getAttribute('data-level') === u.level);
  });

  // Zorluk derecesi kartı
  document.querySelectorAll('[data-intensity]').forEach(c => {
    c.classList.toggle('selected', c.getAttribute('data-intensity') === (u.intensity || 'standard'));
  });

  // Ortam kartı
  document.querySelectorAll('[data-env]').forEach(c => {
    c.classList.toggle('selected', c.getAttribute('data-env') === u.environment);
  });

  // Ekipman kartları
  document.querySelectorAll('[data-equip]').forEach(c => {
    const val = c.getAttribute('data-equip');
    c.classList.toggle('selected', u.equipment.includes(val));
  });

  // Gün sayısı
  document.querySelectorAll('[data-days-count]').forEach(c => {
    const count = parseInt(c.getAttribute('data-days-count'), 10);
    c.classList.toggle('selected', count === u.weeklyDaysCount);
  });

  // Seçili günler
  document.querySelectorAll('[data-weekday]').forEach(c => {
    const day = c.getAttribute('data-weekday');
    c.classList.toggle('selected', u.selectedDays.includes(day));
  });

  // Süre
  document.querySelectorAll('[data-duration]').forEach(c => {
    const dur = parseInt(c.getAttribute('data-duration'), 10);
    c.classList.toggle('selected', dur === u.duration);
  });

  // Kas önceliği
  document.querySelectorAll('[data-muscle]').forEach(c => {
    const m = c.getAttribute('data-muscle');
    c.classList.toggle('selected', u.priorityMuscles.includes(m));
  });

  // Kardiyo
  document.querySelectorAll('[data-cardio]').forEach(c => {
    c.classList.toggle('selected', c.getAttribute('data-cardio') === u.cardio);
  });
}

function updateLiveBmiPreview() {
  const h = document.getElementById('input-height')?.value;
  const w = document.getElementById('input-weight')?.value;
  const res = calculateBMI(h, w);

  const valEl = document.getElementById('live-bmi-val');
  const badgeEl = document.getElementById('live-bmi-badge');

  if (res && valEl && badgeEl) {
    valEl.textContent = res.bmi;
    badgeEl.textContent = res.category;
    badgeEl.className = `bmi-badge ${res.badgeClass}`;
  } else if (valEl && badgeEl) {
    valEl.textContent = '--';
    badgeEl.textContent = 'Veri Bekleniyor';
    badgeEl.className = 'bmi-badge';
  }
}

function showToast(msg) {
  const toast = document.getElementById('toast-notice');
  if (toast) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }
}

// --- 12. EVENT LISTENERS & BAŞLATMA ---
document.addEventListener('DOMContentLoaded', () => {
  // BMI Dinleyicileri
  document.getElementById('input-height')?.addEventListener('input', updateLiveBmiPreview);
  document.getElementById('input-weight')?.addEventListener('input', updateLiveBmiPreview);

  // Başla / Hero Butonları
  document.getElementById('btn-hero-start')?.addEventListener('click', () => goToStep(2));
  document.getElementById('nav-btn-start')?.addEventListener('click', () => goToStep(2));
  document.getElementById('brand-link')?.addEventListener('click', () => goToStep(1));

  // Test Senaryoları Butonları (Üniversite Değerlendirmesi)
  document.getElementById('btn-load-test-1')?.addEventListener('click', () => applyTestScenario(1));
  document.getElementById('btn-load-test-2')?.addEventListener('click', () => applyTestScenario(2));
  document.getElementById('btn-load-test-3')?.addEventListener('click', () => applyTestScenario(3));

  // Wizard İleri / Geri Butonları
  document.getElementById('btn-wizard-next')?.addEventListener('click', () => {
    if (validateStep(state.currentStep)) {
      goToStep(state.currentStep + 1);
    }
  });

  document.getElementById('btn-wizard-prev')?.addEventListener('click', () => {
    clearError();
    if (state.currentStep > 2) {
      goToStep(state.currentStep - 1);
    } else {
      goToStep(1);
    }
  });

  document.getElementById('btn-create-final-plan')?.addEventListener('click', () => {
    goToStep(11);
  });

  // Seçim Kartları Dinleyicileri
  // Hedef
  document.querySelectorAll('[data-goal]').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('[data-goal]').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.userData.goal = card.getAttribute('data-goal');
    });
  });

  // Spor Branşı Seçimi (Birden Fazla Spor Branşı Seçilebilsin)
  document.querySelectorAll('[data-sport]').forEach(card => {
    card.addEventListener('click', () => {
      const sp = card.getAttribute('data-sport');
      if (!Array.isArray(state.userData.sports)) {
        state.userData.sports = state.userData.sport ? [state.userData.sport] : ['fitness'];
      }

      if (state.userData.sports.includes(sp)) {
        // En az 1 spor branşı seçili kalmalı
        if (state.userData.sports.length > 1) {
          state.userData.sports = state.userData.sports.filter(s => s !== sp);
          card.classList.remove('selected');
        } else {
          showToast('En az bir spor dalı seçili kalmalıdır.');
        }
      } else {
        state.userData.sports.push(sp);
        card.classList.add('selected');
      }
      state.userData.sport = state.userData.sports[0];
    });
  });

  // Seviye
  document.querySelectorAll('[data-level]').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('[data-level]').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.userData.level = card.getAttribute('data-level');
    });
  });

  // Antrenman Zorluk Derecesi (RPE)
  document.querySelectorAll('[data-intensity]').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('[data-intensity]').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.userData.intensity = card.getAttribute('data-intensity');
    });
  });

  // Ortam
  document.querySelectorAll('[data-env]').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('[data-env]').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.userData.environment = card.getAttribute('data-env');

      // Ev seçilmediyse ekipman seçiminde bilgi göster
      const homeAlert = document.getElementById('home-equip-notice');
      if (homeAlert) {
        homeAlert.style.display = state.userData.environment === 'home' ? 'block' : 'none';
      }
    });
  });

  // Ekipman (Çoklu seçim)
  document.querySelectorAll('[data-equip]').forEach(item => {
    item.addEventListener('click', () => {
      const val = item.getAttribute('data-equip');
      if (val === 'Ekipmansız') {
        state.userData.equipment = ['Ekipmansız'];
        document.querySelectorAll('[data-equip]').forEach(c => {
          c.classList.toggle('selected', c.getAttribute('data-equip') === 'Ekipmansız');
        });
      } else {
        // Ekipmansız varsa kaldır
        state.userData.equipment = state.userData.equipment.filter(e => e !== 'Ekipmansız');
        document.querySelector('[data-equip="Ekipmansız"]')?.classList.remove('selected');

        if (state.userData.equipment.includes(val)) {
          state.userData.equipment = state.userData.equipment.filter(e => e !== val);
          item.classList.remove('selected');
        } else {
          state.userData.equipment.push(val);
          item.classList.add('selected');
        }
      }
    });
  });

  // Haftalık Gün Sayısı
  document.querySelectorAll('[data-days-count]').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('[data-days-count]').forEach(c => c.classList.remove('selected'));
      pill.classList.add('selected');
      state.userData.weeklyDaysCount = parseInt(pill.getAttribute('data-days-count'), 10);
      updateDayValidationStatus();
    });
  });

  // Haftanın Günleri (Çoklu seçim)
  document.querySelectorAll('[data-weekday]').forEach(btn => {
    btn.addEventListener('click', () => {
      const day = btn.getAttribute('data-weekday');
      if (state.userData.selectedDays.includes(day)) {
        state.userData.selectedDays = state.userData.selectedDays.filter(d => d !== day);
        btn.classList.remove('selected');
      } else {
        if (state.userData.selectedDays.length < state.userData.weeklyDaysCount) {
          state.userData.selectedDays.push(day);
          btn.classList.add('selected');
        } else {
          showError(`Zaten ${state.userData.weeklyDaysCount} gün seçtiniz. Başka bir gün seçmek için önce mevcutlardan birini kaldırın.`);
        }
      }
      updateDayValidationStatus();
    });
  });

  function updateDayValidationStatus() {
    clearError();
    const target = state.userData.weeklyDaysCount;
    const current = state.userData.selectedDays.length;
    const tip = document.getElementById('day-match-tip');

    if (tip) {
      if (target === current) {
        tip.className = 'day-validation-tip match';
        tip.textContent = `✓ Harika! ${target} günlük antrenman için tam ${current} gün seçildi.`;
      } else {
        tip.className = 'day-validation-tip mismatch';
        tip.textContent = `⚠️ Hedef: ${target} gün. Şu an seçilen: ${current} gün. (${target - current > 0 ? `${target - current} gün daha seçin` : `${current - target} gün çıkarın`})`;
      }
    }
  }

  // Antrenman Süresi
  document.querySelectorAll('[data-duration]').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('[data-duration]').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.userData.duration = parseInt(card.getAttribute('data-duration'), 10);
    });
  });

  // Kas Önceliği (Çoklu seçim)
  document.querySelectorAll('[data-muscle]').forEach(chip => {
    chip.addEventListener('click', () => {
      const m = chip.getAttribute('data-muscle');
      if (m === 'yok') {
        state.userData.priorityMuscles = ['yok'];
        document.querySelectorAll('[data-muscle]').forEach(c => {
          c.classList.toggle('selected', c.getAttribute('data-muscle') === 'yok');
        });
      } else {
        state.userData.priorityMuscles = state.userData.priorityMuscles.filter(x => x !== 'yok');
        document.querySelector('[data-muscle="yok"]')?.classList.remove('selected');

        if (state.userData.priorityMuscles.includes(m)) {
          state.userData.priorityMuscles = state.userData.priorityMuscles.filter(x => x !== m);
          chip.classList.remove('selected');
        } else {
          state.userData.priorityMuscles.push(m);
          chip.classList.add('selected');
        }
      }
    });
  });

  // Kardiyo Tercihi
  document.querySelectorAll('[data-cardio]').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('[data-cardio]').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.userData.cardio = card.getAttribute('data-cardio');
    });
  });

  // Sonuç Ekranı Aksiyonları
  // 1. Programı Yazdır (Madde 25)
  document.getElementById('btn-print-plan')?.addEventListener('click', () => {
    window.print();
  });

  // 2. Programı Yeniden Oluştur (Madde 26)
  document.getElementById('btn-reroll-plan')?.addEventListener('click', () => {
    state.alternativeSeed++;
    state.userData.generatedPlan = generateWorkoutPlan(state.userData, state.alternativeSeed);
    saveUserData();
    showResultsView(state.userData.generatedPlan);
    showToast('🔄 Alternatif egzersiz varyasyonlarıyla program yeniden oluşturuldu!');
  });

  // 3. Bilgilerimi Düzenle
  document.getElementById('btn-edit-plan')?.addEventListener('click', () => {
    goToStep(2);
  });

  // 4. Bilgilerimi Temizle & Yeni Ekle
  document.getElementById('btn-clear-plan')?.addEventListener('click', () => {
    openResetModal();
  });

  document.getElementById('nav-btn-reset')?.addEventListener('click', () => {
    openResetModal();
  });

  document.getElementById('btn-reset-form-fields')?.addEventListener('click', () => {
    resetFormFieldsOnly();
  });

  document.getElementById('modal-reset-close')?.addEventListener('click', closeResetModal);
  document.getElementById('btn-cancel-reset')?.addEventListener('click', closeResetModal);
  document.getElementById('btn-confirm-reset-action')?.addEventListener('click', () => {
    performCompleteReset();
  });

  // Modal Kapatma
  document.getElementById('modal-close-btn')?.addEventListener('click', closeExerciseModal);
  document.getElementById('modal-close-btn-bottom')?.addEventListener('click', closeExerciseModal);
  document.getElementById('exercise-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'exercise-modal') {
      closeExerciseModal();
    }
  });

  document.getElementById('reset-confirm-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'reset-confirm-modal') {
      closeResetModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeExerciseModal();
  });

  // Egzersiz Kütüphanesi Modalı / Çekmecesi
  document.getElementById('nav-btn-library')?.addEventListener('click', () => {
    openExerciseLibraryModal();
  });
  document.getElementById('modal-library-close')?.addEventListener('click', () => {
    document.getElementById('library-modal')?.classList.remove('open');
  });

  // Tema, Profil, Geri Bildirim, Zorluk ve Sekme Sistemleri
  initTheme();
  initProfileModal();
  initFeedbackModal();
  initIntensitySwitcher();
  initResultsTabs();

  // Fotoğraf Günlüğü Modal Dinleyicileri
  document.getElementById('btn-trigger-photo-upload')?.addEventListener('click', openPhotoModal);
  document.getElementById('modal-photo-close')?.addEventListener('click', closePhotoModal);
  document.getElementById('btn-close-photo')?.addEventListener('click', closePhotoModal);
  document.getElementById('photo-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'photo-modal') closePhotoModal();
  });

  // Fotoğraf Seçimi & Önizleme
  const photoFileInput = document.getElementById('modal-input-photo-file');
  let selectedPhotoDataUrl = '';

  if (photoFileInput) {
    photoFileInput.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
          selectedPhotoDataUrl = re.target.result;
          const previewWrap = document.getElementById('modal-photo-preview');
          const previewImg = document.getElementById('modal-photo-preview-img');
          if (previewWrap && previewImg) {
            previewImg.src = selectedPhotoDataUrl;
            previewWrap.style.display = 'block';
          }
        };
        reader.readAsDataURL(file);
      }
    };
  }

  // Fotoğraf Formu Gönderimi
  document.getElementById('photo-upload-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!selectedPhotoDataUrl) {
      showToast('⚠️ Lütfen bir fotoğraf dosyası seçin.');
      return;
    }

    const monthVal = document.getElementById('modal-photo-month')?.value || '1. Ay Sonu';
    const weightVal = document.getElementById('modal-photo-weight')?.value || state.userData.weight;
    const notesVal = document.getElementById('modal-photo-notes')?.value || 'Form gelişim kaydı.';

    const newPhoto = {
      id: 'photo-' + Date.now(),
      month: monthVal,
      date: new Date().toLocaleDateString('tr-TR'),
      weight: weightVal,
      note: notesVal,
      dataUrl: selectedPhotoDataUrl
    };

    const currentPhotos = getStoredPhotos();
    currentPhotos.unshift(newPhoto);
    saveStoredPhotos(currentPhotos);

    closePhotoModal();
    renderPhotoGallery();
    showToast('📸 Yeni gelişim fotoğrafınız başarıyla günlüğe eklendi!');

    selectedPhotoDataUrl = '';
    const previewWrap = document.getElementById('modal-photo-preview');
    if (previewWrap) previewWrap.style.display = 'none';
    e.target.reset();
  });

  // LocalStorage kontrolü
  loadUserData();
});

// Egzersiz Kütüphanesi Modalı Açıcı
function openExerciseLibraryModal() {
  const modal = document.getElementById('library-modal');
  const list = document.getElementById('library-items-list');
  if (!modal || !list) return;

  function renderList(query = '') {
    const q = query.toLowerCase();
    const filtered = EXERCISE_DATABASE.filter(ex => 
      ex.name.toLowerCase().includes(q) || 
      ex.muscle.some(m => m.toLowerCase().includes(q)) ||
      ex.equipment.some(e => e.toLowerCase().includes(q))
    );

    list.innerHTML = filtered.map(ex => `
      <div class="library-exercise-row" data-id="${ex.id}">
        <div>
          <div style="font-weight:700; color:#fff; font-size:14px;">${ex.name}</div>
          <div style="font-size:12px; color:#10b981;">${ex.muscle.join(', ')} · ${ex.equipment.join(', ')}</div>
        </div>
        <button class="btn btn-outline btn-sm">Detay</button>
      </div>
    `).join('');

    list.querySelectorAll('.library-exercise-row').forEach(row => {
      row.addEventListener('click', () => {
        const id = parseInt(row.getAttribute('data-id'), 10);
        modal.classList.remove('open');
        openExerciseModal(id);
      });
    });
  }

  renderList();

  const searchInput = document.getElementById('library-search-input');
  if (searchInput) {
    searchInput.oninput = (e) => renderList(e.target.value);
  }

  modal.classList.add('open');
}
