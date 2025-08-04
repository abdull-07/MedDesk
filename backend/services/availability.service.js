import Appointment from '../models/appointment.model.js';

// Duration of each slot in minutes
const SLOT_DURATION = 30;

// Generate time slots based on doctor's configured availability
const generateTimeSlotsFromDoctorAvailability = async (doctorId, date) => {
  try {
    // Import Doctor model
    const Doctor = (await import('../models/doctor.model.js')).default;
    
    // Get doctor's availability configuration
    const doctor = await Doctor.findById(doctorId).lean();
    if (!doctor || !doctor.availability) {
      return [];
    }

    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = date.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek];

    // Get availability for this day
    let dayAvailability;
    if (doctor.availability instanceof Map) {
      dayAvailability = doctor.availability.get(dayName);
    } else {
      dayAvailability = doctor.availability[dayName];
    }

    if (!dayAvailability || !dayAvailability.isAvailable || !dayAvailability.slots) {
      return [];
    }

    // Convert doctor's configured slots to time slots
    const slots = [];
    for (const configuredSlot of dayAvailability.slots) {
      const [startHour, startMinute] = configuredSlot.startTime.split(':').map(Number);
      const [endHour, endMinute] = configuredSlot.endTime.split(':').map(Number);

      const slotStart = new Date(date);
      slotStart.setHours(startHour, startMinute, 0, 0);

      const slotEnd = new Date(date);
      slotEnd.setHours(endHour, endMinute, 0, 0);

      // Break the configured slot into 30-minute intervals
      const currentTime = new Date(slotStart);
      while (currentTime < slotEnd) {
        const intervalEnd = new Date(currentTime);
        intervalEnd.setMinutes(currentTime.getMinutes() + SLOT_DURATION);

        // Don't create a slot that extends beyond the configured end time
        if (intervalEnd <= slotEnd) {
          slots.push({
            start: new Date(currentTime),
            end: new Date(intervalEnd)
          });
        }

        currentTime.setMinutes(currentTime.getMinutes() + SLOT_DURATION);
      }
    }

    return slots;
  } catch (error) {
    console.error('Error generating slots from doctor availability:', error);
    return [];
  }
};

// Fallback: Generate time slots for a given date (legacy support)
const generateTimeSlots = (date, workingHours = { start: 9, end: 17 }) => {
  const slots = [];
  const startTime = new Date(date);
  startTime.setHours(workingHours.start, 0, 0, 0);
  
  const endTime = new Date(date);
  endTime.setHours(workingHours.end, 0, 0, 0);

  while (startTime < endTime) {
    const slotEnd = new Date(startTime);
    slotEnd.setMinutes(startTime.getMinutes() + SLOT_DURATION);

    slots.push({
      start: new Date(startTime),
      end: new Date(slotEnd)
    });

    startTime.setMinutes(startTime.getMinutes() + SLOT_DURATION);
  }

  return slots;
};

// Get available slots for a doctor on a specific date
const getAvailableSlots = async (doctorId, date) => {
  try {
    // Import Doctor model to get the user ID
    const Doctor = (await import('../models/doctor.model.js')).default;
    
    // Generate all possible slots for the day based on doctor's configured availability
    const allSlots = await generateTimeSlotsFromDoctorAvailability(doctorId, date);

    // If no slots configured, return empty array
    if (allSlots.length === 0) {
      return [];
    }

    // Get the doctor's user ID (appointments reference user IDs, not doctor profile IDs)
    const doctor = await Doctor.findById(doctorId).lean();
    if (!doctor) {
      return [];
    }

    // Get booked appointments for the date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find({
      doctor: doctor.userId, // Use the user ID, not the doctor profile ID
      startTime: { $gte: startOfDay, $lte: endOfDay },
      status: 'scheduled'
    });

    // Filter out booked slots
    const availableSlots = allSlots.filter(slot => {
      return !bookedAppointments.some(appointment => {
        return (
          (slot.start >= appointment.startTime && slot.start < appointment.endTime) ||
          (slot.end > appointment.startTime && slot.end <= appointment.endTime)
        );
      });
    });

    return availableSlots;
  } catch (error) {
    console.error('Get available slots error:', error);
    throw error;
  }
};

// Check if a specific time slot is available
const isSlotAvailable = async (doctorId, startTime, endTime) => {
  try {
    // Import Doctor model to get the user ID
    const Doctor = (await import('../models/doctor.model.js')).default;
    
    // Get the doctor's user ID (appointments reference user IDs, not doctor profile IDs)
    const doctor = await Doctor.findById(doctorId).lean();
    if (!doctor) {
      return false;
    }

    const conflict = await Appointment.findOne({
      doctor: doctor.userId, // Use the user ID, not the doctor profile ID
      status: 'scheduled',
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        },
        {
          startTime: { $gte: startTime },
          endTime: { $lte: endTime }
        }
      ]
    });

    return !conflict;
  } catch (error) {
    console.error('Check slot availability error:', error);
    throw error;
  }
};

// Get next available slot
const getNextAvailableSlot = async (doctorId, fromDate = new Date()) => {
  try {
    const maxDays = 30; // Look up to 30 days ahead
    let currentDate = new Date(fromDate);

    for (let i = 0; i < maxDays; i++) {
      const slots = await getAvailableSlots(doctorId, currentDate);
      
      // Find first slot that's in the future
      const availableSlot = slots.find(slot => slot.start > new Date());
      
      if (availableSlot) {
        return availableSlot;
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return null;
  } catch (error) {
    console.error('Get next available slot error:', error);
    throw error;
  }
};

const availabilityService = {
  getAvailableSlots,
  isSlotAvailable,
  getNextAvailableSlot,
  SLOT_DURATION
};

export default availabilityService; 