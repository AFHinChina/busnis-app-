import { Account, Transaction, Budget } from '../../types/finance';
import { dbOperations } from '../../db';

export class ValidationService {
  validateAccount(account: Omit<Account, 'id'>) {
    if (!account.name?.trim()) {
      throw new Error('اسم الحساب مطلوب');
    }

    if (!account.type) {
      throw new Error('نوع الحساب مطلوب');
    }

    if (typeof account.balance !== 'number' || account.balance < 0) {
      throw new Error('الرصيد يجب أن يكون رقماً موجباً');
    }

    if (!account.currency?.trim()) {
      throw new Error('العملة مطلوبة');
    }
  }

  async validateTransaction(transaction: Omit<Transaction, 'id'>) {
    // Validate basic transaction data
    if (!transaction.accountId) {
      throw new Error('معرف الحساب مطلوب');
    }

    if (!transaction.amount || transaction.amount <= 0) {
      throw new Error('المبلغ يجب أن يكون أكبر من صفر');
    }

    if (!transaction.type) {
      throw new Error('نوع المعاملة مطلوب');
    }

    if (!transaction.category?.trim()) {
      throw new Error('الفئة مطلوبة');
    }

    if (!transaction.description?.trim()) {
      throw new Error('الوصف مطلوب');
    }

    // Check account existence and balance
    const account = await dbOperations.getAccount(transaction.accountId);
    if (!account) {
      throw new Error('الحساب غير موجود');
    }

    // Validate sufficient balance for expenses
    if (transaction.type === 'expense' && transaction.amount > account.balance) {
      throw new Error('رصيد الحساب غير كافي');
    }
  }

  validateBudget(budget: Omit<Budget, 'id'>) {
    if (!budget.category?.trim()) {
      throw new Error('فئة الميزانية مطلوبة');
    }

    if (!budget.amount || budget.amount <= 0) {
      throw new Error('مبلغ الميزانية يجب أن يكون أكبر من صفر');
    }

    if (!budget.period) {
      throw new Error('فترة الميزانية مطلوبة');
    }

    if (!budget.startDate) {
      throw new Error('تاريخ بدء الميزانية مطلوب');
    }
  }
}