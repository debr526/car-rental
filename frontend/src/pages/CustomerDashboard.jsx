import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Calendar, Clock, CheckCircle, Car, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings/my-bookings')
      .then(res => setBookings(res.data.data.bookings))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total = bookings.length;
  const upcoming = bookings.filter(b => b.booking_status === 'approved' && new Date(b.start_date) >= new Date()).length;
  const pending = bookings.filter(b => b.booking_status === 'pending').length;
  const completed = bookings.filter(b => b.booking_status === 'approved' && new Date(b.end_date) < new Date()).length;

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : '?';

  return (
    <div className="main-content">
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
        {/* Welcome */}
        <div className="glass-card animate-slide-up mb-4" style={{ padding: '2.5rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', fontWeight: 800, color: 'white', flexShrink: 0,
          }}>{initials}</div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
              Welcome back, <span className="gradient-text">{user?.full_name?.split(' ')[0]}</span>!
            </h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              {user?.email} · Customer Account
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid-4 mb-4">
          <div className="stat-card">
            <div className="stat-icon stat-icon-purple">📋</div>
            <div>
              <div className="stat-value">{total}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-green">🗓️</div>
            <div>
              <div className="stat-value">{upcoming}</div>
              <div className="stat-label">Upcoming Trips</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-amber">⏳</div>
            <div>
              <div className="stat-value">{pending}</div>
              <div className="stat-label">Pending Approval</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-cyan">✅</div>
            <div>
              <div className="stat-value">{completed}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid-2 mb-4">
          <Link to="/cars" className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', cursor: 'pointer' }}>
            <span style={{ fontSize: '2rem' }}>🚗</span>
            <div>
              <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Browse Cars</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>View available vehicles and make a booking</div>
            </div>
          </Link>
          <Link to="/my-bookings" className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', cursor: 'pointer' }}>
            <span style={{ fontSize: '2rem' }}>📖</span>
            <div>
              <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>My Bookings</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>View history and manage reservations</div>
            </div>
          </Link>
        </div>

        {/* Recent Bookings */}
        <div className="glass-card">
          <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Recent Bookings</h2>
            <Link to="/my-bookings" style={{ fontSize: '0.875rem', color: 'var(--primary-light)' }}>View all →</Link>
          </div>

          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : bookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon" style={{ display: 'flex', justifyContent: 'center', color: 'var(--text-muted)' }}><ClipboardList size={48} /></div>
              <h3>No bookings yet</h3>
              <p>Browse our fleet and make your first reservation!</p>
              <Link to="/cars" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Cars</Link>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Car</th>
                    <th>Dates</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 5).map(b => (
                    <tr key={b.id}>
                      <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                        {b.brand} {b.model} <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.8rem' }}>({b.year})</span>
                      </td>
                      <td>{new Date(b.start_date).toLocaleDateString()} → {new Date(b.end_date).toLocaleDateString()}</td>
                      <td style={{ color: 'var(--primary-light)', fontWeight: 700 }}>{parseFloat(b.total_price).toFixed(0)} ETB</td>
                      <td><span className={`badge badge-${b.booking_status}`}>{b.booking_status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
