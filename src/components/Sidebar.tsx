import React, { useState } from 'react';
import { useApp, AppView } from '../context/AppContext';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Barcode,
  Truck,
  ArrowUpDown,
  Receipt,
  FileSpreadsheet,
  DollarSign,
  AlertCircle
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile }) => {
  const { currentView, setCurrentView, logout, products, sales, currentUser } = useApp();

  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({
    products: true,
    sales: true,
    people: false,
    settings: false
  });

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;

  const handleNav = (view: AppView) => {
    setCurrentView(view);
    onCloseMobile?.();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          id="sidebar-mobile-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        id="main-sidebar"
        className={`fixed lg:static top-0 bottom-0 left-0 w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center px-6 border-b border-slate-800/80">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 font-bold text-white shadow-sm">
            D
          </div>
          <div className="ml-3">
            <span className="text-base font-bold tracking-tight text-white uppercase block">
              DASH-ERP
            </span>
            <span className="text-[10px] text-emerald-400 font-mono tracking-wider block -mt-1">
              Google Sheets DB
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1 custom-scroll">
          {/* 1. Dashboard */}
          <button
            id="nav-dashboard"
            onClick={() => handleNav('dashboard')}
            className={`w-full flex items-center px-3 py-2.5 rounded-md text-sm transition-colors cursor-pointer ${
              currentView === 'dashboard'
                ? 'bg-slate-800 text-white font-medium shadow-xs'
                : 'hover:bg-slate-800 hover:text-white text-slate-300'
            }`}
          >
            <div className={`h-4 w-4 rounded-xs mr-3 flex items-center justify-center ${
              currentView === 'dashboard' ? 'bg-blue-500' : 'border border-slate-500'
            }`} />
            <span className="text-left">Dashboard (ផ្ទាំងគ្រប់គ្រង)</span>
          </button>

          {/* 2. Products / Inventory Submenu */}
          <div>
            <button
              id="nav-menu-products"
              onClick={() => toggleSubmenu('products')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-colors cursor-pointer ${
                ['products', 'purchases', 'barcode', 'adjustments'].includes(currentView)
                  ? 'bg-slate-800/60 text-white'
                  : 'hover:bg-slate-800 hover:text-white text-slate-300'
              }`}
            >
              <div className="flex items-center">
                <div className={`h-4 w-4 rounded-xs mr-3 flex items-center justify-center ${
                  ['products', 'purchases', 'barcode', 'adjustments'].includes(currentView)
                    ? 'bg-blue-500'
                    : 'border border-slate-500'
                }`} />
                <span className="text-left">Inventory (ទំនិញ)</span>
              </div>
              <div className="flex items-center gap-1.5">
                {lowStockCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-400 font-bold">
                    {lowStockCount}
                  </span>
                )}
                {openSubmenus.products ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              </div>
            </button>

            {openSubmenus.products && (
              <div className="ml-4 mt-1 pl-3 border-l border-slate-800 space-y-1">
                <button
                  id="nav-sub-product-list"
                  onClick={() => handleNav('products')}
                  className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                    currentView === 'products' ? 'text-blue-400 font-semibold bg-slate-800' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  • បញ្ជីផលិតផល (Product List)
                </button>
                <button
                  id="nav-sub-purchases"
                  onClick={() => handleNav('purchases')}
                  className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                    currentView === 'purchases' ? 'text-blue-400 font-semibold bg-slate-800' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  • នាំចូលទំនិញ (Purchase In)
                </button>
                <button
                  id="nav-sub-barcode"
                  onClick={() => handleNav('barcode')}
                  className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                    currentView === 'barcode' ? 'text-blue-400 font-semibold bg-slate-800' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  • ធ្វើ Barcode (Barcode Gen)
                </button>
                <button
                  id="nav-sub-adjustments"
                  onClick={() => handleNav('adjustments')}
                  className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                    currentView === 'adjustments' ? 'text-blue-400 font-semibold bg-slate-800' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  • កែសម្រួលស្តុក (Stock Adjust)
                </button>
              </div>
            )}
          </div>

          {/* 3. Sales Submenu */}
          <div>
            <button
              id="nav-menu-sales"
              onClick={() => toggleSubmenu('sales')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-colors cursor-pointer ${
                ['sales', 'invoices'].includes(currentView)
                  ? 'bg-slate-800/60 text-white'
                  : 'hover:bg-slate-800 hover:text-white text-slate-300'
              }`}
            >
              <div className="flex items-center">
                <div className={`h-4 w-4 rounded-xs mr-3 flex items-center justify-center ${
                  ['sales', 'invoices'].includes(currentView) ? 'bg-blue-500' : 'border border-slate-500'
                }`} />
                <span className="text-left">Sales (លក់)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 font-mono">
                  {sales.length}
                </span>
                {openSubmenus.sales ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              </div>
            </button>

            {openSubmenus.sales && (
              <div className="ml-4 mt-1 pl-3 border-l border-slate-800 space-y-1">
                <button
                  id="nav-sub-sales-list"
                  onClick={() => handleNav('sales')}
                  className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                    currentView === 'sales' ? 'text-blue-400 font-semibold bg-slate-800' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  • ប្រវត្តិការលក់ (Sales List)
                </button>
                <button
                  id="nav-sub-invoices"
                  onClick={() => handleNav('invoices')}
                  className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                    currentView === 'invoices' ? 'text-blue-400 font-semibold bg-slate-800' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  • ចេញវិក្កយបត្រ (Invoices)
                </button>
              </div>
            )}
          </div>

          {/* 4. Purchases direct */}
          <button
            id="nav-purchases-direct"
            onClick={() => handleNav('purchases')}
            className={`w-full flex items-center px-3 py-2.5 rounded-md text-sm transition-colors cursor-pointer ${
              currentView === 'purchases'
                ? 'bg-slate-800 text-white font-medium shadow-xs'
                : 'hover:bg-slate-800 hover:text-white text-slate-300'
            }`}
          >
            <div className={`h-4 w-4 rounded-xs mr-3 flex items-center justify-center ${
              currentView === 'purchases' ? 'bg-blue-500' : 'border border-slate-500'
            }`} />
            <span className="text-left">Purchase (បញ្ជាទិញ)</span>
          </button>

          {/* 5. Expenses */}
          <button
            id="nav-expenses"
            onClick={() => handleNav('expenses')}
            className={`w-full flex items-center px-3 py-2.5 rounded-md text-sm transition-colors cursor-pointer ${
              currentView === 'expenses'
                ? 'bg-slate-800 text-white font-medium shadow-xs'
                : 'hover:bg-slate-800 hover:text-white text-slate-300'
            }`}
          >
            <div className={`h-4 w-4 rounded-xs mr-3 flex items-center justify-center ${
              currentView === 'expenses' ? 'bg-blue-500' : 'border border-slate-500'
            }`} />
            <span className="text-left">Expenses (ចំណាយ)</span>
          </button>

          {/* 6. People (Customers / Suppliers) */}
          <div>
            <button
              id="nav-menu-people"
              onClick={() => toggleSubmenu('people')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-colors cursor-pointer ${
                ['customers', 'suppliers'].includes(currentView)
                  ? 'bg-slate-800/60 text-white'
                  : 'hover:bg-slate-800 hover:text-white text-slate-300'
              }`}
            >
              <div className="flex items-center">
                <div className={`h-4 w-4 rounded-xs mr-3 flex items-center justify-center ${
                  ['customers', 'suppliers'].includes(currentView) ? 'bg-blue-500' : 'border border-slate-500'
                }`} />
                <span className="text-left">People (មនុស្ស)</span>
              </div>
              {openSubmenus.people ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            {openSubmenus.people && (
              <div className="ml-4 mt-1 pl-3 border-l border-slate-800 space-y-1">
                <button
                  id="nav-sub-customers"
                  onClick={() => handleNav('customers')}
                  className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                    currentView === 'customers' ? 'text-blue-400 font-semibold bg-slate-800' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  • អតិថិជន (Customers)
                </button>
                <button
                  id="nav-sub-suppliers"
                  onClick={() => handleNav('suppliers')}
                  className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                    currentView === 'suppliers' ? 'text-blue-400 font-semibold bg-slate-800' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  • អ្នកផ្គត់ផ្គង់ (Suppliers)
                </button>
              </div>
            )}
          </div>

          {/* 7. Reports */}
          <button
            id="nav-reports"
            onClick={() => handleNav('reports')}
            className={`w-full flex items-center px-3 py-2.5 rounded-md text-sm transition-colors cursor-pointer ${
              currentView === 'reports'
                ? 'bg-slate-800 text-white font-medium shadow-xs'
                : 'hover:bg-slate-800 hover:text-white text-slate-300'
            }`}
          >
            <div className={`h-4 w-4 rounded-xs mr-3 flex items-center justify-center ${
              currentView === 'reports' ? 'bg-blue-500' : 'border border-slate-500'
            }`} />
            <span className="text-left">Reports (របាយការណ៍)</span>
          </button>

          {/* 8. Settings */}
          <button
            id="nav-settings"
            onClick={() => handleNav('settings')}
            className={`w-full flex items-center px-3 py-2.5 rounded-md text-sm transition-colors cursor-pointer ${
              currentView === 'settings'
                ? 'bg-slate-800 text-white font-medium shadow-xs'
                : 'hover:bg-slate-800 hover:text-white text-slate-300'
            }`}
          >
            <div className={`h-4 w-4 rounded-xs mr-3 flex items-center justify-center ${
              currentView === 'settings' ? 'bg-blue-500' : 'border border-slate-500'
            }`} />
            <span className="text-left">Settings (ការកំណត់)</span>
          </button>
        </nav>

        {/* POS System Banner Button */}
        <div className="p-4">
          <button
            id="sidebar-launch-pos"
            onClick={() => handleNav('pos')}
            className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 font-bold text-white hover:bg-emerald-700 shadow-lg shadow-emerald-900/20 transition cursor-pointer"
          >
            <span className="mr-2">🛒</span> POS SYSTEM
          </button>
        </div>

        {/* Bottom User Info & Logout */}
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center overflow-hidden">
              <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {currentUser?.fullName.slice(0, 2).toUpperCase() || 'AD'}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">
                  {currentUser?.fullName || 'Admin'} ({currentUser?.role || 'Super Admin'})
                </p>
                <p className="text-[10px] truncate text-slate-400">
                  {currentUser?.email || 'admin@erp-pos.com'}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-400 transition cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
