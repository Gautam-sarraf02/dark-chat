export function errorHandler(err, req, res, next) {
  console.error('[Unhandled Server Error]', err);

  // Return clean, non-sensitive JSON error
  const statusCode = err.status || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'An internal server error occurred.'
      : err.message || 'An internal server error occurred.';

  res.status(statusCode).json({
    success: false,
    error: message,
  });
}
