import { useEffect, useState } from 'react';
import { AdminAPI } from '../api/admin';
import { Spinner, ErrorBox, Pagination, Empty, PageHeader, SearchBar, StatusBadge } from '../components/UI';
import { exportExcel, exportPdf, fmtDate, fmtMoney } from '../utils/exporters';
import { FileSpreadsheet, FileText, ShoppingBag } from 'lucide-react';

export default function Orders() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;

  const load = () =>
    AdminAPI.orders({ q, from, to, page, limit })
      .then(setData)
      .catch((e) => setErr(e?.response?.data?.message || 'Failed'));

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [page]);

  const cols = [
    { key: 'id', label: 'Order ID', value: (r) => String(r.id).slice(-8) },
    { key: 'customerName', label: 'Customer' },
    { key: 'phone', label: 'Phone' },
    { key: 'address', label: 'Address' },
    { key: 'products', label: 'Products', value: (r) => (r.items || []).map((i) => `${i.name} x${i.quantity}`).join(', ') },
    { key: 'subtotal', label: 'Subtotal', value: (r) => fmtMoney(r.subtotal) },
    { key: 'deliveryFee', label: 'Delivery', value: (r) => fmtMoney(r.deliveryFee) },
    { key: 'total', label: 'Total', value: (r) => fmtMoney(r.total) },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Date', value: (r) => fmtDate(r.createdAt) },
  ];

  return (
    <div className="space-y-5">
      <PageHeader title="Orders" subtitle="All customer orders with status and totals">
        <button
          className="btn-secondary"
          onClick={() => data && exportExcel('orders', data.items.map((r) => ({ ...r, items: r.items.map((i) => `${i.name}x${i.quantity}`).join(', ') })))}
        >
          <FileSpreadsheet className="w-4 h-4" /> Excel
        </button>
        <button
          className="btn-primary"
          onClick={() => data && exportPdf('Orders', cols, data.items)}
        >
          <FileText className="w-4 h-4" /> PDF
        </button>
      </PageHeader>

      <div className="card">
        <div className="flex flex-wrap gap-3 items-end">
          <SearchBar value={q} onChange={setQ} onSubmit={() => { setPage(1); load(); }} placeholder="Search ID, name or phone…" />
          <div>
            <label className="label">From</label>
            <input className="input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label className="label">To</label>
            <input className="input" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <button className="btn-primary" onClick={() => { setPage(1); load(); }}>Apply</button>
          {data && (
            <div className="ml-auto text-[15px] text-slate-500 font-normal">
              <span className="font-semibold text-slate-900">{data.total}</span> orders
            </div>
          )}
        </div>
      </div>

      <ErrorBox message={err} />

      {/* {data && data.items.length > 0 && (() => {

        const productTotals = {};

        let grandSubtotal = 0;
        let grandDelivery = 0;
        let grandTotal = 0;

        data.items.forEach((order) => {

          grandSubtotal += Number(order.subtotal || 0);
          grandDelivery += Number(order.deliveryFee || 0);
          grandTotal += Number(order.total || 0);

          (order.items || []).forEach((item) => {

            if (!productTotals[item.name]) {
              productTotals[item.name] = 0;
            }

            productTotals[item.name] += Number(item.quantity || 0);
          });
        });

        return (

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            <div className="card">
              <div className="text-lg font-bold text-slate-900 mb-4">
                Order Totals
              </div>

              <div className="space-y-3">

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-bold">
                    {fmtMoney(grandSubtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Delivery</span>
                  <span className="font-bold">
                    {fmtMoney(grandDelivery)}
                  </span>
                </div>

                <div className="border-t pt-3 flex items-center justify-between">
                  <span className="text-slate-900 font-semibold">
                    Grand Total
                  </span>

                  <span className="text-xl font-bold text-brand-700">
                    {fmtMoney(grandTotal)}
                  </span>
                </div>

              </div>
            </div>

            <div className="card">

              <div className="text-lg font-bold text-slate-900 mb-4">
                Product Totals
              </div>

              <div className="space-y-2">

                {Object.entries(productTotals).map(([name, qty]) => (

                  <div
                    key={name}
                    className="flex items-center justify-between border-b border-slate-100 pb-2"
                  >
                    <span className="text-slate-700">
                      {name}
                    </span>

                    <span className="badge badge-info">
                      x{qty}
                    </span>
                  </div>

                ))}

              </div>
            </div>

          </div>
        );

      })()} */}

      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          {!data ? <Spinner /> : data.items.length === 0 ? (
            <Empty icon="🛍️" title="No orders">No orders match these filters.</Empty>
          ) : (
            <table className="table">
              <thead><tr>{cols.map((c) => <th key={c.label}>{c.label}</th>)}</tr></thead>
              <tbody>
                {data.items.map((r) => (
                  <tr key={r.id}>
                    {cols.map((c) => (
                      <td key={c.label}>
                        {c.key === 'id'
                          ? <span className="font-mono text-[13px] font-medium text-slate-500">#{String(r.id).slice(-8)}</span>
                          : c.key === 'customerName'
                            ? (
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center flex-shrink-0">
                                  <ShoppingBag className="w-4 h-4" />
                                </div>
                                <span className="font-semibold text-slate-900 whitespace-nowrap">{r.customerName}</span>
                              </div>
                            )
                            : c.key === 'address'
                              ? <span className="block max-w-[220px] truncate text-slate-500">{r.address}</span>
                              : c.key === 'products'
                                ? <span className="block max-w-[260px] truncate">{(r.items || []).map((i) => `${i.name} ×${i.quantity}`).join(', ')}</span>
                                : c.key === 'total'
                                  ? <span className="font-semibold text-slate-900">{fmtMoney(r.total)}</span>
                                  : c.key === 'status'
                                    ? <StatusBadge status={r.status} />
                                    : typeof c.value === 'function' ? c.value(r) : r[c.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {data && <div className="px-5 pb-4"><Pagination page={page} total={data.total} limit={limit} onChange={setPage} /></div>}
      </div>
    </div>
  );
}
