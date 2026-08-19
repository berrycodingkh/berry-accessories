import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Category, Brand, Unit } from '../types';
import {
  Tag,
  Bookmark,
  Scale,
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  Bike,
  Layers,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Sliders,
  Disc,
  Shield,
  Flame,
  Circle,
  Smartphone,
  Zap,
  Droplets,
  Wrench,
  Settings,
  Upload,
  Globe,
  DollarSign,
  Boxes,
  ArrowRight,
  Info,
  Check
} from 'lucide-react';
import { compressImageFile } from '../utils/imageUtils';

interface CategoriesBrandsViewProps {
  initialTab?: 'categories' | 'brands' | 'units' | 'models';
}

export const CategoriesBrandsView: React.FC<CategoriesBrandsViewProps> = ({ initialTab = 'categories' }) => {
  const {
    categories,
    brands,
    units,
    products,
    createCategory,
    updateCategory,
    deleteCategory,
    createBrand,
    updateBrand,
    deleteBrand,
    createUnit,
    updateUnit,
    deleteUnit,
    setCurrentView,
    formatUSD,
    formatKHR
  } = useApp();

  const [activeTab, setActiveTab] = useState<'categories' | 'brands' | 'units' | 'models'>(initialTab);
  const [searchTerm, setSearchTerm] = useState('');

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');
  const [catKhmerName, setCatKhmerName] = useState('');
  const [catIcon, setCatIcon] = useState('Tag');

  // Brand Modal State
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [brandName, setBrandName] = useState('');
  const [brandDescription, setBrandDescription] = useState('');
  const [brandCountry, setBrandCountry] = useState('Thailand');
  const [brandLogo, setBrandLogo] = useState('');

  // Unit Modal State
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [unitName, setUnitName] = useState('');
  const [unitKhmerName, setUnitKhmerName] = useState('');
  const [unitShortCode, setUnitShortCode] = useState('');

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'category' | 'brand' | 'unit';
    id: string;
    name: string;
    productCount: number;
  } | null>(null);

  // Icon options for categories
  const iconOptions = [
    { name: 'Sliders', label: 'បូម & ជើងក្រោម', icon: Sliders },
    { name: 'Disc', label: 'ហ្វ្រាំង & ឌីស', icon: Disc },
    { name: 'Shield', label: 'កាងការពារ', icon: Shield },
    { name: 'Flame', label: 'ស៊ីមាំង & ផ្សែង', icon: Flame },
    { name: 'Circle', label: 'កង់ & យ៉ាន់', icon: Circle },
    { name: 'Smartphone', label: 'ជើងទូរស័ព្ទ', icon: Smartphone },
    { name: 'Zap', label: 'ភ្លើង & LED', icon: Zap },
    { name: 'Sparkles', label: 'CNC & Carbon', icon: Sparkles },
    { name: 'Droplets', label: 'ប្រេង & ទឹកស្អំ', icon: Droplets },
    { name: 'Wrench', label: 'គ្រឿងបន្លាស់', icon: Wrench },
    { name: 'Package', label: 'កញ្ចប់រួម', icon: Package },
    { name: 'Tag', label: 'ទូទៅ', icon: Tag },
  ];

  const getCategoryIconComponent = (iconName?: string) => {
    switch (iconName) {
      case 'Sliders': return <Sliders className="w-5 h-5 text-red-400" />;
      case 'Disc': return <Disc className="w-5 h-5 text-rose-400" />;
      case 'Shield': return <Shield className="w-5 h-5 text-amber-400" />;
      case 'Flame': return <Flame className="w-5 h-5 text-orange-400" />;
      case 'Circle': return <Circle className="w-5 h-5 text-cyan-400" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-emerald-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'Droplets': return <Droplets className="w-5 h-5 text-blue-400" />;
      case 'Wrench': return <Wrench className="w-5 h-5 text-zinc-400" />;
      case 'Package': return <Package className="w-5 h-5 text-indigo-400" />;
      default: return <Tag className="w-5 h-5 text-red-500" />;
    }
  };

  // Products count & value calculations per Category
  const categoryStats = useMemo(() => {
    const stats: Record<string, { count: number; totalValue: number; models: Set<string> }> = {};
    categories.forEach(cat => {
      stats[cat.name] = { count: 0, totalValue: 0, models: new Set() };
      if (cat.khmerName) {
        stats[cat.khmerName] = stats[cat.name];
      }
    });

    products.forEach(p => {
      if (stats[p.category]) {
        stats[p.category].count += 1;
        stats[p.category].totalValue += (p.stock * p.costPrice);
        if (p.motorcycleModel) stats[p.category].models.add(p.motorcycleModel);
      }
    });

    return stats;
  }, [categories, products]);

  // Products count per Brand
  const brandStats = useMemo(() => {
    const stats: Record<string, { count: number; totalStock: number; totalValue: number }> = {};
    brands.forEach(b => {
      stats[b.name] = { count: 0, totalStock: 0, totalValue: 0 };
    });

    products.forEach(p => {
      if (stats[p.brand]) {
        stats[p.brand].count += 1;
        stats[p.brand].totalStock += p.stock;
        stats[p.brand].totalValue += (p.stock * p.costPrice);
      }
    });

    return stats;
  }, [brands, products]);

  // Products count per Unit
  const unitStats = useMemo(() => {
    const stats: Record<string, number> = {};
    units.forEach(u => {
      stats[u.name] = 0;
      stats[u.shortCode] = 0;
    });

    products.forEach(p => {
      if (stats[p.unit] !== undefined) {
        stats[p.unit] += 1;
      }
    });

    return stats;
  }, [units, products]);

  // Motorcycle model aggregation
  const motorcycleModelsList = useMemo(() => {
    const modelsMap: Record<string, { count: number; stock: number; brands: Set<string> }> = {
      'ADV 160': { count: 0, stock: 0, brands: new Set() },
      'ADV 350': { count: 0, stock: 0, brands: new Set() },
      'PCX 160': { count: 0, stock: 0, brands: new Set() },
      'SCOOPY': { count: 0, stock: 0, brands: new Set() },
      'PG-1': { count: 0, stock: 0, brands: new Set() },
      'CT125': { count: 0, stock: 0, brands: new Set() },
      'CLICK 160': { count: 0, stock: 0, brands: new Set() },
      'GIORNO+': { count: 0, stock: 0, brands: new Set() },
      'WAVE 110/125': { count: 0, stock: 0, brands: new Set() },
      'MONKEY 125': { count: 0, stock: 0, brands: new Set() },
      'DAX 125': { count: 0, stock: 0, brands: new Set() },
      'FORZA 350': { count: 0, stock: 0, brands: new Set() },
      'XMAX 300': { count: 0, stock: 0, brands: new Set() },
      'ALL': { count: 0, stock: 0, brands: new Set() }
    };

    products.forEach(p => {
      const m = (p.motorcycleModel || 'ALL').toUpperCase();
      if (!modelsMap[m]) {
        modelsMap[m] = { count: 0, stock: 0, brands: new Set() };
      }
      modelsMap[m].count += 1;
      modelsMap[m].stock += p.stock;
      if (p.brand) modelsMap[m].brands.add(p.brand);
    });

    return Object.entries(modelsMap).map(([name, data]) => ({
      name,
      count: data.count,
      stock: data.stock,
      brandsCount: data.brands.size
    }));
  }, [products]);

  // Filtered lists based on search
  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.khmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBrands = brands.filter(b =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.description && b.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    b.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUnits = units.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.khmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.shortCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Category Modal Handlers
  const handleOpenCategoryModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setCatName(cat.name);
      setCatKhmerName(cat.khmerName || '');
      setCatIcon(cat.icon || 'Tag');
    } else {
      setEditingCategory(null);
      setCatName('');
      setCatKhmerName('');
      setCatIcon('Tag');
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    if (editingCategory) {
      updateCategory({
        ...editingCategory,
        name: catName.trim(),
        khmerName: catKhmerName.trim() || catName.trim(),
        icon: catIcon
      });
    } else {
      createCategory({
        name: catName.trim(),
        khmerName: catKhmerName.trim() || catName.trim(),
        icon: catIcon
      });
    }
    setIsCategoryModalOpen(false);
  };

  // Brand Modal Handlers
  const handleOpenBrandModal = (brand?: Brand) => {
    if (brand) {
      setEditingBrand(brand);
      setBrandName(brand.name);
      setBrandDescription(brand.description || '');
      setBrandCountry('Thailand');
      setBrandLogo('');
    } else {
      setEditingBrand(null);
      setBrandName('');
      setBrandDescription('');
      setBrandCountry('Thailand');
      setBrandLogo('');
    }
    setIsBrandModalOpen(true);
  };

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) return;

    if (editingBrand) {
      updateBrand({
        ...editingBrand,
        name: brandName.trim(),
        description: brandDescription.trim()
      });
    } else {
      createBrand({
        name: brandName.trim(),
        description: brandDescription.trim()
      });
    }
    setIsBrandModalOpen(false);
  };

  // Unit Modal Handlers
  const handleOpenUnitModal = (unit?: Unit) => {
    if (unit) {
      setEditingUnit(unit);
      setUnitName(unit.name);
      setUnitKhmerName(unit.khmerName || '');
      setUnitShortCode(unit.shortCode || unit.name);
    } else {
      setEditingUnit(null);
      setUnitName('');
      setUnitKhmerName('');
      setUnitShortCode('');
    }
    setIsUnitModalOpen(true);
  };

  const handleSaveUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitName.trim()) return;

    if (editingUnit) {
      updateUnit({
        ...editingUnit,
        name: unitName.trim(),
        khmerName: unitKhmerName.trim() || unitName.trim(),
        shortCode: unitShortCode.trim() || unitName.trim()
      });
    } else {
      createUnit({
        name: unitName.trim(),
        khmerName: unitKhmerName.trim() || unitName.trim(),
        shortCode: unitShortCode.trim() || unitName.trim()
      });
    }
    setIsUnitModalOpen(false);
  };

  // Delete Action
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'category') {
      deleteCategory(deleteTarget.id);
    } else if (deleteTarget.type === 'brand') {
      deleteBrand(deleteTarget.id);
    } else if (deleteTarget.type === 'unit') {
      deleteUnit(deleteTarget.id);
    }
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-zinc-950 via-zinc-900 to-black p-5 rounded-2xl border border-red-900/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-red-600/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 text-xs font-bold">
            <Boxes className="w-3.5 h-3.5" />
            <span>MOTO ACCESSORIES CLASSIFICATION SYSTEM</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>គ្រប់គ្រង Categories, Brand & ខ្នាតទំនិញ</span>
          </h1>
          <p className="text-xs text-zinc-400">
            បែងចែកប្រភេទទំនិញ ម៉ាកយីហោគ្រឿងម៉ូតូ (YSS, Brembo, Akrapovic...) និងខ្នាតរង្វាស់ឱ្យមានរបៀបរៀបរយ
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 relative z-10">
          {activeTab === 'categories' && (
            <button
              id="btn-add-category"
              onClick={() => handleOpenCategoryModal()}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-red-950/50 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>បង្កើតប្រភេទថ្មី (Add Category)</span>
            </button>
          )}

          {activeTab === 'brands' && (
            <button
              id="btn-add-brand"
              onClick={() => handleOpenBrandModal()}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-red-950/50 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>បង្កើតម៉ាកយីហោថ្មី (Add Brand)</span>
            </button>
          )}

          {activeTab === 'units' && (
            <button
              id="btn-add-unit"
              onClick={() => handleOpenUnitModal()}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-red-950/50 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>បង្កើតខ្នាតថ្មី (Add Unit)</span>
            </button>
          )}

          <button
            onClick={() => setCurrentView('products')}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-bold border border-zinc-700 transition cursor-pointer"
          >
            <span>ទៅកាន់ស្តុក</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-1 bg-zinc-900/80 p-1.5 rounded-xl border border-zinc-800 overflow-x-auto">
          <button
            id="tab-categories"
            onClick={() => { setActiveTab('categories'); setSearchTerm(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>ប្រភេទទំនិញ (Categories)</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-black/40 text-[10px] font-mono">
              {categories.length}
            </span>
          </button>

          <button
            id="tab-brands"
            onClick={() => { setActiveTab('brands'); setSearchTerm(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'brands'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>ម៉ាកយីហោ (Brands)</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-black/40 text-[10px] font-mono">
              {brands.length}
            </span>
          </button>

          <button
            id="tab-units"
            onClick={() => { setActiveTab('units'); setSearchTerm(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'units'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>ខ្នាតទំនិញ (Units)</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-black/40 text-[10px] font-mono">
              {units.length}
            </span>
          </button>

          <button
            id="tab-models"
            onClick={() => { setActiveTab('models'); setSearchTerm(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'models'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>ម៉ូដែលម៉ូតូ (Models)</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-black/40 text-[10px] font-mono">
              {motorcycleModelsList.length}
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="ស្វែងរក Search..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
          />
        </div>
      </div>

      {/* TAB 1: CATEGORIES GRID */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map((cat) => {
              const stats = categoryStats[cat.name] || categoryStats[cat.khmerName] || { count: 0, totalValue: 0, models: new Set() };
              
              return (
                <div
                  key={cat.id}
                  className="bg-zinc-900/90 border border-zinc-800 hover:border-red-500/50 rounded-2xl p-5 shadow-lg transition-all hover:shadow-red-950/20 group relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700/80 flex items-center justify-center shadow-inner group-hover:scale-105 transition">
                          {getCategoryIconComponent(cat.icon)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-red-400 bg-red-950/50 px-1.5 py-0.5 rounded border border-red-900/40">
                              {cat.id}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition">
                            {cat.khmerName || cat.name}
                          </h3>
                          {cat.khmerName && cat.name !== cat.khmerName && (
                            <p className="text-[11px] text-zinc-400">{cat.name}</p>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                        <button
                          onClick={() => handleOpenCategoryModal(cat)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({
                            type: 'category',
                            id: cat.id,
                            name: cat.khmerName || cat.name,
                            productCount: stats.count
                          })}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-950/60 text-zinc-400 hover:text-red-400 transition cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Stats summary */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/80 text-xs">
                      <div className="bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/50">
                        <p className="text-[10px] text-zinc-400 font-medium">ចំនួនទំនិញ (Items)</p>
                        <p className="text-sm font-black text-white">{stats.count} មុខ</p>
                      </div>
                      <div className="bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/50">
                        <p className="text-[10px] text-zinc-400 font-medium">តម្លៃស្តុកដើម (Cost)</p>
                        <p className="text-sm font-black text-emerald-400">${stats.totalValue.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer link to view items */}
                  <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500 font-mono">
                      Category Tag: {cat.name}
                    </span>
                    <button
                      onClick={() => setCurrentView('products')}
                      className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 transition cursor-pointer"
                    >
                      <span>មើលក្នុងស្តុក</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-3">
              <Package className="w-10 h-10 text-zinc-600 mx-auto" />
              <p className="text-sm text-zinc-400 font-medium">រកមិនឃើញប្រភេទទំនិញត្រូវនឹងពាក្យស្វែងរកទេ</p>
              <button
                onClick={() => handleOpenCategoryModal()}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>បង្កើតប្រភេទទំនិញថ្មី</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BRANDS GRID */}
      {activeTab === 'brands' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBrands.map((b) => {
              const stats = brandStats[b.name] || { count: 0, totalStock: 0, totalValue: 0 };

              return (
                <div
                  key={b.id}
                  className="bg-zinc-900/90 border border-zinc-800 hover:border-red-500/50 rounded-2xl p-5 shadow-lg transition-all hover:shadow-red-950/20 group relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-red-900/40 flex items-center justify-center text-red-400 font-black text-sm shadow-inner group-hover:scale-105 transition">
                          {b.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-red-400 bg-red-950/50 px-1.5 py-0.5 rounded border border-red-900/40">
                              {b.id}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                              <CheckCircle2 className="w-3 h-3" />
                              Active
                            </span>
                          </div>
                          <h3 className="text-base font-black text-white group-hover:text-red-400 transition">
                            {b.name}
                          </h3>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                        <button
                          onClick={() => handleOpenBrandModal(b)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer"
                          title="Edit Brand"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({
                            type: 'brand',
                            id: b.id,
                            name: b.name,
                            productCount: stats.count
                          })}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-950/60 text-zinc-400 hover:text-red-400 transition cursor-pointer"
                          title="Delete Brand"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-2 min-h-[32px]">
                      {b.description || 'ម៉ាកយីហោគ្រឿងម៉ូតូល្បីគុណភាពខ្ពស់ ពេញនិយមលើទីផ្សារ'}
                    </p>

                    {/* Stats summary */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/80 text-xs">
                      <div className="bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/50">
                        <p className="text-[10px] text-zinc-400 font-medium">ចំនួនមុខទំនិញ (Products)</p>
                        <p className="text-sm font-black text-white">{stats.count} មុខ</p>
                      </div>
                      <div className="bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/50">
                        <p className="text-[10px] text-zinc-400 font-medium">ចំនួនស្តុកសរុប (Total Qty)</p>
                        <p className="text-sm font-black text-red-400">{stats.totalStock}</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer link to view items */}
                  <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500 font-mono">
                      Valuation: ${stats.totalValue.toFixed(2)}
                    </span>
                    <button
                      onClick={() => setCurrentView('products')}
                      className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 transition cursor-pointer"
                    >
                      <span>មើលទំនិញ {b.name}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredBrands.length === 0 && (
            <div className="text-center py-12 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-3">
              <Bookmark className="w-10 h-10 text-zinc-600 mx-auto" />
              <p className="text-sm text-zinc-400 font-medium">រកមិនឃើញម៉ាកយីហោត្រូវនឹងពាក្យស្វែងរកទេ</p>
              <button
                onClick={() => handleOpenBrandModal()}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>បង្កើតម៉ាកយីហោថ្មី</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: UNITS GRID */}
      {activeTab === 'units' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredUnits.map((u) => {
              const count = unitStats[u.name] || unitStats[u.shortCode] || 0;

              return (
                <div
                  key={u.id}
                  className="bg-zinc-900/90 border border-zinc-800 hover:border-red-500/50 rounded-2xl p-5 shadow-lg transition-all hover:shadow-red-950/20 group relative flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-red-400 font-mono font-bold text-xs">
                        {u.shortCode}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenUnitModal(u)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer"
                          title="Edit Unit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({
                            type: 'unit',
                            id: u.id,
                            name: `${u.name} (${u.khmerName})`,
                            productCount: count
                          })}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-950/60 text-zinc-400 hover:text-red-400 transition cursor-pointer"
                          title="Delete Unit"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-zinc-500">{u.id}</span>
                      <h3 className="text-base font-bold text-white">{u.khmerName}</h3>
                      <p className="text-xs text-zinc-400 font-mono">{u.name} ({u.shortCode})</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                    <span className="text-zinc-400">ប្រើប្រាស់:</span>
                    <span className="font-bold text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-900/30">
                      {count} ទំនិញ
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: MOTORCYCLE MODELS MATRIX */}
      {activeTab === 'models' && (
        <div className="space-y-4">
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3 text-xs text-zinc-300">
            <Info className="w-5 h-5 text-red-400 shrink-0" />
            <p>
              ម៉ូដែលម៉ូតូ (Motorcycle Models Compatibility) ជួយឱ្យអតិថិជន និងអ្នកលក់ងាយស្រួលស្វែងរកគ្រឿងតុបតែង និងគ្រឿងបន្លាស់ត្រូវម៉ូដែលម៉ូតូនីមួយៗ ដូចជា Honda ADV, PCX, Scoopy, Yamaha PG-1, CT125 ជាដើម។
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {motorcycleModelsList.map((m) => (
              <div
                key={m.name}
                onClick={() => setCurrentView('products')}
                className="bg-zinc-900/90 border border-zinc-800 hover:border-red-500/60 rounded-2xl p-4 shadow-lg transition-all hover:scale-102 cursor-pointer group relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400">
                    <Bike className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] font-bold text-zinc-300">
                    {m.brandsCount} ម៉ាកយីហោ
                  </span>
                </div>

                <h3 className="text-base font-black text-white group-hover:text-red-400 transition">
                  {m.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  {m.count} មុខគ្រឿងតុបតែង • {m.stock} ក្នុងស្តុក
                </p>

                <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-bold text-red-400">
                  <span>ចុចដើម្បីមើលក្នុងស្តុក</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT CATEGORY */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-red-500" />
                <span>{editingCategory ? 'កែប្រែប្រភេទទំនិញ' : 'បង្កើតប្រភេទទំនិញថ្មី (Add Category)'}</span>
              </h2>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-zinc-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  ឈ្មោះជាភាសាខ្មែរ (Khmer Category Name) *
                </label>
                <input
                  type="text"
                  required
                  value={catKhmerName}
                  onChange={e => setCatKhmerName(e.target.value)}
                  placeholder="ឧ. បូម & ជើងក្រោម, កាងការពារ..."
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  ឈ្មោះជាភាសាអង់គ្លេស / Slug (English Name) *
                </label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={e => setCatName(e.target.value)}
                  placeholder="ឧ. Suspension, Crash Bars, Brakes..."
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  ជ្រើសរើស Icon សម្គាល់
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {iconOptions.map(opt => {
                    const IconComp = opt.icon;
                    const isSelected = catIcon === opt.name;
                    return (
                      <button
                        type="button"
                        key={opt.name}
                        onClick={() => setCatIcon(opt.name)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border text-[10px] font-medium transition cursor-pointer ${
                          isSelected
                            ? 'bg-red-600/20 border-red-500 text-red-400'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                        }`}
                      >
                        <IconComp className="w-5 h-5 mb-1" />
                        <span className="truncate w-full text-center">{opt.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold transition cursor-pointer"
                >
                  បោះបង់ (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-black shadow-lg shadow-red-950/50 transition cursor-pointer"
                >
                  រក្សាទុក (Save Category)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT BRAND */}
      {isBrandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-red-500" />
                <span>{editingBrand ? 'កែប្រែម៉ាកយីហោ' : 'បង្កើតម៉ាកយីហោថ្មី (Add Brand)'}</span>
              </h2>
              <button
                onClick={() => setIsBrandModalOpen(false)}
                className="text-zinc-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBrand} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  ឈ្មោះម៉ាកយីហោ (Brand Name) *
                </label>
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={e => setBrandName(e.target.value)}
                  placeholder="ឧ. YSS, Akrapovic, Brembo, Motowolf..."
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  ការពិពណ៌នាអំពីម៉ាក (Description / Specialty)
                </label>
                <textarea
                  rows={3}
                  value={brandDescription}
                  onChange={e => setBrandDescription(e.target.value)}
                  placeholder="ឧ. ផលិតផលបូមកម្រិតពិភពលោកពីប្រទេសថៃ..."
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsBrandModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold transition cursor-pointer"
                >
                  បោះបង់ (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-black shadow-lg shadow-red-950/50 transition cursor-pointer"
                >
                  រក្សាទុក (Save Brand)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT UNIT */}
      {isUnitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-red-500" />
                <span>{editingUnit ? 'កែប្រែខ្នាតទំនិញ' : 'បង្កើតខ្នាតថ្មី (Add Unit)'}</span>
              </h2>
              <button
                onClick={() => setIsUnitModalOpen(false)}
                className="text-zinc-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUnit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  ឈ្មោះជាភាសាខ្មែរ (Khmer Unit Name) *
                </label>
                <input
                  type="text"
                  required
                  value={unitKhmerName}
                  onChange={e => setUnitKhmerName(e.target.value)}
                  placeholder="ឧ. គ្រាប់, ឈុត, គូ, ដប, ប្រអប់..."
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  ឈ្មោះជាភាសាអង់គ្លេស (English Name) *
                </label>
                <input
                  type="text"
                  required
                  value={unitName}
                  onChange={e => setUnitName(e.target.value)}
                  placeholder="ឧ. Pcs, Set, Pair, Bottle, Box..."
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  កូដកាត់ (Short Code) *
                </label>
                <input
                  type="text"
                  required
                  value={unitShortCode}
                  onChange={e => setUnitShortCode(e.target.value)}
                  placeholder="ឧ. Pcs, Set, Pr, Btl, Box..."
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsUnitModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold transition cursor-pointer"
                >
                  បោះបង់ (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-black shadow-lg shadow-red-950/50 transition cursor-pointer"
                >
                  រក្សាទុក (Save Unit)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE DIALOG */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-zinc-950 border border-red-900/60 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-500/40 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">តើអ្នកពិតជាចង់លុបមែនទេ?</h3>
                <p className="text-[11px] text-zinc-400">Confirm Deletion</p>
              </div>
            </div>

            <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 text-xs space-y-1">
              <p className="text-zinc-300 font-semibold">{deleteTarget.name}</p>
              {deleteTarget.productCount > 0 ? (
                <p className="text-amber-400 font-medium">
                  ⚠️ មានទំនិញ {deleteTarget.productCount} មុខកំពុងប្រើប្រាស់។ ប្រព័ន្ធនឹងទប់ស្កាត់ការលុបដើម្បីរក្សាសុវត្ថិភាពទិន្នន័យ។
                </p>
              ) : (
                <p className="text-zinc-400">ទិន្នន័យនេះមិនមានទំនិញភ្ជាប់ទេ អាចលុបបានដោយសុវត្ថិភាព។</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold transition cursor-pointer"
              >
                បោះបង់ (Cancel)
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md shadow-red-950/50 transition cursor-pointer"
              >
                យល់ព្រមលុប (Delete)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
