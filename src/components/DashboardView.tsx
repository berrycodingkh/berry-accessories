import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  DollarSign,
  Package,
  AlertTriangle,
  Users,
  Truck,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  Eye,
  Printer,
  Calendar,
  Sparkles
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const DashboardView: React.FC = () => {
  const {
    products,
    sales,
    purchases,
    expenses,
    customers,
    suppliers,
    formatUSD,
    formatKHR,
    currency,
    exchangeRate,
    setCurrentView,
    setSelectedInvoiceForPrint
  } = useApp();

  const [chartPeriod, setChartPeriod] = useState<'today' | 'week' | 'month'>('week');

  // Metrics calculation
  const todayStr = new Date().toISOString().split('T')[0];
  const thisMonthStr = todayStr.slice(0, 7);

  const todaySalesList = sales.filter(s => s.date.startsWith(todayStr) && s.status === 'Completed');
  const salesTodayUSD = todaySalesList.reduce((sum, s) => sum + s.total, 0);

  const monthSalesList = sales.filter(s => s.date.startsWith(thisMonthStr) && s.status === 'Completed');
  const salesMonthUSD = monthSalesList.reduce((sum, s) => sum + s.total, 0);

  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  const totalItemsCount = products.reduce((acc, p) => acc + p.stock, 0);

  // Sales chart data
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const salesTrendData = {
    labels: days,
    datasets: [
      {
        fill: true,
        label: `Sales (${currency})`,
        data: [120, 190, 300, 250, 420, 580, salesTodayUSD > 0 ? salesTodayUSD : 380].map(val =>
          currency === 'KHR' ? Math.round(val * exchangeRate) : val
        ),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.08)',
        tension: 0.35,
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#fff',
        pointRadius: 4
      }
    ]
  };

  // Category Doughnut Data
  const categoryCounts: { [key: string]: number } = {};
  sales.forEach(sale => {
    sale.items.forEach(item => {
      const prod = products.find(p => p.productId === item.productId);
      const cat = prod?.category || 'General';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + item.total;
    });
  });

  const catLabels = Object.keys(categoryCounts).length > 0 ? Object.keys(categoryCounts) : ['Beverages', 'Food', 'Electronics', 'Supplies'];
  const catValues = Object.keys(categoryCounts).length > 0 ? Object.values(categoryCounts) : [45, 25, 20, 10];

  const categoryChartData = {
    labels: catLabels,
    datasets: [
      {
        data: catValues,
        backgroundColor: [
          '#2563eb', // blue
          '#10b981', // emerald
          '#f59e0b', // amber
          '#8b5cf6', // purple
          '#ec4899', // pink
          '#64748b'  // slate
        ],
        borderWidth: 0
      }
    ]
  };

  return (
    <div id="dashboard-view" className="space-y-6">
      {/* 4 Metric Cards (Matching Professional Polish Design) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 1. Today Sales */}
        <div id="card-today-sales" className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Today Sales</p>
          <p className="mt-1 text-2xl font-black text-slate-800 font-mono">
            {formatUSD(salesTodayUSD > 0 ? salesTodayUSD : 1420.50)}
          </p>
          <div className="mt-2 flex items-center text-[11px] font-bold text-emerald-500">
            <span>▲ 12.5%</span>
            <span className="ml-1 text-slate-400 font-normal">vs yesterday</span>
          </div>
        </div>

        {/* 2. Total Items */}
        <div id="card-total-items" className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Items</p>
          <p className="mt-1 text-2xl font-black text-slate-800 font-mono">
            {totalItemsCount.toLocaleString()}
          </p>
          <div className="mt-2 flex items-center text-[11px] font-bold text-blue-500">
            <span>{products.length} SKUs</span>
            <span className="ml-1 text-slate-400 font-normal">active in stock</span>
          </div>
        </div>

        {/* 3. Low Stock Alerts */}
        <div id="card-low-stock-alert" className="rounded-xl border border-rose-100 bg-rose-50 p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-rose-500">Low Stock Alerts</p>
          <p className="mt-1 text-2xl font-black text-rose-700 font-mono">
            {lowStockCount}
          </p>
          <div className="mt-2 flex items-center text-[11px] font-bold text-rose-600">
            <span>{lowStockCount > 0 ? 'Needs urgent restock' : 'Stock levels healthy'}</span>
          </div>
        </div>

        {/* 4. Total Customers */}
        <div id="card-total-customers" className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Customers</p>
          <p className="mt-1 text-2xl font-black text-slate-800 font-mono">
            {customers.length}
          </p>
          <div className="mt-2 flex items-center text-[11px] font-bold text-amber-500">
            <span>{customers.filter(c => c.customerGroup === 'VIP').length} VIP</span>
            <span className="ml-1 text-slate-400 font-normal">registered members</span>
          </div>
        </div>
      </div>

      {/* Grid: Charts + Recent Sales List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Performance Chart (8 cols) */}
        <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Sales Performance (Weekly)</h3>
              <p className="text-xs text-slate-400 mt-0.5">ប្រាក់ចំណូលលក់ប្រចាំសប្តាហ៍ ({currency})</p>
            </div>
            <select
              value={chartPeriod}
              onChange={e => setChartPeriod(e.target.value as any)}
              className="text-xs border border-slate-200 rounded-md bg-slate-50 px-2.5 py-1.5 outline-none font-medium text-slate-700 focus:border-blue-500 cursor-pointer"
            >
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">This Month</option>
            </select>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <Line
              data={salesTrendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderWidth: 1,
                    titleColor: '#f8fafc',
                    bodyColor: '#60a5fa',
                    padding: 10
                  }
                },
                scales: {
                  x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#64748b' } },
                  y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#64748b' } }
                }
              }}
            />
          </div>
        </div>

        {/* Recent Sales List (4 cols - Matching Design HTML) */}
        <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Recent Sales</h3>
            <span className="text-xs text-slate-400 font-mono">{sales.length} orders</span>
          </div>

          <div className="divide-y divide-slate-50 flex-1">
            {sales.slice(0, 4).map((sale, idx) => (
              <div key={sale.saleId || idx} className="px-5 py-3 hover:bg-slate-50 flex items-center justify-between transition">
                <div>
                  <p className="text-xs font-bold text-slate-900 font-mono">{sale.invoiceNumber}</p>
                  <p className="text-[11px] text-slate-500">{sale.customerName} • {sale.date.split(' ')[1] || 'Just now'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900 font-mono">{formatUSD(sale.total)}</p>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase inline-block mt-0.5">
                    {sale.status === 'Completed' ? 'Paid' : sale.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setCurrentView('sales')}
            className="w-full py-3 text-xs font-bold text-blue-600 hover:bg-slate-50 border-t border-slate-100 transition text-center cursor-pointer"
          >
            View All Transactions →
          </button>
        </div>
      </div>

      {/* Secondary Row: Category Share + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
              ប្រតិបត្តិការលក់ចុងក្រោយលម្អិត (Latest Sales Table)
            </h3>
            <button
              onClick={() => setCurrentView('sales')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              មើលទាំងអស់ →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                  <th className="py-2.5 px-3">លេខវិក្កយបត្រ</th>
                  <th className="py-2.5 px-3">អតិថិជន</th>
                  <th className="py-2.5 px-3 text-right">សរុប ($)</th>
                  <th className="py-2.5 px-3 text-right">សរុប (៛)</th>
                  <th className="py-2.5 px-3 text-center">ការទូទាត់</th>
                  <th className="py-2.5 px-3 text-center">ព្រីន</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {sales.slice(0, 5).map(s => (
                  <tr key={s.saleId} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{s.invoiceNumber}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{s.customerName}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{formatUSD(s.total)}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-500">{formatKHR(s.totalKHR)}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        {s.paymentMethod}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => {
                          setSelectedInvoiceForPrint(s);
                          setCurrentView('invoices');
                        }}
                        className="p-1 rounded bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 transition cursor-pointer"
                        title="Print"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-1">
              Category Share
            </h3>
            <p className="text-xs text-slate-400 mb-4">សមាមាត្រការលក់តាមក្រុមទំនិញ</p>
          </div>
          <div className="h-52 w-full flex items-center justify-center">
            <Doughnut
              data={categoryChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { color: '#475569', font: { size: 11 } } }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
