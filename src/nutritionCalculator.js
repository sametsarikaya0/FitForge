/**
 * FitPlan - Kişiselleştirilmiş Kalori & Beslenme Planlayıcı
 * Mifflin-St Jeor formülü, TDEE, makro besin ayrımı ve 5 öğünlük dinamik yemek programı
 */

export function calculateDailyNutrition(user) {
  const weight = parseFloat(user?.weight) || 75;
  const height = parseFloat(user?.height) || 178;
  const age = parseInt(user?.age, 10) || 24;
  const isFemale = user?.gender === 'kadin';
  const goal = user?.goal || 'kas-kazanimi';
  const daysCount = parseInt(user?.weeklyDaysCount, 10) || 4;
  const sport = user?.sport || 'fitness';

  // 1. BMR (Bazal Metabolizma Hızı) - Mifflin-St Jeor
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  bmr = isFemale ? bmr - 161 : bmr + 5;
  bmr = Math.round(bmr);

  // 2. Aktivite Çarpanı (Haftalık gün ve spor branşına göre)
  let activityMultiplier = 1.375; // 2 gün
  if (daysCount === 3) activityMultiplier = 1.45;
  else if (daysCount === 4) activityMultiplier = 1.55;
  else if (daysCount >= 5) activityMultiplier = 1.725;

  // Dövüş sporları, futbol veya koşu yüksek kalori yakar
  if (['boks', 'futbol', 'basketbol', 'yuzme'].includes(sport)) {
    activityMultiplier += 0.1;
  }

  // 3. TDEE (Toplam Günlük Enerji Harcaması)
  const tdee = Math.round(bmr * activityMultiplier);

  // 4. Hedefe Göre Günlük Hedef Kalori
  let targetCalories = tdee;
  let goalLabel = 'Kilonuzu Koruma (Bakım)';
  let calorieAdjustment = 0;

  if (goal === 'kas-kazanimi') {
    calorieAdjustment = +350;
    targetCalories = tdee + calorieAdjustment;
    goalLabel = 'Temiz Kas Kazanımı (+350 kcal Fazlalık)';
  } else if (goal === 'kilo-verme' || goal === 'yag-yakimi') {
    calorieAdjustment = -450;
    targetCalories = tdee + calorieAdjustment;
    goalLabel = 'Yağ Yakımı (-450 kcal Açık)';
  } else if (goal === 'guc') {
    calorieAdjustment = +200;
    targetCalories = tdee + calorieAdjustment;
    goalLabel = 'Maksimum Güç & Kuvvet (+200 kcal)';
  } else if (goal === 'kondisyon') {
    calorieAdjustment = +100;
    targetCalories = tdee + calorieAdjustment;
    goalLabel = 'Dayanıklılık & Enerji Dengesi (+100 kcal)';
  }

  // 5. Makro Besinlerin Hesaplanması
  // Protein: Kas onarımı için kg başına 1.8g - 2.2g
  let proteinPerKg = goal === 'kas-kazanimi' || goal === 'guc' ? 2.2 : (goal === 'kilo-verme' ? 2.0 : 1.8);
  if (isFemale) proteinPerKg -= 0.2;
  const proteinGrams = Math.round(weight * proteinPerKg);
  const proteinCalories = proteinGrams * 4;

  // Yağ: Hormon sağlığı ve eklemler için kg başına 0.8g - 1.0g (En az %20 kalori)
  const fatGrams = Math.round(weight * (isFemale ? 0.9 : 0.85));
  const fatCalories = fatGrams * 9;

  // Karbonhidrat: Geriye kalan kaloriler
  const remainingCalories = Math.max(400, targetCalories - (proteinCalories + fatCalories));
  const carbGrams = Math.round(remainingCalories / 4);

  // Yüzdeler
  const totalCalculatedCal = proteinCalories + fatCalories + (carbGrams * 4);
  const proteinPct = Math.round((proteinCalories / totalCalculatedCal) * 100);
  const fatPct = Math.round((fatCalories / totalCalculatedCal) * 100);
  const carbPct = Math.max(10, 100 - (proteinPct + fatPct));

  // 6. Günlük Su İhtiyacı
  const waterLiters = (weight * 0.04).toFixed(1);

  // 7. Hedefe Özel 5 Öğünlük Detaylı Yemek Programı
  const mealPlan = generateMealPlan({
    goal,
    targetCalories,
    proteinGrams,
    carbGrams,
    fatGrams,
    isFemale,
    weight,
    sport
  });

  return {
    bmr,
    tdee,
    targetCalories,
    calorieAdjustment,
    goalLabel,
    macros: {
      protein: { grams: proteinGrams, calories: proteinCalories, pct: proteinPct },
      carbs: { grams: carbGrams, calories: carbGrams * 4, pct: carbPct },
      fats: { grams: fatGrams, calories: fatCalories, pct: fatPct }
    },
    waterLiters,
    mealPlan
  };
}

function generateMealPlan({ goal, targetCalories, proteinGrams, carbGrams, fatGrams, isFemale, weight, sport }) {
  const isSurplus = goal === 'kas-kazanimi' || goal === 'guc';
  const isDeficit = goal === 'kilo-verme' || goal === 'yag-yakimi';

  // 1. Kahvaltı (Metabolizma Ateşleyici)
  const breakfast = {
    title: 'Kahvaltı (Güne Başlangıç)',
    time: '08:00 - 09:00',
    icon: '🍳',
    calories: Math.round(targetCalories * 0.28),
    protein: Math.round(proteinGrams * 0.28),
    items: [
      {
        name: isSurplus ? '3 Tam Yumurta + 2 Yumurta Beyazı (Omlet)' : '2 Tam Yumurta + 2 Beyazı (Haşlanmış)',
        portion: '4-5 adet yumurta',
        detail: 'Biyolojik değeri en yüksek tam protein ve kolin kaynağı'
      },
      {
        name: isSurplus ? '80g Yulaf Ezmesi + 200ml Süt / Badem Sütü' : '50g Yulaf Ezmesi + Tarçın + Su / Yağsız Süt',
        portion: isSurplus ? '80g yulaf' : '50g yulaf',
        detail: 'Düşük glisemik indeksli uzun süreli enerji'
      },
      {
        name: '1 Tatlı Kaşığı Doğal Fıstık Ezmesi veya 4-5 Çiğ Ceviz',
        portion: '20g',
        detail: 'Hormonal denge ve beyin fonksiyonları için sağlıklı yağ'
      },
      {
        name: '1 Porsiyon Yaban Mersini veya Yarım Muz',
        portion: '100g',
        detail: 'Antioksidan ve mikro besin desteği'
      }
    ]
  };

  // 2. Öğle Yemeği (Anabolik Güç Deposu)
  const lunch = {
    title: 'Öğle Yemeği (Ana Enerji & Kas Onarımı)',
    time: '12:30 - 13:30',
    icon: '🥗',
    calories: Math.round(targetCalories * 0.32),
    protein: Math.round(proteinGrams * 0.32),
    items: [
      {
        name: isSurplus ? '200g Izgara Tavuk Göğsü / Hindi Göğsü' : '160g Fırın Hindi / Tavuk Fileto',
        portion: isSurplus ? '200g (pişmiş)' : '160g (pişmiş)',
        detail: 'Yüksek lösin içerikli yağsız saf protein'
      },
      {
        name: isSurplus ? '200g Pişmiş Basmati Pirinç veya Bulgur Pilavı' : '120g Haşlanmış Karabuğday / Bulgur',
        portion: isSurplus ? '200g' : '120g',
        detail: 'Kas glikojen depolarını dolduran kaliteli kompleks karbonhidrat'
      },
      {
        name: 'Geniş Mevsim Yeşillikleri Salatası (Roka, Ispanak, Salatalık)',
        portion: '1 Büyük Kase',
        detail: '1 Yemek Kaşığı Soğuk Sıkım Sızma Zeytinyağı ve Limon ile'
      },
      {
        name: '1 Kase Ev Yapımı Yoğurt veya Ayran (200ml)',
        portion: '200g',
        detail: 'Sindirim ve bağırsak florası için probiyotik desteği'
      }
    ]
  };

  // 3. Ara Öğün & Antrenman Öncesi (Pre-Workout Boost)
  const snack = {
    title: 'Antrenman Öncesi / Ara Öğün',
    time: '16:00 - 17:00 (Antrenmandan 60-90 dk önce)',
    icon: '⚡',
    calories: Math.round(targetCalories * 0.15),
    protein: Math.round(proteinGrams * 0.15),
    items: [
      {
        name: '1 Orta Boy Muz',
        portion: '1 adet (~120g)',
        detail: 'Hızlı sindirilen potasyum ve doğal fruktoz (Krampları önler)'
      },
      {
        name: isSurplus ? '2 Adet Pirinç Patlağı + 1 Tatlı Kaşığı Bal / Fıstık Ezmesi' : '1 Bardak Sade Filtre Kahve / Yeşil Çay',
        portion: isSurplus ? '2 patlak' : '1 kupa',
        detail: 'Kafein ile odaklanma ve termojenik yağ yakım artışı'
      },
      {
        name: '1 Ölçek Whey Protein Tozu veya 100g Lor Peyniri',
        portion: '25-30g protein',
        detail: 'Antrenman sırasında kas yıkımını (katabolizma) engelleyici'
      }
    ]
  };

  // 4. Akşam Yemeği (Toparlanma & Glikojen İkamesi)
  const dinner = {
    title: 'Akşam Yemeği (Hızlı Toparlanma & Doku Yenileme)',
    time: '19:30 - 20:30',
    icon: '🥩',
    calories: Math.round(targetCalories * 0.20),
    protein: Math.round(proteinGrams * 0.20),
    items: [
      {
        name: isSurplus ? '180g Fırın Somon Balığı veya Yağsız Biftek' : '160g Izgara Levrek / Somon veya Bonfile',
        portion: isSurplus ? '180g' : '160g',
        detail: 'Omega-3 yağ asitleri (Eklem iltihabını azaltır) ve çinko/demir'
      },
      {
        name: isSurplus ? '150g Fırınlanmış Tatlı Patates veya Fırın Patates' : 'Buharda Brokoli, Kuşkonmaz ve Kabak (Sınırsız)',
        portion: isSurplus ? '150g' : '200g',
        detail: 'Yüksek lif, potasyum ve mikro element desteği'
      },
      {
        name: 'Avokado Dilimleri (Çeyrek Boy) veya 10 Adet Zeytin',
        portion: '30-40g',
        detail: 'Hücre zarı esnekliği ve tokluk hissi sağlayan tekli doymamış yağ'
      }
    ]
  };

  // 5. Gece Ara Öğünü / İyileşme (Gece Anabolizmi)
  const nightSnack = {
    title: 'Gece İyileşme Öğünü (Uykuda Büyüme & Onarım)',
    time: '22:00 - 22:30 (Yatmadan 60 dk önce)',
    icon: '🌙',
    calories: Math.round(targetCalories * 0.05),
    protein: Math.round(proteinGrams * 0.05),
    items: [
      {
        name: '150g Yağsız Süzme Yoğurt / Kefir veya Kazein Proteini',
        portion: '150-200g',
        detail: 'Yavaş sindirilen kazein proteini sayesinde 7-8 saat boyunca kasları besler'
      },
      {
        name: '1 Çay Kaşığı Chia Tohumu veya 5-6 Adet Çiğ Badem',
        portion: '10g',
        detail: 'Magnezyum ve triptofan içeriğiyle kaliteli derin uyku sağlar'
      },
      {
        name: 'Papatya veya Melisa Çayı',
        portion: '1 Fincan',
        detail: 'Kortizol seviyesini düşürür ve merkezi sinir sistemini yatıştırır'
      }
    ]
  };

  return [breakfast, lunch, snack, dinner, nightSnack];
}
