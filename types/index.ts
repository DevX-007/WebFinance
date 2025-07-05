export type TransactionCategory = 
  | 'Housing' 
  | 'Food' 
  | 'Transportation' 
  | 'Entertainment' 
  | 'Shopping' 
  | 'Utilities' 
  | 'Healthcare' 
  | 'Education' 
  | 'Travel' 
  | 'Investments'
  | 'Income'
  | 'Other';

export const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  Housing: '#4B5563',
  Food: '#EF4444',
  Transportation: '#F59E0B',
  Entertainment: '#8B5CF6',
  Shopping: '#EC4899',
  Utilities: '#3B82F6',
  Healthcare: '#10B981',
  Education: '#6366F1',
  Travel: '#F97316',
  Investments: '#14B8A6',
  Income: '#85756E',
  Other: '#9CA3AF'
};

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  type: 'income' | 'expense';
  category: TransactionCategory;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

export interface CategoryData {
  category: TransactionCategory;
  amount: number;
  percentage: number;
  color: string;
}

export interface Budget {
  category: TransactionCategory;
  amount: number;
  month: string; // Format: YYYY-MM
}

export interface BudgetComparisonData {
  category: TransactionCategory;
  budgeted: number;
  actual: number;
  percentage: number;
  color: string;
}

export interface InsightData {
  type: 'info' | 'warning' | 'success';
  message: string;
  value?: string | number;
  icon?: string;
}
