/**
 * Calculate total rental price
 * @param {number} dailyPrice
 * @param {string|Date} startDate
 * @param {string|Date} endDate
 * @returns {number} total price
 */
const calculateTotalPrice = (dailyPrice, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const msPerDay = 1000 * 60 * 60 * 24;
  const days = Math.ceil((end - start) / msPerDay);
  if (days <= 0) throw new Error('End date must be after start date');
  return parseFloat((dailyPrice * days).toFixed(2));
};

/**
 * Calculate number of rental days
 * @param {string|Date} startDate
 * @param {string|Date} endDate
 * @returns {number} number of days
 */
const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil((end - start) / msPerDay);
};

/**
 * Format date to YYYY-MM-DD string
 * @param {Date} date
 * @returns {string}
 */
const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

/**
 * Paginate array results
 * @param {Array} data
 * @param {number} page
 * @param {number} limit
 * @returns {Object}
 */
const paginate = (data, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const paginatedData = data.slice(offset, offset + limit);
  return {
    data: paginatedData,
    pagination: {
      total: data.length,
      page,
      limit,
      totalPages: Math.ceil(data.length / limit),
    },
  };
};

module.exports = { calculateTotalPrice, calculateDays, formatDate, paginate };
