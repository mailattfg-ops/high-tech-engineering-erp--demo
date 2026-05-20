import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Truck, Users, BarChart3,
  Smartphone, Bell, Search, Menu, X, ChevronDown, LogOut, Settings,
  Building2, Sun, Moon, Zap, Shield, Lock, Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Package, label: 'Products', path: '/product-creation' },
  { icon: ShoppingCart, label: 'Billing', path: '/billing' },
  { icon: Truck, label: 'Purchase', path: '/purchase' },
  { icon: Users, label: 'CRM & Staff', path: '/crm' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
  { icon: Smartphone, label: 'Mobile Scan', path: '/mobile-barcode' },
];

const firms = ['Hi Tech Engineering - Main', 'Hi Tech Electricals', 'Hi Tech Plumbing Supplies'];

const notifications = [
  { id: 1, type: 'warning', text: '2 products have negative stock', time: '5m ago' },
  { id: 2, type: 'alert', text: '14 due bills pending collection', time: '1h ago' },
  { id: 3, type: 'info', text: 'Low stock: Supreme CPVC Pipe (5 pcs)', time: '2h ago' },
  { id: 4, type: 'info', text: 'PO-2025-0186 pending from Havells', time: '3h ago' },
  { id: 5, type: 'warning', text: 'Dead stock alert: 8 SKUs', time: '5h ago' },
  { id: 6, type: 'info', text: 'Quotation INV-Q-2025-012 awaiting approval', time: '1d ago' },
  { id: 7, type: 'alert', text: 'Warranty complaint: Havells MCB (Rajan Nair)', time: '1d ago' },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [firmDropdown, setFirmDropdown] = useState(false);
  const [selectedFirm, setSelectedFirm] = useState('Hi Tech Engineering - Main');
  const [showNotifs, setShowNotifs] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    toast('Logged out successfully', 'info');
  };

  const handleFirmChange = (f: string) => {
    setSelectedFirm(f);
    setFirmDropdown(false);
    toast(`Switched to ${f}`, 'success');
  };

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
    toast(darkMode ? 'Light mode enabled' : 'Dark mode enabled', 'info');
  };

  const handleRefresh = () => {
    toast('Data refreshed successfully', 'success');
  };

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'bg-slate-950' : 'bg-slate-100'}`}>
      {/* Sidebar */}
      <aside className={`flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden
        ${sidebarOpen ? 'w-64' : 'w-16'}
        ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-r z-50`}>
        {/* Logo */}
        <div className={`flex items-center gap-3 p-4 border-b ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg flex-shrink-0">
            <Zap size={20} className="text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <div className={`font-bold text-sm leading-tight ${darkMode ? 'text-white' : 'text-slate-800'}`}>Hi Tech</div>
              <div className="text-[10px] text-orange-500 font-semibold tracking-wide uppercase">Engineering ERP</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, path }) => {
            const active = location.pathname === path;
            return (
              <button key={path} onClick={() => navigate(path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150
                  ${active ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : darkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                <Icon size={18} className="flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User info in sidebar */}
        {sidebarOpen && user && (
          <div className={`px-3 py-2 border-t ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
            <div className={`flex items-center gap-2 px-2 py-2 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.initials}
              </div>
              <div className="min-w-0">
                <div className={`text-xs font-semibold truncate ${darkMode ? 'text-white' : 'text-slate-800'}`}>{user.name}</div>
                <div className="text-[10px] text-orange-500 font-medium">{user.role}</div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom actions */}
        <div className={`p-2 border-t ${darkMode ? 'border-slate-800' : 'border-slate-100'} space-y-1`}>
          <button onClick={() => setShowSettings(true)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
              ${darkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
            <Settings size={18} />
            {sidebarOpen && <span className="text-sm">Settings</span>}
          </button>
          <button onClick={() => setShowLogoutConfirm(true)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
              ${darkMode ? 'text-red-400 hover:bg-slate-800' : 'text-red-500 hover:bg-red-50'}`}>
            <LogOut size={18} />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Topbar */}
        <header className={`flex items-center gap-3 px-4 py-3 border-b flex-shrink-0 z-40
          ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg transition-colors flex-shrink-0 ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Firm Selector */}
          <div className="relative flex-shrink-0">
            <button onClick={() => { setFirmDropdown(!firmDropdown); setShowNotifs(false); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors
                ${darkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800 bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50 bg-white'}`}>
              <Building2 size={15} className="text-orange-500" />
              <span className="max-w-[140px] truncate hidden sm:block">{selectedFirm}</span>
              <ChevronDown size={14} />
            </button>
            {firmDropdown && (
              <div className={`absolute top-full left-0 mt-1 w-72 rounded-xl border shadow-xl z-50
                ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                {firms.map(f => (
                  <button key={f} onClick={() => handleFirmChange(f)}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors first:rounded-t-xl last:rounded-b-xl
                      ${f === selectedFirm ? 'bg-orange-50 text-orange-600 font-semibold' : darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-50'}`}>
                    <div className="font-medium">{f}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {f.includes('Main') ? 'GST + Non-GST · Primary Firm' : f.includes('Electricals') ? 'Electricals Division' : 'Plumbing Division'}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md relative hidden sm:block">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Escape') setSearchQuery('');
                if (e.key === 'Enter' && searchQuery) { toast(`Searching for "${searchQuery}"…`, 'info'); }
              }}
              placeholder="Quick search… (Ctrl+K)"
              className={`w-full pl-9 pr-4 py-2 rounded-lg text-sm border transition-colors outline-none focus:ring-2 focus:ring-orange-500/20
                ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 placeholder-slate-500 focus:border-orange-500' : 'bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400 focus:border-orange-400'}`}
            />
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            {/* Dark Mode */}
            <button onClick={handleDarkMode}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-slate-800 text-yellow-400' : 'hover:bg-slate-100 text-slate-500'}`}>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button onClick={() => { setShowNotifs(!showNotifs); setFirmDropdown(false); }}
                className={`relative p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
                <Bell size={18} className={darkMode ? 'text-slate-400' : 'text-slate-500'} />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {notifications.length}
                </span>
              </button>
              {showNotifs && (
                <div className={`absolute top-full right-0 mt-2 w-80 rounded-2xl border shadow-2xl z-50 overflow-hidden
                  ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className={`px-4 py-3 border-b font-semibold text-sm flex items-center justify-between ${darkMode ? 'border-slate-700 text-white' : 'border-slate-100 text-slate-800'}`}>
                    <span>Notifications</span>
                    <button onClick={() => { setShowNotifs(false); toast('All notifications marked as read', 'success'); }}
                      className="text-xs text-orange-500 hover:text-orange-700 font-medium">Mark all read</button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className={`flex gap-3 px-4 py-3 border-b last:border-0 hover:bg-orange-50/50 transition-colors cursor-pointer ${darkMode ? 'border-slate-700' : 'border-slate-50'}`}
                        onClick={() => { setShowNotifs(false); toast(n.text, n.type === 'alert' ? 'warning' : 'info'); }}>
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.type === 'alert' ? 'bg-red-500' : n.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-medium leading-snug ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{n.text}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User avatar */}
            {user && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 ml-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-white text-xs font-bold">
                  {user.initials}
                </div>
                <div className="hidden md:block">
                  <div className={`text-xs font-semibold leading-tight ${darkMode ? 'text-white' : 'text-slate-800'}`}>{user.name}</div>
                  <div className="text-[10px] text-orange-500 font-medium">{user.role}</div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Click outside to close dropdowns */}
        {(firmDropdown || showNotifs) && (
          <div className="fixed inset-0 z-30" onClick={() => { setFirmDropdown(false); setShowNotifs(false); }} />
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet context={{ darkMode, handleRefresh, toast }} />
        </main>
      </div>

      {/* Logout Confirm Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]" onClick={() => setShowLogoutConfirm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut size={22} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 text-center mb-1">Sign Out?</h3>
            <p className="text-sm text-slate-500 text-center mb-6">You'll be returned to the login screen. Any unsaved work will be lost.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={handleLogout} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors">Sign Out</button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]" onClick={() => setShowSettings(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-0 max-w-lg w-full mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Settings</h3>
              <button onClick={() => setShowSettings(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { icon: <Shield size={16} className="text-blue-500" />, title: 'Role & Permissions', sub: `Logged in as ${user?.role}`, action: 'View' },
                { icon: <Clock size={16} className="text-purple-500" />, title: 'Day Lock', sub: 'Lock transactions after end of day', action: 'Configure' },
                { icon: <Lock size={16} className="text-orange-500" />, title: 'Change Password', sub: 'Update your login credentials', action: 'Change' },
                { icon: <Building2 size={16} className="text-green-500" />, title: 'Firm Settings', sub: 'Manage GST details & firm info', action: 'Manage' },
              ].map(s => (
                <div key={s.title} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">{s.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800 text-sm">{s.title}</div>
                    <div className="text-xs text-slate-500">{s.sub}</div>
                  </div>
                  <button onClick={() => { setShowSettings(false); toast(`${s.title} opened`, 'info'); }}
                    className="text-xs font-semibold text-orange-500 hover:text-orange-700 px-3 py-1.5 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors">
                    {s.action}
                  </button>
                </div>
              ))}
            </div>
            <div className="px-6 pb-4 text-center text-xs text-slate-400">
              Hi Tech Engineering ERP · v1.0.0 · Build 2025.05
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
