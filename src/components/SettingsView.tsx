import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GOOGLE_APPS_SCRIPT_FULL_CODE } from '../services/googleAppsScriptCode';
import {
  Settings,
  Database,
  Shield,
  Key,
  Copy,
  Check,
  RefreshCw,
  Store,
  Activity,
  FileCode,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Table,
  FileSpreadsheet,
  Layers,
  ArrowRight
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    exchangeRate,
    setExchangeRate,
    auditLogs,
    users,
    gasUrl,
    setGasUrl,
    testGoogleSheetsConnection,
    addToast,
    googleUser,
    googleSpreadsheet,
    isGoogleConnecting,
    isGoogleSyncing,
    lastGoogleSyncTime,
    connectGoogleAccount,
    disconnectGoogleAccount,
    syncAllToGoogleSheets,
    selectOrCreateGoogleSpreadsheet,
    products,
    sales,
    purchases,
    customers,
    suppliers,
    expenses,
    stockAdjustments
  } = useApp();

  const [copiedScript, setCopiedScript] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'sheets' | 'users' | 'logs'>('sheets');
  const [customSheetId, setCustomSheetId] = useState('');

  // Shop Settings Form
  const [shopName, setShopName] = useState(settings.shopName);
  const [shopNameKhmer, setShopNameKhmer] = useState(settings.shopNameKhmer);
  const [phone, setPhone] = useState(settings.phone);
  const [address, setAddress] = useState(settings.address);
  const [receiptFooter, setReceiptFooter] = useState(settings.receiptFooter);
  const [taxRate, setTaxRate] = useState(settings.taxRate);
  const [rateInput, setRateInput] = useState(exchangeRate);

  const handleSaveShopSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      shopName,
      shopNameKhmer,
      phone,
      address,
      receiptFooter,
      taxRate: Number(taxRate)
    });
    setExchangeRate(Number(rateInput));
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_FULL_CODE);
    setCopiedScript(true);
    addToast('បានចម្លងកូដ Google Apps Script រួចរាល់!', 'success');
    setTimeout(() => setCopiedScript(false), 3000);
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    await testGoogleSheetsConnection();
    setTestingConnection(false);
  };

  const handleLinkCustomSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSheetId.trim()) {
      addToast('សូមបញ្ចូល Spreadsheet ID', 'warning');
      return;
    }
    await selectOrCreateGoogleSpreadsheet(customSheetId.trim());
  };

  const sheetDataCounts = [
    { name: 'Products (ទំនិញ)', rows: products.length, desc: 'បញ្ជីទំនិញ តម្លៃ និងស្តុក' },
    { name: 'Sales (ការលក់)', rows: sales.length, desc: 'វិក្កយបត្រ និងព័ត៌មានលក់' },
    { name: 'SaleItems (មុខទំនិញលក់)', rows: sales.reduce((sum, s) => sum + s.items.length, 0), desc: 'ទិន្នន័យ Item លម្អិតក្នុងវិក្កយបត្រ' },
    { name: 'Purchases (ទិញចូល)', rows: purchases.length, desc: 'ប័ណ្ណទិញទំនិញ និងថ្លៃដើម' },
    { name: 'Customers (អតិថិជន)', rows: customers.length, desc: 'បញ្ជីអតិថិជន និងជំពាក់' },
    { name: 'Suppliers (អ្នកផ្គត់ផ្គង់)', rows: suppliers.length, desc: 'បញ្ជីអ្នកផ្គត់ផ្គង់ និងជំពាក់' },
    { name: 'Expenses (ចំណាយ)', rows: expenses.length, desc: 'ចំណាយទូទៅក្នុងហាង' },
    { name: 'StockAdjustments', rows: stockAdjustments.length, desc: 'កំណត់ត្រាកែសម្រួលស្តុក' },
    { name: 'Settings (ការកំណត់)', rows: 6, desc: 'អត្រាប្តូរប្រាក់ និងព័ត៌មានហាង' }
  ];

  return (
    <div id="settings-view" className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            ការកំណត់ប្រព័ន្ធ & Google Sheets Database
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            គ្រប់គ្រងការតភ្ជាប់ Google Sheets Database, ព័ត៌មានហាង, អត្រាប្តូរប្រាក់ និងគណនីអ្នកប្រើប្រាស់
          </p>
        </div>
        {googleSpreadsheet && (
          <a
            href={googleSpreadsheet.spreadsheetUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs self-start sm:self-auto"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Open Google Spreadsheet</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('sheets')}
          className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'sheets' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-600" />
          <span>Google Sheets Database</span>
          {googleSpreadsheet && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
        </button>

        <button
          onClick={() => setActiveTab('general')}
          className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'general' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Store className="w-4 h-4 text-blue-600" />
          <span>ព័ត៌មានហាង & រូបិយប័ណ្ណ</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'users' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shield className="w-4 h-4 text-purple-600" />
          <span>អ្នកប្រើប្រាស់ & សិទ្ធិ (RBAC)</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'logs' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4 text-slate-600" />
          <span>កំណត់ត្រាសុវត្ថិភាព (Logs)</span>
        </button>
      </div>

      {/* TAB 1: Google Sheets Database */}
      {activeTab === 'sheets' && (
        <div className="space-y-6">
          {/* Main Direct Google Sheets Connection Card */}
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">
                    Google Sheets Real-time Cloud Database
                  </h2>
                  <p className="text-xs text-slate-500">
                    រក្សាទុក និងធ្វើសមកាលកម្មទិន្នន័យទំនិញ ការលក់ និងអតិថិជនដោយផ្ទាល់ទៅ Google Sheets
                  </p>
                </div>
              </div>

              {/* Status Badge & Actions */}
              <div>
                {googleSpreadsheet ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => syncAllToGoogleSheets()}
                      disabled={isGoogleSyncing}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-2 transition cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isGoogleSyncing ? 'animate-spin' : ''}`} />
                      <span>{isGoogleSyncing ? 'កំពុង Sync...' : 'Sync Data Now (ធ្វើបច្ចុប្បន្នភាព)'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => disconnectGoogleAccount()}
                      className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition cursor-pointer"
                    >
                      ផ្តាច់ការតភ្ជាប់
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => connectGoogleAccount()}
                    disabled={isGoogleConnecting}
                    className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-2 transition cursor-pointer"
                  >
                    <Database className="w-4 h-4" />
                    <span>{isGoogleConnecting ? 'កំពុងភ្ជាប់ Google Account...' : 'Sign in with Google & Connect Sheets'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Connection Information */}
            {googleSpreadsheet ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      គណនី Google Account
                    </span>
                    <div className="flex items-center gap-2.5">
                      {googleUser?.photoURL ? (
                        <img
                          src={googleUser.photoURL}
                          alt="Google Avatar"
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-full border border-slate-200"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                          G
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-bold text-slate-800 leading-tight">
                          {googleUser?.displayName || 'Google User'}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono leading-tight">
                          {googleUser?.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      ឈ្មោះ Spreadsheet (Google Drive)
                    </span>
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{googleSpreadsheet.title}</span>
                    </div>
                    <a
                      href={googleSpreadsheet.spreadsheetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1 mt-1"
                    >
                      <span>បើកមើលលើ Google Sheets</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      ស្ថានភាព Sync ចុងក្រោយ
                    </span>
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>{lastGoogleSyncTime ? `ជោគជ័យនៅម៉ោង ${lastGoogleSyncTime}` : 'ទើបភ្ជាប់ថ្មីៗ'}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      រាល់ពេលលក់ POS នឹង Sync ចូល Sheet ភ្លាមៗ
                    </span>
                  </div>
                </div>

                {/* Sheets Collections Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Table className="w-3.5 h-3.5 text-slate-500" />
                      បញ្ជី Sheet ទាំងអស់ក្នុង Google Sheets Database ({sheetDataCounts.length} Sheets)
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">Auto Formatted & Ready</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                    {sheetDataCounts.map((s, idx) => (
                      <div key={idx} className="px-4 py-2.5 flex items-center justify-between text-xs hover:bg-slate-50 transition">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span className="font-bold text-slate-800">{s.name}</span>
                          <span className="text-[11px] text-slate-400">({s.desc})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-semibold text-[11px]">
                            {s.rows} កំណត់ត្រា (Rows)
                          </span>
                          <span className="text-emerald-600 font-semibold text-[11px] flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Synced
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
                <FileSpreadsheet className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">
                  មិនទាន់បានភ្ជាប់ Google Sheets Database
                </h3>
                <p className="text-xs text-slate-500 max-w-lg mx-auto">
                  ចុចប៊ូតុងខាងក្រោមដើម្បី Login ដោយ Google Account របស់អ្នក។ ប្រព័ន្ធនឹងស្វែងរក ឬបង្កើត Spreadsheet ឈ្មោះ <strong>"Khmer POS & ERP Database"</strong> លើ Google Drive របស់អ្នកដោយស្វ័យប្រវត្តិ។
                </p>
                <button
                  type="button"
                  onClick={() => connectGoogleAccount()}
                  disabled={isGoogleConnecting}
                  className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs inline-flex items-center gap-2 transition cursor-pointer"
                >
                  <Database className="w-4 h-4" />
                  <span>{isGoogleConnecting ? 'កំពុងភ្ជាប់ Google Account...' : 'ភ្ជាប់ Google Sheets Database ឥឡូវនេះ'}</span>
                </button>
              </div>
            )}

            {/* Link Custom Sheet ID Option */}
            <form onSubmit={handleLinkCustomSheet} className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ឬភ្ជាប់ទៅកាន់ Spreadsheet ID ផ្ទាល់ខ្លួន (Custom Google Spreadsheet ID)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={customSheetId}
                  onChange={e => setCustomSheetId(e.target.value)}
                  placeholder="ឧ. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={isGoogleSyncing}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs whitespace-nowrap cursor-pointer"
                >
                  ភ្ជាប់ Spreadsheet នេះ
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                * Spreadsheet ID គឺជារបារអក្សរចន្លោះ /d/ និង /edit ក្នុង Link នៃ Google Sheets របស់អ្នក។
              </p>
            </form>
          </div>

          {/* Alternative Method: Google Apps Script Web App */}
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-blue-600" />
                  ជម្រើសបន្ថែម៖ Google Apps Script Web App API (GAS Web App)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  ប្រសិនបើអ្នកចង់ប្រើប្រាស់ Google Apps Script Web App URL ដាច់ដោយឡែក
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyScript}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
              >
                {copiedScript ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedScript ? 'បានចម្លង!' : 'Copy Script Code'}</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Google Apps Script Web App URL
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={gasUrl}
                  onChange={e => setGasUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testingConnection}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
                  <span>{testingConnection ? 'កំពុងតេស្ត...' : 'តេស្ត Web App'}</span>
                </button>
              </div>
            </div>

            <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-emerald-400 font-mono overflow-x-auto max-h-48 overflow-y-auto">
              {GOOGLE_APPS_SCRIPT_FULL_CODE}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 2: General & Currency */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveShopSettings} className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Store className="w-4 h-4 text-blue-600" />
            ព័ត៌មានហាង និងបោះពុម្ពវិក្កយបត្រ (Store Information)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                ឈ្មោះហាងជាភាសាអង់គ្លេស (Store Name EN)
              </label>
              <input
                type="text"
                value={shopName}
                onChange={e => setShopName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                ឈ្មោះហាងជាភាសាខ្មែរ (Store Name Khmer)
              </label>
              <input
                type="text"
                value={shopNameKhmer}
                onChange={e => setShopNameKhmer(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                លេខទូរស័ព្ទទាក់ទង (Phone Number)
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                អត្រាប្តូរប្រាក់ ($1 USD ស្មើនឹងរៀល) *
              </label>
              <input
                type="number"
                value={rateInput}
                onChange={e => setRateInput(parseInt(e.target.value, 10) || 4100)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-blue-600 font-mono font-bold focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-600 mb-1">
                អាសយដ្ឋានហាង (Store Address)
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-600 mb-1">
                ពាក្យស្លោកខាងក្រោមវិក្កយបត្រ (Receipt Footer Text)
              </label>
              <input
                type="text"
                value={receiptFooter}
                onChange={e => setReceiptFooter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition transform active:scale-95 cursor-pointer"
            >
              រក្សាទុកការកំណត់ (Save Changes)
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: Users & RBAC */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-600" />
              អ្នកប្រើប្រាស់ប្រព័ន្ធ & ការកំណត់សិទ្ធិ (Users & RBAC Roles)
            </h2>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {users.map(u => (
              <div key={u.userId} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
                    {u.fullName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">{u.fullName}</h3>
                    <p className="text-[11px] text-slate-400">@{u.username} • {u.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    u.role === 'Super Administrator'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : u.role === 'Manager'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : u.role === 'Cashier'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {u.role}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {u.phone || 'N/A'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Audit Logs */}
      {activeTab === 'logs' && (
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            កំណត់ត្រាសកម្មភាពសុវត្ថិភាព (Audit Logs & Action Trail)
          </h2>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden max-h-96 overflow-y-auto">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3 text-xs hover:bg-slate-50 transition flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-slate-400">{log.timestamp}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-bold text-[10px]">
                    {log.action}
                  </span>
                  <span className="font-bold text-slate-700">{log.module}:</span>
                  <span className="text-slate-600">{log.details}</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">By: {log.user}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
