export interface UserSettings {
    id: string;
    isGoogleAuth: boolean;
    language: string;
    aiName: string;
    aiGender: string;
    avatarModel?: string;
    dailyMessageCount: number;
    lastOpened: number; // timestamp
}

export type Role = 'user' | 'ai' | 'system';

export interface ChatMessage {
    id: string;
    role: Role;
    text: string;
    timestamp: number;
}

export interface MemoryItem {
    id: string;
    text: string;
    importance: number; // 1-5
    createdAt: number;
}

export interface UserProfile {
    id: string; // genelde tek profil
    moodScore: number; // 0-100 vb. veya enum
    stressScore: number;
    goals: string[];
    relationships: string[];
    lastUpdated: number;
}

export interface MoodLog {
    id: string;
    mood: 'happy' | 'neutral' | 'sad' | 'stressed';
    note: string;
    date: number; // timestamp
}
