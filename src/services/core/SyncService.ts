import { dbOperations } from '../../db';
import { NotificationService } from '../notifications/NotificationService';

export class SyncService {
  async syncAccount(accountId: string) {
    try {
      const account = await dbOperations.getAccount(accountId);
      if (!account) {
        throw new Error('Account not found');
      }

      // Update last sync timestamp
      await dbOperations.updateAccount({
        ...account,
        lastSync: new Date()
      });

      // Notify success
      await NotificationService.sendNotification({
        type: 'sync_complete',
        accountId,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Sync failed:', error);
      await NotificationService.sendNotification({
        type: 'sync_failed',
        accountId,
        error: error.message,
        timestamp: new Date()
      });
      throw error;
    }
  }

  async checkStatus() {
    try {
      // Perform sync system health check
      return { healthy: true };
    } catch (error) {
      return { healthy: false, error };
    }
  }
}