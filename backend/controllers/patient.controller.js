import User from '../models/user.model.js';
import Patient from '../models/patient.model.js';
import Appointment from '../models/appointment.model.js';

// Get patient profile by ID (for doctors)
export const getPatientProfile = async (req, res) => {
  try {
    const { patientId } = req.params;
    const doctorId = req.user.id;

    // Verify that the doctor has had appointments with this patient
    const hasAppointment = await Appointment.findOne({
      doctor: doctorId,
      patient: patientId
    });

    if (!hasAppointment) {
      return res.status(403).json({
        message: 'Access denied. No appointment history with this patient.'
      });
    }

    // Get basic user data
    const user = await User.findById(patientId)
      .select('-password -__v')
      .lean();

    if (!user || user.role !== 'patient') {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Get detailed patient profile
    const patientProfile = await Patient.findOne({ userId: patientId }).lean();

    let profile = { ...user };

    if (patientProfile) {
      // Calculate age from dateOfBirth
      let age = 'N/A';
      if (patientProfile.dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(patientProfile.dateOfBirth);
        age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
      }

      // Merge user and patient data
      profile = {
        ...user,
        ...patientProfile,
        age: age,
        _id: user._id,
        // Initialize default values for nested objects if they don't exist
        address: patientProfile.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        emergencyContact: patientProfile.emergencyContact || {
          name: '',
          relationship: '',
          phone: '',
          email: ''
        },
        medicalHistory: patientProfile.medicalHistory || {
          conditions: [],
          allergies: [],
          medications: [],
          surgeries: [],
          familyHistory: []
        }
      };
    }

    res.json(profile);

  } catch (error) {
    console.error('Get patient profile error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

// Get all patients for a doctor
export const getPatientsByDoctor = async (req, res) => {
  try {
    const doctorId = req.user.id;

    // Get all unique patients who have had appointments with this doctor
    const appointments = await Appointment.find({ doctor: doctorId })
      .populate('patient', 'name email')
      .lean();

    // Extract unique patient IDs
    const uniquePatientIds = [...new Set(appointments.map(apt => apt.patient._id.toString()))];

    // Fetch complete patient profiles
    const patients = await Promise.all(
      uniquePatientIds.map(async (patientId) => {
        try {
          // Get basic user data
          const user = await User.findById(patientId)
            .select('-password -__v')
            .lean();

          if (!user) return null;

          // Get detailed patient profile
          const patientProfile = await Patient.findOne({ userId: patientId }).lean();

          let profile = { ...user };

          if (patientProfile) {
            // Calculate age from dateOfBirth
            let age = 'N/A';
            if (patientProfile.dateOfBirth) {
              const today = new Date();
              const birthDate = new Date(patientProfile.dateOfBirth);
              age = today.getFullYear() - birthDate.getFullYear();
              const monthDiff = today.getMonth() - birthDate.getMonth();
              if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
              }
            }

            // Merge user and patient data
            profile = {
              ...user,
              ...patientProfile,
              age: age,
              _id: user._id,
              medicalHistory: patientProfile.medicalHistory || {
                conditions: [],
                allergies: [],
                medications: [],
                surgeries: [],
                familyHistory: []
              }
            };
          }

          // Add appointment history for this patient
          const patientAppointments = appointments
            .filter(apt => apt.patient._id.toString() === patientId)
            .map(apt => ({
              id: apt._id,
              date: apt.startTime,
              time: new Date(apt.startTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              }),
              reason: apt.type || 'General Consultation',
              status: apt.status
            }))
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

          return {
            ...profile,
            recentAppointments: patientAppointments
          };

        } catch (error) {
          console.error(`Error fetching patient ${patientId}:`, error);
          return null;
        }
      })
    );

    // Filter out null results and return
    const validPatients = patients.filter(patient => patient !== null);
    res.json(validPatients);

  } catch (error) {
    console.error('Get patients by doctor error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};