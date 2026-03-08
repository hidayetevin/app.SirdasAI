export class AISilhouette {
    public element: HTMLElement;
    private silhouetteDiv: HTMLElement;

    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'ai-silhouette-container';

        this.silhouetteDiv = document.createElement('div');
        this.silhouetteDiv.className = 'ai-silhouette';

        this.element.appendChild(this.silhouetteDiv);
    }

    public setTalking(isTalking: boolean) {
        if (isTalking) {
            this.silhouetteDiv.classList.add('talking');
        } else {
            this.silhouetteDiv.classList.remove('talking');
        }
    }

    // AI Karakter seçimine göre renk değişimi (Örn: Erkek mavi, Kadın pembe, Nötr turkuaz)
    public setColor(hexColor: string) {
        this.silhouetteDiv.style.background = `radial-gradient(circle, ${hexColor} 0%, transparent 70%)`;
        this.silhouetteDiv.style.boxShadow = `0 0 30px ${hexColor}66`;
    }
}
