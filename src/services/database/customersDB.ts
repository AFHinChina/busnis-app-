import { openDB } from 'idb';
import { Customer } from '../../types/finance';
import { DB_NAME, DB_VERSION } from './constants';

export const customersDB = {
  async create(customer: Customer) {
    const db = await openDB(DB_NAME, DB_VERSION);
    await db.add('customers', customer);
    return customer;
  },

  async getAll(): Promise<Customer[]> {
    const db = await openDB(DB_NAME, DB_VERSION);
    return db.getAll('customers');
  },

  async update(customer: Customer) {
    const db = await openDB(DB_NAME, DB_VERSION);
    await db.put('customers', customer);
    return customer;
  },

  async updateRevenue(id: string, amount: number) {
    const db = await openDB(DB_NAME, DB_VERSION);
    const customer = await db.get('customers', id);
    if (customer) {
      customer.totalRevenue += amount;
      customer.lastTransaction = new Date();
      await db.put('customers', customer);
    }
    return customer;
  }
};