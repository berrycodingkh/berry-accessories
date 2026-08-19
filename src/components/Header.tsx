import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingCart,
  Database,
  User as UserIcon,
  LogOut,
  RefreshCw,
  Clock,
  Calendar,
  ChevronDown,
  Layers,
  ExternalLink,
  CheckCircle2,
  Flame
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
    lastGoogleSyncTime,
    settings
  } = useApp();

  const [time, setTime] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [showRateInput, setShowRateInput] = useState(false);
  const [tempRate, setTempRate] = useState(exchangeRate.toString());
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    const KHMER_MONTHS = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
    const updateDateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
      const day = now.getDate();
      const month = KHMER_MONTHS[now.getMonth()];
      const year = now.getFullYear();
      setDateStr(`ថ្ងៃទី ${day} ${month} ${year}`);
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
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
      case 'dashboard': return 'ផ្ទាំងគ្រប់គ្រង Dashboard (Moto Store)';
      case 'pos': return 'POS Terminal (លក់គ្រឿងម៉ូតូ ADV • PCX • SCOOPY)';
      case 'products': return 'បញ្ជីគ្រឿងម៉ូតូ & ស្តុក (Inventory)';
      case 'purchases': return 'នាំចូលគ្រឿងបន្លាស់ (Purchase In)';
      case 'adjustments': return 'កែសម្រួលស្តុក (Stock Adjustments)';
      case 'sales': return 'ប្រវត្តិលក់គ្រឿងម៉ូតូ (Sales History)';
      case 'invoices': return 'វិក្កយបត្រ & បង្កាន់ដៃ (Receipts)';
      case 'customers': return 'អតិថិជន & Moto Clubs (CRM)';
      case 'suppliers': return 'អ្នកផ្គត់ផ្គង់គ្រឿងម៉ូតូ (Suppliers)';
      case 'expenses': return 'គ្រប់គ្រងចំណាយហាង (Expenses)';
      case 'reports': return 'របាយការណ៍ហិរញ្ញវត្ថុ & ចំណេញ (Reports)';
      case 'barcode': return 'បោះពុម្ពស្លាក Barcode (Label Print)';
      case 'settings': return 'ការកំណត់ហាង & Google Sheets DB';
      default: return 'Berry Moto Accessories';
    }
  };

  return (
    <header id="main-header" className="h-16 bg-white border-b border-zinc-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left branding & toggle */}
      <div className="flex items-center gap-3">
        <button
          id="btn-toggle-sidebar"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition cursor-pointer"
          title="Toggle Menu"
        >
          <Layers className="w-5 h-5" />
        </button>

        {/* Dynamic Shop Logo */}
        <div className="flex items-center gap-2.5">
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt="Store Logo"
              className="w-9 h-9 rounded-lg object-cover border border-red-500/30 shadow-xs hidden sm:block"
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-zinc-900 text-red-500 border border-zinc-800 hidden sm:flex items-center justify-center font-black">
              <Flame className="w-5 h-5" />
            </div>
          )}

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-red-600">
                {settings.storeName || 'BERRY MOTO ACCESSORIES'}
              </span>
              {googleSpreadsheet ? (
                <a
                  href={googleSpreadsheet.spreadsheetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden md:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold hover:bg-emerald-100 transition"
                  title="Open Google Spreadsheet"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Google Sheets DB</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              ) : (
                <span className="hidden md:inline-block text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200 font-semibold">
                  Sheets Cloud DB
                </span>
              )}
            </div>
            <h1 className="text-sm sm:text-base font-black text-zinc-900 leading-tight">
              {getViewTitle()}
            </h1>
          </div>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Date and Clock Display */}
        <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-zinc-100/90 border border-zinc-200/80 text-xs font-mono text-zinc-700 shadow-2xs">
          <div className="flex items-center gap-1.5 text-zinc-600 font-sans font-semibold border-r border-zinc-200 pr-2.5">
            <Calendar className="w-3.5 h-3.5 text-red-600" />
            <span>{dateStr}</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-zinc-900 font-mono">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            <span>{time}</span>
          </div>
        </div>

        {/* Currency Switcher Pill with Red Accent */}
        <div className="flex items-center rounded-lg bg-zinc-100 p-1 border border-zinc-200">
          <button
            id="currency-toggle-usd"
            onClick={() => setCurrency('USD')}
            className={`rounded-md px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
              currency === 'USD'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            USD ($)
          </button>
          <button
            id="currency-toggle-khr"
            onClick={() => setCurrency('KHR')}
            className={`rounded-md px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
              currency === 'KHR'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            KHR (៛)
          </button>
        </div>

        {/* Exchange Rate Badge */}
        <div className="relative hidden md:block text-right">
          <button
            id="btn-exchange-rate-badge"
            onClick={() => setShowRateInput(!showRateInput)}
            className="flex flex-col items-end text-right hover:opacity-80 transition cursor-pointer"
            title="Click to edit Exchange Rate"
          >
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Exchange Rate</span>
            <span className="text-xs sm:text-sm font-black text-red-600 font-mono">$1 = {exchangeRate.toLocaleString()} ៛</span>
          </button>

          {showRateInput && (
            <form
              onSubmit={handleRateSave}
              className="absolute right-0 top-11 w-48 p-3 bg-white border border-zinc-200 rounded-xl shadow-xl z-50 flex flex-col gap-2"
            >
              <label className="text-xs text-zinc-700 font-bold">
                កែប្រែអត្រាប្តូរប្រាក់ (Rate):
              </label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  value={tempRate}
                  onChange={e => setTempRate(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 text-xs text-zinc-800 focus:outline-none focus:border-red-500 font-mono font-bold"
                  placeholder="4100"
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </div>

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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 text-xs font-bold transition shadow-xs cursor-pointer"
            title="Sign in with Google & Connect Google Sheets Database"
          >
            <Database className="w-3.5 h-3.5 text-red-500" />
            <span className="hidden sm:inline">
              {isGoogleConnecting ? 'Connecting...' : 'Sheets DB'}
            </span>
          </button>
        )}

        {/* Header POS Quick Access - Racing Red */}
        <button
          id="btn-header-open-pos"
          onClick={() => setCurrentView('pos')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black transition shadow-sm cursor-pointer ${
            currentView === 'pos'
              ? 'bg-red-700 text-white ring-2 ring-red-400 shadow-md'
              : 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/20'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">POS MOTO</span>
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            id="btn-user-profile"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-zinc-100 border border-transparent transition cursor-pointer"
          >
            {googleUser?.photoURL ? (
              <img
                src={googleUser.photoURL}
                alt={googleUser.displayName || 'Google User'}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full border border-red-500/40"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white border border-red-600/30 flex items-center justify-center font-bold text-xs">
                {currentUser ? currentUser.fullName.slice(0, 2).toUpperCase() : <UserIcon className="w-4 h-4" />}
              </div>
            )}
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-zinc-900 leading-tight">
                {googleUser?.displayName || currentUser?.fullName || 'Admin'}
              </div>
              <div className="text-[10px] text-zinc-400 font-medium leading-tight">
                {currentUser?.role || 'Super Admin'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 hidden lg:block" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 top-12 w-64 p-2 bg-white border border-zinc-200 rounded-xl shadow-xl z-50">
              <div className="p-2.5 border-b border-zinc-100">
                <p className="text-xs font-bold text-zinc-900">{googleUser?.displayName || currentUser?.fullName}</p>
                <p className="text-[11px] text-zinc-500">{googleUser?.email || currentUser?.email || 'admin@berrymoto.com'}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 font-semibold">
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
                  className="w-full text-left px-2.5 py-2 text-xs text-zinc-700 hover:bg-zinc-50 rounded-lg transition flex items-center gap-2 cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
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
                  className="w-full text-left px-2.5 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-2 mt-1 cursor-pointer border-t border-zinc-100 pt-2"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
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
