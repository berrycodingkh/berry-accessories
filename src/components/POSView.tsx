import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Customer, PaymentMethod, SaleItem, CustomerGroup } from '../types';
import {
  ShoppingCart,
  Search,
  Barcode as BarcodeIcon,
  Plus,
  Minus,
  Trash2,
  DollarSign,
  QrCode,
  Pause,
  Play,
  RotateCcw,
  Printer,
  CheckCircle2,
  X,
  CreditCard,
  Layers,
  Sparkles,
  ArrowRight,
  User,
  Receipt
} from 'lucide-react';

interface CartItem extends SaleItem {
  stockMax: number;
}

interface HeldOrder {
  id: string;
  timestamp: string;
  customerName: string;
  items: CartItem[];
  total: number;
}

export const POSView: React.FC = () => {
  const {
    products,
    categories,
    customers,
    createSale,
    formatUSD,
    formatKHR,
    exchangeRate,
    currentUser,
    setCurrentView,
    setSelectedInvoiceForPrint,
    addToast,
    settings
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [barcodeInput, setBarcodeInput] = useState<string>('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.customerId || '');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderDiscountPercent, setOrderDiscountPercent] = useState<number>(0);
  const [heldOrders, setHeldOrders] = useState<HeldOrder[]>([]);
  const [showHeldModal, setShowHeldModal] = useState<boolean>(false);

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [paidUSD, setPaidUSD] = useState<number>(0);
  const [paidKHR, setPaidKHR] = useState<number>(0);
  const [showKHQR, setShowKHQR] = useState<boolean>(false);

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const barcodeInputRef = useRef<HTMLInputElement | null>(null);

  const selectedCustomer = customers.find(c => c.customerId === selectedCustomerId) || customers[0];

  // Auto apply customer group discount
  useEffect(() => {
    if (selectedCustomer) {
      setOrderDiscountPercent(selectedCustomer.discountRate || 0);
    }
  }, [selectedCustomerId, selectedCustomer]);

  // Keyboard Shortcuts (F1: Search, F2: Barcode, F4: Payment, F8: Hold, ESC: Clear)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'F2') {
        e.preventDefault();
        barcodeInputRef.current?.focus();
      } else if (e.key === 'F4') {
        e.preventDefault();
        if (cart.length > 0) handleOpenPayment();
      } else if (e.key === 'F8') {
        e.preventDefault();
        if (cart.length > 0) handleHoldSale();
      } else if (e.key === 'Escape') {
        if (showPaymentModal) setShowPaymentModal(false);
        else if (showHeldModal) setShowHeldModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, showPaymentModal, showHeldModal]);

  // Barcode Scanner Action
  const handleBarcodeScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const matchedProduct = products.find(
      p => p.barcode.trim().toLowerCase() === barcodeInput.trim().toLowerCase()
    );

    if (matchedProduct) {
      handleAddToCart(matchedProduct);
      setBarcodeInput('');
      addToast(`បានស្កេន: ${matchedProduct.name}`, 'success');
    } else {
      addToast(`រកមិនឃើញ Barcode: ${barcodeInput}`, 'warning');
    }
  };

  // Add Item to Cart
  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      addToast(`ទំនិញ "${product.name}" អស់ពីស្តុកហើយ!`, 'error');
      return;
    }

    setCart(prevCart => {
      const existing = prevCart.find(item => item.productId === product.productId);
      if (existing) {
        if (existing.quantity >= product.stock) {
          addToast(`ទំនិញ "${product.name}" មានក្នុងស្តុកត្រឹម ${product.stock} ប៉ុណ្ណោះ`, 'warning');
          return prevCart;
        }
        const updatedQty = existing.quantity + 1;
        const lineTotal = updatedQty * existing.unitPrice;
        const profit = lineTotal - (existing.costPrice * updatedQty);

        return prevCart.map(item =>
          item.productId === product.productId
            ? { ...item, quantity: updatedQty, total: lineTotal, profit }
            : item
        );
      } else {
        const lineTotal = product.salePrice;
        const profit = lineTotal - product.costPrice;

        const newItem: CartItem = {
          productId: product.productId,
          productName: product.name,
          barcode: product.barcode,
          unit: product.unit || 'pcs',
          quantity: 1,
          costPrice: product.costPrice,
          unitPrice: product.salePrice,
          discount: 0,
          total: lineTotal,
          profit,
          stockMax: product.stock
        };
        return [newItem, ...prevCart];
      }
    });
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > item.stockMax) {
              addToast(`ស្តុកអតិបរមា ${item.stockMax}`, 'warning');
              return item;
            }
            const lineTotal = newQty * item.unitPrice;
            const profit = lineTotal - (item.costPrice * newQty);
            return {
              ...item,
              quantity: newQty,
              total: Math.max(0, lineTotal),
              profit
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const handleClearCart = () => {
    if (cart.length === 0) return;
    setCart([]);
    addToast('បានសម្អាតរទេះទំនិញ (Cart Cleared)', 'info');
  };

  // Hold Sale
  const handleHoldSale = () => {
    if (cart.length === 0) return;
    const newHold: HeldOrder = {
      id: `HOLD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString(),
      customerName: selectedCustomer?.name || 'Walk-in',
      items: [...cart],
      total: grandTotalUSD
    };
    setHeldOrders(prev => [newHold, ...prev]);
    setCart([]);
    addToast(`បានព្យួរការលក់ #${newHold.id} រួចរាល់!`, 'info');
  };

  const handleResumeHold = (held: HeldOrder) => {
    setCart(held.items);
    setHeldOrders(prev => prev.filter(h => h.id !== held.id));
    setShowHeldModal(false);
    addToast(`បានទាញយកការលក់ #${held.id} ត្រឡប់មកវិញ`, 'success');
  };

  // Cart Calculations
  const subtotalUSD = cart.reduce((sum, item) => sum + item.total, 0);
  const discountAmountUSD = (subtotalUSD * orderDiscountPercent) / 100;
  const taxUSD = 0;
  const grandTotalUSD = Math.max(0, subtotalUSD - discountAmountUSD + taxUSD);
  const grandTotalKHR = Math.round(grandTotalUSD * exchangeRate);

  const totalCostUSD = cart.reduce((sum, item) => sum + (item.costPrice * item.quantity), 0);
  const totalProfitUSD = grandTotalUSD - totalCostUSD;

  // Open Payment Modal
  const handleOpenPayment = () => {
    if (cart.length === 0) {
      addToast('សូមជ្រើសរើសទំនិញជាមុនសិន', 'warning');
      return;
    }
    setPaidUSD(grandTotalUSD);
    setPaidKHR(0);
    setPaymentMethod('Cash');
    setShowPaymentModal(true);
  };

  // Calculations for Change in Payment Modal
  const totalPaidInUSD = paidUSD + (paidKHR / exchangeRate);
  const changeUSD = Math.max(0, totalPaidInUSD - grandTotalUSD);
  const changeKHR = Math.round(changeUSD * exchangeRate);

  // Complete Payment & Save Sale
  const handleConfirmPayment = () => {
    const saleData = createSale({
      customerId: selectedCustomer?.customerId || 'CUS-000001',
      customerName: selectedCustomer?.name || 'Walk-in Customer',
      customerGroup: selectedCustomer?.customerGroup || 'General',
      cashierName: currentUser?.fullName || 'Cashier #1',
      items: cart,
      subtotal: subtotalUSD,
      discount: discountAmountUSD,
      tax: taxUSD,
      total: grandTotalUSD,
      totalKHR: grandTotalKHR,
      paidUSD: paidUSD,
      paidKHR: paidKHR,
      changeUSD: changeUSD,
      changeKHR: changeKHR,
      dueAmount: Math.max(0, grandTotalUSD - totalPaidInUSD),
      profit: totalProfitUSD,
      paymentMethod,
      status: 'Completed',
      notes: `POS Sale (${paymentMethod})`
    });

    setCart([]);
    setShowPaymentModal(false);
    setShowKHQR(false);

    // Direct to Invoice View for instant Receipt Print
    setCurrentView('invoices');
  };

  // Filtered Products for Catalog
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.khmerName && p.khmerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.barcode.includes(searchTerm);
    return matchesCat && matchesSearch;
  });

  return (
    <div id="pos-view" className="flex flex-col gap-4">
      {/* Top POS Cashier Header Banner */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 sm:px-4 flex flex-wrap items-center justify-between gap-2 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-black text-xs shrink-0">
            {currentUser?.fullName.slice(0, 2).toUpperCase() || 'CA'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">
                {currentUser?.fullName || 'Cashier'}
              </span>
              <span className="px-2 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                {currentUser?.role || 'Cashier'}
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">
              @{currentUser?.username} • ផ្ទាំងលក់ POS Terminal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentUser?.role !== 'Cashier' && (
            <button
              onClick={() => setCurrentView('users')}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-red-500" />
              <span>+ បង្កើត Cashier</span>
            </button>
          )}
          <button
            onClick={() => setCurrentView('sales')}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Receipt className="w-3.5 h-3.5 text-red-500" />
            <span>ប្រវត្តិលក់</span>
          </button>
        </div>
      </div>

      <div className="h-[calc(100vh-10rem)] min-h-[550px] flex flex-col lg:flex-row gap-5">
        {/* LEFT SIDE: Product Catalog & Fast Search */}
        <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-xl p-5 overflow-hidden shadow-xs">
        {/* Top Controls: Barcode Scanner & Search */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* Barcode Scanner Input */}
          <form onSubmit={handleBarcodeScan} className="relative">
            <BarcodeIcon className="w-4 h-4 text-blue-600 absolute left-3.5 top-3" />
            <input
              ref={barcodeInputRef}
              type="text"
              value={barcodeInput}
              onChange={e => setBarcodeInput(e.target.value)}
              placeholder="ស្កេន Barcode (F2)..."
              className="w-full pl-10 pr-16 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white font-mono transition"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-2.5 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold cursor-pointer transition"
            >
              Scan
            </button>
          </form>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="ស្វែងរកតាមឈ្មោះ (F1)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-3 border-b border-slate-100 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            All Items
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.name
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat.khmerName || cat.name}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-4 content-start">
          {filteredProducts.map(product => {
            const isOut = product.stock <= 0;
            const isLow = product.stock <= product.minStock && product.stock > 0;

            return (
              <button
                key={product.productId}
                disabled={isOut}
                onClick={() => handleAddToCart(product)}
                className={`relative p-3 rounded-xl border text-left flex flex-col justify-between transition group cursor-pointer ${
                  isOut
                    ? 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'
                    : 'bg-white hover:bg-slate-50/60 border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-sm active:scale-98'
                }`}
              >
                {/* Image */}
                <div className="w-full h-24 rounded-lg overflow-hidden bg-slate-100 mb-2 relative">
                  <img
                    src={product.imageUrl || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&auto=format&fit=crop&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {/* Stock Pill */}
                  <span className={`absolute top-1.5 right-1.5 px-2 py-0.5 rounded text-[10px] font-bold font-mono shadow-xs ${
                    isOut
                      ? 'bg-rose-600 text-white'
                      : isLow
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-900/80 text-white backdrop-blur-sm'
                  }`}>
                    {product.stock} {product.unit}
                  </span>
                </div>

                {/* Info */}
                <div>
                  <h4 className="font-bold text-xs text-slate-800 line-clamp-1 group-hover:text-blue-600 transition">
                    {product.name}
                  </h4>
                  {product.khmerName && (
                    <p className="text-[10px] text-slate-500 line-clamp-1">{product.khmerName}</p>
                  )}
                </div>

                {/* Price Display */}
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-slate-900 font-mono">
                      {formatUSD(product.salePrice)}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-mono">
                      {formatKHR(product.salePrice * exchangeRate)}
                    </span>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>

    {/* RIGHT SIDE: Cart, Customer & Payment Drawer */}
      <div className="w-full lg:w-96 flex flex-col bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        {/* Customer Select Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-1 mr-2">
            <User className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCustomerId}
              onChange={e => setSelectedCustomerId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
            >
              {customers.map(c => (
                <option key={c.customerId} value={c.customerId}>
                  {c.name} ({c.customerGroup} {c.discountRate > 0 ? `-${c.discountRate}%` : ''})
                </option>
              ))}
            </select>
          </div>

          {/* Held Orders Badge */}
          {heldOrders.length > 0 && (
            <button
              onClick={() => setShowHeldModal(true)}
              className="px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>{heldOrders.length}</span>
            </button>
          )}
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto py-2 space-y-2 pr-1 divide-y divide-slate-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center p-6">
              <ShoppingCart className="w-12 h-12 text-slate-300 mb-2 stroke-1" />
              <p className="font-bold text-slate-600">រទេះទំនិញទទេ (Cart Empty)</p>
              <p className="text-[11px] text-slate-400 mt-1">សូមចុចលើមុខទំនិញ ឬស្កេន Barcode</p>
            </div>
          ) : (
            cart.map(item => (
              <div
                key={item.productId}
                className="pt-2 flex items-center justify-between gap-2"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-slate-800 truncate">{item.productName}</p>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {formatUSD(item.unitPrice)} × {item.quantity} = <strong className="text-slate-900">{formatUSD(item.total)}</strong>
                  </div>
                </div>

                {/* Qty Counter */}
                <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-md p-0.5">
                  <button
                    onClick={() => handleUpdateQty(item.productId, -1)}
                    className="w-5 h-5 rounded flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-5 text-center text-xs font-bold font-mono text-slate-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleUpdateQty(item.productId, 1)}
                    className="w-5 h-5 rounded flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => handleRemoveFromCart(item.productId)}
                  className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Bottom Totals & Action Controls */}
        <div className="pt-3 border-t border-slate-200 space-y-3 bg-white">
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>តម្លៃសរុប (Subtotal):</span>
              <span className="font-mono text-slate-800 font-bold">{formatUSD(subtotalUSD)}</span>
            </div>

            {orderDiscountPercent > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>បញ្ចុះតម្លៃ ({orderDiscountPercent}%):</span>
                <span className="font-mono font-bold">-{formatUSD(discountAmountUSD)}</span>
              </div>
            )}

            {/* Grand Total Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Total Due</span>
                <span className="text-xs text-blue-600 font-mono block font-bold">
                  {formatKHR(grandTotalKHR)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                  {formatUSD(grandTotalUSD)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions (Hold, Clear, Pay) */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleHoldSale}
              disabled={cart.length === 0}
              className="py-2.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-xs font-bold text-slate-700 border border-slate-200 flex flex-col items-center justify-center gap-1 transition cursor-pointer"
              title="Hold Sale (F8)"
            >
              <Pause className="w-3.5 h-3.5 text-amber-600" />
              <span>ផ្អាក (F8)</span>
            </button>

            <button
              onClick={handleClearCart}
              disabled={cart.length === 0}
              className="py-2.5 px-2 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 text-xs font-bold text-slate-700 border border-slate-200 flex flex-col items-center justify-center gap-1 transition cursor-pointer"
              title="Clear Cart (ESC)"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>សម្អាត</span>
            </button>

            <button
              id="btn-pos-pay"
              onClick={handleOpenPayment}
              disabled={cart.length === 0}
              className="col-span-1 py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-md shadow-emerald-900/20 transition transform active:scale-95 cursor-pointer"
              title="Pay (F4)"
            >
              <DollarSign className="w-4 h-4" />
              <span>គិតលុយ (F4)</span>
            </button>
          </div>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <div id="modal-payment" className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl p-6 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    ទូទាត់ប្រាក់ (Payment & Checkout)
                  </h2>
                  <p className="text-xs text-slate-500">
                    អតិថិជន: {selectedCustomer?.name} • គិតជា USD & KHR
                  </p>
                </div>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-5">
              {/* Left: Payment Method & Fast Cash Notes */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    វិធីសាស្ត្រទូទាត់ (Method)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Cash', 'ABA', 'ACLEDA', 'Wing', 'Credit', 'Other'] as PaymentMethod[]).map(method => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => {
                          setPaymentMethod(method);
                          if (method === 'ABA' || method === 'ACLEDA') setShowKHQR(true);
                          else setShowKHQR(false);
                        }}
                        className={`p-2.5 rounded-lg border text-xs font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                          paymentMethod === method
                            ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {method === 'ABA' ? <QrCode className="w-4 h-4 text-red-500" /> : <DollarSign className="w-4 h-4 text-emerald-600" />}
                        <span>{method}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Cash Buttons */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    ក្រដាសប្រាក់រហ័ស (Quick Cash Notes)
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1, 5, 10, 20, 50, 100].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setPaidUSD(val)}
                        className="py-1.5 px-2 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 rounded-md text-xs font-mono font-bold text-slate-800 cursor-pointer"
                      >
                        ${val}
                      </button>
                    ))}
                    {[5000, 10000, 20000, 50000].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setPaidKHR(val)}
                        className="py-1.5 px-2 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 rounded-md text-[10px] font-mono font-bold text-blue-600 cursor-pointer"
                      >
                        {val.toLocaleString()}៛
                      </button>
                    ))}
                  </div>
                </div>

                {/* KHQR Modal Preview if ABA/ACLEDA selected */}
                {showKHQR && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                    <div className="w-14 h-14 bg-white p-1 rounded border border-red-200 flex items-center justify-center">
                      <QrCode className="w-12 h-12 text-slate-900" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-red-800">KHQR PayWay Active</p>
                      <p className="text-[11px] text-slate-600">ស្កេនតាម ABA Mobile / Bakong</p>
                      <span className="text-xs font-mono font-bold text-slate-900 mt-0.5 block">
                        {formatUSD(grandTotalUSD)} ({formatKHR(grandTotalKHR)})
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Payment Inputs & Change Display */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
                {/* Total Display */}
                <div className="text-center p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                    Total Amount Due
                  </span>
                  <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">
                    {formatUSD(grandTotalUSD)}
                  </div>
                  <div className="text-xs font-mono font-bold text-blue-600">
                    {formatKHR(grandTotalKHR)}
                  </div>
                </div>

                {/* Paid Input in USD */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ប្រាក់ទទួលជាដុល្លារ ($ Paid USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={paidUSD}
                    onChange={e => setPaidUSD(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Paid Input in KHR */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ប្រាក់ទទួលជារៀល (៛ Paid KHR)
                  </label>
                  <input
                    type="number"
                    step="100"
                    min="0"
                    value={paidKHR}
                    onChange={e => setPaidKHR(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-blue-600 font-mono font-bold focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Change Calculator */}
                <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">ប្រាក់អាប់ (Change):</span>
                  <div className="text-right">
                    <span className="text-lg font-black text-emerald-600 font-mono">
                      {formatUSD(changeUSD)}
                    </span>
                    <span className="block text-[11px] font-mono text-slate-500">
                      {formatKHR(changeKHR)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
              >
                បោះបង់ (Cancel)
              </button>

              <button
                id="btn-confirm-payment-print"
                type="button"
                onClick={handleConfirmPayment}
                className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-900/20 flex items-center gap-2 transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>បញ្ចប់ការលក់ & បោះពុម្ពវិក្កយបត្រ (Save & Print)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HELD ORDERS MODAL */}
      {showHeldModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Pause className="w-4 h-4 text-amber-500" />
                បញ្ជីការលក់ដែលបានផ្អាក (Held Orders)
              </h3>
              <button onClick={() => setShowHeldModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-2.5 max-h-80 overflow-y-auto">
              {heldOrders.map(h => (
                <div
                  key={h.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono font-bold text-blue-600 text-xs">{h.id}</span>
                    <p className="text-xs text-slate-800 font-bold mt-0.5">{h.customerName}</p>
                    <p className="text-[10px] text-slate-500">{h.timestamp} • {h.items.length} មុខទំនិញ</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-sm text-slate-900 block">{formatUSD(h.total)}</span>
                    <button
                      onClick={() => handleResumeHold(h)}
                      className="mt-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold cursor-pointer"
                    >
                      Resume
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
