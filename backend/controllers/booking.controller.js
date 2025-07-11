const User = require('../models/user.model');
const Appointment = require('../models/appointment.model');
const availabilityService = require('../services/availability.service');

// Search doctors with filters
const searchDoctors = async (req, res) => {
  try {
    const {
      specialization,
      name,
      clinicLocation,
      sortBy,
      page = 1,
      limit = 10
    } = req.query;

    const query = {
      role: 'doctor',
      isVerified: true
    };

    // Apply filters
    if (specialization) {
      query.specialization = specialization;
    }
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    if (clinicLocation) {
      query.clinicName = { $regex: clinicLocation, $options: 'i' };
    }

    // Prepare sort options
    let sortOptions = {};
    if (sortBy === 'experience') {
      sortOptions.experience = -1;
    } else if (sortBy === 'name') {
      sortOptions.name = 1;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get doctors
    const doctors = await User.find(query)
      .select('-password')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await User.countDocuments(query);

    res.json({
      doctors,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit
      }
    });

  } catch (error) {
    console.error('Search doctors error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get doctor's availability
const getDoctorAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        message: 'Date is required'
      });
    }

    // Validate doctor exists and is verified
    const doctor = await User.findOne({
      _id: id,
      role: 'doctor',
      isVerified: true
    });

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
const getNextAvailable = async (req, res) => {
  try {
    const { id } = req.params;
    const { fromDate } = req.query;

    // Validate doctor exists and is verified
    const doctor = await User.findOne({
      _id: id,
      role: 'doctor',
      isVerified: true
    });

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
const initiateBooking = async (req, res) => {
  try {
    const { doctorId, startTime, endTime, type, reason } = req.body;

    // Validate required fields
    if (!doctorId || !startTime || !endTime || !type || !reason) {
      return res.status(400).json({
        message: 'Please provide all required fields'
      });
    }

    // Validate doctor exists and is verified
    const doctor = await User.findOne({
      _id: doctorId,
      role: 'doctor',
      isVerified: true
    });

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

    // Create temporary appointment
    const appointment = new Appointment({
      patient: req.user.id,
      doctor: doctorId,
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
const confirmBooking = async (req, res) => {
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

    // Verify slot is still available
    const isAvailable = await availabilityService.isSlotAvailable(
      appointment.doctor,
      appointment.startTime,
      appointment.endTime
    );

    if (!isAvailable) {
      // Delete the pending appointment
      await Appointment.deleteOne({ _id: appointmentId });
      
      return res.status(409).json({
        message: 'This time slot is no longer available'
      });
    }

    // TODO: Process payment here

    // Update appointment status
    appointment.status = 'scheduled';
    await appointment.save();

    res.json({
      message: 'Appointment confirmed successfully',
      appointment
    });

  } catch (error) {
    console.error('Confirm booking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Reschedule appointment
const rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { startTime, endTime, reason } = req.body;

    if (!startTime || !endTime || !reason) {
      return res.status(400).json({
        message: 'Please provide new time slot and reason'
      });
    }

    const appointment = await Appointment.findOne({
      _id: id,
      patient: req.user.id,
      status: 'scheduled'
    });

    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found'
      });
    }

    // Check if new slot is available
    const isAvailable = await availabilityService.isSlotAvailable(
      appointment.doctor,
      new Date(startTime),
      new Date(endTime)
    );

    if (!isAvailable) {
      return res.status(409).json({
        message: 'New time slot is not available'
      });
    }

    // Update appointment
    appointment.startTime = new Date(startTime);
    appointment.endTime = new Date(endTime);
    appointment.notes = `Rescheduled: ${reason}`;
    
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

module.exports = {
  searchDoctors,
  getDoctorAvailability,
  getNextAvailable,
  initiateBooking,
  confirmBooking,
  rescheduleAppointment
}; 