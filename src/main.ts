// Sırdaş AI Entry Point
import './ui/styles/main.css';
import { UIManager } from './ui/UIManager';
import { dbService } from './services/DatabaseService';
import { memoryService } from './services/MemoryService';
import { voiceService } from './services/VoiceService';

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

  // Kullanıcı mesaj yolladığında (Chat)
  (uiManager.chatScreen as any).onSendMessage = async (text: string) => {
    try {
      const settings = await dbService.getSettings('main_user');
      const aiName = settings?.aiName || 'Sırdaş';
      const aiResponse = await memoryService.handleUserMessage(text, aiName);
      uiManager.chatScreen.addMessage(aiResponse.text, 'ai');
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
      avatarModel: data.avatarModel,
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
    console.log("Bellek silindi");
  };

  // --- Call Mode Mantığı ---
  (uiManager.callScreen as any).onHangUp = () => {
    voiceService.stopListening();
    voiceService.stopSpeaking();
    uiManager.showScreen('chat');
  };

  // Ekran geçişlerini dinleyerek Call Mode'u tetikle
  const originalShowScreen = uiManager.showScreen.bind(uiManager);
  uiManager.showScreen = (screenId: any) => {
    originalShowScreen(screenId);

    if (screenId === 'call') {
      startVoiceSession();
    } else {
      voiceService.stopListening();
      voiceService.stopSpeaking();
    }
  };

  async function startVoiceSession() {
    const settings = await dbService.getSettings('main_user');
    const aiName = settings?.aiName || 'Sırdaş';
    const aiGender = settings?.aiGender || 'neutral';
    const avatarModel = settings?.avatarModel || 'w-1'; // Model ismi (w-1, w-2 vs.)

    uiManager.callScreen.startCall(aiName, avatarModel);
    uiManager.callScreen.setStatus('Dinliyor...');

    // Ses şiddeti grafiğini (Lip Sync) Avatar'a bağla
    voiceService.onVolumeChange = (volume: number) => {
      uiManager.callScreen.updateAvatarMouth(volume);
    };

    // Recursive listening function
    const listenLoop = async () => {
      voiceService.startListening(async (text) => {
        if (!text.trim()) return;

        voiceService.stopListening();
        uiManager.callScreen.setStatus('Cevap Veriyor...');

        try {
          const aiResponse = await memoryService.handleUserMessage(text, aiName);

          // AI'nın yüz ifadesini gelen cevabın duygu durumuna göre değiştir
          uiManager.callScreen.setAvatarEmotion(aiResponse.mood);

          // AI'nın cevabını sesli oku (Duygu ile birlikte)
          await voiceService.speak(aiResponse.text, aiGender, aiResponse.mood);

          // Okuma bittikten sonra tekrar dinlemeye başlarken yüzünü normale döndür
          uiManager.callScreen.setAvatarEmotion('normal');
          uiManager.callScreen.setStatus('Dinliyor...');
          listenLoop();
        } catch (err) {
          console.error(err);
          uiManager.callScreen.setStatus('Hata oluştu.');
        }
      });
    };

    listenLoop();
  }

  // İlk açılışta ayarlara bak
  const userSettings = await dbService.getSettings('main_user');
  if (userSettings) {
    uiManager.chatScreen.updateAiName(userSettings.aiName);

    const oldMsgs = await dbService.getRecentMessages(10);
    oldMsgs.forEach(m => {
      if (m.role === 'user' || m.role === 'ai') {
        uiManager.chatScreen.addMessage(m.text, m.role);
      }
    });

    uiManager.showScreen('chat');
  } else {
    uiManager.showScreen('onboarding');
  }
}

document.addEventListener('DOMContentLoaded', initApp);
