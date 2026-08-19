import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Expense } from '../types';
import { Wallet, Plus, Search, DollarSign, Calendar, Tag, Trash2, X } from 'lucide-react';

export const ExpensesView: React.FC = () => {
  const {
    expenses,
    addExpense,
    deleteExpense,
    formatUSD,
    formatKHR,
    exchangeRate,
    currentUser,
    addToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [category, setCategory] = useState('Rent');
  const [amountUSD, setAmountUSD] = useState<number>(50);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');

  const totalExpenseUSD = expenses.reduce((sum, e) => sum + e.amountUSD, 0);
  const totalExpenseKHR = expenses.reduce((sum, e) => sum + e.amountKHR, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amountUSD <= 0) {
      addToast('សូមបញ្ចូលចំនួនទឹកប្រាក់ធំជាង 0', 'warning');
      return;
    }

    addExpense({
      category,
      amountUSD: Number(amountUSD),
      amountKHR: Math.round(Number(amountUSD) * exchangeRate),
      paymentMethod,
      reference,
      notes,
      user: currentUser?.fullName || 'Super Administrator'
    });

    setShowModal(false);
    setReference('');
    setNotes('');
  };

  const filteredExpenses = expenses.filter(e =>
    e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="expenses-view" className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Wallet className="w-6 h-6 text-rose-600" />
            គ្រប់គ្រងការចំណាយ (Expense Management)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            ចំណាយសរុប: <strong className="text-rose-600 font-mono">{formatUSD(totalExpenseUSD)}</strong> ({formatKHR(totalExpenseKHR)})
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>កត់ត្រាចំណាយថ្មី (Add Expense)</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="ស្វែងរកតាមប្រភេទ, សម្គាល់, Ref..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition"
          />
        </div>
        <div className="text-xs text-slate-400 font-medium">
          សរុប {expenses.length} កំណត់ត្រា
        </div>
      </div>

      {/* Expenses Table */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Expense ID</th>
                <th className="py-3 px-3">កាលបរិច្ឆេទ</th>
                <th className="py-3 px-3">ប្រភេទចំណាយ (Category)</th>
                <th className="py-3 px-3 text-right">ចំនួនទឹកប្រាក់ ($ USD)</th>
                <th className="py-3 px-3 text-right">គិតជារៀល (៛ KHR)</th>
                <th className="py-3 px-3 text-center">វិធីទូទាត់</th>
                <th className="py-3 px-3">ឯកសារយោង</th>
                <th className="py-3 px-3">បរិយាយ</th>
                <th className="py-3 px-3 text-center">លុប</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    មិនមានទិន្នន័យចំណាយទេ
                  </td>
                </tr>
              ) : (
                filteredExpenses.map(exp => (
                  <tr key={exp.expenseId} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-mono font-bold text-rose-600">
                      {exp.expenseId}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {exp.date}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] text-slate-700 font-medium">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-rose-600">
                      {formatUSD(exp.amountUSD)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-500 font-medium">
                      {formatKHR(exp.amountKHR)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-medium">
                        {exp.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500">
                      {exp.reference || '-'}
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                      {exp.notes}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => deleteExpense(exp.expenseId)}
                        className="p-1.5 rounded bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-500 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-rose-600" />
                កត់ត្រាការចំណាយ (Record Expense)
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  ប្រភេទនៃការចំណាយ (Category) *
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-rose-500 font-medium"
                >
                  <option value="Rent">ថ្លៃជួលទីតាំង (Rent)</option>
                  <option value="Electricity">ថ្លៃអគ្គិសនី (Electricity)</option>
                  <option value="Water">ថ្លៃទឹក (Water)</option>
                  <option value="Internet">ថ្លៃអ៊ីនធឺណិត (Internet)</option>
                  <option value="Salary">ប្រាក់ខែបុគ្គលិក (Staff Salary)</option>
                  <option value="Transport">ថ្លៃដឹកជញ្ជូន (Transportation)</option>
                  <option value="Office Supplies">សម្ភារៈការិយាល័យ (Supplies)</option>
                  <option value="Marketing">ការផ្សព្វផ្សាយ (Marketing & Ads)</option>
                  <option value="Maintenance">ជួសជុលថែទាំ (Maintenance)</option>
                  <option value="Tax">ពន្ធដារ (Taxes & Fees)</option>
                  <option value="Other">ផ្សេងៗ (Other Expense)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  ចំនួនទឹកប្រាក់ ($ USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  required
                  value={amountUSD}
                  onChange={e => setAmountUSD(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-mono font-bold focus:outline-none focus:border-rose-500 focus:bg-white"
                />
                <span className="text-[10px] text-rose-600 font-mono font-bold mt-1 block">
                  = {formatKHR(amountUSD * exchangeRate)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  វិធីទូទាត់ (Payment Method)
                </label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-rose-500 font-medium"
                >
                  <option value="Cash">សាច់ប្រាក់សុទ្ធ (Cash)</option>
                  <option value="ABA">ABA PayWay / Bank Transfer</option>
                  <option value="ACLEDA">ACLEDA Bank</option>
                  <option value="Wing">Wing Bank</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  លេខយោង / លេខវិក្កយបត្រ (Reference #)
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={e => setReference(e.target.value)}
                  placeholder="REC-2026-081"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-rose-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  បរិយាយលម្អិត (Notes)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="បញ្ជាក់ការចំណាយ..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-rose-500 focus:bg-white"
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
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  កត់ត្រាចំណាយ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
