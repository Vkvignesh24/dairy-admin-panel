import { useEffect, useState } from 'react';
import { AdminAPI } from '../api/admin';
import { Spinner, ErrorBox, StatusBadge, PageHeader } from '../components/UI';
import { fmtMoney, fmtDate } from '../utils/exporters';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import {
  Users, CalendarCheck, ShoppingBag, Milk, IndianRupee, XCircle, ArrowUpRight,
} from 'lucide-react';

function StatCard({ label, value, hint, icon: Icon, tone = 'brand' }) {
  const tones = {
    brand: { bg: 'bg-brand-50', text: 'text-brand-700', ring: 'ring-brand-100' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', ring: 'ring-blue-100' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-100' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-700', ring: 'ring-rose-100' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-700', ring: 'ring-violet-100' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-100' },
  }[tone];

  return (

    <div className="card card-hover overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-medium font-semibold uppercase tracking-wider text-slate-500">{label}</div>
          {/* <div className="text-[30px] leading-none font-bold text-slate-900 mt-2 tracking-tight">{value}</div> */}
          <div className="mt-2 min-w-0">
            <div className="text-[20px] sm:text-[24px] xl:text-[28px] leading-tight font-bold text-slate-900 tracking-tight break-words">
              {value}
            </div>
          </div>
          {hint && <div className="text-[13px] font-medium text-slate-500 mt-1.5 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3 text-emerald-500" /> {hint}
          </div>}
        </div>
        <div className={`h-11 w-11 rounded-xl flex items-center justify-center ring-1 ring-inset ${tones.bg} ${tones.text} ${tones.ring}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    AdminAPI.dashboard().then(setData).catch((e) => setErr(e?.response?.data?.message || 'Failed'));
  }, []);

  if (err) return <ErrorBox message={err} />;
  if (!data) return <Spinner />;

  const overview = [
    { name: 'Customers', value: data.totalCustomers },
    { name: 'Active Subs', value: data.activeSubscriptions },
    { name: 'Today Orders', value: data.todayOrders },
    { name: 'Cancelled', value: data.cancelledDeliveriesToday },
  ];

  const trend = (data.recentOrders || []).slice().reverse().map((o, i) => ({
    name: `#${i + 1}`,
    value: o.total || 0,
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Welcome back — here's what's happening today." />

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard label="Customers" value={data.totalCustomers} icon={Users} tone="brand" />
        <StatCard label="Active Subs" value={data.activeSubscriptions} icon={CalendarCheck} tone="emerald" />
        <StatCard label="Today Orders" value={data.todayOrders} icon={ShoppingBag} tone="blue" />
        <StatCard label="Tomorrow Milk" value={`${data.tomorrowMilkQuantity} L`} icon={Milk} tone="violet" hint="Computed" />
        <StatCard label="Monthly Revenue" value={fmtMoney(data.monthlyRevenue)} icon={IndianRupee} tone="amber" />
        <StatCard label="Cancelled Today" value={data.cancelledDeliveriesToday} icon={XCircle} tone="rose" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="section-title">Recent Orders Trend</div>
              <div className="section-sub">Total value of latest orders</div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={trend.length ? trend : [{ name: '—', value: 0 }]}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                  formatter={(v) => fmtMoney(v)}
                />
                <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2.5} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="section-title">Overview</div>
          <div className="section-sub mb-4">Live operational counts</div>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={overview}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Bar dataKey="value" fill="#059669" radius={[8, 8, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="card !p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <div className="section-title">Recent Orders</div>
              <div className="section-sub">Latest customer orders</div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead><tr><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {data.recentOrders.map((o) => (
                  <tr key={o._id}>
                    <td className="font-medium text-slate-900">{o.userId?.name || '—'}</td>
                    <td className="font-semibold">{fmtMoney(o.total)}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td className="text-slate-500">{fmtDate(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card !p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <div className="section-title">Recent Subscription Changes</div>
            <div className="section-sub">Quantity & monthly updates</div>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead><tr><th>Customer</th><th>Qty</th><th>Month</th><th>Updated</th></tr></thead>
              <tbody>
                {data.recentSubscriptions.map((s) => (
                  <tr key={s._id}>
                    <td className="font-medium text-slate-900">{s.userId?.name || '—'}</td>
                    <td><span className="badge badge-info">{s.quantity} L</span></td>
                    <td>{s.effectiveMonth}</td>
                    <td className="text-slate-500">{fmtDate(s.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
