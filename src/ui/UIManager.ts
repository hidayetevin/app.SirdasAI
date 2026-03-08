import { OnboardingScreen } from './screens/OnboardingScreen';
import { ChatScreen } from './screens/ChatScreen';
import { ProfileSettingsScreen } from './screens/ProfileSettingsScreen';
import { CallScreen } from './screens/CallScreen';
import { dbService } from '../services/DatabaseService';
import { adMobService } from '../services/AdMobService';

export class UIManager {
    private container: HTMLElement;
    public onboardingScreen: OnboardingScreen;
    public chatScreen: ChatScreen;
    public profileScreen: ProfileSettingsScreen;
    public callScreen: CallScreen;

    constructor(containerId: string) {
        const el = document.getElementById(containerId);
        if (!el) throw new Error(`Container ${containerId} not found`);
        this.container = el;
        this.container.innerHTML = ''; // Clear default splash

        // Screen Initializations
        this.onboardingScreen = new OnboardingScreen((settings) => {
            // Onboarding tamamlandığında
            console.log('Onboarding Complete:', settings);
            this.chatScreen.updateAiName(settings.aiName);
            this.showScreen('chat');
        });

        this.chatScreen = new ChatScreen(
            (text) => {
                // Message sent logic will be wired to AIService here
                console.log('User says:', text);
                // Simulate thinking and response
                setTimeout(() => {
                    this.chatScreen.addMessage("Harika! Bu konuda biraz daha konuşalım mı?", "ai");
                }, 1500);
            },
            () => {
                // Profile clicked
                this.showScreen('profile');
            },
            () => {
                // Call clicked
                this.showScreen('call');
            }
        );

        this.profileScreen = new ProfileSettingsScreen(
            () => { this.showScreen('chat'); }, // Back to chat
            () => {
                console.log('Memory cleared from UI');
                alert('Bellek başarıyla temizlendi.');
            },
            async () => {
                // Watch Ad for +20 Messages
                const success = await adMobService.showRewardedAd();
                if (success) {
                    const settings = await dbService.getSettings('main_user');
                    if (settings) {
                        settings.dailyMessageCount += 20;
                        await dbService.saveSettings(settings);
                        alert('Tebrikler! +20 Mesaj hakkı eklendi.');
                    }
                }
            }
        );

        this.callScreen = new CallScreen(() => {
            this.showScreen('chat');
        });

        // Append all screens to container
        this.container.appendChild(this.onboardingScreen.element);
        this.container.appendChild(this.chatScreen.element);
        this.container.appendChild(this.profileScreen.element);
        this.container.appendChild(this.callScreen.element);

        // Varsayılan olarak Onboarding'i göster
        this.showScreen('onboarding');
    }

    public showScreen(screenId: 'onboarding' | 'chat' | 'profile' | 'call') {
        // Hide all
        this.onboardingScreen.element.classList.remove('active');
        this.chatScreen.element.classList.remove('active');
        this.profileScreen.element.classList.remove('active');
        this.callScreen.element.classList.remove('active');

        // Show target
        if (screenId === 'onboarding') this.onboardingScreen.element.classList.add('active');
        if (screenId === 'chat') this.chatScreen.element.classList.add('active');
        if (screenId === 'profile') this.profileScreen.element.classList.add('active');
        if (screenId === 'call') this.callScreen.element.classList.add('active');
    }
}
