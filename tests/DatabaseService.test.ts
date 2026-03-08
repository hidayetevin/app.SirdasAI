import { describe, it, expect, beforeEach, vi } from 'vitest';
import { dbService } from '../src/services/DatabaseService';
import "fake-indexeddb/auto"; // Memory DB for testing JSDom

describe('Database Service Tests', () => {

    beforeEach(async () => {
        // DB tabanında yeniden başlat
        await dbService.init();
        await dbService.clearAllMemories();
    });

    it('Veritabanı bağlantısı başarıyla sağlanmalı', async () => {
        expect(dbService['db']).toBeDefined();
    });

    it('Ayarları kaydetmeli ve geri okuyabilmeli', async () => {
        const mockSettings = {
            id: 'test_user',
            isGoogleAuth: true,
            language: 'tr',
            aiName: 'TestBot',
            aiGender: 'neutral',
            dailyMessageCount: 50,
            lastOpened: Date.now()
        };

        await dbService.saveSettings(mockSettings);
        const retrieved = await dbService.getSettings('test_user');

        expect(retrieved).not.toBeNull();
        expect(retrieved?.aiName).toBe('TestBot');
    });

    it('Mesaj ekleyip son sınır değerinde limitli getirebilmeli', async () => {
        // 3 adet fake mesaj atıyoruz
        await dbService.addMessage({ id: '1', role: 'user', text: 'M1', timestamp: 100 });
        await dbService.addMessage({ id: '2', role: 'ai', text: 'M2', timestamp: 200 });
        const msgs = await dbService.getRecentMessages(1);

        // Yalnızca en son olanı bekliyoruz
        expect(msgs.length).toBe(1);
        expect(msgs[0].text).toBe('M2');
    });

});
