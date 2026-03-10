import { ChatMessage, MemoryItem, UserProfile } from '../models/types';

export class AIService {
    private geminiKey: string;
    private groqKey: string;

    private GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
    private GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

    constructor() {
        // Vite ortam değişkenlerini al
        this.geminiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
        this.groqKey = import.meta.env.VITE_GROQ_API_KEY || '';
    }

    // Orchestrator Metodu: Mesajı alır, Memory/Profil bağlamını (context) enjekte eder ve sağlayıcıya gönderir.
    public async generateResponse(
        userMessage: string,
        recentMessages: ChatMessage[],
        memories: MemoryItem[],
        profile: UserProfile | null,
        aiName: string
    ): Promise<{ text: string, mood: string }> {

        // Sistem Promptu Hazırlama (Ultimate Blueprint & Analiz.md Kuralları)
        const systemPrompt = this.buildSystemPrompt(aiName, memories, profile);

        // Geçmiş mesajları AI modeline uygun formata sok
        const formattedHistory = recentMessages.map(m => ({
            role: m.role === 'ai' ? 'model' : 'user', // Gemini format
            content: m.text
        }));

        try {
            // Birincil sağlayıcıyı (Gemini) dene
            const rawResponse = await this.callGemini(systemPrompt, formattedHistory, userMessage);
            return this.parseAIResponse(rawResponse);
        } catch (error) {
            console.warn("Gemini API failed, switching to fallback (Groq):", error);
            try {
                // Yedek sağlayıcı (Groq Llama)
                const rawResponse = await this.callGroq(systemPrompt, recentMessages, userMessage);
                return this.parseAIResponse(rawResponse);
            } catch (fallbackError) {
                return { text: "Şu an bağlantım biraz zayıf, seni duyamıyorum...", mood: "uzgun" };
            }
        }
    }

    private parseAIResponse(raw: string): { text: string, mood: string } {
        try {
            // 1. JSON bloğunu ayıkla (En dıştaki { ... } yapısını bulur, non-greedy)
            const jsonMatch = raw.match(/\{[\s\S]*?\}/);
            if (jsonMatch) {
                try {
                    const jsonStr = jsonMatch[0];
                    const parsed = JSON.parse(jsonStr);
                    if (parsed.text) {
                        return {
                            text: this.cleanFinalText(parsed.text),
                            mood: parsed.mood || "normal"
                        };
                    }
                } catch (e) {
                    // JSON parse başarısızsa Regex ile anahtarları yakalamayı dene
                    const textMatch = raw.match(/"text"\s*:\s*"([^"]*)"/);
                    const moodMatch = raw.match(/"mood"\s*:\s*"([^"]*)"/);
                    if (textMatch) {
                        return {
                            text: this.cleanFinalText(textMatch[1]),
                            mood: moodMatch ? moodMatch[1] : "normal"
                        };
                    }
                }
            }

            // 2. Eğer JSON bulunamazsa veya bozuksa, metni temizle ve oku
            return { text: this.cleanFinalText(raw), mood: "normal" };
        } catch (e) {
            return { text: "Bir sorun oluştu ama buradayım.", mood: "normal" };
        }
    }

    private cleanFinalText(raw: string): string {
        return raw
            .replace(/```json/gi, '')
            .replace(/```/gi, '')
            .replace(/\{[\s\S]*?\}/g, '') // JSON bloklarını tamamen temizle (non-greedy)
            .replace(/"text"\s*:\s*/gi, '')
            .replace(/"mood"\s*:\s*\w+/gi, '')
            .replace(/[{}"]/g, '') // Kalan parantez ve tırnakları temizle
            .replace(/\s+/g, ' ')  // Fazla boşlukları tek boşluğa indir
            .trim();
    }

    private buildSystemPrompt(aiName: string, memories: MemoryItem[], profile: UserProfile | null): string {
        return `Senin adın ${aiName}. Empatik bir Sırdaş AI'sın.
        
        KRİTİK KURAL: Cevaplarını her zaman aşağıdaki JSON formatında ver. Kesinlikle sadece bu formatı kullan, başka hiçbir metin ekleme:
        {
          "text": "Vereceğin cevap metni buraya",
          "mood": "mutlu" | "uzgun" | "heyecanli" | "normal" | "ciddi"
        }

        Sohbet tarzın:
        - Doğal, samimi ve kısa olsun.
        - Kullanıcının duygularına (mood) uygun tepki ver.
        - Bir yazar gibi değil, o an seninle konuşan bir arkadaş gibi cevap ver.

        Kullanıcı Hakkında Bildiğin Önemli Bilgiler:
        ${memories.length > 0 ? memories.map(m => "- " + m.text).join('\n') : "Henüz bir anı yok."}
        
        Kullanıcı Profili:
        ${profile ? `Stres: ${profile.stressScore}, Hedefler: ${profile.goals.join(', ')}` : "Profil henüz oluşturulmadı."}`;
    }

    private async callGemini(systemPrompt: string, history: any[], userMessage: string): Promise<string> {
        if (!this.geminiKey) throw new Error("Gemini API key is missing");

        // 1. En kararlı yapı: Sistem talimatını ilk mesaj çifti olarak enjekte et.
        // Bu yöntem hem v1 hem v1beta'da sorunsuz çalışır ve 'system_instruction' saha hatasını engeller.
        const contents: any[] = [
            { role: "user", parts: [{ text: `SİSTEM TALİMATI: ${systemPrompt}` }] },
            { role: "model", parts: [{ text: "Anladım. Bundan sonra sadece belirtilen JSON formatında ve duygu analiziyle cevap vereceğim." }] }
        ];

        let nextExpectedRole = "user";
        history.forEach(h => {
            // Role alternasyonunu koru ve mükerrerleri engelle
            if (h.role === nextExpectedRole) {
                if (h.content && h.content.trim() !== "") {
                    contents.push({ role: h.role, parts: [{ text: h.content }] });
                    nextExpectedRole = nextExpectedRole === "user" ? "model" : "user";
                }
            }
        });

        // Sonuç mutlaka kullanıcı mesajı ile bitmeli
        if (nextExpectedRole === "user") {
            contents.push({ role: "user", parts: [{ text: userMessage }] });
        }

        const response = await fetch(`${this.GEMINI_URL}?key=${this.geminiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: contents,
                generationConfig: { temperature: 0.8, maxOutputTokens: 512 }
            })
        });

        if (!response.ok) throw new Error("Gemini Error: " + response.status);
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    private async callGroq(systemPrompt: string, history: ChatMessage[], userMessage: string): Promise<string> {
        if (!this.groqKey) throw new Error("Groq API key is missing");

        const messages = [
            { role: "system", content: systemPrompt }
        ];

        history.forEach(h => {
            messages.push({ role: h.role === 'ai' ? 'assistant' : 'user', content: h.text });
        });

        messages.push({ role: "user", content: userMessage });

        const response = await fetch(this.GROQ_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.groqKey}`
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant", // Hızlı ve düşük maliyetli Groq modeli
                messages: messages
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    }
}

export const aiService = new AIService();
