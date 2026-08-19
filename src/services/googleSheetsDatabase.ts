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

// Initial Seed Data with Motorcycle Accessories for ADV, PCX, SCOOPY, PG-1, CT125
export const INITIAL_PRODUCTS: Product[] = [
  {
    productId: 'PRD-000001',
    barcode: '885001001001',
    name: 'YSS G-Sport Rear Shock 365mm (Black/Red Edition)',
    khmerName: 'បូមក្រោយ YSS G-Sport 365mm (ADV 160 / 350)',
    category: 'បូម & ជើងក្រោម',
    brand: 'YSS Suspension',
    motorcycleModel: 'ADV 160',
    unit: 'Set',
    costPrice: 185.00,
    salePrice: 245.00,
    wholesalePrice: 215.00,
    vipPrice: 230.00,
    stock: 12,
    minStock: 3,
    supplier: 'YSS Cambodia Racing Parts',
    description: 'បូម YSS G-Sport Subtank កែសម្រួល Rebound & Preload សម្រាប់ Honda ADV 160/350 ជិះស្រួល ទប់លំនឹងល្អ',
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&auto=format&fit=crop&q=80',
    status: 'In Stock',
    createdDate: '2026-08-01'
  },
  {
    productId: 'PRD-000002',
    barcode: '885001001002',
    name: 'Brembo 4-Piston Caliper + CNC Bracket Set',
    khmerName: 'ដង្កៀបហ្វ្រាំង Brembo 4-Pot + ជើងចាប់ CNC (PCX / ADV)',
    category: 'ប្រព័ន្ធហ្វ្រាំង & ឌីស',
    brand: 'Brembo',
    motorcycleModel: 'PCX 160',
    unit: 'Set',
    costPrice: 95.00,
    salePrice: 145.00,
    wholesalePrice: 125.00,
    vipPrice: 135.00,
    stock: 18,
    minStock: 4,
    supplier: 'Brembo Performance KH',
    description: 'ដង្កៀបហ្វ្រាំង Brembo 4 Pistons ជួយទប់ហ្វ្រាំងស៊ីខ្លាំង សុវត្ថិភាពខ្ពស់ មកជាមួយជើងចាប់ CNC អាលុយមីញ៉ូម',
    imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400&auto=format&fit=crop&q=80',
    status: 'In Stock',
    createdDate: '2026-08-01'
  },
  {
    productId: 'PRD-000003',
    barcode: '885001001003',
    name: 'Kitaco Heavy-Duty Crash Bar & Engine Guard',
    khmerName: 'កាងការពារជុំវិញ និងបន្ទះការពារម៉ាស៊ីន Kitaco (Yamaha PG-1)',
    category: 'កាង & ការពារ (Crash Bar)',
    brand: 'Kitaco Japan',
    motorcycleModel: 'PG-1',
    unit: 'Set',
    costPrice: 65.00,
    salePrice: 98.00,
    wholesalePrice: 82.00,
    vipPrice: 90.00,
    stock: 15,
    minStock: 4,
    supplier: 'Adventure Moto Supply',
    description: 'កាងដែកថែបក្រាស់ ការពារម៉ូតូពេលដួល ម៉ូតស្អាតស័ក្តិសមជាមួយ Yamaha PG-1',
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&auto=format&fit=crop&q=80',
    status: 'In Stock',
    createdDate: '2026-08-02'
  },
  {
    productId: 'PRD-000004',
    barcode: '885001001004',
    name: 'Akrapovic Slip-On Titanium Exhaust Full System',
    khmerName: 'បំពង់ស៊ីមាំង Akrapovic Titanium Full System (ADV / PCX)',
    category: 'បំពង់ផ្សែង & ស៊ីមាំង',
    brand: 'Akrapovic',
    motorcycleModel: 'ADV 160',
    unit: 'Set',
    costPrice: 220.00,
    salePrice: 320.00,
    wholesalePrice: 275.00,
    vipPrice: 295.00,
    stock: 6,
    minStock: 2,
    supplier: 'Racing Exhaust World',
    description: 'បំពង់ផ្សែង Titanium សំឡេងពិរោះ ស្រទន់ ជួយឱ្យម៉ាស៊ីនស្ទុះខ្លាំង បង្កើនកម្លាំងសេះ',
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&auto=format&fit=crop&q=80',
    status: 'In Stock',
    createdDate: '2026-08-02'
  },
  {
    productId: 'PRD-000005',
    barcode: '885001001005',
    name: 'Michelin City Extra Dual Tire Set (110/80-14 & 130/70-13)',
    khmerName: 'សំបកកង់ Michelin City Extra (PCX 160 / ADV 160)',
    category: 'សំបកកង់ & យ៉ាន់',
    brand: 'Michelin',
    motorcycleModel: 'PCX 160',
    unit: 'Pair',
    costPrice: 72.00,
    salePrice: 105.00,
    wholesalePrice: 90.00,
    vipPrice: 98.00,
    stock: 24,
    minStock: 6,
    supplier: 'Michelin Cambodia Tire Distributor',
    description: 'សំបកកង់ស្វិត ស្អិតជាប់ផ្លូវល្អ មិនរអិលពេលភ្លៀង ប្រើប្រាស់បានយូរអង្វែង',
    imageUrl: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=400&auto=format&fit=crop&q=80',
    status: 'In Stock',
    createdDate: '2026-08-03'
  },
  {
    productId: 'PRD-000006',
    barcode: '885001001006',
    name: 'Motowolf Vibration Dampener Phone Mount with Fast Qi Charge',
    khmerName: 'ជើងចាប់ទូរស័ព្ទ Motowolf កាត់រំញ័រ + សាកថ្មឥតខ្សែ (Wireless)',
    category: 'គ្រឿងអេឡិចត្រូនិក & ជើងទូរស័ព្ទ',
    brand: 'Motowolf',
    motorcycleModel: 'ALL',
    unit: 'Pcs',
    costPrice: 18.00,
    salePrice: 29.00,
    wholesalePrice: 23.00,
    vipPrice: 26.00,
    stock: 45,
    minStock: 10,
    supplier: 'Motowolf Official Cambodia',
    description: 'ជើងចាប់ទូរស័ព្ទអាលុយមីញ៉ូម CNC កាត់រំញ័រការពារកាមេរ៉ាទូរស័ព្ទ មានប្រព័ន្ធ Fast Wireless Charge 15W',
    imageUrl: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400&auto=format&fit=crop&q=80',
    status: 'In Stock',
    createdDate: '2026-08-03'
  },
  {
    productId: 'PRD-000007',
    barcode: '885001001007',
    name: 'Spirit Beast 60W Dual LED Spotlight with Strobe',
    khmerName: 'ភ្លើងជំនួយ LED Spirit Beast 60W ភ្លើងលឿង/ស (ADV / CT125)',
    category: 'ភ្លើង & អំពូល LED',
    brand: 'Spirit Beast',
    motorcycleModel: 'CT125',
    unit: 'Pair',
    costPrice: 28.00,
    salePrice: 48.00,
    wholesalePrice: 38.00,
    vipPrice: 42.00,
    stock: 20,
    minStock: 5,
    supplier: 'Spirit Beast KH',
    description: 'អំពូលភ្លើង LED ពន្លឺខ្លាំង ចាំងឆ្ងាយ កាត់អ័ព្ទ មានមុខងារភ្លើង Flash Strobe ការពារទឹក 100% IP68',
    imageUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&auto=format&fit=crop&q=80',
    status: 'In Stock',
    createdDate: '2026-08-04'
  },
  {
    productId: 'PRD-000008',
    barcode: '885001001008',
    name: 'Moritech CNC Brake Levers & Mirror Block (Red Edition)',
    khmerName: 'ដៃហ្វ្រាំង CNC Moritech កាច់បត់បាន (Honda Scoopy / Click)',
    category: 'គ្រឿងតុបតែង CNC & Carbon',
    brand: 'Moritech',
    motorcycleModel: 'SCOOPY',
    unit: 'Pair',
    costPrice: 19.50,
    salePrice: 35.00,
    wholesalePrice: 26.00,
    vipPrice: 30.00,
    stock: 28,
    minStock: 6,
    supplier: 'CNC Racing Parts Thailand',
    description: 'ដៃហ្វ្រាំងអាលុយមីញ៉ូម CNC កម្រិត Premium កាច់បត់បាន មិនបាក់ពេលដួល ពណ៌ក្រហមឆើត',
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&auto=format&fit=crop&q=80',
    status: 'In Stock',
    createdDate: '2026-08-04'
  },
  {
    productId: 'PRD-000009',
    barcode: '885001001009',
    name: 'IRC GP-22 Dual Purpose Off-Road Tire Set',
    khmerName: 'សំបកកង់បន្លា Off-Road IRC GP-22 (Yamaha PG-1 / Honda CT125)',
    category: 'សំបកកង់ & យ៉ាន់',
    brand: 'IRC Tire',
    motorcycleModel: 'PG-1',
    unit: 'Pair',
    costPrice: 55.00,
    salePrice: 85.00,
    wholesalePrice: 70.00,
    vipPrice: 78.00,
    stock: 14,
    minStock: 4,
    supplier: 'Adventure Moto Supply',
    description: 'សំបកកង់បន្លាស្ទីល Adventure ជិះផ្លូវដី ភក់ និងផ្លូវជាតិបានយ៉ាងស្រួល',
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&auto=format&fit=crop&q=80',
    status: 'In Stock',
    createdDate: '2026-08-05'
  },
  {
    productId: 'PRD-000010',
    barcode: '885001001010',
    name: 'RCB Racing Boy Alloy Forged Wheels (12-inch Red/Gold)',
    khmerName: 'រង្វង់យ៉ាន់ RCB Racing Boy 12-inch (Honda Scoopy / Giorno+)',
    category: 'សំបកកង់ & យ៉ាន់',
    brand: 'RCB (Racing Boy)',
    motorcycleModel: 'SCOOPY',
    unit: 'Pair',
    costPrice: 110.00,
    salePrice: 165.00,
    wholesalePrice: 138.00,
    vipPrice: 150.00,
    stock: 8,
    minStock: 2,
    supplier: 'RCB Racing Boy Cambodia',
    description: 'យ៉ាន់ Forged អាលុយមីញ៉ូមទម្ងន់ស្រាល រឹងមាំ ពណ៌ក្រហម/មាស បង្កើនសម្រស់ម៉ូតូ Scoopy & Giorno',
    imageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=400&auto=format&fit=crop&q=80',
    status: 'In Stock',
    createdDate: '2026-08-05'
  },
  {
    productId: 'PRD-000011',
    barcode: '885001001011',
    name: 'Honda CT125 Center Luggage Rack & Front Basket Set',
    khmerName: 'កញ្ច្រែងមុខ និងកែបកណ្តាលដាក់ឥវ៉ាន់ (Honda CT125 Trail Hunter)',
    category: 'កាង & ការពារ (Crash Bar)',
    brand: 'Kitaco Japan',
    motorcycleModel: 'CT125',
    unit: 'Set',
    costPrice: 42.00,
    salePrice: 68.00,
    wholesalePrice: 54.00,
    vipPrice: 60.00,
    stock: 16,
    minStock: 3,
    supplier: 'Adventure Moto Supply',
    description: 'កញ្ច្រែងដែកថែបខ្មៅស្អាត ងាយស្រួលផ្ទុកឥវ៉ាន់ពេលដើរលេង Camping / Touring',
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&auto=format&fit=crop&q=80',
    status: 'In Stock',
    createdDate: '2026-08-05'
  },
  {
    productId: 'PRD-000012',
    barcode: '885001001012',
    name: 'Motul 300V Factory Line Road Racing 10W-40 1L',
    khmerName: 'ប្រេងម៉ាស៊ីន Motul 300V 10W-40 1L (100% Synthetic Ester Core)',
    category: 'ប្រេង & ទឹកស្អំ',
    brand: 'Motul',
    motorcycleModel: 'ALL',
    unit: 'Btl',
    costPrice: 16.50,
    salePrice: 23.00,
    wholesalePrice: 19.50,
    vipPrice: 21.00,
    stock: 40,
    minStock: 12,
    supplier: 'Motul Cambodia Official',
    description: 'ប្រេងម៉ាស៊ីនកម្រិតប្រណាំង ជួយការពារម៉ាស៊ីនកម្តៅខ្លាំង ស្ទុះរលូន និងសន្សំសំចៃសាំង',
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&auto=format&fit=crop&q=80',
    status: 'In Stock',
    createdDate: '2026-08-06'
  }
];

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
    createdDate: '2026-08-01'
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
    createdDate: '2026-08-01'
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
    createdDate: '2026-08-02'
  }
];

export const INITIAL_PURCHASES: Purchase[] = [
  {
    purchaseId: 'PUR-20260801-001',
    date: '2026-08-01 10:30:00',
    supplierId: 'SUP-000001',
    supplierName: 'YSS Cambodia Racing Parts',
    invoiceNumber: 'INV-YSS-8991',
    items: [
      {
        productId: 'PRD-000001',
        productName: 'YSS G-Sport Rear Shock 365mm',
        barcode: '885001001001',
        unit: 'Set',
        quantity: 10,
        costPrice: 185.00,
        discount: 0,
        tax: 0,
        total: 1850.00
      }
    ],
    subtotal: 1850.00,
    discount: 0,
    tax: 0,
    total: 1850.00,
    paidAmount: 1850.00,
    dueAmount: 0,
    paymentMethod: 'ABA',
    status: 'Received',
    note: 'Initial stock of YSS Shocks for ADV 160',
    createdUser: 'Berry Moto Admin'
  }
];

export const INITIAL_SALES: Sale[] = [
  {
    saleId: 'SAL-20260802-001',
    invoiceNumber: 'INV-260802-0001',
    date: '2026-08-02 14:15:20',
    customerId: 'CUS-000002',
    customerName: 'Khem Chantha (Honda ADV Club)',
    customerGroup: 'VIP',
    cashierName: 'Berry Moto Admin',
    items: [
      {
        productId: 'PRD-000001',
        productName: 'YSS G-Sport Rear Shock 365mm',
        barcode: '885001001001',
        unit: 'Set',
        quantity: 1,
        unitPrice: 245.00,
        costPrice: 185.00,
        discount: 12.25, // 5% VIP discount
        total: 232.75,
        profit: 47.75
      },
      {
        productId: 'PRD-000006',
        productName: 'Motowolf Vibration Dampener Phone Mount',
        barcode: '885001001006',
        unit: 'Pcs',
        quantity: 1,
        unitPrice: 29.00,
        costPrice: 18.00,
        discount: 1.45,
        total: 27.55,
        profit: 9.55
      }
    ],
    subtotal: 274.00,
    discount: 13.70,
    tax: 0,
    total: 260.30,
    totalKHR: 1067230,
    paidUSD: 300.00,
    paidKHR: 0,
    changeUSD: 39.70,
    changeKHR: 162770,
    dueAmount: 0,
    profit: 57.30,
    paymentMethod: 'ABA',
    status: 'Completed',
    notes: 'Free installation for ADV 160 phone mount & shock tuning',
    exchangeRateUsed: 4100
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    expenseId: 'EXP-20260802-001',
    date: '2026-08-02 17:00:00',
    category: 'Rent',
    description: 'ថ្លៃជួលទីតាំងហាងខែសីហា',
    amountUSD: 450.00,
    amountKHR: 1845000,
    paymentMethod: 'ABA',
    user: 'Berry Moto Admin',
    note: 'Payment to Landlord via ABA'
  },
  {
    expenseId: 'EXP-20260803-001',
    date: '2026-08-03 09:30:00',
    category: 'Electricity',
    description: 'ថ្លៃអគ្គិសនី EDC ប្រចាំខែ',
    amountUSD: 85.00,
    amountKHR: 348500,
    paymentMethod: 'Cash',
    user: 'Sophea Cashier',
    note: 'Paid at EDC outlet'
  }
];

export const INITIAL_STOCK_ADJUSTMENTS: StockAdjustment[] = [
  {
    adjustmentId: 'ADJ-20260803-001',
    date: '2026-08-03 16:20:00',
    productId: 'PRD-000008',
    productName: 'Moritech CNC Brake Levers',
    barcode: '885001001008',
    currentStock: 30,
    adjustmentQty: -2,
    newStock: 28,
    adjustmentType: 'Damage',
    reason: 'កោសរលាត់ពេលដឹកជញ្ជូន ដាក់តាំងបង្ហាញ',
    user: 'Dara Moto Mechanic & Stock'
  }
];

export const INITIAL_STOCK_MOVEMENTS: StockMovement[] = [
  {
    movementId: 'MOV-20260801-001',
    date: '2026-08-01 10:30:00',
    productId: 'PRD-000001',
    productName: 'YSS G-Sport Rear Shock 365mm',
    type: 'PURCHASE',
    referenceId: 'PUR-20260801-001',
    quantityChange: 10,
    previousStock: 2,
    newStock: 12,
    user: 'Berry Moto Admin',
    notes: 'Stock received from YSS Cambodia'
  },
  {
    movementId: 'MOV-20260802-001',
    date: '2026-08-02 14:15:20',
    productId: 'PRD-000001',
    productName: 'YSS G-Sport Rear Shock 365mm',
    type: 'SALE',
    referenceId: 'SAL-20260802-001',
    quantityChange: -1,
    previousStock: 12,
    newStock: 11,
    user: 'Berry Moto Admin',
    notes: 'Sold to Khem Chantha'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-08-01 08:00:00',
    user: 'Berry Moto Admin',
    action: 'SYSTEM_BOOT',
    module: 'System',
    recordId: 'SYS-01',
    details: 'Berry Moto Accessories POS initialized with Google Sheets Database'
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
    return this.load<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
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
    if (!user) return INITIAL_USERS[0];
    try {
      return JSON.parse(user);
    } catch {
      return INITIAL_USERS[0];
    }
  }
  public static saveCurrentUser(user: User | null): void {
    if (user) {
      this.save(STORAGE_KEYS.CURRENT_USER, user);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
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
