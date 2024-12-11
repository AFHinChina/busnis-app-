import { LocalStorageService } from '../storage/LocalStorageService';
import { StorageConfigService } from '../storage/StorageConfigService';
import CryptoJS from 'crypto-js';

interface MigrationProgress {
  total: number;
  current: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  error?: string;
}

export class DataMigrationService {
  private static instance: DataMigrationService;
  private localStorage: LocalStorageService;
  private storageConfig: StorageConfigService;
  private progress: MigrationProgress = {
    total: 0,
    current: 0,
    status: 'pending'
  };

  private constructor() {
    this.localStorage = LocalStorageService.getInstance();
    this.storageConfig = StorageConfigService.getInstance();
  }

  public static getInstance(): DataMigrationService {
    if (!DataMigrationService.instance) {
      DataMigrationService.instance = new DataMigrationService();
    }
    return DataMigrationService.instance;
  }

  public async exportData(): Promise<Blob> {
    try {
      this.updateProgress('in_progress', 0);
      
      const data = await this.localStorage.getData('userData');
      const config = this.storageConfig.getConfig();
      
      const exportPackage = {
        data,
        metadata: {
          version: config.version,
          exportDate: new Date().toISOString(),
          deviceId: config.deviceId
        }
      };

      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(exportPackage),
        config.encryptionKey
      ).toString();

      this.updateProgress('completed', 100);
      
      return new Blob([encrypted], { type: 'application/octet-stream' });
    } catch (error) {
      this.updateProgress('failed', 0, error.message);
      throw error;
    }
  }

  public async importData(file: File): Promise<void> {
    try {
      this.updateProgress('in_progress', 0);
      
      const fileContent = await this.readFile(file);
      const config = this.storageConfig.getConfig();
      
      const decrypted = CryptoJS.AES.decrypt(
        fileContent,
        config.encryptionKey
      ).toString(CryptoJS.enc.Utf8);
      
      const importPackage = JSON.parse(decrypted);
      
      // Validate import package
      await this.validateImport(importPackage);
      
      // Backup existing data
      await this.backupExistingData();
      
      // Import new data
      await this.localStorage.saveData('userData', importPackage.data);
      
      this.updateProgress('completed', 100);
    } catch (error) {
      this.updateProgress('failed', 0, error.message);
      throw error;
    }
  }

  private async readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }

  private async validateImport(importPackage: any): Promise<void> {
    if (!importPackage.metadata || !importPackage.data) {
      throw new Error('Invalid import package format');
    }

    const config = this.storageConfig.getConfig();
    if (importPackage.metadata.version !== config.version) {
      throw new Error('Incompatible data version');
    }
  }

  private async backupExistingData(): Promise<void> {
    try {
      const existingData = await this.localStorage.getData('userData');
      if (existingData) {
        await this.localStorage.saveData(
          `backup_${new Date().toISOString()}`,
          existingData
        );
      }
    } catch (error) {
      console.error('Error backing up data:', error);
      throw error;
    }
  }

  private updateProgress(
    status: MigrationProgress['status'],
    current: number,
    error?: string
  ): void {
    this.progress = {
      ...this.progress,
      status,
      current,
      error
    };
  }

  public getProgress(): MigrationProgress {
    return { ...this.progress };
  }
}