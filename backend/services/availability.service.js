const Appointment = require('../models/appointment.model');

// Duration of each slot in minutes
const SLOT_DURATION = 30;

// Generate time slots for a given date
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
    // Generate all possible slots for the day
    const allSlots = generateTimeSlots(date);

    // Get booked appointments for the date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find({
      doctor: doctorId,
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
    const conflict = await Appointment.findOne({
      doctor: doctorId,
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

module.exports = {
  getAvailableSlots,
  isSlotAvailable,
  getNextAvailableSlot,
  SLOT_DURATION
}; 