import { useState } from 'react';
import { Smartphone, Camera, CheckCircle, Package, MapPin, ArrowRight, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { Badge, Section, PageHeader } from '../components/shared/UIComponents';
import { sampleProducts } from '../data/mockData';

interface OutletCtx { darkMode: boolean; handleRefresh: () => void; toast: (msg: string, type?: 'success'|'error'|'info'|'warning') => void; }

type ScanStep = 'idle' | 'scanning' | 'found' | 'qty' | 'done';

const recentScans = [
  { time: '14:32', product: 'Anchor Roma 6A Switch', rack: 'A-01', qty: 24, action: 'Purchase Entry' },
  { time: '14:28', product: 'Havells 10A MCB', rack: 'A-03', qty: 10, action: 'Stock Count' },
  { time: '14:15', product: 'Finolex 1.5 sq mm Wire', rack: 'B-01', qty: 5, action: 'Purchase Entry' },
  { time: '13:55', product: 'Astral 3/4" CPVC Elbow', rack: 'C-02', qty: 100, action: 'Stock Count' },
];

export default function MobileBarcode() {
  const { toast } = useOutletContext<OutletCtx>();
  const [scanStep, setScanStep] = useState<ScanStep>('idle');
  const [scannedProduct, setScannedProduct] = useState<typeof sampleProducts[0] | null>(null);
  const [qty, setQty] = useState(1);
  const [action, setAction] = useState('Purchase Entry');
  const [isOnline, setIsOnline] = useState(true);
  const [offlineBills] = useState(3);

  const simulateScan = () => {
    setScanStep('scanning');
    setTimeout(() => {
      const randomProduct = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
      setScannedProduct(randomProduct);
      setScanStep('found');
    }, 1500);
  };

  const handleConfirm = () => {
    setScanStep('qty');
  };

  const handleSave = () => {
    toast(`${action} saved: ${qty} × ${scannedProduct?.name} · ${isOnline ? 'Synced' : 'Queued for sync'}`, 'success');
    setScanStep('done');
    setTimeout(() => {
      setScanStep('idle');
      setScannedProduct(null);
      setQty(1);
    }, 2500);
  };

  return (
    <div className="p-5 min-h-full bg-slate-50">
      <PageHeader
        title="Mobile Barcode Workflow"
        subtitle="Scan rack barcodes for purchase entry & stock counting"
        actions={
          <button
          onClick={() => { setIsOnline(!isOnline); toast(isOnline ? 'Switched to Offline mode — entries will be queued' : 'Back Online — syncing queued entries…', isOnline ? 'warning' : 'success'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
          >
            {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
            {isOnline ? 'Online' : `Offline (${offlineBills} queued)`}
          </button>
        }
      />

      {!isOnline && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3 mb-4">
          <WifiOff size={16} className="text-amber-500 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <strong>Offline Mode Active.</strong> {offlineBills} entries queued for sync when connection is restored.
          </div>
          <button onClick={() => toast('Syncing 3 queued entries…', 'info')} className="ml-auto flex items-center gap-1 text-xs text-amber-700 border border-amber-300 px-3 py-1.5 rounded-lg hover:bg-amber-100">
            <RefreshCw size={12} /> Sync Now
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Scanner Panel — Mobile Phone Preview */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-transparent pointer-events-none" />
            <div className="text-center mb-4">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Hi Tech ERP Mobile</div>
              <div className="text-white font-bold text-lg">Barcode Scanner</div>
            </div>

            {/* Scanner Viewfinder */}
            <div className="relative aspect-square bg-black rounded-2xl overflow-hidden mb-4 border border-slate-700">
              {scanStep === 'idle' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <Camera size={48} className="text-slate-600" />
                  <div className="text-slate-500 text-sm">Ready to scan</div>
                </div>
              )}
              {scanStep === 'scanning' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-48 h-48 border-2 border-orange-500 rounded-xl relative">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-orange-400 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-orange-400 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-orange-400 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-orange-400 rounded-br-lg" />
                    <div className="absolute w-full h-0.5 bg-orange-500 opacity-80 top-1/2 animate-bounce" />
                  </div>
                  <div className="text-orange-400 text-sm mt-3 animate-pulse">Scanning…</div>
                </div>
              )}
              {(scanStep === 'found' || scanStep === 'qty') && scannedProduct && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-900">
                  <CheckCircle size={36} className="text-green-400 mb-3" />
                  <div className="text-green-400 text-xs font-semibold mb-2">PRODUCT FOUND</div>
                  <div className="text-white font-bold text-sm text-center mb-1">{scannedProduct.name}</div>
                  <div className="text-slate-400 text-xs text-center">{scannedProduct.brand}</div>
                  <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
                    <MapPin size={11} className="text-orange-400" />
                    <span>Rack: <strong className="text-orange-400">{scannedProduct.rack}</strong></span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Stock: <strong className={scannedProduct.stock <= scannedProduct.minStock ? 'text-red-400' : 'text-green-400'}>{scannedProduct.stock} {scannedProduct.unit}</strong>
                  </div>
                </div>
              )}
              {scanStep === 'done' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <CheckCircle size={48} className="text-green-400 mb-2" />
                  <div className="text-green-400 font-bold">Saved!</div>
                  <div className="text-slate-400 text-xs mt-1">{isOnline ? 'Synced' : 'Queued for sync'}</div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {scanStep === 'idle' && (
              <button onClick={simulateScan}
                className="w-full py-3.5 bg-orange-500 text-white rounded-2xl font-bold text-base hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30">
                <Camera size={20} /> Scan Barcode
              </button>
            )}
            {scanStep === 'scanning' && (
              <button onClick={() => setScanStep('idle')}
                className="w-full py-3 bg-slate-700 text-slate-300 rounded-2xl font-medium text-sm hover:bg-slate-600 transition-colors">
                Cancel
              </button>
            )}
            {scanStep === 'found' && (
              <div className="space-y-2">
                <div className="text-slate-400 text-xs text-center mb-2">Action type:</div>
                <select value={action} onChange={e => setAction(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-white text-sm focus:outline-none focus:border-orange-500">
                  {['Purchase Entry', 'Stock Count', 'Stock Edit', 'Sales Billing'].map(a => <option key={a}>{a}</option>)}
                </select>
                <button onClick={handleConfirm}
                  className="w-full py-3 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            )}
            {scanStep === 'qty' && (
              <div className="space-y-3">
                <div className="text-slate-400 text-xs text-center">Enter Quantity</div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-12 h-12 rounded-xl bg-slate-700 text-white text-2xl font-bold hover:bg-slate-600 flex items-center justify-center">−</button>
                  <input type="number" value={qty} onChange={e => setQty(Number(e.target.value))} min={1}
                    className="flex-1 h-12 rounded-xl bg-slate-800 border border-slate-600 text-white text-center text-2xl font-bold focus:outline-none focus:border-orange-500" />
                  <button onClick={() => setQty(q => q + 1)}
                    className="w-12 h-12 rounded-xl bg-orange-500 text-white text-2xl font-bold hover:bg-orange-600 flex items-center justify-center">+</button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 25, 50, 100, 200].map(n => (
                    <button key={n} onClick={() => setQty(n)}
                      className="py-1.5 rounded-lg bg-slate-700 text-slate-300 text-sm hover:bg-slate-600 transition-colors">{n}</button>
                  ))}
                </div>
                <button onClick={handleSave}
                  className="w-full py-3 bg-green-500 text-white rounded-2xl font-bold hover:bg-green-600 transition-colors">
                  Save Entry ({action})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right side: workflow info + recent scans */}
        <div className="lg:col-span-2 space-y-4">
          {/* Workflow */}
          <Section title="Mobile Scan Workflow">
            <div className="p-5">
              <div className="flex items-center gap-0 flex-wrap">
                {[
                  { step: '1', label: 'Scan Rack Barcode', desc: 'Point camera at rack barcode', color: 'bg-blue-500' },
                  { step: '2', label: 'Product Identified', desc: 'Auto-fetch product details', color: 'bg-orange-500' },
                  { step: '3', label: 'Select Action', desc: 'Purchase / Stock / Billing', color: 'bg-purple-500' },
                  { step: '4', label: 'Enter Quantity', desc: 'Type or use +/− buttons', color: 'bg-teal-500' },
                  { step: '5', label: 'Save & Sync', desc: 'Auto-sync or queue offline', color: 'bg-green-500' },
                ].map((s, i, arr) => (
                  <div key={s.step} className="flex items-center">
                    <div className="text-center">
                      <div className={`w-10 h-10 rounded-full ${s.color} flex items-center justify-center text-white font-bold text-sm mx-auto mb-1`}>
                        {s.step}
                      </div>
                      <div className="text-xs font-semibold text-slate-700 whitespace-nowrap">{s.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{s.desc}</div>
                    </div>
                    {i < arr.length - 1 && <ArrowRight size={16} className="text-slate-300 mx-2 flex-shrink-0 mb-4" />}
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* Offline Mode info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Section title="Offline Billing Support">
              <div className="p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <WifiOff size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-700 text-sm">Works Without Internet</div>
                    <div className="text-xs text-slate-500 mt-0.5">Billing continues when internet is unavailable. All entries are stored locally.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RefreshCw size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-700 text-sm">Auto-Sync on Reconnect</div>
                    <div className="text-xs text-slate-500 mt-0.5">When internet is restored, all queued entries sync automatically.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-700 text-sm">Stock Audit Trail</div>
                    <div className="text-xs text-slate-500 mt-0.5">All stock edits generate permanent audit reports with user & timestamp.</div>
                  </div>
                </div>
                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  <div className="text-xs font-bold text-amber-700">Queued Entries: {offlineBills}</div>
                  <div className="text-[11px] text-amber-600">Will sync when connected</div>
                </div>
              </div>
            </Section>

            <Section title="Scan Stats — Today">
              <div className="p-4 space-y-3">
                {[
                  { label: 'Total Scans', value: '47', color: 'text-blue-600' },
                  { label: 'Purchase Entries', value: '18', color: 'text-orange-600' },
                  { label: 'Stock Counts', value: '24', color: 'text-green-600' },
                  { label: 'Stock Edits', value: '5', color: 'text-purple-600' },
                ].map(s => (
                  <div key={s.label} className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">{s.label}</span>
                    <span className={`text-xl font-bold ${s.color}`}>{s.value}</span>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          {/* Recent Scans */}
          <Section title="Recent Scan History">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    {['Time', 'Product', 'Rack', 'Qty', 'Action'].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentScans.map((s, i) => (
                    <tr key={i} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{s.time}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{s.product}</td>
                      <td className="px-4 py-3 font-mono text-xs text-blue-500">{s.rack}</td>
                      <td className="px-4 py-3 font-bold text-slate-700">{s.qty}</td>
                      <td className="px-4 py-3">
                        <Badge label={s.action} variant={s.action === 'Purchase Entry' ? 'orange' : s.action === 'Stock Count' ? 'blue' : 'gray'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
