import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { PiggyBank, X } from 'lucide-react';
import { TransactionCategory, Budget, CATEGORY_COLORS } from '../types';
import { useTransactions } from '../hooks/useTransactionsDB';
import { getAllCategories, getMonthOptions } from '../utils/budgetUtils';

interface BudgetFormProps {
  onClose: () => void;
  initialCategory?: TransactionCategory;
  initialMonth?: string;
}

export default function BudgetForm({ onClose, initialCategory, initialMonth }: BudgetFormProps) {
  const { addBudget, getBudgetForCategoryAndMonth } = useTransactions();
  const [isOpen, setIsOpen] = useState(true);
  const availableCategories = getAllCategories().filter(cat => cat !== 'Income' && cat !== 'Other');
  const monthOptions = getMonthOptions();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<Budget>({
    defaultValues: {
      category: initialCategory || 'Housing',
      amount: 0,
      month: initialMonth || monthOptions[1].value, // Default to current month
    },
  });

  const selectedCategory = watch('category') as TransactionCategory;
  const selectedMonth = watch('month');

  // Load existing budget if available
  useEffect(() => {
    if (selectedCategory && selectedMonth) {
      const existingBudget = getBudgetForCategoryAndMonth(selectedCategory, selectedMonth);
      if (existingBudget) {
        setValue('amount', existingBudget.amount);
      } else {
        setValue('amount', 0);
      }
    }
  }, [selectedCategory, selectedMonth, getBudgetForCategoryAndMonth, setValue]);

  const onSubmit = (data: Budget) => {
    addBudget(data);
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
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <PiggyBank size={20} className="mr-2 text-[#6D3D14]" />
            Set Budget
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
              Month
            </label>
            <select
              {...register('month', { required: 'Month is required' })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#85756E] focus:border-[#85756E]"
            >
              {monthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.month && (
              <p className="mt-1 text-sm text-red-600">{errors.month.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#85756E] focus:border-[#85756E]"
              style={{ 
                borderLeft: `4px solid ${CATEGORY_COLORS[selectedCategory as TransactionCategory] || '#9CA3AF'}`
              }}
            >
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              {...register('amount', { 
                required: 'Amount is required',
                min: { value: 0, message: 'Amount must be positive' },
                valueAsNumber: true
              })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#85756E] focus:border-[#85756E]"
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
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
              Save Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
