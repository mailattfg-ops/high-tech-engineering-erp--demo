import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  TrendingUp, TrendingDown, ShoppingBag, CreditCard,
  AlertTriangle, Package, Clock, ArrowRight, Wallet,
  DollarSign, Activity, RefreshCw, Download, Bell
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { StatCard, Badge, Section, PageHeader, formatCurrency } from '../components/shared/UIComponents';
import {
  dashboardData, salesTrendData, categoryData,
  dueBillsData, recentSales, staffLeaderboard
} from '../data/mockData';

const COLORS = ['#f97316', '#3b82f6', '#22c55e', '#a855f7'];

interface OutletCtx { darkMode: boolean; handleRefresh: () => void; toast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void; }

export default function Dashboard() {
  const { toast, handleRefresh } = useOutletContext<OutletCtx>();

  return (
    <div className="p-5 space-y-5 min-h-full bg-slate-50">
      <PageHeader
        title="Dashboard"
        subtitle="Hi Tech Engineering · Today, 19 May 2025"
        actions={
          <div className="flex gap-2">
            <button onClick={() => toast('Exporting report…', 'info')} className="flex items-center gap-2 text-sm border border-slate-200 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
              <Download size={14} /> Export
            </button>
            <button onClick={handleRefresh} className="flex items-center gap-2 text-sm bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-sm">
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        }
      />

      {/* Alert Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
        <AlertTriangle size={18} className="text-amber-500 flex-shrink-0" />
        <div className="text-sm text-amber-800 font-medium flex-1">
          <span className="font-bold">Alerts:</span> 2 products have negative stock · 14 due bills pending · 8 dead stock items · Low stock on Supreme Pipes (5 pcs)
        </div>
        <button onClick={() => toast('Sending due reminders via WhatsApp…', 'success')} className="flex-shrink-0 text-xs bg-amber-500 text-white px-3 py-1.5 rounded-lg hover:bg-amber-600 font-medium flex items-center gap-1">
          <Bell size={12} /> Send Reminders
        </button>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard label="Cash Sales" value={formatCurrency(dashboardData.cashSales)} icon={<ShoppingBag size={18} className="text-green-600" />} color="bg-green-100" trend={12} />
        <StatCard label="Credit Sales" value={formatCurrency(dashboardData.creditSales)} icon={<CreditCard size={18} className="text-blue-600" />} color="bg-blue-100" trend={8} />
        <StatCard label="Cash Purchase" value={formatCurrency(dashboardData.cashPurchase)} icon={<Wallet size={18} className="text-purple-600" />} color="bg-purple-100" trend={-3} />
        <StatCard label="Credit Purchase" value={formatCurrency(dashboardData.creditPurchase)} icon={<DollarSign size={18} className="text-orange-600" />} color="bg-orange-100" trend={5} />
        <StatCard label="Balance" value={formatCurrency(dashboardData.balance)} icon={<Activity size={18} className="text-teal-600" />} color="bg-teal-100" trend={18} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Receivable (Due)" value={formatCurrency(dashboardData.receivable)} sub="14 bills pending" icon={<TrendingUp size={18} className="text-amber-600" />} color="bg-amber-100" />
        <StatCard label="Payable (Due)" value={formatCurrency(dashboardData.payable)} icon={<TrendingDown size={18} className="text-red-600" />} color="bg-red-100" />
        <StatCard label="Stock Value" value={formatCurrency(dashboardData.stockValue)} icon={<Package size={18} className="text-indigo-600" />} color="bg-indigo-100" trend={4} />
        <StatCard label="Negative Stock" value={`${dashboardData.negativeStock} SKUs`} sub={`${dashboardData.deadStock} dead stock`} icon={<AlertTriangle size={18} className="text-red-600" />} color="bg-red-100" alert />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Sales & Profit Trend" className="lg:col-span-2" action={
          <button onClick={() => toast('Sales trend report exported', 'success')} className="text-xs text-orange-500 hover:text-orange-700 font-medium flex items-center gap-1"><Download size={12} /> Export</button>
        }>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={salesTrendData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="gSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}K`} />
                <Tooltip formatter={(v: any) => [`₹${v.toLocaleString('en-IN')}`, '']} contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="sales" name="Sales" stroke="#f97316" strokeWidth={2.5} fill="url(#gSales)" dot={false} />
                <Area type="monotone" dataKey="profit" name="Profit" stroke="#22c55e" strokeWidth={2} fill="url(#gProfit)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Category-wise Sales">
          <div className="p-4 flex flex-col items-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" onClick={(d) => toast(`${d.name}: ${d.value}% of total sales`, 'info')}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} className="cursor-pointer" />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, '']} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 w-full mt-2">
              {categoryData.map((c, i) => (
                <button key={c.name} onClick={() => toast(`${c.name}: ${c.value}% of sales`, 'info')} className="flex items-center gap-2 text-xs hover:bg-slate-50 rounded-lg px-1 py-0.5 transition-colors text-left">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
                  <span className="text-slate-600">{c.name}</span>
                  <span className="font-bold text-slate-800 ml-auto">{c.value}%</span>
                </button>
              ))}
            </div>
          </div>
        </Section>
      </div>

      <Section title="Purchase Trend (₹)" action={
        <button onClick={() => toast('Purchase trend exported', 'success')} className="text-xs text-orange-500 font-medium flex items-center gap-1"><Download size={12} /> Export</button>
      }>
        <div className="px-4 pb-4">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={salesTrendData} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}K`} />
              <Tooltip formatter={(v: any) => [`₹${v.toLocaleString('en-IN')}`, '']} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              <Bar dataKey="purchase" name="Purchase" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Section>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section title="Recent Sales" action={
          <button onClick={() => toast('Navigating to full sales report…', 'info')} className="text-xs text-orange-500 hover:text-orange-700 flex items-center gap-1 font-medium">
            View All <ArrowRight size={12} />
          </button>
        }>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  {['Bill No', 'Customer', 'Amount', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentSales.map(s => (
                  <tr key={s.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => toast(`Bill ${s.id} — ₹${s.amount.toLocaleString('en-IN')} · ${s.status}`, 'info')}>
                    <td className="px-4 py-3 font-mono text-xs text-blue-600 font-medium">{s.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{s.customer}</div>
                      <div className="text-[11px] text-slate-400">{s.salesman} · {s.billType}</div>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-800">₹{s.amount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <Badge label={s.status} variant={s.status === 'Paid' ? 'green' : s.status === 'Due' ? 'red' : 'yellow'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Outstanding Due Bills" action={<Badge label="14 Total" variant="orange" />}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  {['Customer', 'Amount', 'Overdue', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dueBillsData.map(b => (
                  <tr key={b.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800 text-xs">{b.customer}</div>
                      <div className="text-[11px] text-slate-400">{b.id}</div>
                    </td>
                    <td className="px-4 py-3 font-bold text-red-600">₹{b.amount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className={b.days > 30 ? 'text-red-500' : 'text-amber-500'} />
                        <span className={`text-xs font-semibold ${b.days > 30 ? 'text-red-600' : 'text-amber-600'}`}>{b.days}d ago</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toast(`Reminder sent to ${b.customer} for ₹${b.amount.toLocaleString('en-IN')}`, 'success')}
                        className="text-[11px] font-semibold text-orange-500 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-2 py-1 rounded-lg transition-colors">
                        Remind
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>

      {/* Staff Leaderboard */}
      <Section title="Staff Sales Leaderboard — May 2025" action={
        <button onClick={() => toast('Full leaderboard exported', 'success')} className="text-xs text-orange-500 font-medium flex items-center gap-1"><Download size={12} /> Export</button>
      }>
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {staffLeaderboard.map((s, i) => (
              <div key={s.name} onClick={() => toast(`${s.name}: ${s.points} points, ₹${s.commission.toLocaleString('en-IN')} commission`, 'info')}
                className="bg-slate-50 rounded-xl p-4 border border-slate-100 cursor-pointer hover:border-orange-200 hover:bg-orange-50/30 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold
                    ${i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-slate-400' : 'bg-orange-300'}`}>{i + 1}</div>
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">{s.name}</div>
                    <div className="text-[11px] text-slate-500">{s.role}</div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs"><span className="text-slate-500">Net Sales</span><span className="font-bold text-slate-800">₹{(s.sales / 1000).toFixed(0)}K</span></div>
                  <div className="flex justify-between text-xs"><span className="text-slate-500">Points</span><span className="font-bold text-blue-600">{s.points.toLocaleString()}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-slate-500">Commission</span><span className="font-bold text-green-600">₹{s.commission.toLocaleString('en-IN')}</span></div>
                </div>
                <div className="mt-3 bg-white rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-orange-400 transition-all" style={{ width: `${(s.sales / staffLeaderboard[0].sales) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
