import User from '../models/user.model.js';
import Doctor from '../models/doctor.model.js';
import Appointment from '../models/appointment.model.js';
import availabilityService from '../services/availability.service.js';
import DoctorService from '../services/doctor.service.js';
import NotificationService from '../services/notification.service.js';

// Search doctors with filters
export const searchDoctors = async (req, res) => {
  try {
    const {
      specialization,
      search,
      clinicLocation,
      sortBy,
      page = 1,
      limit = 10
    } = req.query;

    // Use the DoctorService to search doctors
    const filters = {
      specialization,
      search,
      location: clinicLocation,
      sortBy
    };

    const options = {
      page,
      limit
    };

    const result = await DoctorService.searchDoctors(filters, options);

    res.json({
      doctors: result.doctors,
      pagination: {
        total: result.total,
        pages: result.totalPages,
        currentPage: result.page,
        perPage: limit
      }
    });

  } catch (error) {
    console.error('Search doctors error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get doctor profile by user ID
export const getDoctorByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find doctor profile by user ID
    const doctor = await Doctor.findOne({ userId });

    if (!doctor) {
      return res.status(404).json({
        message: 'Doctor profile not found'
      });
    }

    // Get the full doctor profile using DoctorService
    const doctorProfile = await DoctorService.getDoctorById(doctor._id);

    if (!doctorProfile) {
      return res.status(404).json({
        message: 'Doctor not found or not verified'
      });
    }

    res.json(doctorProfile);

  } catch (error) {
    console.error('Get doctor by user ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get doctor's availability
export const getDoctorAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        message: 'Date is required'
      });
    }

    // Validate doctor exists and is verified using DoctorService
    const doctor = await DoctorService.getDoctorById(id);

    if (!doctor) {
      return res.status(404).json({
        message: 'Doctor not found or not verified'
      });
    }

    const slots = await availabilityService.getAvailableSlots(id, new Date(date));

    res.json({
      doctorId: id,
      date,
      slots
    });

  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get next available slot
export const getNextAvailable = async (req, res) => {
  try {
    const { id } = req.params;
    const { fromDate } = req.query;

    // Validate doctor exists and is verified using DoctorService
    const doctor = await DoctorService.getDoctorById(id);

    if (!doctor) {
      return res.status(404).json({
        message: 'Doctor not found or not verified'
      });
    }

    const nextSlot = await availabilityService.getNextAvailableSlot(
      id,
      fromDate ? new Date(fromDate) : new Date()
    );

    if (!nextSlot) {
      return res.status(404).json({
        message: 'No available slots found in the next 30 days'
      });
    }

    res.json({
      doctorId: id,
      nextAvailableSlot: nextSlot
    });

  } catch (error) {
    console.error('Get next available error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Initiate booking (temporary hold)
export const initiateBooking = async (req, res) => {
  try {
    const { doctorId, startTime, endTime, type, reason } = req.body;

    // Validate required fields
    if (!doctorId || !startTime || !endTime || !type || !reason) {
      return res.status(400).json({
        message: 'Please provide all required fields'
      });
    }

    // Validate doctor exists and is verified using DoctorService
    const doctor = await DoctorService.getDoctorById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        message: 'Doctor not found or not verified'
      });
    }

    // Check slot availability
    const isAvailable = await availabilityService.isSlotAvailable(
      doctorId,
      new Date(startTime),
      new Date(endTime)
    );

    if (!isAvailable) {
      return res.status(409).json({
        message: 'This time slot is no longer available'
      });
    }

    // Calculate fee based on doctor's rate and appointment duration
    const duration = (new Date(endTime) - new Date(startTime)) / (1000 * 60); // in minutes
    const fee = Math.ceil(duration / 30) * doctor.consultationFee || 100; // Default fee if not set

    // Create temporary appointment - use the user ID, not the doctor profile ID
    const appointment = new Appointment({
      patient: req.user.id,
      doctor: doctor.userId, // Use the userId from the doctor profile
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      type,
      reason,
      fee,
      status: 'pending' // Will be updated to 'scheduled' after confirmation
    });

    await appointment.save();

    // TODO: Implement payment integration here

    res.status(201).json({
      message: 'Booking initiated successfully',
      appointment,
      paymentRequired: true,
      fee
    });

  } catch (error) {
    console.error('Initiate booking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Confirm booking
export const confirmBooking = async (req, res) => {
  try {
    const { appointmentId, paymentDetails } = req.body;

    if (!appointmentId) {
      return res.status(400).json({
        message: 'Appointment ID is required'
      });
    }

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      patient: req.user.id,
      status: 'pending'
    });

    if (!appointment) {
      return res.status(404).json({
        message: 'Pending appointment not found'
      });
    }

    // Get the doctor profile ID from the user ID
    const doctorProfile = await Doctor.findOne({ userId: appointment.doctor }).lean();
    if (!doctorProfile) {
      return res.status(404).json({
        message: 'Doctor profile not found'
      });
    }

    // Verify slot is still available
    const isAvailable = await availabilityService.isSlotAvailable(
      doctorProfile._id,
      appointment.startTime,
      appointment.endTime
    );

    if (!isAvailable) {
      return res.status(409).json({
        message: 'This time slot is no longer available'
      });
    }

    // TODO: Process payment here

    // Keep appointment status as 'pending' - doctor needs to approve it
    // appointment.status remains 'pending' until doctor approval
    await appointment.save();

    // Get patient and doctor information for notification
    const [patient, doctorUser] = await Promise.all([
      User.findById(appointment.patient),
      User.findById(appointment.doctor)
    ]);

    // Create notification for doctor
    try {
      const { date, time } = NotificationService.formatDateTime(appointment.startTime);
      
      await NotificationService.createNotification({
        recipient: appointment.doctor, // Doctor's user ID
        type: 'APPOINTMENT_BOOKED',
        title: 'New Appointment Booked',
        message: `${patient.name} has booked an appointment with you on ${date} at ${time}`,
        relatedTo: {
          model: 'Appointment',
          id: appointment._id
        },
        // Additional data for email template
        patientName: patient.name,
        date,
        time,
        appointmentType: appointment.type,
        reason: appointment.reason
      });
    } catch (notificationError) {
      console.error('Failed to create appointment notification:', notificationError);
      // Don't fail the booking if notification fails
    }

    res.json({
      message: 'Booking confirmed successfully',
      appointment
    });

  } catch (error) {
    console.error('Confirm booking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Reschedule appointment
export const rescheduleAppointment = async (req, res) => {
  try {
    const { startTime, endTime } = req.body;
    const { id } = req.params;

    if (!startTime || !endTime) {
      return res.status(400).json({
        message: 'New start time and end time are required'
      });
    }

    const appointment = await Appointment.findOne({
      _id: id,
      patient: req.user.id,
      status: { $in: ['scheduled', 'pending'] }
    });

    if (!appointment) {
      return res.status(404).json({
        message: 'Active appointment not found'
      });
    }

    // Get the doctor profile ID from the user ID
    const doctorProfile = await Doctor.findOne({ userId: appointment.doctor }).lean();
    if (!doctorProfile) {
      return res.status(404).json({
        message: 'Doctor profile not found'
      });
    }

    // Check if new slot is available
    const isAvailable = await availabilityService.isSlotAvailable(
      doctorProfile._id,
      new Date(startTime),
      new Date(endTime),
      id // Exclude current appointment from conflict check
    );

    if (!isAvailable) {
      return res.status(409).json({
        message: 'The requested time slot is not available'
      });
    }

    // Update appointment times
    appointment.startTime = new Date(startTime);
    appointment.endTime = new Date(endTime);
    await appointment.save();

    res.json({
      message: 'Appointment rescheduled successfully',
      appointment
    });

  } catch (error) {
    console.error('Reschedule appointment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 