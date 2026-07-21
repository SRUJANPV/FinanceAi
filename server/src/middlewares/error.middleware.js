export function notFound(req, res) { res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` }); }
export function errorHandler(error, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(error);
  if (error.name === 'ValidationError') return res.status(400).json({ success: false, message: 'Validation failed', errors: Object.values(error.errors).map((e) => e.message) });
  if (error.code === 11000) return res.status(409).json({ success: false, message: 'A record with that value already exists.' });
  const status = error.statusCode || 500;
  res.status(status).json({ success: false, message: status === 500 ? 'Internal server error' : error.message });
}
