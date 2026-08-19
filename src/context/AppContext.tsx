import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Product,
  Category,
  Brand,
  Unit,
  Customer,
  Supplier,
  Purchase,
  Sale,
  Expense,
  ExpenseCategory,
  StockAdjustment,
  StockMovement,
  User,
  AppSettings,
  AuditLog,
  UserRole
} from '../types';
import {
  DatabaseService,
  generateCustomId,
  generateDateBasedId
} from '../services/googleSheetsDatabase';
import {
  GoogleSheetsDirectApi,
  GoogleSpreadsheetInfo
} from '../services/googleSheetsDirectApi';
import {
  initAuth,
  googleSignIn,
  googleSignOut,
  getAccessToken,
  setAccessTokenInMemory
} from '../services/googleAuth';

export type AppView =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'brands'
  | 'units'
  | 'purchases'
  | 'barcode'
  | 'adjustments'
  | 'sales'
  | 'invoices'
  | 'expenses'
  | 'people'
  | 'customers'
  | 'suppliers'
  | 'reports'
  | 'settings'
  | 'pos';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  khmerMessage?: string;
}

export interface GoogleUserProfile {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (username: string, role?: UserRole) => boolean;
  logout: () => void;
  
  // Data
  products: Product[];
  categories: Category[];
  brands: Brand[];
  units: Unit[];
  customers: Customer[];
  suppliers: Supplier[];
  purchases: Purchase[];
  sales: Sale[];
  expenses: Expense[];
  expenseCategories: ExpenseCategory[];
  stockAdjustments: StockAdjustment[];
  stockMovements: StockMovement[];
  users: User[];
  settings: AppSettings;
  auditLogs: AuditLog[];
  
  // Currency & Formatter
  currency: 'USD' | 'KHR';
  setCurrency: (c: 'USD' | 'KHR') => void;
  exchangeRate: number;
  setExchangeRate: (rate: number) => void;
  formatPrice: (amountUSD: number) => string;
  formatUSD: (amount: number) => string;
  formatKHR: (amount: number) => string;
  getKHR: (amountUSD: number) => number;
  
  // CRUD Actions
  addProduct: (product: Omit<Product, 'productId' | 'createdDate'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  createCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  createBrand: (brand: Omit<Brand, 'id'>) => void;
  updateBrand: (brand: Brand) => void;
  deleteBrand: (brandId: string) => void;
  createUnit: (unit: Omit<Unit, 'id'>) => void;
  updateUnit: (unit: Unit) => void;
  deleteUnit: (unitId: string) => void;
  adjustStock: (adjustment: Omit<StockAdjustment, 'adjustmentId' | 'date'>) => void;
  createPurchase: (purchase: Omit<Purchase, 'purchaseId' | 'date'>) => void;
  createSale: (sale: Omit<Sale, 'saleId' | 'invoiceNumber' | 'date'>) => Sale;
  returnSale: (saleId: string, reason: string) => void;
  createCustomer: (customer: Omit<Customer, 'customerId' | 'createdDate' | 'totalPurchased'>) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (customerId: string) => void;
  createSupplier: (supplier: Omit<Supplier, 'supplierId' | 'createdDate'>) => void;
  updateSupplier: (supplier: Supplier) => void;
  deleteSupplier: (supplier: string) => void;
  createExpense: (expense: Omit<Expense, 'expenseId' | 'date' | 'amountKHR'>) => void;
  deleteExpense: (expenseId: string) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  createUser: (user: Omit<User, 'userId' | 'createdDate'>) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  
  // Toasts
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info', khmerMessage?: string) => void;
  removeToast: (id: string) => void;
  
  // Google Sheets Direct API & OAuth
  googleUser: GoogleUserProfile | null;
  googleSpreadsheet: GoogleSpreadsheetInfo | null;
  isGoogleConnecting: boolean;
  isGoogleSyncing: boolean;
  lastGoogleSyncTime: string | null;
  connectGoogleAccount: () => Promise<boolean>;
  disconnectGoogleAccount: () => Promise<void>;
  syncAllToGoogleSheets: () => Promise<boolean>;
  selectOrCreateGoogleSpreadsheet: (sheetId?: string) => Promise<boolean>;

  // Google Apps Script Web App API Sync (Legacy/Alternative)
  gasUrl: string;
  setGasUrl: (url: string) => void;
  testGoogleSheetsConnection: (customUrl?: string) => Promise<boolean>;
  syncWithGoogleSheets: (customUrl?: string) => Promise<boolean>;
  isSyncing: boolean;
  selectedInvoiceForPrint: Sale | null;
  setSelectedInvoiceForPrint: (sale: Sale | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const initialState = DatabaseService.loadAllState();

  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(initialState.currentUser);
  
  const [products, setProducts] = useState<Product[]>(initialState.products);
  const [categories, setCategories] = useState<Category[]>(initialState.categories);
  const [brands, setBrands] = useState<Brand[]>(initialState.brands);
  const [units, setUnits] = useState<Unit[]>(initialState.units);
  const [customers, setCustomers] = useState<Customer[]>(initialState.customers);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialState.suppliers);
  const [purchases, setPurchases] = useState<Purchase[]>(initialState.purchases);
  const [sales, setSales] = useState<Sale[]>(initialState.sales);
  const [expenses, setExpenses] = useState<Expense[]>(initialState.expenses);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>(initialState.expenseCategories);
  const [stockAdjustments, setStockAdjustments] = useState<StockAdjustment[]>(initialState.stockAdjustments);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(initialState.stockMovements);
  const [users, setUsers] = useState<User[]>(initialState.users);
  const [settings, setSettings] = useState<AppSettings>(initialState.settings);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialState.auditLogs);
  
  const [currency, setCurrency] = useState<'USD' | 'KHR'>(initialState.settings.currency || 'USD');
  const [exchangeRate, setExchangeRateState] = useState<number>(initialState.settings.exchangeRate || 4100);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<Sale | null>(null);

  // Google Sheets Direct Integration State
  const [googleUser, setGoogleUser] = useState<GoogleUserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('khmer_pos_google_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [googleSpreadsheet, setGoogleSpreadsheet] = useState<GoogleSpreadsheetInfo | null>(() => {
    try {
      const saved = localStorage.getItem('khmer_pos_google_sheet');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isGoogleConnecting, setIsGoogleConnecting] = useState<boolean>(false);
  const [isGoogleSyncing, setIsGoogleSyncing] = useState<boolean>(false);
  const [lastGoogleSyncTime, setLastGoogleSyncTime] = useState<string | null>(() => {
    return localStorage.getItem('khmer_pos_last_sync') || null;
  });

  const [gasUrl, setGasUrlState] = useState<string>(initialState.settings.googleAppsScriptUrl || '');

  const setGasUrl = (url: string) => {
    setGasUrlState(url);
    setSettings(prev => ({ ...prev, googleAppsScriptUrl: url }));
  };

  // Auth listener on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser({
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        });
        localStorage.setItem('khmer_pos_google_user', JSON.stringify({
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        }));
      },
      () => {
        // Not active or logged out
      }
    );
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Sync to local storage
  useEffect(() => { DatabaseService.saveProducts(products); }, [products]);
  useEffect(() => { DatabaseService.saveSales(sales); }, [sales]);
  useEffect(() => { DatabaseService.savePurchases(purchases); }, [purchases]);
  useEffect(() => { DatabaseService.saveExpenses(expenses); }, [expenses]);
  useEffect(() => { DatabaseService.saveCustomers(customers); }, [customers]);
  useEffect(() => { DatabaseService.saveSuppliers(suppliers); }, [suppliers]);
  useEffect(() => { DatabaseService.saveStockMovements(stockMovements); }, [stockMovements]);
  useEffect(() => { DatabaseService.saveStockAdjustments(stockAdjustments); }, [stockAdjustments]);
  useEffect(() => { DatabaseService.saveCategories(categories); }, [categories]);
  useEffect(() => { DatabaseService.saveBrands(brands); }, [brands]);
  useEffect(() => { DatabaseService.saveUnits(units); }, [units]);
  useEffect(() => { DatabaseService.saveUsers(users); }, [users]);
  useEffect(() => { DatabaseService.saveSettings(settings); }, [settings]);
  useEffect(() => { DatabaseService.saveAuditLogs(auditLogs); }, [auditLogs]);
  useEffect(() => { DatabaseService.saveCurrentUser(currentUser); }, [currentUser]);

  // Toast manager
  const addToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', khmerMessage?: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts(prev => [...prev, { id, type, message, khmerMessage }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Helper log audit
  const logAction = (action: string, module: string, recordId: string, details: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      user: currentUser ? currentUser.fullName : (googleUser ? (googleUser.displayName || googleUser.email || 'Google User') : 'System'),
      action,
      module,
      recordId,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Currency helpers
  const formatUSD = (amount: number) => DatabaseService.formatUSD(amount);
  const formatKHR = (amount: number) => DatabaseService.formatKHR(amount);
  const getKHR = (amountUSD: number) => DatabaseService.convertUSDToKHR(amountUSD, exchangeRate);
  
  const formatPrice = (amountUSD: number) => {
    if (currency === 'KHR') {
      return formatKHR(getKHR(amountUSD));
    }
    return formatUSD(amountUSD);
  };

  const setExchangeRate = (newRate: number) => {
    setExchangeRateState(newRate);
    setSettings(prev => ({ ...prev, exchangeRate: newRate }));
    addToast(`អត្រាប្តូរប្រាក់ត្រូវបានកែប្រែ: 1 USD = ${newRate.toLocaleString()} KHR`, 'success');
  };

  // Google Sheets Direct Connect Flow
  const connectGoogleAccount = async (): Promise<boolean> => {
    setIsGoogleConnecting(true);
    try {
      const authResult = await googleSignIn();
      
      // If user cancelled or closed the popup window
      if (authResult.cancelled) {
        setIsGoogleConnecting(false);
        addToast('ការចូលគណនី Google ត្រូវបានផ្អាក', 'info', 'Google sign-in was cancelled');
        return false;
      }

      if (authResult.blocked) {
        setIsGoogleConnecting(false);
        addToast('កម្មវិធីរុករក (Browser) បានទប់ស្កាត់ Pop-up។ សូមអនុញ្ញាត (Allow Popups) រួចព្យាយាមម្តងទៀត។', 'warning');
        return false;
      }

      if (!authResult.user || !authResult.accessToken) {
        setIsGoogleConnecting(false);
        if (authResult.error) {
          addToast('មិនអាចចូល Google Account: ' + authResult.error, 'warning');
        }
        return false;
      }

      const profile: GoogleUserProfile = {
        displayName: authResult.user.displayName,
        email: authResult.user.email,
        photoURL: authResult.user.photoURL
      };
      setGoogleUser(profile);
      localStorage.setItem('khmer_pos_google_user', JSON.stringify(profile));

      addToast(`បានភ្ជាប់គណនី Google (${profile.email}) ដោយជោគជ័យ!`, 'success');

      // Initialize or Find Spreadsheet on Google Drive
      addToast('កំពុងរៀបចំ និងស្វែងរក Spreadsheet "Khmer POS & ERP Database" លើ Google Drive...', 'info');
      const sheetInfo = await GoogleSheetsDirectApi.getOrCreateDatabaseSpreadsheet(
        authResult.accessToken,
        googleSpreadsheet?.spreadsheetId
      );

      setGoogleSpreadsheet(sheetInfo);
      localStorage.setItem('khmer_pos_google_sheet', JSON.stringify(sheetInfo));

      // Initial Sync
      addToast('កំពុងបញ្ជូនទិន្នន័យទំនិញ ការលក់ និងអតិថិជនទៅកាន់ Google Sheets...', 'info');
      await GoogleSheetsDirectApi.syncAllCollectionsToSheets(
        authResult.accessToken,
        sheetInfo.spreadsheetId,
        {
          products,
          sales,
          purchases,
          customers,
          suppliers,
          expenses,
          stockAdjustments,
          stockMovements,
          settings
        }
      );

      const syncTime = new Date().toLocaleTimeString();
      setLastGoogleSyncTime(syncTime);
      localStorage.setItem('khmer_pos_last_sync', syncTime);

      logAction('GOOGLE_SHEETS_CONNECT', 'Database', sheetInfo.spreadsheetId, `Connected Google Sheets DB: ${sheetInfo.title}`);
      addToast('បានភ្ជាប់ Google Sheets Database និងធ្វើសមកាលកម្មទិន្នន័យរួចរាល់ 100%! 📊', 'success');

      setIsGoogleConnecting(false);
      return true;
    } catch (err: any) {
      setIsGoogleConnecting(false);
      const msg = err?.message || 'Error occurred';
      if (msg.includes('popup-closed-by-user') || msg.includes('cancelled')) {
        addToast('ការចូលគណនី Google ត្រូវបានផ្អាក', 'info');
      } else {
        addToast('មិនអាចភ្ជាប់ Google Sheets: ' + msg, 'error');
      }
      return false;
    }
  };

  const selectOrCreateGoogleSpreadsheet = async (sheetId?: string): Promise<boolean> => {
    const token = await getAccessToken();
    if (!token) {
      addToast('សូមចូលប្រើគណនី Google ជាមុនសិន!', 'warning');
      return connectGoogleAccount();
    }

    setIsGoogleSyncing(true);
    try {
      const sheetInfo = await GoogleSheetsDirectApi.getOrCreateDatabaseSpreadsheet(token, sheetId);
      setGoogleSpreadsheet(sheetInfo);
      localStorage.setItem('khmer_pos_google_sheet', JSON.stringify(sheetInfo));

      // Sync All Data
      await GoogleSheetsDirectApi.syncAllCollectionsToSheets(token, sheetInfo.spreadsheetId, {
        products,
        sales,
        purchases,
        customers,
        suppliers,
        expenses,
        stockAdjustments,
        stockMovements,
        settings
      });

      const syncTime = new Date().toLocaleTimeString();
      setLastGoogleSyncTime(syncTime);
      localStorage.setItem('khmer_pos_last_sync', syncTime);

      addToast(`បានភ្ជាប់ Spreadsheet "${sheetInfo.title}" និងធ្វើសមកាលកម្មរួចរាល់!`, 'success');
      setIsGoogleSyncing(false);
      return true;
    } catch (err: any) {
      setIsGoogleSyncing(false);
      addToast('បរាជ័យក្នុងការកំណត់ Google Spreadsheet: ' + err.message, 'error');
      return false;
    }
  };

  const syncAllToGoogleSheets = async (): Promise<boolean> => {
    const token = await getAccessToken();
    if (!token || !googleSpreadsheet) {
      addToast('សូមភ្ជាប់ Google Account និង Spreadsheet ជាមុនសិន', 'warning');
      return connectGoogleAccount();
    }

    setIsGoogleSyncing(true);
    try {
      await GoogleSheetsDirectApi.syncAllCollectionsToSheets(token, googleSpreadsheet.spreadsheetId, {
        products,
        sales,
        purchases,
        customers,
        suppliers,
        expenses,
        stockAdjustments,
        stockMovements,
        settings
      });

      const syncTime = new Date().toLocaleTimeString();
      setLastGoogleSyncTime(syncTime);
      localStorage.setItem('khmer_pos_last_sync', syncTime);

      addToast('បាន Sync ទិន្នន័យទាំងអស់ទៅកាន់ Google Sheets រួចរាល់! 📊', 'success');
      setIsGoogleSyncing(false);
      return true;
    } catch (err: any) {
      console.error('Sync error:', err);
      setIsGoogleSyncing(false);
      addToast('Sync បរាជ័យ: ' + err.message, 'error');
      return false;
    }
  };

  const disconnectGoogleAccount = async () => {
    await googleSignOut();
    setGoogleUser(null);
    setGoogleSpreadsheet(null);
    setLastGoogleSyncTime(null);
    localStorage.removeItem('khmer_pos_google_user');
    localStorage.removeItem('khmer_pos_google_sheet');
    localStorage.removeItem('khmer_pos_last_sync');
    setAccessTokenInMemory(null);
    addToast('បានផ្តាច់ការតភ្ជាប់ Google Account រួចរាល់', 'info');
  };

  // Auth actions
  const login = (username: string, targetRole?: UserRole): boolean => {
    const foundUser = users.find(u => u.username.toLowerCase() === username.toLowerCase() || (targetRole && u.role === targetRole));
    if (foundUser) {
      setCurrentUser(foundUser);
      addToast(`សូមស្វាគមន៍មកកាន់ប្រព័ន្ធ! (Logged in as ${foundUser.fullName})`, 'success');
      logAction('LOGIN', 'Auth', foundUser.userId, `User ${foundUser.username} logged in`);
      return true;
    }
    addToast('Username ឬ Password មិនត្រឹមត្រូវ', 'error', 'Invalid Credentials');
    return false;
  };

  const logout = () => {
    if (currentUser) {
      logAction('LOGOUT', 'Auth', currentUser.userId, `User ${currentUser.username} logged out`);
    }
    setCurrentUser(null);
    addToast('អ្នកបានចាកចេញពីប្រព័ន្ធដោយជោគជ័យ', 'info');
  };

  // Product Actions
  const addProduct = (p: Omit<Product, 'productId' | 'createdDate'>) => {
    const existingBarcode = products.find(prod => prod.barcode.trim() === p.barcode.trim());
    if (existingBarcode) {
      addToast('Barcode នេះមានរួចហើយក្នុងប្រព័ន្ធ! (Duplicate Barcode)', 'error');
      return;
    }

    const productId = generateCustomId('PRD', products.length);
    const newProduct: Product = {
      ...p,
      productId,
      createdDate: new Date().toISOString().split('T')[0],
      status: p.stock <= 0 ? 'Out of Stock' : (p.stock <= p.minStock ? 'Low Stock' : 'In Stock')
    };

    setProducts(prev => [newProduct, ...prev]);
    logAction('CREATE_PRODUCT', 'Products', productId, `Created product ${p.name} with stock ${p.stock}`);
    addToast(`បានបង្កើតទំនិញថ្មី "${p.name}" (${productId}) ដោយជោគជ័យ`, 'success');

    // Record initial stock movement if stock > 0
    if (p.stock > 0) {
      const movementId = generateCustomId('MOV', stockMovements.length);
      const newMovement: StockMovement = {
        movementId,
        date: new Date().toLocaleString(),
        productId,
        productName: p.name,
        type: 'PURCHASE',
        referenceId: productId,
        quantityChange: p.stock,
        previousStock: 0,
        newStock: p.stock,
        user: currentUser?.fullName || 'Admin',
        notes: 'Initial opening stock'
      };
      setStockMovements(prev => [newMovement, ...prev]);
    }
  };

  const updateProduct = (p: Product) => {
    setProducts(prev => prev.map(item => {
      if (item.productId === p.productId) {
        const updatedStatus = p.stock <= 0 ? 'Out of Stock' : (p.stock <= p.minStock ? 'Low Stock' : 'In Stock');
        return { ...p, status: updatedStatus };
      }
      return item;
    }));
    logAction('UPDATE_PRODUCT', 'Products', p.productId, `Updated product details for ${p.name}`);
    addToast(`បានកែប្រែទំនិញ "${p.name}" រួចរាល់`, 'success');
  };

  const deleteProduct = (productId: string) => {
    const prod = products.find(p => p.productId === productId);
    setProducts(prev => prev.filter(p => p.productId !== productId));
    logAction('DELETE_PRODUCT', 'Products', productId, `Deleted product ${prod?.name || productId}`);
    addToast(`បានលុបទំនិញ ${productId} ចេញពីប្រព័ន្ធ`, 'warning');
  };

  // Category Actions
  const createCategory = (c: Omit<Category, 'id'>) => {
    const id = generateCustomId('CAT', categories.length);
    const newCat: Category = {
      ...c,
      id,
      itemCount: 0
    };
    setCategories(prev => [...prev, newCat]);
    logAction('CREATE_CATEGORY', 'Categories', id, `Created category ${c.name}`);
    addToast(`បានបង្កើតប្រភេទទំនិញ "${c.name}" ដោយជោគជ័យ`, 'success');
  };

  const updateCategory = (c: Category) => {
    setCategories(prev => prev.map(cat => cat.id === c.id ? c : cat));
    logAction('UPDATE_CATEGORY', 'Categories', c.id, `Updated category ${c.name}`);
    addToast(`បានកែប្រែប្រភេទទំនិញ "${c.name}" រួចរាល់`, 'success');
  };

  const deleteCategory = (categoryId: string) => {
    const cat = categories.find(c => c.id === categoryId);
    // Check if any product is using this category
    const isUsed = products.some(p => p.category === cat?.name || p.category === cat?.khmerName);
    if (isUsed) {
      addToast(`មិនអាចលុបប្រភេទ "${cat?.name}" បានទេ ព្រោះមានទំនិញកំពុងប្រើប្រាស់!`, 'error');
      return;
    }
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    logAction('DELETE_CATEGORY', 'Categories', categoryId, `Deleted category ${cat?.name || categoryId}`);
    addToast(`បានលុបប្រភេទទំនិញ "${cat?.name}" រួចរាល់`, 'warning');
  };

  // Brand Actions
  const createBrand = (b: Omit<Brand, 'id'>) => {
    const id = generateCustomId('BRD', brands.length);
    const newBrand: Brand = {
      ...b,
      id
    };
    setBrands(prev => [...prev, newBrand]);
    logAction('CREATE_BRAND', 'Brands', id, `Created brand ${b.name}`);
    addToast(`បានបង្កើតម៉ាកយីហោ "${b.name}" ដោយជោគជ័យ`, 'success');
  };

  const updateBrand = (b: Brand) => {
    setBrands(prev => prev.map(brand => brand.id === b.id ? b : brand));
    logAction('UPDATE_BRAND', 'Brands', b.id, `Updated brand ${b.name}`);
    addToast(`បានកែប្រែម៉ាកយីហោ "${b.name}" រួចរាល់`, 'success');
  };

  const deleteBrand = (brandId: string) => {
    const brand = brands.find(b => b.id === brandId);
    // Check if any product is using this brand
    const isUsed = products.some(p => p.brand === brand?.name);
    if (isUsed) {
      addToast(`មិនអាចលុបម៉ាក "${brand?.name}" បានទេ ព្រោះមានទំនិញកំពុងប្រើប្រាស់!`, 'error');
      return;
    }
    setBrands(prev => prev.filter(b => b.id !== brandId));
    logAction('DELETE_BRAND', 'Brands', brandId, `Deleted brand ${brand?.name || brandId}`);
    addToast(`បានលុបម៉ាកយីហោ "${brand?.name}" រួចរាល់`, 'warning');
  };

  // Unit Actions
  const createUnit = (u: Omit<Unit, 'id'>) => {
    const id = generateCustomId('UNT', units.length);
    const newUnit: Unit = {
      ...u,
      id
    };
    setUnits(prev => [...prev, newUnit]);
    logAction('CREATE_UNIT', 'Units', id, `Created unit ${u.name}`);
    addToast(`បានបង្កើតខ្នាតទំនិញ "${u.name}" (${u.khmerName}) ដោយជោគជ័យ`, 'success');
  };

  const updateUnit = (u: Unit) => {
    setUnits(prev => prev.map(unit => unit.id === u.id ? u : unit));
    logAction('UPDATE_UNIT', 'Units', u.id, `Updated unit ${u.name}`);
    addToast(`បានកែប្រែខ្នាតទំនិញ "${u.name}" រួចរាល់`, 'success');
  };

  const deleteUnit = (unitId: string) => {
    const unit = units.find(u => u.id === unitId);
    const isUsed = products.some(p => p.unit === unit?.name || p.unit === unit?.shortCode);
    if (isUsed) {
      addToast(`មិនអាចលុបខ្នាត "${unit?.name}" បានទេ ព្រោះមានទំនិញកំពុងប្រើប្រាស់!`, 'error');
      return;
    }
    setUnits(prev => prev.filter(u => u.id !== unitId));
    logAction('DELETE_UNIT', 'Units', unitId, `Deleted unit ${unit?.name || unitId}`);
    addToast(`បានលុបខ្នាតទំនិញ "${unit?.name}" រួចរាល់`, 'warning');
  };

  // Stock Adjustment
  const adjustStock = (adj: Omit<StockAdjustment, 'adjustmentId' | 'date'>) => {
    const adjustmentId = generateCustomId('ADJ', stockAdjustments.length);
    const dateStr = new Date().toLocaleString();

    const targetProduct = products.find(p => p.productId === adj.productId);
    if (!targetProduct) {
      addToast('រកមិនឃើញទំនិញ', 'error');
      return;
    }

    const newStockVal = Math.max(0, targetProduct.stock + adj.adjustmentQty);

    const newAdjRecord: StockAdjustment = {
      ...adj,
      adjustmentId,
      date: dateStr,
      newStock: newStockVal
    };

    setStockAdjustments(prev => [newAdjRecord, ...prev]);

    // Update Product Stock
    setProducts(prev => prev.map(p => {
      if (p.productId === adj.productId) {
        return {
          ...p,
          stock: newStockVal,
          status: newStockVal <= 0 ? 'Out of Stock' : (newStockVal <= p.minStock ? 'Low Stock' : 'In Stock')
        };
      }
      return p;
    }));

    // Stock Movement record
    const movementId = generateCustomId('MOV', stockMovements.length);
    const newMovement: StockMovement = {
      movementId,
      date: dateStr,
      productId: adj.productId,
      productName: adj.productName,
      type: 'ADJUSTMENT',
      referenceId: adjustmentId,
      quantityChange: adj.adjustmentQty,
      previousStock: targetProduct.stock,
      newStock: newStockVal,
      user: adj.user,
      notes: `${adj.adjustmentType}: ${adj.reason}`
    };
    setStockMovements(prev => [newMovement, ...prev]);

    logAction('STOCK_ADJUSTMENT', 'Stock', adjustmentId, `Adjusted stock for ${adj.productName} by ${adj.adjustmentQty} (${adj.adjustmentType})`);
    addToast(`បានកែសម្រួលស្តុក ${adj.productName} ទៅជា ${newStockVal} ${targetProduct.unit}`, 'success');
  };

  // Purchase / Stock In
  const createPurchase = (p: Omit<Purchase, 'purchaseId' | 'date'>) => {
    const purchaseId = generateDateBasedId('PUR', purchases.length);
    const dateStr = new Date().toISOString().split('T')[0];

    const newPurchase: Purchase = {
      ...p,
      purchaseId,
      date: dateStr
    };

    setPurchases(prev => [newPurchase, ...prev]);

    // Update products stock & Cost price
    p.items.forEach(item => {
      setProducts(prev => prev.map(prod => {
        if (prod.productId === item.productId) {
          const newStock = prod.stock + item.quantity;
          return {
            ...prod,
            stock: newStock,
            costPrice: item.costPrice > 0 ? item.costPrice : prod.costPrice,
            status: newStock <= 0 ? 'Out of Stock' : (newStock <= prod.minStock ? 'Low Stock' : 'In Stock')
          };
        }
        return prod;
      }));

      // Movement
      const oldProd = products.find(x => x.productId === item.productId);
      const prevStock = oldProd ? oldProd.stock : 0;
      const movId = generateCustomId('MOV', stockMovements.length + 1);
      const newMov: StockMovement = {
        movementId: movId,
        date: new Date().toLocaleString(),
        productId: item.productId,
        productName: item.productName,
        type: 'PURCHASE',
        referenceId: purchaseId,
        quantityChange: item.quantity,
        previousStock: prevStock,
        newStock: prevStock + item.quantity,
        user: p.createdUser,
        notes: `Purchase from ${p.supplierName}`
      };
      setStockMovements(prev => [newMov, ...prev]);
    });

    // Update Supplier Balance if due amount > 0
    if (p.dueAmount > 0) {
      setSuppliers(prev => prev.map(s => {
        if (s.supplierId === p.supplierId) {
          return { ...s, balance: s.balance + p.dueAmount };
        }
        return s;
      }));
    }

    logAction('CREATE_PURCHASE', 'Purchases', purchaseId, `Created purchase invoice ${p.invoiceNumber} from ${p.supplierName} Total: $${p.total}`);
    addToast(`បានបង្កើតប័ណ្ណទិញទំនិញ ${p.invoiceNumber} ($${p.total.toFixed(2)}) និងបញ្ចូលស្តុកដោយជោគជ័យ`, 'success');
  };

  // POS & Sales Actions
  const createSale = (s: Omit<Sale, 'saleId' | 'invoiceNumber' | 'date'>): Sale => {
    const countToday = sales.length;
    const saleId = generateDateBasedId('SAL', countToday);
    const invoiceNumber = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(countToday + 1).padStart(4, '0')}`;
    const dateStr = new Date().toLocaleString();

    const newSale: Sale = {
      ...s,
      saleId,
      invoiceNumber,
      date: dateStr
    };

    setSales(prev => [newSale, ...prev]);

    // 1. Deduct Stock & Record Movements
    s.items.forEach(item => {
      setProducts(prev => prev.map(prod => {
        if (prod.productId === item.productId) {
          const newQty = Math.max(0, prod.stock - item.quantity);
          return {
            ...prod,
            stock: newQty,
            status: newQty <= 0 ? 'Out of Stock' : (newQty <= prod.minStock ? 'Low Stock' : 'In Stock')
          };
        }
        return prod;
      }));

      const oldProd = products.find(x => x.productId === item.productId);
      const prevStock = oldProd ? oldProd.stock : item.quantity;
      const movId = generateCustomId('MOV', stockMovements.length + 1);
      const newMov: StockMovement = {
        movementId: movId,
        date: dateStr,
        productId: item.productId,
        productName: item.productName,
        type: 'SALE',
        referenceId: saleId,
        quantityChange: -item.quantity,
        previousStock: prevStock,
        newStock: Math.max(0, prevStock - item.quantity),
        user: s.cashierName,
        notes: `POS Sale ${invoiceNumber} to ${s.customerName}`
      };
      setStockMovements(prev => [newMov, ...prev]);
    });

    // 2. Update Customer Total Purchased & Balance if due
    if (s.customerId) {
      setCustomers(prev => prev.map(c => {
        if (c.customerId === s.customerId) {
          return {
            ...c,
            totalPurchased: c.totalPurchased + s.total,
            balance: s.dueAmount > 0 ? c.balance + s.dueAmount : c.balance
          };
        }
        return c;
      }));
    }

    logAction('CREATE_SALE', 'Sales', saleId, `Sale completed: ${invoiceNumber}, Total: $${s.total} (${s.paymentMethod})`);
    addToast(`ការលក់វិក្កយបត្រ ${invoiceNumber} បានជោគជ័យ! សរុប: $${s.total.toFixed(2)} (${formatKHR(s.totalKHR)})`, 'success');

    // Realtime append to Google Sheets if connected
    getAccessToken().then(token => {
      if (token && googleSpreadsheet) {
        GoogleSheetsDirectApi.appendSaleToSheets(token, googleSpreadsheet.spreadsheetId, newSale);
      }
    }).catch(() => {});

    setSelectedInvoiceForPrint(newSale);
    return newSale;
  };

  // Return / Refund Sale
  const returnSale = (saleId: string, reason: string) => {
    const sale = sales.find(s => s.saleId === saleId);
    if (!sale) return;

    // Restore stock
    sale.items.forEach(item => {
      setProducts(prev => prev.map(prod => {
        if (prod.productId === item.productId) {
          const newQty = prod.stock + item.quantity;
          return {
            ...prod,
            stock: newQty,
            status: newQty <= 0 ? 'Out of Stock' : (newQty <= prod.minStock ? 'Low Stock' : 'In Stock')
          };
        }
        return prod;
      }));

      const oldProd = products.find(x => x.productId === item.productId);
      const prevStock = oldProd ? oldProd.stock : 0;
      const movId = generateCustomId('MOV', stockMovements.length + 1);
      const newMov: StockMovement = {
        movementId: movId,
        date: new Date().toLocaleString(),
        productId: item.productId,
        productName: item.productName,
        type: 'RETURN',
        referenceId: saleId,
        quantityChange: item.quantity,
        previousStock: prevStock,
        newStock: prevStock + item.quantity,
        user: currentUser?.fullName || 'Admin',
        notes: `Refund for Sale ${sale.invoiceNumber}: ${reason}`
      };
      setStockMovements(prev => [newMov, ...prev]);
    });

    setSales(prev => prev.map(s => s.saleId === saleId ? { ...s, status: 'Refunded' } : s));
    logAction('RETURN_SALE', 'Sales', saleId, `Refunded sale ${sale.invoiceNumber}. Reason: ${reason}`);
    addToast(`បានធ្វើការបង្វិលសងវិក្កយបត្រ ${sale.invoiceNumber} និងបញ្ចូលស្តុកទំនិញឡើងវិញរួចរាល់`, 'info');
  };

  // Customer Actions
  const createCustomer = (c: Omit<Customer, 'customerId' | 'createdDate' | 'totalPurchased'>) => {
    const customerId = generateCustomId('CUS', customers.length);
    const newCustomer: Customer = {
      ...c,
      customerId,
      createdDate: new Date().toISOString().split('T')[0],
      totalPurchased: 0
    };
    setCustomers(prev => [newCustomer, ...prev]);
    logAction('CREATE_CUSTOMER', 'Customers', customerId, `Created customer ${c.name}`);
    addToast(`បានបង្កើតអតិថិជន "${c.name}" ដោយជោគជ័យ`, 'success');
  };

  const updateCustomer = (c: Customer) => {
    setCustomers(prev => prev.map(item => item.customerId === c.customerId ? c : item));
    logAction('UPDATE_CUSTOMER', 'Customers', c.customerId, `Updated customer ${c.name}`);
    addToast(`បានកែប្រែព័ត៌មានអតិថិជន "${c.name}" រួចរាល់`, 'success');
  };

  const deleteCustomer = (customerId: string) => {
    setCustomers(prev => prev.filter(c => c.customerId !== customerId));
    logAction('DELETE_CUSTOMER', 'Customers', customerId, `Deleted customer ${customerId}`);
    addToast('បានលុបអតិថិជនចេញពីប្រព័ន្ធ', 'warning');
  };

  // Supplier Actions
  const createSupplier = (s: Omit<Supplier, 'supplierId' | 'createdDate'>) => {
    const supplierId = generateCustomId('SUP', suppliers.length);
    const newSupplier: Supplier = {
      ...s,
      supplierId,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setSuppliers(prev => [newSupplier, ...prev]);
    logAction('CREATE_SUPPLIER', 'Suppliers', supplierId, `Created supplier ${s.name}`);
    addToast(`បានបង្កើតអ្នកផ្គត់ផ្គង់ "${s.name}" ដោយជោគជ័យ`, 'success');
  };

  const updateSupplier = (s: Supplier) => {
    setSuppliers(prev => prev.map(item => item.supplierId === s.supplierId ? s : item));
    logAction('UPDATE_SUPPLIER', 'Suppliers', s.supplierId, `Updated supplier ${s.name}`);
    addToast(`បានកែប្រែអ្នកផ្គត់ផ្គង់ "${s.name}" រួចរាល់`, 'success');
  };

  const deleteSupplier = (supplierId: string) => {
    setSuppliers(prev => prev.filter(s => s.supplierId !== supplierId));
    logAction('DELETE_SUPPLIER', 'Suppliers', supplierId, `Deleted supplier ${supplierId}`);
    addToast('បានលុបអ្នកផ្គត់ផ្គង់ចេញពីប្រព័ន្ធ', 'warning');
  };

  // Expenses
  const createExpense = (exp: Omit<Expense, 'expenseId' | 'date' | 'amountKHR'>) => {
    const expenseId = generateDateBasedId('EXP', expenses.length);
    const dateStr = new Date().toISOString().split('T')[0];
    const amountKHR = Math.round(exp.amountUSD * exchangeRate);

    const newExpense: Expense = {
      ...exp,
      expenseId,
      date: dateStr,
      amountKHR
    };
    setExpenses(prev => [newExpense, ...prev]);
    logAction('CREATE_EXPENSE', 'Expenses', expenseId, `Recorded expense ${exp.category}: $${exp.amountUSD}`);
    addToast(`បានកត់ត្រាចំណាយ "${exp.category}" ($${exp.amountUSD.toFixed(2)}) រួចរាល់`, 'success');
  };

  const deleteExpense = (expenseId: string) => {
    setExpenses(prev => prev.filter(e => e.expenseId !== expenseId));
    logAction('DELETE_EXPENSE', 'Expenses', expenseId, `Deleted expense ${expenseId}`);
    addToast('បានលុបកំណត់ត្រាចំណាយចេញពីប្រព័ន្ធ', 'warning');
  };

  // Settings
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      if (newSettings.exchangeRate && newSettings.exchangeRate !== exchangeRate) {
        setExchangeRateState(newSettings.exchangeRate);
      }
      return updated;
    });
    logAction('UPDATE_SETTINGS', 'Settings', 'CONFIG', 'Updated application settings');
    addToast('ការកំណត់ត្រូវបានរក្សាទុកដោយជោគជ័យ', 'success');
  };

  // Users
  const createUser = (u: Omit<User, 'userId' | 'createdDate'>) => {
    const userId = generateCustomId('USR', users.length);
    const newUser: User = {
      ...u,
      userId,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, newUser]);
    logAction('CREATE_USER', 'Users', userId, `Created user ${u.username} (${u.role})`);
    addToast(`បានបង្កើតគណនី "${u.username}" (${u.role}) ដោយជោគជ័យ`, 'success');
  };

  const updateUser = (u: User) => {
    setUsers(prev => prev.map(user => user.userId === u.userId ? u : user));
    logAction('UPDATE_USER', 'Users', u.userId, `Updated user ${u.username}`);
    addToast(`បានកែប្រែគណនី "${u.username}" រួចរាល់`, 'success');
  };

  const deleteUser = (userId: string) => {
    if (users.length <= 1) {
      addToast('មិនអាចលុបគណនីចុងក្រោយបានទេ!', 'error');
      return;
    }
    setUsers(prev => prev.filter(u => u.userId !== userId));
    logAction('DELETE_USER', 'Users', userId, `Deleted user ${userId}`);
    addToast('បានលុបគណនីអ្នកប្រើប្រាស់រួចរាល់', 'warning');
  };

  // Sync with Google Apps Script Web App (Alternative)
  const testGoogleSheetsConnection = async (customUrl?: string): Promise<boolean> => {
    const url = customUrl || gasUrl || settings.googleAppsScriptUrl;
    if (!url) {
      addToast('សូមបញ្ចូល Google Apps Script Web App URL ជាមុនសិន!', 'warning');
      return false;
    }

    setIsSyncing(true);
    try {
      const res = await DatabaseService.callGasApi(url, 'checkHealth');
      if (res && res.success) {
        setSettings(prev => ({ ...prev, googleAppsScriptUrl: url, isGasConnected: true }));
        addToast('បានភ្ជាប់ជាមួយ Google Sheets Web App ដោយជោគជ័យ! ⚡', 'success');
        setIsSyncing(false);
        return true;
      } else {
        setSettings(prev => ({ ...prev, googleAppsScriptUrl: url, isGasConnected: true }));
        addToast('បានរក្សាទុក URL Google Apps Script! នឹង sync ដោយស្វ័យប្រវត្តិ។', 'success');
        setIsSyncing(false);
        return true;
      }
    } catch {
      setIsSyncing(false);
      addToast('មានបញ្ហាពេលភ្ជាប់ទៅ Google Sheets សូមពិនិត្យមើល Web App Deployment URL', 'error');
      return false;
    }
  };

  const syncWithGoogleSheets = testGoogleSheetsConnection;

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        currentUser,
        setCurrentUser,
        login,
        logout,
        products,
        categories,
        brands,
        units,
        customers,
        suppliers,
        purchases,
        sales,
        expenses,
        expenseCategories,
        stockAdjustments,
        stockMovements,
        users,
        settings,
        auditLogs,
        currency,
        setCurrency,
        exchangeRate,
        setExchangeRate,
        formatPrice,
        formatUSD,
        formatKHR,
        getKHR,
        addProduct,
        updateProduct,
        deleteProduct,
        createCategory,
        updateCategory,
        deleteCategory,
        createBrand,
        updateBrand,
        deleteBrand,
        createUnit,
        updateUnit,
        deleteUnit,
        adjustStock,
        createPurchase,
        createSale,
        returnSale,
        createCustomer,
        updateCustomer,
        deleteCustomer,
        createSupplier,
        updateSupplier,
        deleteSupplier,
        createExpense,
        deleteExpense,
        updateSettings,
        createUser,
        updateUser,
        deleteUser,
        toasts,
        addToast,
        removeToast,
        googleUser,
        googleSpreadsheet,
        isGoogleConnecting,
        isGoogleSyncing,
        lastGoogleSyncTime,
        connectGoogleAccount,
        disconnectGoogleAccount,
        syncAllToGoogleSheets,
        selectOrCreateGoogleSpreadsheet,
        gasUrl,
        setGasUrl,
        testGoogleSheetsConnection,
        syncWithGoogleSheets,
        isSyncing,
        selectedInvoiceForPrint,
        setSelectedInvoiceForPrint
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
