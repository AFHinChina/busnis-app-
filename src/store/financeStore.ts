import { create } from 'zustand';
import { Account, Transaction, Budget, Customer, Vendor } from '../types/finance';

interface FinanceState {
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  customers: Customer[];
  vendors: Vendor[];
  
  addAccount: (account: Account) => void;
  addTransaction: (transaction: Transaction) => void;
  updateBudget: (budget: Budget) => void;
  addCustomer: (customer: Customer) => void;
  addVendor: (vendor: Vendor) => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  accounts: [],
  transactions: [],
  budgets: [],
  customers: [],
  vendors: [],

  addAccount: (account) =>
    set((state) => ({ accounts: [...state.accounts, account] })),

  addTransaction: (transaction) =>
    set((state) => ({ transactions: [...state.transactions, transaction] })),

  updateBudget: (budget) =>
    set((state) => ({
      budgets: state.budgets.map((b) => (b.id === budget.id ? budget : b)),
    })),

  addCustomer: (customer) =>
    set((state) => ({ customers: [...state.customers, customer] })),

  addVendor: (vendor) =>
    set((state) => ({ vendors: [...state.vendors, vendor] })),
}));