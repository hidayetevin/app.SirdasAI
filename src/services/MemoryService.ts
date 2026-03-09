import { dbService } from './DatabaseService';
import { aiService } from './AIService';
import { ChatMessage, MemoryItem } from '../models/types';
// Removed uuid import, using native crypto

export class MemoryService {

    // Analiz Edici Metod: Gelen mesaj hafıza gerektiriyor mu?
    public async analyzeAndStoreMemory(userText: string) {
        // Basic Rule-based analyzer (İleride ufak model veya prompt ile çalıştırılabilir)
        const keywords = ['sınav', 'iş görüşmesi', 'tartıştım', 'ayrıldım', 'korkuyorum', 'hedefim', 'taşın', 'hasta'];
        const isImportant = keywords.some(k => userText.toLowerCase().includes(k));

        if (isImportant) {
            const memory: MemoryItem = {
                id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
                text: `Kullanıcı bahsetti: ${userText}`,
                importance: 4, // 1-5 aralığı
                createdAt: Date.now()
            };
            await dbService.addMemory(memory);

            // Update Profil
            let profile = await dbService.getProfile();
            if (!profile) {
                profile = { id: 'user_profile', moodScore: 50, stressScore: 50, goals: [], relationships: [], lastUpdated: Date.now() };
            }

            if (userText.includes('korku') || userText.includes('sınav')) {
                profile.stressScore = Math.min(100, profile.stressScore + 5);
            }

            await dbService.saveProfile(profile);
            console.log("Memory & Profil Güncellendi:", memory.text);
        }
    }

    // Uçtan uca mesaj işleyici
    public async handleUserMessage(text: string, aiName: string): Promise<{ text: string; mood: string; }> {

        // 1. Gelen mesajı kaydet
        const userMsg: ChatMessage = {
            id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
            role: 'user', text, timestamp: Date.now()
        };
        await dbService.addMessage(userMsg);

        // 2. Memory Analyzer tetikle
        await this.analyzeAndStoreMemory(text);

        // 3. Bağlamı (Context) topla
        const recentMsgs = await dbService.getRecentMessages(10);
        const memories = await dbService.getAllMemories();
        const profile = await dbService.getProfile();

        // 4. AIService'e gönder
        const aiResponse = await aiService.generateResponse(text, recentMsgs, memories, profile, aiName);

        // 5. Cevabı kaydet (Sadece metni kaydediyoruz)
        const aiMsg: ChatMessage = {
            id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
            role: 'ai', text: aiResponse.text, timestamp: Date.now()
        };
        await dbService.addMessage(aiMsg);

        // Hem metni hem duyguyu dönüyoruz ki UI ve Voice kullansın
        return aiResponse as any;
    }
}

export const memoryService = new MemoryService();
