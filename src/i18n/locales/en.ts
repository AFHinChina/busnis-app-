export default {
  common: {
    dashboard: 'Dashboard',
    accounts: 'Accounts',
    transactions: 'Transactions',
    reports: 'Reports',
    customers: 'Customers',
    vendors: 'Vendors',
    documents: 'Documents',
    settings: 'Settings',
    financeHub: 'Finance Hub',
    cancel: 'Cancel',
    save: 'Save',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success'
  },
  dashboard: {
    addTransaction: 'Add New Transaction',
    resetData: 'Reset Data',
    totalBalance: 'Total Balance',
    monthlyIncome: 'Monthly Income',
    monthlyExpenses: 'Monthly Expenses',
    recentTransactions: 'Recent Transactions',
    noTransactions: 'No transactions yet',
    startFirstTransaction: 'Start by adding your first transaction'
  },
  transactions: {
    whatToRecord: 'What would you like to record today?',
    income: 'Income',
    expense: 'Expense',
    selectAccount: 'Select Account',
    enterAmount: 'Enter Amount',
    category: 'Category',
    selectCategory: 'Select Category',
    description: 'Description',
    enterDescription: 'Enter a brief description',
    unknownAccount: 'Unknown Account',
    recentTransactions: 'Recent Transactions',
    noTransactions: 'No transactions',
    startFirstTransaction: 'Start by adding your first transaction',
    addIncome: 'Add Income',
    addExpense: 'Add Expense'
  },
  accounts: {
    addNew: 'Add New Account',
    totalBalance: 'Total Balance',
    noAccounts: 'No accounts added',
    balance: 'Balance',
    deposit: 'Deposit',
    withdraw: 'Withdraw',
    lastUpdate: 'Last Update',
    types: {
      checking: 'Checking Account',
      savings: 'Savings Account',
      investment: 'Investment Account'
    }
  },
  categories: {
    income: {
      salary: 'Salary',
      investment: 'Investment',
      sales: 'Sales',
      other: 'Other Income'
    },
    expense: {
      utilities: 'Utilities',
      rent: 'Rent',
      supplies: 'Supplies',
      salary: 'Salaries',
      other: 'Other Expense'
    }
  },
  errors: {
    selectAccount: 'Please select an account',
    selectCategory: 'Please select a category',
    transactionFailed: 'Transaction failed',
    accountRequired: 'Account is required',
    amountRequired: 'Amount is required',
    invalidAmount: 'Amount must be greater than zero',
    categoryRequired: 'Category is required',
    descriptionRequired: 'Description is required',
    noAccounts: 'Please add an account first'
  },
  modals: {
    resetConfirmTitle: 'Confirm Data Reset',
    resetConfirmMessage: 'Are you sure you want to reset all data? This action cannot be undone.',
    confirmReset: 'Yes, Reset Data'
  }
};