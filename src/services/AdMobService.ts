export class AdMobService {
    private isAdMobAvailable = false;
    private INTERSTITIAL_ID = 'ca-app-pub-3940256099942544/1033173712'; // Test ID
    private REWARDED_ID = 'ca-app-pub-3940256099942544/5224354917'; // Test ID
    private BANNER_ID = 'ca-app-pub-3940256099942544/6300978111'; // Test ID

    private lastInterstitialTime = 0;
    private INTERSTITIAL_COOLDOWN = 3 * 60 * 1000; // 3 dakika cooldown (Kullanıcı deneyimi koruma)

    constructor() {
        this.init();
    }

    private init() {
        // Mobil wrapper (Örn: Capacitor/Cordova) üzerinden AdMob'un global olarak yüklenip yüklenmediğine bakılır
        // Saf WebView (JS Interface) ile bridge kurulduğunda window.AndroidAdMob nesnesi olur
        if (typeof window !== 'undefined' && (window as any).AndroidAdMob) {
            this.isAdMobAvailable = true;
            console.log("AdMob Service: Native Bridge Found.");
        } else {
            console.log("AdMob Service: Running in Mock Mode (Browser/No Bridge).");
        }
    }

    /**
     * Banner Reklamını Ekranın Altında veya Üstünde Gösterir
     */
    public showBanner() {
        if (this.isAdMobAvailable) {
            (window as any).AndroidAdMob.showBanner(this.BANNER_ID);
        } else {
            console.log(`[MOCK AD] Mostrar Banner: ${this.BANNER_ID}`);
            // UI üzerinde test amaçlı ufak bir div eklenebilir
        }
    }

    public hideBanner() {
        if (this.isAdMobAvailable) {
            (window as any).AndroidAdMob.hideBanner();
        } else {
            console.log("[MOCK AD] Ocultar Banner.");
        }
    }

    /**
     * Geçiş Reklamı (Tam Ekran). Cooldown mekanizması içerir.
     */
    public async showInterstitial(): Promise<boolean> {
        const now = Date.now();
        if (now - this.lastInterstitialTime < this.INTERSTITIAL_COOLDOWN) {
            console.log("AdMob: Interstitial cooldown aktif, reklam gösterilmeyecek.");
            return false;
        }

        return new Promise((resolve) => {
            if (this.isAdMobAvailable) {
                // Native cihazda reklamı göster ve callback bekle
                (window as any).AndroidAdMob.showInterstitial(this.INTERSTITIAL_ID, (success: boolean) => {
                    if (success) this.lastInterstitialTime = Date.now();
                    resolve(success);
                });
            } else {
                console.log(`[MOCK AD] Interstitial Reklam Gösterildi: ${this.INTERSTITIAL_ID}`);
                this.lastInterstitialTime = Date.now();
                // Cihaz dışı web testi için 1 saniye bekleme simülasyonu
                setTimeout(() => resolve(true), 1000);
            }
        });
    }

    /**
     * Ödüllü Reklam. (Örneğin +20 Mesaj Hakkı kazanmak için)
     */
    public async showRewardedAd(): Promise<boolean> {
        return new Promise((resolve) => {
            if (this.isAdMobAvailable) {
                // Native cihaza gönderilir. success true ise kullanıcı ödülü haketmiştir
                (window as any).AndroidAdMob.showRewardedAd(this.REWARDED_ID, (rewardEarned: boolean) => {
                    resolve(rewardEarned);
                });
            } else {
                console.log(`[MOCK AD] Video Başladı (Rewarded): ${this.REWARDED_ID}`);
                // Simülasyon: Kullanıcı izlediyse 2 sn sonra true döner
                setTimeout(() => {
                    console.log("[MOCK AD] Video Bitti. Ödül Veriliyor.");
                    resolve(true);
                }, 2000);
            }
        });
    }
}

// Singleton export
export const adMobService = new AdMobService();
