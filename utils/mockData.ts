import { Transaction } from '../types';
import { format, subDays, subMonths, addDays } from 'date-fns';

// Generate some initial transactions for demo purposes
export const generateMockTransactions = (): Transaction[] => {
  const currentDate = new Date();
  
  const transactions: Transaction[] = [
    {
      id: '1',
      amount: 2500,
      date: format(currentDate, 'yyyy-MM-dd'),
      description: 'Salary',
      type: 'income',
      category: 'Income'
    },
    {
      id: '2',
      amount: 120,
      date: format(subDays(currentDate, 2), 'yyyy-MM-dd'),
      description: 'Groceries',
      type: 'expense',
      category: 'Food'
    },
    {
      id: '3',
      amount: 45,
      date: format(subDays(currentDate, 3), 'yyyy-MM-dd'),
      description: 'Dinner',
      type: 'expense',
      category: 'Food'
    },
    {
      id: '4',
      amount: 200,
      date: format(subDays(currentDate, 5), 'yyyy-MM-dd'),
      description: 'Freelance work',
      type: 'income',
      category: 'Income'
    },
    {
      id: '5',
      amount: 80,
      date: format(subDays(currentDate, 7), 'yyyy-MM-dd'),
      description: 'Utilities',
      type: 'expense',
      category: 'Utilities'
    },
    {
      id: '6',
      amount: 950,
      date: format(subDays(currentDate, 10), 'yyyy-MM-dd'),
      description: 'Rent payment',
      type: 'expense',
      category: 'Housing'
    },
    {
      id: '7',
      amount: 35,
      date: format(subDays(currentDate, 4), 'yyyy-MM-dd'),
      description: 'Gas',
      type: 'expense',
      category: 'Transportation'
    },
    {
      id: '8',
      amount: 65,
      date: format(subDays(currentDate, 6), 'yyyy-MM-dd'),
      description: 'Cinema and dinner',
      type: 'expense',
      category: 'Entertainment'
    },
    {
      id: '9',
      amount: 120,
      date: format(subDays(currentDate, 8), 'yyyy-MM-dd'),
      description: 'New shoes',
      type: 'expense',
      category: 'Shopping'
    },
    {
      id: '10',
      amount: 85,
      date: format(subDays(currentDate, 12), 'yyyy-MM-dd'),
      description: 'Doctor visit',
      type: 'expense',
      category: 'Healthcare'
    },
    {
      id: '11',
      amount: 200,
      date: format(subDays(currentDate, 15), 'yyyy-MM-dd'),
      description: 'Online course',
      type: 'expense',
      category: 'Education'
    },
    {
      id: '12',
      amount: 300,
      date: format(subDays(currentDate, 20), 'yyyy-MM-dd'),
      description: 'Stock investment',
      type: 'expense',
      category: 'Investments'
    },
    // Previous month transactions for historical data
    {
      id: '13',
      amount: 2500,
      date: format(subMonths(currentDate, 1), 'yyyy-MM-dd'),
      description: 'Last month salary',
      type: 'income',
      category: 'Income'
    },
    {
      id: '14',
      amount: 900,
      date: format(subMonths(currentDate, 1), 'yyyy-MM-dd'),
      description: 'Last month rent',
      type: 'expense',
      category: 'Housing'
    },
    {
      id: '15',
      amount: 450,
      date: format(addDays(subMonths(currentDate, 1), 5), 'yyyy-MM-dd'),
      description: 'Last month groceries',
      type: 'expense',
      category: 'Food'
    }
  ];
  
  return transactions;
};
