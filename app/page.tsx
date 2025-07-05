'use client';

import { useState } from 'react';
import Layout from '../components/Layout';
import TransactionList from '../components/TransactionList';
import ExpensesChart from '../components/ExpensesChart';
import Dashboard from '../components/Dashboard';
import { TransactionProvider } from '../hooks/useTransactionsDB';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { BarChart3, LayoutDashboard, List } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <TransactionProvider>
      <Layout>
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-white/60 backdrop-blur-sm p-1 rounded-lg border border-[#CDC5B4]">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-[#6D3D14] data-[state=active]:text-white">
              <LayoutDashboard size={16} className="mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-[#6D3D14] data-[state=active]:text-white">
              <List size={16} className="mr-2" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="charts" className="data-[state=active]:bg-[#6D3D14] data-[state=active]:text-white">
              <BarChart3 size={16} className="mr-2" />
              Charts
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="mt-4">
            <Dashboard />
          </TabsContent>
          
          <TabsContent value="transactions" className="mt-4">
            <TransactionList />
          </TabsContent>
          
          <TabsContent value="charts" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExpensesChart />
            </div>
          </TabsContent>
        </Tabs>
      </Layout>
    </TransactionProvider>
  );
}
