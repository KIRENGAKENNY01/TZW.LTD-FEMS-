import express from 'express';
import { z } from 'zod';
import { validate, authenticate, authorize, ROLES } from 'shared';
import * as usersController from '../controllers/users.js';
import { sendError } from 'shared';

const router = express.Router();

const checkInternalKey = (req, res, next) => {
  const key = req.headers['x-internal-key'];
  if (!key || key !== (process.env.INTERNAL_API_KEY || 'supersecretinternalkey')) {
    return sendError(res, 'Forbidden: Invalid internal API key', {}, 403);
  }
  next();
};

const updateProfileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1)
});

const updateRoleSchema = z.object({
  role: z.enum(['ADMIN', 'INSPECTOR', 'USER'])
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8)
});

const forgotPasswordSchema = z.object({
  email: z.string().email()
});

const resetPasswordSchema = z.object({
  token: z.string().uuid(),
  newPassword: z.string().min(8)
});

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User Profiles and Password Recovery Management Service
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: List all user profiles (ADMIN only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Array of profiles returned
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin role required)
 */
router.get('/api/users', authenticate, authorize(ROLES.ADMIN), usersController.getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get profile by userId (ADMIN or own user)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Profile returned
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Profile not found
 */
router.get('/api/users/:id', authenticate, usersController.getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update profile (ADMIN or own user)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put('/api/users/:id', authenticate, validate(updateProfileSchema), usersController.updateProfile);

/**
 * @swagger
 * /api/users/{id}/change-password:
 *   post:
 *     tags: [Users]
 *     summary: Change password (own user only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: User1234!
 *               newPassword:
 *                 type: string
 *                 example: User5678!
 *     responses:
 *       200:
 *         description: Password updated
 *       400:
 *         description: Invalid current password
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/api/users/:id/change-password', authenticate, validate(changePasswordSchema), usersController.changePassword);

/**
 * @swagger
 * /api/users/forgot-password:
 *   post:
 *     tags: [Users]
 *     summary: Request password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user1@tzw.com
 *     responses:
 *       200:
 *         description: Password reset token returned
 *       404:
 *         description: User not found
 */
router.post('/api/users/forgot-password', validate(forgotPasswordSchema), usersController.forgotPassword);

/**
 * @swagger
 * /api/users/reset-password:
 *   post:
 *     tags: [Users]
 *     summary: Reset password using token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 format: uuid
 *               newPassword:
 *                 type: string
 *                 example: NewPassword123!
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 */
router.post('/api/users/reset-password', validate(resetPasswordSchema), usersController.resetPassword);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Soft-delete user (sets isActive=false via auth service) (ADMIN only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User soft-deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.delete('/api/users/:id', authenticate, authorize(ROLES.ADMIN), usersController.deleteUser);

router.patch(
  '/api/users/:id/role',
  authenticate,
  authorize(ROLES.ADMIN),
  validate(updateRoleSchema),
  usersController.updateUserRole
);

// Internal routes (called by auth service)
router.post('/internal/profiles', checkInternalKey, usersController.createInternalProfile);

export default router;
