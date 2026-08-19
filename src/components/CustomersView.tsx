import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Customer, CustomerGroup } from '../types';
import { Users, Plus, Search, Phone, MapPin, Mail, Edit2, Trash2, DollarSign, X } from 'lucide-react';

export const CustomersView: React.FC = () => {
  const {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    formatUSD,
    addToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    customerGroup: 'General' as CustomerGroup,
    discountRate: 0
  });

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      customerGroup: 'General',
      discountRate: 0
    });
    setShowModal(true);
  };

  const handleOpenEdit = (c: Customer) => {
    setEditingCustomer(c);
    setFormData({
      name: c.name,
      phone: c.phone,
      email: c.email || '',
      address: c.address || '',
      customerGroup: c.customerGroup,
      discountRate: c.discountRate || 0
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('សូមបញ្ចូលឈ្មោះអតិថិជន', 'warning');
      return;
    }

    if (editingCustomer) {
      updateCustomer({
        ...editingCustomer,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        customerGroup: formData.customerGroup,
        discountRate: formData.discountRate
      });
    } else {
      addCustomer({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        customerGroup: formData.customerGroup,
        discountRate: formData.discountRate,
        totalPurchases: 0,
        balanceDebt: 0
      });
    }

    setShowModal(false);
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    c.customerId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="customers-view" className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            គ្រប់គ្រងអតិថិជន (Customers & Loyalty)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            អតិថិជនសរុប {customers.length} នាក់ • តាមដានប្រវត្តិទិញ និងបំណុល
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>បន្ថែមអតិថិជនថ្មី (Add Customer)</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="ស្វែងរកតាមឈ្មោះ, លេខទូរស័ព្ទ, ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
          />
        </div>
        <div className="text-xs text-slate-400 font-medium">
          សរុប {customers.length} នាក់
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Customer ID</th>
                <th className="py-3 px-3">ឈ្មោះអតិថិជន</th>
                <th className="py-3 px-3">លេខទូរស័ព្ទ</th>
                <th className="py-3 px-3">អាសយដ្ឋាន</th>
                <th className="py-3 px-3 text-center">ក្រុម (Group)</th>
                <th className="py-3 px-3 text-right">ទិញសរុប ($)</th>
                <th className="py-3 px-3 text-right">ជំពាក់ ($)</th>
                <th className="py-3 px-3 text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCustomers.map(c => (
                <tr key={c.customerId} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3 font-mono font-bold text-blue-600">
                    {c.customerId}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-800">
                    {c.name}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600">
                    {c.phone}
                  </td>
                  <td className="py-3 px-3 text-slate-500 max-w-xs truncate">
                    {c.address || '-'}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      c.customerGroup === 'VIP'
                        ? 'bg-amber-100 text-amber-700'
                        : c.customerGroup === 'Wholesale'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {c.customerGroup} {c.discountRate > 0 ? `(-${c.discountRate}%)` : ''}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">
                    {formatUSD(c.totalPurchases || 0)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono">
                    <span className={(c.balanceDebt || 0) > 0 ? 'text-rose-600 font-bold' : 'text-slate-400'}>
                      {formatUSD(c.balanceDebt || 0)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 rounded bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 transition cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteCustomer(c.customerId)}
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
                <Users className="w-5 h-5 text-blue-600" />
                {editingCustomer ? 'កែប្រែព័ត៌មានអតិថិជន' : 'បន្ថែមអតិថិជនថ្មី'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  ឈ្មោះអតិថិជន (Customer Name) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="សុខ ចិន្តា"
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
                  placeholder="012 345 678"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    ក្រុមអតិថិជន (Group)
                  </label>
                  <select
                    value={formData.customerGroup}
                    onChange={e => {
                      const grp = e.target.value as CustomerGroup;
                      let rate = 0;
                      if (grp === 'VIP') rate = 5;
                      if (grp === 'Wholesale') rate = 10;
                      setFormData({ ...formData, customerGroup: grp, discountRate: rate });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="General">ទូទៅ (General)</option>
                    <option value="VIP">VIP (-5%)</option>
                    <option value="Wholesale">លក់ដុំ (Wholesale -10%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    បញ្ចុះតម្លៃពិសេស (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discountRate}
                    onChange={e => setFormData({ ...formData, discountRate: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-mono font-bold focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  អាសយដ្ឋាន (Address)
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="ផ្ទះលេខ..., ផ្លូវ..., រាជធានីភ្នំពេញ"
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
