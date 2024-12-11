export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  currency: string;
  lastSync?: Date;
}

export interface Transaction {
  id: string;
  accountId: string;
  date: Date;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  tags?: string[];
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  period: 'monthly' | 'yearly';
  startDate: Date;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalRevenue: number;
  lastTransaction?: Date;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalExpense: number;
  lastTransaction?: Date;
}