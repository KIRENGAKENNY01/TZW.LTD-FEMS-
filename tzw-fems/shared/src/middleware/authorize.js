import { sendError } from '../utils/response.js';

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return sendError(res, 'Access denied. User authorization details missing.', {}, 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, 'Forbidden. Insufficient permissions.', {}, 403);
    }

    next();
  };
};
