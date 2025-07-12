import NotificationService from '../services/notification.service.js';

// Get user's notifications
export const getUserNotifications = async (req, res) => {
  try {
    const { page, limit, unreadOnly } = req.query;
    const result = await NotificationService.getUserNotifications(req.user.id, {
      page,
      limit,
      unreadOnly: unreadOnly === 'true'
    });

    res.json(result);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const notification = await NotificationService.markAsRead(
      req.params.id,
      req.user.id
    );

    res.json({
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    if (error.message === 'Notification not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const count = await NotificationService.markAllAsRead(req.user.id);

    res.json({
      message: `${count} notifications marked as read`
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    await NotificationService.deleteNotification(
      req.params.id,
      req.user.id
    );

    res.json({
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    if (error.message === 'Notification not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}; 