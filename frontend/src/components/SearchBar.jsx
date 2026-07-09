import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = 'Search by brand or model...' }) => {
  return (
    <div className="form-group" style={{ flex: 2, minWidth: 200 }}>
      <label className="form-label">Search</label>
      <div style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute', left: '0.875rem', top: '50%',
          transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex'
        }}><Search size={16} /></span>
        <input
          type="text"
          className="form-input"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ paddingLeft: '2.5rem' }}
        />
      </div>
    </div>
  );
};

export default SearchBar;
