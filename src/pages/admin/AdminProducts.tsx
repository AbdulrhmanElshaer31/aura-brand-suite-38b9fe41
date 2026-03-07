import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Upload, Package } from 'lucide-react';
import { useStore } from '@/store/useStore';
import AdminLayout from '@/components/admin/AdminLayout';
import { Product } from '@/types';

const emptyProduct: Omit<Product, 'id' | 'views' | 'orderClicks' | 'createdAt'> = {
  name: '',
  description: '',
  price: 0,
  category: 'fresh',
  size: '50ml',
  status: 'available',
  badge: undefined,
  images: [],
  topNotes: [],
  middleNotes: [],
  baseNotes: [],
};

const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyProduct);
  const [noteInputs, setNoteInputs] = useState({ top: '', middle: '', base: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const openCreate = () => {
    setForm(emptyProduct);
    setNoteInputs({ top: '', middle: '', base: '' });
    setCreating(true);
    setEditing(null);
  };

  const openEdit = (product: Product) => {
    setForm(product);
    setNoteInputs({ top: '', middle: '', base: '' });
    setEditing(product);
    setCreating(false);
  };

  const closeForm = () => {
    setCreating(false);
    setEditing(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setForm((prev) => ({ ...prev, images: [...prev.images, ev.target!.result as string] }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const addNote = (type: 'topNotes' | 'middleNotes' | 'baseNotes', inputKey: 'top' | 'middle' | 'base') => {
    const val = noteInputs[inputKey].trim();
    if (!val) return;
    setForm((prev) => ({ ...prev, [type]: [...prev[type], val] }));
    setNoteInputs((prev) => ({ ...prev, [inputKey]: '' }));
  };

  const removeNote = (type: 'topNotes' | 'middleNotes' | 'baseNotes', index: number) => {
    setForm((prev) => ({ ...prev, [type]: prev[type].filter((_, i) => i !== index) }));
  };

  const handleSave = () => {
    if (!form.name || !form.price) return;
    if (editing) {
      updateProduct(editing.id, form);
    } else {
      addProduct({
        ...form,
        id: `p${Date.now()}`,
        views: 0,
        orderClicks: 0,
        createdAt: new Date().toISOString().split('T')[0],
      });
    }
    closeForm();
  };

  const inputClass = "w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";
  const labelClass = "text-muted-foreground font-body text-sm mb-1 block";

  const showForm = creating || editing;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl text-foreground">Products</h1>
        <button
          onClick={openCreate}
          className="bg-gold-gradient text-primary-foreground px-5 py-2.5 rounded-lg font-body text-sm font-medium flex items-center gap-2 hover:shadow-gold transition-all"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Product List */}
      {!showForm && (
        <div className="space-y-3">
          {products.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card border border-border rounded-xl p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                {p.images[0] ? (
                  <img src={p.images[0]} alt={p.name} className="w-14 h-14 rounded-lg object-cover" />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center">
                    <Package className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <h3 className="font-body text-sm text-foreground font-medium">{p.name}</h3>
                  <p className="text-muted-foreground text-xs font-body">{p.category} · {p.size} · ${p.price}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {p.badge && (
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-body capitalize">{p.badge.replace('_', ' ')}</span>
                )}
                <span className={`px-3 py-1 rounded-full text-xs font-body ${p.status === 'available' ? 'bg-green-500/10 text-green-400' : 'bg-destructive/10 text-destructive'}`}>
                  {p.status === 'available' ? 'Available' : 'Out of Stock'}
                </span>
                <button onClick={() => openEdit(p)} className="p-2 text-muted-foreground hover:text-primary transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(p.id)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="font-heading text-lg text-foreground mb-2">Delete Product</h3>
            <p className="text-muted-foreground font-body text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-border text-muted-foreground py-2.5 rounded-lg font-body text-sm hover:bg-secondary transition-colors">Cancel</button>
              <button onClick={() => { deleteProduct(deleteConfirm); setDeleteConfirm(null); }} className="flex-1 bg-destructive text-destructive-foreground py-2.5 rounded-lg font-body text-sm hover:bg-destructive/90 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl text-foreground">{editing ? 'Edit Product' : 'New Product'}</h2>
            <button onClick={closeForm} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Product Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="e.g., Midnight Oud" />
            </div>
            <div>
              <label className={labelClass}>Price ($)</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Product['category'] })} className={inputClass}>
                <option value="fresh">Fresh</option>
                <option value="sweet">Sweet</option>
                <option value="woody">Woody</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Size</label>
              <input value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} className={inputClass} placeholder="e.g., 100ml" />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Product['status'] })} className={inputClass}>
                <option value="available">Available</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Badge</label>
              <select value={form.badge || ''} onChange={(e) => setForm({ ...form, badge: (e.target.value || undefined) as Product['badge'] })} className={inputClass}>
                <option value="">None</option>
                <option value="new">New</option>
                <option value="best_seller">Best Seller</option>
                <option value="limited">Limited</option>
              </select>
            </div>
          </div>

          <div className="mt-5">
            <label className={labelClass}>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={inputClass} placeholder="Product description..." />
          </div>

          {/* Images */}
          <div className="mt-5">
            <label className={labelClass}>Product Images</label>
            <div className="flex flex-wrap gap-3 mb-3">
              {form.images.map((img, i) => (
                <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(i)} className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <X className="w-5 h-5 text-destructive" />
                  </button>
                </div>
              ))}
              <label className="w-24 h-24 rounded-lg border-2 border-dashed border-border hover:border-primary/40 flex flex-col items-center justify-center cursor-pointer transition-colors">
                <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground font-body">Upload</span>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Notes */}
          {(['topNotes', 'middleNotes', 'baseNotes'] as const).map((type) => {
            const inputKey = type === 'topNotes' ? 'top' : type === 'middleNotes' ? 'middle' : 'base';
            const label = type === 'topNotes' ? 'Top Notes' : type === 'middleNotes' ? 'Middle Notes' : 'Base Notes';
            return (
              <div key={type} className="mt-4">
                <label className={labelClass}>{label}</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form[type].map((note, i) => (
                    <span key={i} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-body">
                      {note}
                      <button onClick={() => removeNote(type, i)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={noteInputs[inputKey]}
                    onChange={(e) => setNoteInputs({ ...noteInputs, [inputKey]: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addNote(type, inputKey))}
                    className={inputClass}
                    placeholder={`Add ${label.toLowerCase()}...`}
                  />
                  <button onClick={() => addNote(type, inputKey)} className="px-4 bg-secondary text-secondary-foreground rounded-lg font-body text-sm hover:bg-secondary/80 transition-colors">Add</button>
                </div>
              </div>
            );
          })}

          <div className="flex gap-3 mt-8">
            <button onClick={closeForm} className="flex-1 border border-border text-muted-foreground py-3 rounded-lg font-body text-sm hover:bg-secondary transition-colors">Cancel</button>
            <button onClick={handleSave} className="flex-1 bg-gold-gradient text-primary-foreground py-3 rounded-lg font-body text-sm font-medium hover:shadow-gold transition-all">
              {editing ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </motion.div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
