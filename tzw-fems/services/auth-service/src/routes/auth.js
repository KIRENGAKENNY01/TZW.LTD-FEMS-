import express from 'express';
import { z } from 'zod';
import { validate, authenticate } from 'shared';
import * as authController from '../controllers/auth.js';
import { sendError } from 'shared';

const router = express.Router();

// Internal key verification middleware
const checkInternalKey = (req, res, next) => {
  const key = req.headers['x-internal-key'];
  if (!key || key !== (process.env.INTERNAL_API_KEY || 'supersecretinternalkey')) {
    return sendError(res, 'Forbidden: Invalid internal API key', {}, 403);
  }
  next();
};

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['INSPECTOR', 'USER']).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

const refreshSchema = z.object({
  refreshToken: z.string()
});

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and Token Management Service
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user and trigger profile creation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@tzw.com
 *               password:
 *                 type: string
 *                 minimum: 8
 *                 example: Admin1234!
 *               role:
 *                 type: string
 *                 enum: [ADMIN, INSPECTOR, USER]
 *                 example: ADMIN
 *               firstName:
 *                 type: string
 *                 example: Admin
 *               lastName:
 *                 type: string
 *                 example: User
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Email already registered
 *       422:
 *         description: Validation error
 */
router.post('/api/auth/register', validate(registerSchema), authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Authenticate user and return access & refresh tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@tzw.com
 *               password:
 *                 type: string
 *                 example: Admin1234!
 *     responses:
 *       200:
 *         description: Access & refresh tokens generated
 *       401:
 *         description: Invalid credentials
 *       422:
 *         description: Validation error
 */
router.post('/api/auth/login', validate(loginSchema), authController.login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token using refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token generated
 *       401:
 *         description: Invalid or expired refresh token
 *       422:
 *         description: Validation error
 */
router.post('/api/auth/refresh', validate(refreshSchema), authController.refresh);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Invalidate refresh token and logout
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/api/auth/logout', authenticate, authController.logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Retrieve own credentials registry record
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile details retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/api/auth/me', authenticate, authController.me);

router.get('/api/auth/inspectors', authenticate, authController.listInspectors);

// Internal routes (called by other services)
router.get('/internal/sessions/validate/:sessionId', checkInternalKey, authController.validateSession);
router.get('/internal/users/by-email/:email', checkInternalKey, authController.getInternalUserByEmail);
router.get('/internal/users/:id', checkInternalKey, authController.getInternalUser);
router.patch('/internal/users/:id', checkInternalKey, authController.updateInternalUser);


export default router;
