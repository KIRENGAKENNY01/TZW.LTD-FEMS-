import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import prisma from '../lib/prisma.js';
import { sendSuccess, sendError } from 'shared';

const SALT_ROUNDS = 12;

export const register = async (req, res, next) => {
  try {
    const { email, password, role, firstName, lastName } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return sendError(res, 'Email already registered', {}, 400);
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    
    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: role || 'USER',
        isActive: true
      }
    });

    // Fire-and-forget or await profile creation in User Management Service
    try {
      const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:5002';
      await axios.post(`${userServiceUrl}/internal/profiles`, {
        userId: user.id,
        firstName: firstName || email.split('@')[0],
        lastName: lastName || 'User'
      }, {
        headers: {
          'x-internal-key': process.env.INTERNAL_API_KEY || 'supersecretinternalkey'
        }
      });
    } catch (profileError) {
      console.error('Failed to create user profile in user service:', profileError.message);
      // We don't fail the registration if user profile creation has issues, but we log it.
    }

    const userResponse = {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt
    };

    return sendSuccess(res, userResponse, 'User registered successfully', {}, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      return sendError(res, 'Invalid credentials or inactive account', {}, 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return sendError(res, 'Invalid credentials', {}, 401);
    }

    // Generate refresh token string first
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET || 'supersecretrefreshkey12345',
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
    );

    // Save refresh token to DB with ACTIVE status
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const refreshTokenRecord = await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt,
        status: 'ACTIVE'
      }
    });

    // Generate access token including the sessionId
    const accessToken = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        isActive: user.isActive,
        sessionId: refreshTokenRecord.id 
      },
      process.env.JWT_SECRET || 'supersecretjwtkey12345',
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    const userResponse = {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    };

    return sendSuccess(res, { accessToken, refreshToken, user: userResponse }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return sendError(res, 'Refresh token is required', {}, 400);
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true }
    });

    if (!storedToken || storedToken.expiresAt < new Date() || storedToken.status !== 'ACTIVE' || !storedToken.user.isActive) {
      return sendError(res, 'Invalid or expired refresh token', {}, 401);
    }

    // Issue new access token with same sessionId
    const accessToken = jwt.sign(
      { 
        id: storedToken.user.id, 
        email: storedToken.user.email, 
        role: storedToken.user.role, 
        isActive: storedToken.user.isActive,
        sessionId: storedToken.id
      },
      process.env.JWT_SECRET || 'supersecretjwtkey12345',
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    return sendSuccess(res, { accessToken }, 'Access token refreshed successfully');
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return sendError(res, 'Refresh token is required to logout', {}, 400);
    }

    // Mark token as REVOKED
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { status: 'REVOKED' }
    });

    return sendSuccess(res, {}, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

export const validateSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const session = await prisma.refreshToken.findUnique({
      where: { id: sessionId },
      include: { user: true }
    });

    if (!session || session.status !== 'ACTIVE' || !session.user.isActive || session.expiresAt < new Date()) {
      return sendError(res, 'Session is invalid or revoked', {}, 401);
    }

    return sendSuccess(res, { userId: session.userId }, 'Session is active');
  } catch (error) {
    next(error);
  }
};

export const listInspectors = async (req, res, next) => {
  try {
    const inspectors = await prisma.user.findMany({
      where: { role: 'INSPECTOR', isActive: true },
      select: { id: true, email: true }
    });
    return sendSuccess(res, inspectors, 'Inspectors retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      return sendError(res, 'User not found', {}, 404);
    }

    const userResponse = {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return sendSuccess(res, userResponse, 'Profile details retrieved');
  } catch (error) {
    next(error);
  }
};

// Internal routes
export const getInternalUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return sendError(res, 'User not found', {}, 404);
    }

    return sendSuccess(res, {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    }, 'Internal user retrieved');
  } catch (error) {
    next(error);
  }
};

export const getInternalUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.params;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return sendError(res, 'User not found', {}, 404);
    }

    return sendSuccess(res, {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    }, 'Internal user by email retrieved');
  } catch (error) {
    next(error);
  }
};

// Internal route to update user password/isActive from other services
export const updateInternalUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password, isActive, role } = req.body;

    const data = {};
    if (password) {
      data.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    }
    if (isActive !== undefined) {
      data.isActive = isActive;
    }
    if (role && ['ADMIN', 'INSPECTOR', 'USER'].includes(role)) {
      data.role = role;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data
    });

    return sendSuccess(res, { id: updatedUser.id, isActive: updatedUser.isActive }, 'Internal user updated');
  } catch (error) {
    next(error);
  }
};
