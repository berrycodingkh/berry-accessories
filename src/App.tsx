import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/ToastContainer';
import { DashboardView } from './components/DashboardView';
import { ProductsView } from './components/ProductsView';
import { PurchasesView } from './components/PurchasesView';
import { StockAdjustmentsView } from './components/StockAdjustmentsView';
import { SalesView } from './components/SalesView';
import { POSView } from './components/POSView';
import { InvoicesView } from './components/InvoicesView';
import { CustomersView } from './components/CustomersView';
import { SuppliersView } from './components/SuppliersView';
import { ExpensesView } from './components/ExpensesView';
import { ReportsView } from './components/ReportsView';
import { BarcodeGeneratorView } from './components/BarcodeGeneratorView';
import { CategoriesBrandsView } from './components/CategoriesBrandsView';
import { SettingsView } from './components/SettingsView';
import { UsersView } from './components/UsersView';
import { LoginScreen } from './components/LoginScreen';

const MainLayout: React.FC = () => {
  const { currentView, currentUser, theme } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // If user is not authenticated, show dedicated Admin / Cashier Login Screen
  if (!currentUser) {
    return (
      <>
        <ToastContainer />
        <LoginScreen />
      </>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      theme === 'dark' ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-100 text-slate-800'
    }`}>
      <ToastContainer />
      <Header onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

      <div className="flex-1 flex overflow-hidden">
        {/* Responsive Sidebar */}
        <Sidebar isOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />

        {/* Dynamic Main Workspace View */}
        <main className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 transition-colors duration-200 ${
          theme === 'dark' ? 'bg-zinc-900/60 text-zinc-100' : 'bg-slate-50 text-slate-800'
        }`}>
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'pos' && <POSView />}
          {currentView === 'products' && <ProductsView />}
          {currentView === 'categories' && <CategoriesBrandsView initialTab="categories" />}
          {currentView === 'brands' && <CategoriesBrandsView initialTab="brands" />}
          {currentView === 'units' && <CategoriesBrandsView initialTab="units" />}
          {currentView === 'purchases' && <PurchasesView />}
          {currentView === 'adjustments' && <StockAdjustmentsView />}
          {currentView === 'sales' && <SalesView />}
          {currentView === 'invoices' && <InvoicesView />}
          {currentView === 'customers' && <CustomersView />}
          {currentView === 'suppliers' && <SuppliersView />}
          {currentView === 'users' && <UsersView />}
          {currentView === 'expenses' && <ExpensesView />}
          {currentView === 'reports' && <ReportsView />}
          {currentView === 'barcode' && <BarcodeGeneratorView />}
          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
