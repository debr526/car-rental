/**
 * Logger Middleware
 * Logs HTTP method, URL, status code, and timestamp for every request
 */
const logger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });

  next();
};

module.exports = { logger };
