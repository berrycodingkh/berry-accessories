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
import { Lock, User as UserIcon, ShieldCheck, Database, ShoppingBag } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentView, currentUser, login, addToast, connectGoogleAccount, isGoogleConnecting } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Login form state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username);
    if (!success) {
      addToast('ឈ្មោះគណនី ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ (Default: admin / admin123)', 'error');
    }
  };

  const handleGoogleLogin = async () => {
    const success = await connectGoogleAccount();
    if (success) {
      login('admin');
    }
  };

  // If user is not authenticated, show Login Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <ToastContainer />
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-xl bg-blue-600 mx-auto flex items-center justify-center text-white shadow-lg shadow-blue-600/20 font-black text-xl">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              DASH-ERP & POS
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              ប្រព័ន្ធគ្រប់គ្រងការលក់ និងស្តុកទំនិញ • Google Sheets Database
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                ឈ្មោះគណនី (Username)
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                ពាក្យសម្ងាត់ (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                គណនីសាកល្បង (Demo Credentials):
              </p>
              <p>• Admin: <strong className="text-slate-800">admin</strong> / <strong className="text-slate-800">admin123</strong></p>
              <p>• Cashier: <strong className="text-slate-800">cashier1</strong> / <strong className="text-slate-800">cashier123</strong></p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition transform active:scale-95 cursor-pointer"
            >
              ចូលប្រើប្រព័ន្ធ (Sign In)
            </button>
          </form>

          {/* Sign in with Google */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-[11px] text-slate-400 uppercase font-semibold">ឬ (Or)</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleConnecting}
            className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-300 shadow-xs transition flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{isGoogleConnecting ? 'Connecting...' : 'Sign in with Google Sheets'}</span>
          </button>

          <div className="text-center pt-1 border-t border-slate-100">
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              Connected with Google Sheets Engine
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <ToastContainer />
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Responsive Sidebar */}
        <Sidebar isOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />

        {/* Dynamic Main Workspace View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
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
