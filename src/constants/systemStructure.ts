export const systemStructure = {
  // 1. الحسابات المالية
  accounts: {
    types: [
      { id: 'checking', name: 'حساب جاري' },
      { id: 'savings', name: 'حساب توفير' },
      { id: 'investment', name: 'حساب استثماري' }
    ],
    currencies: [
      { code: 'SAR', name: 'ريال سعودي', symbol: 'ر.س' },
      { code: 'YER', name: 'ريال يمني', symbol: 'ر.ي' },
      { code: 'CNY', name: 'يوان صيني', symbol: '¥' }
    ]
  },

  // 2. المعاملات المالية
  transactions: {
    types: [
      { id: 'income', name: 'دخل' },
      { id: 'expense', name: 'مصروف' }
    ],
    categories: {
      income: [
        { id: 'salary', name: 'راتب' },
        { id: 'business', name: 'أرباح تجارية' },
        { id: 'investment', name: 'عائد استثمار' },
        { id: 'other', name: 'دخل آخر' }
      ],
      expense: [
        { id: 'utilities', name: 'فواتير خدمات' },
        { id: 'rent', name: 'إيجار' },
        { id: 'food', name: 'طعام' },
        { id: 'transport', name: 'مواصلات' },
        { id: 'other', name: 'مصروف آخر' }
      ]
    }
  },

  // 3. التقارير المالية
  reports: {
    types: [
      { id: 'daily', name: 'يومي' },
      { id: 'weekly', name: 'أسبوعي' },
      { id: 'monthly', name: 'شهري' }
    ],
    metrics: [
      { id: 'balance', name: 'الرصيد' },
      { id: 'income', name: 'الدخل' },
      { id: 'expenses', name: 'المصروفات' },
      { id: 'savings', name: 'المدخرات' }
    ]
  },

  // 4. العمليات اليومية
  dailyOperations: {
    steps: [
      { id: 1, name: 'تسجيل الدخل', description: 'إدخال المبالغ المستلمة' },
      { id: 2, name: 'تسجيل المصروفات', description: 'إدخال المبالغ المدفوعة' },
      { id: 3, name: 'مراجعة الأرصدة', description: 'التحقق من صحة الأرصدة' },
      { id: 4, name: 'حفظ المستندات', description: 'تخزين الإيصالات والفواتير' }
    ]
  }
};