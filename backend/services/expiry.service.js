import Appointment from '../models/appointment.model.js';
import NotificationService from './notification.service.js';
import User from '../models/user.model.js';

class ExpiryService {
  /**
   * Check for expired appointments and move them to cancelled status
   */
  static async processExpiredAppointments() {
    try {
      console.log('Checking for expired appointments...');
      
      const now = new Date();
      
      // Find appointments that have passed their end time and are still pending or scheduled
      const expiredAppointments = await Appointment.find({
        endTime: { $lt: now },
        status: { $in: ['pending', 'scheduled'] }
      }).populate('patient', 'name email')
        .populate('doctor', 'name email');

      if (expiredAppointments.length === 0) {
        console.log('No expired appointments found');
        return { processed: 0, appointments: [] };
      }

      console.log(`Found ${expiredAppointments.length} expired appointments`);

      const processedAppointments = [];

      for (const appointment of expiredAppointments) {
        try {
          // Update appointment status to cancelled with expiry reason
          appointment.status = 'cancelled';
          appointment.cancellationReason = 'Appointment Expired';
          await appointment.save();

          // Send notifications to both patient and doctor
          await this.sendExpiryNotifications(appointment);

          processedAppointments.push({
            id: appointment._id,
            patientName: appointment.patient?.name,
            doctorName: appointment.doctor?.name,
            originalStartTime: appointment.startTime,
            originalStatus: appointment.status
          });

          console.log(`Expired appointment ${appointment._id} moved to cancelled`);

        } catch (error) {
          console.error(`Error processing expired appointment ${appointment._id}:`, error);
        }
      }

      console.log(`Successfully processed ${processedAppointments.length} expired appointments`);

      return {
        processed: processedAppointments.length,
        appointments: processedAppointments
      };

    } catch (error) {
      console.error('Error in processExpiredAppointments:', error);
      throw error;
    }
  }

  /**
   * Send notifications for expired appointments
   */
  static async sendExpiryNotifications(appointment) {
    try {
      const { date, time } = NotificationService.formatDateTime(appointment.startTime);

      // Notification for patient
      if (appointment.patient) {
        await NotificationService.createNotification({
          recipient: appointment.patient._id,
          type: 'APPOINTMENT_EXPIRED',
          title: 'Appointment Expired',
          message: `Your appointment with Dr. ${appointment.doctor?.name || 'Unknown'} scheduled for ${date} at ${time} has expired and been automatically cancelled.`,
          relatedTo: {
            model: 'Appointment',
            id: appointment._id
          },
          doctorName: appointment.doctor?.name || 'Unknown',
          patientName: appointment.patient.name,
          date,
          time,
          appointmentType: appointment.type,
          reason: 'Appointment Expired'
        });
      }

      // Notification for doctor
      if (appointment.doctor) {
        await NotificationService.createNotification({
          recipient: appointment.doctor._id,
          type: 'APPOINTMENT_EXPIRED',
          title: 'Appointment Expired',
          message: `Appointment with ${appointment.patient?.name || 'Unknown Patient'} scheduled for ${date} at ${time} has expired and been automatically cancelled.`,
          relatedTo: {
            model: 'Appointment',
            id: appointment._id
          },
          doctorName: appointment.doctor.name,
          patientName: appointment.patient?.name || 'Unknown Patient',
          date,
          time,
          appointmentType: appointment.type,
          reason: 'Appointment Expired'
        });
      }

    } catch (error) {
      console.error('Error sending expiry notifications:', error);
      // Don't throw error - notification failure shouldn't break the expiry process
    }
  }

  /**
   * Get appointments that will expire soon (within next hour)
   * Useful for warnings or last-minute reminders
   */
  static async getExpiringAppointments(minutesAhead = 60) {
    try {
      const now = new Date();
      const futureTime = new Date(now.getTime() + (minutesAhead * 60 * 1000));

      const expiringAppointments = await Appointment.find({
        endTime: { 
          $gte: now,
          $lte: futureTime 
        },
        status: { $in: ['pending', 'scheduled'] }
      }).populate('patient', 'name email')
        .populate('doctor', 'name email');

      return expiringAppointments;

    } catch (error) {
      console.error('Error getting expiring appointments:', error);
      throw error;
    }
  }

  /**
   * Manual trigger for processing expired appointments
   * Useful for testing or manual cleanup
   */
  static async manualExpiryCheck() {
    console.log('Manual expiry check triggered');
    return await this.processExpiredAppointments();
  }
}

export default ExpiryService;