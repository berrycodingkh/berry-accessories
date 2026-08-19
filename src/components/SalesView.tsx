import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sale } from '../types';
import {
  ShoppingBag,
  Search,
  Printer,
  RotateCcw,
  Trash2,
  Eye,
  FileText,
  DollarSign,
  Calendar,
  X
} from 'lucide-react';

export const SalesView: React.FC = () => {
  const {
    sales,
    returnSale,
    formatUSD,
    formatKHR,
    setCurrentView,
    setSelectedInvoiceForPrint,
    addToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [refundTargetSale, setRefundTargetSale] = useState<Sale | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [selectedSaleDetail, setSelectedSaleDetail] = useState<Sale | null>(null);

  const filteredSales = sales.filter(s =>
    s.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.cashierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.saleId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirmRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundTargetSale) return;
    returnSale(refundTargetSale.saleId, refundReason || 'Customer requested return');
    setRefundTargetSale(null);
    setRefundReason('');
  };

  return (
    <div id="sales-view" className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
            បញ្ជីប្រតិបត្តិការលក់ (Sales History & Invoices)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            ទិន្នន័យវិក្កយបត្រលក់សរុប {sales.length} | ចំណូលសរុប: {formatUSD(sales.reduce((a, s) => a + (s.status === 'Completed' ? s.total : 0), 0))}
          </p>
        </div>

        <button
          onClick={() => setCurrentView('pos')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition transform active:scale-95 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>បើក POS លក់ទំនិញ</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="ស្វែងរកតាមលេខ Invoice, អតិថិជន, Cashier..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
          />
        </div>
        <div className="text-xs text-slate-400 font-medium">
          បង្ហាញ {filteredSales.length} នៃ {sales.length}
        </div>
      </div>

      {/* Sales Table */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">លេខវិក្កយបត្រ (Invoice #)</th>
                <th className="py-3 px-3">កាលបរិច្ឆេទ</th>
                <th className="py-3 px-3">អតិថិជន</th>
                <th className="py-3 px-3">អ្នកគិតលុយ</th>
                <th className="py-3 px-3 text-right">សរុប ($ USD)</th>
                <th className="py-3 px-3 text-right">សរុប (៛ KHR)</th>
                <th className="py-3 px-3 text-right">ចំណេញ ($)</th>
                <th className="py-3 px-3 text-center">វិធីទូទាត់</th>
                <th className="py-3 px-3 text-center">ស្ថានភាព</th>
                <th className="py-3 px-3 text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    មិនមានទិន្នន័យការលក់ត្រូវនឹងការស្វែងរកទេ
                  </td>
                </tr>
              ) : (
                filteredSales.map(sale => (
                  <tr key={sale.saleId} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-mono font-bold text-blue-600">
                      {sale.invoiceNumber}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {sale.date}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800">
                      {sale.customerName}
                      <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-normal">
                        {sale.customerGroup}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {sale.cashierName}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 font-mono">
                      {formatUSD(sale.total)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-500">
                      {formatKHR(sale.totalKHR)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-600 font-bold">
                      {formatUSD(sale.profit || 0)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        sale.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {sale.status === 'Completed' ? 'Paid' : 'Refunded'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View Items */}
                        <button
                          onClick={() => setSelectedSaleDetail(sale)}
                          className="p-1.5 rounded bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 transition cursor-pointer"
                          title="មើលមុខទំនិញ"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Print Invoice */}
                        <button
                          onClick={() => {
                            setSelectedInvoiceForPrint(sale);
                            setCurrentView('invoices');
                          }}
                          className="p-1.5 rounded bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-600 transition cursor-pointer"
                          title="បោះពុម្ពវិក្កយបត្រ (Print)"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* Refund / Return */}
                        {sale.status === 'Completed' && (
                          <button
                            onClick={() => setRefundTargetSale(sale)}
                            className="p-1.5 rounded bg-slate-100 hover:bg-rose-600 hover:text-white text-rose-600 transition cursor-pointer"
                            title="បង្វិលសង / ដកទំនិញចូលស្តុកវិញ (Return/Refund)"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sale Detail Modal */}
      {selectedSaleDetail && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  ព័ត៌មានលម្អិតវិក្កយបត្រ {selectedSaleDetail.invoiceNumber}
                </h3>
                <p className="text-xs text-slate-400">{selectedSaleDetail.date} • {selectedSaleDetail.cashierName}</p>
              </div>
              <button onClick={() => setSelectedSaleDetail(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between">
                <span>អតិថិជន: <strong className="text-slate-800">{selectedSaleDetail.customerName}</strong></span>
                <span>ការទូទាត់: <strong className="text-blue-600">{selectedSaleDetail.paymentMethod}</strong></span>
              </div>

              <div className="overflow-x-auto max-h-60 overflow-y-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-200 bg-slate-50">
                      <th className="py-2 px-2">ទំនិញ</th>
                      <th className="py-2 px-2 text-center">ចំនួន</th>
                      <th className="py-2 px-2 text-right">តម្លៃ</th>
                      <th className="py-2 px-2 text-right">សរុប ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {selectedSaleDetail.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-2 font-medium text-slate-800">{item.productName}</td>
                        <td className="py-2 px-2 text-center font-mono">{item.quantity} {item.unit}</td>
                        <td className="py-2 px-2 text-right font-mono">{formatUSD(item.unitPrice)}</td>
                        <td className="py-2 px-2 text-right font-mono font-bold text-slate-900">{formatUSD(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs border border-slate-200">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span className="font-mono text-slate-800 font-bold">{formatUSD(selectedSaleDetail.subtotal)}</span>
                </div>
                {selectedSaleDetail.discount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Discount:</span>
                    <span className="font-mono font-bold">-{formatUSD(selectedSaleDetail.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-slate-900 pt-1 border-t border-slate-200">
                  <span>សរុប (Total USD):</span>
                  <span className="text-slate-900 font-mono font-black">{formatUSD(selectedSaleDetail.total)}</span>
                </div>
                <div className="flex justify-between font-mono text-xs text-blue-600 font-bold">
                  <span>សរុបជាប្រាក់រៀល (Total KHR):</span>
                  <span>{formatKHR(selectedSaleDetail.totalKHR)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedSaleDetail(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  បិទ
                </button>
                <button
                  onClick={() => {
                    setSelectedInvoiceForPrint(selectedSaleDetail);
                    setSelectedSaleDetail(null);
                    setCurrentView('invoices');
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>បោះពុម្ពវិក្កយបត្រ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Return / Refund Modal */}
      {refundTargetSale && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-rose-600" />
                បង្វិលសងវិក្កយបត្រ (Refund / Return)
              </h3>
              <button onClick={() => setRefundTargetSale(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmRefund} className="mt-4 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <p className="text-slate-800 font-bold">វិក្កយបត្រ: {refundTargetSale.invoiceNumber}</p>
                <p className="text-slate-500">អតិថិជន: {refundTargetSale.customerName}</p>
                <p className="text-emerald-600 font-bold">ទឹកប្រាក់ត្រូវបង្វិល: {formatUSD(refundTargetSale.total)} ({formatKHR(refundTargetSale.totalKHR)})</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  មូលហេតុនៃការបង្វិលសង (Reason) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={refundReason}
                  onChange={e => setRefundReason(e.target.value)}
                  placeholder="ឧទាហរណ៍: អតិថិជនដូរទំនិញ ឬទិញច្រឡំ..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-rose-500 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRefundTargetSale(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
                >
                  បញ្ជាក់ការបង្វិលសង & បញ្ចូលស្តុក
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
