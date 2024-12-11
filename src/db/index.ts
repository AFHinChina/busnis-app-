import { openDB, DBSchema } from 'idb';
import { Account, Transaction, Customer, Vendor } from './schema';
import { validateTransaction, calculateNewBalance } from '../services/transactionService';
import { DB_NAME, DB_VERSION, STORES, INDEXES } from '../services/database/constants';

interface FinanceDB extends DBSchema {
  accounts: {
    key: string;
    value: Account;
    indexes: { [INDEXES.BY_NAME]: string };
  };
  transactions: {
    key: string;
    value: Transaction;
    indexes: { 
      [INDEXES.BY_ACCOUNT]: string;
      [INDEXES.BY_DATE]: Date;
      [INDEXES.BY_CATEGORY]: string;
      [INDEXES.BY_TYPE]: string;
    };
  };
  customers: {
    key: string;
    value: Customer;
  };
  vendors: {
    key: string;
    value: Vendor;
  };
  documents: {
    key: string;
    value: any;
    indexes: { [INDEXES.BY_CATEGORY]: string };
  };
}

const dbPromise = openDB<FinanceDB>(DB_NAME, DB_VERSION, {
  upgrade(db, oldVersion, newVersion) {
    // Delete old stores if they exist
    if (oldVersion < DB_VERSION) {
      const storeNames = [...db.objectStoreNames];
      storeNames.forEach(storeName => {
        db.deleteObjectStore(storeName);
      });
    }

    // Create new stores with indexes
    if (!db.objectStoreNames.contains(STORES.ACCOUNTS)) {
      const accountStore = db.createObjectStore(STORES.ACCOUNTS, { keyPath: 'id' });
      accountStore.createIndex(INDEXES.BY_NAME, 'name');
    }
    
    if (!db.objectStoreNames.contains(STORES.TRANSACTIONS)) {
      const transactionStore = db.createObjectStore(STORES.TRANSACTIONS, { keyPath: 'id' });
      transactionStore.createIndex(INDEXES.BY_ACCOUNT, 'accountId');
      transactionStore.createIndex(INDEXES.BY_DATE, 'date');
      transactionStore.createIndex(INDEXES.BY_CATEGORY, 'category');
      transactionStore.createIndex(INDEXES.BY_TYPE, 'type');
    }
    
    if (!db.objectStoreNames.contains(STORES.CUSTOMERS)) {
      db.createObjectStore(STORES.CUSTOMERS, { keyPath: 'id' });
    }
    
    if (!db.objectStoreNames.contains(STORES.VENDORS)) {
      db.createObjectStore(STORES.VENDORS, { keyPath: 'id' });
    }

    if (!db.objectStoreNames.contains(STORES.DOCUMENTS)) {
      const documentStore = db.createObjectStore(STORES.DOCUMENTS, { keyPath: 'id' });
      documentStore.createIndex(INDEXES.BY_CATEGORY, 'category');
    }
  },
});

export const dbOperations = {
  async createTransaction(transaction: Transaction): Promise<Transaction> {
    const db = await dbPromise;
    
    // Start a new transaction
    const tx = db.transaction([STORES.TRANSACTIONS, STORES.ACCOUNTS], 'readwrite');
    
    try {
      // Get the account first
      const account = await tx.objectStore(STORES.ACCOUNTS).get(transaction.accountId);
      
      // Validate the transaction
      await validateTransaction(transaction, account);

      // Add transaction record
      await tx.objectStore(STORES.TRANSACTIONS).add(transaction);

      // Update account balance
      if (account) {
        const newBalance = calculateNewBalance(account.balance, transaction);
        await tx.objectStore(STORES.ACCOUNTS).put({
          ...account,
          balance: newBalance,
          lastSync: new Date()
        });
      }
      
      // Complete the transaction
      await tx.done;
      return transaction;
    } catch (error) {
      console.error('Transaction error:', error);
      throw error;
    }
  },

  async getTransactions(): Promise<Transaction[]> {
    const db = await dbPromise;
    const transactions = await db.getAll(STORES.TRANSACTIONS);
    return transactions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },

  async getAccounts(): Promise<Account[]> {
    const db = await dbPromise;
    return db.getAll(STORES.ACCOUNTS);
  },

  async createAccount(account: Account): Promise<Account> {
    const db = await dbPromise;
    await db.add(STORES.ACCOUNTS, account);
    return account;
  },

  async updateAccount(account: Account): Promise<Account> {
    const db = await dbPromise;
    await db.put(STORES.ACCOUNTS, account);
    return account;
  },

  async getAccount(id: string): Promise<Account | undefined> {
    const db = await dbPromise;
    return db.get(STORES.ACCOUNTS, id);
  },

  async resetDatabase(): Promise<void> {
    const db = await dbPromise;
    const tx = db.transaction(Object.values(STORES), 'readwrite');
    
    try {
      await Promise.all(
        Object.values(STORES).map(store => tx.objectStore(store).clear())
      );
      await tx.done;
    } catch (error) {
      console.error('Reset database error:', error);
      throw error;
    }
  }
};

export default dbOperations;