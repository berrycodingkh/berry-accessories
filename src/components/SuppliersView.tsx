import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Supplier } from '../types';
import { Truck, Plus, Search, Phone, MapPin, Edit2, Trash2, X } from 'lucide-react';

export const SuppliersView: React.FC = () => {
  const {
    suppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    formatUSD,
    addToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: ''
  });

  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setFormData({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (s: Supplier) => {
    setEditingSupplier(s);
    setFormData({
      name: s.name,
      contactPerson: s.contactPerson,
      phone: s.phone,
      email: s.email || '',
      address: s.address || ''
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('សូមបញ្ចូលឈ្មោះក្រុមហ៊ុនផ្គត់ផ្គង់', 'warning');
      return;
    }

    if (editingSupplier) {
      updateSupplier({
        ...editingSupplier,
        name: formData.name,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        address: formData.address
      });
    } else {
      addSupplier({
        name: formData.name,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        totalPurchases: 0,
        balanceDebt: 0
      });
    }

    setShowModal(false);
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.phone.includes(searchTerm)
  );

  return (
    <div id="suppliers-view" className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-600" />
            គ្រប់គ្រងអ្នកផ្គត់ផ្គង់ (Suppliers & Vendors)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            បញ្ជីអ្នកផ្គត់ផ្គង់ទំនិញសរុប {suppliers.length} ក្រុមហ៊ុន • តាមដានការទិញ និងបំណុល
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>បន្ថែមអ្នកផ្គត់ផ្គង់ថ្មី (Add Supplier)</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="ស្វែងរកតាមឈ្មោះ, អ្នកទំនាក់ទំនង, ទូរស័ព្ទ..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
          />
        </div>
        <div className="text-xs text-slate-400 font-medium">
          សរុប {suppliers.length} ក្រុមហ៊ុន
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Supplier ID</th>
                <th className="py-3 px-3">ឈ្មោះក្រុមហ៊ុន (Company)</th>
                <th className="py-3 px-3">អ្នកទំនាក់ទំនង (Contact)</th>
                <th className="py-3 px-3">លេខទូរស័ព្ទ</th>
                <th className="py-3 px-3">អាសយដ្ឋាន</th>
                <th className="py-3 px-3 text-right">ទិញចូលសរុប ($)</th>
                <th className="py-3 px-3 text-right">ជំពាក់ ($)</th>
                <th className="py-3 px-3 text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSuppliers.map(s => (
                <tr key={s.supplierId} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3 font-mono font-bold text-blue-600">
                    {s.supplierId}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-800">
                    {s.name}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {s.contactPerson}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600">
                    {s.phone}
                  </td>
                  <td className="py-3 px-3 text-slate-500 max-w-xs truncate">
                    {s.address || '-'}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">
                    {formatUSD(s.totalPurchases || 0)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono">
                    <span className={(s.balanceDebt || 0) > 0 ? 'text-rose-600 font-bold' : 'text-slate-400'}>
                      {formatUSD(s.balanceDebt || 0)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-1.5 rounded bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 transition cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteSupplier(s.supplierId)}
                        className="p-1.5 rounded bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-600 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                {editingSupplier ? 'កែប្រែព័ត៌មានអ្នកផ្គត់ផ្គង់' : 'បន្ថែមអ្នកផ្គត់ផ្គង់ថ្មី'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  ឈ្មោះក្រុមហ៊ុនផ្គត់ផ្គង់ (Company Name) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Coca-Cola Beverage Co., Ltd"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  អ្នកទំនាក់ទំនង (Contact Person) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="លោក សុខា"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  លេខទូរស័ព្ទ (Phone Number) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="023 888 999"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  អាសយដ្ឋាន (Address)
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="រាជធានីភ្នំពេញ..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  រក្សាទុក
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
