const db = require('../../database/db');

/**
 * CampusFlow Notification Service
 * Manages user notifications, badges, and real-time alerts
 */

async function createNotification({ userId, title, message, type = 'info', referenceId = null, referenceType = 'request' }) {
  const notif = await db.notifications.create({
    user_id: userId,
    title,
    message,
    type,
    reference_id: referenceId,
    reference_type: referenceType,
    is_read: false
  });
  return notif;
}

async function getUserNotifications(userId, unreadOnly = false) {
  const filter = { user_id: userId };
  if (unreadOnly) filter.is_read = false;

  const list = await db.notifications.find(filter);
  // Sort newest first
  list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return list;
}

async function markAsRead(notificationId) {
  return await db.notifications.update(notificationId, { is_read: true });
}

async function markAllAsRead(userId) {
  const userNotifs = await db.notifications.find({ user_id: userId, is_read: false });
  for (const n of userNotifs) {
    await db.notifications.update(n.id, { is_read: true });
  }
  return { updatedCount: userNotifs.length };
}

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead
};
