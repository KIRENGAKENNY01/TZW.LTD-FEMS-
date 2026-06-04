import express from 'express';
import { z } from 'zod';
import { validate, authenticate, authorize, ROLES } from 'shared';
import * as extController from '../controllers/extinguishers.js';
import { sendError } from 'shared';

const router = express.Router();

const checkInternalKey = (req, res, next) => {
  const key = req.headers['x-internal-key'];
  if (!key || key !== (process.env.INTERNAL_API_KEY || 'supersecretinternalkey')) {
    return sendError(res, 'Forbidden: Invalid internal API key', {}, 403);
  }
  next();
};

const dateStringSchema = z.string().refine(val => !isNaN(Date.parse(val)), {
  message: 'Invalid date format'
});

const registerSchema = z.object({
  serialNumber: z.string().min(3),
  location: z.string().min(1),
  building: z.string().nullable().optional(),
  floor: z.string().nullable().optional(),
  type: z.enum(['WATER', 'CO2', 'FOAM', 'DRY_CHEMICAL']),
  size: z.enum(['LB_1_5', 'LB_2_5', 'LB_5', 'LB_9', 'LB_12']),
  installationDate: dateStringSchema,
  expiryDate: dateStringSchema,
  notes: z.string().nullable().optional(),
  ownerUserId: z.string().uuid().nullable().optional(),
  inspectorId: z.string().uuid().nullable().optional()
});

const updateSchema = z.object({
  serialNumber: z.string().min(3).optional(),
  location: z.string().min(1).optional(),
  building: z.string().nullable().optional(),
  floor: z.string().nullable().optional(),
  type: z.enum(['WATER', 'CO2', 'FOAM', 'DRY_CHEMICAL']).optional(),
  size: z.enum(['LB_1_5', 'LB_2_5', 'LB_5', 'LB_9', 'LB_12']).optional(),
  installationDate: dateStringSchema.optional(),
  expiryDate: dateStringSchema.optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'EXPIRED', 'UNDER_MAINTENANCE']).optional(),
  notes: z.string().nullable().optional(),
  ownerUserId: z.string().uuid().nullable().optional(),
  inspectorId: z.string().uuid().nullable().optional()
});

const patchStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'EXPIRED', 'UNDER_MAINTENANCE'])
});

/**
 * @swagger
 * tags:
 *   name: Extinguishers
 *   description: Fire Extinguisher Inventory Management Service
 */

/**
 * @swagger
 * /api/extinguishers:
 *   post:
 *     tags: [Extinguishers]
 *     summary: Register a new fire extinguisher (ADMIN/INSPECTOR only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serialNumber
 *               - location
 *               - type
 *               - size
 *               - installationDate
 *               - expiryDate
 *             properties:
 *               serialNumber:
 *                 type: string
 *                 example: SN-001
 *               location:
 *                 type: string
 *                 example: Building A, Room 102
 *               building:
 *                 type: string
 *                 example: Building A
 *               floor:
 *                 type: string
 *                 example: "1"
 *               type:
 *                 type: string
 *                 enum: [WATER, CO2, FOAM, DRY_CHEMICAL]
 *                 example: CO2
 *               size:
 *                 type: string
 *                 enum: [LB_1_5, LB_5, LB_9, LB_12]
 *                 example: LB_5
 *               installationDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-01-01T00:00:00Z"
 *               expiryDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-01-01T00:00:00Z"
 *               notes:
 *                 type: string
 *                 example: Brand new CO2 canister
 *     responses:
 *       201:
 *         description: Extinguisher registered
 *       400:
 *         description: Expiry date error or serial number duplicate
 *       401:
 *         description: Unauthorized
 */
router.post('/api/extinguishers', authenticate, authorize(ROLES.ADMIN, ROLES.INSPECTOR), validate(registerSchema), extController.registerExtinguisher);

/**
 * @swagger
 * /api/extinguishers:
 *   get:
 *     tags: [Extinguishers]
 *     summary: List fire extinguishers (paginated & filtered)
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
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [WATER, CO2, FOAM, DRY_CHEMICAL]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, EXPIRED, UNDER_MAINTENANCE]
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: building
 *         schema:
 *           type: string
 *       - in: query
 *         name: floor
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Extinguishers matching filters
 */
router.get('/api/extinguishers', authenticate, extController.getExtinguishers);

/**
 * @swagger
 * /api/extinguishers/expired:
 *   get:
 *     tags: [Extinguishers]
 *     summary: List expired fire extinguishers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of expired extinguishers
 */
router.get('/api/extinguishers/expired', authenticate, extController.getExpiredExtinguishers);

/**
 * @swagger
 * /api/extinguishers/expiring-soon:
 *   get:
 *     tags: [Extinguishers]
 *     summary: List extinguishers expiring within 30 days
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of expiring soon extinguishers
 */
router.get('/api/extinguishers/expiring-soon', authenticate, extController.getExpiringSoonExtinguishers);

const requestSchema = z.object({
  type: z.enum(['NEW', 'REPLACEMENT', 'INSTALLATION']),
  building: z.string().nullable().optional(),
  floor: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  size: z.enum(['LB_1_5', 'LB_2_5', 'LB_5', 'LB_9', 'LB_12']).nullable().optional(),
  extinguisherType: z.enum(['WATER', 'CO2', 'FOAM', 'DRY_CHEMICAL']).nullable().optional(),
  extinguisherId: z.string().uuid().nullable().optional(),
  details: z.string().nullable().optional()
});

const reviewSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  adminComment: z.string().nullable().optional(),
  createExtinguisher: z.boolean().optional(),
  serialNumber: z.string().min(3).optional(),
  location: z.string().optional(),
  building: z.string().nullable().optional(),
  floor: z.string().nullable().optional(),
  type: z.enum(['WATER', 'CO2', 'FOAM', 'DRY_CHEMICAL']).optional(),
  size: z.enum(['LB_1_5', 'LB_2_5', 'LB_5', 'LB_9', 'LB_12']).optional(),
  installationDate: dateStringSchema.optional(),
  expiryDate: dateStringSchema.optional(),
  ownerUserId: z.string().uuid().nullable().optional(),
  inspectorId: z.string().uuid().nullable().optional()
});

// Extinguisher Request routes
router.post('/api/extinguishers/requests', authenticate, validate(requestSchema), extController.createRequest);
router.get('/api/extinguishers/requests', authenticate, extController.getRequests);
router.get('/api/extinguishers/requests/:id', authenticate, extController.getRequestById);
router.patch('/api/extinguishers/requests/:id/review', authenticate, authorize(ROLES.ADMIN), validate(reviewSchema), extController.reviewRequest);


/**
 * @swagger
 * /api/extinguishers/{id}:
 *   get:
 *     tags: [Extinguishers]
 *     summary: Get extinguisher details by ID
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
 *         description: Extinguisher details
 *       404:
 *         description: Extinguisher not found
 */
router.get('/api/extinguishers/:id', authenticate, extController.getExtinguisherById);

/**
 * @swagger
 * /api/extinguishers/{id}:
 *   put:
 *     tags: [Extinguishers]
 *     summary: Update fire extinguisher (ADMIN/INSPECTOR only)
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
 *             properties:
 *               serialNumber:
 *                 type: string
 *               location:
 *                 type: string
 *               building:
 *                 type: string
 *               floor:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [WATER, CO2, FOAM, DRY_CHEMICAL]
 *               size:
 *                 type: string
 *                 enum: [LB_1_5, LB_5, LB_9, LB_12]
 *               installationDate:
 *                 type: string
 *                 format: date-time
 *               expiryDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE, EXPIRED, UNDER_MAINTENANCE]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Extinguisher updated
 *       404:
 *         description: Extinguisher not found
 */
router.put('/api/extinguishers/:id', authenticate, authorize(ROLES.ADMIN, ROLES.INSPECTOR), validate(updateSchema), extController.updateExtinguisher);

/**
 * @swagger
 * /api/extinguishers/{id}:
 *   delete:
 *     tags: [Extinguishers]
 *     summary: Delete extinguisher record (ADMIN only)
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
 *         description: Extinguisher deleted
 *       404:
 *         description: Extinguisher not found
 */
router.delete('/api/extinguishers/:id', authenticate, authorize(ROLES.ADMIN), extController.deleteExtinguisher);

/**
 * @swagger
 * /api/extinguishers/{id}/status:
 *   patch:
 *     tags: [Extinguishers]
 *     summary: Update extinguisher status only (ADMIN/INSPECTOR only)
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE, EXPIRED, UNDER_MAINTENANCE]
 *                 example: UNDER_MAINTENANCE
 *     responses:
 *       200:
 *         description: Status updated
 *       404:
 *         description: Extinguisher not found
 */
router.patch('/api/extinguishers/:id/status', authenticate, authorize(ROLES.ADMIN, ROLES.INSPECTOR), validate(patchStatusSchema), extController.patchStatus);

const assignSchema = z.object({
  ownerUserId: z.string().uuid().nullable().optional(),
  inspectorId: z.string().uuid().nullable().optional()
});

router.patch(
  '/api/extinguishers/:id/assign',
  authenticate,
  authorize(ROLES.ADMIN),
  validate(assignSchema),
  extController.assignExtinguisher
);

// Internal routes (called by other services)
router.get('/internal/extinguishers', checkInternalKey, extController.getInternalExtinguishers);
router.get('/internal/extinguishers/:id', checkInternalKey, extController.getInternalExtinguisherById);
router.patch('/internal/extinguishers/:id/status', checkInternalKey, validate(patchStatusSchema), extController.patchStatus);

export default router;
