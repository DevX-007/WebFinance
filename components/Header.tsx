import { useTransactions } from '../hooks/useTransactionsDB';

export default function Header() {
  const { balance, totalIncome, totalExpenses } = useTransactions();
  
  return (
    <header className="bg-gradient-to-r from-[#6D3D14] to-[#551B14] text-white p-6 rounded-lg shadow-lg mb-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4">WebFinance</h1>
        <p className="text-sm opacity-80 mb-6">Your personal finance tracker</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg">
            <p className="text-sm font-medium opacity-80">Current Balance</p>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-[#CDC5B4]' : 'text-[#B59DA4]'}`}>
              ${balance.toFixed(2)}
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg">
            <p className="text-sm font-medium opacity-80">Total Income</p>
            <p className="text-2xl font-bold text-[#CDC5B4]">${totalIncome.toFixed(2)}</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg">
            <p className="text-sm font-medium opacity-80">Total Expenses</p>
            <p className="text-2xl font-bold text-[#B59DA4]">${totalExpenses.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
