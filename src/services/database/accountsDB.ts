import { openDB } from 'idb';
import { Account } from '../../types/finance';
import { DB_NAME, DB_VERSION } from './constants';

export const accountsDB = {
  async create(account: Account) {
    const db = await openDB(DB_NAME, DB_VERSION);
    await db.add('accounts', account);
    return account;
  },

  async getAll(): Promise<Account[]> {
    const db = await openDB(DB_NAME, DB_VERSION);
    return db.getAll('accounts');
  },

  async update(account: Account) {
    const db = await openDB(DB_NAME, DB_VERSION);
    await db.put('accounts', account);
    return account;
  },

  async getById(id: string): Promise<Account | undefined> {
    const db = await openDB(DB_NAME, DB_VERSION);
    return db.get('accounts', id);
  },

  async updateBalance(id: string, newBalance: number) {
    const db = await openDB(DB_NAME, DB_VERSION);
    const account = await db.get('accounts', id);
    if (account) {
      account.balance = newBalance;
      account.lastSync = new Date();
      await db.put('accounts', account);
    }
    return account;
  }
};