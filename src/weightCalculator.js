/**
 * FitPlan - Akıllı Ağırlık & Yüklenme Hesaplayıcı
 * Kullanıcının vücut ağırlığı, cinsiyeti, seviyesi ve egzersiz türüne göre
 * bilimsel başlangıç ve çalışma ağırlığı önerileri hesaplar.
 */

export function calculateRecommendedWeight(exercise, user) {
  const w = parseFloat(user?.weight) || 75;
  const isFemale = user?.gender === 'kadin';
  const level = user?.level || 'orta';
  const intensity = user?.intensity || 'standard';
  const intensityMultiplier = intensity === 'light' ? 0.85 : (intensity === 'high' ? 1.15 : 1.0);
  const levelMultiplier = (level === 'baslangic' ? 0.75 : (level === 'ileri' ? 1.25 : 1.0)) * intensityMultiplier;
  const genderMultiplier = isFemale ? 0.65 : 1.0;
  const lowerBodyGenderMultiplier = isFemale ? 0.80 : 1.0;

  const slug = exercise.slug || '';
  const equip = exercise.equipment || [];

  // Kardiyo hareketleri
  if (exercise.type === 'cardio') {
    return {
      weight: 'Vücut Ağırlığı',
      note: 'Dinamik tempo & süre odaklı'
    };
  }

  // Vücut Ağırlığı / Kalisteniks
  if (equip.includes('Ekipmansız') && !equip.includes('Dambıl') && !equip.includes('Barbell')) {
    if (slug.includes('push-up') || slug.includes('dips') || slug.includes('pull-up') || slug.includes('chin-up')) {
      if (level === 'ileri') {
        return {
          weight: 'Vücut + 5-10 kg',
          note: 'Ağırlık yeleği veya kemer ile ek direnç'
        };
      }
      return {
        weight: 'Vücut Ağırlığı',
        note: 'Kendi kilonuz ile kontrollü hareket'
      };
    }
    if (slug.includes('plank') || slug.includes('crunch') || slug.includes('leg-raise') || slug.includes('twist')) {
      return {
        weight: 'Vücut Ağırlığı',
        note: 'Merkez bölge izometrik direnç'
      };
    }
    return {
      weight: 'Vücut Ağırlığı',
      note: 'Yüksek tekrar ve doğru form kontrolü'
    };
  }

  // Temel Halter (Barbell) Hareketleri
  if (slug === 'bench-press') {
    const base = w * 0.70 * genderMultiplier * levelMultiplier;
    const min = Math.round((base * 0.9) / 2.5) * 2.5;
    const max = Math.round((base * 1.1) / 2.5) * 2.5;
    return {
      weight: `${Math.max(20, min)} - ${Math.max(25, max)} kg`,
      note: `Halter + Plakalar (~%${Math.round(70 * genderMultiplier * levelMultiplier)} BW)`
    };
  }

  if (slug === 'squat' || slug === 'front-squat') {
    const base = w * 0.85 * lowerBodyGenderMultiplier * levelMultiplier;
    const min = Math.round((base * 0.9) / 2.5) * 2.5;
    const max = Math.round((base * 1.1) / 2.5) * 2.5;
    return {
      weight: `${Math.max(25, min)} - ${Math.max(30, max)} kg`,
      note: `Halter + Plakalar (~%${Math.round(85 * lowerBodyGenderMultiplier * levelMultiplier)} BW)`
    };
  }

  if (slug === 'deadlift') {
    const base = w * 1.05 * lowerBodyGenderMultiplier * levelMultiplier;
    const min = Math.round((base * 0.9) / 2.5) * 2.5;
    const max = Math.round((base * 1.1) / 2.5) * 2.5;
    return {
      weight: `${Math.max(35, min)} - ${Math.max(40, max)} kg`,
      note: `Halter + Plakalar (~%${Math.round(105 * lowerBodyGenderMultiplier * levelMultiplier)} BW)`
    };
  }

  if (slug === 'overhead-press') {
    const base = w * 0.45 * genderMultiplier * levelMultiplier;
    const min = Math.round((base * 0.9) / 2.5) * 2.5;
    const max = Math.round((base * 1.1) / 2.5) * 2.5;
    return {
      weight: `${Math.max(15, min)} - ${Math.max(20, max)} kg`,
      note: `Omuz İtişi (~%${Math.round(45 * genderMultiplier * levelMultiplier)} BW)`
    };
  }

  if (slug === 'barbell-row' || slug === 'romanian-deadlift') {
    const base = w * 0.60 * genderMultiplier * levelMultiplier;
    const min = Math.round((base * 0.9) / 2.5) * 2.5;
    const max = Math.round((base * 1.1) / 2.5) * 2.5;
    return {
      weight: `${Math.max(20, min)} - ${Math.max(25, max)} kg`,
      note: `Barbell Çekiş (~%${Math.round(60 * genderMultiplier * levelMultiplier)} BW)`
    };
  }

  // Dambıl İtiş / Pres
  if (slug.includes('dumbbell') && slug.includes('press')) {
    const base = w * 0.20 * genderMultiplier * levelMultiplier;
    const min = Math.round(base * 0.85);
    const max = Math.round(base * 1.15);
    return {
      weight: `${Math.max(6, min)} - ${Math.max(8, max)} kg`,
      note: `Her el için dambıl ağırlığı`
    };
  }

  // Dambıl / İzolasyon / Curl / Lateral
  if (slug === 'lateral-raise' || slug === 'rear-delt-fly' || slug === 'face-pull') {
    const base = isFemale ? 4 : (level === 'baslangic' ? 5 : (level === 'ileri' ? 9 : 7));
    return {
      weight: `${Math.max(3, base - 1)} - ${base + 2} kg`,
      note: `Hafif kilo & sıkı tepe kasılması`
    };
  }

  if (slug.includes('curl')) {
    const base = w * 0.13 * genderMultiplier * levelMultiplier;
    const min = Math.round(base * 0.85);
    const max = Math.round(base * 1.15);
    return {
      weight: `${Math.max(5, min)} - ${Math.max(7, max)} kg`,
      note: `Pazu izolasyonu (Her el)`
    };
  }

  if (slug.includes('triceps') || slug.includes('pushdown') || slug.includes('skull')) {
    const base = w * 0.28 * genderMultiplier * levelMultiplier;
    const min = Math.round((base * 0.9) / 2.5) * 2.5;
    const max = Math.round((base * 1.1) / 2.5) * 2.5;
    return {
      weight: `${Math.max(10, min)} - ${Math.max(15, max)} kg`,
      note: `Arka kol direnci`
    };
  }

  if (slug === 'lat-pulldown' || slug === 'seated-cable-row') {
    const base = w * 0.58 * genderMultiplier * levelMultiplier;
    const min = Math.round((base * 0.9) / 2.5) * 2.5;
    const max = Math.round((base * 1.1) / 2.5) * 2.5;
    return {
      weight: `${Math.max(25, min)} - ${Math.max(30, max)} kg`,
      note: `Kablo istasyonu (~%${Math.round(58 * genderMultiplier * levelMultiplier)} BW)`
    };
  }

  if (slug === 'leg-press') {
    const base = w * 1.25 * lowerBodyGenderMultiplier * levelMultiplier;
    const min = Math.round((base * 0.9) / 5) * 5;
    const max = Math.round((base * 1.1) / 5) * 5;
    return {
      weight: `${Math.max(50, min)} - ${Math.max(60, max)} kg`,
      note: `Platform + Plakalar (~%${Math.round(125 * lowerBodyGenderMultiplier * levelMultiplier)} BW)`
    };
  }

  if (slug.includes('kettlebell')) {
    const kb = isFemale ? (level === 'baslangic' ? '8 - 12 kg' : '12 - 16 kg') : (level === 'baslangic' ? '12 - 16 kg' : '16 - 24 kg');
    return {
      weight: kb,
      note: 'Dinamik kalça patlayıcılığı'
    };
  }

  // Varsayılan genel direnç
  const defMin = Math.round(w * 0.18 * genderMultiplier * levelMultiplier);
  const defMax = Math.round(w * 0.26 * genderMultiplier * levelMultiplier);
  return {
    weight: `${Math.max(6, defMin)} - ${Math.max(8, defMax)} kg`,
    note: `Kişisel seviye ve kilo oranına göre`
  };
}
