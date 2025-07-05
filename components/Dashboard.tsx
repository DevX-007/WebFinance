import React from 'react';
import { useTransactions } from '../hooks/useTransactionsDB';
import CategoryPieChart from './CategoryPieChart';
import BudgetComparisonChart from './BudgetComparisonChart';
import FinancialInsights from './FinancialInsights';
import RecentTransactions from './RecentTransactions';
import SummaryCards from './SummaryCards';
import { format } from 'date-fns';

export default function Dashboard() {
  const { 
    categoryData, 
    budgetComparison
  } = useTransactions();
  
  const currentMonth = format(new Date(), 'MMMM yyyy');
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Top Summary Row */}
      <div className="lg:col-span-3">
        <SummaryCards />
      </div>
      
      {/* First Column - Category Breakdown */}
      <div>
        <div className="bg-white/85 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-[#CDC5B4] h-full">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Expense Categories</h2>
          {categoryData.length > 0 ? (
            <CategoryPieChart />
          ) : (
            <div className="h-60 flex items-center justify-center text-gray-500">
              No expense data available
            </div>
          )}
        </div>
      </div>
      
      {/* Second Column - Budget Comparison */}
      <div>
        <div className="bg-white/85 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-[#CDC5B4] h-full">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Budget vs. Actual ({currentMonth})
          </h2>
          {budgetComparison.length > 0 ? (
            <BudgetComparisonChart />
          ) : (
            <div className="h-60 flex items-center justify-center text-gray-500">
              No budget data available
            </div>
          )}
        </div>
      </div>
      
      {/* Third Column - Insights and Recent Transactions */}
      <div className="space-y-6">
        <div className="bg-white/85 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-[#CDC5B4]">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Financial Insights</h2>
          <FinancialInsights />
        </div>
        
        <div className="bg-white/85 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-[#CDC5B4]">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h2>
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
}
