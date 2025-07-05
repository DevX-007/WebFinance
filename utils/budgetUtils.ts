import { Budget, TransactionCategory } from '../types';
import { format } from 'date-fns';

// Generate mock budgets for the current month
export const generateMockBudgets = (): Budget[] => {
  const currentMonth = format(new Date(), 'yyyy-MM');
  
  const budgets: Budget[] = [
    {
      category: 'Housing',
      amount: 1000,
      month: currentMonth
    },
    {
      category: 'Food',
      amount: 500,
      month: currentMonth
    },
    {
      category: 'Transportation',
      amount: 200,
      month: currentMonth
    },
    {
      category: 'Entertainment',
      amount: 150,
      month: currentMonth
    },
    {
      category: 'Shopping',
      amount: 300,
      month: currentMonth
    },
    {
      category: 'Utilities',
      amount: 250,
      month: currentMonth
    },
    {
      category: 'Healthcare',
      amount: 100,
      month: currentMonth
    }
  ];
  
  return budgets;
};

// Get all available categories as an array
export const getAllCategories = (): TransactionCategory[] => {
  return [
    'Housing', 
    'Food', 
    'Transportation', 
    'Entertainment', 
    'Shopping', 
    'Utilities', 
    'Healthcare', 
    'Education', 
    'Travel', 
    'Investments',
    'Income',
    'Other'
  ];
};

// Format a month string (YYYY-MM) to a readable format
export const formatMonth = (monthStr: string): string => {
  const [year, month] = monthStr.split('-');
  return `${getMonthName(parseInt(month))} ${year}`;
};

// Get month name from month number (1-12)
export const getMonthName = (monthNumber: number): string => {
  const months = [
    'January', 
    'February', 
    'March', 
    'April', 
    'May', 
    'June', 
    'July', 
    'August', 
    'September', 
    'October', 
    'November', 
    'December'
  ];
  
  return months[monthNumber - 1];
};

// Generate previous, current and next month strings
export const getMonthOptions = (): { value: string, label: string }[] => {
  const now = new Date();
  
  // Current month
  const currentMonth = format(now, 'yyyy-MM');
  
  // Previous month
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1);
  const previousMonth = format(prevMonth, 'yyyy-MM');
  
  // Next month
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1);
  const followingMonth = format(nextMonth, 'yyyy-MM');
  
  return [
    { value: previousMonth, label: formatMonth(previousMonth) },
    { value: currentMonth, label: formatMonth(currentMonth) },
    { value: followingMonth, label: formatMonth(followingMonth) }
  ];
};
