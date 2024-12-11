import { useState, useMemo } from 'react';
import { Transaction } from '../types/finance';

interface TransactionFilters {
  type?: 'income' | 'expense' | '';
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  category?: string;
  accountId?: string;
}

export const useTransactionFilters = (transactions: Transaction[]) => {
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Search query filter
      if (searchQuery && transaction.description) {
        const searchLower = searchQuery.toLowerCase();
        if (!transaction.description.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Type filter
      if (filters.type && transaction.type !== filters.type) {
        return false;
      }

      // Date range filter
      if (filters.startDate && new Date(transaction.date) < filters.startDate) {
        return false;
      }
      if (filters.endDate && new Date(transaction.date) > filters.endDate) {
        return false;
      }

      // Amount range filter
      if (filters.minAmount && transaction.amount < filters.minAmount) {
        return false;
      }
      if (filters.maxAmount && transaction.amount > filters.maxAmount) {
        return false;
      }

      // Category filter
      if (filters.category && transaction.category !== filters.category) {
        return false;
      }

      // Account filter
      if (filters.accountId && transaction.accountId !== filters.accountId) {
        return false;
      }

      return true;
    });
  }, [transactions, filters, searchQuery]);

  return {
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
    filteredTransactions,
  };
};