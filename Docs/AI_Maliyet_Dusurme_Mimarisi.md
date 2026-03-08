# Sırdaş AI – AI Maliyetini 10x Düşüren Mimari

## Amaç

Sırdaş AI uygulamasında **AI API maliyetlerini dramatik şekilde azaltmak**, aynı zamanda kullanıcı deneyimini yüksek tutmak.
Bunu sağlamak için **token ve çağrı optimizasyonu**, **lokal önbellekleme**, **context filtering** ve **adaptive model switching** stratejileri uygulanır.

---

# 1️⃣ Hybrid Context Sistemi

**Problem:** Her mesajda tüm memory ve geçmiş sohbeti göndermek yüksek maliyet yaratır.

**Çözüm:**

* **Short-Term Memory:** Son 15 mesaj
* **Relevant Long-Term Memory:** En alakalı 5–10 memory

**Avantaj:**

* API’ye gönderilen token sayısı %70–80 azalır
* Maliyet ve latency düşer

---

# 2️⃣ Lokal AI Cache / On-Device Inference

* Basit ve rutin mesajlar **lokal AI veya rule-based sistem** ile yanıtlanır.
  Örnek: “Günaydın!”, “Nasılsın?”
* Karmaşık mesajlar ve **memory ile ilişkili mesajlar** API’ye gönderilir

**Avantaj:** API çağrısı %40–50 azalır

---

# 3️⃣ Batch / Asenkron İşleme

* Push notification veya hatırlatma mesajları **toplu işlenir**
* Gün içinde biriken mesajlar tek API çağrısıyla hazırlanır

**Avantaj:** Çoklu tekil API çağrıları ortadan kalkar

---

# 4️⃣ Adaptive Model Switching

* **Basit model:** Gemini Mini / Groq Llama
* **Karmaşık model:** Gemini Flash / Groq Llama Large

**Kurallar:**

* Kısa ve rutin mesaj → Mini
* Memory veya profil analizi gerektiren → Flash

**Avantaj:** Ortalama API maliyeti %30–50 düşer

---

# 5️⃣ Token Limit & Summarization

* Uzun memory’ler **özetlenir**
* Örnek: 50 mesaj → 5 cümle özet
* Özetleme **lokal AI veya düşük maliyetli model** ile yapılabilir

**Avantaj:** Token maliyeti 3–5 kat azalır

---

# 6️⃣ Priority Queue / Rate Limiting

* AI çağrıları öncelik sırasına göre sıralanır:

1. Önemli mesaj → anında API
2. Rutin / düşük öncelik → batch veya gecikmeli

**Avantaj:** Gereksiz API çağrıları engellenir

---

# 7️⃣ Memory + Profil Preprocessing

* Kullanıcı memory ve profil verileri **önceden özetlenir ve kategorize edilir**
* API çağrısında **hazır ve küçük context** gönderilir
* AI her defasında raw memory ile işlem yapmaz

**Avantaj:** Token tasarrufu ve hız artışı sağlar

---

# 8️⃣ Örnek Maliyet Hesabı

Varsayalım:

* Kullanıcı başına günlük 50 mesaj
* Ortalama 600 token → maliyet yüksek

Optimizasyon sonrası:

1. Context filtering → %70 token azalır → 180 token
2. Lokal cache → %50 çağrı azalır
3. Summarization → ek %50 token tasarrufu

**Sonuç:** Maliyet ~10x düşer

---

# 9️⃣ Önerilen Mimari Şema

```text id="ai-cost-arch"
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
```

---

# 10️⃣ Uygulama Avantajları

* **Performans artışı:** Daha hızlı cevaplar
* **Maliyet düşüşü:** 10x daha düşük AI harcaması
* **Bağlılık artışı:** AI daha kişisel ve bağlayıcı cevaplar
* **Esneklik:** Yeni özellikler eklerken maliyet kontrol altında

---

# 11️⃣ Özet

Bu mimari ile Sırdaş AI:

* Rutin mesajları lokal yanıtlar
* Önemli mesajlar için optimize edilmiş context kullanır
* Adaptive model ve token yönetimi ile maliyet düşürür
* Memory ve profil sistemi ile kullanıcıyı tanır ve bağlayıcı sohbetler üretir

---

💡 Not: Bu mimariyi **Memory ve Profil sistemleri ile birleştirdiğimizde**, AI uygulaması **hem kullanıcı deneyimi yüksek hem de maliyet açısından sürdürülebilir** olur.
