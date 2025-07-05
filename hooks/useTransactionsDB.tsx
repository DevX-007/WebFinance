import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Transaction, TransactionCategory, CategoryData, BudgetComparisonData, InsightData, CATEGORY_COLORS, Budget } from '../types';
import { generateMockBudgets } from '../utils/budgetUtils';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

interface TransactionContextType {
  transactions: Transaction[];
  budgets: Budget[];
  loading: boolean;
  error: string | null;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
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
  refreshTransactions: () => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: React.ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API Functions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/transactions');
      const result = await response.json();
      
      if (result.success) {
        setTransactions(result.data || []);
      } else {
        throw new Error(result.error || 'Failed to fetch transactions');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      setError(null);
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setTransactions(prev => [result.data, ...prev]);
      } else {
        throw new Error(result.error || 'Failed to add transaction');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add transaction');
      throw err;
    }
  };

  const updateTransaction = async (transaction: Transaction) => {
    try {
      setError(null);
      const response = await fetch(`/api/transactions/${transaction.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setTransactions(prev => 
          prev.map(t => t.id === transaction.id ? result.data : t)
        );
      } else {
        throw new Error(result.error || 'Failed to update transaction');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update transaction');
      throw err;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        setTransactions(prev => prev.filter(t => t.id !== id));
      } else {
        throw new Error(result.error || 'Failed to delete transaction');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete transaction');
      throw err;
    }
  };

  // Budget functions (still using localStorage)
  const addBudget = (budget: Budget) => {
    const updatedBudgets = [...budgets, budget];
    setBudgets(updatedBudgets);
    localStorage.setItem('fiscalizer-budgets', JSON.stringify(updatedBudgets));
  };

  const updateBudget = (budget: Budget) => {
    const updatedBudgets = budgets.map(b => 
      b.category === budget.category && b.month === budget.month ? budget : b
    );
    setBudgets(updatedBudgets);
    localStorage.setItem('fiscalizer-budgets', JSON.stringify(updatedBudgets));
  };

  const deleteBudget = (category: TransactionCategory, month: string) => {
    const updatedBudgets = budgets.filter(b => 
      !(b.category === category && b.month === month)
    );
    setBudgets(updatedBudgets);
    localStorage.setItem('fiscalizer-budgets', JSON.stringify(updatedBudgets));
  };

  const getBudgetForCategoryAndMonth = (category: TransactionCategory, month: string): Budget | undefined => {
    return budgets.find(b => b.category === category && b.month === month);
  };

  // Initialize data
  useEffect(() => {
    fetchTransactions();
    
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

  // Computed values
  const totalIncome = useMemo(() => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const balance = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);

  const recentTransactions = useMemo(() => {
    return transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);

  const currentMonthTransactions = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    
    return transactions.filter(transaction => {
      const transactionDate = parseISO(transaction.date);
      return isWithinInterval(transactionDate, { start: monthStart, end: monthEnd });
    });
  }, [transactions]);

  const categoryData = useMemo((): CategoryData[] => {
    const expenseTransactions = currentMonthTransactions.filter(t => t.type === 'expense');
    const totalExpenseAmount = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

    if (totalExpenseAmount === 0) return [];

    const categoryTotals = expenseTransactions.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<TransactionCategory, number>);

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category: category as TransactionCategory,
        amount,
        percentage: (amount / totalExpenseAmount) * 100,
        color: CATEGORY_COLORS[category as TransactionCategory]
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [currentMonthTransactions]);

  const budgetComparison = useMemo((): BudgetComparisonData[] => {
    const currentMonth = format(new Date(), 'yyyy-MM');
    const monthlyExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        return acc;
      }, {} as Record<TransactionCategory, number>);

    return budgets
      .filter(budget => budget.month === currentMonth)
      .map(budget => {
        const actualAmount = monthlyExpenses[budget.category] || 0;
        const percentage = budget.amount > 0 ? (actualAmount / budget.amount) * 100 : 0;
        
        return {
          category: budget.category,
          budgeted: budget.amount,
          actual: actualAmount,
          percentage,
          color: CATEGORY_COLORS[budget.category]
        };
      })
      .sort((a, b) => b.percentage - a.percentage);
  }, [budgets, currentMonthTransactions]);

  const insights = useMemo((): InsightData[] => {
    const insights: InsightData[] = [];

    // Budget insights
    budgetComparison.forEach(item => {
      if (item.percentage > 100) {
        insights.push({
          type: 'warning',
          message: `You've exceeded your ${item.category} budget by ${(item.percentage - 100).toFixed(1)}%`,
          value: `$${(item.actual - item.budgeted).toFixed(0)} over budget`,
          icon: '⚠️'
        });
      } else if (item.percentage > 80) {
        insights.push({
          type: 'info',
          message: `You're at ${item.percentage.toFixed(1)}% of your ${item.category} budget`,
          value: `$${(item.budgeted - item.actual).toFixed(0)} remaining`,
          icon: '📊'
        });
      }
    });

    // Spending pattern insights
    if (categoryData.length > 0) {
      const topCategory = categoryData[0];
      insights.push({
        type: 'info',
        message: `${topCategory.category} is your highest expense category this month`,
        value: `$${topCategory.amount.toFixed(0)} (${topCategory.percentage.toFixed(1)}%)`,
        icon: '📈'
      });
    }

    // Income vs Expenses
    const monthlyIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    if (monthlyIncome > 0) {
      const savingsRate = ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100;
      if (savingsRate > 20) {
        insights.push({
          type: 'success',
          message: `Great job! You're saving ${savingsRate.toFixed(1)}% of your income`,
          value: `$${(monthlyIncome - monthlyExpenses).toFixed(0)} saved`,
          icon: '🎉'
        });
      } else if (savingsRate < 0) {
        insights.push({
          type: 'warning',
          message: `You're spending more than you earn this month`,
          value: `$${(monthlyExpenses - monthlyIncome).toFixed(0)} overspent`,
          icon: '🚨'
        });
      }
    }

    return insights.slice(0, 5); // Limit to 5 insights
  }, [budgetComparison, categoryData, currentMonthTransactions]);

  const refreshTransactions = fetchTransactions;

  const value: TransactionContextType = {
    transactions,
    budgets,
    loading,
    error,
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
    getBudgetForCategoryAndMonth,
    refreshTransactions,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
