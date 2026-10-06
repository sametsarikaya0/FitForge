/**
 * FitPlan - Ay Ay Gelişim Projeksiyonu & Fotoğraf Günlüğü Motoru
 * Bilimsel adaptasyon hızıyla 1, 2, 3, 6 ve 12 aylık ölçüm ve 1RM tahminleri
 */

const PHOTO_STORAGE_KEY = 'fitplan_progress_photos_v1';

export function calculateMonthlyProjection(user) {
  const currentWeight = parseFloat(user?.weight) || 75;
  const currentHeight = parseFloat(user?.height) || 178;
  const isFemale = user?.gender === 'kadin';
  const goal = user?.goal || 'kas-kazanimi';
  const level = user?.level || 'orta';

  // Tahmini başlangıç yağ oranı
  let startingBodyFat = isFemale ? 24 : 17;
  if (goal === 'kilo-verme') startingBodyFat = isFemale ? 30 : 23;
  else if (goal === 'kas-kazanimi' && level === 'ileri') startingBodyFat = isFemale ? 20 : 13;

  // Başlangıç 1RM tahminleri (kg)
  const baseBench = Math.round(currentWeight * (isFemale ? 0.45 : 0.75));
  const baseSquat = Math.round(currentWeight * (isFemale ? 0.65 : 1.0));
  const baseDeadlift = Math.round(currentWeight * (isFemale ? 0.75 : 1.25));

  const milestones = [
    { month: 0, label: 'Başlangıç (Gün 0)', weightDelta: 0, fatDelta: 0, muscleDelta: 0, strengthMultiplier: 1.0 },
    { month: 1, label: '1. Ay (Adaptasyon)', weightDelta: goal === 'kas-kazanimi' ? +1.2 : -2.5, fatDelta: -1.2, muscleDelta: +0.8, strengthMultiplier: 1.08 },
    { month: 2, label: '2. Ay (Hipertrofi)', weightDelta: goal === 'kas-kazanimi' ? +2.2 : -4.8, fatDelta: -2.3, muscleDelta: +1.6, strengthMultiplier: 1.15 },
    { month: 3, label: '3. Ay (Dönüşüm)', weightDelta: goal === 'kas-kazanimi' ? +3.0 : -6.5, fatDelta: -3.5, muscleDelta: +2.3, strengthMultiplier: 1.22 },
    { month: 6, label: '6. Ay (Gözle Görülür)', weightDelta: goal === 'kas-kazanimi' ? +5.0 : -10.0, fatDelta: -5.5, muscleDelta: +3.8, strengthMultiplier: 1.35 },
    { month: 12, label: '12. Ay (Zirve Form)', weightDelta: goal === 'kas-kazanimi' ? +7.5 : -14.0, fatDelta: -7.5, muscleDelta: +5.5, strengthMultiplier: 1.50 }
  ];

  const projectionRows = milestones.map(m => {
    let projWeight = currentWeight;
    if (goal === 'kas-kazanimi' || goal === 'guc') {
      projWeight = currentWeight + m.weightDelta;
    } else if (goal === 'kilo-verme' || goal === 'yag-yakimi') {
      projWeight = Math.max(isFemale ? 45 : 55, currentWeight + m.weightDelta);
    }

    const projFat = Math.max(isFemale ? 14 : 8, startingBodyFat + m.fatDelta).toFixed(1);
    const projMuscle = (projWeight * (1 - (parseFloat(projFat) / 100)) * 0.65).toFixed(1);

    return {
      month: m.month,
      label: m.label,
      weight: projWeight.toFixed(1),
      bodyFat: `${projFat}%`,
      leanMuscle: `${projMuscle} kg`,
      bench1RM: `${Math.round(baseBench * m.strengthMultiplier)} kg`,
      squat1RM: `${Math.round(baseSquat * m.strengthMultiplier)} kg`,
      deadlift1RM: `${Math.round(baseDeadlift * m.strengthMultiplier)} kg`,
      milestoneFocus: m.month === 0 ? 'Mevcut Durum' : (m.month <= 2 ? 'Nöromüsküler Güç' : (m.month === 3 ? 'Estetik Dönüşüm' : 'Kalıcı Atletik Zirve'))
    };
  });

  return projectionRows;
}

// Fotoğraf Depolama Yönetimi
export function getSavedProgressPhotos() {
  try {
    const raw = localStorage.getItem(PHOTO_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn(err);
  }
  return [];
}

export function saveProgressPhoto(photoItem) {
  try {
    const current = getSavedProgressPhotos();
    current.unshift(photoItem);
    localStorage.setItem(PHOTO_STORAGE_KEY, JSON.stringify(current));
    return current;
  } catch (err) {
    console.warn('Fotoğraf kayıt hatası (muhtemelen storage limiti)', err);
    throw err;
  }
}

export function deleteProgressPhoto(id) {
  try {
    const current = getSavedProgressPhotos().filter(p => p.id !== id);
    localStorage.setItem(PHOTO_STORAGE_KEY, JSON.stringify(current));
    return current;
  } catch (err) {
    console.warn(err);
    return [];
  }
}
