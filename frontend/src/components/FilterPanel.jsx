const FilterPanel = ({ filters, onChange, categories }) => {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const handleReset = () => {
    onChange({ search: '', category_id: '', min_price: '', max_price: '', available: '' });
  };

  return (
    <div className="search-filter-bar mb-4">
      {/* Search */}
      <div className="form-group" style={{ flex: 2, minWidth: 180 }}>
        <label className="form-label">Search</label>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
          <input
            type="text"
            className="form-input"
            value={filters.search}
            onChange={e => handleChange('search', e.target.value)}
            placeholder="Brand or model..."
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      {/* Category */}
      <div className="form-group" style={{ minWidth: 140 }}>
        <label className="form-label">Category</label>
        <select
          className="form-select"
          value={filters.category_id}
          onChange={e => handleChange('category_id', e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Min Price */}
      <div className="form-group" style={{ minWidth: 110 }}>
        <label className="form-label">Min Price</label>
        <input
          type="number"
          className="form-input"
          value={filters.min_price}
          onChange={e => handleChange('min_price', e.target.value)}
          placeholder="$0"
          min="0"
        />
      </div>

      {/* Max Price */}
      <div className="form-group" style={{ minWidth: 110 }}>
        <label className="form-label">Max Price</label>
        <input
          type="number"
          className="form-input"
          value={filters.max_price}
          onChange={e => handleChange('max_price', e.target.value)}
          placeholder="$999"
          min="0"
        />
      </div>

      {/* Availability */}
      <div className="form-group" style={{ minWidth: 130 }}>
        <label className="form-label">Availability</label>
        <select
          className="form-select"
          value={filters.available}
          onChange={e => handleChange('available', e.target.value)}
        >
          <option value="">All</option>
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </select>
      </div>

      {/* Reset */}
      <div className="form-group">
        <label className="form-label" style={{ opacity: 0 }}>.</label>
        <button className="btn btn-secondary" onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
};

export default FilterPanel;
