import { useEffect, useState } from 'react';
import { AdminAPI } from '../api/admin';
import { Spinner, ErrorBox, Empty, PageHeader } from '../components/UI';
import { exportExcel, exportPdf } from '../utils/exporters';
import { FileSpreadsheet, FileText, RefreshCw, Truck, Milk, Users } from 'lucide-react';

function MiniStat({ icon: Icon, label, value, tone }) {
  const tones = {
    brand: 'from-brand-500 to-brand-700',
    blue: 'from-blue-500 to-blue-700',
    violet: 'from-violet-500 to-violet-700',
  };
  return (
    <div className="card !p-4 flex items-center gap-3 min-w-[180px]">
      <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${tones[tone]} text-white flex items-center justify-center shadow-sm`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-[13px] font-medium font-semibold uppercase tracking-wider text-slate-500">{label}</div>
        <div className="text-lg font-bold text-slate-900">{value}</div>
      </div>
    </div>
  );
}

export default function Tomorrow() {
  const [date, setDate] = useState('');
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  const load = () =>
    AdminAPI.tomorrow(date ? { date } : {})
      .then(setData)
      .catch((e) => setErr(e?.response?.data?.message || 'Failed'));

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const cols = [
    { key: 'customerName', label: 'Customer' },
    { key: 'phone', label: 'Phone' },
    { key: 'address', label: 'Address' },
    { key: 'quantity', label: 'Qty (L)' },
    { key: 'bottleSplit', label: 'Bottle Split' },
    { key: 'notes', label: 'Notes' },
  ];

  return (
    <div className="space-y-5">
      <PageHeader title="Tomorrow Delivery" subtitle="Plan and dispatch tomorrow's milk deliveries">
        <button className="btn-secondary" onClick={() => data && exportExcel('deliveries', data.deliveries)}>
          <FileSpreadsheet className="w-4 h-4" /> Excel
        </button>
        <button className="btn-primary" onClick={() => data && exportPdf('Deliveries', cols, data.deliveries)}>
          <FileText className="w-4 h-4" /> PDF
        </button>
      </PageHeader>

      <div className="card">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="min-w-[220px]">
            <label className="label">Delivery date (defaults to tomorrow)</label>
            <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <button className="btn-primary" onClick={load}>
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <MiniStat icon={Users} label="Total Customers" value={data.totalCustomers} tone="brand" />
          <MiniStat icon={Milk} label="Total Milk" value={`${data.totalQuantity} L`} tone="violet" />
          <MiniStat icon={Truck} label="Routes Ready" value={data.deliveries?.length || 0} tone="blue" />
          <MiniStat
            icon={Milk}
            label="Bottle Counts"
            value={
              ` ${data.totalBottleCounts?.['1L'] || 0} × 1L
              | 
              ${data.totalBottleCounts?.['500ml'] || 0} × 500ml
              `
            }
            tone="brand"
          />
        </div>
      )}

      <ErrorBox message={err} />

      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          {!data ? <Spinner /> : data.deliveries.length === 0 ? (
            <Empty icon="🚚" title="No deliveries">No deliveries scheduled for the selected date.</Empty>
          ) : (
            <table className="table">
              <thead><tr>{cols.map((c) => <th key={c.label}>{c.label}</th>)}</tr></thead>
              <tbody>
                {data.deliveries.map((r) => (
                  <tr key={r.subscriptionId}>
                    {cols.map((c) => (
                      <td key={c.label}>
                        {c.key === 'customerName'
                          ? <span className="font-semibold text-slate-900">{r.customerName}</span>
                          : c.key === 'quantity'
                            ? <span className="badge badge-info">{r.quantity} L</span>
                            : r[c.key] || '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
