import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Authentication required. Missing or malformed token.', {}, 401);
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const secret = process.env.JWT_SECRET || 'supersecretjwtkey12345';
    const decoded = jwt.verify(token, secret);

    const sessionId = decoded.sessionId;
    if (!sessionId) {
      return sendError(res, 'Invalid token. Session not found.', {}, 401);
    }

    const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:5001';
    const internalKey = process.env.INTERNAL_API_KEY || 'supersecretinternalkey';

    try {
      const response = await fetch(`${authServiceUrl}/internal/sessions/validate/${sessionId}`, {
        method: 'GET',
        headers: {
          'x-internal-key': internalKey
        }
      });

      if (!response.ok) {
        return sendError(res, 'Session is invalid or has been revoked.', {}, 401);
      }
    } catch (err) {
      console.error('Error validating session internally:', err.message);
      return sendError(res, 'Authentication validation failed.', {}, 401);
    }

    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, 'Invalid or expired token.', error, 401);
  }
};


