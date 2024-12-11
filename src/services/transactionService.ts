import { Account, Transaction } from '../types/finance';

export class InsufficientFundsError extends Error {
  constructor() {
    super('رصيد الحساب غير كافي لإجراء هذه العملية');
    this.name = 'InsufficientFundsError';
  }
}

export class AccountNotFoundError extends Error {
  constructor() {
    super('الحساب غير موجود');
    this.name = 'AccountNotFoundError';
  }
}

export class InvalidTransactionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidTransactionError';
  }
}

export const validateTransaction = async (
  transaction: Transaction,
  account: Account | undefined
): Promise<void> => {
  if (!account) {
    throw new AccountNotFoundError();
  }

  if (!transaction.amount || transaction.amount <= 0) {
    throw new InvalidTransactionError('المبلغ يجب أن يكون أكبر من صفر');
  }

  if (!transaction.description.trim()) {
    throw new InvalidTransactionError('الرجاء إدخال وصف للمعاملة');
  }

  if (!transaction.category) {
    throw new InvalidTransactionError('الرجاء اختيار الفئة');
  }

  if (transaction.type === 'expense') {
    const transactionAmount = Math.abs(transaction.amount);
    if (transactionAmount > account.balance) {
      throw new InsufficientFundsError();
    }
  }
};

export const calculateNewBalance = (
  currentBalance: number,
  transaction: Pick<Transaction, 'type' | 'amount'>
): number => {
  const amount = Math.abs(transaction.amount);
  return transaction.type === 'income' 
    ? currentBalance + amount 
    : currentBalance - amount;
};