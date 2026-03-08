import { describe, it, expect, vi, beforeEach } from 'vitest';
import { aiService } from '../src/services/AIService';

// Fetch API mock işlemi
global.fetch = vi.fn();

describe('AI Service Error Handling Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Gemini hata verdiğinde Groq Fallback çalışmalıdır', async () => {
        // İlk çağrı (Gemini) - 500 hatası döndür
        (global.fetch as any).mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                status: 500,
                json: () => Promise.resolve({ error: { message: "Internal Error" } }),
            })
        );

        // İkinci çağrı (Groq) - Başarılı 200 döndür
        (global.fetch as any).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    choices: [{ message: { content: "Groq Başarılı Cevap" } }]
                }),
            })
        );

        const result = await aiService.generateResponse('Selam', [], [], null, 'Sırdaş');

        // Geri dönen sonucun Groq üzerinden başarılı geldiğini doğrula
        expect(result).toBe("Groq Başarılı Cevap");
        // Fetch twice called? 1. Gemini, 2. Groq
        expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('Hem Gemini hem de Groq çöktüğünde güvenli yanıt (Safe Fallback) dönmelidir', async () => {
        // İlk çağrı (Gemini) -> Çökme
        (global.fetch as any).mockImplementationOnce(() => Promise.reject(new Error("Network Error")));
        // İkinci çağrı (Groq) -> Çökme
        (global.fetch as any).mockImplementationOnce(() => Promise.reject(new Error("Network Error 2")));

        const result = await aiService.generateResponse('Test', [], [], null, 'Sırdaş');

        expect(result).toContain("dalgınım"); // Safe text içeriyor olmalı
        expect(fetch).toHaveBeenCalledTimes(2);
    });
});
