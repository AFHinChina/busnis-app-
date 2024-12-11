export const DB_NAME = 'finance-db';
export const DB_VERSION = 8; // Increment version to force database recreation

export const STORES = {
  ACCOUNTS: 'accounts',
  TRANSACTIONS: 'transactions',
  CUSTOMERS: 'customers',
  VENDORS: 'vendors',
  DOCUMENTS: 'documents'
} as const;

export const INDEXES = {
  BY_ACCOUNT: 'by-account',
  BY_DATE: 'by-date',
  BY_NAME: 'by-name',
  BY_CATEGORY: 'by-category',
  BY_TYPE: 'by-type'
} as const;