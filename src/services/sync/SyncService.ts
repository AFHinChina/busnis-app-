import { db } from '../../config/firebase';
import { collection, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { LocalStorageService } from '../storage/LocalStorageService';
import { NotificationManager } from '../notifications/NotificationManager';

export class SyncService {
  private static instance: SyncService;
  private localStorage: LocalStorageService;
  private notificationManager: NotificationManager;
  private unsubscribe: (() => void) | null = null;

  private constructor() {
    this.localStorage = LocalStorageService.getInstance();
    this.notificationManager = NotificationManager.getInstance();
  }

  public static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  public async startSync(): Promise<void> {
    const deviceId = this.localStorage.getDeviceId();
    
    // Start listening for changes
    this.unsubscribe = onSnapshot(
      doc(db, 'devices', deviceId),
      async (snapshot) => {
        if (snapshot.exists()) {
          const remoteData = snapshot.data();
          await this.handleIncomingSync(remoteData);
        }
      },
      (error) => {
        console.error('Sync error:', error);
        this.notificationManager.addNotification({
          type: 'sync_failed',
          data: { error: error.message }
        });
      }
    );
  }

  public async syncData(data: any): Promise<void> {
    try {
      const deviceId = this.localStorage.getDeviceId();
      const syncDoc = doc(collection(db, 'devices'), deviceId);

      const syncData = {
        deviceId,
        timestamp: new Date().toISOString(),
        data: data,
        lastSync: new Date()
      };

      await setDoc(syncDoc, syncData, { merge: true });

      this.notificationManager.addNotification({
        type: 'sync_complete',
        data: { timestamp: new Date() }
      });
    } catch (error) {
      console.error('Error syncing data:', error);
      throw error;
    }
  }

  private async handleIncomingSync(remoteData: any): Promise<void> {
    try {
      const localData = await this.localStorage.getData('userData');
      
      if (this.shouldUpdate(localData, remoteData)) {
        await this.localStorage.saveData('userData', remoteData.data);
        
        this.notificationManager.addNotification({
          type: 'sync_complete',
          data: { message: 'Data synchronized from another device' }
        });
      }
    } catch (error) {
      console.error('Error handling incoming sync:', error);
      throw error;
    }
  }

  private shouldUpdate(localData: any, remoteData: any): boolean {
    if (!localData) return true;
    if (!remoteData.timestamp) return false;
    
    const localTimestamp = new Date(localData.timestamp).getTime();
    const remoteTimestamp = new Date(remoteData.timestamp).getTime();
    
    return remoteTimestamp > localTimestamp;
  }

  public stopSync(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  public async requestSync(targetDeviceId: string): Promise<void> {
    try {
      const targetDoc = doc(db, 'devices', targetDeviceId);
      const targetSnapshot = await getDoc(targetDoc);

      if (targetSnapshot.exists()) {
        const sourceData = await this.localStorage.getData('userData');
        await this.syncData(sourceData);
      } else {
        throw new Error('Target device not found');
      }
    } catch (error) {
      console.error('Error requesting sync:', error);
      throw error;
    }
  }
}