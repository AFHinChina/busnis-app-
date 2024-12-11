import { Account, Transaction, Budget } from '../../types/finance';
import { dbOperations } from '../../db';
import { NotificationService } from '../notifications/NotificationService';
import { SecurityService } from '../security/SecurityService';
import { AnalyticsService } from './AnalyticsService';
import { ValidationService } from './ValidationService';
import { SyncService } from './SyncService';

export class FinanceCore {
  private static instance: FinanceCore;
  private analyticsService: AnalyticsService;
  private validationService: ValidationService;
  private syncService: SyncService;

  private constructor() {
    this.analyticsService = new AnalyticsService();
    this.validationService = new ValidationService();
    this.syncService = new SyncService();
  }

  public static getInstance(): FinanceCore {
    if (!FinanceCore.instance) {
      FinanceCore.instance = new FinanceCore();
    }
    return FinanceCore.instance;
  }

  // Core Account Operations
  async createAccount(account: Omit<Account, 'id'>): Promise<Account> {
    try {
      this.validationService.validateAccount(account);
      const newAccount = await dbOperations.createAccount({
        ...account,
        id: crypto.randomUUID(),
        lastSync: new Date()
      });
      await this.syncService.syncAccount(newAccount.id);
      return newAccount;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  }

  // Core Transaction Operations
  async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    try {
      await this.validationService.validateTransaction(transaction);
      const newTransaction = await dbOperations.createTransaction({
        ...transaction,
        id: crypto.randomUUID()
      });
      
      // Trigger analytics update
      await this.analyticsService.updateAnalytics(newTransaction);
      
      // Check for suspicious activity
      const fraudCheck = SecurityService.detectFraud(newTransaction);
      if (fraudCheck.isSuspicious) {
        await NotificationService.sendSecurityAlert({
          type: 'suspicious_transaction',
          transaction: newTransaction,
          reasons: fraudCheck.reasons
        });
      }

      return newTransaction;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  // Budget Management
  async createBudget(budget: Omit<Budget, 'id'>): Promise<Budget> {
    try {
      this.validationService.validateBudget(budget);
      const newBudget = {
        ...budget,
        id: crypto.randomUUID(),
        createdAt: new Date()
      };
      await dbOperations.createBudget(newBudget);
      return newBudget;
    } catch (error) {
      console.error('Error creating budget:', error);
      throw error;
    }
  }

  // Analytics and Reporting
  async generateFinancialReport(params: {
    startDate: Date;
    endDate: Date;
    type: 'income' | 'expense' | 'all';
    groupBy: 'day' | 'week' | 'month';
  }) {
    return this.analyticsService.generateReport(params);
  }

  // System Health Check
  async performHealthCheck() {
    const results = {
      database: await dbOperations.checkConnection(),
      sync: await this.syncService.checkStatus(),
      analytics: await this.analyticsService.checkStatus()
    };

    if (Object.values(results).some(result => !result.healthy)) {
      await NotificationService.sendSystemAlert({
        type: 'system_health',
        results
      });
    }

    return results;
  }

  // Data Backup
  async backupData() {
    try {
      const data = {
        accounts: await dbOperations.getAccounts(),
        transactions: await dbOperations.getTransactions(),
        budgets: await dbOperations.getBudgets()
      };

      // Encrypt sensitive data
      const encryptedData = SecurityService.encryptData(JSON.stringify(data));
      
      // Store backup
      const backupId = await dbOperations.createBackup(encryptedData);
      
      await NotificationService.sendNotification({
        type: 'backup_complete',
        backupId,
        timestamp: new Date()
      });

      return backupId;
    } catch (error) {
      console.error('Backup failed:', error);
      throw error;
    }
  }
}