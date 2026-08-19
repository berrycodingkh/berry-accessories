import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sale } from '../types';
import { Printer, FileText, ArrowLeft, Check, QrCode, Sliders } from 'lucide-react';

export const InvoicesView: React.FC = () => {
  const {
    sales,
    selectedInvoiceForPrint,
    setSelectedInvoiceForPrint,
    setCurrentView,
    formatUSD,
    formatKHR,
    exchangeRate,
    settings
  } = useApp();

  const [receiptType, setReceiptType] = useState<'80mm' | '58mm' | 'A4'>('80mm');
  const [selectedSaleId, setSelectedSaleId] = useState<string>(
    selectedInvoiceForPrint?.saleId || sales[0]?.saleId || ''
  );

  const activeSale: Sale =
    sales.find(s => s.saleId === selectedSaleId) ||
    selectedInvoiceForPrint ||
    sales[0];

  const handlePrint = () => {
    window.print();
  };

  if (!activeSale) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400">
        មិនមានវិក្កយបត្រសម្រាប់បោះពុម្ពទេ
      </div>
    );
  }

  return (
    <div id="invoices-view" className="space-y-6">
      {/* Top Bar (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('pos')}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            title="Back to POS"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              បោះពុម្ពវិក្កយបត្រ (Invoice & Receipt Printing)
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              វិក្កយបត្រ #{activeSale.invoiceNumber} • {activeSale.customerName}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Format selector */}
          <div className="flex bg-slate-100 border border-slate-200 rounded-lg p-1">
            <button
              onClick={() => setReceiptType('80mm')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                receiptType === '80mm' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              80mm Thermal
            </button>
            <button
              onClick={() => setReceiptType('58mm')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                receiptType === '58mm' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              58mm Mini
            </button>
            <button
              onClick={() => setReceiptType('A4')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                receiptType === 'A4' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              A4 Invoice
            </button>
          </div>

          <button
            id="btn-print-receipt"
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition transform active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>បោះពុម្ពឥឡូវនេះ (Print Now)</span>
          </button>
        </div>
      </div>

      {/* Invoice Selector (No Print) */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between no-print">
        <label className="text-xs font-bold text-slate-700">
          ជ្រើសរើសវិក្កយបត្រផ្សេងទៀត:
        </label>
        <select
          value={selectedSaleId}
          onChange={e => setSelectedSaleId(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
        >
          {sales.map(s => (
            <option key={s.saleId} value={s.saleId}>
              {s.invoiceNumber} - {s.customerName} ({formatUSD(s.total)}) - {s.date}
            </option>
          ))}
        </select>
      </div>

      {/* INVOICE PREVIEW CONTAINER */}
      <div className="flex justify-center p-6 bg-slate-100 rounded-xl border border-slate-200">
        {/* 80mm / 58mm Thermal Receipt Layout */}
        {receiptType !== 'A4' ? (
          <div
            id="receipt-thermal"
            className={`bg-white text-black p-5 rounded-lg shadow-sm font-mono text-xs border border-slate-300 leading-tight ${
              receiptType === '80mm' ? 'w-80' : 'w-64 text-[11px]'
            }`}
          >
            {/* Header */}
            <div className="text-center space-y-1 pb-3 border-b border-dashed border-gray-400">
              <h2 className="font-bold text-sm text-black uppercase tracking-wider">
                {settings.shopName}
              </h2>
              <p className="text-[11px] font-semibold text-gray-700">{settings.shopNameKhmer}</p>
              <p className="text-[10px] text-gray-600">{settings.address}</p>
              <p className="text-[10px] text-gray-600">Tel: {settings.phone}</p>
            </div>

            {/* Receipt Info */}
            <div className="py-2.5 border-b border-dashed border-gray-400 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>Inv No:</span>
                <span className="font-bold">{activeSale.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{activeSale.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Cashier:</span>
                <span>{activeSale.cashierName}</span>
              </div>
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="font-semibold">{activeSale.customerName}</span>
              </div>
            </div>

            {/* Items Table */}
            <div className="py-2.5 border-b border-dashed border-gray-400">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-gray-300 font-bold">
                    <th className="py-1">ទំនិញ</th>
                    <th className="py-1 text-center">ចំនួន</th>
                    <th className="py-1 text-right">តម្លៃ</th>
                    <th className="py-1 text-right">សរុប</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {activeSale.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-1 max-w-[120px] truncate">{item.productName}</td>
                      <td className="py-1 text-center">{item.quantity}</td>
                      <td className="py-1 text-right">${item.unitPrice.toFixed(2)}</td>
                      <td className="py-1 text-right font-bold">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="py-2.5 border-b border-dashed border-gray-400 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${activeSale.subtotal.toFixed(2)}</span>
              </div>
              {activeSale.discount > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>Discount:</span>
                  <span>-${activeSale.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-xs pt-1 border-t border-gray-300">
                <span>សរុប (Total USD):</span>
                <span>${activeSale.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-[11px]">
                <span>សរុប (Total KHR):</span>
                <span>{activeSale.totalKHR.toLocaleString()} ៛</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Paid ({activeSale.paymentMethod}):</span>
                <span>${(activeSale.paidUSD || activeSale.total).toFixed(2)}</span>
              </div>
              {activeSale.changeUSD > 0 && (
                <div className="flex justify-between font-bold text-gray-800">
                  <span>Change ($ / ៛):</span>
                  <span>${activeSale.changeUSD.toFixed(2)} ({activeSale.changeKHR.toLocaleString()} ៛)</span>
                </div>
              )}
            </div>

            {/* KHQR & Footer */}
            <div className="text-center pt-3 space-y-2">
              <div className="flex flex-col items-center justify-center">
                <div className="p-1 border border-gray-300 rounded-lg">
                  <QrCode className="w-16 h-16 text-black" />
                </div>
                <span className="text-[9px] text-gray-500 mt-0.5">Scan to Pay with KHQR</span>
              </div>
              <p className="text-[10px] font-semibold text-gray-800">
                {settings.receiptFooter}
              </p>
              <p className="text-[9px] text-gray-500">
                Powered by Khmer POS & ERP • Google Sheets Backend
              </p>
            </div>
          </div>
        ) : (
          /* A4 Standard Invoice Layout */
          <div
            id="receipt-a4"
            className="bg-white text-black p-8 rounded-lg shadow-sm w-full max-w-3xl border border-slate-300 text-xs font-sans space-y-6"
          >
            {/* A4 Header */}
            <div className="flex justify-between items-start border-b border-gray-300 pb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-blue-900 uppercase tracking-tight">
                  {settings.shopName}
                </h2>
                <p className="text-sm font-semibold text-gray-700">{settings.shopNameKhmer}</p>
                <p className="text-xs text-gray-600 mt-1">{settings.address}</p>
                <p className="text-xs text-gray-600">Tel: {settings.phone} • Email: info@khmermart.com</p>
              </div>

              <div className="text-right">
                <h3 className="text-xl font-bold uppercase text-gray-800">វិក្កយបត្រ / INVOICE</h3>
                <p className="text-xs font-mono font-bold text-blue-700 mt-1">#{activeSale.invoiceNumber}</p>
                <p className="text-xs text-gray-600">កាលបរិច្ឆេទ: {activeSale.date}</p>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 mt-1">
                  PAID ({activeSale.paymentMethod})
                </span>
              </div>
            </div>

            {/* Bill To Info */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 block">ជូនចំពោះ / INVOICE TO:</span>
                <p className="font-bold text-sm text-gray-900">{activeSale.customerName}</p>
                <p className="text-xs text-gray-600">Customer Group: {activeSale.customerGroup}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">អ្នកគិតលុយ / CASHIER:</span>
                <p className="font-bold text-sm text-gray-900">{activeSale.cashierName}</p>
                <p className="text-xs text-gray-600">Exchange Rate: $1 = {exchangeRate.toLocaleString()} ៛</p>
              </div>
            </div>

            {/* A4 Items Table */}
            <div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold text-xs">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">បរិយាយមុខទំនិញ (Description)</th>
                    <th className="py-2.5 px-3 text-center">ចំនួន (Qty)</th>
                    <th className="py-2.5 px-3 text-right">តម្លៃរាយ (Unit Price)</th>
                    <th className="py-2.5 px-3 text-right">សរុប (Total USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-xs">
                  {activeSale.items.map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-2.5 px-3 text-gray-500">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-semibold">{item.productName}</td>
                      <td className="py-2.5 px-3 text-center">{item.quantity} {item.unit}</td>
                      <td className="py-2.5 px-3 text-right font-mono">${item.unitPrice.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-gray-900">
                        ${item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* A4 Totals & Signatures */}
            <div className="grid grid-cols-2 gap-8 pt-4 border-t border-gray-300">
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-[11px] text-gray-600">
                  <p className="font-bold text-gray-800">លក្ខខណ្ឌ និងការទូទាត់ (Terms & Conditions):</p>
                  <p className="mt-1">{settings.receiptFooter}</p>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="p-2 border border-gray-300 rounded-lg">
                    <QrCode className="w-16 h-16 text-black" />
                  </div>
                  <div className="text-[10px] text-gray-600">
                    <p className="font-bold text-gray-800">KHQR Payment Verified</p>
                    <p>ABA PayWay / Bakong QR</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>តម្លៃសរុប (Subtotal):</span>
                  <span className="font-mono font-bold text-gray-900">${activeSale.subtotal.toFixed(2)}</span>
                </div>
                {activeSale.discount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>បញ្ចុះតម្លៃ (Discount):</span>
                    <span className="font-mono font-bold">-${activeSale.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-gray-300">
                  <span>សរុបត្រូវបង់ (Grand Total):</span>
                  <span className="font-mono">${activeSale.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-mono font-bold text-blue-700">
                  <span>សរុបជាប្រាក់រៀល (Total KHR):</span>
                  <span>{activeSale.totalKHR.toLocaleString()} ៛</span>
                </div>
                <div className="flex justify-between text-gray-600 pt-1">
                  <span>ប្រាក់បានបង់ (Paid):</span>
                  <span className="font-mono">${(activeSale.paidUSD || activeSale.total).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Signature Lines */}
            <div className="grid grid-cols-2 gap-8 pt-12 text-center text-xs">
              <div>
                <div className="border-t border-gray-400 w-40 mx-auto pt-1 font-bold">
                  ហត្ថលេខាអ្នកទិញ
                </div>
                <p className="text-[10px] text-gray-500">Customer's Signature</p>
              </div>
              <div>
                <div className="border-t border-gray-400 w-40 mx-auto pt-1 font-bold">
                  ហត្ថលេខាអ្នកគិតលុយ
                </div>
                <p className="text-[10px] text-gray-500">Cashier's Signature</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
