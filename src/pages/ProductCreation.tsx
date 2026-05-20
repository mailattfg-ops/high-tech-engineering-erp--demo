import { useState } from 'react';
import { Plus, Search, Filter, Edit, Package, CheckCircle, Barcode } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { PageHeader, Badge, Section } from '../components/shared/UIComponents';
import { sampleProducts, marginCategories, priceTypes } from '../data/mockData';

interface OutletCtx { darkMode: boolean; handleRefresh: () => void; toast: (msg: string, type?: 'success'|'error'|'info'|'warning') => void; }

const categories = ['All', 'Electricals', 'Plumbing', 'Hardware', 'Building Materials'];

function computePrices(purchasePrice: number, marginPct: number) {
  const retailPrice = purchasePrice * (1 + marginPct / 100);
  const profit = retailPrice - purchasePrice;
  return priceTypes.map(pt => ({
    ...pt,
    price: retailPrice - (profit * pt.discountPct) / 100,
  }));
}

export default function ProductCreation() {
  const { toast } = useOutletContext<OutletCtx>();
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'pricing'>('list');
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [selectedMargin, setSelectedMargin] = useState(20);
  const [purchasePrice, setPurchasePrice] = useState(100);

  // Add product form state
  const [form, setForm] = useState({
    brand: '', category: '', subCategory: '', company: '', group: '',
    subGroup: '', quality: 'High Quality', supplier: '', unit: 'Nos',
    keyword: '', openingStock: 0, purchasePrice: 0, minStock: 0,
    maxStock: 0, reorderQty: 0, rack: '', name: '', marginCategory: 20,
    gstRate: 18,
  });

  const [productSaved, setProductSaved] = useState(false);

  const filtered = sampleProducts.filter(p =>
    (filterCat === 'All' || p.category === filterCat) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
     p.brand.toLowerCase().includes(search.toLowerCase()) ||
     p.barcode.includes(search))
  );

  const computedPrices = computePrices(purchasePrice, selectedMargin);

  return (
    <div className="p-5 min-h-full bg-slate-50">
      <PageHeader
        title="Product Management"
        subtitle={`${sampleProducts.length} products · ${sampleProducts.filter(p => p.stock <= p.minStock).length} low stock`}
        actions={
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('pricing')} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
              Price Engine
            </button>
            <button onClick={() => { setActiveTab('add'); setProductSaved(false); }} className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm">
              <Plus size={16} /> Add Product
            </button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-5 w-fit">
        {(['list', 'add', 'pricing'] as const).map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all
              ${activeTab === t ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            {t === 'add' ? 'Add Product' : t === 'pricing' ? 'Price Engine' : 'Product List'}
          </button>
        ))}
      </div>

      {/* PRODUCT LIST */}
      {activeTab === 'list' && (
        <Section>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-slate-100">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, brand, barcode, keyword…"
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setFilterCat(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                    ${filterCat === c ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {c}
                </button>
              ))}
            </div>
            <button onClick={() => toast('Advanced filters applied', 'info')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 px-3 py-2 rounded-lg transition-colors hover:bg-slate-50">
              <Filter size={14} /> Filter
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  {['ID', 'Product', 'Category', 'Purchase', 'Retail MRP', 'Stock', 'Rack', 'Quality', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const isLow = p.stock <= p.minStock && p.stock > 0;
                  const isNeg = p.stock <= 0;
                  return (
                    <tr key={p.id} className="border-t border-slate-50 hover:bg-orange-50/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-slate-400">{p.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{p.name}</div>
                        <div className="text-[11px] text-slate-400">{p.brand} · {p.company}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-slate-600">{p.category}</div>
                        <div className="text-[11px] text-slate-400">{p.subCategory}</div>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-700">₹{p.purchasePrice}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-800">₹{p.retailPrice}</div>
                        <div className="text-[11px] text-slate-400">MRP ₹{p.mrp}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`font-bold ${isNeg ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-green-600'}`}>
                          {p.stock} {p.unit}
                        </div>
                        {isNeg && <div className="text-[10px] text-red-500 font-medium">⚠ Negative</div>}
                        {isLow && <div className="text-[10px] text-amber-500 font-medium">Low Stock</div>}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-blue-500">{p.rack}</td>
                      <td className="px-4 py-3">
                        <Badge
                          label={p.quality.replace(' Quality', '')}
                          variant={p.quality === 'High Quality' ? 'green' : p.quality === 'Medium Quality' ? 'yellow' : 'gray'}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => toast(`Editing ${p.name}`, 'info')} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Edit">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => toast(`Barcode printed for ${p.name} · Rack ${p.rack}`, 'success')} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors" title="Print Barcode">
                            <Barcode size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 text-xs text-slate-400 border-t border-slate-50">
            Showing {filtered.length} of {sampleProducts.length} products
          </div>
        </Section>
      )}

      {/* ADD PRODUCT */}
      {activeTab === 'add' && (
        <div className="max-w-4xl">
          {productSaved ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-green-800">Product Created Successfully!</h3>
              <p className="text-sm text-green-600 mt-1">The product has been added to inventory with all pricing rules applied.</p>
              <button onClick={() => setProductSaved(false)} className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600">
                Add Another Product
              </button>
            </div>
          ) : (
            <Section title="New Product Creation">
              <div className="p-5 space-y-5">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Brand*', key: 'brand', placeholder: 'e.g. Anchor, Havells, Finolex' },
                    { label: 'Category*', key: 'category', placeholder: 'e.g. Electricals, Plumbing' },
                    { label: 'Sub Category', key: 'subCategory', placeholder: 'e.g. Switches, Pipes' },
                    { label: 'Company*', key: 'company', placeholder: 'e.g. Anchor Electricals' },
                    { label: 'Group', key: 'group', placeholder: 'e.g. Modular Switches' },
                    { label: 'Sub Group', key: 'subGroup', placeholder: 'e.g. Premium Modular' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">{f.label}</label>
                      <input
                        value={form[f.key as keyof typeof form] as string}
                        onChange={e => setForm(x => ({ ...x, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 bg-white"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Quality Type*</label>
                    <select
                      value={form.quality}
                      onChange={e => setForm(x => ({ ...x, quality: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 bg-white"
                    >
                      <option>High Quality</option>
                      <option>Medium Quality</option>
                      <option>Low Quality</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Unit*</label>
                    <select
                      value={form.unit}
                      onChange={e => setForm(x => ({ ...x, unit: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 bg-white"
                    >
                      {['Nos', 'Roll', 'Box', 'Pcs', 'Litre', 'Kg', 'Meter', 'Bag'].map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">GST Rate (%)</label>
                    <select
                      value={form.gstRate}
                      onChange={e => setForm(x => ({ ...x, gstRate: Number(e.target.value) }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 bg-white"
                    >
                      {[0, 5, 12, 18, 28].map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Product Name / Keywords (comma-separated)</label>
                  <input
                    placeholder="e.g. Anchor Roma 6A Switch, 6A Modular Switch, White Switch"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Purchase Price (₹)*', key: 'purchasePrice', type: 'number' },
                    { label: 'Opening Stock', key: 'openingStock', type: 'number' },
                    { label: 'Min Stock', key: 'minStock', type: 'number' },
                    { label: 'Max Stock', key: 'maxStock', type: 'number' },
                    { label: 'Reorder Qty', key: 'reorderQty', type: 'number' },
                    { label: 'Rack / Location', key: 'rack', type: 'text' },
                    { label: 'Supplier', key: 'supplier', type: 'text' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">{f.label}</label>
                      <input
                        type={f.type}
                        value={form[f.key as keyof typeof form] as string | number}
                        onChange={e => setForm(x => ({ ...x, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Margin Category</label>
                    <select
                      value={form.marginCategory}
                      onChange={e => setForm(x => ({ ...x, marginCategory: Number(e.target.value) }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 bg-white"
                    >
                      {marginCategories.map(m => <option key={m} value={m}>{m}%</option>)}
                    </select>
                  </div>
                </div>

                {/* Auto-generated pricing preview */}
                {form.purchasePrice > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <div className="text-sm font-semibold text-orange-800 mb-3">
                      Auto-generated Pricing (Purchase ₹{form.purchasePrice} @ {form.marginCategory}% margin)
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {computePrices(form.purchasePrice, form.marginCategory).map(p => (
                        <div key={p.key} className="bg-white rounded-lg px-3 py-2 text-center shadow-sm">
                          <div className="text-[10px] text-slate-500 font-medium">{p.label}</div>
                          <div className="text-base font-bold text-slate-800 mt-0.5">₹{p.price.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => { if (!form.brand || !form.category) { toast('Please fill Brand and Category fields', 'error'); return; } setProductSaved(true); toast('Product saved successfully!', 'success'); }}
                    className="px-8 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors shadow-sm"
                  >
                    Save Product
                  </button>
                  <button
                    onClick={() => { setForm({ brand: '', category: '', subCategory: '', company: '', group: '', subGroup: '', quality: 'High Quality', supplier: '', unit: 'Nos', keyword: '', openingStock: 0, purchasePrice: 0, minStock: 0, maxStock: 0, reorderQty: 0, rack: '', name: '', marginCategory: 20, gstRate: 18 }); toast('Form reset', 'info'); }}
                    className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </Section>
          )}
        </div>
      )}

      {/* PRICING ENGINE */}
      {activeTab === 'pricing' && (
        <div className="max-w-4xl space-y-5">
          <Section title="Advanced Pricing Engine">
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Purchase Price (₹)</label>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={e => setPurchasePrice(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 text-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Margin Category</label>
                  <select
                    value={selectedMargin}
                    onChange={e => setSelectedMargin(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 bg-white text-lg font-bold"
                  >
                    {marginCategories.map(m => <option key={m} value={m}>{m}% Margin</option>)}
                  </select>
                </div>
              </div>

              {/* Price Summary Cards */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-4 text-white">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xs opacity-80">Purchase Price</div>
                    <div className="text-2xl font-bold">₹{purchasePrice}</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-80">Retail Price</div>
                    <div className="text-2xl font-bold">₹{(purchasePrice * (1 + selectedMargin / 100)).toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-80">Profit</div>
                    <div className="text-2xl font-bold">₹{(purchasePrice * selectedMargin / 100).toFixed(2)}</div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 rounded-lg">
                      <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase">Price Type</th>
                      <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase">Discount on Profit</th>
                      <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase">Selling Price</th>
                      <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase">Profit</th>
                      <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase">Margin %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {computedPrices.map((p, i) => {
                      const profit = p.price - purchasePrice;
                      const marginPct = (profit / purchasePrice) * 100;
                      return (
                        <tr key={p.key} className={`border-t border-slate-50 ${i === 0 ? 'bg-orange-50' : 'hover:bg-slate-50'} transition-colors`}>
                          <td className="px-4 py-3">
                            <span className={`font-semibold ${i === 0 ? 'text-orange-700' : 'text-slate-700'}`}>{p.label}</span>
                            {i === 0 && <Badge label="Default" variant="orange" />}
                          </td>
                          <td className="px-4 py-3 text-slate-500">{p.discountPct}% of profit</td>
                          <td className="px-4 py-3 font-bold text-slate-800 text-base">₹{p.price.toFixed(2)}</td>
                          <td className="px-4 py-3 font-semibold text-green-600">₹{profit.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${marginPct > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                              {marginPct.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700">
                <Package size={14} className="inline mr-2" />
                <strong>Note:</strong> Retail Price is the default billing price. Discount rates are applied proportionally to the profit margin. Party-wise pricing can be configured in CRM settings.
              </div>
            </div>
          </Section>

          {/* Margin Categories Grid */}
          <Section title="All 20 Margin Categories">
            <div className="p-4 grid grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2">
              {marginCategories.map(m => (
                <button
                  key={m}
                  onClick={() => setSelectedMargin(m)}
                  className={`p-2 rounded-lg text-center transition-all
                    ${selectedMargin === m
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-orange-100 hover:text-orange-700'
                    }`}
                >
                  <div className="text-sm font-bold">{m}%</div>
                  <div className="text-[10px] opacity-70">₹{(purchasePrice * m / 100).toFixed(0)}</div>
                </button>
              ))}
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
