import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Transaction } from '../types/finance';
import { dbOperations } from '../db';
import { validateTransaction } from '../services/transactionService';

export const useTransactions = () => {
  const queryClient = useQueryClient();

  const createTransaction = useMutation({
    mutationFn: async (transaction: Omit<Transaction, 'id' | 'date'> & { date: Date }) => {
      try {
        const result = await dbOperations.createTransaction(transaction);
        return result;
      } catch (error) {
        console.error('Transaction creation error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: (error) => {
      console.error('Transaction mutation error:', error);
      throw error;
    },
  });

  return {
    createTransaction,
  };
};