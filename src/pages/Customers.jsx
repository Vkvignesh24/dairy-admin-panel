import { useEffect, useState } from 'react';
import { AdminAPI } from '../api/admin';
import { Spinner, ErrorBox, Pagination, Empty, PageHeader, SearchBar, StatusBadge } from '../components/UI';
import { fmtDate } from '../utils/exporters';
import { X, Eye } from 'lucide-react';

function DetailModal({ id, onClose }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => {
    AdminAPI.customer(id).then(setData).catch((e) => setErr(e?.response?.data?.message || 'Failed'));
  }, [id]);

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-30 p-4 animate-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[88vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <div>
            <div className="text-base font-semibold text-slate-900">Customer Details</div>
            <div className="text-[13px] font-medium text-slate-500">Profile, orders & subscriptions</div>
          </div>
          <button className="btn-icon" onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="overflow-auto p-6 space-y-5">
          <ErrorBox message={err} />
          {!data ? <Spinner /> : (
            <>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-brand-50 to-emerald-50 border border-brand-100">
                <div className="h-14 w-14 rounded-full bg-brand-600 text-white flex items-center justify-center text-lg font-semibold">
                  {(data.customer.name || 'C').slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-base font-semibold text-slate-900 truncate">{data.customer.name}</div>
                  <div className="text-[13px] font-medium text-slate-500 truncate">{data.customer.email}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[14px]">
                <Field label="Phone" value={data.customer.phone} />
                <Field label="Joined" value={fmtDate(data.customer.joinedAt)} />
                <div className="col-span-2"><Field label="Address" value={data.customer.address} /></div>
              </div>

              <div>
                <div className="section-title mb-2">Recent Orders</div>
                <div className="rounded-xl border border-slate-200 overflow-hidden overflow-x-auto">
                  <table className="table">
                    <thead><tr><th>Date</th><th>Total</th><th>Status</th></tr></thead>
                    <tbody>
                      {data.orders.length === 0 ? (
                        <tr><td colSpan={3} className="text-center text-slate-400 py-6">No orders yet</td></tr>
                      ) : data.orders.map((o) => (
                        <tr key={o._id}>
                          <td>{fmtDate(o.createdAt)}</td>
                          <td className="font-semibold">₹{o.total}</td>
                          <td><StatusBadge status={o.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div className="section-title mb-2">Subscriptions</div>
                <div className="rounded-xl border border-slate-200 overflow-hidden overflow-x-auto">
                  <table className="table">
                    <thead><tr><th>Month</th><th>Qty</th><th>Status</th></tr></thead>
                    <tbody>
                      {data.subscriptions.length === 0 ? (
                        <tr><td colSpan={3} className="text-center text-slate-400 py-6">No subscriptions</td></tr>
                      ) : data.subscriptions.map((s) => (
                        <tr key={s._id}>
                          <td>{s.effectiveMonth}</td>
                          <td><span className="badge badge-info">{s.quantity} L</span></td>
                          <td><StatusBadge status={s.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <div className="text-[13px] font-medium font-medium text-slate-500 uppercase tracking-wider">{label}</div>
      <div className="font-medium text-slate-800 mt-0.5">{value || '—'}</div>
    </div>
  );
}

export default function Customers() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState(null);
  const limit = 20;

  const load = () => AdminAPI.customers({ q, page, limit }).then(setData).catch((e) => setErr(e?.response?.data?.message || 'Failed'));
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [page]);

  return (
    <div className="space-y-5">
      <PageHeader title="Customers" subtitle="All registered customers and their activity" />

      <div className="card">
        <div className="flex flex-wrap gap-3 items-center">
          <SearchBar
            value={q}
            onChange={setQ}
            onSubmit={() => { setPage(1); load(); }}
            placeholder="Search name, email or phone…"
          />
          <button className="btn-primary" onClick={() => { setPage(1); load(); }}>Search</button>
          {data && (
            <div className="ml-auto text-[15px] text-slate-500 font-normal">
              <span className="font-semibold text-slate-900">{data.total}</span> customers
            </div>
          )}
        </div>
      </div>

      <ErrorBox message={err} />

      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          {!data ? <Spinner /> : data.items.length === 0 ? (
            <Empty icon="👥" title="No customers" >Try adjusting your search filters.</Empty>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Customer</th><th>Phone</th><th>Address</th>
                  <th>Orders</th><th>Subscription</th><th>Joined</th><th></th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center text-[13px] font-medium font-semibold flex-shrink-0">
                          {(c.name || 'C').slice(0, 1).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 truncate">{c.name}</div>
                          <div className="text-[13px] font-medium text-slate-500 truncate">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap">{c.phone}</td>
                    <td className="max-w-xs truncate text-slate-500">{c.address}</td>
                    <td><span className="badge badge-muted">{c.totalOrders}</span></td>
                    <td>
                      <span className={`badge ${c.activeSubscription ? 'badge-success' : 'badge-muted'}`}>
                        {c.activeSubscription ? 'Active' : 'None'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap text-slate-500">{fmtDate(c.joinedAt)}</td>
                    <td className="text-right">
                      <button className="btn-secondary !py-1.5 !px-3" onClick={() => setOpenId(c.id)}>
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {data && <div className="px-5 pb-4"><Pagination page={page} total={data.total} limit={limit} onChange={setPage} /></div>}
      </div>
      {openId && <DetailModal id={openId} onClose={() => setOpenId(null)} />}
    </div>
  );
}
