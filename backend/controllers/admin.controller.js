const User = require('../models/user.model');
const { sendEmail } = require('../utils/email');

// Get all pending doctor verifications
const getPendingDoctors = async (req, res) => {
  try {
    const doctors = await User.find({
      role: 'doctor',
      isVerified: false
    }).select('-password');

    res.json(doctors);
  } catch (error) {
    console.error('Get pending doctors error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all doctors with filters
const getAllDoctors = async (req, res) => {
  try {
    const { verified, specialization, search } = req.query;
    const query = { role: 'doctor' };

    // Apply filters
    if (verified !== undefined) {
      query.isVerified = verified === 'true';
    }
    if (specialization) {
      query.specialization = specialization;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { clinicName: { $regex: search, $options: 'i' } }
      ];
    }

    const doctors = await User.find(query).select('-password');
    res.json(doctors);
  } catch (error) {
    console.error('Get all doctors error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get specific doctor details
const getDoctorDetails = async (req, res) => {
  try {
    const doctor = await User.findOne({
      _id: req.params.id,
      role: 'doctor'
    }).select('-password');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    console.error('Get doctor details error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get doctor statistics
const getDoctorStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      { $match: { role: 'doctor' } },
      {
        $group: {
          _id: '$isVerified',
          count: { $sum: 1 },
          specializations: { $addToSet: '$specialization' }
        }
      }
    ]);

    // Format stats
    const formattedStats = {
      total: 0,
      verified: 0,
      pending: 0,
      specializations: new Set()
    };

    stats.forEach(stat => {
      const count = stat.count;
      formattedStats.total += count;
      if (stat._id) {
        formattedStats.verified = count;
      } else {
        formattedStats.pending = count;
      }
      stat.specializations.forEach(spec => formattedStats.specializations.add(spec));
    });

    formattedStats.specializations = Array.from(formattedStats.specializations);

    res.json(formattedStats);
  } catch (error) {
    console.error('Get doctor stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Approve doctor verification
const verifyDoctor = async (req, res) => {
  try {
    const doctor = await User.findOne({
      _id: req.params.id,
      role: 'doctor',
      isVerified: false
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found or already verified' });
    }

    // Update verification status
    doctor.isVerified = true;
    await doctor.save();

    // Send verification email
    await sendEmail(doctor.email, 'doctorVerified', doctor.name);

    res.json({
      message: 'Doctor verified successfully',
      doctor
    });
  } catch (error) {
    console.error('Verify doctor error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Reject doctor verification
const rejectDoctor = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    const doctor = await User.findOne({
      _id: req.params.id,
      role: 'doctor'
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Send rejection email
    await sendEmail(doctor.email, 'doctorRejected', {
      name: doctor.name,
      reason
    });

    // Delete the doctor account
    await User.deleteOne({ _id: doctor._id });

    res.json({
      message: 'Doctor verification rejected and account removed'
    });
  } catch (error) {
    console.error('Reject doctor error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getPendingDoctors,
  getAllDoctors,
  getDoctorDetails,
  getDoctorStats,
  verifyDoctor,
  rejectDoctor
}; 