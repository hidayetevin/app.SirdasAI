# Sırdaş AI – Ürün Analizi ve AI Agent Geliştirme Dokümanı

## 1. Proje Tanımı

**Uygulama Adı:** Sırdaş AI

**Konsept:**
Sırdaş AI, kullanıcıların dertleşebileceği, gününü anlatabileceği ve duygusal destek alabileceği bir **AI günlük arkadaşıdır**.

Kullanıcı uygulamayı açtığında karşısında bir **AI silüeti** bulunur ve onunla sohbet eder.
AI kullanıcıyı tanır, önceki konuşmaları hatırlar ve zaman zaman sohbet başlatır.

Amaç:

* Kullanıcının günlük hayatını paylaşabileceği bir AI arkadaşı sunmak
* Empatik ve doğal sohbet deneyimi oluşturmak
* Kullanıcı ile uzun vadeli bağ kurmak

---

# 2. Temel Özellikler

## 2.1 Sohbet Sistemi

Kullanıcı AI ile sohbet eder.

Kurallar:

* AI cevapları **kısa olmalı (1-3 cümle)**
* Empatik olmalı
* Emoji kullanabilir
* Kullanıcıya soru sorabilir
* Önceki konuşmaları referans verebilir

Örnek:

Kullanıcı:

> Bugün işte moralim çok bozuldu.

AI:

> Bu seni gerçekten üzmüş gibi görünüyor 😔
> İstersen biraz daha anlatabilirsin.

---

## 2.2 AI'nın Sohbet Başlatması

AI bazı durumlarda sohbet başlatabilir.

Örnek mesajlar:

* Bugün nasılsın?
* Dün sınavın vardı. Nasıl geçti?
* Birkaç gündür konuşamadık. Umarım iyisindir.

---

## 2.3 Günlük Check-in

AI her gün kullanıcıya şu soruyu sorabilir:

> Bugünün nasıl geçti?

Bu sistem kullanıcıyı uygulamaya geri getirir.

---

## 2.4 Ruh Hali Takibi

Kullanıcı ruh halini kaydedebilir.

Seçenekler:

* Mutlu
* Normal
* Üzgün
* Stresli

Bu verilerden haftalık grafik oluşturulur.

---

# 3. Onboarding Süreci

Uygulama ilk açıldığında aşağıdaki bilgiler alınır.

## 3.1 Dil

* Türkçe
* English

---

## 3.2 AI Karakter Seçimi

Kullanıcı AI karakterini seçer:

* Kadın
* Erkek
* Nötr

---

## 3.3 AI İsmi

Kullanıcı AI için isim belirleyebilir.

Örnek:

* Mira
* Atlas
* Luna
* Nova

---

## 3.4 Giriş Sistemi

Seçenekler:

1. Anonim devam et
2. Google ile giriş

Google ile giriş yapan kullanıcıya:

* günlük +20 mesaj hakkı

---

# 4. Mesaj Limiti Sistemi

Ücretsiz kullanıcı:

* günlük 30 mesaj

Google giriş yapan kullanıcı:

* günlük 50 mesaj

Bu sistem kullanıcıyı giriş yapmaya teşvik eder.

---

# 5. Teknik Mimari

## 5.1 Frontend

Web App (WebView içinde çalışacak)

Teknolojiler:

* HTML
* CSS
* JavaScript
* Minimal framework veya vanilla JS

Sebep:

* hızlı geliştirme
* AI agent ile kod üretimi kolay
* tek kod tabanı

---

## 5.2 Backend (İlk aşamada minimal)

İlk versiyon:

* Local database

İleri versiyon:

* Cloud backend

---

## 5.3 AI Model

Primary Model:

Google Gemini Flash

Backup Model:

Groq Llama

Amaç:

* düşük maliyet
* hızlı cevap
* ölçeklenebilir yapı

---

# 6. Local Database Tasarımı

İlk versiyon için veriler cihaz içinde saklanacaktır.

Teknoloji:

IndexedDB

---

## users

```
id
login_type
language
ai_name
ai_gender
created_at
```

---

## conversations

```
id
user_id
role
message
timestamp
```

role:

* user
* ai

---

## memories

AI'nın kullanıcı hakkında hatırlaması gereken bilgiler.

```
id
user_id
memory_text
importance
created_at
```

importance:

1–5 arası değer

Örnek memory:

* kullanıcı yarın iş görüşmesine girecek
* kullanıcı matematik sınavından korkuyor
* kullanıcı sevgilisiyle tartıştı

---

## mood_logs

```
id
user_id
mood
note
date
```

mood:

* happy
* neutral
* sad
* stressed

---

## app_usage

```
id
user_id
daily_message_count
last_opened
```

---

# 7. Memory Sistemi

AI her mesajı memory olarak kaydetmez.

Memory oluşturma kriterleri:

* önemli olay
* gelecek planı
* duygusal durum
* ilişkiler
* sınav veya iş gibi önemli konular

Örnek:

Kullanıcı:

> Yarın iş görüşmem var.

Memory:

"kullanıcı yarın iş görüşmesine girecek"

---

# 8. Push Notification Sistemi

AI kullanıcıya mesaj gönderebilir.

Durumlar:

1. Günlük check-in
2. Uzun süre giriş yapılmadığında
3. Memory hatırlatma

Örnek:

> Dün sınavın vardı. Nasıl geçti?

---

# 9. UI Tasarım Prensipleri

Uygulama minimal olmalıdır.

Ana ekran:

* koyu arka plan
* ortada AI silüeti
* altta mesaj kutusu

Silüet:

* hafif nefes animasyonu
* mesaj geldiğinde parıldama

---

# 10. Güvenlik ve Play Store Kuralları

Uygulama kendini psikolog gibi göstermemelidir.

Uygulamada şu metin bulunmalıdır:

> Sırdaş AI profesyonel psikolojik destek yerine geçmez.

---

# 11. AI Karakter Promptu

AI aşağıdaki karakter özelliklerine sahip olmalıdır:

* empatik
* yargılamayan
* destekleyici
* kısa cevap veren
* kullanıcıya soru soran
* önceki konuşmaları referans veren

Prompt:

"You are an empathetic AI companion.
Your role is to listen, support, and talk with the user like a trusted friend.

Rules:

* Keep answers short (1-3 sentences)
* Use natural language
* You may use emojis
* Ask gentle questions
* Remember important things the user says
* Be supportive but not act as a therapist
* Encourage the user to talk more"

---

# 12. AI Agent Geliştirme Promptu

AI Agent'a verilecek geliştirme promptu:

Create a mobile web application called "Sırdaş AI".

The application is an AI companion chat app where users can talk about their daily life, emotions, and problems.

Requirements:

* Web app optimized for Android WebView
* Dark mode UI
* Chat interface with AI
* Local database using IndexedDB
* Message limit system
* Onboarding flow
* AI memory system
* Push notification system
* AI avatar silhouette

Features:

1. Onboarding

* language selection
* AI gender selection
* AI name input
* login option

2. Chat system

* user messages
* AI responses
* conversation history

3. Memory system

* store important user information

4. Mood tracking

5. Push notifications

The UI must be minimal and optimized for mobile screens.

---

# 13. Gelecek Özellikleri

İleriki sürümlerde eklenebilecek özellikler:

* Sesli sohbet
* AI avatar animasyonu
* Görüntülü AI agent
* Cloud memory sync
* Premium abonelik
* AI günlük oluşturma
* Gelişmiş duygu analizi

---

# 14. Uzun Vadeli Hedef

Sırdaş AI sadece bir chatbot değil, kullanıcının:

* günlük arkadaşı
* sırdaşı
* destekleyici AI dostu

olmalıdır.

Amaç kullanıcı ile uzun süreli bağ kurmaktır.
