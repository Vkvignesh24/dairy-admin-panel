import { useEffect, useState } from 'react';
import { AdminAPI } from '../api/admin';
import { Spinner, ErrorBox, Empty, PageHeader, StatusBadge } from '../components/UI';
import { fmtMoney } from '../utils/exporters';
import { X, Pencil, Package } from 'lucide-react';
import { uploadToCloudinary } from '../services/cloudinary';

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${checked ? 'bg-brand-500' : 'bg-slate-300'}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
      />
    </button>
  );
}

function EditModal({ product, onClose, onSaved }) {
  const [form, setForm] = useState({ ...product });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [uploading, setUploading] = useState(false);

  const save = async () => {
    setSaving(true); setErr('');
    try {
      await AdminAPI.updateProduct(product.id, {
        name: form.name,
        price: Number(form.price),
        category: form.category,
        description: form.description,
        available: !!form.available,
        image: form.image,
      });
      onSaved();
      onClose();
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };

  const handleImageUpload = async (e) => {

    const file = e.target.files?.[0];

    if (!file) return;

    try {

      setUploading(true);

      const imageUrl = await uploadToCloudinary(file);

      setForm({
        ...form,
        image: imageUrl,
      });

    } catch (e) {

      setErr(
        'Failed to upload image'
      );

    } finally {

      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-30 p-4 animate-in">
      {/* <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"> */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-base font-semibold text-slate-900">Edit Product</div>
            <div className="text-[13px] font-medium text-slate-500">Update product details and availability</div>
          </div>
          <button className="btn-icon" onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          <ErrorBox message={err} />
          <div>
            <label className="label">Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Category</label>
              <input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>
            <div>
              <label className="label">Price (₹)</label>
              <input className="input" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="label">
              Product Image
            </label>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

              <div className="flex flex-col sm:flex-row items-center gap-5">

                {/* IMAGE PREVIEW */}
                <div className="relative shrink-0">

                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border border-slate-200 bg-white flex items-center justify-center">

                    {form.image ? (
                      <img
                        src={form.image}
                        alt={form.name}
                        className=" w-full h-full object-contain p-3"
                        onError={(e) => {
                          e.currentTarget.style.display =
                            'none';
                        }}
                      />
                    ) : (
                      <Package className="w-10 h-10 text-slate-300" />
                    )}

                  </div>

                </div>

                {/* ACTIONS */}
                <div className="flex-1 w-full space-y-3">

                  <div>
                    <div className="text-[14px] font-semibold text-slate-900">
                      Upload Product Image
                    </div>

                    <div className="text-[13px] text-slate-500 mt-1">
                      PNG, JPG or WEBP recommended
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">

                    <label className=" btn-secondary cursor-pointer">

                      {uploading
                        ? 'Uploading...'
                        : form.image
                          ? 'Replace Image'
                          : 'Upload Image'}

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>

                    {form.image && (
                      <button
                        type="button"
                        className="btn-danger"
                        onClick={() =>
                          setForm({
                            ...form,
                            image: '',
                          })
                        }
                      >
                        Remove
                      </button>
                    )}

                  </div>

                </div>

              </div>

            </div>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea className="input" rows="3" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <div className="text-[14px] font-semibold text-slate-900">Available</div>
              <div className="text-[13px] font-medium text-slate-500">Customers can order this product</div>
            </div>
            <Toggle checked={!!form.available} onChange={(v) => setForm({ ...form, available: v })} />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [editing, setEditing] = useState(null);

  const load = () => AdminAPI.products().then(setData).catch((e) => setErr(e?.response?.data?.message || 'Failed'));
  useEffect(() => { load(); }, []);

  const toggle = async (p) => {
    await AdminAPI.toggleProduct(p.id);
    load();
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Products" subtitle="Manage your catalogue, pricing and availability" />

      <ErrorBox message={err} />

      {!data ? <Spinner /> : data.items.length === 0 ? (
        <div className="card"><Empty icon="📦" title="No products">Add your first product to get started.</Empty></div>
      ) : (
        <>
          {/* Card grid for medium+ screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.items.map((p) => (
              <div key={p.id} className="card card-hover flex flex-col">
                
                <div className="aspect-square rounded-2xl overflow-hidden bg-white mb-4 border border-slate-200 relative">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      // className="w-full h-full object-contain transition duration-300 hover:scale-105"
                      className="w-full h-full object-contain p-6 transition-transform duration-300 hover:scale-[1.02]"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}

                  <div
                    className={`absolute inset-0 items-center justify-center bg-gradient-to-br from-brand-50 to-emerald-50 ${p.image ? 'hidden' : 'flex'
                      }`}
                  >
                    <Package className="w-12 h-12 text-brand-500/60" />
                  </div>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium text-slate-500 uppercase tracking-wider font-medium">{p.category}</div>
                    <div className="font-semibold text-slate-900 mt-0.5 truncate">{p.name}</div>
                  </div>
                  <StatusBadge status={p.available ? 'Available' : 'Disabled'} />
                </div>
                <div className="text-[13px] font-medium text-slate-500 mt-1.5 line-clamp-2 min-h-[2.25rem]">{p.description || '—'}</div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xl font-bold text-slate-900">{fmtMoney(p.price)}</div>
                  <Toggle checked={!!p.available} onChange={() => toggle(p)} />
                </div>
                <button
                  className="btn-secondary mt-4 w-full"
                  onClick={() => setEditing(p)}
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit product
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {editing && <EditModal product={editing} onClose={() => setEditing(null)} onSaved={load} />}
    </div>
  );
}
