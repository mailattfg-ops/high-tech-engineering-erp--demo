import { useState } from 'react';
import { Plus, Shield, Trophy } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { Badge, Section, PageHeader } from '../components/shared/UIComponents';
import { sampleCustomers, sampleSalesmen, staffLeaderboard } from '../data/mockData';

interface OutletCtx { darkMode: boolean; handleRefresh: () => void; toast: (msg: string, type?: 'success'|'error'|'info'|'warning') => void; }

// unused roles array removed

const staffList = [
  { id: 'U001', name: 'Rajan Thomas', role: 'Manager', userId: 'rajan_t', mobile: '9876543200', firm: 'Hi Tech Engineering - Main', active: true, commission: 3 },
  { id: 'U002', name: 'Arun Kumar', role: 'Salesman', userId: 'arun_k', mobile: '9876543201', firm: 'Hi Tech Engineering - Main', active: true, commission: 2 },
  { id: 'U003', name: 'Priya Menon', role: 'Sales Assistant', userId: 'priya_m', mobile: '9876543202', firm: 'Hi Tech Electricals', active: true, commission: 1.5 },
  { id: 'U004', name: 'Sini Raj', role: 'Sales Assistant', userId: 'sini_r', mobile: '9876543203', firm: 'Hi Tech Plumbing Supplies', active: true, commission: 1.5 },
  { id: 'U005', name: 'Biju Nair', role: 'Contractor', userId: 'biju_n', mobile: '9876543204', firm: 'Hi Tech Engineering - Main', active: false, commission: 0 },
];

const permissions = [
  { key: 'product_create', label: 'Product Creation' },
  { key: 'reports', label: 'View Reports' },
  { key: 'account_create', label: 'Account Creation' },
  { key: 'stock_edit', label: 'Stock Edit' },
  { key: 'price_edit', label: 'Price Edit' },
  { key: 'day_unlock', label: 'Day Unlock' },
];

export default function CRM() {
  const {} = useOutletContext<OutletCtx>();
  const [tab, setTab] = useState<'customers' | 'staff' | 'commission' | 'leaderboard'>('customers');
  const [selectedStaff, setSelectedStaff] = useState<typeof staffList[0] | null>(null);

  const permissionMap: Record<string, Record<string, boolean>> = {
    Manager: { product_create: true, reports: true, account_create: true, stock_edit: true, price_edit: true, day_unlock: true },
    'Assistant Manager': { product_create: true, reports: true, account_create: true, stock_edit: true, price_edit: false, day_unlock: false },
    Salesman: { product_create: false, reports: false, account_create: false, stock_edit: false, price_edit: false, day_unlock: false },
    'Sales Assistant': { product_create: false, reports: false, account_create: false, stock_edit: false, price_edit: false, day_unlock: false },
    Contractor: { product_create: false, reports: false, account_create: false, stock_edit: false, price_edit: false, day_unlock: false },
    Party: { product_create: false, reports: false, account_create: false, stock_edit: false, price_edit: false, day_unlock: false },
  };

  return (
    <div className="p-5 min-h-full bg-slate-50">
      <PageHeader
        title="CRM & Staff Management"
        subtitle="Customers, staff roles, commissions & leaderboard"
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 shadow-sm">
            <Plus size={15} /> Add User
          </button>
        }
      />

      <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-5 w-fit flex-wrap">
        {(['customers', 'staff', 'commission', 'leaderboard'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
            {t === 'commission' ? 'TOD Commission' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* CUSTOMERS */}
      {tab === 'customers' && (
        <Section title="Customer / Party Directory">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  {['Customer', 'Mobile', 'Type', 'GSTIN', 'City', 'Credit Limit', 'Balance', 'Price Type', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sampleCustomers.map(c => (
                  <tr key={c.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">{c.name}</div>
                      <div className="text-[11px] text-slate-400">{c.id}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-blue-600">{c.mobile}</td>
                    <td className="px-4 py-3">
                      <Badge label={c.type} variant={c.type === 'Project' ? 'purple' : c.type === 'Wholesale' ? 'blue' : 'gray'} />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{c.gstin || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{c.city}</td>
                    <td className="px-4 py-3 font-medium text-slate-700">₹{c.credit.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 font-bold">
                      <span className={c.balance < 0 ? 'text-red-600' : 'text-green-600'}>
                        ₹{Math.abs(c.balance).toLocaleString('en-IN')} {c.balance < 0 ? '↓' : '↑'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-purple-600 font-medium">{c.priceType}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button className="text-xs text-blue-600 hover:underline">Ledger</button>
                      <button className="text-xs text-slate-500 hover:underline">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* STAFF */}
      {tab === 'staff' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Section title="Staff Members & Access Control">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      {['Name', 'Role', 'User ID', 'Mobile', 'Firm', 'Status', 'Permissions'].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.map(s => (
                      <tr key={s.id} className={`border-t border-slate-50 hover:bg-orange-50/30 transition-colors cursor-pointer ${selectedStaff?.id === s.id ? 'bg-orange-50' : ''}`}
                        onClick={() => setSelectedStaff(s)}>
                        <td className="px-4 py-3 font-semibold text-slate-800">{s.name}</td>
                        <td className="px-4 py-3">
                          <Badge label={s.role} variant={s.role === 'Manager' ? 'purple' : s.role.includes('Assistant') ? 'blue' : 'gray'} />
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-500">{s.userId}</td>
                        <td className="px-4 py-3 font-mono text-sm text-blue-600">{s.mobile}</td>
                        <td className="px-4 py-3 text-xs text-slate-600">{s.firm}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold ${s.active ? 'text-green-600' : 'text-slate-400'}`}>
                            {s.active ? '● Active' : '○ Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800">
                            <Shield size={12} /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          </div>

          {/* Permission Panel */}
          <div>
            <Section title={selectedStaff ? `Permissions: ${selectedStaff.name}` : 'Select staff to view permissions'}>
              {selectedStaff ? (
                <div className="p-4 space-y-2">
                  <div className="text-xs font-semibold text-slate-500 mb-3">Role: {selectedStaff.role}</div>
                  {permissions.map(p => {
                    const allowed = permissionMap[selectedStaff.role]?.[p.key] ?? false;
                    return (
                      <div key={p.key} className={`flex items-center justify-between px-3 py-2.5 rounded-lg ${allowed ? 'bg-green-50 border border-green-100' : 'bg-slate-50 border border-slate-100'}`}>
                        <span className={`text-sm font-medium ${allowed ? 'text-green-800' : 'text-slate-500'}`}>{p.label}</span>
                        <span className={`text-xs font-bold ${allowed ? 'text-green-600' : 'text-slate-400'}`}>{allowed ? '✓ Allowed' : '✗ Denied'}</span>
                      </div>
                    );
                  })}
                  <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700">
                    Entry creator lock & day lock are enabled for all roles. Audit log is permanent and undeletable.
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 text-sm">
                  <Shield size={32} className="mx-auto mb-2 text-slate-300" />
                  Click a staff member to view their permissions
                </div>
              )}
            </Section>
          </div>
        </div>
      )}

      {/* COMMISSION */}
      {tab === 'commission' && (
        <div className="space-y-4 max-w-3xl">
          <Section title="TOD Commission Settings">
            <div className="p-5 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
                <strong>Commission Formula:</strong> Configurable % of net realized profit from closed, non-due invoices after sales return & GST/discount deduction.
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    {['Role', 'Commission %', 'Base', 'Applicable On', 'Edit'].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { role: 'Manager', pct: 3, base: 'Net Profit', on: 'All closed bills' },
                    { role: 'Assistant Manager', pct: 2, base: 'Net Profit', on: 'All closed bills' },
                    { role: 'Salesman', pct: 2, base: 'Net Profit', on: 'Own bills only' },
                    { role: 'Sales Assistant', pct: 1.5, base: 'Net Profit', on: 'Assisted bills' },
                    { role: 'Contractor', pct: 1, base: 'Net Sales', on: 'Referred bills' },
                    { role: 'Due Manager', pct: 0.5, base: 'Net Profit', on: 'Due closed bills' },
                  ].map(r => (
                    <tr key={r.role} className="border-t border-slate-50 hover:bg-slate-50">
                      <td className="px-4 py-3"><Badge label={r.role} variant="purple" /></td>
                      <td className="px-4 py-3">
                        <input type="number" defaultValue={r.pct} step={0.5} className="w-20 px-2 py-1 rounded border border-slate-200 text-sm text-center font-bold focus:outline-none focus:ring-2 focus:ring-orange-400/30" />
                        <span className="ml-1 text-slate-500 text-xs">%</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-xs">{r.base}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{r.on}</td>
                      <td className="px-4 py-3">
                        <button className="text-xs text-orange-500 hover:underline font-medium">Save</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Sales Volume Points System">
            <div className="p-5">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm text-purple-700 mb-4">
                <strong>Rule:</strong> Every ₹100 net sales = 1 Point. Net Sales = Sales − Returns − Discount. Applies to Salesman & Sales Assistant.
              </div>
              <div className="grid grid-cols-2 gap-4">
                {sampleSalesmen.filter(s => s.role.includes('Salesman') || s.role.includes('Assistant')).map(s => (
                  <div key={s.id} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{s.name}</div>
                        <div className="text-xs text-slate-500">{s.role}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                      <div className="bg-white rounded-lg p-2 text-center">
                        <div className="text-[11px] text-slate-500">Points</div>
                        <div className="font-bold text-purple-600 text-lg">{Math.floor(Math.random() * 3000 + 1000)}</div>
                      </div>
                      <div className="bg-white rounded-lg p-2 text-center">
                        <div className="text-[11px] text-slate-500">Commission</div>
                        <div className="font-bold text-green-600 text-lg">₹{(Math.random() * 5000 + 2000).toFixed(0)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* LEADERBOARD */}
      {tab === 'leaderboard' && (
        <Section title="Sales Leaderboard — May 2025">
          <div className="p-5">
            <div className="space-y-3">
              {staffLeaderboard.sort((a, b) => b.sales - a.sales).map((s, i) => (
                <div key={s.name} className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:shadow-md
                  ${i === 0 ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200' : 'bg-white border-slate-100'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                    ${i === 0 ? 'bg-amber-400 text-white' : i === 1 ? 'bg-slate-400 text-white' : 'bg-orange-300 text-white'}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{s.name}</span>
                      {i === 0 && <Trophy size={14} className="text-amber-500" />}
                    </div>
                    <div className="text-xs text-slate-500">{s.role}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-[11px] text-slate-500">Net Sales</div>
                      <div className="font-bold text-slate-800">₹{(s.sales / 1000).toFixed(0)}K</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500">Points</div>
                      <div className="font-bold text-blue-600">{s.points.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500">Commission</div>
                      <div className="font-bold text-green-600">₹{s.commission.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                  <div className="w-32">
                    <div className="bg-slate-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-orange-400 transition-all"
                        style={{ width: `${(s.sales / staffLeaderboard[0].sales) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}
    </div>
  );
}
