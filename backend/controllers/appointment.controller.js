const Appointment = require('../models/appointment.model');
const User = require('../models/user.model');
const NotificationService = require('../services/notification.service');

// Create new appointment
const createAppointment = async (req, res) => {
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
    const doctor = await User.findOne({ _id: doctorId, role: 'doctor', isVerified: true });
    if (!doctor) {
      return res.status(404).json({
        message: 'Doctor not found or not verified'
      });
    }

    // Convert string dates to Date objects
    const appointmentStart = new Date(startTime);
    const appointmentEnd = new Date(endTime);

    // Check for time slot conflicts
    const conflict = await Appointment.checkForConflicts(
      doctorId,
      appointmentStart,
      appointmentEnd
    );

    if (conflict) {
      return res.status(409).json({
        message: 'This time slot is already booked'
      });
    }

    // Create appointment
    const appointment = new Appointment({
      patient: req.user.id,
      doctor: doctorId,
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

    // Create notification for doctor
    await NotificationService.createNotification({
      recipient: doctorId,
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
const getAppointments = async (req, res) => {
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
const getAppointmentById = async (req, res) => {
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
const updateAppointment = async (req, res) => {
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
const cancelAppointment = async (req, res) => {
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
    if (appointment.patient.toString() !== req.user.id && 
        appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Not authorized to cancel this appointment'
      });
    }

    // Get user details
    const [patient, doctor] = await Promise.all([
      User.findById(appointment.patient),
      User.findById(appointment.doctor)
    ]);

    // Format date and time for notifications
    const { date, time } = NotificationService.formatDateTime(appointment.startTime);

    // Update appointment status
    appointment.status = 'cancelled';
    appointment.cancellationReason = reason;
    await appointment.save();

    // Create notification for doctor
    await NotificationService.createNotification({
      recipient: appointment.doctor,
      type: 'APPOINTMENT_CANCELLED',
      title: 'Appointment Cancelled',
      message: `Appointment with ${patient.name} on ${date} at ${time} has been cancelled`,
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

    // Create notification for patient
    await NotificationService.createNotification({
      recipient: appointment.patient,
      type: 'APPOINTMENT_CANCELLED',
      title: 'Appointment Cancelled',
      message: `Your appointment with Dr. ${doctor.name} on ${date} at ${time} has been cancelled`,
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
      message: 'Internal server error'
    });
  }
};

// Reschedule appointment
const rescheduleAppointment = async (req, res) => {
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

    // Update appointment times
    appointment.startTime = new Date(startTime);
    appointment.endTime = new Date(endTime);
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
const getDoctorSchedule = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: 'Please provide start and end dates'
      });
    }

    // Validate doctor exists and is verified
    const doctor = await User.findOne({
      _id: req.params.id,
      role: 'doctor',
      isVerified: true
    });

    if (!doctor) {
      return res.status(404).json({
        message: 'Doctor not found or not verified'
      });
    }

    // Get all appointments in date range
    const appointments = await Appointment.find({
      doctor: req.params.id,
      startTime: { $gte: new Date(startDate) },
      endTime: { $lte: new Date(endDate) },
      status: 'scheduled'
    }).select('startTime endTime');

    res.json({
      doctorId: req.params.id,
      appointments
    });

  } catch (error) {
    console.error('Get doctor schedule error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  rescheduleAppointment,
  getDoctorSchedule
}; 