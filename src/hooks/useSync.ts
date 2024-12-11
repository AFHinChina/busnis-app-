import { useState, useEffect } from 'react';
import { LocalStorageService } from '../services/storage/LocalStorageService';
import { SyncService } from '../services/sync/SyncService';
import { DeviceService } from '../services/devices/DeviceService';

export const useSync = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const localStorage = LocalStorageService.getInstance();
  const syncService = SyncService.getInstance();
  const deviceService = DeviceService.getInstance();

  useEffect(() => {
    const initializeSync = async () => {
      try {
        setIsSyncing(true);
        await deviceService.registerDevice();
        await syncService.startSync();
        setIsInitialized(true);
        setLastSyncTime(new Date());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsSyncing(false);
      }
    };

    if (!isInitialized) {
      initializeSync();
    }

    return () => {
      syncService.stopSync();
    };
  }, [isInitialized]);

  const syncData = async (data: any) => {
    try {
      setIsSyncing(true);
      setError(null);
      
      // Save locally first
      await localStorage.saveData('userData', data);
      
      // Then sync to other devices
      await syncService.syncData(data);
      
      setLastSyncTime(new Date());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const authorizeDevice = async (deviceId: string) => {
    try {
      setIsSyncing(true);
      setError(null);
      await deviceService.authorizeNewDevice(deviceId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isInitialized,
    isSyncing,
    error,
    lastSyncTime,
    syncData,
    authorizeDevice
  };
};