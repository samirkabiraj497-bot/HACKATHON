const { getUserNotifications, markAsRead, markAllAsRead } = require('../services/notification/notificationService');
const { successResponse, errorResponse } = require('../utils/response');

async function getNotifications(req, res, next) {
  try {
    const userId = req.user ? req.user.id : 'u0000000-0000-0000-0000-000000000001';
    const { unreadOnly } = req.query;
    const list = await getUserNotifications(userId, unreadOnly === 'true');
    return successResponse(res, list, 'Notifications retrieved');
  } catch (err) {
    next(err);
  }
}

async function readNotification(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await markAsRead(id);
    return successResponse(res, updated, 'Notification marked as read');
  } catch (err) {
    next(err);
  }
}

async function markAllNotificationsRead(req, res, next) {
  try {
    const userId = req.user ? req.user.id : 'u0000000-0000-0000-0000-000000000001';
    const result = await markAllAsRead(userId);
    return successResponse(res, result, 'All notifications marked as read');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getNotifications,
  readNotification,
  markAllNotificationsRead
};
