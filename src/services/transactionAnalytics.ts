import { Transaction } from '../types/finance';
import { dbOperations } from '../db';
import { categorizeTransaction } from '../utils/aiUtils';

export class TransactionAnalytics {
  static async analyzeSpending(userId: string, timeframe: 'week' | 'month' | 'year') {
    const transactions = await dbOperations.getTransactions();
    
    // Group transactions by category
    const spendingByCategory = transactions.reduce((acc, transaction) => {
      if (transaction.type === 'expense') {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalSpending: Object.values(spendingByCategory).reduce((a, b) => a + b, 0),
      spendingByCategory,
      // Add more analytics as needed
    };
  }

  static async categorizePendingTransactions(): Promise<void> {
    const uncategorizedTransactions = await dbOperations.getUncategorizedTransactions();
    
    for (const transaction of uncategorizedTransactions) {
      const suggestedCategory = await categorizeTransaction(transaction.description);
      await dbOperations.updateTransaction({
        ...transaction,
        category: suggestedCategory,
      });
    }
  }
}