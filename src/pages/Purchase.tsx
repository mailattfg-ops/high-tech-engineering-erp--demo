import { useState } from 'react';
import { Plus, Search, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { Badge, Section, PageHeader } from '../components/shared/UIComponents';
import { sampleProducts, purchaseData } from '../data/mockData';

interface OutletCtx { darkMode: boolean; handleRefresh: () => void; toast: (msg: string, type?: 'success'|'error'|'info'|'warning') => void; }

const suppliers = [
  { id: 'SUP001', name: 'Anchor Electricals Distributor', city: 'Ernakulam', mobile: '9876000001', outstanding: 48200 },
  { id: 'SUP002', name: 'Supreme Industries', city: 'Mumbai', mobile: '9876000002', outstanding: 0 },
  { id: 'SUP003', name: 'Kajaria Ceramics Distributor', city: 'Chennai', mobile: '9876000003', outstanding: 68400 },
  { id: 'SUP004', name: 'Havells India Distributor', city: 'Delhi', mobile: '9876000004', outstanding: 35600 },
  { id: 'SUP005', name: 'Astral Pipes Distributor', city: 'Ahmedabad', mobile: '9876000005', outstanding: 0 },
];

interface PurchaseItem {
  product: typeof sampleProducts[0];
  qty: number;
  purchaseRate: number;
  mrp: number;
}

export default function Purchase() {
  const { toast } = useOutletContext<OutletCtx>();
  const [tab, setTab] = useState<'list' | 'add' | 'suppliers'>('list');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<typeof sampleProducts>([]);
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [supplierId, setSupplierId] = useState('');
  const [purchaseSaved, setPurchaseSaved] = useState(false);
  const [payType, setPayType] = useState('Credit');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('2025-05-19');

  const handleSearch = (q: string) => {
    setSearch(q);
    if (q.length < 2) { setSearchResults([]); return; }
    setSearchResults(sampleProducts.filter(p =>
      p.name.toLowerCase().includes(q.toLowerCase()) || p.barcode.includes(q)
    ).slice(0, 6));
  };

  const addItem = (product: typeof sampleProducts[0]) => {
    setItems(prev => {
      const ex = prev.find(i => i.product.id === product.id);
      if (ex) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1, purchaseRate: product.purchasePrice, mrp: product.mrp }];
    });
    setSearch(''); setSearchResults([]);
  };

  const total = items.reduce((s, i) => s + i.qty * i.purchaseRate, 0);

  const selectedSupplier = suppliers.find(s => s.id === supplierId);

  return (
    <div className="p-5 min-h-full bg-slate-50">
      <PageHeader
        title="Purchase Management"
        subtitle="Purchase entry, supplier management & reorder"
        actions={
          <button onClick={() => setTab('add')} className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 shadow-sm">
            <Plus size={15} /> New Purchase
          </button>
        }
      />

      <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-5 w-fit">
        {(['list', 'add', 'suppliers'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
            {t === 'add' ? 'New Entry' : t === 'list' ? 'Purchase History' : 'Suppliers'}
          </button>
        ))}
      </div>

      {/* PURCHASE HISTORY */}
      {tab === 'list' && (
        <Section title="Recent Purchase Orders">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  {['PO No', 'Date', 'Supplier', 'Amount', 'Type', 'Status', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {purchaseData.map(p => (
                  <tr key={p.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-blue-600 font-medium">{p.id}</td>
                    <td className="px-4 py-3 text-slate-600">{p.date}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{p.supplier}</td>
                    <td className="px-4 py-3 font-bold text-slate-800">₹{p.amount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3"><Badge label={p.type} variant={p.type === 'Cash' ? 'green' : 'blue'} /></td>
                    <td className="px-4 py-3">
                      <Badge label={p.status} variant={p.status === 'Received' ? 'green' : p.status === 'Pending' ? 'yellow' : 'orange'} />
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-blue-600 hover:underline font-medium">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* NEW PURCHASE ENTRY */}
      {tab === 'add' && (
        <>
          {purchaseSaved ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center max-w-md">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-green-800">Purchase Entry Saved!</h3>
              <p className="text-sm text-green-600 mt-1">PO-2025-0190 · ₹{total.toFixed(2)} · Stock updated automatically</p>
              <button onClick={() => { setPurchaseSaved(false); setItems([]); }} className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg text-sm">New Entry</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-4">
                <Section title="Purchase Details">
                  <div className="p-4 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Supplier*</label>
                      <select value={supplierId} onChange={e => setSupplierId(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 bg-white">
                        <option value="">Select Supplier</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Supplier Invoice No</label>
                      <input value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} placeholder="e.g. SI-2025-456" className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Invoice Date</label>
                      <input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Payment Type</label>
                      <select value={payType} onChange={e => setPayType(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 bg-white">
                        {['Cash', 'Credit', 'Cheque', 'NEFT'].map(m => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                </Section>

                {selectedSupplier && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm flex gap-6">
                    <div><span className="text-slate-500">Supplier:</span> <strong>{selectedSupplier.name}</strong></div>
                    <div><span className="text-slate-500">City:</span> <strong>{selectedSupplier.city}</strong></div>
                    <div><span className="text-slate-500">Outstanding:</span> <strong className={selectedSupplier.outstanding > 0 ? 'text-red-600' : 'text-green-600'}>₹{selectedSupplier.outstanding.toLocaleString('en-IN')}</strong></div>
                  </div>
                )}

                <Section title="Add Products">
                  <div className="p-4">
                    <div className="relative mb-4">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input value={search} onChange={e => handleSearch(e.target.value)} placeholder="Search products or scan barcode…" className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400" />
                      {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden">
                          {searchResults.map(p => (
                            <button key={p.id} onClick={() => addItem(p)} className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-orange-50 border-b border-slate-50 last:border-0 text-left">
                              <div>
                                <div className="text-sm font-semibold text-slate-800">{p.name}</div>
                                <div className="text-[11px] text-slate-400">Current Stock: {p.stock} · Rack: {p.rack}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold text-orange-600">₹{p.purchasePrice}</div>
                                <div className="text-[11px] text-slate-400">Last Purchase</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {items.length > 0 && (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-50">
                            {['Product', 'Current Stock', 'Qty', 'Purchase Rate', 'MRP', 'Amount'].map(h => (
                              <th key={h} className="text-left px-3 py-2 text-[11px] font-semibold text-slate-500 uppercase">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {items.map(item => (
                            <tr key={item.product.id} className="border-t border-slate-50">
                              <td className="px-3 py-2">
                                <div className="font-medium text-slate-800 text-xs">{item.product.name}</div>
                                <div className="text-[10px] text-slate-400">{item.product.brand}</div>
                              </td>
                              <td className="px-3 py-2 text-center">
                                <span className={`text-xs font-bold ${item.product.stock < item.product.minStock ? 'text-red-600' : 'text-green-600'}`}>
                                  {item.product.stock}
                                </span>
                              </td>
                              <td className="px-3 py-2">
                                <input type="number" min={1} value={item.qty}
                                  onChange={e => setItems(prev => prev.map(i => i.product.id === item.product.id ? { ...i, qty: Number(e.target.value) } : i))}
                                  className="w-16 px-2 py-1 rounded border border-slate-200 text-center text-sm font-bold focus:outline-none focus:ring-1 focus:ring-orange-400" />
                              </td>
                              <td className="px-3 py-2">
                                <input type="number" value={item.purchaseRate}
                                  onChange={e => setItems(prev => prev.map(i => i.product.id === item.product.id ? { ...i, purchaseRate: Number(e.target.value) } : i))}
                                  className="w-24 px-2 py-1 rounded border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400" />
                              </td>
                              <td className="px-3 py-2">
                                <input type="number" value={item.mrp}
                                  onChange={e => setItems(prev => prev.map(i => i.product.id === item.product.id ? { ...i, mrp: Number(e.target.value) } : i))}
                                  className="w-24 px-2 py-1 rounded border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400" />
                              </td>
                              <td className="px-3 py-2 font-bold text-slate-800">₹{(item.qty * item.purchaseRate).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    {items.length === 0 && <div className="text-center text-slate-400 text-sm py-6">Add products using the search above</div>}
                  </div>
                </Section>
              </div>

              {/* Right Summary */}
              <div className="space-y-4">
                <Section title="Purchase Summary">
                  <div className="p-4 space-y-3">
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between"><span className="text-slate-500">Supplier</span><span className="font-medium text-slate-800 text-right max-w-[120px] truncate">{selectedSupplier?.name || '—'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Payment</span><Badge label={payType} variant="blue" /></div>
                      <div className="flex justify-between"><span className="text-slate-500">Items</span><span className="font-bold">{items.length}</span></div>
                    </div>
                    <div className="border-t border-slate-100 pt-3">
                      <div className="flex justify-between font-bold text-xl">
                        <span>Total</span>
                        <span className="text-orange-600">₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                    <button
                      disabled={items.length === 0 || !supplierId}
                      onClick={() => setPurchaseSaved(true)}
                      className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 disabled:opacity-50 transition-colors shadow-sm"
                    >
                      <Truck size={16} className="inline mr-2" />Save Purchase
                    </button>
                  </div>
                </Section>
                {items.length > 0 && (
                  <Section title="Profit Preview">
                    <div className="p-4 space-y-2 max-h-48 overflow-y-auto">
                      {items.map(item => {
                        const retail = item.purchaseRate * 1.2;
                        const profit = retail - item.purchaseRate;
                        return (
                          <div key={item.product.id} className="bg-slate-50 rounded-lg p-2 text-xs">
                            <div className="font-medium text-slate-800">{item.product.name}</div>
                            <div className="flex gap-3 mt-1 text-slate-500">
                              <span>Buy ₹{item.purchaseRate}</span>
                              <span>→ Retail ₹{retail.toFixed(0)}</span>
                              <span className="text-green-600 font-bold">Profit ₹{profit.toFixed(0)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Section>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* SUPPLIERS */}
      {tab === 'suppliers' && (
        <Section title="Supplier Directory">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  {['Supplier', 'City', 'Mobile', 'Outstanding', 'Status', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {suppliers.map(s => (
                  <tr key={s.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-800">{s.name}</td>
                    <td className="px-4 py-3 text-slate-600">{s.city}</td>
                    <td className="px-4 py-3 font-mono text-sm text-blue-600">{s.mobile}</td>
                    <td className="px-4 py-3 font-bold">
                      <span className={s.outstanding > 0 ? 'text-red-600' : 'text-green-600'}>
                        ₹{s.outstanding.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {s.outstanding > 0
                        ? <span className="flex items-center gap-1 text-red-600 text-xs font-medium"><AlertCircle size={12} /> Due</span>
                        : <span className="flex items-center gap-1 text-green-600 text-xs font-medium"><CheckCircle size={12} /> Clear</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-blue-600 hover:underline font-medium mr-3">Reorder</button>
                      <button className="text-xs text-slate-500 hover:underline">Ledger</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}
    </div>
  );
}
