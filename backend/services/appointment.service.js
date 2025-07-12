import Appointment from '../models/appointment.model.js';
import NotificationService from './notification.service.js';

class AppointmentService {
  async getAppointmentById(appointmentId) {
    try {
      const appointment = await Appointment.findById(appointmentId)
        .populate('patient', 'name email')
        .populate('doctor', 'name email specialization');
      
      if (!appointment) {
        throw new Error('Appointment not found');
      }
      
      return appointment;
    } catch (error) {
      console.error('Get appointment error:', error);
      throw error;
    }
  }

  async updatePaymentStatus(appointmentId, status) {
    try {
      const appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        { paymentStatus: status },
        { new: true }
      );

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Send notification based on payment status
      if (status === 'paid') {
        await NotificationService.createNotification({
          recipient: appointment.patient,
          type: 'PAYMENT_RECEIVED',
          title: 'Payment Received',
          message: `Your payment for appointment with Dr. ${appointment.doctor.name} has been received.`,
          relatedTo: {
            model: 'Appointment',
            id: appointment._id
          }
        });

        await NotificationService.createNotification({
          recipient: appointment.doctor,
          type: 'PAYMENT_RECEIVED',
          title: 'Payment Received',
          message: `Payment received for appointment with ${appointment.patient.name}.`,
          relatedTo: {
            model: 'Appointment',
            id: appointment._id
          }
        });
      }

      return appointment;
    } catch (error) {
      console.error('Update payment status error:', error);
      throw error;
    }
  }

  async createAppointment(appointmentData) {
    try {
      const appointment = new Appointment(appointmentData);
      await appointment.save();
      return appointment;
    } catch (error) {
      console.error('Create appointment error:', error);
      throw error;
    }
  }

  async updateAppointment(appointmentId, updateData) {
    try {
      const appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        updateData,
        { new: true }
      );

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      return appointment;
    } catch (error) {
      console.error('Update appointment error:', error);
      throw error;
    }
  }

  async cancelAppointment(appointmentId, reason) {
    try {
      const appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        {
          status: 'cancelled',
          cancellationReason: reason
        },
        { new: true }
      );

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Send cancellation notifications
      await NotificationService.createNotification({
        recipient: appointment.patient,
        type: 'APPOINTMENT_CANCELLED',
        title: 'Appointment Cancelled',
        message: `Your appointment with Dr. ${appointment.doctor.name} has been cancelled.`,
        relatedTo: {
          model: 'Appointment',
          id: appointment._id
        }
      });

      await NotificationService.createNotification({
        recipient: appointment.doctor,
        type: 'APPOINTMENT_CANCELLED',
        title: 'Appointment Cancelled',
        message: `Appointment with ${appointment.patient.name} has been cancelled.`,
        relatedTo: {
          model: 'Appointment',
          id: appointment._id
        }
      });

      return appointment;
    } catch (error) {
      console.error('Cancel appointment error:', error);
      throw error;
    }
  }
}

const appointmentService = new AppointmentService();
export default appointmentService; 