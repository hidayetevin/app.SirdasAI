import { AISilhouette } from '../components/AISilhouette';

export class OnboardingScreen {
    public element: HTMLElement;
    private onComplete: (data: any) => void;

    constructor(onComplete: (data: any) => void) {
        this.onComplete = onComplete;
        this.element = document.createElement('div');
        this.element.className = 'screen-container onboarding-screen';
        this.render();
    }

    private render() {
        const silhouette = new AISilhouette();

        this.element.innerHTML = `
      <div style="flex: 1; display:flex; flex-direction:column; justify-content:center;">
        <h2 class="title" style="margin-top:20px;">Hoş Geldiniz</h2>
        <div id="ob-silhouette"></div>
        
        <div class="glass-panel">
          <div class="form-group">
            <label>AI Karakteriniz</label>
            <select id="ob-gender" class="form-input">
              <option value="neutral">Nötr</option>
              <option value="female">Kadın</option>
              <option value="male">Erkek</option>
            </select>
          </div>

          <div class="form-group">
            <label>Sırdaşınızın Adı</label>
            <input type="text" id="ob-name" class="form-input" placeholder="Örn: Mira, Atlas..." value="Atlas" />
          </div>
          
          <button id="btn-google" class="btn-secondary" style="margin-bottom: 12px;">Google ile Giriş Yap (+20 Mesaj)</button>
          <button id="btn-anonymous" class="btn-primary">Anonim Olarak Başla</button>
        </div>
      </div>
    `;

        // Silhouette ekle
        const silContainer = this.element.querySelector('#ob-silhouette');
        if (silContainer) {
            silContainer.appendChild(silhouette.element);
        }

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
            isGoogleAuth: isGoogleAuth,
            language: 'tr'
        };

        this.onComplete(settings);
    }
}
