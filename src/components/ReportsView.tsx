import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Package,
  Calendar,
  Download,
  PieChart as PieIcon,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Users
} from 'lucide-react';
import * as XLSX from 'xlsx';

export const ReportsView: React.FC = () => {
  const {
    sales,
    purchases,
    expenses,
    products,
    customers,
    suppliers,
    formatUSD,
    formatKHR,
    exchangeRate,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pnl' | 'products' | 'inventory' | 'debts'>('pnl');

  // Profit & Loss Calculations
  const completedSales = sales.filter(s => s.status === 'Completed');
  const totalRevenueUSD = completedSales.reduce((sum, s) => sum + s.total, 0);
  const totalCOGS_USD = completedSales.reduce((sum, s) => {
    const cost = s.items.reduce((iSum, item) => iSum + (item.costPrice * item.quantity), 0);
    return sum + cost;
  }, 0);
  const grossProfitUSD = totalRevenueUSD - totalCOGS_USD;
  const totalExpensesUSD = expenses.reduce((sum, e) => sum + e.amountUSD, 0);
  const netProfitUSD = grossProfitUSD - totalExpensesUSD;

  // Inventory Valuation Calculations
  const totalInventoryUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const totalInventoryCostUSD = products.reduce((sum, p) => sum + (p.costPrice * p.stock), 0);
  const totalInventoryRetailUSD = products.reduce((sum, p) => sum + (p.salePrice * p.stock), 0);
  const potentialInventoryProfit = totalInventoryRetailUSD - totalInventoryCostUSD;

  // Product sales analysis
  const productSalesMap: { [prodId: string]: { name: string; qty: number; revenue: number; profit: number } } = {};
  completedSales.forEach(s => {
    s.items.forEach(item => {
      if (!productSalesMap[item.productId]) {
        productSalesMap[item.productId] = {
          name: item.productName,
          qty: 0,
          revenue: 0,
          profit: 0
        };
      }
      productSalesMap[item.productId].qty += item.quantity;
      productSalesMap[item.productId].revenue += item.total;
      productSalesMap[item.productId].profit += (item.total - (item.costPrice * item.quantity));
    });
  });

  const sortedProductSales = Object.values(productSalesMap).sort((a, b) => b.revenue - a.revenue);

  // Debts
  const totalCustomerDebt = customers.reduce((sum, c) => sum + (c.balanceDebt || 0), 0);
  const totalSupplierPayable = suppliers.reduce((sum, s) => sum + (s.balanceDebt || 0), 0);

  // Export active report to Excel
  const handleExportReport = () => {
    let exportData: any[] = [];
    let fileName = 'Report';

    if (activeTab === 'pnl') {
      fileName = 'Profit_and_Loss';
      exportData = [
        { 'Metric': 'Total Revenue ($)', 'Value': totalRevenueUSD, 'Value KHR': totalRevenueUSD * exchangeRate },
        { 'Metric': 'Cost of Goods Sold - COGS ($)', 'Value': totalCOGS_USD, 'Value KHR': totalCOGS_USD * exchangeRate },
        { 'Metric': 'Gross Profit ($)', 'Value': grossProfitUSD, 'Value KHR': grossProfitUSD * exchangeRate },
        { 'Metric': 'Total Operational Expenses ($)', 'Value': totalExpensesUSD, 'Value KHR': totalExpensesUSD * exchangeRate },
        { 'Metric': 'Net Profit ($)', 'Value': netProfitUSD, 'Value KHR': netProfitUSD * exchangeRate }
      ];
    } else if (activeTab === 'products') {
      fileName = 'Product_Sales_Performance';
      exportData = sortedProductSales.map(p => ({
        'Product Name': p.name,
        'Units Sold': p.qty,
        'Total Revenue ($)': p.revenue,
        'Total Profit ($)': p.profit
      }));
    } else if (activeTab === 'inventory') {
      fileName = 'Inventory_Valuation';
      exportData = products.map(p => ({
        'Product Name': p.name,
        'Stock Qty': p.stock,
        'Cost Price ($)': p.costPrice,
        'Total Cost Value ($)': p.costPrice * p.stock,
        'Sale Price ($)': p.salePrice,
        'Total Retail Value ($)': p.salePrice * p.stock,
        'Potential Profit ($)': (p.salePrice - p.costPrice) * p.stock
      }));
    } else if (activeTab === 'debts') {
      fileName = 'Receivables_and_Payables';
      exportData = [
        ...customers.filter(c => (c.balanceDebt || 0) > 0).map(c => ({
          'Type': 'Customer Receivable (ជំពាក់យើង)',
          'Name': c.name,
          'Phone': c.phone,
          'Balance ($)': c.balanceDebt
        })),
        ...suppliers.filter(s => (s.balanceDebt || 0) > 0).map(s => ({
          'Type': 'Supplier Payable (យើងជំពាក់)',
          'Name': s.name,
          'Phone': s.phone,
          'Balance ($)': s.balanceDebt
        }))
      ];
    }

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, `KhmerPOS_${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
    addToast('បានទាញយករបាយការណ៍ Excel រួចរាល់!', 'success');
  };

  return (
    <div id="reports-view" className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            របាយការណ៍ និងការវិភាគហិរញ្ញវត្ថុ (Reports & Analytics)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            របាយការណ៍ចំណេញខាត លក់ដាច់ តម្លៃស្តុកសរុប និងបំណុល
          </p>
        </div>

        <button
          onClick={handleExportReport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition transform active:scale-95 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>ទាញយក Excel (Export Report)</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('pnl')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'pnl'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>ចំណេញ-ខាត (P&L)</span>
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'products'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>ទំនិញលក់ដាច់ (Product Sales)</span>
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'inventory'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>តម្លៃស្តុកសរុប (Stock Valuation)</span>
        </button>
        <button
          onClick={() => setActiveTab('debts')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'debts'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>បំណុល & ជំពាក់ (Debts)</span>
        </button>
      </div>

      {/* TAB CONTENT: Profit & Loss */}
      {activeTab === 'pnl' && (
        <div className="space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 block font-semibold uppercase">ចំណូលលក់សរុប (Revenue)</span>
              <div className="text-2xl font-black text-slate-900 font-mono mt-1">{formatUSD(totalRevenueUSD)}</div>
              <span className="text-[11px] text-blue-600 font-mono font-medium">{formatKHR(totalRevenueUSD * exchangeRate)}</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 block font-semibold uppercase">ថ្លៃដើមទំនិញលក់ (COGS)</span>
              <div className="text-2xl font-black text-amber-600 font-mono mt-1">{formatUSD(totalCOGS_USD)}</div>
              <span className="text-[11px] text-slate-400 font-mono font-medium">{formatKHR(totalCOGS_USD * exchangeRate)}</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 block font-semibold uppercase">ចំណាយប្រតិបត្តិការ (Expenses)</span>
              <div className="text-2xl font-black text-rose-600 font-mono mt-1">{formatUSD(totalExpensesUSD)}</div>
              <span className="text-[11px] text-rose-600 font-mono font-medium">{formatKHR(totalExpensesUSD * exchangeRate)}</span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 shadow-xs">
              <span className="text-xs text-emerald-700 block font-bold uppercase">ចំណេញសុទ្ធ (Net Profit)</span>
              <div className="text-2xl font-black text-emerald-700 font-mono mt-1">{formatUSD(netProfitUSD)}</div>
              <span className="text-[11px] text-emerald-600 font-mono font-medium">{formatKHR(netProfitUSD * exchangeRate)}</span>
            </div>
          </div>

          {/* Statement Breakdown Table */}
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              តារាងសង្ខេបចំណេញ-ខាត (Profit & Loss Statement)
            </h2>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-3 flex justify-between items-center text-slate-700">
                <span className="font-medium">(+) ចំណូលពីការលក់ទំនិញសរុប (Gross Sales Revenue)</span>
                <span className="font-mono font-bold text-slate-900">{formatUSD(totalRevenueUSD)}</span>
              </div>
              <div className="py-3 flex justify-between items-center text-slate-600">
                <span className="font-medium">(-) ថ្លៃដើមផលិតផល (Cost of Goods Sold)</span>
                <span className="font-mono font-bold text-amber-600">-{formatUSD(totalCOGS_USD)}</span>
              </div>
              <div className="py-3 flex justify-between items-center bg-slate-50 px-3 rounded-lg font-bold text-slate-800">
                <span>(=) ប្រាក់ចំណេញដុល (Gross Profit)</span>
                <span className="font-mono text-emerald-600 text-sm">{formatUSD(grossProfitUSD)}</span>
              </div>
              <div className="py-3 flex justify-between items-center text-slate-600">
                <span className="font-medium">(-) ចំណាយទូទៅ និងរដ្ឋបាល (Operational Expenses)</span>
                <span className="font-mono font-bold text-rose-600">-{formatUSD(totalExpensesUSD)}</span>
              </div>
              <div className="py-4 flex justify-between items-center bg-emerald-50 px-4 rounded-xl font-bold text-emerald-800 text-base border border-emerald-200">
                <span>(=) ប្រាក់ចំណេញសុទ្ធ (NET PROFIT)</span>
                <span className="font-mono font-black text-lg text-emerald-700">{formatUSD(netProfitUSD)} ({formatKHR(netProfitUSD * exchangeRate)})</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Product Sales */}
      {activeTab === 'products' && (
        <div className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">ឈ្មោះផលិតផល (Product Name)</th>
                  <th className="py-3 px-3 text-center">ចំនួនលក់បាន (Qty Sold)</th>
                  <th className="py-3 px-3 text-right">ចំណូលសរុប ($ Revenue)</th>
                  <th className="py-3 px-3 text-right">ចំណេញសរុប ($ Profit)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {sortedProductSales.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3 font-bold text-slate-800">{p.name}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-blue-600">{p.qty}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">{formatUSD(p.revenue)}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">{formatUSD(p.profit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Inventory Valuation */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 block font-semibold uppercase">បរិមាណស្តុកសរុប</span>
              <div className="text-2xl font-black text-slate-900 font-mono mt-1">{totalInventoryUnits} ឯកតា</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 block font-semibold uppercase">តម្លៃដើមនៃស្តុក (Cost Value)</span>
              <div className="text-2xl font-black text-amber-600 font-mono mt-1">{formatUSD(totalInventoryCostUSD)}</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 block font-semibold uppercase">តម្លៃលក់រាយនៃស្តុក (Retail Value)</span>
              <div className="text-2xl font-black text-emerald-600 font-mono mt-1">{formatUSD(totalInventoryRetailUSD)}</div>
            </div>
          </div>

          <div className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-3">ឈ្មោះទំនិញ</th>
                    <th className="py-3 px-3 text-center">ស្តុក</th>
                    <th className="py-3 px-3 text-right">តម្លៃដើម ($)</th>
                    <th className="py-3 px-3 text-right">តម្លៃដើមសរុប ($)</th>
                    <th className="py-3 px-3 text-right">តម្លៃលក់ ($)</th>
                    <th className="py-3 px-3 text-right">តម្លៃលក់សរុប ($)</th>
                    <th className="py-3 px-3 text-right">ចំណេញរំពឹងទុក ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {products.map(p => (
                    <tr key={p.productId} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 font-bold text-slate-800">{p.name}</td>
                      <td className="py-3 px-3 text-center font-mono text-slate-600">{p.stock} {p.unit}</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-500">{formatUSD(p.costPrice)}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-amber-600">{formatUSD(p.costPrice * p.stock)}</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-600">{formatUSD(p.salePrice)}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">{formatUSD(p.salePrice * p.stock)}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-blue-600">
                        {formatUSD((p.salePrice - p.costPrice) * p.stock)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Debts */}
      {activeTab === 'debts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Receivables */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                អតិថិជនជំពាក់ (Customer Receivables)
              </h3>
              <span className="text-xs font-mono font-bold text-rose-600">
                សរុប: {formatUSD(totalCustomerDebt)}
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {customers.filter(c => (c.balanceDebt || 0) > 0).map(c => (
                <div key={c.customerId} className="py-2.5 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800">{c.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{c.phone}</p>
                  </div>
                  <span className="font-mono font-bold text-rose-600">{formatUSD(c.balanceDebt || 0)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Supplier Payables */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                យើងជំពាក់អ្នកផ្គត់ផ្គង់ (Supplier Payables)
              </h3>
              <span className="text-xs font-mono font-bold text-amber-600">
                សរុប: {formatUSD(totalSupplierPayable)}
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {suppliers.filter(s => (s.balanceDebt || 0) > 0).map(s => (
                <div key={s.supplierId} className="py-2.5 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800">{s.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{s.phone}</p>
                  </div>
                  <span className="font-mono font-bold text-amber-600">{formatUSD(s.balanceDebt || 0)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
