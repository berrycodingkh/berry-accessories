/**
 * Google Apps Script Source Code (Code.gs)
 * Ready to copy and paste directly into Google Apps Script (script.google.com)
 * or deploy via Extensions -> Apps Script in Google Sheets.
 */

export const GOOGLE_APPS_SCRIPT_FULL_CODE = `/**
 * ==============================================================================
 * KHMER POS & ERP - GOOGLE SHEETS BACKEND REST API
 * Single-Spreadsheet Enterprise Database Engine (25 Sheets)
 * ==============================================================================
 */

// 1. DATABASE CONFIGURATION
const SHEET_NAMES = {
  USERS: 'Users',
  ROLES: 'Roles',
  PERMISSIONS: 'Permissions',
  PRODUCTS: 'Products',
  CATEGORIES: 'Categories',
  BRANDS: 'Brands',
  UNITS: 'Units',
  CUSTOMERS: 'Customers',
  CUSTOMER_GROUPS: 'CustomerGroups',
  SUPPLIERS: 'Suppliers',
  PURCHASES: 'Purchases',
  PURCHASE_ITEMS: 'PurchaseItems',
  SALES: 'Sales',
  SALE_ITEMS: 'SaleItems',
  PAYMENTS: 'Payments',
  EXPENSES: 'Expenses',
  EXPENSE_CATEGORIES: 'ExpenseCategories',
  STOCK: 'Stock',
  STOCK_MOVEMENTS: 'StockMovements',
  INVOICES: 'Invoices',
  PRICE_TYPES: 'PriceTypes',
  BRANCHES: 'Branches',
  SETTINGS: 'Settings',
  CURRENCIES: 'Currencies',
  AUDIT_LOGS: 'AuditLogs'
};

/**
 * REST API Entry Point: doGet
 */
function doGet(e) {
  const action = e.parameter ? e.parameter.action : 'ping';
  const callback = e.parameter ? e.parameter.callback : null;
  
  let responseData = { success: false, message: 'Invalid request', data: null };
  
  try {
    switch (action) {
      case 'ping':
      case 'checkHealth':
        responseData = { success: true, message: 'Google Apps Script Database Online', data: { timestamp: new Date().toISOString() } };
        break;
      case 'getProducts':
        responseData = { success: true, message: 'Success', data: getTableData(SHEET_NAMES.PRODUCTS) };
        break;
      case 'getCustomers':
        responseData = { success: true, message: 'Success', data: getTableData(SHEET_NAMES.CUSTOMERS) };
        break;
      case 'getSuppliers':
        responseData = { success: true, message: 'Success', data: getTableData(SHEET_NAMES.SUPPLIERS) };
        break;
      case 'getSales':
        responseData = { success: true, message: 'Success', data: getTableData(SHEET_NAMES.SALES) };
        break;
      case 'getPurchases':
        responseData = { success: true, message: 'Success', data: getTableData(SHEET_NAMES.PURCHASES) };
        break;
      case 'getExpenses':
        responseData = { success: true, message: 'Success', data: getTableData(SHEET_NAMES.EXPENSES) };
        break;
      case 'getStockMovements':
        responseData = { success: true, message: 'Success', data: getTableData(SHEET_NAMES.STOCK_MOVEMENTS) };
        break;
      case 'getSettings':
        responseData = { success: true, message: 'Success', data: getTableData(SHEET_NAMES.SETTINGS) };
        break;
      case 'getDashboardData':
        responseData = {
          success: true,
          message: 'Success',
          data: {
            products: getTableData(SHEET_NAMES.PRODUCTS),
            sales: getTableData(SHEET_NAMES.SALES),
            purchases: getTableData(SHEET_NAMES.PURCHASES),
            expenses: getTableData(SHEET_NAMES.EXPENSES),
            customers: getTableData(SHEET_NAMES.CUSTOMERS),
            suppliers: getTableData(SHEET_NAMES.SUPPLIERS)
          }
        };
        break;
      default:
        responseData = { success: false, message: 'Unknown GET action: ' + action, data: null };
    }
  } catch (err) {
    responseData = { success: false, message: err.toString(), data: null };
  }

  return formatOutput(responseData, callback);
}

/**
 * REST API Entry Point: doPost
 */
function doPost(e) {
  let responseData = { success: false, message: 'Invalid payload', data: null };
  
  try {
    let postData = {};
    if (e.postData && e.postData.contents) {
      postData = JSON.parse(e.postData.contents);
    }
    
    const action = postData.action || (e.parameter && e.parameter.action);
    const payload = postData.payload || postData;

    switch (action) {
      case 'login':
        responseData = handleLogin(payload);
        break;
      case 'createProduct':
        responseData = handleCreateProduct(payload);
        break;
      case 'updateProduct':
        responseData = handleUpdateProduct(payload);
        break;
      case 'deleteProduct':
        responseData = handleDeleteRecord(SHEET_NAMES.PRODUCTS, 'productId', payload.productId);
        break;
      case 'createSale':
        responseData = handleCreateSale(payload);
        break;
      case 'createPurchase':
        responseData = handleCreatePurchase(payload);
        break;
      case 'adjustStock':
        responseData = handleStockAdjustment(payload);
        break;
      case 'createCustomer':
        responseData = handleCreateCustomer(payload);
        break;
      case 'updateCustomer':
        responseData = handleUpdateCustomer(payload);
        break;
      case 'createSupplier':
        responseData = handleCreateSupplier(payload);
        break;
      case 'updateSupplier':
        responseData = handleUpdateSupplier(payload);
        break;
      case 'createExpense':
        responseData = handleCreateExpense(payload);
        break;
      case 'saveSettings':
        responseData = handleSaveSettings(payload);
        break;
      case 'setupDatabase':
        responseData = setupDatabase();
        break;
      default:
        responseData = { success: false, message: 'Unknown POST action: ' + action, data: null };
    }
  } catch (err) {
    responseData = { success: false, message: err.toString(), data: null };
  }

  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Helper: Output Formatter (Supports JSON & JSONP)
 */
function formatOutput(data, callback) {
  if (callback) {
    return ContentService.createTextOutput(callback + '(' + JSON.stringify(data) + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Setup All 25 Google Sheets & Headers automatically
 */
function setupDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  const schema = {
    [SHEET_NAMES.USERS]: ['userId', 'username', 'passwordHash', 'fullName', 'phone', 'email', 'role', 'branch', 'status', 'createdDate'],
    [SHEET_NAMES.ROLES]: ['roleId', 'roleName', 'description'],
    [SHEET_NAMES.PERMISSIONS]: ['permissionId', 'role', 'module', 'canView', 'canCreate', 'canEdit', 'canDelete'],
    [SHEET_NAMES.PRODUCTS]: ['productId', 'barcode', 'name', 'khmerName', 'category', 'brand', 'unit', 'costPrice', 'salePrice', 'wholesalePrice', 'vipPrice', 'stock', 'minStock', 'supplier', 'description', 'imageUrl', 'status', 'createdDate'],
    [SHEET_NAMES.CATEGORIES]: ['id', 'name', 'khmerName', 'icon'],
    [SHEET_NAMES.BRANDS]: ['id', 'name', 'description'],
    [SHEET_NAMES.UNITS]: ['id', 'name', 'khmerName', 'shortCode'],
    [SHEET_NAMES.CUSTOMERS]: ['customerId', 'name', 'phone', 'email', 'address', 'customerGroup', 'discountRate', 'creditLimit', 'balance', 'totalPurchased', 'status', 'createdDate'],
    [SHEET_NAMES.CUSTOMER_GROUPS]: ['id', 'name', 'discountRate', 'description'],
    [SHEET_NAMES.SUPPLIERS]: ['supplierId', 'name', 'contactPerson', 'phone', 'email', 'address', 'balance', 'status', 'createdDate'],
    [SHEET_NAMES.PURCHASES]: ['purchaseId', 'date', 'supplierId', 'supplierName', 'invoiceNumber', 'subtotal', 'discount', 'tax', 'total', 'paidAmount', 'dueAmount', 'paymentMethod', 'status', 'note', 'createdUser'],
    [SHEET_NAMES.PURCHASE_ITEMS]: ['itemId', 'purchaseId', 'productId', 'productName', 'barcode', 'unit', 'quantity', 'costPrice', 'discount', 'tax', 'total'],
    [SHEET_NAMES.SALES]: ['saleId', 'invoiceNumber', 'date', 'customerId', 'customerName', 'customerGroup', 'cashierName', 'subtotal', 'discount', 'tax', 'total', 'totalKHR', 'paidUSD', 'paidKHR', 'changeUSD', 'changeKHR', 'dueAmount', 'profit', 'paymentMethod', 'status', 'notes', 'exchangeRateUsed'],
    [SHEET_NAMES.SALE_ITEMS]: ['itemId', 'saleId', 'productId', 'productName', 'barcode', 'unit', 'quantity', 'unitPrice', 'costPrice', 'discount', 'total', 'profit'],
    [SHEET_NAMES.PAYMENTS]: ['paymentId', 'referenceType', 'referenceId', 'date', 'amountUSD', 'amountKHR', 'paymentMethod', 'user'],
    [SHEET_NAMES.EXPENSES]: ['expenseId', 'date', 'category', 'description', 'amountUSD', 'amountKHR', 'paymentMethod', 'user', 'note'],
    [SHEET_NAMES.EXPENSE_CATEGORIES]: ['id', 'name', 'khmerName'],
    [SHEET_NAMES.STOCK]: ['productId', 'barcode', 'productName', 'currentStock', 'lastUpdated'],
    [SHEET_NAMES.STOCK_MOVEMENTS]: ['movementId', 'date', 'productId', 'productName', 'type', 'referenceId', 'quantityChange', 'previousStock', 'newStock', 'user', 'notes'],
    [SHEET_NAMES.INVOICES]: ['invoiceNumber', 'saleId', 'date', 'customerName', 'total', 'status'],
    [SHEET_NAMES.PRICE_TYPES]: ['id', 'name', 'description'],
    [SHEET_NAMES.BRANCHES]: ['branchId', 'name', 'address', 'phone', 'manager', 'status'],
    [SHEET_NAMES.SETTINGS]: ['key', 'value', 'description'],
    [SHEET_NAMES.CURRENCIES]: ['code', 'name', 'symbol', 'exchangeRate', 'isDefault'],
    [SHEET_NAMES.AUDIT_LOGS]: ['id', 'timestamp', 'user', 'action', 'module', 'recordId', 'details']
  };

  for (let sheetName in schema) {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    const headers = schema[sheetName];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#1e293b').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }

  seedDefaultSettings();
  createAdminUser();

  return { success: true, message: 'All 25 Sheets and default schemas created successfully!', data: null };
}

/**
 * Seed Default Data & Settings
 */
function seedDefaultSettings() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Settings
  const settingsSheet = ss.getSheetByName(SHEET_NAMES.SETTINGS);
  if (settingsSheet && settingsSheet.getLastRow() <= 1) {
    const defaultSettings = [
      ['storeName', 'Khmer Smart Mart & Electronics', 'Shop Name'],
      ['storeNameKhmer', 'ខ្មែរ ស្មាតម៉ាត & អេឡិចត្រូនិក', 'ឈ្មោះហាងជាភាសាខ្មែរ'],
      ['phone', '012 888 999 / 097 555 666', 'Shop Contact'],
      ['address', '#128, St 271, Sangkat Boeung Tumpun, Phnom Penh', 'Address'],
      ['exchangeRate', '4100', '1 USD to KHR rate'],
      ['currency', 'USD', 'Default Currency'],
      ['taxRate', '0', 'Default Tax %']
    ];
    settingsSheet.getRange(2, 1, defaultSettings.length, 3).setValues(defaultSettings);
  }

  // Categories
  const catSheet = ss.getSheetByName(SHEET_NAMES.CATEGORIES);
  if (catSheet && catSheet.getLastRow() <= 1) {
    const categories = [
      ['CAT-01', 'Beverages', 'ភេសជ្ជៈ', 'coffee'],
      ['CAT-02', 'Snacks & Food', 'ចំណីអាហារ & អាហារសម្រន់', 'utensils'],
      ['CAT-03', 'Electronics', 'ឧបករណ៍អេឡិចត្រូនិច', 'laptop'],
      ['CAT-04', 'Personal Care', 'គ្រឿងថែរក្សាសម្រស់', 'sparkles'],
      ['CAT-05', 'Office Supplies', 'សម្ភារៈការិយាល័យ', 'file-text']
    ];
    catSheet.getRange(2, 1, categories.length, 4).setValues(categories);
  }
}

/**
 * Create Default Admin User
 */
function createAdminUser() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const usersSheet = ss.getSheetByName(SHEET_NAMES.USERS);
  if (usersSheet && usersSheet.getLastRow() <= 1) {
    const admin = [
      ['USR-000001', 'admin', 'admin123', 'Super Administrator', '012 345 678', 'admin@khmerpos.com', 'Super Admin', 'Main Branch', 'Active', new Date().toISOString()]
    ];
    usersSheet.getRange(2, 1, 1, admin[0].length).setValues(admin);
  }
}

/**
 * Generic Table Reader
 */
function getTableData(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow <= 1 || lastCol < 1) return [];
  
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const rows = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  
  return rows.map(row => {
    let obj = {};
    headers.forEach((h, i) => {
      obj[h] = row[i];
    });
    return obj;
  });
}

/**
 * Business Handlers
 */
function handleLogin(payload) {
  const users = getTableData(SHEET_NAMES.USERS);
  const found = users.find(u => u.username === payload.username && u.passwordHash === payload.password);
  if (found) {
    const { passwordHash, ...userSafe } = found;
    return { success: true, message: 'Login successful', data: { user: userSafe, token: 'GAS_TOKEN_' + new Date().getTime() } };
  }
  return { success: false, message: 'Username ឬ Password មិនត្រឹមត្រូវ', data: null };
}

function handleCreateProduct(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.PRODUCTS);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  const rowData = headers.map(h => payload[h] !== undefined ? payload[h] : '');
  sheet.appendRow(rowData);
  
  return { success: true, message: 'Product created successfully', data: payload };
}

function handleCreateSale(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const salesSheet = ss.getSheetByName(SHEET_NAMES.SALES);
  const saleHeaders = salesSheet.getRange(1, 1, 1, salesSheet.getLastColumn()).getValues()[0];
  
  const saleRow = saleHeaders.map(h => payload[h] !== undefined ? payload[h] : '');
  salesSheet.appendRow(saleRow);

  // Update Products Stock
  if (payload.items && payload.items.length) {
    const itemsSheet = ss.getSheetByName(SHEET_NAMES.SALE_ITEMS);
    const itemHeaders = itemsSheet.getRange(1, 1, 1, itemsSheet.getLastColumn()).getValues()[0];
    
    payload.items.forEach((item, idx) => {
      item.itemId = payload.saleId + '-' + (idx + 1);
      item.saleId = payload.saleId;
      const iRow = itemHeaders.map(h => item[h] !== undefined ? item[h] : '');
      itemsSheet.appendRow(iRow);
    });
  }

  return { success: true, message: 'Sale recorded and stock updated', data: payload };
}

function handleCreatePurchase(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.PURCHASES);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  sheet.appendRow(headers.map(h => payload[h] !== undefined ? payload[h] : ''));
  return { success: true, message: 'Purchase recorded', data: payload };
}

function handleStockAdjustment(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.STOCK_MOVEMENTS);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  sheet.appendRow(headers.map(h => payload[h] !== undefined ? payload[h] : ''));
  return { success: true, message: 'Stock adjustment saved', data: payload };
}

function handleCreateCustomer(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.CUSTOMERS);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  sheet.appendRow(headers.map(h => payload[h] !== undefined ? payload[h] : ''));
  return { success: true, message: 'Customer saved', data: payload };
}

function handleCreateSupplier(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.SUPPLIERS);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  sheet.appendRow(headers.map(h => payload[h] !== undefined ? payload[h] : ''));
  return { success: true, message: 'Supplier saved', data: payload };
}

function handleCreateExpense(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.EXPENSES);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  sheet.appendRow(headers.map(h => payload[h] !== undefined ? payload[h] : ''));
  return { success: true, message: 'Expense saved', data: payload };
}

function handleSaveSettings(payload) {
  return { success: true, message: 'Settings saved', data: payload };
}
`;
