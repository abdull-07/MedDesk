import Appointment from '../models/appointment.model.js';
import User from '../models/user.model.js';
import NotificationService from '../services/notification.service.js';
import DoctorService from '../services/doctor.service.js';

// Create new appointment
export const createAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      startTime,
      endTime,
      type,
      reason,
      fee
    } = req.body;

    // Validate required fields
    if (!doctorId || !startTime || !endTime || !type || !reason || !fee) {
      return res.status(400).json({
        message: 'Please provide all required fields'
      });
    }

    // Validate doctor exists and is verified
    const doctorProfile = await DoctorService.getDoctorById(doctorId);
    if (!doctorProfile) {
      return res.status(404).json({
        message: 'Doctor not found or not verified'
      });
    }
    
    // Get the user info for the doctor
    const doctor = await User.findById(doctorProfile.userId);
    if (!doctor) {
      return res.status(404).json({
        message: 'Doctor user not found'
      });
    }

    // Convert string dates to Date objects
    const appointmentStart = new Date(startTime);
    const appointmentEnd = new Date(endTime);

    // Check for time slot conflicts - use the user ID, not the doctor profile ID
    const conflict = await Appointment.checkForConflicts(
      doctorProfile.userId,
      appointmentStart,
      appointmentEnd
    );

    if (conflict) {
      return res.status(409).json({
        message: 'This time slot is already booked'
      });
    }

    // Create appointment - use the user ID, not the doctor profile ID
    const appointment = new Appointment({
      patient: req.user.id,
      doctor: doctorProfile.userId, // Use the userId from the doctor profile
      startTime: appointmentStart,
      endTime: appointmentEnd,
      type,
      reason,
      fee
    });

    await appointment.save();

    // Get patient details
    const patient = await User.findById(req.user.id);

    // Format date and time for notifications
    const { date, time } = NotificationService.formatDateTime(appointmentStart);

    // Create notification for doctor - use the user ID, not the doctor profile ID
    await NotificationService.createNotification({
      recipient: doctorProfile.userId,
      type: 'APPOINTMENT_CONFIRMED',
      title: 'New Appointment Scheduled',
      message: `New appointment scheduled with ${patient.name} on ${date} at ${time}`,
      relatedTo: {
        model: 'Appointment',
        id: appointment._id
      },
      doctorName: doctor.name,
      patientName: patient.name,
      date,
      time,
      appointmentType: type
    });

    // Create notification for patient
    await NotificationService.createNotification({
      recipient: req.user.id,
      type: 'APPOINTMENT_CONFIRMED',
      title: 'Appointment Confirmed',
      message: `Your appointment with Dr. ${doctor.name} is confirmed for ${date} at ${time}`,
      relatedTo: {
        model: 'Appointment',
        id: appointment._id
      },
      doctorName: doctor.name,
      patientName: patient.name,
      date,
      time,
      appointmentType: type
    });

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment
    });

  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      message: error.message || 'Internal server error'
    });
  }
};

// Get appointments (filtered by role)
export const getAppointments = async (req, res) => {
  try {
    const { status, date } = req.query;
    let query = {};

    // Filter by user role
    if (req.user.role === 'patient') {
      query.patient = req.user.id;
    } else if (req.user.role === 'doctor') {
      query.doctor = req.user.id;
    }

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Filter by date if provided
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query.startTime = {
        $gte: startOfDay,
        $lte: endOfDay
      };
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email')
      .populate('doctor', 'name email specialization clinicName')
      .sort({ startTime: 1 });

    res.json(appointments);

  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

// Get specific appointment
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email')
      .populate('doctor', 'name email specialization clinicName');

    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found'
      });
    }

    // Check if user has access to this appointment
    if (
      req.user.role === 'patient' && appointment.patient._id.toString() !== req.user.id ||
      req.user.role === 'doctor' && appointment.doctor._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: 'Access denied'
      });
    }

    res.json(appointment);

  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

// Update appointment (doctors only)
export const updateAppointment = async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found'
      });
    }

    // Verify doctor owns this appointment
    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Access denied'
      });
    }

    // Update allowed fields
    if (status) appointment.status = status;
    if (notes) appointment.notes = notes;

    await appointment.save();

    res.json({
      message: 'Appointment updated successfully',
      appointment
    });

  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      message: error.message || 'Internal server error'
    });
  }
};

// Cancel appointment
export const cancelAppointment = async (req, res) => {
  try {
    const { reason } = req.body;
    
    if (!reason) {
      return res.status(400).json({
        message: 'Cancellation reason is required'
      });
    }

    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found'
      });
    }

    // Check if user has permission to cancel
    if (
      req.user.role === 'patient' && appointment.patient.toString() !== req.user.id ||
      req.user.role === 'doctor' && appointment.doctor.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: 'Access denied'
      });
    }

    // Update appointment status
    appointment.status = 'cancelled';
    appointment.cancellationReason = reason;
    await appointment.save();

    // Get user details
    const [patient, doctor] = await Promise.all([
      User.findById(appointment.patient),
      User.findById(appointment.doctor)
    ]);

    // Format date and time for notifications
    const { date, time } = NotificationService.formatDateTime(appointment.startTime);

    // Create notification for other party
    const recipientId = req.user.role === 'patient' ? appointment.doctor : appointment.patient;
    const recipientName = req.user.role === 'patient' ? doctor.name : patient.name;
    const cancellerName = req.user.role === 'patient' ? patient.name : `Dr. ${doctor.name}`;

    await NotificationService.createNotification({
      recipient: recipientId,
      type: 'APPOINTMENT_CANCELLED',
      title: 'Appointment Cancelled',
      message: `${cancellerName} has cancelled the appointment scheduled for ${date} at ${time}. Reason: ${reason}`,
      relatedTo: {
        model: 'Appointment',
        id: appointment._id
      },
      doctorName: doctor.name,
      patientName: patient.name,
      date,
      time,
      reason
    });

    res.json({
      message: 'Appointment cancelled successfully',
      appointment
    });

  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      message: error.message || 'Internal server error'
    });
  }
};

// Reschedule appointment
export const rescheduleAppointment = async (req, res) => {
  try {
    const { startTime, endTime } = req.body;

    if (!startTime || !endTime) {
      return res.status(400).json({
        message: 'New start time and end time are required'
      });
    }

    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found'
      });
    }

    // Check if user has permission to reschedule
    if (appointment.patient.toString() !== req.user.id && 
        appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Not authorized to reschedule this appointment'
      });
    }

    // Store old times for notification
    const oldStart = appointment.startTime;

    // Convert string dates to Date objects
    const newStartTime = new Date(startTime);
    const newEndTime = new Date(endTime);

    // Check for time slot conflicts - exclude current appointment
    const conflict = await Appointment.checkForConflicts(
      appointment.doctor,
      newStartTime,
      newEndTime,
      appointment._id
    );

    if (conflict) {
      return res.status(409).json({
        message: 'This time slot is already booked'
      });
    }

    // Update appointment times
    appointment.startTime = newStartTime;
    appointment.endTime = newEndTime;
    await appointment.save();

    // Get user details
    const [patient, doctor] = await Promise.all([
      User.findById(appointment.patient),
      User.findById(appointment.doctor)
    ]);

    // Format old and new dates/times for notifications
    const oldDateTime = NotificationService.formatDateTime(oldStart);
    const newDateTime = NotificationService.formatDateTime(appointment.startTime);

    // Create notification for doctor
    await NotificationService.createNotification({
      recipient: appointment.doctor,
      type: 'APPOINTMENT_RESCHEDULED',
      title: 'Appointment Rescheduled',
      message: `Appointment with ${patient.name} has been rescheduled from ${oldDateTime.date} at ${oldDateTime.time} to ${newDateTime.date} at ${newDateTime.time}`,
      relatedTo: {
        model: 'Appointment',
        id: appointment._id
      },
      doctorName: doctor.name,
      patientName: patient.name,
      oldDate: oldDateTime.date,
      oldTime: oldDateTime.time,
      newDate: newDateTime.date,
      newTime: newDateTime.time,
      appointmentType: appointment.type
    });

    // Create notification for patient
    await NotificationService.createNotification({
      recipient: appointment.patient,
      type: 'APPOINTMENT_RESCHEDULED',
      title: 'Appointment Rescheduled',
      message: `Your appointment with Dr. ${doctor.name} has been rescheduled from ${oldDateTime.date} at ${oldDateTime.time} to ${newDateTime.date} at ${newDateTime.time}`,
      relatedTo: {
        model: 'Appointment',
        id: appointment._id
      },
      doctorName: doctor.name,
      patientName: patient.name,
      oldDate: oldDateTime.date,
      oldTime: oldDateTime.time,
      newDate: newDateTime.date,
      newTime: newDateTime.time,
      appointmentType: appointment.type
    });

    res.json({
      message: 'Appointment rescheduled successfully',
      appointment
    });

  } catch (error) {
    console.error('Reschedule appointment error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

// Get doctor's schedule
export const getDoctorSchedule = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        message: 'Please provide start and end dates'
      });
    }

    // Get doctor profile using the new structure
    const doctorProfile = await DoctorService.getDoctorById(req.params.id);
    
    if (!doctorProfile) {
      return res.status(404).json({
        message: 'Doctor not found or not verified'
      });
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // Find appointments using the user ID (since appointments reference user IDs)
    const appointments = await Appointment.find({
      doctor: doctorProfile.userId,
      startTime: { $gte: start, $lte: end },
      status: { $ne: 'cancelled' }
    }).select('startTime endTime status');

    res.json({
      doctorId: doctorProfile._id,
      doctorName: doctorProfile.name,
      appointments
    });

  } catch (error) {
    console.error('Get doctor schedule error:', error);
    res.status(500).json({
      message: error.message || 'Internal server error'
    });
  }
}; 