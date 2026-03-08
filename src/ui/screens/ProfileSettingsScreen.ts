export class ProfileSettingsScreen {
  public element: HTMLElement;
  private onBack: () => void;
  private onClearMemory: () => void;
  private onWatchAd: () => void;

  constructor(onBack: () => void, onClearMemory: () => void, onWatchAd: () => void) {
    this.onBack = onBack;
    this.onClearMemory = onClearMemory;
    this.onWatchAd = onWatchAd;
    this.element = document.createElement('div');
    this.element.className = 'screen-container profile-screen';
    this.render();
  }

  private render() {
    this.element.innerHTML = `
      <div class="chat-header">
        <button class="profile-btn" id="btn-back">←</button>
        <span style="font-weight:600; font-size: 18px;">Profil & Ayarlar</span>
        <div style="width:36px"></div> <!-- Balance the header -->
      </div>
      
      <div style="padding: 20px; flex: 1; overflow-y: auto;">
        
        <!-- Mood Tracking Yada İstastikler Gelebilir -->
        <div class="glass-panel" style="margin: 0 0 20px 0;">
          <h3 style="margin-top:0">Günlük İstatistik</h3>
          <p style="color:var(--text-muted); font-size: 14px;">Kalan Mesaj Hakkı: <strong>Limitli</strong></p>
          <div style="width: 100%; background: rgba(255,255,255,0.1); height: 8px; border-radius: 4px; overflow: hidden; margin-top: 10px; margin-bottom: 20px;">
             <div style="width: 40%; background: var(--primary-color); height: 100%;"></div>
          </div>
          <button id="btn-watch-ad" class="btn-primary" style="background: linear-gradient(135deg, #f0a44d, #b5722c); box-shadow: 0 4px 15px rgba(240, 164, 77, 0.3);">Reklam İzle & +20 Mesaj Kazan</button>
        </div>

        <!-- Privacy & Memory -->
        <div class="glass-panel" style="margin: 0 0 20px 0;">
          <h3 style="margin-top:0; color: #ffab40;">Gizlilik ve Bellek</h3>
          <p style="color:var(--text-muted); font-size: 14px; line-height:1.5;">
            Sırdaş AI hafızasında tuttuğu önemli anıları ve profilini istediğin zaman silebilirsin.
          </p>
          <button id="btn-clear-memory" class="btn-secondary" style="border-color: #ff5b5b; color: #ff5b5b;">Tüm Belleği Sil</button>
        </div>
        
        <!-- Uyarı Metni -->
        <div style="text-align: center; margin-bottom: 20px; font-size: 13px; color: var(--text-muted); padding: 0 10px;">
          <p>⚠️ Sırdaş AI profesyonel psikolojik destek yerine geçmez.</p>
        </div>
      </div>
    `;

    // Events
    this.element.querySelector('#btn-back')?.addEventListener('click', () => {
      this.onBack();
    });

    this.element.querySelector('#btn-clear-memory')?.addEventListener('click', () => {
      if (confirm('AI belleğindeki tüm anılarınızı silmek istediğinizden emin misiniz?')) {
        this.onClearMemory();
      }
    });

    this.element.querySelector('#btn-watch-ad')?.addEventListener('click', () => {
      this.onWatchAd();
    });
  }
}
