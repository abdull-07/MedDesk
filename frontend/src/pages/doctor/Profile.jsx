import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
    const { getUserProfile, updateUserProfile } = useAuth();

    const [profile, setProfile] = useState({
        name: '',
        email: '',
        specialization: '', // required
        qualifications: '', // required, string
        clinicName: '', // required
        experience: 0, // required
        consultationFee: 0,
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
            expiryDate: null,
            certificationNumber: ''
        }],
        awards: []
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [activeTab, setActiveTab] = useState('basic');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const response = await getUserProfile();
                if (response.success) {
                    setProfile(response.data);
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

    const FormSection = ({ title, children }) => (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#1D3557] to-[#006D77] bg-clip-text text-transparent mb-6">{title}</h2>
            {children}
        </div>
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
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-[#1D3557] to-[#006D77] bg-clip-text text-transparent"> Doctor Profile </h1>
                    <button onClick={handleSubmit} disabled={isSaving} className={`px-8 py-3 bg-gradient-to-r from-[#006D77] to-[#1D3557] text-white rounded-lg hover:from-[#005c66] hover:to-[#162942] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}>
                        {isSaving ? (<span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Saving... </span>) : ('Save Changes')}
                    </button>
                </div>

                {error && (<div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700"> {error} </div>)}

                {successMessage && (<div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700"> {successMessage} </div>)}

                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 backdrop-blur-sm bg-opacity-90">
                    <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-2xl overflow-hidden shadow-xl">
                                <img src={profile.avatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIGZpbGw9IiMwMDZENzciLz48cGF0aCBkPSJNNjQgODBDNzcuMjU0OCA4MCA4OCA2OS4yNTQ4IDg4IDU2Qzg4IDQyLjc0NTIgNzcuMjU0OCAzMiA2NCAzMkM1MC43NDUyIDMyIDQwIDQyLjc0NTIgNDAgNTZDNDAgNjkuMjU0OCA1MC43NDUyIDgwIDY0IDgwWiIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNMTAzLjk5NiAxMTJDMTAzLjk5NiA5My4yMzEgODYuMzIxNiA3OCA2NC40OTc5IDc4QzQyLjY3NDIgNzggMjUgOTMuMjMxIDI1IDExMkgxMDMuOTk2WiIgZmlsbD0id2hpdGUiLz48L3N2Zz4='} alt={profile.name} className="w-40 h-40 object-cover transition-transform duration-300 group-hover:scale-110" />
                            </div>
                            <label className="absolute bottom-2 right-2 bg-gradient-to-r from-[#006D77] to-[#1D3557] text-white p-3 rounded-xl cursor-pointer hover:from-[#005c66] hover:to-[#162942] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"> <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /> </svg>
                            </label>
                        </div>
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
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] bg-gray-50 hover:bg-white shadow-sm"
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
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] bg-gray-50 hover:bg-white shadow-sm"
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
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] bg-gray-50 hover:bg-white shadow-sm"
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
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] bg-gray-50 hover:bg-white shadow-sm"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Practice Location */}
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
                                                    placeholder="Street address"
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] bg-gray-50 hover:bg-white shadow-sm"
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
                                                    placeholder="City"
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] bg-gray-50 hover:bg-white shadow-sm"
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
                                                    placeholder="State or Province"
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] bg-gray-50 hover:bg-white shadow-sm"
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
                                                    placeholder="Country"
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] bg-gray-50 hover:bg-white shadow-sm"
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
                                                    placeholder="ZIP or Postal Code"
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] bg-gray-50 hover:bg-white shadow-sm"
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
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] bg-gray-50 hover:bg-white shadow-sm"
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
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] bg-gray-50 hover:bg-white shadow-sm"
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
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] bg-gray-50 hover:bg-white shadow-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#457B9D] mb-2">
                                                Consultation Fee ($)
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={profile.consultationFee}
                                                onChange={(e) => handleChange('consultationFee', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] bg-gray-50 hover:bg-white shadow-sm"
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
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] bg-gray-50 hover:bg-white shadow-sm resize-none"
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
                                            placeholder="Enter each service on a new line (e.g., General Consultation, Health Checkup, Vaccination)"
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] bg-gray-50 hover:bg-white shadow-sm"
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
                                                placeholder="Enter your qualifications (e.g., MBBS, MD, MS)"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none transition-all duration-300 hover:border-[#006D77] bg-gray-50 hover:bg-white shadow-sm"
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
                                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none"
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
                                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none"
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
                                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none"
                                                                placeholder="Year of completion"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => handleChange('education', [...profile.education, { degree: '', institution: '', year: null }])}
                                                    className="w-full px-4 py-2 text-sm text-[#006D77] border border-dashed border-[#006D77] rounded-xl hover:bg-[#006D77] hover:text-white transition-all duration-300"
                                                >
                                                    + Add Education
                                                </button>
                                            </div>
                                        </div>

                                        {/* Certifications */}
                                        <div>
                                            {console.log('Current profile:', profile)}
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
                                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none"
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
                                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none"
                                                                placeholder="Certifying Organization"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-[#457B9D] mb-1">Certification Number</label>
                                                            <input
                                                                type="text"
                                                                value={cert.certificationNumber}
                                                                onChange={(e) => {
                                                                    const newCertifications = [...profile.certifications];
                                                                    newCertifications[index] = { ...cert, certificationNumber: e.target.value };
                                                                    handleChange('certifications', newCertifications);
                                                                }}
                                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none"
                                                                placeholder="Certification ID/Number"
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
                                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none"
                                                            />
                                                        </div>
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
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => handleChange('certifications', [...(profile.certifications || []), {
                                                        name: '',
                                                        issuingOrganization: '',
                                                        issueDate: null,
                                                        expiryDate: null,
                                                        certificationNumber: ''
                                                    }])}
                                                    className="w-full px-4 py-2 text-sm text-[#006D77] border border-dashed border-[#006D77] rounded-xl hover:bg-[#006D77] hover:text-white transition-all duration-300"
                                                >
                                                    + Add Certification
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Availability */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#1D3557] mb-4">Availability</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {Object.entries(profile.availability).map(([day, { isAvailable }]) => (
                                                <div key={day} className="flex items-center space-x-3 p-3 border rounded-lg bg-gray-50 hover:bg-white transition-all duration-300">
                                                    <input
                                                        type="checkbox"
                                                        checked={isAvailable}
                                                        onChange={(e) =>
                                                            handleChange('availability', {
                                                                ...profile.availability[day],
                                                                isAvailable: e.target.checked
                                                            }, day)
                                                        }
                                                        className="w-4 h-4 text-[#006D77] border-gray-300 rounded focus:ring-2 focus:ring-[#006D77]"
                                                    />
                                                    <span className="text-sm font-medium capitalize text-[#457B9D]">{day}</span>
                                                </div>
                                            ))}
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
