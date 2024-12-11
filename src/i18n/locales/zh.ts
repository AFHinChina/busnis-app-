export default {
  common: {
    dashboard: '仪表板',
    accounts: '账户',
    transactions: '交易',
    reports: '报告',
    customers: '客户',
    vendors: '供应商',
    documents: '文档',
    settings: '设置',
    financeHub: '金融中心',
    cancel: '取消',
    save: '保存',
    loading: '加载中...',
    error: '错误',
    success: '成功'
  },
  dashboard: {
    addTransaction: '添加新交易',
    resetData: '重置数据',
    totalBalance: '总余额',
    monthlyIncome: '月收入',
    monthlyExpenses: '月支出',
    recentTransactions: '最近交易',
    noTransactions: '暂无交易',
    startFirstTransaction: '开始添加您的第一笔交易'
  },
  transactions: {
    whatToRecord: '今天要记录什么？',
    income: '收入',
    expense: '支出',
    selectAccount: '选择账户',
    enterAmount: '输入金额',
    category: '类别',
    selectCategory: '选择类别',
    description: '描述',
    enterDescription: '输入简短描述',
    unknownAccount: '未知账户',
    recentTransactions: '最近交易',
    noTransactions: '暂无交易',
    startFirstTransaction: '开始添加您的第一笔交易',
    addIncome: '添加收入',
    addExpense: '添加支出'
  },
  accounts: {
    addNew: '添加新账户',
    totalBalance: '总余额',
    noAccounts: '暂无账户',
    balance: '余额',
    deposit: '存款',
    withdraw: '取款',
    lastUpdate: '最后更新',
    types: {
      checking: '活期账户',
      savings: '储蓄账户',
      investment: '投资账户'
    }
  },
  categories: {
    income: {
      salary: '工资',
      investment: '投资',
      sales: '销售',
      other: '其他收入'
    },
    expense: {
      utilities: '水电费',
      rent: '房租',
      supplies: '用品',
      salary: '工资支出',
      other: '其他支出'
    }
  },
  errors: {
    selectAccount: '请选择账户',
    selectCategory: '请选择类别',
    transactionFailed: '交易失败',
    accountRequired: '账户必填',
    amountRequired: '金额必填',
    invalidAmount: '金额必须大于零',
    categoryRequired: '类别必填',
    descriptionRequired: '描述必填',
    noAccounts: '请先添加账户'
  },
  modals: {
    resetConfirmTitle: '确认重置数据',
    resetConfirmMessage: '确定要重置所有数据吗？此操作无法撤销。',
    confirmReset: '是的，重置数据'
  }
};