import DoctorService from '../services/doctor.service.js';
import Appointment from '../models/appointment.model.js';
import User from '../models/user.model.js';

// Search doctors with filters
export const searchDoctors = async (req, res) => {
  try {
    const {
      search,
      specialization,
      minRating,
      minExperience,
      maxFee,
      languages,
      location,
      availableOn,
      sortBy,
      page,
      limit,
      lat,
      lng
    } = req.query;

    // Parse coordinates if provided
    const coordinates = lat && lng ? [parseFloat(lng), parseFloat(lat)] : null;

    // Parse languages array
    const parsedLanguages = languages ? languages.split(',') : null;

    const result = await DoctorService.searchDoctors(
      {
        search,
        specialization,
        minRating,
        minExperience,
        maxFee,
        languages: parsedLanguages,
        location,
        availableOn,
        sortBy
      },
      {
        page,
        limit,
        coordinates
      }
    );

    res.json(result);
  } catch (error) {
    console.error('Search doctors error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get list of specializations
export const getSpecializations = async (req, res) => {
  try {
    const specializations = await DoctorService.getSpecializations();
    res.json(specializations);
  } catch (error) {
    console.error('Get specializations error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get list of languages
export const getLanguages = async (req, res) => {
  try {
    const languages = await DoctorService.getLanguages();
    res.json(languages);
  } catch (error) {
    console.error('Get languages error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get list of cities
export const getCities = async (req, res) => {
  try {
    const cities = await DoctorService.getCities();
    res.json(cities);
  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get doctor by ID
export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const doctor = await DoctorService.getDoctorById(id);
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(doctor);
  } catch (error) {
    console.error('Get doctor by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get doctor dashboard stats
export const getDoctorStats = async (req, res) => {
  try {
    const doctorId = req.user.id; // Doctor's user ID
    
    // Get today's date range
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    // Get upcoming appointments (from tomorrow onwards)
    const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    // Run all queries in parallel for better performance
    const [
      todayAppointments,
      totalPatients,
      upcomingAppointments,
      doctorUser
    ] = await Promise.all([
      // Today's appointments count
      Appointment.countDocuments({
        doctor: doctorId,
        startTime: { $gte: startOfDay, $lt: endOfDay },
        status: { $in: ['scheduled', 'pending'] }
      }),
      
      // Total unique patients count
      Appointment.distinct('patient', {
        doctor: doctorId,
        status: { $in: ['scheduled', 'completed', 'pending'] }
      }).then(patients => patients.length),
      
      // Upcoming appointments count (from tomorrow onwards)
      Appointment.countDocuments({
        doctor: doctorId,
        startTime: { $gte: tomorrow },
        status: { $in: ['scheduled', 'pending'] }
      }),
      
      // Get doctor's user info for rating
      User.findById(doctorId).select('ratings')
    ]);

    const stats = {
      todayAppointments,
      totalPatients,
      upcomingAppointments,
      averageRating: doctorUser?.ratings?.average || 0
    };

    res.json(stats);
  } catch (error) {
    console.error('Get doctor stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get doctor's today appointments
export const getDoctorTodayAppointments = async (req, res) => {
  try {
    const doctorId = req.user.id; // Doctor's user ID
    
    // Get today's date range
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    // Get today's appointments with patient details
    const appointments = await Appointment.find({
      doctor: doctorId,
      startTime: { $gte: startOfDay, $lt: endOfDay },
      status: { $in: ['scheduled', 'pending'] }
    })
    .populate('patient', 'name email profilePicture')
    .sort({ startTime: 1 })
    .limit(10);

    // Format appointments for frontend
    const formattedAppointments = appointments.map(appointment => ({
      id: appointment._id,
      patient: {
        name: appointment.patient?.name || 'Unknown Patient',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(appointment.patient?.name || 'U')}&background=83C5BE&color=fff`
      },
      type: appointment.type,
      time: appointment.startTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      status: appointment.status,
      reason: appointment.reason
    }));

    res.json(formattedAppointments);
  } catch (error) {
    console.error('Get doctor today appointments error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 