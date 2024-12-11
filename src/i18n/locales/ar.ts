export default {
  common: {
    dashboard: 'لوحة التحكم',
    accounts: 'الحسابات',
    transactions: 'المعاملات',
    reports: 'التقارير',
    customers: 'العملاء',
    vendors: 'الموردين',
    documents: 'المستندات',
    settings: 'الإعدادات',
    financeHub: 'المركز المالي',
    cancel: 'إلغاء',
    save: 'حفظ',
    loading: 'جاري التحميل...',
    error: 'حدث خطأ',
    success: 'تم بنجاح'
  },
  dashboard: {
    addTransaction: 'تسجيل معاملة جديدة',
    resetData: 'تصفير البيانات',
    totalBalance: 'الرصيد الإجمالي',
    monthlyIncome: 'الدخل الشهري',
    monthlyExpenses: 'المصروفات الشهرية',
    recentTransactions: 'آخر المعاملات',
    noTransactions: 'لا توجد معاملات حتى الآن',
    startFirstTransaction: 'ابدأ بتسجيل معاملتك الأولى'
  },
  transactions: {
    whatToRecord: 'ماذا تريد أن تسجل اليوم؟',
    income: 'دخل',
    expense: 'مصروف',
    selectAccount: 'اختر الحساب',
    enterAmount: 'أدخل المبلغ',
    category: 'الفئة',
    selectCategory: 'اختر الفئة',
    description: 'الوصف',
    enterDescription: 'اكتب وصفاً مختصراً',
    unknownAccount: 'حساب غير معروف',
    recentTransactions: 'آخر المعاملات',
    noTransactions: 'لا توجد معاملات',
    startFirstTransaction: 'ابدأ بتسجيل معاملتك الأولى',
    addIncome: 'تسجيل الدخل',
    addExpense: 'تسجيل المصروف'
  },
  accounts: {
    addNew: 'إضافة حساب جديد',
    totalBalance: 'إجمالي الأرصدة',
    noAccounts: 'لا توجد حسابات مضافة',
    balance: 'الرصيد',
    deposit: 'إيداع',
    withdraw: 'سحب',
    lastUpdate: 'آخر تحديث',
    types: {
      checking: 'حساب جاري',
      savings: 'حساب توفير',
      investment: 'حساب استثماري'
    }
  },
  categories: {
    income: {
      salary: 'راتب',
      investment: 'استثمار',
      sales: 'مبيعات',
      other: 'دخل آخر'
    },
    expense: {
      utilities: 'مرافق',
      rent: 'إيجار',
      supplies: 'مستلزمات',
      salary: 'رواتب',
      other: 'مصروف آخر'
    }
  },
  errors: {
    selectAccount: 'الرجاء اختيار حساب',
    selectCategory: 'الرجاء اختيار الفئة',
    transactionFailed: 'فشلت العملية',
    accountRequired: 'الحساب مطلوب',
    amountRequired: 'المبلغ مطلوب',
    invalidAmount: 'المبلغ يجب أن يكون أكبر من صفر',
    categoryRequired: 'الفئة مطلوبة',
    descriptionRequired: 'الوصف مطلوب',
    noAccounts: 'يرجى إضافة حساب أولاً'
  },
  modals: {
    resetConfirmTitle: 'تأكيد تصفير البيانات',
    resetConfirmMessage: 'هل أنت متأكد من رغبتك في تصفير جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.',
    confirmReset: 'نعم، تصفير البيانات'
  }
};