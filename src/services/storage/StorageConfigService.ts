import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';
import { LocalStorageService } from './LocalStorageService';

interface StorageConfig {
  dataPath: string;
  deviceId: string;
  lastSync: string;
  version: string;
  encryptionKey: string;
}

export class StorageConfigService {
  private static instance: StorageConfigService;
  private config: StorageConfig | null = null;
  private localStorage: LocalStorageService;
  private readonly CONFIG_KEY = 'storage_config';
  private readonly VERSION = '1.0.0';

  private constructor() {
    this.localStorage = LocalStorageService.getInstance();
  }

  public static getInstance(): StorageConfigService {
    if (!StorageConfigService.instance) {
      StorageConfigService.instance = new StorageConfigService();
    }
    return StorageConfigService.instance;
  }

  public async initialize(): Promise<void> {
    try {
      const existingConfig = await this.localStorage.getData(this.CONFIG_KEY);
      
      if (existingConfig) {
        this.config = existingConfig;
      } else {
        this.config = {
          dataPath: this.getDefaultDataPath(),
          deviceId: uuidv4(),
          lastSync: new Date().toISOString(),
          version: this.VERSION,
          encryptionKey: CryptoJS.lib.WordArray.random(32).toString()
        };
        
        await this.saveConfig();
      }
    } catch (error) {
      console.error('Error initializing storage config:', error);
      throw error;
    }
  }

  private getDefaultDataPath(): string {
    if (typeof window !== 'undefined') {
      return '/app_data';
    }
    return process.env.APPDATA || process.env.HOME || '/';
  }

  public async setDataPath(path: string): Promise<void> {
    if (!this.config) {
      throw new Error('Storage config not initialized');
    }

    try {
      await this.validateDataPath(path);
      this.config.dataPath = path;
      await this.saveConfig();
    } catch (error) {
      console.error('Error setting data path:', error);
      throw error;
    }
  }

  private async validateDataPath(path: string): Promise<void> {
    // Implement path validation logic
    if (!path) {
      throw new Error('Invalid data path');
    }

    try {
      // Check if path exists and is writable
      // This is a placeholder - implement actual checks based on platform
      return Promise.resolve();
    } catch (error) {
      throw new Error('Data path is not accessible or writable');
    }
  }

  private async saveConfig(): Promise<void> {
    if (!this.config) {
      throw new Error('Storage config not initialized');
    }

    try {
      await this.localStorage.saveData(this.CONFIG_KEY, this.config);
    } catch (error) {
      console.error('Error saving storage config:', error);
      throw error;
    }
  }

  public getConfig(): StorageConfig {
    if (!this.config) {
      throw new Error('Storage config not initialized');
    }
    return { ...this.config };
  }

  public async updateLastSync(): Promise<void> {
    if (!this.config) {
      throw new Error('Storage config not initialized');
    }

    this.config.lastSync = new Date().toISOString();
    await this.saveConfig();
  }

  public async cleanup(): Promise<void> {
    try {
      // Implement cleanup logic for old data paths
      await this.localStorage.clearStorage();
      this.config = null;
    } catch (error) {
      console.error('Error cleaning up storage:', error);
      throw error;
    }
  }
}