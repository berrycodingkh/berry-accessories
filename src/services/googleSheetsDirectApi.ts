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
  StockAdjustment,
  StockMovement,
  AppSettings
} from '../types';

export interface GoogleSpreadsheetInfo {
  spreadsheetId: string;
  title: string;
  spreadsheetUrl: string;
  sheets: string[];
}

const REQUIRED_SHEETS = [
  'Products',
  'Sales',
  'SaleItems',
  'Purchases',
  'Customers',
  'Suppliers',
  'Expenses',
  'StockAdjustments',
  'StockMovements',
  'Settings'
];

export class GoogleSheetsDirectApi {
  private static async fetchWithAuth(url: string, accessToken: string, options: RequestInit = {}) {
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      let errBody = '';
      try {
        const errJson = await response.json();
        errBody = errJson?.error?.message || JSON.stringify(errJson);
      } catch {
        errBody = await response.text();
      }
      throw new Error(`Google Sheets API Error (${response.status}): ${errBody}`);
    }

    return response.json();
  }

  // Find or Create the default spreadsheet
  static async getOrCreateDatabaseSpreadsheet(
    accessToken: string,
    customSpreadsheetId?: string
  ): Promise<GoogleSpreadsheetInfo> {
    // 1. If explicit ID provided, verify and initialize it
    if (customSpreadsheetId && customSpreadsheetId.trim()) {
      const info = await this.getSpreadsheetInfo(accessToken, customSpreadsheetId.trim());
      await this.ensureRequiredSheets(accessToken, info.spreadsheetId, info.sheets);
      return info;
    }

    // 2. Search in Drive for existing spreadsheet
    try {
      const q = encodeURIComponent("name = 'Khmer POS & ERP Database' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false");
      const searchRes = await this.fetchWithAuth(
        `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,webViewLink)`,
        accessToken
      );

      if (searchRes.files && searchRes.files.length > 0) {
        const existingFile = searchRes.files[0];
        const info = await this.getSpreadsheetInfo(accessToken, existingFile.id);
        await this.ensureRequiredSheets(accessToken, info.spreadsheetId, info.sheets);
        return info;
      }
    } catch (e) {
      console.warn('Drive search error, falling back to creating new sheet:', e);
    }

    // 3. Create a new Spreadsheet
    const createBody = {
      properties: {
        title: 'Khmer POS & ERP Database'
      },
      sheets: REQUIRED_SHEETS.map(title => ({
        properties: {
          title,
          gridProperties: {
            frozenRowCount: 1
          }
        }
      }))
    };

    const newSheet = await this.fetchWithAuth(
      'https://sheets.googleapis.com/v4/spreadsheets',
      accessToken,
      {
        method: 'POST',
        body: JSON.stringify(createBody)
      }
    );

    const spreadsheetId = newSheet.spreadsheetId;
    const spreadsheetUrl = newSheet.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

    // Initialize Headers
    await this.initializeSheetHeaders(accessToken, spreadsheetId);

    return {
      spreadsheetId,
      title: newSheet.properties?.title || 'Khmer POS & ERP Database',
      spreadsheetUrl,
      sheets: REQUIRED_SHEETS
    };
  }

  // Get Spreadsheet Details
  static async getSpreadsheetInfo(accessToken: string, spreadsheetId: string): Promise<GoogleSpreadsheetInfo> {
    const data = await this.fetchWithAuth(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
      accessToken
    );

    const sheetTitles = (data.sheets || []).map((s: any) => s.properties?.title || '');

    return {
      spreadsheetId: data.spreadsheetId,
      title: data.properties?.title || 'Google Sheet',
      spreadsheetUrl: data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${data.spreadsheetId}/edit`,
      sheets: sheetTitles
    };
  }

  // Ensure all required sheets exist
  static async ensureRequiredSheets(accessToken: string, spreadsheetId: string, currentSheets: string[]): Promise<void> {
    const missingSheets = REQUIRED_SHEETS.filter(req => !currentSheets.includes(req));
    if (missingSheets.length === 0) return;

    const requests = missingSheets.map(title => ({
      addSheet: {
        properties: {
          title,
          gridProperties: {
            frozenRowCount: 1
          }
        }
      }
    }));

    await this.fetchWithAuth(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
      accessToken,
      {
        method: 'POST',
        body: JSON.stringify({ requests })
      }
    );

    await this.initializeSheetHeaders(accessToken, spreadsheetId, missingSheets);
  }

  // Initialize sheet header rows
  static async initializeSheetHeaders(accessToken: string, spreadsheetId: string, specificSheets?: string[]) {
    const sheetsToSetup = specificSheets || REQUIRED_SHEETS;

    const headersMap: Record<string, string[]> = {
      Products: [
        'Product ID', 'Barcode', 'Product Name', 'Khmer Name', 'Category',
        'Brand', 'Unit', 'Cost Price ($)', 'Sale Price ($)', 'Wholesale Price ($)',
        'VIP Price ($)', 'Current Stock', 'Min Stock', 'Supplier', 'Status', 'Created Date'
      ],
      Sales: [
        'Sale ID', 'Invoice Number', 'Date', 'Customer Name', 'Customer Group',
        'Cashier', 'Subtotal ($)', 'Discount ($)', 'Tax ($)', 'Total ($)',
        'Total (KHR)', 'Paid ($)', 'Paid (KHR)', 'Profit ($)', 'Payment Method',
        'Status', 'Notes'
      ],
      SaleItems: [
        'Sale ID', 'Product ID', 'Product Name', 'Barcode', 'Unit',
        'Quantity', 'Unit Price ($)', 'Cost Price ($)', 'Discount ($)', 'Total ($)', 'Profit ($)'
      ],
      Purchases: [
        'Purchase ID', 'Invoice Number', 'Date', 'Supplier Name', 'Subtotal ($)',
        'Discount ($)', 'Tax ($)', 'Total ($)', 'Paid ($)', 'Due ($)',
        'Payment Method', 'Status', 'Created User', 'Note'
      ],
      Customers: [
        'Customer ID', 'Customer Name', 'Phone', 'Email', 'Address',
        'Customer Group', 'Discount Rate (%)', 'Credit Limit ($)', 'Balance Debt ($)',
        'Total Purchased ($)', 'Status', 'Created Date'
      ],
      Suppliers: [
        'Supplier ID', 'Supplier Name', 'Contact Person', 'Phone', 'Email',
        'Address', 'Balance Debt ($)', 'Status', 'Created Date'
      ],
      Expenses: [
        'Expense ID', 'Date', 'Category', 'Description', 'Amount ($)',
        'Amount (KHR)', 'Payment Method', 'User', 'Note'
      ],
      StockAdjustments: [
        'Adjustment ID', 'Date', 'Product ID', 'Product Name', 'Current Stock',
        'Adjustment Qty', 'New Stock', 'Adjustment Type', 'Reason', 'User'
      ],
      StockMovements: [
        'Movement ID', 'Date', 'Product ID', 'Product Name', 'Type',
        'Reference ID', 'Quantity Change', 'Previous Stock', 'New Stock', 'User', 'Notes'
      ],
      Settings: [
        'Key', 'Value', 'Updated Date'
      ]
    };

    const data: any[] = [];
    for (const sheet of sheetsToSetup) {
      if (headersMap[sheet]) {
        data.push({
          range: `${sheet}!A1:${this.getColumnLetter(headersMap[sheet].length)}1`,
          values: [headersMap[sheet]]
        });
      }
    }

    if (data.length > 0) {
      await this.fetchWithAuth(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
        accessToken,
        {
          method: 'POST',
          body: JSON.stringify({
            valueInputOption: 'USER_ENTERED',
            data
          })
        }
      );
    }
  }

  // Full Sync All Collections to Google Sheets
  static async syncAllCollectionsToSheets(
    accessToken: string,
    spreadsheetId: string,
    appState: {
      products: Product[];
      sales: Sale[];
      purchases: Purchase[];
      customers: Customer[];
      suppliers: Supplier[];
      expenses: Expense[];
      stockAdjustments: StockAdjustment[];
      stockMovements: StockMovement[];
      settings: AppSettings;
    }
  ): Promise<{ success: boolean; message: string }> {
    try {
      // 1. Sync Products
      const productValues = [
        [
          'Product ID', 'Barcode', 'Product Name', 'Khmer Name', 'Category',
          'Brand', 'Unit', 'Cost Price ($)', 'Sale Price ($)', 'Wholesale Price ($)',
          'VIP Price ($)', 'Current Stock', 'Min Stock', 'Supplier', 'Status', 'Created Date'
        ],
        ...appState.products.map(p => [
          p.productId, p.barcode, p.name, p.khmerName || '', p.category,
          p.brand, p.unit, p.costPrice, p.salePrice, p.wholesalePrice,
          p.vipPrice || 0, p.stock, p.minStock, p.supplier, p.status, p.createdDate
        ])
      ];

      // 2. Sync Sales & SaleItems
      const saleValues = [
        [
          'Sale ID', 'Invoice Number', 'Date', 'Customer Name', 'Customer Group',
          'Cashier', 'Subtotal ($)', 'Discount ($)', 'Tax ($)', 'Total ($)',
          'Total (KHR)', 'Paid ($)', 'Paid (KHR)', 'Profit ($)', 'Payment Method',
          'Status', 'Notes'
        ],
        ...appState.sales.map(s => [
          s.saleId, s.invoiceNumber, s.date, s.customerName, s.customerGroup,
          s.cashierName, s.subtotal, s.discount, s.tax, s.total,
          s.totalKHR, s.paidUSD, s.paidKHR, s.profit, s.paymentMethod,
          s.status, s.notes || ''
        ])
      ];

      const saleItemValues: any[][] = [
        [
          'Sale ID', 'Product ID', 'Product Name', 'Barcode', 'Unit',
          'Quantity', 'Unit Price ($)', 'Cost Price ($)', 'Discount ($)', 'Total ($)', 'Profit ($)'
        ]
      ];
      appState.sales.forEach(s => {
        s.items.forEach(item => {
          saleItemValues.push([
            s.saleId, item.productId, item.productName, item.barcode, item.unit,
            item.quantity, item.unitPrice, item.costPrice, item.discount, item.total, item.profit
          ]);
        });
      });

      // 3. Sync Purchases
      const purchaseValues = [
        [
          'Purchase ID', 'Invoice Number', 'Date', 'Supplier Name', 'Subtotal ($)',
          'Discount ($)', 'Tax ($)', 'Total ($)', 'Paid ($)', 'Due ($)',
          'Payment Method', 'Status', 'Created User', 'Note'
        ],
        ...appState.purchases.map(pur => [
          pur.purchaseId, pur.invoiceNumber, pur.date, pur.supplierName, pur.subtotal,
          pur.discount, pur.tax, pur.total, pur.paidAmount, pur.dueAmount,
          pur.paymentMethod, pur.status, pur.createdUser, pur.note || ''
        ])
      ];

      // 4. Sync Customers
      const customerValues = [
        [
          'Customer ID', 'Customer Name', 'Phone', 'Email', 'Address',
          'Customer Group', 'Discount Rate (%)', 'Credit Limit ($)', 'Balance Debt ($)',
          'Total Purchased ($)', 'Status', 'Created Date'
        ],
        ...appState.customers.map(c => [
          c.customerId, c.name, c.phone, c.email || '', c.address || '',
          c.customerGroup, c.discountRate, c.creditLimit, c.balance,
          c.totalPurchased, c.status, c.createdDate
        ])
      ];

      // 5. Sync Suppliers
      const supplierValues = [
        [
          'Supplier ID', 'Supplier Name', 'Contact Person', 'Phone', 'Email',
          'Address', 'Balance Debt ($)', 'Status', 'Created Date'
        ],
        ...appState.suppliers.map(sup => [
          sup.supplierId, sup.name, sup.contactPerson, sup.phone, sup.email || '',
          sup.address || '', sup.balance, sup.status, sup.createdDate
        ])
      ];

      // 6. Sync Expenses
      const expenseValues = [
        [
          'Expense ID', 'Date', 'Category', 'Description', 'Amount ($)',
          'Amount (KHR)', 'Payment Method', 'User', 'Note'
        ],
        ...appState.expenses.map(e => [
          e.expenseId, e.date, e.category, e.description, e.amountUSD,
          e.amountKHR, e.paymentMethod, e.user, e.note || ''
        ])
      ];

      // 7. Sync Stock Adjustments
      const adjustmentValues = [
        [
          'Adjustment ID', 'Date', 'Product ID', 'Product Name', 'Current Stock',
          'Adjustment Qty', 'New Stock', 'Adjustment Type', 'Reason', 'User'
        ],
        ...appState.stockAdjustments.map(a => [
          a.adjustmentId, a.date, a.productId, a.productName, a.currentStock,
          a.adjustmentQty, a.newStock, a.adjustmentType, a.reason, a.user
        ])
      ];

      // 8. Sync Stock Movements
      const movementValues = [
        [
          'Movement ID', 'Date', 'Product ID', 'Product Name', 'Type',
          'Reference ID', 'Quantity Change', 'Previous Stock', 'New Stock', 'User', 'Notes'
        ],
        ...appState.stockMovements.map(m => [
          m.movementId, m.date, m.productId, m.productName, m.type,
          m.referenceId, m.quantityChange, m.previousStock, m.newStock, m.user, m.notes || ''
        ])
      ];

      // 9. Sync Settings
      const settingValues = [
        ['Key', 'Value', 'Updated Date'],
        ['storeName', appState.settings.storeName, new Date().toISOString()],
        ['storeNameKhmer', appState.settings.storeNameKhmer, new Date().toISOString()],
        ['phone', appState.settings.phone, new Date().toISOString()],
        ['address', appState.settings.address, new Date().toISOString()],
        ['exchangeRate', String(appState.settings.exchangeRate), new Date().toISOString()],
        ['receiptFooter', appState.settings.receiptFooter, new Date().toISOString()]
      ];

      // Clear existing ranges and rewrite
      const updateData = [
        { range: 'Products!A1:Z500', values: productValues },
        { range: 'Sales!A1:Z500', values: saleValues },
        { range: 'SaleItems!A1:Z1000', values: saleItemValues },
        { range: 'Purchases!A1:Z500', values: purchaseValues },
        { range: 'Customers!A1:Z500', values: customerValues },
        { range: 'Suppliers!A1:Z500', values: supplierValues },
        { range: 'Expenses!A1:Z500', values: expenseValues },
        { range: 'StockAdjustments!A1:Z500', values: adjustmentValues },
        { range: 'StockMovements!A1:Z500', values: movementValues },
        { range: 'Settings!A1:Z50', values: settingValues }
      ];

      await this.fetchWithAuth(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
        accessToken,
        {
          method: 'POST',
          body: JSON.stringify({
            valueInputOption: 'USER_ENTERED',
            data: updateData
          })
        }
      );

      return {
        success: true,
        message: 'បានបញ្ជូន និងរក្សាទុកទិន្នន័យទាំងអស់ទៅកាន់ Google Sheets រួចរាល់ដោយជោគជ័យ!'
      };
    } catch (err: any) {
      console.error('Error syncing to Google Sheets:', err);
      throw err;
    }
  }

  // Append a Single Sale in Realtime
  static async appendSaleToSheets(accessToken: string, spreadsheetId: string, sale: Sale): Promise<void> {
    try {
      const saleRow = [
        sale.saleId, sale.invoiceNumber, sale.date, sale.customerName, sale.customerGroup,
        sale.cashierName, sale.subtotal, sale.discount, sale.tax, sale.total,
        sale.totalKHR, sale.paidUSD, sale.paidKHR, sale.profit, sale.paymentMethod,
        sale.status, sale.notes || ''
      ];

      const itemRows = sale.items.map(item => [
        sale.saleId, item.productId, item.productName, item.barcode, item.unit,
        item.quantity, item.unitPrice, item.costPrice, item.discount, item.total, item.profit
      ]);

      await Promise.all([
        this.fetchWithAuth(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sales!A1:append?valueInputOption=USER_ENTERED`,
          accessToken,
          {
            method: 'POST',
            body: JSON.stringify({ values: [saleRow] })
          }
        ),
        this.fetchWithAuth(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/SaleItems!A1:append?valueInputOption=USER_ENTERED`,
          accessToken,
          {
            method: 'POST',
            body: JSON.stringify({ values: itemRows })
          }
        )
      ]);
    } catch (e) {
      console.warn('Realtime sale append to Google Sheet warning:', e);
    }
  }

  private static getColumnLetter(colIndex: number): string {
    let temp = 0;
    let letter = '';
    while (colIndex > 0) {
      temp = (colIndex - 1) % 26;
      letter = String.fromCharCode(65 + temp) + letter;
      colIndex = Math.floor((colIndex - temp - 1) / 26);
    }
    return letter || 'A';
  }
}
