import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { compressImageFile } from '../utils/imageUtils';
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
  Sparkles,
  Flame,
  Image as ImageIcon,
  Check,
  Tag,
  Bookmark
} from 'lucide-react';
import * as XLSX from 'xlsx';

const MOTORCYCLE_MODELS = [
  'ALL',
  'ADV 160 / 350',
  'PCX 160 / 150',
  'SCOOPY / LEAD',
  'YAMAHA PG-1',
  'HONDA CT125',
  'CLICK / VARIO',
  'UNIVERSAL (ទូទៅ)'
];

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
  const [selectedModel, setSelectedModel] = useState('ALL');
  const [selectedStockStatus, setSelectedStockStatus] = useState('ALL');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Form states for Add / Edit
  const [formData, setFormData] = useState({
    barcode: '',
    name: '',
    khmerName: '',
    motorcycleModel: 'ADV 160 / 350',
    category: categories[0]?.name || 'Suspension & Shocks',
    brand: brands[0]?.name || 'Profender',
    unit: units[0]?.name || 'Set',
    costPrice: 0,
    salePrice: 0,
    wholesalePrice: 0,
    vipPrice: 0,
    stock: 0,
    minStock: 3,
    supplier: suppliers[0]?.name || 'Profender Cambodia Dealer',
    description: '',
    imageUrl: ''
  });

  // Stock Adjust Form
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustType, setAdjustType] = useState<'Stock In' | 'Stock Out' | 'Damage' | 'Lost' | 'Expired' | 'Correction'>('Stock In');
  const [adjustReason, setAdjustReason] = useState('');

  // Handle computer file upload for product image
  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('សូមជ្រើសរើស File រូបភាព (JPG, PNG, WebP)', 'warning');
      return;
    }

    try {
      setIsUploadingImage(true);
      const base64 = await compressImageFile(file, 600, 600, 0.85);
      setFormData(prev => ({ ...prev, imageUrl: base64 }));
      addToast('បាន Upload រូបភាពផលិតផលជោគជ័យ!', 'success');
    } catch (err) {
      console.error('Image upload failed:', err);
      addToast('មិនអាច Upload រូបភាពបានទេ', 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.khmerName && p.khmerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.barcode.includes(searchTerm) ||
      p.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.motorcycleModel && p.motorcycleModel.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesModel = selectedModel === 'ALL' || p.motorcycleModel === selectedModel || (selectedModel === 'UNIVERSAL (ទូទៅ)' && (!p.motorcycleModel || p.motorcycleModel === 'UNIVERSAL (ទូទៅ)'));
    
    let matchesStatus = true;
    if (selectedStockStatus === 'LOW') matchesStatus = p.stock <= p.minStock && p.stock > 0;
    if (selectedStockStatus === 'OUT') matchesStatus = p.stock <= 0;
    if (selectedStockStatus === 'IN') matchesStatus = p.stock > p.minStock;

    return matchesSearch && matchesCategory && matchesModel && matchesStatus;
  });

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      barcode: Math.floor(100000000000 + Math.random() * 900000000000).toString(),
      name: '',
      khmerName: '',
      motorcycleModel: 'ADV 160 / 350',
      category: categories[0]?.name || 'Suspension & Shocks',
      brand: brands[0]?.name || 'Profender',
      unit: units[0]?.name || 'Set',
      costPrice: 0,
      salePrice: 0,
      wholesalePrice: 0,
      vipPrice: 0,
      stock: 0,
      minStock: 3,
      supplier: suppliers[0]?.name || 'Profender Cambodia Dealer',
      description: '',
      imageUrl: ''
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
      motorcycleModel: p.motorcycleModel || 'ADV 160 / 350',
      category: p.category,
      brand: p.brand,
      unit: p.unit,
      costPrice: p.costPrice,
      salePrice: p.salePrice,
      wholesalePrice: p.wholesalePrice || p.salePrice,
      vipPrice: p.vipPrice || p.salePrice,
      stock: p.stock,
      minStock: p.minStock,
      supplier: p.supplier || 'Profender Cambodia Dealer',
      description: p.description || '',
      imageUrl: p.imageUrl || ''
    });
    setShowAddModal(true);
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.barcode.trim()) {
      addToast('សូមបំពេញឈ្មោះគ្រឿងម៉ូតូ និង Barcode', 'warning');
      return;
    }

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        ...formData
      });
      addToast(`បានកែប្រែគ្រឿងម៉ូតូ "${formData.name}" រួចរាល់!`, 'success');
    } else {
      addProduct({
        ...formData
      });
      addToast(`បានបន្ថែមគ្រឿងម៉ូតូថ្មី "${formData.name}" ជោគជ័យ!`, 'success');
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
      'Model': p.motorcycleModel || 'Universal',
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
    XLSX.utils.book_append_sheet(wb, ws, 'Moto_Products');
    XLSX.writeFile(wb, `BerryMoto_Inventory_${new Date().toISOString().split('T')[0]}.xlsx`);
    addToast('បានទាញយកតារាង Excel រួចរាល់!', 'success');
  };

  return (
    <div id="products-view" className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-zinc-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-red-600" />
            បញ្ជីគ្រឿងលេងម៉ូតូ & ស្តុក (Moto Parts & Inventory)
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-medium">
            ទំនិញសរុប {products.length} មុខ • ស្តុកជិតអស់ {products.filter(p => p.stock <= p.minStock).length} មុខ • គាំទ្រ ADV, PCX, SCOOPY, PG-1, CT125
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="btn-nav-categories-brands"
            onClick={() => setCurrentView('categories')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-red-400 hover:text-red-300 transition cursor-pointer"
          >
            <Tag className="w-4 h-4 text-red-500" />
            <span>គ្រប់គ្រង Categories & Brands</span>
          </button>

          <button
            id="btn-export-excel"
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-xs font-bold text-zinc-700 transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export Excel</span>
          </button>

          <button
            id="btn-add-product"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md shadow-red-600/20 transition transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ បន្ថែមគ្រឿងម៉ូតូថ្មី (Add Part)</span>
          </button>
        </div>
      </div>

      {/* Motorcycle Models Quick Filter Pills */}
      <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center gap-2 overflow-x-auto custom-scroll">
        <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 shrink-0 px-2 flex items-center gap-1">
          <Flame className="w-3 h-3 text-red-500" /> ម៉ូដែលម៉ូតូ:
        </span>
        {MOTORCYCLE_MODELS.map(model => (
          <button
            key={model}
            onClick={() => setSelectedModel(model)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedModel === model
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            {model}
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            id="input-product-search"
            type="text"
            placeholder="ស្វែងរកតាមឈ្មោះ, ម៉ូដែល ADV/PCX, Barcode..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-red-500 focus:bg-white transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <select
            id="select-category-filter"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-700 focus:outline-none focus:border-red-500 font-medium cursor-pointer"
          >
            <option value="ALL">គ្រប់ផ្នែកគ្រឿង (All Categories)</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name} ({c.khmerName})</option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            id="select-stock-filter"
            value={selectedStockStatus}
            onChange={e => setSelectedStockStatus(e.target.value)}
            className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-700 focus:outline-none focus:border-red-500 font-medium cursor-pointer"
          >
            <option value="ALL">ស្តុកទាំងអស់ (All Stock)</option>
            <option value="IN">មានក្នុងស្តុក (In Stock)</option>
            <option value="LOW">ជិតអស់ពីស្តុក (Low Stock)</option>
            <option value="OUT">អស់ពីស្តុក (Out of Stock)</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-xl bg-white border border-zinc-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-900 text-zinc-300 border-b border-zinc-800 font-black uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">រូបភាព</th>
                <th className="py-3 px-3">ម៉ូដែលម៉ូតូ</th>
                <th className="py-3 px-3">ឈ្មោះគ្រឿងបន្លាស់ (Part Name)</th>
                <th className="py-3 px-3">ផ្នែក / Brand</th>
                <th className="py-3 px-3 text-right">តម្លៃដើម (Cost)</th>
                <th className="py-3 px-3 text-right">តម្លៃលក់ (Price)</th>
                <th className="py-3 px-3 text-center">ស្តុក (Qty)</th>
                <th className="py-3 px-3 text-center">ស្ថានភាព</th>
                <th className="py-3 px-3 text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-zinc-400">
                    <Package className="w-10 h-10 mx-auto mb-2 opacity-40 text-zinc-500" />
                    <p className="font-bold">រកមិនឃើញគ្រឿងម៉ូតូទេ</p>
                    <p className="text-[11px] text-zinc-400 mt-1">សូមសាកល្បងស្វែងរក ឬបន្ថែមគ្រឿងបន្លាស់ថ្មី</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => (
                  <tr key={p.productId} className="hover:bg-red-50/30 transition">
                    {/* Image */}
                    <td className="py-2.5 px-3">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover border border-zinc-200 bg-zinc-50 shadow-xs"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400">
                          <ImageIcon className="w-5 h-5 text-zinc-300" />
                        </div>
                      )}
                    </td>

                    {/* Motorcycle Model */}
                    <td className="py-2.5 px-3">
                      <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-zinc-900 text-red-400 border border-zinc-800">
                        {p.motorcycleModel || 'Universal'}
                      </span>
                    </td>

                    {/* Product Name */}
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-zinc-900">{p.name}</div>
                      {p.khmerName && <div className="text-[11px] text-zinc-500">{p.khmerName}</div>}
                      <div className="text-[10px] font-mono text-zinc-400 mt-0.5">{p.barcode}</div>
                    </td>

                    {/* Category & Brand */}
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-zinc-700">{p.category}</div>
                      <span className="inline-block text-[10px] px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600 font-bold">
                        {p.brand}
                      </span>
                    </td>

                    {/* Cost Price */}
                    <td className="py-2.5 px-3 text-right font-mono font-medium text-zinc-500">
                      {currentUser?.role !== 'Cashier' ? formatUSD(p.costPrice) : '***'}
                    </td>

                    {/* Sale Price */}
                    <td className="py-2.5 px-3 text-right">
                      <div className="font-bold text-zinc-900 font-mono text-sm">{formatUSD(p.salePrice)}</div>
                      <div className="text-[10px] text-red-600 font-mono font-bold">{formatKHR(p.salePrice * exchangeRate)}</div>
                    </td>

                    {/* Stock Qty */}
                    <td className="py-2.5 px-3 text-center">
                      <span className="font-bold font-mono text-sm text-zinc-800">{p.stock}</span>
                      <span className="text-[10px] text-zinc-400 block">{p.unit}</span>
                    </td>

                    {/* Stock Status Badge */}
                    <td className="py-2.5 px-3 text-center">
                      {p.stock <= 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                          <XCircle className="w-3 h-3" /> អស់ស្តុក
                        </span>
                      ) : p.stock <= p.minStock ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <AlertTriangle className="w-3 h-3" /> ជិតអស់ ({p.stock})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle className="w-3 h-3" /> មានក្នុងស្តុក
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setAdjustingProduct(p)}
                          className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition cursor-pointer"
                          title="កែសម្រួលស្តុក (Adjust Stock)"
                        >
                          <ArrowUpDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                          title="កែប្រែទិន្នន័យ (Edit)"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {currentUser?.role !== 'Cashier' && (
                          <button
                            onClick={() => setDeleteConfirmId(p.productId)}
                            className="p-1.5 rounded-lg bg-zinc-100 hover:bg-red-600 hover:text-white text-zinc-400 transition cursor-pointer"
                            title="លុបចោល (Delete)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal with Computer Image Upload */}
      {showAddModal && (
        <div id="modal-product-form" className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 custom-scroll">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <h3 className="text-base font-black text-zinc-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-red-600" />
                {editingProduct ? 'កែប្រែព័ត៌មានគ្រឿងម៉ូតូ (Edit Moto Part)' : 'បន្ថែមគ្រឿងម៉ូតូថ្មី (Add Moto Part)'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-4 space-y-4">
              {/* Product Image Upload from Computer */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3">
                <label className="block text-xs font-black text-zinc-800 uppercase tracking-wider">
                  រូបភាពទំនិញ (Product Image Upload)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Image Preview */}
                  <div className="w-24 h-24 rounded-xl bg-white border border-zinc-300 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                    {formData.imageUrl ? (
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-zinc-300" />
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 w-full space-y-2">
                    <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold cursor-pointer transition">
                      <Upload className="w-4 h-4" />
                      <span>{isUploadingImage ? 'កំពុងដំណើរការ...' : 'Upload រូបភាពពីកុំព្យូទ័រ (Choose from PC)'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProductImageUpload}
                        className="hidden"
                      />
                    </label>
                    {formData.imageUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                        className="text-[11px] text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> លុបរូបភាពនេះ
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Motorcycle Model */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    ម៉ូដែលម៉ូតូ (Motorcycle Model) *
                  </label>
                  <select
                    value={formData.motorcycleModel}
                    onChange={e => setFormData({ ...formData, motorcycleModel: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 font-bold focus:outline-none focus:border-red-500 focus:bg-white"
                  >
                    <option value="ADV 160 / 350">HONDA ADV 160 / 350</option>
                    <option value="PCX 160 / 150">HONDA PCX 160 / 150</option>
                    <option value="SCOOPY / LEAD">HONDA SCOOPY / LEAD</option>
                    <option value="YAMAHA PG-1">YAMAHA PG-1</option>
                    <option value="HONDA CT125">HONDA CT125 Hunter Cub</option>
                    <option value="CLICK / VARIO">HONDA CLICK / VARIO</option>
                    <option value="UNIVERSAL (ទូទៅ)">UNIVERSAL (ប្រើបានគ្រប់ម៉ូតូ)</option>
                  </select>
                </div>

                {/* Barcode */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    លេខកូដបារកូដ (Barcode / SKU) *
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      required
                      value={formData.barcode}
                      onChange={e => setFormData({ ...formData, barcode: e.target.value })}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 font-mono focus:outline-none focus:border-red-500 focus:bg-white"
                      placeholder="884123456789"
                    />
                    <button
                      type="button"
                      onClick={handleGenerateBarcode}
                      className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-white cursor-pointer"
                      title="Auto Generate"
                    >
                      Gen
                    </button>
                  </div>
                </div>

                {/* Product Name EN */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    ឈ្មោះគ្រឿងម៉ូតូ (English Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:border-red-500 focus:bg-white"
                    placeholder="Profender X-Series Rear Shock"
                  />
                </div>

                {/* Product Name Khmer */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    ឈ្មោះជាភាសាខ្មែរ (Khmer Name)
                  </label>
                  <input
                    type="text"
                    value={formData.khmerName}
                    onChange={e => setFormData({ ...formData, khmerName: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:border-red-500 focus:bg-white"
                    placeholder="បូមក្រោយ Profender X-Series កម្ពស់ 365mm"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    ផ្នែកគ្រឿង (Category)
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:border-red-500 font-medium"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name} ({c.khmerName})</option>
                    ))}
                  </select>
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    ម៉ាកយីហោ (Brand)
                  </label>
                  <select
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:border-red-500 font-medium"
                  >
                    {brands.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    ខ្នាត (Unit)
                  </label>
                  <select
                    value={formData.unit}
                    onChange={e => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:border-red-500 font-medium"
                  >
                    {units.map(u => (
                      <option key={u.id} value={u.name}>{u.name} ({u.khmerName})</option>
                    ))}
                  </select>
                </div>

                {/* Cost Price */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    តម្លៃដើម ($ Cost Price) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.costPrice}
                    onChange={e => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 font-mono font-bold focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                </div>

                {/* Sale Price */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    តម្លៃលក់រាយ ($ Retail Price) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.salePrice}
                    onChange={e => setFormData({ ...formData, salePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 font-mono font-bold focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                  <span className="text-[10px] text-red-600 font-mono font-bold">
                    = {formatKHR(formData.salePrice * exchangeRate)}
                  </span>
                </div>

                {/* Wholesale Price */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    តម្លៃបោះដុំ ($ Wholesale Price)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.wholesalePrice}
                    onChange={e => setFormData({ ...formData, wholesalePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 font-mono font-bold focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                </div>

                {/* Stock Initial */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    បរិមាណស្តុក (Stock Qty) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 font-mono font-bold focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                </div>

                {/* Min Stock */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    ស្តុកប្រកាសអាសន្ន (Min Stock Alert)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.minStock}
                    onChange={e => setFormData({ ...formData, minStock: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 font-mono focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                </div>

                {/* Supplier */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    អ្នកផ្គត់ផ្គង់ (Supplier)
                  </label>
                  <select
                    value={formData.supplier}
                    onChange={e => setFormData({ ...formData, supplier: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:border-red-500 font-medium"
                  >
                    {suppliers.map(s => (
                      <option key={s.supplierId} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-zinc-700 cursor-pointer"
                >
                  បោះបង់ (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md shadow-red-600/20 cursor-pointer"
                >
                  រក្សាទុកគ្រឿងម៉ូតូ (Save Moto Part)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {adjustingProduct && (
        <div id="modal-stock-adjustment" className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="text-base font-bold text-zinc-800 flex items-center gap-2">
                <ArrowUpDown className="w-5 h-5 text-red-600" />
                កែសម្រួលស្តុក (Stock Adjustment)
              </h3>
              <button onClick={() => setAdjustingProduct(null)} className="text-zinc-400 hover:text-zinc-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="mt-4 space-y-3">
              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 text-xs">
                <p className="font-bold text-zinc-800">{adjustingProduct.name}</p>
                <p className="text-zinc-500 mt-0.5">ស្តុកបច្ចុប្បន្ន: <strong className="text-red-600">{adjustingProduct.stock} {adjustingProduct.unit}</strong></p>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 mb-1">
                  ប្រភេទនៃការកែសម្រួល (Adjustment Type)
                </label>
                <select
                  value={adjustType}
                  onChange={e => setAdjustType(e.target.value as any)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:border-red-500 font-medium"
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
                <label className="block text-xs font-bold text-zinc-600 mb-1">
                  ចំនួនកែសម្រួល (Quantity)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustQty}
                  onChange={e => setAdjustQty(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 font-mono font-bold focus:outline-none focus:border-red-500 focus:bg-white"
                  placeholder="10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 mb-1">
                  មូលហេតុ (Reason / Note)
                </label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={e => setAdjustReason(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:border-red-500 focus:bg-white"
                  placeholder="ឧទាហរណ៍: រាប់ស្តុកប្រចាំខែ..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setAdjustingProduct(null)}
                  className="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-zinc-700 cursor-pointer"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
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
        <div id="modal-delete-confirm" className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-800">តើអ្នកពិតជាចង់លុបគ្រឿងម៉ូតូនេះមែនទេ?</h3>
              <p className="text-xs text-zinc-500 mt-1">
                ទំនិញ ID ({deleteConfirmId}) នឹងត្រូវលុបចេញពីប្រព័ន្ធ និង Google Sheets។
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-zinc-700 cursor-pointer"
              >
                បោះបង់
              </button>
              <button
                onClick={() => {
                  deleteProduct(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
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
