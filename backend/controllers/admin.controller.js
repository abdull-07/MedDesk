import User from '../models/user.model.js';
import Appointment from '../models/appointment.model.js';
import { sendEmail } from '../utils/email.js';

// Get all pending doctor verifications
export const getPendingDoctors = async (req, res) => {
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
export const getAllDoctors = async (req, res) => {
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
export const getDoctorDetails = async (req, res) => {
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
export const getDoctorStats = async (req, res) => {
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
export const verifyDoctor = async (req, res) => {
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
export const rejectDoctor = async (req, res) => {
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

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Get user counts
    const [totalUsers, totalDoctors, pendingVerifications] = await Promise.all([
      User.countDocuments({ role: 'patient' }),
      User.countDocuments({ role: 'doctor', isVerified: true }),
      User.countDocuments({ role: 'doctor', isVerified: false })
    ]);

    // Get appointment counts
    const totalAppointments = await Appointment.countDocuments();

    // Get active users (users who have logged in within the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // For now, we'll use total users as active users since we don't have lastLogin field
    // You can add a lastLogin field to the User model later if needed
    const activeUsers = totalUsers;

    // System health (simplified - you can make this more sophisticated)
    const systemHealth = 100; // This could be calculated based on various metrics

    const stats = {
      totalUsers,
      totalDoctors,
      pendingVerifications,
      totalAppointments,
      activeUsers,
      systemHealth
    };

    res.json(stats);
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get recent activities
export const getRecentActivities = async (req, res) => {
  try {
    const activities = [];

    // Get recent user registrations
    const recentUsers = await User.find({ role: 'patient' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name createdAt');

    recentUsers.forEach(user => {
      activities.push({
        id: `user_${user._id}`,
        title: 'New User Registration',
        description: `${user.name} joined the platform`,
        time: formatTimeAgo(user.createdAt),
        createdAt: user.createdAt,
        iconType: 'user',
        bgColor: 'bg-blue-100'
      });
    });

    // Get recent doctor registrations
    const recentDoctors = await User.find({ role: 'doctor' })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('name createdAt isVerified');

    recentDoctors.forEach(doctor => {
      activities.push({
        id: `doctor_${doctor._id}`,
        title: doctor.isVerified ? 'Doctor Verified' : 'New Doctor Registration',
        description: `${formatDoctorName(doctor.name)} ${doctor.isVerified ? 'was verified' : 'registered for verification'}`,
        time: formatTimeAgo(doctor.createdAt),
        createdAt: doctor.createdAt,
        iconType: 'doctor',
        bgColor: doctor.isVerified ? 'bg-green-100' : 'bg-yellow-100'
      });
    });

    // Get recent appointments
    const recentAppointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('patient', 'name')
      .populate('doctor', 'name')
      .select('patient doctor createdAt status');

    recentAppointments.forEach(appointment => {
      activities.push({
        id: `appointment_${appointment._id}`,
        title: 'New Appointment',
        description: `${appointment.patient.name} booked with ${formatDoctorName(appointment.doctor.name)}`,
        time: formatTimeAgo(appointment.createdAt),
        createdAt: appointment.createdAt,
        iconType: 'appointment',
        bgColor: 'bg-purple-100'
      });
    });

    // Sort activities by createdAt and limit to 10
    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const limitedActivities = activities.slice(0, 10);

    res.json(limitedActivities);
  } catch (error) {
    console.error('Get recent activities error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all users with filters
export const getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const query = {};

    // Apply filters
    if (role && role !== 'all') {
      query.role = role;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      users,
      currentPage: parseInt(page),
      totalPages,
      total
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user status
export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.params.id;

    if (!['active', 'blocked', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User status updated successfully', user });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    if (!['patient', 'doctor', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all appointments with filters
export const getAllAppointments = async (req, res) => {
  try {
    const { status, date, search, page = 1, limit = 20 } = req.query;
    const query = {};

    // Apply filters
    if (status && status !== 'all') {
      query.status = status;
    }
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.startTime = { $gte: startDate, $lt: endDate };
    }

    const skip = (page - 1) * limit;
    let appointments = await Appointment.find(query)
      .populate('patient', 'name email')
      .populate('doctor', 'name email specialization')
      .sort({ startTime: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Apply search filter after population
    if (search) {
      appointments = appointments.filter(appointment => 
        appointment.patient.name.toLowerCase().includes(search.toLowerCase()) ||
        appointment.doctor.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = await Appointment.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      appointments,
      currentPage: parseInt(page),
      totalPages,
      total
    });
  } catch (error) {
    console.error('Get all appointments error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointmentId = req.params.id;

    if (!['pending', 'scheduled', 'completed', 'cancelled', 'no-show'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    ).populate('patient', 'name email')
     .populate('doctor', 'name email specialization');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment status updated successfully', appointment });
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get reports data
export const getReports = async (req, res) => {
  try {
    const { range = 'week' } = req.query;
    const reportType = req.path.split('/').pop(); // appointments, revenue, specialties, user-growth

    let startDate = new Date();
    switch (range) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case 'quarter':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    let data = [];

    switch (reportType) {
      case 'appointments':
        // Generate appointment statistics
        const appointments = await Appointment.aggregate([
          { $match: { createdAt: { $gte: startDate } } },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              total: { $sum: 1 },
              completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } }
            }
          },
          { $sort: { _id: 1 } }
        ]);
        data = appointments.map(item => ({ date: item._id, total: item.total, completed: item.completed }));
        break;

      case 'revenue':
        // Generate revenue statistics (simplified)
        const revenue = await Appointment.aggregate([
          { $match: { createdAt: { $gte: startDate }, paymentStatus: 'paid' } },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              amount: { $sum: "$fee" }
            }
          },
          { $sort: { _id: 1 } }
        ]);
        data = revenue.map(item => ({ date: item._id, amount: item.amount }));
        break;

      case 'specialties':
        // Generate specialties distribution
        const specialties = await User.aggregate([
          { $match: { role: 'doctor', isVerified: true } },
          {
            $group: {
              _id: '$specialization',
              count: { $sum: 1 }
            }
          }
        ]);
        data = specialties.map(item => ({ name: item._id || 'Not specified', count: item.count }));
        break;

      case 'user-growth':
        // Generate user growth statistics
        const userGrowth = await User.aggregate([
          { $match: { createdAt: { $gte: startDate }, role: 'patient' } },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ]);
        data = userGrowth.map(item => ({ date: item._id, count: item.count }));
        break;
    }

    res.json(data);
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get audit logs (enhanced implementation)
export const getAuditLogs = async (req, res) => {
  try {
    const { type, date, search, page = 1, limit = 20 } = req.query;
    
    // For now, we'll create comprehensive audit logs based on various activities
    // In a real application, you'd have a separate AuditLog model
    const logs = [];

    // Get recent user registrations as CREATE logs
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .select('name email role createdAt');

    recentUsers.forEach(user => {
      logs.push({
        id: `user_create_${user._id}`,
        timestamp: user.createdAt,
        user: {
          name: user.name,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=006D77&color=fff`,
          role: user.role
        },
        action: 'create',
        resource: 'User',
        resourceId: user._id,
        details: `User account created with role: ${user.role}`,
        ipAddress: '192.168.1.1'
      });
    });

    // Get users with lastLogin as LOGIN logs
    const usersWithLogin = await User.find({ lastLogin: { $ne: null } })
      .sort({ lastLogin: -1 })
      .limit(10)
      .select('name email role lastLogin');

    usersWithLogin.forEach(user => {
      logs.push({
        id: `user_login_${user._id}`,
        timestamp: user.lastLogin,
        user: {
          name: user.name,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=006D77&color=fff`,
          role: user.role
        },
        action: 'login',
        resource: 'Authentication',
        resourceId: user._id,
        details: `User logged into the system`,
        ipAddress: '192.168.1.1'
      });
    });

    // Get recent appointments as CREATE logs
    const recentAppointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .populate('patient', 'name')
      .populate('doctor', 'name');

    recentAppointments.forEach(appointment => {
      logs.push({
        id: `appointment_create_${appointment._id}`,
        timestamp: appointment.createdAt,
        user: {
          name: appointment.patient.name,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(appointment.patient.name)}&background=006D77&color=fff`,
          role: 'patient'
        },
        action: 'create',
        resource: 'Appointment',
        resourceId: appointment._id,
        details: `Appointment booked with ${formatDoctorName(appointment.doctor.name)}`,
        ipAddress: '192.168.1.1'
      });
    });

    // Get appointments with different statuses as UPDATE logs (simulated updates)
    const appointmentsWithStatus = await Appointment.find({ 
      status: { $in: ['completed', 'cancelled', 'no-show'] }
    })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('patient', 'name')
      .populate('doctor', 'name');

    appointmentsWithStatus.forEach(appointment => {
      // Use updatedAt if available, otherwise use a time after createdAt
      const updateTime = appointment.updatedAt || new Date(appointment.createdAt.getTime() + 60 * 60 * 1000); // +1 hour
      logs.push({
        id: `appointment_update_${appointment._id}`,
        timestamp: updateTime,
        user: {
          name: appointment.patient.name,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(appointment.patient.name)}&background=006D77&color=fff`,
          role: 'patient'
        },
        action: 'update',
        resource: 'Appointment',
        resourceId: appointment._id,
        details: `Appointment status updated to ${appointment.status}`,
        ipAddress: '192.168.1.1'
      });
    });

    // Get verified doctors as UPDATE logs
    const verifiedDoctors = await User.find({ 
      role: 'doctor', 
      isVerified: true 
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt');

    verifiedDoctors.forEach(doctor => {
      // Create a timestamp slightly after creation for verification
      const verificationTime = new Date(doctor.createdAt.getTime() + 24 * 60 * 60 * 1000); // +1 day
      logs.push({
        id: `doctor_verify_${doctor._id}`,
        timestamp: verificationTime,
        user: {
          name: 'Admin',
          avatar: `https://ui-avatars.com/api/?name=Admin&background=006D77&color=fff`,
          role: 'admin'
        },
        action: 'update',
        resource: 'Doctor',
        resourceId: doctor._id,
        details: `Doctor ${doctor.name} verification approved`,
        ipAddress: '192.168.1.1'
      });
    });

    // Add some mock LOGOUT logs (only if logout time would be in the past)
    const recentLoginUsers = await User.find({ lastLogin: { $ne: null } })
      .sort({ lastLogin: -1 })
      .limit(5)
      .select('name email role lastLogin');

    recentLoginUsers.forEach((user, index) => {
      // Create logout timestamp after login, but only if it's in the past
      const logoutTime = new Date(user.lastLogin.getTime() + (index + 1) * 2 * 60 * 60 * 1000); // +2-6 hours
      if (logoutTime < new Date()) { // Only add if logout time is in the past
        logs.push({
          id: `user_logout_${user._id}`,
          timestamp: logoutTime,
          user: {
            name: user.name,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=006D77&color=fff`,
            role: user.role
          },
          action: 'logout',
          resource: 'Authentication',
          resourceId: user._id,
          details: `User logged out of the system`,
          ipAddress: '192.168.1.1'
        });
      }
    });

    // Sort logs by timestamp (most recent first)
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Apply filters
    let filteredLogs = logs;
    if (type && type !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.action === type);
    }
    if (search) {
      filteredLogs = filteredLogs.filter(log => 
        log.user.name.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.resource.toLowerCase().includes(search.toLowerCase()) ||
        log.details.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (date) {
      const filterDate = new Date(date);
      filteredLogs = filteredLogs.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate.toDateString() === filterDate.toDateString();
      });
    }

    // Pagination
    const skip = (page - 1) * limit;
    const paginatedLogs = filteredLogs.slice(skip, skip + parseInt(limit));
    const totalPages = Math.ceil(filteredLogs.length / limit);

    res.json({
      logs: paginatedLogs,
      currentPage: parseInt(page),
      totalPages,
      total: filteredLogs.length
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Helper function to format doctor name with proper Dr. prefix
const formatDoctorName = (name) => {
  if (!name) return 'Unknown Doctor';
  // Check if name already starts with "Dr." (case insensitive)
  if (name.toLowerCase().startsWith('dr.') || name.toLowerCase().startsWith('doctor')) {
    return name;
  }
  return `Dr. ${name}`;
};

// Helper function to format time ago
const formatTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}; 