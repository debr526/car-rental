import { useEffect, useState } from 'react';
import api from '../services/api';
import CarCard from '../components/CarCard';
import FilterPanel from '../components/FilterPanel';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '', category_id: '', min_price: '', max_price: '', available: '',
  });

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data.data.categories));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category_id) params.set('category_id', filters.category_id);
    if (filters.min_price) params.set('min_price', filters.min_price);
    if (filters.max_price) params.set('max_price', filters.max_price);
    if (filters.available !== '') params.set('available', filters.available);

    api.get(`/cars?${params.toString()}`)
      .then(res => setCars(res.data.data.cars))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div className="main-content">
      <div className="container section">
        <div className="section-header">
          <h1>Our <span className="gradient-text">Fleet</span></h1>
          <p>Browse our complete collection of vehicles. Use filters to find exactly what you need.</p>
        </div>

        <FilterPanel filters={filters} onChange={setFilters} categories={categories} />

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : cars.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🚗</div>
            <h3>No cars found</h3>
            <p>Try adjusting your filters to see more results.</p>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Showing <strong style={{ color: 'var(--text-primary)' }}>{cars.length}</strong> vehicle{cars.length !== 1 ? 's' : ''}
            </p>
            <div className="cars-grid">
              {cars.map(car => <CarCard key={car.id} car={car} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cars;
