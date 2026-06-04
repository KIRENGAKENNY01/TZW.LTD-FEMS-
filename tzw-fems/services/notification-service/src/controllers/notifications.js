import prisma from '../lib/prisma.js';
import { sendSuccess, sendError } from 'shared';

export const getNotifications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const skip = (page - 1) * limit;

    const [notifications, total] = await prisma.$transaction([
      prisma.notification.findMany({
        where: { recipientId: req.user.id },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.notification.count({
        where: { recipientId: req.user.id }
      })
    ]);

    return sendSuccess(res, notifications, 'Notifications retrieved successfully', {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await prisma.notification.count({
      where: {
        recipientId: req.user.id,
        isRead: false
      }
    });

    return sendSuccess(res, { count }, 'Unread count retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const readNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.findFirst({
      where: {
        id,
        recipientId: req.user.id
      }
    });

    if (!notification) {
      return sendError(res, 'Notification not found', {}, 404);
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });

    return sendSuccess(res, updated, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
};

export const readAllNotifications = async (req, res, next) => {
  try {
    const updated = await prisma.notification.updateMany({
      where: {
        recipientId: req.user.id,
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });

    return sendSuccess(res, { count: updated.count }, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.findFirst({
      where: {
        id,
        recipientId: req.user.id
      }
    });

    if (!notification) {
      return sendError(res, 'Notification not found', {}, 404);
    }

    await prisma.notification.delete({
      where: { id }
    });

    return sendSuccess(res, {}, 'Notification deleted successfully');
  } catch (error) {
    next(error);
  }
};

// Internal route called by other services
export const createInternalNotification = async (req, res, next) => {
  try {
    const { recipientId, type, title, body } = req.body;

    const notification = await prisma.notification.create({
      data: {
        recipientId,
        type,
        title,
        body
      }
    });

    return sendSuccess(res, notification, 'Internal notification created successfully', {}, 201);
  } catch (error) {
    next(error);
  }
};
