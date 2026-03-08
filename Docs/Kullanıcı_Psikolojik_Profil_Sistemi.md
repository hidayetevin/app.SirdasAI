# Sırdaş AI – Kullanıcı Psikolojik Profil Sistemi

## Amaç

Sırdaş AI, kullanıcıyla olan sohbetlerinden yola çıkarak **psikolojik profil çıkarabilir**.
Bu sayede AI, kullanıcının ruh hali, stres düzeyi, endişeleri ve ilgi alanları hakkında daha bilinçli ve empatik cevaplar üretebilir.

Avantajları:

* Sohbetler daha kişiselleşir
* Kullanıcıya özel tavsiyeler veya sorular üretilir
* Bağlılık ve etkileşim artar
* AI, geçmiş memory ve duygusal örüntüleri kullanır

---

# 1️⃣ Profil Katmanları

Profil, 4 temel katmanda tutulur:

1. **Mood Profile (Ruh Hali Profili)**

   * Günlük ruh hali kayıtlarından çıkarılır
   * Mutlu, neutral, üzgün, stresli

2. **Stress & Anxiety Profile (Stres ve Endişe Profili)**

   * Stresli veya kaygılı durumlar memory üzerinden takip edilir
   * Örnek: sınavlar, iş görüşmesi, ilişkiler

3. **Interests & Goals Profile (İlgi Alanları ve Hedefler)**

   * Kullanıcının konuşmalarından öğrenilir
   * Örnek: yazılım öğreniyor, spor yapıyor

4. **Relationship Profile (İlişki Profili)**

   * Kullanıcının hayatındaki önemli kişiler ve ilişkiler
   * Örnek: sevgili, aile, arkadaş

---

# 2️⃣ Veri Toplama

Kullanıcının profili **Memory sistemi ile entegre çalışır**.

Memory’ler kategorilere ayrılır:

* daily_life
* career
* education
* relationship
* health
* goals

AI, mesajlardan otomatik olarak çıkarım yapar ve **profil günceller**.

---

# 3️⃣ Profil Skorları

Her profil katmanı için 1–5 arasında önem ve yoğunluk skorları belirlenir.

Örnek:

| Katman   | Skor | Açıklama                                        |
| -------- | ---- | ----------------------------------------------- |
| Mood     | 4    | Son 7 günün çoğu gün “stresli” veya “üzgün”     |
| Stress   | 5    | Önemli olaylar ve geleceğe dair endişeler yoğun |
| Goals    | 3    | 2–3 hedef aktif takip ediliyor                  |
| Relation | 4    | Önemli kişilerle ilişkilerde çalkantı var       |

---

# 4️⃣ Profil Güncelleme Algoritması

1. Kullanıcı mesajı AI tarafından analiz edilir
2. Duygusal ton ve içerik çıkarılır
3. İlgili memory veya profil katmanına eklenir
4. Skorlar güncellenir
5. AI cevap üretmeden önce en güncel profil referans alınır

---

# 5️⃣ Örnek Profil Oluşumu

Kullanıcı mesajları:

1. “Bugün iş görüşmem çok kötü geçti.” → Stress 5, Career 3
2. “Sevgilimle tartıştım.” → Relation 4
3. “Matematik sınavım var yarın, çok endişeliyim.” → Stress 5, Education 4
4. “Hafta sonu yürüyüş yapmayı planlıyorum.” → Goals 3, Health 3

---

# 6️⃣ AI Kullanım Örneği

AI mesajı:

> İş görüşmen seni çok yormuş gibi görünüyor 😔
> Sevgilinle tartıştığını da hatırlıyorum.
> Bugün biraz rahatlamak ister misin?

Burada:

* Mood ve Stress profili referans alınmış
* Relation memory kullanılmış
* AI empatik ve bağlayıcı cevap üretmiş

---

# 7️⃣ AI Cevap Üretiminde Profil Kullanımı

AI agent’a ek prompt:

```id="ai-profile-prompt"
Use the user's psychological profile to generate responses.

Rules:

1. Reference Mood, Stress, Goals, and Relationship scores.
2. Be empathetic and supportive.
3. Ask relevant questions based on profile.
4. Keep responses short and natural (1–3 sentences).
5. Use emojis to convey emotion.
6. Do not act as a professional psychologist.
```

---

# 8️⃣ Profilin Avantajları

* Sohbetler **kişiye özel** olur
* AI kullanıcıyı **önceki duygusal örüntülere göre yönlendirir**
* Push notification mesajları daha anlamlı hale gelir
* Kullanıcı **daha fazla bağ kurar** ve uygulamayı sık kullanır

---

# 9️⃣ İleri Düzey Öneriler

* **Gizlilik opsiyonu:** Kullanıcı istediğinde profil analizlerini ve memory’leri silebilir
* **Gelişmiş analiz:** Haftalık veya aylık raporlar oluşturulabilir
* **Bağlantı kurma:** AI, kullanıcı geçmişine göre yeni sohbet başlatabilir

Örnek:

> Geçen hafta iş görüşmesi vardı. Bugün biraz bunu konuşmak ister misin?

---

# 10️⃣ Özet

Bu sistem, Sırdaş AI uygulamasının **en benzersiz ve bağımlılık yaratıcı özelliği**dir:

* AI kullanıcının hayatını takip eder
* Memory ve profil sistemi birlikte çalışır
* AI cevapları daha kişisel ve bağlayıcı olur

---

