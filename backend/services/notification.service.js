import Notification from '../models/notification.model.js';
import User from '../models/user.model.js';
import { sendEmail } from '../utils/email.js';

class NotificationService {
  static async createNotification(data) {
    try {
      const notification = new Notification(data);
      await notification.save();

      // Send email if recipient has an email
      const recipient = await User.findById(data.recipient);
      if (recipient?.email) {
        let emailTemplate;
        let emailData;

        switch (data.type) {
          case 'APPOINTMENT_CONFIRMED':
            emailTemplate = 'appointmentConfirmed';
            emailData = {
              patientName: recipient.name,
              doctorName: data.doctorName,
              date: data.date,
              time: data.time,
              type: data.appointmentType
            };
            break;

          case 'APPOINTMENT_REMINDER':
            emailTemplate = recipient.role === 'doctor' ? 'doctorAppointmentReminder' : 'appointmentReminder';
            emailData = {
              patientName: data.patientName,
              doctorName: data.doctorName,
              date: data.date,
              time: data.time,
              type: data.appointmentType
            };
            break;

          case 'APPOINTMENT_CANCELLED':
            emailTemplate = 'appointmentCancelled';
            emailData = {
              patientName: recipient.name,
              doctorName: data.doctorName,
              date: data.date,
              time: data.time,
              reason: data.reason
            };
            break;

          case 'APPOINTMENT_RESCHEDULED':
            emailTemplate = 'appointmentRescheduled';
            emailData = {
              patientName: recipient.name,
              doctorName: data.doctorName,
              oldDate: data.oldDate,
              oldTime: data.oldTime,
              newDate: data.newDate,
              newTime: data.newTime,
              type: data.appointmentType
            };
            break;

          // Doctor verification notifications are handled separately
          default:
            return notification;
        }

        const emailSent = await sendEmail(recipient.email, emailTemplate, emailData);
        if (emailSent) {
          notification.isEmailSent = true;
          await notification.save();
        }
      }

      return notification;
    } catch (error) {
      console.error('Create notification error:', error);
      throw error;
    }
  }

  static async getUserNotifications(userId, query = {}) {
    try {
      const { page = 1, limit = 10, unreadOnly = false } = query;
      const skip = (page - 1) * limit;

      const filter = {
        recipient: userId,
        ...(unreadOnly && { isRead: false })
      };

      const [notifications, total] = await Promise.all([
        Notification.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Notification.countDocuments(filter)
      ]);

      return {
        notifications,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Get user notifications error:', error);
      throw error;
    }
  }

  static async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, recipient: userId },
        { isRead: true },
        { new: true }
      );

      if (!notification) {
        throw new Error('Notification not found');
      }

      return notification;
    } catch (error) {
      console.error('Mark notification as read error:', error);
      throw error;
    }
  }

  static async markAllAsRead(userId) {
    try {
      const result = await Notification.updateMany(
        { recipient: userId, isRead: false },
        { isRead: true }
      );

      return result.modifiedCount;
    } catch (error) {
      console.error('Mark all notifications as read error:', error);
      throw error;
    }
  }

  static async deleteNotification(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        recipient: userId
      });

      if (!notification) {
        throw new Error('Notification not found');
      }

      return notification;
    } catch (error) {
      console.error('Delete notification error:', error);
      throw error;
    }
  }

  // Helper method to format date and time for notifications
  static formatDateTime(date) {
    const d = new Date(date);
    return {
      date: d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  }
}

export default NotificationService; 