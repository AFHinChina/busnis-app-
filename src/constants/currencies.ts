export interface Currency {
  code: string;
  name: string;
  symbol: string;
  direction: 'rtl' | 'ltr';
}

export const currencies: Currency[] = [
  {
    code: 'SAR',
    name: 'ريال سعودي',
    symbol: 'ر.س',
    direction: 'rtl',
  },
  {
    code: 'YER',
    name: 'ريال يمني',
    symbol: 'ر.ي',
    direction: 'rtl',
  },
  {
    code: 'CNY',
    name: 'يوان صيني',
    symbol: '¥',
    direction: 'ltr',
  },
  {
    code: 'USD',
    name: 'دولار أمريكي',
    symbol: '$',
    direction: 'ltr',
  },
  {
    code: 'EUR',
    name: 'يورو',
    symbol: '€',
    direction: 'ltr',
  },
];

export const formatCurrency = (amount: number, currencyCode: string): string => {
  const currency = currencies.find((c) => c.code === currencyCode);
  if (!currency) return `${amount.toFixed(2)}`;

  const formattedAmount = amount.toFixed(2);
  return currency.direction === 'rtl'
    ? `${formattedAmount} ${currency.symbol}`
    : `${currency.symbol}${formattedAmount}`;
};