import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StockAdjustment, AdjustmentType } from '../types';
import { ArrowUpDown, Plus, Search, Calendar, User, FileText, AlertTriangle, X } from 'lucide-react';

export const StockAdjustmentsView: React.FC = () => {
  const {
    stockAdjustments,
    stockMovements,
    products,
    adjustStock,
    currentUser,
    addToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.productId || '');
  const [adjustQty, setAdjustQty] = useState<number>(1);
  const [adjustType, setAdjustType] = useState<AdjustmentType>('Correction');
  const [reason, setReason] = useState<string>('');

  const targetProduct = products.find(p => p.productId === selectedProductId) || products[0];

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProduct) return;
    if (adjustQty === 0) {
      addToast('ចំនួនកែសម្រួលត្រូវតែធំជាង 0', 'warning');
      return;
    }

    const finalChange = ['Stock Out', 'Damage', 'Lost', 'Expired'].includes(adjustType)
      ? -Math.abs(adjustQty)
      : Math.abs(adjustQty);

    adjustStock(
      targetProduct.productId,
      Math.abs(adjustQty),
      adjustType,
      reason || `${adjustType} correction`
    );

    setShowAddModal(false);
    setReason('');
  };

  const filteredMovements = stockMovements.filter(m =>
    m.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.movementId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.referenceId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="stock-adjustments-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <ArrowUpDown className="w-6 h-6 text-blue-600" />
            ប្រវត្តិកែសម្រួលស្តុក និងចលនាទំនិញ (Stock Movements & Adjustments)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            តាមដានរាល់ចលនានាំចូល លក់ចេញ ខូចខាត បាត់បង់ និងការកែតម្រូវស្តុក
          </p>
        </div>

        <button
          id="btn-create-adjustment"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>កែសម្រួលស្តុកថ្មី (New Adjustment)</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="ស្វែងរកតាមឈ្មោះទំនិញ, Ref ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
          />
        </div>
        <div className="text-xs text-slate-400 font-medium">
          សរុប {stockMovements.length} ចលនាស្តុក
        </div>
      </div>

      {/* Movements Table */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Movement ID</th>
                <th className="py-3 px-3">កាលបរិច្ឆេទ</th>
                <th className="py-3 px-3">ឈ្មោះទំនិញ (Product)</th>
                <th className="py-3 px-3 text-center">ប្រភេទចលនា</th>
                <th className="py-3 px-3">ឯកសារយោង (Ref ID)</th>
                <th className="py-3 px-3 text-center">ស្តុកមុន</th>
                <th className="py-3 px-3 text-center">ចំនួនកែប្រែ</th>
                <th className="py-3 px-3 text-center">ស្តុកថ្មី</th>
                <th className="py-3 px-3">អ្នកប្រតិបត្តិ</th>
                <th className="py-3 px-3">សម្គាល់</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    មិនមានទិន្នន័យចលនាស្តុកទេ
                  </td>
                </tr>
              ) : (
                filteredMovements.map(mov => (
                  <tr key={mov.movementId} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-mono font-bold text-blue-600">
                      {mov.movementId}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {mov.date}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800">
                      {mov.productName}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        mov.type === 'SALE'
                          ? 'bg-rose-100 text-rose-700'
                          : mov.type === 'PURCHASE'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {mov.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {mov.referenceId}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-500">
                      {mov.previousStock}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold">
                      <span className={mov.quantityChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                        {mov.quantityChange >= 0 ? `+${mov.quantityChange}` : mov.quantityChange}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-black text-slate-900">
                      {mov.newStock}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {mov.user}
                    </td>
                    <td className="py-3 px-3 text-slate-500 max-w-xs truncate">
                      {mov.notes}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Adjustment Modal */}
      {showAddModal && (
        <div id="modal-new-adjustment" className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <ArrowUpDown className="w-5 h-5 text-blue-600" />
                កែសម្រួលស្តុកទំនិញ (Stock Adjustment)
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  ជ្រើសរើសទំនិញ (Select Product) *
                </label>
                <select
                  value={selectedProductId}
                  onChange={e => setSelectedProductId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                >
                  {products.map(p => (
                    <option key={p.productId} value={p.productId}>
                      {p.name} - ស្តុកបច្ចុប្បន្ន: {p.stock} {p.unit}
                    </option>
                  ))}
                </select>
              </div>

              {targetProduct && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <p className="text-slate-500">Barcode: <span className="font-mono text-slate-800 font-bold">{targetProduct.barcode}</span></p>
                  <p className="text-slate-500 mt-1">ស្តុកបច្ចុប្បន្នក្នុងប្រព័ន្ធ: <strong className="text-blue-600 font-mono text-sm">{targetProduct.stock} {targetProduct.unit}</strong></p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  ប្រភេទនៃការកែសម្រួល (Type) *
                </label>
                <select
                  value={adjustType}
                  onChange={e => setAdjustType(e.target.value as AdjustmentType)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                >
                  <option value="Stock In">នាំចូលបន្ថែម (Stock In +)</option>
                  <option value="Stock Out">ដកចេញពីស្តុក (Stock Out -)</option>
                  <option value="Damage">ខូចខាត (Damage -)</option>
                  <option value="Lost">បាត់បង់ (Lost -)</option>
                  <option value="Expired">ផុតកំណត់ (Expired -)</option>
                  <option value="Correction">កែតម្រូវទូទៅ (Correction)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  ចំនួន (Quantity) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustQty}
                  onChange={e => setAdjustQty(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-mono font-bold focus:outline-none focus:border-blue-500 focus:bg-white"
                  placeholder="5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  មូលហេតុ (Reason / Note)
                </label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="បញ្ជាក់មូលហេតុនៃការកែសម្រួលស្តុក..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  រក្សាទុកការកែប្រែ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
