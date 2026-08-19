import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GOOGLE_APPS_SCRIPT_FULL_CODE } from '../services/googleAppsScriptCode';
import { compressImageFile } from '../utils/imageUtils';
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
  ArrowRight,
  Upload,
  Image as ImageIcon,
  Trash2,
  Flame
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
    stockAdjustments,
    setCurrentView
  } = useApp();

  const [copiedScript, setCopiedScript] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'sheets' | 'users' | 'logs'>('general');
  const [customSheetId, setCustomSheetId] = useState('');

  // Shop Settings Form
  const [storeName, setStoreName] = useState(settings.storeName || 'BERRY MOTO ACCESSORIES');
  const [storeNameKhmer, setStoreNameKhmer] = useState(settings.storeNameKhmer || 'ប៊ែរី គ្រឿងលេងម៉ូតូ (ADV • PCX • SCOOPY • PG-1 • CT125)');
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || '');
  const [phone, setPhone] = useState(settings.phone || '012 888 999 / 098 777 666');
  const [address, setAddress] = useState(settings.address || '#88A, St 271, Khan Chamkarmon, Phnom Penh');
  const [receiptFooter, setReceiptFooter] = useState(settings.receiptFooter || 'Thank you for choosing Berry Moto Accessories! Drive Safe!');
  const [taxRate, setTaxRate] = useState(settings.taxRate || 0);
  const [rateInput, setRateInput] = useState(exchangeRate);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // Logo file upload handler
  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('សូមជ្រើសរើស File រូបភាព (JPG, PNG, WebP)', 'warning');
      return;
    }

    try {
      setIsUploadingLogo(true);
      const base64 = await compressImageFile(file, 400, 400, 0.9);
      setLogoUrl(base64);
      addToast('បាន Upload Logo ជោគជ័យ! សូមចុច Save ដើម្បីរក្សាទុក', 'success');
    } catch (err) {
      console.error('Logo upload error:', err);
      addToast('មិនអាច Upload រូបភាពបានទេ', 'error');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSaveShopSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName,
      storeNameKhmer,
      logoUrl,
      phone,
      address,
      receiptFooter,
      taxRate: Number(taxRate)
    });
    setExchangeRate(Number(rateInput));
    addToast('បានរក្សាទុកព័ត៌មានហាង និង Logo ដោយជោគជ័យ!', 'success');
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
    { name: 'Products (គ្រឿងម៉ូតូ)', rows: products.length, desc: 'បញ្ជីគ្រឿងលេង ADV, PCX, PG-1, CT125' },
    { name: 'Sales (ការលក់)', rows: sales.length, desc: 'វិក្កយបត្រ និងព័ត៌មានលក់' },
    { name: 'SaleItems (មុខទំនិញលក់)', rows: sales.reduce((sum, s) => sum + s.items.length, 0), desc: 'ទិន្នន័យ Item លម្អិតក្នុងវិក្កយបត្រ' },
    { name: 'Purchases (ទិញចូល)', rows: purchases.length, desc: 'ប័ណ្ណទិញទំនិញ និងថ្លៃដើម' },
    { name: 'Customers (អតិថិជន & Club)', rows: customers.length, desc: 'បញ្ជីអតិថិជន និងជំពាក់' },
    { name: 'Suppliers (អ្នកផ្គត់ផ្គង់)', rows: suppliers.length, desc: 'បញ្ជីអ្នកផ្គត់ផ្គង់ និងជំពាក់' },
    { name: 'Expenses (ចំណាយ)', rows: expenses.length, desc: 'ចំណាយទូទៅក្នុងហាង' },
    { name: 'StockAdjustments', rows: stockAdjustments.length, desc: 'កំណត់ត្រាកែសម្រួលស្តុក' },
    { name: 'Settings (ការកំណត់)', rows: 6, desc: 'អត្រាប្តូរប្រាក់ និង Logo ហាង' }
  ];

  return (
    <div id="settings-view" className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-zinc-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-red-600" />
            ការកំណត់ហាង & Google Sheets Database
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-medium">
            គ្រប់គ្រង Logo ហាង, ព័ត៌មានហាង, អត្រាប្តូរប្រាក់ និង Google Sheets Cloud Database
          </p>
        </div>
        {googleSpreadsheet && (
          <a
            href={googleSpreadsheet.spreadsheetUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs self-start sm:self-auto cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Open Google Spreadsheet</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200 gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex-1 min-w-[160px] py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'general' ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <Store className="w-4 h-4 text-red-500" />
          <span>ព័ត៌មានហាង & Logo</span>
        </button>

        <button
          onClick={() => setActiveTab('sheets')}
          className={`flex-1 min-w-[160px] py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'sheets' ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-500" />
          <span>Google Sheets DB</span>
          {googleSpreadsheet && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 min-w-[160px] py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'users' ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <Shield className="w-4 h-4 text-red-500" />
          <span>អ្នកប្រើប្រាស់ & សិទ្ធិ (RBAC)</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex-1 min-w-[160px] py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'logs' ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <Activity className="w-4 h-4 text-zinc-400" />
          <span>កំណត់ត្រាសុវត្ថិភាព (Logs)</span>
        </button>
      </div>

      {/* TAB 1: General & Logo Upload */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveShopSettings} className="space-y-6">
          {/* Logo Upload Section */}
          <div className="p-6 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-4">
            <h2 className="text-xs font-black text-zinc-800 uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-600" />
              Logo ហាង (Store Logo Upload from Computer)
            </h2>
            <p className="text-xs text-zinc-500">
              Logo នេះនឹងត្រូវបង្ហាញនៅលើ POS Terminal, Header, Sidebar, ផ្ទាំង Login និងលើវិក្កយបត្របោះពុម្ព (Print Receipt) ទាំងអស់។
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Current Logo Preview on Light & Dark */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col items-center justify-center gap-3">
                <span className="text-[10px] font-bold uppercase text-zinc-400">Preview លើផ្ទៃស (Light)</span>
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo Preview Light"
                    className="w-24 h-24 rounded-xl object-contain border border-zinc-200 shadow-sm bg-white p-1"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-white border border-dashed border-zinc-300 flex flex-col items-center justify-center text-zinc-400 text-xs">
                    <ImageIcon className="w-8 h-8 text-zinc-300 mb-1" />
                    <span>គ្មាន Logo</span>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center gap-3">
                <span className="text-[10px] font-bold uppercase text-zinc-400">Preview លើផ្ទៃខ្មៅ (Dark Header & Sidebar)</span>
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo Preview Dark"
                    className="w-24 h-24 rounded-xl object-contain border border-red-500/40 shadow-sm bg-zinc-900 p-1"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-zinc-900 border border-dashed border-zinc-700 flex flex-col items-center justify-center text-zinc-500 text-xs">
                    <Flame className="w-8 h-8 text-red-500 mb-1" />
                    <span>Berry Moto</span>
                  </div>
                )}
              </div>

              {/* Upload Drop Area */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-zinc-700">
                  ជ្រើសរើសរូបភាព Logo ពីកុំព្យូទ័រ
                </label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-red-300 hover:border-red-500 bg-red-50/50 hover:bg-red-50 rounded-xl p-4 cursor-pointer transition">
                  <Upload className="w-7 h-7 text-red-600 mb-1.5" />
                  <span className="text-xs font-bold text-red-700">
                    {isUploadingLogo ? 'កំពុងដំណើរការ...' : 'ចុចទីនេះដើម្បី Upload Logo ពី Computer'}
                  </span>
                  <span className="text-[10px] text-zinc-500 mt-1">
                    គាំទ្រ PNG, JPG, WebP, SVG (ទំហំល្អបំផុត 400x400)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileChange}
                    className="hidden"
                  />
                </label>

                {logoUrl && (
                  <button
                    type="button"
                    onClick={() => setLogoUrl('')}
                    className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-bold cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>លុប Logo ចេញ (Remove Logo)</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Store Details Form */}
          <div className="p-6 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-4">
            <h2 className="text-xs font-black text-zinc-800 uppercase tracking-wider flex items-center gap-2">
              <Store className="w-4 h-4 text-red-600" />
              ព័ត៌មានហាង និងបោះពុម្ពវិក្កយបត្រ (Store Information)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  ឈ្មោះហាងជាភាសាអង់គ្លេស (Store Name EN) *
                </label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={e => setStoreName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 font-bold focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  ឈ្មោះហាងជាភាសាខ្មែរ (Store Name Khmer) *
                </label>
                <input
                  type="text"
                  required
                  value={storeNameKhmer}
                  onChange={e => setStoreNameKhmer(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 font-bold focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  លេខទូរស័ព្ទទាក់ទង (Phone Number) *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 font-mono font-bold focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  អត្រាប្តូរប្រាក់ ($1 USD ស្មើនឹងរៀល) *
                </label>
                <input
                  type="number"
                  required
                  value={rateInput}
                  onChange={e => setRateInput(parseInt(e.target.value, 10) || 4100)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-red-600 font-mono font-black focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  អាសយដ្ឋានហាង (Store Address) *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  ពាក្យស្លោកខាងក្រោមវិក្កយបត្រ (Receipt Footer Text)
                </label>
                <input
                  type="text"
                  value={receiptFooter}
                  onChange={e => setReceiptFooter(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-zinc-100">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md shadow-red-600/20 transition transform active:scale-95 cursor-pointer"
              >
                រក្សាទុកការកំណត់ & Logo (Save Changes)
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: Google Sheets Database */}
      {activeTab === 'sheets' && (
        <div className="space-y-6">
          {/* Main Direct Google Sheets Connection Card */}
          <div className="p-6 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-zinc-900">
                    Google Sheets Real-time Cloud Database
                  </h2>
                  <p className="text-xs text-zinc-500">
                    រក្សាទុក និងធ្វើសមកាលកម្មទិន្នន័យគ្រឿងម៉ូតូ ADV/PCX/PG-1/CT125 ការលក់ និងអតិថិជនដោយផ្ទាល់ទៅ Google Sheets
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
                      className="px-3 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-600 text-xs font-semibold transition cursor-pointer"
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
                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      គណនី Google Account
                    </span>
                    <div className="flex items-center gap-2.5">
                      {googleUser?.photoURL ? (
                        <img
                          src={googleUser.photoURL}
                          alt="Google Avatar"
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-full border border-zinc-200"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                          G
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-bold text-zinc-900 leading-tight">
                          {googleUser?.displayName || 'Google User'}
                        </div>
                        <div className="text-[11px] text-zinc-500 font-mono leading-tight">
                          {googleUser?.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      ឈ្មោះ Spreadsheet (Google Drive)
                    </span>
                    <div className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
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

                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      ស្ថានភាព Sync ចុងក្រោយ
                    </span>
                    <div className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>{lastGoogleSyncTime ? `ជោគជ័យនៅម៉ោង ${lastGoogleSyncTime}` : 'ទើបភ្ជាប់ថ្មីៗ'}</span>
                    </div>
                    <span className="text-[11px] text-zinc-500 block mt-1">
                      រាល់ពេលលក់ POS នឹង Sync ចូល Sheet ភ្លាមៗ
                    </span>
                  </div>
                </div>

                {/* Sheets Collections Table */}
                <div className="border border-zinc-200 rounded-xl overflow-hidden">
                  <div className="bg-zinc-50 px-4 py-2.5 border-b border-zinc-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Table className="w-3.5 h-3.5 text-zinc-500" />
                      បញ្ជី Sheet ទាំងអស់ក្នុង Google Sheets Database ({sheetDataCounts.length} Sheets)
                    </span>
                    <span className="text-[11px] text-zinc-500 font-medium">Auto Formatted & Ready</span>
                  </div>
                  <div className="divide-y divide-zinc-100 max-h-60 overflow-y-auto">
                    {sheetDataCounts.map((s, idx) => (
                      <div key={idx} className="px-4 py-2.5 flex items-center justify-between text-xs hover:bg-zinc-50 transition">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span className="font-bold text-zinc-800">{s.name}</span>
                          <span className="text-[11px] text-zinc-400">({s.desc})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-mono font-semibold text-[11px]">
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
              <div className="p-6 rounded-xl bg-zinc-50 border border-zinc-200 text-center space-y-3">
                <FileSpreadsheet className="w-10 h-10 text-zinc-400 mx-auto" />
                <h3 className="text-sm font-bold text-zinc-800">
                  មិនទាន់បានភ្ជាប់ Google Sheets Database
                </h3>
                <p className="text-xs text-zinc-500 max-w-lg mx-auto">
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
            <form onSubmit={handleLinkCustomSheet} className="pt-4 border-t border-zinc-100">
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                ឬភ្ជាប់ទៅកាន់ Spreadsheet ID ផ្ទាល់ខ្លួន (Custom Google Spreadsheet ID)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={customSheetId}
                  onChange={e => setCustomSheetId(e.target.value)}
                  placeholder="ឧ. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                  className="flex-1 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 font-mono focus:outline-none focus:border-red-500 focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={isGoogleSyncing}
                  className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold shadow-xs whitespace-nowrap cursor-pointer"
                >
                  ភ្ជាប់ Spreadsheet នេះ
                </button>
              </div>
            </form>
          </div>

          {/* Alternative Method: Google Apps Script Web App */}
          <div className="p-6 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-red-600" />
                  ជម្រើសបន្ថែម៖ Google Apps Script Web App API (GAS Web App)
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCopyScript}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-zinc-700 cursor-pointer"
              >
                {copiedScript ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedScript ? 'បានចម្លង!' : 'Copy Script Code'}</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-600 mb-1">
                Google Apps Script Web App URL
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={gasUrl}
                  onChange={e => setGasUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="flex-1 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 font-mono focus:outline-none focus:border-red-500 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testingConnection}
                  className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
                  <span>{testingConnection ? 'កំពុងតេស្ត...' : 'តេស្ត Web App'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Users & RBAC */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-zinc-100">
            <div>
              <h2 className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-600" />
                អ្នកប្រើប្រាស់ប្រព័ន្ធ & ការកំណត់សិទ្ធិ (Users & RBAC Roles)
              </h2>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                គ្រប់គ្រងគណនី Cashier សម្រាប់លក់ និងកំណត់សិទ្ធិអ្នកប្រើប្រាស់
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentView('users')}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>+ បង្កើត & គ្រប់គ្រង Cashier ពេញលេញ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-zinc-100 border border-zinc-200 rounded-xl overflow-hidden">
            {users.map(u => (
              <div key={u.userId} className="p-4 flex items-center justify-between hover:bg-zinc-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-900 text-white border border-red-600/30 flex items-center justify-center font-bold text-sm">
                    {u.fullName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-zinc-800">{u.fullName}</h3>
                    <p className="text-[11px] text-zinc-400">@{u.username} • {u.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    u.role === 'Super Admin'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : u.role === 'Manager'
                      ? 'bg-zinc-100 text-zinc-800 border border-zinc-300'
                      : u.role === 'Cashier'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {u.role}
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono">
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
        <div className="p-6 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-red-600" />
            កំណត់ត្រាសកម្មភាពសុវត្ថិភាព (Audit Logs & Action Trail)
          </h2>

          <div className="divide-y divide-zinc-100 border border-zinc-200 rounded-xl overflow-hidden max-h-96 overflow-y-auto">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3 text-xs hover:bg-zinc-50 transition flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-zinc-400">{log.timestamp}</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-mono font-bold text-[10px]">
                    {log.action}
                  </span>
                  <span className="font-bold text-zinc-700">{log.module}:</span>
                  <span className="text-zinc-600">{log.details}</span>
                </div>
                <span className="text-[11px] text-zinc-500 font-medium">By: {log.user}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
