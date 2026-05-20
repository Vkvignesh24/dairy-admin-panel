import { Search } from 'lucide-react';

export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center py-12 text-slate-500 text-[14px]">
      <span className="inline-block h-4 w-4 mr-2 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
      {label}
    </div>
  );
}

export function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-[14px] flex items-start gap-2">
      <span className="mt-0.5">⚠️</span>
      <span>{message}</span>
    </div>
  );
}

export function Empty({ icon = '📭', title = 'No data yet', children = 'There is nothing to show here.' }) {
  return (
    <div className="text-center py-14 px-6">
      <div className="mx-auto h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl mb-3">{icon}</div>
      <div className="text-slate-900 font-semibold text-[14px]">{title}</div>
      <div className="text-slate-500 text-[13px] font-medium mt-1 max-w-sm mx-auto">{children}</div>
    </div>
  );
}

export function Pagination({ page, total, limit, onChange }) {
  const pages = Math.max(1, Math.ceil(total / limit));
  if (pages <= 1) return null;
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-100 text-[14px]">
      <div className="text-slate-500">
        Showing page <span className="font-semibold text-slate-700">{page}</span> of{' '}
        <span className="font-semibold text-slate-700">{pages}</span> · {total} records
      </div>
      <div className="flex gap-2">
        <button className="btn-secondary" disabled={page <= 1} onClick={() => onChange(page - 1)}>← Prev</button>
        <button className="btn-secondary" disabled={page >= pages} onClick={() => onChange(page + 1)}>Next →</button>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
      <div>
        <h1 className="text-[32px] leading-tight font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-[15px] text-slate-500 font-normal mt-1">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function SearchBar({ value, onChange, onSubmit, placeholder = 'Search…' }) {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit?.(); }}
      className="relative flex-1 min-w-[220px] max-w-md"
    >
      <Search className="w-[18px] h-[18px] absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        className="input h-11 pl-11"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </form>
  );
}

export function StatusBadge({ status }) {
  const s = String(status || '').toLowerCase();
  let cls = 'badge-muted';
  if (['active', 'delivered', 'paid', 'completed', 'available', 'yes'].includes(s)) cls = 'badge-success';
  else if (['pending', 'processing', 'scheduled'].includes(s)) cls = 'badge-warning';
  else if (['cancelled', 'failed', 'disabled', 'no'].includes(s)) cls = 'badge-danger';
  else if (['shipped', 'out for delivery'].includes(s)) cls = 'badge-info';
  return <span className={`badge ${cls}`}>{status || '—'}</span>;
}

export function TableSkeleton({ rows = 6, cols = 5 }) {
  return (
    <div className="space-y-2 p-2">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
          {Array.from({ length: cols }).map((__, c) => (
            <div key={c} className="skeleton h-4" />
          ))}
        </div>
      ))}
    </div>
  );
}
