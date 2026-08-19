import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Barcode as BarcodeIcon,
  ArrowUpDown,
  Download,
  Upload,
  Layers,
  CheckCircle,
  AlertTriangle,
  XCircle,
  X,
  Printer,
  Sparkles
} from 'lucide-react';
import * as XLSX from 'xlsx';

export const ProductsView: React.FC = () => {
  const {
    products,
    categories,
    brands,
    units,
    suppliers,
    formatUSD,
    formatKHR,
    exchangeRate,
    addProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
    currentUser,
    setCurrentView,
    addToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStockStatus, setSelectedStockStatus] = useState('ALL');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states for Add / Edit
  const [formData, setFormData] = useState({
    barcode: '',
    name: '',
    khmerName: '',
    category: categories[0]?.name || 'Beverages',
    brand: brands[0]?.name || 'General',
    unit: units[0]?.name || 'Piece',
    costPrice: 0,
    salePrice: 0,
    wholesalePrice: 0,
    vipPrice: 0,
    stock: 0,
    minStock: 5,
    supplier: suppliers[0]?.name || 'General Supplier',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&auto=format&fit=crop&q=80'
  });

  // Stock Adjust Form
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustType, setAdjustType] = useState<'Stock In' | 'Stock Out' | 'Damage' | 'Lost' | 'Expired' | 'Correction'>('Stock In');
  const [adjustReason, setAdjustReason] = useState('');

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.khmerName && p.khmerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.barcode.includes(searchTerm) ||
      p.productId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    
    let matchesStatus = true;
    if (selectedStockStatus === 'LOW') matchesStatus = p.stock <= p.minStock && p.stock > 0;
    if (selectedStockStatus === 'OUT') matchesStatus = p.stock <= 0;
    if (selectedStockStatus === 'IN') matchesStatus = p.stock > p.minStock;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      barcode: Math.floor(100000000000 + Math.random() * 900000000000).toString(),
      name: '',
      khmerName: '',
      category: categories[0]?.name || 'Beverages',
      brand: brands[0]?.name || 'General',
      unit: units[0]?.name || 'Piece',
      costPrice: 0,
      salePrice: 0,
      wholesalePrice: 0,
      vipPrice: 0,
      stock: 0,
      minStock: 5,
      supplier: suppliers[0]?.name || 'General Supplier',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&auto=format&fit=crop&q=80'
    });
    setShowAddModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      barcode: p.barcode,
      name: p.name,
      khmerName: p.khmerName || '',
      category: p.category,
      brand: p.brand,
      unit: p.unit,
      costPrice: p.costPrice,
      salePrice: p.salePrice,
      wholesalePrice: p.wholesalePrice || p.salePrice,
      vipPrice: p.vipPrice || p.salePrice,
      stock: p.stock,
      minStock: p.minStock,
      supplier: p.supplier || 'General Supplier',
      description: p.description || '',
      imageUrl: p.imageUrl || ''
    });
    setShowAddModal(true);
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.barcode.trim()) {
      addToast('សូមបំពេញឈ្មោះផលិតផល និង Barcode', 'warning');
      return;
    }

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        ...formData
      });
      addToast(`បានកែប្រែផលិតផល "${formData.name}" រួចរាល់!`, 'success');
    } else {
      addProduct({
        ...formData
      });
      addToast(`បានបន្ថែមផលិតផលថ្មី "${formData.name}" ជោគជ័យ!`, 'success');
    }
    setShowAddModal(false);
  };

  // Auto generate barcode
  const handleGenerateBarcode = () => {
    const randomBarcode = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    setFormData(prev => ({ ...prev, barcode: randomBarcode }));
  };

  // Save Stock Adjustment
  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingProduct || adjustQty <= 0) {
      addToast('សូមបញ្ចូលចំនួនកែសម្រួលត្រឹមត្រូវ', 'warning');
      return;
    }

    adjustStock(adjustingProduct.productId, adjustQty, adjustType, adjustReason || 'Manual adjustment via Products view');
    setAdjustingProduct(null);
  };

  // Export to Excel
  const handleExportExcel = () => {
    const dataToExport = products.map(p => ({
      'Product ID': p.productId,
      'Barcode': p.barcode,
      'Name (EN)': p.name,
      'Name (KH)': p.khmerName || '',
      'Category': p.category,
      'Brand': p.brand,
      'Unit': p.unit,
      'Cost Price ($)': p.costPrice,
      'Sale Price ($)': p.salePrice,
      'Sale Price (KHR)': p.salePrice * exchangeRate,
      'Stock Qty': p.stock,
      'Min Stock Alert': p.minStock,
      'Supplier': p.supplier || ''
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    XLSX.writeFile(wb, `KhmerPOS_Products_${new Date().toISOString().split('T')[0]}.xlsx`);
    addToast('បានទាញយកតារាង Excel រួចរាល់!', 'success');
  };

  return (
    <div id="products-view" className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            បញ្ជីផលិតផល និងគ្រប់គ្រងស្តុក (Products & Inventory)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            ទំនិញសរុប {products.length} មុខ • ស្តុកជិតអស់ {products.filter(p => p.stock <= p.minStock).length} មុខ
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="btn-export-excel"
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export Excel</span>
          </button>

          <button
            id="btn-add-product"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>បន្ថែមទំនិញថ្មី (Add Product)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            id="input-product-search"
            type="text"
            placeholder="ស្វែងរកតាមឈ្មោះ, Barcode, ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <select
            id="select-category-filter"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
          >
            <option value="ALL">គ្រប់ប្រភេទ (All Categories)</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name} ({c.khmerName})</option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            id="select-stock-filter"
            value={selectedStockStatus}
            onChange={e => setSelectedStockStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
          >
            <option value="ALL">ស្តុកទាំងអស់ (All Stock)</option>
            <option value="IN">មានក្នុងស្តុក (In Stock)</option>
            <option value="LOW">ជិតអស់ពីស្តុក (Low Stock)</option>
            <option value="OUT">អស់ពីស្តុក (Out of Stock)</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">រូបភាព</th>
                <th className="py-3 px-3">ID / Barcode</th>
                <th className="py-3 px-3">ឈ្មោះផលិតផល (Product Name)</th>
                <th className="py-3 px-3">ប្រភេទ / Brand</th>
                <th className="py-3 px-3 text-right">តម្លៃដើម (Cost)</th>
                <th className="py-3 px-3 text-right">តម្លៃលក់ (Price)</th>
                <th className="py-3 px-3 text-center">ស្តុក (Qty)</th>
                <th className="py-3 px-3 text-center">ស្ថានភាព</th>
                <th className="py-3 px-3 text-center">សកម្មភាព (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    មិនមានទិន្នន័យទំនិញត្រូវនឹងការស្វែងរកទេ
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => {
                  const isLow = product.stock <= product.minStock && product.stock > 0;
                  const isOut = product.stock <= 0;

                  return (
                    <tr key={product.productId} className="hover:bg-slate-50/80 transition">
                      <td className="py-2.5 px-3">
                        <img
                          src={product.imageUrl || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100&auto=format&fit=crop&q=80'}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-lg border border-slate-200 bg-slate-100"
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-mono text-blue-600 font-bold">{product.productId}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                          <BarcodeIcon className="w-3 h-3" />
                          {product.barcode}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 max-w-xs">
                        <div className="font-bold text-slate-800">{product.name}</div>
                        {product.khmerName && (
                          <div className="text-[11px] text-slate-400">{product.khmerName}</div>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] text-slate-700 font-semibold">
                          {product.category}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">{product.brand}</div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                        {formatUSD(product.costPrice)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        <div className="font-bold text-slate-900">{formatUSD(product.salePrice)}</div>
                        <div className="text-[10px] text-blue-600 font-semibold">{formatKHR(product.salePrice * exchangeRate)}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold">
                        <span className={`px-2 py-0.5 rounded ${
                          isOut
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : isLow
                            ? 'bg-amber-50 text-amber-600 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {product.stock} {product.unit}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          isOut
                            ? 'bg-rose-100 text-rose-700'
                            : isLow
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Stock Adjust button */}
                          <button
                            onClick={() => {
                              setAdjustingProduct(product);
                              setAdjustQty(0);
                              setAdjustReason('');
                            }}
                            className="p-1.5 rounded bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 transition cursor-pointer"
                            title="កែសម្រួលស្តុក (Stock Adjustment)"
                          >
                            <ArrowUpDown className="w-3.5 h-3.5" />
                          </button>

                          {/* Print Barcode button */}
                          <button
                            onClick={() => setCurrentView('barcode')}
                            className="p-1.5 rounded bg-slate-100 hover:bg-amber-600 hover:text-white text-slate-600 transition cursor-pointer"
                            title="បោះពុម្ព Barcode"
                          >
                            <BarcodeIcon className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit button */}
                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="p-1.5 rounded bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-600 transition cursor-pointer"
                            title="កែប្រែទិន្នន័យ (Edit)"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => setDeleteConfirmId(product.productId)}
                            className="p-1.5 rounded bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-600 transition cursor-pointer"
                            title="លុបទំនិញ (Delete)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* Add / Edit Product Modal */}
      {showAddModal && (
        <div id="modal-product-form" className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                {editingProduct ? 'កែប្រែព័ត៌មានទំនិញ (Edit Product)' : 'បន្ថែមទំនិញថ្មី (Add New Product)'}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Barcode */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Barcode (បាកូដ) *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={formData.barcode}
                      onChange={e => setFormData({ ...formData, barcode: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
                      placeholder="884123456789"
                    />
                    <button
                      type="button"
                      onClick={handleGenerateBarcode}
                      className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                      title="Auto Generate"
                    >
                      Gen
                    </button>
                  </div>
                </div>

                {/* Product Name EN */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    ឈ្មោះផលិតផល (English Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                    placeholder="Coca Cola 330ml Can"
                  />
                </div>

                {/* Product Name Khmer */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    ឈ្មោះផលិតផលជាភាសាខ្មែរ (Khmer Name)
                  </label>
                  <input
                    type="text"
                    value={formData.khmerName}
                    onChange={e => setFormData({ ...formData, khmerName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                    placeholder="កូកាកូឡា កំប៉ុង ៣៣០មល"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    ប្រភេទ (Category)
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name} ({c.khmerName})</option>
                    ))}
                  </select>
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    ម៉ាកយីហោ (Brand)
                  </label>
                  <select
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    {brands.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    ខ្នាត (Unit)
                  </label>
                  <select
                    value={formData.unit}
                    onChange={e => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    {units.map(u => (
                      <option key={u.id} value={u.name}>{u.name} ({u.khmerName})</option>
                    ))}
                  </select>
                </div>

                {/* Cost Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    តម្លៃដើម ($ Cost Price) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.costPrice}
                    onChange={e => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-mono font-bold focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                {/* Sale Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    តម្លៃលក់រាយ ($ Retail Price) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.salePrice}
                    onChange={e => setFormData({ ...formData, salePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-mono font-bold focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                  <span className="text-[10px] text-blue-600 font-mono font-bold">
                    = {formatKHR(formData.salePrice * exchangeRate)}
                  </span>
                </div>

                {/* Stock Initial */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    បរិមាណស្តុក (Stock Qty) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-mono font-bold focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                {/* Min Stock */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    ស្តុកអប្បបរមា (Minimum Stock Alert)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.minStock}
                    onChange={e => setFormData({ ...formData, minStock: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                {/* Supplier */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    អ្នកផ្គត់ផ្គង់ (Supplier)
                  </label>
                  <select
                    value={formData.supplier}
                    onChange={e => setFormData({ ...formData, supplier: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    {suppliers.map(s => (
                      <option key={s.supplierId} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Link រូបភាពទំនិញ (Image URL)
                  </label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  បោះបង់ (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  រក្សាទុក (Save Product)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {adjustingProduct && (
        <div id="modal-stock-adjustment" className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <ArrowUpDown className="w-5 h-5 text-blue-600" />
                កែសម្រួលស្តុក (Stock Adjustment)
              </h3>
              <button onClick={() => setAdjustingProduct(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="mt-4 space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <p className="font-bold text-slate-800">{adjustingProduct.name}</p>
                <p className="text-slate-500 mt-0.5">ស្តុកបច្ចុប្បន្ន: <strong className="text-blue-600">{adjustingProduct.stock} {adjustingProduct.unit}</strong></p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  ប្រភេទនៃការកែសម្រួល (Adjustment Type)
                </label>
                <select
                  value={adjustType}
                  onChange={e => setAdjustType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                >
                  <option value="Stock In">នាំចូលបន្ថែម (Stock In)</option>
                  <option value="Stock Out">ដកចេញពីស្តុក (Stock Out)</option>
                  <option value="Damage">ខូចខាត (Damage)</option>
                  <option value="Lost">បាត់បង់ (Lost)</option>
                  <option value="Expired">ផុតកំណត់ (Expired)</option>
                  <option value="Correction">កែតម្រូវទូទៅ (Correction)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  ចំនួនកែសម្រួល (Quantity)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustQty}
                  onChange={e => setAdjustQty(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-mono font-bold focus:outline-none focus:border-blue-500 focus:bg-white"
                  placeholder="10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  មូលហេតុ (Reason / Note)
                </label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={e => setAdjustReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  placeholder="ឧទាហរណ៍: រាប់ស្តុកប្រចាំខែ..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAdjustingProduct(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
                >
                  កែប្រែស្តុក
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div id="modal-delete-confirm" className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">តើអ្នកពិតជាចង់លុបទំនិញនេះមែនទេ?</h3>
              <p className="text-xs text-slate-500 mt-1">
                ទំនិញ ID ({deleteConfirmId}) នឹងត្រូវលុបចេញពីប្រព័ន្ធ និង Google Sheets។
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
              >
                បោះបង់
              </button>
              <button
                onClick={() => {
                  deleteProduct(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
              >
                យល់ព្រមលុប
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
