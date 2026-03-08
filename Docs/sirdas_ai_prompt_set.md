# Sırdaş Uygulaması – Uçtan Uca AI Prompt Seti

## Kurallar
1. AI, her adım tamamlandığında kullanıcıdan onay alacak. Onay alınmadan sonraki adıma geçmeyecek.
2. AI, dökümanlarda olmayan hiçbir bilgiyi kendi başına eklemeyecek. Eksik bilgi varsa kullanıcıya soracak.
3. Modüller bağımsız ve test edilebilir olacak.
4. AdMob harici hiçbir kütüphane kullanılmayacak; gerekiyorsa kullanıcıya sorulacak.
5. UI modülleri tam ekran olacak, status bar ve nav bar gizli.

---

## 1️⃣ Proje Başlatma ve Yapılandırma
```prompt id="xieiqo"
Task: Sırdaş uygulaması için Clean Code ve modüler yapıya uygun proje iskeleti oluştur.
- Platform: Android (Kotlin) veya Flutter
- Modüller: UI, Data, Domain, Services
- AdMob harici başka kütüphane kullanma; gerekiyorsa kullanıcıya sor
- Tüm varsayımları dökümanlara dayandır
- Çıktıyı klasör yapısı ve örnek dosyalar ile göster
- Tamamlandıktan sonra: “Proje iskeleti hazır, onaylıyor musunuz?” sor
```

---

## 2️⃣ UI Tasarımı
```prompt id="uhg68m"
Task: Sırdaş için tüm ekranları modüler ve responsive tasarla
- Ekranlar: Giriş, Kayıt, Ana Ekran, Profil, Ayarlar
- Status bar ve navigation bar tamamen gizli (tam ekran)
- UI component’leri bağımsız modüller olacak
- Her ekran için kullanıcı etkileşim örnekleri ekle
- Eksik bilgi varsa dökümana dayanarak sor
- Tamamlandıktan sonra: “UI tasarımı tamam, onaylıyor musunuz?” sor
```

---

## 3️⃣ Veri ve API Yönetimi
```prompt id="qu4ojz"
Task: Sırdaş için veri modülünü oluştur
- Repository pattern kullan
- Lokal veri: SQLite/SharedPreferences/Local JSON
- Network API: JSON endpoint örneği
- CRUD işlemleri modüler olacak
- Dökümanlarda olmayan endpoint veya veri şeması varsa kullanıcıya sor
- Tamamlandıktan sonra: “Veri ve API modülü hazır, onaylıyor musunuz?” sor
```

---

## 4️⃣ AdMob Entegrasyonu
```prompt id="2dqig5"
Task: Modüler AdMob reklam modülü oluştur
- Banner, Interstitial, Rewarded örnekleri
- UI ve veri modüllerinden bağımsız
- AdMob ID veya parametreler dökümandan alınacak; eksikse sor
- Tamamlandıktan sonra: “AdMob modülü hazır, onaylıyor musunuz?” sor
```

---

## 5️⃣ Oyun / Etkileşim Modülü (Opsiyonel)
```prompt id="8e5d3e"
Task: Uygulama için mini oyun veya interaktif modül oluştur
- Modüler ve test edilebilir
- Physics motor gerekiyorsa basit native örnek kullan
- Skor ve input yönetimi ekle
- Dökümanda eksik bilgi varsa kullanıcıya sor
- Tamamlandıktan sonra: “Oyun modülü hazır, onaylıyor musunuz?” sor
```

---

## 6️⃣ Test ve Hata Yönetimi
```prompt id="w6ymbk"
Task: Her modül için birim test ve entegrasyon testi ekle
- Kotlin/Flutter test framework
- Hata yönetimi try/catch ve loglama ile
- Kod okunabilir ve yeniden kullanılabilir olacak
- Tamamlandıktan sonra: “Test ve hata yönetimi hazır, onaylıyor musunuz?” sor
```

---

## 7️⃣ Yayınlama Hazırlığı
```prompt id="70zeom"
Task: Uygulamayı Play Store veya App Store için hazırla
- Build süreci, sürüm kontrolü
- Metadata ve ekran görüntüleri dökümandan alınacak; eksikse sor
- Performans optimizasyonu ve tam ekran ayarı dahil
- Tamamlandıktan sonra: “Uygulama yayınlamaya hazır, onaylıyor musunuz?” sor
```

---

## Kullanım Notları
- Promptları sırayla AI agent’e ver. Her adımda onay beklemesini sağla.
- Eksik bilgi varsa AI sana soru soracak.
- Çıktıları `.md` veya kod snippet olarak alabilirsin.

