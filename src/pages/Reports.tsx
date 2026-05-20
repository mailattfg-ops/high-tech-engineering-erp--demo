import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, Filter, TrendingUp } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { Badge, Section, PageHeader } from '../components/shared/UIComponents';
import { sampleProducts, recentSales, dueBillsData } from '../data/mockData';

interface OutletCtx { darkMode: boolean; handleRefresh: () => void; toast: (msg: string, type?: 'success'|'error'|'info'|'warning') => void; }

const reportTypes = ['Sales Report', 'Purchase Report', 'Stock Report', 'Profit Report', 'Receivable Report', 'Discount Report', 'Product Report'];

const agingData = [
  { range: '0–7 days', amount: 34500, bills: 4 },
  { range: '7–15 days', amount: 28200, bills: 3 },
  { range: '15–30 days', amount: 45800, bills: 5 },
  { range: '30–60 days', amount: 89600, bills: 2 },
  { range: '60+ days', amount: 12500, bills: 1 },
];

const productSalesData = sampleProducts.slice(0, 6).map(p => ({
  name: p.name.length > 20 ? p.name.slice(0, 18) + '…' : p.name,
  sales: Math.floor(Math.random() * 50000 + 10000),
  purchase: Math.floor(Math.random() * 30000 + 8000),
}));

const categorySalesData = [
  { category: 'Electricals', sales: 186000, purchase: 128000, profit: 58000 },
  { category: 'Plumbing', sales: 124000, purchase: 88000, profit: 36000 },
  { category: 'Hardware', sales: 78000, purchase: 54000, profit: 24000 },
  { category: 'Building Mat.', sales: 54000, purchase: 38000, profit: 16000 },
];

export default function Reports() {
  const {} = useOutletContext<OutletCtx>();
  const [activeReport, setActiveReport] = useState('Sales Report');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterSalesman, setFilterSalesman] = useState('All');
  const [dateFrom, setDateFrom] = useState('2025-05-01');
  const [dateTo, setDateTo] = useState('2025-05-19');

  return (
    <div className="p-5 min-h-full bg-slate-50">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Advanced multi-dimensional business intelligence"
        actions={
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Download size={14} /> Export Excel
          </button>
        }
      />

      {/* Report Type Selector */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {reportTypes.map(r => (
          <button key={r} onClick={() => setActiveReport(r)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeReport === r ? 'bg-orange-500 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-300 hover:text-orange-600'}`}>
            {r}
          </button>
        ))}
      </div>

      {/* Global Filters */}
      <Section className="mb-4">
        <div className="flex flex-wrap items-center gap-3 px-4 py-3">
          <Filter size={14} className="text-slate-400" />
          <span className="text-sm font-semibold text-slate-600">Filters:</span>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30" />
          <span className="text-slate-400 text-sm">to</span>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30" />
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 bg-white">
            {['All', 'Electricals', 'Plumbing', 'Hardware', 'Building Materials'].map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={filterSalesman} onChange={e => setFilterSalesman(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 bg-white">
            {['All', 'Arun Kumar', 'Priya Menon', 'Rajan Thomas', 'Sini Raj'].map(s => <option key={s}>{s}</option>)}
          </select>
          <button className="px-4 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600">Apply</button>
        </div>
      </Section>

      {/* SALES REPORT */}
      {activeReport === 'Sales Report' && (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Total Sales', value: '₹8,52,700', sub: '48 Bills', color: 'bg-blue-100 text-blue-600' },
              { label: 'GST Bills', value: '₹5,68,200', sub: '28 Bills', color: 'bg-green-100 text-green-600' },
              { label: 'Non-GST Bills', value: '₹2,84,500', sub: '20 Bills', color: 'bg-orange-100 text-orange-600' },
              { label: 'Net Profit', value: '₹1,27,000', sub: '14.9% margin', color: 'bg-purple-100 text-purple-600' },
            ].map(c => (
              <div key={c.label} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${c.color}`}>
                  <TrendingUp size={16} />
                </div>
                <div className="text-xl font-bold text-slate-800">{c.value}</div>
                <div className="text-xs text-slate-500">{c.label}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{c.sub}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Category Sales */}
            <Section title="Category-wise Sales">
              <div className="p-4">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={categorySalesData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}K`} />
                    <Tooltip formatter={(v: any) => [`₹${v.toLocaleString('en-IN')}`, '']} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="sales" name="Sales" fill="#f97316" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="profit" name="Profit" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Section>

            {/* Product-wise */}
            <Section title="Top Product Sales">
              <div className="p-4">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={productSalesData} layout="vertical" margin={{ top: 4, right: 4, bottom: 0, left: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}K`} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} width={60} />
                    <Tooltip formatter={(v: any) => [`₹${v.toLocaleString('en-IN')}`, '']} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                    <Bar dataKey="sales" name="Sales" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Section>
          </div>

          {/* Bill-wise table */}
          <Section title="Bill-wise Sales Details">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    {['Bill No', 'Date', 'Customer', 'Salesman', 'Type', 'Amount', 'Status'].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentSales.map(s => (
                    <tr key={s.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-blue-600">{s.id}</td>
                      <td className="px-4 py-3 text-slate-500">{s.date}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{s.customer}</td>
                      <td className="px-4 py-3 text-slate-600">{s.salesman}</td>
                      <td className="px-4 py-3"><Badge label={s.billType} variant="blue" /></td>
                      <td className="px-4 py-3 font-bold text-slate-800">₹{s.amount.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3"><Badge label={s.status} variant={s.status === 'Paid' ? 'green' : s.status === 'Due' ? 'red' : 'yellow'} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      )}

      {/* RECEIVABLE REPORT */}
      {activeReport === 'Receivable Report' && (
        <div className="space-y-4">
          <Section title="Receivable Aging Analysis">
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-6">
                {agingData.map(a => (
                  <div key={a.range} className={`rounded-xl p-4 text-center border ${
                    a.range === '60+ days' ? 'bg-red-50 border-red-200' :
                    a.range === '30–60 days' ? 'bg-orange-50 border-orange-200' :
                    'bg-green-50 border-green-200'
                  }`}>
                    <div className="text-[11px] font-semibold text-slate-500 mb-1">{a.range}</div>
                    <div className={`text-lg font-bold ${a.range === '60+ days' ? 'text-red-700' : a.range === '30–60 days' ? 'text-orange-700' : 'text-green-700'}`}>
                      ₹{(a.amount / 1000).toFixed(0)}K
                    </div>
                    <div className="text-[11px] text-slate-500">{a.bills} bills</div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
          <Section title="Due Bills — Customer-wise">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    {['Customer', 'Bill No', 'Bill Type', 'Amount', 'Due Date', 'Overdue Days', 'Action'].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dueBillsData.map(b => (
                    <tr key={b.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-800">{b.customer}</td>
                      <td className="px-4 py-3 font-mono text-xs text-blue-600">{b.id}</td>
                      <td className="px-4 py-3"><Badge label={b.type} variant="blue" /></td>
                      <td className="px-4 py-3 font-bold text-red-600">₹{b.amount.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-slate-500">{b.due}</td>
                      <td className="px-4 py-3">
                        <Badge label={`${b.days} days`} variant={b.days > 30 ? 'red' : b.days > 15 ? 'orange' : 'yellow'} />
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button className="text-xs text-green-600 font-medium hover:underline">Collect</button>
                        <button className="text-xs text-blue-600 font-medium hover:underline">Remind</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      )}

      {/* STOCK REPORT */}
      {activeReport === 'Stock Report' && (
        <Section title="Stock Status Report">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  {['Product', 'Category', 'Rack', 'Current Stock', 'Min Stock', 'Max Stock', 'Value', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sampleProducts.map(p => {
                  const isNeg = p.stock <= 0;
                  const isLow = p.stock > 0 && p.stock <= p.minStock;
                  const isDead = p.stock > p.maxStock * 0.8;
                  return (
                    <tr key={p.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{p.name}</div>
                        <div className="text-[11px] text-slate-400">{p.brand}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{p.category}</td>
                      <td className="px-4 py-3 font-mono text-xs text-blue-500">{p.rack}</td>
                      <td className="px-4 py-3 font-bold">
                        <span className={isNeg ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-green-600'}>
                          {p.stock} {p.unit}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{p.minStock}</td>
                      <td className="px-4 py-3 text-slate-500">{p.maxStock}</td>
                      <td className="px-4 py-3 font-bold text-slate-700">₹{(p.stock * p.purchasePrice).toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3">
                        {isNeg && <Badge label="Negative" variant="red" />}
                        {isLow && <Badge label="Low Stock" variant="yellow" />}
                        {isDead && !isNeg && !isLow && <Badge label="Dead Stock" variant="gray" />}
                        {!isNeg && !isLow && !isDead && <Badge label="Normal" variant="green" />}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* Other reports as placeholder */}
      {!['Sales Report', 'Receivable Report', 'Stock Report'].includes(activeReport) && (
        <Section title={activeReport}>
          <div className="p-10 text-center text-slate-400">
            <TrendingUp size={48} className="mx-auto mb-3 text-slate-200" />
            <div className="text-base font-medium text-slate-500 mb-1">{activeReport} — Interactive View</div>
            <div className="text-sm">Apply filters above and click Apply to generate the report.</div>
            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3 text-left">
              {['Category-wise', 'Company-wise', 'Product-wise', 'Salesman-wise'].map(f => (
                <div key={f} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm">
                  <div className="font-semibold text-slate-700 mb-1">{f}</div>
                  <div className="text-[11px] text-slate-400">Filter dimension available</div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}
    </div>
  );
}
