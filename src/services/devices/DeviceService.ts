import { db } from '../../config/firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { LocalStorageService } from '../storage/LocalStorageService';
import { SyncService } from '../sync/SyncService';

export class DeviceService {
  private static instance: DeviceService;
  private localStorage: LocalStorageService;
  private syncService: SyncService;

  private constructor() {
    this.localStorage = LocalStorageService.getInstance();
    this.syncService = SyncService.getInstance();
  }

  public static getInstance(): DeviceService {
    if (!DeviceService.instance) {
      DeviceService.instance = new DeviceService();
    }
    return DeviceService.instance;
  }

  public async registerDevice(): Promise<void> {
    try {
      const deviceId = this.localStorage.getDeviceId();
      const deviceDoc = doc(collection(db, 'devices'), deviceId);

      await setDoc(deviceDoc, {
        deviceId,
        registeredAt: new Date(),
        lastActive: new Date()
      }, { merge: true });

      // Start sync after registration
      await this.syncService.startSync();
    } catch (error) {
      console.error('Error registering device:', error);
      throw error;
    }
  }

  public async getRegisteredDevices(): Promise<any[]> {
    try {
      const devicesSnapshot = await getDocs(collection(db, 'devices'));
      return devicesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting registered devices:', error);
      throw error;
    }
  }

  public async authorizeNewDevice(newDeviceId: string): Promise<void> {
    try {
      const deviceDoc = doc(db, 'devices', newDeviceId);
      const deviceData = await getDoc(deviceDoc);

      if (!deviceData.exists()) {
        throw new Error('Device not found');
      }

      // Sync data to new device
      await this.syncService.requestSync(newDeviceId);
    } catch (error) {
      console.error('Error authorizing new device:', error);
      throw error;
    }
  }

  public async updateDeviceStatus(): Promise<void> {
    try {
      const deviceId = this.localStorage.getDeviceId();
      const deviceDoc = doc(db, 'devices', deviceId);

      await setDoc(deviceDoc, {
        lastActive: new Date()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating device status:', error);
      throw error;
    }
  }
}