/**
 * FitPlan - Farklı Spor Dalları & Branşa Özel Antrenman Motoru
 * Fitness, Boks, Futbol, Basketbol, Koşu, Kalisteniks, Yüzme
 */

export const SPORTS_DISCIPLINES = [
  {
    id: 'fitness',
    name: 'Fitness & Vücut Geliştirme',
    icon: '🏋️',
    subtitle: 'Kas Hipertrofisi & Simetri',
    desc: 'Bileşik serbest ağırlıklar, kontrollü tempo ve izole hacim odaklı klasik vücut geliştirme.',
    specialtyExercises: [
      { name: 'Barbell Incline Bench Press', muscle: ['Göğüs', 'Ön Omuz'], sets: 4, reps: '8-10' },
      { name: 'Cable Lateral Raise', muscle: ['Omuz'], sets: 4, reps: '12-15' },
      { name: 'Barbell Romanian Deadlift', muscle: ['Hamstring', 'Kalça'], sets: 4, reps: '8-10' }
    ],
    warmupAdvice: '5 dk hafif bisiklet + Omuz rotatör kılıfı ve kalça mobilite esnemesi.'
  },
  {
    id: 'boks',
    name: 'Boks & Dövüş Sporları',
    icon: '🥊',
    subtitle: 'Patlayıcı Güç & Rotasyonel Core',
    desc: 'Yumruk gücünü artıran kalça ve gövde rotasyonu, omuz laktat dayanıklılığı ve reaktif çeviklik.',
    specialtyExercises: [
      { name: 'Rotational Medicine Ball Slam', muscle: ['Core', 'Omuz', 'Kardiyo'], sets: 4, reps: '12-15' },
      { name: 'Landmine Punch Press', muscle: ['Omuz', 'Göğüs', 'Core'], sets: 3, reps: '10 her kol' },
      { name: 'Atlama İpi Yüksek Kadans', muscle: ['Baldır', 'Kardiyo'], sets: 4, reps: '2 dakika' },
      { name: 'Shadow Boxing Ağırlıklı', muscle: ['Omuz', 'Kardiyo'], sets: 3, reps: '3 dakika' }
    ],
    warmupAdvice: 'Gölge boksu, boyun köprüleri ve dinamik toraks rotasyon hareketleri.'
  },
  {
    id: 'futbol',
    name: 'Futbol & Saha Sporları',
    icon: '⚽',
    subtitle: 'Sprint Çevikliği & Bacak Gücü',
    desc: 'Nordic hamstring ile sakatlık önleme, ani yön değiştirme ve 90 dakikalık yüksek tempo kondisyonu.',
    specialtyExercises: [
      { name: 'Nordic Hamstring Curl', muscle: ['Hamstring'], sets: 3, reps: '6-8' },
      { name: 'Bulgarian Split Squat Patlayıcı', muscle: ['Quadriceps', 'Kalça'], sets: 3, reps: '10 her bacak' },
      { name: 'Agility Ladder & Cone Sprint Drills', muscle: ['Kardiyo', 'Baldır'], sets: 4, reps: '30 saniye' },
      { name: 'Tek Bacak Romanian Deadlift', muscle: ['Hamstring', 'Denge'], sets: 3, reps: '10 her bacak' }
    ],
    warmupAdvice: 'Dinamik bacak savurmaları, kalça fleksör açılışları ve kısa deparlı ısınmalar.'
  },
  {
    id: 'basketbol',
    name: 'Basketbol & Sıçrama',
    icon: '🏀',
    subtitle: 'Dikey Sıçrama & Patlayıcılık',
    desc: 'Pliometrik üçlü ekstansiyon (kalça-diz-bilek), ribaund sıçramaları ve patlayıcı omuz itişi.',
    specialtyExercises: [
      { name: 'Depth Jumps to Box Jump', muscle: ['Bacak', 'Pliometrik'], sets: 4, reps: '6 tekrar' },
      { name: 'Trap Bar / Dumbbell Jump Squat', muscle: ['Bacak', 'Kalça'], sets: 3, reps: '6-8' },
      { name: 'Push Press (Halter Patlayıcı İtiş)', muscle: ['Omuz', 'Bacak'], sets: 4, reps: '5-6' },
      { name: 'Hanging Knee to Elbows', muscle: ['Karın', 'Core'], sets: 3, reps: '12-15' }
    ],
    warmupAdvice: 'Ayak bileği mobilizasyonu, psoas esnetmesi ve kademeli sıçrama drilleri.'
  },
  {
    id: 'kosu',
    name: 'Koşu & Atletizm',
    icon: '🏃',
    subtitle: 'VO2 Max & Arka Zincir',
    desc: 'Eklem stabilitesi, gluteus medius güçlendirme, koşu ekonomisi ve aerobik dayanıklılık.',
    specialtyExercises: [
      { name: 'Banded Lateral Walk (Monster Walk)', muscle: ['Kalça', 'Denge'], sets: 3, reps: '15-20 adım' },
      { name: 'Single Leg Calf Raise', muscle: ['Baldır', 'Aşil'], sets: 4, reps: '15 tekrar' },
      { name: 'Tirante Muscular / Sissy Squat', muscle: ['Quadriceps', 'Diz'], sets: 3, reps: '12 tekrar' },
      { name: 'Tempo Koşu & İnterval Blokları', muscle: ['Kardiyo'], sets: 1, reps: '25-30 dk' }
    ],
    warmupAdvice: 'Aşil tendonu mobilizasyonu, kalça çevre kas aktivasyonu ve hafif tempo jogging.'
  },
  {
    id: 'kalisteniks',
    name: 'Kalisteniks & Street Workout',
    icon: '🤸',
    subtitle: 'Göreceli Vücut Kuvveti',
    desc: 'Ağırlıksız saf vücut kontrolü, statik tutuşlar, barfiks-dips kombinasyonları ve çelik core.',
    specialtyExercises: [
      { name: 'Muscle-Up / Chest to Bar Pull-Up', muscle: ['Sırt', 'Göğüs', 'Kollar'], sets: 3, reps: '5-8' },
      { name: 'L-Sit on Parallel Bars', muscle: ['Karın', 'Ön Kol'], sets: 4, reps: '15-25 sn' },
      { name: 'Handstand Push-Up Progression', muscle: ['Omuz', 'Triceps'], sets: 3, reps: '6-8' },
      { name: 'Deep Ring / Bar Dips', muscle: ['Göğüs', 'Triceps'], sets: 4, reps: '10-12' }
    ],
    warmupAdvice: 'El bileği 360 derece esnetmesi, skapular şınav ve hollow body pozisyonları.'
  },
  {
    id: 'yuzme',
    name: 'Yüzme & Su Sporları',
    icon: '🏊',
    subtitle: 'Toraks Genişliği & Sırt Gücü',
    desc: 'Kulaç gücünü artıran geniş kanat kasları, omuz manşeti stabilitesi ve hidrodinamik core.',
    specialtyExercises: [
      { name: 'Straight Arm Lat Pulldown', muscle: ['Sırt', 'Core'], sets: 4, reps: '12-15' },
      { name: 'Band External & Internal Rotations', muscle: ['Omuz Kılıfı'], sets: 3, reps: '15 her kol' },
      { name: 'Superman / Arch Hold', muscle: ['Alt Sırt', 'Kalça'], sets: 3, reps: '30 saniye' },
      { name: 'Flutter Kicks on Mat', muscle: ['Karın', 'Kalça Fleksör'], sets: 3, reps: '45 saniye' }
    ],
    warmupAdvice: 'Omuz çemberleri, göğüs kafesi esnemeleri ve dinamik nefes koordinasyonu.'
  }
];
