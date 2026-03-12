import { AvatarService } from '../../services/AvatarService';

export class OnboardingScreen {
  public element: HTMLElement;
  private onComplete: (data: any) => void;
  private selectedAvatarModel: string = 'w-1'; // Default
  private avatarService: AvatarService | null = null;

  constructor(onComplete: (data: any) => void) {
    this.onComplete = onComplete;
    this.element = document.createElement('div');
    this.element.className = 'screen-container onboarding-screen';
    this.render();
  }

  private render() {
    this.element.innerHTML = `
      <div style="flex: 1; display:flex; flex-direction:column; justify-content:center;">
        <h2 class="title" style="margin-top:20px;">Hoş Geldiniz</h2>
        <div id="ob-silhouette"></div>
        
        <div class="glass-panel">
          <div class="form-group">
            <label>AI Karakteriniz</label>
            <select id="ob-gender" class="form-input">
              <optgroup label="Sırdaş Türü">
                  <option value="neutral">Nötr</option>
                  <option value="female" selected>Kadın</option>
                  <option value="male">Erkek</option>
              </optgroup>
            </select>
          </div>

          <div class="form-group">
            <label>Görünümü Seçin</label>
            <!-- Bu select, cinsiyet değiştikçe güncellenecek -->
            <select id="ob-model-select" class="form-input">
              <option value="w-1">Avatar W-1</option>
              <option value="w-2">Avatar W-2</option>
              <option value="w-3">Avatar W-3</option>
              <option value="w-4">Avatar W-4</option>
              <option value="w-5">Avatar W-5</option>
              <option value="w-6">Avatar W-6</option>
            </select>
          </div>

          <div class="form-group">
            <label>Sırdaşınızın Adı</label>
            <input type="text" id="ob-name" class="form-input" placeholder="Örn: Mira, Atlas..." value="Mira" />
          </div>
          
          <button id="btn-google" class="btn-secondary" style="margin-bottom: 12px;">Google ile Giriş Yap (+20 Mesaj)</button>
          <button id="btn-anonymous" class="btn-primary">Anonim Olarak Başla</button>
        </div>
      </div>
    `;

    // Silhouette alanına 3D Avatar ekle
    const silContainer = this.element.querySelector('#ob-silhouette') as HTMLElement;
    if (silContainer) {
      silContainer.style.width = '100%';
      silContainer.style.maxWidth = '300px';
      silContainer.style.height = '35vh';
      silContainer.style.minHeight = '250px';
      silContainer.style.margin = '0 auto';
      silContainer.style.overflow = 'hidden';

      this.avatarService = new AvatarService(silContainer);
      this.avatarService.loadAvatar(this.selectedAvatarModel);
    }

    const genderSelect = this.element.querySelector('#ob-gender') as HTMLSelectElement;
    const modelSelect = this.element.querySelector('#ob-model-select') as HTMLSelectElement;

    // Cinsiyet değiştiğinde model listesini güncelle
    genderSelect?.addEventListener('change', () => {
      const isMale = genderSelect.value === 'male';
      const prefix = isMale ? 'm-' : 'w-';
      const label = isMale ? 'Avatar M-' : 'Avatar W-';

      modelSelect.innerHTML = '';
      for (let i = 1; i <= 6; i++) {
        const opt = document.createElement('option');
        opt.value = `${prefix}${i}`;
        opt.innerText = `${label}${i}`;
        modelSelect.appendChild(opt);
      }

      this.selectedAvatarModel = `${prefix}1`;
      if (this.avatarService) {
        this.avatarService.loadAvatar(this.selectedAvatarModel);
      }
    });

    // Model Seçildiğinde (Tasarımda siluet değişimi veya önizleme daha sonra eklenebilir)
    modelSelect?.addEventListener('change', () => {
      this.selectedAvatarModel = modelSelect.value;
      if (this.avatarService) {
        this.avatarService.loadAvatar(this.selectedAvatarModel);
      }
    });

    // Events
    this.element.querySelector('#btn-anonymous')?.addEventListener('click', () => {
      this.finishOnboarding(false);
    });

    this.element.querySelector('#btn-google')?.addEventListener('click', () => {
      // Normalde Google Login akışı tetiklenir
      console.log("Simulating Google Login...");
      this.finishOnboarding(true);
    });
  }

  private finishOnboarding(isGoogleAuth: boolean) {
    const nameInput = this.element.querySelector('#ob-name') as HTMLInputElement;
    const genderSelect = this.element.querySelector('#ob-gender') as HTMLSelectElement;

    const settings = {
      aiName: nameInput.value || 'Sırdaş',
      aiGender: genderSelect.value,
      avatarModel: this.selectedAvatarModel,
      isGoogleAuth: isGoogleAuth,
      language: 'tr'
    };

    if (this.avatarService) {
      this.avatarService.destroy();
    }

    this.onComplete(settings);
  }
}
