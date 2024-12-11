import { openDB } from 'idb';
import { Transaction } from '../../types/finance';
import { DB_NAME, DB_VERSION } from './constants';
import { accountsDB } from './accountsDB';
import { validateTransaction, calculateNewBalance } from '../transactionService';

export const transactionsDB = {
  async create(transaction: Transaction) {
    const db = await openDB(DB_NAME, DB_VERSION);
    const tx = db.transaction(['transactions', 'accounts'], 'readwrite');
    
    try {
      const account = await accountsDB.getById(transaction.accountId);
      validateTransaction(transaction, account);

      await tx.objectStore('transactions').add(transaction);
      
      if (account) {
        const newBalance = calculateNewBalance(account.balance, transaction);
        await accountsDB.updateBalance(account.id, newBalance);
      }
      
      await tx.done;
      return transaction;
    } catch (error) {
      await tx.abort();
      throw error;
    }
  },

  async getAll(): Promise<Transaction[]> {
    const db = await openDB(DB_NAME, DB_VERSION);
    const transactions = await db.getAll('transactions');
    return transactions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },

  async getByAccount(accountId: string): Promise<Transaction[]> {
    const db = await openDB(DB_NAME, DB_VERSION);
    const index = db.transaction('transactions').store.index('by-account');
    return index.getAll(accountId);
  },

  async getByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
    const db = await openDB(DB_NAME, DB_VERSION);
    const index = db.transaction('transactions').store.index('by-date');
    return index.getAll(IDBKeyRange.bound(startDate, endDate));
  }
};