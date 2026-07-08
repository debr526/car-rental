import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import CarCard from '../components/CarCard';

const Home = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cars?available=true')
      .then(res => setFeaturedCars(res.data.data.cars.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper">
      {/* HERO */}
      <section className="hero section">
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
        <div className="container hero-content animate-slide-up">
          <div className="hero-eyebrow">
            ✦ Premium Car Rental Service
          </div>
          <h1 className="hero-title">
            Drive Your <span className="gradient-text">Dream Car</span><br />
            Today
          </h1>
          <p className="hero-description">
            QuickReserve offers a premium fleet of vehicles for every occasion.
            From economy to luxury, find your perfect ride and book instantly.
          </p>
          <div className="hero-buttons">
            <Link to="/cars" className="btn btn-primary btn-lg">
              🚗 Browse Cars
            </Link>
            <Link to="/register" className="btn btn-secondary btn-lg">
              Get Started Free
            </Link>
          </div>
          <div className="hero-stats">
            <div>
              <div className="hero-stat-value">50+</div>
              <div className="hero-stat-label">Vehicles Available</div>
            </div>
            <div>
              <div className="hero-stat-value">1,200+</div>
              <div className="hero-stat-label">Happy Customers</div>
            </div>
            <div>
              <div className="hero-stat-value">6</div>
              <div className="hero-stat-label">Car Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-header">
            <h2>Why Choose <span className="gradient-text">QuickReserve?</span></h2>
            <p>Everything you need for a perfect car rental experience</p>
          </div>
          <div className="grid-3">
            {[
              { icon: '⚡', title: 'Instant Booking', desc: 'Reserve your car in seconds with our streamlined booking system.' },
              { icon: '🔒', title: 'Secure & Trusted', desc: 'Your data is encrypted and protected with industry-standard security.' },
              { icon: '🌟', title: 'Premium Fleet', desc: 'Choose from economy, luxury, SUVs, sports cars and more.' },
              { icon: '📱', title: 'Easy Management', desc: 'View and manage all your bookings from your personal dashboard.' },
              { icon: '💰', title: 'Best Prices', desc: 'Competitive daily rates with transparent pricing and no hidden fees.' },
              { icon: '🎯', title: 'Smart Filtering', desc: 'Find exactly what you need with powerful search and filter tools.' },
            ].map((f, i) => (
              <div key={i} className="glass-card" style={{ padding: '2rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{f.icon}</div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED CARS */}
      <section className="section" style={{ background: 'rgba(99,102,241,0.03)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-header">
            <h2>Featured <span className="gradient-text">Vehicles</span></h2>
            <p>Handpicked cars ready for your next adventure</p>
          </div>

          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : (
            <div className="cars-grid">
              {featuredCars.map(car => <CarCard key={car.id} car={car} />)}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/cars" className="btn btn-primary btn-lg">View All Cars →</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.1))',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: 'var(--radius-xl)',
            padding: '4rem 2rem',
            textAlign: 'center',
          }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>
              Ready to <span className="gradient-text">Get Started?</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: 480, margin: '0 auto 2rem' }}>
              Create your free account today and experience the easiest car rental booking system.
            </p>
            <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>© 2025 QuickReserve Car Rental Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
