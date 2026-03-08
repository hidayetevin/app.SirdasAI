import { UserSettings, ChatMessage, MemoryItem, UserProfile } from '../models/types';

export class DatabaseService {
    private dbName = 'SirdasAIDB';
    private dbVersion = 1;
    private db: IDBDatabase | null = null;

    public async init(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = (event) => {
                console.error("IndexedDB error:", event);
                reject('Error opening DB');
            };

            request.onsuccess = (event) => {
                this.db = (event.target as IDBOpenDBRequest).result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                // Create Object Stores (Tables)
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('messages')) {
                    const store = db.createObjectStore('messages', { keyPath: 'id' });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                }
                if (!db.objectStoreNames.contains('memories')) {
                    const store = db.createObjectStore('memories', { keyPath: 'id' });
                    store.createIndex('createdAt', 'createdAt', { unique: false });
                }
                if (!db.objectStoreNames.contains('profile')) {
                    db.createObjectStore('profile', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('moodLogs')) {
                    db.createObjectStore('moodLogs', { keyPath: 'id' });
                }
            };
        });
    }

    // --- Generic CRUD Methods ---
    private async getStore(storeName: string, mode: IDBTransactionMode): Promise<IDBObjectStore> {
        if (!this.db) throw new Error("DB not initialized");
        const tx = this.db.transaction(storeName, mode);
        return tx.objectStore(storeName);
    }

    // 1. Settings
    public async saveSettings(settings: UserSettings): Promise<void> {
        const store = await this.getStore('settings', 'readwrite');
        return new Promise((resolve, reject) => {
            const request = store.put(settings);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    public async getSettings(id: string = 'user_setting'): Promise<UserSettings | null> {
        const store = await this.getStore('settings', 'readonly');
        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    }

    // 2. Messages
    public async addMessage(msg: ChatMessage): Promise<void> {
        const store = await this.getStore('messages', 'readwrite');
        return new Promise((resolve, reject) => {
            const request = store.add(msg);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    public async getRecentMessages(limit: number = 15): Promise<ChatMessage[]> {
        const store = await this.getStore('messages', 'readonly');
        const index = store.index('timestamp');
        return new Promise((resolve, reject) => {
            // To get latest messages, we open a cursor. 
            // A simpler way for a small number is getting all and slicing, but cursor is better.
            const request = index.getAll();
            request.onsuccess = () => {
                const msgs = request.result as ChatMessage[];
                // Sort ascending by timestamp, return last 'limit'
                msgs.sort((a, b) => a.timestamp - b.timestamp);
                resolve(msgs.slice(-limit));
            };
            request.onerror = () => reject(request.error);
        });
    }

    // 3. Memories
    public async addMemory(memory: MemoryItem): Promise<void> {
        const store = await this.getStore('memories', 'readwrite');
        return new Promise((resolve, reject) => {
            const request = store.put(memory);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    public async getAllMemories(): Promise<MemoryItem[]> {
        const store = await this.getStore('memories', 'readonly');
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    public async clearAllMemories(): Promise<void> {
        if (!this.db) return;
        return new Promise((resolve, reject) => {
            const tx = this.db!.transaction(['memories', 'profile', 'messages'], 'readwrite');
            tx.objectStore('memories').clear();
            // tx.objectStore('messages').clear(); // Gerekirse mesajları da sileriz
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    // 4. Profile
    public async saveProfile(profile: UserProfile): Promise<void> {
        const store = await this.getStore('profile', 'readwrite');
        return new Promise((resolve, reject) => {
            const request = store.put(profile);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    public async getProfile(id: string = 'user_profile'): Promise<UserProfile | null> {
        const store = await this.getStore('profile', 'readonly');
        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    }
}

// Singleton export
export const dbService = new DatabaseService();
