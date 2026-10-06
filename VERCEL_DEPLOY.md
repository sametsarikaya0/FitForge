# 🚀 Vyranux - Vercel Dağıtım Kılavuzu (Deploy to Vercel)

Vyranux, Vercel platformunda tek tıkla veya GitHub entegrasyonuyla sorunsuz çalışacak şekilde yapılandırılmıştır.

---

## 🛠️ Hazırlanan Yapılandırma Dosyaları
1. **`vercel.json`**:
   - `buildCommand`: `npm run build`
   - `outputDirectory`: `dist`
   - `framework`: `vite`
   - Tüm frontend rotalarını (`/*`) `index.html`'e, backend API rotalarını (`/api/*`) Vercel Serverless Functions (`/api/index.ts`) mekanizmasına yönlendirir.
2. **`api/index.ts`**:
   - Vercel Serverless Function giriş noktası. Express arka ucunu serverless olarak çalıştırır.
3. **`server.ts`**:
   - Vercel ortamında (`process.env.VERCEL`) serverless olarak çalışır; yerel geliştirmede ise port 3000 üzerinden Vite ile birlikte ayağa kalkar.

---

## 📋 Yöntem 1: GitHub ile Vercel'e Dağıtım (Önerilen)

1. **Projeyi GitHub Deponuza Gönderin:**
   ```bash
   git add .
   git commit -m "Vyranux: Vercel ready"
   git push origin main
   ```

2. **Vercel'e Giriş Yapın:**
   - [vercel.com](https://vercel.com) adresine gidin ve giriş yapın.
   - **"Add New..."** > **"Project"** butonuna tıklayın.
   - GitHub deponuzu seçip **"Import"** deyin.

3. **Yapılandırma Kontrolü (Otomatik Algılanır):**
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Çevre Değişkenleri (Environment Variables - İsteğe Bağlı):**
   - `GEMINI_API_KEY`: *(Opsiyonel)* Eğer Gemini modelini canlı çalıştırmak isterseniz Google AI Studio API anahtarınızı ekleyin.
   - *Not:* API anahtarı eklemeseniz dahi Vyranux'un yerel kural motoru %100 kesintisiz ve ücretsiz çalışır!

5. **"Deploy" Butonuna Basın:**
   - 30 saniye içinde uygulamanız `https://projeniz.vercel.app` adresinde yayına girecektir.

---

## 💻 Yöntem 2: Vercel CLI ile Dağıtım

Terminalinizden doğrudan yayınlamak için:

```bash
# Vercel CLI kurulu değilse:
npm i -g vercel

# Dağıtımı başlatın:
vercel

# Üretime (Production) almak için:
vercel --prod
```
