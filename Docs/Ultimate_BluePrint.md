# Sırdaş AI – Ultimate Blueprint

## 1️⃣ Amaç

Sırdaş AI, kullanıcıyla:

* doğal sohbet,
* bağlayıcı etkileşim,
* kişiselleştirilmiş geri bildirim,

sağlarken **AI maliyetlerini minimize etmek** ve **Memory + Profil tabanlı gerçek zamanlı öğrenmeyi** destekler.

---

## 2️⃣ AI Memory & Profil Sistemi

### Memory Katmanları

1. **Short-Term Memory**: Son 15 mesaj → aktif sohbet contexti
2. **Long-Term Memory**: Önemli olaylar, hedefler, ilişkiler → maksimum 200 memory
3. **Contextual Memory**: Sadece ilgili memory’ler API çağrısında kullanılır

### Profil Katmanları

* Mood (Ruh hali)
* Stress & Anxiety (Stres/Endişe)
* Interests & Goals (Hedefler/İlgi alanları)
* Relationship (Önemli kişiler ve ilişkiler)

---

### Memory & Profil Detayları

* **Conflict Resolution**: Çelişkili memory’ler öncelik ve tarih bazlı çözülür
* **Memory Expiry**: Önem skoru düşen veya eski memory’ler silinir
* **Privacy Mode**: Kullanıcı memory ve profili istediğinde silebilir

---

## 3️⃣ Maliyet Optimizasyonu – 10x Daha Az Token

### 3.1 Hybrid Context

* Son 15 mesaj + en alakalı 5–10 memory
* Gereksiz memory’ler API’ye gönderilmez

### 3.2 Lokal Cache

* Basit / rutin mesajlar lokal AI veya rule-based sistem ile yanıtlanır
* Karmaşık / memory ilişkili mesajlar API’ye gider

### 3.3 Batch / Async İşleme

* Push notification veya hatırlatma mesajları toplu işlenir
* Çoklu API çağrısı azaltılır

### 3.4 Adaptive Model Switching

* Kısa mesaj → Mini model
* Memory / Profil → Large model

### 3.5 Token Summarization

* Uzun memory’ler özetlenir
* Özetleme lokal AI veya düşük maliyetli model ile yapılır

### 3.6 Priority Queue / Rate Limiting

* Önemli mesaj → anında API
* Rutin → batch veya gecikmeli

---

## 4️⃣ Multi-Language ve Localization

* Başlangıç: Türkçe + İngilizce
* AI, memory ve profil bilgilerini **dil bağımsız anlayacak** şekilde encode edilir
* Her dil için token ve API kullanım optimizasyonu planlanır

---

## 5️⃣ Sesli ve Görüntülü Sohbet Planı

* İlk etap: Yazılı sohbet
* Sonraki faz: Sesli ve AI görüntüsü
* Multimodal context → memory + profil + audio/video input
* Token/maliyet optimizasyonu için özetleme ve lokal processing uygulanacak

---

## 6️⃣ Engagement & Push Notifications

* AI kullanıcıya hatırlatma veya sohbet başlatma mesajları gönderir
* Optimal zamanlama: Kullanıcı davranış analizi + lokal saat
* Mesajlar memory ve profil referanslıdır

**Örnek:**

> Geçen hafta iş görüşmesi vardı. Bugün biraz konuşmak ister misin?

---

## 7️⃣ Large-Scale Scalability

* Memory database ve summary işlemleri client-side veya server-side dengesi
* Milyonlarca kullanıcı için token ve storage optimizasyonu
* Profil ve memory preprocessing ile API çağrıları azaltılır

---

## 8️⃣ Örnek Maliyet Optimizasyonu

Varsayalım:

* Günlük 50 mesaj / kullanıcı
* Ortalama 600 token → yüksek maliyet

Optimizasyon sonrası:

1. Context filtering → %70 token azalır → 180 token
2. Lokal cache → %50 çağrı azalır
3. Summarization → ek %50 token tasarrufu

**Sonuç:** Maliyet ~10x düşer

---

## 9️⃣ Önerilen Mimari Şema

```text
User Message
      ↓
Message Analyzer
      ↓
Memory Filter & Summarizer → Local Cache Check
      ↓
Decision: API or Local Response
      ↓
AI Response
      ↓
Memory + Profile Update
      ↓
Push Notifications / Engagement
```

---

## 10️⃣ AI Prompt Örnekleri

### Memory Agent Prompt

```text
Use the user's memory system:

- Only store important info: future plans, emotional events, goals, relationships
- Assign importance score 1–5
- Retrieve only relevant memory for response
- Max 200 memory per user
```

### Psychological Profile Prompt

```text
Use the user's psychological profile:

- Reference Mood, Stress, Goals, Relationship scores
- Be empathetic and supportive
- Ask relevant questions based on profile
- Keep responses short and natural
- Use emojis appropriately
- Do not act as a professional psychologist
```

---

## 11️⃣ Avantajlar

* AI maliyeti düşer (10x)
* Sohbetler daha doğal ve bağlayıcı olur
* Kullanıcı memory ve profiline göre kişiselleştirilir
* Multi-language ve multimodal planları destekler
* Büyük kullanıcı tabanı için ölçeklenebilir

---

## 12️⃣ Özet

Bu blueprint ile Sırdaş AI:

* **Memory + Profil + Engagement** sistemlerini optimize eder
* **Token ve model maliyetlerini minimize eder**
* **Kullanıcıyla güçlü bağ kurar** ve uzun süreli kullanım sağlar

> Bu doküman, Sırdaş AI geliştirme ekibi için **tam kapsamlı rehber** niteliğindedir.
