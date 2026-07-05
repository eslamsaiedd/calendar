/**
 * Wraps an async Express route handler so rejected promises are forwarded
 * to the centralized error-handling middleware instead of crashing the process.
 * @param {Function} fn - async (req, res, next) => {}
 */
module.exports = function catchAsync(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
