import { ReactNode, useState } from 'react';
import { CirclePlus, PiggyBank } from 'lucide-react';
import Header from './Header';
import TransactionForm from './TransactionForm';
import BudgetForm from './BudgetForm';
import AnimatedBackground from './AnimatedBackground';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <Header />
        
        <main className="space-y-6">
          {children}
        </main>
        
        <div className="fixed bottom-6 right-6 flex flex-col space-y-4">
          <button
            onClick={() => setShowAddBudget(true)}
            className="bg-[#85756E] text-white rounded-full p-4 shadow-lg hover:bg-[#6D3D14] transition-colors flex items-center justify-center"
            aria-label="Set budget"
            title="Set Budget"
          >
            <PiggyBank size={24} />
          </button>
          
          <button
            onClick={() => setShowAddTransaction(true)}
            className="bg-[#6D3D14] text-white rounded-full p-4 shadow-lg hover:bg-[#551B14] transition-colors flex items-center justify-center"
            aria-label="Add transaction"
            title="Add Transaction"
          >
            <CirclePlus size={24} />
          </button>
        </div>
        
        {showAddTransaction && (
          <TransactionForm onClose={() => setShowAddTransaction(false)} />
        )}
        
        {showAddBudget && (
          <BudgetForm onClose={() => setShowAddBudget(false)} />
        )}
      </div>
    </div>
  );
}
