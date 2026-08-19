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

// Initial Seed Data with Cambodian Market retail products
export const INITIAL_PRODUCTS: Product[] = [
  {
    productId: 'PRD-000001',
    barcode: '884100100001',
    name: 'Angkor Premium Beer 330ml Can',
    khmerName: 'ស្រាបៀរ អង្គរ កំប៉ុង ៣៣០មល',
    category: 'Beverages',
    brand: 'Angkor Beer',
    unit: 'Can',
    costPrice: 0.55,
    salePrice: 0.75,
    wholesalePrice: 0.65,
    vipPrice: 0.70,
    stock: 120,
    minStock: 24,
    supplier: 'Cambrew Ltd',
    description: 'National beer of Cambodia, smooth and refreshing',
    imageUrl: 'https://images.unsplash.com/photo-1608270191910-c4464c8d5dc7?w=300&auto=format&fit=crop&q=80',
    status: 'In Stock',
    createdDate: '2026-08-01'
  },
  {
    productId: 'PRD-000002',
    barcode: '884100100002',
    name: 'Kuleng Mineral Water 500ml',
    khmerName: 'ទឹកបរិសុទ្ធ គូលែន ៥០០មល',
    category: 'Beverages',
    brand: 'Kulen Water',
    unit: 'Bottle',
    costPrice: 0.20,
    salePrice: 0.40,
    wholesalePrice: 0.30,
    vipPrice: 0.35,
    stock: 250,
    minStock: 50,
    supplier: 'Kulen Water Co.',
    description: 'Natural mineral water from Mount Kulen',
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=300&auto=format&fit=crop&q=80',
    status: 'In Stock',
    createdDate: '2026-08-01'
  },
  {
    productId: 'PRD-000003',
    barcode: '884100100003',
    name: 'Bacchus Energy Drink 250ml',
    khmerName: 'ភេសជ្ជៈប៉ូវកម្លាំង បាខាស់',
    category: 'Beverages',
    brand: 'Dong-A',
    unit: 'Can',
    costPrice: 0.60,
    salePrice: 0.85,
    wholesalePrice: 0.75,
    vipPrice: 0.80,
    stock: 80,
    minStock: 20,
    supplier: 'Cam-Korean Trading',
    description: 'Taurine and royal jelly energy beverage',
    imageUrl: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=300&auto=format&fit=crop&q=80',
    status: 'In Stock',
    createdDate: '2026-08-02'
  },
  {
    productId: 'PRD-000004',
    barcode: '884100100004',
    name: 'Phka Rumduol Jasmine Rice 5kg',
    khmerName: 'អង្ករផ្ការំដួលលេខ១ ៥គីឡូ',
    category: 'Snacks & Food',
    brand: 'Amru Rice',
    unit: 'Bag',
    costPrice: 4.80,
    salePrice: 6.50,
    wholesalePrice: 5.80,
    vipPrice: 6.00,
    stock: 45,
    minStock: 10,
    supplier: 'Amru Rice Cambodia',
    description: 'World award-winning fragrant Cambodian jasmine rice',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&auto=format&fit=crop&q=80',
    status: 'In Stock',
    createdDate: '2026-08-02'
  },
  {
    productId: 'PRD-000005',
    barcode: '884100100005',
    name: 'Mama Instant Noodles Tom Yum 1 Pack',
    khmerName: 'មីម៉ាម៉ា រសជាតិតុងយាំ',
    category: 'Snacks & Food',
    brand: 'MAMA',
    unit: 'Pack',
    costPrice: 0.25,
    salePrice: 0.45,
    wholesalePrice: 0.35,
    vipPrice: 0.40,
    stock: 180,
    minStock: 30,
    supplier: 'Thai-Cam Import',
    description: 'Spicy shrimp tom yum flavor instant noodles',
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=300&auto=format&fit=crop&q=80',
    status: 'In Stock',
    createdDate: '2026-08-03'
  },
  {
    productId: 'PRD-000006',
    barcode: '884100100006',
    name: 'Type-C Fast Charging Cable 1.5m 65W',
    khmerName: 'ខ្សែសាកល្បឿនលឿន Type-C 65W',
    category: 'Electronics',
    brand: 'Baseus',
    unit: 'Piece',
    costPrice: 2.20,
    salePrice: 4.50,
    wholesalePrice: 3.50,
    vipPrice: 4.00,
    stock: 28,
    minStock: 5,
    supplier: 'Smart Tech Distribution',
    description: 'Braided nylon heavy duty PD fast charging cable',
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&auto=format&fit=crop&q=80',
    status: 'In Stock',
    createdDate: '2026-08-04'
  },
  {
    productId: 'PRD-000007',
    barcode: '884100100007',
    name: 'Wireless Bluetooth Earbuds Pro',
    khmerName: 'កាសឥតខ្សែប៊្លូធូស Pro',
    category: 'Electronics',
    brand: 'Havit',
    unit: 'Set',
    costPrice: 8.50,
    salePrice: 15.00,
    wholesalePrice: 12.00,
    vipPrice: 13.50,
    stock: 8,
    minStock: 10,
    supplier: 'Smart Tech Distribution',
    description: 'ENC noise reduction, 24h battery life with charging case',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&auto=format&fit=crop&q=80',
    status: 'Low Stock',
    createdDate: '2026-08-04'
  },
  {
    productId: 'PRD-000008',
    barcode: '884100100008',
    name: 'Double A Copy Paper A4 80gsm 500 Sheets',
    khmerName: 'ក្រដាស A4 Double A 80gsm',
    category: 'Office Supplies',
    brand: 'Double A',
    unit: 'Box',
    costPrice: 3.40,
    salePrice: 4.80,
    wholesalePrice: 4.20,
    vipPrice: 4.50,
    stock: 50,
    minStock: 15,
    supplier: 'Phnom Penh Stationery Co.',
    description: 'Premium smooth paper for inkjet and laser printing',
    imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=300&auto=format&fit=crop&q=80',
    status: 'In Stock',
    createdDate: '2026-08-05'
  },
  {
    productId: 'PRD-000009',
    barcode: '884100100009',
    name: 'Head & Shoulders Shampoo 330ml',
    khmerName: 'សាប៊ូកក់សក់ Head & Shoulders 330ml',
    category: 'Personal Care',
    brand: 'P&G',
    unit: 'Bottle',
    costPrice: 2.80,
    salePrice: 4.20,
    wholesalePrice: 3.60,
    vipPrice: 3.90,
    stock: 0,
    minStock: 8,
    supplier: 'DKSH Cambodia',
    description: 'Cool menthol anti-dandruff daily shampoo',
    imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300&auto=format&fit=crop&q=80',
    status: 'Out of Stock',
    createdDate: '2026-08-05'
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'CAT-01', name: 'Beverages', khmerName: 'ភេសជ្ជៈ', icon: 'Coffee', itemCount: 3 },
  { id: 'CAT-02', name: 'Snacks & Food', khmerName: 'ចំណីអាហារ & អាហារសម្រន់', icon: 'Utensils', itemCount: 2 },
  { id: 'CAT-03', name: 'Electronics', khmerName: 'ឧបករណ៍អេឡិចត្រូនិច', icon: 'Smartphone', itemCount: 2 },
  { id: 'CAT-04', name: 'Personal Care', khmerName: 'គ្រឿងថែរក្សាសម្រស់', icon: 'Sparkles', itemCount: 1 },
  { id: 'CAT-05', name: 'Office Supplies', khmerName: 'សម្ភារៈការិយាល័យ', icon: 'FileText', itemCount: 1 }
];

export const INITIAL_BRANDS: Brand[] = [
  { id: 'BRD-01', name: 'Angkor Beer', description: 'Cambrew Brewery' },
  { id: 'BRD-02', name: 'Kulen Water', description: 'Natural mineral water' },
  { id: 'BRD-03', name: 'Amru Rice', description: 'Export grade organic rice' },
  { id: 'BRD-04', name: 'Baseus', description: 'Digital electronics accessories' },
  { id: 'BRD-05', name: 'Double A', description: 'Office Paper' }
];

export const INITIAL_UNITS: Unit[] = [
  { id: 'UNT-01', name: 'Piece', khmerName: 'ដុំ/គ្រាប់', shortCode: 'Pcs' },
  { id: 'UNT-02', name: 'Can', khmerName: 'កំប៉ុង', shortCode: 'Can' },
  { id: 'UNT-03', name: 'Bottle', khmerName: 'ដប', shortCode: 'Btl' },
  { id: 'UNT-04', name: 'Box', khmerName: 'កេស/ប្រអប់', shortCode: 'Box' },
  { id: 'UNT-05', name: 'Pack', khmerName: 'កញ្ចប់', shortCode: 'Pack' },
  { id: 'UNT-06', name: 'Kg', khmerName: 'គីឡូក្រាម', shortCode: 'Kg' },
  { id: 'UNT-07', name: 'Set', khmerName: 'ឈុត', shortCode: 'Set' }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    customerId: 'CUS-000001',
    name: 'General Walk-in Customer',
    phone: '012 000 000',
    address: 'Phnom Penh',
    customerGroup: 'General',
    discountRate: 0,
    creditLimit: 0,
    balance: 0,
    totalPurchased: 450.00,
    status: 'Active',
    createdDate: '2026-08-01'
  },
  {
    customerId: 'CUS-000002',
    name: 'Sokha Ly (VIP Member)',
    phone: '012 345 678',
    email: 'sokha.ly@gmail.com',
    address: 'Toul Kork, Phnom Penh',
    customerGroup: 'VIP',
    discountRate: 5,
    creditLimit: 500,
    balance: 45.00,
    totalPurchased: 1250.00,
    status: 'Active',
    createdDate: '2026-08-02'
  },
  {
    customerId: 'CUS-000003',
    name: 'Bopha Coffee & Mart (Wholesale)',
    phone: '098 765 432',
    email: 'bopha.mart@yahoo.com',
    address: 'Chamkarmon, Phnom Penh',
    customerGroup: 'Wholesale',
    discountRate: 10,
    creditLimit: 2000,
    balance: 150.00,
    totalPurchased: 3400.00,
    status: 'Active',
    createdDate: '2026-08-03'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    supplierId: 'SUP-000001',
    name: 'Cambrew Ltd',
    contactPerson: 'Mr. David Heng',
    phone: '023 880 123',
    email: 'orders@cambrew.com.kh',
    address: 'Sihanoukville & Phnom Penh Depot',
    balance: 240.00,
    status: 'Active',
    createdDate: '2026-08-01'
  },
  {
    supplierId: 'SUP-000002',
    name: 'Kulen Water Co.',
    contactPerson: 'Ms. Chantrea',
    phone: '012 999 888',
    email: 'sales@kulenwater.com',
    address: 'Siem Reap & Phnom Penh',
    balance: 0.00,
    status: 'Active',
    createdDate: '2026-08-01'
  },
  {
    supplierId: 'SUP-000003',
    name: 'Smart Tech Distribution',
    contactPerson: 'Vireak Chea',
    phone: '017 555 444',
    email: 'vireak@smarttech.kh',
    address: 'St 214, Daun Penh, Phnom Penh',
    balance: 480.00,
    status: 'Active',
    createdDate: '2026-08-02'
  }
];

export const INITIAL_EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: 'EXPCAT-01', name: 'Rent', khmerName: 'ថ្លៃឈ្នួលទីតាំង', icon: 'Building' },
  { id: 'EXPCAT-02', name: 'Electricity', khmerName: 'ថ្លៃអគ្គិសនី (EDC)', icon: 'Zap' },
  { id: 'EXPCAT-03', name: 'Water', khmerName: 'ថ្លៃទឹកស្អាត', icon: 'Droplets' },
  { id: 'EXPCAT-04', name: 'Internet', khmerName: 'ថ្លៃអ៊ីនធឺណិត', icon: 'Wifi' },
  { id: 'EXPCAT-05', name: 'Salary', khmerName: 'ប្រាក់បៀវត្សបុគ្គលិក', icon: 'Users' },
  { id: 'EXPCAT-06', name: 'Transportation', khmerName: 'ថ្លៃដឹកជញ្ជូន', icon: 'Truck' },
  { id: 'EXPCAT-07', name: 'Maintenance', khmerName: 'ថ្លៃជួសជុលថែទាំ', icon: 'Wrench' },
  { id: 'EXPCAT-08', name: 'Other', khmerName: 'ចំណាយផ្សេងៗ', icon: 'MoreHorizontal' }
];

export const INITIAL_SETTINGS: AppSettings = {
  storeName: 'Khmer Smart Mart & POS',
  storeNameKhmer: 'ខ្មែរ ស្មាតម៉ាត & ប្រព័ន្ធគ្រប់គ្រងការលក់',
  address: '#128, St 271, Sangkat Boeung Tumpun, Khan Meanchey, Phnom Penh',
  phone: '012 888 999 / 097 555 666',
  email: 'info@khmersmartmart.com',
  vatNumber: 'K001-902345678',
  currency: 'USD',
  exchangeRate: 4100, // 1 USD = 4,100 KHR
  taxRate: 0,
  receiptFooter: 'Thank you for shopping with us! Please come again.',
  receiptFooterKhmer: 'សូមអរគុណចំពោះការគាំទ្រ! សូមអញ្ជើញមកម្តងទៀត។',
  googleAppsScriptUrl: '',
  isGasConnected: false,
  thermalWidth: '80mm'
};

export const INITIAL_USERS: User[] = [
  {
    userId: 'USR-000001',
    username: 'admin',
    fullName: 'Super Administrator',
    phone: '012 888 999',
    email: 'admin@khmerpos.com',
    role: 'Super Admin',
    branch: 'Main Branch (Phnom Penh)',
    status: 'Active',
    createdDate: '2026-08-01'
  },
  {
    userId: 'USR-000002',
    username: 'manager',
    fullName: 'Sok Vichea (Store Manager)',
    phone: '012 444 333',
    email: 'vichea@khmerpos.com',
    role: 'Manager',
    branch: 'Main Branch (Phnom Penh)',
    status: 'Active',
    createdDate: '2026-08-02'
  },
  {
    userId: 'USR-000003',
    username: 'cashier',
    fullName: 'Dara Chan (Cashier #1)',
    phone: '098 111 222',
    email: 'dara@khmerpos.com',
    role: 'Cashier',
    branch: 'Main Branch (Phnom Penh)',
    status: 'Active',
    createdDate: '2026-08-03'
  }
];

export const INITIAL_SALES: Sale[] = [
  {
    saleId: 'SAL-20260818-0001',
    invoiceNumber: 'INV-20260818-0001',
    date: '2026-08-18 10:24',
    customerId: 'CUS-000001',
    customerName: 'General Walk-in Customer',
    customerGroup: 'General',
    cashierName: 'Dara Chan',
    items: [
      {
        productId: 'PRD-000001',
        productName: 'Angkor Premium Beer 330ml Can',
        barcode: '884100100001',
        unit: 'Can',
        quantity: 4,
        unitPrice: 0.75,
        costPrice: 0.55,
        discount: 0,
        total: 3.00,
        profit: 0.80
      },
      {
        productId: 'PRD-000005',
        productName: 'Mama Instant Noodles Tom Yum 1 Pack',
        barcode: '884100100005',
        unit: 'Pack',
        quantity: 2,
        unitPrice: 0.45,
        costPrice: 0.25,
        discount: 0,
        total: 0.90,
        profit: 0.40
      }
    ],
    subtotal: 3.90,
    discount: 0,
    tax: 0,
    total: 3.90,
    totalKHR: 15990,
    paidUSD: 5.00,
    paidKHR: 0,
    changeUSD: 1.10,
    changeKHR: 4510,
    dueAmount: 0,
    profit: 1.20,
    paymentMethod: 'Cash',
    status: 'Completed',
    notes: 'POS Sale Walk-in',
    exchangeRateUsed: 4100
  },
  {
    saleId: 'SAL-20260818-0002',
    invoiceNumber: 'INV-20260818-0002',
    date: '2026-08-18 14:15',
    customerId: 'CUS-000002',
    customerName: 'Sokha Ly (VIP Member)',
    customerGroup: 'VIP',
    cashierName: 'Dara Chan',
    items: [
      {
        productId: 'PRD-000006',
        productName: 'Type-C Fast Charging Cable 1.5m 65W',
        barcode: '884100100006',
        unit: 'Piece',
        quantity: 1,
        unitPrice: 4.50,
        costPrice: 2.20,
        discount: 0.22,
        total: 4.28,
        profit: 2.08
      }
    ],
    subtotal: 4.50,
    discount: 0.22,
    tax: 0,
    total: 4.28,
    totalKHR: 17548,
    paidUSD: 0,
    paidKHR: 18000,
    changeUSD: 0.11,
    changeKHR: 452,
    dueAmount: 0,
    profit: 2.08,
    paymentMethod: 'ABA',
    status: 'Completed',
    notes: 'ABA KHQR scan payment',
    exchangeRateUsed: 4100
  }
];

export const INITIAL_PURCHASES: Purchase[] = [
  {
    purchaseId: 'PUR-20260815-0001',
    date: '2026-08-15',
    supplierId: 'SUP-000001',
    supplierName: 'Cambrew Ltd',
    invoiceNumber: 'CAM-99201',
    items: [
      {
        productId: 'PRD-000001',
        productName: 'Angkor Premium Beer 330ml Can',
        barcode: '884100100001',
        unit: 'Can',
        quantity: 100,
        costPrice: 0.55,
        discount: 0,
        tax: 0,
        total: 55.00
      }
    ],
    subtotal: 55.00,
    discount: 0,
    tax: 0,
    total: 55.00,
    paidAmount: 55.00,
    dueAmount: 0,
    paymentMethod: 'ABA',
    status: 'Received',
    note: 'Initial restock',
    createdUser: 'Super Administrator'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    expenseId: 'EXP-20260810-0001',
    date: '2026-08-10',
    category: 'Electricity',
    description: 'Electricité du Cambodge (EDC) Bill July',
    amountUSD: 85.50,
    amountKHR: 350550,
    paymentMethod: 'ABA',
    user: 'Super Administrator',
    note: 'Monthly power bill'
  },
  {
    expenseId: 'EXP-20260812-0002',
    date: '2026-08-12',
    category: 'Internet',
    description: 'OpenNet Fiber optic 50Mbps subscription',
    amountUSD: 25.00,
    amountKHR: 102500,
    paymentMethod: 'Cash',
    user: 'Super Administrator',
    note: 'Monthly shop internet'
  }
];

export const INITIAL_STOCK_MOVEMENTS: StockMovement[] = [
  {
    movementId: 'MOV-000001',
    date: '2026-08-15 09:00',
    productId: 'PRD-000001',
    productName: 'Angkor Premium Beer 330ml Can',
    type: 'PURCHASE',
    referenceId: 'PUR-20260815-0001',
    quantityChange: 100,
    previousStock: 24,
    newStock: 124,
    user: 'Super Administrator',
    notes: 'Goods received from Cambrew Ltd'
  },
  {
    movementId: 'MOV-000002',
    date: '2026-08-18 10:24',
    productId: 'PRD-000001',
    productName: 'Angkor Premium Beer 330ml Can',
    type: 'SALE',
    referenceId: 'SAL-20260818-0001',
    quantityChange: -4,
    previousStock: 124,
    newStock: 120,
    user: 'Dara Chan',
    notes: 'POS Sale to Walk-in Customer'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'LOG-000001',
    timestamp: '2026-08-18 08:30:00',
    user: 'admin',
    action: 'SYSTEM_BOOT',
    module: 'System',
    recordId: 'SYS',
    details: 'Database initialized with 25 Google Sheets schema & local caching engine.'
  }
];

// Helper to generate custom consecutive IDs
export function generateCustomId(prefix: string, listLength: number): string {
  const nextNum = listLength + 1;
  const padded = String(nextNum).padStart(6, '0');
  return `${prefix}-${padded}`;
}

export function generateDateBasedId(prefix: string, countToday: number): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const padded = String(countToday + 1).padStart(4, '0');
  return `${prefix}-${yyyy}${mm}${dd}-${padded}`;
}

// Local Storage & Dual-Sync Database Service
export class DatabaseService {
  private static getItem<T>(key: string, defaultVal: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  private static setItem<T>(key: string, val: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  // Load All State
  static loadAllState() {
    return {
      products: this.getItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS),
      categories: this.getItem<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES),
      brands: this.getItem<Brand[]>(STORAGE_KEYS.BRANDS, INITIAL_BRANDS),
      units: this.getItem<Unit[]>(STORAGE_KEYS.UNITS, INITIAL_UNITS),
      customers: this.getItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS),
      suppliers: this.getItem<Supplier[]>(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS),
      purchases: this.getItem<Purchase[]>(STORAGE_KEYS.PURCHASES, INITIAL_PURCHASES),
      sales: this.getItem<Sale[]>(STORAGE_KEYS.SALES, INITIAL_SALES),
      expenses: this.getItem<Expense[]>(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES),
      expenseCategories: this.getItem<ExpenseCategory[]>(STORAGE_KEYS.EXPENSE_CATEGORIES, INITIAL_EXPENSE_CATEGORIES),
      stockAdjustments: this.getItem<StockAdjustment[]>(STORAGE_KEYS.STOCK_ADJUSTMENTS, []),
      stockMovements: this.getItem<StockMovement[]>(STORAGE_KEYS.STOCK_MOVEMENTS, INITIAL_STOCK_MOVEMENTS),
      users: this.getItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS),
      settings: this.getItem<AppSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS),
      auditLogs: this.getItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS),
      currentUser: this.getItem<User | null>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0])
    };
  }

  static saveProducts(data: Product[]) { this.setItem(STORAGE_KEYS.PRODUCTS, data); }
  static saveSales(data: Sale[]) { this.setItem(STORAGE_KEYS.SALES, data); }
  static savePurchases(data: Purchase[]) { this.setItem(STORAGE_KEYS.PURCHASES, data); }
  static saveExpenses(data: Expense[]) { this.setItem(STORAGE_KEYS.EXPENSES, data); }
  static saveCustomers(data: Customer[]) { this.setItem(STORAGE_KEYS.CUSTOMERS, data); }
  static saveSuppliers(data: Supplier[]) { this.setItem(STORAGE_KEYS.SUPPLIERS, data); }
  static saveStockMovements(data: StockMovement[]) { this.setItem(STORAGE_KEYS.STOCK_MOVEMENTS, data); }
  static saveStockAdjustments(data: StockAdjustment[]) { this.setItem(STORAGE_KEYS.STOCK_ADJUSTMENTS, data); }
  static saveCategories(data: Category[]) { this.setItem(STORAGE_KEYS.CATEGORIES, data); }
  static saveBrands(data: Brand[]) { this.setItem(STORAGE_KEYS.BRANDS, data); }
  static saveUnits(data: Unit[]) { this.setItem(STORAGE_KEYS.UNITS, data); }
  static saveUsers(data: User[]) { this.setItem(STORAGE_KEYS.USERS, data); }
  static saveSettings(data: AppSettings) { this.setItem(STORAGE_KEYS.SETTINGS, data); }
  static saveAuditLogs(data: AuditLog[]) { this.setItem(STORAGE_KEYS.AUDIT_LOGS, data); }
  static saveCurrentUser(data: User | null) { this.setItem(STORAGE_KEYS.CURRENT_USER, data); }

  // Sync / Call Google Apps Script Web App API
  static async callGasApi(url: string, action: string, payload: any = {}): Promise<ApiResponse> {
    if (!url || !url.startsWith('http')) {
      return { success: false, message: 'Google Apps Script URL មិនទាន់ត្រូវបានកំណត់', data: null };
    }

    try {
      // Use fetch to POST or GET to Google Apps Script Web App
      const isGet = action.startsWith('get') || action === 'ping' || action === 'checkHealth';
      let endpoint = url;
      let options: RequestInit = {};

      if (isGet) {
        endpoint += (endpoint.includes('?') ? '&' : '?') + `action=${encodeURIComponent(action)}`;
        options = { method: 'GET', mode: 'cors' };
      } else {
        options = {
          method: 'POST',
          mode: 'no-cors', // standard for Google Apps Script redirects in browser
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action, payload })
        };
      }

      const res = await fetch(endpoint, options);
      if (options.mode === 'no-cors') {
        return { success: true, message: 'Data synced with Google Apps Script Web App', data: payload };
      }
      const data = await res.json();
      return data;
    } catch (err: any) {
      console.warn('Google Apps Script call error (fallback local active):', err);
      return { success: false, message: 'Google Apps Script sync timeout: ' + (err.message || 'Network error'), data: null };
    }
  }

  // Currency helpers
  static formatUSD(amount: number): string {
    return '$' + (amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  static formatKHR(amount: number): string {
    return (Math.round(amount || 0)).toLocaleString('en-US') + ' ៛';
  }

  static convertUSDToKHR(usdAmount: number, rate: number = 4100): number {
    return Math.round((usdAmount || 0) * (rate || 4100));
  }

  static convertKHRToUSD(khrAmount: number, rate: number = 4100): number {
    return (khrAmount || 0) / (rate || 4100);
  }
}
