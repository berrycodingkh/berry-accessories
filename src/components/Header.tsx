import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingCart,
  Database,
  User as UserIcon,
  LogOut,
  RefreshCw,
  Clock,
  ChevronDown,
  Layers,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onOpenAuthModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenAuthModal }) => {
  const {
    currentView,
    setCurrentView,
    currentUser,
    logout,
    currency,
    setCurrency,
    exchangeRate,
    setExchangeRate,
    googleUser,
    googleSpreadsheet,
    isGoogleSyncing,
    isGoogleConnecting,
    connectGoogleAccount,
    disconnectGoogleAccount,
    syncAllToGoogleSheets,
    lastGoogleSyncTime
  } = useApp();

  const [time, setTime] = useState<string>('');
  const [showRateInput, setShowRateInput] = useState(false);
  const [tempRate, setTempRate] = useState(exchangeRate.toString());
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRateSave = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(tempRate, 10);
    if (!isNaN(num) && num > 1000) {
      setExchangeRate(num);
      setShowRateInput(false);
    }
  };

  // Human readable title based on current view
  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard Overview';
      case 'pos': return 'POS Terminal (លក់ទំនិញ)';
      case 'products': return 'Inventory & Products (ទំនិញ)';
      case 'purchases': return 'Purchase & Stock In (ទិញចូល)';
      case 'adjustments': return 'Stock Adjustments (កែសម្រួលស្តុក)';
      case 'sales': return 'Sales History & Orders (ការលក់)';
      case 'invoices': return 'Invoices & Receipts (វិក្កយបត្រ)';
      case 'customers': return 'Customers (អតិថិជន)';
      case 'suppliers': return 'Suppliers (អ្នកផ្គត់ផ្គង់)';
      case 'expenses': return 'Expense Management (ចំណាយ)';
      case 'reports': return 'Financial Reports (របាយការណ៍)';
      case 'barcode': return 'Barcode Generator (បោះពុម្ពបាកូដ)';
      case 'settings': return 'System Settings & Google Sheets API';
      default: return 'Store Overview';
    }
  };

  return (
    <header id="main-header" className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left branding & toggle */}
      <div className="flex items-center gap-3">
        <button
          id="btn-toggle-sidebar"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
          title="Toggle Menu"
        >
          <Layers className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Store Management</span>
            {googleSpreadsheet ? (
              <a
                href={googleSpreadsheet.spreadsheetUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold hover:bg-emerald-100 transition"
                title="Open Google Spreadsheet"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Google Sheets DB</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            ) : (
              <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
                Google Sheets DB
              </span>
            )}
          </div>
          <h1 className="text-base sm:text-lg font-bold text-slate-800 leading-tight">
            {getViewTitle()}
          </h1>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Clock */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-xs font-mono text-slate-600">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{time}</span>
        </div>

        {/* Currency Switcher Pill */}
        <div className="flex items-center rounded-lg bg-slate-100 p-1">
          <button
            id="currency-toggle-usd"
            onClick={() => setCurrency('USD')}
            className={`rounded px-3 py-1 text-xs font-bold transition ${
              currency === 'USD'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            USD ($)
          </button>
          <button
            id="currency-toggle-khr"
            onClick={() => setCurrency('KHR')}
            className={`rounded px-3 py-1 text-xs font-bold transition ${
              currency === 'KHR'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            KHR (៛)
          </button>
        </div>

        {/* Hairline divider */}
        <div className="hidden md:block h-7 w-px bg-slate-200" />

        {/* Exchange Rate Badge */}
        <div className="relative hidden md:block text-right">
          <button
            id="btn-exchange-rate-badge"
            onClick={() => setShowRateInput(!showRateInput)}
            className="flex flex-col items-end text-right hover:opacity-80 transition cursor-pointer"
            title="Click to edit Exchange Rate"
          >
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Exchange Rate</span>
            <span className="text-xs sm:text-sm font-bold text-blue-600 font-mono">$1 = {exchangeRate.toLocaleString()} ៛</span>
          </button>

          {showRateInput && (
            <form
              onSubmit={handleRateSave}
              className="absolute right-0 top-11 w-48 p-3 bg-white border border-slate-200 rounded-xl shadow-xl z-50 flex flex-col gap-2"
            >
              <label className="text-xs text-slate-600 font-semibold">
                កែប្រែអត្រាប្តូរប្រាក់ (Rate):
              </label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  value={tempRate}
                  onChange={e => setTempRate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  placeholder="4100"
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Hairline divider */}
        <div className="hidden sm:block h-7 w-px bg-slate-200" />

        {/* Google Sheets Live Status & Sync Button */}
        {googleSpreadsheet ? (
          <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 rounded-lg p-1">
            <a
              href={googleSpreadsheet.spreadsheetUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-2 py-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition"
              title={`Open Spreadsheet: ${googleSpreadsheet.title}`}
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden xl:inline">Google Sheets</span>
              <ExternalLink className="w-3 h-3 text-emerald-600" />
            </a>
            <button
              id="btn-quick-sync-sheets"
              onClick={() => syncAllToGoogleSheets()}
              disabled={isGoogleSyncing}
              className="p-1 rounded hover:bg-emerald-100 text-emerald-700 transition cursor-pointer"
              title={lastGoogleSyncTime ? `Last synced: ${lastGoogleSyncTime}. Click to Sync Now.` : 'Click to Sync All Data to Google Sheets'}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGoogleSyncing ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
          </div>
        ) : (
          <button
            id="btn-connect-google-sheets"
            onClick={() => connectGoogleAccount()}
            disabled={isGoogleConnecting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700 text-xs font-bold transition shadow-xs cursor-pointer"
            title="Sign in with Google & Connect Google Sheets Database"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isGoogleConnecting ? 'Connecting...' : 'Connect Sheets DB'}
            </span>
          </button>
        )}

        {/* Header POS Quick Access */}
        <button
          id="btn-header-open-pos"
          onClick={() => setCurrentView('pos')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-sm cursor-pointer ${
            currentView === 'pos'
              ? 'bg-emerald-700 text-white ring-2 ring-emerald-400'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/10'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">POS System</span>
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            id="btn-user-profile"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 border border-transparent transition cursor-pointer"
          >
            {googleUser?.photoURL ? (
              <img
                src={googleUser.photoURL}
                alt={googleUser.displayName || 'Google User'}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full border border-slate-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                {currentUser ? currentUser.fullName.slice(0, 2).toUpperCase() : <UserIcon className="w-4 h-4" />}
              </div>
            )}
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-tight">
                {googleUser?.displayName || currentUser?.fullName || 'Admin'}
              </div>
              <div className="text-[10px] text-slate-400 font-medium leading-tight">
                {currentUser?.role || 'Super Admin'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 top-12 w-64 p-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50">
              <div className="p-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">{googleUser?.displayName || currentUser?.fullName}</p>
                <p className="text-[11px] text-slate-500">{googleUser?.email || currentUser?.email || 'admin@erp-pos.com'}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                    {currentUser?.role || 'Admin'}
                  </span>
                  {googleSpreadsheet && (
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Sheets Connected
                    </span>
                  )}
                </div>
              </div>

              <div className="py-1">
                {googleSpreadsheet && (
                  <a
                    href={googleSpreadsheet.spreadsheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-left px-2.5 py-2 text-xs text-emerald-700 hover:bg-emerald-50 rounded-lg transition flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Database className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Open Live Spreadsheet</span>
                    </span>
                    <ExternalLink className="w-3 h-3 text-emerald-600" />
                  </a>
                )}

                <button
                  id="btn-dropdown-switch-role"
                  onClick={() => {
                    setShowUserDropdown(false);
                    onOpenAuthModal?.();
                  }}
                  className="w-full text-left px-2.5 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition flex items-center gap-2 cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>ប្តូរគណនី / Switch Role</span>
                </button>

                {googleUser && (
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      disconnectGoogleAccount();
                    }}
                    className="w-full text-left px-2.5 py-2 text-xs text-amber-700 hover:bg-amber-50 rounded-lg transition flex items-center gap-2 cursor-pointer"
                  >
                    <Database className="w-3.5 h-3.5 text-amber-600" />
                    <span>Disconnect Google Account</span>
                  </button>
                )}

                <button
                  id="btn-dropdown-logout"
                  onClick={() => {
                    setShowUserDropdown(false);
                    logout();
                  }}
                  className="w-full text-left px-2.5 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition flex items-center gap-2 mt-1 cursor-pointer border-t border-slate-100 pt-2"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>ចាកចេញ / Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
