import { AvatarService } from '../../services/AvatarService';

export class CallScreen {
    public element: HTMLElement;
    private avatarService: AvatarService | null = null;
    private onHangUp: () => void;
    private statusText!: HTMLElement;
    private aiNameText!: HTMLElement;
    private timerText!: HTMLElement;
    private callTimer: any;
    private startTime: number = 0;

    constructor(onHangUp: () => void) {
        this.onHangUp = onHangUp;
        this.element = document.createElement('div');
        this.element.className = 'screen-container call-screen';
        this.render();
    }

    private render() {
        this.element.innerHTML = `
      <div class="call-bg-glow"></div>
      
      <div class="call-header">
        <span id="call-ai-name" class="call-name">Sırdaş AI</span>
        <span id="call-timer" class="call-timer">00:00</span>
      </div>

      <div class="call-center">
        <div id="call-silhouette-container" class="call-silhouette-large"></div>
        <div id="call-status" class="call-status">Aranıyor...</div>
      </div>

      <div class="call-controls">
        <button class="call-btn mute-btn" id="btn-mute">
           <span class="icon">🔇</span>
           <span class="label">Sessiz</span>
        </button>
        <button class="call-btn hangup-btn" id="btn-hangup">
           <span class="icon">📞</span>
        </button>
        <button class="call-btn hold-btn" id="btn-hold">
           <span class="icon">⏸</span>
           <span class="label">Beklet</span>
        </button>
      </div>
    `;

        const silContainer = this.element.querySelector('#call-silhouette-container') as HTMLElement;
        if (silContainer) {
            // Container boyutlarını kapsayacak şekilde güncelle
            silContainer.style.width = '100vw'; // Tam genişlik sağla ki flexbox ezip ince bir şerit yapmasın
            silContainer.style.maxWidth = '500px';
            silContainer.style.height = '50vh';
            silContainer.style.minHeight = '350px';
            silContainer.style.overflow = 'hidden';

            // Avatar servisini başlat
            this.avatarService = new AvatarService(silContainer);
        }

        this.statusText = this.element.querySelector('#call-status') as HTMLElement;
        this.aiNameText = this.element.querySelector('#call-ai-name') as HTMLElement;
        this.timerText = this.element.querySelector('#call-timer') as HTMLElement;

        // Events
        this.element.querySelector('#btn-hangup')?.addEventListener('click', () => {
            this.stopTimer();
            this.onHangUp();
        });

        // Toggle Mute/Hold visual only for now (functional integration later)
        this.element.querySelector('#btn-mute')?.addEventListener('click', (e) => {
            (e.currentTarget as HTMLElement).classList.toggle('active');
        });
        this.element.querySelector('#btn-hold')?.addEventListener('click', (e) => {
            (e.currentTarget as HTMLElement).classList.toggle('active');
        });
    }

    public startCall(aiName: string, gender: string) {
        this.aiNameText.textContent = aiName;
        this.statusText.textContent = 'Bağlandı';
        this.startTimer();

        // Cinsiyete göre 3D modeli yükle
        if (this.avatarService) {
            this.avatarService.loadAvatar(gender);
        }
    }

    public updateAvatarMouth(volume: number) {
        if (this.avatarService) {
            this.avatarService.setMouthOpenness(volume);
        }
    }

    public setAvatarEmotion(mood: string) {
        if (this.avatarService) {
            this.avatarService.setEmotion(mood);
        }
    }

    public setStatus(text: string) {
        this.statusText.textContent = text;
        // AISilhouette kaldırıldı, 3D model idle animasyonları kendisi yönetiyor
    }

    private startTimer() {
        this.startTime = Date.now();
        this.timerText.textContent = '00:00';
        this.callTimer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const m = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const s = (elapsed % 60).toString().padStart(2, '0');
            this.timerText.textContent = `${m}:${s}`;
        }, 1000);
    }

    private stopTimer() {
        if (this.callTimer) {
            clearInterval(this.callTimer);
            this.callTimer = null;
        }
    }

    public updateAiName(name: string) {
        if (this.aiNameText) this.aiNameText.textContent = name;
    }
}
