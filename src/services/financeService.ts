import { systemStructure } from '../constants/systemStructure';
import { dbOperations } from '../db';
import { Account, Transaction } from '../types/finance';

export class FinanceService {
  // 1. إدارة الحسابات
  static async addAccount(account: Omit<Account, 'id'>): Promise<Account> {
    return await dbOperations.createAccount({
      ...account,
      id: crypto.randomUUID(),
      lastSync: new Date()
    });
  }

  // 2. إدارة المعاملات
  static async addTransaction(
    transaction: Omit<Transaction, 'id' | 'date'>
  ): Promise<Transaction> {
    return await dbOperations.createTransaction({
      ...transaction,
      id: crypto.randomUUID(),
      date: new Date()
    });
  }

  // 3. حساب الإحصائيات
  static async calculateStatistics(accountId: string) {
    const transactions = await dbOperations.getTransactions();
    const accountTransactions = transactions.filter(t => t.accountId === accountId);

    return {
      totalIncome: accountTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
      totalExpenses: accountTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),
      transactionCount: accountTransactions.length
    };
  }

  // 4. التحقق من صحة المعاملات
  static validateTransaction(
    transaction: Omit<Transaction, 'id' | 'date'>,
    account: Account
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // التحقق من المبلغ
    if (transaction.amount <= 0) {
      errors.push('المبلغ يجب أن يكون أكبر من صفر');
    }

    // التحقق من الرصيد في حالة السحب
    if (
      transaction.type === 'expense' &&
      transaction.amount > account.balance
    ) {
      errors.push('الرصيد غير كافي');
    }

    // التحقق من الوصف
    if (!transaction.description.trim()) {
      errors.push('الرجاء إدخال وصف للمعاملة');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}