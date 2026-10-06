import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Gemini API istemcisi (Server-side opsiyonel - API key yoksa dahili bilgi motoru çalışır)
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Kodda veya kullanıcı ortamında hiçbir API Key olmadan çalışan akıllı antrenman & beslenme yanıt motoru
function generateHeuristicCoachReply(prompt: string, userContext: any): string {
  const p = prompt.toLowerCase();
  const userName = userContext?.name || 'Sporcu';
  const goal = userContext?.goal || 'Kas gelişimi ve kuvvet';
  const sport = userContext?.sport || 'Fitness';
  const calories = userContext?.calories || '2500';

  if (p.includes('önce ne yemeli') || p.includes('öncesi öğün') || p.includes('antreman öncesi') || p.includes('antrenman öncesi')) {
    return `🍌 **Vyranux Antrenör Tavsiyesi: Antrenmandan 1-2 Saat Önce Beslenme**\n\n` +
      `Sevgili ${userName}, antrenman performansını ve glikojen depolarını zirveye taşımak için altın kural:\n\n` +
      `1. **Karbonhidrat (Hızlı & Kompleks):** 1 orta boy muz, 40-50g yulaf ezmesi veya 2 dilim tam buğday ekmeği üzerine hafif bal/reçel.\n` +
      `2. **Hafif Protein:** 20-25g sindirimi kolay protein (1 ölçek whey protein veya 3 haşlanmış yumurta beyazı).\n` +
      `3. **Düşük Yağ & Lif:** Mide kramplarını önlemek için antrenmandan hemen önce aşırı yağlı ve lifli gıdalardan kaçının.\n` +
      `4. **Hidrasyon:** İdmandan 45 dk önce 400-500 ml su için. Hedef kalorin (${calories} kcal) içinde bu öğün yaklaşık 300-400 kcal tutmalıdır.`;
  }

  if (p.includes('bench') || p.includes('omuz') || p.includes('omuzlarım acıyor') || p.includes('form düzeltme')) {
    return `🛡️ **Vyranux Biyomekanik Form Düzeltme: Bench Press & Omuz Sağlığı**\n\n` +
      `Bench presste omuz batması veya ağrısı genellikle 3 temel mekanik hatadan kaynaklanır:\n\n` +
      `1. **Kürek Kemikleri (Scapular Retraction):** Barı kaldırmadan önce kürek kemiklerini arkada ve aşağıda kilitleyin ("arka cebine sokar gibi"). Göğsü öne çıkarın.\n` +
      `2. **Dirsek Açısı:** Dirseklerinizi 90 derece yana açmak yerine vücudunuza 45-75 derece açıyla yaklaştırın ("Ok ucu" formu, T formu değil).\n` +
      `3. **Bilek ve Bar Yolu:** Bar alt göğüs çizgisine (meme ucu hizası) inmeli ve dikey değil hafif kavisli (J-curve) yukarı ve baş yönüne itilmelidir.\n` +
      `*Öneri: Ağrı geçene kadar ağırlığı %20 düşürün veya dambıl bench / incline dumbell press varyasyonuna geçin.*`;
  }

  if (p.includes('kreatin') || p.includes('takviye') || p.includes('supplement') || p.includes('vitamin')) {
    return `💊 **Vyranux Bilimsel Takviye Kılavuzu: Temel ve Kanıtlanmış Destekler**\n\n` +
      `Fitness ve ${sport} branşında bilimsel olarak en çok kanıtlanmış takviyeler:\n\n` +
      `1. **Kreatin Monohidrat (Altın Standart):** Günde 3-5 gram. Yükleme haftasına gerek yoktur. Günün herhangi bir saatinde bol suyla düzenli alın. Hücre içi ATP ve patlayıcı gücü %10-15 artırır.\n` +
      `2. **Whey Protein:** Günlük protein hedefinize (vücut ağırlığı × 1.6 - 2.0g) yemeklerden ulaşamadığınızda pratik ve hızlı sindirilen çözümdür.\n` +
      `3. **D3 Vitamini & Omega-3:** Eklem sağlığı, testosteron sentezi ve genel toparlanma için günlük temel mikro besin desteğidir.\n` +
      `4. **Magnezyum:** Gece yatmadan önce derin uyku (REM) ve kas kramplarını önlemek için glisinat veya sitrat formunda önerilir.`;
  }

  if (p.includes('yorgun') || p.includes('uyku') || p.includes('enerji') || p.includes('kaçırmak istemiyorum')) {
    return `⚡ **Vyranux Düşük Enerji Günü Taktikleri (Oto-Regülasyon)**\n\n` +
      `Tebrikler ${userName}, en iyi antrenman bazen hiç gitmek istemediğin ama disiplinle tamamladığın antrenmandır! Bugün için stratejin:\n\n` +
      `1. **RPE Düşür:** Hedef ağırlıkları %10-15 hafiflet. Tükenişe gitmek yerine her sette cebinde 2-3 tekrar bırak (RPE 7).\n` +
      `2. **Isınmayı Uzat:** 5-7 dakika hafif kardiyo ve dinamik eklem açma hareketleriyle sinir sistemini nazikçe uyandır.\n` +
      `3. **Seansı 40-45 Dakikada Bitir:** Aksesuar ve izolasyon hareketlerini çıkar, sadece 2-3 temel bileşik hareketi tamamlayıp eve dön.\n` +
      `4. **Toparlanma:** İdman sonrası karbonhidratını al ve bu gece en az 8 saat uyumaya odaklan.`;
  }

  if (p.includes('kilo verme') || p.includes('yağ yak') || p.includes('definasyon')) {
    return `🔥 **Vyranux Yağ Yakımı & Kilo Verme Prensipleri**\n\n` +
      `1. **Kalori Açığı:** Günlük harcadığınız enerjiden 300-500 kcal daha az tüketin (Haftalık 0.5 kg yağ kaybı idealdir).\n` +
      `2. **Yüksek Protein:** Kas kaybını önlemek için kilonuz başına en az 2g protein tüketin.\n` +
      `3. **Ağırlık Antrenmanını Bırakmayın:** Kaslarınızı korumak için vücudunuza "bu kaslara ihtiyacım var" sinyali göndermelisiniz.\n` +
      `4. **Günlük Adım Sayısı (NEAT):** Günde 8.000 - 10.000 adım atarak metabolik yakımı canlı tutun.`;
  }

  if (p.includes('kas') || p.includes('hacim') || p.includes('büyüme') || p.includes('hipertrofi')) {
    return `💪 **Vyranux Hipertrofi (Kas Büyümesi) Formülü**\n\n` +
      `1. **Progressive Overload (Kademeli Yükleme):** Her hafta ağırlığı, tekrarı veya form kalitesini biraz daha artırın.\n` +
      `2. **Haftalık Hacim:** Her kas grubu için haftada 10-20 zorlu çalışma seti uygulayın.\n` +
      `3. **Hafif Kalori Fazlası:** Günlük ihtiyacınızın (${calories} kcal) %10 üzerine çıkın (Clean Bulk).\n` +
      `4. **Derin Uyku:** Büyüme hormonu uykuda salgılanır, 7-8 saat kaliteli dinlenme şarttır.`;
  }

  // Genel Kişiselleştirilmiş Yanıt
  return `💬 **Vyranux Antrenör Yanıtı**\n\n` +
    `Harika bir soru ${userName}! Hedefin olan **${goal}** ve **${sport}** branşında başarı; tutarlılık, kademeli aşırı yüklenme (progressive overload) ve doğru beslenmenin birleşimidir.\n\n` +
    `• Günlük kalori hedefini (~${calories} kcal) dengeli makrolarla (protein, kompleks karbonhidrat ve sağlıklı yağlar) karşıla.\n` +
    `• Hareketlerin negatif fazını (3 saniye yavaş indirme) kontrol ederek kas lifi uyarımını artır.\n` +
    `• Set aralarında acele etme, sinir sisteminin toparlanması için 60-90 saniye dinlen.\n\n` +
    `*Programındaki takvime ve egzersiz formlarına sadık kalarak ilerlemeye devam et!*`;
}

// 1. AI Vyranux Antrenör & Beslenme Danışmanı Endpoint'i (API Key Gerektirmez)
app.post('/api/ai/coach', async (req: Request, res: Response) => {
  try {
    const { prompt, userContext } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt parametresi gereklidir.' });
    }

    // Eğer ortamda geçerli bir Gemini API istemcisi varsa modelden yanıt üret, yoksa dahili bilgi motorunu kullan
    if (ai) {
      try {
        const systemInstruction = `Sen Vyranux uygulamasının baş antrenörü, spor bilimcisi ve klinik spor diyetisyenisin (Vyranux Coach).
Kullanıcı: ${userContext?.name || 'Sporcu'}, Hedef: ${userContext?.goal || 'Kas kazanımı'}, Spor: ${userContext?.sport || 'Fitness'}, Kalori: ~${userContext?.calories || '2500'} kcal.
Kullanıcıya Türkçe, motive edici, bilime dayalı ve doğrudan uygulanabilir antrenman ve beslenme tavsiyeleri ver.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        if (response.text) {
          return res.json({
            reply: response.text,
            mode: 'gemini-live',
          });
        }
      } catch (err) {
        console.warn('Gemini API çağrısı başarısız oldu, yerel bilgi motoruna geçiliyor:', err);
      }
    }

    // API Key gerektirmeyen kusursuz yerel antrenör motoru
    const heuristicReply = generateHeuristicCoachReply(prompt, userContext);
    return res.json({
      reply: heuristicReply,
      mode: 'vyranux-knowledge-engine',
    });
  } catch (error: any) {
    console.error('Antrenör Endpoint Hatası:', error);
    return res.json({
      reply: 'Antrenman ve beslenme temponuzu koruyarak dinlenmenize ve yeterli protein alımınıza özen gösterin.',
      mode: 'fallback',
    });
  }
});

// 2. Uygulama Geri Bildirim Endpoint'i
app.post('/api/feedback', (req: Request, res: Response) => {
  const { rating, category, message, userEmail } = req.body;
  console.log(`[GERİ BİLDİRİM] ${rating} Yıldız - Kategori: ${category} - Mesaj: ${message} (${userEmail || 'Anonim'})`);
  return res.json({
    success: true,
    message: 'Geri bildiriminiz başarıyla alındı. Teşekkür ederiz!',
  });
});

// Dev ve Prod ortamlarında Vite Middleware entegrasyonu
async function startServer() {
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    app.use(express.static('dist'));
  }

  app.listen(port, () => {
    console.log(`Vyranux sunucusu http://localhost:${port} adresinde çalışıyor.`);
  });
}

// Yalnızca doğrudan bağımsız çalıştırıldığında portu dinle (Vercel serverless ortamında export edilen app çalıştırılır)
if (!process.env.VERCEL) {
  startServer();
}

export default app;
