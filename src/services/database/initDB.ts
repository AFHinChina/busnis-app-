import { openDB } from 'idb';
import { DB_NAME, DB_VERSION, STORES, INDEXES } from './constants';

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion) {
      if (!db.objectStoreNames.contains(STORES.ACCOUNTS)) {
        const accountStore = db.createObjectStore(STORES.ACCOUNTS, { keyPath: 'id' });
        accountStore.createIndex(INDEXES.BY_NAME, 'name');
      }
      
      if (!db.objectStoreNames.contains(STORES.TRANSACTIONS)) {
        const transactionStore = db.createObjectStore(STORES.TRANSACTIONS, { keyPath: 'id' });
        transactionStore.createIndex(INDEXES.BY_ACCOUNT, 'accountId');
        transactionStore.createIndex(INDEXES.BY_DATE, 'date');
      }
      
      if (!db.objectStoreNames.contains(STORES.CUSTOMERS)) {
        db.createObjectStore(STORES.CUSTOMERS, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.VENDORS)) {
        db.createObjectStore(STORES.VENDORS, { keyPath: 'id' });
      }
    }
  });
}