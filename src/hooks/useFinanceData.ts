import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsService } from '../services/firebase/accountsService';
import { transactionsService } from '../services/firebase/transactionsService';
import { Account, Transaction } from '../types/finance';

export const useFinanceData = () => {
  const queryClient = useQueryClient();

  // Queries with optimized settings
  const accountsQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: accountsService.getAll,
    initialData: [],
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  const transactionsQuery = useQuery({
    queryKey: ['transactions'],
    queryFn: transactionsService.getAll,
    initialData: [],
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  const createAccount = useMutation({
    mutationFn: async (account: Omit<Account, 'id' | 'lastSync'>) => {
      try {
        return await accountsService.create({
          ...account,
          lastSync: new Date()
        });
      } catch (error) {
        console.error('Error creating account:', error);
        throw new Error('فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    }
  });

  const createTransaction = useMutation({
    mutationFn: async (transaction: Omit<Transaction, 'id'>) => {
      try {
        const account = accountsQuery.data.find(a => a.id === transaction.accountId);
        if (!account) {
          throw new Error('الحساب غير موجود');
        }

        if (transaction.type === 'expense' && transaction.amount > account.balance) {
          throw new Error('رصيد غير كافي');
        }

        return await transactionsService.create(transaction);
      } catch (error: any) {
        console.error('Transaction error:', error);
        throw new Error(error.message || 'فشل إنشاء المعاملة. يرجى المحاولة مرة أخرى.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    }
  });

  return {
    accounts: accountsQuery.data ?? [],
    transactions: transactionsQuery.data ?? [],
    isLoading: accountsQuery.isLoading || transactionsQuery.isLoading,
    isError: accountsQuery.isError || transactionsQuery.isError,
    createAccount,
    createTransaction,
    refetchAccounts: () => queryClient.invalidateQueries({ queryKey: ['accounts'] }),
    refetchTransactions: () => queryClient.invalidateQueries({ queryKey: ['transactions'] })
  };
};