import React from 'react';
import { useTransactions } from '../hooks/useTransactionsDB';
import { format } from 'date-fns';

export default function SummaryCards() {
  const { 
    balance, 
    totalIncome, 
    totalExpenses, 
    categoryData, 
    currentMonthTransactions 
  } = useTransactions();
  
  // Calculate this month's income and expenses
  const currentMonthIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const currentMonthExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Find top spending category
  const topCategory = categoryData.length > 0 ? categoryData[0] : null;
  
  const currentMonth = format(new Date(), 'MMMM yyyy');
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Current Balance */}
      <div className="bg-gradient-to-r from-[#6D3D14] to-[#551B14] text-white p-6 rounded-lg shadow-lg">
        <h3 className="text-sm font-medium opacity-80 mb-1">Current Balance</h3>
        <p className={`text-2xl font-bold ${balance >= 0 ? 'text-[#CDC5B4]' : 'text-[#B59DA4]'}`}>
          ${balance.toFixed(2)}
        </p>
        <div className="mt-2 text-xs opacity-70">Total across all accounts</div>
      </div>
      
      {/* This Month's Income */}
      <div className="bg-white/85 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-[#CDC5B4]">
        <h3 className="text-sm font-medium text-gray-600 mb-1">{currentMonth} Income</h3>
        <p className="text-2xl font-bold text-[#6D3D14]">${currentMonthIncome.toFixed(2)}</p>
        <div className="mt-2 text-xs text-gray-500 flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full mr-1 ${
            currentMonthIncome >= totalIncome / 12 ? 'bg-green-500' : 'bg-red-500'
          }`}></span>
          {currentMonthIncome >= totalIncome / 12 
            ? 'Above average' 
            : 'Below average'}
        </div>
      </div>
      
      {/* This Month's Expenses */}
      <div className="bg-white/85 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-[#CDC5B4]">
        <h3 className="text-sm font-medium text-gray-600 mb-1">{currentMonth} Expenses</h3>
        <p className="text-2xl font-bold text-[#B59DA4]">${currentMonthExpenses.toFixed(2)}</p>
        <div className="mt-2 text-xs text-gray-500 flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full mr-1 ${
            currentMonthExpenses <= totalExpenses / 12 ? 'bg-green-500' : 'bg-red-500'
          }`}></span>
          {currentMonthExpenses <= totalExpenses / 12 
            ? 'Below average' 
            : 'Above average'}
        </div>
      </div>
      
      {/* Top Spending Category */}
      <div className="bg-white/85 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-[#CDC5B4]">
        <h3 className="text-sm font-medium text-gray-600 mb-1">Top Spending Category</h3>
        {topCategory ? (
          <>
            <p className="text-xl font-bold text-gray-800">
              {topCategory.category}
              <span className="ml-2 text-lg font-normal text-gray-600">${topCategory.amount.toFixed(0)}</span>
            </p>
            <div className="mt-2 text-xs text-gray-500">
              {topCategory.percentage.toFixed(1)}% of total expenses
            </div>
          </>
        ) : (
          <p className="text-lg font-medium text-gray-500">No data available</p>
        )}
      </div>
    </div>
  );
}
