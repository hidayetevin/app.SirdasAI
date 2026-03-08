# Sırdaş AI – Proje Oluşturma Eksiksiz Agent Promptu

## Amaç

Bu prompt, AI agent’a **Sırdaş AI uygulamasını sıfırdan oluşturması için tam rehberdir**.
Dökümanları sırasıyla okuyacak, analiz edecek, CleanCode mimarisine uygun, basit klasör yapısında, AdMob entegrasyonu olan bir uygulama geliştirecek.

---

## 1️⃣ Döküman Sıralaması ve Okuma

AI agent, aşağıdaki dosyaları sırasıyla okuyacak ve içeriğini referans alacak:

1. `AI_Maliyet_Dusurme_Mimarisi` – API maliyet optimizasyonu ve token yönetimi
2. `Analiz` – Uygulama genel özellikleri, kullanıcı hedefleri ve işleyiş analizi
3. `Gelişmiş_Memory_Sistemi` – Memory katmanları, short-term ve long-term memory
4. `Kullanıcı_Psikolojik_Profil_Sistemi` – Mood, Stress, Goals ve Relationship profilleri
5. `Ultimate_BluePrint` – Tam kapsamlı proje blueprint’i, multimodal plan, engagement ve push notification

> AI her dökümanı okuduktan sonra **önemli noktaları kendi belleğine veya geçici context’e kaydedecek** ve bir sonraki adım için hazır olacak.

---

## 2️⃣ Başlıca Kurallar ve Geliştirme Standartları

* **CleanCode Mimarisi:**

  * Kod okunabilir, fonksiyonlar kısa ve tek sorumluluklu
  * Her modül kendi klasöründe
  * Fonksiyon ve değişken isimleri anlamlı

* **Reklam / Monetizasyon:**

  * Sadece AdMob entegrasyonu kullanılacak
  * Reklamlar kullanıcı deneyimini bozmadan yerleştirilecek

* **Klasör Yapısı:**

  * Karmaşık olmayacak, temel modüller net:

    * `ui` → Tüm ekranlar, widget’lar
    * `services` → API, memory, profil yönetimi
    * `models` → Memory ve Profil veri modelleri
    * `utils` → Yardımcı fonksiyonlar, token yönetimi
    * `assets` → Görseller, ses, fontlar

* **Token ve Maliyet Optimizasyonu:**

  * Memory + Profil özetleme
  * Hybrid Context kullanımı
  * Lokal cache / rule-based cevaplar

* **Multi-Language Desteği:** Türkçe ve İngilizce başlangıç

* **Sesli ve Görüntülü Sohbet:** Gelecek faz için planlanacak

* **Günlük Mesaj Limiti:** 50 mesaj

---

## 3️⃣ Agent Görevleri – Adım Adım

AI agent sırasıyla şunları yapacak:

1. **Dökümanları sırayla okuma ve analiz etme**
2. **Proje mimarisi oluşturma:**

   * CleanCode kurallarına uygun
   * Token ve maliyet optimizasyonlu
   * Memory + Profil + Engagement sistemi entegre
3. **Klasör yapısını oluşturma:**

   * Modüller net ve basit
   * Dosya ve klasör isimleri anlamlı
4. **Veri modellerini oluşturma:**

   * Memory, Profil, Kullanıcı, Mesaj modelleri
5. **Memory & Profil yönetim kodunu yazma:**

   * Short-term / Long-term memory
   * Profil güncelleme ve scoring
   * Privacy / silme opsiyonları
6. **AI mesaj üretim ve cevap algoritmalarını yazma:**

   * Multi-language uyumlu
   * Empatik ve bağlayıcı
   * Emojiler ve günlük hatırlatmalar
7. **Maliyet optimizasyonu kodunu entegre etme:**

   * Token summmary, hybrid context, lokal cache
   * Adaptive model switching
8. **Push notification ve engagement sistemi kodu**
9. **UI ekranlarını oluşturma:**

   * Sohbet ekranı
   * Onboarding (isim, cinsiyet, anonim/Google login)
   * Profil ve ayarlar
10. **AdMob entegrasyonu ve reklam alanları ekleme**
11. **Test senaryoları oluşturma ve validation**
12. **Kod refactor & CleanCode denetimi**
13. **Gerekli README / proje dokümantasyonu üretme**

---

## 4️⃣ AI Agent Prompt Örneği

```text
You are tasked with developing the Sırdaş AI mobile app from scratch. Follow these instructions:

1. Read documents in this order:
   a. AI_Maliyet_Dusurme_Mimarisi
   b. Analiz
   c. Gelişmiş_Memory_Sistemi
   d. Kullanıcı_Psikolojik_Profil_Sistemi
   e. Ultimate_BluePrint

2. Apply all key rules:
   - CleanCode architecture
   - AdMob for monetization
   - Simple, clear folder structure
   - Token cost optimization

3. Execute project step-by-step:
   - Design architecture
   - Create folders and files
   - Implement data models (Memory, Profile, User, Message)
   - Implement Memory and Profile management code
   - Implement AI response logic with context and emotion
   - Integrate cost-saving features
   - Create push notification / engagement system
   - Build UI screens (chat, onboarding, profile/settings)
   - Integrate AdMob
   - Write tests and validate
   - Refactor code and check CleanCode compliance
   - Produce README and documentation

4. Multi-language support: Turkish + English
5. Daily max messages: 50
6. Future plan: voice and video chat
```

---

## 5️⃣ Özet

Bu prompt ile AI agent:

* Tüm dökümanları referans alır ve analiz eder
* CleanCode, maliyet optimizasyonu, memory/profil ve monetizasyon kurallarına uyar
* Klasör yapısı, kod, UI ve testleri **adım adım** üretir
* Projenin başlangıcından sonuna kadar **tam kapsamlı bir yol haritasına sahip olur**

> Bu prompt’u AI agent’a vererek Sırdaş AI uygulamasını sıfırdan, eksiksiz ve optimize şekilde geliştirebilirsiniz.
