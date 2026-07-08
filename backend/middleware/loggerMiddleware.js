/**
 * Logger Middleware
 * Logs HTTP method, URL, status code, and timestamp for every request
 */
const logger = (req, res, next) => {
  const start = Date.now();

  // Capture res.json to intercept status
  const originalJson = res.json.bind(res);
  res.json = function (body) {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    const status = res.statusCode;

    // Color-code by status
    let statusColor = '\x1b[32m'; // green
    if (status >= 400 && status < 500) statusColor = '\x1b[33m'; // yellow
    if (status >= 500) statusColor = '\x1b[31m'; // red

    const reset = '\x1b[0m';
    const cyan = '\x1b[36m';
    const gray = '\x1b[90m';

    console.log(
      `${gray}[${timestamp}]${reset} ` +
      `${cyan}${req.method}${reset} ` +
      `${req.originalUrl} ` +
      `${statusColor}${status}${reset} ` +
      `${gray}${duration}ms${reset}`
    );

    return originalJson(body);
  };

  next();
};

module.exports = { logger };
