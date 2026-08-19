import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Purchase, PurchaseItem } from '../types';
import {
  Truck,
  Plus,
  Search,
  Calendar,
  DollarSign,
  Package,
  Trash2,
  CheckCircle,
  Clock,
  Printer,
  FileText,
  X
} from 'lucide-react';

export const PurchasesView: React.FC = () => {
  const {
    purchases,
    suppliers,
    products,
    createPurchase,
    formatUSD,
    formatKHR,
    exchangeRate,
    currentUser,
    addToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  // Form State
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.supplierId || '');
  const [supplierInvoiceNo, setSupplierInvoiceNo] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('ABA');
  const [purchaseStatus, setPurchaseStatus] = useState<'Received' | 'Pending'>('Received');
  const [purchaseNote, setPurchaseNote] = useState('');

  // Items table inside purchase
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([
    {
      productId: products[0]?.productId || '',
      productName: products[0]?.name || '',
      barcode: products[0]?.barcode || '',
      unit: products[0]?.unit || 'Piece',
      quantity: 10,
      costPrice: products[0]?.costPrice || 1.0,
      discount: 0,
      tax: 0,
      total: (products[0]?.costPrice || 1.0) * 10
    }
  ]);

  const [paidAmount, setPaidAmount] = useState<number>(0);

  // Calculations
  const subtotal = purchaseItems.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0);
  const totalDiscount = purchaseItems.reduce((sum, item) => sum + item.discount, 0);
  const totalTax = purchaseItems.reduce((sum, item) => sum + item.tax, 0);
  const grandTotal = Math.max(0, subtotal - totalDiscount + totalTax);
  const dueAmount = Math.max(0, grandTotal - paidAmount);

  // Add Item Line
  const handleAddItemLine = () => {
    const firstProd = products[0];
    if (!firstProd) return;
    setPurchaseItems(prev => [
      ...prev,
      {
        productId: firstProd.productId,
        productName: firstProd.name,
        barcode: firstProd.barcode,
        unit: firstProd.unit,
        quantity: 10,
        costPrice: firstProd.costPrice,
        discount: 0,
        tax: 0,
        total: firstProd.costPrice * 10
      }
    ]);
  };

  const handleRemoveItemLine = (index: number) => {
    if (purchaseItems.length <= 1) return;
    setPurchaseItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleProductChange = (index: number, productId: string) => {
    const prod = products.find(p => p.productId === productId);
    if (!prod) return;

    setPurchaseItems(prev => prev.map((item, i) => {
      if (i === index) {
        const qty = item.quantity;
        const total = qty * prod.costPrice - item.discount + item.tax;
        return {
          ...item,
          productId: prod.productId,
          productName: prod.name,
          barcode: prod.barcode,
          unit: prod.unit,
          costPrice: prod.costPrice,
          total: Math.max(0, total)
        };
      }
      return item;
    }));
  };

  const handleItemFieldChange = (index: number, field: keyof PurchaseItem, val: number) => {
    setPurchaseItems(prev => prev.map((item, i) => {
      if (i === index) {
        const updated = { ...item, [field]: val };
        const lineTotal = (updated.quantity * updated.costPrice) - updated.discount + updated.tax;
        return { ...updated, total: Math.max(0, lineTotal) };
      }
      return item;
    }));
  };

  const handleSubmitPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (purchaseItems.length === 0) {
      addToast('សូមជ្រើសរើសទំនិញយ៉ាងហោចណាស់មួយ', 'warning');
      return;
    }
    const supplier = suppliers.find(s => s.supplierId === selectedSupplierId);
    if (!supplier) {
      addToast('សូមជ្រើសរើសអ្នកផ្គត់ផ្គង់', 'warning');
      return;
    }

    createPurchase({
      supplierId: supplier.supplierId,
      supplierName: supplier.name,
      invoiceNumber: supplierInvoiceNo || `INV-SUP-${Date.now().toString().slice(-4)}`,
      items: purchaseItems,
      subtotal,
      discount: totalDiscount,
      tax: totalTax,
      total: grandTotal,
      paidAmount: Number(paidAmount) || grandTotal,
      dueAmount: Math.max(0, grandTotal - (Number(paidAmount) || grandTotal)),
      paymentMethod,
      status: purchaseStatus,
      note: purchaseNote,
      createdUser: currentUser?.fullName || 'Super Administrator'
    });

    setShowNewModal(false);
  };

  const filteredPurchases = purchases.filter(p =>
    p.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.purchaseId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="purchases-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-600" />
            ការនាំចូលទំនិញ និងបញ្ជាទិញ (Purchases & Stock In)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            កត់ត្រាការទិញចូលពីអ្នកផ្គត់ផ្គង់ បង្កើនស្តុកទំនិញ និងតាមដានបំណុល
          </p>
        </div>

        <button
          id="btn-create-purchase"
          onClick={() => {
            setPaidAmount(grandTotal);
            setShowNewModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>បង្កើតការនាំចូលថ្មី (New Stock In)</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="ស្វែងរកតាមលេខ Invoice, អ្នកផ្គត់ផ្គង់..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
          />
        </div>
        <div className="text-xs text-slate-400 font-medium">
          សរុប {purchases.length} កំណត់ត្រា
        </div>
      </div>

      {/* Purchases List */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Purchase ID</th>
                <th className="py-3 px-3">កាលបរិច្ឆេទ</th>
                <th className="py-3 px-3">អ្នកផ្គត់ផ្គង់ (Supplier)</th>
                <th className="py-3 px-3">លេខវិក្កយបត្រ (Inv #)</th>
                <th className="py-3 px-3">មុខទំនិញ</th>
                <th className="py-3 px-3 text-right">សរុប (Total $)</th>
                <th className="py-3 px-3 text-right">បានបង់ (Paid)</th>
                <th className="py-3 px-3 text-right">នៅខ្វះ (Due)</th>
                <th className="py-3 px-3 text-center">ស្ថានភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    មិនមានទិន្នន័យនាំចូលទំនិញទេ
                  </td>
                </tr>
              ) : (
                filteredPurchases.map(purchase => (
                  <tr key={purchase.purchaseId} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-mono font-bold text-blue-600">
                      {purchase.purchaseId}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {purchase.date}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800">
                      {purchase.supplierName}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {purchase.invoiceNumber}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] text-slate-700 font-semibold">
                        {purchase.items.length} មុខ ({purchase.items.reduce((a, b) => a + b.quantity, 0)} Items)
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 font-mono">
                      {formatUSD(purchase.total)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-600 font-bold">
                      {formatUSD(purchase.paidAmount)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono">
                      <span className={purchase.dueAmount > 0 ? 'text-amber-600 font-bold' : 'text-slate-400'}>
                        {formatUSD(purchase.dueAmount)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        purchase.status === 'Received'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {purchase.status === 'Received' ? 'Received' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Purchase / Stock In Modal */}
      {showNewModal && (
        <div id="modal-new-purchase" className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                កត់ត្រាការនាំចូលទំនិញថ្មី (Record Stock In)
              </h2>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPurchase} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Supplier */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    អ្នកផ្គត់ផ្គង់ (Supplier) *
                  </label>
                  <select
                    value={selectedSupplierId}
                    onChange={e => setSelectedSupplierId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    {suppliers.map(s => (
                      <option key={s.supplierId} value={s.supplierId}>{s.name} ({s.contactPerson})</option>
                    ))}
                  </select>
                </div>

                {/* Supplier Invoice No */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    លេខវិក្កយបត្រអ្នកផ្គត់ផ្គង់ (Supplier Invoice #)
                  </label>
                  <input
                    type="text"
                    value={supplierInvoiceNo}
                    onChange={e => setSupplierInvoiceNo(e.target.value)}
                    placeholder="INV-SUP-9901"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white font-mono"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    វិធីទូទាត់ (Payment Method)
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="ABA">ABA PayWay / Bank Transfer</option>
                    <option value="Cash">សាច់ប្រាក់សុទ្ធ (Cash)</option>
                    <option value="ACLEDA">ACLEDA Bank</option>
                    <option value="Wing">Wing Bank</option>
                    <option value="Credit">ជំពាក់ (Credit)</option>
                  </select>
                </div>
              </div>

              {/* Items Table */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                    បញ្ជីមុខទំនិញនាំចូល (Products Stock In)
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddItemLine}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    បន្ថែមជួរទំនិញ (Add Item)
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-200">
                        <th className="py-2 px-2">មុខទំនិញ</th>
                        <th className="py-2 px-2 w-20">ខ្នាត</th>
                        <th className="py-2 px-2 w-24">ចំនួន</th>
                        <th className="py-2 px-2 w-28">តម្លៃដើម ($)</th>
                        <th className="py-2 px-2 w-24">បញ្ចុះ ($)</th>
                        <th className="py-2 px-2 w-28 text-right">សរុប ($)</th>
                        <th className="py-2 px-2 w-10 text-center">លុប</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60">
                      {purchaseItems.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-2">
                            <select
                              value={item.productId}
                              onChange={e => handleProductChange(idx, e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 font-medium"
                            >
                              {products.map(p => (
                                <option key={p.productId} value={p.productId}>
                                  {p.name} ({p.barcode}) - ស្តុក: {p.stock}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-2 px-2 font-mono text-slate-600 font-bold">{item.unit}</td>
                          <td className="py-2 px-2">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={e => handleItemFieldChange(idx, 'quantity', parseInt(e.target.value, 10) || 0)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 font-mono font-bold"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={item.costPrice}
                              onChange={e => handleItemFieldChange(idx, 'costPrice', parseFloat(e.target.value) || 0)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 font-mono font-bold"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={item.discount}
                              onChange={e => handleItemFieldChange(idx, 'discount', parseFloat(e.target.value) || 0)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 font-mono font-bold"
                            />
                          </td>
                          <td className="py-2 px-2 text-right font-mono font-bold text-slate-900">
                            {formatUSD(item.total)}
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItemLine(idx)}
                              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary and Paid Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    កំណត់សម្គាល់ (Note)
                  </label>
                  <textarea
                    rows={2}
                    value={purchaseNote}
                    onChange={e => setPurchaseNote(e.target.value)}
                    placeholder="បញ្ជាក់ព័ត៌មានបន្ថែម..."
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>តម្លៃទំនិញសរុប (Subtotal):</span>
                    <span className="font-mono text-slate-800 font-bold">{formatUSD(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>បញ្ចុះតម្លៃ (Discount):</span>
                    <span className="font-mono text-slate-800 font-bold">{formatUSD(totalDiscount)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 text-sm pt-1 border-t border-slate-200">
                    <span>សរុបត្រូវបង់ (Grand Total):</span>
                    <span className="text-blue-600 font-mono font-black">{formatUSD(grandTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-700 font-bold">ប្រាក់បានបង់ (Paid Amount $):</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={paidAmount}
                      onChange={e => setPaidAmount(parseFloat(e.target.value) || 0)}
                      className="w-32 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-emerald-600 font-mono text-right font-bold"
                    />
                  </div>
                  {dueAmount > 0 && (
                    <div className="flex justify-between text-amber-600 font-bold">
                      <span>នៅខ្វះ (Due Balance):</span>
                      <span className="font-mono">{formatUSD(dueAmount)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  បោះបង់ (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  រក្សាទុកការនាំចូល (Save Stock In)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
