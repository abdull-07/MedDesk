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
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    // Check if any admin exists in the system
    const adminExists = await Admin.findOne();

    if (!adminExists) {
      // First time login - check against environment variables
      if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid credentials for first-time admin setup' 
        });
      }

      // Create new admin in database with hashed password
      const newAdmin = new Admin({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD // Password will be hashed by the pre-save middleware
      });

      await newAdmin.save();

      const token = generateToken({ 
        id: newAdmin._id, 
        role: 'admin',
        isVerified: true 
      });

      return res.json({
        success: true,
        message: 'Admin account created and logged in successfully',
        token,
        admin: {
          id: newAdmin._id,
          email: newAdmin.email,
          role: newAdmin.role
        }
      });
    }

    // Admin exists - validate against database
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isValidPassword = await admin.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Update last login time
    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken({ 
      id: admin._id, 
      role: 'admin',
      isVerified: true 
    });

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
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
      licenseNumber,
      consultationFee,
      location,
      contactInfo,
      about,
      services,
      languages,
      education,
      workExperience,
      awards,
      certifications, // Add certifications
      availability // Add availability
    } = req.body;

    // Validate basic required fields
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
    
    // Validate contact info email if provided
    if (contactInfo && contactInfo.email && !emailRegex.test(contactInfo.email)) {
      return res.status(400).json({ message: 'Please provide a valid contact email address' });
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

    // Import Doctor model
    const Doctor = (await import('../models/doctor.model.js')).default;
    
    try {
      // Check if license number already exists in Doctor model
      const existingLicense = await Doctor.findOne({ licenseNumber });
      
      if (existingLicense) {
        return res.status(400).json({ message: 'License number already registered' });
      }
    } catch (error) {
      console.error('Error checking license number:', error);
      // Continue with registration even if there's an error checking the license
      // This handles the case where the Doctor collection doesn't exist yet
    }

    // Create new user with basic auth data and doctor-specific fields
    const user = new User({
      name,
      email,
      password,
      role: 'doctor',
      specialization,
      qualifications,
      clinicName,
      experience: Number(experience),
      licenseNumber,
      consultationFee: consultationFee ? Number(consultationFee) : 0,
      isVerified: false
    });

    await user.save();
    
    // Create doctor profile linked to user with default values for missing fields
    let doctorProfile;
    try {
      doctorProfile = new Doctor({
        userId: user._id,
        specialization,
        qualifications,
        experience: Number(experience), // Convert to number in case it's a string
        licenseNumber,
        clinicName,
        consultationFee: consultationFee ? Number(consultationFee) : 0,
        contactInfo: {
          email: email, // Use the same email as the user account
          phone: contactInfo?.phone || ''
        },
        location: {
          city: '',
          state: '',
          country: ''
        },
        about: '',
        services: [],
        languages: [],
        education: education || [], // Add education
        workExperience: workExperience || [], // Add workExperience
        awards: awards || [], // Add awards
        certifications: certifications || [], // Add certifications
        availability: availability || {} // Add availability
      });
      
      await doctorProfile.save();
    } catch (doctorError) {
      console.error('Error creating doctor profile:', doctorError);
      // Continue with registration even if there's an error creating the doctor profile
      // We'll create it later when the user logs in
    }

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      message: 'Registration successful. Please wait for admin verification.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        specialization: user.specialization,
        clinicName: user.clinicName
      }
    });

  } catch (error) {
    console.error('Doctor registration error:', error);
    // Return more detailed error information for debugging
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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

    // Create new user with basic auth data
    const user = new User({
      name,
      email,
      password,
      role: 'patient',
      isVerified: true // Patients are auto-verified
    });

    await user.save();

    // Import Patient model
    const Patient = (await import('../models/patient.model.js')).default;
    
    // Create initial patient profile linked to user
    const patient = new Patient({
      userId: user._id,
      name: name
    });
    
    await patient.save();

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

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    // For doctors, check verification status
    if (user.role === 'doctor' && !user.isVerified) {
      return res.status(403).json({ 
        message: 'Your account is pending verification by admin',
        pendingVerification: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: false,
          createdAt: user.createdAt
        }
      });
    }

    // Generate token
    const token = generateToken(user);

    // Prepare basic user data
    let userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified
    };

    // If user is a patient, fetch complete profile data
    if (user.role === 'patient') {
      try {
        // Import Patient model
        const Patient = (await import('../models/patient.model.js')).default;
        
        // Find patient profile
        const patientProfile = await Patient.findOne({ userId: user._id }).lean();
        
        if (patientProfile) {
          // Merge user and patient data
          userData = {
            ...userData,
            phone: patientProfile.phone || '',
            dateOfBirth: patientProfile.dateOfBirth ? new Date(patientProfile.dateOfBirth).toISOString().split('T')[0] : '',
            gender: patientProfile.gender || '',
            bloodGroup: patientProfile.bloodGroup || '',
            address: patientProfile.address || {},
            emergencyContact: patientProfile.emergencyContact || {},
            medicalHistory: patientProfile.medicalHistory || {}
          };
        }
      } catch (profileError) {
        console.error('Error fetching patient profile:', profileError);
        // Continue with basic user data if profile fetch fails
      }
    }
    
    // If user is a doctor, fetch complete doctor profile data
    if (user.role === 'doctor') {
      try {
        // Import Doctor model
        const Doctor = (await import('../models/doctor.model.js')).default;
        
        // Find doctor profile
        const doctorProfile = await Doctor.findOne({ userId: user._id }).lean();
        
        if (doctorProfile) {
          // Merge user and doctor data
          userData = {
            ...userData,
            specialization: doctorProfile.specialization || user.specialization,
            qualifications: doctorProfile.qualifications || user.qualifications,
            experience: doctorProfile.experience || user.experience,
            licenseNumber: doctorProfile.licenseNumber || user.licenseNumber,
            clinicName: doctorProfile.clinicName || user.clinicName,
            consultationFee: doctorProfile.consultationFee || user.consultationFee || 0,
            location: doctorProfile.location || {},
            contactInfo: doctorProfile.contactInfo || { email: user.email, phone: '' },
            about: doctorProfile.about || '',
            services: doctorProfile.services || [],
            languages: doctorProfile.languages || [],
            education: doctorProfile.education || [],
            workExperience: doctorProfile.workExperience || [],
            awards: doctorProfile.awards || []
          };
        } else {
          // If doctor profile doesn't exist, use data from user model
          userData = {
            ...userData,
            specialization: user.specialization || '',
            qualifications: user.qualifications || '',
            experience: user.experience || 0,
            licenseNumber: user.licenseNumber || '',
            clinicName: user.clinicName || '',
            consultationFee: user.consultationFee || 0,
            location: {},
            contactInfo: { email: user.email, phone: '' },
            about: '',
            services: [],
            languages: []
          };
          
          // Create a doctor profile for future use
          try {
            const newDoctorProfile = new Doctor({
              userId: user._id,
              specialization: user.specialization || '',
              qualifications: user.qualifications || '',
              experience: user.experience || 0,
              licenseNumber: user.licenseNumber || '',
              clinicName: user.clinicName || '',
              consultationFee: user.consultationFee || 0,
              certifications: [],
              availability: {
                monday: { isAvailable: false, slots: [] },
                tuesday: { isAvailable: false, slots: [] },
                wednesday: { isAvailable: false, slots: [] },
                thursday: { isAvailable: false, slots: [] },
                friday: { isAvailable: false, slots: [] },
                saturday: { isAvailable: false, slots: [] },
                sunday: { isAvailable: false, slots: [] }
              },
              contactInfo: {
                email: user.email,
                phone: ''
              },
              location: {
                city: '',
                state: '',
                country: ''
              }
            });
            
            await newDoctorProfile.save();
            console.log('Created new doctor profile during login');
          } catch (createError) {
            console.error('Error creating doctor profile during login:', createError);
          }
        }
      } catch (profileError) {
        console.error('Error fetching doctor profile:', profileError);
        // Continue with basic user data if profile fetch fails
        // Add basic doctor fields from user model
        userData = {
          ...userData,
          specialization: user.specialization || '',
          qualifications: user.qualifications || '',
          experience: user.experience || 0,
          licenseNumber: user.licenseNumber || '',
          clinicName: user.clinicName || '',
          consultationFee: user.consultationFee || 0
        };
      }
    }

    res.json({
      message: 'Logged in successfully',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    // Get basic user data
    const user = await User.findById(req.user.id)
      .select('-password -__v')
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let profile = { ...user };

    // If user is a patient, get detailed profile data from Patient collection
    if (user.role === 'patient') {
      // Import Patient model
      const Patient = (await import('../models/patient.model.js')).default;
      
      // Find patient profile
      const patientProfile = await Patient.findOne({ userId: user._id }).lean();
      
      if (patientProfile) {
        // Merge user and patient data
        profile = {
          ...user,
          ...patientProfile,
          // Ensure userId is not duplicated
          _id: user._id
        };
      } else {
        // If patient profile doesn't exist yet, create one
        const newPatientProfile = new Patient({
          userId: user._id,
          name: user.name
        });
        
        await newPatientProfile.save();
        
        // Use the newly created profile
        profile = {
          ...user,
          ...newPatientProfile.toObject(),
          _id: user._id
        };
      }
      
      // Initialize default values for nested objects if they don't exist
      profile = {
        ...profile,
        address: profile.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        emergencyContact: profile.emergencyContact || {
          name: '',
          relationship: '',
          phone: '',
          email: ''
        },
        medicalHistory: profile.medicalHistory || {
          conditions: [],
          allergies: [],
          medications: [],
          surgeries: [],
          familyHistory: []
        }
      };
    }
    
    // If user is a doctor, get detailed profile data from Doctor collection
    else if (user.role === 'doctor') {
      // Import Doctor model
      const Doctor = (await import('../models/doctor.model.js')).default;
      
      // Find doctor profile
      const doctorProfile = await Doctor.findOne({ userId: user._id }).lean();
      
      if (doctorProfile) {
        // Convert availability Map to plain object if it exists
        if (doctorProfile.availability && doctorProfile.availability instanceof Map) {
          const availabilityObj = {};
          doctorProfile.availability.forEach((value, key) => {
            availabilityObj[key] = value;
          });
          doctorProfile.availability = availabilityObj;
        }
        
        // Merge user and doctor data
        profile = {
          ...user,
          ...doctorProfile,
          // Ensure userId is not duplicated
          _id: user._id
        };
      } else {
        // If doctor profile doesn't exist yet, create a basic one
        const newDoctorProfile = new Doctor({
          userId: user._id,
          specialization: user.specialization || '',
          qualifications: user.qualifications || '',
          experience: user.experience || 0,
          licenseNumber: user.licenseNumber || '',
          clinicName: user.clinicName || '',
          consultationFee: user.consultationFee || 0,
          contactInfo: {
            email: user.email,
            phone: ''
          },
          location: {
            city: '',
            state: '',
            country: ''
          }
        });
        
        await newDoctorProfile.save();
        
                  // Use the newly created profile
          profile = {
            ...user,
            ...newDoctorProfile.toObject(),
            _id: user._id
          };
        }
        
        // Initialize default values for doctor-specific nested objects if they don't exist
        profile = {
          ...profile,
          location: profile.location || {
            address: '',
            city: '',
            state: '',
            country: '',
            zipCode: '',
            coordinates: { type: 'Point', coordinates: [0, 0] }
          },
          contactInfo: profile.contactInfo || {
            phone: '',
            email: user.email,
            website: ''
          },
          certifications: profile.certifications || [],
          availability: profile.availability || {
            monday: { isAvailable: false, slots: [] },
            tuesday: { isAvailable: false, slots: [] },
            wednesday: { isAvailable: false, slots: [] },
            thursday: { isAvailable: false, slots: [] },
            friday: { isAvailable: false, slots: [] },
            saturday: { isAvailable: false, slots: [] },
            sunday: { isAvailable: false, slots: [] }
          },
          services: profile.services || [],
          languages: profile.languages || [],
          education: profile.education || [],
          workExperience: profile.workExperience || [],
          awards: profile.awards || []
        };
    }

    // Format date if it exists
    if (profile.dateOfBirth) {
      profile.dateOfBirth = new Date(profile.dateOfBirth).toISOString().split('T')[0];
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch profile',
      error: error.message 
    });
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

    // Input validation
    if (phone && !/^\+?[\d\s-]{10,}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }

    if (dateOfBirth && isNaN(new Date(dateOfBirth).getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format for date of birth'
      });
    }

    if (gender && !['male', 'female', 'other'].includes(gender.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid gender value'
      });
    }

    if (bloodGroup && !['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(bloodGroup)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blood group'
      });
    }

    // Find the user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update name in the User model (basic auth data)
    if (name) {
      user.name = name.trim();
      await user.save();
    }

    // If user is a patient, update the detailed profile in Patient collection
    if (user.role === 'patient') {
      // Import Patient model
      const Patient = (await import('../models/patient.model.js')).default;
      
      // Find or create patient profile
      let patientProfile = await Patient.findOne({ userId: user._id });
      
      if (!patientProfile) {
        patientProfile = new Patient({
          userId: user._id,
          name: user.name
        });
      }
      
      // Update patient profile fields
      if (name) patientProfile.name = name.trim();
      if (phone) patientProfile.phone = phone.trim();
      if (dateOfBirth) patientProfile.dateOfBirth = new Date(dateOfBirth);
      if (gender) patientProfile.gender = gender.toLowerCase();
      if (bloodGroup) patientProfile.bloodGroup = bloodGroup;

      // Update address if provided
      if (address) {
        patientProfile.address = {
          ...patientProfile.address || {},
          ...address,
          street: address.street?.trim(),
          city: address.city?.trim(),
          state: address.state?.trim(),
          zipCode: address.zipCode?.trim(),
          country: address.country?.trim()
        };
      }

      // Update emergency contact if provided
      if (emergencyContact) {
        // Validate emergency contact phone if provided
        if (emergencyContact.phone && !/^\+?[\d\s-]{10,}$/.test(emergencyContact.phone)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid emergency contact phone number format'
          });
        }

        // Validate emergency contact email if provided
        if (emergencyContact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emergencyContact.email)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid emergency contact email format'
          });
        }

        patientProfile.emergencyContact = {
          ...patientProfile.emergencyContact || {},
          ...emergencyContact,
          name: emergencyContact.name?.trim(),
          relationship: emergencyContact.relationship?.trim(),
          phone: emergencyContact.phone?.trim(),
          email: emergencyContact.email?.trim()
        };
      }

      // Update medical history if provided
      if (medicalHistory) {
        patientProfile.medicalHistory = {
          ...patientProfile.medicalHistory || {},
          ...medicalHistory,
          conditions: medicalHistory.conditions?.map(c => c.trim()) || patientProfile.medicalHistory?.conditions || [],
          allergies: medicalHistory.allergies?.map(a => a.trim()) || patientProfile.medicalHistory?.allergies || [],
          medications: medicalHistory.medications?.map(m => m.trim()) || patientProfile.medicalHistory?.medications || [],
          surgeries: medicalHistory.surgeries?.map(s => s.trim()) || patientProfile.medicalHistory?.surgeries || [],
          familyHistory: medicalHistory.familyHistory?.map(f => f.trim()) || patientProfile.medicalHistory?.familyHistory || []
        };
      }

      // Save the updated patient profile
      await patientProfile.save();
      
      // Prepare response data by merging user and patient data
      const userData = user.toObject();
      delete userData.password;
      delete userData.__v;
      
      const patientData = patientProfile.toObject();
      delete patientData._id; // Remove patient document ID to avoid confusion
      delete patientData.__v;
      
      const responseData = {
        ...userData,
        ...patientData
      };

      return res.json({
        success: true,
        message: 'Profile updated successfully',
        data: responseData
      });
    } else if (user.role === 'doctor') {
      // Handle doctor profile updates
      const {
        specialization,
        qualifications,
        clinicName,
        experience,
        consultationFee,
        location,
        contactInfo,
        about,
        services,
        languages,
        education,
        workExperience,
        awards
      } = req.body;

      // Import Doctor model
      const Doctor = (await import('../models/doctor.model.js')).default;
      
      // Find or create doctor profile
      let doctorProfile = await Doctor.findOne({ userId: user._id });
      
      if (!doctorProfile) {
        doctorProfile = new Doctor({
          userId: user._id,
          specialization: user.specialization || '',
          qualifications: user.qualifications || '',
          experience: user.experience || 0,
          licenseNumber: user.licenseNumber || '',
          clinicName: user.clinicName || '',
          consultationFee: user.consultationFee || 0,
          contactInfo: {
            email: user.email,
            phone: ''
          },
          location: {
            city: '',
            state: '',
            country: ''
          }
        });
      }
      
      // Update doctor profile fields
      if (name) doctorProfile.name = name.trim();
      if (specialization) doctorProfile.specialization = specialization.trim();
      if (qualifications) doctorProfile.qualifications = qualifications.trim();
      if (clinicName) doctorProfile.clinicName = clinicName.trim();
      if (experience !== undefined) doctorProfile.experience = experience;
      if (consultationFee !== undefined) doctorProfile.consultationFee = consultationFee;
      if (about) doctorProfile.about = about.trim();
      
      // Update services if provided
      if (services) {
        doctorProfile.services = services.map(s => s.trim());
      }
      
      // Update languages if provided
      if (languages) {
        doctorProfile.languages = languages.map(l => l.trim());
      }
      
      // Update location if provided
      if (location) {
        doctorProfile.location = {
          ...doctorProfile.location || {},
          ...location,
          address: location.address?.trim(),
          city: location.city?.trim(),
          state: location.state?.trim(),
          zipCode: location.zipCode?.trim(),
          country: location.country?.trim(),
          coordinates: location.coordinates || doctorProfile.location?.coordinates || { type: 'Point', coordinates: [0, 0] }
        };
      }
      
      // Update contact info if provided
      if (contactInfo) {
        // Validate contact phone if provided
        if (contactInfo.phone && !/^\+?[\d\s-]{10,}$/.test(contactInfo.phone)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid phone number format'
          });
        }

        // Validate contact email if provided
        if (contactInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid email format'
          });
        }

        doctorProfile.contactInfo = {
          ...doctorProfile.contactInfo || {},
          ...contactInfo,
          phone: contactInfo.phone?.trim(),
          email: contactInfo.email?.trim(),
          website: contactInfo.website?.trim()
        };
      }
      
      // Update education if provided
      if (education) {
        doctorProfile.education = education.map(edu => ({
          degree: edu.degree?.trim(),
          institution: edu.institution?.trim(),
          year: edu.year
        }));
      }
      
      // Update work experience if provided
      if (workExperience) {
        doctorProfile.workExperience = workExperience.map(exp => ({
          position: exp.position?.trim(),
          hospital: exp.hospital?.trim(),
          startYear: exp.startYear,
          endYear: exp.endYear,
          current: exp.current || false
        }));
      }
      
      // Update certifications if provided
      if (req.body.certifications) {
        doctorProfile.certifications = req.body.certifications.map(cert => ({
          name: cert.name?.trim(),
          issuingOrganization: cert.issuingOrganization?.trim(),
          issueDate: cert.issueDate ? new Date(cert.issueDate) : null,
          expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : null,
          certificationNumber: cert.certificationNumber?.trim()
        }));
      }

      // Update availability if provided
      if (req.body.availability) {
        doctorProfile.availability = req.body.availability;
      }
      
      // Update awards if provided
      if (awards) {
        doctorProfile.awards = awards.map(award => ({
          title: award.title?.trim(),
          year: award.year,
          description: award.description?.trim()
        }));
      }

      // Save the updated doctor profile
      await doctorProfile.save();
      
      // Prepare response data by merging user and doctor data
      const userData = user.toObject();
      delete userData.password;
      delete userData.__v;
      
      const doctorData = doctorProfile.toObject();
      delete doctorData._id; // Remove doctor document ID to avoid confusion
      delete doctorData.__v;
      
      const responseData = {
        ...userData,
        ...doctorData
      };

      return res.json({
        success: true,
        message: 'Doctor profile updated successfully',
        data: responseData
      });
    } else {
      // For other user types
      // Update basic fields if provided
      if (phone) user.phone = phone.trim();
      if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);
      if (gender) user.gender = gender.toLowerCase();
      if (bloodGroup) user.bloodGroup = bloodGroup;

      // Update address if provided
      if (address) {
        user.address = {
          ...user.address || {},
          ...address,
          street: address.street?.trim(),
          city: address.city?.trim(),
          state: address.state?.trim(),
          zipCode: address.zipCode?.trim(),
          country: address.country?.trim()
        };
      }

      // Update emergency contact if provided
      if (emergencyContact) {
        user.emergencyContact = {
          ...user.emergencyContact || {},
          ...emergencyContact,
          name: emergencyContact.name?.trim(),
          relationship: emergencyContact.relationship?.trim(),
          phone: emergencyContact.phone?.trim(),
          email: emergencyContact.email?.trim()
        };
      }

      // Update medical history if provided
      if (medicalHistory) {
        user.medicalHistory = {
          ...user.medicalHistory || {},
          ...medicalHistory,
          conditions: medicalHistory.conditions?.map(c => c.trim()) || user.medicalHistory?.conditions || [],
          allergies: medicalHistory.allergies?.map(a => a.trim()) || user.medicalHistory?.allergies || [],
          medications: medicalHistory.medications?.map(m => m.trim()) || user.medicalHistory?.medications || [],
          surgeries: medicalHistory.surgeries?.map(s => s.trim()) || user.medicalHistory?.surgeries || [],
          familyHistory: medicalHistory.familyHistory?.map(f => f.trim()) || user.medicalHistory?.familyHistory || []
        };
      }

      // Save the updated user
      await user.save();

      // Return updated user without sensitive fields
      const updatedUser = await User.findById(user._id)
        .select('-password -__v')
        .lean();

      return res.json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser
      });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};