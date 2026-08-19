import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Barcode as BarcodeIcon, Printer, RefreshCw, Layers, Sliders, Check } from 'lucide-react';
import JsBarcode from 'jsbarcode';

export const BarcodeGeneratorView: React.FC = () => {
  const { products, formatUSD, formatKHR, exchangeRate, addToast } = useApp();

  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.productId || '');
  const [barcodeValue, setBarcodeValue] = useState<string>(products[0]?.barcode || '884100100001');
  const [productName, setProductName] = useState<string>(products[0]?.name || '');
  const [productKhmerName, setProductKhmerName] = useState<string>(products[0]?.khmerName || '');
  const [priceUSD, setPriceUSD] = useState<number>(products[0]?.salePrice || 1.0);
  const [barcodeFormat, setBarcodeFormat] = useState<'CODE128' | 'EAN13'>('CODE128');
  const [printQuantity, setPrintQuantity] = useState<number>(12);
  const [showPrice, setShowPrice] = useState<boolean>(true);
  const [showShopName, setShowShopName] = useState<boolean>(true);
  const [labelSize, setLabelSize] = useState<'50x30' | '40x30' | 'A4_grid'>('50x30');

  const barcodeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Update fields when selecting a product
  const handleProductSelect = (pId: string) => {
    setSelectedProductId(pId);
    const prod = products.find(p => p.productId === pId);
    if (prod) {
      setBarcodeValue(prod.barcode);
      setProductName(prod.name);
      setProductKhmerName(prod.khmerName || '');
      setPriceUSD(prod.salePrice);
    }
  };

  // Render Barcode
  useEffect(() => {
    if (barcodeCanvasRef.current && barcodeValue) {
      try {
        JsBarcode(barcodeCanvasRef.current, barcodeValue, {
          format: barcodeFormat,
          lineColor: '#000000',
          width: 2,
          height: 50,
          displayValue: true,
          fontSize: 14,
          font: 'monospace',
          margin: 5
        });
      } catch (err) {
        console.warn('Barcode generation warning:', err);
      }
    }
  }, [barcodeValue, barcodeFormat]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="barcode-generator-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs no-print">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <BarcodeIcon className="w-6 h-6 text-blue-600" />
            ប្រព័ន្ធបង្កើត និងបោះពុម្ព Barcode (Barcode Generator)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            បង្កើត Barcode Code 128 / EAN-13 សម្រាប់បិទលើផលិតផល និងបោះពុម្ពជា Thermal Sticker
          </p>
        </div>

        <button
          id="btn-print-barcode"
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition transform active:scale-95 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>បោះពុម្ពស្លាក Barcode (Print Labels)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 no-print">
        {/* Controls Card */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            ការកំណត់ស្លាក Barcode (Settings)
          </h2>

          {/* Product Select */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              ជ្រើសរើសទំនិញ (Select Product)
            </label>
            <select
              value={selectedProductId}
              onChange={e => handleProductSelect(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
            >
              {products.map(p => (
                <option key={p.productId} value={p.productId}>
                  {p.name} ({p.barcode})
                </option>
              ))}
            </select>
          </div>

          {/* Barcode Value */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              លេខ Barcode (Barcode Code)
            </label>
            <input
              type="text"
              value={barcodeValue}
              onChange={e => setBarcodeValue(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              ឈ្មោះទំនិញលើស្លាក (Product Label Name)
            </label>
            <input
              type="text"
              value={productName}
              onChange={e => setProductName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white font-medium"
            />
          </div>

          {/* Price */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                តម្លៃ ($ USD)
              </label>
              <input
                type="number"
                step="0.01"
                value={priceUSD}
                onChange={e => setPriceUSD(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-mono font-bold focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                ទ្រង់ទ្រាយ (Format)
              </label>
              <select
                value={barcodeFormat}
                onChange={e => setBarcodeFormat(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="CODE128">Code 128 (Standard)</option>
                <option value="EAN13">EAN-13</option>
              </select>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showPrice}
                onChange={e => setShowPrice(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>បង្ហាញតម្លៃលើ Barcode ($ & ៛)</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showShopName}
                onChange={e => setShowShopName(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>បង្ហាញឈ្មោះហាង (Store Header)</span>
            </label>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              ចំនួនស្លាកត្រូវបោះពុម្ព (Print Quantity)
            </label>
            <div className="flex items-center gap-2">
              {[4, 8, 12, 24, 40].map(qty => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => setPrintQuantity(qty)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    printQuantity === qty
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {qty}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col items-center justify-center">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
            ផ្ទាំងទស្សនាគំរូ Barcode Sticker (Live Label Preview)
          </h3>

          <div className="bg-white text-slate-900 p-5 rounded-xl shadow-md border border-slate-200 flex flex-col items-center justify-center text-center w-64">
            {showShopName && (
              <p className="text-[11px] font-bold tracking-tight text-slate-800 uppercase">
                Khmer Smart Mart
              </p>
            )}
            <p className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
              {productName || 'Product Name'}
            </p>
            {productKhmerName && (
              <p className="text-[10px] text-slate-500 line-clamp-1">{productKhmerName}</p>
            )}

            <div className="my-2">
              <canvas ref={barcodeCanvasRef} className="max-w-full h-auto" />
            </div>

            {showPrice && (
              <div className="text-center font-bold">
                <span className="text-sm text-blue-600 font-mono font-bold">{formatUSD(priceUSD)}</span>
                <span className="text-[11px] text-slate-500 ml-1.5 font-mono">
                  ({formatKHR(priceUSD * exchangeRate)})
                </span>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400 mt-6 text-center">
            ស្លាក Barcode នេះអាចស្កេនបានយ៉ាងងាយស្រួលជាមួយ Barcode Scanner លើទូរស័ព្ទ ឬម៉ាស៊ីនស្កេន POS
          </p>
        </div>
      </div>

      {/* Printable Sheet (Shown only in print mode) */}
      <div className="print-area hidden">
        <div className="grid grid-cols-3 gap-4 p-4 text-black">
          {Array.from({ length: printQuantity }).map((_, index) => (
            <div
              key={index}
              className="border border-dashed border-gray-400 p-3 flex flex-col items-center text-center rounded bg-white text-black"
              style={{ breakInside: 'avoid' }}
            >
              {showShopName && (
                <div className="text-[10px] font-bold uppercase tracking-wider">
                  Khmer Smart Mart
                </div>
              )}
              <div className="text-[11px] font-bold line-clamp-1 mt-0.5">
                {productName}
              </div>
              <div className="my-1">
                <svg
                  className="barcode-svg"
                  ref={el => {
                    if (el && barcodeValue) {
                      try {
                        JsBarcode(el, barcodeValue, {
                          format: barcodeFormat,
                          lineColor: '#000000',
                          width: 1.5,
                          height: 35,
                          displayValue: true,
                          fontSize: 10,
                          margin: 2
                        });
                      } catch {}
                    }
                  }}
                />
              </div>
              {showPrice && (
                <div className="text-xs font-bold text-black">
                  {formatUSD(priceUSD)} - {formatKHR(priceUSD * exchangeRate)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
