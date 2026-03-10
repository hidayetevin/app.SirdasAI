export class VoiceService {
    private recognition: any = null;
    private synth: SpeechSynthesis;
    private isListening: boolean = false;
    private silenceTimeout: any = null;
    private onSpeechResultCallback: ((text: string) => void) | null = null;
    private onStartListeningCallback: (() => void) | null = null;
    public onVolumeChange: ((volume: number) => void) | null = null;
    private TTS_API_URL = 'http://localhost:8002/tts';

    constructor() {
        this.synth = window.speechSynthesis;
        this.initRecognition();
    }

    private initRecognition() {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = false;
            this.recognition.lang = 'tr-TR';

            this.recognition.onresult = (event: any) => {
                const text = event.results[event.results.length - 1][0].transcript;
                console.log('Voice result:', text);
                if (this.onSpeechResultCallback) {
                    this.onSpeechResultCallback(text);
                }
                this.resetSilenceTimeout();
            };

            this.recognition.onerror = (event: any) => {
                if (event.error === 'no-speech') {
                    // Sadece dinlemeye devam et, sessizlikte log atmaya gerek yok
                    return;
                }
                console.error('Speech recognition error:', event.error);
                if (event.error === 'not-allowed') {
                    alert('Lütfen mikrofon erişimine izin verin.');
                }
            };

            this.recognition.onend = () => {
                if (this.isListening) {
                    this.recognition.start(); // Restart if it ends unexpectedly
                }
            };
        } else {
            console.warn('Speech Recognition API not supported in this browser.');
        }
    }

    public startListening(onResult: (text: string) => void, onStart?: () => void) {
        if (!this.recognition) return;
        this.onSpeechResultCallback = onResult;
        this.onStartListeningCallback = onStart || null;
        this.isListening = true;
        try {
            this.recognition.start();
            if (this.onStartListeningCallback) this.onStartListeningCallback();
        } catch (e) {
            console.error('Recognition start error', e);
        }
    }

    public stopListening() {
        this.isListening = false;
        if (this.recognition) {
            this.recognition.stop();
        }
        this.clearSilenceTimeout();
    }

    private resetSilenceTimeout() {
        this.clearSilenceTimeout();
        // VAD Logic: If user is silent for 2 seconds, trigger AI (handled by the screen logic usually)
    }

    private clearSilenceTimeout() {
        if (this.silenceTimeout) {
            clearTimeout(this.silenceTimeout);
            this.silenceTimeout = null;
        }
    }

    public async speak(text: string, gender: string = 'neutral', mood: string = 'normal'): Promise<void> {
        // TTS (Ses Motorunun) emojileri harf harf okumasını engellemek için tüm emojileri siliyoruz
        const cleanText = text.replace(/[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/gu, '').trim();

        if (!cleanText) return;

        try {
            // 1. Önce Yerel Ultra-Kaliteli Servisi (Edge-TTS) Dene
            const response = await fetch(`${this.TTS_API_URL}?text=${encodeURIComponent(cleanText)}&gender=${gender.toLowerCase()}&mood=${mood}`);
            if (response.ok) {
                const audioBlob = await response.blob();
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);

                // Web Audio API ile ses analizi
                const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                const audioCtx = new AudioContext();
                const analyser = audioCtx.createAnalyser();
                const source = audioCtx.createMediaElementSource(audio);
                source.connect(analyser);
                analyser.connect(audioCtx.destination);
                analyser.fftSize = 256;
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);

                let animationId: number;

                const processAudio = () => {
                    if (audio.paused || audio.ended) return;
                    analyser.getByteFrequencyData(dataArray);
                    let sum = 0;
                    for (let i = 0; i < bufferLength; i++) {
                        sum += dataArray[i];
                    }
                    const avg = sum / bufferLength;
                    const volumeStr = Math.min(avg / 128, 1); // Normalize 0..1

                    if (this.onVolumeChange) {
                        this.onVolumeChange(volumeStr);
                    }
                    animationId = requestAnimationFrame(processAudio);
                };

                return new Promise((resolve) => {
                    audio.onplay = () => {
                        processAudio();
                    }
                    audio.onended = () => {
                        if (animationId) cancelAnimationFrame(animationId);
                        if (this.onVolumeChange) this.onVolumeChange(0);
                        resolve();
                    };
                    audio.onerror = () => {
                        if (animationId) cancelAnimationFrame(animationId);
                        if (this.onVolumeChange) this.onVolumeChange(0);
                        resolve();
                    };
                    audio.play();
                });
            }
        } catch (e) {
            console.warn("Yerel ses servisi aktif değil, tarayıcı sesine dönülüyor.");
        }

        // 2. Yedek: Web Speech API (Tarayıcı Sesi)
        return this.speakWithBrowser(cleanText, gender, mood);
    }

    private speakWithBrowser(text: string, gender: string, mood: string): Promise<void> {
        return new Promise((resolve) => {
            this.synth.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'tr-TR';

            // Duyguya göre hız ve perde ayarla (Tarayıcı Simülasyonu)
            let rate = 0.95;
            let pitch = 1.0;

            if (mood === 'uzgun') {
                rate = 0.8;
                pitch = 0.8;
            } else if (mood === 'heyecanli' || mood === 'mutlu') {
                rate = 1.1;
                pitch = 1.2;
            } else if (mood === 'ciddi') {
                rate = 0.9;
                pitch = 0.9;
            }

            utterance.rate = rate;
            utterance.pitch = pitch;

            // Voice selection logic
            const voices = this.synth.getVoices();
            const trVoices = voices.filter(v => v.lang.startsWith('tr'));

            if (trVoices.length > 0) {
                // Try to find a voice by gender
                let selectedVoice = trVoices[0];
                if (gender === 'female') {
                    selectedVoice = trVoices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('yelda')) || trVoices[0];
                } else if (gender === 'male') {
                    selectedVoice = trVoices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('tolga')) || trVoices[0];
                }
                utterance.voice = selectedVoice;
            }

            utterance.onend = () => resolve();
            utterance.onerror = () => resolve();

            this.synth.speak(utterance);
        });
    }

    public stopSpeaking() {
        this.synth.cancel();
    }
}

export const voiceService = new VoiceService();
