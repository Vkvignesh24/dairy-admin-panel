import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import {
  LayoutDashboard, CalendarRange, Truck, ShoppingBag, Package, Users,
  Bell, Search, LogOut, Menu, X, ChevronDown,
} from 'lucide-react';

const links = [
  { to: '/', label: 'Dashboard', end: true, icon: LayoutDashboard },
  { to: '/subscriptions', label: 'Subscriptions', icon: CalendarRange },
  { to: '/tomorrow', label: 'Tomorrow Delivery', icon: Truck },
  { to: '/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/notifications', label: 'Notifications', icon: Bell, },
];

function SidebarContent({ user, onNavigate }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-slate-100 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-lg shadow-sm">
          🥛
        </div>
        <div className="min-w-0">
          <div className="text-[15px] font-bold text-slate-900 leading-tight">Dairy Admin</div>
          <div className="text-[13px] font-medium text-slate-500">Operations console</div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 pt-2 pb-1 text-[13px] font-medium font-semibold uppercase tracking-wider text-slate-400">Main</div>
        {links.map((l) => {
          const Icon = l.icon;
          return (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-50 to-brand-50/40 text-brand-700 shadow-sm ring-1 ring-brand-100'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`h-8 w-8 rounded-lg flex items-center justify-center transition ${
                    isActive ? 'bg-brand-500 text-white shadow' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="truncate">{l.label}</span>
                  {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500" />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="m-3 p-3 rounded-xl bg-gradient-to-br from-brand-50 to-emerald-50 border border-brand-100">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-brand-600 text-white flex items-center justify-center text-[13px] font-medium font-semibold">
            {(user?.name || user?.email || 'A').slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-medium font-semibold text-slate-900 truncate">{user?.name || 'Admin'}</div>
            <div className="text-[13px] font-medium text-slate-500 truncate">{user?.email || 'admin@dairy.local'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    nav('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 sticky top-0 h-screen flex-col">
        <SidebarContent user={user} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-2xl flex flex-col animate-in">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <div className="text-[14px] font-semibold">Menu</div>
              <button className="btn-icon" onClick={() => setMobileOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <SidebarContent user={user} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky topbar */}
        <header className="h-16 bg-white/80 glass border-b border-slate-200 flex items-center gap-3 px-4 sm:px-6 sticky top-0 z-20">
          <button
            className="btn-icon lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden md:flex relative flex-1 max-w-md">
            <Search className="w-[18px] h-[18px] absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-10 bg-slate-50 border-slate-100 focus:bg-white"
              placeholder="Search anything…"
            />
          </div>

          <div className="flex-1 md:hidden text-[14px] font-semibold text-slate-900">Dairy Admin</div>

          <div className="flex items-center gap-2 ml-auto">
            <button className="btn-icon relative" aria-label="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 transition"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center text-[13px] font-medium font-semibold">
                  {(user?.name || user?.email || 'A').slice(0, 1).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-[13px] font-medium font-semibold text-slate-900 leading-tight">{user?.name || 'Admin'}</div>
                  <div className="text-[13px] font-medium text-slate-500">Administrator</div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-40">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <div className="text-[14px] font-semibold text-slate-900 truncate">{user?.name || 'Admin'}</div>
                      <div className="text-[13px] font-medium text-slate-500 truncate">{user?.email}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-[14px] text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-auto">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
