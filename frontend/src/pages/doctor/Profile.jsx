import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProfilePictureUpload from '../../components/ProfilePictureUpload';

const Profile = () => {
    const { getUserProfile, updateUserProfile } = useAuth();

    const [profile, setProfile] = useState({
        name: '',
        email: '',
        profilePicture: null,
        specialization: '', // required
        qualifications: '', // required, string
        clinicName: '', // required
        experience: 0, // required
        consultationFee: 1500,
        licenseNumber: '', // required
        about: '',
        services: [],
        languages: [],
        contactInfo: {
            phone: '',
            email: '',
            website: ''
        },
        location: {
            address: '',
            city: '',
            state: '',
            country: '',
            zipCode: '',
            coordinates: {
                type: 'Point',
                coordinates: [0, 0]
            }
        },
        availability: {
            monday: { isAvailable: false, slots: [] },
            tuesday: { isAvailable: false, slots: [] },
            wednesday: { isAvailable: false, slots: [] },
            thursday: { isAvailable: false, slots: [] },
            friday: { isAvailable: false, slots: [] },
            saturday: { isAvailable: false, slots: [] },
            sunday: { isAvailable: false, slots: [] }
        },
        education: [{
            degree: '',
            institution: '',
            year: null
        }],
        certifications: [{
            name: '',
            issuingOrganization: '',
            issueDate: null,
            expiryDate: null
        }],
        awards: []
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [activeTab, setActiveTab] = useState('basic');
    const [isEditing, setIsEditing] = useState(false);

    // Debug logging
    console.log('Profile availability:', profile.availability);
    console.log('Active tab:', activeTab);
    console.log('Profile availability type:', typeof profile.availability);
    console.log('Profile availability keys:', profile.availability ? Object.keys(profile.availability) : 'No availability');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const response = await getUserProfile();
                if (response.success) {
                    console.log('Raw profile data from backend:', response.data);
                    console.log('Availability data type:', typeof response.data.availability);
                    console.log('Availability data:', response.data.availability);

                    // Ensure availability is properly formatted
                    let profileData = { ...response.data };

                    // Handle availability data - ensure it's a proper object
                    if (!profileData.availability || typeof profileData.availability !== 'object') {
                        profileData.availability = {
                            monday: { isAvailable: false, slots: [] },
                            tuesday: { isAvailable: false, slots: [] },
                            wednesday: { isAvailable: false, slots: [] },
                            thursday: { isAvailable: false, slots: [] },
                            friday: { isAvailable: false, slots: [] },
                            saturday: { isAvailable: false, slots: [] },
                            sunday: { isAvailable: false, slots: [] }
                        };
                    } else {
                        // Convert Map to Object if needed
                        if (profileData.availability instanceof Map) {
                            const availabilityObj = {};
                            profileData.availability.forEach((value, key) => {
                                availabilityObj[key] = value;
                            });
                            profileData.availability = availabilityObj;
                        }

                        // Ensure all days are present
                        const defaultDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                        defaultDays.forEach(day => {
                            if (!profileData.availability[day]) {
                                profileData.availability[day] = { isAvailable: false, slots: [] };
                            }
                        });
                    }

                    console.log('Processed availability data:', profileData.availability);
                    setProfile(profileData);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                setError('Failed to load profile');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [getUserProfile]);

    const handleChange = useCallback((field, value, nestedField = null) => {
        setProfile(prev => {
            if (nestedField) {
                return {
                    ...prev,
                    [field]: {
                        ...prev[field],
                        [nestedField]: value
                    }
                };
            }
            return {
                ...prev,
                [field]: value
            };
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        // Validate required fields
        const requiredFields = {
            specialization: 'Specialization',
            qualifications: 'Qualifications',
            clinicName: 'Clinic Name',
            experience: 'Years of Experience',
            licenseNumber: 'License Number'
        };

        // Additional validation for education
        const hasIncompleteEducation = profile.education.some(edu =>
            !edu.degree || !edu.institution || !edu.year
        );

        if (hasIncompleteEducation) {
            setError('Please complete all education fields (degree, institution, and year) or remove incomplete entries');
            return;
        }

        const missingFields = Object.entries(requiredFields)
            .filter(([key]) => !profile[key])
            .map(([, label]) => label);

        if (missingFields.length > 0) {
            setError(`Please fill in the following required fields: ${missingFields.join(', ')}`);
            return;
        }

        setIsSaving(true);

        try {
            const response = await updateUserProfile(profile);
            if (response.success) {
                setSuccessMessage('Profile updated successfully');
                setIsEditing(false); // Disable editing after successful save
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setError(response.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError(error.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditToggle = () => {
        if (isEditing) {
            // Cancel editing - you might want to reset changes here
            setIsEditing(false);
            setError('');
            setSuccessMessage('');
        } else {
            // Start editing
            setIsEditing(true);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await fetch('/api/doctor/profile/avatar', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                handleChange('avatar', data.avatarUrl);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            setError('Failed to upload image');
        }
    };

    const TabButton = ({ id, label, active }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`px-6 py-3 ${active
                ? 'bg-gradient-to-r from-[#006D77] to-[#1D3557] text-white shadow-lg'
                : 'text-[#006D77] hover:bg-gray-50'
                } rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5`}
        >
            {label}
        </button>
    );


    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-48 bg-gray-200 rounded"></div>
                        <div className="h-48 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 pt-[120px] sm:pt-24 lg:pt-[120px]">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-[#1D3557] to-[#006D77] bg-clip-text text-transparent"> Doctor Profile </h1>
                    <div className="flex gap-3">
                        {!isEditing ? (
                            <button
                                onClick={handleEditToggle}
                                className="px-8 py-3 bg-gradient-to-r from-[#006D77] to-[#1D3557] text-white rounded-lg hover:from-[#005c66] hover:to-[#162942] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleEditToggle}
                                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 shadow-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSaving}
                                    className="px-8 py-3 bg-gradient-to-r from-[#006D77] to-[#1D3557] text-white rounded-lg hover:from-[#005c66] hover:to-[#162942] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    {isSaving ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Saving...
                                        </span>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {error && (<div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700"> {error} </div>)}

                {successMessage && (<div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700"> {successMessage} </div>)}

                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 backdrop-blur-sm bg-opacity-90">
                    <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
                        <ProfilePictureUpload
                            currentImage={profile.profilePicture?.url || profile.profilePicture}
                            onImageUpdate={(imageUrl) => setProfile(prev => ({
                                ...prev,
                                profilePicture: imageUrl ? { url: imageUrl } : null
                            }))}
                        />
                        <div className="text-center sm:text-left">
                            <h2 className="text-3xl font-bold text-[#1D3557] mb-2">{profile.name || 'Doctor Name'}</h2>
                            <p className="text-lg text-[#457B9D] mb-2">{profile.specialization || 'Specialization'}</p>
                            <p className="text-sm text-gray-500">License: {profile.licenseNumber || 'Not Specified'}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 border-b border-gray-200 mb-8 pb-2">
                        <TabButton id="basic" label="Basic Info" active={activeTab === 'basic'} />
                        <TabButton id="professional" label="Professional Details" active={activeTab === 'professional'} />
                    </div>

                    <form className="space-y-6">
                        {activeTab === 'basic' && (
                            <>
                                <div className="space-y-8">
                                    {/* Basic Personal Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-[#457B9D] mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={profile.name}
                                                onChange={(e) => handleChange('name', e.target.value)}
                                                disabled={!isEditing}
                                                className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] shadow-sm ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50 hover:bg-white'}`}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#457B9D] mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={profile.email}
                                                onChange={(e) => handleChange('email', e.target.value)}
                                                disabled={!isEditing}
                                                className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] shadow-sm ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50 hover:bg-white'}`}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#457B9D] mb-2">
                                                Phone
                                            </label>
                                            <input
                                                type="tel"
                                                value={profile.contactInfo.phone}
                                                onChange={(e) => handleChange('contactInfo', e.target.value, 'phone')}
                                                disabled={!isEditing}
                                                className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] shadow-sm ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50 hover:bg-white'}`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#457B9D] mb-2">
                                                License Number
                                            </label>
                                            <input
                                                type="text"
                                                value={profile.licenseNumber}
                                                onChange={(e) => handleChange('licenseNumber', e.target.value)}
                                                disabled={!isEditing}
                                                className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] shadow-sm ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50 hover:bg-white'}`}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Clinic Location */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#1D3557] mb-4">Practice Location</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-[#457B9D] mb-2">
                                                    Address
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profile.location.address}
                                                    onChange={(e) => handleChange('location', e.target.value, 'address')}
                                                    disabled={!isEditing}
                                                    placeholder="Street address"
                                                    className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] shadow-sm ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50 hover:bg-white'}`}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-[#457B9D] mb-2">
                                                    City
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profile.location.city}
                                                    onChange={(e) => handleChange('location', e.target.value, 'city')}
                                                    disabled={!isEditing}
                                                    placeholder="City"
                                                    className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] shadow-sm ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50 hover:bg-white'}`}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-[#457B9D] mb-2">
                                                    State/Province
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profile.location.state}
                                                    onChange={(e) => handleChange('location', e.target.value, 'state')}
                                                    disabled={!isEditing}
                                                    placeholder="State or Province"
                                                    className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] shadow-sm ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50 hover:bg-white'}`}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-[#457B9D] mb-2">
                                                    Country
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profile.location.country}
                                                    onChange={(e) => handleChange('location', e.target.value, 'country')}
                                                    disabled={!isEditing}
                                                    placeholder="Country"
                                                    className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] shadow-sm ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50 hover:bg-white'}`}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-[#457B9D] mb-2">
                                                    ZIP/Postal Code
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profile.location.zipCode}
                                                    onChange={(e) => handleChange('location', e.target.value, 'zipCode')}
                                                    disabled={!isEditing}
                                                    placeholder="ZIP or Postal Code"
                                                    className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] shadow-sm ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50 hover:bg-white'}`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'professional' && (
                            <>
                                <div className="space-y-8">
                                    {/* Basic Professional Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-[#457B9D] mb-2">
                                                Specialization
                                            </label>
                                            <input
                                                type="text"
                                                value={profile.specialization}
                                                onChange={(e) => handleChange('specialization', e.target.value)}
                                                disabled={!isEditing}
                                                className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] shadow-sm ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50 hover:bg-white'}`}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#457B9D] mb-2">
                                                Clinic Name
                                            </label>
                                            <input
                                                type="text"
                                                value={profile.clinicName}
                                                onChange={(e) => handleChange('clinicName', e.target.value)}
                                                disabled={!isEditing}
                                                className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] shadow-sm ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50 hover:bg-white'}`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#457B9D] mb-2">
                                                Years of Experience
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={profile.experience}
                                                onChange={(e) => handleChange('experience', parseInt(e.target.value) || 0)}
                                                disabled={!isEditing}
                                                className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] shadow-sm ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50 hover:bg-white'}`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#457B9D] mb-2">
                                                Consultation Fee (PKR)
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={profile.consultationFee}
                                                onChange={(e) => handleChange('consultationFee', parseInt(e.target.value) || 0)}
                                                disabled={!isEditing}
                                                placeholder="Enter amount in PKR (500-5000)"
                                                className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] shadow-sm ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50 hover:bg-white'}`}
                                            />
                                        </div>
                                    </div>

                                    {/* About Me */}
                                    <div>
                                        <label className="block text-sm font-medium text-[#457B9D] mb-2">
                                            About Me
                                        </label>
                                        <textarea
                                            value={profile.about}
                                            onChange={(e) => handleChange('about', e.target.value)}
                                            disabled={!isEditing}
                                            rows={4}
                                            className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] shadow-sm resize-none ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50 hover:bg-white'}`}
                                            placeholder="Tell patients about yourself, your approach to medicine, and what makes you unique..."
                                        />
                                    </div>

                                    {/* Services */}
                                    <div>
                                        <label className="block text-sm font-medium text-[#457B9D] mb-2">
                                            Services Offered
                                        </label>
                                        <textarea
                                            value={Array.isArray(profile.services) ? profile.services.join('\n') : ''}
                                            onChange={(e) => handleChange('services', e.target.value.split('\n'))}
                                            disabled={!isEditing}
                                            placeholder="Enter each service on a new line (e.g., General Consultation, Health Checkup, Vaccination)"
                                            rows={3}
                                            className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] shadow-sm resize-none ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50 hover:bg-white'}`}
                                        />
                                    </div>



                                    {/* Qualifications and Education */}
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-[#457B9D] mb-2">
                                                Qualifications <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={profile.qualifications}
                                                onChange={(e) => handleChange('qualifications', e.target.value)}
                                                disabled={!isEditing}
                                                placeholder="Enter your qualifications (e.g., MBBS, MD, MS)"
                                                className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] shadow-sm ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50 hover:bg-white'}`}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[#457B9D] mb-2">
                                                Education History
                                            </label>
                                            <div className="space-y-4">
                                                {profile.education.map((edu, index) => (
                                                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white transition-all duration-300">
                                                        <div>
                                                            <label className="block text-xs font-medium text-[#457B9D] mb-1">Degree</label>
                                                            <input
                                                                type="text"
                                                                value={edu.degree || ''}
                                                                onChange={(e) => {
                                                                    const newEducation = [...profile.education];
                                                                    newEducation[index] = { ...edu, degree: e.target.value };
                                                                    handleChange('education', newEducation);
                                                                }}
                                                                disabled={!isEditing}
                                                                className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                                                                placeholder="e.g., MBBS"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-[#457B9D] mb-1">Institution</label>
                                                            <input
                                                                type="text"
                                                                value={edu.institution || ''}
                                                                onChange={(e) => {
                                                                    const newEducation = [...profile.education];
                                                                    newEducation[index] = { ...edu, institution: e.target.value };
                                                                    handleChange('education', newEducation);
                                                                }}
                                                                disabled={!isEditing}
                                                                className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                                                                placeholder="Medical School/University"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-[#457B9D] mb-1">Year</label>
                                                            <input
                                                                type="number"
                                                                value={edu.year || ''}
                                                                onChange={(e) => {
                                                                    const newEducation = [...profile.education];
                                                                    newEducation[index] = { ...edu, year: parseInt(e.target.value) || null };
                                                                    handleChange('education', newEducation);
                                                                }}
                                                                disabled={!isEditing}
                                                                className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                                                                placeholder="Year of completion"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                                {isEditing && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleChange('education', [...profile.education, { degree: '', institution: '', year: null }])}
                                                        className="w-full px-4 py-2 text-sm text-[#006D77] border border-dashed border-[#006D77] rounded-xl hover:bg-[#006D77] hover:text-white transition-all duration-300"
                                                    >
                                                        + Add Education
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Certifications */}
                                        <div>
                                            <label className="block text-sm font-medium text-[#457B9D] mb-2">
                                                Certifications
                                            </label>
                                            <div className="space-y-4">
                                                {(profile.certifications || []).map((cert, index) => (
                                                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white transition-all duration-300">
                                                        <div>
                                                            <label className="block text-xs font-medium text-[#457B9D] mb-1">Certification Name</label>
                                                            <input
                                                                type="text"
                                                                value={cert.name}
                                                                onChange={(e) => {
                                                                    const newCertifications = [...profile.certifications];
                                                                    newCertifications[index] = { ...cert, name: e.target.value };
                                                                    handleChange('certifications', newCertifications);
                                                                }}
                                                                disabled={!isEditing}
                                                                className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                                                                placeholder="e.g., Advanced Cardiac Life Support (ACLS)"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-[#457B9D] mb-1">Issuing Organization</label>
                                                            <input
                                                                type="text"
                                                                value={cert.issuingOrganization}
                                                                onChange={(e) => {
                                                                    const newCertifications = [...profile.certifications];
                                                                    newCertifications[index] = { ...cert, issuingOrganization: e.target.value };
                                                                    handleChange('certifications', newCertifications);
                                                                }}
                                                                disabled={!isEditing}
                                                                className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                                                                placeholder="Certifying Organization"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-xs font-medium text-[#457B9D] mb-1">Issue Date</label>
                                                            <input
                                                                type="date"
                                                                value={cert.issueDate ? new Date(cert.issueDate).toISOString().split('T')[0] : ''}
                                                                onChange={(e) => {
                                                                    const newCertifications = [...profile.certifications];
                                                                    newCertifications[index] = { ...cert, issueDate: e.target.value };
                                                                    handleChange('certifications', newCertifications);
                                                                }}
                                                                disabled={!isEditing}
                                                                className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                                                            />
                                                        </div>
                                                        {isEditing && (
                                                            <div className="md:col-span-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const newCertifications = profile.certifications.filter((_, i) => i !== index);
                                                                        handleChange('certifications', newCertifications);
                                                                    }}
                                                                    className="text-red-500 hover:text-red-700 text-sm"
                                                                >
                                                                    Remove Certification
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                {isEditing && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleChange('certifications', [...(profile.certifications || []), {
                                                            name: '',
                                                            issuingOrganization: '',
                                                            issueDate: null,
                                                            expiryDate: null
                                                        }])}
                                                        className="w-full px-4 py-2 text-sm text-[#006D77] border border-dashed border-[#006D77] rounded-xl hover:bg-[#006D77] hover:text-white transition-all duration-300"
                                                    >
                                                        + Add Certification
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Availability */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#1D3557] mb-4">Availability & Time Slots</h3>
                                        <div className="space-y-6">
                                            {(() => {
                                                // Ensure we have availability data, create default if not
                                                const availabilityData = profile.availability || {
                                                    monday: { isAvailable: false, slots: [] },
                                                    tuesday: { isAvailable: false, slots: [] },
                                                    wednesday: { isAvailable: false, slots: [] },
                                                    thursday: { isAvailable: false, slots: [] },
                                                    friday: { isAvailable: false, slots: [] },
                                                    saturday: { isAvailable: false, slots: [] },
                                                    sunday: { isAvailable: false, slots: [] }
                                                };

                                                // Handle both Map and Object types from backend
                                                let daysEntries;
                                                if (availabilityData instanceof Map) {
                                                    daysEntries = Array.from(availabilityData.entries());
                                                } else if (typeof availabilityData === 'object') {
                                                    daysEntries = Object.entries(availabilityData);
                                                } else {
                                                    // Fallback to default days
                                                    daysEntries = Object.entries({
                                                        monday: { isAvailable: false, slots: [] },
                                                        tuesday: { isAvailable: false, slots: [] },
                                                        wednesday: { isAvailable: false, slots: [] },
                                                        thursday: { isAvailable: false, slots: [] },
                                                        friday: { isAvailable: false, slots: [] },
                                                        saturday: { isAvailable: false, slots: [] },
                                                        sunday: { isAvailable: false, slots: [] }
                                                    });
                                                }

                                                return daysEntries.map(([day, dayData]) => {
                                                    const isAvailable = dayData?.isAvailable || false;
                                                    const slots = dayData?.slots || [];

                                                    return (
                                                        <div key={day} className={`border rounded-xl p-4 transition-all duration-300 ${!isEditing ? 'bg-gray-50' : 'bg-white border-gray-200 hover:border-[#006D77]'}`}>
                                                            {/* Day Header */}
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div className="flex items-center space-x-3">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isAvailable}
                                                                        onChange={(e) => {
                                                                            const currentAvailability = profile.availability || {};
                                                                            const updatedAvailability = {
                                                                                ...currentAvailability,
                                                                                [day]: {
                                                                                    ...currentAvailability[day],
                                                                                    isAvailable: e.target.checked,
                                                                                    slots: e.target.checked ? (currentAvailability[day]?.slots || []) : []
                                                                                }
                                                                            };
                                                                            handleChange('availability', updatedAvailability);
                                                                        }}
                                                                        disabled={!isEditing}
                                                                        className={`w-5 h-5 text-[#006D77] border-gray-300 rounded focus:ring-2 focus:ring-[#006D77] ${!isEditing ? 'cursor-not-allowed' : ''}`}
                                                                    />
                                                                    <span className="text-lg font-medium capitalize text-[#1D3557]">{day}</span>
                                                                </div>
                                                                {isAvailable && isEditing && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const currentAvailability = profile.availability || {};
                                                                            const currentSlots = currentAvailability[day]?.slots || [];
                                                                            const newSlot = { startTime: '09:00', endTime: '10:00' };
                                                                            const updatedAvailability = {
                                                                                ...currentAvailability,
                                                                                [day]: {
                                                                                    ...currentAvailability[day],
                                                                                    isAvailable: true,
                                                                                    slots: [...currentSlots, newSlot]
                                                                                }
                                                                            };
                                                                            handleChange('availability', updatedAvailability);
                                                                        }}
                                                                        className="px-3 py-1 text-xs bg-[#006D77] text-white rounded-lg hover:bg-[#005A63] transition-colors duration-200"
                                                                    >
                                                                        + Add Slot
                                                                    </button>
                                                                )}
                                                            </div>

                                                            {/* Time Slots */}
                                                            {isAvailable && (
                                                                <div className="space-y-2">
                                                                    {slots.length === 0 ? (
                                                                        <p className="text-sm text-gray-500 italic">No time slots configured</p>
                                                                    ) : (
                                                                        slots.map((slot, slotIndex) => (
                                                                            <div key={slotIndex} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                                                <div className="flex items-center space-x-2 flex-1">
                                                                                    <input
                                                                                        type="time"
                                                                                        value={slot.startTime || '09:00'}
                                                                                        onChange={(e) => {
                                                                                            const currentAvailability = profile.availability || {};
                                                                                            const currentSlots = [...(currentAvailability[day]?.slots || [])];
                                                                                            currentSlots[slotIndex] = {
                                                                                                ...currentSlots[slotIndex],
                                                                                                startTime: e.target.value
                                                                                            };
                                                                                            const updatedAvailability = {
                                                                                                ...currentAvailability,
                                                                                                [day]: {
                                                                                                    ...currentAvailability[day],
                                                                                                    slots: currentSlots
                                                                                                }
                                                                                            };
                                                                                            handleChange('availability', updatedAvailability);
                                                                                        }}
                                                                                        disabled={!isEditing}
                                                                                        className={`px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                                                                                    />
                                                                                    <span className="text-gray-500">to</span>
                                                                                    <input
                                                                                        type="time"
                                                                                        value={slot.endTime || '10:00'}
                                                                                        onChange={(e) => {
                                                                                            const currentAvailability = profile.availability || {};
                                                                                            const currentSlots = [...(currentAvailability[day]?.slots || [])];
                                                                                            currentSlots[slotIndex] = {
                                                                                                ...currentSlots[slotIndex],
                                                                                                endTime: e.target.value
                                                                                            };
                                                                                            const updatedAvailability = {
                                                                                                ...currentAvailability,
                                                                                                [day]: {
                                                                                                    ...currentAvailability[day],
                                                                                                    slots: currentSlots
                                                                                                }
                                                                                            };
                                                                                            handleChange('availability', updatedAvailability);
                                                                                        }}
                                                                                        disabled={!isEditing}
                                                                                        className={`px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                                                                                    />
                                                                                </div>
                                                                                {isEditing && (
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => {
                                                                                            const currentAvailability = profile.availability || {};
                                                                                            const currentSlots = [...(currentAvailability[day]?.slots || [])];
                                                                                            currentSlots.splice(slotIndex, 1);
                                                                                            const updatedAvailability = {
                                                                                                ...currentAvailability,
                                                                                                [day]: {
                                                                                                    ...currentAvailability[day],
                                                                                                    slots: currentSlots
                                                                                                }
                                                                                            };
                                                                                            handleChange('availability', updatedAvailability);
                                                                                        }}
                                                                                        className="text-red-500 hover:text-red-700 p-1"
                                                                                        title="Remove slot"
                                                                                    >
                                                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                                        </svg>
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        ))
                                                                    )}
                                                                </div>
                                                            )}

                                                            {/* Status indicator and preview */}
                                                            <div className="mt-3 pt-3 border-t border-gray-200">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center space-x-2">
                                                                        <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                                                        <span className="text-xs text-gray-600">
                                                                            {isAvailable
                                                                                ? `${slots.length} slot${slots.length !== 1 ? 's' : ''} configured`
                                                                                : 'Not available'
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    {isAvailable && slots.length > 0 && (
                                                                        <div className="text-xs text-[#006D77]">
                                                                            {(() => {
                                                                                // Calculate total 30-minute appointment slots
                                                                                let totalSlots = 0;
                                                                                slots.forEach(slot => {
                                                                                    const [startHour, startMinute] = slot.startTime.split(':').map(Number);
                                                                                    const [endHour, endMinute] = slot.endTime.split(':').map(Number);
                                                                                    const startMinutes = startHour * 60 + startMinute;
                                                                                    const endMinutes = endHour * 60 + endMinute;
                                                                                    const duration = endMinutes - startMinutes;
                                                                                    totalSlots += Math.floor(duration / 30);
                                                                                });
                                                                                return `~${totalSlots} appointment slots`;
                                                                            })()}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                });
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
