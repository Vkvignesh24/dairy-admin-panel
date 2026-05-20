import { useEffect, useState } from 'react';
import { AdminAPI } from '../api/admin';
import { Spinner, ErrorBox, Pagination, Empty, PageHeader, SearchBar, StatusBadge } from '../components/UI';
import { exportExcel, exportPdf, fmtDate } from '../utils/exporters';
import { FileSpreadsheet, FileText } from 'lucide-react';

export default function Subscriptions() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');
  const [month, setMonth] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;

  const load = () =>
    AdminAPI.subscriptions({ q, month, page, limit })
      .then(setData)
      .catch((e) => setErr(e?.response?.data?.message || 'Failed'));

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [page, month]);

  const cols = [
    { key: 'customerName', label: 'Customer' },
    { key: 'phone', label: 'Phone' },
    { key: 'address', label: 'Address' },
    { key: 'quantity', label: 'Qty (L)' },
    { key: 'effectiveMonth', label: 'Month' },
    { key: 'selectedDates', label: 'Selected', value: (r) => (r.selectedDates || []).map(fmtDate).join(', ') },
    { key: 'cancelledDates', label: 'Cancelled', value: (r) => (r.cancelledDates || []).map(fmtDate).join(', ') },
    { key: 'alteredQuantities', label: 'Altered', value: (r) => (r.alteredQuantities || []).map((a) => `${fmtDate(a.date)}:${a.quantity}`).join(', ') },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="space-y-5">
      <PageHeader title="Subscriptions" subtitle="Monthly milk subscriptions and delivery schedules">
        <button className="btn-secondary" onClick={() => data && exportExcel('subscriptions', data.items)}>
          <FileSpreadsheet className="w-4 h-4" /> Excel
        </button>
        <button className="btn-primary" onClick={() => data && exportPdf('Subscriptions', cols, data.items)}>
          <FileText className="w-4 h-4" /> PDF
        </button>
      </PageHeader>

      <div className="card">
        <div className="flex flex-wrap gap-3 items-center">
          <SearchBar value={q} onChange={setQ} onSubmit={() => { setPage(1); load(); }} placeholder="Search name or phone…" />
          <div>
            <input
              className="input"
              type="month"
              value={month}
              onChange={(e) => { setPage(1); setMonth(e.target.value); }}
            />
          </div>
          <button className="btn-primary" onClick={() => { setPage(1); load(); }}>Apply</button>
          {data && (
            <div className="ml-auto text-[15px] text-slate-500 font-normal">
              <span className="font-semibold text-slate-900">{data.total}</span> subscriptions
            </div>
          )}
        </div>
      </div>

      <ErrorBox message={err} />

      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          {!data ? <Spinner /> : data.items.length === 0 ? (
            <Empty icon="📅" title="No subscriptions">No subscriptions match these filters.</Empty>
          ) : (
            <table className="table">
              <thead>
                <tr>{cols.map((c) => <th key={c.label}>{c.label}</th>)}</tr>
              </thead>
              <tbody>
                {data.items.map((r) => (
                  <tr key={r.id}>
                    {cols.map((c) => (
                      <td key={c.label}>
                        {c.key === 'status'
                          ? <StatusBadge status={r.status} />
                          : c.key === 'quantity'
                          ? <span className="badge badge-info">{r.quantity} L</span>
                          : c.key === 'customerName'
                          ? <span className="font-semibold text-slate-900">{r.customerName}</span>
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
