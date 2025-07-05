import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CirclePlus, X } from 'lucide-react';
import { Transaction, TransactionCategory, CATEGORY_COLORS } from '../types';
import { useTransactions } from '../hooks/useTransactionsDB';
import { getAllCategories } from '../utils/budgetUtils';

interface TransactionFormProps {
  transaction?: Transaction;
  onClose: () => void;
  isEditing?: boolean;
}

export default function TransactionForm({ transaction, onClose, isEditing = false }: TransactionFormProps) {
  const { addTransaction, updateTransaction } = useTransactions();
  const [isOpen, setIsOpen] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<Omit<Transaction, 'id'>>({
    defaultValues: {
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      description: '',
      type: 'expense',
      category: 'Food',
    },
  });

  const transactionType = watch('type');
  const selectedCategory = watch('category') as TransactionCategory;

  useEffect(() => {
    if (transaction && isEditing) {
      setValue('amount', transaction.amount);
      setValue('date', transaction.date);
      setValue('description', transaction.description);
      setValue('type', transaction.type);
      setValue('category', transaction.category);
    }
  }, [transaction, isEditing, setValue]);

  // Auto-select "Income" category when type is income
  useEffect(() => {
    if (transactionType === 'income') {
      setValue('category', 'Income');
    } else if (transactionType === 'expense' && selectedCategory === 'Income') {
      setValue('category', 'Food');
    }
  }, [transactionType, selectedCategory, setValue]);

  const onSubmit = (data: Omit<Transaction, 'id'>) => {
    if (isEditing && transaction) {
      updateTransaction({
        ...data,
        id: transaction.id,
      });
    } else {
      addTransaction(data);
    }
    
    reset();
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white rounded-lg shadow-xl w-full max-w-md p-6 transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-95'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
          </h2>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              {...register('type', { required: 'Type is required' })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#85756E] focus:border-[#85756E]"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#85756E] focus:border-[#85756E]"
              disabled={transactionType === 'income'}
              style={{ 
                borderLeft: `4px solid ${CATEGORY_COLORS[selectedCategory] || '#9CA3AF'}`
              }}
            >
              {transactionType === 'income' ? (
                <option value="Income">Income</option>
              ) : (
                getAllCategories()
                  .filter(cat => cat !== 'Income')
                  .map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))
              )}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              {...register('amount', { 
                required: 'Amount is required',
                min: { value: 0.01, message: 'Amount must be greater than 0' },
                valueAsNumber: true
              })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#85756E] focus:border-[#85756E]"
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              {...register('date', { required: 'Date is required' })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#85756E] focus:border-[#85756E]"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              {...register('description', { 
                required: 'Description is required',
                minLength: { value: 3, message: 'Description must be at least 3 characters' }
              })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#85756E] focus:border-[#85756E]"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#85756E] focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-[#6D3D14] hover:bg-[#551B14] focus:outline-none focus:ring-2 focus:ring-[#85756E] focus:ring-offset-2"
            >
              <CirclePlus size={16} className="mr-2" />
              {isEditing ? 'Update' : 'Add'} Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
