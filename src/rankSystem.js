/**
 * FitPlan - League of Legends Tarzı Kas Grupları Rank Sistemi (Tier List & LP)
 * Her kas grubuna Challenger'dan Iron'a kadar rütbe, LP puanı, Main Carry ve Feedleyen Bölge analizi
 */

const TIERS = [
  { min: 90, tier: 'CHALLENGER', name: 'Şampiyonluk Aşaması', badge: '🏆', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  { min: 80, tier: 'GRANDMASTER', name: 'Üstat Aşaması', badge: '🔥', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
  { min: 70, tier: 'DIAMOND', name: 'Elmas Aşaması', badge: '💎', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)' },
  { min: 55, tier: 'PLATINUM', name: 'Platin Aşaması', badge: '💠', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
  { min: 40, tier: 'GOLD', name: 'Altın Aşaması', badge: '🥇', color: '#eab308', bg: 'rgba(234, 179, 8, 0.15)' },
  { min: 25, tier: 'SILVER', name: 'Gümüş Aşaması', badge: '🥈', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)' },
  { min: 10, tier: 'BRONZE', name: 'Bronz Aşaması', badge: '🥉', color: '#b45309', bg: 'rgba(180, 83, 9, 0.15)' },
  { min: 0,  tier: 'IRON', name: 'Demir Aşaması', badge: '🛡️', color: '#64748b', bg: 'rgba(100, 116, 139, 0.15)' }
];

export function calculateMuscleRanks(user, workoutPlan) {
  const muscleGroups = [
    { key: 'Göğüs', name: 'Göğüs (Chest)', baseLp: 60, icon: '🛡️' },
    { key: 'Sırt', name: 'Sırt & Kanat (Back & Lats)', baseLp: 62, icon: '🦅' },
    { key: 'Omuz', name: 'Omuz (Deltoids)', baseLp: 55, icon: '⚡' },
    { key: 'Biceps', name: 'Biceps (Ön Kol / Pazu)', baseLp: 50, icon: '💪' },
    { key: 'Triceps', name: 'Triceps (Arka Kol)', baseLp: 52, icon: '🗡️' },
    { key: 'Bacak', name: 'Bacak & Kalça (Quads & Glutes)', baseLp: 65, icon: '🦵' },
    { key: 'Hamstring', name: 'Arka Bacak (Hamstrings)', baseLp: 45, icon: '🎯' },
    { key: 'Karın', name: 'Karın & Core (Abs)', baseLp: 48, icon: '🧱' },
    { key: 'Baldır', name: 'Baldır (Calves)', baseLp: 30, icon: '🏃' }
  ];

  const userPriorities = user?.priorityMuscles || [];
  const level = user?.level || 'orta';
  const intensity = user?.intensity || 'standard';

  // Antrenman planındaki egzersizleri analiz et ve kaslara LP ekle
  const exerciseCounts = {};
  if (workoutPlan && Array.isArray(workoutPlan)) {
    workoutPlan.forEach(day => {
      if (!day.isRest && day.exercises) {
        day.exercises.forEach(ex => {
          if (ex.muscle) {
            ex.muscle.forEach(m => {
              exerciseCounts[m] = (exerciseCounts[m] || 0) + 1;
            });
          }
        });
      }
    });
  }

  const rankedMuscles = muscleGroups.map(group => {
    let lp = group.baseLp;

    // Seviye çarpanı
    if (level === 'ileri') lp += 15;
    else if (level === 'baslangic') lp -= 10;

    // Zorluk / RPE çarpanı
    if (intensity === 'high') lp += 10;
    else if (intensity === 'light') lp -= 5;

    // Kullanıcı öncelikli kas olarak seçmişse devasa Buff (+20 LP)
    if (userPriorities.includes(group.key)) {
      lp += 22;
    }

    // Haftalık planda yer alma sıklığına göre LP
    const matchCount = Object.keys(exerciseCounts).reduce((acc, m) => {
      if (m.toLowerCase().includes(group.key.toLowerCase())) {
        return acc + exerciseCounts[m];
      }
      return acc;
    }, 0);

    lp += matchCount * 4;

    // Sınırla (0 - 99 LP)
    lp = Math.min(99, Math.max(8, lp));

    // Tier belirleme
    const tierInfo = TIERS.find(t => lp >= t.min) || TIERS[TIERS.length - 1];

    // Yama Notları (LoL Patch Notes)
    let patchNote = '';
    let statusType = 'balanced';

    if (lp >= 80) {
      statusType = 'carry';
      patchNote = '🔥 META CANAVARI: Takımı sırtlayan birincil bölge. Progressive overload ile dominasyonunu koru.';
    } else if (lp >= 55) {
      statusType = 'solid';
      patchNote = '🛡️ SAĞLAM LANE: Dengeli hacim ve stabil gelişim eğrisi. Sürekliliği koru.';
    } else {
      statusType = 'weak';
      patchNote = '⚠️ ACİL GANK GEREKLİ: Gelişimde geride kaldı. Haftalık programa +2 set izolasyon buffı öneriliyor.';
    }

    return {
      ...group,
      lp,
      tier: tierInfo.tier,
      tierName: tierInfo.name,
      badge: tierInfo.badge,
      color: tierInfo.color,
      bg: tierInfo.bg,
      statusType,
      patchNote,
      weeklySets: Math.max(3, matchCount * 3)
    };
  });

  // Sırala (En yüksekten en düşüğe)
  rankedMuscles.sort((a, b) => b.lp - a.lp);

  const mainCarry = rankedMuscles[0];
  const feedingMuscle = rankedMuscles[rankedMuscles.length - 1];

  return {
    rankedMuscles,
    mainCarry,
    feedingMuscle,
    totalPowerRating: Math.round(rankedMuscles.reduce((sum, m) => sum + m.lp, 0) / rankedMuscles.length)
  };
}
