import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Transaction, TransactionCategory, CategoryData, BudgetComparisonData, InsightData, CATEGORY_COLORS, Budget } from '../types';
import { generateMockTransactions } from '../utils/mockData';
import { generateMockBudgets } from '../utils/budgetUtils';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

interface TransactionContextType {
  transactions: Transaction[];
  budgets: Budget[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (budget: Budget) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (category: TransactionCategory, month: string) => void;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  categoryData: CategoryData[];
  budgetComparison: BudgetComparisonData[];
  insights: InsightData[];
  recentTransactions: Transaction[];
  currentMonthTransactions: Transaction[];
  getBudgetForCategoryAndMonth: (category: TransactionCategory, month: string) => Budget | undefined;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: React.ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    // Load transactions from localStorage or use mock data
    const savedTransactions = localStorage.getItem('fiscalizer-transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    } else {
      const mockTransactions = generateMockTransactions();
      setTransactions(mockTransactions);
      localStorage.setItem('fiscalizer-transactions', JSON.stringify(mockTransactions));
    }
    
    // Load budgets from localStorage or use mock data
    const savedBudgets = localStorage.getItem('fiscalizer-budgets');
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    } else {
      const mockBudgets = generateMockBudgets();
      setBudgets(mockBudgets);
      localStorage.setItem('fiscalizer-budgets', JSON.stringify(mockBudgets));
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem('fiscalizer-transactions', JSON.stringify(transactions));
    }
  }, [transactions]);
  
  // Save budgets to localStorage whenever they change
  useEffect(() => {
    if (budgets.length > 0) {
      localStorage.setItem('fiscalizer-budgets', JSON.stringify(budgets));
    }
  }, [budgets]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions([...transactions, newTransaction]);
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(
      transactions.map((transaction) =>
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
  };
  
  const addBudget = (budget: Budget) => {
    // Check if a budget for this category and month already exists
    const existingBudgetIndex = budgets.findIndex(
      (b) => b.category === budget.category && b.month === budget.month
    );
    
    if (existingBudgetIndex >= 0) {
      // Update existing budget
      const updatedBudgets = [...budgets];
      updatedBudgets[existingBudgetIndex] = budget;
      setBudgets(updatedBudgets);
    } else {
      // Add new budget
      setBudgets([...budgets, budget]);
    }
  };
  
  const updateBudget = (updatedBudget: Budget) => {
    setBudgets(
      budgets.map((budget) =>
        (budget.category === updatedBudget.category && budget.month === updatedBudget.month) 
          ? updatedBudget 
          : budget
      )
    );
  };
  
  const deleteBudget = (category: TransactionCategory, month: string) => {
    setBudgets(
      budgets.filter((budget) => !(budget.category === category && budget.month === month))
    );
  };
  
  const getBudgetForCategoryAndMonth = (category: TransactionCategory, month: string): Budget | undefined => {
    return budgets.find(budget => budget.category === category && budget.month === month);
  };

  // Calculate totals
  const totalIncome = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const balance = totalIncome - totalExpenses;
  
  // Get recent transactions (last 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // Get current month's transactions
  const currentMonth = format(new Date(), 'yyyy-MM');
  const currentMonthStart = startOfMonth(new Date());
  const currentMonthEnd = endOfMonth(new Date());
  
  const currentMonthTransactions = transactions.filter(transaction => {
    const transactionDate = parseISO(transaction.date);
    return isWithinInterval(transactionDate, { 
      start: currentMonthStart, 
      end: currentMonthEnd 
    });
  });
  
  // Calculate category data for expenses
  const categoryData = useMemo(() => {
    const categoryTotals: Record<TransactionCategory, number> = {} as Record<TransactionCategory, number>;
    let totalExpense = 0;
    
    // Only count expenses (not income) for category breakdown
    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        if (!categoryTotals[transaction.category]) {
          categoryTotals[transaction.category] = 0;
        }
        categoryTotals[transaction.category] += transaction.amount;
        totalExpense += transaction.amount;
      });
    
    // Convert to array with percentages
    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category: category as TransactionCategory,
        amount,
        percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
        color: CATEGORY_COLORS[category as TransactionCategory]
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);
  
  // Calculate budget comparison data
  const budgetComparison = useMemo(() => {
    const currentMonth = format(new Date(), 'yyyy-MM');
    const result: BudgetComparisonData[] = [];
    
    // Get all budgets for current month
    const currentMonthBudgets = budgets.filter(budget => budget.month === currentMonth);
    
    currentMonthBudgets.forEach(budget => {
      // Calculate actual spending for this category in current month
      const actual = currentMonthTransactions
        .filter(t => t.type === 'expense' && t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0);
      
      result.push({
        category: budget.category,
        budgeted: budget.amount,
        actual,
        percentage: budget.amount > 0 ? (actual / budget.amount) * 100 : 0,
        color: CATEGORY_COLORS[budget.category]
      });
    });
    
    return result.sort((a, b) => b.percentage - a.percentage);
  }, [budgets, currentMonthTransactions]);
  
  // Generate insights
  const insights = useMemo(() => {
    const result: InsightData[] = [];
    const currentMonth = format(new Date(), 'yyyy-MM');
    
    // Check if any category is over budget
    const overBudgetCategories = budgetComparison
      .filter(item => item.percentage > 100)
      .sort((a, b) => b.percentage - a.percentage);
    
    if (overBudgetCategories.length > 0) {
      const topOverBudget = overBudgetCategories[0];
      result.push({
        type: 'warning',
        message: `You've exceeded your ${topOverBudget.category} budget by`,
        value: `$${(topOverBudget.actual - topOverBudget.budgeted).toFixed(2)}`,
        icon: '⚠️'
      });
    }
    
    // Find largest expense category
    if (categoryData.length > 0) {
      const largestCategory = categoryData[0];
      result.push({
        type: 'info',
        message: `Your largest expense category is ${largestCategory.category}`,
        value: `${largestCategory.percentage.toFixed(1)}%`,
        icon: '📊'
      });
    }
    
    // Check if spending is within budget overall
    const totalBudgeted = budgetComparison.reduce((sum, item) => sum + item.budgeted, 0);
    const totalActual = budgetComparison.reduce((sum, item) => sum + item.actual, 0);
    
    if (totalBudgeted > 0) {
      if (totalActual <= totalBudgeted) {
        result.push({
          type: 'success',
          message: 'Overall spending is within budget',
          value: `${((totalActual / totalBudgeted) * 100).toFixed(1)}%`,
          icon: '✅'
        });
      } else {
        result.push({
          type: 'warning',
          message: 'Overall spending exceeds budget by',
          value: `$${(totalActual - totalBudgeted).toFixed(2)}`,
          icon: '❗'
        });
      }
    }
    
    // Add a placeholder insight if we don't have enough data
    if (result.length < 2) {
      result.push({
        type: 'info',
        message: 'Set up monthly budgets to get more insights',
        icon: '💡'
      });
    }
    
    return result;
  }, [categoryData, budgetComparison]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        budgets,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addBudget,
        updateBudget,
        deleteBudget,
        totalIncome,
        totalExpenses,
        balance,
        categoryData,
        budgetComparison,
        insights,
        recentTransactions,
        currentMonthTransactions,
        getBudgetForCategoryAndMonth
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
