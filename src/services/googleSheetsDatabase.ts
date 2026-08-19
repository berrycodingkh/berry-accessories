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
  ApiResponse
} from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'khmer_pos_products',
  CATEGORIES: 'khmer_pos_categories',
  BRANDS: 'khmer_pos_brands',
  UNITS: 'khmer_pos_units',
  CUSTOMERS: 'khmer_pos_customers',
  SUPPLIERS: 'khmer_pos_suppliers',
  PURCHASES: 'khmer_pos_purchases',
  SALES: 'khmer_pos_sales',
  EXPENSES: 'khmer_pos_expenses',
  EXPENSE_CATEGORIES: 'khmer_pos_expense_cats',
  STOCK_ADJUSTMENTS: 'khmer_pos_stock_adjustments',
  STOCK_MOVEMENTS: 'khmer_pos_stock_movements',
  USERS: 'khmer_pos_users',
  SETTINGS: 'khmer_pos_settings',
  AUDIT_LOGS: 'khmer_pos_audit_logs',
  CURRENT_USER: 'khmer_pos_current_user'
};

// Clean Initial Products (Ready for user custom inventory)
export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'CAT-01', name: 'បូម & ជើងក្រោម', khmerName: 'បូម & ជើងក្រោម (Suspension)', icon: 'Sliders', itemCount: 1 },
  { id: 'CAT-02', name: 'ប្រព័ន្ធហ្វ្រាំង & ឌីស', khmerName: 'ប្រព័ន្ធហ្វ្រាំង & ឌីស (Brakes)', icon: 'Disc', itemCount: 1 },
  { id: 'CAT-03', name: 'កាង & ការពារ (Crash Bar)', khmerName: 'កាង & ការពារ (Crash Bars)', icon: 'Shield', itemCount: 2 },
  { id: 'CAT-04', name: 'បំពង់ផ្សែង & ស៊ីមាំង', khmerName: 'បំពង់ផ្សែង & ស៊ីមាំង (Exhausts)', icon: 'Flame', itemCount: 1 },
  { id: 'CAT-05', name: 'សំបកកង់ & យ៉ាន់', khmerName: 'សំបកកង់ & យ៉ាន់ (Tires & Rims)', icon: 'Circle', itemCount: 3 },
  { id: 'CAT-06', name: 'គ្រឿងអេឡិចត្រូនិក & ជើងទូរស័ព្ទ', khmerName: 'ជើងទូរស័ព្ទ & អេឡិចត្រូនិក (Mounts)', icon: 'Smartphone', itemCount: 1 },
  { id: 'CAT-07', name: 'ភ្លើង & អំពូល LED', khmerName: 'ភ្លើង & អំពូល LED (Lights)', icon: 'Zap', itemCount: 1 },
  { id: 'CAT-08', name: 'គ្រឿងតុបតែង CNC & Carbon', khmerName: 'គ្រឿងតុបតែង CNC & Carbon', icon: 'Sparkles', itemCount: 1 },
  { id: 'CAT-09', name: 'ប្រេង & ទឹកស្អំ', khmerName: 'ប្រេងម៉ាស៊ីន & ទឹកស្អំ (Oils)', icon: 'Droplets', itemCount: 1 }
];

export const INITIAL_BRANDS: Brand[] = [
  { id: 'BRD-01', name: 'YSS Suspension', description: 'World-class racing shock absorbers' },
  { id: 'BRD-02', name: 'Brembo', description: 'High performance braking systems Italy' },
  { id: 'BRD-03', name: 'Akrapovic', description: 'Premium titanium exhausts' },
  { id: 'BRD-04', name: 'Kitaco Japan', description: 'Adventure parts for PG-1 & CT125' },
  { id: 'BRD-05', name: 'Michelin', description: 'Premium motorcycle tires' },
  { id: 'BRD-06', name: 'Motowolf', description: 'Motorcycle mounts & touring gear' },
  { id: 'BRD-07', name: 'Spirit Beast', description: 'LED spotlights and auxiliary lights' },
  { id: 'BRD-08', name: 'RCB (Racing Boy)', description: 'Performance rims, levers & brakes' },
  { id: 'BRD-09', name: 'Motul', description: '100% Synthetic motorcycle oils' }
];

export const INITIAL_UNITS: Unit[] = [
  { id: 'UNT-01', name: 'Pcs', khmerName: 'គ្រាប់ / ដុំ', shortCode: 'Pcs' },
  { id: 'UNT-02', name: 'Set', khmerName: 'ឈុត', shortCode: 'Set' },
  { id: 'UNT-03', name: 'Pair', khmerName: 'គូ (ឆ្វេង+ស្តាំ)', shortCode: 'Pair' },
  { id: 'UNT-04', name: 'Btl', khmerName: 'ដប', shortCode: 'Btl' },
  { id: 'UNT-05', name: 'Box', khmerName: 'ប្រអប់', shortCode: 'Box' }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    customerId: 'CUS-000001',
    name: 'General Moto Rider (អតិថិជនទូទៅ)',
    phone: '012 000 000',
    address: 'Phnom Penh',
    customerGroup: 'General',
    discountRate: 0,
    creditLimit: 0,
    balance: 0,
    totalPurchased: 580.00,
    status: 'Active',
    createdDate: '2026-08-01'
  },
  {
    customerId: 'CUS-000002',
    name: 'Khem Chantha (Honda ADV Club)',
    phone: '098 765 432',
    address: 'St 271, Toul Kork, Phnom Penh',
    customerGroup: 'VIP',
    discountRate: 5,
    creditLimit: 500.00,
    balance: 0,
    totalPurchased: 1250.00,
    status: 'Active',
    createdDate: '2026-08-01'
  },
  {
    customerId: 'CUS-000003',
    name: 'Sokha Adventure Garage (PCX / PG-1 Wholesale)',
    phone: '089 123 456',
    address: 'National Road 6, Siem Reap',
    customerGroup: 'Wholesale',
    discountRate: 10,
    creditLimit: 2000.00,
    balance: 320.00,
    totalPurchased: 3450.00,
    status: 'Active',
    createdDate: '2026-08-02'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    supplierId: 'SUP-000001',
    name: 'YSS Cambodia Racing Parts',
    contactPerson: 'Mr. David YSS',
    phone: '012 999 111',
    email: 'sales@ysscambodia.com',
    address: 'Russian Blvd, Phnom Penh',
    balance: 0,
    status: 'Active',
    createdDate: '2026-08-01'
  },
  {
    supplierId: 'SUP-000002',
    name: 'Adventure Moto Supply (PG-1 & CT125)',
    contactPerson: 'Lok Pich',
    phone: '016 777 888',
    email: 'pich@adventuremoto.kh',
    address: 'Street 2004, Sen Sok, Phnom Penh',
    balance: 450.00,
    status: 'Active',
    createdDate: '2026-08-01'
  },
  {
    supplierId: 'SUP-000003',
    name: 'Brembo Performance KH & Motul Distributor',
    contactPerson: 'Oun Vireak',
    phone: '017 555 444',
    email: 'vireak@brembokh.com',
    address: 'St 214, Daun Penh, Phnom Penh',
    balance: 280.00,
    status: 'Active',
    createdDate: '2026-08-02'
  }
];

export const INITIAL_EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: 'EXPCAT-01', name: 'Rent', khmerName: 'ថ្លៃឈ្នួលទីតាំងហាង', icon: 'Building' },
  { id: 'EXPCAT-02', name: 'Electricity', khmerName: 'ថ្លៃអគ្គិសនី & ភ្លើងបំភ្លឺ', icon: 'Zap' },
  { id: 'EXPCAT-03', name: 'Water', khmerName: 'ថ្លៃទឹកស្អាត', icon: 'Droplets' },
  { id: 'EXPCAT-04', name: 'Internet', khmerName: 'ថ្លៃអ៊ីនធឺណិត Wi-Fi', icon: 'Wifi' },
  { id: 'EXPCAT-05', name: 'Salary', khmerName: 'ប្រាក់បៀវត្សជាង & បុគ្គលិក', icon: 'Users' },
  { id: 'EXPCAT-06', name: 'Transportation', khmerName: 'ថ្លៃដឹកជញ្ជូន & កង់បី', icon: 'Truck' },
  { id: 'EXPCAT-07', name: 'Tools & Maintenance', khmerName: 'ថ្លៃប្រដាប់ប្រដាជាង & ជួសជុល', icon: 'Wrench' },
  { id: 'EXPCAT-08', name: 'Other', khmerName: 'ចំណាយផ្សេងៗ', icon: 'MoreHorizontal' }
];

export const INITIAL_SETTINGS: AppSettings = {
  storeName: 'BERRY MOTO ACCESSORIES',
  storeNameKhmer: 'ប៊ែរី គ្រឿងលេងម៉ូតូ (ADV • PCX • SCOOPY • PG-1 • CT125)',
  logoUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=200&auto=format&fit=crop&q=80',
  address: '#88A, St 271 (ជិតផ្សារដើមថ្កូវ), Khan Chamkarmon, Phnom Penh',
  phone: '012 888 999 / 098 777 666',
  email: 'berrymoto.kh@gmail.com',
  vatNumber: 'K001-902345678',
  currency: 'USD',
  exchangeRate: 4100, // 1 USD = 4,100 KHR
  taxRate: 0,
  receiptFooter: 'Thank you for choosing Berry Moto Accessories! Drive Safe!',
  receiptFooterKhmer: 'សូមអរគុណចំពោះការគាំទ្រ ប៊ែរី គ្រឿងលេងម៉ូតូ! សូមបើកបរដោយសុវត្ថិភាព!',
  googleAppsScriptUrl: '',
  isGasConnected: false,
  thermalWidth: '80mm'
};

export const INITIAL_USERS: User[] = [
  {
    userId: 'USR-000001',
    username: 'admin',
    fullName: 'Berry Moto Admin',
    phone: '012 888 999',
    email: 'admin@berrymoto.com',
    role: 'Super Admin',
    branch: 'Main Store Phnom Penh',
    status: 'Active',
    createdDate: '2026-08-01',
    shift: 'Full Day',
    maxDiscountPercent: 100,
    canViewCostPrice: true,
    canGiveDiscount: true,
    canVoidInvoice: true
  },
  {
    userId: 'USR-000002',
    username: 'cashier1',
    fullName: 'Sophea Cashier',
    phone: '098 777 666',
    email: 'sophea@berrymoto.com',
    role: 'Cashier',
    branch: 'Main Store Phnom Penh',
    status: 'Active',
    createdDate: '2026-08-01',
    shift: 'Morning',
    maxDiscountPercent: 10,
    canViewCostPrice: false,
    canGiveDiscount: true,
    canVoidInvoice: false
  },
  {
    userId: 'USR-000003',
    username: 'stockkeeper',
    fullName: 'Dara Moto Mechanic & Stock',
    phone: '089 555 444',
    email: 'dara@berrymoto.com',
    role: 'Staff',
    branch: 'Main Store Phnom Penh',
    status: 'Active',
    createdDate: '2026-08-02',
    shift: 'Full Day',
    maxDiscountPercent: 5,
    canViewCostPrice: true,
    canGiveDiscount: false,
    canVoidInvoice: false
  }
];

export const INITIAL_PURCHASES: Purchase[] = [];

export const INITIAL_SALES: Sale[] = [];

export const INITIAL_EXPENSES: Expense[] = [];

export const INITIAL_STOCK_ADJUSTMENTS: StockAdjustment[] = [];

export const INITIAL_STOCK_MOVEMENTS: StockMovement[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'LOG-001',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: 'System',
    action: 'SYSTEM_BOOT',
    module: 'System',
    recordId: 'SYS-01',
    details: 'Berry Moto Accessories POS initialized with clean database ready for user input'
  }
];

export class DatabaseService {
  // Helper to load or initialize from localStorage
  private static load<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
      }
      return JSON.parse(stored) as T;
    } catch (e) {
      console.error(`Error loading key ${key}:`, e);
      return defaultValue;
    }
  }

  private static save<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Error saving key ${key}:`, e);
    }
  }

  // Loaders
  public static getProducts(): Product[] {
    return this.load<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }
  public static saveProducts(products: Product[]): void {
    this.save(STORAGE_KEYS.PRODUCTS, products);
  }

  public static getCategories(): Category[] {
    return this.load<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }
  public static saveCategories(categories: Category[]): void {
    this.save(STORAGE_KEYS.CATEGORIES, categories);
  }

  public static getBrands(): Brand[] {
    return this.load<Brand[]>(STORAGE_KEYS.BRANDS, INITIAL_BRANDS);
  }
  public static saveBrands(brands: Brand[]): void {
    this.save(STORAGE_KEYS.BRANDS, brands);
  }

  public static getUnits(): Unit[] {
    return this.load<Unit[]>(STORAGE_KEYS.UNITS, INITIAL_UNITS);
  }
  public static saveUnits(units: Unit[]): void {
    this.save(STORAGE_KEYS.UNITS, units);
  }

  public static getCustomers(): Customer[] {
    return this.load<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  }
  public static saveCustomers(customers: Customer[]): void {
    this.save(STORAGE_KEYS.CUSTOMERS, customers);
  }

  public static getSuppliers(): Supplier[] {
    return this.load<Supplier[]>(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
  }
  public static saveSuppliers(suppliers: Supplier[]): void {
    this.save(STORAGE_KEYS.SUPPLIERS, suppliers);
  }

  public static getPurchases(): Purchase[] {
    return this.load<Purchase[]>(STORAGE_KEYS.PURCHASES, INITIAL_PURCHASES);
  }
  public static savePurchases(purchases: Purchase[]): void {
    this.save(STORAGE_KEYS.PURCHASES, purchases);
  }

  public static getSales(): Sale[] {
    return this.load<Sale[]>(STORAGE_KEYS.SALES, INITIAL_SALES);
  }
  public static saveSales(sales: Sale[]): void {
    this.save(STORAGE_KEYS.SALES, sales);
  }

  public static getExpenses(): Expense[] {
    return this.load<Expense[]>(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
  }
  public static saveExpenses(expenses: Expense[]): void {
    this.save(STORAGE_KEYS.EXPENSES, expenses);
  }

  public static getExpenseCategories(): ExpenseCategory[] {
    return this.load<ExpenseCategory[]>(STORAGE_KEYS.EXPENSE_CATEGORIES, INITIAL_EXPENSE_CATEGORIES);
  }
  public static saveExpenseCategories(cats: ExpenseCategory[]): void {
    this.save(STORAGE_KEYS.EXPENSE_CATEGORIES, cats);
  }

  public static getStockAdjustments(): StockAdjustment[] {
    return this.load<StockAdjustment[]>(STORAGE_KEYS.STOCK_ADJUSTMENTS, INITIAL_STOCK_ADJUSTMENTS);
  }
  public static saveStockAdjustments(adjs: StockAdjustment[]): void {
    this.save(STORAGE_KEYS.STOCK_ADJUSTMENTS, adjs);
  }

  public static getStockMovements(): StockMovement[] {
    return this.load<StockMovement[]>(STORAGE_KEYS.STOCK_MOVEMENTS, INITIAL_STOCK_MOVEMENTS);
  }
  public static saveStockMovements(movements: StockMovement[]): void {
    this.save(STORAGE_KEYS.STOCK_MOVEMENTS, movements);
  }

  public static getUsers(): User[] {
    const list = this.load<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    if (!list || list.length === 0) {
      return INITIAL_USERS;
    }
    return list;
  }
  public static saveUsers(users: User[]): void {
    this.save(STORAGE_KEYS.USERS, users);
  }

  public static getSettings(): AppSettings {
    return this.load<AppSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }
  public static saveSettings(settings: AppSettings): void {
    this.save(STORAGE_KEYS.SETTINGS, settings);
  }

  public static getAuditLogs(): AuditLog[] {
    return this.load<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }
  public static saveAuditLogs(logs: AuditLog[]): void {
    this.save(STORAGE_KEYS.AUDIT_LOGS, logs);
  }

  public static getCurrentUser(): User | null {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!user) return null;
    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }
  public static saveCurrentUser(user: User | null): void {
    if (user) {
      this.save(STORAGE_KEYS.CURRENT_USER, user);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  public static clearAllData(): void {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.STOCK_ADJUSTMENTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.STOCK_MOVEMENTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([
      {
        id: 'LOG-CLEAN',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        user: 'System',
        action: 'DATA_CLEAN',
        module: 'Database',
        recordId: 'SYS-CLEAN',
        details: 'All inventory, purchase, sales, and movement data wiped clean'
      }
    ]));
  }

  public static loadAllState() {
    return {
      products: this.getProducts(),
      categories: this.getCategories(),
      brands: this.getBrands(),
      units: this.getUnits(),
      customers: this.getCustomers(),
      suppliers: this.getSuppliers(),
      purchases: this.getPurchases(),
      sales: this.getSales(),
      expenses: this.getExpenses(),
      expenseCategories: this.getExpenseCategories(),
      stockAdjustments: this.getStockAdjustments(),
      stockMovements: this.getStockMovements(),
      users: this.getUsers(),
      settings: this.getSettings(),
      auditLogs: this.getAuditLogs(),
      currentUser: this.getCurrentUser(),
    };
  }

  public static async callGasApi(url: string, action: string, data: Record<string, unknown> = {}): Promise<any> {
    try {
      const payload = { action, ...data };
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
      return await response.json();
    } catch (error) {
      console.error('GAS API Error:', error);
      throw error;
    }
  }

  // Currency Converter Helpers
  public static convertUSDToKHR(amountUSD: number, rate: number = 4100): number {
    return Math.round(amountUSD * rate);
  }

  public static convertKHRToUSD(amountKHR: number, rate: number = 4100): number {
    return parseFloat((amountKHR / rate).toFixed(2));
  }

  public static formatUSD(amount: number): string {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  public static formatKHR(amount: number): string {
    return `${Math.round(amount).toLocaleString('en-US')} ៛`;
  }
}

// Global ID Generators
export const generateCustomId = (prefix: string, sequenceNumber?: number): string => {
  const seq = sequenceNumber !== undefined ? (sequenceNumber + 1) : Math.floor(1 + Math.random() * 9999);
  return `${prefix}-${seq.toString().padStart(6, '0')}`;
};

export const generateDateBasedId = (prefix: string, sequenceNumber?: number): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const suffix = sequenceNumber !== undefined 
    ? (sequenceNumber + 1).toString().padStart(4, '0') 
    : Math.floor(1000 + Math.random() * 9000).toString();
  return `${prefix}-${year}${month}${day}-${suffix}`;
};
