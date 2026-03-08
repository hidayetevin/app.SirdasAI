// Sırdaş AI Entry Point
import './ui/styles/main.css';
import { UIManager } from './ui/UIManager';
import { dbService } from './services/DatabaseService';
import { memoryService } from './services/MemoryService';

async function initApp() {
  console.log("Sırdaş AI Booting up...");

  // 1. Veritabanı Başlat
  try {
    await dbService.init();
    console.log("Database initialized.");
  } catch (e) {
    console.error("Critical DB failure", e);
  }

  // 2. UI Yöneticisini Başlat
  const uiManager = new UIManager('app');

  // 3. UI Events -> Domain Logic Binding

  // Kullanıcı mesaj yolladığında
  (uiManager.chatScreen as any).onSendMessage = async (text: string) => {
    try {
      const settings = await dbService.getSettings('main_user');
      const aiName = settings?.aiName || 'Sırdaş';
      const response = await memoryService.handleUserMessage(text, aiName);
      uiManager.chatScreen.addMessage(response, 'ai');
    } catch (err) {
      console.error(err);
      uiManager.chatScreen.addMessage("Bağlantımda bir sorun var, hemen dönüyorum.", 'ai');
    }
  };

  // Onboarding bittiğinde kaydedelim
  (uiManager.onboardingScreen as any).onComplete = async (data: any) => {
    await dbService.saveSettings({
      id: 'main_user',
      isGoogleAuth: data.isGoogleAuth,
      language: data.language,
      aiName: data.aiName,
      aiGender: data.aiGender,
      dailyMessageCount: data.isGoogleAuth ? 50 : 30,
      lastOpened: Date.now()
    });

    await dbService.saveProfile({
      id: 'main_profile',
      moodScore: 50, stressScore: 20, goals: [], relationships: [], lastUpdated: Date.now()
    });

    uiManager.chatScreen.updateAiName(data.aiName);
    uiManager.showScreen('chat');
  };

  // Memory Temizleme
  (uiManager.profileScreen as any).onClearMemory = async () => {
    await dbService.clearAllMemories();
    console.log("Silindi");
  };

  // İlk açılışta ayarlara bak
  const userSettings = await dbService.getSettings('main_user');
  if (userSettings) {
    uiManager.chatScreen.updateAiName(userSettings.aiName);

    // Geçmiş mesajları yükle
    const oldMsgs = await dbService.getRecentMessages(10);
    oldMsgs.forEach(m => uiManager.chatScreen.addMessage(m.text, m.role));

    uiManager.showScreen('chat');
  } else {
    uiManager.showScreen('onboarding');
  }
}

document.addEventListener('DOMContentLoaded', initApp);
