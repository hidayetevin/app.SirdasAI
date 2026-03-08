import { AISilhouette } from '../components/AISilhouette';

export class ChatScreen {
    public element: HTMLElement;
    private messageContainer!: HTMLElement;
    private inputField!: HTMLInputElement;
    private aiSilhouette: AISilhouette;
    private onSendMessage: (text: string) => void;
    private onProfileClick: () => void;

    constructor(onSendMessage: (text: string) => void, onProfileClick: () => void) {
        this.onSendMessage = onSendMessage;
        this.onProfileClick = onProfileClick;
        this.element = document.createElement('div');
        this.element.className = 'screen-container chat-screen';
        this.aiSilhouette = new AISilhouette();
        this.render();
    }

    private render() {
        this.element.innerHTML = `
      <div class="chat-header">
        <div style="display:flex; align-items:center; gap:10px;">
          <div id="chat-silhouette-mini" style="transform: scale(0.3); transform-origin: left center; width: 40px;"></div>
          <span style="font-weight:600; font-size: 18px;" id="chat-ai-name">Sırdaş AI</span>
        </div>
        <button class="profile-btn" id="btn-profile">⚙</button>
      </div>
      
      <div class="chat-messages" id="chat-messages">
        <!-- Messages will be injected here -->
        <div class="message ai">Merhaba! Ben buradayım, günün nasıl geçiyor? 🌟</div>
      </div>
      
      <div class="chat-input-area">
        <input type="text" class="chat-input" id="chat-input" placeholder="Bir şeyler yaz..." autocomplete="off"/>
        <button class="send-btn" id="btn-send">➤</button>
      </div>
    `;

        // Silhouette Header'a ekle
        const silContainer = this.element.querySelector('#chat-silhouette-mini');
        if (silContainer) {
            silContainer.appendChild(this.aiSilhouette.element);
        }

        this.messageContainer = this.element.querySelector('#chat-messages') as HTMLElement;
        this.inputField = this.element.querySelector('#chat-input') as HTMLInputElement;

        // Events
        this.element.querySelector('#btn-profile')?.addEventListener('click', () => {
            this.onProfileClick();
        });

        this.element.querySelector('#btn-send')?.addEventListener('click', () => this.handleSend());
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSend();
        });
    }

    private handleSend() {
        const text = this.inputField.value.trim();
        if (!text) return;

        this.addMessage(text, 'user');
        this.inputField.value = '';

        // Yükleme durumu UI animasyonu başlat (Agent response beklerken)
        this.aiSilhouette.setTalking(true);
        this.onSendMessage(text);
    }

    public addMessage(text: string, sender: 'user' | 'ai') {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.textContent = text;
        this.messageContainer.appendChild(msgDiv);

        // Auto scroll bottom
        this.messageContainer.scrollTop = this.messageContainer.scrollHeight;

        // AI Mesajı eklendiyse nefes alma animasyonuna geri dön
        if (sender === 'ai') {
            this.aiSilhouette.setTalking(false);
        }
    }

    public updateAiName(name: string) {
        const nameEl = this.element.querySelector('#chat-ai-name');
        if (nameEl) nameEl.textContent = name;
    }
}
