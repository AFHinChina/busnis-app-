import { openDB } from 'idb';
import { Vendor } from '../../types/finance';
import { DB_NAME, DB_VERSION } from './constants';

export const vendorsDB = {
  async create(vendor: Vendor) {
    const db = await openDB(DB_NAME, DB_VERSION);
    await db.add('vendors', vendor);
    return vendor;
  },

  async getAll(): Promise<Vendor[]> {
    const db = await openDB(DB_NAME, DB_VERSION);
    return db.getAll('vendors');
  },

  async update(vendor: Vendor) {
    const db = await openDB(DB_NAME, DB_VERSION);
    await db.put('vendors', vendor);
    return vendor;
  },

  async updateExpense(id: string, amount: number) {
    const db = await openDB(DB_NAME, DB_VERSION);
    const vendor = await db.get('vendors', id);
    if (vendor) {
      vendor.totalExpense += amount;
      vendor.lastTransaction = new Date();
      await db.put('vendors', vendor);
    }
    return vendor;
  }
};