import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, UserRole } from '../types';
import {
  Users,
  UserPlus,
  Shield,
  Key,
  Lock,
  Phone,
  Mail,
  Building,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  Search,
  ShoppingCart,
  UserCheck,
  Eye,
  EyeOff,
  Plus,
  X,
  Sparkles
} from 'lucide-react';

export const UsersView: React.FC = () => {
  const { users, createUser, updateUser, deleteUser, currentUser, login, addToast, setCurrentView } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Cashier');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [branch, setBranch] = useState('Main Store Phnom Penh');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const openCreateModal = () => {
    setEditingUser(null);
    setFullName('');
    setUsername('');
    setPassword('');
    setRole('Cashier');
    setPhone('');
    setEmail('');
    setBranch('Main Store Phnom Penh');
    setStatus('Active');
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFullName(user.fullName);
    setUsername(user.username);
    setPassword(user.password || '');
    setRole(user.role);
    setPhone(user.phone || '');
    setEmail(user.email || '');
    setBranch(user.branch || 'Main Store Phnom Penh');
    setStatus(user.status);
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim()) {
      addToast('សូមបំពេញឈ្មោះពេញ និងឈ្មោះគណនី (Username)!', 'warning');
      return;
    }

    if (editingUser) {
      updateUser({
        ...editingUser,
        fullName: fullName.trim(),
        username: username.trim().toLowerCase(),
        password: password.trim() || editingUser.password,
        role,
        phone: phone.trim(),
        email: email.trim(),
        branch: branch.trim(),
        status
      });
      addToast(`បានកែសម្រួលព័ត៌មានគណនី "${fullName}" ដោយជោគជ័យ`, 'success');
    } else {
      // Check duplicate username
      const exists = users.some(u => u.username.toLowerCase() === username.trim().toLowerCase());
      if (exists) {
        addToast(`ឈ្មោះគណនី "${username}" នេះមានរួចហើយក្នុងប្រព័ន្ធ!`, 'error');
        return;
      }

      createUser({
        fullName: fullName.trim(),
        username: username.trim().toLowerCase(),
        password: password.trim() || '123456',
        role,
        phone: phone.trim(),
        email: email.trim() || `${username.trim().toLowerCase()}@berrymoto.com`,
        branch: branch.trim(),
        status
      });
      addToast(`បានបង្កើតគណនី Cashier/បុគ្គលិក "${fullName}" (${role}) រួចរាល់! អាចប្រើ Login លក់ភ្លាមៗ`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (u: User) => {
    if (u.userId === currentUser?.userId) {
      addToast('មិនអាចលុបគណនីដែលអ្នកកំពុង Login ប្រើប្រាស់បានទេ!', 'error');
      return;
    }
    if (confirm(`តើអ្នកពិតជាចង់លុបគណនី "${u.fullName}" (@${u.username}) មែនទេ?`)) {
      deleteUser(u.userId);
    }
  };

  const handleTestLogin = (u: User) => {
    login(u.username, u.role);
    if (u.role === 'Cashier') {
      setCurrentView('pos');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm);
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const cashierCount = users.filter(u => u.role === 'Cashier').length;
  const adminCount = users.filter(u => u.role === 'Super Admin' || u.role === 'Admin').length;

  return (
    <div className="space-y-6">
      {/* Header & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-zinc-950 p-5 rounded-2xl border border-zinc-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 shadow-md shadow-red-950/50">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              គ្រប់គ្រងអ្នកគិតលុយ & បុគ្គលិក (Cashiers & Staff)
            </h1>
            <p className="text-xs text-zinc-400">
              បង្កើតគណនីអ្នកគិតលុយ (Cashier) សម្រាប់លក់នៅ POS Terminal និងកំណត់សិទ្ធិបុគ្គលិក
            </p>
          </div>
        </div>

        <button
          id="btn-add-cashier"
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-red-900/40 flex items-center justify-center gap-2 transition transform active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ បង្កើត Cashier ថ្មី</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              អ្នកគិតលុយសរុប (Cashiers)
            </span>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">
              {cashierCount} នាក់
            </div>
            <span className="text-[10px] text-zinc-500">មានសិទ្ធិចូលផ្ទាំងលក់ POS</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              អ្នកគ្រប់គ្រង (Admin / Manager)
            </span>
            <div className="text-2xl font-black text-red-400 mt-0.5">
              {adminCount} នាក់
            </div>
            <span className="text-[10px] text-zinc-500">គ្រប់គ្រងស្តុក ទិន្នន័យ និងរបាយការណ៍</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              គណនីបច្ចុប្បន្ន (Active User)
            </span>
            <div className="text-sm font-bold text-white mt-1 truncate">
              {currentUser?.fullName}
            </div>
            <span className="text-[10px] text-red-400 font-mono font-semibold block">
              @{currentUser?.username} ({currentUser?.role})
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-center font-black">
            {currentUser?.fullName.slice(0, 2).toUpperCase() || 'US'}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-zinc-900/90 p-4 rounded-xl border border-zinc-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="ស្វែងរកតាមឈ្មោះ, Username, ឬលេខទូរស័ព្ទ..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition"
          />
        </div>

        {/* Role Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'Cashier', 'Super Admin', 'Manager', 'Staff'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                roleFilter === r
                  ? 'bg-red-600 text-white shadow-sm shadow-red-900/50'
                  : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {r === 'ALL' ? 'ទាំងអស់' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/90 text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">បុគ្គលិក / អ្នកគិតលុយ</th>
                <th className="py-3 px-4">Username & Login</th>
                <th className="py-3 px-4">តួនាទី (Role)</th>
                <th className="py-3 px-4">លេខទូរស័ព្ទ / អ៊ីមែល</th>
                <th className="py-3 px-4">សាខាហាង</th>
                <th className="py-3 px-4">ស្ថានភាព</th>
                <th className="py-3 px-4 text-right">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-zinc-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    មិនមានគណនីត្រូវនឹងការស្វែងរកទេ
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => {
                  const isCurrent = u.userId === currentUser?.userId;
                  return (
                    <tr key={u.userId} className="hover:bg-zinc-900/50 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-black text-xs text-red-400 shrink-0 shadow-inner">
                            {u.fullName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{u.fullName}</span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.2 rounded bg-red-600/30 border border-red-500/50 text-[9px] text-red-300 font-bold">
                                  អ្នកបច្ចុប្បន្ន
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-zinc-500 font-mono">
                              ID: {u.userId}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="font-mono font-bold text-red-400">
                            @{u.username}
                          </div>
                          <div className="text-[10px] text-zinc-400 font-mono">
                            Pass: {u.password ? '••••••••' : '(Default)'}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          u.role === 'Cashier'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : u.role === 'Super Admin'
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : u.role === 'Manager'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                        }`}>
                          {u.role === 'Cashier' && <ShoppingCart className="w-3 h-3" />}
                          {u.role === 'Super Admin' && <Shield className="w-3 h-3" />}
                          <span>{u.role}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-zinc-300">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 font-mono text-[11px]">
                            <Phone className="w-3 h-3 text-zinc-500" />
                            <span>{u.phone || 'N/A'}</span>
                          </div>
                          {u.email && (
                            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                              <Mail className="w-3 h-3 text-zinc-600" />
                              <span className="truncate max-w-[140px]">{u.email}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-zinc-400 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-zinc-600" />
                          <span>{u.branch || 'Main Store'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.status === 'Active'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-400' : 'bg-zinc-500'}`}></span>
                          {u.status === 'Active' ? 'សកម្ម' : 'អសកម្ម'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Test Login Button */}
                          <button
                            onClick={() => handleTestLogin(u)}
                            className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[10px] font-bold text-zinc-300 hover:text-white transition cursor-pointer"
                            title="ចូលប្រើគណនីនេះភ្លាមៗ"
                          >
                            ចូលប្រើ
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => openEditModal(u)}
                            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-red-400 transition cursor-pointer"
                            title="កែប្រែ"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          {!isCurrent && (
                            <button
                              onClick={() => handleDelete(u)}
                              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-red-950/50 border border-zinc-800 hover:border-red-800/60 text-zinc-500 hover:text-red-400 transition cursor-pointer"
                              title="លុបគណនី"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {editingUser ? 'កែប្រែគណនីអ្នកប្រើប្រាស់' : 'បង្កើតគណនី Cashier / បុគ្គលិកថ្មី'}
                  </h3>
                  <p className="text-[10px] text-zinc-400">
                    បញ្ចូលព័ត៌មានគណនីសម្រាប់ចូលលក់នៅ POS ឬគ្រប់គ្រងប្រព័ន្ធ
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scroll">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-zinc-300">
                    ឈ្មោះពេញ (Full Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="ឧ. សុខ ចាន់ថន (Sok Chanthon)"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 transition"
                  />
                </div>

                {/* Role */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-zinc-300">
                    តួនាទី (Role) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as UserRole)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 transition cursor-pointer"
                  >
                    <option value="Cashier">🛒 Cashier (អ្នកគិតលុយ - លក់នៅ POS)</option>
                    <option value="Super Admin">👑 Super Admin (គ្រប់គ្រងទូទៅ)</option>
                    <option value="Manager">💼 Manager (អ្នកចាត់ការទូទៅ)</option>
                    <option value="Staff">🔧 Staff / Mechanic (ជាង & បុគ្គលិកស្តុក)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Username */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-zinc-300">
                    ឈ្មោះគណនី Login (Username) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="ឧ. cashier2"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-red-500 transition"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-zinc-300">
                    ពាក្យសម្ងាត់ (Password) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required={!editingUser}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder={editingUser ? 'រក្សាទុកដដែល ឬវាយថ្មី' : 'ឧ. 123456'}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 pr-9 text-xs text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-red-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="absolute right-2.5 top-2 text-zinc-500 hover:text-zinc-300"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-zinc-300">
                    លេខទូរស័ព្ទ (Phone Number)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="ឧ. 012 345 678"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-red-500 transition"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-zinc-300">
                    អ៊ីមែល (Email)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="ឧ. cashier@berrymoto.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Branch */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-zinc-300">
                    សាខាហាង (Branch)
                  </label>
                  <input
                    type="text"
                    value={branch}
                    onChange={e => setBranch(e.target.value)}
                    placeholder="Main Store Phnom Penh"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 transition"
                  />
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-zinc-300">
                    ស្ថានភាព (Status)
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as 'Active' | 'Inactive')}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 transition cursor-pointer"
                  >
                    <option value="Active">Active (សកម្ម - អាច Login បាន)</option>
                    <option value="Inactive">Inactive (អសកម្ម - ផ្អាកបណ្តោះអាសន្ន)</option>
                  </select>
                </div>
              </div>

              {/* Notice */}
              <div className="p-3 bg-red-950/30 border border-red-900/50 rounded-xl text-xs text-red-300 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>
                  បន្ទាប់ពីបង្កើតរួច Cashier អាចប្រើ Username និង Password ខាងលើដើម្បី Login ចូលផ្ទាំងលក់ POS បានភ្លាមៗ!
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold cursor-pointer"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-900/40 cursor-pointer"
                >
                  {editingUser ? 'រក្សាទុកការកែប្រែ' : 'បង្កើតគណនី Cashier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
