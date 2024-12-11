import { Account } from '../types/finance';
import { dbOperations } from '../db';
import { encryptData, decryptData } from '../utils/encryption';

export class AccountService {
  static async connectAccount(credentials: {
    bankId: string;
    accessToken: string;
    refreshToken: string;
  }): Promise<Account> {
    // Encrypt sensitive data before storage
    const encryptedTokens = {
      accessToken: encryptData(credentials.accessToken),
      refreshToken: encryptData(credentials.refreshToken),
    };

    // Store encrypted credentials
    const account = await dbOperations.createAccount({
      id: crypto.randomUUID(),
      name: 'حساب جديد',
      type: 'checking',
      balance: 0,
      currency: 'SAR',
      lastSync: new Date(),
      credentials: encryptedTokens,
    });

    return account;
  }

  static async syncAccount(accountId: string): Promise<void> {
    const account = await dbOperations.getAccount(accountId);
    if (!account) throw new Error('Account not found');

    // Decrypt credentials for API access
    const decryptedTokens = {
      accessToken: decryptData(account.credentials.accessToken),
      refreshToken: decryptData(account.credentials.refreshToken),
    };

    // Implement bank API synchronization logic here
    // This would connect to the bank's API and fetch latest transactions
  }
}