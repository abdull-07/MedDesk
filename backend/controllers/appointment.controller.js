import Appointment from '../models/appointment.model.js';
import User from '../models/user.model.js';
import NotificationService from '../services/notification.service.js';
import DoctorService from '../services/doctor.service.js';

// Helper function to validate status transitions
const validateStatusTransition = (currentStatus, newStatus, userRole, patientId, doctorId, userId) => {
  // Define valid transitions based on current status and user role
  const transitions = {
    'pending': {
      'scheduled': { roles: ['doctor'], condition: (userId === doctorId) },
      'cancelled': { roles: ['doctor', 'patient'], condition: (userId === doctorId || userId === patientId) }
    },
    'scheduled': {
      'completed': { roles: ['doctor', 'patient'], condition: (userId === doctorId || userId === patientId) },
      'cancelled': { roles: ['doctor', 'patient'], condition: (userId === doctorId || userId === patientId) },
      'no-show': { roles: ['doctor'], condition: (userId === doctorId) }
    },
    'completed': {
      // Completed appointments cannot be changed
    },
    'cancelled': {
      // Cancelled appointments cannot be changed
    },
    'no-show': {
      // No-show appointments cannot be changed
    }
  };

  // Check if transition is defined
  if (!transitions[currentStatus] || !transitions[currentStatus][newStatus]) {
    return {
      valid: false,
      message: `Cannot change status from '${currentStatus}' to '${newStatus}'`
    };
  }

  const transition = transitions[currentStatus][newStatus];

  // Check if user role is allowed
  if (!transition.roles.includes(userRole)) {
    return {
      valid: false,
      message: `${userRole} is not authorized to change status to '${newStatus}'`
    };
  }

  // Check specific conditions
  if (!transition.condition) {
    return {
      valid: false,
      message: 'You are not authorized to perform this action'
    };
  }

  return { valid: true };
};

// Helper function to send notifications for status changes
const sendStatusChangeNotifications = async (appointment, oldStatus, newStatus, user) => {
  try {
    const { date, time } = NotificationService.formatDateTime(appointment.startTime);
    
    // Determine notification recipients and messages based on status change
    let notifications = [];

    switch (newStatus) {
      case 'scheduled':
        if (oldStatus === 'pending') {
          // Doctor approved the appointment
          notifications.push({
            recipient: appointment.patient._id,
            type: 'APPOINTMENT_CONFIRMED',
            title: 'Appointment Confirmed',
            message: `Your appointment with Dr. ${appointment.doctor.name} on ${date} at ${time} has been confirmed.`,
          });
        }
        break;

      case 'completed':
        // Appointment marked as completed
        const otherPartyId = user.id === appointment.doctor._id.toString() 
          ? appointment.patient._id 
          : appointment.doctor._id;
        const otherPartyName = user.id === appointment.doctor._id.toString() 
          ? appointment.patient.name 
          : `Dr. ${appointment.doctor.name}`;
        
        notifications.push({
          recipient: otherPartyId,
          type: 'APPOINTMENT_COMPLETED',
          title: 'Appointment Completed',
          message: `Your appointment with ${otherPartyName} on ${date} at ${time} has been marked as completed.`,
        });
        break;

      case 'cancelled':
        // Appointment cancelled (handled by existing cancelAppointment function)
        break;

      case 'no-show':
        // Patient didn't show up
        notifications.push({
          recipient: appointment.patient._id,
          type: 'APPOINTMENT_NO_SHOW',
          title: 'Appointment Marked as No-Show',
          message: `Your appointment with Dr. ${appointment.doctor.name} on ${date} at ${time} was marked as no-show.`,
        });
        break;
    }

    // Send all notifications
    for (const notification of notifications) {
      await NotificationService.createNotification({
        ...notification,
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

  } catch (error) {
    console.error('Error sending status change notifications:', error);
    // Don't throw error - notification failure shouldn't break status update
  }
};

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

    // Create appointment with 'pending' status - use the user ID, not the doctor profile ID
    const appointment = new Appointment({
      patient: req.user.id,
      doctor: doctorProfile.userId, // Use the userId from the doctor profile
      startTime: appointmentStart,
      endTime: appointmentEnd,
      type,
      reason,
      fee,
      status: 'pending' // Set initial status as pending
    });

    await appointment.save();

    // Get patient details
    const patient = await User.findById(req.user.id);

    // Format date and time for notifications
    const { date, time } = NotificationService.formatDateTime(appointmentStart);

    // Create notification for doctor - use the user ID, not the doctor profile ID
    await NotificationService.createNotification({
      recipient: doctorProfile.userId,
      type: 'APPOINTMENT_BOOKED',
      title: 'New Appointment Request',
      message: `New appointment request from ${patient.name} on ${date} at ${time}. Please review and approve.`,
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
      type: 'APPOINTMENT_BOOKED',
      title: 'Appointment Request Submitted',
      message: `Your appointment request with Dr. ${doctor.name} for ${date} at ${time} has been submitted. Waiting for doctor's approval.`,
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
      .populate('patient', 'name email profilePicture')
      .populate('doctor', 'name email specialization clinicName profilePicture')
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
      .populate('patient', 'name email profilePicture')
      .populate('doctor', 'name email specialization clinicName profilePicture');

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

// Update appointment status with proper workflow validation
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        message: 'Status is required'
      });
    }

    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email')
      .populate('doctor', 'name email');
    
    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found'
      });
    }

    // Validate status transition based on current status and user role
    const isValidTransition = validateStatusTransition(
      appointment.status, 
      status, 
      req.user.role,
      appointment.patient._id.toString(),
      appointment.doctor._id.toString(),
      req.user.id
    );

    if (!isValidTransition.valid) {
      return res.status(400).json({
        message: isValidTransition.message
      });
    }

    const oldStatus = appointment.status;
    appointment.status = status;
    await appointment.save();

    // Send notifications for status changes
    await sendStatusChangeNotifications(appointment, oldStatus, status, req.user);

    res.json({
      message: 'Appointment status updated successfully',
      appointment
    });

  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({
      message: error.message || 'Internal server error'
    });
  }
};

// Update appointment (doctors only) - for notes and other fields
export const updateAppointment = async (req, res) => {
  try {
    const { notes } = req.body;
    
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

    // Update allowed fields (excluding status - use updateAppointmentStatus for that)
    if (notes !== undefined) appointment.notes = notes;

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