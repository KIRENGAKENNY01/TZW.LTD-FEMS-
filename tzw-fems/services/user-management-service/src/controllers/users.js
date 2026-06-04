import axios from 'axios';
import crypto from 'crypto';
import prisma from '../lib/prisma.js';
import { sendSuccess, sendError } from 'shared';

const getInternalHeaders = () => ({
  'x-internal-key': process.env.INTERNAL_API_KEY || 'supersecretinternalkey'
});

export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const skip = (page - 1) * limit;

    const [profiles, total] = await prisma.$transaction([
      prisma.userProfile.findMany({
        skip,
        take: limit,
        orderBy: { lastName: 'asc' }
      }),
      prisma.userProfile.count()
    ]);

    return sendSuccess(res, profiles, 'User profiles retrieved successfully', {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Access control: ADMIN or own user
    if (req.user.role !== 'ADMIN' && req.user.id !== id) {
      return sendError(res, 'Forbidden: Access denied', {}, 403);
    }

    const profile = await prisma.userProfile.findUnique({
      where: { userId: id }
    });

    if (!profile) {
      return sendError(res, 'User profile not found', {}, 404);
    }

    return sendSuccess(res, profile, 'User profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName } = req.body;

    // Access control: ADMIN or own user
    if (req.user.role !== 'ADMIN' && req.user.id !== id) {
      return sendError(res, 'Forbidden: Access denied', {}, 403);
    }

    const profile = await prisma.userProfile.upsert({
      where: { userId: id },
      update: { firstName, lastName },
      create: { userId: id, firstName, lastName }
    });

    return sendSuccess(res, profile, 'User profile updated successfully');
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Access control: own user only
    if (req.user.id !== id) {
      return sendError(res, 'Forbidden: You can only change your own password', {}, 403);
    }

    const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:5001';

    // 1. Fetch user email from Auth Service
    let userEmail;
    try {
      const authUserRes = await axios.get(`${authServiceUrl}/internal/users/${id}`, {
        headers: getInternalHeaders()
      });
      userEmail = authUserRes.data.data.email;
    } catch (err) {
      return sendError(res, 'User not found in Auth Service', {}, 404);
    }

    // 2. Validate current password by trying to log in
    try {
      await axios.post(`${authServiceUrl}/api/auth/login`, {
        email: userEmail,
        password: currentPassword
      });
    } catch (err) {
      return sendError(res, 'Invalid current password', {}, 400);
    }

    // 3. Update password via internal route in Auth Service
    await axios.patch(`${authServiceUrl}/internal/users/${id}`, {
      password: newPassword
    }, {
      headers: getInternalHeaders()
    });

    // 4. Send notification (optional - notification service call)
    try {
      const notifServiceUrl = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5006';
      await axios.post(`${notifServiceUrl}/internal/notifications`, {
        recipientId: id,
        type: 'PASSWORD_RESET',
        title: 'Password Changed',
        body: 'Your account password has been updated successfully.'
      }, {
        headers: getInternalHeaders()
      });
    } catch (err) {
      console.error('Failed to dispatch password change notification:', err.message);
    }

    return sendSuccess(res, {}, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:5001';

    // 1. Resolve email to userId via Auth Service
    let userId;
    try {
      const authUserRes = await axios.get(`${authServiceUrl}/internal/users/by-email/${email}`, {
        headers: getInternalHeaders()
      });
      userId = authUserRes.data.data.id;
    } catch (err) {
      // In production, we might want to return 200 anyway to prevent user enumeration, 
      // but let's return 404 or success as per requirement
      return sendError(res, 'No user found with this email', {}, 404);
    }

    // 2. Create profile reset entry if profile exists
    let profile = await prisma.userProfile.findUnique({ where: { userId } });
    if (!profile) {
      // Create lazy profile if missing
      profile = await prisma.userProfile.create({
        data: {
          userId,
          firstName: email.split('@')[0],
          lastName: 'User'
        }
      });
    }

    const token = crypto.randomUUID ? crypto.randomUUID() : (await import('crypto')).randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

    await prisma.passwordReset.create({
      data: {
        userId,
        token,
        expiresAt
      }
    });

    // 3. Dispatch forgot-password notification via notification service
    try {
      const notifServiceUrl = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5006';
      await axios.post(`${notifServiceUrl}/internal/notifications`, {
        recipientId: userId,
        type: 'PASSWORD_RESET',
        title: 'Reset Password Request',
        body: `You requested a password reset. Use this token: ${token}`
      }, {
        headers: getInternalHeaders()
      });
    } catch (err) {
      console.error('Failed to dispatch forgot password notification:', err.message);
    }

    return sendSuccess(res, { token }, 'Password reset token generated');
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    const resetRequest = await prisma.passwordReset.findUnique({
      where: { token },
      include: { userProfile: true }
    });

    if (!resetRequest || resetRequest.used || resetRequest.expiresAt < new Date()) {
      return sendError(res, 'Invalid, used, or expired password reset token', {}, 400);
    }

    const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:5001';

    // 1. Update password in Auth Service
    await axios.patch(`${authServiceUrl}/internal/users/${resetRequest.userId}`, {
      password: newPassword
    }, {
      headers: getInternalHeaders()
    });

    // 2. Mark token as used
    await prisma.passwordReset.update({
      where: { id: resetRequest.id },
      data: { used: true }
    });

    // 3. Send notification
    try {
      const notifServiceUrl = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5006';
      await axios.post(`${notifServiceUrl}/internal/notifications`, {
        recipientId: resetRequest.userId,
        type: 'PASSWORD_RESET',
        title: 'Password Reset Successful',
        body: 'Your password has been successfully reset using the token.'
      }, {
        headers: getInternalHeaders()
      });
    } catch (err) {
      console.error('Failed to dispatch password reset success notification:', err.message);
    }

    return sendSuccess(res, {}, 'Password reset successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:5001';

    // Soft delete in Auth Service
    await axios.patch(`${authServiceUrl}/internal/users/${id}`, {
      isActive: false
    }, {
      headers: getInternalHeaders()
    });

    return sendSuccess(res, {}, 'User account soft-deleted successfully');
  } catch (error) {
    next(error);
  }
};

// Internal endpoint to lazy create profile
export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:5001';

    await axios.patch(
      `${authServiceUrl}/internal/users/${id}`,
      { role },
      { headers: getInternalHeaders() }
    );

    return sendSuccess(res, { id, role }, 'User role updated successfully');
  } catch (error) {
    next(error);
  }
};

export const createInternalProfile = async (req, res, next) => {
  try {
    const { userId, firstName, lastName } = req.body;

    const profile = await prisma.userProfile.upsert({
      where: { userId },
      update: { firstName, lastName },
      create: { userId, firstName, lastName }
    });

    return sendSuccess(res, profile, 'Internal user profile created/updated', {}, 201);
  } catch (error) {
    next(error);
  }
};
