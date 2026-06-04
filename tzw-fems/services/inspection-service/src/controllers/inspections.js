import axios from 'axios';
import prisma from '../lib/prisma.js';
import { sendSuccess, sendError, throttleAsync } from 'shared';

const getInternalHeaders = () => ({
  'x-internal-key': process.env.INTERNAL_API_KEY || 'supersecretinternalkey'
});

const autoUpdateOverdue = async () => {
  await throttleAsync('insp-overdue', 5 * 60 * 1000, async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await prisma.inspection.updateMany({
      where: {
        scheduledDate: { lt: today },
        status: 'PENDING'
      },
      data: { status: 'OVERDUE' }
    });
  });
};

const buildInspectionWhere = async (req, baseWhere = {}) => {
  const where = { ...baseWhere };
  if (req.user.role === 'INSPECTOR') {
    where.inspectorId = req.user.id;
  } else if (req.user.role === 'USER') {
    const extServiceUrl = process.env.EXTINGUISHER_SERVICE_URL || 'http://localhost:5003';
    let assignedIds = [];
    try {
      const extRes = await axios.get(`${extServiceUrl}/internal/extinguishers`, {
        headers: getInternalHeaders()
      });
      const all = extRes.data?.data ?? extRes.data ?? [];
      assignedIds = all
        .filter((e) => e.assignedUserId === req.user.id || e.ownerUserId === req.user.id)
        .map((e) => e.id);
    } catch {
      assignedIds = [];
    }
    where.OR = [
      { scheduledBy: req.user.id },
      ...(assignedIds.length ? [{ extinguisherId: { in: assignedIds } }] : [])
    ];
  }
  return where;
};

export const scheduleInspection = async (req, res, next) => {
  try {
    const { extinguisherId, inspectorId, scheduledDate, scheduledTime, notes } = req.body;

    const extServiceUrl = process.env.EXTINGUISHER_SERVICE_URL || 'http://localhost:5003';
    
    // 1. Verify extinguisher exists and is not INACTIVE or EXPIRED
    let extinguisher;
    try {
      const extRes = await axios.get(`${extServiceUrl}/internal/extinguishers/${extinguisherId}`, {
        headers: getInternalHeaders()
      });
      extinguisher = extRes.data.data;
    } catch (err) {
      return sendError(res, 'Fire extinguisher not found', {}, 404);
    }

    if (extinguisher.status === 'INACTIVE' || extinguisher.status === 'EXPIRED') {
      return sendError(res, `Cannot schedule inspection: Extinguisher is currently ${extinguisher.status}`, {}, 400);
    }

    let status = 'PENDING';
    if (req.user.role === 'USER') {
      if (extinguisher.assignedUserId && extinguisher.assignedUserId !== req.user.id) {
        return sendError(res, 'You can only request inspections for your assigned extinguishers', {}, 403);
      }
      status = 'REQUESTED';
    }

    // 2. Create the inspection
    const inspection = await prisma.inspection.create({
      data: {
        extinguisherId,
        inspectorId: status === 'REQUESTED' ? null : (inspectorId || null),
        scheduledBy: req.user.id,
        scheduledDate: new Date(scheduledDate),
        scheduledTime,
        status,
        notes
      }
    });

    // 3. Notify the assigned inspector (only if status is PENDING and inspectorId exists)
    if (status === 'PENDING' && inspectorId) {
      try {
        const notifServiceUrl = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5006';
        await axios.post(`${notifServiceUrl}/internal/notifications`, {
          recipientId: inspectorId,
          type: 'INSPECTION_SCHEDULED',
          title: 'New Inspection Scheduled',
          body: `You have been assigned an inspection for extinguisher (SN: ${extinguisher.serialNumber}) scheduled on ${scheduledDate} at ${scheduledTime}.`
        }, {
          headers: getInternalHeaders()
        });
      } catch (err) {
        console.error('Failed to send inspection scheduled notification:', err.message);
      }
    }

    return sendSuccess(res, inspection, status === 'REQUESTED' ? 'Inspection request submitted successfully' : 'Inspection scheduled successfully', {}, 201);
  } catch (error) {
    next(error);
  }
};

export const getInspections = async (req, res, next) => {
  try {
    await autoUpdateOverdue();

    const { status, inspectorId, extinguisherId, from, to } = req.query;
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const skip = (page - 1) * limit;

    const baseWhere = {};
    if (status) baseWhere.status = status;
    if (req.user.role === 'ADMIN' && inspectorId) baseWhere.inspectorId = inspectorId;
    if (extinguisherId) baseWhere.extinguisherId = extinguisherId;
    if (from || to) {
      baseWhere.scheduledDate = {};
      if (from) baseWhere.scheduledDate.gte = new Date(from);
      if (to) baseWhere.scheduledDate.lte = new Date(to);
    }

    const where = await buildInspectionWhere(req, baseWhere);

    const [inspections, total] = await prisma.$transaction([
      prisma.inspection.findMany({
        where,
        skip,
        take: limit,
        orderBy: { scheduledDate: 'asc' },
        include: { maintenanceLog: true }
      }),
      prisma.inspection.count({ where })
    ]);

    return sendSuccess(res, inspections, 'Inspections retrieved successfully', {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

export const getInspectionById = async (req, res, next) => {
  try {
    await autoUpdateOverdue();
    const { id } = req.params;

    const inspection = await prisma.inspection.findUnique({
      where: { id },
      include: { maintenanceLog: true }
    });

    if (!inspection) {
      return sendError(res, 'Inspection not found', {}, 404);
    }

    return sendSuccess(res, inspection, 'Inspection details retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updateInspection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { inspectorId, scheduledDate, scheduledTime, notes, status } = req.body;

    const current = await prisma.inspection.findUnique({ where: { id } });
    if (!current) {
      return sendError(res, 'Inspection not found', {}, 404);
    }

    if (current.status === 'COMPLETED' || current.status === 'CANCELLED') {
      return sendError(res, 'Cannot update completed or cancelled inspections', {}, 400);
    }

    const updated = await prisma.inspection.update({
      where: { id },
      data: {
        inspectorId: inspectorId || current.inspectorId,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : current.scheduledDate,
        scheduledTime: scheduledTime || current.scheduledTime,
        status: status || current.status,
        notes: notes || current.notes
      }
    });

    return sendSuccess(res, updated, 'Inspection updated successfully');
  } catch (error) {
    next(error);
  }
};

export const completeInspection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { result, notes } = req.body;

    const current = await prisma.inspection.findUnique({ where: { id } });
    if (!current) {
      return sendError(res, 'Inspection not found', {}, 404);
    }

    if (current.status === 'COMPLETED') {
      return sendError(res, 'Inspection is already completed', {}, 400);
    }

    const completed = await prisma.inspection.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        result: result || 'PASS',
        notes
      }
    });

    // Notify inspector and scheduling user
    try {
      const notifServiceUrl = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5006';
      
      const payload = {
        type: 'MAINTENANCE_COMPLETED',
        title: 'Inspection Completed',
        body: `Inspection ${id} for extinguisher ${current.extinguisherId} has been marked completed.`
      };

      // Notify scheduler
      await axios.post(`${notifServiceUrl}/internal/notifications`, {
        ...payload,
        recipientId: current.scheduledBy
      }, { headers: getInternalHeaders() });

      // Notify inspector (if different)
      if (current.inspectorId !== current.scheduledBy) {
        await axios.post(`${notifServiceUrl}/internal/notifications`, {
          ...payload,
          recipientId: current.inspectorId
        }, { headers: getInternalHeaders() });
      }
    } catch (err) {
      console.error('Failed to send inspection completed notifications:', err.message);
    }

    return sendSuccess(res, completed, 'Inspection completed successfully');
  } catch (error) {
    next(error);
  }
};

export const cancelInspection = async (req, res, next) => {
  try {
    const { id } = req.params;

    const current = await prisma.inspection.findUnique({ where: { id } });
    if (!current) {
      return sendError(res, 'Inspection not found', {}, 404);
    }

    const cancelled = await prisma.inspection.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    return sendSuccess(res, cancelled, 'Inspection cancelled successfully');
  } catch (error) {
    next(error);
  }
};

export const logMaintenance = async (req, res, next) => {
  try {
    const { id } = req.params; // inspectionId
    const { actionTaken, issuesIdentified, recommendations, conditionsNoted, maintenanceDate } = req.body;

    const inspection = await prisma.inspection.findUnique({
      where: { id },
      include: { maintenanceLog: true }
    });

    if (!inspection) {
      return sendError(res, 'Inspection not found', {}, 404);
    }

    if (inspection.status !== 'COMPLETED') {
      return sendError(res, 'Cannot log maintenance on non-completed inspection', {}, 400);
    }

    if (inspection.maintenanceLog) {
      return sendError(res, 'Maintenance log already exists for this inspection', {}, 400);
    }

    const log = await prisma.maintenanceLog.create({
      data: {
        extinguisherId: inspection.extinguisherId,
        inspectorId: req.user.id,
        inspectionId: id,
        actionTaken,
        issuesIdentified,
        recommendations,
        conditionsNoted,
        maintenanceDate: new Date(maintenanceDate)
      }
    });

    // 1. Update extinguisher status to ACTIVE via Extinguisher Service internal route
    try {
      const extServiceUrl = process.env.EXTINGUISHER_SERVICE_URL || 'http://localhost:5003';
      await axios.patch(`${extServiceUrl}/internal/extinguishers/${inspection.extinguisherId}/status`, {
        status: 'ACTIVE'
      }, {
        headers: getInternalHeaders()
      });
    } catch (err) {
      console.error('Failed to update extinguisher status to ACTIVE:', err.message);
    }

    // 2. Notify scheduler and inspector
    try {
      const notifServiceUrl = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5006';
      const payload = {
        type: 'MAINTENANCE_COMPLETED',
        title: 'Maintenance Logged',
        body: `Maintenance log created for extinguisher ${inspection.extinguisherId}. Extinguisher status restored to ACTIVE.`
      };

      await axios.post(`${notifServiceUrl}/internal/notifications`, {
        ...payload,
        recipientId: inspection.scheduledBy
      }, { headers: getInternalHeaders() });

      if (inspection.inspectorId !== inspection.scheduledBy) {
        await axios.post(`${notifServiceUrl}/internal/notifications`, {
          ...payload,
          recipientId: inspection.inspectorId
        }, { headers: getInternalHeaders() });
      }
    } catch (err) {
      console.error('Failed to send maintenance logged notifications:', err.message);
    }

    return sendSuccess(res, log, 'Maintenance logged successfully', {}, 201);
  } catch (error) {
    next(error);
  }
};

export const getMaintenanceLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const skip = (page - 1) * limit;

    const where = {};
    if (req.user.role === 'INSPECTOR') {
      where.inspectorId = req.user.id;
    } else if (req.user.role === 'USER') {
      return sendError(res, 'Forbidden: Users cannot access maintenance logs', {}, 403);
    }
    if (req.user.role === 'ADMIN' && req.query.inspectorId) {
      where.inspectorId = req.query.inspectorId;
    }

    const [logs, total] = await prisma.$transaction([
      prisma.maintenanceLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { maintenanceDate: 'desc' }
      }),
      prisma.maintenanceLog.count({ where })
    ]);

    return sendSuccess(res, logs, 'Maintenance logs retrieved', {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

export const getMaintenanceLogForInspection = async (req, res, next) => {
  try {
    const { id } = req.params; // inspectionId
    const log = await prisma.maintenanceLog.findUnique({
      where: { inspectionId: id }
    });

    if (!log) {
      return sendError(res, 'Maintenance log not found', {}, 404);
    }

    return sendSuccess(res, log, 'Maintenance log retrieved');
  } catch (error) {
    next(error);
  }
};

export const approveInspection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { inspectorId } = req.body;

    // 1. Find inspection
    const inspection = await prisma.inspection.findUnique({ where: { id } });
    if (!inspection) {
      return sendError(res, 'Inspection not found', {}, 404);
    }

    if (inspection.status !== 'REQUESTED') {
      return sendError(res, 'Inspection is not in REQUESTED status', {}, 400);
    }

    // 2. Verify extinguisher info (to get serialNumber for notification)
    const extServiceUrl = process.env.EXTINGUISHER_SERVICE_URL || 'http://localhost:5003';
    let extinguisher;
    try {
      const extRes = await axios.get(`${extServiceUrl}/internal/extinguishers/${inspection.extinguisherId}`, {
        headers: getInternalHeaders()
      });
      extinguisher = extRes.data.data;
    } catch (err) {
      console.warn('Failed to fetch extinguisher info for approval:', err.message);
    }

    // 3. Update status to PENDING and assign inspector
    const updatedInspection = await prisma.inspection.update({
      where: { id },
      data: {
        status: 'PENDING',
        inspectorId
      }
    });

    // 4. Notify inspector
    if (inspectorId) {
      try {
        const notifServiceUrl = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5006';
        await axios.post(`${notifServiceUrl}/internal/notifications`, {
          recipientId: inspectorId,
          type: 'INSPECTION_SCHEDULED',
          title: 'New Inspection Assigned',
          body: `You have been assigned a pending inspection for extinguisher (SN: ${extinguisher?.serialNumber || 'Unknown'}) scheduled on ${inspection.scheduledDate.toISOString().slice(0, 10)} at ${inspection.scheduledTime}.`
        }, {
          headers: getInternalHeaders()
        });
      } catch (err) {
        console.error('Failed to send inspection assigned notification:', err.message);
      }
    }

    return sendSuccess(res, updatedInspection, 'Inspection approved and assigned successfully');
  } catch (error) {
    next(error);
  }
};

// Internal routes
export const getInternalInspections = async (req, res, next) => {
  try {
    await autoUpdateOverdue();
    const inspections = await prisma.inspection.findMany({
      include: { maintenanceLog: true }
    });
    return sendSuccess(res, inspections, 'Internal inspections list retrieved');
  } catch (error) {
    next(error);
  }
};
export const getInternalOverdueInspections = async (req, res, next) => {
  try {
    await autoUpdateOverdue();
    const overdue = await prisma.inspection.findMany({
      where: { status: 'OVERDUE' }
    });
    return sendSuccess(res, overdue, 'Internal overdue inspections list retrieved');
  } catch (error) {
    next(error);
  }
};
