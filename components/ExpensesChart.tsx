import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTransactions } from '../hooks/useTransactionsDB';
import { MonthlyData } from '../types';
import { format, parseISO, getMonth, getYear } from 'date-fns';

export default function ExpensesChart() {
  const { transactions } = useTransactions();
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    const calculateMonthlyData = () => {
      const data: Record<string, MonthlyData> = {};
      
      // Get current year
      const currentYear = getYear(new Date());
      
      // Initialize all months for the current year
      for (let i = 0; i < 12; i++) {
        const monthKey = `${currentYear}-${String(i + 1).padStart(2, '0')}`;
        data[monthKey] = {
          month: format(new Date(currentYear, i, 1), 'MMM'),
          income: 0,
          expense: 0,
        };
      }
      
      // Populate with actual data
      transactions.forEach((transaction) => {
        const date = parseISO(transaction.date);
        const year = getYear(date);
        
        // Only process transactions from the current year
        if (year === currentYear) {
          const month = getMonth(date);
          const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
          
          if (!data[monthKey]) {
            data[monthKey] = {
              month: format(date, 'MMM'),
              income: 0,
              expense: 0,
            };
          }
          
          if (transaction.type === 'income') {
            data[monthKey].income += transaction.amount;
          } else {
            data[monthKey].expense += transaction.amount;
          }
        }
      });
      
      // Convert to array and sort by month
      return Object.values(data).sort((a, b) => {
        const monthA = new Date(`${a.month} 1, ${currentYear}`).getTime();
        const monthB = new Date(`${b.month} 1, ${currentYear}`).getTime();
        return monthA - monthB;
      });
    };
    
    setMonthlyData(calculateMonthlyData());
  }, [transactions]);

  return (
    <div className="bg-white/85 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-[#CDC5B4]">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Monthly Overview ({getYear(new Date())})</h2>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
            />
            <Legend />
            <Bar dataKey="income" fill="#85756E" name="Income" />
            <Bar dataKey="expense" fill="#B59DA4" name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
