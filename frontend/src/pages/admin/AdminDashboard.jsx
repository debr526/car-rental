import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Car, CheckCircle, Users, ClipboardList, Clock, Check } from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/summary')
      .then(res => setSummary(res.data.data.summary))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { icon: '🚗', label: 'Total Cars', value: summary?.totalCars || 0, colorClass: 'stat-icon-purple' },
    { icon: '✅', label: 'Available Cars', value: summary?.availableCars || 0, colorClass: 'stat-icon-green' },
    { icon: '👥', label: 'Total Customers', value: summary?.totalUsers || 0, colorClass: 'stat-icon-cyan' },
    { icon: '📋', label: 'Total Bookings', value: summary?.totalBookings || 0, colorClass: 'stat-icon-amber' },
    { icon: '⏳', label: 'Pending Bookings', value: summary?.pendingBookings || 0, colorClass: 'stat-icon-red' },
    { icon: '✔️', label: 'Approved', value: summary?.bookingsByStatus?.approved || 0, colorClass: 'stat-icon-green' },
  ];

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <div className="admin-page">
          <div className="page-header">
            <div>
              <h1 className="page-title">Admin Dashboard</h1>
              <p className="page-subtitle">Overview of QuickReserve operations</p>
            </div>
          </div>

          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : (
            <>
              <div className="grid-3 mb-4">
                {stats.map((s, i) => (
                  <div key={i} className="stat-card animate-fade-in">
                    <div className={`stat-icon ${s.colorClass}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
                    <div>
                      <div className="stat-value">{s.value}</div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Status breakdown */}
              {summary?.bookingsByStatus && (
                <div className="glass-card" style={{ padding: '2rem' }}>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                    Booking Status Breakdown
                  </h2>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {Object.entries(summary.bookingsByStatus).map(([status, count]) => (
                      <div key={status} style={{
                        flex: 1, minWidth: 120,
                        background: 'var(--bg-glass)', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)', padding: '1.25rem', textAlign: 'center',
                      }}>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {count}
                        </div>
                        <span className={`badge badge-${status}`} style={{ marginTop: '0.5rem' }}>
                          {status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
