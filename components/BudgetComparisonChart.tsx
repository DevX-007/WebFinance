import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useTransactions } from '../hooks/useTransactionsDB';

export default function BudgetComparisonChart() {
  const { budgetComparison } = useTransactions();
  
  // Sort data by budget amount
  const sortedData = [...budgetComparison].sort((a, b) => b.budgeted - a.budgeted);
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-md shadow-md border border-gray-200">
          <p className="font-semibold">{data.category}</p>
          <p className="text-sm">Budget: ${data.budgeted.toFixed(2)}</p>
          <p className="text-sm">Actual: ${data.actual.toFixed(2)}</p>
          <p className={`text-xs ${data.actual > data.budgeted ? 'text-red-500' : 'text-green-500'}`}>
            {data.actual > data.budgeted ? 'Over budget' : 'Under budget'}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{
            top: 5,
            right: 30,
            left: 80,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
          <XAxis type="number" tickFormatter={(value) => `$${value}`} />
          <YAxis 
            type="category" 
            dataKey="category" 
            width={80}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="budgeted" name="Budgeted" fill="#85756E" barSize={12} radius={[0, 4, 4, 0]}>
            {sortedData.map((_entry, index) => (
              <Cell key={`budget-${index}`} fill="#85756E" />
            ))}
          </Bar>
          <Bar dataKey="actual" name="Actual" fill="#B59DA4" barSize={12} radius={[0, 4, 4, 0]}>
            {sortedData.map((entry, index) => (
              <Cell 
                key={`actual-${index}`} 
                fill={entry.actual > entry.budgeted ? '#ef4444' : '#10b981'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
