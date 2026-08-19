export type UserRole = 'Super Admin' | 'Admin' | 'Manager' | 'Cashier' | 'Staff';

export interface User {
  userId: string;
  username: string;
  fullName: string;
  phone: string;
  email: string;
  role: UserRole;
  branch: string;
  status: 'Active' | 'Inactive';
  createdDate: string;
}

export interface Permission {
  role: UserRole;
  modules: {
    dashboard: { view: boolean };
    products: { view: boolean; create: boolean; edit: boolean; delete: boolean; print: boolean; export: boolean };
    purchases: { view: boolean; create: boolean; edit: boolean; delete: boolean };
    stock: { view: boolean; adjust: boolean };
    sales: { view: boolean; create: boolean; return: boolean; delete: boolean };
    pos: { view: boolean; process: boolean; discount: boolean };
    customers: { view: boolean; create: boolean; edit: boolean; delete: boolean };
    suppliers: { view: boolean; create: boolean; edit: boolean; delete: boolean };
    expenses: { view: boolean; create: boolean; edit: boolean; delete: boolean };
    reports: { view: boolean; export: boolean; print: boolean };
    users: { view: boolean; create: boolean; edit: boolean; delete: boolean };
    settings: { view: boolean; edit: boolean };
  };
}

export interface Product {
  productId: string;
  barcode: string;
  name: string;
  khmerName?: string;
  category: string;
  brand: string;
  motorcycleModel?: string; // e.g. ADV 160, PCX 160, SCOOPY, PG-1, CT125, ALL
  unit: string;
  costPrice: number; // in USD
  salePrice: number; // in USD
  wholesalePrice: number; // in USD
  vipPrice?: number; // in USD
  stock: number;
  minStock: number;
  supplier: string;
  description?: string;
  imageUrl?: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Inactive';
  createdDate: string;
}

export interface Category {
  id: string;
  name: string;
  khmerName: string;
  icon?: string;
  itemCount?: number;
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
}

export interface Unit {
  id: string;
  name: string;
  khmerName: string;
  shortCode: string;
}

export type CustomerGroup = 'General' | 'Retail' | 'Wholesale' | 'VIP';

export interface Customer {
  customerId: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  customerGroup: CustomerGroup;
  discountRate: number; // percentage e.g. 5 for 5%
  creditLimit: number; // in USD
  balance: number; // Current debt owed by customer (USD)
  totalPurchased: number; // Total purchases to date
  status: 'Active' | 'Inactive';
  createdDate: string;
}

export interface Supplier {
  supplierId: string;
  name: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address?: string;
  balance: number; // Outstanding amount we owe the supplier (USD)
  status: 'Active' | 'Inactive';
  createdDate: string;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  barcode: string;
  unit: string;
  quantity: number;
  costPrice: number; // USD
  discount: number; // USD
  tax: number; // USD
  total: number; // USD
}

export interface Purchase {
  purchaseId: string;
  date: string;
  supplierId: string;
  supplierName: string;
  invoiceNumber: string;
  items: PurchaseItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paidAmount: number;
  dueAmount: number;
  paymentMethod: string;
  status: 'Received' | 'Pending' | 'Cancelled';
  note?: string;
  createdUser: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  barcode: string;
  unit: string;
  quantity: number;
  unitPrice: number; // USD
  costPrice: number; // USD (for profit calculation)
  discount: number; // USD
  total: number; // USD
  profit: number; // (unitPrice - costPrice) * quantity - discount
}

export type PaymentMethod = 'Cash' | 'ABA' | 'ACLEDA' | 'Wing' | 'Credit' | 'Other';

export interface Sale {
  saleId: string;
  invoiceNumber: string;
  date: string;
  customerId: string;
  customerName: string;
  customerGroup: CustomerGroup;
  cashierName: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number; // USD
  totalKHR: number; // KHR
  paidUSD: number;
  paidKHR: number;
  changeUSD: number;
  changeKHR: number;
  dueAmount: number;
  profit: number;
  paymentMethod: PaymentMethod;
  status: 'Completed' | 'Refunded' | 'Hold';
  notes?: string;
  exchangeRateUsed: number;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  khmerName: string;
  icon?: string;
}

export interface Expense {
  expenseId: string;
  date: string;
  category: string;
  description: string;
  amountUSD: number;
  amountKHR: number;
  paymentMethod: string;
  user: string;
  note?: string;
}

export type AdjustmentType = 'Stock In' | 'Stock Out' | 'Damage' | 'Lost' | 'Expired' | 'Correction';

export interface StockAdjustment {
  adjustmentId: string;
  date: string;
  productId: string;
  productName: string;
  barcode: string;
  currentStock: number;
  adjustmentQty: number; // positive or negative
  newStock: number;
  adjustmentType: AdjustmentType;
  reason: string;
  user: string;
}

export interface StockMovement {
  movementId: string;
  date: string;
  productId: string;
  productName: string;
  type: 'SALE' | 'PURCHASE' | 'ADJUSTMENT' | 'RETURN';
  referenceId: string; // e.g. SAL-..., PUR-..., ADJ-...
  quantityChange: number;
  previousStock: number;
  newStock: number;
  user: string;
  notes?: string;
}

export interface Branch {
  branchId: string;
  name: string;
  address: string;
  phone: string;
  manager: string;
  status: 'Active' | 'Inactive';
}

export interface AppSettings {
  storeName: string;
  storeNameKhmer: string;
  logoUrl?: string;
  address: string;
  phone: string;
  email: string;
  vatNumber: string;
  currency: 'USD' | 'KHR';
  exchangeRate: number; // e.g. 4100
  taxRate: number; // e.g. 0% or 10%
  receiptFooter: string;
  receiptFooterKhmer: string;
  googleAppsScriptUrl: string;
  isGasConnected: boolean;
  thermalWidth: '58mm' | '80mm';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  recordId: string;
  details: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}
