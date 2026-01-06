import { Request, Response, NextFunction } from 'express';

/**
 * Global error handling middleware
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // Send error response
  res.status(500).json({
    error: err.message || 'Internal server error',
    path: req.path,
    method: req.method
  });
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
    method: req.method
  });
}
