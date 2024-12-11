import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { transactionsService } from '../services/firebase/transactionsService';
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear,
  subWeeks,
  subMonths,
  subYears,
  eachWeekOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval,
  format
} from 'date-fns';
import { ar } from 'date-fns/locale';

export type ReportPeriod = 'week' | 'month' | 'year';
export type FilterCriteria = {
  categories?: string[];
  minAmount?: number;
  maxAmount?: number;
};

export const useReportData = () => {
  const [period, setPeriod] = useState<ReportPeriod>('month');
  const [filters, setFilters] = useState<FilterCriteria>({});

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: transactionsService.getAll
  });

  const getDateRange = (selectedPeriod: ReportPeriod) => {
    const now = new Date();
    switch (selectedPeriod) {
      case 'week':
        return {
          start: subWeeks(now, 12),
          end: now,
          intervals: eachWeekOfInterval,
          format: 'dd MMM'
        };
      case 'month':
        return {
          start: subMonths(now, 6),
          end: now,
          intervals: eachMonthOfInterval,
          format: 'MMM yyyy'
        };
      case 'year':
        return {
          start: subYears(now, 2),
          end: now,
          intervals: eachYearOfInterval,
          format: 'yyyy'
        };
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (filters.categories?.length && !filters.categories.includes(t.category)) {
        return false;
      }
      if (filters.minAmount && t.amount < filters.minAmount) {
        return false;
      }
      if (filters.maxAmount && t.amount > filters.maxAmount) {
        return false;
      }
      return true;
    });
  }, [transactions, filters]);

  const periodData = useMemo(() => {
    const { start, end, intervals, format: dateFormat } = getDateRange(period);
    
    return intervals({ start, end }).map(date => {
      let periodStart, periodEnd;
      
      switch (period) {
        case 'week':
          periodStart = startOfWeek(date);
          periodEnd = endOfWeek(date);
          break;
        case 'month':
          periodStart = startOfMonth(date);
          periodEnd = endOfMonth(date);
          break;
        case 'year':
          periodStart = startOfYear(date);
          periodEnd = endOfYear(date);
          break;
      }

      const periodTransactions = filteredTransactions.filter(t => {
        const txDate = new Date(t.date);
        return txDate >= periodStart && txDate <= periodEnd;
      });

      const income = periodTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = periodTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        period: format(date, dateFormat, { locale: ar }),
        دخل: income,
        مصروفات: expenses,
        صافي: income - expenses,
      };
    });
  }, [filteredTransactions, period]);

  const categoryData = useMemo(() => {
    const expensesByCategory = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(expensesByCategory).map(([category, amount]) => ({
      name: category,
      value: amount,
    }));
  }, [filteredTransactions]);

  const summaryData = useMemo(() => {
    const { start: periodStart, end: periodEnd } = getDateRange(period);
    
    const periodTransactions = filteredTransactions.filter(t => {
      const date = new Date(t.date);
      return date >= periodStart && date <= periodEnd;
    });

    const income = periodTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = periodTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expenses,
      netCashFlow: income - expenses,
    };
  }, [filteredTransactions, period]);

  return {
    period,
    setPeriod,
    filters,
    setFilters,
    periodData,
    categoryData,
    summaryData,
  };
};