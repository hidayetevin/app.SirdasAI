# Sırdaş AI - Mobil Uygulama Projesi

## 1. Proje Hakkında
**Sırdaş AI**, kullanıcıların dertleşebileceği, sırlarını paylaşabileceği ve güvenilir bir arkadaş hissini yaşayabileceği empatik bir yapay zeka yoldaşıdır. 
Uygulama, Google Gemini ve Groq modellerini fallback yedekliliğiyle kullanarak maliyet-optimalli ve maksimum stabilite sunar.

## 2. Özellikler
- **Clean Architecture & Framework-Agnostic:** React/Vue olmadan, sadece Native Web API'leriyle yüksek hızlı ve bağımlılıksız modüler mimari.
- **Güçlü Bellek (Memory) Sistemi:** Kullanıcının geçmiş mesajlarını (`IndexedDB`) analiz ederek ruh hali (mood), stres seviyesi ve hedeflerini (goals) profiller.
- **AI Orkestrasyonu (& Fallback):** Asıl model arızalandığında saniyesinde yedek modele geçer. API kullanım maliyetlerini düşürmek için `Hybrid Context` kullanır (10 mesajlık short-term cache + en önemli 5 anı memory).
- **AdMob Entegrasyonu:** Modüler yapıya uygun `AdMobService` ile arayüzden tamamıyla izole reklam yönetimi (örn. `+20 Mesaj Hakki` veren ödüllü video).
- **Glassmorphism UI:** CSS Değişkenleri, nefes alma/konuşma animasyonları ve Modern Koyu tema.
- **Zero Regression:** Native Web Component mimarisi kullanıldığı için sonradan ortaya çıkacak hataların olasılığı çok düşüktür. Vitest ile kapsamlıca donatılmıştır.

## 3. Kurulum ve Başlatma
Proje dizinine terminal ile girdikten sonra `.env` dosyanızda şu API anahtarlarının tanımlı olduğundan emin olun:
```
VITE_GEMINI_API_KEY=your_gemini_key
VITE_GROQ_API_KEY=your_groq_key
```

Sonra bağımlılıkları çalıştırıp geliştirici sunucusunu açın:
```bash
npm install
npm run dev
```

## 4. Uygulamayı Derleme ve Cihaza Aktarma (Yayınlama)
Proje `Capacitor` desteğine hazır hale getirilmiştir (Bkz. `capacitor.config.ts`). Uygulamayı Android platformu için derlemek isterseniz:

1. Web kaynaklarını build edin:
   `npm run build`
2. Capacitor kurulumu:
   `npm i @capacitor/core` ve `npm i -D @capacitor/cli @capacitor/android`
3. Capacitor'ı entegre edip derleyin:
   `npx cap add android`
   `npx cap sync`
   `npx cap open android`

## 5. Test İşlemleri
Uygulama Vitest kullanılarak test edilmiştir:
- `npm run test` diyerek hem AI Fallback davranışlarını hem de IndexedDB servislerini saniyeler içinde simüle edebilirsiniz.

## Proje Kuralları & Lisans
- Bu proje *Evrensel Platform Bağımsız Oyun/Uygulama Kurallarına (Universal Game AI Architecture)* tam uyumluluk ile inşa edilmiştir!
