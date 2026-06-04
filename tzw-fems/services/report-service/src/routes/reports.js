import express from 'express';
import { z } from 'zod';
import { validate, authenticate, authorize, ROLES } from 'shared';
import * as reportsController from '../controllers/reports.js';

const router = express.Router();

const exportSchema = z.object({
  format: z.enum(['PDF', 'CSV']),
  period: z.enum(['DAILY', 'MONTHLY', 'YEARLY', 'CUSTOM']).optional()
});

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Fire Safety Performance Reporting & Export Service
 */

/**
 * @swagger
 * /api/reports/inventory:
 *   get:
 *     tags: [Reports]
 *     summary: Retrieve aggregate inventory report
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [DAILY, MONTHLY, YEARLY, CUSTOM]
 *           default: CUSTOM
 *     responses:
 *       200:
 *         description: Report data retrieved
 */
router.get('/api/reports/inventory', authenticate, authorize(ROLES.ADMIN, ROLES.INSPECTOR), reportsController.getInventoryReport);

/**
 * @swagger
 * /api/reports/inventory/daily:
 *   get:
 *     tags: [Reports]
 *     summary: Retrieve daily inventory report
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Report data retrieved
 */
router.get('/api/reports/inventory/daily', authenticate, authorize(ROLES.ADMIN, ROLES.INSPECTOR), (req, res, next) => {
  req.query.period = 'DAILY';
  reportsController.getInventoryReport(req, res, next);
});

/**
 * @swagger
 * /api/reports/inventory/monthly:
 *   get:
 *     tags: [Reports]
 *     summary: Retrieve monthly inventory report
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Report data retrieved
 */
router.get('/api/reports/inventory/monthly', authenticate, authorize(ROLES.ADMIN, ROLES.INSPECTOR), (req, res, next) => {
  req.query.period = 'MONTHLY';
  reportsController.getInventoryReport(req, res, next);
});

/**
 * @swagger
 * /api/reports/inventory/yearly:
 *   get:
 *     tags: [Reports]
 *     summary: Retrieve yearly inventory report
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Report data retrieved
 */
router.get('/api/reports/inventory/yearly', authenticate, authorize(ROLES.ADMIN, ROLES.INSPECTOR), (req, res, next) => {
  req.query.period = 'YEARLY';
  reportsController.getInventoryReport(req, res, next);
});

/**
 * @swagger
 * /api/reports/inspections:
 *   get:
 *     tags: [Reports]
 *     summary: Retrieve inspections report
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Report data retrieved
 */
router.get('/api/reports/inspections', authenticate, authorize(ROLES.ADMIN, ROLES.INSPECTOR), reportsController.getInspectionReport);

/**
 * @swagger
 * /api/reports/compliance:
 *   get:
 *     tags: [Reports]
 *     summary: Retrieve compliance status report
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Report data retrieved
 */
router.get(
  '/api/reports/compliance',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.INSPECTOR, ROLES.USER),
  reportsController.getComplianceReport
);

/**
 * @swagger
 * /api/reports/maintenance:
 *   get:
 *     tags: [Reports]
 *     summary: Retrieve maintenance logs summary report
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Report data retrieved
 */
router.get('/api/reports/maintenance', authenticate, authorize(ROLES.ADMIN, ROLES.INSPECTOR), reportsController.getMaintenanceReport);

/**
 * @swagger
 * /api/reports/{type}/export:
 *   post:
 *     tags: [Reports]
 *     summary: Request PDF or CSV export generation for a report type
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [inventory, inspection, compliance, maintenance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - format
 *             properties:
 *               format:
 *                 type: string
 *                 enum: [PDF, CSV]
 *                 example: PDF
 *               period:
 *                 type: string
 *                 enum: [DAILY, MONTHLY, YEARLY, CUSTOM]
 *                 example: CUSTOM
 *     responses:
 *       200:
 *         description: Export job created in PROCESSING status
 */
router.post('/api/reports/:type/export', authenticate, authorize(ROLES.ADMIN, ROLES.INSPECTOR), validate(exportSchema), reportsController.triggerExport);

router.post(
  '/api/reports/my/:type/export',
  authenticate,
  authorize(ROLES.USER),
  validate(exportSchema),
  (req, res, next) => {
    if (!['compliance', 'inventory'].includes(req.params.type)) {
      return res.status(403).json({ success: false, message: 'Users may only export compliance and inventory reports' });
    }
    reportsController.triggerExport(req, res, next);
  }
);

// Download file route
router.get('/api/reports/exports/download/:filename', reportsController.downloadExportFile);

/**
 * @swagger
 * /api/reports/exports/{jobId}:
 *   get:
 *     tags: [Reports]
 *     summary: Check export job status and retrieve download URL
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Job details with status (DONE/PROCESSING)
 *       404:
 *         description: Job not found
 */
router.get(
  '/api/reports/exports/:jobId',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.INSPECTOR, ROLES.USER),
  reportsController.getExportJobStatus
);

export default router;
