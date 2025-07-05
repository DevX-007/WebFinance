import React from 'react';
import { useTransactions } from '../hooks/useTransactionsDB';

export default function FinancialInsights() {
  const { insights } = useTransactions();
  
  return (
    <div className="space-y-3">
      {insights.map((insight, index) => (
        <div 
          key={index} 
          className={`p-3 rounded-lg flex items-start ${
            insight.type === 'warning' 
              ? 'bg-[#B59DA4]/30 border border-[#B59DA4]' 
              : insight.type === 'success'
                ? 'bg-green-100/60 border border-green-300'
                : 'bg-[#85756E]/20 border border-[#85756E]/40'
          }`}
        >
          <div className="text-xl mr-3">{insight.icon}</div>
          <div>
            <p className="text-sm">{insight.message}</p>
            {insight.value && (
              <p className="text-base font-semibold">{insight.value}</p>
            )}
          </div>
        </div>
      ))}
      
      {insights.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          Add more transactions to see insights
        </div>
      )}
    </div>
  );
}
