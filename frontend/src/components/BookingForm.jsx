import { useState } from 'react';
import { Calendar, Check, X } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const BookingForm = ({ car }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const diff = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.ceil(diff));
  };

  const days = calculateDays();
  const totalPrice = days > 0 ? (parseFloat(car.daily_price) * days).toFixed(2) : '0.00';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (days <= 0) {
      toast.error('End date must be after start date');
      return;
    }

    setLoading(true);
    try {
      await api.post('/bookings', {
        car_id: car.id,
        start_date: startDate,
        end_date: endDate,
      });
      toast.success('Booking created! Awaiting admin approval.');
      setStartDate('');
      setEndDate('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-form">
      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={18} /> Reserve This Car</span>
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="grid-2 mb-3">
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-input"
              value={startDate}
              min={today}
              onChange={e => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-input"
              value={endDate}
              min={startDate || today}
              onChange={e => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        {days > 0 && (
          <div className="booking-summary mb-3">
            <div className="booking-summary-row">
              <span style={{ color: 'var(--text-secondary)' }}>Daily Rate</span>
              <span>{parseFloat(car.daily_price).toFixed(0)} ETB</span>
            </div>
            <div className="booking-summary-row">
              <span style={{ color: 'var(--text-secondary)' }}>Duration</span>
              <span>{days} day{days > 1 ? 's' : ''}</span>
            </div>
            <div className="booking-summary-row total">
              <span>Total Price</span>
              <span>{parseFloat(totalPrice).toFixed(0)} ETB</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary btn-full btn-lg"
          disabled={loading || !car.availability_status}
        >
          {loading ? (
            <><div className="spinner spinner-sm" /> Processing...</>
          ) : (
            car.availability_status ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><Check size={18} /> Confirm Booking</span> : <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><X size={18} /> Car Unavailable</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
