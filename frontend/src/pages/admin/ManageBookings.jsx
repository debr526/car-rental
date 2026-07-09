import { useEffect, useState } from 'react';
import { ClipboardList } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchBookings = () => {
    setLoading(true);
    api.get('/bookings')
      .then(res => setBookings(res.data.data.bookings))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { booking_status: status });
      toast.success(`Booking ${status}!`);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Permanently delete this booking?')) return;
    try {
      await api.delete(`/bookings/${id}`);
      toast.success('Booking deleted');
      fetchBookings();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.booking_status === filter);

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <div className="admin-page">
          <div className="page-header">
            <div>
              <h1 className="page-title">Manage Bookings</h1>
              <p className="page-subtitle">{bookings.length} total bookings</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {['all', 'pending', 'approved', 'rejected', 'cancelled'].map(s => (
              <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(s)}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
                {s === 'pending' && bookings.filter(b => b.booking_status === 'pending').length > 0 && (
                  <span style={{
                    background: 'var(--danger)', color: 'white', borderRadius: '50%',
                    width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 700, marginLeft: 4,
                  }}>
                    {bookings.filter(b => b.booking_status === 'pending').length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {loading ? <div className="loading-center"><div className="spinner" /></div> : (
            filtered.length === 0 ? (
              <div className="empty-state glass-card" style={{ padding: '3rem' }}>
                <div className="empty-icon" style={{ display: 'flex', justifyContent: 'center', color: 'var(--text-muted)' }}><ClipboardList size={48} /></div>
                <h3>No {filter !== 'all' ? filter : ''} bookings</h3>
              </div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Customer</th>
                      <th>Car</th>
                      <th>Dates</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(b => (
                      <tr key={b.id}>
                        <td style={{ color: 'var(--text-muted)' }}>#{b.id}</td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{b.customer_name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.customer_email}</div>
                        </td>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {b.brand} {b.model}
                        </td>
                        <td style={{ fontSize: '0.8rem' }}>
                          {new Date(b.start_date).toLocaleDateString()} →<br />
                          {new Date(b.end_date).toLocaleDateString()}
                        </td>
                        <td style={{ color: 'var(--primary-light)', fontWeight: 700 }}>
                          ${parseFloat(b.total_price).toFixed(2)}
                        </td>
                        <td><span className={`badge badge-${b.booking_status}`}>{b.booking_status}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                            {b.booking_status === 'pending' && (
                              <>
                                <button className="btn btn-success btn-sm" onClick={() => handleStatus(b.id, 'approved')}>Approve</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleStatus(b.id, 'rejected')}>Reject</button>
                              </>
                            )}
                            {b.booking_status === 'approved' && (
                              <button className="btn btn-warning btn-sm" onClick={() => handleStatus(b.id, 'cancelled')}>Cancel</button>
                            )}
                            <button className="btn btn-secondary btn-sm" onClick={() => handleDelete(b.id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;
