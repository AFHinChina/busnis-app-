import { Budget } from '../types/finance';
import { dbOperations } from '../db';
import { calculateTrends } from '../utils/analytics';

export class BudgetService {
  static async createSmartBudget(): Promise<Budget> {
    const transactions = await dbOperations.getTransactions();
    const spendingTrends = calculateTrends(transactions);
    
    // Generate budget recommendations based on historical spending
    const recommendedBudgets = Object.entries(spendingTrends).map(([category, amount]) => ({
      category,
      recommendedAmount: amount * 0.9, // Suggest 10% less than typical spending
    }));

    return recommendedBudgets;
  }

  static async monitorBudget(budgetId: string): Promise<{
    status: 'on_track' | 'warning' | 'exceeded';
    currentSpending: number;
    remainingBudget: number;
  }> {
    const budget = await dbOperations.getBudget(budgetId);
    const transactions = await dbOperations.getTransactions();
    
    const currentSpending = transactions
      .filter(t => t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      status: currentSpending > budget.amount ? 'exceeded' : 'on_track',
      currentSpending,
      remainingBudget: budget.amount - currentSpending,
    };
  }
}