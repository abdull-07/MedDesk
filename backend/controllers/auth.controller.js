import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';
import User from '../models/user.model.js';

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      role: user.role,
      isVerified: user.isVerified 
    },
    process.env.JWT_SECRET,
    { expiresIn: '3d' }
  );
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if any admin exists in the system
    const adminExists = await Admin.findOne();

    if (!adminExists) {
      // First time login - check against environment variables
      if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Create new admin in database
      const newAdmin = new Admin({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD
      });

      await newAdmin.save();

      const token = generateToken({ _id: newAdmin._id, role: 'admin', isVerified: true });

      return res.json({
        message: 'Admin account created and logged in successfully',
        token
      });
    }

    // Admin exists - validate against database
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await admin.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ _id: admin._id, role: 'admin', isVerified: true });

    res.json({
      message: 'Logged in successfully',
      token
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Doctor Registration
export const registerDoctor = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      specialization,
      qualifications,
      clinicName,
      experience,
      licenseNumber
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !specialization || !qualifications || 
        !clinicName || !experience || !licenseNumber) {
      return res.status(400).json({ 
        message: 'Please provide all required fields' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Check if license number already exists
    const existingLicense = await User.findOne({ licenseNumber });
    if (existingLicense) {
      return res.status(400).json({ message: 'License number already registered' });
    }

    // Create new doctor
    const doctor = new User({
      name,
      email,
      password,
      role: 'doctor',
      specialization,
      qualifications,
      clinicName,
      experience,
      licenseNumber,
      isVerified: false
    });

    await doctor.save();

    // Generate token
    const token = generateToken(doctor);

    res.status(201).json({
      message: 'Registration successful. Please wait for admin verification.',
      token,
      user: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        role: doctor.role,
        isVerified: doctor.isVerified,
        specialization: doctor.specialization,
        clinicName: doctor.clinicName
      }
    });

  } catch (error) {
    console.error('Doctor registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Patient Registration
export const registerPatient = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: 'patient',
      isVerified: true // Patients are auto-verified
    });

    await user.save();

    // Generate token
    const token = generateToken(user);

    // Return success response
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Patient registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// User Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // For doctors, check verification status
    if (user.role === 'doctor' && !user.isVerified) {
      return res.status(403).json({ 
        message: 'Your account is pending verification by admin'
      });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        ...(user.role === 'doctor' && {
          specialization: user.specialization,
          clinicName: user.clinicName
        })
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .lean(); // Use lean() for better performance

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize default values for nested objects if they don't exist
    const profile = {
      ...user,
      address: user.address || {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      },
      emergencyContact: user.emergencyContact || {
        name: '',
        relationship: '',
        phone: ''
      },
      medicalHistory: user.medicalHistory || {
        conditions: [],
        allergies: [],
        medications: []
      }
    };

    // Format date if it exists
    if (profile.dateOfBirth) {
      profile.dateOfBirth = new Date(profile.dateOfBirth).toISOString().split('T')[0];
    }

    console.log('Fetched profile:', profile);
    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      emergencyContact,
      medicalHistory
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (gender) user.gender = gender;
    if (bloodGroup) user.bloodGroup = bloodGroup;

    // Update address if provided
    if (address) {
      user.address = {
        ...user.address,
        ...address
      };
    }

    // Update emergency contact if provided
    if (emergencyContact) {
      user.emergencyContact = {
        ...user.emergencyContact,
        ...emergencyContact
      };
    }

    // Update medical history if provided
    if (medicalHistory) {
      user.medicalHistory = {
        ...user.medicalHistory,
        ...medicalHistory
      };
    }

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(user._id).select('-password');
    res.json(updatedUser);

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 