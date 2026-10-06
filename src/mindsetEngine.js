/**
 * FitPlan - Günlük Psikolojik Durum & Zihinsel Hazır Bulunuşluk Motoru (Mindset Analysis)
 * Kullanıcının günlük ruh hali, stres ve enerji seviyesine göre akıllı uyarlama ve motivasyonel mesajlar
 */

export const MINDSET_STATES = [
  {
    id: 'godmode',
    name: 'God Mode (Yüksek Enerji & Zirve Motivasyon)',
    emoji: '🦁',
    badge: 'ZİRVE HAZIRLIK',
    color: '#10b981',
    message: 'Bugün kimse seni durduramaz! Sinir sistemin ve enerjin zirvede. Ana bileşik hareketlerde (Bench, Squat, Deadlift) ağırlık artırmayı veya yeni bir PR (Kişisel Rekor) denemeyi düşün.',
    recommendation: 'Ağırlıkları %5 artırabilir, çalışma setlerine 1 set ekstra ekleyebilirsin.',
    volumeModifier: 1.1,
    restModifier: 0
  },
  {
    id: 'focused',
    name: 'Dengeli & Disiplinli (Stabil Odaklanma)',
    emoji: '🧘',
    badge: 'ODAKLI & KARARLI',
    color: '#06b6d4',
    message: 'Harika bir zihinsel denge. Motivasyon geçicidir ancak disiplin kalıcıdır. Bugün plana harfiyen sadık kalarak kas liflerini kusursuz formla uyar.',
    recommendation: 'Programdaki standart set ve dinlenme sürelerini birebir uygula.',
    volumeModifier: 1.0,
    restModifier: 0
  },
  {
    id: 'tired',
    name: 'Yorgun / Yetersiz Uyku (Düşük Pil)',
    emoji: '😴',
    badge: 'DİKKATLİ İLERLEME',
    color: '#f59e0b',
    message: 'Vücudun sana dinlenme sinyali veriyor. Salona gitmek bile büyük bir zafer! Ancak bugün sinir sistemini tüketmeden eklemlerini korumalısın.',
    recommendation: 'Ağırlıkları %10 hafiflet, set arası dinlenmeleri +30 saniye uzat ve hidrasyona dikkat et.',
    volumeModifier: 0.85,
    restModifier: 30
  },
  {
    id: 'stressed',
    name: 'Stresli & Zihnen Dolu (Terapi Günü)',
    emoji: '🤯',
    badge: 'STRES BOŞALTMA',
    color: '#8b5cf6',
    message: 'Zihnindeki kaosu dambılların altına göm. Ağırlık antrenmanı doğal bir dopamin ve endorfin pompasıdır. Telefonunu sessize al ve sadece ritme odaklan.',
    recommendation: 'Antrenman sonuna 15 dakika tempolu kardiyo veya boks torbası ekleyerek kortizolü sıfırla.',
    volumeModifier: 1.0,
    restModifier: -10
  },
  {
    id: 'sore',
    name: 'Ağrılı / Hamlamış (Rejenerasyon)',
    emoji: '🤕',
    badge: 'AKTİF TOPARLANMA',
    color: '#ef4444',
    message: 'Kasların hala onarım aşamasında. Kas büyümesi antrenmanda değil, toparlanma sırasında gerçekleşir. Zorlama, esne ve beslen.',
    recommendation: 'Ağır kaldırmak yerine 20 dk hafif yürüyüş, foam roller ve 15 dk tam vücut statik esnemesi yap.',
    volumeModifier: 0.7,
    restModifier: 45
  }
];

export function getMindsetAnalysis(mindsetId) {
  return MINDSET_STATES.find(m => m.id === mindsetId) || MINDSET_STATES[1];
}
