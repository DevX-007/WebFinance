import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { ArrowDownRight, ArrowUpRight, Filter, Pencil, Trash2 } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactionsDB';
import { Transaction, CATEGORY_COLORS } from '../types';
import TransactionForm from './TransactionForm';

export default function TransactionList() {
  const { transactions, deleteTransaction } = useTransactions();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense' | 'category'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Get unique categories from transactions
  const categories = Array.from(new Set(transactions.map(t => t.category)));

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter((transaction) => {
      if (filter === 'all') return true;
      if (filter === 'income') return transaction.type === 'income';
      if (filter === 'expense') return transaction.type === 'expense';
      if (filter === 'category') return categoryFilter === 'all' || transaction.category === categoryFilter;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
    });

  const handleSort = (column: 'date' | 'amount') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'income' || value === 'expense' || value === 'all') {
      setFilter(value);
    } else {
      setFilter('category');
      setCategoryFilter(value);
    }
  };

  return (
    <div className="bg-white/85 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-[#CDC5B4]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Transactions</h2>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-3 text-gray-400" />
            <select
              value={filter === 'category' ? categoryFilter : filter}
              onChange={handleFilterChange}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#85756E] focus:border-[#85756E]"
            >
              <option value="all">All Transactions</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
              <optgroup label="By Category">
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No transactions found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Type</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Description</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Category</th>
                <th 
                  className="px-4 py-2 text-left text-sm font-medium text-gray-500 cursor-pointer"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center">
                    Amount
                    {sortBy === 'amount' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-2 text-left text-sm font-medium text-gray-500 cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center">
                    Date
                    {sortBy === 'date' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.type === 'income'
                        ? 'bg-[#CDC5B4] text-[#551B14]'
                        : 'bg-[#B59DA4] text-[#551B14]'
                    }`}>
                      {transaction.type === 'income' ? (
                        <ArrowUpRight size={12} className="mr-1" />
                      ) : (
                        <ArrowDownRight size={12} className="mr-1" />
                      )}
                      {transaction.type === 'income' ? 'Income' : 'Expense'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{transaction.description}</td>
                  <td className="px-4 py-3 text-sm">
                    <span 
                      className="inline-block px-2 py-1 rounded-md text-xs"
                      style={{
                        backgroundColor: `${CATEGORY_COLORS[transaction.category]}20`,
                        color: CATEGORY_COLORS[transaction.category],
                        border: `1px solid ${CATEGORY_COLORS[transaction.category]}40`
                      }}
                    >
                      {transaction.category}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-sm font-medium ${
                    transaction.type === 'income' ? 'text-[#6D3D14]' : 'text-[#B59DA4]'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {format(parseISO(transaction.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="text-[#85756E] hover:text-[#6D3D14]"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-[#B59DA4] hover:text-[#551B14]"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingTransaction && (
        <TransactionForm
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          isEditing
        />
      )}
    </div>
  );
}
