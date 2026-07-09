import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

const CarCard = ({ car }) => {
  const fallbackImg = `https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600`;

  return (
    <div className="car-card animate-fade-in">
      <div className="car-card-image">
        <img
          src={car.image_url || fallbackImg}
          alt={`${car.brand} ${car.model}`}
          onError={(e) => { e.target.src = fallbackImg; }}
        />
        <span className="car-card-category">{car.category_name || 'Car'}</span>
        <span className="car-card-badge">
          <span className={`badge ${car.availability_status ? 'badge-available' : 'badge-unavailable'}`}>
            {car.availability_status ? '✓ Available' : '✗ Unavailable'}
          </span>
        </span>
      </div>

      <div className="car-card-body">
        <div className="car-card-title">{car.brand} {car.model}</div>
        <div className="car-card-year"><span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14} /> {car.year}</span></div>

        {car.description && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.5rem' }}>
            {car.description.substring(0, 90)}...
          </p>
        )}

        <div className="car-card-footer">
          <div className="price-tag">
            <span className="price-amount">{parseFloat(car.daily_price).toFixed(0)} ETB</span>
            <span className="price-period">/day</span>
          </div>
          <Link
            to={`/cars/${car.id}`}
            className={`btn btn-primary btn-sm ${!car.availability_status ? 'btn-secondary' : ''}`}
          >
            {car.availability_status ? 'Book Now' : 'View Details'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
