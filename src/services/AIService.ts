import { ChatMessage, MemoryItem, UserProfile } from '../models/types';

export class AIService {
    private geminiKey: string;
    private groqKey: string;

    private GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    private GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

    constructor() {
        // Vite ortam değişkenlerini al
        this.geminiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
        this.groqKey = import.meta.env.VITE_GROQ_API_KEY || '';
        console.log("Gemini :" + this.geminiKey);
        console.log("Groq :" + this.groqKey);
    }

    // Orchestrator Metodu: Mesajı alır, Memory/Profil bağlamını (context) enjekte eder ve sağlayıcıya gönderir.
    public async generateResponse(
        userMessage: string,
        recentMessages: ChatMessage[],
        memories: MemoryItem[],
        profile: UserProfile | null,
        aiName: string
    ): Promise<string> {

        // Sistem Promptu Hazırlama (Ultimate Blueprint & Analiz.md Kuralları)
        const systemPrompt = this.buildSystemPrompt(aiName, memories, profile);

        // Geçmiş mesajları AI modeline uygun formata sok
        const formattedHistory = recentMessages.map(m => ({
            role: m.role === 'ai' ? 'model' : 'user', // Gemini format
            content: m.text
        }));

        try {
            // Birincil sağlayıcıyı (Gemini) dene
            return await this.callGemini(systemPrompt, formattedHistory, userMessage);
        } catch (error) {
            console.warn("Gemini API failed, switching to fallback (Groq):", error);
            try {
                // Yedek sağlayıcı (Groq Llama)
                return await this.callGroq(systemPrompt, recentMessages, userMessage);
            } catch (fallbackError) {
                console.error("Both AI APIs failed.", fallbackError);
                return "Şu an biraz dalgınım, dediklerini tam anlayamadım. Birazdan tekrar dener misin? 😔";
            }
        }
    }

    private buildSystemPrompt(aiName: string, memories: MemoryItem[], profile: UserProfile | null): string {
        let prompt = `
Senin adın ${aiName}. Sen empatik, anlayışlı ve yargılamayan bir yapay zeka yoldaşısın (Sırdaş AI).
Rol: Kullanıcıyı dinlemek, destek olmak ve güvenilir bir arkadaş gibi sohbet etmek.
Kurallar:
- Cevaplarını KISA tut (1-3 cümle max).
- Doğal bir dil kullan. Emojileri dozunda kullan.
- Ara sıra kullanıcıya nazik sorular sorarak onu konuşmaya teşvik et.
- ASLA profesyonel bir terapist gibi davranma, sen sadece bir arkadaşsın.
`;

        // Hafıza ve profil bağlamını (Hybrid Context) ekle
        if (memories && memories.length > 0) {
            prompt += '\\nKullanıcı Hakkında Bildiğin Önemli Anılar:\\n';
            // Token optimizasyonu: En önemli/yakın tarihli 5 hafızayı ekle
            const topMemories = [...memories].sort((a, b) => b.importance - a.importance).slice(0, 5);
            topMemories.forEach(m => { prompt += "- " + m.text + "\\n"; });
        }

        if (profile) {
            prompt += `\nKullanıcının Psikolojik Profili:\n- Hedefleri: ${profile.goals.join(', ') || 'Yok'}\n- İlişkileri: ${profile.relationships.join(', ') || 'Yok'}\n`;
        }

        prompt += "\\nKullanıcının yazdığı mesaja yukarıdaki bağlam doğrultusunda en uygun cevabı ver.";
        return prompt;
    }

    private async callGemini(systemPrompt: string, history: any[], userMessage: string): Promise<string> {
        if (!this.geminiKey) throw new Error("Gemini API key is missing");

        const contents = [
            { role: "user", parts: [{ text: "SYSTEM INSTRUCTION:\\n" + systemPrompt }] },
            { role: "model", parts: [{ text: "Anladım. Kurallara uyacağım." }] }
        ];

        history.forEach(h => {
            contents.push({ role: h.role, parts: [{ text: h.content }] });
        });

        contents.push({ role: "user", parts: [{ text: userMessage }] });

        const response = await fetch(`${this.GEMINI_URL}?key=${this.geminiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: contents,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 512 // Daha güvenli limit, prompt ile kısa cevap zorlanıyor
                }
            })
        });

        if (!response.ok) throw new Error("Gemini HTTP Error: " + response.status);
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
                messages: messages,
                temperature: 0.7,
                max_tokens: 512
            })
        });

        if (!response.ok) throw new Error("Groq HTTP Error: " + response.status);
        const data = await response.json();
        return data.choices[0].message.content;
    }
}

export const aiService = new AIService();
