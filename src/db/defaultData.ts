import { Account } from './schema';

export const defaultAccounts: Account[] = [
  {
    id: '1',
    name: 'الحساب الجاري الرئيسي',
    type: 'checking',
    balance: 0.00,
    currency: 'SAR',
    lastSync: new Date(),
  },
  {
    id: '2',
    name: 'حساب التوفير',
    type: 'savings',
    balance: 0.00,
    currency: 'SAR',
    lastSync: new Date(),
  },
  {
    id: '3',
    name: 'حساب اليوان الصيني',
    type: 'checking',
    balance: 0.00,
    currency: 'CNY',
    lastSync: new Date(),
  },
  {
    id: '4',
    name: 'حساب الريال اليمني',
    type: 'checking',
    balance: 0.00,
    currency: 'YER',
    lastSync: new Date(),
  },
];