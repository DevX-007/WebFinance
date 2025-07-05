import React from 'react';
import { format, parseISO } from 'date-fns';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactionsDB';

export default function RecentTransactions() {
  const { recentTransactions } = useTransactions();
  
  if (recentTransactions.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No transactions found
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {recentTransactions.map((transaction) => (
        <div 
          key={transaction.id} 
          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
              transaction.type === 'income' 
                ? 'bg-[#CDC5B4]/50 text-[#6D3D14]' 
                : 'bg-[#B59DA4]/50 text-[#551B14]'
            }`}>
              {transaction.type === 'income' ? (
                <ArrowUpRight size={18} />
              ) : (
                <ArrowDownRight size={18} />
              )}
            </div>
            <div>
              <div className="text-sm font-medium">{transaction.description}</div>
              <div className="text-xs text-gray-500 flex items-center">
                <span className="inline-block rounded-full h-2 w-2 mr-1" style={{ backgroundColor: transaction.category === 'Income' ? '#85756E' : '#B59DA4' }}></span>
                {transaction.category} • {format(parseISO(transaction.date), 'MMM d')}
              </div>
            </div>
          </div>
          <div className={`font-medium ${
            transaction.type === 'income' ? 'text-[#6D3D14]' : 'text-[#B59DA4]'
          }`}>
            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
