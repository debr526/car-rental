import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import BookingForm from '../components/BookingForm';
import { useAuth } from '../context/AuthContext';

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/cars/${id}`)
      .then(res => setCar(res.data.data.car))
      .catch(() => navigate('/cars'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="main-content loading-center"><div className="spinner" /></div>;
  if (!car) return null;

  const fallbackImg = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800';

  return (
    <div className="main-content">
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
        <button onClick={() => navigate('/cars')} className="btn btn-secondary btn-sm mb-4">
          ← Back to Fleet
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '2.5rem', alignItems: 'start' }}>
          {/* Left: Car Info */}
          <div>
            <div style={{
              borderRadius: 'var(--radius-xl)', overflow: 'hidden',
              border: '1px solid var(--border)', marginBottom: '2rem',
              height: 400,
            }}>
              <img
                src={car.image_url || fallbackImg}
                alt={`${car.brand} ${car.model}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { e.target.src = fallbackImg; }}
              />
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{car.brand} {car.model}</h1>
                  <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>📅 Year: {car.year}</p>
                </div>
                <span className={`badge ${car.availability_status ? 'badge-available' : 'badge-unavailable'}`}>
                  {car.availability_status ? '✓ Available' : '✗ Unavailable'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Category</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{car.category_name || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Daily Rate</div>
                  <div style={{ fontWeight: 800, color: 'var(--primary-light)', fontSize: '1.25rem' }}>${parseFloat(car.daily_price).toFixed(2)}</div>
                </div>
              </div>

              {car.description && (
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                    About This Vehicle
                  </h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.9rem' }}>
                    {car.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Booking */}
          <div style={{ position: 'sticky', top: 'calc(var(--navbar-height) + 1.5rem)' }}>
            <div className="price-tag mb-3">
              <span className="price-amount">${parseFloat(car.daily_price).toFixed(0)}</span>
              <span className="price-period">/day</span>
            </div>
            {user ? (
              user.role === 'customer' ? (
                <BookingForm car={car} />
              ) : (
                <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-muted)' }}>Admins cannot make bookings.</p>
                </div>
              )
            ) : (
              <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Sign in to book this car
                </p>
                <a href="/login" className="btn btn-primary btn-full">Sign In to Book</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
