import localforage from 'localforage';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

const DEVICE_ID_KEY = 'device_id';
const ENCRYPTION_KEY = 'your-secure-encryption-key';

export class LocalStorageService {
  private static instance: LocalStorageService;
  private deviceId: string;

  private constructor() {
    this.deviceId = this.getOrCreateDeviceId();
    this.initializeStorage();
  }

  public static getInstance(): LocalStorageService {
    if (!LocalStorageService.instance) {
      LocalStorageService.instance = new LocalStorageService();
    }
    return LocalStorageService.instance;
  }

  private initializeStorage() {
    localforage.config({
      name: 'financeApp',
      storeName: 'finance_store',
      version: 1.0,
      description: 'Local storage for finance application'
    });
  }

  private getOrCreateDeviceId(): string {
    let deviceId = localStorage.getItem(DEVICE_ID_KEY);
    if (!deviceId) {
      deviceId = uuidv4();
      localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    return deviceId;
  }

  public async saveData(key: string, data: any): Promise<void> {
    try {
      const encryptedData = this.encryptData(JSON.stringify(data));
      await localforage.setItem(key, encryptedData);
    } catch (error) {
      console.error('Error saving data:', error);
      throw error;
    }
  }

  public async getData(key: string): Promise<any> {
    try {
      const encryptedData = await localforage.getItem(key);
      if (!encryptedData) return null;
      const decryptedData = this.decryptData(encryptedData as string);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Error retrieving data:', error);
      throw error;
    }
  }

  private encryptData(data: string): string {
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
  }

  private decryptData(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  public getDeviceId(): string {
    return this.deviceId;
  }

  public async clearStorage(): Promise<void> {
    try {
      await localforage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }
}