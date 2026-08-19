import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Lock,
  User as UserIcon,
  ShieldCheck,
  Database,
  Flame,
  KeyRound,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { UserRole } from '../types';

export const LoginScreen: React.FC = () => {
  const { login, addToast, connectGoogleAccount, isGoogleConnecting, settings } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('Super Admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [time, setTime] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const KHMER_MONTHS = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
    const KHMER_DAYS = ['អាទិត្យ', 'ច័ន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];
    
    const updateDateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
      const dayName = KHMER_DAYS[now.getDay()];
      const day = now.getDate();
      const month = KHMER_MONTHS[now.getMonth()];
      const year = now.getFullYear();
      setDateStr(`ថ្ងៃ${dayName} ទី${day} ${month} ឆ្នាំ${year}`);
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      addToast('សូមបញ្ចូលឈ្មោះគណនី (Username)!', 'warning');
      return;
    }
    if (!password.trim()) {
      addToast('សូមបញ្ចូលពាក្យសម្ងាត់ (Password)!', 'warning');
      return;
    }
    const success = login(username, password, selectedRole);
    if (!success) {
      // Toast is handled in login
    }
  };

  const handleGoogleLogin = async () => {
    const success = await connectGoogleAccount();
    if (success) {
      login('admin', undefined, 'Super Admin');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-between items-center p-4 sm:p-6 text-zinc-100 relative overflow-hidden">
      {/* Background Racing Motifs */}
      <div className="absolute inset-0 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Bar with Live Date and Time */}
      <header className="w-full max-w-5xl flex items-center justify-between py-2 border-b border-zinc-800/80 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-black tracking-wider uppercase text-red-500">
              {settings.storeName || 'BERRY MOTO ACCESSORIES'}
            </span>
            <p className="text-[10px] text-zinc-400 font-medium hidden sm:block">
              ADV • PCX • SCOOPY • PG-1 • CT125
            </p>
          </div>
        </div>

        {/* Live Date & Time Display */}
        <div className="flex items-center gap-2 text-xs font-mono bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-lg shadow-inner">
          <div className="flex items-center gap-1.5 text-zinc-300 font-sans border-r border-zinc-800 pr-2">
            <Calendar className="w-3.5 h-3.5 text-red-500" />
            <span className="hidden md:inline">{dateStr}</span>
            <span className="md:hidden">{new Date().toLocaleDateString('en-GB')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-red-400 font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>{time}</span>
          </div>
        </div>
      </header>

      {/* Center Main Card */}
      <main className="w-full max-w-md my-auto py-6 z-10">
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-md space-y-6">
          {/* Logo and Shop Name */}
          <div className="text-center space-y-2">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt="Store Logo"
                className="w-16 h-16 rounded-2xl object-cover mx-auto border-2 border-red-500/40 shadow-lg shadow-red-900/30"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-zinc-950 text-red-500 border border-red-500/40 mx-auto flex items-center justify-center shadow-lg shadow-red-900/30">
                <Flame className="w-9 h-9" />
              </div>
            )}

            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {settings.storeName || 'BERRY MOTO ACCESSORIES'}
              </h1>
              <p className="text-xs text-red-400 font-medium">
                {settings.storeNameKhmer || 'ប្រព័ន្ធគ្រប់គ្រងការលក់ និងស្តុកគ្រឿងលេងម៉ូតូ'}
              </p>
            </div>
          </div>

          {/* Role Selection Segmented Control */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              ប្រភេទគណនី (Account Type):
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800">
              <button
                type="button"
                id="login-role-admin"
                onClick={() => setSelectedRole('Super Admin')}
                className={`py-2.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                  selectedRole === 'Super Admin'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30 font-black'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin (ម្ចាស់ហាង)</span>
              </button>

              <button
                type="button"
                id="login-role-cashier"
                onClick={() => setSelectedRole('Cashier')}
                className={`py-2.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                  selectedRole === 'Cashier'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30 font-black'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Cashier (អ្នកគិតលុយ)</span>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                ឈ្មោះគណនី (Username)
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  id="login-input-username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
                  placeholder="បញ្ចូលឈ្មោះគណនី (Username)..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                ពាក្យសម្ងាត់ (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  id="login-input-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
                  placeholder="បញ្ចូលពាក្យសម្ងាត់ (Password)..."
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-zinc-500 hover:text-zinc-300 transition cursor-pointer"
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="btn-submit-login"
              type="submit"
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>ចូលប្រើប្រព័ន្ធ (Sign In)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-zinc-800"></div>
            <span className="flex-shrink mx-3 text-[10px] text-zinc-500 uppercase font-semibold">ឬ (Or Cloud)</span>
            <div className="flex-grow border-t border-zinc-800"></div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            id="btn-login-google-sheets"
            onClick={handleGoogleLogin}
            disabled={isGoogleConnecting}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800/80 text-zinc-200 font-bold text-xs border border-zinc-800 shadow-xs transition flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{isGoogleConnecting ? 'Connecting Google Account...' : 'ចូលតាម Google Sheets Database'}</span>
          </button>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="w-full max-w-5xl text-center py-2 border-t border-zinc-800/80 text-[11px] text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-emerald-500" />
          <span>Real-time Google Sheets & Local Cache Synchronization</span>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-400">
          <span>{settings.storeName || 'Berry Moto Accessories'}</span>
          <span>•</span>
          <span>Version 2.5</span>
        </div>
      </footer>
    </div>
  );
};
