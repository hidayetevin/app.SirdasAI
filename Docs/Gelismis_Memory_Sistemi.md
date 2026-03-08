# Sırdaş AI – Gelişmiş Memory Sistemi

## Amaç

Sırdaş AI uygulamasında amaç, kullanıcının hayatındaki **önemli olayları hatırlayan bir AI** oluşturmaktır.
Ancak her mesajı kaydetmek yerine yalnızca anlamlı bilgileri saklayan **optimize edilmiş bir hafıza sistemi** kullanılacaktır.

Bu sistem sayesinde:

* AI kullanıcıyı gerçekten tanıyormuş gibi davranır
* gereksiz veri büyümesi engellenir
* AI API maliyeti düşer
* sohbet daha doğal olur

---

# Memory Mimarisi

Sistem **3 katmanlı hafıza mimarisi** kullanır.

## 1. Short-Term Memory (Kısa Süreli Hafıza)

Bu hafıza aktif sohbet bağlamını içerir.

AI'ya gönderilen içerik:

* son 10–20 mesaj

Örnek:

```
User: Bugün işte çok stres yaşadım  
AI: Seni en çok zorlayan ne oldu?
```

Amaç:

* konuşma akışını korumak
* bağlamı kaybetmemek

---

## 2. Long-Term Memory (Uzun Süreli Hafıza)

AI'nın kullanıcı hakkında uzun süre hatırlaması gereken bilgiler.

Örnekler:

* kullanıcı yarın iş görüşmesine girecek
* kullanıcı matematik sınavından korkuyor
* kullanıcı sevgilisiyle tartıştı
* kullanıcı yazılım öğreniyor

Bu bilgiler **memory tablosunda saklanır**.

---

## 3. Contextual Memory (Durumsal Hafıza)

AI her cevapta tüm hafızayı kullanmaz.

Bunun yerine:

* kullanıcının mesajı analiz edilir
* ilgili memory kategorisi belirlenir
* sadece alakalı memory'ler kullanılır

### Örnek

Kullanıcı:

> Bugün iş görüşmem vardı.

AI'nın kullanacağı memory:

* kullanıcı iş arıyor
* kullanıcı iş görüşmesine hazırlanıyordu

AI'nın kullanmayacağı memory:

* matematik sınavı
* sevgili tartışması

Bu yöntem **context maliyetini ciddi şekilde düşürür**.

---

# Memory Veri Yapısı

Memory tablosu:

```
id
user_id
memory_text
category
importance
created_at
last_used
```

---

# Memory Kategorileri

Memory'ler kategorilere ayrılır.

```
career
education
relationship
family
health
goals
daily_life
```

Bu sayede AI doğru memory'yi daha kolay bulur.

---

# Importance (Önem Skoru)

Her memory için **1–5 arası önem skoru** atanır.

| Score | Anlam      |
| ----- | ---------- |
| 5     | Çok önemli |
| 4     | Önemli     |
| 3     | Orta       |
| 2     | Düşük      |
| 1     | Çok düşük  |

### Örnek

```
yarın iş görüşmesi var → importance 5
yazılım öğreniyor → importance 4
kahve seviyor → importance 1
```

---

# Memory Oluşturma Kuralları

Her mesaj memory olarak kaydedilmez.

Memory oluşturma kriterleri:

### Gelecek planı

```
yarın sınavım var
```

### Duygusal olay

```
sevgilimle kavga ettim
```

### Hedef

```
yazılım öğreniyorum
```

### Önemli olay

```
bugün iş görüşmesi yaptım
```

---

# Memory Oluşturma Örneği

Kullanıcı:

> Yarın matematik sınavım var çok stresliyim

Oluşturulacak memory:

```
memory_text: user has a math exam tomorrow
category: education
importance: 5
```

---

# Memory Kullanım Algoritması

AI cevap üretmeden önce şu adımlar uygulanır:

1. Kullanıcı mesajı analiz edilir
2. Mesaj kategorisi belirlenir
3. En alakalı memory'ler seçilir
4. AI cevap üretirken bu memory'leri kullanır

---

# Örnek Kullanım

Kullanıcı mesajı:

```
sınav çok kötü geçti
```

AI context:

```
Relevant memories:

- user had a math exam today
- user is worried about exams
```

AI cevap:

```
Sınavın seni gerçekten zorlamış gibi görünüyor.
En çok hangi kısmı zor geldi?
```

---

# Memory Güncelleme

Memory'ler statik değildir.

Durum değişirse güncellenir.

### Örnek

Eski memory:

```
user has a job interview tomorrow
```

Yeni mesaj:

```
iş görüşmesi çok iyi geçti
```

Güncellenmiş memory:

```
user completed a job interview successfully
```

---

# Memory Yaşlandırma (Aging)

Memory'ler zamanla önemini kaybeder.

Her 30 günde:

```
importance = importance - 1
```

importance değeri 0 olursa memory silinebilir.

---

# Memory Limit Sistemi

Bir kullanıcı için maksimum:

```
200 memory
```

Limit aşılırsa:

* en eski
* en düşük importance

memory'ler silinir.

---

# AI Context Oluşturma

AI'ya gönderilecek context:

```
Last 15 messages

+

Top 5 relevant memories
```

Bu yaklaşım:

* token maliyetini azaltır
* performansı artırır
* AI'nın daha doğru cevap vermesini sağlar

---

# Context Örneği

```
Relevant memories:

- user is preparing for math exam
- user recently had job interview

Conversation:

User: sınav çok kötü geçti
```

---

# Relationship Memory

AI kullanıcının hayatındaki kişileri de öğrenebilir.

### Örnek

```
user has a girlfriend named Ayşe
user argues with Ayşe sometimes
```

AI daha sonra şöyle sorabilir:

```
Ayşe ile durum şimdi nasıl?
```

Bu özellik kullanıcı ile güçlü bağ kurar.

---

# Event Memory

Tarihli olaylar saklanabilir.

```
math exam → 15 May
job interview → 22 May
```

AI bu olayları hatırlatabilir.

### Örnek

```
Bugün sınavın vardı, nasıl geçti?
```

---

# Memory Engine Akışı

```
User Message
      ↓
Message Analyzer
      ↓
Memory Extractor
      ↓
Memory Storage
      ↓
Relevant Memory Finder
      ↓
AI Response
```

---

# AI Agent İçin Memory Talimatı

AI agent'a verilecek geliştirme talimatı:

```
Implement a memory system for the AI companion.

Rules:

1. Do not store every message as memory.
2. Only store important information such as:
   - future plans
   - emotional events
   - relationships
   - goals
3. Assign importance score between 1 and 5.
4. When generating responses, retrieve the most relevant memories.
5. Limit memories per user to 200.
```

---

# Avantajlar

Bu sistem sayesinde:

* AI kullanıcıyı gerçekten tanır
* sohbetler daha doğal olur
* veri büyümesi kontrol edilir
* API maliyetleri düşer
* kullanıcı bağlılığı artar

---

# Sonuç

Bu memory mimarisi Sırdaş AI'nın **en kritik bileşenlerinden biridir**.
Doğru uygulanırsa kullanıcı şu hissi yaşar:

> "Bu AI gerçekten beni tanıyor."
