import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import toast from 'react-hot-toast';

const EMPTY_FORM = { brand: '', model: '', year: new Date().getFullYear(), category_id: '', daily_price: '', availability_status: true, image_url: '', description: '' };

const ManageCars = () => {
  const [cars, setCars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchData = () => {
    setLoading(true);
    Promise.all([api.get('/cars'), api.get('/categories')])
      .then(([carsRes, catRes]) => {
        setCars(carsRes.data.data.cars);
        setCategories(catRes.data.data.categories);
      })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (car) => {
    setEditing(car);
    setForm({
      brand: car.brand, model: car.model, year: car.year,
      category_id: car.category_id || '',
      daily_price: car.daily_price, availability_status: car.availability_status,
      image_url: car.image_url || '', description: car.description || '',
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/cars/${editing.id}`, form);
        toast.success('Car updated successfully!');
      } else {
        await api.post('/cars', form);
        toast.success('Car added successfully!');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this car? This cannot be undone.')) return;
    try {
      await api.delete(`/cars/${id}`);
      toast.success('Car deleted');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleToggleAvail = async (car) => {
    try {
      await api.patch(`/cars/${car.id}/availability`, { availability_status: !car.availability_status });
      toast.success('Availability updated');
      fetchData();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <div className="admin-page">
          <div className="page-header">
            <div>
              <h1 className="page-title">Manage Cars</h1>
              <p className="page-subtitle">{cars.length} vehicles in fleet</p>
            </div>
            <button className="btn btn-primary" onClick={openAdd}>+ Add Car</button>
          </div>

          {loading ? <div className="loading-center"><div className="spinner" /></div> : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Car</th>
                    <th>Category</th>
                    <th>Year</th>
                    <th>Daily Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map(car => (
                    <tr key={car.id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {car.brand} {car.model}
                      </td>
                      <td>{car.category_name || '—'}</td>
                      <td>{car.year}</td>
                      <td style={{ color: 'var(--primary-light)', fontWeight: 700 }}>
                        ${parseFloat(car.daily_price).toFixed(2)}
                      </td>
                      <td>
                        <span className={`badge ${car.availability_status ? 'badge-available' : 'badge-unavailable'}`}>
                          {car.availability_status ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => openEdit(car)}>Edit</button>
                          <button className="btn btn-warning btn-sm" onClick={() => handleToggleAvail(car)}>
                            {car.availability_status ? 'Set Unavail.' : 'Set Avail.'}
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(car.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{editing ? 'Edit Car' : 'Add New Car'}</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Brand *</label>
                    <input className="form-input" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} required placeholder="e.g. Toyota" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Model *</label>
                    <input className="form-input" value={form.model} onChange={e => setForm({...form, model: e.target.value})} required placeholder="e.g. Corolla" />
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Year *</label>
                    <input type="number" className="form-input" value={form.year} onChange={e => setForm({...form, year: e.target.value})} required min="1900" max="2100" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Daily Price (ETB) *</label>
                    <input type="number" step="0.01" className="form-input" value={form.daily_price} onChange={e => setForm({...form, daily_price: e.target.value})} required min="0.01" />
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})}>
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Availability</label>
                    <select className="form-select" value={form.availability_status} onChange={e => setForm({...form, availability_status: e.target.value === 'true'})}>
                      <option value="true">Available</option>
                      <option value="false">Unavailable</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input className="form-input" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} placeholder="https://..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Car description..." />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <><div className="spinner spinner-sm" /> Saving...</> : (editing ? 'Update Car' : 'Add Car')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCars;
