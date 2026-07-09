import { useEffect, useState } from 'react';
import { DollarSign, Car, Compass, Crown, Zap, Bus } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchCategories = () => {
    setLoading(true);
    api.get('/categories')
      .then(res => setCategories(res.data.data.categories))
      .catch(() => toast.error('Failed to load categories'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAdd = () => { setEditing(null); setName(''); setShowModal(true); };
  const openEdit = (cat) => { setEditing(cat); setName(cat.name); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/categories/${editing.id}`, { name });
        toast.success('Category updated!');
      } else {
        await api.post('/categories', { name });
        toast.success('Category created!');
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category? Cars in this category will become uncategorized.')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const catIcons = {
    Economy: DollarSign,
    Compact: Car,
    SUV: Compass,
    Luxury: Crown,
    Sports: Zap,
    Van: Bus
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <div className="admin-page">
          <div className="page-header">
            <div>
              <h1 className="page-title">Manage Categories</h1>
              <p className="page-subtitle">{categories.length} vehicle categories</p>
            </div>
            <button className="btn btn-primary" onClick={openAdd}>+ Add Category</button>
          </div>

          {loading ? <div className="loading-center"><div className="spinner" /></div> : (
            <div className="grid-3">
              {categories.map(cat => (
                <div key={cat.id} className="glass-card animate-fade-in" style={{ padding: '1.5rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
                    {catIcons[cat.name] || '🚗'}
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    {cat.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    ID: {cat.id}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(cat)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cat.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{editing ? 'Edit Category' : 'Add Category'}</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Category Name *</label>
                  <input
                    className="form-input"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="e.g. Economy, Luxury..."
                    autoFocus
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <><div className="spinner spinner-sm" /> Saving...</> : (editing ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
