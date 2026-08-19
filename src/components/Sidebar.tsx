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
  AlertCircle,
  Flame,
  Layers,
  Tag,
  Bookmark,
  Scale
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile }) => {
  const { currentView, setCurrentView, logout, products, sales, currentUser, settings } = useApp();

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
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        id="main-sidebar"
        className={`fixed lg:static top-0 bottom-0 left-0 w-64 bg-zinc-950 text-zinc-300 flex-shrink-0 flex flex-col z-50 transition-transform duration-300 ease-in-out border-r border-zinc-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header with Shop Logo */}
        <div className="flex h-18 items-center px-4 border-b border-zinc-800/90 bg-zinc-950">
          {settings.logoUrl ? (
            <div className="relative group shrink-0">
              <img
                src={settings.logoUrl}
                alt="Shop Logo"
                className="w-10 h-10 rounded-lg object-cover border border-red-500/40 shadow-sm shadow-red-900/30"
              />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-zinc-950"></span>
            </div>
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-600 font-black text-white shadow-md shadow-red-600/30">
              <Flame className="w-6 h-6" />
            </div>
          )}

          <div className="ml-3 overflow-hidden">
            <span className="text-sm font-black tracking-tight text-white uppercase truncate block leading-tight">
              {settings.storeName || 'BERRY MOTO'}
            </span>
            <span className="text-[10px] text-red-400 font-bold tracking-wider block truncate">
              ADV • PCX • SCOOPY • PG-1
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-scroll">
          {/* 1. Dashboard */}
          <button
            id="nav-dashboard"
            onClick={() => handleNav('dashboard')}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentView === 'dashboard'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'hover:bg-zinc-900 text-zinc-300 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 mr-3" />
            <span className="text-left flex-1">ផ្ទាំងគ្រប់គ្រង (Dashboard)</span>
          </button>

          {/* 2. Products & Inventory Submenu */}
          <div>
            <button
              id="nav-menu-products"
              onClick={() => toggleSubmenu('products')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                ['products', 'categories', 'brands', 'units', 'purchases', 'barcode', 'adjustments'].includes(currentView)
                  ? 'bg-zinc-900 text-white border border-red-600/30'
                  : 'hover:bg-zinc-900 text-zinc-300 hover:text-white'
              }`}
            >
              <div className="flex items-center">
                <Package className="w-4 h-4 mr-3 text-red-500" />
                <span className="text-left">គ្រឿងម៉ូតូ & ស្តុក (Inventory)</span>
              </div>
              <div className="flex items-center gap-1.5">
                {lowStockCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-red-600 text-white font-black animate-pulse">
                    {lowStockCount}
                  </span>
                )}
                {openSubmenus.products ? <ChevronDown className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />}
              </div>
            </button>

            {openSubmenus.products && (
              <div className="ml-4 mt-1 pl-3 border-l border-zinc-800 space-y-1">
                <button
                  id="nav-sub-product-list"
                  onClick={() => handleNav('products')}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    currentView === 'products' ? 'text-red-400 bg-zinc-900 font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  • បញ្ជីគ្រឿងម៉ូតូ (Parts List)
                </button>
                <button
                  id="nav-sub-categories"
                  onClick={() => handleNav('categories')}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    currentView === 'categories' ? 'text-red-400 bg-zinc-900 font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  • ប្រភេទទំនិញ (Categories)
                </button>
                <button
                  id="nav-sub-brands"
                  onClick={() => handleNav('brands')}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    currentView === 'brands' ? 'text-red-400 bg-zinc-900 font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  • ម៉ាកយីហោ (Brands)
                </button>
                <button
                  id="nav-sub-units"
                  onClick={() => handleNav('units')}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    currentView === 'units' ? 'text-red-400 bg-zinc-900 font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  • ខ្នាតទំនិញ (Units)
                </button>
                <button
                  id="nav-sub-purchases"
                  onClick={() => handleNav('purchases')}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    currentView === 'purchases' ? 'text-red-400 bg-zinc-900 font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  • នាំចូលទំនិញ (Purchase In)
                </button>
                <button
                  id="nav-sub-barcode"
                  onClick={() => handleNav('barcode')}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    currentView === 'barcode' ? 'text-red-400 bg-zinc-900 font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  • បោះពុម្ព Barcode (Print Labels)
                </button>
                <button
                  id="nav-sub-adjustments"
                  onClick={() => handleNav('adjustments')}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    currentView === 'adjustments' ? 'text-red-400 bg-zinc-900 font-bold' : 'text-zinc-400 hover:text-white'
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
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                ['sales', 'invoices'].includes(currentView)
                  ? 'bg-zinc-900 text-white border border-red-600/30'
                  : 'hover:bg-zinc-900 text-zinc-300 hover:text-white'
              }`}
            >
              <div className="flex items-center">
                <ShoppingBag className="w-4 h-4 mr-3 text-red-500" />
                <span className="text-left">ការលក់ & វិក្កយបត្រ (Sales)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-400 font-mono">
                  {sales.length}
                </span>
                {openSubmenus.sales ? <ChevronDown className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />}
              </div>
            </button>

            {openSubmenus.sales && (
              <div className="ml-4 mt-1 pl-3 border-l border-zinc-800 space-y-1">
                <button
                  id="nav-sub-sales-list"
                  onClick={() => handleNav('sales')}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    currentView === 'sales' ? 'text-red-400 bg-zinc-900 font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  • ប្រវត្តិការលក់ (Sales History)
                </button>
                <button
                  id="nav-sub-invoices"
                  onClick={() => handleNav('invoices')}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    currentView === 'invoices' ? 'text-red-400 bg-zinc-900 font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  • បោះពុម្ពវិក្កយបត្រ (Receipts)
                </button>
              </div>
            )}
          </div>

          {/* 4. Purchases direct */}
          <button
            id="nav-purchases-direct"
            onClick={() => handleNav('purchases')}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentView === 'purchases'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'hover:bg-zinc-900 text-zinc-300 hover:text-white'
            }`}
          >
            <Truck className="w-4 h-4 mr-3 text-red-500" />
            <span className="text-left flex-1">បញ្ជាទិញចូល (Purchase In)</span>
          </button>

          {/* 5. Expenses */}
          <button
            id="nav-expenses"
            onClick={() => handleNav('expenses')}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentView === 'expenses'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'hover:bg-zinc-900 text-zinc-300 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4 mr-3 text-red-500" />
            <span className="text-left flex-1">ចំណាយហាង (Expenses)</span>
          </button>

          {/* 6. People (Customers / Suppliers) */}
          <div>
            <button
              id="nav-menu-people"
              onClick={() => toggleSubmenu('people')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                ['customers', 'suppliers'].includes(currentView)
                  ? 'bg-zinc-900 text-white border border-red-600/30'
                  : 'hover:bg-zinc-900 text-zinc-300 hover:text-white'
              }`}
            >
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-3 text-red-500" />
                <span className="text-left">អតិថិជន & អ្នកផ្គត់ផ្គង់</span>
              </div>
              {openSubmenus.people ? <ChevronDown className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />}
            </button>

            {openSubmenus.people && (
              <div className="ml-4 mt-1 pl-3 border-l border-zinc-800 space-y-1">
                <button
                  id="nav-sub-customers"
                  onClick={() => handleNav('customers')}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    currentView === 'customers' ? 'text-red-400 bg-zinc-900 font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  • អតិថិជន (Customers & Club)
                </button>
                <button
                  id="nav-sub-suppliers"
                  onClick={() => handleNav('suppliers')}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    currentView === 'suppliers' ? 'text-red-400 bg-zinc-900 font-bold' : 'text-zinc-400 hover:text-white'
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
            className={`w-full flex items-center px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentView === 'reports'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'hover:bg-zinc-900 text-zinc-300 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4 mr-3 text-red-500" />
            <span className="text-left flex-1">របាយការណ៍ហិរញ្ញវត្ថុ (Reports)</span>
          </button>

          {/* 8. Settings */}
          <button
            id="nav-settings"
            onClick={() => handleNav('settings')}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentView === 'settings'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'hover:bg-zinc-900 text-zinc-300 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4 mr-3 text-red-500" />
            <span className="text-left flex-1">ការកំណត់ & Sheets DB</span>
          </button>
        </nav>

        {/* POS System Banner Button - Racing Red */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-900">
          <button
            id="sidebar-launch-pos"
            onClick={() => handleNav('pos')}
            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 px-4 py-3 font-black text-xs uppercase tracking-wider text-white shadow-lg shadow-red-950/50 transition transform active:scale-98 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            <span>បើកផ្ទាំងលក់ POS MOTO</span>
          </button>
        </div>

        {/* Bottom User Info & Logout */}
        <div className="border-t border-zinc-800/80 p-3 bg-zinc-950">
          <div className="flex items-center justify-between">
            <div className="flex items-center overflow-hidden">
              <div className="h-8 w-8 rounded-lg bg-red-900/40 border border-red-500/40 text-red-300 flex items-center justify-center text-xs font-bold shrink-0">
                {currentUser?.fullName.slice(0, 2).toUpperCase() || 'AD'}
              </div>
              <div className="ml-2.5 overflow-hidden">
                <p className="text-xs font-bold text-white truncate">
                  {currentUser?.fullName || 'Admin'}
                </p>
                <p className="text-[10px] truncate text-zinc-400">
                  {currentUser?.role || 'Super Admin'}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-900 transition cursor-pointer"
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
