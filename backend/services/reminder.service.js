const Appointment = require('../models/appointment.model');
const User = require('../models/user.model');
const NotificationService = require('./notification.service');

class ReminderService {
  // Send reminders for appointments in the next 24 hours
  static async sendDailyReminders() {
    try {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Find all scheduled appointments in the next 24 hours
      const appointments = await Appointment.find({
        status: 'scheduled',
        startTime: {
          $gte: now,
          $lte: tomorrow
        }
      }).populate('patient doctor');

      for (const appointment of appointments) {
        const { date, time } = NotificationService.formatDateTime(appointment.startTime);

        // Send reminder to patient
        await NotificationService.createNotification({
          recipient: appointment.patient._id,
          type: 'APPOINTMENT_REMINDER',
          title: 'Appointment Reminder',
          message: `Reminder: You have an appointment with Dr. ${appointment.doctor.name} tomorrow at ${time}`,
          relatedTo: {
            model: 'Appointment',
            id: appointment._id
          },
          doctorName: appointment.doctor.name,
          patientName: appointment.patient.name,
          date,
          time,
          appointmentType: appointment.type
        });

        // Send reminder to doctor
        await NotificationService.createNotification({
          recipient: appointment.doctor._id,
          type: 'APPOINTMENT_REMINDER',
          title: 'Appointment Reminder',
          message: `Reminder: You have an appointment with ${appointment.patient.name} tomorrow at ${time}`,
          relatedTo: {
            model: 'Appointment',
            id: appointment._id
          },
          doctorName: appointment.doctor.name,
          patientName: appointment.patient.name,
          date,
          time,
          appointmentType: appointment.type
        });
      }

      console.log(`Sent reminders for ${appointments.length} appointments`);
    } catch (error) {
      console.error('Send daily reminders error:', error);
    }
  }

  // Send reminders for appointments in the next hour
  static async sendHourlyReminders() {
    try {
      const now = new Date();
      const nextHour = new Date(now);
      nextHour.setHours(nextHour.getHours() + 1);

      // Find all scheduled appointments in the next hour
      const appointments = await Appointment.find({
        status: 'scheduled',
        startTime: {
          $gte: now,
          $lte: nextHour
        }
      }).populate('patient doctor');

      for (const appointment of appointments) {
        const { date, time } = NotificationService.formatDateTime(appointment.startTime);

        // Send reminder to patient
        await NotificationService.createNotification({
          recipient: appointment.patient._id,
          type: 'APPOINTMENT_REMINDER',
          title: 'Upcoming Appointment',
          message: `Your appointment with Dr. ${appointment.doctor.name} is in less than an hour at ${time}`,
          relatedTo: {
            model: 'Appointment',
            id: appointment._id
          },
          doctorName: appointment.doctor.name,
          patientName: appointment.patient.name,
          date,
          time,
          appointmentType: appointment.type
        });

        // Send reminder to doctor
        await NotificationService.createNotification({
          recipient: appointment.doctor._id,
          type: 'APPOINTMENT_REMINDER',
          title: 'Upcoming Appointment',
          message: `Your appointment with ${appointment.patient.name} is in less than an hour at ${time}`,
          relatedTo: {
            model: 'Appointment',
            id: appointment._id
          },
          doctorName: appointment.doctor.name,
          patientName: appointment.patient.name,
          date,
          time,
          appointmentType: appointment.type
        });
      }

      console.log(`Sent hourly reminders for ${appointments.length} appointments`);
    } catch (error) {
      console.error('Send hourly reminders error:', error);
    }
  }
}

module.exports = ReminderService; 