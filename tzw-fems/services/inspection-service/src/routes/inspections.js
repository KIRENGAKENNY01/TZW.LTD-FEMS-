import express from 'express';
import { z } from 'zod';
import { validate, authenticate, authorize, ROLES } from 'shared';
import * as inspController from '../controllers/inspections.js';
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

const scheduleSchema = z.object({
  extinguisherId: z.string().uuid(),
  inspectorId: z.string().uuid().optional().nullable(),
  scheduledDate: dateStringSchema,
  scheduledTime: z.string().regex(/^\d{2}:\d{2}$/, { message: 'Must be HH:MM format' }),
  notes: z.string().nullable().optional()
});

const updateSchema = z.object({
  inspectorId: z.string().uuid().optional(),
  scheduledDate: dateStringSchema.optional(),
  scheduledTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  notes: z.string().nullable().optional(),
  status: z.enum(['REQUESTED', 'PENDING', 'COMPLETED', 'OVERDUE', 'CANCELLED']).optional()
});

const approveSchema = z.object({
  inspectorId: z.string().uuid()
});

const completeSchema = z.object({
  result: z.string().min(1).optional(),
  notes: z.string().nullable().optional()
});

const maintenanceSchema = z.object({
  actionTaken: z.string().min(5),
  issuesIdentified: z.string().nullable().optional(),
  recommendations: z.string().nullable().optional(),
  conditionsNoted: z.string().nullable().optional(),
  maintenanceDate: dateStringSchema
});

/**
 * @swagger
 * tags:
 *   name: Inspections
 *   description: Fire Extinguisher Inspection & Maintenance Logging Service
 */

/**
 * @swagger
 * /api/inspections:
 *   post:
 *     tags: [Inspections]
 *     summary: Schedule a new extinguisher inspection
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - extinguisherId
 *               - inspectorId
 *               - scheduledDate
 *               - scheduledTime
 *             properties:
 *               extinguisherId:
 *                 type: string
 *                 format: uuid
 *               inspectorId:
 *                 type: string
 *                 format: uuid
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-10T00:00:00Z"
 *               scheduledTime:
 *                 type: string
 *                 pattern: '^[0-9]{2}:[0-9]{2}$'
 *                 example: "09:00"
 *               notes:
 *                 type: string
 *                 example: Floor 2 annual inspect
 *     responses:
 *       201:
 *         description: Inspection scheduled
 *       400:
 *         description: Invalid status (expired/inactive extinguisher)
 */
router.post('/api/inspections', authenticate, validate(scheduleSchema), inspController.scheduleInspection);

/**
 * @swagger
 * /api/inspections:
 *   get:
 *     tags: [Inspections]
 *     summary: List inspections (filtered & paginated)
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, COMPLETED, OVERDUE, CANCELLED]
 *       - in: query
 *         name: inspectorId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: extinguisherId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Array of inspections
 */
router.get('/api/inspections', authenticate, inspController.getInspections);

/**
 * @swagger
 * /api/inspections/maintenance:
 *   get:
 *     tags: [Inspections]
 *     summary: List all maintenance logs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of maintenance logs
 */
router.get('/api/inspections/maintenance', authenticate, inspController.getMaintenanceLogs);

/**
 * @swagger
 * /api/inspections/{id}:
 *   get:
 *     tags: [Inspections]
 *     summary: Get inspection details by ID
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
 *         description: Inspection payload
 *       404:
 *         description: Inspection not found
 */
router.get('/api/inspections/:id', authenticate, inspController.getInspectionById);

/**
 * @swagger
 * /api/inspections/{id}:
 *   put:
 *     tags: [Inspections]
 *     summary: Update scheduled inspection details (ADMIN/INSPECTOR only)
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
 *               inspectorId:
 *                 type: string
 *                 format: uuid
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *               scheduledTime:
 *                 type: string
 *               notes:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PENDING, COMPLETED, OVERDUE, CANCELLED]
 *     responses:
 *       200:
 *         description: Inspection updated
 */
router.put('/api/inspections/:id', authenticate, authorize(ROLES.ADMIN, ROLES.INSPECTOR), validate(updateSchema), inspController.updateInspection);

/**
 * @swagger
 * /api/inspections/{id}/complete:
 *   patch:
 *     tags: [Inspections]
 *     summary: Mark inspection as completed (INSPECTOR only)
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
 *               result:
 *                 type: string
 *                 example: PASS
 *               notes:
 *                 type: string
 *                 example: Passed visual check
 *     responses:
 *       200:
 *         description: Inspection completed
 */
router.patch('/api/inspections/:id/complete', authenticate, authorize(ROLES.INSPECTOR), validate(completeSchema), inspController.completeInspection);

router.patch('/api/inspections/:id/approve', authenticate, authorize(ROLES.ADMIN), validate(approveSchema), inspController.approveInspection);

/**
 * @swagger
 * /api/inspections/{id}:
 *   delete:
 *     tags: [Inspections]
 *     summary: Cancel inspection (ADMIN only)
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
 *         description: Inspection cancelled
 */
router.delete('/api/inspections/:id', authenticate, authorize(ROLES.ADMIN), inspController.cancelInspection);

/**
 * @swagger
 * /api/inspections/{id}/maintenance:
 *   post:
 *     tags: [Inspections]
 *     summary: Log maintenance for a completed inspection (INSPECTOR only)
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
 *               - actionTaken
 *               - maintenanceDate
 *             properties:
 *               actionTaken:
 *                 type: string
 *                 example: Recharged CO2 pressure
 *               issuesIdentified:
 *                 type: string
 *                 example: Low pressure
 *               recommendations:
 *                 type: string
 *                 example: Re-check in 6 months
 *               maintenanceDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-03T00:00:00Z"
 *     responses:
 *       201:
 *         description: Maintenance logged
 */
router.post('/api/inspections/:id/maintenance', authenticate, authorize(ROLES.INSPECTOR), validate(maintenanceSchema), inspController.logMaintenance);

/**
 * @swagger
 * /api/inspections/{id}/maintenance:
 *   get:
 *     tags: [Inspections]
 *     summary: Retrieve maintenance log for a specific inspection
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
 *         description: Maintenance log payload
 *       404:
 *         description: Maintenance log not found
 */
router.get('/api/inspections/:id/maintenance', authenticate, inspController.getMaintenanceLogForInspection);

// Internal routes (called by other services)
router.get('/internal/inspections', checkInternalKey, inspController.getInternalInspections);
router.get('/internal/inspections/overdue', checkInternalKey, inspController.getInternalOverdueInspections);

export default router;
