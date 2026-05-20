import { useState } from 'react';
import { Search, Plus, Printer, MessageSquare, CheckCircle, Trash2, X } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { Badge, Section, PageHeader } from '../components/shared/UIComponents';
import { sampleProducts, sampleCustomers, sampleSalesmen, firmOptions, priceTypes } from '../data/mockData';

interface OutletCtx { darkMode: boolean; handleRefresh: () => void; toast: (msg: string, type?: 'success'|'error'|'info'|'warning') => void; }

interface CartItem {
  product: typeof sampleProducts[0];
  qty: number;
  rate: number;
  discount: number;
}

export default function Billing() {
  const { toast } = useOutletContext<OutletCtx>();
  const [step, setStep] = useState<'setup' | 'bill'>('setup');
  const [firm, setFirm] = useState('');
  const [salesman, setSalesman] = useState('');
  const [billType, setBillType] = useState('GST Bill');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [customerId, setCustomerId] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<typeof sampleProducts>([]);
  const [billSaved, setBillSaved] = useState(false);
  const [whatsappSent, setWhatsappSent] = useState(false);
  const [priceType, setPriceType] = useState('Retail Price');
  const [note, setNote] = useState('');

  const selectedCustomer = sampleCustomers.find(c => c.id === customerId);

  const handleSearch = (q: string) => {
    setSearch(q);
    if (q.length < 2) { setSearchResults([]); return; }
    setSearchResults(sampleProducts.filter(p =>
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      p.brand.toLowerCase().includes(q.toLowerCase()) ||
      p.barcode.includes(q)
    ).slice(0, 6));
  };

  const addToCart = (product: typeof sampleProducts[0]) => {
    const pTypeIdx = priceTypes.findIndex(t => t.label === priceType);
    const margin = 20;
    const retail = product.purchasePrice * 1.2;
    const profit = retail - product.purchasePrice;
    const discPct = pTypeIdx >= 0 ? priceTypes[pTypeIdx].discountPct : 0;
    const rate = retail - (profit * discPct / 100);
    setCart(c => {
      const ex = c.find(i => i.product.id === product.id);
      if (ex) return c.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...c, { product, qty: 1, rate, discount: 0 }];
    });
    setSearch(''); setSearchResults([]);
  };

  const updateCart = (id: string, field: 'qty' | 'discount', val: number) => {
    setCart(c => c.map(i => i.product.id === id ? { ...i, [field]: val } : i));
  };

  const removeFromCart = (id: string) => setCart(c => c.filter(i => i.product.id !== id));

  const subtotal = cart.reduce((s, i) => s + i.qty * i.rate * (1 - i.discount / 100), 0);
  const gstAmt = billType === 'GST Bill' ? subtotal * 0.09 : 0; // CGST+SGST each
  const total = subtotal + gstAmt * 2;

  const billTypes = ['GST Bill', 'Non-GST Bill', 'Quotation', 'Estimate', 'Sales Order'];

  if (billSaved) {
    return (
      <div className="p-5 min-h-full bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center max-w-md w-full">
          <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800">Bill Saved Successfully!</h2>
          <p className="text-slate-500 text-sm mt-2">Invoice <span className="font-mono font-bold text-orange-600">INV-2025-0679</span> created</p>
          <p className="text-slate-500 text-sm">Total: <span className="font-bold text-slate-800">₹{total.toFixed(2)}</span></p>
          <div className="flex gap-3 mt-6 justify-center">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50" onClick={() => toast('Bill sent to printer', 'success')}>
              <Printer size={14} /> Print Bill
            </button>
            <button
              onClick={() => { toast('PDF sent via WhatsApp successfully!', 'success'); setWhatsappSent(true); setTimeout(() => setWhatsappSent(false), 2000); }}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
            >
              <MessageSquare size={14} /> {whatsappSent ? 'Sent!' : 'WhatsApp PDF'}
            </button>
            <button
              onClick={() => { setBillSaved(false); setCart([]); setStep('setup'); }}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600"
            >
              <Plus size={14} /> New Bill
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 min-h-full bg-slate-50">
      <PageHeader
        title="Sales & Billing"
        subtitle="Fast billing with GST, multi-price & WhatsApp integration"
        actions={
          <div className="flex gap-2">
            <button onClick={() => setStep('setup')} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${step === 'setup' ? 'bg-orange-500 text-white border-orange-500' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              Bill Setup
            </button>
            <button onClick={() => setStep('bill')} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${step === 'bill' ? 'bg-orange-500 text-white border-orange-500' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              Bill Entry
            </button>
          </div>
        }
      />

      {step === 'setup' && (
        <div className="max-w-2xl">
          <Section title="Bill Setup — Select before billing">
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Firm*</label>
                  <select value={firm} onChange={e => setFirm(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 bg-white">
                    <option value="">Select Firm</option>
                    {firmOptions.map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Salesman*</label>
                  <select value={salesman} onChange={e => setSalesman(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 bg-white">
                    <option value="">Select Salesman</option>
                    {sampleSalesmen.map(s => <option key={s.id}>{s.name} ({s.role})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Bill Type*</label>
                  <select value={billType} onChange={e => setBillType(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 bg-white">
                    {billTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Payment Mode</label>
                  <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 bg-white">
                    {['Cash', 'Credit', 'UPI', 'Cheque', 'Card'].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Customer</label>
                  <select value={customerId} onChange={e => setCustomerId(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 bg-white">
                    <option value="">Walk-in / Cash Customer</option>
                    {sampleCustomers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.type})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Price Type</label>
                  <select value={priceType} onChange={e => setPriceType(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 bg-white">
                    {priceTypes.map(t => <option key={t.key}>{t.label}</option>)}
                  </select>
                </div>
              </div>
              {selectedCustomer && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 grid grid-cols-3 gap-3 text-sm">
                  <div><div className="text-[11px] text-slate-500">Customer</div><div className="font-semibold text-slate-800">{selectedCustomer.name}</div></div>
                  <div><div className="text-[11px] text-slate-500">Credit Limit</div><div className="font-bold text-green-700">₹{selectedCustomer.credit.toLocaleString('en-IN')}</div></div>
                  <div><div className="text-[11px] text-slate-500">Balance Due</div><div className={`font-bold ${selectedCustomer.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>₹{Math.abs(selectedCustomer.balance).toLocaleString('en-IN')} {selectedCustomer.balance < 0 ? '(Due)' : '(Advance)'}</div></div>
                </div>
              )}
              {paymentMode === 'Credit' && !customerId && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                  ⚠ Credit bill requires customer selection with mobile number.
                </div>
              )}
              <button
                onClick={() => setStep('bill')}
                disabled={!firm || !salesman}
                className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold text-sm hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                Proceed to Bill Entry →
              </button>
            </div>
          </Section>
        </div>
      )}

      {step === 'bill' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Product Search + Cart */}
          <div className="lg:col-span-2 space-y-4">
            <Section title="Add Products">
              <div className="p-4">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={e => handleSearch(e.target.value)}
                    placeholder="Search products by name, brand, barcode… (F2)"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 text-base"
                    autoFocus
                  />
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden">
                      {searchResults.map(p => (
                        <button
                          key={p.id}
                          onClick={() => addToCart(p)}
                          className="w-full flex items-center justify-between px-4 py-3 hover:bg-orange-50 transition-colors border-b border-slate-50 last:border-0 text-left"
                        >
                          <div>
                            <div className="font-semibold text-slate-800 text-sm">{p.name}</div>
                            <div className="text-[11px] text-slate-400">{p.brand} · {p.rack} · Stock: {p.stock} {p.unit}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-orange-600">₹{p.retailPrice}</div>
                            <div className="text-[11px] text-slate-400">GST {p.gstRate}%</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Section>

            {/* Cart Table */}
            <Section title={`Cart — ${cart.length} items`}>
              {cart.length === 0 ? (
                <div className="p-10 text-center text-slate-400 text-sm">Search and add products above</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50">
                        {['#', 'Product', 'Rate', 'Qty', 'Disc%', 'Amount', ''].map(h => (
                          <th key={h} className="text-left px-3 py-2.5 text-[11px] font-semibold text-slate-500 uppercase">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item, idx) => {
                        const amt = item.qty * item.rate * (1 - item.discount / 100);
                        return (
                          <tr key={item.product.id} className="border-t border-slate-50 hover:bg-orange-50/30">
                            <td className="px-3 py-2 text-slate-400 text-xs">{idx + 1}</td>
                            <td className="px-3 py-2">
                              <div className="font-medium text-slate-800">{item.product.name}</div>
                              <div className="text-[11px] text-slate-400">{item.product.brand} · GST {item.product.gstRate}%</div>
                            </td>
                            <td className="px-3 py-2 font-semibold text-slate-700">₹{item.rate.toFixed(2)}</td>
                            <td className="px-3 py-2">
                              <input
                                type="number" min={1}
                                value={item.qty}
                                onChange={e => updateCart(item.product.id, 'qty', Number(e.target.value))}
                                className="w-16 px-2 py-1 rounded-lg border border-slate-200 text-center font-bold focus:outline-none focus:ring-2 focus:ring-orange-400/30"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="number" min={0} max={100}
                                value={item.discount}
                                onChange={e => updateCart(item.product.id, 'discount', Number(e.target.value))}
                                className="w-16 px-2 py-1 rounded-lg border border-slate-200 text-center focus:outline-none focus:ring-2 focus:ring-orange-400/30"
                              />
                            </td>
                            <td className="px-3 py-2 font-bold text-slate-800">₹{amt.toFixed(2)}</td>
                            <td className="px-3 py-2">
                              <button onClick={() => removeFromCart(item.product.id)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Section>
          </div>

          {/* Right: Bill Summary */}
          <div className="space-y-4">
            <Section title="Bill Summary">
              <div className="p-4 space-y-3">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-slate-600"><span>Bill Type</span><Badge label={billType} variant="blue" /></div>
                  <div className="flex justify-between text-slate-600"><span>Payment</span><Badge label={paymentMode} variant={paymentMode === 'Cash' ? 'green' : 'orange'} /></div>
                  <div className="flex justify-between text-slate-600"><span>Customer</span><span className="font-medium text-slate-800 truncate max-w-[120px]">{selectedCustomer?.name || 'Walk-in'}</span></div>
                  <div className="flex justify-between text-slate-600"><span>Price Type</span><span className="text-xs font-medium text-purple-600">{priceType}</span></div>
                </div>
                <div className="border-t border-slate-100 pt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-slate-600">Subtotal</span><span className="font-semibold">₹{subtotal.toFixed(2)}</span></div>
                  {billType === 'GST Bill' && (
                    <>
                      <div className="flex justify-between text-slate-500 text-xs"><span>CGST (9%)</span><span>₹{gstAmt.toFixed(2)}</span></div>
                      <div className="flex justify-between text-slate-500 text-xs"><span>SGST (9%)</span><span>₹{gstAmt.toFixed(2)}</span></div>
                    </>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t border-slate-200 pt-2 mt-2">
                    <span>Total</span>
                    <span className="text-orange-600">₹{total.toFixed(2)}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Note</label>
                  <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Add note…" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400/30" />
                </div>
                <button
                  disabled={cart.length === 0}
                  onClick={() => setBillSaved(true)}
                  className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold text-base hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  Save Bill (F8)
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1">
                    <Printer size={13} /> Print Preview
                  </button>
                  <button onClick={() => { setCart([]); setStep('setup'); }} className="py-2 border border-red-200 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 flex items-center justify-center gap-1">
                    <X size={13} /> Cancel Bill
                  </button>
                </div>
              </div>
            </Section>

            <Section title="Quick Stats">
              <div className="p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Items</span><span className="font-bold">{cart.length}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Total Qty</span><span className="font-bold">{cart.reduce((s, i) => s + i.qty, 0)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Discount</span><span className="font-bold text-red-500">₹{cart.reduce((s, i) => s + i.qty * i.rate * (i.discount / 100), 0).toFixed(2)}</span></div>
              </div>
            </Section>
          </div>
        </div>
      )}
    </div>
  );
}
