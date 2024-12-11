import { Transaction } from '../types/finance';
import { startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';

export function calculateTrends(transactions: Transaction[]) {
  const now = new Date();
  const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
  
  const months = eachMonthOfInterval({
    start: sixMonthsAgo,
    end: now,
  });

  return months.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    const monthlyTransactions = transactions.filter(
      t => new Date(t.date) >= monthStart && new Date(t.date) <= monthEnd
    );

    return {
      month,
      income: monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
      expenses: monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),
    };
  });
}