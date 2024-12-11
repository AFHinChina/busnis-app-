import { useFinanceData } from './useFinanceData';
import { startOfMonth, endOfMonth } from 'date-fns';

export const useDashboardData = () => {
  const { accounts, transactions } = useFinanceData();
  
  // Calculate total balance across all accounts
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  
  // Get current month's transactions
  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  const currentMonthTransactions = transactions.filter(
    transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= monthStart && transactionDate <= monthEnd;
    }
  );
  
  // Calculate monthly income and expenses
  const monthlyIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const monthlyExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Count active customers (those with transactions this month)
  const activeCustomers = new Set(
    currentMonthTransactions.map(t => t.accountId)
  ).size;
  
  return {
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    activeCustomers,
    isLoading: false,
  };
};