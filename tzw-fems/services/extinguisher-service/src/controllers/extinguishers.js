import prisma from '../lib/prisma.js';
import { sendSuccess, sendError, throttleAsync } from 'shared';

const applyRoleScope = (where, user) => {
  if (user.role === 'USER') {
    where.OR = [
      { ownerUserId: user.id },
      { assignedUserId: user.id }
    ];
  } else if (user.role === 'INSPECTOR') {
    where.inspectorId = user.id;
  }
  return where;
};

const assertExtinguisherAccess = (extinguisher, user) => {
  if (user.role === 'USER') {
    return extinguisher.ownerUserId === user.id || extinguisher.assignedUserId === user.id;
  }
  if (user.role === 'INSPECTOR') {
    return extinguisher.inspectorId === user.id;
  }
  return true;
};

// Throttled to reduce write-on-read overhead (every 5 minutes)
const autoUpdateExpired = async () => {
  await throttleAsync('ext-expired', 5 * 60 * 1000, async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await prisma.fireExtinguisher.updateMany({
      where: {
        expiryDate: { lt: today },
        status: { not: 'EXPIRED' }
      },
      data: { status: 'EXPIRED' }
    });
  });
};

// Helper to check if any returned extinguisher is expiring within 30 days
const hasExpiringSoon = (extinguishers) => {
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  const list = Array.isArray(extinguishers) ? extinguishers : [extinguishers];
  return list.some(ext => {
    const expDate = new Date(ext.expiryDate);
    return expDate >= today && expDate <= thirtyDaysFromNow && ext.status !== 'EXPIRED';
  });
};

export const registerExtinguisher = async (req, res, next) => {
  try {
    const { serialNumber, location, building, floor, type, size, installationDate, expiryDate, notes, ownerUserId, inspectorId } = req.body;

    const instDate = new Date(installationDate);
    const expDate = new Date(expiryDate);

    if (expDate <= instDate) {
      return sendError(res, 'Expiry date must be after the installation date', {}, 400);
    }

    const existing = await prisma.fireExtinguisher.findUnique({ where: { serialNumber } });
    if (existing) {
      return sendError(res, 'Fire extinguisher with this serial number already registered', {}, 400);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const status = expDate < today ? 'EXPIRED' : 'ACTIVE';

    const extinguisher = await prisma.fireExtinguisher.create({
      data: {
        serialNumber,
        location,
        building,
        floor,
        type,
        size,
        installationDate: instDate,
        expiryDate: expDate,
        status,
        notes,
        registeredBy: req.user.id,
        ownerUserId,
        inspectorId
      }
    });

    const isExpiringSoon = hasExpiringSoon(extinguisher);
    return sendSuccess(res, extinguisher, 'Fire extinguisher registered successfully', {
      expiringWarning: isExpiringSoon
    }, 201);
  } catch (error) {
    next(error);
  }
};

export const getExtinguishers = async (req, res, next) => {
  try {
    await autoUpdateExpired();

    const { type, status, location, building, floor } = req.query;
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const skip = (page - 1) * limit;

    const where = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (building) where.building = { contains: building, mode: 'insensitive' };
    if (floor) where.floor = floor;
    applyRoleScope(where, req.user);

    const [extinguishers, total] = await prisma.$transaction([
      prisma.fireExtinguisher.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.fireExtinguisher.count({ where })
    ]);

    const isExpiringSoon = hasExpiringSoon(extinguishers);

    return sendSuccess(res, extinguishers, 'Fire extinguishers retrieved successfully', {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      expiringWarning: isExpiringSoon
    });
  } catch (error) {
    next(error);
  }
};

export const getExtinguisherById = async (req, res, next) => {
  try {
    await autoUpdateExpired();
    const { id } = req.params;

    const extinguisher = await prisma.fireExtinguisher.findUnique({ where: { id } });
    if (!extinguisher) {
      return sendError(res, 'Fire extinguisher not found', {}, 404);
    }
    if (!assertExtinguisherAccess(extinguisher, req.user)) {
      return sendError(res, 'Forbidden: Access denied', {}, 403);
    }

    const isExpiringSoon = hasExpiringSoon(extinguisher);

    return sendSuccess(res, extinguisher, 'Fire extinguisher retrieved successfully', {
      expiringWarning: isExpiringSoon
    });
  } catch (error) {
    next(error);
  }
};

export const assignExtinguisher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ownerUserId, inspectorId } = req.body;

    const current = await prisma.fireExtinguisher.findUnique({ where: { id } });
    if (!current) {
      return sendError(res, 'Fire extinguisher not found', {}, 404);
    }

    const updated = await prisma.fireExtinguisher.update({
      where: { id },
      data: {
        ownerUserId: ownerUserId !== undefined ? ownerUserId : current.ownerUserId,
        inspectorId: inspectorId !== undefined ? inspectorId : current.inspectorId
      }
    });

    return sendSuccess(res, updated, 'Extinguisher assignment updated successfully');
  } catch (error) {
    next(error);
  }
};

export const updateExtinguisher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { serialNumber, location, building, floor, type, size, installationDate, expiryDate, status, notes, ownerUserId, inspectorId } = req.body;

    const current = await prisma.fireExtinguisher.findUnique({ where: { id } });
    if (!current) {
      return sendError(res, 'Fire extinguisher not found', {}, 404);
    }

    const instDate = installationDate ? new Date(installationDate) : new Date(current.installationDate);
    const expDate = expiryDate ? new Date(expiryDate) : new Date(current.expiryDate);

    if (expDate <= instDate) {
      return sendError(res, 'Expiry date must be after the installation date', {}, 400);
    }

    if (serialNumber && serialNumber !== current.serialNumber) {
      const existing = await prisma.fireExtinguisher.findUnique({ where: { serialNumber } });
      if (existing) {
        return sendError(res, 'Fire extinguisher with this serial number already registered', {}, 400);
      }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let resolvedStatus = status || current.status;
    if (expDate < today) {
      resolvedStatus = 'EXPIRED';
    }

    const updated = await prisma.fireExtinguisher.update({
      where: { id },
      data: {
        serialNumber,
        location,
        building,
        floor,
        type,
        size,
        installationDate: instDate,
        expiryDate: expDate,
        status: resolvedStatus,
        notes,
        ownerUserId,
        inspectorId
      }
    });

    const isExpiringSoon = hasExpiringSoon(updated);

    return sendSuccess(res, updated, 'Fire extinguisher updated successfully', {
      expiringWarning: isExpiringSoon
    });
  } catch (error) {
    next(error);
  }
};

export const deleteExtinguisher = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const current = await prisma.fireExtinguisher.findUnique({ where: { id } });
    if (!current) {
      return sendError(res, 'Fire extinguisher not found', {}, 404);
    }

    await prisma.fireExtinguisher.delete({ where: { id } });
    return sendSuccess(res, {}, 'Fire extinguisher deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const getExpiredExtinguishers = async (req, res, next) => {
  try {
    await autoUpdateExpired();
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const skip = (page - 1) * limit;

    const where = { status: 'EXPIRED' };
    applyRoleScope(where, req.user);

    const [extinguishers, total] = await prisma.$transaction([
      prisma.fireExtinguisher.findMany({
        where,
        skip,
        take: limit,
        orderBy: { expiryDate: 'asc' }
      }),
      prisma.fireExtinguisher.count({ where })
    ]);

    return sendSuccess(res, extinguishers, 'Expired fire extinguishers retrieved', {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

export const getExpiringSoonExtinguishers = async (req, res, next) => {
  try {
    await autoUpdateExpired();
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const skip = (page - 1) * limit;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    thirtyDaysFromNow.setHours(23, 59, 59, 999);

    const where = {
      expiryDate: {
        gte: today,
        lte: thirtyDaysFromNow
      },
      status: { not: 'EXPIRED' }
    };
    applyRoleScope(where, req.user);

    const [extinguishers, total] = await prisma.$transaction([
      prisma.fireExtinguisher.findMany({
        where,
        skip,
        take: limit,
        orderBy: { expiryDate: 'asc' }
      }),
      prisma.fireExtinguisher.count({ where })
    ]);

    return sendSuccess(res, extinguishers, 'Expiring soon fire extinguishers retrieved', {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      expiringWarning: extinguishers.length > 0
    });
  } catch (error) {
    next(error);
  }
};

export const patchStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const current = await prisma.fireExtinguisher.findUnique({ where: { id } });
    if (!current) {
      return sendError(res, 'Fire extinguisher not found', {}, 404);
    }

    const updated = await prisma.fireExtinguisher.update({
      where: { id },
      data: { status }
    });

    const isExpiringSoon = hasExpiringSoon(updated);

    return sendSuccess(res, updated, 'Fire extinguisher status updated', {
      expiringWarning: isExpiringSoon
    });
  } catch (error) {
    next(error);
  }
};

// Internal routes
export const getInternalExtinguishers = async (req, res, next) => {
  try {
    await autoUpdateExpired();
    const extinguishers = await prisma.fireExtinguisher.findMany();
    return sendSuccess(res, extinguishers, 'Internal extinguishers list retrieved');
  } catch (error) {
    next(error);
  }
};
export const getInternalExtinguisherById = async (req, res, next) => {
  try {
    await autoUpdateExpired();
    const { id } = req.params;
    const extinguisher = await prisma.fireExtinguisher.findUnique({ where: { id } });
    if (!extinguisher) {
      return sendError(res, 'Extinguisher not found', {}, 404);
    }
    return sendSuccess(res, extinguisher, 'Internal extinguisher details retrieved');
  } catch (error) {
    next(error);
  }
};

// Extinguisher Request System Controllers
export const createRequest = async (req, res, next) => {
  try {
    const { type, building, floor, location, size, extinguisherType, extinguisherId, details } = req.body;

    const request = await prisma.extinguisherRequest.create({
      data: {
        userId: req.user.id,
        type,
        status: 'PENDING',
        building,
        floor,
        location,
        size,
        extinguisherType,
        extinguisherId,
        details
      }
    });

    return sendSuccess(res, request, 'Request submitted successfully', {}, 201);
  } catch (error) {
    next(error);
  }
};

export const getRequests = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const skip = (page - 1) * limit;

    const where = {};
    if (req.user.role === 'USER') {
      where.userId = req.user.id;
    }

    const [requests, total] = await prisma.$transaction([
      prisma.extinguisherRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.extinguisherRequest.count({ where })
    ]);

    return sendSuccess(res, requests, 'Requests retrieved successfully', {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

export const getRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = await prisma.extinguisherRequest.findUnique({ where: { id } });

    if (!request) {
      return sendError(res, 'Request not found', {}, 404);
    }

    if (req.user.role !== 'ADMIN' && request.userId !== req.user.id) {
      return sendError(res, 'Forbidden: Access denied', {}, 403);
    }

    return sendSuccess(res, request, 'Request retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const reviewRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminComment, createExtinguisher, serialNumber, location, building, floor, type, size, installationDate, expiryDate, ownerUserId, inspectorId } = req.body;

    const request = await prisma.extinguisherRequest.findUnique({ where: { id } });
    if (!request) {
      return sendError(res, 'Request not found', {}, 404);
    }

    if (request.status !== 'PENDING') {
      return sendError(res, 'Request has already been reviewed', {}, 400);
    }

    if (status === 'APPROVED' && createExtinguisher) {
      if (!serialNumber || !serialNumber.trim()) {
        return sendError(res, 'Serial number is required to register the extinguisher', {}, 400);
      }
      const existing = await prisma.fireExtinguisher.findUnique({ where: { serialNumber: serialNumber.trim() } });
      if (existing) {
        return sendError(res, 'Fire extinguisher with this serial number already registered', {}, 400);
      }
    }

    const updatedRequest = await prisma.extinguisherRequest.update({
      where: { id },
      data: {
        status,
        adminComment
      }
    });

    let extinguisher = null;
    if (status === 'APPROVED') {
      // If this is a REPLACEMENT request, automatically set the replaced extinguisher status to INACTIVE
      if (request.type === 'REPLACEMENT' && request.extinguisherId) {
        try {
          await prisma.fireExtinguisher.update({
            where: { id: request.extinguisherId },
            data: { status: 'INACTIVE' }
          });
        } catch (err) {
          console.error('Failed to set original extinguisher to INACTIVE:', err.message);
        }
      }

      if (createExtinguisher) {
        // Create fire extinguisher
        const instDate = new Date(installationDate);
        const expDate = new Date(expiryDate);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const extStatus = expDate < today ? 'EXPIRED' : 'ACTIVE';

        extinguisher = await prisma.fireExtinguisher.create({
          data: {
            serialNumber,
            location: location || request.location || 'Unknown',
            building: building || request.building,
            floor: floor || request.floor,
            type: type || request.extinguisherType || 'CO2',
            size: size || request.size || 'LB_5',
            installationDate: instDate,
            expiryDate: expDate,
            status: extStatus,
            ownerUserId: ownerUserId || request.userId,
            inspectorId: inspectorId || null,
            registeredBy: req.user.id
          }
        });
      }
    }

    return sendSuccess(res, { request: updatedRequest, extinguisher }, 'Request reviewed successfully');
  } catch (error) {
    next(error);
  }
};
