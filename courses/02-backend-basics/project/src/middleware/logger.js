/** Stub — implement per challenge 02 README */
export function logger(req, _res, next) { next(); }
export function requestLogger(req, _res, next) { next(); }
export function errorHandler(err, _req, res, _next) { res.status(500).json({ error: err.message }); }
