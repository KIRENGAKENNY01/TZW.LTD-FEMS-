import express from 'express';
import { z } from 'zod';
import { validate, authenticate } from 'shared';
import * as notifController from '../controllers/notifications.js';
import { sendError } from 'shared';

const router = express.Router();

const checkInternalKey = (req, res, next) => {
  const key = req.headers['x-internal-key'];
  if (!key || key !== (process.env.INTERNAL_API_KEY || 'supersecretinternalkey')) {
    return sendError(res, 'Forbidden: Invalid internal API key', {}, 403);
  }
  next();
};

const createNotificationSchema = z.object({
  recipientId: z.string().uuid(),
  type: z.enum([
    'INSPECTION_SCHEDULED',
    'INSPECTION_OVERDUE',
    'MAINTENANCE_COMPLETED',
    'EXPIRY_ALERT',
    'PASSWORD_RESET',
    'GENERAL'
  ]),
  title: z.string().min(1),
  body: z.string().min(1)
});

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Push Notifications Delivery and History Service
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: Get own notifications (paginated)
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
 *         description: Array of notifications returned
 */
router.get('/api/notifications', authenticate, notifController.getNotifications);

/**
 * @swagger
 * /api/notifications/unread-count:
 *   get:
 *     tags: [Notifications]
 *     summary: Retrieve count of unread notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Count payload
 */
router.get('/api/notifications/unread-count', authenticate, notifController.getUnreadCount);

/**
 * @swagger
 * /api/notifications/read-all:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark all own notifications as read
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All marked read
 */
router.patch('/api/notifications/read-all', authenticate, notifController.readAllNotifications);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark single notification as read
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
 *         description: Notification marked read
 *       404:
 *         description: Notification not found
 */
router.patch('/api/notifications/:id/read', authenticate, notifController.readNotification);

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     tags: [Notifications]
 *     summary: Delete own notification
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
 *         description: Notification deleted
 *       404:
 *         description: Notification not found
 */
router.delete('/api/notifications/:id', authenticate, notifController.deleteNotification);

// Internal routes (called by other services)
router.post('/internal/notifications', checkInternalKey, validate(createNotificationSchema), notifController.createInternalNotification);

export default router;
