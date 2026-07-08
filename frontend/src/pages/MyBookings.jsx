import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchBookings = () => {
    setLoading(true);
    api.get('/bookings/my-bookings')
      .then(res => setBookings(res.data.data.bookings))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.delete(`/bookings/${id}`);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.booking_status === filter);

  const fallbackImg = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200';

  return (
    <div className="main-content">
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
        <div className="page-header">
          <div>
            <h1 className="page-title">My Bookings</h1>
            <p className="page-subtitle">Track and manage all your car reservations</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {['all', 'pending', 'approved', 'cancelled', 'rejected'].map(s => (
            <button
              key={s}
              className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state glass-card" style={{ padding: '4rem' }}>
            <div className="empty-icon">📋</div>
            <h3>No {filter !== 'all' ? filter : ''} bookings found</h3>
            <p>Your booking history will appear here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map(b => (
              <div key={b.id} className="glass-card animate-fade-in" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: '1.5rem', alignItems: 'center' }}>
                <img
                  src={b.image_url || fallbackImg}
                  alt={`${b.brand} ${b.model}`}
                  style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                  onError={e => { e.target.src = fallbackImg; }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    {b.brand} {b.model} <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.8rem' }}>{b.year}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    📅 {new Date(b.start_date).toLocaleDateString()} → {new Date(b.end_date).toLocaleDateString()}
                    {' · '}
                    🏷️ {b.category_name}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--primary-light)', fontWeight: 700 }}>
                      ${parseFloat(b.total_price).toFixed(2)}
                    </span>
                    <span className={`badge badge-${b.booking_status}`}>{b.booking_status}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Booked {new Date(b.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div>
                  {b.booking_status === 'pending' && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleCancel(b.id)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
